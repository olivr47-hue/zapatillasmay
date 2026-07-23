import os
import json
import urllib.request
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete
from security import require_staff, verify_token
from cache import cache_get, cache_set, TTL_FEEDS

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


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


@router.get("/")
def listar_pedidos(status: str = None, _staff=Depends(require_staff)):
    try:
        filtro = f"&status=eq.{status}" if status else ""
        return supabase_get(f"pedidos?order=created_at.desc{filtro}&select=*,clientes(nombre,telefono),sucursales(nombre),pedido_items(*)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/apartados")
def listar_apartados(_staff=Depends(require_staff)):
    try:
        return supabase_get("pedidos?status=eq.apartado&order=created_at.desc&select=*,clientes(nombre,telefono),sucursales(nombre),pedido_items(*,variantes(*,productos(nombre,imagen_principal)))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/confirmar-deposito")
def confirmar_deposito(id: str, datos: dict):
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
                inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
                if inv:
                    nueva_cantidad = max(0, inv[0]["cantidad"] - cantidad)
                    supabase_patch(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}", {"cantidad": nueva_cantidad})
                    supabase_post("movimientos_inventario", {
                        "tipo": "venta",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -cantidad,
                        "motivo": f"Confirmación apartado {id}"
                    })
        forma_pago = datos.get("forma_pago", pedido[0].get("forma_pago", "efectivo"))
        supabase_patch(f"pedidos?id=eq.{id}", {"status": "confirmado", "forma_pago": forma_pago})
        _enviar_confirmacion_wa(pedido[0], items)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/pendientes")
def pedidos_pendientes():
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
def recordatorio_email(id: str, datos: dict = {}):
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
def recordatorio_whatsapp(id: str, datos: dict = {}):
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
def enviar_recordatorio_pago(id: str):
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
def pedidos_por_canal(canal: str):
    try:
        return supabase_get(f"pedidos?canal=eq.{canal}&select=*,clientes(nombre,telefono)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/{id}")
def obtener_pedido(id: str):
    try:
        return supabase_get(f"pedidos?id=eq.{id}&select=*,clientes(nombre,telefono,email),sucursales(nombre),pedido_items(*,variantes(*,productos(nombre,sku_interno,imagen_principal)))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/")
async def crear_pedido(pedido: dict, request: Request):
    try:
        # Si viene un token de cliente válido (portal mayorista logueado), el
        # cliente_id SIEMPRE se toma del token, nunca de lo que mande el body --
        # si no, un cliente logueado podría armar un pedido a nombre de otro
        # cliente_id con solo cambiar el JSON. El checkout anónimo de la tienda
        # (menudeo, sin login) sigue igual: sin token, se respeta el body tal cual.
        auth_header = request.headers.get("authorization", "")
        if auth_header.lower().startswith("bearer "):
            try:
                token_payload = verify_token(auth_header[7:])
                if token_payload.get("cliente_id"):
                    pedido["cliente_id"] = token_payload["cliente_id"]
            except Exception:
                pass  # token inválido/expirado -> se trata como anónimo, no se bloquea el checkout
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
                cli_existente = supabase_get(f"clientes?email=eq.{email_c}&limit=1")
                if not cli_existente and tel_c:
                    cli_existente = supabase_get(f"clientes?telefono=eq.{tel_c}&limit=1")
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
            return resultado[0]
        return JSONResponse(status_code=500, content={"error": "Error creando pedido"})
    except Exception as e:
        print(f"ERROR crear_pedido: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}")
def actualizar_pedido(id: str, pedido: dict):
    try:
        return supabase_patch(f"pedidos?id=eq.{id}", pedido)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/items")
def agregar_item(id: str, item: dict):
    try:
        item["pedido_id"] = id
        return supabase_post("pedido_items", item)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/{id}/items")
def obtener_items(id: str):
    try:
        return supabase_get(f"pedido_items?pedido_id=eq.{id}&select=*,variantes(*,productos(nombre,sku_interno,imagen_principal))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}/items/{item_id}")
def actualizar_item(id: str, item_id: str, datos: dict):
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

        supabase_patch(f"pedido_items?id=eq.{item_id}", {
            "cantidad": nueva_cantidad,
            "precio_unitario": nuevo_precio,
            "subtotal": nuevo_subtotal
        })

        # Ajustar inventario si el pedido ya estaba confirmado
        if pedido[0].get("status") in ("confirmado", "pagado"):
            variante_id = item_actual[0].get("variante_id")
            sucursal_id = pedido[0].get("sucursal_id")
            diff = nueva_cantidad - cantidad_anterior  # positivo = más pares (descontar), negativo = devolver
            if variante_id and sucursal_id and diff != 0:
                inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
                if inv:
                    nueva_inv = max(0, inv[0]["cantidad"] - diff)
                    supabase_patch(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}", {"cantidad": nueva_inv})
                    supabase_post("movimientos_inventario", {
                        "tipo": "ajuste",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -diff,
                        "motivo": f"Edición pedido {id}"
                    })

        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/{id}/items/{item_id}")
def eliminar_item(id: str, item_id: str):
    """Elimina un ítem del pedido. Si estaba confirmado devuelve el stock."""
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        item_actual = supabase_get(f"pedido_items?id=eq.{item_id}&pedido_id=eq.{id}")
        if not item_actual:
            return JSONResponse(status_code=404, content={"error": "Ítem no encontrado"})

        cantidad = item_actual[0].get("cantidad", 0)
        supabase_delete(f"pedido_items?id=eq.{item_id}")

        # Devolver stock si ya estaba confirmado
        if pedido[0].get("status") in ("confirmado", "pagado"):
            variante_id = item_actual[0].get("variante_id")
            sucursal_id = pedido[0].get("sucursal_id")
            if variante_id and sucursal_id and cantidad > 0:
                inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
                if inv:
                    supabase_patch(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}", {"cantidad": inv[0]["cantidad"] + cantidad})
                    supabase_post("movimientos_inventario", {
                        "tipo": "ajuste",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": cantidad,
                        "motivo": f"Eliminación ítem pedido {id}"
                    })

        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/confirmar")
