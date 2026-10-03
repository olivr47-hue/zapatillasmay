import os
import json
import urllib.request
import re
import urllib.parse as _up
from fastapi import APIRouter, Request, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete, inventario_ajustar
from security import (
    require_staff, verify_token, bearer_opcional, es_personal,
    payload_opcional, exigir_personal_o_dueno, limpiar_dict, AUTH_ENFORCE,
)
from cache import cache_get, cache_set, TTL_FEEDS

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

_UUID_RE = re.compile(r"^[0-9a-fA-F-]{36}$")

# Campos que solo el personal puede fijar al crear/editar un pedido: pagos, envío,
# marketplaces, apartados, etc. Un cliente (tienda anónima o portal) que los mande
# se ignoran -- antes se guardaban tal cual (ej. status='pagado', total=1).
_CAMPOS_SOLO_STAFF = {
    "id", "created_at", "mp_preference_id", "mp_payment_id", "comprobante_url", "fecha_pago",
    "confirmado_at", "anticipo", "dias_apartado", "apartado_hasta", "paqueteria", "numero_guia",
    "tracking_url", "enviado_at", "ml_order_id", "walmart_order_id", "shein_order_id", "empleado",
    "sucursal_id", "cargo_extra", "cargo_extra_concepto", "pagos_detalle", "monto_credito",
    "recordatorio_pago_enviado_at", "tipo",
}
_STATUS_CLIENTE_OK = {"borrador", "pendiente_pago"}
_CANALES_CLIENTE_OK = {"", "web", "portal_mayoreo"}
_FORMAS_PAGO_CLIENTE_OK = {"transferencia", "tarjeta", "oxxo", "spei", "mercadopago"}
_CAMPOS_ITEM_SOLO_STAFF = {"id", "pedido_id", "reservado", "solicitud_apartar", "solicitud_liberar"}
# Estados en los que el cliente dueño todavía puede tocar/cancelar su pedido.
_STATUS_EDITABLE_CLIENTE = {"borrador", "pendiente_pago", "checkout_iniciado", "apartado"}


def _cliente_de_pedido(pedido_id):
    if not _UUID_RE.match(str(pedido_id or "")):
        return None
    rows = supabase_get(f"pedidos?id=eq.{pedido_id}&select=cliente_id&limit=1")
    return rows[0].get("cliente_id") if rows else None


def _exigir_dueno_pedido(pedido_id, credentials):
    """Personal, o el cliente dueño del pedido. Se llama ANTES del try de cada ruta
    (el `except Exception` de las rutas convertiría el 401/403 en un 500)."""
    if not AUTH_ENFORCE:
        return {"_auth": "disabled"}
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticacion requerida")
    payload = verify_token(credentials.credentials)   # 401 si es inválido/expirado
    if es_personal(payload):
        return payload                                 # personal: sin consultar la BD
    return exigir_personal_o_dueno(_cliente_de_pedido(pedido_id), credentials)


def _cliente_sin_whatsapp(cliente_id):
    """True si el cliente no tiene un teléfono de 10 dígitos guardado (sin él, un apartado o
    pedido llega al panel sin forma de contactar a la clienta)."""
    if not cliente_id:
        return True
    rows = supabase_get(f"clientes?id=eq.{cliente_id}&select=telefono&limit=1") or [{}]
    d = re.sub(r"\D", "", str(rows[0].get("telefono") or ""))
    return len(d) < 10


_MSG_SIN_WHATSAPP = "Necesitamos tu WhatsApp para continuar. Agrégalo en Mi cuenta e intenta de nuevo."


def _es_staff_cred(credentials):
    p = payload_opcional(credentials)
    return bool(p) and es_personal(p)


def _quien(payload):
    """Nombre legible de quien hizo un cambio (para la bitácora del pedido)."""
    if not payload:
        return "sistema"
    if es_personal(payload):
        return str(payload.get("nombre") or payload.get("email") or "personal")[:60]
    return "cliente"


def _historial(pedido_id, accion, detalle=None, quien=None):
    """Bitácora del pedido: quién cambió qué y cuándo. Nunca debe romper la operación que la llama."""
    try:
        supabase_post("pedido_historial", {
            "pedido_id": pedido_id, "accion": str(accion)[:60],
            "detalle": (str(detalle)[:500] if detalle else None), "usuario": quien,
        })
    except Exception as e:
        print(f"[pedidos] no se pudo guardar el historial: {e}")


def _avisar_envio_whatsapp(p, paqueteria, guia):
    """Plantilla aprobada 'aviso_envio' al cliente. Se manda DESDE EL SERVIDOR: antes la mandaba el panel solo si el pedido traía
    teléfono propio, así que a los mayoristas (cuyo teléfono está en su ficha de cliente) nunca les llegaba, y tampoco
    habría funcionado al marcar varios pedidos a la vez."""
    try:
        tel = (p.get("telefono_cliente") or "").strip()
        nombre = (p.get("nombre_cliente") or "").strip()
        cid = p.get("cliente_id")
        if cid and (not tel or not nombre):
            c = (supabase_get(f"clientes?id=eq.{cid}&select=nombre,telefono") or [{}])[0]
            tel = tel or (c.get("telefono") or "").strip()
            nombre = nombre or (c.get("nombre") or "").strip()
        if not tel or p.get("canal") in ("mercadolibre", "shein", "walmart", "amazon"):
            return False
        from telefonos import a_e164_mx
        from routers.chatbot import enviar_whatsapp_plantilla
        corto = nombre.split()[0] if nombre else "Cliente"
        pid6 = str(p["id"])[-6:]
        wamid = enviar_whatsapp_plantilla(a_e164_mx(tel), "aviso_envio", "es_MX", [corto, pid6, guia, paqueteria])
        if wamid:
            supabase_post("conversaciones_whatsapp", {
                "telefono": a_e164_mx(tel),
                "mensaje": f"[Sistema]: Aviso de envío #{pid6} — {paqueteria} {guia}",
                "respuesta": None, "tipo": "plantilla_saliente", "wa_message_id": wamid, "leido": True,
            })
        return bool(wamid)
    except Exception as e:
        print(f"[pedidos] aviso de envío por WhatsApp falló: {e}")
        return False


def _pisos_por_variante(variante_ids):
    """variante_id -> precio mínimo legítimo (por par) de su producto: el menor entre
    todos los precios del catálogo y menudeo-100 (la corrida estimada cuando no está
    capturada). Ningún precio legítimo de tienda/portal queda por debajo de esto."""
    ids = [v for v in {str(v) for v in variante_ids if v} if _UUID_RE.match(v)]
    if not ids:
        return {}
    vs = supabase_get(f"variantes?id=in.({','.join(ids)})&select=id,producto_id") or []
    prod_ids = list({v["producto_id"] for v in vs if v.get("producto_id")})
    prods = {}
    if prod_ids:
        for pr in supabase_get(
            f"productos?id=in.({','.join(prod_ids)})"
            "&select=id,precio_menudeo,precio_mayoreo,precio_mayoreo3,precio_mayoreo6,precio_corrida"
        ) or []:
            prods[pr["id"]] = pr
    pisos = {}
    for v in vs:
        pr = prods.get(v.get("producto_id"))
        if not pr:
            continue
        tiers = []
        for k in ("precio_menudeo", "precio_mayoreo", "precio_mayoreo3", "precio_mayoreo6", "precio_corrida"):
            try:
                fv = float(pr.get(k))
                if fv > 0:
                    tiers.append(fv)
            except (TypeError, ValueError):
                pass
        try:
            if float(pr.get("precio_menudeo")) > 100:
                tiers.append(float(pr["precio_menudeo"]) - 100)
        except (TypeError, ValueError):
            pass
        if tiers:
            pisos[v["id"]] = max(1.0, min(tiers))
    return pisos


def _sanear_items_cliente(items):
    """Items de un cliente (no personal): cantidad entera >= 1 y precio nunca por
    debajo del piso del catálogo. Devuelve la lista limpia o lanza ValueError."""
    pisos = _pisos_por_variante([it.get("variante_id") for it in items])
    limpios = []
    for it in items:
        it = {k: v for k, v in dict(it).items() if k not in _CAMPOS_ITEM_SOLO_STAFF}
        vid = it.get("variante_id")
        try:
            cant = int(it.get("cantidad") or 1)
            precio = float(it.get("precio_unitario") or 0)
        except (TypeError, ValueError):
            raise ValueError("Cantidad o precio inválido")
        if cant < 1 or cant > 1000:
            raise ValueError("Cantidad inválida")
        piso = pisos.get(str(vid)) if vid else None
        if piso is None:
            raise ValueError("Producto no encontrado")
        if precio < piso:
            precio = piso
        it = limpiar_dict(it)
        it["cantidad"] = cant
        it["precio_unitario"] = round(precio, 2)
        if "subtotal" in it:
            it["subtotal"] = round(cant * precio, 2)
        limpios.append(it)
    return limpios


def _credito_aplicado_a_pedido(pedido_id):
    try:
        rows = supabase_get(f"clientes_creditos_historial?pedido_id=eq.{pedido_id}&tipo=eq.aplicado_pedido&select=monto") or []
        return -sum(float(r.get("monto") or 0) for r in rows)
    except Exception:
        return 0.0


def _otorgar_bono_referidor(cliente_id):
    try:
        from routers.referidos import otorgar_bono_referidor
        otorgar_bono_referidor(cliente_id)
    except Exception as e:
        print(f"[pedidos] Error bono referido: {e}")


