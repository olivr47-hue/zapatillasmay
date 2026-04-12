from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(prefix="/sucursales", tags=["Sucursales"])

@router.get("/")
def listar_sucursales():
    return supabase_get("sucursales?activa=eq.true&order=created_at.asc")

@router.get("/{id}")
def obtener_sucursal(id: str):
    return supabase_get(f"sucursales?id=eq.{id}")

@router.post("/")
def crear_sucursal(sucursal: dict):
    return supabase_post("sucursales", sucursal)

@router.get("/{id}/inventario")
def inventario_sucursal(id: str):
    return supabase_get(f"inventario?sucursal_id=eq.{id}&select=*,variantes(*,productos(*))")
    
@router.patch("/{id}")
def actualizar_sucursal(id: str, sucursal: dict):
    try:
        return supabase_patch(f"sucursales?id=eq.{id}", sucursal)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})    