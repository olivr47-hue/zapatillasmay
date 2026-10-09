from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials
from database import supabase_get, supabase_post, supabase_patch
from security import hash_password, verify_password, create_token, limiter, bearer_opcional, cliente_autorizado, usuario_autorizado, require_staff, TOKEN_CLIENTE_HORAS, verify_token, es_personal
from email_utils import enviar_email
from security import limpiar_texto
import os
import re as _re_auth
import secrets
import json
import urllib.request
import datetime as _dt
import html as _html
import urllib.parse as _up

router = APIRouter(prefix="/auth", tags=["Auth"])
_UUID_AUTH = _re_auth.compile(r"^[0-9a-fA-F-]{36}$")


def _q(valor) -> str:
    """Codifica un valor para usarlo dentro de un filtro PostgREST (evita que un
    '&', '=', ',' o '(' del usuario inyecte parámetros extra en la consulta)."""
    return _up.quote(str(valor), safe="")


def _usuarios_por_email(email: str, select: str, solo_activos: bool = True) -> list:
    """Busca usuarios por email sin distinguir mayúsculas, pero con coincidencia
    EXACTA: ilike trata '_' y '%' como comodines, así que 'jo_@gmail.com' calzaba
    con 'joe@gmail.com'. Se trae por ilike y se filtra exacto en Python."""
    email = (email or "").strip().lower()
    if not email:
        return []
    filtro = f"usuarios?email=ilike.{_q(email)}&select={select}"
    if solo_activos:
        filtro += "&activo=eq.true"
    return [u for u in (supabase_get(filtro) or []) if (u.get("email") or "").strip().lower() == email]


def _clientes_por_email(email: str, select: str = "id") -> list:
    email = (email or "").strip().lower()
    if not email:
        return []
    sel = select if "email" in select.split(",") else select + ",email"
    rows = supabase_get(f"clientes?email=ilike.{_q(email)}&select={sel}") or []
    return [c for c in rows if (c.get("email") or "").strip().lower() == email]


