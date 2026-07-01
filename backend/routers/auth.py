from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
from security import hash_password, verify_password, create_token, limiter
import os
import secrets
import json
import urllib.request
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

        # Aplicar código de referido (solo menudeo)
        codigo_ref = datos.get("codigo_referido", "").strip().upper()
        if codigo_ref and cliente_id and tipo != "zapateria":
            referidores = supabase_get(
                f"clientes?codigo_referido=eq.{codigo_ref}&tipo=eq.menudeo&select=id,credito_disponible"
            )
            if referidores:
                ref = referidores[0]
                if ref["id"] != cliente_id:
                    supabase_patch(f"clientes?id=eq.{cliente_id}", {
                        "referido_por": codigo_ref,
                        "credito_disponible": 50
                    })
                    credito_actual = float(ref.get("credito_disponible") or 0)
                    supabase_patch(f"clientes?id=eq.{ref['id']}", {
                        "credito_disponible": credito_actual + 50
                    })

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
        identificador = (datos.get("email") or "").strip()
        password = datos.get("password")
        if not identificador or not password:
            return JSONResponse(status_code=400, content={"error": "Usuario y password requeridos"})

        usuarios = None
        if "@" in identificador:
            # Login por email
            usuarios = supabase_get(f"usuarios?email=eq.{identificador}&activo=eq.true&select=id,nombre,email,tipo,cliente_id,password_hash")
        else:
            # Login por teléfono: buscar cliente por teléfono, luego su usuario vinculado
            solo_digitos = "".join(c for c in identificador if c.isdigit())
            if solo_digitos:
                clientes_tel = supabase_get(f"clientes?telefono=eq.{solo_digitos}&select=id")
                if clientes_tel:
                    cliente_id = clientes_tel[0]["id"]
                    usuarios = supabase_get(f"usuarios?cliente_id=eq.{cliente_id}&activo=eq.true&select=id,nombre,email,tipo,cliente_id,password_hash")

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


