"""
tiktok_sync.py -- sincronización TikTok Shop <-> ERP, con interruptores APAGADOS por defecto:

  · Existencias (ERP -> TikTok): compara las existencias de cada SKU activo con las del ERP y manda solo las que cambian
    (POST /product/202309/products/{id}/inventory/update). Se puede ver el plan, aplicar a un producto de prueba y, ya con confianza, dejarlo automático.
  · Ventas (TikTok -> ERP): cada pedido NUEVO de TikTok crea un pedido en el ERP (canal "tiktok"), descuenta el inventario y avisa por push;
    después lo pone al día (enviado / entregado / cancelado, regresando el inventario si se cancela antes de enviarse).
    Solo se importan pedidos creados DESPUÉS de activar el interruptor: los anteriores ya se manejaron a mano y volver a descontarlos duplicaría la baja.

Los interruptores viven en la tabla `configuracion` (claves tiktok_existencias_auto y tiktok_ventas_desde).
"""
import threading
import time
import datetime as _dt

from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, inventario_ajustar

CLAVE_EXISTENCIAS = "tiktok_existencias_auto"
CLAVE_VENTAS = "tiktok_ventas_desde"
_LOCK_EXISTENCIAS = threading.Lock()
_LOCK_VENTAS = threading.Lock()
# Si el plan quiere cambiar más de esta proporción de los SKUs revisados, algo raro pasa (inventario vacío, error de cruce...): no se aplica solo.
_TOPE_CAMBIOS_AUTO = 0.6


# ── interruptores ──────────────────────────────────────────────────────────────────────────────────────────────────────────
def cfg_get(clave):
    try:
        filas = supabase_get(f"configuracion?clave=eq.{clave}&select=valor") or []
        return filas[0]["valor"] if filas else None
    except Exception:
        return None


def cfg_set(clave, valor):
    existe = supabase_get(f"configuracion?clave=eq.{clave}&select=clave") or []
    if valor is None:
        if existe:
            from database import supabase_delete
            supabase_delete(f"configuracion?clave=eq.{clave}")
        return
    if existe:
        supabase_patch(f"configuracion?clave=eq.{clave}", {"valor": str(valor)})
    else:
        supabase_post("configuracion", {"clave": clave, "valor": str(valor)})


def estado_automatico():
    desde = cfg_get(CLAVE_VENTAS)
    return {"existencias": cfg_get(CLAVE_EXISTENCIAS) == "1", "ventas_desde": int(desde) if (desde or "").isdigit() else None}


# ── existencias: ERP -> TikTok ─────────────────────────────────────────────────────────────────────────────────────────────
def plan_existencias(productos_tt, cargado, solo_producto=None):
    """Cambios necesarios para que TikTok muestre lo mismo que el ERP. Solo productos ACTIVOS; los SKUs sin SKU de vendedor, sin match en el ERP
    o con más de una bodega NO se tocan."""
    from routers.tiktok_excel import _buscar_qty
    _p, _v, _inv, inv_por_sku = cargado
    cambios = []
    r = {"revisados": 0, "iguales": 0, "sin_sku": 0, "sin_match": 0, "varias_bodegas": 0}
    for prod in productos_tt:
        if prod.get("status") != "ACTIVATE":
            continue
        if solo_producto and str(prod.get("id")) != str(solo_producto):
            continue
        for s in prod.get("skus") or []:
            sv = (s.get("seller_sku") or "").strip()
            inv = s.get("inventory") or []
            if not sv:
                r["sin_sku"] += 1
                continue
            if len(inv) != 1:
                r["varias_bodegas"] += 1
                continue
            qerp = _buscar_qty(sv, inv_por_sku)
            if qerp is None:
                r["sin_match"] += 1
                continue
            q = max(0, min(int(qerp), 999999))
            actual = int(inv[0].get("quantity") or 0)
            r["revisados"] += 1
            if q == actual:
                r["iguales"] += 1
                continue
            cambios.append({"producto_id": prod.get("id"), "titulo": (prod.get("title") or "")[:48], "sku_id": s.get("id"), "sku": sv,
                            "warehouse_id": inv[0].get("warehouse_id"), "de": actual, "a": q})
    return cambios, r


