"""
Portal de cliente mayoreo — endpoints SEGUROS y aislados.

Diseño:
- Login (correo / Google) que emite un JWT con `rol: cliente` + `cliente_id`.
- Todos los endpoints de datos validan ese token y SOLO devuelven/escriben datos
  del `cliente_id` del token (nunca de un id que venga en el body/URL).
- No modifica los endpoints existentes del panel/tienda; vive bajo el prefijo /portal.
- Menudeo no entra (usan el sitio web).
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import supabase_get, supabase_post, supabase_patch
from security import verify_password, hash_password, create_token, verify_token, limiter
import os
import re
import json
import secrets
import urllib.request
from datetime import datetime, timedelta, timezone

try:
    import resend
    resend.api_key = os.getenv("RESEND_API_KEY")
except Exception:
    resend = None

router = APIRouter(prefix="/portal", tags=["Portal Cliente"])
_bearer = HTTPBearer(auto_error=False)

OTP_EXP_MIN = 10
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
    })


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
async def login(request: Request, datos: dict):
    email = (datos.get("email") or "").strip().lower()
    password = datos.get("password") or ""
    if not email or not password:
        return JSONResponse(status_code=400, content={"error": "Correo y contraseña requeridos"})

    usuarios = supabase_get(
        f"usuarios?email=eq.{email}&activo=eq.true&select=id,nombre,email,cliente_id,password_hash"
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
def login_google(datos: dict):
    id_token = (datos.get("id_token") or "").strip()
    if not id_token:
        return JSONResponse(status_code=400, content={"error": "Token requerido"})
    try:
        req = urllib.request.Request(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}",
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
    if client_id_env and info.get("aud") != client_id_env:
        return JSONResponse(status_code=401, content={"error": "Token no corresponde a esta aplicación"})

    cli = supabase_get(f"clientes?email=eq.{email}&select=*")
    if not cli:
        return JSONResponse(status_code=403, content={"error": "No encontramos una cuenta de cliente con ese correo. Pide tu alta de mayoreo."})
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
        clientes = supabase_get("clientes?activo=eq.true&select=id,nombre,telefono,email,tipo") or []
        return next((c for c in clientes if _norm_tel(c.get("telefono")) == tel), None), tel
    email = (valor or "").strip().lower()
    if "@" not in email:
        return None, None
    cli = (supabase_get(f"clientes?email=eq.{email}&select=id,nombre,telefono,email,tipo") or [None])[0]
    return cli, email


def _enviar_sms_codigo(tel10: str, codigo: str) -> bool:
    """Envío del código por SMS. NO usa la API de WhatsApp.
    Pendiente de proveedor SMS (Twilio/Labsmobile/etc.); cuando se configure
    se integra aquí. Por ahora devuelve False (no se envía)."""
    print(f"[portal otp sms] proveedor SMS no configurado; código para {tel10} no enviado")
    return False


def _enviar_email_codigo(email: str, nombre: str, codigo: str) -> bool:
    if not resend:
        return False
    try:
        resend.Emails.send({
            "from": "Zapatillas May <noreply@zapatillasmay.mx>",
            "to": email,
            "subject": f"Tu código de acceso: {codigo}",
            "html": f"""
            <div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:28px">
              <h2 style="color:#0A0A0A">Hola {nombre or ''} 👋</h2>
              <p style="color:#555">Tu código para entrar al portal de mayoreo:</p>
              <p style="font-size:2rem;font-weight:800;letter-spacing:6px;color:#E91E8C;margin:18px 0">{codigo}</p>
              <p style="color:#aaa;font-size:.8rem">Vence en {OTP_EXP_MIN} minutos. Si no fuiste tú, ignora este correo.</p>
            </div>"""
        })
        return True
    except Exception as e:
        print(f"[portal otp email] {e}")
        return False


@router.post("/otp/solicitar")
@limiter.limit("5/minute")
async def otp_solicitar(request: Request, datos: dict):
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
async def otp_verificar(request: Request, datos: dict):
    metodo = datos.get("metodo")
    valor = datos.get("valor") or ""
    codigo = (datos.get("codigo") or "").strip()
    if metodo not in ("telefono", "correo") or not codigo:
        return JSONResponse(status_code=400, content={"error": "Faltan datos"})
    _cli, destino = _buscar_cliente_por(metodo, valor)
    if not destino:
        return JSONResponse(status_code=400, content={"error": "Dato inválido"})

    rows = supabase_get(f"portal_otp?destino=eq.{destino}&usado=eq.false&order=created_at.desc&limit=1") or []
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
    ids = list({vid for (vid, _) in pedido_items})
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
