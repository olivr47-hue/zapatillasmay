from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_patch
import secrets, string

router = APIRouter(prefix="/referidos", tags=["Referidos"])

CREDITO_MXN = 300


def _codigo_unico():
    chars = string.ascii_uppercase + string.digits
    for _ in range(10):
        codigo = ''.join(secrets.choice(chars) for _ in range(8))
        if not supabase_get(f"clientes?codigo_referido=eq.{codigo}"):
            return codigo
    return ''.join(secrets.choice(chars) for _ in range(8))


@router.get("/mi-codigo/{cliente_id}")
def mi_codigo(cliente_id: str):
    try:
        cs = supabase_get(
            f"clientes?id=eq.{cliente_id}&select=id,nombre,tipo,codigo_referido,credito_disponible,referido_por"
        )
        if not cs:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        c = cs[0]
        if c.get("tipo") != "menudeo":
            return JSONResponse(status_code=403, content={"error": "Solo clientes menudeo"})
        codigo = c.get("codigo_referido")
        if not codigo:
            codigo = _codigo_unico()
            supabase_patch(f"clientes?id=eq.{cliente_id}", {"codigo_referido": codigo})
        return {
            "codigo": codigo,
            "link": f"https://zapatillasmay.mx/?ref={codigo}",
            "credito_disponible": float(c.get("credito_disponible") or 0),
            "referido_por": c.get("referido_por"),
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/validar")
def validar_codigo(datos: dict):
    try:
        codigo = (datos.get("codigo") or "").strip().upper()
        if not codigo:
            return JSONResponse(status_code=400, content={"error": "Código requerido"})
        cs = supabase_get(f"clientes?codigo_referido=eq.{codigo}&tipo=eq.menudeo&select=id,nombre")
        if not cs:
            return JSONResponse(status_code=404, content={"error": "Código inválido"})
        return {"valido": True, "nombre_referidor": cs[0]["nombre"].split()[0]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/stats/{cliente_id}")
def stats_referidos(cliente_id: str):
    try:
        cs = supabase_get(f"clientes?id=eq.{cliente_id}&select=codigo_referido,credito_disponible")
        if not cs:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        c = cs[0]
        codigo = c.get("codigo_referido")
        if not codigo:
            return {"referidos": 0, "credito_disponible": 0, "credito_total_ganado": 0}
        referidos = supabase_get(f"clientes?referido_por=eq.{codigo}&select=id,nombre,created_at")
        return {
            "referidos": len(referidos),
            "credito_disponible": float(c.get("credito_disponible") or 0),
            "credito_total_ganado": len(referidos) * CREDITO_MXN,
            "lista": referidos,
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
