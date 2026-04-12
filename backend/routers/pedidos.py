from fastapi import APIRouter
from database import supabase_get, supabase_post

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

@router.get("/")
def listar_pedidos():
    return supabase_get("pedidos?order=created_at.desc&select=*,clientes(nombre,telefono),sucursales(nombre)")

@router.get("/pendientes")
def pedidos_pendientes():
    return supabase_get("pedidos?status=eq.pendiente&order=created_at.desc&select=*,clientes(nombre,telefono),sucursales(nombre)")

@router.get("/canal/{canal}")
def pedidos_por_canal(canal: str):
    return supabase_get(f"pedidos?canal=eq.{canal}&order=created_at.desc")

@router.get("/{id}")
def obtener_pedido(id: str):
    return supabase_get(f"pedidos?id=eq.{id}&select=*,clientes(*),sucursales(*),pedido_items(*,variantes(*,productos(nombre,marca)))")

@router.post("/")
def crear_pedido(pedido: dict):
    return supabase_post("pedidos", pedido)

@router.post("/{id}/items")
def agregar_item(id: str, item: dict):
    item["pedido_id"] = id
    return supabase_post("pedido_items", item)