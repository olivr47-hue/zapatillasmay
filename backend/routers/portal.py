"""
Portal de cliente mayoreo — endpoints SEGUROS y aislados.

Diseño:
- Login (correo / Google) que emite un JWT con `rol: cliente` + `cliente_id`.
- Todos los endpoints de datos validan ese token y SOLO devuelven/escriben datos
  del `cliente_id` del token (nunca de un id que venga en el body/URL).
- No modifica los endpoints existentes del panel/tienda; vive bajo el prefijo /portal.
- Menudeo no entra (usan el sitio web).
"""
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete
import urllib.parse as _up
from security import verify_password, hash_password, create_token, verify_token, limiter
from email_utils import enviar_email
import os
import re
import json
import secrets
import urllib.request
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/portal", tags=["Portal Cliente"])
_bearer = HTTPBearer(auto_error=False)

OTP_EXP_MIN = 10
OTP_COOLDOWN_SEG = 60   # mínimo entre códigos pedidos para el mismo destino
_UUID_RE = re.compile(r"^[0-9a-fA-F-]{36}$")
OTP_MAX_INTENTOS = 5

# Campos del cliente seguros para exponer al propio cliente (sin notas internas, etc.)
_CAMPOS_CLIENTE = (
    "id", "nombre", "telefono", "email", "tipo", "direccion", "ciudad",
    "estado", "codigo_postal", "limite_credito", "dias_credito",
    "credito_disponible", "codigo_referido",
)


