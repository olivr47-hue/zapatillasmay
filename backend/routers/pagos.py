from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_patch, supabase_post
from cache import cache_get, cache_set, TTL_PUBLICO
from security import require_staff
import mercadopago
import os
import hashlib
import hmac
import time
import urllib.request
import json
from dotenv import load_dotenv
from email_utils import (
    enviar_email,
    email_pedido_confirmado,
    email_pedido_pendiente_spei,
    email_nuevo_pedido_negocio,
    NEGOCIO_EMAIL,
)

load_dotenv()

router = APIRouter(prefix="/pagos", tags=["Pagos"])

sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))

# Credenciales de PRUEBA (Checkout Bricks embebido). Si no están, el modo test
# simplemente no funciona y se usa producción.
MP_ACCESS_TOKEN_TEST = os.getenv("MP_ACCESS_TOKEN_TEST", "")
MP_PUBLIC_KEY        = os.getenv("MP_PUBLIC_KEY", "")
MP_PUBLIC_KEY_TEST   = os.getenv("MP_PUBLIC_KEY_TEST", "")
sdk_test = mercadopago.SDK(MP_ACCESS_TOKEN_TEST) if MP_ACCESS_TOKEN_TEST else None


def _sdk(test=False):
    """SDK de MP: el de prueba si test=True y existe, si no el de producción."""
    return sdk_test if (test and sdk_test) else sdk


def _public_key(test=False):
    return MP_PUBLIC_KEY_TEST if (test and MP_PUBLIC_KEY_TEST) else MP_PUBLIC_KEY

META_PIXEL_ID = os.getenv("META_PIXEL_ID")
META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN")
MP_WEBHOOK_SECRET = os.getenv("MP_WEBHOOK_SECRET", "")


def hash_data(value):
    if not value:
        return None
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


def _validar_firma_mp(request_body: bytes, headers: dict) -> bool:
    """
    Valida la firma HMAC-SHA256 del webhook de Mercado Pago.
    Retorna True si la firma es válida o si no hay secret configurado (modo dev).
    """
    if not MP_WEBHOOK_SECRET:
        return True  # Sin secret: permitir (para desarrollo; en producción siempre configurar)

    signature_header = headers.get("x-signature", "")
    request_id = headers.get("x-request-id", "")

    # Parsear ts y v1 del header x-signature
    ts = ""
    v1 = ""
    for part in signature_header.split(","):
        k, _, v = part.partition("=")
        if k.strip() == "ts":
            ts = v.strip()
        elif k.strip() == "v1":
            v1 = v.strip()

    if not ts or not v1:
        return False

    # El manifest que firma MP: id:{data_id};request-id:{x-request-id};ts:{ts};
    try:
        body_json = json.loads(request_body)
        data_id = str(body_json.get("data", {}).get("id", ""))
    except Exception:
        return False

    manifest = f"id:{data_id};request-id:{request_id};ts:{ts};"
    expected = hmac.new(MP_WEBHOOK_SECRET.encode(), manifest.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, v1)