@router.get("/pares-vendidos-total")
def pares_vendidos_total():
    """Total de pedidos reales (sin cancelados/borradores/checkout_iniciado)
    -- usado para el contador de confianza del sitio público ("+X pedidos").
    Se cuenta por pedido y no por par: un solo pedido de mayoreo puede traer
    decenas de pares y dispararía el número de forma poco realista. Cacheado 1h."""
    cache_key = "pedidos_pares_vendidos_total"
    cached = cache_get(cache_key)
    if cached is not None:
        return cached
    try:
        pedidos = supabase_get_all(
            "pedidos?status=not.in.(cancelado,borrador,checkout_iniciado)&select=id"
        )
        resultado = {"total_pedidos": len(pedidos)}
        cache_set(cache_key, resultado, ttl=TTL_FEEDS)
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def _enviar_confirmacion_wa(pedido_data, items_data):
    """Envia confirmacion de venta por WhatsApp al cliente. Nunca lanza excepcion al caller."""
    try:
        cliente_id = pedido_data.get("cliente_id")
        if not cliente_id:
            return

        cliente = supabase_get(f"clientes?id=eq.{cliente_id}&select=nombre,telefono")
        if not cliente or not cliente[0].get("telefono"):
            return

        nombre = cliente[0].get("nombre", "")
        telefono = cliente[0]["telefono"].strip().replace(" ", "").replace("-", "").replace("+", "")
        # Asegurar formato internacional Mexico
        if not telefono.startswith("52") and len(telefono) == 10:
            telefono = "52" + telefono

        # Plantilla primero (categoria UTILITY, sin restriccion de ventana de 24h) --
        # el texto libre de mas abajo SOLO se entrega si el cliente escribio en las
        # ultimas 24h, y no hay forma de saberlo de antemano (Meta lo acepta con 200
        # OK al momento y lo rechaza DESPUES via webhook async: error 131047
        # "Re-engagement message" cuando ya paso la ventana). Si no hay plantilla
        # configurada (o Meta aun no la aprueba), sigue igual que antes.
        plantilla = os.environ.get("WA_PEDIDO_CONFIRMADO_TEMPLATE", "").strip()
        if plantilla:
            try:
                from routers.chatbot import enviar_whatsapp_plantilla
                idioma_plantilla = os.environ.get("WA_PEDIDO_CONFIRMADO_TEMPLATE_LANG", "es_MX").strip() or "es_MX"
                nombre_corto_tpl = nombre.split()[0] if nombre else "Cliente"
                pedido_id_corto = str(pedido_data.get("id", ""))[:8].upper()
                total_tpl = pedido_data.get("total", 0)
                wamid = enviar_whatsapp_plantilla(
                    telefono, plantilla, idioma_plantilla,
                    [nombre_corto_tpl, pedido_id_corto, f"{total_tpl:,.0f}"]
                )
                if wamid:
                    print(f"WA confirmacion (plantilla) enviada a {telefono} ({nombre})")
                    try:
                        supabase_post("conversaciones_whatsapp", {
                            "telefono": telefono,
                            "mensaje": f"[Sistema]: Confirmación de pedido #{pedido_id_corto} — plantilla '{plantilla}' (${total_tpl:,.0f})",
                            "respuesta": None,
                            "tipo": "plantilla_saliente",
                            "wa_message_id": wamid,
                            "leido": True,
                        })
                    except Exception as e:
                        print(f"WA confirmacion: no se pudo guardar en conversaciones_whatsapp (no critico): {e}")
                    return
            except Exception as e:
                print(f"WA confirmacion: fallo plantilla, se intenta texto libre: {e}")

        lineas = []
        for item in items_data:
            nombre_prod = ""
            if item.get("variantes") and isinstance(item["variantes"], dict):
                prod = item["variantes"].get("productos")
                if isinstance(prod, dict):
                    nombre_prod = prod.get("nombre", "")
            if not nombre_prod:
                nombre_prod = item.get("nombre_producto", "Producto")
            cantidad = item.get("cantidad", 1)
            precio = item.get("precio_unitario", 0)
            lineas.append(f"  • {nombre_prod} x{cantidad} — ${precio:,.0f}")

        items_txt = "\n".join(lineas) if lineas else "  • Ver detalle en tienda"
        total = pedido_data.get("total", 0)
        nombre_corto = nombre.split()[0] if nombre else "Cliente"

        mensaje = (
            f"¡Hola {nombre_corto}! \U0001f460\n\n"
            f"Tu compra en *Zapatillas May* está confirmada:\n\n"
            f"{items_txt}\n\n"
            f"*Total pagado: ${total:,.0f}*\n\n"
            f"¡Gracias por tu preferencia! \U0001f64f"
        )

        wa_token = os.environ.get("WHATSAPP_TOKEN", "")
        phone_id = os.environ.get("WHATSAPP_PHONE_ID", "")
        if not wa_token or not phone_id:
            print("WA confirmacion: sin credenciales configuradas")
            return

        url = f"https://graph.facebook.com/v25.0/{phone_id}/messages"
        headers = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}
        body = json.dumps({
            "messaging_product": "whatsapp",
            "to": telefono,
            "type": "text",
            "text": {"body": mensaje}
        }).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        with urllib.request.urlopen(req) as r:
            resp = json.loads(r.read())
        wamid = resp.get("messages", [{}])[0].get("id", "")
        print(f"WA confirmacion enviada a {telefono} ({nombre})")
        try:
            supabase_post("conversaciones_whatsapp", {
                "telefono": telefono,
                "mensaje": f"[Sistema]: {mensaje}",
                "respuesta": None,
                "tipo": "texto_saliente",
                "wa_message_id": wamid,
                "leido": True,
            })
        except Exception as e:
            print(f"WA confirmacion: no se pudo guardar en conversaciones_whatsapp (no critico): {e}")
    except Exception as e:
        print(f"WA confirmacion error (no critico): {e}")


_SELECT_PEDIDOS_COMPLETO = "*,clientes(nombre,telefono,email),sucursales(nombre),pedido_items(*)"
# Para pantallas que solo calculan totales/estadísticas (dashboard, CRM, clientes...): sin renglones ni sucursal.
_SELECT_PEDIDOS_LIGERO = (
    "id,cliente_id,status,total,created_at,confirmado_at,canal,forma_pago,mp_preference_id,mp_payment_id,"
    "empleado,nombre_cliente,ml_order_id,shein_order_id,walmart_order_id,clientes(nombre)"
)
# Estados "abiertos": aunque el pedido sea viejo, hay que seguir viéndolo (cobrar, surtir, apartados...).
_ESTADOS_ABIERTOS = "(pendiente_pago,pagado,apartado,checkout_iniciado,borrador)"


