# -*- coding: utf-8 -*-
"""
Router de correo corporativo.

Todo el envío de emails del ERP pasa por email_utils.enviar_email() (ZeptoMail,
API HTTP de Zoho — ya no hay Resend ni SMTP). Ese mismo módulo guarda un registro de cada
intento en la tabla `emails_enviados`; este router solo expone esa tabla al
panel para que se puedan ver los correos enviados (algo que antes no se podía
verificar ni en el proveedor ni en el panel).
"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all
from email_utils import diagnostico_smtp, enviar_email, email_contacto_web, NEGOCIO_EMAIL
import zoho_mail

router = APIRouter(prefix="/emails", tags=["Correo corporativo"])


@router.post("/contacto-web")
def contacto_web(body: dict):
    """Formulario publico de contacto del sitio -- SIEMPRE manda al correo del
    negocio (NEGOCIO_EMAIL), el visitante nunca controla el destinatario."""
    nombre  = (body.get("nombre") or "").strip()[:120]
    correo  = (body.get("correo") or "").strip()[:200]
    mensaje = (body.get("mensaje") or "").strip()[:3000]
    if not nombre or not mensaje:
        return JSONResponse(status_code=400, content={"error": "Falta nombre o mensaje"})
    if not correo or "@" not in correo:
        return JSONResponse(status_code=400, content={"error": "Correo inválido"})

    asunto, html = email_contacto_web(nombre, correo, mensaje)
    ok = enviar_email(NEGOCIO_EMAIL, asunto, html, tipo="contacto_web", reply_to=correo)
    if not ok:
        return JSONResponse(status_code=502, content={"error": "No se pudo enviar el mensaje, intenta de nuevo"})
    return {"ok": True}


@router.post("/prueba")
def enviar_prueba(body: dict):
    """Manda un correo de prueba desde el panel, para confirmar que ZeptoMail
    de verdad está funcionando sin tener que esperar un flujo real."""
    destino = (body.get("destino") or "").strip()
    if not destino or "@" not in destino:
        return JSONResponse(status_code=400, content={"error": "Correo inválido"})
    ok = enviar_email(
        destino,
        "Correo de prueba — Zapatillas May",
        """
        <div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:28px">
          <h2 style="color:#0A0A0A">✅ ¡Funciona!</h2>
          <p style="color:#555;font-size:0.9rem;line-height:1.6">
            Este es un correo de prueba enviado desde el panel de administración
            para confirmar que el correo corporativo está configurado correctamente.
          </p>
        </div>""",
        tipo="prueba_panel",
    )
    diag = diagnostico_smtp()
    if not ok:
        return {"ok": False, "error": "El envío falló — revisa el historial para el detalle del error.", "smtp": diag}
    return {"ok": True, "smtp": diag}


@router.get("/historial")
def historial(limit: int = 100, tipo: str = "", q: str = ""):
    """Lista los correos enviados, más reciente primero. Filtros opcionales:
    tipo (categoría del correo) y q (busca en destinatario/asunto)."""
    try:
        filtro = f"emails_enviados?order=created_at.desc&limit={min(limit, 500)}&select=id,destinatario,asunto,exito,error,proveedor,tipo,bcc,created_at"
        if tipo:
            filtro += f"&tipo=eq.{tipo}"
        if q:
            q_like = q.replace(" ", "*")
            filtro += f"&or=(destinatario.ilike.*{q_like}*,asunto.ilike.*{q_like}*)"
        return supabase_get_all(filtro)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/{email_id}")
def detalle(email_id: str):
    """Detalle completo de un correo, incluye el HTML (para verlo tal cual se mandó)."""
    try:
        rows = supabase_get(f"emails_enviados?id=eq.{email_id}&select=*")
        if not rows:
            return JSONResponse(status_code=404, content={"error": "No encontrado"})
        return rows[0]
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/diagnostico/estado")
def diagnostico():
    """Estado de la configuración de ZeptoMail — para saber sin adivinar
    si el correo corporativo está listo o le faltan variables en Railway."""
    return diagnostico_smtp()


# ─── Buzón real (Zoho Mail API) — recibidos y enviados ────────────────────

@router.get("/buzon/diagnostico")
def buzon_diagnostico():
    return zoho_mail.diagnostico()


@router.get("/buzon/inbox")
def buzon_inbox(limit: int = 30, start: int = 1):
    try:
        return {"mensajes": zoho_mail.listar_mensajes("Inbox", limit, start)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/buzon/no-leidos")
def buzon_no_leidos():
    try:
        return {"count": zoho_mail.contar_no_leidos()}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/buzon/enviados")
def buzon_enviados(limit: int = 30, start: int = 1):
    try:
        return {"mensajes": zoho_mail.listar_mensajes("Sent", limit, start)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/buzon/mensaje/{folder_id}/{message_id}")
def buzon_mensaje(folder_id: str, message_id: str):
    try:
        html = zoho_mail.obtener_contenido(message_id, folder_id)
        try:
            zoho_mail.marcar_visto(message_id)
        except Exception:
            pass  # que un fallo aquí no impida ver el correo
        return {"html": html}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/buzon/enviar")
def buzon_enviar(body: dict):
    """Redacta y manda un correo real desde contacto@zapatillasmay.mx (o responde
    un mensaje del inbox si se pasa responder_a)."""
    para = (body.get("para") or "").strip()
    asunto = (body.get("asunto") or "(sin asunto)").strip()
    html = body.get("html") or ""
    cc = (body.get("cc") or "").strip()
    responder_a = (body.get("responder_a") or "").strip()
    if not para or "@" not in para:
        return JSONResponse(status_code=400, content={"error": "Destinatario inválido"})
    if not html.strip():
        return JSONResponse(status_code=400, content={"error": "El cuerpo del correo está vacío"})
    try:
        resultado = zoho_mail.enviar_correo(para, asunto, html, cc, responder_a)
        return {"ok": True, "resultado": resultado}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
