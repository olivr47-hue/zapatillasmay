from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

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
        return supabase_post("pedidos", pedido)
    except Exception as e:
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

@router.post("/{id}/confirmar")
def confirmar_pedido(id: str, datos: dict):
    try:
        pedido = supabase_get(f"pedidos?id=eq.{id}")
        if not pedido:
            return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
        items = supabase_get(f"pedido_items?pedido_id=eq.{id}")
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
                    except Exception as mov_error:
          print(f"Error registrando movimiento: {mov_error}")
        supabase_patch(f"pedidos?id=eq.{id}", {
            "status": "confirmado",
            "forma_pago": datos.get("forma_pago", "efectivo")
        })
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
        items = supabase_get(f"pedido_items?pedido_id=eq.{id}")
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
                    supabase_post("movimientos,inventario", {
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