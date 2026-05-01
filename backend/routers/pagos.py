from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_patch, supabase_post
import mercadopago
import os
import hashlib
import time
import urllib.request
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/pagos", tags=["Pagos"])

sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))

META_PIXEL_ID = os.getenv("META_PIXEL_ID")
META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN")

def hash_data(value):
    if not value:
        return None
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()

def enviar_evento_meta(event_name, pedido, payment):
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

        contents = []
        for item in items:
            contents.append({
                "id": item.get("variante_id", ""),
                "quantity": item.get("cantidad", 1),
                "item_price": float(item.get("precio_unitario", 0))
            })

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

        url = f"https://graph.facebook.com/v18.0/{META_PIXEL_ID}/events?access_token={META_ACCESS_TOKEN}"
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req) as res:
            print("Meta evento enviado:", event_name, res.read())

    except Exception as e:
        print("Error enviando evento a Meta:", str(e))

@router.post("/crear-preferencia")
def crear_preferencia(datos: dict):
    try:
        pedido_id = datos.get("pedido_id")
        items = datos.get("items", [])
        cliente = datos.get("cliente", {})
        total = datos.get("total", 0)

        preference_data = {
            "items": [
                {
                    "title": item.get("nombre", "Producto"),
                    "quantity": item.get("cantidad", 1),
                    "unit_price": float(item.get("precio", 0)),
                    "currency_id": "MXN"
                }
                for item in items
            ],
            "payer": {
                "name": cliente.get("nombre", ""),
                "email": cliente.get("email", "cliente@zapatillasmay.mx")
            },
            "external_reference": pedido_id,
            "notification_url": os.getenv("MP_WEBHOOK_URL", ""),
            "back_urls": {
                "success": os.getenv("FRONTEND_URL", "http://localhost:5173") + "/pedido-exitoso",
                "failure": os.getenv("FRONTEND_URL", "http://localhost:5173") + "/pedido-fallido",
                "pending": os.getenv("FRONTEND_URL", "http://localhost:5173") + "/pedido-pendiente"
            },
            "auto_return": "approved",
            "payment_methods": {
                "excluded_payment_types": [],
                "installments": 12
            }
        }

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
            return JSONResponse(status_code=500, content={"error": "Error creando preferencia", "detalle": preference})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/webhook")
async def webhook_mercadopago(request: Request):
    try:
        body = await request.json()
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
                        if pedido and len(pedido) > 0:
                            items = pedido[0].get("pedido_items", [])
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
                            supabase_patch(
                                f"pedidos?id=eq.{pedido_id}",
                                {"status": "pagado", "mp_payment_id": str(payment_id)}
                            )
                            # Enviar evento Purchase a Meta server-side
                            enviar_evento_meta("Purchase", pedido[0], payment)

                    elif status in ["rejected", "cancelled"]:
                        supabase_patch(
                            f"pedidos?id=eq.{pedido_id}",
                            {"status": "cancelado"}
                        )
                    elif status == "pending":
                        supabase_patch(
                            f"pedidos?id=eq.{pedido_id}",
                            {"status": "pendiente_pago"}
                        )

        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/estado/{pedido_id}")
def estado_pago(pedido_id: str):
    try:
        pedido = supabase_get(f"pedidos?id=eq.{pedido_id}")
        if pedido and len(pedido) > 0:
            return {"status": pedido[0].get("status"), "pedido_id": pedido_id}
        return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})