from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials
from database import supabase_get, supabase_patch, supabase_post
from security import bearer_opcional, exigir_personal_o_dueno
import secrets, string
import urllib.parse as _up

router = APIRouter(prefix="/referidos", tags=["Referidos"])

CREDITO_MENUDEO_MXN = 50
CREDITO_MAYOREO_MXN = 300


def _codigo_unico():
    chars = string.ascii_uppercase + string.digits
    for _ in range(10):
        codigo = ''.join(secrets.choice(chars) for _ in range(8))
        if not supabase_get(f"clientes?codigo_referido=eq.{codigo}"):
            return codigo
    return ''.join(secrets.choice(chars) for _ in range(8))


@router.get("/mi-codigo/{cliente_id}")
def mi_codigo(cliente_id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    exigir_personal_o_dueno(cliente_id, credentials)
    try:
        cs = supabase_get(
            f"clientes?id=eq.{cliente_id}&select=id,nombre,tipo,codigo_referido,credito_disponible,referido_por"
        )
        if not cs:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        c = cs[0]
        codigo = c.get("codigo_referido")
        if not codigo:
            codigo = _codigo_unico()
            supabase_patch(f"clientes?id=eq.{cliente_id}", {"codigo_referido": codigo})
        es_mayorista = c.get("tipo") in ("mayoreo", "zapateria")
        dominio = "https://portal.zapatillasmay.mx" if es_mayorista else "https://zapatillasmay.mx"
        return {
            "codigo": codigo,
            "link": f"{dominio}/?ref={codigo}",
            "credito_disponible": float(c.get("credito_disponible") or 0),
            "referido_por": c.get("referido_por"),
            "bono_por_referido": CREDITO_MAYOREO_MXN if es_mayorista else CREDITO_MENUDEO_MXN,
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/validar")
def validar_codigo(datos: dict):
    try:
        codigo = (datos.get("codigo") or "").strip().upper()
        if not codigo:
            return JSONResponse(status_code=400, content={"error": "Código requerido"})
        cs = supabase_get(f"clientes?codigo_referido=eq.{_up.quote(codigo, safe='')}&select=id,nombre")
        if not cs:
            return JSONResponse(status_code=404, content={"error": "Código inválido"})
        return {"valido": True, "nombre_referidor": cs[0]["nombre"].split()[0]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/stats/{cliente_id}")
def stats_referidos(cliente_id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    exigir_personal_o_dueno(cliente_id, credentials)
    try:
        cs = supabase_get(f"clientes?id=eq.{cliente_id}&select=codigo_referido,credito_disponible,tipo")
        if not cs:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        c = cs[0]
        bono = CREDITO_MAYOREO_MXN if c.get("tipo") in ("mayoreo", "zapateria") else CREDITO_MENUDEO_MXN
        codigo = c.get("codigo_referido")
        if not codigo:
            return {"referidos": 0, "credito_disponible": 0, "credito_total_ganado": 0}
        referidos = supabase_get(f"clientes?referido_por=eq.{codigo}&select=id,nombre,created_at")
        return {
            "referidos": len(referidos),
            "credito_disponible": float(c.get("credito_disponible") or 0),
            "credito_total_ganado": len(referidos) * bono,
            "lista": referidos,
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def otorgar_bono_referidor(cliente_id):
    """Da al REFERIDOR su bono ($50 menudeo / $300 mayoreo) cuando el cliente referido
    paga su primera compra. Idempotente: deja una marca 'bono_referido' en el historial
    de crédito del referido y no vuelve a pagar. Antes el bono se daba al registrarse,
    sin comprar nada (farmeable con cuentas falsas)."""
    if not cliente_id:
        return
    cli = supabase_get(f"clientes?id=eq.{cliente_id}&select=id,referido_por") or []
    codigo = (cli[0].get("referido_por") if cli else None)
    if not codigo:
        return
    ya = supabase_get(f"clientes_creditos_historial?cliente_id=eq.{cliente_id}&tipo=eq.bono_referido&select=id") or []
    if ya:
        return
    refs = supabase_get(f"clientes?codigo_referido=eq.{codigo}&select=id,tipo,credito_disponible") or []
    if not refs or refs[0]["id"] == cliente_id:
        return
    ref = refs[0]
    bono = CREDITO_MAYOREO_MXN if ref.get("tipo") in ("mayoreo", "zapateria") else CREDITO_MENUDEO_MXN
    # marca primero (si falla el abono, no se paga doble en un reintento; se pierde como mucho un bono)
    supabase_post("clientes_creditos_historial", {
        "cliente_id": cliente_id, "monto": 0, "tipo": "bono_referido", "saldo_despues": 0,
    })
    nuevo = float(ref.get("credito_disponible") or 0) + bono
    supabase_patch(f"clientes?id=eq.{ref['id']}", {"credito_disponible": nuevo})
    supabase_post("clientes_creditos_historial", {
        "cliente_id": ref["id"], "monto": bono, "tipo": "bono_referido_recibido", "saldo_despues": nuevo,
    })
