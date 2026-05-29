from fastapi import APIRouter, Body
from typing import List
from database import supabase_get, supabase_post, supabase_patch, obtener_consecutivo
from cache import cache_get, cache_set, cache_invalidate_prefix

router = APIRouter(prefix="/productos", tags=["Productos"])

_CK = "productos"  # prefijo de caché

@router.get("/siguiente-sku/{categoria}/{proveedor}")
def siguiente_sku(categoria: str, proveedor: str):
    num = obtener_consecutivo("productos")
    cat_prefijos = {
        "tacones": "TAC", "sandalias": "SAN", "botas": "BOT",
        "botines": "BTN", "flats": "FLT", "plataformas": "PLT",
        "tenis": "TEN", "nina": "NIN", "accesorios": "ACC"
    }
    prefix = cat_prefijos.get(categoria, "MAY")
    prov = proveedor[0].upper() if proveedor else "M"
    sku_base = f"{prov}-{prefix}-{str(num).zfill(4)}"
    return {"sku_base": sku_base, "consecutivo": num}

@router.get("/")
def listar_productos():
    cached = cache_get(_CK + "_all")
    if cached is not None:
        return cached
    data = supabase_get("productos?order=orden_home.asc.nullslast,created_at.desc")
    cache_set(_CK + "_all", data)
    return data

@router.get("/destacados")
def productos_destacados():
    cached = cache_get(_CK + "_destacados")
    if cached is not None:
        return cached
    data = supabase_get("productos?destacado=eq.true&activo=eq.true")
    cache_set(_CK + "_destacados", data)
    return data

@router.get("/nuevos")
def productos_nuevos():
    cached = cache_get(_CK + "_nuevos")
    if cached is not None:
        return cached
    data = supabase_get("productos?nuevo=eq.true&activo=eq.true")
    cache_set(_CK + "_nuevos", data)
    return data

@router.get("/categoria/{categoria}")
def productos_por_categoria(categoria: str):
    key = f"{_CK}_cat_{categoria}"
    cached = cache_get(key)
    if cached is not None:
        return cached
    data = supabase_get(f"productos?categoria=eq.{categoria}&activo=eq.true")
    cache_set(key, data)
    return data

@router.get("/sku/{sku}")
def producto_por_sku(sku: str):
    return supabase_get(f"productos?sku_interno=eq.{sku}")

@router.get("/{id}")
def obtener_producto(id: str):
    return supabase_get(f"productos?id=eq.{id}")

@router.post("/")
def crear_producto(producto: dict):
    # Si tiene SKU, verificar que no exista
    if producto.get("sku_interno"):
        existente = supabase_get(f"productos?sku_interno=eq.{producto['sku_interno']}")
        if existente:
            # Generar nuevo SKU
            num = obtener_consecutivo("productos")
            categoria = producto.get("categoria", "tacones")
            proveedor = producto.get("proveedor", "M")
            cat_prefijos = {
                "tacones": "TAC", "sandalias": "SAN", "botas": "BOT",
                "botines": "BTN", "flats": "FLT", "plataformas": "PLT",
                "tenis": "TEN", "nina": "NIN", "accesorios": "ACC"
            }
            prefix = cat_prefijos.get(categoria, "MAY")
            prov = proveedor[0].upper() if proveedor else "M"
            producto["sku_interno"] = f"{prov}-{prefix}-{str(num).zfill(4)}"
    resultado = supabase_post("productos", producto)
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}")
def actualizar_producto(id: str, producto: dict):
    if producto.get("sku_interno"):
        existente = supabase_get(f"productos?sku_interno=eq.{producto['sku_interno']}&id=neq.{id}")
        if existente:
            return {"error": f"El SKU {producto['sku_interno']} ya existe en otro producto"}
    resultado = supabase_patch(f"productos?id=eq.{id}", producto)
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}/desactivar")
def desactivar_producto(id: str):
    resultado = supabase_patch(f"productos?id=eq.{id}", {"activo": False})
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}/activar")
def activar_producto(id: str):
    resultado = supabase_patch(f"productos?id=eq.{id}", {"activo": True})
    cache_invalidate_prefix(_CK)
    return resultado

@router.post("/orden-home")
def guardar_orden_home(ordenes: List[dict] = Body(...)):
    """Guarda el orden de aparición en la home. Recibe [{id, orden_home}]."""
    errores = []
    for item in ordenes:
        try:
            supabase_patch(f"productos?id=eq.{item['id']}", {"orden_home": item["orden_home"]})
        except Exception as e:
            errores.append({"id": item["id"], "error": str(e)})
    cache_invalidate_prefix(_CK)
    return {"ok": True, "actualizados": len(ordenes) - len(errores), "errores": errores}
