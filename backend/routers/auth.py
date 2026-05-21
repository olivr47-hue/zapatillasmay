from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
from security import hash_password, verify_password, create_token, limiter
import os
import resend

router = APIRouter(prefix="/auth", tags=["Auth"])

resend.api_key = os.getenv("RESEND_API_KEY")


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
        telefono = datos.get("telefono", "")
        usuario = supabase_post("usuarios", {
            "nombre": nombre,
            "email": email,
            "password_hash": password_hash,
            "tipo": tipo,
            "activo": True
        })
        u = usuario[0]
        # Buscar si ya existe cliente con ese email o telefono para no duplicar
        cliente_existente = supabase_get(f"clientes?email=eq.{email}")
        if not cliente_existente and telefono:
            cliente_existente = supabase_get(f"clientes?telefono=eq.{telefono}")

        if cliente_existente:
            supabase_patch(f"clientes?id=eq.{cliente_existente[0]['id']}", {
                "email": email,
                "origen": "tienda"
            })
            cliente = cliente_existente
        else:
            cliente = supabase_post("clientes", {
                "nombre": nombre,
                "email": email,
                "telefono": telefono,
                "tipo": "zapateria" if tipo == "zapateria" else "menudeo",
                "activo": True,
                "origen": "tienda"
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
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/login")
@limiter.limit("10/minute")
async def login(request: Request, datos: dict):
    try:
        email = datos.get("email")
        password = datos.get("password")
        if not email or not password:
            return JSONResponse(status_code=400, content={"error": "Email y password requeridos"})

        # Buscar solo por email (nunca enviar el hash en la URL)
        usuarios = supabase_get(f"usuarios?email=eq.{email}&activo=eq.true&select=id,nombre,email,tipo,cliente_id,password_hash")
        if not usuarios:
            return JSONResponse(status_code=401, content={"error": "Email o password incorrectos"})

        u = usuarios[0]
        if not verify_password(password, u.get("password_hash", "")):
            return JSONResponse(status_code=401, content={"error": "Email o password incorrectos"})

        # Migrar SHA-256 → bcrypt si aplica
        stored = u.get("password_hash", "")
        if not stored.startswith("$2"):
            nuevo_hash = hash_password(password)
            supabase_patch(f"usuarios?id=eq.{u['id']}", {"password_hash": nuevo_hash})

        token = create_token({"sub": u["id"], "email": u["email"], "tipo": u["tipo"]})
        return {
            "token": token,
            "id": u["id"],
            "nombre": u["nombre"],
            "email": u["email"],
            "tipo": u["tipo"],
            "cliente_id": u.get("cliente_id")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.get("/perfil/{usuario_id}")
def perfil(usuario_id: str):
    try:
        usuarios = supabase_get(f"usuarios?id=eq.{usuario_id}&select=id,nombre,email,tipo,cliente_id,clientes(*)")
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
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.get("/pedidos/{cliente_id}")
def pedidos_cliente(cliente_id: str):
    try:
        return supabase_get(f"pedidos?cliente_id=eq.{cliente_id}&order=created_at.desc&select=*,pedido_items(*,variantes(*,productos(nombre,imagen_principal)))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/recuperar")
@limiter.limit("3/minute")
async def recuperar_password(request: Request, datos: dict):
    try:
        email = datos.get("email")
        if not email:
            return JSONResponse(status_code=400, content={"error": "Email requerido"})

        usuarios = supabase_get(f"usuarios?email=eq.{email}&activo=eq.true&select=id,nombre")
        if not usuarios:
            # Respuesta genérica para no revelar si el email existe
            return {"ok": True, "mensaje": "Si existe una cuenta con ese email, recibirás las instrucciones."}

        u = usuarios[0]
        nombre = u.get("nombre", "Cliente")

        # Generar token temporal de 1 hora (no se envía la contraseña en texto plano)
        import secrets
        reset_token = secrets.token_urlsafe(32)
        reset_hash = hash_password(reset_token)

        # Guardar hash del token y expiración en el usuario
        import time
        supabase_patch(f"usuarios?id=eq.{u['id']}", {
            "reset_token_hash": reset_hash,
            "reset_token_exp": int(time.time()) + 3600
        })

        reset_url = f"https://zapatillasmay.mx/restablecer?token={reset_token}&uid={u['id']}"

        resend.Emails.send({
            "from": "Zapatillas May <onboarding@resend.dev>",
            "to": email,
            "subject": "Restablecer contraseña — Zapatillas May",
            "html": f"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff">
                <div style="text-align:center;margin-bottom:24px">
                    <h1 style="font-size:1.4rem;color:#0A0A0A">Zapatillas <span style="color:#E91E8C">May</span></h1>
                </div>
                <h2 style="font-size:1.1rem;color:#0A0A0A;margin-bottom:8px">Hola, {nombre}</h2>
                <p style="color:#555;font-size:0.9rem;line-height:1.6;margin-bottom:24px">
                    Recibimos una solicitud para restablecer tu contraseña.
                    Haz clic en el siguiente enlace (válido por 1 hora):
                </p>
                <a href="{reset_url}"
                   style="display:block;text-align:center;background:#E91E8C;color:white;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;margin-bottom:24px">
                    Restablecer contraseña
                </a>
                <p style="color:#aaa;font-size:0.8rem;line-height:1.5">
                    Si no solicitaste este cambio, ignora este correo.<br>
                    El enlace expira en 1 hora.
                </p>
                <p style="text-align:center;color:#aaa;font-size:0.75rem;margin-top:24px">
                    León, Guanajuato · zapatillasmay.mx
                </p>
            </div>
            """
        })

        return {"ok": True, "mensaje": "Si existe una cuenta con ese email, recibirás las instrucciones."}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/cambiar-password")
def cambiar_password(datos: dict):
    try:
        usuario_id = datos.get("usuario_id")
        password_actual = datos.get("password_actual")
        password_nueva = datos.get("password_nueva")

        if not usuario_id or not password_actual or not password_nueva:
            return JSONResponse(status_code=400, content={"error": "Faltan datos"})

        if len(password_nueva) < 8:
            return JSONResponse(status_code=400, content={"error": "La nueva contraseña debe tener al menos 8 caracteres"})

        usuarios = supabase_get(f"usuarios?id=eq.{usuario_id}&activo=eq.true&select=id,password_hash")
        if not usuarios:
            return JSONResponse(status_code=401, content={"error": "La contraseña actual es incorrecta"})

        u = usuarios[0]
        if not verify_password(password_actual, u.get("password_hash", "")):
            return JSONResponse(status_code=401, content={"error": "La contraseña actual es incorrecta"})

        hash_nueva = hash_password(password_nueva)
        supabase_patch(f"usuarios?id=eq.{usuario_id}", {"password_hash": hash_nueva})

        return {"ok": True, "mensaje": "Contraseña actualizada correctamente"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})
