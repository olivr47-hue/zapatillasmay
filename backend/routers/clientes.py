from fastapi import APIRouter
from database import supabase_get, supabase_post

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.get("/")
def listar_clientes():
    return supabase_get("clientes?order=nombre.asc")

@router.get("/mayoreo")
def clientes_mayoreo():
    return supabase_get("clientes?tipo=eq.mayoreo&order=nombre.asc")

@router.get("/menudeo")
def clientes_menudeo():
    return supabase_get("clientes?tipo=eq.menudeo&order=nombre.asc")

@router.get("/{id}")
def obtener_cliente(id: str):
    return supabase_get(f"clientes?id=eq.{id}")

@router.get("/{id}/pedidos")
def pedidos_cliente(id: str):
    return supabase_get(f"pedidos?cliente_id=eq.{id}&order=created_at.desc")

@router.post("/")
def crear_cliente(cliente: dict):
    return supabase_post("clientes", cliente)