@router.post("/registro")
@limiter.limit("5/minute")
def registro(request: Request, datos: dict):
    from textos import limpiar_campos
    limpiar_campos(datos, ("nombre", "telefono", "ciudad", "direccion"))
    try:
        nombre = limpiar_texto(datos.get("nombre"), comillas=True)
        email = (datos.get("email") or "").strip().lower()
        password = datos.get("password")
        tipo = datos.get("tipo", "cliente")
        if not nombre or not email or not password:
            return JSONResponse(status_code=400, content={"error": "Faltan datos obligatorios"})
        existente = _usuarios_por_email(email, "id", solo_activos=False)
        if existente:
            return JSONResponse(status_code=400, content={"error": "El email ya esta registrado"})
        password_hash = hash_password(password)
        telefono = limpiar_texto(datos.get("telefono", ""))
        usuario = supabase_post("usuarios", {
            "nombre": nombre,
            "email": email,
            "password_hash": password_hash,
            "tipo": tipo,
            "activo": True
        })
        u = usuario[0]
        # Buscar si ya existe cliente con ese email o telefono para no duplicar
        cliente_existente = _clientes_por_email(email)
        if not cliente_existente and telefono:
            cliente_existente = supabase_get(f"clientes?telefono=eq.{_q(telefono)}")

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
                "tipo": tipo if tipo in ("zapateria", "mayoreo") else "menudeo",
                "activo": True,
                "origen": "tienda"
            })
        cliente_id = cliente[0]["id"] if cliente else None
        if cliente_id:
            supabase_patch(f"usuarios?id=eq.{u['id']}", {"cliente_id": cliente_id})

        # Código de referido: la nueva cuenta recibe $50 de bienvenida; el bono del
        # REFERIDOR ($50 menudeo / $300 mayoreo) ya NO se da al registrarse (se podía
        # farmear con cuentas falsas) sino cuando el referido paga su primera compra
        # (ver referidos.otorgar_bono_referidor, llamado desde pagos/pedidos).
        codigo_ref = (datos.get("codigo_referido") or "").strip().upper()
        if codigo_ref and cliente_id:
            referidores = supabase_get(f"clientes?codigo_referido=eq.{_q(codigo_ref)}&select=id")
            if referidores and referidores[0]["id"] != cliente_id:
                actual = supabase_get(f"clientes?id=eq.{cliente_id}&select=credito_disponible,referido_por") or [{}]
                if not actual[0].get("referido_por"):
                    supabase_patch(f"clientes?id=eq.{cliente_id}", {
                        "referido_por": codigo_ref,
                        "credito_disponible": float(actual[0].get("credito_disponible") or 0) + 50
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
def login(request: Request, datos: dict):
    try:
        identificador = (datos.get("email") or "").strip().lower()
        password = datos.get("password")
        if not identificador or not password:
            return JSONResponse(status_code=400, content={"error": "Usuario y password requeridos"})

        usuarios = None
        if "@" in identificador:
            # Login por email
            usuarios = _usuarios_por_email(identificador, "id,nombre,email,tipo,cliente_id,password_hash")
        else:
            # Login por teléfono: buscar cliente por teléfono, luego su usuario vinculado
            solo_digitos = "".join(c for c in identificador if c.isdigit())
            if solo_digitos:
                clientes_tel = supabase_get(f"clientes?telefono=eq.{_q(solo_digitos)}&select=id")
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

        # Auto-reparar cuentas viejas cuyo usuario nunca quedó vinculado a su cliente
        cliente_id = u.get("cliente_id")
        if not cliente_id and u.get("email"):
            clientes_email = _clientes_por_email(u["email"])
            if clientes_email:
                cliente_id = clientes_email[0]["id"]
                supabase_patch(f"usuarios?id=eq.{u['id']}", {"cliente_id": cliente_id})

        token = create_token({"sub": u["id"], "email": u["email"], "tipo": u["tipo"], "cliente_id": cliente_id}, expires_hours=TOKEN_CLIENTE_HORAS)
        # Para poder ver en el panel quién entra al portal mayorista y cuándo
        # (antes no se guardaba en ningún lado -- ver GET /clientes/portal-mayoreo).
        try:
            supabase_patch(f"usuarios?id=eq.{u['id']}", {"ultimo_login": _dt.datetime.now(_dt.timezone.utc).isoformat()})
        except Exception:
            pass
        return {
            "token": token,
            "id": u["id"],
            "nombre": u["nombre"],
            "email": u["email"],
            "tipo": u["tipo"],
            "cliente_id": cliente_id
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/renovar")
@limiter.limit("30/minute")
def renovar_sesion(request: Request, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    """Renueva la sesión de una clienta del portal/tienda: si su token sigue vigente, devuelve uno nuevo de 60 días. Así quien entra
    seguido nunca se queda fuera (antes el token duraba 15 días fijos y a todas se les cerraba la sesión sin aviso)."""
    if not credentials:
        return JSONResponse(status_code=401, content={"error": "Sesión no válida"})
    try:
        payload = verify_token(credentials.credentials)
    except Exception:
        return JSONResponse(status_code=401, content={"error": "Sesión vencida"})
    if es_personal(payload):
        return JSONResponse(status_code=403, content={"error": "Solo para clientes"})
    sub = payload.get("sub")
    if sub and _UUID_AUTH.match(str(sub)):
        u = supabase_get(f"usuarios?id=eq.{sub}&select=activo")
        if u and u[0].get("activo") is False:
            return JSONResponse(status_code=401, content={"error": "Cuenta desactivada"})
    nuevo = {k: v for k, v in payload.items() if k not in ("exp", "iat", "nbf")}
    return {"token": create_token(nuevo, expires_hours=TOKEN_CLIENTE_HORAS)}


@router.get("/perfil/{usuario_id}")
def perfil(usuario_id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    if not usuario_autorizado(usuario_id, credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        usuarios = supabase_get(f"usuarios?id=eq.{usuario_id}&select=id,nombre,email,tipo,cliente_id,clientes(*)")
        if not usuarios:
            return JSONResponse(status_code=404, content={"error": "Usuario no encontrado"})
        u = usuarios[0]
        cliente_id = u.get("cliente_id")
        if not cliente_id and u.get("email"):
            clientes_email = _clientes_por_email(u["email"])
            if clientes_email:
                cliente_id = clientes_email[0]["id"]
            elif u.get("tipo") in ("zapateria", "mayoreo", "menudeo", "cliente"):
                # Cuenta huérfana: nunca tuvo un cliente asociado. Se crea uno.
                nuevo_cliente = supabase_post("clientes", {
                    "nombre": u["nombre"],
                    "email": u["email"],
                    "tipo": u["tipo"] if u["tipo"] in ("zapateria", "mayoreo") else "menudeo",
                    "activo": True,
                    "origen": "auto-reparado",
                })
                cliente_id = nuevo_cliente[0]["id"] if nuevo_cliente else None
            if cliente_id:
                supabase_patch(f"usuarios?id=eq.{usuario_id}", {"cliente_id": cliente_id})
        return {
            "id": u["id"],
            "nombre": u["nombre"],
            "email": u["email"],
            "tipo": u["tipo"],
            "cliente_id": cliente_id,
            "cliente": u.get("clientes")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.get("/pedidos/{cliente_id}")
def pedidos_cliente(cliente_id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    if not cliente_autorizado(cliente_id, credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        _sel = "select=*,pedido_items(*,variantes(*,productos(nombre,imagen_principal)))"
        try:
            return supabase_get(f"pedidos?cliente_id=eq.{cliente_id}&oculto=eq.false&order=created_at.desc&{_sel}")
        except Exception:
            return supabase_get(f"pedidos?cliente_id=eq.{cliente_id}&order=created_at.desc&{_sel}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/google")
@limiter.limit("10/minute")
def google_login(request: Request, datos: dict):
    """Verifica un Google ID token y devuelve sesión, creando al usuario si no existe.
    Si se envía tipo=mayoreo/zapateria (desde el portal mayorista), la cuenta nueva
    se crea con ese tipo en vez del menudeo por defecto."""
    id_token = datos.get("id_token", "").strip()
    tipo_solicitado = datos.get("tipo", "")
    tipo_nuevo = tipo_solicitado if tipo_solicitado in ("mayoreo", "zapateria") else "cliente"
    tipo_cliente_nuevo = tipo_solicitado if tipo_solicitado in ("mayoreo", "zapateria") else "menudeo"
    if not id_token:
        return JSONResponse(status_code=400, content={"error": "Token requerido"})
    try:
        # Verificar token con Google tokeninfo (no requiere librería adicional)
        req = urllib.request.Request(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={_q(id_token)}",
            headers={"User-Agent": "ZapatillasMay/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            info = json.loads(r.read())

        email = info.get("email", "").strip().lower()
        nombre = limpiar_texto(info.get("name") or info.get("given_name") or "", comillas=True)
        email_verified = info.get("email_verified") == "true"
        client_id_env = os.environ.get("GOOGLE_CLIENT_ID", "")
        aud = info.get("aud", "")

        if not email or not email_verified:
            return JSONResponse(status_code=401, content={"error": "Token inválido: email no verificado"})
        if not client_id_env:
            # Sin GOOGLE_CLIENT_ID no se puede verificar la audiencia: cualquier id_token de
            # Google de OTRA app serviría para entrar como cualquier correo. Falla cerrado.
            print("[auth/google] GOOGLE_CLIENT_ID no configurado; login con Google deshabilitado")
            return JSONResponse(status_code=503, content={"error": "Inicio de sesión con Google no disponible"})
        if aud != client_id_env:
            return JSONResponse(status_code=401, content={"error": "Token no corresponde a esta aplicación"})

        existente = _usuarios_por_email(email, "id,nombre,email,tipo,cliente_id")
        if existente:
            u = existente[0]
        else:
            nuevo = supabase_post("usuarios", {
                "nombre": nombre or email.split("@")[0],
                "email": email,
                "password_hash": secrets.token_hex(32),
                "tipo": tipo_nuevo,
                "activo": True,
            })
            u = nuevo[0]
            cliente_existente = _clientes_por_email(email)
            if not cliente_existente:
                cliente = supabase_post("clientes", {
                    "nombre": u["nombre"],
                    "email": email,
                    "tipo": tipo_cliente_nuevo,
                    "activo": True,
                    "origen": "google",
                })
                cliente_id = cliente[0]["id"] if cliente else None
                if cliente_id:
                    supabase_patch(f"usuarios?id=eq.{u['id']}", {"cliente_id": cliente_id})
                    u["cliente_id"] = cliente_id

        token = create_token({"sub": u["id"], "email": u["email"], "tipo": u["tipo"], "cliente_id": u.get("cliente_id")}, expires_hours=TOKEN_CLIENTE_HORAS)
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


@router.post("/google/redirect")
async def google_redirect(request: Request):
    """Modo redirección del botón de Google (cuando la ventana emergente no funciona en el teléfono): Google manda aquí, por POST, la credencial y el
    token anti-falsificación (g_csrf_token en el cuerpo Y en la cookie, deben coincidir). Se verifica igual que /auth/google y se regresa al portal con la
    sesión en el fragmento de la dirección (#gsi=...), que no viaja a ningún servidor."""
    import base64
    from fastapi.responses import RedirectResponse
    destino = "https://portal.zapatillasmay.mx/"
    try:
        form = await request.form()
        cred = str(form.get("credential") or "")
        csrf_cuerpo = str(form.get("g_csrf_token") or "")
        csrf_cookie = request.cookies.get("g_csrf_token") or ""
        if not cred or not csrf_cookie or not secrets.compare_digest(csrf_cuerpo, csrf_cookie):
            return RedirectResponse(destino + "#gsi_error=" + _up.quote("No se pudo verificar el inicio de sesión. Intenta de nuevo."), status_code=303)
        r = google_login(request, {"id_token": cred, "tipo": "mayoreo"})
        if isinstance(r, JSONResponse):
            try:
                msg = json.loads(r.body).get("error") or "No se pudo iniciar sesión con Google"
            except Exception:
                msg = "No se pudo iniciar sesión con Google"
            return RedirectResponse(destino + "#gsi_error=" + _up.quote(msg), status_code=303)
        carga = base64.urlsafe_b64encode(json.dumps(r).encode("utf-8")).decode().rstrip("=")
        return RedirectResponse(destino + "#gsi=" + carga, status_code=303)
    except Exception as e:
        print(f"[auth/google/redirect] {e}")
        return RedirectResponse(destino + "#gsi_error=" + _up.quote("Error al iniciar sesión con Google. Intenta de nuevo."), status_code=303)


_RESET_EXP_MIN = 60


def _hash_token_reset(token: str) -> str:
    import hashlib
    return hashlib.sha256(token.encode()).hexdigest()


@router.post("/recuperar")
@limiter.limit("3/minute")
def recuperar_password(request: Request, datos: dict):
    """Manda por correo un ENLACE de un solo uso (vence en 1 hora) para elegir contraseña nueva.
    Antes fijaba al instante una contraseña temporal: cualquiera que supiera tu correo podía
    dejarte fuera de tu cuenta con solo pedir la recuperación. Ahora pedirla no cambia nada
    hasta que la dueña del correo abre el enlace."""
    try:
        email = (datos.get("email") or "").strip().lower()
        if not email:
            return JSONResponse(status_code=400, content={"error": "Email requerido"})

        usuarios = _usuarios_por_email(email, "id,nombre,email")
        respuesta = {"ok": True, "mensaje": "Si existe una cuenta con ese email, recibirás las instrucciones."}
        if not usuarios:
            return respuesta  # respuesta genérica: no revela si el correo existe

        u = usuarios[0]
        # Máximo un enlace por minuto por cuenta (evita llenar el buzón de alguien)
        recientes = supabase_get(
            f"password_resets?usuario_id=eq.{u['id']}&order=created_at.desc&limit=1&select=created_at"
        ) or []
        if recientes:
            try:
                t0 = _dt.datetime.fromisoformat(str(recientes[0]["created_at"]).replace("Z", "+00:00"))
                if (_dt.datetime.now(_dt.timezone.utc) - t0).total_seconds() < 60:
                    return respuesta
            except Exception:
                pass

        token = secrets.token_urlsafe(32)
        expira = (_dt.datetime.now(_dt.timezone.utc) + _dt.timedelta(minutes=_RESET_EXP_MIN)).isoformat()
        supabase_post("password_resets", {
            "usuario_id": u["id"], "token_hash": _hash_token_reset(token), "expira_at": expira,
        })

        nombre = _html.escape(u.get("nombre") or "Cliente")
        enlace = f"https://zapatillasmay.mx/mi-cuenta?reset={token}"
        enviar_email(
            u["email"],  # SIEMPRE al correo guardado, nunca al texto que mandó quien pidió el enlace
            "Restablece tu contraseña — Zapatillas May",
            f"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff">
                <div style="text-align:center;margin-bottom:24px">
                    <h1 style="font-size:1.4rem;color:#0A0A0A">Zapatillas <span style="color:#E91E8C">May</span></h1>
                </div>
                <h2 style="font-size:1.1rem;color:#0A0A0A;margin-bottom:8px">Hola, {nombre}</h2>
                <p style="color:#555;font-size:0.9rem;line-height:1.6;margin-bottom:20px">
                    Recibimos una solicitud para restablecer tu contraseña. Toca el botón para elegir una nueva.
                    El enlace funciona una sola vez y vence en {_RESET_EXP_MIN} minutos.
                </p>
                <a href="{enlace}"
                   style="display:block;text-align:center;background:#E91E8C;color:white;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;margin-bottom:24px">
                    Elegir nueva contraseña
                </a>
                <p style="color:#aaa;font-size:0.8rem;line-height:1.5">
                    Si no lo pediste tú, ignora este correo: tu contraseña actual no cambió.
                </p>
                <p style="text-align:center;color:#aaa;font-size:0.75rem;margin-top:24px">
                    León, Guanajuato · zapatillasmay.mx
                </p>
            </div>
            """,
            tipo="recuperar_password",
        )
        return respuesta
    except Exception as e:
        print(f"[auth/recuperar] {e}")
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/restablecer")
@limiter.limit("10/minute")
def restablecer_password(request: Request, datos: dict):
    """Cambia la contraseña con el token del enlace del correo (un solo uso, vence en 1 hora)."""
    try:
        token = (datos.get("token") or "").strip()
        nueva = datos.get("password_nueva") or ""
        if not token or len(token) < 20:
            return JSONResponse(status_code=400, content={"error": "El enlace no es válido. Pide uno nuevo."})
        if len(nueva) < 8:
            return JSONResponse(status_code=400, content={"error": "La contraseña debe tener al menos 8 caracteres"})

        filas = supabase_get(
            f"password_resets?token_hash=eq.{_hash_token_reset(token)}&select=id,usuario_id,expira_at,usado&limit=1"
        ) or []
        malo = JSONResponse(status_code=400, content={"error": "El enlace venció o ya se usó. Pide uno nuevo."})
        if not filas or filas[0].get("usado"):
            return malo
        try:
            if _dt.datetime.fromisoformat(str(filas[0]["expira_at"]).replace("Z", "+00:00")) < _dt.datetime.now(_dt.timezone.utc):
                return malo
        except Exception:
            return malo

        # Se "gasta" el token primero y de forma atómica (solo si seguía sin usar): dos clics simultáneos
        # no pueden usarlo dos veces.
        reclamado = supabase_patch(f"password_resets?id=eq.{filas[0]['id']}&usado=eq.false", {"usado": True})
        if not reclamado:
            return malo

        uid = filas[0]["usuario_id"]
        supabase_patch(f"usuarios?id=eq.{uid}", {"password_hash": hash_password(nueva)})
        # cualquier otro enlace pendiente de esa cuenta deja de servir
        supabase_patch(f"password_resets?usuario_id=eq.{uid}&usado=eq.false", {"usado": True})
        return {"ok": True, "mensaje": "Listo. Ya puedes iniciar sesión con tu nueva contraseña."}
    except Exception as e:
        print(f"[auth/restablecer] {e}")
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/admin/resetear-password-cliente")
def resetear_password_cliente(datos: dict, _staff=Depends(require_staff)):
    """El admin fija directamente una contraseña nueva para un usuario del
    portal mayoreo, sin depender de que le llegue el correo de recuperación
    -- útil cuando el correo no llega (spam, casillas mal escritas) o la
    clienta ya no recuerda con qué correo se registró. Se le comunica la
    contraseña nueva por fuera (WhatsApp/llamada), no por este endpoint."""
    try:
        usuario_id = datos.get("usuario_id")
        password_nueva = datos.get("password_nueva")
        if not usuario_id or not password_nueva:
            return JSONResponse(status_code=400, content={"error": "Faltan datos"})
        if len(password_nueva) < 6:
            return JSONResponse(status_code=400, content={"error": "La contraseña debe tener al menos 6 caracteres"})
        existente = supabase_get(f"usuarios?id=eq.{usuario_id}&select=id")
        if not existente:
            return JSONResponse(status_code=404, content={"error": "Usuario no encontrado"})
        supabase_patch(f"usuarios?id=eq.{usuario_id}", {"password_hash": hash_password(password_nueva)})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/cambiar-password")
@limiter.limit("5/minute")
def cambiar_password(request: Request, datos: dict, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    # Antes no pedía token: cualquiera podía adivinar la contraseña actual de cualquier usuario_id.
    if not usuario_autorizado(str(datos.get("usuario_id") or ""), credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        usuario_id = datos.get("usuario_id")
        password_actual = datos.get("password_actual")
        password_nueva = datos.get("password_nueva")

        if not usuario_id or not password_actual or not password_nueva:
            return JSONResponse(status_code=400, content={"error": "Faltan datos"})

        if len(password_nueva) < 8:
            return JSONResponse(status_code=400, content={"error": "La nueva contraseña debe tener al menos 8 caracteres"})

        usuarios = supabase_get(f"usuarios?id=eq.{_q(usuario_id)}&activo=eq.true&select=id,password_hash")
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
@limiter.limit("5/minute")
def newsletter_subscribe(request: Request, datos: dict):
    """Suscribe un email al newsletter y envía email de bienvenida."""
    email  = (datos.get("email") or "").strip().lower()
    nombre = limpiar_texto((datos.get("nombre") or "").strip())

    if not email or "@" not in email:
        return JSONResponse(status_code=400, content={"error": "Email inválido"})

    try:
        # Verificar si ya existe
        existente = supabase_get(f"suscriptores?email=eq.{_q(email)}")
        if existente:
            return {"ok": True, "mensaje": "Ya estabas suscrita 😊"}

        # Guardar suscriptor
        supabase_post("suscriptores", {
            "email": email,
            "nombre": nombre or None,
            "fuente": "popup_tienda",
            "activo": True
        })

        # Email de bienvenida
        nombre_display = _html.escape(nombre.split()[0].capitalize()) if nombre else "Hola"
        try:
            enviar_email(
                email,
                f"¡Bienvenida, {nombre_display}! 👠 Ya eres parte de Zapatillas May",
                f"""
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
                      <p style="font-size:0.88rem;color:#444;margin:6px 0">🏷️ Descuento automático desde 3 pares</p>
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
                </div>""",
                tipo="newsletter_bienvenida",
            )
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
@limiter.limit("5/minute")
def mayorista_registro(request: Request, datos: dict):
    """Registra una revendedora interesada: guarda el lead y notifica al negocio."""
    nombre   = (datos.get("nombre") or "").strip()
    negocio  = limpiar_texto((datos.get("negocio") or "").strip())
    ciudad   = limpiar_texto((datos.get("ciudad") or "").strip())
    telefono = limpiar_texto((datos.get("telefono") or "").strip())
    email    = (datos.get("email") or "").strip().lower()

    if not nombre or not telefono:
        return JSONResponse(status_code=400, content={"error": "Nombre y teléfono son obligatorios"})
    # Estos valores se incrustan en HTML de correos (incluido el aviso a la dueña): escapar.
    nombre, negocio, ciudad, telefono = (_html.escape(x) for x in (nombre, negocio, ciudad, telefono))

    # Guardar lead en suscriptores
    guardado = False
    try:
        if email and "@" in email:
            existente = supabase_get(f"suscriptores?email=eq.{_q(email)}")
            if not existente:
                supabase_post("suscriptores", {
                    "email": email,
                    "nombre": f"{nombre} | {negocio or 's/negocio'} | {ciudad or 's/ciudad'} | {telefono}",
                    "fuente": "mayorista",
                    "activo": True
                })
            guardado = True
    except Exception as e:
        print(f"[mayorista] Error guardando lead: {e}")

    # Notificar al negocio
    try:
        tel_limpio = telefono.replace(' ', '').replace('-', '').lstrip('+')
        avisado = enviar_email(
            _NOTIF_EMAIL,
            f"🛍️ Nueva revendedora interesada: {nombre}",
            f"""
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#0A0A0A">Nueva solicitud de revendedora</h2>
              <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
                <tr><td style="padding:8px 0;color:#888">Nombre</td><td style="padding:8px 0;font-weight:600">{nombre}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Negocio</td><td style="padding:8px 0;font-weight:600">{negocio or '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Ciudad</td><td style="padding:8px 0;font-weight:600">{ciudad or '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Teléfono</td><td style="padding:8px 0;font-weight:600">{telefono}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0;font-weight:600">{_html.escape(email) if email else '—'}</td></tr>
              </table>
              <a href="https://wa.me/52{tel_limpio}"
                 style="display:inline-block;margin-top:16px;background:#25D366;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
                Contactar por WhatsApp
              </a>
            </div>""",
            tipo="mayorista_aviso_negocio",
        )
    except Exception as e:
        print(f"[mayorista] Error notificando: {e}")
        avisado = False

    # Sin correo del lead el único rastro es el aviso al negocio: si tampoco salió, la solicitud se perdería
    # y la página igual decía "enviado". Ahora el formulario se entera y le sugiere escribir por WhatsApp.
    if not (guardado or avisado):
        return JSONResponse(status_code=502, content={"error": "No pudimos registrar tu solicitud. Escríbenos por WhatsApp."})

    # Email de bienvenida a la revendedora
    if email and "@" in email:
        try:
            primer_nombre = nombre.split()[0] if nombre else "Hola"
            enviar_email(
                email,
                "¡Gracias por tu interés en ser revendedora! 👠",
                f"""
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
                </div>""",
                tipo="mayorista_bienvenida",
            )
        except Exception as e:
            print(f"[mayorista] Error email bienvenida: {e}")

    return {"ok": True, "mensaje": "¡Solicitud recibida! Te contactaremos pronto 💬"}