def aplicar_cambios(cambios, access, cipher, pausa=0.25):
    """Manda los cambios a TikTok, un producto por llamada (hasta 100 SKUs). Devuelve {ok, error, errores}."""
    from routers.tiktok import _tiktok_api
    por_producto = {}
    for c in cambios:
        por_producto.setdefault(c["producto_id"], []).append(c)
    ok = err = 0
    errores = []
    for pid, lista in por_producto.items():
        for i in range(0, len(lista), 100):
            trozo = lista[i:i + 100]
            body = {"skus": [{"id": c["sku_id"], "inventory": [{"warehouse_id": c["warehouse_id"], "quantity": c["a"]}]} for c in trozo]}
            r = _tiktok_api("POST", f"/product/202309/products/{pid}/inventory/update", access, body=body, extra_params={"shop_cipher": cipher})
            if r.get("code") == 0:
                fallidos = {((e.get("detail") or {}).get("sku_id")) for e in ((r.get("data") or {}).get("errors") or [])}
                err += len(fallidos)
                ok += len(trozo) - len(fallidos)
                if fallidos:
                    errores.append({"producto": pid, "detalle": ((r.get("data") or {}).get("errors") or [])[:2]})
            else:
                err += len(trozo)
                errores.append({"producto": pid, "codigo": r.get("code"), "mensaje": r.get("message")})
            time.sleep(pausa)
    try:
        from cache import cache_set
        cache_set("tiktok_catalogo", None, ttl=1)   # la lista guardada ya no refleja las existencias nuevas
    except Exception:
        pass
    return {"ok": ok, "error": err, "errores": errores[:8]}


def sync_existencias_auto():
    """Lo que corre cada 30 min si el interruptor está encendido. Nunca lanza error: solo informa."""
    if not _LOCK_EXISTENCIAS.acquire(blocking=False):
        return {"omitida": "ya hay una sincronización en curso"}
    try:
        if cfg_get(CLAVE_EXISTENCIAS) != "1":
            return {"activo": False}
        from routers.tiktok import _contexto_tienda, _catalogo_tiktok
        from routers.tiktok_excel import _cargar_erp
        ctx, err = _contexto_tienda()
        if err:
            return {"error": "sin conexion con TikTok"}
        access, tienda = ctx
        productos, e = _catalogo_tiktok(access, tienda.get("cipher", ""), forzar=True)
        if productos is None:
            return {"error": f"TikTok rechazo la lista de productos: {e}"}
        cambios, r = plan_existencias(productos, _cargar_erp())
        if r["revisados"] and len(cambios) > _TOPE_CAMBIOS_AUTO * r["revisados"]:
            msg = f"Se detuvo: el plan cambiaria {len(cambios)} de {r['revisados']} SKUs (mas del {int(_TOPE_CAMBIOS_AUTO * 100)}%). Revisa en el panel."
            print(f"[tiktok-existencias] {msg}")
            return {"detenida": msg, **r}
        res = aplicar_cambios(cambios, access, tienda.get("cipher", ""))
        print(f"[tiktok-existencias] cambios: {len(cambios)} · ok: {res['ok']} · error: {res['error']}")
        return {**r, "cambios": len(cambios), **res}
    except Exception as ex:
        print(f"[tiktok-existencias] error: {ex}")
        return {"error": str(ex)[:200]}
    finally:
        _LOCK_EXISTENCIAS.release()



# ── utilidad de TikTok -> «Tu utilidad» (tabla ventas_externas, sin mover inventario) ──────────────────────────────────────
_ESTADO_EXTERNO = {"AWAITING_SHIPMENT": "Para enviar", "PARTIALLY_SHIPPING": "Para enviar", "AWAITING_COLLECTION": "Para enviar",
                   "IN_TRANSIT": "Enviado", "DELIVERED": "Completado", "COMPLETED": "Completado"}
_LOCK_UTILIDAD = threading.Lock()


