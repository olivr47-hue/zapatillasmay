"""Renta del sistema: interesados que piden la demo (formulario público) y su seguimiento en el panel.
  POST /demo/solicitar            público: guarda al prospecto y avisa al negocio.
  GET/PATCH /demo/admin/prospectos  solo administrador: lista y seguimiento."""
import re
import html as _html

from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse

from database import supabase_get, supabase_get_all, supabase_post, supabase_patch
from security import limiter, require_admin, limpiar_texto

router = APIRouter(prefix="/demo", tags=["Demo"])
_EMAIL_RX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")


def _txt(v, largo=200) -> str:
    return limpiar_texto(str(v or "").strip(), comillas=True)[:largo]


@router.post("/solicitar")
@limiter.limit("5/minute")
def solicitar_demo(request: Request, datos: dict):
    """Un interesado en rentar el sistema deja sus datos para probar la demo."""
    if datos.get("sitio_web"):   # campo trampa para bots
        return {"ok": True}
    nombre = _txt(datos.get("nombre"), 80)
    email = str(datos.get("email") or "").strip().lower()[:120]
    tel = re.sub(r"\D", "", str(datos.get("whatsapp") or ""))[-10:]
    if len(nombre) < 3 or not _EMAIL_RX.match(email) or len(tel) != 10:
        return JSONResponse(status_code=400, content={"error": "Escribe tu nombre, un correo válido y tu WhatsApp a 10 dígitos."})
    try:
        previos = supabase_get(f"prospectos_renta?whatsapp=eq.{tel}&select=id&limit=1") or []
        fila = {"nombre": nombre, "whatsapp": tel, "email": email, "negocio": _txt(datos.get("negocio"), 80), "tipo_negocio": _txt(datos.get("tipo_negocio"), 60),
                "ciudad": _txt(datos.get("ciudad"), 60), "mensaje": _txt(datos.get("mensaje"), 400), "origen": _txt(datos.get("origen") or "vender", 30)}
        if previos:
            supabase_patch(f"prospectos_renta?id=eq.{previos[0]['id']}", {k: v for k, v in fila.items() if v})
        else:
            supabase_post("prospectos_renta", fila)
        try:
            from routers.push import enviar_push
            enviar_push("🧪 Nuevo interesado en rentar el sistema", f"{nombre}{' · ' + fila['negocio'] if fila['negocio'] else ''} · WhatsApp {tel}", url="/?modulo=prospectos", sitio="panel")
        except Exception as e:
            print(f"[demo] push: {e}")
        try:
            from email_utils import enviar_email, NEGOCIO_EMAIL
            cuerpo = "".join(f"<p><b>{k}:</b> {_html.escape(str(v or '—'))}</p>" for k, v in (("Nombre", nombre), ("WhatsApp", tel), ("Correo", email), ("Negocio", fila["negocio"]),
                                                                                           ("Tipo", fila["tipo_negocio"]), ("Ciudad", fila["ciudad"]), ("Mensaje", fila["mensaje"])))
            enviar_email(NEGOCIO_EMAIL, "Nuevo interesado en rentar el sistema", f"<div style='font-family:Arial,sans-serif'>{cuerpo}</div>", tipo="demo_prospecto")
        except Exception as e:
            print(f"[demo] correo: {e}")
        return {"ok": True, "demo": False}
    except Exception as e:
        print(f"[demo/solicitar] {e}")
        return JSONResponse(status_code=500, content={"error": "No se pudo guardar tu solicitud. Intenta de nuevo."})


@router.get("/admin/prospectos")
def admin_prospectos(_a=Depends(require_admin)):
    return supabase_get_all("prospectos_renta?select=*&order=created_at.desc") or []


@router.patch("/admin/prospectos/{pid}")
def admin_editar_prospecto(pid: str, datos: dict, _a=Depends(require_admin)):
    c = {}
    if datos.get("estado") in ("nuevo", "contactado", "demo", "cliente", "descartado"):
        c["estado"] = datos["estado"]
    if "notas_admin" in datos:
        c["notas_admin"] = _txt(datos.get("notas_admin"), 500)
    if not c:
        return JSONResponse(status_code=400, content={"error": "Nada que cambiar"})
    return {"ok": bool(supabase_patch(f"prospectos_renta?id=eq.{re.sub(r'[^0-9a-fA-F-]', '', pid)}", c))}
