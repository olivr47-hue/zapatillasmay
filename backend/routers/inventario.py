from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(prefix="/inventario", tags=["Inventario"])

@router.get("/alertas")
def alertas_stock_bajo():
    try:
        data = supabase_get("inventario?select=*,variantes(*,productos(nombre,sku_interno)),sucursales(nombre)")
        alertas = [i for i in data if i.get("cantidad", 0) <= i.get("stock_minimo", 3)]
        return alertas
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/")
def listar_inventario():
    try:
        return supabase_get("inventario?select=*,variantes(*,productos(nombre,sku_interno,marca)),sucursales(nombre)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/sucursal/{sucursal_id}")
def inventario_por_sucursal(sucursal_id: str):
    try:
        return supabase_get(f"inventario?sucursal_id=eq.{sucursal_id}&select=*,variantes(*,productos(nombre,sku_interno))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/producto/{producto_id}")
def inventario_por_producto(producto_id: str):
    try:
        return supabase_get(f"inventario?select=*,variantes(*,productos(*)),sucursales(nombre)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/")
def agregar_inventario(datos: dict):
    try:
        return supabase_post("inventario", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/actualizar")
def actualizar_inventario(datos: dict):
    try:
        variante_id = datos.get("variante_id")
        sucursal_id = datos.get("sucursal_id")
        return supabase_patch(
            f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
            {"cantidad": datos.get("cantidad"), "stock_minimo": datos.get("stock_minimo", 3)}
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})