def sync_utilidad_tiktok(dias_extra=3):
    """Trae de TikTok los pedidos NUEVOS desde el ultimo registro de ventas_externas (menos `dias_extra` dias para refrescar estados) y los
    guarda ahi: asi suman a la utilidad general y a «Tu utilidad» (precio vendido - precio de corrida) SIN contar como venta ni mover inventario.
    Los pedidos cancelados no suman (si ya estaban guardados, se quitan). No guarda pedidos que el sistema ya registro como pedido (canal tiktok)."""
    if not _LOCK_UTILIDAD.acquire(blocking=False):
        return {"omitida": "ya hay una actualizacion en curso"}
    res = {"pedidos_nuevos": 0, "filas_nuevas": 0, "estados_actualizados": 0, "quitados_por_cancelacion": 0, "sin_costo": 0,
           "pares": 0, "tu_utilidad_agregada": 0.0, "desde": None, "errores": []}
    try:
        from routers.tiktok import _contexto_tienda, _tiktok_api
        ctx, err = _contexto_tienda()
        if err:
            res["errores"].append("sin conexion con TikTok")
            return res
        access, tienda = ctx
        ult = supabase_get("ventas_externas?origen=eq.tiktok&select=fecha_venta&order=fecha_venta.desc&limit=1") or []
        if ult:
            try:
                ult_ts = int(_dt.datetime.fromisoformat(str(ult[0]["fecha_venta"]).replace("Z", "+00:00")).timestamp())
            except Exception:
                ult_ts = int(time.time()) - 30 * 86400
        else:
            ult_ts = int(time.time()) - 30 * 86400
        ini = ult_ts - dias_extra * 86400
        res["desde"] = ini
        ordenes, token_pag, paginas = [], "", 0
        while True:
            extra = {"page_size": "100", "shop_cipher": tienda.get("cipher", ""), "sort_field": "create_time", "sort_order": "ASC"}
            if token_pag:
                extra["page_token"] = token_pag
            o = _tiktok_api("POST", "/order/202309/orders/search", access,
                            body={"create_time_ge": ini, "create_time_lt": int(time.time()) + 60}, extra_params=extra)
            if o.get("code") != 0:
                res["errores"].append(f"TikTok rechazo la busqueda de pedidos: {o.get('message')}")
                return res
            d = o.get("data") or {}
            ordenes.extend(d.get("orders") or [])
            paginas += 1
            token_pag = d.get("next_page_token") or ""
            if not token_pag or paginas >= 20:
                break
        ids = [str(x.get("id")) for x in ordenes if x.get("id")]
        guardadas = {}
        for k in range(0, len(ids), 100):
            lote = ",".join(ids[k:k + 100])
            for f in supabase_get(f"ventas_externas?origen=eq.tiktok&pedido_externo=in.({lote})&select=id,pedido_externo,sku_vendedor,estado_externo") or []:
                guardadas[(f["pedido_externo"], f["sku_vendedor"])] = f
        como_pedido = set()
        for k in range(0, len(ids), 100):
            lote = ",".join(ids[k:k + 100])
            for f in supabase_get(f"pedidos?tiktok_order_id=in.({lote})&select=tiktok_order_id") or []:
                como_pedido.add(str(f["tiktok_order_id"]))
        from routers.tiktok_excel import _cargar_erp, _spu_de, _ALIAS_ID
        from routers.finanzas import _costo_unitario
        _p, _v, _i, inv_por_sku = _cargar_erp()
        cache_prod = {}

        def producto_de(sv):
            spu, _r = _spu_de(sv, inv_por_sku)
            if spu is None:
                return None
            clave = _ALIAS_ID.get(spu, spu)
            if clave not in cache_prod:
                import urllib.parse as _up
                filas = supabase_get(f"productos?sku_interno=eq.{_up.quote(clave, safe='')}&select=id,nombre,costo,precio_corrida,precio_menudeo&limit=1") or []
                cache_prod[clave] = filas[0] if filas else None
            return cache_prod[clave]

        for orden in ordenes:
            oid = str(orden.get("id") or "")
            if not oid or oid in como_pedido:
                continue
            estado_tt = orden.get("status")
            if estado_tt in ("CANCELLED", "UNPAID", "ON_HOLD"):
                for (po, sv), fila in list(guardadas.items()):
                    if po == oid:
                        from database import supabase_delete
                        supabase_delete(f"ventas_externas?id=eq.{fila['id']}")
                        res["quitados_por_cancelacion"] += 1
                continue
            estado_ext = _ESTADO_EXTERNO.get(estado_tt, "Para enviar")
            por_sku = {}
            for li in orden.get("line_items") or []:
                if (li.get("display_status") or "") == "CANCELLED":
                    continue
                sv = (li.get("seller_sku") or "").strip() or f"SIN-SKU-{li.get('sku_id')}"
                g = por_sku.setdefault(sv, {"n": 0, "li": li})
                g["n"] += 1
            nuevo_pedido = False
            for sv, g in por_sku.items():
                clave = (oid, sv)
                if clave in guardadas:
                    if guardadas[clave].get("estado_externo") != estado_ext:
                        supabase_patch(f"ventas_externas?id=eq.{guardadas[clave]['id']}", {"estado_externo": estado_ext})
                        res["estados_actualizados"] += 1
                    continue
                li, n = g["li"], g["n"]
                try:
                    venta = float(li.get("sale_price") or 0)
                except (TypeError, ValueError):
                    venta = 0.0
                prod = producto_de(sv) if not sv.startswith("SIN-SKU") else None
                real = corrida = None
                if prod:
                    real = _costo_unitario(prod, "real") or None
                    corrida = _costo_unitario(prod, "corrida")
                else:
                    res["sin_costo"] += 1
                fila = {"origen": "tiktok", "pedido_externo": oid, "sku_vendedor": sv, "producto_id": prod["id"] if prod else None,
                        "nombre": (li.get("product_name") or "")[:200], "cantidad": n, "venta_unit": venta, "costo_real_unit": real,
                        "costo_corrida_unit": corrida, "fecha_venta": _iso(orden.get("create_time")) + "+00:00", "estado_externo": estado_ext}
                try:
                    supabase_post("ventas_externas", fila)
                    res["filas_nuevas"] += 1
                    res["pares"] += n
                    if corrida is not None:
                        res["tu_utilidad_agregada"] += (venta - corrida) * n
                    nuevo_pedido = True
                except Exception as e:
                    res["errores"].append(f"{oid}/{sv}: {str(e)[:120]}")
            if nuevo_pedido:
                res["pedidos_nuevos"] += 1
        res["tu_utilidad_agregada"] = round(res["tu_utilidad_agregada"], 2)
        return res
    except Exception as ex:
        res["errores"].append(str(ex)[:200])
        return res
    finally:
        _LOCK_UTILIDAD.release()


