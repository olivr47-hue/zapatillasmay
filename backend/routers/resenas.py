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


# ── Resumen de estrellas por producto (para las tarjetas del catálogo) ─────────
@router.get("/resumen")
def resumen_resenas():
    """{producto_id: {n, p}} solo de productos con reseñas aprobadas. Cacheado 10 min."""
    from cache import cache_get, cache_set
    cached = cache_get("resenas_resumen")
    if cached is not None:
        return cached
    try:
        rows = supabase_get("resenas_producto?aprobada=eq.true&select=producto_id,calificacion&limit=5000") or []
        acum = {}
        for r in rows:
            a = acum.setdefault(r["producto_id"], [0, 0.0])
            a[0] += 1
            a[1] += float(r["calificacion"])
        out = {pid: {"n": n, "p": round(s / n, 1)} for pid, (n, s) in acum.items()}
        cache_set("resenas_resumen", out, ttl=600)
        return out
    except Exception as e:
        print(f"[resenas] resumen error: {e}")
        return {}


# ── Solicitud de reseña por correo (una vez por pedido, 7 a 45 días después del envío) ──
_DIAS_MIN = 7
_DIAS_MAX = 45
_SITE = "https://zapatillasmay.mx"


def _enviar_solicitud(pedido: dict, productos: list) -> bool:
    import html as _html
    from email_utils import enviar_email, _base_html, _boton, _miniatura
    email = (pedido.get("email_cliente") or "").strip().rstrip(".")
    if "@" not in email:
        return False
    nombre = _html.escape((pedido.get("nombre_cliente") or "").split(" ")[0].capitalize()) if pedido.get("nombre_cliente") else "Hola"
    filas = ""
    for p in productos[:3]:
        slug = p.get("slug") or p.get("id")
        url = f"{_SITE}/producto/{_up.quote(str(slug), safe='')}?resena=1"
        filas += f"""
        <tr>
          <td width="86" style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:middle">{_miniatura(p.get("imagen_principal") or "")}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:middle;font-size:14px;color:#2A1A0E;line-height:1.45">
            <strong>{_html.escape(str(p.get("nombre") or "Tu pedido"))}</strong><br>
            <a href="{url}" style="color:#b5687a;font-size:13px;font-weight:700;text-decoration:none">Dejar mi reseña →</a>
          </td>
        </tr>"""
    contenido = f"""
        <h1 style="margin:0 0 8px;font-size:24px;line-height:1.25;color:#2A1A0E">{nombre}, ¿qué tal te quedaron? 👠</h1>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#5b4d44">
          Ya pasó una semana desde que enviamos tu pedido. Tu opinión ayuda a otras clientas a elegir su talla y su modelo, y a nosotras a mejorar. Solo toma un minuto.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{filas}</table>
        <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#5b4d44">
          Usa el mismo correo con el que hiciste tu compra. Si algo no salió como esperabas, respóndenos por WhatsApp y lo resolvemos.
        </p>"""
    html = _base_html(contenido, "Cuéntanos cómo te quedaron tus zapatillas: tu reseña ayuda a otras clientas.")
    return enviar_email(email, f"{nombre}, ¿cómo te quedaron tus zapatillas? — Zapatillas May", html, tipo="resena_solicitud")


def procesar_solicitudes() -> dict:
    """Pide reseña por correo a quien recibió un pedido web hace 7-45 días. Marca el pedido ANTES de enviar
    (si el envío falla se desmarca), así nunca se repite el correo aunque algo falle a medias."""
    import datetime as _dt
    try:
        ahora = _dt.datetime.now(_dt.timezone.utc)
        desde = _up.quote((ahora - _dt.timedelta(days=_DIAS_MAX)).isoformat())
        hasta = _up.quote((ahora - _dt.timedelta(days=_DIAS_MIN)).isoformat())
        pedidos = supabase_get(
            f"pedidos?canal=eq.web&status=in.(enviado,entregado)&resena_solicitada_at=is.null"
            f"&enviado_at=gte.{desde}&enviado_at=lte.{hasta}&email_cliente=like.*@*"
            f"&select=id,nombre_cliente,email_cliente,pedido_items(variantes(producto_id))&limit=20"
        ) or []
        enviados = 0
        for pd in pedidos:
            pids = []
            for it in pd.get("pedido_items") or []:
                pid = (it.get("variantes") or {}).get("producto_id")
                if pid and pid not in pids:
                    pids.append(pid)
            if not pids:
                supabase_patch(f"pedidos?id=eq.{pd['id']}", {"resena_solicitada_at": ahora.isoformat()})
                continue
            prods = supabase_get(f"productos?id=in.({','.join(pids)})&select=id,slug,nombre,imagen_principal") or []
            # Marcar primero; si no se puede marcar, no se envía (evita repetir correos)
            try:
                supabase_patch(f"pedidos?id=eq.{pd['id']}", {"resena_solicitada_at": ahora.isoformat()})
            except Exception as e:
                print(f"[resenas] no se pudo marcar el pedido {pd['id']}, se omite: {e}")
                continue
            if _enviar_solicitud(pd, prods):
                enviados += 1
            else:
                supabase_patch(f"pedidos?id=eq.{pd['id']}", {"resena_solicitada_at": None})
                print("[resenas] el envío falló; se reintenta en la siguiente vuelta")
                break
        return {"ok": True, "revisados": len(pedidos), "enviados": enviados}
    except Exception as e:
        print(f"[resenas] procesar_solicitudes error: {e}")
        return {"ok": False, "error": str(e)}


from fastapi import Depends
from security import require_staff


@router.post("/admin/solicitar")
def solicitar_ahora(_staff=Depends(require_staff)):
    """Corre la solicitud de reseñas ahora (también corre sola cada 6 horas)."""
    return procesar_solicitudes()
