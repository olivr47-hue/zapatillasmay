from security import limpiar_texto
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch

router = APIRouter(prefix="/sugerencias", tags=["Sugerencias"])


@router.get("/")
def listar_sugerencias():
    try:
        return supabase_get_all("sugerencias_clientes?order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/")
def crear_sugerencia(datos: dict):
    try:
        mensaje = limpiar_texto((datos.get("mensaje") or "").strip())
        if not mensaje:
            return JSONResponse(status_code=400, content={"error": "El mensaje es obligatorio"})
        return supabase_post("sugerencias_clientes", {
            "cliente_id": datos.get("cliente_id"),
            "nombre_cliente": limpiar_texto(datos.get("nombre_cliente"), comillas=True),
            "tipo": limpiar_texto(datos.get("tipo", "sugerencia")),
            "mensaje": mensaje,
            "estado": "nueva",
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/{id}")
def actualizar_sugerencia(id: str, datos: dict):
    try:
        return supabase_patch(f"sugerencias_clientes?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
