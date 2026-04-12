from fastapi import APIRouter
from database import supabase_get, supabase_post, supabase_patch, obtener_consecutivo

router = APIRouter(prefix="/productos", tags=["Productos"])

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
    return supabase_get("productos?order=created_at.desc")

@router.get("/destacados")
def productos_destacados():
    return supabase_get("productos?destacado=eq.true&activo=eq.true")

@router.get("/nuevos")
def productos_nuevos():
    return supabase_get("productos?nuevo=eq.true&activo=eq.true")

@router.get("/categoria/{categoria}")
def productos_por_categoria(categoria: str):
    return supabase_get(f"productos?categoria=eq.{categoria}&activo=eq.true")

@router.get("/{id}")
def obtener_producto(id: str):
    return supabase_get(f"productos?id=eq.{id}")

@router.post("/")
def crear_producto(producto: dict):
    return supabase_post("productos", producto)

@router.patch("/{id}")
def actualizar_producto(id: str, producto: dict):
    return supabase_patch(f"productos?id=eq.{id}", producto)

@router.patch("/{id}/desactivar")
def desactivar_producto(id: str):
    return supabase_patch(f"productos?id=eq.{id}", {"activo": False})

@router.patch("/{id}/activar")
def activar_producto(id: str):
    return supabase_patch(f"productos?id=eq.{id}", {"activo": True})