def confirmar_pedido(id: str, datos: dict):
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        # Traer items con nombre de producto para el mensaje de WhatsApp
        items = supabase_get(f"pedido_items?pedido_id=eq.{id}&select=*,variantes(*,productos(nombre))")
        sucursal_id = pedido[0].get("sucursal_id")
        for item in items:
            variante_id = item.get("variante_id")
            cantidad = item.get("cantidad", 1)
            if variante_id and sucursal_id:
                inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
                if inv:
                    nueva_cantidad = max(0, inv[0]["cantidad"] - cantidad)
                    supabase_patch(
                        f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
                        {"cantidad": nueva_cantidad}
                    )
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
        supabase_patch(f"pedidos?id=eq.{id}", {
            "status": "confirmado",
            "forma_pago": datos.get("forma_pago", "efectivo")
        })

        # Enviar confirmacion por WhatsApp si el cliente tiene telefono registrado
        _enviar_confirmacion_wa(pedido[0], items)

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

@router.post("/{id}/marcar-enviado")
def marcar_enviado(id: str, datos: dict):
    """Marca el pedido como enviado y manda email de tracking al cliente."""
    try:
        paqueteria   = datos.get("paqueteria", "").strip()
        numero_guia  = datos.get("numero_guia", "").strip()
        if not paqueteria or not numero_guia:
            return JSONResponse(status_code=400, content={"error": "Faltan paqueteria y numero_guia"})

        pedido = supabase_get(f"pedidos?id=eq.{id}&select=*,pedido_items(*)")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        p = pedido[0]

        # Generar URL de tracking según paquetería
        pak = paqueteria.lower()
        if "fedex" in pak:
            tracking_url = f"https://www.fedex.com/fedextrack/?trknbr={numero_guia}"
        elif "estafeta" in pak:
            tracking_url = f"https://www.estafeta.com/herramientas/rastreo?wayBillType=1&wayBill={numero_guia}"
        elif "dhl" in pak:
            tracking_url = f"https://www.dhl.com/mx-es/home/rastreo.html?tracking-id={numero_guia}"
        else:
            tracking_url = datos.get("tracking_url", "")

        import datetime as _dt
        supabase_patch(f"pedidos?id=eq.{id}", {
            "status": "enviado",
            "paqueteria": paqueteria,
            "numero_guia": numero_guia,
            "tracking_url": tracking_url,
            "enviado_at": _dt.datetime.now(_dt.timezone.utc).isoformat()
        })

        # Email de tracking al cliente
        email_cliente = p.get("email_cliente", "")
        if email_cliente:
            try:
                from email_utils import enviar_email, email_envio_realizado
                subj, html = email_envio_realizado(p, paqueteria, numero_guia, tracking_url)
                enviar_email(email_cliente, subj, html, tipo="pedido_enviado")
            except Exception as e:
                print(f"[pedidos] Error email tracking: {e}")

        try:
            cliente_id_push = p.get("cliente_id")
            # Sin cliente_id, enviar_push() cae a mandarlo a TODOS los suscriptores
            # activos (ver comentario igual en confirmar_pedido más arriba).
            if cliente_id_push:
                from routers.push import enviar_push
                enviar_push(
                    "Tu pedido va en camino",
                    f"Envío con {paqueteria}, guía {numero_guia}.",
                    url=tracking_url or "/",
                    cliente_id=cliente_id_push,
                )
        except Exception as e:
            print(f"[pedidos] Error push envio: {e}")

        return {"ok": True, "tracking_url": tracking_url}
    except Exception as e:
        import traceback; traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/{id}/cancelar")
def cancelar_pedido(id: str):
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        status_actual = pedido[0].get("status")
        if status_actual in ["confirmado", "pagado"]:
            items = supabase_get(f"pedido_items?pedido_id=eq.{id}")
            sucursal_id = pedido[0].get("sucursal_id")
            for item in items:
                variante_id = item.get("variante_id")
                cantidad = item.get("cantidad", 1)
                if variante_id and sucursal_id:
                    inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
                    if inv:
                        nueva_cantidad = inv[0]["cantidad"] + cantidad
                        supabase_patch(
                            f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
                            {"cantidad": nueva_cantidad}
                        )
                        supabase_post("movimientos_inventario", {
                            "tipo": "ajuste",
                            "variante_id": variante_id,
                            "sucursal_id": sucursal_id,
                            "cantidad": cantidad,
                            "motivo": f"Cancelacion pedido {id}"
                        })
        supabase_patch(f"pedidos?id=eq.{id}", {"status": "cancelado"})
        return {"ok": True, "stock_devuelto": status_actual in ["confirmado", "pagado"]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/reconfirmar")
def reconfirmar_pedido(id: str, datos: dict):
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
                inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
                if inv:
                    nueva_cantidad = max(0, inv[0]["cantidad"] - cantidad)
                    supabase_patch(
                        f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
                        {"cantidad": nueva_cantidad}
                    )
                    supabase_post("movimientos_inventario", {
                        "tipo": "venta",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -cantidad,
                        "motivo": f"Reconfirmacion pedido {id}"
                    })
        supabase_patch(f"pedidos?id=eq.{id}", {
            "status": "confirmado",
            "forma_pago": datos.get("forma_pago", pedido[0].get("forma_pago", "efectivo"))
        })
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