@router.post("/google")
def google_login(datos: dict):
    """Verifica un Google ID token y devuelve sesión, creando al usuario si no existe."""
    id_token = datos.get("id_token", "").strip()
    if not id_token:
        return JSONResponse(status_code=400, content={"error": "Token requerido"})
    try:
        # Verificar token con Google tokeninfo (no requiere librería adicional)
        req = urllib.request.Request(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}",
            headers={"User-Agent": "ZapatillasMay/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            info = json.loads(r.read())

        email = info.get("email", "").strip().lower()
        nombre = info.get("name") or info.get("given_name") or ""
        email_verified = info.get("email_verified") == "true"
        client_id_env = os.environ.get("GOOGLE_CLIENT_ID", "")
        aud = info.get("aud", "")

        if not email or not email_verified:
            return JSONResponse(status_code=401, content={"error": "Token inválido: email no verificado"})
        if client_id_env and aud != client_id_env:
            return JSONResponse(status_code=401, content={"error": "Token no corresponde a esta aplicación"})

        existente = supabase_get(f"usuarios?email=eq.{email}&activo=eq.true&select=id,nombre,email,tipo,cliente_id")
        if existente:
            u = existente[0]
        else:
            nuevo = supabase_post("usuarios", {
                "nombre": nombre or email.split("@")[0],
                "email": email,
                "password_hash": secrets.token_hex(32),
                "tipo": "cliente",
                "activo": True,
            })
            u = nuevo[0]
            cliente_existente = supabase_get(f"clientes?email=eq.{email}")
            if not cliente_existente:
                cliente = supabase_post("clientes", {
                    "nombre": u["nombre"],
                    "email": email,
                    "tipo": "menudeo",
                    "activo": True,
                    "origen": "google",
                })
                cliente_id = cliente[0]["id"] if cliente else None
                if cliente_id:
                    supabase_patch(f"usuarios?id=eq.{u['id']}", {"cliente_id": cliente_id})
                    u["cliente_id"] = cliente_id

        token = create_token({"sub": u["id"], "email": u["email"], "tipo": u["tipo"]})
        return {
            "token": token,
            "id": u["id"],
            "nombre": u["nombre"],
            "email": u["email"],
            "tipo": u["tipo"],
            "cliente_id": u.get("cliente_id"),
        }
    except urllib.error.HTTPError:
        return JSONResponse(status_code=401, content={"error": "Token de Google inválido o expirado"})
    except Exception as e:
        print(f"[auth/google] {e}")
        return JSONResponse(status_code=500, content={"error": "Error al verificar con Google"})


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
            "from": "Zapatillas May <noreply@zapatillasmay.mx>",
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


# ── NEWSLETTER ────────────────────────────────────────────────────

@router.post("/newsletter/subscribe")
def newsletter_subscribe(datos: dict):
    """Suscribe un email al newsletter y envía email de bienvenida via Resend."""
    email  = (datos.get("email") or "").strip().lower()
    nombre = (datos.get("nombre") or "").strip()

    if not email or "@" not in email:
        return JSONResponse(status_code=400, content={"error": "Email inválido"})

    try:
        # Verificar si ya existe
        existente = supabase_get(f"suscriptores?email=eq.{email}")
        if existente:
            return {"ok": True, "mensaje": "Ya estabas suscrita 😊"}

        # Guardar suscriptor
        supabase_post("suscriptores", {
            "email": email,
            "nombre": nombre or None,
            "fuente": "popup_tienda",
            "activo": True
        })

        # Email de bienvenida via Resend
        nombre_display = nombre.split()[0].capitalize() if nombre else "Hola"
        try:
            resend.Emails.send({
                "from": "Zapatillas May <noreply@zapatillasmay.mx>",
                "to": email,
                "subject": f"¡Bienvenida, {nombre_display}! 👠 Ya eres parte de Zapatillas May",
                "html": f"""
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff">
                  <div style="background:linear-gradient(135deg,#b5687a,#c8967a);padding:36px 32px;text-align:center">
                    <h1 style="color:white;font-size:1.5rem;font-weight:300;margin:0;letter-spacing:1px">
                      Zapatillas <strong>May</strong>
                    </h1>
                    <p style="color:rgba(255,255,255,0.85);font-size:0.85rem;margin:8px 0 0">
                      Calzado de moda · León, Guanajuato
                    </p>
                  </div>
                  <div style="padding:32px">
                    <h2 style="font-size:1.2rem;color:#0A0A0A;margin-bottom:8px">
                      ¡Hola, {nombre_display}! 👠
                    </h2>
                    <p style="color:#555;font-size:0.9rem;line-height:1.7;margin-bottom:20px">
                      Ya eres parte de nuestra comunidad. Cada semana te avisamos cuando llegan
                      modelos nuevos y te mandamos ofertas exclusivas antes que nadie.
                    </p>
                    <div style="background:#fdf8f5;border-radius:10px;padding:20px;margin-bottom:24px">
                      <p style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#c8967a;margin:0 0 12px">Lo que te espera:</p>
                      <p style="font-size:0.88rem;color:#444;margin:6px 0">✨ Nuevos modelos cada semana</p>
                      <p style="font-size:0.88rem;color:#444;margin:6px 0">🏷️ Precios de mayoreo desde 3 pares</p>
                      <p style="font-size:0.88rem;color:#444;margin:6px 0">🚚 Envíos a todo México</p>
                      <p style="font-size:0.88rem;color:#444;margin:6px 0">👠 Fabricado en León, Guanajuato</p>
                    </div>
                    <a href="https://zapatillasmay.mx"
                       style="display:block;text-align:center;background:linear-gradient(135deg,#b5687a,#c8967a);color:white;padding:14px;border-radius:50px;text-decoration:none;font-weight:700;font-size:0.9rem;margin-bottom:24px">
                      Ver los modelos nuevos →
                    </a>
                    <p style="color:#aaa;font-size:0.75rem;text-align:center;line-height:1.5;margin:0">
                      Recibiste este email porque te suscribiste en zapatillasmay.mx.<br>
                      <a href="https://zapatillasmay.mx" style="color:#c8967a">Cancelar suscripción</a>
                    </p>
                  </div>
                </div>"""
            })
        except Exception as email_err:
            print(f"[newsletter] Error enviando email de bienvenida: {email_err}")
            # No falla si el email no se envía — la suscripción ya se guardó

        return {"ok": True, "mensaje": "¡Suscrita! Revisa tu correo 📩"}

    except Exception as e:
        # Si falla por tabla no existente, devolver ok de todas formas
        print(f"[newsletter] Error: {e}")
        return {"ok": True, "mensaje": "¡Listo!"}


_NOTIF_EMAIL = os.getenv("NOTIF_EMAIL", "olivr47@gmail.com")

@router.post("/mayorista/registro")
def mayorista_registro(datos: dict):
    """Registra una revendedora interesada: guarda el lead y notifica al negocio."""
    nombre   = (datos.get("nombre") or "").strip()
    negocio  = (datos.get("negocio") or "").strip()
    ciudad   = (datos.get("ciudad") or "").strip()
    telefono = (datos.get("telefono") or "").strip()
    email    = (datos.get("email") or "").strip().lower()

    if not nombre or not telefono:
        return JSONResponse(status_code=400, content={"error": "Nombre y teléfono son obligatorios"})

    # Guardar lead en suscriptores
    try:
        if email and "@" in email:
            existente = supabase_get(f"suscriptores?email=eq.{email}")
            if not existente:
                supabase_post("suscriptores", {
                    "email": email,
                    "nombre": f"{nombre} | {negocio or 's/negocio'} | {ciudad or 's/ciudad'} | {telefono}",
                    "fuente": "mayorista",
                    "activo": True
                })
    except Exception as e:
        print(f"[mayorista] Error guardando lead: {e}")

    # Notificar al negocio
    try:
        tel_limpio = telefono.replace(' ', '').replace('-', '').lstrip('+')
        resend.Emails.send({
            "from": "Zapatillas May <noreply@zapatillasmay.mx>",
            "to": _NOTIF_EMAIL,
            "subject": f"🛍️ Nueva revendedora interesada: {nombre}",
            "html": f"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#0A0A0A">Nueva solicitud de revendedora</h2>
              <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
                <tr><td style="padding:8px 0;color:#888">Nombre</td><td style="padding:8px 0;font-weight:600">{nombre}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Negocio</td><td style="padding:8px 0;font-weight:600">{negocio or '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Ciudad</td><td style="padding:8px 0;font-weight:600">{ciudad or '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Teléfono</td><td style="padding:8px 0;font-weight:600">{telefono}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0;font-weight:600">{email or '—'}</td></tr>
              </table>
              <a href="https://wa.me/52{tel_limpio}"
                 style="display:inline-block;margin-top:16px;background:#25D366;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
                Contactar por WhatsApp
              </a>
            </div>"""
        })
    except Exception as e:
        print(f"[mayorista] Error notificando: {e}")

    # Email de bienvenida a la revendedora
    if email and "@" in email:
        try:
            primer_nombre = nombre.split()[0] if nombre else "Hola"
            resend.Emails.send({
                "from": "Zapatillas May <noreply@zapatillasmay.mx>",
                "to": email,
                "subject": "¡Gracias por tu interés en ser revendedora! 👠",
                "html": f"""
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
                  <h2 style="color:#0A0A0A">¡Hola, {primer_nombre}! 👋</h2>
                  <p style="color:#555;line-height:1.7;font-size:0.92rem">
                    Recibimos tu solicitud para ser revendedora de Zapatillas May.
                    Muy pronto te contactaremos por WhatsApp para darte de alta y
                    explicarte cómo aprovechar nuestros precios de mayoreo.
                  </p>
                  <a href="https://zapatillasmay.mx"
                     style="display:inline-block;margin-top:8px;background:linear-gradient(135deg,#b5687a,#c8967a);color:white;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:600">
                    Ver catálogo →
                  </a>
                </div>"""
            })
        except Exception as e:
            print(f"[mayorista] Error email bienvenida: {e}")

    return {"ok": True, "mensaje": "¡Solicitud recibida! Te contactaremos pronto 💬"}
