from fastapi import APIRouter
from database import supabase_get, supabase_post

router = APIRouter(prefix="/inventario", tags=["Inventario"])

@router.get("/")
def listar_inventario():
    return supabase_get("inventario?select=*,variantes(*,productos(nombre,sku_interno,marca)),sucursales(nombre)")

@router.get("/sucursal/{sucursal_id}")
def inventario_por_sucursal(sucursal_id: str):
    return supabase_get(f"inventario?sucursal_id=eq.{sucursal_id}&select=*,variantes(*,productos(nombre,sku_interno,marca))")

@router.get("/producto/{producto_id}")
def inventario_por_producto(producto_id: str):
    return supabase_get(f"inventario?select=*,variantes!inner(*,productos!inner(*))&variantes.producto_id=eq.{producto_id}")

@router.get("/alertas")
def alertas_stock_bajo():
    return supabase_get("inventario?cantidad=lte.stock_minimo&select=*,variantes(*,productos(nombre)),sucursales(nombre)")

@router.post("/")
def agregar_inventario(datos: dict):
    return supabase_post("inventario", datos)