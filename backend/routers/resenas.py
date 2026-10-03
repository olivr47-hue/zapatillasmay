import re
import urllib.parse as _up
from security import limpiar_texto
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
    Reseña de un cliente VERIFICADO: debe haber comprado ese modelo (pedido pagado/confirmado/
    enviado/entregado con el mismo correo). Antes pedía un "token de pedido" que ningún proceso
    generaba y consultaba columnas que no existen en `pedidos` (token_confirmacion, items), así que
    NINGUNA reseña se pudo crear jamás. Queda pendiente de aprobación en el panel.
    Body: { calificacion: 1-5, comentario: str, nombre: str, email: str }
    """
    from textos import limpiar_campos
    limpiar_campos(datos, ("comentario", "nombre"))
    try:
        cal = _validar_calificacion(datos.get("calificacion"))
        if cal is None:
            return {"error": "calificacion debe ser entre 1 y 5"}

        comentario = limpiar_texto(str(datos.get("comentario") or "").strip()[:_MAX_COMMENT_LEN])
        nombre = limpiar_texto(str(datos.get("nombre") or "Cliente").strip()[:80], comillas=True)
        email = str(datos.get("email") or "").strip().lower()
        if "@" not in email:
            return {"error": "Escribe el correo con el que hiciste tu compra."}

        producto = supabase_get(f"productos?sku_interno=eq.{_up.quote(sku, safe='')}&select=id&limit=1")
        if not producto:
            return {"error": "Producto no encontrado."}
        pid = producto[0]["id"]

        # Pedidos comprados con ese correo que incluyan este modelo
        pedidos = supabase_get(
            f"pedidos?email_cliente=ilike.{_up.quote(email, safe='')}"
            f"&status=in.(pagado,confirmado,enviado,entregado)"
            f"&select=id,email_cliente,pedido_items(variantes(producto_id))&order=created_at.desc&limit=50"
        ) or []
        pedido_id = None
        for pd in pedidos:
            if (pd.get("email_cliente") or "").strip().lower() != email:
                continue
            for it in pd.get("pedido_items") or []:
                if ((it.get("variantes") or {}).get("producto_id")) == pid:
                    pedido_id = pd["id"]
                    break
            if pedido_id:
                break
        if not pedido_id:
            return {"error": "No encontramos una compra de este modelo con ese correo. Usa el mismo correo de tu pedido."}

        # Evitar reseñas duplicadas del mismo pedido para el mismo producto
        existing = supabase_get(
            f"resenas_producto?producto_id=eq.{pid}&pedido_id=eq.{pedido_id}&limit=1"
        )
        if existing:
            supabase_patch(
                f"resenas_producto?producto_id=eq.{pid}&pedido_id=eq.{pedido_id}",
                {"calificacion": cal, "comentario": comentario, "nombre_cliente": nombre, "aprobada": False}
            )
            return {"ok": True, "mensaje": "Tu reseña fue actualizada y se publicará cuando la revisemos."}

        supabase_post("resenas_producto", {
            "producto_id": pid,
            "pedido_id": pedido_id,
            "calificacion": cal,
            "comentario": comentario,
            "nombre_cliente": nombre,
            "aprobada": False,   # el panel (Reseñas) las aprueba antes de publicarse
        })
        return {"ok": True, "mensaje": "¡Gracias por tu reseña! Se publicará cuando la revisemos."}
    except Exception as e:
        print(f"[resenas] error: {e}")
        return {"error": "No se pudo guardar tu reseña. Intenta de nuevo."}


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