# ── ventas: TikTok -> ERP ──────────────────────────────────────────────────────────────────────────────────────────────────
# Estado del pedido de TikTok -> estado del pedido en el ERP. UNPAID / ON_HOLD / CANCELLED no se crean (no hay venta firme).
_ESTADO_ERP = {"AWAITING_SHIPMENT": "pagado", "PARTIALLY_SHIPPING": "pagado", "AWAITING_COLLECTION": "pagado",
               "IN_TRANSIT": "enviado", "DELIVERED": "entregado", "COMPLETED": "entregado"}


def _variante_de_sku(sv, cargado):
    """Variante del ERP (dict con id, color, talla) para un SKU de vendedor de TikTok, o None si no se puede ligar sin dudas."""
    from routers.tiktok_excel import _spu_de, _ALIAS_ID, _clave_color, _clave_talla
    productos, vars_por_prod, _inv, inv_por_sku = cargado
    spu, resto = _spu_de(sv, inv_por_sku)
    if spu is None or not resto:
        return None
    clave = _ALIAS_ID.get(spu, spu)
    prod = next((p for p in productos if (p.get("sku_interno") or str(p["id"])) == clave), None)
    if not prod:
        return None
    talla = _clave_talla(resto[-1])
    color = _clave_color("".join(resto[:-1]))
    cand = [v for v in vars_por_prod.get(prod["id"], []) if _clave_talla(v.get("talla")) == talla]
    exactas = [v for v in cand if _clave_color(v.get("color")) == color]
    if len(exactas) == 1:
        return exactas[0]
    parecidas = [v for v in cand if color and (_clave_color(v.get("color")).startswith(color) or color.startswith(_clave_color(v.get("color"))))]
    return parecidas[0] if len(parecidas) == 1 else None


def _descontar(variante_id, cantidad, order_id):
    filas = supabase_get_all(f"inventario?variante_id=eq.{variante_id}&select=sucursal_id,cantidad&order=cantidad.desc")
    if not filas:
        return False
    inventario_ajustar(variante_id, filas[0]["sucursal_id"], -cantidad)
    supabase_post("movimientos_inventario", {
        "variante_id": variante_id, "sucursal_id": filas[0]["sucursal_id"], "tipo": "salida",
        "cantidad": -cantidad, "motivo": f"Venta TikTok (orden {order_id})",
    })
    return True


def _hist(pedido_id, accion, detalle=None):
    try:
        supabase_post("pedido_historial", {"pedido_id": pedido_id, "accion": accion[:60], "detalle": detalle, "usuario": "TikTok Shop"})
    except Exception as e:
        print(f"[tiktok-ventas] no se pudo guardar el historial: {e}")