@router.get("/")
def listar_pedidos(status: str = None, ligero: bool = False, dias: int = None, _staff=Depends(require_staff)):
    """Lista de pedidos para el panel.
    - ligero=true: solo los campos para estadísticas (sin renglones): decenas de veces menos datos.
    - dias=N: pedidos de los últimos N días MÁS todos los abiertos (pendiente de pago, pagados por surtir,
      apartados, a crédito) sin importar su antigüedad.
    Antes devolvía TODO con supabase_get (tope silencioso de 1000 filas): con más de 1000 pedidos el panel
    perdía los más viejos sin avisar; ahora pagina completo."""
    try:
        filtro = f"&status=eq.{_up.quote(str(status), safe='')}" if status else ""
        if dias:
            import datetime as _dtm
            corte = (_dtm.datetime.now(_dtm.timezone.utc) - _dtm.timedelta(days=int(dias))).strftime("%Y-%m-%dT%H:%M:%SZ")
            filtro += f"&or=(created_at.gte.{corte},confirmado_at.gte.{corte},status.in.{_ESTADOS_ABIERTOS},forma_pago.eq.credito)"
        sel = _SELECT_PEDIDOS_LIGERO if ligero else _SELECT_PEDIDOS_COMPLETO
        filas = supabase_get_all(f"pedidos?order=created_at.desc{filtro}&select={sel}")
        # Una venta cuenta el día que se CERRÓ, no el día que se abrió el carrito/apartado: así la venta de hoy sale hasta arriba
        # aunque el apartado tenga semanas. Los días de apartado se siguen contando desde created_at.
        filas.sort(key=lambda r: r.get("confirmado_at") or r.get("created_at") or "", reverse=True)
        return filas
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/por-enviar-resumen")
def por_enviar_resumen(_staff=Depends(require_staff)):
    """Solo id, cliente y total de los pedidos pagados online/marketplace pendientes de surtir (lo que
    necesita el badge/aviso del panel). El panel sondeaba cada 30 s `/pedidos/?status=pagado`, que trae
    TODOS los pagados con sus renglones, clientes y sucursales: un payload que crece con el historial."""
    try:
        return supabase_get_all(
            "pedidos?status=eq.pagado"
            "&or=(mp_preference_id.not.is.null,mp_payment_id.not.is.null,canal.eq.mercadolibre,canal.eq.shein,canal.eq.walmart,canal.eq.amazon)"
            "&select=id,nombre_cliente,total,canal&order=created_at.desc"
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/apartados")
def listar_apartados(_staff=Depends(require_staff)):
    try:
        return supabase_get("pedidos?status=eq.apartado&order=created_at.desc&select=*,clientes(nombre,telefono,email),sucursales(nombre),pedido_items(*,variantes(*,productos(nombre,imagen_principal)))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# OJO: estas rutas de un solo segmento (/solicitudes-*) deben ir ANTES de
# @router.get("/{id}") -- FastAPI hace match por orden de definicion, así
# que si quedan después, "/pedidos/solicitudes-total" se interpreta como
# id="solicitudes-total" y truena con "invalid input syntax for type uuid".
# (Bug real que tuvo el badge de Carritos sin datos hasta este fix.)
@router.get("/solicitudes-liberacion")
def listar_solicitudes_liberacion(_staff=Depends(require_staff)):
    """Ítems apartados que la clienta pidió quitar -- pendientes de aprobar/negar en el panel."""
    try:
        rows = supabase_get(
            "pedido_items?solicitud_liberar=eq.true"
            "&select=*,variantes(*,productos(nombre,imagen_principal)),"
            "pedidos(id,nombre_cliente,cliente_id,clientes(nombre,telefono))"
        ) or []
        return {"solicitudes": rows, "total": len(rows)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/solicitudes-total")
def solicitudes_total(_staff=Depends(require_staff)):
    """Conteo liviano de solicitudes pendientes (apartar + liberar) para el
    badge de "Carritos" en el menú del panel -- se sondea cada rato desde
    cualquier pantalla, así que no trae el detalle completo."""
    try:
        apartar = supabase_get("pedido_items?solicitud_apartar=eq.true&reservado=eq.false&select=id") or []
        liberar = supabase_get("pedido_items?solicitud_liberar=eq.true&reservado=eq.true&select=id") or []
        return {"total": len(apartar) + len(liberar)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/{id}/confirmar-deposito")
def confirmar_deposito(id: str, datos: dict, _staff=Depends(require_staff)):
    """Convierte un apartado en pedido confirmado y descuenta inventario."""
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        if pedido[0].get("status") != "apartado":
            return JSONResponse(status_code=400, content={"error": "Solo se pueden confirmar apartados"})
        items = supabase_get(f"pedido_items?pedido_id=eq.{id}&select=*,variantes(*,productos(nombre))")
        sucursal_id = pedido[0].get("sucursal_id")
        for item in items:
            variante_id = item.get("variante_id")
            cantidad = item.get("cantidad", 1)
            if variante_id and sucursal_id:
                # ajuste ATÓMICO (función SQL ajustar_inventario): dos ventas simultáneas ya no se pisan
                _aj = inventario_ajustar(variante_id, sucursal_id, -cantidad)
                if _aj:
                    supabase_post("movimientos_inventario", {
                        "tipo": "venta",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -cantidad,
                        "motivo": f"Confirmación apartado {id}"
                    })
        forma_pago = datos.get("forma_pago", pedido[0].get("forma_pago", "efectivo"))
        import datetime as _dt
        supabase_patch(f"pedidos?id=eq.{id}", {
            "status": "confirmado", "forma_pago": forma_pago,
            "confirmado_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        })
        _enviar_confirmacion_wa(pedido[0], items)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/cerrar-apartado")
def cerrar_apartado(id: str, datos: dict, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    """La clienta cierra su apartado desde el portal y elige cómo va a pagar.
    No toca inventario (ya se descontó al aprobar el apartado) -- solo pasa el
    pedido a pendiente_pago con la forma de pago elegida. El pago real se
    confirma aparte: por transferencia el dueño lo checa manual, por tarjeta
    el webhook de MercadoPago lo marca al aprobarse.

    Importante: además quita la marca "[carrito-respaldo]" de notas. Ese
    pedido deja de ser "el carrito en vivo" y se convierte en un pedido real
    cerrado -- si se dejara la marca, el portal lo seguiría tratando como el
    carrito activo (reutilizándolo para lo próximo que agregue la clienta) y
    a la vez el cliente lo vería listado en "Mis pedidos" con status
    desincronizado."""
    _exigir_dueno_pedido(id, credentials)
    try:
        forma_pago = (datos.get("forma_pago") or "").strip()
        if forma_pago not in ("transferencia", "tarjeta"):
            return JSONResponse(status_code=400, content={"error": "forma_pago debe ser 'transferencia' o 'tarjeta'"})
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        if pedido[0].get("status") != "apartado":
            return JSONResponse(status_code=400, content={"error": "Solo se puede cerrar un pedido que ya está apartado"})
        update = {"status": "pendiente_pago", "forma_pago": forma_pago}
        if pedido[0].get("notas") == "[carrito-respaldo]":
            update["notas"] = None
        supabase_patch(f"pedidos?id=eq.{id}", update)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/pendientes")
def pedidos_pendientes(_staff=Depends(require_staff)):
    """Pedidos con pago pendiente (OXXO/SPEI) — para el panel de seguimiento."""
    import datetime as _dt
    try:
        rows = supabase_get(
            "pedidos?status=eq.pendiente_pago"
            "&select=id,created_at,total,forma_pago,email_cliente,nombre_cliente,telefono_cliente,recordatorio_pago_enviado_at"
            "&order=created_at.desc&limit=200"
        ) or []
        ahora = _dt.datetime.now(_dt.timezone.utc)
        for p in rows:
            try:
                creado = _dt.datetime.fromisoformat(p["created_at"].replace("Z", "+00:00"))
                p["horas_pendiente"] = round((ahora - creado).total_seconds() / 3600, 1)
            except Exception:
                p["horas_pendiente"] = None
        return {"ok": True, "pedidos": rows, "total": len(rows)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def _get_pedido_pendiente(id: str):
    rows = supabase_get(f"pedidos?id=eq.{id}&select=*&limit=1")
    if not rows:
        return None, JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
    p = rows[0]
    if p.get("status") != "pendiente_pago":
        return None, JSONResponse(status_code=400, content={"error": "El pedido no está pendiente de pago"})
    return p, None

def _marcar_recordatorio(id: str):
    import datetime as _dt
    try:
        supabase_patch(f"pedidos?id=eq.{id}", {"recordatorio_pago_enviado_at": _dt.datetime.now(_dt.timezone.utc).isoformat()})
    except Exception:
        pass

@router.post("/{id}/recordatorio-email")
def recordatorio_email(id: str, datos: dict = {}, _staff=Depends(require_staff)):
    """Envía recordatorio de pago por email. Acepta mensaje personalizado en datos.mensaje."""
    try:
        from email_utils import enviar_email, email_pedido_pendiente_spei, _base_html
        p, err = _get_pedido_pendiente(id)
        if err: return err
        email_cliente = p.get("email_cliente", "")
        if not email_cliente:
            return JSONResponse(status_code=400, content={"error": "El pedido no tiene email"})

        msg_personalizado = (datos.get("mensaje") or "").strip()
        if msg_personalizado:
            nombre = (p.get("nombre_cliente") or "Clienta").split()[0].capitalize()
            pedido_id = str(p.get("id") or "")[:8].upper()
            # Convertir saltos de línea a HTML
            parrafos = "".join(f'<p style="color:#555;font-size:0.92rem;line-height:1.6;margin-bottom:12px">{l}</p>'
                               for l in msg_personalizado.split("\n") if l.strip())
            contenido = f'<h2 style="color:#2A1A0E;font-size:1.3rem;margin-bottom:16px">Hola {nombre} 😊</h2>{parrafos}'
            subj = f"Tu pedido #{pedido_id} · Zapatillas May"
            html = _base_html(contenido)
        else:
            subj, html = email_pedido_pendiente_spei(p)

        ok = enviar_email(email_cliente, subj, html, tipo="recordatorio_pago")
        if not ok:
            return JSONResponse(status_code=502, content={"error": "El correo no se pudo enviar — revisa el registro de correo en el panel."})
        _marcar_recordatorio(id)
        return {"ok": True, "enviado_a": email_cliente}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/recordatorio-whatsapp")
def recordatorio_whatsapp(id: str, datos: dict = {}, _staff=Depends(require_staff)):
    """
    Envía recordatorio de pago por WhatsApp usando una plantilla UTILITY aprobada.
    Los mensajes de texto libre fallan con error 131047 si el cliente no respondió en 24h.
    datos.plantilla = nombre de la plantilla a usar (default: recordatorio_pago_pendiente)
    datos.idioma    = código de idioma (default: es_MX)
    """
    try:
        from routers.chatbot import enviar_whatsapp_plantilla
        p, err = _get_pedido_pendiente(id)
        if err: return err
        tel_cliente    = p.get("telefono_cliente", "")
        nombre_cliente = p.get("nombre_cliente", "Cliente")
        metodo = (p.get("forma_pago") or "OXXO/SPEI").upper()
        total  = p.get("total", 0)
        if not tel_cliente:
            return JSONResponse(status_code=400, content={"error": "El pedido no tiene teléfono"})
        tel_limpio = "52" + tel_cliente.replace("+52","").replace("+","").strip().replace(" ","").replace("-","")
        nombre_corto = (nombre_cliente.split()[0] if nombre_cliente else "Cliente").capitalize()

        plantilla = (datos.get("plantilla") or "recordatorio_pago_pendiente").strip()
        idioma    = (datos.get("idioma")    or "es_MX").strip()

        wamid = enviar_whatsapp_plantilla(
            tel_limpio, plantilla, idioma,
            [nombre_corto, f"{float(total):.0f}", metodo]
        )
        if not wamid:
            return JSONResponse(status_code=500, content={
                "error": (
                    f"Meta rechazó el mensaje. Verifica que la plantilla '{plantilla}' "
                    "esté APROBADA en Meta Business. "
                    "Los mensajes de texto libre fallan si han pasado más de 24h desde la última respuesta del cliente (error 131047)."
                ),
                "code": "TEMPLATE_ERROR"
            })
        _marcar_recordatorio(id)
        return {"ok": True, "enviado_a": tel_limpio, "plantilla": plantilla}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Mantener endpoint combinado por compatibilidad
@router.post("/{id}/recordatorio-pago")
def enviar_recordatorio_pago(id: str, _staff=Depends(require_staff)):
    try:
        from email_utils import enviar_email, email_pedido_pendiente_spei
        p, err = _get_pedido_pendiente(id)
        if err: return err
        email_cliente = p.get("email_cliente", "")
        if not email_cliente:
            return JSONResponse(status_code=400, content={"error": "El pedido no tiene email"})
        subj, html = email_pedido_pendiente_spei(p)
        ok = enviar_email(email_cliente, subj, html, tipo="pedido_pendiente_spei")
        if not ok:
            return JSONResponse(status_code=502, content={"error": "El correo no se pudo enviar — revisa el registro de correo en el panel."})
        _marcar_recordatorio(id)
        return {"ok": True, "email": email_cliente}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/canal/{canal}")
def pedidos_por_canal(canal: str, _staff=Depends(require_staff)):
    try:
        return supabase_get(f"pedidos?canal=eq.{canal}&select=*,clientes(nombre,telefono)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/{id}")
def obtener_pedido(id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    _exigir_dueno_pedido(id, credentials)
    try:
        return supabase_get(f"pedidos?id=eq.{id}&select=*,clientes(nombre,telefono,email),sucursales(nombre),pedido_items(*,variantes(*,productos(nombre,sku_interno,imagen_principal)))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/")
def crear_pedido(pedido: dict, request: Request):
    _credito_debitado = False   # para devolver el saldo si el pedido no llega a crearse
    _credito_cli_g = None
    _credito_monto_g = 0.0
    _credito_saldo_original = 0.0
    try:
        # Si viene un token de cliente válido (portal mayorista logueado), el
        # cliente_id SIEMPRE se toma del token, nunca de lo que mande el body --
        # si no, un cliente logueado podría armar un pedido a nombre de otro
        # cliente_id con solo cambiar el JSON. El checkout anónimo de la tienda
        # (menudeo, sin login) sigue igual: sin token, se respeta el body tal cual.
        auth_header = request.headers.get("authorization", "")
        _es_staff = False
        _cliente_verificado = False   # cliente_id respaldado por un token válido
        if auth_header.lower().startswith("bearer "):
            try:
                token_payload = verify_token(auth_header[7:])
                _es_staff = es_personal(token_payload)
                if token_payload.get("cliente_id") and not _es_staff:
                    pedido["cliente_id"] = token_payload["cliente_id"]
                    _cliente_verificado = True
            except Exception:
                pass  # token inválido/expirado -> se trata como anónimo, no se bloquea el checkout

        # Un cliente (tienda anónima o portal) nunca fija pagos/envío/marketplaces, ni crea
        # pedidos ya "confirmados", ni se salta el chequeo de stock eligiendo otro canal,
        # ni paga menos que el catálogo: se sanea todo aquí, en el servidor.
        if not _es_staff:
            for _k in list(pedido.keys()):
                if _k in _CAMPOS_SOLO_STAFF:
                    pedido.pop(_k, None)
            if pedido.get("status") not in _STATUS_CLIENTE_OK:
                pedido["status"] = "borrador"
            if (_cliente_verificado and pedido.get("canal") == "portal_mayoreo"
                    and pedido.get("status") == "pendiente_pago" and _cliente_sin_whatsapp(pedido.get("cliente_id"))):
                return JSONResponse(status_code=400, content={"error": _MSG_SIN_WHATSAPP, "code": "TELEFONO_REQUERIDO"})
            if (pedido.get("canal") or "") not in _CANALES_CLIENTE_OK:
                pedido["canal"] = "web"
            if pedido.get("forma_pago") not in _FORMAS_PAGO_CLIENTE_OK:
                pedido.pop("forma_pago", None)
            _items_raw = pedido.pop("items", None)
            pedido.update(limpiar_dict(pedido))
            if _items_raw:
                pedido["items"] = _items_raw
            if pedido.get("items"):
                try:
                    pedido["items"] = _sanear_items_cliente(pedido["items"])
                except ValueError as ve:
                    return JSONResponse(status_code=400, content={"error": str(ve)})
                _suma_items = sum(i["cantidad"] * i["precio_unitario"] for i in pedido["items"])
                # el total puede ser MAYOR (envío) pero nunca menor que la suma real de ítems
                pedido["total"] = round(max(float(pedido.get("total") or 0), _suma_items), 2)
                # La tienda mandaba el envío SOLO dentro del total (costo_envio quedaba en 0): "Mi cuenta" decía "Envío: Gratis"
                # y los reportes de envíos salían incompletos. La diferencia total - ítems es el envío cobrado.
                _envio_cobrado = round(pedido["total"] - _suma_items, 2)
                if _envio_cobrado > 0 and not float(pedido.get("costo_envio") or 0):
                    pedido["costo_envio"] = _envio_cobrado

        # Aplicar saldo a favor (nota de credito / referidos) si el cliente lo
        # pidio: el monto SIEMPRE se revalida aqui contra credito_disponible
        # real en la BD -- nunca se confia en el numero que mande el frontend,
        # para que nadie pueda descontarse mas credito del que en verdad tiene
        # con solo cambiar el JSON. Antes esto se mostraba en el carrito del
        # portal como descuento pero nunca se restaba del total que se cobraba
        # de verdad -- era puramente decorativo.
        _credito_aplicado = 0.0
        _credito_cliente_id = pedido.get("cliente_id")
        _saldo_real = 0.0
        # Solo con cliente_id respaldado por token (o personal): un anónimo que manda un
        # cliente_id ajeno en el body NO puede gastar el saldo de esa persona.
        if _credito_cliente_id and pedido.get("credito_aplicado") and (_cliente_verificado or _es_staff):
            try:
                _solicitado = float(pedido.get("credito_aplicado") or 0)
                _cli_rows = supabase_get(f"clientes?id=eq.{_credito_cliente_id}&select=credito_disponible")
                _saldo_real = float((_cli_rows[0].get("credito_disponible") if _cli_rows else 0) or 0)
                _credito_aplicado = max(0.0, min(_solicitado, _saldo_real, float(pedido.get("total") or 0)))
                if _credito_aplicado > 0:
                    # Compare-and-swap: solo descuenta si el saldo sigue siendo el que leímos
                    # (dos pedidos simultáneos ya no pueden gastar el mismo saldo dos veces).
                    _cas = supabase_patch(
                        f"clientes?id=eq.{_credito_cliente_id}&credito_disponible=eq.{_saldo_real:.2f}",
                        {"credito_disponible": round(_saldo_real - _credito_aplicado, 2)},
                    )
                    if _cas:
                        _credito_debitado = True
                        _credito_cli_g = _credito_cliente_id
                        _credito_monto_g = _credito_aplicado
                        _credito_saldo_original = _saldo_real
                        pedido["total"] = float(pedido.get("total") or 0) - _credito_aplicado
                    else:
                        _credito_aplicado = 0.0
            except Exception:
                _credito_aplicado = 0.0
        pedido.pop("credito_aplicado", None)  # nunca es columna real de pedidos

        # Idempotencia del carrito-respaldo del portal: si ya existe un borrador
        # de este tipo para el cliente, se reusa en vez de crear uno duplicado.
        # Sin esto, dos dispositivos del mismo cliente que nunca se habían
        # sincronizado entre sí (ej. agrega en la PC y en el celular sin haber
        # cargado antes el portal en el otro) creaban CADA UNO su propio
        # borrador -- cada dispositivo se quedaba escribiendo para siempre en su
        # copia, sin ver nunca lo que agregaba el otro. Es el bug real detrás de
        # "lo que agrego en la PC no aparece en el celular, y viceversa".
        if (pedido.get("status") == "borrador" and pedido.get("canal") == "portal_mayoreo"
                and pedido.get("notas") == "[carrito-respaldo]" and pedido.get("cliente_id")):
            existentes = supabase_get(
                f"pedidos?cliente_id=eq.{pedido['cliente_id']}&status=eq.borrador"
                "&canal=eq.portal_mayoreo&select=id,notas"
            ) or []
            existente = next((p for p in existentes if p.get("notas") == "[carrito-respaldo]"), None)
            if existente:
                return existente

        items = pedido.pop("items", [])
        # Capturar IP real del cliente para CAPI de Meta
        ip = (
            request.headers.get("x-forwarded-for", "").split(",")[0].strip()
            or request.headers.get("x-real-ip", "")
            or (request.client.host if request.client else "")
        )
        if ip and not pedido.get("client_ip_address"):
            pedido["client_ip_address"] = ip
        # Los campos de atribución/rastreo (ga_client_id, fbc, fbp, fbclid, gclid,
        # client_user_agent, client_ip_address, ciudad/estado/cp) ahora SÍ se
        # persisten como columnas, para que el webhook de pago —que relee el pedido
        # desde la BD— pueda reenviarlos en el Purchase server-side (Meta CAPI + GA4 MP)
        # y recuperar la fuente original de la conversión.
        canal = pedido.get("canal") or ""
        status_nuevo = pedido.get("status") or ""
        # Pedidos de tienda online deben traer ítems; si llegan vacíos es un error
        # del cliente. Excepción: los BORRADORES (carritos) pueden nacer vacíos y
        # llenarse con /items después -- es justo lo que hace el respaldo del
        # carrito del portal y el carrito compartido creado desde el panel; sin
        # esto, esos borradores se rechazaban con 400 y el respaldo fallaba callado.
        if not items and canal not in ("sucursal", "whatsapp") and status_nuevo != "borrador":
            return JSONResponse(status_code=400, content={"error": "El pedido no tiene productos"})

        # Validar stock real ANTES de crear el pedido — solo para el checkout web
        # (autoservicio, nadie revisa antes de confirmar). El inventario no se
        # descuenta hasta que el pago quede aprobado (ver pagos.py), así que sin
        # este chequeo se podía comprar una variante agotada días atrás sin que
        # nada lo impidiera (pasó con un pedido real: item sin existencia desde
        # 4 días antes de la compra).
        if canal in ("web", "") and items:
            faltantes = []
            for item in items:
                variante_id = item.get("variante_id")
                if not variante_id:
                    continue
                cantidad_pedida = item.get("cantidad", 1) or 1
                inv_rows = supabase_get(f"inventario?variante_id=eq.{variante_id}&select=cantidad") or []
                disponible = sum(r.get("cantidad", 0) or 0 for r in inv_rows)
                if cantidad_pedida > disponible:
                    etiqueta = f"{item.get('nombre','Producto')} {item.get('color') or ''} talla {item.get('talla') or ''}".strip()
                    faltantes.append(f"{etiqueta} (disponibles: {disponible})")
            if faltantes:
                return JSONResponse(status_code=409, content={
                    "error": "Uno o más productos ya no tienen existencia suficiente: " + "; ".join(faltantes)
                })

        # Upsert cliente web: si no viene cliente_id pero sí email, buscar o crear en clientes
        if not pedido.get("cliente_id") and pedido.get("email_cliente"):
            try:
                email_c = pedido["email_cliente"].strip()
                tel_c   = pedido.get("telefono_cliente", "").strip()
                nombre_c = pedido.get("nombre_cliente", "").strip()
                # Solo se liga a un cliente existente si el correo/teléfono lo identifica de forma ÚNICA: hay 55 mayoristas
                # con el mismo correo genérico del negocio y antes una compra con ese correo se pegaba a uno cualquiera.
                cli_existente = supabase_get(f"clientes?email=eq.{_up.quote(email_c, safe='')}&select=id&limit=2") or []
                if len(cli_existente) != 1:
                    cli_existente = []
                if not cli_existente and tel_c:
                    cli_existente = supabase_get(f"clientes?telefono=eq.{_up.quote(tel_c, safe='')}&select=id&limit=2") or []
                    if len(cli_existente) != 1:
                        cli_existente = []
                if cli_existente:
                    pedido["cliente_id"] = cli_existente[0]["id"]
                else:
                    nuevo_cli = supabase_post("clientes", {
                        "nombre": nombre_c,
                        "email": email_c,
                        "telefono": tel_c,
                        "tipo": "menudeo",
                        "activo": True,
                        "origen": "tienda"
                    })
                    if nuevo_cli:
                        pedido["cliente_id"] = nuevo_cli[0]["id"]
            except Exception as e:
                print(f"[pedidos] Error upsert cliente web: {e}")

        # Los campos de atribución/rastreo son opcionales (analítica Meta CAPI / GA4).
        # Si PostgREST tiene el schema cache desactualizado retorna PGRST204; en ese caso
        # insertamos sin esos campos y luego hacemos PATCH para no perder la atribución.
        ATRIBUCION_KEYS = (
            "ga_client_id", "fbc", "fbp", "fbclid", "gclid",
            "client_user_agent", "client_ip_address",
            "ciudad_cliente", "estado_cliente", "cp_cliente",
            "utm_source", "utm_medium", "utm_campaign", "referrer_origen",
        )
        atribucion_para_patch = None
        try:
            resultado = supabase_post("pedidos", pedido)
        except Exception as e:
            msg = str(e)
            if "PGRST204" in msg or "schema cache" in msg:
                atribucion_para_patch = {k: v for k, v in pedido.items() if k in ATRIBUCION_KEYS and v}
                pedido_min = {k: v for k, v in pedido.items() if k not in ATRIBUCION_KEYS}
                print("[pedidos] Cache de esquema desfasado; reintentando sin campos de atribución")
                resultado = supabase_post("pedidos", pedido_min)
            else:
                raise
        if resultado and len(resultado) > 0:
            pedido_id = resultado[0]["id"]
            # Si el insert fue sin atribución (fallback), parchamos ahora para no perderla
            if atribucion_para_patch:
                try:
                    supabase_patch(f"pedidos?id=eq.{pedido_id}", atribucion_para_patch)
                    print(f"[pedidos] Atribución guardada via PATCH para pedido {pedido_id}")
                except Exception as pe:
                    print(f"[pedidos] No se pudo guardar atribución via PATCH: {pe}")
            for item in items:
                item["pedido_id"] = pedido_id
                supabase_post("pedido_items", item)
            if _credito_aplicado > 0:
                try:
                    _nuevo_saldo = round(_saldo_real - _credito_aplicado, 2)
                    supabase_post("clientes_creditos_historial", {
                        "cliente_id": _credito_cliente_id,
                        "monto": -_credito_aplicado,
                        "tipo": "aplicado_pedido",
                        "pedido_id": pedido_id,
                        "saldo_despues": _nuevo_saldo,
                    })
                except Exception as e_credito:
                    print(f"[pedidos] Error aplicando credito: {e_credito}")
            # Aviso push al panel. Los pedidos web (checkout) siempre nacen como
            # "borrador" hasta que el pago se confirma (eso avisa pagos.py); aquí
            # solo interesan los que YA llegan confirmados (mostrador/WhatsApp/
            # mayoreo manual), para no alertar por cada carrito sin pagar.
            status_creado = resultado[0].get("status")
            if status_creado not in ("borrador", "checkout_iniciado"):
                try:
                    from routers.push import enviar_push
                    nombre_cli = resultado[0].get("nombre_cliente") or "Cliente"
                    enviar_push(
                        titulo="🛍️ Nuevo pedido",
                        cuerpo=f"{nombre_cli} — ${float(resultado[0].get('total') or 0):.0f} MXN",
                        url="/?modulo=pedidos",
                        sitio="panel",
                    )
                except Exception as e_push:
                    print(f"[push] Error avisando pedido nuevo: {e_push}")
            _credito_debitado = False  # el pedido existe: el descuento de saldo ya es definitivo
            return resultado[0]
        return JSONResponse(status_code=500, content={"error": "Error creando pedido"})
    except Exception as e:
        if _credito_debitado and _credito_cli_g:
            try:  # el pedido no se creó: devolver el saldo descontado
                supabase_patch(f"clientes?id=eq.{_credito_cli_g}", {"credito_disponible": round(_credito_saldo_original, 2)})
            except Exception as e_dev:
                print(f"[pedidos] No se pudo devolver el crédito a {_credito_cli_g}: {e_dev}")
        print(f"ERROR crear_pedido: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}")
def actualizar_pedido(id: str, pedido: dict, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    _exigir_dueno_pedido(id, credentials)
    try:
        if _es_staff_cred(credentials) or not credentials:
            # (sin credentials solo llega aquí con AUTH_ENFORCE=0: despliegue seguro)
            if "status" in pedido:
                _ant = (supabase_get(f"pedidos?id=eq.{id}&select=status") or [{}])[0].get("status")
                if _ant != pedido["status"]:
                    _historial(id, "estado", f"{_ant} → {pedido['status']}", _quien(payload_opcional(credentials)))
            return supabase_patch(f"pedidos?id=eq.{id}", pedido)
        # Cliente dueño: solo datos de envío/pago de un pedido que aún no se cierra.
        actual = supabase_get(f"pedidos?id=eq.{id}&select=status,costo_envio") or [{}]
        if actual[0].get("status") not in _STATUS_EDITABLE_CLIENTE:
            return JSONResponse(status_code=403, content={"error": "El pedido ya no se puede modificar"})
        permitido = {k: v for k, v in pedido.items() if k in (
            "total", "costo_envio", "envio_pendiente_coordinar", "comentarios",
            "direccion_envio", "notas", "forma_pago")}
        if "forma_pago" in permitido and permitido["forma_pago"] not in _FORMAS_PAGO_CLIENTE_OK:
            permitido.pop("forma_pago")
        if "costo_envio" in permitido:
            try:
                permitido["costo_envio"] = max(0.0, float(permitido["costo_envio"] or 0))
            except (TypeError, ValueError):
                permitido.pop("costo_envio")
        if "total" in permitido:
            # El total nunca baja de (suma real de ítems + envío − crédito ya aplicado).
            items = supabase_get(f"pedido_items?pedido_id=eq.{id}&select=cantidad,precio_unitario") or []
            suma = sum(float(i.get("cantidad") or 0) * float(i.get("precio_unitario") or 0) for i in items)
            envio = float(permitido.get("costo_envio", actual[0].get("costo_envio")) or 0)
            piso = round(suma + envio - _credito_aplicado_a_pedido(id), 2)
            try:
                permitido["total"] = round(max(float(permitido["total"] or 0), piso), 2)
            except (TypeError, ValueError):
                permitido["total"] = piso
        permitido = limpiar_dict(permitido)
        if not permitido:
            return {"ok": True}
        return supabase_patch(f"pedidos?id=eq.{id}", permitido)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

def _recalcular_total_pedido(pedido_id):
    """Recalcula pedidos.total/subtotal desde la suma real de pedido_items --
    se llama después de agregar/editar/quitar un ítem para que no se quede
    desincronizado. La tarjeta de la lista general de Carritos (cargarCarritos
    en el panel) lee pedidos.total directo, sin sumar los items en vivo --
    si esto no corre, esa tarjeta se queda mostrando $0 aunque el carrito
    en detalle sí tenga pares (que sí se calcula en vivo ahí)."""
    try:
        items = supabase_get(f"pedido_items?pedido_id=eq.{pedido_id}&select=cantidad,precio_unitario") or []
        total = sum(float(i.get("cantidad") or 0) * float(i.get("precio_unitario") or 0) for i in items)
        supabase_patch(f"pedidos?id=eq.{pedido_id}", {"total": round(total, 2), "subtotal": round(total, 2)})
    except Exception:
        pass

@router.post("/{id}/items")
def agregar_item(id: str, item: dict, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    _exigir_dueno_pedido(id, credentials)
    try:
        if not _es_staff_cred(credentials):
            try:
                item = _sanear_items_cliente([item])[0]
            except ValueError as ve:
                return JSONResponse(status_code=400, content={"error": str(ve)})
        item["pedido_id"] = id
        # El POS mandaba solo variante/cantidad/precio: 963 renglones de sucursal quedaron sin nombre, color ni talla
        # (se veían en blanco en búsquedas, lista de surtido y reportes). Si faltan, se completan desde la variante.
        if item.get("variante_id") and not (item.get("nombre") and item.get("talla")):
            try:
                _v = (supabase_get(f"variantes?id=eq.{item['variante_id']}&select=color,talla,productos(nombre)") or [None])[0]
                if _v:
                    item["nombre"] = item.get("nombre") or ((_v.get("productos") or {}).get("nombre") or "")
                    item["color"] = item.get("color") or (_v.get("color") or "")
                    item["talla"] = item.get("talla") or (_v.get("talla") or "")
            except Exception as _e:
                print(f"[pedidos] no se pudo completar nombre/talla del item: {_e}")
        resultado = supabase_post("pedido_items", item)
        _recalcular_total_pedido(id)
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/{id}/items")
def obtener_items(id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    _exigir_dueno_pedido(id, credentials)
    try:
        return supabase_get(f"pedido_items?pedido_id=eq.{id}&select=*,variantes(*,productos(nombre,sku_interno,imagen_principal))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}/items/{item_id}")
def actualizar_item(id: str, item_id: str, datos: dict, _staff=Depends(require_staff)):
    """Modifica cantidad y/o precio de un ítem. Si el pedido está confirmado ajusta inventario."""
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        item_actual = supabase_get(f"pedido_items?id=eq.{item_id}&pedido_id=eq.{id}")
        if not item_actual:
            return JSONResponse(status_code=404, content={"error": "Ítem no encontrado"})

        cantidad_anterior = item_actual[0].get("cantidad", 0)
        nueva_cantidad = datos.get("cantidad", cantidad_anterior)
        nuevo_precio = datos.get("precio_unitario", item_actual[0].get("precio_unitario", 0))
        nuevo_subtotal = nueva_cantidad * nuevo_precio

        # Un par ya apartado (reservado) tiene su stock descontado: cambiarle la cantidad debe mover el inventario
        # igual que en un pedido confirmado (antes el apartado quedaba con stock desfasado).
        _descuenta_stock = pedido[0].get("status") in ("confirmado", "pagado") or bool(item_actual[0].get("reservado"))
        _diff = int(nueva_cantidad) - int(cantidad_anterior)
        if _descuenta_stock and _diff > 0 and item_actual[0].get("variante_id") and pedido[0].get("sucursal_id"):
            _inv = supabase_get(
                f"inventario?variante_id=eq.{item_actual[0]['variante_id']}&sucursal_id=eq.{pedido[0]['sucursal_id']}&select=cantidad"
            ) or []
            if (_inv[0]["cantidad"] if _inv else 0) < _diff:
                return JSONResponse(status_code=409, content={"error": "No hay existencia suficiente para aumentar esa cantidad"})

        supabase_patch(f"pedido_items?id=eq.{item_id}", {
            "cantidad": nueva_cantidad,
            "precio_unitario": nuevo_precio,
            "subtotal": nuevo_subtotal
        })

        # Ajustar inventario si el pedido ya estaba confirmado (o el par está apartado)
        if _descuenta_stock:
            variante_id = item_actual[0].get("variante_id")
            sucursal_id = pedido[0].get("sucursal_id")
            diff = nueva_cantidad - cantidad_anterior  # positivo = más pares (descontar), negativo = devolver
            if variante_id and sucursal_id and diff != 0:
                # ajuste ATÓMICO (función SQL ajustar_inventario): dos ventas simultáneas ya no se pisan
                _aj = inventario_ajustar(variante_id, sucursal_id, -diff)
                if _aj:
                    supabase_post("movimientos_inventario", {
                        "tipo": "ajuste",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -diff,
                        "motivo": f"Edición pedido {id}"
                    })

        _recalcular_total_pedido(id)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/{id}/items/{item_id}")
def eliminar_item(id: str, item_id: str, forzar: bool = False, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    """Elimina un ítem del pedido. Si estaba confirmado o reservado (apartado) devuelve el stock.
    Un ítem ya apartado (reservado=true) no se puede quitar sin pasar forzar=true --
    esa es la autorización del panel; el portal del cliente nunca manda ese flag, así que
    cuando la clienta intenta quitar un par ya apartado, esto la rechaza (409/RESERVADO) y
    el portal debe usar /solicitar-liberacion en su lugar."""
    _exigir_dueno_pedido(id, credentials)
    if forzar and not _es_staff_cred(credentials):
        forzar = False  # solo el personal puede forzar; un cliente nunca
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        item_actual = supabase_get(f"pedido_items?id=eq.{item_id}&pedido_id=eq.{id}")
        if not item_actual:
            return JSONResponse(status_code=404, content={"error": "Ítem no encontrado"})

        reservado = bool(item_actual[0].get("reservado"))
        if reservado and not forzar:
            return JSONResponse(status_code=409, content={
                "error": "Este par ya está apartado y no se puede quitar sin autorización.",
                "code": "RESERVADO"
            })

        cantidad = item_actual[0].get("cantidad", 0)
        supabase_delete(f"pedido_items?id=eq.{item_id}")

        # Devolver stock si ya estaba confirmado/pagado, o si el ítem estaba
        # reservado por un apartado aprobado (el stock se descontó al aprobar).
        if pedido[0].get("status") in ("confirmado", "pagado") or reservado:
            variante_id = item_actual[0].get("variante_id")
            sucursal_id = pedido[0].get("sucursal_id")
            if variante_id and sucursal_id and cantidad > 0:
                # ajuste ATÓMICO (función SQL ajustar_inventario): dos ventas simultáneas ya no se pisan
                _aj = inventario_ajustar(variante_id, sucursal_id, cantidad)
                if _aj:
                    supabase_post("movimientos_inventario", {
                        "tipo": "ajuste",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": cantidad,
                        "motivo": f"Eliminación ítem pedido {id}" + (" (apartado liberado)" if reservado else "")
                    })

        _recalcular_total_pedido(id)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/{id}/items/solicitar-apartado")
def solicitar_apartado_items(id: str, datos: dict, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    """La clienta selecciona pares específicos del carrito y pide que se
    aparten. NO descuenta stock ni reserva nada todavía -- solo marca esos
    ítems para que el dueño los vea agrupados y decida aprobarlos desde el
    panel (aprobar-apartado prioriza los que tengan esta bandera)."""
    _exigir_dueno_pedido(id, credentials)
    if not _es_staff_cred(credentials) and _cliente_sin_whatsapp(_cliente_de_pedido(id)):
        return JSONResponse(status_code=400, content={"error": _MSG_SIN_WHATSAPP, "code": "TELEFONO_REQUERIDO"})
    try:
        item_ids = datos.get("item_ids") or []
        if not item_ids:
            return JSONResponse(status_code=400, content={"error": "No se enviaron ítems"})
        marcados = 0
        for iid in item_ids:
            r = supabase_patch(f"pedido_items?id=eq.{iid}&pedido_id=eq.{id}&reservado=eq.false", {"solicitud_apartar": True})
            if r:
                marcados += 1
        if marcados:
            try:
                from routers.push import enviar_push
                pedido = supabase_get(f"pedidos?id=eq.{id}&select=*,clientes(nombre)")
                nombre_cli = (pedido[0].get("clientes") or {}).get("nombre") if pedido else None
                enviar_push(
                    titulo="🙋 Solicitud de apartado",
                    cuerpo=f"{nombre_cli or 'Una clienta'} pidió apartar {marcados} par(es)",
                    url="/?modulo=carritos",
                    sitio="panel",
                )
            except Exception as e_push:
                print(f"[push] Error avisando solicitud de apartado: {e_push}")
        return {"ok": True, "items": marcados}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/{id}/items/{item_id}/solicitar-liberacion")
def solicitar_liberacion_item(id: str, item_id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    """La clienta pide quitar un par ya apartado -- no se borra solo, queda
    marcado para que el dueño lo autorice desde el panel."""
    _exigir_dueno_pedido(id, credentials)
    try:
        item_actual = supabase_get(f"pedido_items?id=eq.{item_id}&pedido_id=eq.{id}")
        if not item_actual:
            return JSONResponse(status_code=404, content={"error": "Ítem no encontrado"})
        supabase_patch(f"pedido_items?id=eq.{item_id}", {"solicitud_liberar": True})
        try:
            from routers.push import enviar_push
            pedido = supabase_get(f"pedidos?id=eq.{id}&select=*,clientes(nombre)")
            nombre_cli = (pedido[0].get("clientes") or {}).get("nombre") if pedido else None
            enviar_push(
                titulo="⚠️ Solicitud de liberación",
                cuerpo=f"{nombre_cli or 'Una clienta'} pidió quitar un par apartado",
                url="/?modulo=carritos",
                sitio="panel",
            )
        except Exception as e_push:
            print(f"[push] Error avisando solicitud de liberación: {e_push}")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/{id}/items/{item_id}/rechazar-liberacion")
def rechazar_liberacion_item(id: str, item_id: str, _staff=Depends(require_staff)):
    """El dueño niega la solicitud de la clienta -- el par se queda apartado."""
    try:
        supabase_patch(f"pedido_items?id=eq.{item_id}&pedido_id=eq.{id}", {"solicitud_liberar": False})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})



@router.post("/{id}/aprobar-apartado")
def aprobar_apartado(id: str, datos: dict = {}, _staff=Depends(require_staff)):
    """Reserva de verdad el inventario de los pares del carrito: los descuenta
    de `inventario` y los marca reservado=true en pedido_items. El pedido pasa
    a status='apartado'. Si se llama de nuevo sobre un pedido ya apartado (p.ej.
    la clienta agregó más pares después), solo procesa los ítems nuevos --
    los ya reservados no se vuelven a descontar."""
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        p = pedido[0]
        if p.get("status") not in ("borrador", "apartado"):
            return JSONResponse(status_code=400, content={
                "error": "Solo se pueden aprobar carritos en borrador, o agregar más pares a uno ya apartado."
            })

        sucursal_id = p.get("sucursal_id")
        if not sucursal_id:
            suc = supabase_get("sucursales?activa=eq.true&select=id&limit=1") or []
            if not suc:
                return JSONResponse(status_code=400, content={"error": "No hay ninguna sucursal activa configurada"})
            sucursal_id = suc[0]["id"]

        items = supabase_get(f"pedido_items?pedido_id=eq.{id}") or []
        sin_reservar = [it for it in items if not it.get("reservado")]
        # Si la clienta pidió pares específicos ("Enviar para apartar" en el
        # portal), aprobar solo esos -- deja el resto del carrito intacto para
        # que siga decidiendo/agregando. Si no hay ninguna solicitud puntual
        # (ej. un carrito armado a mano en el POS), se aprueba todo lo pendiente
        # como antes.
        solicitados = [it for it in sin_reservar if it.get("solicitud_apartar")]
        nuevos = solicitados if solicitados else sin_reservar

        faltantes = []
        for it in nuevos:
            variante_id = it.get("variante_id")
            if not variante_id:
                continue
            cantidad = it.get("cantidad", 1) or 1
            inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
            disponible = inv[0]["cantidad"] if inv else 0
            if cantidad > disponible:
                etiqueta = f"{it.get('nombre','Producto')} {it.get('color') or ''} talla {it.get('talla') or ''}".strip()
                faltantes.append(f"{etiqueta} (disponibles: {disponible})")
        if faltantes:
            return JSONResponse(status_code=409, content={
                "error": "No hay existencia suficiente para apartar: " + "; ".join(faltantes)
            })

        for it in nuevos:
            variante_id = it.get("variante_id")
            cantidad = it.get("cantidad", 1) or 1
            if variante_id:
                # ajuste ATÓMICO (función SQL ajustar_inventario): dos ventas simultáneas ya no se pisan
                _aj = inventario_ajustar(variante_id, sucursal_id, -cantidad)
                if _aj:
                    supabase_post("movimientos_inventario", {
                        "tipo": "apartado",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -cantidad,
                        "motivo": f"Apartado aprobado {id}"
                    })
            supabase_patch(f"pedido_items?id=eq.{it['id']}", {"reservado": True, "solicitud_apartar": False})

        import datetime as _dt
        update = {"status": "apartado", "sucursal_id": sucursal_id}
        if "anticipo" in datos:
            try:
                update["anticipo"] = float(datos["anticipo"])
            except Exception:
                pass
        dias = datos.get("dias_apartado")
        if dias:
            try:
                dias = int(dias)
                update["dias_apartado"] = dias
                update["apartado_hasta"] = (_dt.datetime.now(_dt.timezone.utc) + _dt.timedelta(days=dias)).isoformat()
            except Exception:
                pass
        supabase_patch(f"pedidos?id=eq.{id}", update)
        return {"ok": True, "items_reservados": len(nuevos)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/confirmar")
def confirmar_pedido(id: str, datos: dict, _staff=Depends(require_staff)):
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        _historial(id, "confirmado", "Forma de pago: " + str(datos.get("forma_pago") or ("combinado" if datos.get("pagos") else "—")), _quien(_staff))
        # Traer items con nombre de producto para el mensaje de WhatsApp
        items = supabase_get(f"pedido_items?pedido_id=eq.{id}&select=*,variantes(*,productos(nombre))")
        sucursal_id = pedido[0].get("sucursal_id")
        for item in items:
            variante_id = item.get("variante_id")
            cantidad = item.get("cantidad", 1)
            # Los items "reservado" ya le bajaron su cantidad al inventario cuando
            # se aprobó el apartado (ver /{id}/apartar) -- si aquí se vuelve a
            # descontar, la pieza se resta dos veces por la misma venta.
            if item.get("reservado"):
                continue
            if variante_id and sucursal_id:
                # ajuste ATÓMICO (función SQL ajustar_inventario): dos ventas simultáneas ya no se pisan
                _aj = inventario_ajustar(variante_id, sucursal_id, -cantidad)
                if _aj:
                    # Una linea con cantidad negativa es un "cambio" (el cliente
                    # devuelve ese par en vez de comprarlo) — el stock sube en
                    # vez de bajar; se etiqueta distinto para que el historial
                    # de movimientos sea coherente (ver movimientos.py cambio_entrada).
                    es_cambio = cantidad < 0
                    supabase_post("movimientos_inventario", {
                        "tipo": "cambio_entrada" if es_cambio else "venta",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -cantidad,
                        "motivo": f"Cambio — devolución en pedido {id}" if es_cambio else f"Venta pedido {id}"
                    })
        import datetime as _dt
        # Pago combinado: la clienta paga con más de un método (ej. mitad
        # efectivo, mitad tarjeta). `pagos` es una lista [{forma_pago, monto}, ...]
        # -- si viene un solo renglón se guarda igual que siempre (forma_pago
        # simple); si vienen varios, forma_pago queda como "combinado" y el
        # desglose real se guarda en pagos_detalle para que caja/reportes lo
        # puedan explotar.
        pagos = datos.get("pagos")
        patch_data = {
            "status": "confirmado",
            "confirmado_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        }
        if isinstance(pagos, list) and len(pagos) > 0:
            pagos_limpios = [
                {"forma_pago": p.get("forma_pago"), "monto": float(p.get("monto") or 0)}
                for p in pagos if p.get("forma_pago") and float(p.get("monto") or 0) > 0
            ]
            if len(pagos_limpios) == 1:
                patch_data["forma_pago"] = pagos_limpios[0]["forma_pago"]
                patch_data["pagos_detalle"] = None
            elif len(pagos_limpios) > 1:
                patch_data["forma_pago"] = "combinado"
                patch_data["pagos_detalle"] = pagos_limpios
            else:
                patch_data["forma_pago"] = datos.get("forma_pago", "efectivo")
        else:
            patch_data["forma_pago"] = datos.get("forma_pago", "efectivo")

        # Envío del portal mayorista (calculado por peso, o 0 si es "por
        # cobrar") -- se guarda aparte del total de productos, no como un
        # pedido_item falso (eso rompería el descuento de inventario de
        # arriba, que solo mira items con variante_id real).
        envio = float(datos.get("envio", 0) or 0)
        # Cargo adicional fuera de productos/envío -- ej. cuando llega
        # mercancía de otra parte para empacar/consolidar aquí y se cobra un
        # excedente por ese servicio. Igual que envío, no es un pedido_item
        # real (no debe pasar por el descuento de inventario de arriba).
        cargo_extra = float(datos.get("cargo_extra", 0) or 0)
        cargo_extra_concepto = (datos.get("cargo_extra_concepto") or "").strip()
        if envio > 0 or cargo_extra > 0:
            total_actual = float(pedido[0].get("total") or 0)
            if envio > 0:
                patch_data["costo_envio"] = envio
            if cargo_extra > 0:
                patch_data["cargo_extra"] = cargo_extra
                patch_data["cargo_extra_concepto"] = cargo_extra_concepto
            patch_data["total"] = total_actual + envio + cargo_extra
        supabase_patch(f"pedidos?id=eq.{id}", patch_data)

        # Enviar confirmacion por WhatsApp si el cliente tiene telefono registrado
        _enviar_confirmacion_wa(pedido[0], items)
        _otorgar_bono_referidor(pedido[0].get("cliente_id"))

        try:
            cliente_id_push = pedido[0].get("cliente_id")
            # Sin cliente_id no hay a quién dirigir el push: enviar_push() cae a
            # mandarlo a TODOS los suscriptores activos (tienda+portal+panel) si no
            # se le pasa cliente_id ni sitio — pasó con pedidos de invitado/manuales
            # y el "pedido confirmado" de un desconocido le llegó a todo mundo.
            if cliente_id_push:
                from routers.push import enviar_push
                enviar_push(
                    "Tu pedido fue confirmado",
                    f"Ya estamos preparando tu pedido #{str(id)[:8]}.",
                    url="/portal",
                    cliente_id=cliente_id_push,
                )
        except Exception as e:
            print(f"[pedidos] Error push confirmacion: {e}")

        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

def _marcar_enviado(id, paqueteria, numero_guia, tracking_extra, quien):
    """Devuelve (resultado_dict, status_http). Lo usan el endpoint de un pedido y el de varios a la vez."""
    paqueteria = (paqueteria or "").strip()
    numero_guia = (numero_guia or "").strip()
    if not paqueteria or not numero_guia:
        return {"error": "Faltan paqueteria y numero_guia"}, 400
    pedido = supabase_get(f"pedidos?id=eq.{id}&select=*,pedido_items(*)")
    if not pedido:
        return {"error": "Pedido no encontrado"}, 404
    p = pedido[0]
    if p.get("status") in ("cancelado", "borrador", "checkout_iniciado"):
        return {"error": f"Un pedido {p.get('status')} no se puede marcar como enviado"}, 409

    pak = paqueteria.lower()
    if "fedex" in pak:
        tracking_url = f"https://www.fedex.com/fedextrack/?trknbr={numero_guia}"
    elif "estafeta" in pak:
        tracking_url = f"https://www.estafeta.com/herramientas/rastreo?wayBillType=1&wayBill={numero_guia}"
    elif "dhl" in pak:
        tracking_url = f"https://www.dhl.com/mx-es/home/rastreo.html?tracking-id={numero_guia}"
    else:
        tracking_url = tracking_extra or ""

    import datetime as _dt
    supabase_patch(f"pedidos?id=eq.{id}", {
        "status": "enviado", "paqueteria": paqueteria, "numero_guia": numero_guia, "tracking_url": tracking_url,
        "enviado_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
    })
    _historial(id, "enviado", f"{paqueteria} · guía {numero_guia}", quien)

    email_cliente = p.get("email_cliente", "")
    if email_cliente:
        try:
            from email_utils import enviar_email, email_envio_realizado
            subj, html = email_envio_realizado(p, paqueteria, numero_guia, tracking_url)
            enviar_email(email_cliente, subj, html, tipo="pedido_enviado")
        except Exception as e:
            print(f"[pedidos] Error email tracking: {e}")
    try:
        if p.get("cliente_id"):
            # Sin cliente_id, enviar_push() cae a mandarlo a TODOS los suscriptores activos
            from routers.push import enviar_push
            enviar_push("Tu pedido va en camino", f"Envío con {paqueteria}, guía {numero_guia}.",
                        url=tracking_url or "/", cliente_id=p["cliente_id"])
    except Exception as e:
        print(f"[pedidos] Error push envio: {e}")
    wa = _avisar_envio_whatsapp(p, paqueteria, numero_guia)
    return {"ok": True, "tracking_url": tracking_url, "whatsapp": wa}, 200


@router.post("/{id}/marcar-enviado")
def marcar_enviado(id: str, datos: dict, _staff=Depends(require_staff)):
    """Marca el pedido como enviado, avisa por correo, notificación y WhatsApp, y lo deja en la bitácora."""
    try:
        res, code = _marcar_enviado(id, datos.get("paqueteria"), datos.get("numero_guia"), datos.get("tracking_url"), _quien(_staff))
        return JSONResponse(status_code=code, content=res) if code != 200 else res
    except Exception as e:
        import traceback; traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/marcar-enviado-lote")
def marcar_enviado_lote(datos: dict, _staff=Depends(require_staff)):
    """Registra la guía de VARIOS pedidos de una vez: {"pedidos": [{"id","paqueteria","numero_guia"}...]}."""
    filas = datos.get("pedidos") or []
    if not isinstance(filas, list) or not filas or len(filas) > 100:
        return JSONResponse(status_code=400, content={"error": "Lista de pedidos inválida (1 a 100)"})
    quien = _quien(_staff)
    resultados = []
    for f in filas:
        pid = str(f.get("id") or "")
        if not _UUID_RE.match(pid):
            resultados.append({"id": pid, "ok": False, "error": "id inválido"})
            continue
        try:
            res, code = _marcar_enviado(pid, f.get("paqueteria"), f.get("numero_guia"), f.get("tracking_url"), quien)
            resultados.append({"id": pid, "ok": code == 200, "error": res.get("error"), "whatsapp": res.get("whatsapp")})
        except Exception as e:
            resultados.append({"id": pid, "ok": False, "error": str(e)})
    return {"ok": all(r["ok"] for r in resultados), "resultados": resultados}


@router.post("/{id}/marcar-entregado")
def marcar_entregado(id: str, _staff=Depends(require_staff)):
    """-> entregado. Desde 'enviado' (llegó por paquetería) o desde 'confirmado'/'pagado' (entrega directa: lo recogió o se lo
    llevaron sin paquetería, como muchas mayoristas de León). Antes ese estado casi no se usaba y los pedidos se quedaban
    'enviados' o 'confirmados' para siempre."""
    p = supabase_get(f"pedidos?id=eq.{id}&select=status")
    if not p:
        return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
    estado = p[0].get("status")
    if estado not in ("enviado", "confirmado", "pagado"):
        return JSONResponse(status_code=409, content={"error": "Solo un pedido confirmado, pagado o enviado se puede marcar como entregado"})
    supabase_patch(f"pedidos?id=eq.{id}", {"status": "entregado"})
    _historial(id, "entregado", None if estado == "enviado" else "Entrega directa (sin paquetería)", _quien(_staff))
    return {"ok": True}


@router.get("/{id}/historial")
def historial_pedido(id: str, _staff=Depends(require_staff)):
    if not _UUID_RE.match(id):
        return JSONResponse(status_code=400, content={"error": "Id inválido"})
    return supabase_get(f"pedido_historial?pedido_id=eq.{id}&order=created_at.desc&limit=100") or []


@router.post("/{id}/cancelar")
def cancelar_pedido(id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional), datos: dict = Body(default=None)):
    _exigir_dueno_pedido(id, credentials)
    motivo = ((datos or {}).get("motivo") or "").strip()[:300] if isinstance(datos, dict) else ""
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        status_actual = pedido[0].get("status")
        if not _es_staff_cred(credentials) and status_actual not in _STATUS_EDITABLE_CLIENTE:
            return JSONResponse(status_code=403, content={"error": "Este pedido ya no se puede cancelar desde aquí. Contáctanos."})
        # OJO: no basta con mirar el status del PEDIDO para saber si hay que
        # devolver stock. Un apartado aprobado puede seguir de largo a
        # pendiente_pago (cerrar-apartado) y luego a checkout_iniciado
        # (crear-preferencia de MercadoPago) SIN que nada le quite la
        # reserva real -- si aquí solo se revisara status=='apartado', un
        # pedido cancelado en cualquiera de esos estados posteriores dejaba
        # el stock descontado para siempre, sin ningún pedido que lo
        # explique (fuga real de inventario, encontrada en producción).
        # `reservado` en cada ítem es la fuente de verdad real de si ese
        # par tiene stock tomado, sin importar en qué status quedó el pedido.
        items = supabase_get(f"pedido_items?pedido_id=eq.{id}")
        sucursal_id = pedido[0].get("sucursal_id")
        hubo_devolucion = False
        for item in items:
            debe_devolver = item.get("reservado") or status_actual in ("confirmado", "pagado")
            if not debe_devolver:
                continue
            variante_id = item.get("variante_id")
            cantidad = item.get("cantidad", 1)
            if variante_id and sucursal_id:
                # ajuste ATÓMICO (función SQL ajustar_inventario): dos ventas simultáneas ya no se pisan
                _aj = inventario_ajustar(variante_id, sucursal_id, cantidad)
                if _aj:
                    supabase_post("movimientos_inventario", {
                        "tipo": "ajuste",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": cantidad,
                        "motivo": f"Cancelacion pedido {id}"
                    })
                    hubo_devolucion = True
        if hubo_devolucion:
            supabase_patch(f"pedido_items?pedido_id=eq.{id}", {"reservado": False, "solicitud_liberar": False})
        if status_actual != "cancelado":
            _reembolsar_credito(id, pedido[0].get("cliente_id"))
        supabase_patch(f"pedidos?id=eq.{id}", {"status": "cancelado"})
        _historial(id, "cancelado", (f"Motivo: {motivo}. " if motivo else "") + ("Stock devuelto." if hubo_devolucion else ""), _quien(payload_opcional(credentials)))
        return {"ok": True, "stock_devuelto": hubo_devolucion}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/reconfirmar")
def reconfirmar_pedido(id: str, datos: dict, _staff=Depends(require_staff)):
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        if pedido[0].get("status") != "cancelado":
            return JSONResponse(status_code=400, content={"error": "Solo se pueden reconfirmar pedidos cancelados"})
        items = supabase_get(f"pedido_items?pedido_id=eq.{id}&select=*,variantes(*,productos(nombre))")
        sucursal_id = pedido[0].get("sucursal_id")
        for item in items:
            variante_id = item.get("variante_id")
            cantidad = item.get("cantidad", 1)
            if variante_id and sucursal_id:
                # ajuste ATÓMICO (función SQL ajustar_inventario): dos ventas simultáneas ya no se pisan
                _aj = inventario_ajustar(variante_id, sucursal_id, -cantidad)
                if _aj:
                    supabase_post("movimientos_inventario", {
                        "tipo": "venta",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -cantidad,
                        "motivo": f"Reconfirmacion pedido {id}"
                    })
        import datetime as _dt
        supabase_patch(f"pedidos?id=eq.{id}", {
            "status": "confirmado",
            "forma_pago": datos.get("forma_pago", pedido[0].get("forma_pago", "efectivo")),
            "confirmado_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        })
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