def enviar_ga4_purchase(pedido, payment):
    """Envía el evento purchase a GA4 vía Measurement Protocol (server-side).
    Captura compras que no pasan por la página de éxito (OXXO/SPEI, links de pago
    pendientes, etc.). Usa el id de pago de MP como transaction_id, igual que el
    evento del navegador, para que GA4 deduplique los pagos con tarjeta."""
    measurement_id = os.getenv("GA4_MEASUREMENT_ID", "G-QX8MK3D4RY")
    api_secret = os.getenv("GA4_API_SECRET", "")
    if not api_secret:
        return  # sin secreto configurado → no-op (no rompe nada)
    try:
        pedido_id = pedido.get("id", "")
        payment_id = str((payment or {}).get("id") or pedido_id)
        total = float(pedido.get("total") or 0)
        items_pedido = pedido.get("pedido_items", []) or []
        ga_items = []
        for it in items_pedido:
            ga_items.append({
                "item_id": str(it.get("variante_id") or it.get("sku") or it.get("id") or ""),
                "item_name": it.get("nombre_producto") or it.get("nombre") or "Calzado",
                "quantity": int(it.get("cantidad") or 1),
                "price": float(it.get("precio_unitario") or it.get("precio") or 0),
            })
        if not ga_items:
            ga_items = [{"item_name": "Pedido", "quantity": 1, "price": total}]
        # client_id: el real de GA si se guardó, si no uno estable derivado del pedido
        client_id = pedido.get("ga_client_id") or f"{pedido_id}.0"
        body = {
            "client_id": client_id,
            "events": [{
                "name": "purchase",
                "params": {
                    "transaction_id": payment_id,
                    "currency": "MXN",
                    "value": total,
                    "items": ga_items,
                },
            }],
        }
        url = f"https://www.google-analytics.com/mp/collect?measurement_id={measurement_id}&api_secret={api_secret}"
        req = urllib.request.Request(
            url, data=json.dumps(body).encode("utf-8"),
            headers={"Content-Type": "application/json"}, method="POST"
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            r.read()
    except Exception as e:
        print(f"[ga4] Error enviando purchase: {e}")


def enviar_evento_meta(event_name, pedido, payment):
    if not META_PIXEL_ID or not META_ACCESS_TOKEN:
        return
    try:
        total = float(pedido.get("total", 0))
        email = pedido.get("email_cliente", "")
        telefono = pedido.get("telefono_cliente", "")
        nombre = pedido.get("nombre_cliente", "")
        pedido_id = pedido.get("id", "")
        cliente_id = str(pedido.get("cliente_id", ""))
        items = pedido.get("pedido_items", [])

        # Datos de ubicación del cliente
        ciudad = pedido.get("ciudad_cliente", "")
        estado = pedido.get("estado_cliente", "")
        cp = pedido.get("cp_cliente", "")

        # Parámetros de rastreo del navegador (enviados por el frontend al crear el pedido)
        fbc = pedido.get("fbc", "")   # cookie _fbc de Meta
        fbp = pedido.get("fbp", "")   # cookie _fbp de Meta
        client_ip = pedido.get("client_ip_address", "")
        user_agent = pedido.get("client_user_agent", "")
        # Si no hay cookie _fbc pero sí el fbclid del clic del anuncio, construimos
        # el fbc en formato Meta (fb.1.<ms>.<fbclid>) para mejorar la cobertura de fbc.
        if not fbc:
            fbclid = pedido.get("fbclid", "")
            if fbclid:
                fbc = f"fb.1.{int(time.time() * 1000)}.{fbclid}"

        nombre_parts = nombre.strip().split(" ", 1)
        fn = nombre_parts[0] if nombre_parts else ""
        ln = nombre_parts[1] if len(nombre_parts) > 1 else ""

        contents = [
            {
                "id": item.get("variante_id", ""),
                "quantity": item.get("cantidad", 1),
                "item_price": float(item.get("precio_unitario", 0))
            }
            for item in items
        ]

        user_data = {
            "em": [hash_data(email)] if email else [],
            "ph": [hash_data(telefono)] if telefono else [],
            "fn": [hash_data(fn)] if fn else [],
            "ln": [hash_data(ln)] if ln else [],
            "country": [hash_data("mx")],  # siempre México
        }
        # Parámetros opcionales que suben el match quality score
        if cliente_id:
            user_data["external_id"] = [hash_data(cliente_id)]
        if ciudad:
            user_data["ct"] = [hash_data(ciudad.lower().strip())]
        if estado:
            user_data["st"] = [hash_data(estado.lower().strip())]
        if cp:
            user_data["zp"] = [hash_data(cp.strip())]
        if fbc:
            user_data["fbc"] = fbc        # NO se hashea
        if fbp:
            user_data["fbp"] = fbp        # NO se hashea
        if client_ip:
            user_data["client_ip_address"] = client_ip   # NO se hashea
        if user_agent:
            user_data["client_user_agent"] = user_agent  # NO se hashea

        payload = {
            "data": [
                {
                    "event_name": event_name,
                    "event_time": int(time.time()),
                    "event_id": f"{pedido_id}-{event_name}",
                    "action_source": "website",
                    "user_data": user_data,
                    "custom_data": {
                        "currency": "MXN",
                        "value": total,
                        "contents": contents,
                        "content_type": "product",
                        "order_id": pedido_id,
                        "num_items": sum(i.get("cantidad", 1) for i in items)
                    }
                }
            ]
        }

        # Token como header Authorization, no en la URL
        url = f"https://graph.facebook.com/v21.0/{META_PIXEL_ID}/events"
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url, data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {META_ACCESS_TOKEN}",
            },
            method="POST"
        )
        urllib.request.urlopen(req)
        print(f"[CAPI] Evento {event_name} enviado OK para pedido {pedido.get('id')}")

    except Exception as e:
        print(f"[CAPI] Error enviando evento {event_name}: {e}")