def _iso(ts):
    try:
        return _dt.datetime.utcfromtimestamp(int(ts)).isoformat()
    except Exception:
        return None


def _poner_al_dia(pedido, orden, resultado):
    """Pedido ya registrado en el ERP: sigue lo que diga TikTok (enviado / entregado / cancelado)."""
    estado_tt = orden.get("status")
    estado = pedido.get("status")
    oid = str(orden.get("id"))
    if estado_tt == "CANCELLED":
        if estado in ("pagado", "confirmado"):
            from routers.mercadolibre import _cancelar_pedido_ml
            _cancelar_pedido_ml(pedido, oid, origen="TikTok")
            resultado["cancelados"] += 1
        return
    if estado_tt in ("DELIVERED", "COMPLETED") and estado in ("pagado", "confirmado", "enviado"):
        supabase_patch(f"pedidos?id=eq.{pedido['id']}", {"status": "entregado"})
        _hist(pedido["id"], "entregado", "TikTok confirmó la entrega al comprador")
        resultado["entregados"] += 1
    elif estado_tt == "IN_TRANSIT" and estado in ("pagado", "confirmado"):
        datos = {"status": "enviado", "enviado_at": _dt.datetime.now(_dt.timezone.utc).isoformat()}
        if orden.get("shipping_provider"):
            datos["paqueteria"] = str(orden["shipping_provider"])
        if orden.get("tracking_number"):
            datos["numero_guia"] = str(orden["tracking_number"])
        supabase_patch(f"pedidos?id=eq.{pedido['id']}", datos)
        _hist(pedido["id"], "enviado", "TikTok reporta el pedido en camino")
        resultado["enviados"] += 1


