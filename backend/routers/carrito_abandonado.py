# -*- coding: utf-8 -*-
"""
routers/carrito_abandonado.py
Carrito abandonado: captura el carrito en el checkout, y un proceso en segundo
plano envía un recordatorio por email (Resend) si el cliente no completa la compra.

Tabla requerida en Supabase:
  carritos_abandonados(
    id uuid default gen_random_uuid() primary key,
    email text not null,
    nombre text,
    items jsonb,
    total numeric,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    recordatorio_enviado boolean default false,
    recordatorio_enviado_at timestamptz,
    convertido boolean default false
  )
"""

import os
import json
import time
import datetime
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch

try:
    import resend
    resend.api_key = os.getenv("RESEND_API_KEY")
    _RESEND_OK = True
except ImportError:
    _RESEND_OK = False

router = APIRouter(prefix="/carrito-abandonado", tags=["Carrito Abandonado"])

_SECRET        = os.getenv("SECRET_KEY", "zapatillasmay2024erp")
_NOTIF_EMAIL   = os.getenv("NOTIF_EMAIL", "olivr47@gmail.com")
_FROM          = "Zapatillas May <noreply@zapatillasmay.mx>"
_HORAS_ESPERA  = float(os.getenv("CARRITO_HORAS_ESPERA", "1"))   # esperar 1h de inactividad
_SITE          = "https://zapatillasmay.mx"


def _now_iso():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


# ── 1. CAPTURA / UPSERT ───────────────────────────────────────────
@router.post("/guardar")
def guardar(datos: dict):
    """Guarda o actualiza el carrito de un cliente que está en el checkout."""
    email = (datos.get("email") or "").strip().lower()
    if not email or "@" not in email:
        return {"ok": False, "motivo": "email_invalido"}

    items = datos.get("items") or []
    total = datos.get("total") or 0
    nombre = (datos.get("nombre") or "").strip()

    if not items:
        return {"ok": False, "motivo": "sin_items"}

    try:
        existente = supabase_get(f"carritos_abandonados?email=eq.{email}&convertido=eq.false&select=id")
        payload = {
            "email": email,
            "nombre": nombre or None,
            "items": items,
            "total": total,
            "updated_at": _now_iso(),
            "recordatorio_enviado": False,  # reinicia si vuelve a actividad
        }
        if existente:
            supabase_patch(f"carritos_abandonados?id=eq.{existente[0]['id']}", payload)
            return {"ok": True, "accion": "actualizado", "id": existente[0]["id"]}
        else:
            payload["created_at"] = _now_iso()
            res = supabase_post("carritos_abandonados", payload)
            cid = res[0]["id"] if isinstance(res, list) and res else None
            return {"ok": True, "accion": "creado", "id": cid}
    except Exception as e:
        print(f"[carrito-abandonado] Error guardar: {e}")
        return {"ok": False, "motivo": "error"}


# ── 2. RECUPERAR CARRITO (para repoblar /carrito desde el email) ──
@router.get("/recuperar/{cid}")
def recuperar(cid: str):
    """Devuelve los items de un carrito abandonado para restaurarlo en la tienda."""
    try:
        rows = supabase_get(f"carritos_abandonados?id=eq.{cid}&select=items,email")
        if not rows:
            return {"ok": False}
        return {"ok": True, "items": rows[0].get("items") or []}
    except Exception:
        return {"ok": False}


# ── 3. MARCAR CONVERTIDO (se llama desde el webhook de pago) ──────
def marcar_convertido(email: str):
    email = (email or "").strip().lower()
    if not email or "@" not in email:
        return
    try:
        supabase_patch(
            f"carritos_abandonados?email=eq.{email}&convertido=eq.false",
            {"convertido": True}
        )
    except Exception as e:
        print(f"[carrito-abandonado] Error marcar convertido: {e}")


