from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete, inventario_ajustar
from datetime import date, datetime, timedelta, timezone
import json
import math

# Railway corre en UTC: _hoy_mx() cambia de día a las 18:00 hora de México, así que
# "hoy" para cierres de caja/reportes salía mal en las tardes-noches. Todo "día de negocio"
# se calcula en hora de México (UTC-6, sin horario de verano desde 2022).
_TZ_MX = timezone(timedelta(hours=-6))


def _hoy_mx() -> date:
    return datetime.now(_TZ_MX).date()


def _inicio_dia_mx(d: date) -> str:
    """Inicio del día d en México expresado en UTC ('Z' evita problemas de '+' en la URL)."""
    return f"{d.isoformat()}T06:00:00Z"


_MESES_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]


def _rango_mes(mes: str = None):
    """(inicio_utc, fin_utc_exclusivo, 'octubre 2026', 'YYYY-MM') de un mes calendario en hora de México. Sin `mes` = el mes en curso."""
    hoy = _hoy_mx()
    try:
        a, m = (int(x) for x in str(mes).split("-")[:2]) if mes else (hoy.year, hoy.month)
        primer = date(a, m, 1)
    except Exception:
        primer = date(hoy.year, hoy.month, 1)
    sig = date(primer.year + (primer.month // 12), primer.month % 12 + 1, 1)
    return _inicio_dia_mx(primer), _inicio_dia_mx(sig), f"{_MESES_ES[primer.month - 1]} {primer.year}", primer.strftime("%Y-%m")


def _costo_unitario(prod: dict, base: str) -> float:
    """Costo de un par: 'corrida' = lo que cobra el proveedor/propietaria a quien opera el sistema (precio de corrida; si no está capturado,
    precio de menudeo del panel − $100), 'real' = el costo de producción capturado en el producto."""
    if base == "real":
        return float(prod.get("costo") or 0)
    pc = float(prod.get("precio_corrida") or 0)
    return pc if pc > 0 else max(float(prod.get("precio_menudeo") or 0) - 100.0, 0.0)


_ORIGEN_PROPIO = ('tienda', 'google', 'auto-reparado', 'llego_solo')   # fichas que la clienta creó sola


def _origenes_clientes(cids):
    """{cliente_id: origen} para decidir si una clienta del portal se registró sola o la registró el dueño."""
    cids = list({c for c in cids if c})
    out = {}
    for k in range(0, len(cids), 150):
        for cl in supabase_get(f"clientes?id=in.({','.join(cids[k:k + 150])})&select=id,origen,llego_solo") or []:
            o = cl.get('origen')
            # «llegó sola» (cliente nueva, o marcada en su ficha): todos sus pedidos cuentan en Tu utilidad, los capture quien los capture
            out[cl['id']] = 'llego_solo' if (cl.get('llego_solo') and o != 'tiktok') else o
    return out


def _cuenta_en_tu_utilidad(canal, origen_cliente):
    """«Tu utilidad» solo cuenta lo que llega solo: tienda en línea, MercadoLibre, WhatsApp, portal de clientas que se registraron solas y las
    ventas de TikTok (las que se capturan en el sistema con el cliente «TikTok», origen 'tiktok', sea cual sea el canal).
    NO cuenta mostrador, lo que captura el dueño ni las clientas que registró él, ni SHEIN y demás.
    EXCEPCIÓN: una venta de mostrador cobrada al precio del sitio (panel +$80) sí cuenta; eso se decide aparte con _pedidos_a_precio_sitio()."""
    canal = (canal or '').lower()
    if origen_cliente == 'tiktok':
        return True
    if origen_cliente == 'llego_solo':
        return canal != 'shein'
    if canal in ('web', 'online', 'mercadolibre', 'whatsapp'):
        return True
    if canal == 'portal_mayoreo':
        return origen_cliente in _ORIGEN_PROPIO
    return False


def _pedidos_a_precio_sitio(pedidos) -> set:
    """Ventas de mostrador (Punto de venta) cuyos pares se cobraron AL PRECIO DEL SITIO: precio de menudeo del panel + $80 (o más).
    Es la señal para saber que esa venta es de las que llegan solas (la clienta la cotizó por WhatsApp o por el sitio) y debe contar en «Tu utilidad»,
    aunque quien la capturó la haya metido en el Punto de venta en vez de usar el link de pago.
    Reglas: la venta cuenta si TODOS sus pares de menudeo (sin ofertas, que no llevan el +$80) se cobraron a panel+$80 o más y hay al menos uno así.
    Los renglones en $0 (cambios) y las ofertas no cuentan para decidir; si algún par se cobró al precio del panel o menos, la venta es de mostrador y no cuenta."""
    cand = [p['id'] for p in (pedidos or []) if (p.get('canal') or '').lower() == 'sucursal']
    if not cand:
        return set()
    items = []
    for k in range(0, len(cand), 150):
        items += supabase_get_all(f"pedido_items?pedido_id=in.({','.join(cand[k:k + 150])})&select=pedido_id,cantidad,variante_id,precio_unitario") or []
    items = [i for i in items if i.get('variante_id') and int(i.get('cantidad') or 0) > 0 and float(i.get('precio_unitario') or 0) > 0]
    vids = list({i['variante_id'] for i in items})
    vmap = {}
    for k in range(0, len(vids), 150):
        for v in supabase_get(f"variantes?id=in.({','.join(vids[k:k + 150])})&select=id,producto_id") or []:
            vmap[v['id']] = v.get('producto_id')
    pids = list({x for x in vmap.values() if x})
    pmap = {}
    for k in range(0, len(pids), 150):
        for pr in supabase_get(f"productos?id=in.({','.join(pids[k:k + 150])})&select=id,precio_menudeo,es_oferta") or []:
            pmap[pr['id']] = pr
    a_sitio, otro = set(), set()
    for i in items:
        pr = pmap.get(vmap.get(i['variante_id']))
        base = float((pr or {}).get('precio_menudeo') or 0)
        if not pr or base <= 0 or pr.get('es_oferta'):
            continue
        if float(i.get('precio_unitario') or 0) + 0.5 >= base + 80:
            a_sitio.add(i['pedido_id'])
        else:
            otro.add(i['pedido_id'])
    return a_sitio - otro


def _devueltos_ml(pedidos) -> dict:
    """{pedido_id: estado} de los pedidos de MercadoLibre cuyo paquete ya regresó (ml_devoluciones: por_confirmar, sumada, descartada o
    historica; 'en_camino' todavía no cuenta)."""
    ids = [p['id'] for p in pedidos if (p.get('canal') or '').lower() == 'mercadolibre']
    devueltos = {}
    try:
        for k in range(0, len(ids), 150):
            for f in supabase_get(f"ml_devoluciones?pedido_id=in.({','.join(ids[k:k + 150])})&estado=in.(por_confirmar,sumada,descartada,historica)&select=pedido_id,estado") or []:
                devueltos[f.get('pedido_id')] = f.get('estado')
    except Exception as e:
        print(f"[finanzas] No se pudieron leer las devoluciones de ML: {e}")
    return devueltos


def _sin_devueltos_ml(pedidos):
    """Quita de las ventas los pedidos de MercadoLibre devueltos. Esa venta se reembolsó al comprador, así que no deja utilidad: ni en
    «Tu utilidad» ni en la utilidad general. Se descuenta en el mes en que se hizo la venta."""
    devueltos = _devueltos_ml(pedidos)
    return [p for p in pedidos if p['id'] not in devueltos] if devueltos else pedidos


def _externas_rango(ini, fin) -> dict:
    """Ventas de otros canales cargadas aparte (tabla ventas_externas: pedidos de TikTok importados de su archivo). NO son ventas del sistema
    ni mueven inventario: solo suman a la utilidad del mes (la general, con costo real, y «Tu utilidad», con precio de corrida).
    Las líneas sin costo (producto no encontrado) no suman: se cuentan en `sin_costo`."""
    filas = supabase_get_all(f"ventas_externas?fecha_venta=gte.{ini}&fecha_venta=lt.{fin}&select=pedido_externo,cantidad,venta_unit,costo_real_unit,costo_corrida_unit") or []
    peds, pares, venta, tu, real, sin_costo = set(), 0, 0.0, 0.0, 0.0, 0
    for f in filas:
        cant = int(f.get("cantidad") or 0)
        v = float(f.get("venta_unit") or 0)
        cr, cc = f.get("costo_real_unit"), f.get("costo_corrida_unit")
        if cc is None or cr is None or float(cr) <= 0:
            sin_costo += 1
            if cc is None:
                continue
        peds.add(f["pedido_externo"]); pares += cant; venta += v * cant
        tu += (v - float(cc)) * cant
        if cr is not None and float(cr) > 0:
            real += (v - float(cr)) * cant
    return {"pedidos": len(peds), "pares": pares, "venta": venta, "tu_utilidad": tu, "utilidad_real": real, "sin_costo": sin_costo, "corrida": venta - tu}


def _fecha_mx(ts: str):
    """Fecha (hora México) de un timestamp ISO que viene de la BD; None si no se puede."""
    try:
        return datetime.fromisoformat(str(ts).replace("Z", "+00:00")).astimezone(_TZ_MX).date()
    except Exception:
        return None

router = APIRouter(prefix="/finanzas", tags=["Finanzas"])


def _forma_norm(fp):
    """'transferencia' es lo mismo que SPEI para el corte: antes esas ventas no entraban a ninguna columna del cierre."""
    fp = (fp or "").strip().lower()
    return "spei" if fp in ("transferencia", "spei", "mercadopago", "oxxo") else fp


def _desglose_pago(pedido):
    """[(forma_pago, monto), ...] de un pedido -- explota pagos_detalle si
    es una venta con pago combinado (forma_pago='combinado'); si no, regresa
    un solo renglón con el total completo bajo su forma_pago normal. Sin
    esto, cerrar caja le atribuía el total completo a UN solo método aunque
    la clienta hubiera pagado, por ejemplo, mitad efectivo y mitad tarjeta."""
    detalle = pedido.get("pagos_detalle")
    if isinstance(detalle, list) and detalle:
        return [(_forma_norm(d.get("forma_pago")), float(d.get("monto") or 0)) for d in detalle]
    return [(_forma_norm(pedido.get("forma_pago")), float(pedido.get("total") or 0))]

def _desgloses_con_anticipos(pedidos, sucursal_id, desde_iso, hasta_iso=None):
    """[(forma_pago, monto)] del dinero que ENTRÓ en el periodo: las ventas cerradas (menos lo que ya se había cobrado como
    anticipo en días anteriores) más los anticipos recibidos en el periodo. Así un apartado no cuenta dos veces en caja."""
    try:
        ids = [p["id"] for p in pedidos]
        abonos = {}
        for i in range(0, len(ids), 100):
            for r in supabase_get(f"pedido_pagos?pedido_id=in.({','.join(ids[i:i + 100])})&or=(tipo.is.null,tipo.neq.abono_credito)&select=pedido_id,monto") or []:
                abonos[r["pedido_id"]] = abonos.get(r["pedido_id"], 0.0) + float(r.get("monto") or 0)
        salida = []
        for p in pedidos:
            d = list(_desglose_pago(p))
            a = abonos.get(p["id"], 0.0)
            # Si los renglones ya suman solo el saldo (pago combinado capturado después del anticipo) no se resta otra vez
            if a > 0 and d and sum(x[1] for x in d) > float(p.get("total") or 0) - a + 0.01:
                k = max(range(len(d)), key=lambda j: d[j][1])
                d[k] = (d[k][0], max(0.0, d[k][1] - a))
            salida += d
        filtro = f"pedido_pagos?sucursal_id=eq.{sucursal_id}&or=(tipo.is.null,tipo.neq.abono_credito)&created_at=gte.{desde_iso}"
        if hasta_iso:
            filtro += f"&created_at=lt.{hasta_iso}"
        for r in supabase_get_all(filtro + "&select=forma_pago,monto") or []:
            salida.append((_forma_norm(r.get("forma_pago")), float(r.get("monto") or 0)))
        return salida
    except Exception as e:
        print(f"[finanzas] anticipos no considerados en el corte: {e}")
        return [d for p in pedidos for d in _desglose_pago(p)]


def _cobranza_credito(sucursal_id, desde_iso, hasta_iso=None):
    """{forma_pago: monto} de los abonos de crédito recibidos en el periodo (cobranza: dinero que entra a caja sin ser venta nueva)."""
    out = {}
    try:
        filtro = f"pedido_pagos?sucursal_id=eq.{sucursal_id}&tipo=eq.abono_credito&created_at=gte.{desde_iso}"
        if hasta_iso:
            filtro += f"&created_at=lt.{hasta_iso}"
        for r in supabase_get_all(filtro + "&select=forma_pago,monto") or []:
            fp = _forma_norm(r.get("forma_pago"))
            out[fp] = out.get(fp, 0.0) + float(r.get("monto") or 0)
    except Exception as e:
        print(f"[finanzas] cobranza de crédito no considerada en el corte: {e}")
    return out


# ─── CAJA ────────────────────────────────────────
@router.get("/caja/hoy/{sucursal_id}")
def caja_hoy(sucursal_id: str):
    try:
        hoy = _hoy_mx().isoformat()
        return supabase_get(f"cajas?sucursal_id=eq.{sucursal_id}&fecha=eq.{hoy}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/caja/historial/{sucursal_id}")
def historial_cajas(sucursal_id: str):
    try:
        return supabase_get(f"cajas?sucursal_id=eq.{sucursal_id}&order=created_at.desc&limit=30")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/caja/abrir")
def abrir_caja(datos: dict):
    try:
        sucursal_id = datos.get("sucursal_id")
        hoy = _hoy_mx().isoformat()
        existente = supabase_get(f"cajas?sucursal_id=eq.{sucursal_id}&fecha=eq.{hoy}&status=eq.abierta")
        if existente:
            return JSONResponse(status_code=400, content={"error": "Ya hay una caja abierta hoy"})
        return supabase_post("cajas", {
            "sucursal_id": sucursal_id,
            "empleado": datos.get("empleado", "Admin"),
            "monto_apertura": datos.get("monto_apertura", 0),
            "fecha": hoy,
            "status": "abierta"
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/caja/{id}/cerrar")
def cerrar_caja(id: str, datos: dict):
    try:
        caja = supabase_get(f"cajas?id=eq.{id}")
        if not caja:
            return JSONResponse(status_code=404, content={"error": "Caja no encontrada"})
        if caja[0].get("status") == "cerrada":
            return JSONResponse(status_code=400, content={"error": "Esta caja ya fue cerrada"})

        # Ventas del dia en hora de México, por confirmado_at (cuando se cerro la venta). Antes se
        # traían TODOS los pedidos de la sucursal (tope de 1000 filas sin orden) y se filtraba por
        # fecha UTC: las ventas de hoy podían quedar fuera y después de las 6pm el día ya era "mañana".
        hoy = _hoy_mx()
        # Si hubo una caja anterior ya cerrada el mismo día, solo cuentan las ventas posteriores a ese cierre
        # (antes la segunda caja del día volvía a contar todo el día y duplicaba las ventas).
        desde = _inicio_dia_mx(hoy)
        try:
            previas = supabase_get(
                f"cajas?sucursal_id=eq.{caja[0]['sucursal_id']}&fecha=eq.{hoy.isoformat()}&status=eq.cerrada&id=neq.{id}"
                f"&select=hora_cierre&order=hora_cierre.desc&limit=1") or []
            if previas and previas[0].get("hora_cierre"):
                desde = max(desde, str(previas[0]["hora_cierre"]).replace("+00:00", "Z"))
        except Exception:
            pass
        pedidos_hoy = supabase_get_all(
            f"pedidos?sucursal_id=eq.{caja[0]['sucursal_id']}&status=in.(confirmado,pagado,entregado,enviado)"
            f"&confirmado_at=gte.{desde}&confirmado_at=lt.{_inicio_dia_mx(hoy + timedelta(days=1))}&select=*"
        )

        desgloses_hoy = _desgloses_con_anticipos(pedidos_hoy, caja[0]['sucursal_id'], desde, _inicio_dia_mx(hoy + timedelta(days=1)))
        ventas_efectivo = sum(m for fp, m in desgloses_hoy if fp == 'efectivo')
        ventas_tarjeta = sum(m for fp, m in desgloses_hoy if fp == 'tarjeta')
        ventas_spei = sum(m for fp, m in desgloses_hoy if fp == 'spei')
        ventas_credito = sum(m for fp, m in desgloses_hoy if fp == 'credito')
        total_ventas = ventas_efectivo + ventas_tarjeta + ventas_spei + ventas_credito
        
        try:
            monto_cierre = float(datos.get("monto_cierre", 0) or 0)
        except (TypeError, ValueError):
            return JSONResponse(status_code=400, content={"error": "monto_cierre inválido"})
        # El efectivo esperado descuenta los gastos pagados con dinero de ESTA caja (gasto con caja_id)
        gastos_caja = 0.0
        try:
            gastos_caja = sum(float(g.get("monto") or 0) for g in (supabase_get(f"gastos?caja_id=eq.{id}&select=monto") or []))
        except Exception:
            pass
        # Abonos de crédito recibidos hoy: no son ventas nuevas, pero el efectivo SÍ entró al cajón
        cobranza = _cobranza_credito(caja[0]['sucursal_id'], desde, _inicio_dia_mx(hoy + timedelta(days=1)))
        cobranza_efectivo = cobranza.get('efectivo', 0.0)
        diferencia = monto_cierre - (float(caja[0]['monto_apertura']) + ventas_efectivo + cobranza_efectivo - gastos_caja)
        
        supabase_patch(f"cajas?id=eq.{id}", {
            "status": "cerrada",
            "hora_cierre": "now()",
            "monto_cierre": monto_cierre,
            "ventas_efectivo": ventas_efectivo,
            "ventas_tarjeta": ventas_tarjeta,
            "ventas_spei": ventas_spei,
            "ventas_credito": ventas_credito,
            "total_ventas": total_ventas,
            "diferencia": diferencia,
            "notas": (str(datos.get("notas", "")) + (f" [Gastos pagados de caja: ${gastos_caja:,.2f}]" if gastos_caja else "")
                      + (f" [Cobranza de crédito: " + ", ".join(f"{k} ${v:,.2f}" for k, v in cobranza.items()) + "]" if cobranza else "")).strip()
        })
        return {"ok": True, "total_ventas": total_ventas, "diferencia": diferencia, "gastos_caja": gastos_caja, "cobranza_credito": cobranza}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── GASTOS ───────────────────────────────────────
def _materializar_gastos_recurrentes(sucursal_id):
    """Los gastos recurrentes (renta, nomina, suscripciones) se guardan una
    vez como 'plantilla' (es_recurrente=true, plantilla_id=null) y aqui se
    clona automaticamente una copia para el mes actual si todavia no existe,
    para no tener que capturarlos a mano cada mes."""
    import calendar
    try:
        hoy = _hoy_mx()
        mes_actual = hoy.strftime("%Y-%m")
        plantillas = supabase_get(
            f"gastos?sucursal_id=eq.{sucursal_id}&es_recurrente=eq.true&plantilla_id=is.null"
        ) or []
        for t in plantillas:
            if t.get("mes_generado") == mes_actual:
                continue
            ya_generado = supabase_get(
                f"gastos?plantilla_id=eq.{t['id']}&mes_generado=eq.{mes_actual}"
            )
            if ya_generado:
                continue
            dia = t.get("dia_mes") or 1
            ultimo_dia = calendar.monthrange(hoy.year, hoy.month)[1]
            fecha_gasto = date(hoy.year, hoy.month, min(dia, ultimo_dia))
            try:
                supabase_post("gastos", {
                    "sucursal_id": sucursal_id,
                    "concepto": t["concepto"],
                    "monto": t["monto"],
                    "categoria": t.get("categoria", "general"),
                    "empleado": "Sistema (recurrente)",
                    "fecha": fecha_gasto.isoformat(),
                    "es_recurrente": True,
                    "dia_mes": dia,
                    "plantilla_id": t["id"],
                    "mes_generado": mes_actual,
                })
            except Exception:
                pass  # no bloquear el listado si falla un gasto recurrente individual
    except Exception:
        pass

@router.get("/gastos/{sucursal_id}")
def listar_gastos(sucursal_id: str):
    try:
        _materializar_gastos_recurrentes(sucursal_id)
        return supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/gastos")
def crear_gasto(datos: dict):
    try:
        if datos.get("es_recurrente"):
            hoy = _hoy_mx()
            datos.setdefault("dia_mes", hoy.day)
            datos["mes_generado"] = hoy.strftime("%Y-%m")
        return supabase_post("gastos", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/gastos/{id}")
def eliminar_gasto(id: str):
    try:
        return supabase_delete(f"gastos?id=eq.{id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── PROVEEDORES ──────────────────────────────────
@router.get("/proveedores")
def listar_proveedores():
    try:
        return supabase_get("proveedores?activo=eq.true&order=nombre.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/proveedores")
def crear_proveedor(datos: dict):
    try:
        return supabase_post("proveedores", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/proveedores/{id}")
def actualizar_proveedor(id: str, datos: dict):
    try:
        return supabase_patch(f"proveedores?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── ORDENES DE COMPRA ────────────────────────────
@router.get("/ordenes")
def listar_ordenes():
    try:
        return supabase_get("ordenes_compra?order=created_at.desc&select=*,proveedores(nombre),sucursales(nombre)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes")
def crear_orden(datos: dict):
    try:
        return supabase_post("ordenes_compra", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/ordenes/{id}")
def actualizar_orden(id: str, datos: dict):
    try:
        return supabase_patch(f"ordenes_compra?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/{id}/items")
def agregar_item_orden(id: str, item: dict):
    try:
        item["orden_id"] = id
        return supabase_post("ordenes_compra_items", item)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/ordenes/{id}/items")
def items_orden(id: str):
    try:
        return supabase_get(f"ordenes_compra_items?orden_id=eq.{id}&select=*,variantes(*,productos(nombre,sku_interno))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/{id}/recibir")
def recibir_orden_existente(id: str):
    """Marca una orden ya guardada (creada en 'borrador' desde Órdenes de
    compra) como recibida: sube el inventario de cada item que YA tiene
    guardado esa orden y cambia su status. A diferencia de /ordenes/recibir
    (que crea una orden nueva desde cero para remisiones que nunca se
    capturaron como borrador), este actúa sobre una que ya existe -- para
    no terminar con dos registros distintos por la misma compra."""
    try:
        orden = supabase_get(f"ordenes_compra?id=eq.{id}")
        if not orden:
            return JSONResponse(status_code=404, content={"error": "Orden no encontrada"})
        orden = orden[0]
        if orden.get("status") != "borrador":
            return JSONResponse(status_code=400, content={"error": "Solo se puede recibir una orden en borrador"})
        sucursal_id = orden.get("sucursal_id")
        items = supabase_get(f"ordenes_compra_items?orden_id=eq.{id}") or []
        if not sucursal_id:
            return JSONResponse(status_code=400, content={"error": "La orden no tiene sucursal asignada"})

        # Reclamar la orden ANTES de tocar inventario: el PATCH condicional solo afecta una
        # orden que sigue en 'borrador', así que un doble clic / reintento no suma dos veces.
        total = float(orden.get("total") or 0)
        if not supabase_patch(f"ordenes_compra?id=eq.{id}&status=eq.borrador", {"status": "recibida", "saldo_pendiente": total}):
            return JSONResponse(status_code=409, content={"error": "Esta orden ya fue recibida"})

        for i in items:
            variante_id = i.get("variante_id")
            cantidad = int(i.get("cantidad") or 0)
            if not variante_id or cantidad <= 0:
                continue
            # entrada ATÓMICA (crea la fila si no existía)
            _aj = inventario_ajustar(variante_id, sucursal_id, cantidad, crear=True)
            cantidad_anterior = _aj["anterior"] if _aj else 0
            supabase_post("movimientos_inventario", {
                "tipo": "entrada",
                "variante_id": variante_id,
                "sucursal_id": sucursal_id,
                "cantidad": cantidad,
                "cantidad_anterior": cantidad_anterior,
                "motivo": f"Recepcion de mercancia - orden {id}",
            })

        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/recibir")
def recibir_mercancia(datos: dict):
    """Registra una remision de mercancia que ya llego: sube el inventario
    de cada variante recibida Y crea la orden de compra (cuenta por pagar)
    en un solo paso, con la fecha de hoy y el dias_credito que se le haya
    dado a esa remision en particular (puede ser distinto al default del
    proveedor si se llego a otro acuerdo)."""
    try:
        proveedor_id = datos.get("proveedor_id")
        sucursal_id = datos.get("sucursal_id")
        dias_credito = datos.get("dias_credito")
        notas = datos.get("notas", "")
        items = datos.get("items") or []
        if not sucursal_id or not items:
            return JSONResponse(status_code=400, content={"error": "Falta sucursal o productos"})

        total = sum(float(i.get("cantidad", 0)) * float(i.get("costo_unitario", 0)) for i in items)
        pagada = bool(datos.get("pagada"))

        orden_payload = {
            "proveedor_id": proveedor_id,
            "sucursal_id": sucursal_id,
            "status": "pagada" if pagada else "recibida",
            "total": total,
            "saldo_pendiente": 0 if pagada else total,
            "notas": notas,
        }
        if pagada:
            from datetime import datetime, timezone
            orden_payload["fecha_pago"] = datetime.now(timezone.utc).isoformat()
        if dias_credito is not None:
            orden_payload["dias_credito"] = int(dias_credito)
        orden = supabase_post("ordenes_compra", orden_payload)
        orden_id = orden[0]["id"]

        for i in items:
            variante_id = i.get("variante_id")
            cantidad = int(i.get("cantidad") or 0)
            costo_unitario = float(i.get("costo_unitario") or 0)
            if not variante_id or cantidad <= 0:
                continue

            supabase_post("ordenes_compra_items", {
                "orden_id": orden_id,
                "variante_id": variante_id,
                "cantidad": cantidad,
                "costo_unitario": costo_unitario,
                "subtotal": cantidad * costo_unitario,
            })

            # entrada ATÓMICA (crea la fila si no existía)
            _aj = inventario_ajustar(variante_id, sucursal_id, cantidad, crear=True)
            cantidad_anterior = _aj["anterior"] if _aj else 0
            supabase_post("movimientos_inventario", {
                "tipo": "entrada",
                "variante_id": variante_id,
                "sucursal_id": sucursal_id,
                "cantidad": cantidad,
                "cantidad_anterior": cantidad_anterior,
                "motivo": f"Recepcion de mercancia - orden {orden_id}",
            })

        return {"ok": True, "orden_id": orden_id, "total": total}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── REPORTES ─────────────────────────────────────
@router.get("/reporte/{sucursal_id}")
def reporte_financiero(sucursal_id: str, mes: str = None):
    """Utilidades de un MES calendario (mes=YYYY-MM; sin mes = el mes en curso). El costo de la mercancía (cmv) y las utilidades son con el
    costo real de producción, como siempre; además se devuelve `tu_utilidad` = ventas de productos − precio de corrida (lo que le queda a quien
    opera el sistema después de pagar la corrida)."""
    try:
        from datetime import datetime, timedelta
        hace30, fin_mes, etiqueta_mes, mes_id = _rango_mes(mes)   # (nombre histórico: ahora es el inicio del mes elegido)

        # Pedidos de la sucursal + pedidos online (sin sucursal) en los últimos 30 días.
        # Se filtra por confirmado_at (fecha real de venta), no created_at (fecha del
        # carrito/borrador, que puede ser de mucho antes si se dejo pendiente).
        pedidos_sucursal = supabase_get(
            f"pedidos?sucursal_id=eq.{sucursal_id}"
            f"&status=in.(confirmado,pagado,entregado,enviado)&confirmado_at=gte.{hace30}&confirmado_at=lt.{fin_mes}"
            f"&select=id,total,canal,cliente_id"
        ) or []
        pedidos_online = supabase_get(
            f"pedidos?sucursal_id=is.null"
            f"&status=in.(confirmado,pagado,entregado,enviado)&confirmado_at=gte.{hace30}&confirmado_at=lt.{fin_mes}"
            f"&select=id,total,canal,cliente_id"
        ) or []
        pedidos = _sin_devueltos_ml(pedidos_sucursal + pedidos_online)

        gastos = supabase_get(
            f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}&created_at=lt.{fin_mes}"
        ) or []

        total_ventas = sum(float(p['total'] or 0) for p in pedidos)
        total_gastos = sum(float(g['monto'] or 0) for g in gastos)

        # Diagnóstico: cuántos pedidos no tienen items registrados
        ids_pedidos = [p['id'] for p in pedidos]
        pedidos_sin_items = []
        cmv = 0.0
        cmv_corrida = 0.0
        tu_ventas = 0.0
        origenes = _origenes_clientes([p.get('cliente_id') for p in pedidos])
        cuenta = {p['id']: _cuenta_en_tu_utilidad(p.get('canal'), origenes.get(p.get('cliente_id'))) for p in pedidos}
        shein_ids = {p['id'] for p in pedidos if (p.get('canal') or '').lower() == 'shein'}   # SHEIN: cuenta par por par, solo los que dejan utilidad sobre la corrida
        for _pid in _pedidos_a_precio_sitio([p for p in pedidos if not cuenta.get(p['id'])]):
            cuenta[_pid] = True   # venta de mostrador cobrada al precio del sitio (+$80): cuenta como venta que llega sola
        if ids_pedidos:
            # 1. Todos los items en una sola consulta
            # En bloques y paginado: antes era UNA consulta con todos los ids en la URL (se
            # pasaba del largo permitido) y con tope de 1000 filas -> costo de ventas incompleto.
            items = []
            for _i in range(0, len(ids_pedidos), 150):
                items += supabase_get_all(
                    f"pedido_items?pedido_id=in.({','.join(ids_pedidos[_i:_i + 150])})"
                    f"&select=pedido_id,cantidad,variante_id,precio_unitario,nombre"
                ) or []

            items_validos = [
                i for i in items
                if i.get('variante_id') and int(i.get('cantidad') or 0) > 0
            ]

            # 2. Todas las variantes necesarias en una sola consulta
            variante_ids_unicos = list({i['variante_id'] for i in items_validos})
            variantes_map = {}
            if variante_ids_unicos:
                vs = []
                for _i in range(0, len(variante_ids_unicos), 150):
                    vs += supabase_get(
                        f"variantes?id=in.({','.join(variante_ids_unicos[_i:_i + 150])})&select=id,producto_id,color,talla"
                    ) or []
                variantes_map = {v['id']: v for v in vs}

            # 3. Todos los productos necesarios en una sola consulta
            producto_ids_unicos = list({
                variantes_map[i['variante_id']].get('producto_id')
                for i in items_validos
                if variantes_map.get(i['variante_id'], {}).get('producto_id')
            })
            productos_map = {}
            if producto_ids_unicos:
                ps = []
                for _i in range(0, len(producto_ids_unicos), 150):
                    ps += supabase_get(
                        f"productos?id=in.({','.join(producto_ids_unicos[_i:_i + 150])})&select=id,nombre,costo,precio_corrida,precio_menudeo,sku_interno"
                    ) or []
                productos_map = {p['id']: p for p in ps}

            # 4. Construir desglose
            desglose_cmv = []
            for item in items_validos:
                variante_id  = item['variante_id']
                cantidad     = int(item.get('cantidad') or 0)
                precio_venta = float(item.get('precio_unitario') or 0)
                nombre_item  = item.get('nombre', '')

                var         = variantes_map.get(variante_id, {})
                producto_id = var.get('producto_id')
                prod        = productos_map.get(producto_id, {}) if producto_id else {}

                costo  = _costo_unitario(prod, "real")
                corrida_u = _costo_unitario(prod, "corrida")
                nombre = prod.get('nombre') or nombre_item
                sku    = prod.get('sku_interno', '')
                color  = var.get('color', '')
                talla  = var.get('talla', '')

                subtotal_costo = costo * cantidad
                subtotal_venta = precio_venta * cantidad
                cmv += subtotal_costo
                # solo lo que llega solo; y de SHEIN, únicamente los pares cuyo pago (costo que SHEIN le paga a la vendedora) deja utilidad sobre la corrida
                if cuenta.get(item.get('pedido_id')) or (item.get('pedido_id') in shein_ids and precio_venta > corrida_u):
                    cmv_corrida += corrida_u * cantidad
                    tu_ventas += subtotal_venta
                desglose_cmv.append({
                    'nombre':         nombre,
                    'sku':            sku,
                    'color':          color,
                    'talla':          talla,
                    'cantidad':       cantidad,
                    'costo_unitario': costo,
                    'precio_venta':   precio_venta,
                    'subtotal_costo': subtotal_costo,
                    'subtotal_venta': subtotal_venta,
                })

        # Detectar pedidos sin items (ventas que no se pueden desglosar por producto)
        ids_con_items = {i.get('pedido_id') for i in (items or []) if i.get('pedido_id')}
        pedidos_sin_items_lista = [p for p in pedidos if p['id'] not in ids_con_items]
        total_sin_desglose = sum(float(p['total'] or 0) for p in pedidos_sin_items_lista)

        # Ventas solo de productos (sin envío): suma real de precio_unitario × cantidad
        total_ventas_productos = sum(r['subtotal_venta'] for r in desglose_cmv)
        total_envio_cobrado    = total_ventas - total_ventas_productos

        # Utilidad basada en ingresos de productos (sin distorsionar con el envío)
        ext = _externas_rango(hace30, fin_mes)   # TikTok importado: suma a las utilidades, no a las ventas
        utilidad_bruta = total_ventas_productos - cmv + ext["utilidad_real"]
        utilidad_neta  = utilidad_bruta - total_gastos

        desglose_cmv_sorted = sorted(desglose_cmv, key=lambda x: x['subtotal_costo'], reverse=True)

        return {
            "mes":                    mes_id,
            "mes_etiqueta":           etiqueta_mes,
            "total_ventas":           total_ventas,            # ingresos totales (productos + envío)
            "total_ventas_productos": total_ventas_productos,  # solo productos
            "total_envio_cobrado":    total_envio_cobrado,     # envío cobrado al cliente
            "total_gastos":           total_gastos,
            "cmv":                    cmv,
            "utilidad_bruta":         utilidad_bruta,          # ventas productos − CMV
            "utilidad":               utilidad_neta,           # utilidad_bruta − gastos operativos
            "cmv_corrida":            cmv_corrida,             # costo a precio de corrida de lo que llega solo
            "tu_utilidad":            tu_ventas - cmv_corrida + ext["tu_utilidad"], # lo que llega solo + TikTok importado: ventas de productos − precio de corrida
            "utilidad_externa":       ext["utilidad_real"],    # ya incluida en utilidad_bruta y utilidad: TikTok importado (no es venta del sistema)
            "tu_utilidad_externa":    ext["tu_utilidad"],      # ya incluida en tu_utilidad
            "externas":               ext,
            "num_pedidos":            len(pedidos),
            "ticket_promedio":        total_ventas / len(pedidos) if pedidos else 0,
            "desglose_cmv":           desglose_cmv_sorted,
            "num_pedidos_sin_desglose": len(pedidos_sin_items_lista),
            "total_sin_desglose":     total_sin_desglose,
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
        # ─── ESTADO DE RESULTADOS ─────────────────────────
_GRUPOS_TU_UTILIDAD = [
    ("tienda", "Tienda en línea"),
    ("mercadolibre", "MercadoLibre"),
    ("whatsapp", "WhatsApp (Maya y links)"),
    ("portal_solas", "Portal: clientas que se registraron solas"),
    ("clientes_nuevos", "Clientas nuevas que llegaron solas (pedidos capturados por ti o tu equipo)"),
    ("tiktok", "TikTok (ventas capturadas con el cliente TikTok)"),
    ("mostrador_sitio", "Punto de venta cobrado al precio del sitio (+$80)"),
]


@router.get("/tu-utilidad-desglose/{sucursal_id}")
def tu_utilidad_desglose(sucursal_id: str, mes: str = None):
    """Desglose de «Tu utilidad» (ventas de productos − precio de corrida) del mes, por canal. Solo cuenta lo que llega solo (tienda,
    MercadoLibre, WhatsApp y portal de clientas que se registraron solas); mostrador, lo que captura el dueño y SHEIN no cuentan."""
    try:
        ini, fin, etiqueta, mes_id = _rango_mes(mes)
        pedidos = supabase_get_all(
            f"pedidos?or=(sucursal_id.eq.{sucursal_id},sucursal_id.is.null)&status=in.(confirmado,pagado,entregado,enviado)"
            f"&confirmado_at=gte.{ini}&confirmado_at=lt.{fin}&select=id,total,canal,cliente_id") or []
        _dev = _devueltos_ml(pedidos)
        pedidos_dev = [p for p in pedidos if p['id'] in _dev]
        pedidos = [p for p in pedidos if p['id'] not in _dev]
        origen = _origenes_clientes([p.get('cliente_id') for p in pedidos])
        _sitio = _pedidos_a_precio_sitio(pedidos)   # mostrador cobrado a panel+$80

        def grupo(p):
            canal = (p.get('canal') or '').lower()
            if origen.get(p.get('cliente_id')) == 'tiktok':
                return "tiktok"
            if canal in ('web', 'online'):
                return "tienda"
            if canal == 'mercadolibre':
                return "mercadolibre"
            if canal == 'whatsapp':
                return "whatsapp"
            if canal == 'portal_mayoreo' and origen.get(p.get('cliente_id')) in _ORIGEN_PROPIO:
                return "portal_solas"
            if origen.get(p.get('cliente_id')) == 'llego_solo' and canal != 'shein':
                return "clientes_nuevos"
            if p['id'] in _sitio:
                return "mostrador_sitio"
            return None
        pedidos = [p for p in pedidos if grupo(p)]
        ids = [p['id'] for p in pedidos]
        items = []
        for k in range(0, len(ids), 150):
            items += supabase_get_all(f"pedido_items?pedido_id=in.({','.join(ids[k:k + 150])})&select=pedido_id,cantidad,variante_id,precio_unitario") or []
        items = [i for i in items if i.get('variante_id') and int(i.get('cantidad') or 0) > 0]
        vids = list({i['variante_id'] for i in items})
        vmap = {}
        for k in range(0, len(vids), 150):
            for v in supabase_get(f"variantes?id=in.({','.join(vids[k:k + 150])})&select=id,producto_id") or []:
                vmap[v['id']] = v.get('producto_id')
        pids = list({x for x in vmap.values() if x})
        pmap = {}
        for k in range(0, len(pids), 150):
            for pr in supabase_get(f"productos?id=in.({','.join(pids[k:k + 150])})&select=id,costo,precio_corrida,precio_menudeo") or []:
                pmap[pr['id']] = pr
        por_pedido = {}
        for i in items:
            cant = int(i.get('cantidad') or 0)
            d = por_pedido.setdefault(i['pedido_id'], {"venta": 0.0, "corrida": 0.0, "pares": 0})
            d["venta"] += float(i.get('precio_unitario') or 0) * cant
            d["corrida"] += _costo_unitario(pmap.get(vmap.get(i['variante_id']), {}), "corrida") * cant
            d["pares"] += cant
        acum = {k: {"pedidos": 0, "pares": 0, "cobrado": 0.0, "venta_productos": 0.0, "corrida": 0.0} for k, _ in _GRUPOS_TU_UTILIDAD}
        for p in pedidos:
            a = acum[grupo(p)]
            a["pedidos"] += 1
            a["cobrado"] += float(p.get('total') or 0)
            d = por_pedido.get(p['id'])
            if d:
                a["pares"] += d["pares"]; a["venta_productos"] += d["venta"]; a["corrida"] += d["corrida"]
        filas = []
        for k, nombre in _GRUPOS_TU_UTILIDAD:
            a = acum[k]
            if a["pedidos"]:
                filas.append({"grupo": k, "nombre": nombre, "pedidos": a["pedidos"], "pares": a["pares"], "cobrado": a["cobrado"],
                              "venta_productos": a["venta_productos"], "corrida": a["corrida"], "utilidad": a["venta_productos"] - a["corrida"]})
        ext = _externas_rango(ini, fin)
        if ext["pedidos"]:
            filas.append({"grupo": "tiktok_importado", "nombre": "TikTok (pedidos importados del archivo, no son ventas del sistema)", "pedidos": ext["pedidos"],
                          "pares": ext["pares"], "cobrado": ext["venta"], "venta_productos": ext["venta"], "corrida": ext["corrida"], "utilidad": ext["tu_utilidad"]})
        total = {k: sum(f[k] for f in filas) for k in ("pedidos", "pares", "cobrado", "venta_productos", "corrida", "utilidad")}
        # Ventas de MercadoLibre devueltas del mes: ya NO están en las filas de arriba; aquí se ve cuánto se descontó
        devueltas = []
        if pedidos_dev:
            ids_d = [p['id'] for p in pedidos_dev]
            info = {}
            for k in range(0, len(ids_d), 150):
                for x in supabase_get(f"pedidos?id=in.({','.join(ids_d[k:k + 150])})&select=id,ml_order_id,nombre_cliente,confirmado_at") or []:
                    info[x['id']] = x
            items_d = []
            for k in range(0, len(ids_d), 150):
                items_d += supabase_get_all(f"pedido_items?pedido_id=in.({','.join(ids_d[k:k + 150])})&select=pedido_id,cantidad,variante_id,precio_unitario,nombre") or []
            vids_d = list({i['variante_id'] for i in items_d if i.get('variante_id')})
            vmap_d = {}
            for k in range(0, len(vids_d), 150):
                for v in supabase_get(f"variantes?id=in.({','.join(vids_d[k:k + 150])})&select=id,producto_id,color,talla") or []:
                    vmap_d[v['id']] = v
            pids_d = list({v.get('producto_id') for v in vmap_d.values() if v.get('producto_id')})
            pmap_d = {}
            for k in range(0, len(pids_d), 150):
                for pr in supabase_get(f"productos?id=in.({','.join(pids_d[k:k + 150])})&select=id,nombre,sku_interno,costo,precio_corrida,precio_menudeo") or []:
                    pmap_d[pr['id']] = pr
            for p in pedidos_dev:
                venta = corrida = 0.0
                pares = 0
                prods = []
                for i in items_d:
                    if i['pedido_id'] != p['id'] or int(i.get('cantidad') or 0) <= 0:
                        continue
                    cant = int(i['cantidad'])
                    var = vmap_d.get(i.get('variante_id')) or {}
                    pr = pmap_d.get(var.get('producto_id')) or {}
                    venta += float(i.get('precio_unitario') or 0) * cant
                    corrida += _costo_unitario(pr, "corrida") * cant
                    pares += cant
                    prods.append(f"{pr.get('sku_interno') or pr.get('nombre') or i.get('nombre') or ''} {var.get('color') or ''} {var.get('talla') or ''}".strip() + (f" ×{cant}" if cant > 1 else ""))
                x = info.get(p['id'], {})
                devueltas.append({"pedido_id": p['id'], "ml_order_id": x.get('ml_order_id'), "cliente": x.get('nombre_cliente'),
                                  "fecha_venta": x.get('confirmado_at'), "productos": prods, "pares": pares, "cobrado": float(p.get('total') or 0),
                                  "venta_productos": venta, "corrida": corrida, "utilidad_descontada": venta - corrida,
                                  "estado": _dev.get(p['id'])})
            devueltas.sort(key=lambda r: r.get('fecha_venta') or '')
        return {"mes": mes_id, "mes_etiqueta": etiqueta, "filas": filas, "total": total, "devueltas": devueltas,
                "total_descontado": sum(r["utilidad_descontada"] for r in devueltas)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/estado-resultados/{sucursal_id}")
def estado_resultados(sucursal_id: str):
    """Últimos 6 meses. Los meses se calculan EN PARALELO (antes uno tras otro: eran decenas de consultas seguidas y Finanzas tardaba en
    abrir) y el resultado se guarda 60 segundos."""
    try:
        from datetime import datetime, timedelta
        from cache import cache_get, cache_set
        _ck = "estado_resultados_" + str(sucursal_id)
        _hit = cache_get(_ck)
        if _hit is not None:
            return _hit
        hoy = _hoy_mx()
        
        # Últimos 6 meses (aritmética de meses real; antes restaba i*30 días y en marzo
        # duplicaba enero y omitía febrero)
        meses = []
        for i in range(5, -1, -1):
            mes_idx = hoy.year * 12 + (hoy.month - 1) - i
            primer_dia = date(mes_idx // 12, mes_idx % 12 + 1, 1)
            sig_idx = mes_idx + 1
            ultimo_dia = date(sig_idx // 12, sig_idx % 12 + 1, 1) - timedelta(days=1)
            meses.append((primer_dia, ultimo_dia))

        def _calc_mes(par):
            primer_dia, ultimo_dia = par
            _ini = _inicio_dia_mx(primer_dia)
            _fin = _inicio_dia_mx(ultimo_dia + timedelta(days=1))
            # Sucursal + ventas en línea/marketplaces (sin sucursal): antes faltaban estas últimas y el estado de resultados
            # daba menos ventas que el reporte de 30 días.
            pedidos = supabase_get_all(f"pedidos?or=(sucursal_id.eq.{sucursal_id},sucursal_id.is.null)&status=in.(confirmado,pagado,entregado,enviado)&confirmado_at=gte.{_ini}&confirmado_at=lt.{_fin}&select=id,total,canal,cliente_id")
            pedidos = _sin_devueltos_ml(pedidos)
            gastos = supabase_get_all(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{_ini}&created_at=lt.{_fin}&select=monto")
            
            ventas = sum(float(p['total'] or 0) for p in pedidos)
            gasto = sum(float(g['monto'] or 0) for g in gastos)
            # costo de la mercancía vendida ese mes (con la base de costo elegida) y venta solo de productos
            ids = [p['id'] for p in pedidos]
            _orig = _origenes_clientes([p.get('cliente_id') for p in pedidos])
            _cuenta = {p['id']: _cuenta_en_tu_utilidad(p.get('canal'), _orig.get(p.get('cliente_id'))) for p in pedidos}
            _shein = {p['id'] for p in pedidos if (p.get('canal') or '').lower() == 'shein'}
            for _pid in _pedidos_a_precio_sitio([p for p in pedidos if not _cuenta.get(p['id'])]):
                _cuenta[_pid] = True   # venta de mostrador cobrada al precio del sitio (+$80)
            ventas_prod = cmv = 0.0
            if ids:
                items = []
                for _k in range(0, len(ids), 150):
                    items += supabase_get_all(f"pedido_items?pedido_id=in.({','.join(ids[_k:_k + 150])})&select=pedido_id,cantidad,variante_id,precio_unitario") or []
                items = [i for i in items if i.get('variante_id') and int(i.get('cantidad') or 0) > 0 and (_cuenta.get(i.get('pedido_id')) or i.get('pedido_id') in _shein)]
                vids = list({i['variante_id'] for i in items})
                vmap = {}
                for _k in range(0, len(vids), 150):
                    for v in supabase_get(f"variantes?id=in.({','.join(vids[_k:_k + 150])})&select=id,producto_id") or []:
                        vmap[v['id']] = v.get('producto_id')
                pids = list({x for x in vmap.values() if x})
                pmap = {}
                for _k in range(0, len(pids), 150):
                    for pr in supabase_get(f"productos?id=in.({','.join(pids[_k:_k + 150])})&select=id,costo,precio_corrida,precio_menudeo") or []:
                        pmap[pr['id']] = pr
                for i in items:
                    cant = int(i.get('cantidad') or 0)
                    _pv = float(i.get('precio_unitario') or 0)
                    _cu = _costo_unitario(pmap.get(vmap.get(i['variante_id']), {}), "corrida")
                    if not _cuenta.get(i.get('pedido_id')) and _pv <= _cu:
                        continue   # SHEIN: un par que no deja utilidad sobre la corrida no cuenta
                    ventas_prod += _pv * cant
                    cmv += _cu * cant
            ext = _externas_rango(_ini, _fin)   # TikTok importado: suma a las utilidades, no a las ventas
            utilidad = ventas - gasto + ext["utilidad_real"]   # ventas − gastos (como estaba) + utilidad de lo importado de TikTok

            return {
                "mes": primer_dia.strftime("%b %Y"),
                "mes_id": primer_dia.strftime("%Y-%m"),
                "ventas": ventas,
                "gastos": gasto,
                "utilidad": utilidad,
                "ventas_productos": ventas_prod,
                "costo_corrida": cmv,                  # costo de la mercancía a precio de corrida
                "tu_utilidad": ventas_prod - cmv + ext["tu_utilidad"],   # ventas de productos − precio de corrida (+ TikTok importado)
                "utilidad_externa": ext["utilidad_real"],   # parte de «utilidad» que viene de TikTok importado
                "tu_utilidad_externa": ext["tu_utilidad"],
                "num_pedidos": len(pedidos)
            }

        from concurrent.futures import ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=6) as ex:
            resultado = list(ex.map(_calc_mes, meses))
        cache_set(_ck, resultado, 60)
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── FLUJO DE EFECTIVO ────────────────────────────
@router.get("/flujo/{sucursal_id}")
def flujo_efectivo(sucursal_id: str, mes: str = None):
    try:
        from datetime import timedelta
        hoy = _hoy_mx()
        hace7 = _inicio_dia_mx(hoy - timedelta(days=7))
        hace30, fin_mes, _etq, _id = _rango_mes(mes)   # el bloque «mes» es el mes calendario elegido (antes: últimos 30 días)
        _suc = f"or=(sucursal_id.eq.{sucursal_id},sucursal_id.is.null)"   # sucursal + ventas en línea, igual que el reporte

        pedidos_semana = supabase_get_all(f"pedidos?{_suc}&status=in.(confirmado,pagado,entregado,enviado)&confirmado_at=gte.{hace7}&select=total")
        pedidos_mes = supabase_get_all(f"pedidos?{_suc}&status=in.(confirmado,pagado,entregado,enviado)&confirmado_at=gte.{hace30}&confirmado_at=lt.{fin_mes}&select=total")
        gastos_semana = supabase_get_all(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace7}&select=monto")
        gastos_mes = supabase_get_all(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}&created_at=lt.{fin_mes}&select=monto")

        # Por forma de pago hoy
        pedidos_hoy = supabase_get_all(f"pedidos?sucursal_id=eq.{sucursal_id}&status=in.(confirmado,pagado,entregado,enviado)&confirmado_at=gte.{_inicio_dia_mx(hoy)}&select=*")

        desgloses_pago_hoy = _desgloses_con_anticipos(pedidos_hoy, sucursal_id, _inicio_dia_mx(hoy))
        return {
            "hoy": {
                "efectivo": sum(m for fp, m in desgloses_pago_hoy if fp == 'efectivo'),
                "tarjeta": sum(m for fp, m in desgloses_pago_hoy if fp == 'tarjeta'),
                "spei": sum(m for fp, m in desgloses_pago_hoy if fp == 'spei'),
                "credito": sum(m for fp, m in desgloses_pago_hoy if fp == 'credito'),
                "total": sum(float(p['total'] or 0) for p in pedidos_hoy)
            },
            "semana": {
                "ingresos": sum(float(p['total'] or 0) for p in pedidos_semana),
                "gastos": sum(float(g['monto'] or 0) for g in gastos_semana),
                "neto": sum(float(p['total'] or 0) for p in pedidos_semana) - sum(float(g['monto'] or 0) for g in gastos_semana)
            },
            "mes": {
                "ingresos": sum(float(p['total'] or 0) for p in pedidos_mes),
                "gastos": sum(float(g['monto'] or 0) for g in gastos_mes),
                "neto": sum(float(p['total'] or 0) for p in pedidos_mes) - sum(float(g['monto'] or 0) for g in gastos_mes)
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── CUENTAS POR COBRAR ───────────────────────────
@router.get("/cuentas-por-cobrar")
def cuentas_por_cobrar():
    try:
        # Un pedido con pago combinado ("combinado") puede tener UN renglón a
        # crédito sin que el resto lo sea -- si solo se buscara forma_pago=
        # credito, esa deuda parcial nunca aparecería aquí. Se trae también
        # "combinado" y se filtra/calcula el monto real a crédito en Python.
        pedidos = supabase_get_all("pedidos?forma_pago=in.(credito,combinado)&status=in.(confirmado,pagado,entregado,enviado)&select=*,clientes(nombre,telefono,dias_credito)")
        candidatos = []
        for p in pedidos:
            if p.get("forma_pago") == "credito":
                p["monto_credito"] = float(p.get("total") or 0)
                candidatos.append(p)
            else:
                monto_credito = sum(
                    float(d.get("monto") or 0) for d in (p.get("pagos_detalle") or [])
                    if d.get("forma_pago") == "credito"
                )
                if monto_credito > 0:
                    p["monto_credito"] = monto_credito
                    candidatos.append(p)
        # Abonos recibidos: el saldo real es lo vendido a crédito menos lo abonado. Un pedido liquidado ya no es cuenta por cobrar.
        abonos = {}
        ultimo = {}
        ids = [p["id"] for p in candidatos]
        for i in range(0, len(ids), 100):
            for r in supabase_get(f"pedido_pagos?pedido_id=in.({','.join(ids[i:i + 100])})&tipo=eq.abono_credito&select=pedido_id,monto,created_at") or []:
                abonos[r["pedido_id"]] = abonos.get(r["pedido_id"], 0.0) + float(r.get("monto") or 0)
                if str(r.get("created_at") or "") > str(ultimo.get(r["pedido_id"]) or ""):
                    ultimo[r["pedido_id"]] = r.get("created_at")
        hoy = _hoy_mx()
        resultado = []
        for p in candidatos:
            ab = round(abonos.get(p["id"], 0.0), 2)
            saldo = round(float(p["monto_credito"]) - ab, 2)
            if saldo <= 0.009:
                continue
            dias = int(((p.get("clientes") or {}).get("dias_credito")) or 0)
            f0 = _fecha_mx(p.get("confirmado_at") or p.get("created_at"))
            vence = (f0 + timedelta(days=dias)) if (f0 and dias > 0) else None   # sin días de crédito definidos no hay fecha de vencimiento
            p["abonado"] = ab
            p["saldo"] = saldo
            p["ultimo_abono"] = ultimo.get(p["id"])
            p["dias_credito"] = dias
            p["vence"] = vence.isoformat() if vence else None
            p["dias_atraso"] = max(0, (hoy - vence).days) if vence else 0
            p["vencido"] = bool(vence and hoy > vence)
            resultado.append(p)
        resultado.sort(key=lambda p: (not p["vencido"], str(p.get("confirmado_at") or p.get("created_at") or "")))
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── GASTOS POR CATEGORIA ─────────────────────────
@router.get("/gastos-categorias/{sucursal_id}")
def gastos_por_categoria(sucursal_id: str, mes: str = None):
    try:
        ini, fin, _etq, _id = _rango_mes(mes)
        gastos = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{ini}&created_at=lt.{fin}")
        
        categorias = {}
        for g in gastos:
            cat = g.get('categoria', 'general')
            categorias[cat] = categorias.get(cat, 0) + float(g['monto'] or 0)
        
        return [{"categoria": k, "total": v} for k, v in sorted(categorias.items(), key=lambda x: -x[1])]
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
        # ─── VALOR DE INVENTARIO ───────────────────────────
@router.get("/valor-inventario")
def valor_inventario():
    """Valor total del inventario (todas las sucursales) a costo y a precio de
    venta de menudeo -- responde directo "cuánto tengo en inventario" sin
    tener que sumarlo a mano. Usa supabase_get_all (no supabase_get) porque
    inventario/variantes fácilmente pasan de las 1000 filas que pagina
    PostgREST por default -- con supabase_get se perdían variantes enteras
    del total sin ningún error visible."""
    try:
        from cache import cache_get, cache_set
        from concurrent.futures import ThreadPoolExecutor
        _hit = cache_get("valor_inventario")
        if _hit is not None:
            return _hit
        # las 4 tablas se bajan al mismo tiempo (antes una tras otra) y el resultado se guarda 2 minutos
        with ThreadPoolExecutor(max_workers=4) as ex:
            _f = [ex.submit(supabase_get_all, q) for q in (
                "inventario?cantidad=gt.0&select=cantidad,variante_id,sucursal_id", "variantes?select=id,producto_id",
                "productos?select=id,costo,precio_menudeo", "sucursales?select=id,nombre")]
            inventario, variantes, productos, sucursales = [x.result() for x in _f]

        producto_de_variante = {v['id']: v['producto_id'] for v in variantes}
        productos_map = {p['id']: p for p in productos}
        sucursales_map = {s['id']: s.get('nombre') for s in sucursales}

        total_pares = 0
        valor_costo = 0.0
        valor_venta = 0.0
        variantes_con_stock = set()
        por_sucursal = {}

        for i in inventario:
            cantidad = int(i.get('cantidad') or 0)
            if cantidad <= 0:
                continue
            variante_id = i.get('variante_id')
            producto_id = producto_de_variante.get(variante_id)
            prod = productos_map.get(producto_id, {}) if producto_id else {}
            costo = float(prod.get('costo') or 0)
            precio = float(prod.get('precio_menudeo') or 0)

            total_pares += cantidad
            valor_costo += cantidad * costo
            valor_venta += cantidad * precio
            variantes_con_stock.add(variante_id)

            suc_nombre = sucursales_map.get(i.get('sucursal_id')) or 'Sin sucursal'
            s = por_sucursal.setdefault(suc_nombre, {"pares": 0, "valor_costo": 0.0, "valor_venta": 0.0})
            s["pares"] += cantidad
            s["valor_costo"] += cantidad * costo
            s["valor_venta"] += cantidad * precio

        _res = {
            "pares_totales": total_pares,
            "variantes_con_stock": len(variantes_con_stock),
            "valor_costo": round(valor_costo, 2),
            "valor_venta_menudeo": round(valor_venta, 2),
            "por_sucursal": [
                {"sucursal": k, "pares": v["pares"], "valor_costo": round(v["valor_costo"], 2), "valor_venta": round(v["valor_venta"], 2)}
                for k, v in sorted(por_sucursal.items(), key=lambda x: -x[1]["valor_costo"])
            ],
        }
        cache_set("valor_inventario", _res, 120)
        return _res
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── SUGERENCIAS DE RECOMPRA ──────────────────────
_CACHE_ANALISIS_INV = {"t": 0, "data": None}


@router.get("/analisis-inventario")
def analisis_inventario():
    """Resumen de inventario en dinero + rotación por modelo, calculado en la base de datos (función SQL analisis_inventario).
    Antes Análisis bajaba productos, variantes, movimientos, inventario y pedidos al navegador y calculaba ahí (muy lento).
    Se guarda 2 minutos en memoria."""
    import time as _t
    from database import supabase_rpc
    try:
        if _CACHE_ANALISIS_INV["data"] is not None and _t.time() - _CACHE_ANALISIS_INV["t"] < 120:
            return _CACHE_ANALISIS_INV["data"]
        data = supabase_rpc("analisis_inventario", {})
        _CACHE_ANALISIS_INV.update({"t": _t.time(), "data": data})
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)[:300]})


_CACHE_ANALISIS_TV = {"t": 0, "data": None}


@router.get("/analisis-tallas-variantes")
def analisis_tallas_variantes():
    """Pestañas Tallas y Variantes de Análisis, calculadas en la base de datos (función SQL analisis_tallas_variantes): por modelo con ventas,
    ventas por talla, por color+talla y por variante (siempre / 90 d / 30 d) y el stock de cada variante. Se guarda 2 minutos en memoria."""
    import time as _t
    from database import supabase_rpc
    try:
        if _CACHE_ANALISIS_TV["data"] is not None and _t.time() - _CACHE_ANALISIS_TV["t"] < 120:
            return _CACHE_ANALISIS_TV["data"]
        data = supabase_rpc("analisis_tallas_variantes", {})
        _CACHE_ANALISIS_TV.update({"t": _t.time(), "data": data})
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)[:300]})


# Reglas de «qué pedir» (antes cualquier talla/color en cero marcaba el modelo como URGENTE aunque casi no se hubiera vendido nunca,
# y la cantidad sugerida era como mínimo 6 pares): ahora solo se sugiere lo que de verdad rota.
_RECOMPRA_MIN_VENTAS_90 = 3        # pares vendidos en 90 días para considerar que un modelo «rota»
_RECOMPRA_MIN_VENTAS_VARIANTE = 2  # pares de ESA talla/color en 90 días para que su faltante cuente
_RECOMPRA_SEMANAS_COBERTURA = 6    # semanas de venta que se quiere tener surtidas por talla/color


@router.get("/sugerencias-recompra/{sucursal_id}")
def sugerencias_recompra(sucursal_id: str):
    try:
        from datetime import timedelta
        hace30 = (_hoy_mx() - timedelta(days=30)).isoformat()
        hace90 = (_hoy_mx() - timedelta(days=90)).isoformat()

        # supabase_get sin paginar corta en ~1000 filas (limite de PostgREST) —
        # con 1400+ variantes y miles de movimientos, se perdian productos
        # completos del desglose sin ningun error visible (quedaban con
        # variantes_detalle vacio, como si no necesitaran nada).
        productos = supabase_get_all("productos?activo=eq.true&select=*,proveedores(nombre,telefono,email)")
        # Solo variantes activas: colores/tallas descontinuados no deben inflar
        # el stock_total ni disparar "sin_stock" de algo que ya no se vende.
        variantes = supabase_get_all("variantes?activa=eq.true&select=*")
        inventario = supabase_get_all(f"inventario?sucursal_id=eq.{sucursal_id}")
        # 'venta' = POS/pedidos propios. 'salida' = MercadoLibre/SHEIN/Walmart
        # (esos canales registran su descuento de inventario con ese tipo distinto).
        movimientos = supabase_get_all(f"movimientos_inventario?tipo=in.(venta,salida)&created_at=gte.{hace90}T00:00:00")

        # Índices por variante/producto (antes: productos x variantes x movimientos anidados,
        # millones de comparaciones por cada carga de esta pantalla).
        variantes_por_prod = {}
        for v in variantes:
            variantes_por_prod.setdefault(v['producto_id'], []).append(v)
        stock_por_var = {}
        for i in inventario:
            stock_por_var[i['variante_id']] = stock_por_var.get(i['variante_id'], 0) + (i.get('cantidad') or 0)
        v30_por_var, v90_por_var = {}, {}
        for m in movimientos:
            q = abs(m.get('cantidad') or 0)
            v90_por_var[m['variante_id']] = v90_por_var.get(m['variante_id'], 0) + q
            if m['created_at'][:10] >= hace30:
                v30_por_var[m['variante_id']] = v30_por_var.get(m['variante_id'], 0) + q

        sugerencias = []
        for p in productos:
            if p.get('no_resurtir'):
                continue   # modelo «detenido»: no se vuelve a pedir
            vars_prod = variantes_por_prod.get(p['id'], [])
            var_ids = [v['id'] for v in vars_prod]
            stock_total = sum(stock_por_var.get(vid, 0) for vid in var_ids)
            ventas_30 = sum(v30_por_var.get(vid, 0) for vid in var_ids)
            ventas_90 = sum(v90_por_var.get(vid, 0) for vid in var_ids)

            velocidad_semanal = ventas_30 / 4 if ventas_30 > 0 else ventas_90 / 12
            dias_inventario = round(stock_total / velocidad_semanal * 7) if velocidad_semanal > 0 else None
            stock_minimo = p.get('stock_minimo') or 1  # default 1 par: aparece cuando llega a 1 o 0

            # Detalle de stock por variante (antes de calcular cantidad_sugerida)
            variantes_detalle = []
            for v in vars_prod:
                stock_v = stock_por_var.get(v['id'], 0)
                variantes_detalle.append({
                    "id": v['id'],
                    "talla": v.get('talla', ''),
                    "color": v.get('color', ''),
                    "sku": v.get('sku', ''),
                    "stock": stock_v,
                    "sin_stock": stock_v == 0,
                    "ventas_30": v30_por_var.get(v['id'], 0),
                    "ventas_90": v90_por_var.get(v['id'], 0),
                })

            # Ordenar por talla numérica si es posible, si no alfabético
            def sort_talla(v):
                try:
                    return (0, float(v['talla']))
                except:
                    return (1, v['talla'] or '')
            variantes_detalle.sort(key=sort_talla)

            # Solo cuenta como faltante una talla/color que SÍ se vende, y solo en modelos que rotan.
            rota = ventas_90 >= _RECOMPRA_MIN_VENTAS_90
            variantes_sin_stock = [v for v in variantes_detalle if v['sin_stock'] and v['ventas_90'] >= _RECOMPRA_MIN_VENTAS_VARIANTE]
            tiene_variante_sin_stock = rota and len(variantes_sin_stock) > 0

            # cantidad_sugerida: al menos 1 par por cada variante sin stock,
            # y si hay velocidad, lo que dicte la rotación (lo que sea mayor)
            # Se calcula por talla/color: lo que se vende por semana x semanas de cobertura, menos lo que hay (mínimo 1 par si esa
            # talla/color que sí se vende está en cero).
            cantidad_sugerida = 0
            for vd in variantes_detalle:
                vel_v = max(vd['ventas_30'] / 4, vd['ventas_90'] / 12)
                objetivo = math.ceil(vel_v * _RECOMPRA_SEMANAS_COBERTURA) if vel_v > 0 else 0
                necesita = max(0, objetivo - vd['stock'])
                if vd['sin_stock'] and vd['ventas_90'] >= _RECOMPRA_MIN_VENTAS_VARIANTE:
                    necesita = max(1, necesita)
                vd['sugerido'] = necesita if rota else 0
                cantidad_sugerida += vd['sugerido']

            # Días "efectivos" para ordenar por urgencia real: si ya hay una
            # variante en cero (o el total está en cero), cuenta como 0 días
            # sin importar qué tan bien surtido esté el resto del modelo —
            # así un modelo con una talla agotada siempre queda antes que uno
            # con más días de stock global pero ninguna talla realmente agotada.
            dias_efectivos = 0 if (stock_total == 0 or tiene_variante_sin_stock) else (dias_inventario if dias_inventario is not None else 9999)

            # Mostrar si: stock total bajo mínimo, alguna variante en 0, o días críticos
            if rota and (stock_total == 0 or stock_total <= stock_minimo or tiene_variante_sin_stock or (dias_inventario and dias_inventario <= 21)):
                sugerencias.append({
                    "producto_id": p['id'],
                    "nombre": p['nombre'],
                    "sku": p.get('sku_interno', ''),
                    "imagen": p.get('imagen_principal'),
                    "stock_total": stock_total,
                    "stock_minimo": stock_minimo,
                    "ventas_30": ventas_30,
                    "ventas_90": ventas_90,
                    "velocidad_semanal": round(velocidad_semanal, 1),
                    "dias_inventario": dias_inventario,
                    "dias_efectivos": dias_efectivos,
                    "cantidad_sugerida": max(6, cantidad_sugerida),
                    "costo_unitario": float(p.get('costo') or 0),
                    "proveedor": p.get('proveedores'),
                    "proveedor_id": p.get('proveedor_id'),
                    "urgente": bool(rota and (stock_total == 0 or tiene_variante_sin_stock or (dias_inventario and dias_inventario <= 7))),
                    "variantes": variantes_detalle
                })

        # Entre empatados en dias_efectivos (ej. todos los "urgentes" con alguna
        # variante en 0), priorizar los que más rápido se venden -- sin esto,
        # un modelo agotado casi sin ventas quedaba mezclado al mismo nivel que
        # uno agotado que vende decenas de pares por semana.
        sugerencias.sort(key=lambda x: (x['dias_efectivos'], -x['velocidad_semanal']))
        return sugerencias
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── CUENTAS POR PAGAR (proveedores) ──────────────
@router.get("/cuentas-por-pagar")
def cuentas_por_pagar(pagadas: int = 0):
    """Ordenes de compra YA RECIBIDAS que todavia no se han pagado (deuda
    real con el proveedor), con su fecha de vencimiento calculada a partir
    de los dias de credito, su saldo pendiente (puede ya traer abonos
    parciales) y el historial de abonos registrados. Las 'borrador' NO
    entran aqui -- todavia no llego nada ni se debe nada, se verian
    mezcladas con deuda real y esta vista se llenaria de basura conforme
    creciera el volumen (ver Ordenes de compra > Ordenes guardadas para
    esas, y /ordenes/{id}/recibir para pasarlas de borrador a esta lista)."""
    try:
        from datetime import datetime, timedelta
        # pagadas=1: historial de notas ya liquidadas (para decirle a un proveedor cuándo y cuánto se le pagó)
        ordenes = supabase_get_all(
            f"ordenes_compra?status=eq.{'pagada' if pagadas else 'recibida'}"
            f"&order=created_at.{'desc' if pagadas else 'asc'}&select=*,proveedores(nombre,telefono,dias_credito)"
        )
        if pagadas:
            ordenes = ordenes[:200]
        hoy = _hoy_mx()

        pagos_por_orden = {}
        orden_ids = [o["id"] for o in ordenes]
        if orden_ids:
            pagos = supabase_get_all(f"ordenes_compra_pagos?orden_id=in.({','.join(orden_ids)})&order=fecha.desc")
            for pg in pagos:
                pagos_por_orden.setdefault(pg["orden_id"], []).append(pg)

        resultado = []
        for o in ordenes:
            prov = o.get("proveedores") or {}
            # La orden puede traer su propio dias_credito (acuerdo puntual con
            # el proveedor); si no, se usa el default capturado en el proveedor.
            dias_credito = o.get("dias_credito")
            if dias_credito is None:
                dias_credito = prov.get("dias_credito") or 0
            fecha_orden = datetime.fromisoformat(o["created_at"]).date()
            fecha_vencimiento = fecha_orden + timedelta(days=dias_credito)
            dias_restantes = (fecha_vencimiento - hoy).days
            total = float(o.get("total") or 0)
            saldo = o.get("saldo_pendiente")
            saldo = total if saldo is None else float(saldo)
            resultado.append({
                **o,
                "proveedor_nombre": prov.get("nombre") or "Sin proveedor",
                "dias_credito": dias_credito,
                "fecha_orden": fecha_orden.isoformat(),
                "fecha_vencimiento": fecha_vencimiento.isoformat(),
                "dias_restantes": dias_restantes,
                "vencido": dias_restantes < 0 and not pagadas,
                "pagada": bool(pagadas),
                "saldo_pendiente": 0.0 if pagadas else saldo,
                "abonos": pagos_por_orden.get(o["id"], []),
            })
        resultado.sort(key=lambda x: x["dias_restantes"])
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/cuentas-por-pagar/manual")
def crear_cuenta_por_pagar_manual(datos: dict):
    """Registra una cuenta por pagar que el negocio ya tenia desde antes de usar
    el sistema (ej. mercancia que ya esta fisicamente en la tienda pero cuya nota
    de compra nunca se capturo): crea la deuda con el proveedor sin tocar
    inventario ni requerir productos/variantes, a diferencia de /ordenes/recibir."""
    try:
        proveedor_id = datos.get("proveedor_id")
        monto = float(datos.get("monto") or 0)
        if not proveedor_id or monto <= 0:
            return JSONResponse(status_code=400, content={"error": "Falta proveedor o el monto debe ser mayor a 0"})

        orden_payload = {
            "proveedor_id": proveedor_id,
            "sucursal_id": datos.get("sucursal_id"),
            "status": "recibida",
            "total": monto,
            "saldo_pendiente": monto,
            "notas": datos.get("notas", ""),
        }
        dias_credito = datos.get("dias_credito")
        if dias_credito is not None:
            orden_payload["dias_credito"] = int(dias_credito)
        fecha = datos.get("fecha")
        if fecha:
            orden_payload["created_at"] = fecha
        orden = supabase_post("ordenes_compra", orden_payload)
        return {"ok": True, "orden": orden[0] if orden else None}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/{id}/marcar-pagada")
def marcar_orden_pagada(id: str):
    try:
        from datetime import datetime, timezone
        supabase_patch(f"ordenes_compra?id=eq.{id}", {
            "status": "pagada",
            "saldo_pendiente": 0,
            "fecha_pago": datetime.now(timezone.utc).isoformat()
        })
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/{id}/abonos")
def registrar_abono_orden(id: str, datos: dict):
    """Registra un abono parcial a una cuenta por pagar. Si el abono cubre el
    saldo restante, la orden se marca como pagada automaticamente."""
    try:
        monto = float(datos.get("monto") or 0)
        if monto <= 0:
            return JSONResponse(status_code=400, content={"error": "El monto debe ser mayor a 0"})

        orden = supabase_get(f"ordenes_compra?id=eq.{id}")
        if not orden:
            return JSONResponse(status_code=404, content={"error": "Cuenta por pagar no encontrada"})
        orden = orden[0]
        saldo_actual = orden.get("saldo_pendiente")
        saldo_actual = float(orden.get("total") or 0) if saldo_actual is None else float(saldo_actual)
        saldo_nuevo = max(0, round(saldo_actual - monto, 2))

        fecha = datos.get("fecha") or _hoy_mx().isoformat()
        supabase_post("ordenes_compra_pagos", {
            "orden_id": id,
            "monto": monto,
            "fecha": fecha,
            "saldo_despues": saldo_nuevo,
            "notas": datos.get("notas", ""),
        })

        patch = {"saldo_pendiente": saldo_nuevo}
        if saldo_nuevo <= 0:
            from datetime import datetime, timezone
            patch["status"] = "pagada"
            patch["fecha_pago"] = datetime.now(timezone.utc).isoformat()
        supabase_patch(f"ordenes_compra?id=eq.{id}", patch)

        return {"ok": True, "saldo_pendiente": saldo_nuevo, "pagada": saldo_nuevo <= 0}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/ordenes/{id}/editar")
def editar_nota_proveedor(id: str, datos: dict):
    """Corrige una nota de proveedor ya capturada: proveedor, notas, días de crédito, fecha y (solo notas sin productos capturados) el total.
    Si cambia el total, el saldo se recalcula con lo ya abonado. No toca inventario ni los abonos registrados."""
    try:
        import re as _re
        from datetime import datetime
        orden = supabase_get(f"ordenes_compra?id=eq.{id}")
        if not orden:
            return JSONResponse(status_code=404, content={"error": "Nota no encontrada"})
        orden = orden[0]
        cambios = {}

        if datos.get("proveedor_id"):
            prov = supabase_get(f"proveedores?id=eq.{datos['proveedor_id']}&select=id")
            if not prov:
                return JSONResponse(status_code=400, content={"error": "Ese proveedor no existe"})
            cambios["proveedor_id"] = datos["proveedor_id"]

        if "notas" in datos:
            cambios["notas"] = str(datos.get("notas") or "").strip()[:1000]

        if "dias_credito" in datos:
            dc = datos.get("dias_credito")
            if dc in (None, ""):
                cambios["dias_credito"] = None
            else:
                dc = int(dc)
                if dc < 0 or dc > 365:
                    return JSONResponse(status_code=400, content={"error": "Los días de crédito deben estar entre 0 y 365"})
                cambios["dias_credito"] = dc

        fecha = str(datos.get("fecha") or "").strip()
        if fecha:
            if not _re.fullmatch(r"\d{4}-\d{2}-\d{2}", fecha):
                return JSONResponse(status_code=400, content={"error": "La fecha debe ser AAAA-MM-DD"})
            datetime.strptime(fecha, "%Y-%m-%d")
            cambios["created_at"] = f"{fecha}T12:00:00+00:00"

        if datos.get("total") not in (None, ""):
            nuevo_total = round(float(datos["total"]), 2)
            total_actual = round(float(orden.get("total") or 0), 2)
            if abs(nuevo_total - total_actual) > 0.001:
                if orden.get("status") == "pagada":
                    return JSONResponse(status_code=409, content={"error": "La nota ya está pagada: no se puede cambiar su total"})
                if nuevo_total <= 0:
                    return JSONResponse(status_code=400, content={"error": "El total debe ser mayor a 0"})
                if supabase_get(f"ordenes_compra_items?orden_id=eq.{id}&select=id&limit=1"):
                    return JSONResponse(status_code=409, content={"error": "Esta nota tiene productos capturados: su total sale de ellos y no se cambia aquí"})
                pagos = supabase_get(f"ordenes_compra_pagos?orden_id=eq.{id}&select=monto") or []
                abonado = round(sum(float(p.get("monto") or 0) for p in pagos), 2)
                if nuevo_total < abonado:
                    return JSONResponse(status_code=409, content={"error": f"Ya se abonaron ${abonado:,.2f}: el total no puede ser menor"})
                cambios["total"] = nuevo_total
                cambios["saldo_pendiente"] = round(nuevo_total - abonado, 2)

        if not cambios:
            return {"ok": True, "sin_cambios": True}
        supabase_patch(f"ordenes_compra?id=eq.{id}", cambios)
        return {"ok": True, "cambios": list(cambios.keys())}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": f"Dato inválido: {e}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ordenes/{id}/marcar-cancelada")
def marcar_orden_cancelada(id: str):
    try:
        supabase_patch(f"ordenes_compra?id=eq.{id}", {"status": "cancelada"})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── DEUDAS / PRESTAMOS ────────────────────────────
def _proximo_dia_pago(dia_pago):
    """Dado un dia del mes (1-28ish), regresa la proxima fecha en que cae."""
    from datetime import timedelta
    import calendar
    if not dia_pago:
        return None
    hoy = _hoy_mx()
    ultimo_dia_mes = calendar.monthrange(hoy.year, hoy.month)[1]
    dia = min(dia_pago, ultimo_dia_mes)
    candidata = date(hoy.year, hoy.month, dia)
    if candidata < hoy:
        mes = hoy.month + 1
        anio = hoy.year
        if mes > 12:
            mes = 1
            anio += 1
        ultimo_dia_sig = calendar.monthrange(anio, mes)[1]
        candidata = date(anio, mes, min(dia_pago, ultimo_dia_sig))
    return candidata.isoformat()

@router.get("/deudas")
def listar_deudas():
    try:
        deudas = supabase_get("deudas?activo=eq.true&order=dia_pago.asc.nullslast")
        for d in deudas:
            d["proximo_pago"] = _proximo_dia_pago(d.get("dia_pago"))
        return deudas
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/deudas")
def crear_deuda(datos: dict):
    try:
        datos.setdefault("saldo_actual", datos.get("monto_original", 0))
        return supabase_post("deudas", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/deudas/{id}")
def actualizar_deuda(id: str, datos: dict):
    try:
        return supabase_patch(f"deudas?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/deudas/{id}/pagos")
def listar_pagos_deuda(id: str):
    try:
        return supabase_get(f"deudas_pagos?deuda_id=eq.{id}&order=fecha.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/deudas/{id}/pagos")
def registrar_pago_deuda(id: str, datos: dict):
    """Registra un pago (capital + interes) y descuenta el capital del saldo."""
    try:
        deuda = supabase_get(f"deudas?id=eq.{id}")
        if not deuda:
            return JSONResponse(status_code=404, content={"error": "Deuda no encontrada"})
        deuda = deuda[0]

        monto_capital = float(datos.get("monto_capital") or 0)
        monto_interes = float(datos.get("monto_interes") or 0)
        monto_total   = float(datos.get("monto") or (monto_capital + monto_interes))
        if monto_capital < 0 or monto_interes < 0 or monto_total <= 0:
            return JSONResponse(status_code=400, content={"error": "Los montos deben ser positivos"})
        saldo_nuevo   = max(0, float(deuda["saldo_actual"]) - monto_capital)

        pago = supabase_post("deudas_pagos", {
            "deuda_id": id,
            "monto": monto_total,
            "monto_interes": monto_interes,
            "monto_capital": monto_capital,
            "fecha": datos.get("fecha") or _hoy_mx().isoformat(),
            "saldo_despues": saldo_nuevo,
            "notas": datos.get("notas", "")
        })

        supabase_patch(f"deudas?id=eq.{id}", {"saldo_actual": saldo_nuevo})
        if saldo_nuevo <= 0:
            supabase_patch(f"deudas?id=eq.{id}", {"activo": False})

        return {"ok": True, "saldo_actual": saldo_nuevo, "pago": pago}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── SALDO INICIAL (para proyeccion de flujo) ─────
@router.get("/saldo")
def obtener_saldo():
    try:
        rows = supabase_get("configuracion?clave=eq.saldo_flujo_efectivo")
        if rows and rows[0].get("valor"):
            return json.loads(rows[0]["valor"])
        return {"monto": 0, "fecha": None}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/saldo")
def guardar_saldo(datos: dict):
    try:
        valor = json.dumps({"monto": float(datos.get("monto") or 0), "fecha": _hoy_mx().isoformat()})
        existente = supabase_get("configuracion?clave=eq.saldo_flujo_efectivo")
        if existente:
            supabase_patch("configuracion?clave=eq.saldo_flujo_efectivo", {"valor": valor})
        else:
            supabase_post("configuracion", {"clave": "saldo_flujo_efectivo", "valor": valor})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── PROYECCION DE FLUJO DE CAJA ──────────────────
@router.get("/proyeccion/{sucursal_id}")
def proyeccion_flujo(sucursal_id: str, dias: int = 60):
    """Proyecta el saldo dia a dia combinando: saldo inicial capturado,
    ingreso promedio (velocidad de venta reciente), egresos variables
    promedio, y egresos YA CONOCIDOS con fecha (cuentas por pagar a
    proveedores, gastos recurrentes, pagos de deudas)."""
    try:
        from datetime import timedelta
        import calendar as _cal
        hoy = _hoy_mx()

        saldo_rows = supabase_get("configuracion?clave=eq.saldo_flujo_efectivo")
        saldo_inicial = 0.0
        if saldo_rows and saldo_rows[0].get("valor"):
            saldo_inicial = float(json.loads(saldo_rows[0]["valor"]).get("monto") or 0)

        hace30 = (hoy - timedelta(days=30)).isoformat()
        pedidos_suc = supabase_get(
            f"pedidos?sucursal_id=eq.{sucursal_id}&status=in.(confirmado,pagado,entregado,enviado)"
            f"&confirmado_at=gte.{hace30}&select=total"
        ) or []
        pedidos_online = supabase_get(
            f"pedidos?sucursal_id=is.null&status=in.(pagado,enviado,entregado)"
            f"&confirmado_at=gte.{hace30}&select=total"
        ) or []
        ventas_30 = sum(float(p['total'] or 0) for p in pedidos_suc + pedidos_online)
        ingreso_diario_prom = ventas_30 / 30

        gastos_30 = supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{hace30}T00:00:00") or []
        gastos_variables_30 = sum(float(g['monto'] or 0) for g in gastos_30 if not g.get('es_recurrente'))
        egreso_variable_diario = gastos_variables_30 / 30

        cxp = cuentas_por_pagar()
        if isinstance(cxp, JSONResponse):
            cxp = []
        plantillas = supabase_get(
            f"gastos?sucursal_id=eq.{sucursal_id}&es_recurrente=eq.true&plantilla_id=is.null"
        ) or []
        deudas = supabase_get("deudas?activo=eq.true") or []

        dias_proyeccion = []
        saldo_actual = saldo_inicial
        for i in range(dias):
            fecha_i = hoy + timedelta(days=i)
            fecha_iso = fecha_i.isoformat()
            ingreso = ingreso_diario_prom
            egreso = egreso_variable_diario
            detalle = []

            for o in cxp:
                # saldo pendiente (no el total: ya pudo tener abonos). Las ya vencidas caen en
                # el día 0 -- antes solo se contaban si vencían EXACTO en un día futuro y las
                # deudas atrasadas desaparecían de la proyección.
                vence = o.get("fecha_vencimiento")
                if vence == fecha_iso or (i == 0 and vence and vence < fecha_iso):
                    monto = float(o.get("saldo_pendiente") if o.get("saldo_pendiente") is not None else (o.get("total") or 0))
                    egreso += monto
                    detalle.append(f"Pago a {o.get('proveedor_nombre')}: ${monto:,.0f}" + (" (vencido)" if vence < fecha_iso else ""))

            for t in plantillas:
                dia = t.get("dia_mes") or 1
                ultimo_dia = _cal.monthrange(fecha_i.year, fecha_i.month)[1]
                if fecha_i.day == min(dia, ultimo_dia):
                    monto = float(t.get("monto") or 0)
                    egreso += monto
                    detalle.append(f"{t.get('concepto')}: ${monto:,.0f}")

            for d in deudas:
                dia_pago = d.get("dia_pago")
                pago_mensual = d.get("pago_mensual")
                if dia_pago and pago_mensual:
                    ultimo_dia = _cal.monthrange(fecha_i.year, fecha_i.month)[1]
                    if fecha_i.day == min(dia_pago, ultimo_dia):
                        monto = float(pago_mensual or 0)
                        egreso += monto
                        detalle.append(f"Pago deuda {d.get('nombre')}: ${monto:,.0f}")

            saldo_actual += (ingreso - egreso)
            dias_proyeccion.append({
                "fecha": fecha_iso,
                "ingreso": round(ingreso, 2),
                "egreso": round(egreso, 2),
                "saldo": round(saldo_actual, 2),
                "detalle_egresos": detalle,
            })

        return {
            "saldo_inicial": saldo_inicial,
            "ingreso_diario_promedio": round(ingreso_diario_prom, 2),
            "egreso_variable_diario": round(egreso_variable_diario, 2),
            "dias": dias_proyeccion,
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})



# ═══ GASTOS FIJOS: se dan de alta cuando el dueño se acuerda y cada mes esperan su CONFIRMACIÓN (monto editable) ═══
# La «plantilla» es el gasto con es_recurrente=true y plantilla_id=null (así funcionaba ya); cada mes confirmado es una copia con
# plantilla_id y mes_generado. Antes las copias se creaban solas sin preguntar (ver _materializar_gastos_recurrentes).
import re as _re_fin
_UUID_FIN = _re_fin.compile(r"^[0-9a-fA-F-]{36}$")
_MES_RE = _re_fin.compile(r"^\d{4}-\d{2}$")


def _mes_anterior(mes_id: str) -> str:
    a, m = (int(x) for x in mes_id.split("-"))
    return f"{a - 1}-12" if m == 1 else f"{a}-{m - 1:02d}"


def _plantillas_fijas(sucursal_id: str) -> list:
    return supabase_get(f"gastos?sucursal_id=eq.{sucursal_id}&es_recurrente=eq.true&plantilla_id=is.null"
                        f"&select=id,concepto,monto,categoria,dia_mes,created_at,mes_generado&order=dia_mes.asc") or []


def _vence(mes: str, dia: int) -> date:
    import calendar
    a, m = (int(x) for x in mes.split("-"))
    return date(a, m, min(max(1, int(dia or 1)), calendar.monthrange(a, m)[1]))


def gastos_fijos_pendientes(sucursal_id: str) -> list:
    """Gastos fijos cuyo día de pago ya llegó (este mes o el anterior) y que nadie ha confirmado ni saltado."""
    hoy = _hoy_mx()
    actual = hoy.strftime("%Y-%m")
    anterior = _mes_anterior(actual)
    plantillas = _plantillas_fijas(sucursal_id)
    if not plantillas:
        return []
    ids = ",".join(p["id"] for p in plantillas)
    hechos = {(c["plantilla_id"], c["mes_generado"]) for c in (supabase_get(
        f"gastos?plantilla_id=in.({ids})&mes_generado=in.({anterior},{actual})&select=plantilla_id,mes_generado") or [])}
    omitidos = {(o["plantilla_id"], o["mes"]) for o in (supabase_get(
        f"gastos_fijos_omitidos?plantilla_id=in.({ids})&mes=in.({anterior},{actual})&select=plantilla_id,mes") or [])}
    out = []
    for p in plantillas:
        alta = str(p.get("created_at") or "")[:7]          # el mes en que se dio de alta ya cuenta: la plantilla misma es ese gasto
        for mes in (anterior, actual):
            if (alta and mes <= alta) or p.get("mes_generado") == mes or (p["id"], mes) in hechos or (p["id"], mes) in omitidos:
                continue
            v = _vence(mes, p.get("dia_mes"))
            if v > hoy:
                continue
            out.append({"plantilla_id": p["id"], "concepto": p["concepto"], "monto": float(p.get("monto") or 0),
                        "categoria": p.get("categoria") or "general", "mes": mes, "vence": v.isoformat()})
    return sorted(out, key=lambda x: x["vence"])


@router.get("/gastos-fijos/{sucursal_id}")
def listar_gastos_fijos(sucursal_id: str):
    if not _UUID_FIN.match(sucursal_id):
        return JSONResponse(status_code=400, content={"error": "Sucursal inválida"})
    # se registran solos cada mes (decisión del dueño, 2026-11-07): ya no hay «por confirmar»
    _materializar_gastos_recurrentes(sucursal_id)
    return {"fijos": _plantillas_fijas(sucursal_id), "pendientes": []}


def _plantilla(plantilla_id: str):
    if not _UUID_FIN.match(plantilla_id or ""):
        return None
    return (supabase_get(f"gastos?id=eq.{plantilla_id}&es_recurrente=eq.true&plantilla_id=is.null&select=*") or [None])[0]


@router.post("/gastos-fijos/{plantilla_id}/confirmar")
def confirmar_gasto_fijo(plantilla_id: str, datos: dict):
    t = _plantilla(plantilla_id)
    if not t:
        return JSONResponse(status_code=404, content={"error": "Gasto fijo no encontrado"})
    mes = str(datos.get("mes") or "")
    if not _MES_RE.match(mes):
        return JSONResponse(status_code=400, content={"error": "Mes inválido"})
    try:
        monto = round(float(datos.get("monto") if datos.get("monto") not in (None, "") else t.get("monto") or 0), 2)
    except (TypeError, ValueError):
        return JSONResponse(status_code=400, content={"error": "Monto inválido"})
    if monto <= 0 or monto > 10_000_000:
        return JSONResponse(status_code=400, content={"error": "Monto inválido"})
    if supabase_get(f"gastos?plantilla_id=eq.{plantilla_id}&mes_generado=eq.{mes}&select=id"):
        return {"ok": True, "ya_estaba": True}
    v = _vence(mes, t.get("dia_mes"))
    # created_at en el mes que corresponde: los reportes suman los gastos por created_at
    supabase_post("gastos", {"sucursal_id": t["sucursal_id"], "concepto": t["concepto"], "monto": monto, "categoria": t.get("categoria") or "general",
                             "empleado": str(datos.get("empleado") or "Gasto fijo confirmado")[:80], "fecha": v.isoformat(),
                             "created_at": f"{v.isoformat()}T18:00:00Z", "es_recurrente": True, "dia_mes": t.get("dia_mes"),
                             "plantilla_id": plantilla_id, "mes_generado": mes})
    return {"ok": True}


@router.post("/gastos-fijos/{plantilla_id}/saltar")
def saltar_gasto_fijo(plantilla_id: str, datos: dict):
    if not _plantilla(plantilla_id):
        return JSONResponse(status_code=404, content={"error": "Gasto fijo no encontrado"})
    mes = str(datos.get("mes") or "")
    if not _MES_RE.match(mes):
        return JSONResponse(status_code=400, content={"error": "Mes inválido"})
    if not supabase_get(f"gastos_fijos_omitidos?plantilla_id=eq.{plantilla_id}&mes=eq.{mes}&select=mes"):
        supabase_post("gastos_fijos_omitidos", {"plantilla_id": plantilla_id, "mes": mes})
    return {"ok": True}


@router.patch("/gastos-fijos/{plantilla_id}")
def editar_gasto_fijo(plantilla_id: str, datos: dict):
    if not _plantilla(plantilla_id):
        return JSONResponse(status_code=404, content={"error": "Gasto fijo no encontrado"})
    cambios = {}
    if str(datos.get("concepto") or "").strip():
        cambios["concepto"] = str(datos["concepto"]).strip()[:120]
    if datos.get("categoria"):
        cambios["categoria"] = str(datos["categoria"])[:40]
    try:
        if datos.get("monto") not in (None, ""):
            m = round(float(datos["monto"]), 2)
            if m <= 0:
                raise ValueError
            cambios["monto"] = m
        if datos.get("dia_mes") not in (None, ""):
            d = int(datos["dia_mes"])
            if not 1 <= d <= 31:
                raise ValueError
            cambios["dia_mes"] = d
    except (TypeError, ValueError):
        return JSONResponse(status_code=400, content={"error": "Monto o día inválido"})
    if not cambios:
        return JSONResponse(status_code=400, content={"error": "Nada que cambiar"})
    supabase_patch(f"gastos?id=eq.{plantilla_id}", cambios)
    return {"ok": True}


@router.post("/gastos-fijos/{plantilla_id}/quitar")
def quitar_gasto_fijo(plantilla_id: str):
    """Deja de pedir confirmación cada mes (lo ya registrado se queda)."""
    if not _plantilla(plantilla_id):
        return JSONResponse(status_code=404, content={"error": "Gasto fijo no encontrado"})
    supabase_patch(f"gastos?id=eq.{plantilla_id}", {"es_recurrente": False})
    return {"ok": True}


# ═══ REPORTES automáticos y Excel para el contador ═══
_CANAL_ETQ = {"sucursal": "Mostrador", "web": "Tienda en línea", "online": "Tienda en línea", "whatsapp": "WhatsApp", "portal_mayoreo": "Portal mayoreo",
              "mercadolibre": "MercadoLibre", "shein": "SHEIN", "walmart": "Walmart", "amazon": "Amazon", "tiktok": "TikTok"}
_ESTADOS_VENTA_FIN = "confirmado,pagado,entregado,enviado"


def ventas_rango(sucursal_id: str, ini: str, fin: str) -> dict:
    peds = supabase_get_all(f"pedidos?or=(sucursal_id.eq.{sucursal_id},sucursal_id.is.null)&status=in.({_ESTADOS_VENTA_FIN})"
                            f"&confirmado_at=gte.{ini}&confirmado_at=lt.{fin}&select=total,canal") or []
    por = {}
    for p in peds:
        k = _CANAL_ETQ.get((p.get("canal") or "").lower(), (p.get("canal") or "Otro").title())
        por[k] = por.get(k, 0.0) + float(p.get("total") or 0)
    return {"pedidos": len(peds), "ventas": round(sum(por.values()), 2),
            "por_canal": sorted(({"canal": k, "ventas": round(v, 2)} for k, v in por.items()), key=lambda x: -x["ventas"])}


@router.get("/exportar-contador/{sucursal_id}")
def exportar_contador(sucursal_id: str, mes: str = None, tipo: str = "ventas"):
    """CSV (se abre directo en Excel) con las ventas o los gastos de un mes, para el contador."""
    import csv
    import io
    from fastapi.responses import Response
    if not _UUID_FIN.match(sucursal_id):
        return JSONResponse(status_code=400, content={"error": "Sucursal inválida"})
    ini, fin, _etq, mes_id = _rango_mes(mes)
    buf = io.StringIO()
    w = csv.writer(buf)
    if tipo == "gastos":
        filas = supabase_get_all(f"gastos?sucursal_id=eq.{sucursal_id}&created_at=gte.{ini}&created_at=lt.{fin}"
                                 f"&select=created_at,fecha,concepto,categoria,monto,empleado&order=created_at.asc") or []
        w.writerow(["Fecha", "Concepto", "Categoría", "Monto", "Registró"])
        for g in filas:
            w.writerow([str(g.get("fecha") or g.get("created_at") or "")[:10], g.get("concepto") or "", g.get("categoria") or "",
                        f"{float(g.get('monto') or 0):.2f}", g.get("empleado") or ""])
    else:
        tipo = "ventas"
        filas = supabase_get_all(f"pedidos?or=(sucursal_id.eq.{sucursal_id},sucursal_id.is.null)&status=in.({_ESTADOS_VENTA_FIN})"
                                 f"&confirmado_at=gte.{ini}&confirmado_at=lt.{fin}"
                                 f"&select=id,confirmado_at,canal,forma_pago,costo_envio,total,nombre_cliente,clientes(nombre)&order=confirmado_at.asc") or []
        w.writerow(["Fecha", "Folio", "Canal", "Cliente", "Forma de pago", "Envío", "Total"])
        for p in filas:
            cli = (p.get("clientes") or {}).get("nombre") if isinstance(p.get("clientes"), dict) else None
            w.writerow([str(p.get("confirmado_at") or "")[:10], str(p.get("id") or "")[:8].upper(),
                        _CANAL_ETQ.get((p.get("canal") or "").lower(), p.get("canal") or ""), cli or p.get("nombre_cliente") or "",
                        p.get("forma_pago") or "", f"{float(p.get('costo_envio') or 0):.2f}", f"{float(p.get('total') or 0):.2f}"])
    return Response(content="﻿" + buf.getvalue(), media_type="text/csv; charset=utf-8",
                    headers={"Content-Disposition": f'attachment; filename="{tipo}_{mes_id}.csv"'})


def alertas_rentabilidad(sucursal_id: str, dia: date) -> dict:
    """Pares vendidos ese día por DEBAJO del precio de corrida (sin contar ofertas), y cuántos productos activos no tienen costo."""
    ini, fin = _inicio_dia_mx(dia), _inicio_dia_mx(dia + timedelta(days=1))
    peds = supabase_get_all(f"pedidos?or=(sucursal_id.eq.{sucursal_id},sucursal_id.is.null)&status=in.({_ESTADOS_VENTA_FIN})"
                            f"&confirmado_at=gte.{ini}&confirmado_at=lt.{fin}&select=id") or []
    bajo = []
    if peds:
        ids = [p["id"] for p in peds]
        items = []
        for k in range(0, len(ids), 150):
            items += supabase_get_all(f"pedido_items?pedido_id=in.({','.join(ids[k:k + 150])})&select=cantidad,precio_unitario,variante_id,nombre") or []
        items = [i for i in items if i.get("variante_id") and int(i.get("cantidad") or 0) > 0 and float(i.get("precio_unitario") or 0) > 0]
        vids = list({i["variante_id"] for i in items})
        vmap, pmap = {}, {}
        for k in range(0, len(vids), 150):
            for v in supabase_get(f"variantes?id=in.({','.join(vids[k:k + 150])})&select=id,producto_id") or []:
                vmap[v["id"]] = v.get("producto_id")
        pids = list({x for x in vmap.values() if x})
        for k in range(0, len(pids), 150):
            for pr in supabase_get(f"productos?id=in.({','.join(pids[k:k + 150])})&select=id,nombre,es_oferta,precio_corrida,precio_menudeo,costo") or []:
                pmap[pr["id"]] = pr
        for i in items:
            pr = pmap.get(vmap.get(i["variante_id"]))
            if not pr or pr.get("es_oferta"):
                continue
            corrida = _costo_unitario(pr, "corrida")
            precio = float(i.get("precio_unitario") or 0)
            if corrida and precio < corrida - 0.5:
                bajo.append({"modelo": (pr.get("nombre") or i.get("nombre") or "").split(" ")[0], "precio": precio, "corrida": corrida,
                             "pares": int(i.get("cantidad") or 0)})
    sin_costo = len([p for p in (supabase_get_all("productos?activo=eq.true&select=id,costo,precio_corrida") or [])
                     if not float(p.get("costo") or 0) and not float(p.get("precio_corrida") or 0)])
    return {"bajo_corrida": bajo, "sin_costo": sin_costo}
