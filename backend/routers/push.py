# -*- coding: utf-8 -*-
"""
Router de notificaciones Push (Web Push) — ERP Zapatillas May.

Permite que clientes que "instalan" la tienda o el portal mayorista como
PWA reciban notificaciones nativas del navegador (como WhatsApp/Uber Eats),
usando el estandar Web Push (VAPID + cifrado aes128gcm), sin depender de
ningun servicio de terceros de pago.
"""
import os
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete

router = APIRouter(prefix="/push", tags=["Push"])

VAPID_PUBLIC_KEY  = os.getenv("VAPID_PUBLIC_KEY", "")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY", "")
VAPID_EMAIL       = os.getenv("VAPID_EMAIL", "contacto@zapatillasmay.mx")

try:
    from pywebpush import webpush, WebPushException
    _PYWEBPUSH_OK = True
except Exception as e:
    _PYWEBPUSH_OK = False
    _import_error = str(e)


@router.get("/public-key")
def public_key():
    """El frontend la usa para suscribir el navegador del visitante."""
    return {"publicKey": VAPID_PUBLIC_KEY, "configurado": bool(VAPID_PUBLIC_KEY and _PYWEBPUSH_OK)}


@router.post("/suscribir")
def suscribir(body: dict):
    """
    Guarda una suscripcion push nueva (o la reactiva si ya existia).
    Body: { "subscription": {"endpoint":..., "keys": {"p256dh":..., "auth":...}},
             "sitio": "tienda"|"portal", "cliente_id": "uuid opcional" }
    """
    sub = body.get("subscription") or {}
    endpoint = sub.get("endpoint")
    keys = sub.get("keys") or {}
    if not endpoint or not keys.get("p256dh") or not keys.get("auth"):
        return JSONResponse(status_code=400, content={"error": "Suscripcion invalida"})

    existentes = supabase_get(f"push_subscriptions?endpoint=eq.{endpoint}&select=id")
    datos = {
        "endpoint":   endpoint,
        "p256dh":     keys["p256dh"],
        "auth":       keys["auth"],
        "sitio":      body.get("sitio") or "tienda",
        "cliente_id": body.get("cliente_id") or None,
        "user_agent": body.get("user_agent") or "",
        "activa":     True,
    }
    if existentes:
        supabase_patch(f"push_subscriptions?id=eq.{existentes[0]['id']}", datos)
    else:
        supabase_post("push_subscriptions", datos)
    return {"ok": True}


@router.post("/desuscribir")
def desuscribir(body: dict):
    endpoint = body.get("endpoint")
    if not endpoint:
        return JSONResponse(status_code=400, content={"error": "endpoint requerido"})
    supabase_patch(f"push_subscriptions?endpoint=eq.{endpoint}", {"activa": False})
    return {"ok": True}


def _enviar_a_suscripcion(sub: dict, titulo: str, cuerpo: str, url: str) -> bool:
    """Manda una notificacion a UNA suscripcion. True si se entrego bien."""
    if not _PYWEBPUSH_OK or not VAPID_PRIVATE_KEY:
        return False
    try:
        webpush(
            subscription_info={
                "endpoint": sub["endpoint"],
                "keys": {"p256dh": sub["p256dh"], "auth": sub["auth"]},
            },
            data='{"title": %r, "body": %r, "url": %r}' % (titulo, cuerpo, url or "/"),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims={"sub": f"mailto:{VAPID_EMAIL}"},
        )
        return True
    except WebPushException as e:
        # 404/410 = la suscripcion ya no existe (usuario desinstalo/bloqueo) -> desactivar
        status = getattr(e.response, "status_code", None)
        if status in (404, 410):
            supabase_patch(f"push_subscriptions?endpoint=eq.{sub['endpoint']}", {"activa": False})
        return False
    except Exception:
        return False


def enviar_push(titulo: str, cuerpo: str, url: str = "/", sitio: str = None, cliente_id: str = None) -> dict:
    """
    Funcion interna reusable — la llaman otros routers (pedidos, carrito
    abandonado) para mandar una notificacion real a un cliente especifico,
    o de forma masiva a todos los suscriptores de un sitio.
    """
    if not _PYWEBPUSH_OK:
        return {"enviadas": 0, "fallidas": 0, "error": f"pywebpush no disponible: {_import_error}"}
    if not VAPID_PRIVATE_KEY:
        return {"enviadas": 0, "fallidas": 0, "error": "Faltan las llaves VAPID en Railway"}

    filtro = "activa=eq.true"
    if sitio:
        filtro += f"&sitio=eq.{sitio}"
    if cliente_id:
        filtro += f"&cliente_id=eq.{cliente_id}"
    subs = supabase_get_all(f"push_subscriptions?{filtro}&select=*")

    enviadas, fallidas = 0, 0
    for sub in subs:
        if _enviar_a_suscripcion(sub, titulo, cuerpo, url):
            enviadas += 1
            supabase_patch(f"push_subscriptions?id=eq.{sub['id']}", {"ultimo_envio_at": "now()"})
        else:
            fallidas += 1

    supabase_post("push_notificaciones_log", {
        "titulo": titulo, "cuerpo": cuerpo, "url": url, "sitio": sitio or "todos",
        "enviadas": enviadas, "fallidas": fallidas,
    })
    return {"enviadas": enviadas, "fallidas": fallidas}


@router.post("/enviar")
def enviar_notificacion(body: dict):
    """
    Envio manual desde el panel.
    Body: { "titulo": "...", "cuerpo": "...", "url": "/ofertas", "sitio": "tienda"|"portal"|null (todos) }
    """
    titulo = (body.get("titulo") or "").strip()
    cuerpo = (body.get("cuerpo") or "").strip()
    if not titulo or not cuerpo:
        return JSONResponse(status_code=400, content={"error": "titulo y cuerpo son requeridos"})
    return enviar_push(titulo, cuerpo, body.get("url") or "/", body.get("sitio") or None)


@router.get("/suscriptores")
def listar_suscriptores():
    subs = supabase_get_all("push_subscriptions?activa=eq.true&select=sitio,created_at")
    por_sitio = {}
    for s in subs:
        por_sitio[s["sitio"]] = por_sitio.get(s["sitio"], 0) + 1
    return {"total": len(subs), "por_sitio": por_sitio}


@router.get("/historial")
def historial_envios():
    return supabase_get_all("push_notificaciones_log?order=created_at.desc&limit=50")


@router.get("/diagnostico")
def diagnostico():
    return {
        "pywebpush_instalado": _PYWEBPUSH_OK,
        "vapid_configurado": bool(VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY),
        "error_import": None if _PYWEBPUSH_OK else _import_error,
    }
