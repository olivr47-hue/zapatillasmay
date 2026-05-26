from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
from cache import cache_get, cache_set, cache_invalidate_prefix, TTL_ESTATICO

router = APIRouter(prefix="/sucursales", tags=["Sucursales"])

@router.get("/")
def listar_sucursales():
    cached = cache_get("sucursales_all")
    if cached is not None:
        return cached
    data = supabase_get("sucursales?activa=eq.true&order=created_at.asc")
    cache_set("sucursales_all", data, ttl=TTL_ESTATICO)
    return data

@router.get("/{id}")
def obtener_sucursal(id: str):
    return supabase_get(f"sucursales?id=eq.{id}")

@router.post("/")
def crear_sucursal(sucursal: dict):
    result = supabase_post("sucursales", sucursal)
    cache_invalidate_prefix("sucursales_")
    return result

@router.get("/{id}/inventario")
def inventario_sucursal(id: str):
    return supabase_get(f"inventario?sucursal_id=eq.{id}&select=*,variantes(*,productos(*))")

@router.patch("/{id}")
def actualizar_sucursal(id: str, sucursal: dict):
    try:
        result = supabase_patch(f"sucursales?id=eq.{id}", sucursal)
        cache_invalidate_prefix("sucursales_")
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})    