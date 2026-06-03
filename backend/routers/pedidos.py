import os
import json
import urllib.request
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


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
        urllib.request.urlopen(req)
        print(f"WA confirmacion enviada a {telefono} ({nombre})")
    except Exception as e:
        print(f"WA confirmacion error (no critico): {e}")


@router.get("/")
def listar_pedidos():
    try:
        return supabase_get("pedidos?order=created_at.desc&select=*,clientes(nombre,telefono),sucursales(nombre)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/pendientes")
def pedidos_pendientes():
    try:
        return supabase_get("pedidos?status=eq.pendiente_pago&select=*,clientes(nombre,telefono)")
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
def crear_pedido(pedido: dict):
    try:
        print(f"DATOS RECIBIDOS: {pedido}")
        items = pedido.pop("items", [])
        print(f"ITEMS: {items}")
        print(f"PEDIDO SIN ITEMS: {pedido}")
        resultado = supabase_post("pedidos", pedido)
        print(f"RESULTADO SUPABASE: {resultado}")
        if resultado and len(resultado) > 0:
            pedido_id = resultado[0]["id"]
            for item in items:
                item["pedido_id"] = pedido_id
                supabase_post("pedido_items", item)
            return resultado[0]
        return JSONResponse(status_code=500, content={"error": "Error creando pedido"})
    except Exception as e:
        print(f"ERROR: {str(e)}")
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
                    supabase_post("movimientos_inventario", {
                        "tipo": "venta",
                        "variante_id": variante_id,
                        "sucursal_id": sucursal_id,
                        "cantidad": -cantidad,
                        "motivo": f"Venta pedido {id}"
                    })
        supabase_patch(f"pedidos?id=eq.{id}", {
            "status": "confirmado",
            "forma_pago": datos.get("forma_pago", "efectivo")
        })

        # Enviar confirmacion por WhatsApp si el cliente tiene telefono registrado
        _enviar_confirmacion_wa(pedido[0], items)

        return {"ok": True}
    except Exception as e:
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