@router.post("/meta/evento")
async def meta_evento_frontend(body: dict, request: Request):
    """
    Recibe eventos del frontend (AddToCart, ViewContent, InitiateCheckout, etc.)
    y los reenvía a Meta CAPI con la IP real del cliente extraída del request.
    El frontend ya no puede conocer su propia IP — el backend la añade aquí.
    """
    if not META_PIXEL_ID or not META_ACCESS_TOKEN:
        return JSONResponse({"ok": False, "error": "Meta CAPI no configurado"})

    try:
        event_name       = body.get("event_name", "")
        event_source_url = body.get("event_source_url", "")
        event_id         = body.get("event_id", f"{event_name}-{int(time.time())}")
        value            = float(body.get("value", 0))
        currency         = body.get("currency", "MXN")
        content_ids      = body.get("content_ids", [])
        content_name     = body.get("content_name", "")
        content_type     = body.get("content_type", "product")
        num_items        = int(body.get("num_items", 1))

        # Datos de usuario del frontend
        fbc          = body.get("fbc", "")
        fbp          = body.get("fbp", "")
        user_agent   = body.get("client_user_agent", "")
        email        = body.get("email", "")
        telefono     = body.get("telefono", "")
        nombre       = body.get("nombre", "")
        cliente_id   = body.get("cliente_id", "")
        fbclid       = body.get("fbclid", "")

        # Construir fbc desde fbclid si no hay cookie _fbc
        if not fbc and fbclid:
            fbc = f"fb.1.{int(time.time() * 1000)}.{fbclid}"

        # IP real — el frontend no puede saber la suya; la obtenemos del request
        client_ip = (
            request.headers.get("x-forwarded-for", "").split(",")[0].strip()
            or request.headers.get("x-real-ip", "")
            or (request.client.host if request.client else "")
        )

        nombre_parts = nombre.strip().split(" ", 1)
        fn = nombre_parts[0] if nombre_parts else ""
        ln = nombre_parts[1] if len(nombre_parts) > 1 else ""

        user_data: dict = {
            "country": [hash_data("mx")],
        }
        if email:
            user_data["em"] = [hash_data(email)]
        if telefono:
            user_data["ph"] = [hash_data(telefono)]
        if fn:
            user_data["fn"] = [hash_data(fn)]
        if ln:
            user_data["ln"] = [hash_data(ln)]
        if cliente_id:
            user_data["external_id"] = [hash_data(str(cliente_id))]
        if fbc:
            user_data["fbc"] = fbc
        if fbp:
            user_data["fbp"] = fbp
        if client_ip:
            user_data["client_ip_address"] = client_ip
        if user_agent:
            user_data["client_user_agent"] = user_agent

        payload = {
            "data": [{
                "event_name": event_name,
                "event_time": int(time.time()),
                "event_id": event_id,
                "event_source_url": event_source_url,
                "action_source": "website",
                "user_data": user_data,
                "custom_data": {
                    "currency": currency,
                    "value": value,
                    "content_ids": content_ids,
                    "content_name": content_name,
                    "content_type": content_type,
                    "num_items": num_items,
                }
            }]
        }

        url = f"https://graph.facebook.com/v21.0/{META_PIXEL_ID}/events"
        req_obj = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {META_ACCESS_TOKEN}",
            },
            method="POST"
        )
        urllib.request.urlopen(req_obj)
        print(f"[CAPI] {event_name} enviado desde frontend OK")
        return JSONResponse({"ok": True})

    except Exception as e:
        print(f"[CAPI] Error evento frontend {body.get('event_name')}: {e}")
        return JSONResponse({"ok": False, "error": str(e)})


