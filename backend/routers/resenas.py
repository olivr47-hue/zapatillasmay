import re
from fastapi import APIRouter
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(prefix="/resenas", tags=["Reseñas"])

_MAX_COMMENT_LEN = 500


def _validar_calificacion(cal):
    try:
        c = int(cal)
        return c if 1 <= c <= 5 else None
    except Exception:
        return None


@router.get("/producto/{sku}")
def get_resenas(sku: str):
    """Devuelve reseñas aprobadas de un producto."""
    try:
        producto = supabase_get(f"productos?sku_interno=eq.{sku}&select=id&limit=1")
        if not producto:
            return {"resenas": [], "total": 0, "promedio": None}
        pid = producto[0]["id"]
        rows = supabase_get(
            f"resenas_producto?producto_id=eq.{pid}&aprobada=eq.true"
            f"&select=id,calificacion,comentario,nombre_cliente,created_at"
            f"&order=created_at.desc&limit=50"
        ) or []
        if rows:
            promedio = round(sum(float(r["calificacion"]) for r in rows) / len(rows), 1)
        else:
            promedio = None
        return {"resenas": rows, "total": len(rows), "promedio": promedio}
    except Exception as e:
        return {"error": str(e)}


@router.post("/producto/{sku}")
def crear_resena(sku: str, datos: dict):
    """
    Recibe reseña de un cliente. Valida que el token de pedido sea real.
    Body: { calificacion: 1-5, comentario: str, nombre: str, pedido_token: str }
    """
    try:
        cal = _validar_calificacion(datos.get("calificacion"))
        if cal is None:
            return {"error": "calificacion debe ser entre 1 y 5"}

        comentario = str(datos.get("comentario") or "").strip()[:_MAX_COMMENT_LEN]
        nombre = str(datos.get("nombre") or "Cliente").strip()[:80]
        pedido_token = str(datos.get("pedido_token") or "").strip()

        # Verificar que el token de pedido exista y corresponda al SKU
        pedido_rows = None
        if pedido_token:
            pedido_rows = supabase_get(
                f"pedidos?token_confirmacion=eq.{pedido_token}&select=id,items&limit=1"
            )

        if not pedido_rows:
            return {"error": "Token de pedido inválido. Solo clientes que compraron pueden dejar reseña."}

        pedido = pedido_rows[0]
        pedido_id = pedido["id"]

        # Verificar que el pedido incluya el SKU del producto
        items = pedido.get("items") or []
        skus_pedido = [str(i.get("sku") or i.get("sku_interno") or "").strip() for i in (items if isinstance(items, list) else [])]
        if sku not in skus_pedido:
            return {"error": "Este producto no estaba en tu pedido."}

        # Buscar producto_id
        producto = supabase_get(f"productos?sku_interno=eq.{sku}&select=id&limit=1")
        if not producto:
            return {"error": "Producto no encontrado."}
        pid = producto[0]["id"]

        # Evitar reseñas duplicadas del mismo pedido para el mismo producto
        existing = supabase_get(
            f"resenas_producto?producto_id=eq.{pid}&pedido_id=eq.{pedido_id}&limit=1"
        )
        if existing:
            # Actualizar en lugar de duplicar
            supabase_patch(
                f"resenas_producto?producto_id=eq.{pid}&pedido_id=eq.{pedido_id}",
                {"calificacion": cal, "comentario": comentario, "nombre_cliente": nombre, "aprobada": True}
            )
            return {"ok": True, "mensaje": "Tu reseña fue actualizada."}

        supabase_post("resenas_producto", {
            "producto_id": pid,
            "pedido_id": pedido_id,
            "calificacion": cal,
            "comentario": comentario,
            "nombre_cliente": nombre,
            "aprobada": True,
        })
        return {"ok": True, "mensaje": "¡Gracias por tu reseña!"}
    except Exception as e:
        return {"error": str(e)}


@router.get("/admin/pendientes")
def resenas_pendientes():
    """Panel admin: reseñas pendientes de aprobación."""
    try:
        rows = supabase_get(
            "resenas_producto?aprobada=eq.false&select=id,calificacion,comentario,nombre_cliente,created_at,producto_id&order=created_at.desc&limit=100"
        ) or []
        return {"resenas": rows, "total": len(rows)}
    except Exception as e:
        return {"error": str(e)}


@router.patch("/admin/{resena_id}/aprobar")
def aprobar_resena(resena_id: str):
    """Panel admin: aprobar una reseña."""
    try:
        supabase_patch(f"resenas_producto?id=eq.{resena_id}", {"aprobada": True})
        return {"ok": True}
    except Exception as e:
        return {"error": str(e)}


@router.delete("/admin/{resena_id}")
def eliminar_resena(resena_id: str):
    """Panel admin: eliminar una reseña."""
    try:
        from database import supabase_delete
        supabase_delete(f"resenas_producto?id=eq.{resena_id}")
        return {"ok": True}
    except Exception as e:
        return {"error": str(e)}
