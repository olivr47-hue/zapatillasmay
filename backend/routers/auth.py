from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
import hashlib
import os
import random
import string
import resend

router = APIRouter(prefix="/auth", tags=["Auth"])

resend.api_key = os.getenv("RESEND_API_KEY")

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

@router.post("/recuperar")
def recuperar_password(datos: dict):
    try:
        email = datos.get("email")
        if not email:
            return JSONResponse(status_code=400, content={"error": "Email requerido"})

        usuarios = supabase_get(f"usuarios?email=eq.{email}&activo=eq.true")
        if not usuarios:
            return JSONResponse(status_code=404, content={"error": "No existe una cuenta con ese email"})

        u = usuarios[0]
        nombre = u.get("nombre", "Cliente")

        # Generar contraseña temporal
        nueva_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        password_hash = hash_password(nueva_password)
        supabase_patch(f"usuarios?email=eq.{email}", {"password_hash": password_hash})

        # Enviar email con Resend
        resend.Emails.send({
            "from": "Zapatillas May <onboarding@resend.dev>",
            "to": email,
            "subject": "Tu contraseña temporal — Zapatillas May",
            "html": f"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff">
                <div style="text-align:center;margin-bottom:24px">
                    <h1 style="font-size:1.4rem;color:#0A0A0A">Zapatillas <span style="color:#E91E8C">May</span></h1>
                </div>
                <h2 style="font-size:1.1rem;color:#0A0A0A;margin-bottom:8px">Hola, {nombre}</h2>
                <p style="color:#555;font-size:0.9rem;line-height:1.6;margin-bottom:24px">
                    Recibimos una solicitud para restablecer tu contraseña. 
                    Tu contraseña temporal es:
                </p>
                <div style="background:#f9f9f9;border:2px dashed #E91E8C;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px">
                    <span style="font-size:1.8rem;font-weight:700;letter-spacing:4px;color:#0A0A0A">{nueva_password}</span>
                </div>
                <p style="color:#555;font-size:0.85rem;line-height:1.6;margin-bottom:24px">
                    Ingresa con esta contraseña y cámbiala desde tu perfil.<br>
                    Si no solicitaste este cambio, ignora este correo.
                </p>
                <a href="https://zapatillasmay.mx" 
                   style="display:block;text-align:center;background:#E91E8C;color:white;padding:12px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem">
                    Ir a Zapatillas May
                </a>
                <p style="text-align:center;color:#aaa;font-size:0.75rem;margin-top:24px">
                    León, Guanajuato · zapatillasmay.mx
                </p>
            </div>
            """
        })

        return {"ok": True, "mensaje": "Te enviamos un email con tu contraseña temporal. Revisa tu bandeja de entrada."}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/cambiar-password")
def cambiar_password(datos: dict):
    try:
        usuario_id = datos.get("usuario_id")
        password_actual = datos.get("password_actual")
        password_nueva = datos.get("password_nueva")

        if not usuario_id or not password_actual or not password_nueva:
            return JSONResponse(status_code=400, content={"error": "Faltan datos"})

        hash_actual = hash_password(password_actual)
        usuarios = supabase_get(f"usuarios?id=eq.{usuario_id}&password_hash=eq.{hash_actual}&activo=eq.true")
        if not usuarios:
            return JSONResponse(status_code=401, content={"error": "La contraseña actual es incorrecta"})

        if len(password_nueva) < 6:
            return JSONResponse(status_code=400, content={"error": "La nueva contraseña debe tener al menos 6 caracteres"})

        hash_nueva = hash_password(password_nueva)
        supabase_patch(f"usuarios?id=eq.{usuario_id}", {"password_hash": hash_nueva})

        return {"ok": True, "mensaje": "Contraseña actualizada correctamente"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