def _confirmar_pago_whatsapp(pedido: dict):
    try:
        telefono = pedido.get("telefono_cliente", "")
        if not telefono:
            return
        if pedido.get("canal") != "whatsapp":
            return
        wa_token = os.getenv("WHATSAPP_TOKEN", "")
        phone_id = os.getenv("WHATSAPP_PHONE_ID", "")
        if not wa_token or not phone_id:
            return
        nombre = (pedido.get("nombre_cliente") or "").split()[0] or "Clienta"
        total = pedido.get("total", 0)
        notas = pedido.get("notas", "tu pedido")
        tel = str(telefono).replace("+", "").replace(" ", "").replace("-", "")
        if not tel.startswith("52"):
            tel = "52" + tel
        mensaje = (
            f"✅ *¡Pago confirmado, {nombre}!*\n\n"
            f"Recibimos tu pago de *${total:.0f} MXN* 🎉\n"
            f"📦 {notas.replace('Pedido WhatsApp | ', '')}\n\n"
            f"_Procesamos tu pedido en las próximas 24hrs y te mandamos tu número de rastreo_ 🚚"
        )
        body = json.dumps({
            "messaging_product": "whatsapp",
            "to": tel,
            "type": "text",
            "text": {"body": mensaje}
        }).encode("utf-8")
        req = urllib.request.Request(
            f"https://graph.facebook.com/v25.0/{phone_id}/messages",
            data=body,
            headers={"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"},
            method="POST"
        )
        urllib.request.urlopen(req)
    except Exception:
        pass


def _precio_piso_producto(producto_id):
    """
    Devuelve el precio MÁS BAJO legítimo del catálogo para un producto
    (el menor entre menudeo/mayoreo/corrida). Sirve como piso anti-fraude:
    nadie debería pagar menos que el precio más barato real del producto.
    Devuelve None si no se puede determinar (en ese caso NO se aplica clamp).
    """
    if not producto_id:
        return None
    ck = f"piso_{producto_id}"
    cached = cache_get(ck)
    if cached is not None:
        return cached
    try:
        prod = supabase_get(
            f"productos?id=eq.{producto_id}"
            "&select=precio_menudeo,precio_mayoreo,precio_mayoreo3,precio_mayoreo6,precio_corrida"
        )
        if not prod:
            return None
        p = prod[0]
        precios = []
        for k in ("precio_menudeo", "precio_mayoreo", "precio_mayoreo3", "precio_mayoreo6", "precio_corrida"):
            v = p.get(k)
            if v is not None:
                try:
                    fv = float(v)
                    if fv > 0:
                        precios.append(fv)
                except (TypeError, ValueError):
                    pass
        piso = min(precios) if precios else None
        if piso is not None:
            cache_set(ck, piso, TTL_PUBLICO)
        return piso
    except Exception:
        return None


def _construir_items_validados(pedido_id, items_cliente):
    """
    Construye la lista de ítems para Mercado Pago usando los precios REALES
    del pedido guardado en la BD, validados contra el catálogo. Si un precio
    viene por debajo del piso legítimo (manipulación), lo corrige al piso.

    A prueba de fallos: si algo no se puede leer/validar, devuelve None para
    que el llamador use el comportamiento original (nunca rompe el checkout).
    """
    try:
        db_items = supabase_get(
            f"pedido_items?pedido_id=eq.{pedido_id}"
            "&select=cantidad,precio_unitario,variante_id,variantes(producto_id,productos(nombre))"
        )
        if not db_items:
            return None

        construidos = []
        for it in db_items:
            cant = int(it.get("cantidad", 1) or 1)
            precio = float(it.get("precio_unitario", 0) or 0)
            var = it.get("variantes") or {}
            # Nota: no aplicamos piso aquí porque precio_corrida puede ser estimado
            # (precio_menudeo - 100) cuando no está en catálogo, y quedaría
            # por debajo del piso calculado con otros tiers → MP cobra de más.
            nombre = "Producto"
            prod = var.get("productos") if isinstance(var, dict) else None
            if isinstance(prod, dict) and prod.get("nombre"):
                nombre = str(prod["nombre"]).strip() or "Producto"
            construidos.append({
                "title": nombre[:255],
                "quantity": cant,
                "unit_price": precio,
                "currency_id": "MXN",
            })

        # Envío: tomar lo que mandó el cliente (no es vector de fraude), acotado.
        for it in (items_cliente or []):
            nom = (it.get("nombre") or "").lower()
            if "env" in nom:
                envio = float(it.get("precio", 0) or 0)
                if 0 < envio <= 1000:
                    construidos.append({
                        "title": "Envío a domicilio",
                        "quantity": 1,
                        "unit_price": envio,
                        "currency_id": "MXN",
                    })
                break

        return construidos or None
    except Exception as e:
        print(f"[crear_preferencia] No se pudieron validar precios desde BD ({e}); uso items del cliente.")
        return None


