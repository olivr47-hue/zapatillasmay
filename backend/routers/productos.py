from fastapi import APIRouter
from database import supabase_get, supabase_post

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/")
def listar_productos():
    return supabase_get("productos?activo=eq.true&order=created_at.desc")

@router.get("/destacados")
def productos_destacados():
    return supabase_get("productos?destacado=eq.true&activo=eq.true")

@router.get("/nuevos")
def productos_nuevos():
    return supabase_get("productos?nuevo=eq.true&activo=eq.true")

@router.get("/categoria/{categoria}")
def productos_por_categoria(categoria: str):
    return supabase_get(f"productos?categoria=eq.{categoria}&activo=eq.true")

@router.get("/{slug}")
def obtener_producto(slug: str):
    return supabase_get(f"productos?slug=eq.{slug}")

@router.post("/")
def crear_producto(producto: dict):
    return supabase_post("productos", producto)