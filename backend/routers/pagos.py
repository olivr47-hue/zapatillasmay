from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_patch, supabase_post
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


def enviar_evento_meta(event_name, pedido, payment):
    if not META_PIXEL_ID or not META_ACCESS_TOKEN:
        return
    try:
        total = float(pedido.get("total", 0))
        email = pedido.get("email_cliente", "")
        telefono = pedido.get("telefono_cliente", "")
        nombre = pedido.get("nombre_cliente", "")
        pedido_id = pedido.get("id", "")
        items = pedido.get("pedido_items", [])

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

        payload = {
            "data": [
                {
                    "event_name": event_name,
                    "event_time": int(time.time()),
                    "event_id": f"{pedido_id}-{event_name}",
                    "action_source": "website",
                    "user_data": {
                        "em": [hash_data(email)] if email else [],
                        "ph": [hash_data(telefono)] if telefono else [],
                        "fn": [hash_data(fn)] if fn else [],
                        "ln": [hash_data(ln)] if ln else [],
                    },
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
        url = f"https://graph.facebook.com/v18.0/{META_PIXEL_ID}/events"
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

    except Exception:
        pass  # No exponer detalles de error en logs


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


@router.post("/crear-preferencia")
def crear_preferencia(datos: dict):
    try:
        pedido_id = datos.get("pedido_id")
        items = datos.get("items", [])
        cliente = datos.get("cliente", {})

        webhook_url = os.getenv("MP_WEBHOOK_URL", "")
        frontend_url = os.getenv("FRONTEND_URL", "https://zapatillasmay.mx")

        preference_data = {
            "items": [
                {
                    "title": item.get("nombre", "Producto")[:255],
                    "quantity": int(item.get("cantidad", 1)),
                    "unit_price": float(item.get("precio", 0)),
                    "currency_id": "MXN"
                }
                for item in items
            ],
            "payer": {
                "name": cliente.get("nombre", ""),
                "email": cliente.get("email", "cliente@zapatillasmay.mx")
            },
            "external_reference": str(pedido_id),
            "back_urls": {
                "success": frontend_url + "/pedido-exitoso",
                "failure": frontend_url + "/pedido-fallido",
                "pending": frontend_url + "/pedido-pendiente"
            },
            "auto_return": "approved",
        }
        if webhook_url:
            preference_data["notification_url"] = webhook_url

        result = sdk.preference().create(preference_data)
        preference = result["response"]

        if "id" in preference:
            supabase_patch(
                f"pedidos?id=eq.{pedido_id}",
                {"mp_preference_id": preference["id"], "status": "pendiente_pago"}
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


@router.post("/webhook")
async def webhook_mercadopago(request: Request):
    try:
        raw_body = await request.body()

        # Validar firma HMAC de Mercado Pago
        if not _validar_firma_mp(raw_body, dict(request.headers)):
            return JSONResponse(status_code=400, content={"error": "Firma invalida"})

        body = json.loads(raw_body)
        tipo = body.get("type")

        if tipo == "payment":
            payment_id = body.get("data", {}).get("id")
            if payment_id:
                result = sdk.payment().get(payment_id)
                payment = result["response"]
                status = payment.get("status")
                pedido_id = payment.get("external_reference")

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
                                if variante_id and sucursal_id:
                                    inv = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
                                    if inv:
                                        nueva_cantidad = max(0, inv[0]["cantidad"] - cantidad)
                                        supabase_patch(
                                            f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
                                            {"cantidad": nueva_cantidad}
                                        )
                            supabase_patch(
                                f"pedidos?id=eq.{pedido_id}",
                                {"status": "pagado", "mp_payment_id": str(payment_id)}
                            )
                            enviar_evento_meta("Purchase", p, payment)
                            _confirmar_pago_whatsapp(p)
                            email_cliente = p.get("email_cliente", "")
                            if email_cliente:
                                try:
                                    subj, html = email_pedido_confirmado(p)
                                    enviar_email(email_cliente, subj, html)
                                except Exception as e:
                                    print(f"[pagos] Error email confirmación cliente: {e}")
                            try:
                                subj_neg, html_neg = email_nuevo_pedido_negocio(p)
                                enviar_email(NEGOCIO_EMAIL, subj_neg, html_neg)
                            except Exception as e:
                                print(f"[pagos] Error email negocio: {e}")
                            try:
                                from routers.carrito_abandonado import marcar_convertido
                                marcar_convertido(email_cliente)
                            except Exception:
                                pass

                    elif status in ["rejected", "cancelled"]:
                        supabase_patch(f"pedidos?id=eq.{pedido_id}", {"status": "cancelado"})

                    elif status == "pending":
                        pedido = supabase_get(f"pedidos?id=eq.{pedido_id}&select=*,pedido_items(*)")
                        supabase_patch(f"pedidos?id=eq.{pedido_id}", {"status": "pendiente_pago"})
                        # Email SPEI pendiente al cliente (solo si no se había enviado ya)
                        if pedido:
                            p = pedido[0]
                            email_cliente = p.get("email_cliente", "")
                            if email_cliente and p.get("status") != "pendiente_pago":
                                try:
                                    subj, html = email_pedido_pendiente_spei(p)
                                    enviar_email(email_cliente, subj, html)
                                except Exception as e:
                                    print(f"[pagos] Error email SPEI pendiente: {e}")

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