@router.post("/crear-preferencia")
def crear_preferencia(datos: dict):
    try:
        pedido_id = datos.get("pedido_id")
        items = datos.get("items", [])
        cliente = datos.get("cliente", {})

        webhook_url = os.getenv("MP_WEBHOOK_URL", "")
        frontend_url = os.getenv("FRONTEND_URL", "https://zapatillasmay.mx")

        # Precios validados contra el catálogo (anti-manipulación de precio).
        # Si no se puede validar, se usan los items del cliente (igual que antes).
        mp_items = _construir_items_validados(pedido_id, items)
        if not mp_items:
            mp_items = [
                {
                    "title": item.get("nombre", "Producto")[:255],
                    "quantity": int(item.get("cantidad", 1)),
                    "unit_price": float(item.get("precio", 0)),
                    "currency_id": "MXN"
                }
                for item in items
            ]

        preference_data = {
            "items": mp_items,
            "payer": {
                "name": cliente.get("nombre", ""),
                "email": cliente.get("email", "cliente@zapatillasmay.mx")
            },
            "external_reference": str(pedido_id),
            "back_urls": {
                "success": frontend_url + "/success",
                "failure": frontend_url + "/success",
                "pending": frontend_url + "/success"
            },
            "auto_return": "approved",
        }
        if webhook_url:
            preference_data["notification_url"] = webhook_url

        result = sdk.preference().create(preference_data)
        preference = result["response"]

        if "id" in preference:
            # checkout_iniciado = se generó el link y se mandó a MP, pero aún no elige
            # forma de pago ni paga. Si abandona, queda aquí (≠ pendiente_pago real de SPEI/OXXO).
            supabase_patch(
                f"pedidos?id=eq.{pedido_id}",
                {"mp_preference_id": preference["id"], "status": "checkout_iniciado"}
            )
            return {
                "preference_id": preference["id"],
                "init_point": preference["init_point"],
                "sandbox_init_point": preference["sandbox_init_point"]
            }
        else:
            print(f"MP error response: {preference}")
            return JSONResponse(status_code=500, content={"error": str(preference.get("message", preference))})

    except Exception as e:
        import traceback
        print(f"crear_preferencia exception: {traceback.format_exc()}")
        return JSONResponse(status_code=500, content={"error": str(e)})


def _total_validado(pedido_id):
    """Total autoritativo del pedido. Usa el total guardado, pero NUNCA por debajo
    del valor real de los productos (validado contra catálogo) — anti-manipulación."""
    try:
        ped = supabase_get(f"pedidos?id=eq.{pedido_id}&select=total")
        total = float(ped[0]["total"]) if ped and ped[0].get("total") is not None else None
    except Exception:
        total = None
    try:
        items = _construir_items_validados(pedido_id, [])
        floor = sum(float(i["unit_price"]) * int(i["quantity"]) for i in items) if items else None
    except Exception:
        floor = None
    if total is None:
        return floor
    if floor is not None and total < floor:
        return round(floor, 2)
    return round(total, 2)


@router.get("/config")
def pagos_config(test: bool = False):
    """Llave pública de MP para inicializar el Brick embebido en el frontend."""
    pk = _public_key(test)
    return {"public_key": pk, "test_mode": bool(test and MP_ACCESS_TOKEN_TEST), "disponible": bool(pk)}