# ── 4. EMAIL DE RECORDATORIO ──────────────────────────────────────
def _enviar_recordatorio(carrito: dict) -> bool:
    if not _RESEND_OK or not resend.api_key:
        return False
    email  = carrito["email"]
    nombre = (carrito.get("nombre") or "").split(" ")[0].capitalize() if carrito.get("nombre") else "Hola"
    items  = carrito.get("items") or []
    total  = carrito.get("total") or 0
    cid    = carrito["id"]

    filas = ""
    for it in items[:6]:
        img = it.get("imagen") or ""
        nom = it.get("nombre") or "Producto"
        col = it.get("color") or ""
        tal = it.get("talla") or ""
        meta = " · ".join([x for x in [col, ("Talla " + str(tal)) if tal else ""] if x])
        img_html = (f'<img src="{img}" width="64" height="64" '
                    f'style="border-radius:8px;object-fit:cover;background:#f5f0eb">'
                    if img else '<div style="width:64px;height:64px;border-radius:8px;'
                    'background:#f5f0eb;text-align:center;line-height:64px;font-size:24px">👠</div>')
        filas += f"""
        <tr>
          <td style="padding:8px 0" width="76">{img_html}</td>
          <td style="padding:8px 0;font-size:14px;color:#333">
            <strong>{nom}</strong><br>
            <span style="color:#888;font-size:12px">{meta}</span>
          </td>
        </tr>"""

    recover_url = f"{_SITE}/carrito?recover={cid}"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff">
      <div style="background:linear-gradient(135deg,#b5687a,#c8967a);padding:32px;text-align:center">
        <h1 style="color:#fff;font-weight:300;margin:0;font-size:1.4rem">Zapatillas <strong>May</strong></h1>
      </div>
      <div style="padding:32px">
        <h2 style="font-size:1.2rem;color:#0A0A0A;margin-bottom:8px">¡{nombre}, dejaste algo en tu carrito! 👠</h2>
        <p style="color:#555;font-size:0.92rem;line-height:1.7;margin-bottom:20px">
          Tus modelos siguen disponibles, pero pueden agotarse. Completa tu compra antes de que se acaben:
        </p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">{filas}</table>
        <div style="background:#fdf8f5;border-radius:8px;padding:14px;text-align:center;margin-bottom:24px">
          <span style="color:#888;font-size:0.8rem">Total de tu carrito</span><br>
          <strong style="color:#c8967a;font-size:1.3rem">${total:.0f} MXN</strong>
        </div>
        <a href="{recover_url}"
           style="display:block;text-align:center;background:linear-gradient(135deg,#b5687a,#c8967a);color:#fff;padding:15px;border-radius:50px;text-decoration:none;font-weight:700;font-size:0.95rem">
          Completar mi compra →
        </a>
        <p style="color:#aaa;font-size:0.75rem;text-align:center;margin-top:20px">
          ¿Dudas? Escríbenos por WhatsApp. · Envíos a todo México · León, Guanajuato
        </p>
      </div>
    </div>"""

    try:
        resend.Emails.send({
            "from": _FROM,
            "to": email,
            "bcc": _NOTIF_EMAIL,  # copia al negocio = prueba de que se envió
            "subject": f"{nombre}, tu carrito te espera 👠 — Zapatillas May",
            "html": html,
        })
        return True
    except Exception as e:
        print(f"[carrito-abandonado] Error enviando recordatorio a {email}: {e}")
        return False


# ── 5. PROCESAR (envía recordatorios pendientes) ──────────────────
def procesar_recordatorios() -> dict:
    """Busca carritos abandonados (>N horas de inactividad, sin convertir ni avisar) y envía recordatorio."""
    try:
        corte = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=_HORAS_ESPERA)
        corte_iso = corte.isoformat()
        # updated_at <= corte, no convertido, no avisado
        pendientes = supabase_get(
            f"carritos_abandonados?convertido=eq.false&recordatorio_enviado=eq.false"
            f"&updated_at=lte.{corte_iso}&select=*"
        )
        enviados = 0
        for c in (pendientes or []):
            if _enviar_recordatorio(c):
                supabase_patch(
                    f"carritos_abandonados?id=eq.{c['id']}",
                    {"recordatorio_enviado": True, "recordatorio_enviado_at": _now_iso()}
                )
                enviados += 1
        return {"ok": True, "revisados": len(pendientes or []), "enviados": enviados, "ts": _now_iso()}
    except Exception as e:
        print(f"[carrito-abandonado] Error procesar: {e}")
        return {"ok": False, "error": str(e)}


@router.get("/procesar")
def procesar_endpoint(secret: str = ""):
    """Dispara el procesamiento manualmente (también lo corre un hilo cada 15 min)."""
    if secret != _SECRET:
        return JSONResponse(status_code=403, content={"error": "secret invalido"})
    return procesar_recordatorios()


# ── 6. PANEL: listar + stats ──────────────────────────────────────
@router.get("/listar")
def listar():
    """Lista los carritos abandonados con su estado (para el panel)."""
    try:
        rows = supabase_get("carritos_abandonados?order=updated_at.desc&limit=100&select=*")
        total = len(rows or [])
        enviados = sum(1 for r in rows if r.get("recordatorio_enviado"))
        convertidos = sum(1 for r in rows if r.get("convertido"))
        pendientes = total - enviados - convertidos
        return {
            "ok": True,
            "stats": {"total": total, "pendientes": pendientes, "enviados": enviados, "convertidos": convertidos},
            "carritos": rows,
        }
    except Exception as e:
        return {"ok": False, "error": str(e), "carritos": [], "stats": {}}


# ── 7. PRUEBA: enviar un recordatorio de ejemplo ahora mismo ──────
@router.get("/diagnostico")
def diagnostico(email: str = "", frm: str = ""):
    """Envía un correo simple y devuelve la respuesta CRUDA de Resend (id o error) para depurar."""
    if not _RESEND_OK or not resend.api_key:
        return {"resend_configurado": False, "motivo": "Falta RESEND_API_KEY o el paquete resend"}
    destino = (email or _NOTIF_EMAIL).strip().lower()
    remitente = frm or _FROM
    try:
        r = resend.Emails.send({
            "from": remitente,
            "to": destino,
            "subject": "Prueba de diagnóstico — Zapatillas May",
            "html": "<p>Esto es una prueba de envío de Resend. Si lo recibes, el envío funciona.</p>",
        })
        return {"ok": True, "respuesta_resend": r, "enviado_a": destino, "from": remitente}
    except Exception as e:
        return {"ok": False, "error": str(e), "enviado_a": destino, "from": remitente}


@router.post("/test")
def test_envio(datos: dict):
    """Envía un recordatorio de prueba al email indicado (o al del negocio) para verificar Resend."""
    email = (datos.get("email") or _NOTIF_EMAIL).strip().lower()
    carrito_demo = {
        "id": "demo",
        "email": email,
        "nombre": datos.get("nombre") or "Cliente de prueba",
        "total": 800,
        "items": [
            {"nombre": "Tacón modelo TAC-001", "color": "Negro", "talla": "24",
             "imagen": "", "cantidad": 1},
            {"nombre": "Sandalia modelo SAN-002", "color": "Nude", "talla": "25",
             "imagen": "", "cantidad": 1},
        ],
    }
    ok = _enviar_recordatorio(carrito_demo)
    return {"ok": ok, "enviado_a": email, "resend_configurado": bool(_RESEND_OK and resend.api_key)}
