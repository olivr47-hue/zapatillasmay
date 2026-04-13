from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
import hashlib
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/registro")
def registro(datos: dict):
    try:
        nombre = datos.get("nombre")
        email = datos.get("email")
        password = datos.get("password")
        tipo = datos.get("tipo", "cliente")

        if not nombre or not email or not password:
            return JSONResponse(status_code=400, content={"error": "Faltan datos obligatorios"})

        existente = supabase_get(f"usuarios?email=eq.{email}")
        if existente:
            return JSONResponse(status_code=400, content={"error": "El email ya esta registrado"})

        password_hash = hash_password(password)

        usuario = supabase_post("usuarios", {
            "nombre": nombre,
            "email": email,
            "password_hash": password_hash,
            "tipo": tipo,
            "activo": True
        })

        u = usuario[0]

        cliente = supabase_post("clientes", {
            "nombre": nombre,
            "email": email,
            "tipo": "zapateria" if tipo == "zapateria" else "menudeo",
            "activo": True
        })
        cliente_id = cliente[0]["id"] if cliente else None

        return {
            "id": u["id"],
            "nombre": u["nombre"],
            "email": u["email"],
            "tipo": u["tipo"],
            "cliente_id": cliente_id
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
        
@router.post("/login")
def login(datos: dict):
    try:
        email = datos.get("email")
        password = datos.get("password")

        if not email or not password:
            return JSONResponse(status_code=400, content={"error": "Email y password requeridos"})

        password_hash = hash_password(password)
        usuarios = supabase_get(f"usuarios?email=eq.{email}&password_hash=eq.{password_hash}&activo=eq.true")

        if not usuarios:
            return JSONResponse(status_code=401, content={"error": "Email o password incorrectos"})

        u = usuarios[0]
        return {
            "id": u["id"],
            "nombre": u["nombre"],
            "email": u["email"],
            "tipo": u["tipo"],
            "cliente_id": u.get("cliente_id")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/perfil/{usuario_id}")
def perfil(usuario_id: str):
    try:
        usuarios = supabase_get(f"usuarios?id=eq.{usuario_id}&select=*,clientes(*)")
        if not usuarios:
            return JSONResponse(status_code=404, content={"error": "Usuario no encontrado"})
        u = usuarios[0]
        return {
            "id": u["id"],
            "nombre": u["nombre"],
            "email": u["email"],
            "tipo": u["tipo"],
            "cliente_id": u.get("cliente_id"),
            "cliente": u.get("clientes")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/pedidos/{cliente_id}")
def pedidos_cliente(cliente_id: str):
    try:
        return supabase_get(f"pedidos?cliente_id=eq.{cliente_id}&order=created_at.desc&select=*,pedido_items(*,variantes(*,productos(nombre,imagen_principal)))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})