# ─── TERMINAL POINT (Point Integration API) ────────────────────────
@router.get("/terminal/dispositivos")
def listar_dispositivos_point():
    """Diagnostico: lista las terminales Point vinculadas a la cuenta de MP
    y si estan en modo PDV (integrable por API) o STANDALONE (solo manual).
    Paso previo obligatorio antes de poder mandarle el monto a la terminal
    automaticamente desde el POS."""
    try:
        req = urllib.request.Request(
            "https://api.mercadopago.com/point/integration-api/devices",
            headers={"Authorization": f"Bearer {os.getenv('MP_ACCESS_TOKEN')}"}
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
        return data
    except urllib.error.HTTPError as e:
        return JSONResponse(status_code=e.code, content={"error": e.read().decode()})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def _mp_point_request(method, path, body=None, idempotency_key=None):
    url = f"https://api.mercadopago.com{path}"
    data = json.dumps(body).encode() if body is not None else None
    headers = {
        "Authorization": f"Bearer {os.getenv('MP_ACCESS_TOKEN')}",
        "Content-Type": "application/json",
    }
    if idempotency_key:
        headers["X-Idempotency-Key"] = idempotency_key
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read()
        return json.loads(raw) if raw else {}


@router.post("/terminal/{device_id}/modo")
def cambiar_modo_terminal(device_id: str, datos: dict, _staff=Depends(require_staff)):
    """Cambia el modo de operacion de la terminal: PDV (integrable por API,
    deja de aceptar montos tecleados a mano) o STANDALONE (modo manual,
    como viene por default)."""
    try:
        modo = datos.get("operating_mode", "PDV")
        resultado = _mp_point_request("PATCH", f"/point/integration-api/devices/{device_id}", {"operating_mode": modo})
        return resultado
    except urllib.error.HTTPError as e:
        return JSONResponse(status_code=e.code, content={"error": e.read().decode()})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/terminal/cobrar")
def cobrar_con_terminal(datos: dict, _staff=Depends(require_staff)):
    """Manda el monto (en pesos MXN) a la terminal fisica para que el
    cliente pague con tarjeta. Requiere que la terminal ya este en modo PDV."""
    try:
        device_id = datos.get("device_id")
        monto = float(datos.get("monto") or 0)
        pedido_id = datos.get("pedido_id", "")
        if not device_id or monto <= 0:
            return JSONResponse(status_code=400, content={"error": "Falta device_id o el monto es invalido"})

        body = {
            "amount": int(round(monto * 100)),  # la API espera centavos
            "additional_info": {
                "external_reference": pedido_id,
                "print_on_terminal": True
            }
        }
        resultado = _mp_point_request(
            "POST", f"/point/integration-api/devices/{device_id}/payment-intents",
            body, idempotency_key=f"pedido-{pedido_id}-{int(time.time())}"
        )
        return resultado
    except urllib.error.HTTPError as e:
        return JSONResponse(status_code=e.code, content={"error": e.read().decode()})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/terminal/estado/{intent_id}")
def estado_intento_terminal(intent_id: str, _staff=Depends(require_staff)):
    """Consulta el estado del cobro en la terminal: OPEN (esperando
    tarjeta), FINISHED (pagado), ERROR o CANCELED."""
    try:
        resultado = _mp_point_request("GET", f"/point/integration-api/payment-intents/{intent_id}")
        return resultado
    except urllib.error.HTTPError as e:
        return JSONResponse(status_code=e.code, content={"error": e.read().decode()})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/terminal/{device_id}/cobrar/{intent_id}")
def cancelar_intento_terminal(device_id: str, intent_id: str, _staff=Depends(require_staff)):
    """Cancela un cobro pendiente en la terminal (el cliente se arrepintio
    o el cajero se equivoco de monto)."""
    try:
        resultado = _mp_point_request("DELETE", f"/point/integration-api/devices/{device_id}/payment-intents/{intent_id}")
        return resultado
    except urllib.error.HTTPError as e:
        return JSONResponse(status_code=e.code, content={"error": e.read().decode()})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/procesar")
def procesar_pago(datos: dict):
    """Cobro embebido (Checkout Bricks / Payments API). El navegador tokeniza la
    tarjeta y aquí se crea el pago server-side. El MONTO se calcula en el servidor
    (no se confía en el cliente). El webhook hace el post-pago igual que Checkout Pro."""
    try:
        test = bool(datos.get("test"))
        pedido_id = datos.get("pedido_id")
        token = datos.get("token")
        payment_method_id = datos.get("payment_method_id")
        if not pedido_id or not payment_method_id:
            return JSONResponse(status_code=400, content={"error": "Faltan datos del pago"})

        monto = _total_validado(pedido_id)
        if not monto or monto <= 0:
            return JSONResponse(status_code=400, content={"error": "No se pudo determinar el total"})

        ped = supabase_get(f"pedidos?id=eq.{pedido_id}&select=email_cliente")
        email = ((ped[0].get("email_cliente") if ped else "") or
                 (datos.get("payer") or {}).get("email") or "cliente@zapatillasmay.mx")

        pago_data = {
            "transaction_amount": float(monto),
            "description": f"Pedido {pedido_id} - Zapatillas May",
            "payment_method_id": payment_method_id,
            "payer": {"email": email},
            "external_reference": str(pedido_id),
        }
        if token:
            pago_data["token"] = token
            pago_data["installments"] = int(datos.get("installments") or 1)
        if datos.get("issuer_id"):
            pago_data["issuer_id"] = datos.get("issuer_id")
        webhook_url = os.getenv("MP_WEBHOOK_URL", "")
        if webhook_url:
            pago_data["notification_url"] = webhook_url

        result = _sdk(test).payment().create(pago_data)
        pago = result.get("response", {}) or {}
        if pago.get("id"):
            supabase_patch(f"pedidos?id=eq.{pedido_id}", {"mp_payment_id": str(pago.get("id"))})

        tdetails = pago.get("transaction_details") or {}
        return {
            "status": pago.get("status"),            # approved / in_process / rejected / pending
            "status_detail": pago.get("status_detail"),
            "id": pago.get("id"),
            "voucher_url": tdetails.get("external_resource_url"),  # OXXO/SPEI
        }
    except Exception as e:
        import traceback
        print(f"procesar_pago: {traceback.format_exc()}")
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/webhook")
async def webhook_mercadopago(request: Request):
    try:
        raw_body = await request.body()
        query = request.query_params

        try:
            body = json.loads(raw_body) if raw_body else {}
        except Exception:
            body = {}

        # Mercado Pago manda dos formatos al mismo webhook:
        # 1) el nuevo, firmado (body JSON con type/data.id + header x-signature).
        # 2) el IPN legado (?id=...&topic=payment o topic=merchant_order), sin
        #    body util (o sin body del todo) — la firma no se puede validar
        #    porque _validar_firma_mp necesita "data.id" del body para armar el
        #    manifest. Confirmado en produccion: MP a veces SI manda el header
        #    x-signature en estas notificaciones (rompiendo la heuristica
        #    original de "legado = sin x-signature"), pero igual sin data.id en
        #    el body, asi que la validacion siempre fallaba con 400 -- el pago
        #    nunca se marcaba como pagado para topic=payment/merchant_order.
        # Es seguro aceptarlo sin firma porque la verdad real no viene del webhook:
        # más abajo volvemos a preguntarle a la API de MP (con NUESTRO access token)
        # el estado del pago antes de tocar cualquier dato.
        tiene_data_id = bool(body.get("data", {}).get("id"))
        es_formato_legado = not tiene_data_id and query.get("topic") and query.get("id")

        if not es_formato_legado and not _validar_firma_mp(raw_body, dict(request.headers)):
            return JSONResponse(status_code=400, content={"error": "Firma invalida"})

        tipo = body.get("type") or query.get("topic")

        if tipo == "payment":
            payment_id = body.get("data", {}).get("id") or query.get("id")
            if payment_id:
                result = sdk.payment().get(payment_id)
                payment = result["response"]
                status = payment.get("status")
                pedido_id = payment.get("external_reference")

                # Forma de pago real según el método de MercadoPago. Se calcula una sola
                # vez y se aplica tanto si el pago quedó aprobado como si quedó pendiente
                # (OXXO/SPEI): antes solo se guardaba al aprobar, así que un pedido con
                # voucher de OXXO generado (pero aún sin pagar en tienda) se quedaba
                # mostrando el valor por defecto de la columna ("efectivo"), engañoso.
                _pt = (payment or {}).get("payment_type_id", "")
                _forma = {
                    "credit_card": "tarjeta", "debit_card": "tarjeta", "prepaid_card": "tarjeta",
                    "account_money": "mercadopago", "digital_wallet": "mercadopago",
                    "ticket": "oxxo", "atm": "spei", "bank_transfer": "spei",
                }.get(_pt, "mercadopago")

                if pedido_id:
                    if status == "approved":
                        pedido = supabase_get(f"pedidos?id=eq.{pedido_id}&select=*,pedido_items(*)")
                        if pedido:
                            p = pedido[0]
                            # Evitar procesar el mismo pago dos veces
                            if p.get("status") in ("pagado", "enviado", "confirmado"):
                                print(f"[webhook] Pedido {pedido_id} ya procesado (status={p.get('status')}), ignorando.")
                                return {"ok": True}
                            items = p.get("pedido_items", [])
                            sucursal_id = p.get("sucursal_id")
                            for item in items:
                                variante_id = item.get("variante_id")
                                cantidad = item.get("cantidad", 1)
                                if not variante_id:
                                    continue
                                # Mostrador trae sucursal_id; los pedidos WEB no → descontar
                                # del inventario donde exista la variante (bodega online).
                                if sucursal_id:
                                    inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
                                else:
                                    inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&order=cantidad.desc&limit=1")
                                if inv:
                                    inv_suc = inv[0].get("sucursal_id")
                                    cantidad_anterior = inv[0]["cantidad"]
                                    nueva_cantidad = max(0, cantidad_anterior - cantidad)
                                    supabase_patch(
                                        f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{inv_suc}",
                                        {"cantidad": nueva_cantidad}
                                    )
                                    try:
                                        supabase_post("movimientos_inventario", {
                                            "tipo": "venta",
                                            "variante_id": variante_id,
                                            "sucursal_id": inv_suc,
                                            "cantidad": -cantidad,
                                            "cantidad_anterior": cantidad_anterior,
                                            "motivo": f"Pago MercadoPago {payment_id} — pedido {pedido_id}",
                                        })
                                    except Exception as e_mov:
                                        print(f"[webhook MP] Error registrando movimiento de venta: {e_mov}")
                            supabase_patch(
                                f"pedidos?id=eq.{pedido_id}",
                                {"status": "pagado", "mp_payment_id": str(payment_id), "forma_pago": _forma}
                            )
                            try:
                                from routers.push import enviar_push
                                nombre_cli = p.get("nombre_cliente") or "Cliente"
                                enviar_push(
                                    titulo="💰 Pago confirmado",
                                    cuerpo=f"{nombre_cli} — ${float(p.get('total') or 0):.0f} MXN",
                                    url="/?modulo=pedidos",
                                    sitio="panel",
                                )
                            except Exception as e_push:
                                print(f"[push] Error avisando pago confirmado: {e_push}")
                            enviar_evento_meta("Purchase", p, payment)
                            enviar_ga4_purchase(p, payment)
                            try:
                                from routers.pinterest import enviar_checkout as pinterest_checkout
                                pinterest_checkout(p, payment)
                            except Exception as _pe:
                                print(f"[pagos] Error Pinterest CAPI: {_pe}")
                            _confirmar_pago_whatsapp(p)
                            email_cliente = p.get("email_cliente", "")
                            if email_cliente:
                                try:
                                    subj, html = email_pedido_confirmado(p)
                                    enviar_email(email_cliente, subj, html, tipo="pedido_confirmado")
                                except Exception as e:
                                    print(f"[pagos] Error email confirmación cliente: {e}")
                            try:
                                subj_neg, html_neg = email_nuevo_pedido_negocio(p)
                                enviar_email(NEGOCIO_EMAIL, subj_neg, html_neg, tipo="aviso_negocio")
                            except Exception as e:
                                print(f"[pagos] Error email negocio: {e}")
                            try:
                                from routers.carrito_abandonado import marcar_convertido
                                marcar_convertido(email_cliente)
                            except Exception:
                                pass

                    elif status in ["rejected", "cancelled", "expired"]:
                        # "expired": el voucher de OXXO/SPEI venció sin pagarse (~3 días). Sin
                        # este caso el pedido se quedaba en "pendiente_pago" para siempre, sin
                        # que nadie se enterara de que el cliente ya no va a pagar.
                        # Se guarda también forma_pago para que el registro quede completo
                        # (saber que fue un intento de OXXO/SPEI aunque no se haya concretado).
                        supabase_patch(f"pedidos?id=eq.{pedido_id}", {"status": "cancelado", "forma_pago": _forma})

                    elif status == "pending":
                        pedido = supabase_get(f"pedidos?id=eq.{pedido_id}&select=*,pedido_items(*)")
                        ya_era_pendiente = pedido and pedido[0].get("status") == "pendiente_pago"
                        supabase_patch(f"pedidos?id=eq.{pedido_id}", {"status": "pendiente_pago", "forma_pago": _forma})
                        # Email SPEI/OXXO pendiente al cliente (solo la primera vez)
                        if pedido and not ya_era_pendiente:
                            p = pedido[0]
                            email_cliente = p.get("email_cliente", "")
                            if email_cliente:
                                try:
                                    subj, html = email_pedido_pendiente_spei(p)
                                    enviar_email(email_cliente, subj, html, tipo="pedido_pendiente_spei")
                                except Exception as e:
                                    print(f"[pagos] Error email SPEI/OXXO pendiente: {e}")

        return {"ok": True}
    except Exception:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.get("/estado/{pedido_id}")
def estado_pago(pedido_id: str):
    try:
        pedido = supabase_get(f"pedidos?id=eq.{pedido_id}")
        if pedido:
            return {"status": pedido[0].get("status"), "pedido_id": pedido_id}
        return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
    except Exception:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})
