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
from email_utils import diagnostico_smtp, enviar_email

router = APIRouter(prefix="/emails", tags=["Correo corporativo"])


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
