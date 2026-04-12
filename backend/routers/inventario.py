from fastapi import APIRouter
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(prefix="/inventario", tags=["Inventario"])

@router.get("/")
def listar_inventario():
    return supabase_get("inventario?select=*,variantes(*,productos(nombre,sku_interno,marca)),sucursales(nombre)")

@router.get("/sucursal/{sucursal_id}")
def inventario_por_sucursal(sucursal_id: str):
    return supabase_get(f"inventario?sucursal_id=eq.{sucursal_id}&select=*,variantes(*,productos(nombre,sku_interno))")

@router.get("/producto/{producto_id}")
def inventario_por_producto(producto_id: str):
    return supabase_get(f"inventario?select=*,variantes!inner(*,productos!inner(*)),sucursales(nombre)&variantes.producto_id=eq.{producto_id}")

@router.get("/alertas")
def alertas_stock_bajo():
    return supabase_get("inventario?cantidad=lte.stock_minimo&select=*,variantes(*,productos(nombre)),sucursales(nombre)")

@router.post("/")
def agregar_inventario(datos: dict):
    return supabase_post("inventario", datos)

@router.patch("/actualizar")
def actualizar_inventario(datos: dict):
    variante_id = datos.get("variante_id")
    sucursal_id = datos.get("sucursal_id")
    return supabase_patch(
        f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
        {"cantidad": datos.get("cantidad"), "stock_minimo": datos.get("stock_minimo", 3)}
    )