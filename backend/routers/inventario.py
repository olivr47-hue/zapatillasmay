from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch
from cache import cache_get, cache_set, cache_invalidate_prefix, TTL_STOCK

router = APIRouter(prefix="/inventario", tags=["Inventario"])

_CK = "inventario"  # prefijo de caché

@router.get("/slim")
def inventario_slim():
    """
    Versión ligera para la tienda pública.
    Solo devuelve variante_id + cantidad. Sin JOINs.
    ~50KB vs ~3-5MB del endpoint completo.
    """
    try:
        cached = cache_get(_CK + "_slim")
        if cached is not None:
            return cached
        data = supabase_get_all("inventario?select=variante_id,cantidad")
        # Si hay múltiples sucursales, sumar el stock de todas para la tienda
        stock: dict = {}
        for row in data:
            vid = row.get("variante_id")
            if vid:
                stock[vid] = stock.get(vid, 0) + (row.get("cantidad") or 0)
        result = [{"variante_id": k, "cantidad": v} for k, v in stock.items()]
        cache_set(_CK + "_slim", result, ttl=TTL_STOCK)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/alertas")
def alertas_stock_bajo():
    try:
        data = supabase_get_all("inventario?select=*,variantes(*,productos(nombre,sku_interno)),sucursales(nombre)")
        alertas = [i for i in data if i.get("cantidad", 0) <= i.get("stock_minimo", 3)]
        return alertas
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/")
def listar_inventario():
    try:
        cached = cache_get(_CK + "_all")
        if cached is not None:
            return cached
        data = supabase_get_all("inventario?select=*,variantes(*,productos(nombre,sku_interno,marca)),sucursales(nombre)")
        cache_set(_CK + "_all", data, ttl=TTL_STOCK)
        return data
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
        resultado = supabase_post("inventario", datos)
        cache_invalidate_prefix(_CK)
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/actualizar")
def actualizar_inventario(datos: dict):
    try:
        variante_id = datos.get("variante_id")
        sucursal_id = datos.get("sucursal_id")
        resultado = supabase_patch(
            f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
            {"cantidad": datos.get("cantidad"), "stock_minimo": datos.get("stock_minimo", 3)}
        )
        cache_invalidate_prefix(_CK)
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