# ── Auth helpers ──────────────────────────────────────────────────────────────
def require_cliente(credentials: HTTPAuthorizationCredentials = Depends(_bearer)) -> dict:
    """Exige un token válido de rol cliente con cliente_id."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticación requerida")
    payload = verify_token(credentials.credentials)
    if payload.get("rol") != "cliente" or not payload.get("cliente_id"):
        raise HTTPException(status_code=403, detail="Se requiere una sesión de cliente")
    return payload


def _cliente_publico(c: dict) -> dict:
    return {k: c.get(k) for k in _CAMPOS_CLIENTE}


def _emitir_token(usuario_id, cliente: dict) -> str:
    return create_token({
        "sub": usuario_id or cliente["id"],
        "cliente_id": cliente["id"],
        "rol": "cliente",
        "tipo": cliente.get("tipo"),
    }, expires_hours=60 * 24)


def _validar_mayoreo(cliente: dict):
    """Solo mayoreo/zapatería entran al portal."""
    if cliente.get("tipo") == "menudeo":
        raise HTTPException(status_code=403, detail="Tu cuenta es de menudeo. Entra desde zapatillasmay.mx")


def _num(v):
    try:
        return float(v) if v is not None else 0.0
    except (TypeError, ValueError):
        return 0.0


# ── LOGIN: correo + contraseña ────────────────────────────────────────────────
@router.post("/login")
@limiter.limit("10/minute")
def login(request: Request, datos: dict):
    email = (datos.get("email") or "").strip().lower()
    password = datos.get("password") or ""
    if not email or not password:
        return JSONResponse(status_code=400, content={"error": "Correo y contraseña requeridos"})

    usuarios = supabase_get(
        f"usuarios?email=eq.{_up.quote(email, safe='')}&activo=eq.true&select=id,nombre,email,cliente_id,password_hash"
    )
    if not usuarios or not verify_password(password, usuarios[0].get("password_hash", "")):
        return JSONResponse(status_code=401, content={"error": "Correo o contraseña incorrectos"})

    u = usuarios[0]
    cliente_id = u.get("cliente_id")
    if not cliente_id:
        return JSONResponse(status_code=403, content={"error": "Esta cuenta no está ligada a un cliente"})

    cli = supabase_get(f"clientes?id=eq.{cliente_id}&select=*")
    if not cli:
        return JSONResponse(status_code=403, content={"error": "Cliente no encontrado"})
    c = cli[0]
    _validar_mayoreo(c)
    return {"token": _emitir_token(u["id"], c), "cliente": _cliente_publico(c)}


# ── LOGIN: Google (verifica id_token con Google, igual que el sitio) ───────────
@router.post("/login/google")
@limiter.limit("10/minute")
def login_google(request: Request, datos: dict):
    id_token = (datos.get("id_token") or "").strip()
    if not id_token:
        return JSONResponse(status_code=400, content={"error": "Token requerido"})
    try:
        req = urllib.request.Request(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={_up.quote(id_token, safe='')}",
            headers={"User-Agent": "ZapatillasMay/1.0"},
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            info = json.loads(r.read())
    except Exception:
        return JSONResponse(status_code=401, content={"error": "Token de Google inválido o expirado"})

    email = (info.get("email") or "").strip().lower()
    if not email or info.get("email_verified") not in ("true", True):
        return JSONResponse(status_code=401, content={"error": "Email no verificado por Google"})
    client_id_env = os.environ.get("GOOGLE_CLIENT_ID", "")
    if not client_id_env:
        # Sin GOOGLE_CLIENT_ID no se puede validar la audiencia: un id_token de OTRA app serviría
        # para entrar como cualquier correo. Falla cerrado.
        print("[portal/google] GOOGLE_CLIENT_ID no configurado; login con Google deshabilitado")
        return JSONResponse(status_code=503, content={"error": "Inicio de sesión con Google no disponible"})
    if info.get("aud") != client_id_env:
        return JSONResponse(status_code=401, content={"error": "Token no corresponde a esta aplicación"})

    cli = supabase_get(f"clientes?email=eq.{_up.quote(email, safe='')}&select=*")
    if not cli:
        return JSONResponse(status_code=403, content={"error": "No encontramos una cuenta de cliente con ese correo. Pide tu alta de mayoreo."})
    if len(cli) > 1:
        # Varios clientes comparten ese correo (p. ej. uno genérico del negocio): no se puede saber a cuál entra.
        return JSONResponse(status_code=409, content={"error": "Ese correo está en varias cuentas. Entra con tu número de WhatsApp."})
    c = cli[0]
    _validar_mayoreo(c)
    return {"token": _emitir_token(None, c), "cliente": _cliente_publico(c)}


# ── LOGIN por CÓDIGO (OTP) — teléfono (WhatsApp) o correo ─────────────────────
def _norm_tel(t: str) -> str:
    return re.sub(r"\D", "", t or "")[-10:]


def _mask(destino: str, metodo: str) -> str:
    if metodo == "telefono":
        return "•••• " + destino[-4:]
    p = destino.split("@")
    return (p[0][:2] + "•••@" + p[1]) if len(p) == 2 else destino


def _buscar_cliente_por(metodo: str, valor: str):
    """Devuelve (cliente, destino_normalizado). destino None si el dato es inválido."""
    if metodo == "telefono":
        tel = _norm_tel(valor)
        if len(tel) < 10:
            return None, None
        # supabase_get_all: con supabase_get solo llegaban las primeras 1000 filas y los clientes
        # siguientes nunca podían entrar por teléfono.
        clientes = supabase_get_all("clientes?activo=eq.true&select=id,nombre,telefono,email,tipo") or []
        return next((c for c in clientes if _norm_tel(c.get("telefono")) == tel), None), tel
    email = (valor or "").strip().lower()
    if "@" not in email:
        return None, None
    filas = supabase_get(f"clientes?email=eq.{_up.quote(email, safe='')}&select=id,nombre,telefono,email,tipo&limit=2") or []
    # Si el correo lo comparten varios clientes no se adivina cuál es: se trata como no encontrado.
    return (filas[0] if len(filas) == 1 else None), email


def _enviar_sms_codigo(tel10: str, codigo: str) -> bool:
    """Envío del código por SMS. NO usa la API de WhatsApp.
    Pendiente de proveedor SMS (Twilio/Labsmobile/etc.); cuando se configure
    se integra aquí. Por ahora devuelve False (no se envía)."""
    print(f"[portal otp sms] proveedor SMS no configurado; código para {tel10} no enviado")
    return False


def _enviar_email_codigo(email: str, nombre: str, codigo: str) -> bool:
    return enviar_email(
        email,
        f"Tu código de acceso: {codigo}",
        f"""
        <div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:28px">
          <h2 style="color:#0A0A0A">Hola {__import__('html').escape(nombre or '')} 👋</h2>
          <p style="color:#555">Tu código para entrar al portal de mayoreo:</p>
          <p style="font-size:2rem;font-weight:800;letter-spacing:6px;color:#E91E8C;margin:18px 0">{codigo}</p>
          <p style="color:#aaa;font-size:.8rem">Vence en {OTP_EXP_MIN} minutos. Si no fuiste tú, ignora este correo.</p>
        </div>""",
        tipo="otp_portal",
    )


def _enviar_wa_codigo(tel10: str, codigo: str) -> bool:
    """Envía el código OTP por WhatsApp (Meta Cloud API) reutilizando el sender del chatbot.

    Los mensajes iniciados por el negocio requieren una plantilla aprobada cuando el cliente
    no tiene abierta una ventana de servicio de 24 h. Si hay una plantilla de autenticación
    configurada en `WA_OTP_TEMPLATE` se usa; si no, se intenta texto plano como respaldo
    (que Meta solo entrega dentro de la ventana de 24 h).
    """
    try:
        # Import diferido: evita ciclos y efectos de carga del router del chatbot.
        from routers.chatbot import enviar_whatsapp_texto, enviar_whatsapp_plantilla
    except Exception as e:
        print(f"[portal otp wa] no se pudo importar el sender de WhatsApp: {e}")
        return False

    # Número en formato internacional MX (52 + 10 dígitos); Meta normaliza el prefijo móvil.
    destino = tel10 if tel10.startswith("52") else f"52{tel10}"
    plantilla = os.getenv("WA_OTP_TEMPLATE", "").strip()
    idioma = os.getenv("WA_OTP_TEMPLATE_LANG", "es_MX").strip() or "es_MX"
    try:
        if plantilla:
            wamid = enviar_whatsapp_plantilla(destino, plantilla, idioma, [codigo])
            if wamid:
                return True
        texto = (
            f"Tu código para entrar al portal de mayoreo Zapatillas May es: {codigo}\n"
            f"Vence en {OTP_EXP_MIN} minutos. Si no fuiste tú, ignóralo."
        )
        return bool(enviar_whatsapp_texto(destino, texto))
    except Exception as e:
        print(f"[portal otp wa] {e}")
        return False


@router.post("/otp/solicitar")
@limiter.limit("5/minute")
def otp_solicitar(request: Request, datos: dict):
    metodo = datos.get("metodo")
    valor = datos.get("valor") or ""
    if metodo not in ("telefono", "correo"):
        return JSONResponse(status_code=400, content={"error": "Método inválido"})
    cli, destino = _buscar_cliente_por(metodo, valor)
    if not destino:
        return JSONResponse(status_code=400, content={"error": "Dato inválido"})
    if not cli:
        return JSONResponse(status_code=404, content={"error": "No encontramos una cuenta con ese dato. Pide tu alta de mayoreo."})
    if cli.get("tipo") == "menudeo":
        return JSONResponse(status_code=403, content={"error": "Tu cuenta es de menudeo. Entra desde zapatillasmay.mx"})
    if metodo == "correo" and not cli.get("email"):
        return JSONResponse(status_code=400, content={"error": "Tu cuenta no tiene correo registrado"})

    # Un código por destino cada OTP_COOLDOWN_SEG: sin esto cualquiera podía disparar WhatsApps/correos
    # de código sin parar al número de un cliente, y además adivinar el código con más intentos.
    ultimo = supabase_get(f"portal_otp?destino=eq.{_up.quote(destino, safe='')}&order=created_at.desc&limit=1&select=created_at") or []
    if ultimo:
        try:
            t0 = datetime.fromisoformat(str(ultimo[0]["created_at"]).replace("Z", "+00:00"))
            if (datetime.now(timezone.utc) - t0).total_seconds() < OTP_COOLDOWN_SEG:
                return JSONResponse(status_code=429, content={"error": "Ya te enviamos un código hace un momento. Espera un minuto para pedir otro."})
        except Exception:
            pass

    codigo = f"{secrets.randbelow(1000000):06d}"
    expira = (datetime.now(timezone.utc) + timedelta(minutes=OTP_EXP_MIN)).isoformat()
    supabase_post("portal_otp", {
        "cliente_id": cli["id"], "destino": destino, "canal": metodo,
        "codigo_hash": hash_password(codigo), "expira_at": expira,
    })
    if metodo == "telefono":
        enviado = _enviar_wa_codigo(destino, codigo)
        canal_txt = "WhatsApp"
    else:
        enviado = _enviar_email_codigo(cli.get("email"), cli.get("nombre"), codigo)
        canal_txt = "correo"
    return {"ok": True, "enviado": enviado, "metodo": metodo, "canal": canal_txt, "destino": _mask(destino, metodo)}


@router.post("/otp/verificar")
@limiter.limit("10/minute")
def otp_verificar(request: Request, datos: dict):
    metodo = datos.get("metodo")
    valor = datos.get("valor") or ""
    codigo = (datos.get("codigo") or "").strip()
    if metodo not in ("telefono", "correo") or not codigo:
        return JSONResponse(status_code=400, content={"error": "Faltan datos"})
    _cli, destino = _buscar_cliente_por(metodo, valor)
    if not destino:
        return JSONResponse(status_code=400, content={"error": "Dato inválido"})

    rows = supabase_get(f"portal_otp?destino=eq.{_up.quote(destino, safe='')}&usado=eq.false&order=created_at.desc&limit=1") or []
    if not rows:
        return JSONResponse(status_code=400, content={"error": "Solicita un código primero"})
    row = rows[0]
    try:
        exp = datetime.fromisoformat(str(row["expira_at"]).replace("Z", "+00:00"))
    except Exception:
        exp = None
    if exp and exp < datetime.now(timezone.utc):
        return JSONResponse(status_code=400, content={"error": "El código expiró, pide uno nuevo"})
    if (row.get("intentos") or 0) >= OTP_MAX_INTENTOS:
        return JSONResponse(status_code=400, content={"error": "Demasiados intentos, pide un código nuevo"})
    if not verify_password(codigo, row.get("codigo_hash", "")):
        supabase_patch(f"portal_otp?id=eq.{row['id']}", {"intentos": (row.get("intentos") or 0) + 1})
        return JSONResponse(status_code=401, content={"error": "Código incorrecto"})

    supabase_patch(f"portal_otp?id=eq.{row['id']}", {"usado": True})
    cli = (supabase_get(f"clientes?id=eq.{row['cliente_id']}&select=*") or [None])[0]
    if not cli:
        return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
    _validar_mayoreo(cli)
    return {"token": _emitir_token(None, cli), "cliente": _cliente_publico(cli)}


# ── DEMO (solo revisión; deshabilitado salvo PORTAL_DEMO=1) ───────────────────
@router.post("/demo-login")
def demo_login(datos: dict = None):
    """Emite un token de un cliente mayoreo real SOLO para revisar la interfaz.
    Desactivado por defecto; activar con la variable de entorno PORTAL_DEMO=1."""
    if os.environ.get("PORTAL_DEMO") != "1":
        return JSONResponse(status_code=403, content={"error": "Demo deshabilitado"})
    cli = supabase_get("clientes?tipo=in.(mayoreo,zapateria)&activo=eq.true&limit=1&select=*")
    if not cli:
        cli = supabase_get("clientes?limit=1&select=*")
    if not cli:
        return JSONResponse(status_code=404, content={"error": "Sin clientes"})
    c = cli[0]
    return {"token": _emitir_token(None, c), "cliente": _cliente_publico(c), "demo": True}


# ── DATOS DEL CLIENTE ─────────────────────────────────────────────────────────
@router.get("/me")
def me(auth: dict = Depends(require_cliente)):
    cli = supabase_get(f"clientes?id=eq.{auth['cliente_id']}&select=*")
    if not cli:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return _cliente_publico(cli[0])


# ── MIS PEDIDOS (solo del cliente del token) ──────────────────────────────────
@router.get("/pedidos")
def pedidos(auth: dict = Depends(require_cliente)):
    cid = auth["cliente_id"]
    return supabase_get(
        f"pedidos?cliente_id=eq.{cid}&order=created_at.desc"
        "&select=id,created_at,status,total,subtotal,numero_guia,paqueteria,tracking_url,enviado_at,"
        "pedido_items(cantidad,precio_unitario,nombre,color,talla,es_corrida,variantes(talla,color,productos(nombre,imagen_principal)))"
    )


# ── ENVIAR CARRITO → borrador del cliente (precios recalculados en el server) ──
@router.post("/carrito")
def enviar_carrito(datos: dict, auth: dict = Depends(require_cliente)):
    cliente_id = auth["cliente_id"]  # SIEMPRE del token, nunca del body
    items_in = datos.get("items") or []
    if not items_in:
        return JSONResponse(status_code=400, content={"error": "El carrito está vacío"})

    # Normalizar entrada del cliente (solo variante_id, cantidad, es_corrida son confiables)
    pedido_items = {}
    for it in items_in:
        vid = it.get("variante_id")
        cant = int(it.get("cantidad") or 0)
        if not vid or cant <= 0:
            continue
        es_corr = bool(it.get("es_corrida"))
        key = (vid, es_corr)
        pedido_items[key] = pedido_items.get(key, 0) + cant
    if not pedido_items:
        return JSONResponse(status_code=400, content={"error": "Sin artículos válidos"})

    # Traer variantes + productos para calcular precios reales (no confiar en el cliente)
    ids = [v for v in {vid for (vid, _) in pedido_items} if _UUID_RE.match(str(v))]
    if not ids:
        return JSONResponse(status_code=400, content={"error": "Sin artículos válidos"})
    in_clause = ",".join(ids)
    variantes = supabase_get(f"variantes?id=in.({in_clause})&select=id,producto_id,talla,color,foto_url")
    var_by_id = {v["id"]: v for v in (variantes or [])}
    prod_ids = list({v["producto_id"] for v in var_by_id.values()})
    productos = supabase_get(
        f"productos?id=in.({','.join(prod_ids)})&select=id,nombre,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida"
    ) if prod_ids else []
    prod_by_id = {p["id"]: p for p in (productos or [])}

    def precio_unit(prod, es_corr, sueltos):
        menudeo = _num(prod.get("precio_menudeo"))
        if es_corr:
            return _num(prod.get("precio_corrida")) or (menudeo - 100)
        if sueltos >= 6:
            return _num(prod.get("precio_mayoreo6")) or (menudeo - 70)
        if sueltos >= 3:
            return _num(prod.get("precio_mayoreo3")) or (menudeo - 30)
        return menudeo

    sueltos = sum(c for (vid, es_corr), c in pedido_items.items() if not es_corr)

    # Buscar borrador existente del cliente para fusionar (no duplicar)
    borradores = supabase_get(
        f"pedidos?cliente_id=eq.{cliente_id}&status=eq.borrador&order=created_at.desc&select=id,canal"
    ) or []
    existente = next((p for p in borradores if (not p.get("canal") or p.get("canal") in ("sucursal", "mayoreo"))), None)

    if existente:
        pedido_id = existente["id"]
    else:
        nuevo = supabase_post("pedidos", {
            "cliente_id": cliente_id, "canal": "mayoreo", "forma_pago": "efectivo",
            "total": 0, "subtotal": 0, "status": "borrador",
        })
        if not nuevo:
            return JSONResponse(status_code=500, content={"error": "No se pudo crear el carrito"})
        pedido_id = nuevo[0]["id"]

    # Items actuales del borrador (para fusionar)
    actuales = supabase_get(
        f"pedido_items?pedido_id=eq.{pedido_id}&select=id,variante_id,cantidad,es_corrida"
    ) or []

    for (vid, es_corr), cant in pedido_items.items():
        v = var_by_id.get(vid)
        if not v:
            continue
        prod = prod_by_id.get(v["producto_id"], {})
        pu = precio_unit(prod, es_corr, sueltos)
        ya = next((a for a in actuales if a["variante_id"] == vid and bool(a.get("es_corrida")) == es_corr), None)
        if ya:
            nueva = ya["cantidad"] + cant
            supabase_patch(f"pedido_items?id=eq.{ya['id']}", {
                "cantidad": nueva, "precio_unitario": pu, "subtotal": nueva * pu,
            })
            ya["cantidad"] = nueva
        else:
            supabase_post("pedido_items", {
                "pedido_id": pedido_id, "variante_id": vid, "cantidad": cant,
                "precio_unitario": pu, "subtotal": cant * pu,
                "nombre": prod.get("nombre", ""), "color": v.get("color", ""),
                "talla": v.get("talla", ""), "es_corrida": es_corr,
            })

    # Recalcular total del borrador con TODOS sus items
    finales = supabase_get(f"pedido_items?pedido_id=eq.{pedido_id}&select=cantidad,precio_unitario") or []
    total = sum(_num(i.get("cantidad")) * _num(i.get("precio_unitario")) for i in finales)
    supabase_patch(f"pedidos?id=eq.{pedido_id}", {"total": total, "subtotal": total})

    return {"ok": True, "pedido_id": pedido_id, "total": total, "fusionado": bool(existente)}


# ── MI REGISTRO DE VENTAS Y GASTOS (herramienta de la mayorista para llevar sus números) ──────────
_MAX_FILAS_REGISTRO = 5000


def require_cliente_portal(credentials: HTTPAuthorizationCredentials = Depends(_bearer)) -> dict:
    """Sesión de una clienta del portal. El portal entra por /auth/login (la misma sesión de la tienda), cuyo token trae
    cliente_id pero NO rol='cliente' (ese rol solo lo emite /portal/login): por eso aquí se acepta cualquier token con
    cliente_id que no sea de personal. El cliente_id sale SIEMPRE del token, nunca del cuerpo de la petición."""
    from security import es_personal
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticación requerida")
    payload = verify_token(credentials.credentials)
    if es_personal(payload) or not payload.get("cliente_id"):
        raise HTTPException(status_code=403, detail="Se requiere una sesión de cliente")
    return payload


def _fecha_registro(v):
    """Fecha ISO (AAAA-MM-DD) o hoy en horario de México."""
    if not v:
        return (datetime.now(timezone.utc) - timedelta(hours=6)).date().isoformat()
    try:
        return datetime.strptime(str(v)[:10], "%Y-%m-%d").date().isoformat()
    except ValueError:
        raise ValueError("Fecha inválida")


def _num_registro(v, nombre, maximo, minimo=0.0):
    try:
        n = float(v)
    except (TypeError, ValueError):
        raise ValueError(f"{nombre} inválido")
    if n < minimo or n > maximo:
        raise ValueError(f"{nombre} fuera de rango")
    return round(n, 2)


def _limpiar_registro(datos: dict, parcial: bool = False) -> dict:
    """Valida y normaliza una fila del registro. Lanza ValueError con un mensaje legible."""
    from security import limpiar_texto
    fila = {}
    tipo = datos.get("tipo")
    if not parcial or "tipo" in datos:
        if tipo not in ("venta", "gasto"):
            raise ValueError("Tipo inválido")
        fila["tipo"] = tipo
    if "fecha" in datos or not parcial:
        fila["fecha"] = _fecha_registro(datos.get("fecha"))
    if "concepto" in datos:
        fila["concepto"] = limpiar_texto(str(datos.get("concepto") or "").strip())[:120] or None
    if "notas" in datos:
        fila["notas"] = limpiar_texto(str(datos.get("notas") or "").strip())[:300] or None
    es_venta = (fila.get("tipo") or tipo) == "venta"
    if "variante_id" in datos:
        vid = datos.get("variante_id")
        if vid in (None, ""):
            fila["variante_id"] = None
        elif not es_venta:
            fila["variante_id"] = None       # un gasto no se liga a ningún par
        elif _UUID_RE.match(str(vid)):
            fila["variante_id"] = str(vid)   # liga la venta a un par que compró (para saber cuántos le quedan)
        else:
            raise ValueError("Par inválido")
    if not es_venta:
        fila["variante_id"] = None
    if es_venta:
        if "pares" in datos or not parcial:
            pares = _num_registro(datos.get("pares"), "Pares", 100000, 1)
            fila["pares"] = int(pares)
        if "precio_par" in datos or not parcial:
            fila["precio_par"] = _num_registro(datos.get("precio_par"), "Precio de venta", 1000000)
        if "costo_par" in datos or not parcial:
            fila["costo_par"] = _num_registro(datos.get("costo_par"), "Costo por par", 1000000)
        fila["monto"] = None
    else:
        if "monto" in datos or not parcial:
            fila["monto"] = _num_registro(datos.get("monto"), "Monto", 100000000, 0.01)
        fila["pares"] = None
        fila["precio_par"] = None
        fila["costo_par"] = None
    return fila


@router.get("/registro")
def registro_listar(desde: str = "", hasta: str = "", auth: dict = Depends(require_cliente_portal)):
    cid = auth["cliente_id"]
    try:
        filtro = f"mayorista_registro?cliente_id=eq.{cid}"
        if desde:
            filtro += f"&fecha=gte.{_fecha_registro(desde)}"
        if hasta:
            filtro += f"&fecha=lte.{_fecha_registro(hasta)}"
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    filas = supabase_get(filtro + "&order=fecha.desc,created_at.desc&limit=2000") or []
    return {"filas": filas}


@router.post("/registro")
def registro_crear(datos: dict, auth: dict = Depends(require_cliente_portal)):
    cid = auth["cliente_id"]
    try:
        fila = _limpiar_registro(datos)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    existentes = supabase_get(f"mayorista_registro?cliente_id=eq.{cid}&select=id&limit={_MAX_FILAS_REGISTRO}") or []
    if len(existentes) >= _MAX_FILAS_REGISTRO:
        return JSONResponse(status_code=400, content={"error": "Llegaste al límite de movimientos guardados"})
    fila["cliente_id"] = cid
    res = supabase_post("mayorista_registro", fila)
    return {"ok": True, "fila": res[0] if isinstance(res, list) and res else None}


@router.patch("/registro/{fila_id}")
def registro_editar(fila_id: str, datos: dict, auth: dict = Depends(require_cliente_portal)):
    cid = auth["cliente_id"]
    if not _UUID_RE.match(fila_id):
        return JSONResponse(status_code=400, content={"error": "Id inválido"})
    actual = supabase_get(f"mayorista_registro?id=eq.{fila_id}&cliente_id=eq.{cid}&select=id,tipo")
    if not actual:
        return JSONResponse(status_code=404, content={"error": "No encontrado"})
    datos = dict(datos, tipo=actual[0]["tipo"])   # el tipo no cambia al editar
    try:
        fila = _limpiar_registro(datos, parcial=True)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    fila.pop("tipo", None)
    supabase_patch(f"mayorista_registro?id=eq.{fila_id}&cliente_id=eq.{cid}", fila)
    return {"ok": True}


@router.delete("/registro/{fila_id}")
def registro_borrar(fila_id: str, auth: dict = Depends(require_cliente_portal)):
    cid = auth["cliente_id"]
    if not _UUID_RE.match(fila_id):
        return JSONResponse(status_code=400, content={"error": "Id inválido"})
    supabase_delete(f"mayorista_registro?id=eq.{fila_id}&cliente_id=eq.{cid}")
    return {"ok": True}


# ── COMPROBANTES DE PAGO que sube la clienta (captura de transferencia, foto del ticket, PDF) ─────────────────
# Quedan ligados a su pedido, sin revisar, y el panel avisa al equipo. El cliente_id sale SIEMPRE del token.
_MAX_COMPROBANTES_PEDIDO = 12


def _pedido_de_la_clienta(pedido_id: str, cid: str):
    if not _UUID_RE.match(pedido_id):
        return None
    f = supabase_get(f"pedidos?id=eq.{pedido_id}&cliente_id=eq.{cid}&select=id,status,total")
    return f[0] if f else None


@router.get("/pedidos/{pedido_id}/comprobantes")
def comprobantes_de_mi_pedido(pedido_id: str, auth: dict = Depends(require_cliente_portal)):
    if not _pedido_de_la_clienta(pedido_id, auth["cliente_id"]):
        return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
    filas = supabase_get(f"pedido_comprobantes?pedido_id=eq.{pedido_id}&select=id,url,nombre,tipo,monto,nota,origen,revisado,created_at&order=created_at.asc") or []
    return {"comprobantes": filas}


@router.post("/pedidos/{pedido_id}/comprobantes")
def subir_mi_comprobante(pedido_id: str, archivo: UploadFile = File(...), monto: str = Form(""), nota: str = Form(""),
                         auth: dict = Depends(require_cliente_portal)):
    from security import limpiar_texto
    cid = auth["cliente_id"]
    ped = _pedido_de_la_clienta(pedido_id, cid)
    if not ped:
        return JSONResponse(status_code=404, content={"error": "Pedido no encontrado"})
    if ped.get("status") == "cancelado":
        return JSONResponse(status_code=409, content={"error": "Este pedido está cancelado"})
    previos = supabase_get(f"pedido_comprobantes?pedido_id=eq.{pedido_id}&select=id&limit={_MAX_COMPROBANTES_PEDIDO + 1}") or []
    if len(previos) >= _MAX_COMPROBANTES_PEDIDO:
        return JSONResponse(status_code=400, content={"error": "Ya subiste el máximo de comprobantes para este pedido. Escríbenos por WhatsApp."})
    from routers.imagenes import subir_comprobante
    try:
        sub = subir_comprobante(archivo)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    except Exception as e:
        print(f"[portal] comprobante: {e}")
        return JSONResponse(status_code=500, content={"error": "No se pudo subir el archivo. Intenta de nuevo."})
    try:
        m = round(float(monto), 2) if str(monto).strip() else None
        if m is not None and (m <= 0 or m > 100000000):
            m = None
    except ValueError:
        m = None
    fila = {"pedido_id": pedido_id, "url": sub["url"], "nombre": sub["nombre"], "tipo": sub["tipo"], "monto": m,
            "nota": (limpiar_texto(nota.strip())[:200] or None), "origen": "portal", "subido_por": "Clienta (portal)", "revisado": False}
    res = supabase_post("pedido_comprobantes", fila)
    try:
        cli = supabase_get(f"clientes?id=eq.{cid}&select=nombre") or [{}]
        from routers.push import enviar_push
        enviar_push("📎 Comprobante de pago nuevo", f"{cli[0].get('nombre') or 'Una clienta'} subió un comprobante" + (f" de ${m:,.0f}" if m else "") + ". Revisa Carritos.",
                    url="/?modulo=carritos", sitio="panel")
    except Exception as e:
        print(f"[portal] aviso de comprobante: {e}")
    return {"ok": True, "comprobante": res[0] if isinstance(res, list) and res else None}
