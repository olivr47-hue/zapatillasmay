# -*- coding: utf-8 -*-
"""
routers/carrito_abandonado.py
Carrito abandonado: captura el carrito en el checkout, y un proceso en segundo
plano envía un recordatorio por email (ZeptoMail, vía email_utils) si el cliente no
completa la compra.

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
import re
import html as _html
import urllib.parse
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
from email_utils import enviar_email
from security import limiter, require_staff

router = APIRouter(prefix="/carrito-abandonado", tags=["Carrito Abandonado"])

_SECRET        = os.environ["SECRET_KEY"]
_NOTIF_EMAIL   = os.getenv("NOTIF_EMAIL", "olivr47@gmail.com")
_HORAS_ESPERA  = float(os.getenv("CARRITO_HORAS_ESPERA", "1"))   # esperar 1h de inactividad
_SITE          = "https://zapatillasmay.mx"

# Dominios de correo sintéticos usados por bots que simulan un checkout real
# (ej. Storebot-Google, el crawler de Merchant Center que ya dejamos pasar en
# robots.txt -- llena el formulario con datos falsos tipo "John Smith" para
# probar que el flujo de compra funciona). Sin este filtro, cada visita del
# bot genera un "carrito abandonado" y le manda un recordatorio a nadie real.
_DOMINIOS_BOT = {"storebotmail.joonix.net"}


def _now_iso():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


# ── 1. CAPTURA / UPSERT ───────────────────────────────────────────
@router.post("/guardar")
@limiter.limit("20/minute")
def guardar(request: Request, datos: dict):
    """Guarda o actualiza el carrito de un cliente que está en el checkout."""
    from textos import limpiar_campos
    limpiar_campos(datos, ("nombre", "telefono"))
    email = (datos.get("email") or "").strip().lower()
    if not email or "@" not in email:
        return {"ok": False, "motivo": "email_invalido"}
    if email.rsplit("@", 1)[-1] in _DOMINIOS_BOT:
        return {"ok": False, "motivo": "bot_detectado"}

    # Si viene convertido=True, solo marcar como convertido y salir
    if datos.get("convertido"):
        marcar_convertido(email)
        return {"ok": True, "accion": "convertido"}

    from security import limpiar_dict, limpiar_texto
    items = [limpiar_dict(i) if isinstance(i, dict) else i for i in (datos.get("items") or [])]
    total = datos.get("total") or 0
    nombre = limpiar_texto((datos.get("nombre") or "").strip())

    if not items:
        return {"ok": False, "motivo": "sin_items"}

    try:
        existente = supabase_get(f"carritos_abandonados?email=eq.{urllib.parse.quote(email, safe='')}&convertido=eq.false&select=id,recordatorio_enviado_at")
        payload = {
            "email": email,
            "nombre": nombre or None,
            "items": items,
            "total": total,
            "updated_at": _now_iso(),
            "recordatorio_enviado": False,  # reinicia si vuelve a actividad
        }
        if existente:
            # No reiniciar el recordatorio si ya se mandó hace menos de 3 días: cualquiera puede llamar
            # este endpoint público con el correo de otra persona, y cada llamada volvía a disparar el correo.
            try:
                _t = datetime.datetime.fromisoformat(str(existente[0].get("recordatorio_enviado_at") or "").replace("Z", "+00:00"))
                if (datetime.datetime.now(datetime.timezone.utc) - _t).total_seconds() < 3 * 86400:
                    payload.pop("recordatorio_enviado", None)
            except Exception:
                pass
            supabase_patch(f"carritos_abandonados?id=eq.{existente[0]['id']}", payload)
            return {"ok": True, "accion": "actualizado", "id": existente[0]["id"]}
        else:
            payload["created_at"] = _now_iso()
            try:
                res = supabase_post("carritos_abandonados", payload)
            except Exception as e_ins:
                # Dos peticiones casi simultáneas (el campo de correo guarda al escribir y al salir) pasaban ambas el
                # "¿ya existe?" y creaban el carrito dos veces. Ahora la base lo impide (índice único por correo abierto):
                # la que llega segunda actualiza la primera.
                otra = supabase_get(f"carritos_abandonados?email=eq.{urllib.parse.quote(email, safe='')}&convertido=eq.false&select=id")
                if not otra:
                    raise e_ins
                payload.pop("created_at", None)
                supabase_patch(f"carritos_abandonados?id=eq.{otra[0]['id']}", payload)
                return {"ok": True, "accion": "actualizado", "id": otra[0]["id"]}
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
    # Sanear: algunos clientes teclean el correo con espacios o un punto final
    # (typo/autocorrección) y ZeptoMail rechaza el envío con ese formato.
    email = (carrito["email"] or "").strip().rstrip(".")
    if "@" not in email:
        print(f"[carrito-abandonado] Email inválido, se omite recordatorio: {carrito.get('email')!r}")
        return False
    nombre = _html.escape((carrito.get("nombre") or "").split(" ")[0].capitalize()) if carrito.get("nombre") else "Hola"
    items  = carrito.get("items") or []
    total  = carrito.get("total") or 0
    cid    = carrito["id"]

    from email_utils import _base_html, _boton, _miniatura
    filas = ""
    for it in items[:6]:
        img = it.get("imagen") or ""
        nom = _html.escape(str(it.get("nombre") or "Producto"))
        col = _html.escape(str(it.get("color") or ""))
        tal = _html.escape(str(it.get("talla") or ""))
        cant = int(it.get("cantidad") or 1)
        try:
            precio = float(it.get("precio") or it.get("precio_unitario") or 0)
        except (TypeError, ValueError):
            precio = 0.0
        meta = " · ".join([x for x in [col, ("Talla " + str(tal)) if tal else ""] if x])
        precio_html = (f'<td align="right" style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top;'
                       f'font-size:14px;color:#b5687a;font-weight:700;white-space:nowrap">${precio * cant:,.0f}</td>') if precio else \
                      '<td style="border-bottom:1px solid #f3e9e2"></td>'
        filas += f"""
        <tr>
          <td width="86" style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top">{_miniatura(img)}</td>
          <td style="padding:12px 0;border-bottom:1px solid #f3e9e2;vertical-align:top;font-size:14px;color:#2A1A0E;line-height:1.45">
            <strong>{nom}</strong><br><span style="color:#8a7b71;font-size:12px">{meta}</span>
            {f'<br><span style="color:#8a7b71;font-size:12px">{cant} pares</span>' if cant > 1 else ''}
          </td>
          {precio_html}
        </tr>"""
    mas = f'<p style="margin:8px 0 0;font-size:12px;color:#8a7b71">y {len(items) - 6} modelo(s) más en tu carrito</p>' if len(items) > 6 else ""

    recover_url = f"{_SITE}/carrito?recover={cid}"
    try:
        total_txt = f"${float(total):,.0f} MXN"
    except (TypeError, ValueError):
        total_txt = ""
    bloque_total = ('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 22px"><tr>'
                    '<td style="font-size:15px;font-weight:700;color:#2A1A0E">Total de tu carrito</td>'
                    f'<td align="right" style="font-size:20px;font-weight:700;color:#b5687a">{total_txt}</td></tr></table>') if total_txt else ""
    contenido = f"""
        <h1 style="margin:0 0 8px;font-size:24px;line-height:1.25;color:#2A1A0E">{nombre}, tus zapatillas te están esperando 👠</h1>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#5b4d44">
          Vimos que te quedaste a un paso de terminar tu compra. Guardamos tu carrito tal cual lo dejaste, pero las tallas y colores pueden agotarse pronto.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{filas}</table>
        {mas}
        {bloque_total}
        {_boton("Terminar mi compra →", recover_url)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 6px"><tr>
          <td align="center" width="33%" style="font-size:12px;color:#5b4d44;line-height:1.5;padding:0 4px">🚚<br><strong>Envío a todo México</strong></td>
          <td align="center" width="33%" style="font-size:12px;color:#5b4d44;line-height:1.5;padding:0 4px">🔒<br><strong>Pago seguro</strong></td>
          <td align="center" width="33%" style="font-size:12px;color:#5b4d44;line-height:1.5;padding:0 4px">💬<br><strong>Te asesoramos por WhatsApp</strong></td>
        </tr></table>
        <p style="margin:16px 0 0;font-size:12px;color:#a89a90;text-align:center;line-height:1.6">
          ¿Dudas con tu talla? Escríbenos y te ayudamos a elegir. Si ya compraste, ignora este mensaje.
        </p>"""
    html = _base_html(contenido, f"Guardamos tu carrito{(' de ' + total_txt) if total_txt else ''}. Termina tu compra antes de que se agoten tus tallas.")

    return enviar_email(
        email,
        f"{nombre}, tu carrito te espera 👠 — Zapatillas May",
        html,
        bcc=_NOTIF_EMAIL,  # copia al negocio = prueba de que se envió
        tipo="carrito_abandonado",
    )


# ── 5. PROCESAR (envía recordatorios pendientes) ──────────────────
_PAUSA_HASTA = None


def procesar_recordatorios() -> dict:
    """Busca carritos abandonados (>N horas de inactividad, sin convertir ni avisar) y envía recordatorio."""
    try:
        corte = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=_HORAS_ESPERA)
        # URL-encode: el "+00:00" del offset se decodifica como espacio en la query
        # de PostgREST y rompe el timestamp (HTTP 400). quote() lo vuelve %2B00%3A00.
        corte_iso = urllib.parse.quote(corte.isoformat())
        # updated_at <= corte, no convertido, no avisado
        pendientes = supabase_get(
            f"carritos_abandonados?convertido=eq.false&recordatorio_enviado=eq.false"
            f"&updated_at=lte.{corte_iso}&select=*"
        )
        enviados = 0
        # Disyuntor: si el proveedor de correo está caído o sin créditos, no reintentar todo el lote cada 15 min
        # (llegó a 1,400 intentos fallidos al día y 97 MB de bitácora). Se vuelve a intentar pasada 1 hora.
        global _PAUSA_HASTA
        ahora = datetime.datetime.now(datetime.timezone.utc)
        if _PAUSA_HASTA and ahora < _PAUSA_HASTA:
            return {"ok": True, "revisados": len(pendientes or []), "enviados": 0, "pausado_hasta": _PAUSA_HASTA.isoformat()}
        for c in (pendientes or []):
            if "@" not in (c.get("email") or ""):
                # email inválido: antes se reintentaba (y fallaba) cada 15 min para siempre
                supabase_patch(f"carritos_abandonados?id=eq.{c['id']}", {"recordatorio_enviado": True, "recordatorio_enviado_at": _now_iso()})
                continue
            if _enviar_recordatorio(c):
                supabase_patch(
                    f"carritos_abandonados?id=eq.{c['id']}",
                    {"recordatorio_enviado": True, "recordatorio_enviado_at": _now_iso()}
                )
                enviados += 1
            else:
                _PAUSA_HASTA = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
                print("[carrito-abandonado] el envío de correo falló: pausa de 1 hora antes de reintentar")
                break
        return {"ok": True, "revisados": len(pendientes or []), "enviados": enviados, "ts": _now_iso()}
    except Exception as e:
        print(f"[carrito-abandonado] Error procesar: {e}")
        return {"ok": False, "error": str(e)}


@router.get("/procesar")
def procesar_endpoint(_staff=Depends(require_staff)):
    """Dispara el procesamiento manualmente (también lo corre un hilo cada 15 min).
    Antes se protegía con ?secret=<SECRET_KEY>: la MISMA llave que firma los JWT viajando en la URL
    (queda en logs/historial). Ahora exige sesión de personal."""
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
        def _t(r):
            try:
                return float(r.get("total") or 0)
            except (TypeError, ValueError):
                return 0.0
        monto_abierto = sum(_t(r) for r in rows if not r.get("convertido"))
        monto_recuperado = sum(_t(r) for r in rows if r.get("convertido"))
        avisados_total = sum(1 for r in rows if r.get("recordatorio_enviado") or r.get("convertido"))
        return {
            "ok": True,
            "stats": {"total": total, "pendientes": pendientes, "enviados": enviados, "convertidos": convertidos,
                      "monto_abierto": monto_abierto, "monto_recuperado": monto_recuperado,
                      "tasa_recuperacion": round(100 * convertidos / avisados_total) if avisados_total else 0,
                      "horas_espera": _HORAS_ESPERA, "copia_a": _NOTIF_EMAIL},
            "carritos": rows,
        }
    except Exception as e:
        return {"ok": False, "error": str(e), "carritos": [], "stats": {}}


# ── 7. PRUEBA: enviar un recordatorio de ejemplo ahora mismo ──────
@router.post("/test")
def test_envio(datos: dict):
    """Envía un recordatorio de prueba al email indicado (o al del negocio) para verificar ZeptoMail."""
    from email_utils import diagnostico_smtp
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
    return {"ok": ok, "enviado_a": email, "smtp": diagnostico_smtp()}


# ── 7b. Correo manual: enviar el recordatorio ahora a un carrito concreto ──────────
@router.post("/{id}/email")
def recordatorio_email(id: str, _staff=Depends(require_staff)):
    try:
        rows = supabase_get(f"carritos_abandonados?id=eq.{id}&select=*&limit=1")
        if not rows:
            return JSONResponse(status_code=404, content={"ok": False, "error": "Carrito no encontrado"})
        c = rows[0]
        if c.get("convertido"):
            return JSONResponse(status_code=409, content={"ok": False, "error": "Este cliente ya compró"})
        if "@" not in (c.get("email") or ""):
            return JSONResponse(status_code=400, content={"ok": False, "error": "El carrito no tiene un correo válido"})
        if not _enviar_recordatorio(c):
            return JSONResponse(status_code=502, content={"ok": False, "error": "El proveedor de correo rechazó el envío (revisa el historial en Correo corporativo)"})
        supabase_patch(f"carritos_abandonados?id=eq.{id}", {"recordatorio_enviado": True, "recordatorio_enviado_at": _now_iso()})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})


# ── 8. WA API: enviar recordatorio por WhatsApp al cliente ──────────
@router.post("/{id}/whatsapp")
def recordatorio_whatsapp(id: str):
    """Envía recordatorio de carrito abandonado por WhatsApp API (Meta)."""
    try:
        rows = supabase_get(f"carritos_abandonados?id=eq.{id}&select=*&limit=1")
        if not rows:
            return JSONResponse(status_code=404, content={"error": "Carrito no encontrado"})
        c = rows[0]
        email = c.get("email", "")
        nombre = (c.get("nombre") or "").split()[0].capitalize() or "Hola"
        total = c.get("total") or 0

        # Buscar teléfono en clientes por email
        telefono = ""
        if email:
            cli = supabase_get(f"clientes?email=eq.{urllib.parse.quote(email, safe='')}&select=telefono,lada&limit=2")
            if cli and len(cli) == 1:   # un correo compartido por varios clientes no identifica a nadie
                lada = re.sub(r"\D", "", str(cli[0].get("lada") or "52")) or "52"
                tel_raw = re.sub(r"\D", "", str(cli[0].get("telefono") or ""))
                if tel_raw:
                    # 10 dígitos = nacional: se le antepone la lada. (Antes se comparaba por prefijo y un
                    # número como 52 55... se tomaba como "ya trae lada" y salía mal.)
                    telefono = lada + tel_raw if len(tel_raw) == 10 else tel_raw

        if not telefono:
            return JSONResponse(status_code=400, content={"error": "El cliente no tiene teléfono registrado"})

        from routers.chatbot import enviar_whatsapp_texto
        msg = (
            f"Hola {nombre} 👋, te escribimos de *Zapatillas May*.\n\n"
            f"Dejaste productos en tu carrito por *${float(total):.0f} MXN* y nos gustaría ayudarte a completar tu compra 👠\n\n"
            f"¿Tienes alguna duda sobre talla, color o envío? Con gusto te asesoramos 😊\n\n"
            f"👉 https://zapatillasmay.mx"
        )
        wamid = enviar_whatsapp_texto(telefono, msg)
        if wamid:
            return {"ok": True, "enviado_a": telefono}
        else:
            return JSONResponse(status_code=500, content={"error": "No se pudo enviar por WhatsApp. Verifica WHATSAPP_TOKEN y WHATSAPP_PHONE_ID."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ── 9. Push: recordatorio de carrito abandonado ──────────────────────
@router.post("/{id}/push")
def recordatorio_push(id: str):
    """Envía recordatorio de carrito abandonado como notificación push."""
    try:
        rows = supabase_get(f"carritos_abandonados?id=eq.{id}&select=*&limit=1")
        if not rows:
            return JSONResponse(status_code=404, content={"error": "Carrito no encontrado"})
        c = rows[0]
        total = c.get("total") or 0
        cliente_id = c.get("cliente_id")
        email = c.get("email", "")
        # Sin cliente_id no hay a quién dirigir el recordatorio: enviar_push() cae a
        # mandarlo a TODOS los suscriptores activos si no se le pasa cliente_id ni sitio.
        if not cliente_id:
            return JSONResponse(status_code=400, content={"error": "Este carrito no tiene cliente_id; no se puede dirigir el push a un suscriptor especifico"})

        from routers.push import enviar_push
        resultado = enviar_push(
            "Olvidaste algo en tu carrito",
            f"Tienes productos por ${float(total):.0f} MXN esperando por ti.",
            url="/carrito",
            cliente_id=cliente_id,
        )
        if not resultado.get("enviadas"):
            return JSONResponse(status_code=400, content={"error": "El cliente no tiene notificaciones activas", "detalle": resultado})
        return {"ok": True, **resultado}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
