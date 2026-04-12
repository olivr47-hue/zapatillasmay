from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_patch, supabase_post
import mercadopago
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/pagos", tags=["Pagos"])

sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))

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