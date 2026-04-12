from fastapi import APIRouter
from database import supabase_get, supabase_post

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