def hacer_sync_ventas_tiktok(forzar_sin_interruptor=False):
    """Registra los pedidos nuevos de TikTok y pone al día los existentes. Solo corre con el interruptor de ventas encendido."""
    if not _LOCK_VENTAS.acquire(blocking=False):
        return {"omitida": "ya hay una sincronizacion en curso"}
    resultado = {"revisadas": 0, "procesadas": 0, "enviados": 0, "entregados": 0, "cancelados": 0, "sin_match": [], "errores": []}
    try:
        desde = cfg_get(CLAVE_VENTAS)
        if not (desde or "").isdigit():
            # Sin registrar pedidos: igual se mantiene al dia la UTILIDAD de TikTok (ventas_externas) para «Tu utilidad»
            return {"activo": False, "utilidad": sync_utilidad_tiktok()}
        desde = int(desde)
        from routers.tiktok import _contexto_tienda, _tiktok_api
        ctx, err = _contexto_tienda()
        if err:
            resultado["errores"].append({"error_general": "sin conexion con TikTok"})
            return resultado
        access, tienda = ctx
        ahora = int(time.time())
        ordenes, token_pag, paginas = [], "", 0
        while True:
            extra = {"page_size": "100", "shop_cipher": tienda.get("cipher", ""), "sort_field": "create_time", "sort_order": "DESC"}
            if token_pag:
                extra["page_token"] = token_pag
            o = _tiktok_api("POST", "/order/202309/orders/search", access,
                            body={"create_time_ge": ahora - 30 * 86400, "create_time_lt": ahora + 60}, extra_params=extra)
            if o.get("code") != 0:
                resultado["errores"].append({"error_general": f"TikTok rechazo la busqueda de pedidos: {o.get('message')}"})
                return resultado
            d = o.get("data") or {}
            ordenes.extend(d.get("orders") or [])
            paginas += 1
            token_pag = d.get("next_page_token") or ""
            if not token_pag or paginas >= 5:
                break

        existentes = {}
        for p in supabase_get_all("pedidos?canal=eq.tiktok&select=id,tiktok_order_id,status") or []:
            if p.get("tiktok_order_id"):
                existentes[str(p["tiktok_order_id"])] = p
        cargado = None

        for orden in ordenes:
            resultado["revisadas"] += 1
            oid = str(orden.get("id") or "")
            if not oid:
                continue
            if oid in existentes:
                try:
                    _poner_al_dia(existentes[oid], orden, resultado)
                except Exception as e:
                    resultado["errores"].append({"orden": oid, "error": f"no se pudo actualizar: {e}"})
                continue
            estado_erp = _ESTADO_ERP.get(orden.get("status"))
            if not estado_erp or int(orden.get("create_time") or 0) < desde:
                continue   # sin venta firme, o anterior a la activacion (ya se manejo a mano)
            if supabase_get(f"ventas_externas?origen=eq.tiktok&pedido_externo=eq.{oid}&select=id&limit=1"):
                continue   # ya cuenta en la utilidad como venta externa: no se vuelve a contar como pedido
            if cargado is None:
                from routers.tiktok_excel import _cargar_erp
                cargado = _cargar_erp()
            items, faltante = [], False
            por_sku = {}
            for li in orden.get("line_items") or []:
                if (li.get("display_status") or "") == "CANCELLED":
                    continue
                clave = li.get("sku_id") or li.get("id")
                por_sku.setdefault(clave, {"li": li, "n": 0})["n"] += 1   # cada linea de TikTok es 1 par
            for g in por_sku.values():
                li, n = g["li"], g["n"]
                sv = (li.get("seller_sku") or "").strip()
                var = _variante_de_sku(sv, cargado) if sv else None
                partes = [x.strip() for x in (li.get("sku_name") or "").split(",")]
                try:
                    precio = float(li.get("sale_price") or 0)
                except (TypeError, ValueError):
                    precio = 0.0
                if var is None:
                    faltante = True
                    resultado["sin_match"].append({"orden": oid, "sku": sv or "(sin SKU)"})
                items.append({"variante_id": var["id"] if var else None, "cantidad": n, "precio_unitario": precio,
                              "nombre": (li.get("product_name") or "")[:200],
                              "color": (var.get("color") if var else (partes[0] if partes else "")) or "",
                              "talla": str((var.get("talla") if var else (partes[1] if len(partes) > 1 else "")) or ""), "sku": sv})
            if not items:
                continue
            pago = orden.get("payment") or {}
            try:
                subtotal = float(pago.get("sub_total") or sum(i["precio_unitario"] * i["cantidad"] for i in items))
                total = float(pago.get("total_amount") or subtotal)
            except (TypeError, ValueError):
                subtotal = total = sum(i["precio_unitario"] * i["cantidad"] for i in items)
            datos = {"tiktok_order_id": oid, "canal": "tiktok", "status": estado_erp, "tipo": "online", "total": total, "subtotal": subtotal,
                     "forma_pago": "tiktok", "nombre_cliente": "Comprador TikTok",
                     "notas": f"Pedido generado automaticamente desde TikTok Shop (orden {oid})" + (" — falto ligar algun SKU al inventario: revisalo" if faltante else "")}
            f = _iso(orden.get("create_time"))
            if f:
                datos["created_at"] = f
            if estado_erp == "enviado":
                datos["enviado_at"] = _dt.datetime.now(_dt.timezone.utc).isoformat()
                if orden.get("shipping_provider"):
                    datos["paqueteria"] = str(orden["shipping_provider"])
                if orden.get("tracking_number"):
                    datos["numero_guia"] = str(orden["tracking_number"])
            try:
                pedido = supabase_post("pedidos", datos)
                pid = pedido[0]["id"] if pedido else None
                if not pid:
                    continue
                for it in items:
                    supabase_post("pedido_items", {"pedido_id": pid, "variante_id": it["variante_id"], "cantidad": it["cantidad"],
                                                   "precio_unitario": it["precio_unitario"], "nombre": it["nombre"], "color": it["color"], "talla": it["talla"]})
                _hist(pid, "creado", f"Pedido {oid} importado de TikTok Shop")
                for it in items:
                    if it["variante_id"]:
                        try:
                            _descontar(it["variante_id"], it["cantidad"], oid)
                        except Exception as e_inv:
                            resultado["errores"].append({"orden": oid, "error": f"pedido creado pero fallo el descuento de inventario ({it.get('sku')}): {e_inv}"})
                if estado_erp == "pagado":
                    try:
                        from routers.push import avisar_venta_canal
                        avisar_venta_canal("tiktok", items, total, datos.get("created_at"))
                    except Exception:
                        pass
                resultado["procesadas"] += 1
            except Exception as e:
                resultado["errores"].append({"orden": oid, "error": str(e)[:200]})
        return resultado
    except Exception as ex:
        resultado["errores"].append({"error_general": str(ex)[:200]})
        return resultado
    finally:
        _LOCK_VENTAS.release()
