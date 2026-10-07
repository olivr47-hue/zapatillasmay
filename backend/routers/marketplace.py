"""Marketplace: otros vendedores publican sus productos en zapatillas-may y el negocio cobra todo y gana una comisión por par.

Diseño (decisiones del dueño): el negocio cobra con su MercadoPago. El vendedor da de alta su precio de menudeo y su precio por 3+ pares (LO QUE QUIERE
RECIBIR por par, como en el panel del negocio); al público se le cobra eso + la ganancia del negocio ($20 por par por defecto) + la comisión de MercadoPago
(el vendedor no paga comisión). El carrito es UNO para el negocio y todas las tiendas: los pares se acumulan para el descuento de 3+ (cada quien financia el suyo)
y el subtotal se acumula para el envío gratis desde $1,299. Si el pedido es de 3+ pares y de 2 o más orígenes, lo recibe el negocio (los vendedores se lo traen) y
envía todo junto. Cuando el envío sale gratis en un pedido cruzado, su costo se reparte entre quienes participan, en proporción a lo que vende cada uno. El negocio liquida por lote.
Los productos, pedidos y dinero del marketplace viven en tablas propias (mp_*): no se mezclan con productos/inventario/pedidos/finanzas del negocio.

Hay dos grupos de rutas:
  /vendedor/*     cuentas de vendedor (registro, login, sus productos, pedidos, saldo). Token propio {tipo:'vendedor'}, SIN 'rol' (no es personal).
  /marketplace/*  público (catálogo, checkout) y admin (require_admin: aprobar vendedores/productos, pedidos, liquidaciones).
"""
import os
import re
import math
import uuid
import secrets
import hashlib
import datetime as _dt
import html as _html
import unicodedata
import urllib.parse as _up

from fastapi import APIRouter, Request, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials

from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete, supabase_rpc
from security import (hash_password, verify_password, create_token, verify_token, limiter, bearer_opcional,
                      require_admin, limpiar_texto)
from cache import cache_get, cache_set, cache_invalidate_prefix

router_vendedor = APIRouter(prefix="/vendedor", tags=["Vendedor"])
router = APIRouter(prefix="/marketplace", tags=["Marketplace"])

COMISION_POR_PAR = 20.0
CATEGORIAS = ("tacones", "botines", "botas", "sandalias", "flats", "plataformas", "tenis", "otros")
_ESTADOS_PRODUCTO = ("borrador", "pendiente", "publicado", "rechazado", "pausado")
_EXP_TOKEN_HORAS = 24 * 7
_EMAIL_RX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")
_FRONT = os.getenv("FRONTEND_URL", "https://zapatillasmay.mx")


# ───────────────────────── utilidades ─────────────────────────
def _q(v) -> str:
    return _up.quote(str(v), safe="")


def _txt(v, largo: int = 200) -> str:
    """Texto que viene del público: sin '<' '>' ni comillas dobles y recortado."""
    return limpiar_texto(str(v or "").strip(), comillas=True)[:largo]


def _num(v, minimo=None, maximo=None, default=None):
    try:
        n = float(v)
    except (TypeError, ValueError):
        return default
    if minimo is not None and n < minimo:
        return default
    if maximo is not None and n > maximo:
        return default
    return n


def _slug(texto: str) -> str:
    s = unicodedata.normalize("NFKD", str(texto or "")).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:60] or "producto"


def _slug_unico(tabla: str, base: str) -> str:
    base = _slug(base)
    cand = base
    for i in range(0, 30):
        if i:
            cand = f"{base}-{secrets.token_hex(2)}"
        if not supabase_get(f"{tabla}?slug=eq.{_q(cand)}&select=id&limit=1"):
            return cand
    return f"{base}-{secrets.token_hex(4)}"


def _ahora() -> str:
    return _dt.datetime.now(_dt.timezone.utc).isoformat()


def _talla_key(t) -> tuple:
    """Orden de tallas: numéricas de menor a mayor (23, 23.5, 24...), el resto al final."""
    try:
        return (float(re.sub(r"[^\d.]", "", str(t)) or "x"), str(t))
    except ValueError:
        return (999.0, str(t))


def _publicas_img(urls) -> list:
    """Solo URLs https de Cloudinary (las que genera nuestra subida de fotos): evita enlazar imágenes arbitrarias."""
    out = []
    for u in (urls or [])[:8]:
        u = str(u or "").strip()
        if u.startswith("https://res.cloudinary.com/") and len(u) < 500 and '"' not in u and "<" not in u:
            out.append(u)
    return out


def _vendedor_publico(v: dict) -> dict:
    return {k: v.get(k) for k in ("id", "email", "nombre_tienda", "slug", "nombre_contacto", "telefono", "ciudad", "estado_region", "descripcion",
                                  "banco", "clabe", "titular", "comision_por_par", "estado", "created_at")}


def _avisar_negocio(titulo: str, cuerpo: str, url: str = "/?modulo=marketplace"):
    try:
        from routers.push import enviar_push
        enviar_push(titulo, cuerpo, url=url, sitio="panel")
    except Exception as e:
        print(f"[marketplace] push: {e}")


def _enviar(to: str, asunto: str, contenido: str, tipo: str):
    try:
        from email_utils import enviar_email, _base_html
        enviar_email(to, asunto, _base_html(contenido, asunto), tipo=tipo)
    except Exception as e:
        print(f"[marketplace] correo {tipo}: {e}")


# ───────────────────────── autenticación de vendedores ─────────────────────────
def _token_vendedor(v: dict) -> str:
    # Sin 'rol': para el resto del sistema este token NO es de personal ni de cliente.
    return create_token({"sub": v["id"], "tipo": "vendedor", "vendedor": True, "email": v["email"]}, expires_hours=_EXP_TOKEN_HORAS)


def require_vendedor(credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Inicia sesión")
    payload = verify_token(credentials.credentials)
    if not payload.get("vendedor") or payload.get("rol"):
        raise HTTPException(status_code=403, detail="Se requiere una cuenta de vendedor")
    filas = supabase_get(f"mp_vendedores?id=eq.{_q(payload.get('sub'))}&select=*&limit=1") or []
    if not filas:
        raise HTTPException(status_code=401, detail="Cuenta no encontrada")
    v = filas[0]
    if v.get("estado") == "suspendido":
        raise HTTPException(status_code=403, detail="Tu cuenta está suspendida. Escríbenos por WhatsApp.")
    return v


@router_vendedor.post("/registro")
@limiter.limit("5/minute")
def registro_vendedor(request: Request, datos: dict):
    """Solicitud de cuenta de vendedor. Queda 'pendiente' hasta que el negocio la aprueba."""
    if datos.get("sitio_web"):   # campo trampa para bots: los humanos no lo ven
        return {"ok": True, "mensaje": "Recibimos tu solicitud."}
    try:
        nombre_tienda = _txt(datos.get("nombre_tienda"), 80)
        email = str(datos.get("email") or "").strip().lower()[:120]
        password = str(datos.get("password") or "")
        if len(nombre_tienda) < 3:
            return JSONResponse(status_code=400, content={"error": "Escribe el nombre de tu tienda (mínimo 3 letras)."})
        if not _EMAIL_RX.match(email):
            return JSONResponse(status_code=400, content={"error": "Escribe un correo válido."})
        if len(password) < 8:
            return JSONResponse(status_code=400, content={"error": "La contraseña debe tener al menos 8 caracteres."})
        if not datos.get("acepta"):
            return JSONResponse(status_code=400, content={"error": "Debes aceptar las condiciones para vender."})
        tel = re.sub(r"\D", "", str(datos.get("telefono") or ""))[-10:]
        if len(tel) != 10:
            return JSONResponse(status_code=400, content={"error": "Escribe tu WhatsApp a 10 dígitos."})
        existe = supabase_get(f"mp_vendedores?email=ilike.{_q(email)}&select=id,email&limit=5") or []
        if any((x.get("email") or "").lower() == email for x in existe):
            return JSONResponse(status_code=400, content={"error": "Ya hay una cuenta con ese correo. Inicia sesión."})
        v = supabase_post("mp_vendedores", {
            "email": email, "password_hash": hash_password(password), "nombre_tienda": nombre_tienda,
            "slug": _slug_unico("mp_vendedores", nombre_tienda), "nombre_contacto": _txt(datos.get("nombre_contacto"), 80),
            "telefono": tel, "ciudad": _txt(datos.get("ciudad"), 60), "estado_region": _txt(datos.get("estado_region"), 60),
            "descripcion": _txt(datos.get("descripcion"), 400), "comision_por_par": COMISION_POR_PAR, "estado": "pendiente",
        })[0]
        _avisar_negocio("🛍️ Nueva solicitud de vendedor", f"{nombre_tienda} ({v.get('ciudad') or 's/ciudad'}) quiere vender en el marketplace.")
        _enviar(email, "Recibimos tu solicitud — Zapatillas May Marketplace",
                f"<h2 style='margin:0 0 10px;color:#2A1A0E'>¡Gracias por querer vender con nosotros!</h2>"
                f"<p style='color:#555;line-height:1.6'>Recibimos la solicitud de <b>{_html.escape(nombre_tienda)}</b>. La revisamos y te avisamos por correo "
                f"y WhatsApp cuando tu cuenta esté activa. Mientras tanto ya puedes entrar, preparar tus productos y fotos.</p>"
                "", "marketplace_registro")
        return {"ok": True, "mensaje": "Recibimos tu solicitud. Ya puedes iniciar sesión y preparar tus productos; los publicamos cuando aprobemos tu cuenta."}
    except Exception as e:
        print(f"[marketplace/registro] {e}")
        return JSONResponse(status_code=500, content={"error": "No se pudo registrar. Intenta de nuevo."})


@router_vendedor.post("/login")
@limiter.limit("10/minute")
def login_vendedor(request: Request, datos: dict):
    email = str(datos.get("email") or "").strip().lower()
    password = str(datos.get("password") or "")
    malo = JSONResponse(status_code=401, content={"error": "Correo o contraseña incorrectos."})
    if not email or not password:
        return malo
    filas = [x for x in (supabase_get(f"mp_vendedores?email=ilike.{_q(email)}&select=*&limit=5") or []) if (x.get("email") or "").lower() == email]
    if not filas or not verify_password(password, filas[0].get("password_hash", "")):
        return malo
    v = filas[0]
    if v.get("estado") == "suspendido":
        return JSONResponse(status_code=403, content={"error": "Tu cuenta está suspendida. Escríbenos por WhatsApp."})
    try:
        supabase_patch(f"mp_vendedores?id=eq.{v['id']}", {"ultimo_login": _ahora()})
    except Exception:
        pass
    return {"token": _token_vendedor(v), "vendedor": _vendedor_publico(v)}


@router_vendedor.post("/recuperar")
@limiter.limit("3/minute")
def recuperar_vendedor(request: Request, datos: dict):
    resp = {"ok": True, "mensaje": "Si existe una cuenta con ese correo, recibirás las instrucciones."}
    email = str(datos.get("email") or "").strip().lower()
    if not email:
        return JSONResponse(status_code=400, content={"error": "Escribe tu correo."})
    filas = [x for x in (supabase_get(f"mp_vendedores?email=ilike.{_q(email)}&select=id,email,nombre_tienda&limit=5") or []) if (x.get("email") or "").lower() == email]
    if not filas:
        return resp
    v = filas[0]
    token = secrets.token_urlsafe(32)
    exp = int((_dt.datetime.now(_dt.timezone.utc) + _dt.timedelta(hours=1)).timestamp())
    supabase_patch(f"mp_vendedores?id=eq.{v['id']}", {"reset_token_hash": hashlib.sha256(token.encode()).hexdigest(), "reset_token_exp": exp})
    enlace = f"{_FRONT}/vendedor?reset={token}"
    from email_utils import _boton
    _enviar(v["email"], "Restablece tu contraseña — Zapatillas May Marketplace",
            f"<h2 style='margin:0 0 10px;color:#2A1A0E'>Hola, {_html.escape(v.get('nombre_tienda') or '')}</h2>"
            f"<p style='color:#555;line-height:1.6'>Toca el botón para elegir una contraseña nueva. Funciona una sola vez y vence en 1 hora. "
            f"Si no lo pediste tú, ignora este correo.</p>{_boton('Elegir nueva contraseña', enlace)}", "marketplace_recuperar")
    return resp


@router_vendedor.post("/restablecer")
@limiter.limit("10/minute")
def restablecer_vendedor(request: Request, datos: dict):
    token = str(datos.get("token") or "").strip()
    nueva = str(datos.get("password_nueva") or "")
    if len(token) < 20:
        return JSONResponse(status_code=400, content={"error": "El enlace no es válido. Pide uno nuevo."})
    if len(nueva) < 8:
        return JSONResponse(status_code=400, content={"error": "La contraseña debe tener al menos 8 caracteres."})
    h = hashlib.sha256(token.encode()).hexdigest()
    filas = supabase_get(f"mp_vendedores?reset_token_hash=eq.{h}&select=id,reset_token_exp&limit=1") or []
    malo = JSONResponse(status_code=400, content={"error": "El enlace venció o ya se usó. Pide uno nuevo."})
    if not filas or int(filas[0].get("reset_token_exp") or 0) < _dt.datetime.now(_dt.timezone.utc).timestamp():
        return malo
    # se gasta el token de forma atómica: solo una petición puede usarlo
    ok = supabase_patch(f"mp_vendedores?id=eq.{filas[0]['id']}&reset_token_hash=eq.{h}",
                        {"password_hash": hash_password(nueva), "reset_token_hash": None, "reset_token_exp": None})
    if not ok:
        return malo
    return {"ok": True, "mensaje": "Listo. Ya puedes iniciar sesión con tu nueva contraseña."}


@router_vendedor.get("/yo")
def yo(v=Depends(require_vendedor)):
    return _vendedor_publico(v)


@router_vendedor.patch("/yo")
def actualizar_yo(datos: dict, v=Depends(require_vendedor)):
    cambios = {}
    for campo, largo in (("nombre_contacto", 80), ("ciudad", 60), ("estado_region", 60), ("descripcion", 400), ("banco", 60), ("titular", 100)):
        if campo in datos:
            cambios[campo] = _txt(datos.get(campo), largo)
    if "telefono" in datos:
        tel = re.sub(r"\D", "", str(datos.get("telefono") or ""))[-10:]
        if len(tel) != 10:
            return JSONResponse(status_code=400, content={"error": "Escribe tu WhatsApp a 10 dígitos."})
        cambios["telefono"] = tel
    if "clabe" in datos:
        clabe = re.sub(r"\D", "", str(datos.get("clabe") or ""))
        if clabe and len(clabe) != 18:
            return JSONResponse(status_code=400, content={"error": "La CLABE debe tener 18 dígitos."})
        cambios["clabe"] = clabe
    if datos.get("password_nueva"):
        if not verify_password(str(datos.get("password_actual") or ""), v.get("password_hash", "")):
            return JSONResponse(status_code=400, content={"error": "Tu contraseña actual no es correcta."})
        if len(str(datos["password_nueva"])) < 8:
            return JSONResponse(status_code=400, content={"error": "La contraseña nueva debe tener al menos 8 caracteres."})
        cambios["password_hash"] = hash_password(str(datos["password_nueva"]))
    if cambios:
        supabase_patch(f"mp_vendedores?id=eq.{v['id']}", cambios)
        v = supabase_get(f"mp_vendedores?id=eq.{v['id']}&select=*")[0]
    return _vendedor_publico(v)


# ───────────────────────── productos del vendedor ─────────────────────────
def _variantes_validas(lista) -> list:
    out, vistos = [], set()
    for x in (lista or [])[:80]:
        if not isinstance(x, dict):
            continue
        color = _txt(x.get("color"), 30)
        talla = _txt(x.get("talla"), 8)
        stock = _num(x.get("stock"), 0, 999, None)
        if not talla or stock is None or (color, talla) in vistos:
            continue
        vistos.add((color, talla))
        out.append({"color": color, "talla": talla, "stock": int(stock)})
    return out


def _validar_producto(datos: dict, parcial: bool = False):
    """Devuelve (campos, error). En modo parcial solo valida lo que viene."""
    c = {}
    if not parcial or "nombre" in datos:
        n = _txt(datos.get("nombre"), 120)
        if len(n) < 3:
            return None, "Escribe el nombre del producto (mínimo 3 letras)."
        c["nombre"] = n
    if not parcial or "precio" in datos:
        p = _num(datos.get("precio"), 50, 20000)
        if p is None:
            return None, "El precio de menudeo debe estar entre $50 y $20,000."
        c["precio"] = round(p, 2)
    if not parcial or "precio_mayoreo3" in datos:
        crudo = datos.get("precio_mayoreo3")
        if crudo in (None, ""):
            c["precio_mayoreo3"] = None   # sin descuento por 3+ pares: se usa el de menudeo
        else:
            m3 = _num(crudo, 50, 20000)
            if m3 is None:
                return None, "El precio por 3+ pares debe estar entre $50 y $20,000."
            precio_ref = c.get("precio") if "precio" in c else _num(datos.get("precio"), 50, 20000)
            if precio_ref is not None and m3 > precio_ref:
                return None, "El precio por 3+ pares no puede ser mayor al de menudeo."
            c["precio_mayoreo3"] = round(m3, 2)
    if not parcial or "envio" in datos:
        e = _num(datos.get("envio", 150), 0, 1500)
        if e is None:
            return None, "El envío debe estar entre $0 y $1,500."
        c["envio"] = round(e, 2)
    if "descripcion" in datos:
        c["descripcion"] = _txt(datos.get("descripcion"), 1500)
    if "categoria" in datos:
        cat = str(datos.get("categoria") or "").lower()
        c["categoria"] = cat if cat in CATEGORIAS else "otros"
    if "material" in datos:
        c["material"] = _txt(datos.get("material"), 60)
    if "peso_gramos" in datos:
        pg = _num(datos.get("peso_gramos"), 50, 5000, None)
        c["peso_gramos"] = int(pg) if pg else None
    if "imagenes" in datos:
        c["imagenes"] = _publicas_img(datos.get("imagenes"))
        if datos.get("imagenes") and not c["imagenes"]:
            return None, "Las fotos deben subirse desde tu panel (JPG, PNG o WEBP)."
    return c, None


def _producto_con_variantes(pid: str, vendedor_id: str):
    filas = supabase_get(f"mp_productos?id=eq.{_q(pid)}&vendedor_id=eq.{vendedor_id}&select=*,mp_variantes(*)&limit=1") or []
    return filas[0] if filas else None


def _sincronizar_variantes(producto_id: str, nuevas: list):
    actuales = supabase_get(f"mp_variantes?producto_id=eq.{producto_id}&select=id,color,talla") or []
    por_clave = {(a["color"], a["talla"]): a["id"] for a in actuales}
    claves_nuevas = {(n["color"], n["talla"]) for n in nuevas}
    for (col, tal), vid in por_clave.items():
        if (col, tal) not in claves_nuevas:
            supabase_delete(f"mp_variantes?id=eq.{vid}")
    for n in nuevas:
        vid = por_clave.get((n["color"], n["talla"]))
        if vid:
            supabase_patch(f"mp_variantes?id=eq.{vid}", {"stock": n["stock"]})
        else:
            supabase_post("mp_variantes", {"producto_id": producto_id, **n})
    cache_invalidate_prefix("mp_")


@router_vendedor.get("/productos")
def mis_productos(v=Depends(require_vendedor)):
    return supabase_get(f"mp_productos?vendedor_id=eq.{v['id']}&select=*,mp_variantes(*)&order=created_at.desc") or []


@router_vendedor.post("/productos")
@limiter.limit("30/minute")
def crear_producto(request: Request, datos: dict, v=Depends(require_vendedor)):
    c, err = _validar_producto(datos)
    if err:
        return JSONResponse(status_code=400, content={"error": err})
    vars_ = _variantes_validas(datos.get("variantes"))
    if not vars_:
        return JSONResponse(status_code=400, content={"error": "Agrega al menos una talla con su existencia."})
    if len(supabase_get(f"mp_productos?vendedor_id=eq.{v['id']}&select=id&limit=300") or []) >= 300:
        return JSONResponse(status_code=400, content={"error": "Llegaste al máximo de productos por cuenta."})
    p = supabase_post("mp_productos", {**c, "vendedor_id": v["id"], "slug": _slug_unico("mp_productos", c["nombre"]), "estado": "borrador"})[0]
    _sincronizar_variantes(p["id"], vars_)
    return _producto_con_variantes(p["id"], v["id"])


@router_vendedor.patch("/productos/{pid}")
def editar_producto(pid: str, datos: dict, v=Depends(require_vendedor)):
    p = _producto_con_variantes(pid, v["id"])
    if not p:
        return JSONResponse(status_code=404, content={"error": "Producto no encontrado."})
    c, err = _validar_producto(datos, parcial=True)
    if err:
        return JSONResponse(status_code=400, content={"error": err})
    reaprobar = False
    if "variantes" in datos:
        vars_ = _variantes_validas(datos.get("variantes"))
        if not vars_:
            return JSONResponse(status_code=400, content={"error": "Agrega al menos una talla con su existencia."})
        _sincronizar_variantes(pid, vars_)
    # lo que cambia lo que la clienta ve (nombre, descripción, fotos, categoría, material) vuelve a revisión; precio, envío y existencias no
    for k in ("nombre", "descripcion", "categoria", "material", "imagenes"):
        if k in c and c[k] != p.get(k):
            reaprobar = True
    if c:
        c["updated_at"] = _ahora()
        if reaprobar and p.get("estado") == "publicado":
            c["estado"] = "pendiente"
        supabase_patch(f"mp_productos?id=eq.{pid}", c)
    cache_invalidate_prefix("mp_")
    return _producto_con_variantes(pid, v["id"])


@router_vendedor.post("/productos/{pid}/estado")
def cambiar_estado_producto(pid: str, datos: dict, v=Depends(require_vendedor)):
    """El vendedor puede: mandar a revisión (borrador/rechazado → pendiente), pausar (publicado → pausado) y reanudar (pausado → publicado)."""
    p = _producto_con_variantes(pid, v["id"])
    if not p:
        return JSONResponse(status_code=404, content={"error": "Producto no encontrado."})
    nuevo, actual = str(datos.get("estado") or ""), p.get("estado")
    if nuevo == "pendiente" and actual in ("borrador", "rechazado"):
        if not (p.get("imagenes") or []):
            return JSONResponse(status_code=400, content={"error": "Sube al menos una foto antes de mandarlo a revisión."})
        if not any((x.get("stock") or 0) > 0 for x in (p.get("mp_variantes") or [])):
            return JSONResponse(status_code=400, content={"error": "Ponle existencia a al menos una talla."})
        supabase_patch(f"mp_productos?id=eq.{pid}", {"estado": "pendiente", "motivo_rechazo": None, "updated_at": _ahora()})
        _avisar_negocio("🛍️ Producto por aprobar", f"{v['nombre_tienda']}: {p['nombre']}")
    elif nuevo == "pausado" and actual == "publicado":
        supabase_patch(f"mp_productos?id=eq.{pid}", {"estado": "pausado", "updated_at": _ahora()})
    elif nuevo == "publicado" and actual == "pausado":
        supabase_patch(f"mp_productos?id=eq.{pid}", {"estado": "publicado", "updated_at": _ahora()})
    else:
        return JSONResponse(status_code=400, content={"error": "Ese cambio no está permitido."})
    cache_invalidate_prefix("mp_")
    return _producto_con_variantes(pid, v["id"])


@router_vendedor.delete("/productos/{pid}")
def borrar_producto(pid: str, v=Depends(require_vendedor)):
    p = _producto_con_variantes(pid, v["id"])
    if not p:
        return JSONResponse(status_code=404, content={"error": "Producto no encontrado."})
    if p.get("estado") in ("publicado", "pendiente"):
        return JSONResponse(status_code=400, content={"error": "Pausa el producto antes de borrarlo."})
    supabase_delete(f"mp_productos?id=eq.{pid}")
    cache_invalidate_prefix("mp_")
    return {"ok": True}


@router_vendedor.post("/subir-foto")
@limiter.limit("40/minute")
def subir_foto(request: Request, archivo: UploadFile = File(...), v=Depends(require_vendedor)):
    """Foto de producto a Cloudinary (carpeta del vendedor). Solo imágenes, máximo 6 MB."""
    ct = (archivo.content_type or "").lower()
    if ct not in ("image/jpeg", "image/png", "image/webp"):
        return JSONResponse(status_code=400, content={"error": "Sube una foto JPG, PNG o WEBP."})
    contenido = archivo.file.read(6 * 1024 * 1024 + 1)
    if len(contenido) > 6 * 1024 * 1024:
        return JSONResponse(status_code=400, content={"error": "La foto pesa más de 6 MB."})
    try:
        from storage import subir_imagen
        r = subir_imagen(contenido, f"marketplace/{v['id']}")
        return {"url": r["url"]}
    except Exception as e:
        print(f"[marketplace/subir-foto] {e}")
        return JSONResponse(status_code=500, content={"error": "No se pudo subir la foto. Intenta de nuevo."})


# ───────────────────────── precios ─────────────────────────
# El vendedor da de alta LO QUE QUIERE RECIBIR por par. El precio al público = ese precio + la ganancia del negocio (por defecto $20 por par)
# + la comisión de MercadoPago (porcentaje + cuota fija + IVA sobre ambas), de modo que al negocio le queden sus $20 netos y al vendedor su precio.
_ESTADOS_PAGADOS = ("pagado", "recibido", "enviado", "entregado")
_ESTADOS_LIQUIDABLES = ("recibido", "enviado", "entregado")   # el vendedor ya cumplió (envió, o el negocio recibió sus pares)
HORAS_PAGO_RECIBIDO = 24   # los pares que recibe el negocio se pagan 24 horas después de recibirlos (lo dice la página /vender)


def _liquidable(p: dict) -> bool:
    """¿Ya se le puede liquidar este pedido al vendedor? Enviado/entregado: sí. Recibido por el negocio: 24 horas después de recibirlo."""
    if p.get("liquidacion_id"):
        return False
    if p.get("status") in ("enviado", "entregado"):
        return True
    if p.get("status") == "recibido":
        try:
            t = _dt.datetime.fromisoformat(str(p.get("recibido_at")).replace("Z", "+00:00"))
            return _dt.datetime.now(_dt.timezone.utc) - t >= _dt.timedelta(hours=HORAS_PAGO_RECIBIDO)
        except Exception:
            return False
    return False


def _cfg_precios() -> dict:
    """Comisión de MercadoPago usada para calcular el precio al público (se ajusta en el panel: Marketplace → Ajustes)."""
    c = cache_get("mp_cfg")
    if c is not None:
        return c
    cfg = {"pct": 3.49, "fijo": 4.0, "iva": 16.0}
    try:
        for r in supabase_get("configuracion?clave=like.mp_*&select=clave,valor") or []:
            k = r["clave"][3:]
            if k in cfg:
                try:
                    cfg[k] = float(r["valor"])
                except (TypeError, ValueError):
                    pass
    except Exception as e:
        print(f"[marketplace] config de precios: {e}")
    cache_set("mp_cfg", cfg, 300)
    return cfg


def _precio_publico(neto: float, ganancia: float, cfg: dict = None) -> int:
    """Precio por par que paga la clienta (entero, hacia arriba). Cubre: lo del vendedor + ganancia del negocio + comisión de MercadoPago."""
    cfg = cfg or _cfg_precios()
    f = 1 + cfg["iva"] / 100
    pct, fijo = cfg["pct"] / 100 * f, cfg["fijo"] * f
    return int(math.ceil((float(neto) + float(ganancia) + fijo) / (1 - pct)))


def _envio_publico(envio_neto: float, cfg: dict = None) -> int:
    """Envío que paga la clienta para que el vendedor reciba completo el suyo (cubre la comisión de MercadoPago sobre el envío)."""
    if not envio_neto or envio_neto <= 0:
        return 0
    cfg = cfg or _cfg_precios()
    return int(math.ceil(float(envio_neto) / (1 - cfg["pct"] / 100 * (1 + cfg["iva"] / 100))))


@router_vendedor.get("/precio-publico")
def precio_publico_vendedor(neto: float = 0, v=Depends(require_vendedor)):
    """Vista previa para el vendedor: con lo que quiere recibir, cuánto verá la clienta (sirve para el precio de menudeo y para el de 3+ pares)."""
    if not (50 <= float(neto) <= 20000):
        return JSONResponse(status_code=400, content={"error": "Escribe un precio entre $50 y $20,000."})
    return {"precio_publico": _precio_publico(float(neto), float(v.get("comision_por_par") or COMISION_POR_PAR))}


# ───────────────────────── pedidos y saldo del vendedor ─────────────────────────
# El vendedor NO ve lo que pagó la clienta ni la ganancia del negocio: solo lo que le toca. En pedidos consolidados (los recibe el negocio)
# tampoco ve los datos de la clienta: solo a dónde llevar los pares.
_CAMPOS_PEDIDO_VENDEDOR = ("id,numero,modo_envio,cliente_nombre,cliente_telefono,direccion,ciudad,estado_region,cp,notas,neto_vendedor,status,paqueteria,guia,"
                           "liquidacion_id,created_at,pagado_at,enviado_at,entregado_at,recibido_at,mp_pedido_items(nombre,color,talla,cantidad,neto_unitario)")


def _bodega_direccion() -> str:
    """Dirección de la bodega del negocio, donde los vendedores entregan los pedidos consolidados."""
    c = cache_get("mp_bodega")
    if c is not None:
        return c
    txt = "Bodega Zapatillas May (León, Gto.) — te confirmamos la dirección por WhatsApp"
    try:
        s = supabase_get("sucursales?activa=eq.true&select=nombre,direccion,tipo&order=created_at.asc") or []
        s = sorted(s, key=lambda x: 0 if x.get("tipo") == "bodega" else 1)
        if s and s[0].get("direccion"):
            txt = f"{s[0].get('nombre') or 'Bodega'}: {s[0]['direccion']}"
    except Exception:
        pass
    cache_set("mp_bodega", txt, 600)
    return txt


@router_vendedor.get("/pedidos")
def mis_pedidos(v=Depends(require_vendedor)):
    filas = supabase_get(f"mp_pedidos?vendedor_id=eq.{v['id']}&status=neq.pendiente_pago&select={_CAMPOS_PEDIDO_VENDEDOR}&order=created_at.desc&limit=300") or []
    bodega = _bodega_direccion()
    for p in filas:
        if p.get("modo_envio") == "consolidado":
            for k in ("cliente_nombre", "cliente_telefono", "direccion", "ciudad", "estado_region", "cp", "notas"):
                p[k] = None
            p["entregar_en"] = bodega
    return filas


@router_vendedor.post("/pedidos/{pid}/enviar")
def marcar_enviado(pid: str, datos: dict, v=Depends(require_vendedor)):
    paqueteria = _txt(datos.get("paqueteria"), 40)
    guia = _txt(datos.get("guia"), 60)
    if not paqueteria or not guia:
        return JSONResponse(status_code=400, content={"error": "Escribe la paquetería y el número de guía."})
    # solo pasa de 'pagado' a 'enviado' (atómico), solo pedidos de envío directo (los consolidados los envía el negocio) y solo los suyos
    r = supabase_patch(f"mp_pedidos?id=eq.{_q(pid)}&vendedor_id=eq.{v['id']}&status=eq.pagado&modo_envio=eq.directo",
                       {"status": "enviado", "paqueteria": paqueteria, "guia": guia, "enviado_at": _ahora()})
    if not r:
        return JSONResponse(status_code=400, content={"error": "Ese pedido no está pendiente de envío por tu parte."})
    ped = r[0]
    _enviar(ped["cliente_email"], f"Tu pedido #{ped['numero']} va en camino",
            f"<h2 style='margin:0 0 10px;color:#2A1A0E'>¡Tu pedido va en camino! 📦</h2>"
            f"<p style='color:#555;line-height:1.6'>Hola {_html.escape(ped['cliente_nombre'])}, <b>{_html.escape(v['nombre_tienda'])}</b> ya envió tu pedido <b>#{ped['numero']}</b>.<br>"
            f"Paquetería: <b>{_html.escape(paqueteria)}</b><br>Número de guía: <b>{_html.escape(guia)}</b></p>"
            f"<p style='color:#888;font-size:13px'>Con la guía puedes rastrearlo en la página de la paquetería.</p>", "marketplace_envio")
    return {"ok": True}


def _saldo_vendedor(vendedor_id: str) -> dict:
    ped = supabase_get_all(f"mp_pedidos?vendedor_id=eq.{vendedor_id}&status=in.({','.join(_ESTADOS_PAGADOS)})&select=status,neto_vendedor,liquidacion_id,recibido_at") or []
    por_pagar = sum(float(p["neto_vendedor"] or 0) for p in ped if _liquidable(p))
    # «en camino»: pedidos pagados que aún no son cobrables (por enviar/entregarnos, o recibidos hace menos de 24 horas)
    por_enviar = sum(float(p["neto_vendedor"] or 0) for p in ped if not p.get("liquidacion_id") and not _liquidable(p) and p["status"] in ("pagado", "recibido"))
    liq = supabase_get(f"mp_liquidaciones?vendedor_id=eq.{vendedor_id}&select=id,monto,referencia,nota,created_at&order=created_at.desc&limit=100") or []
    return {"por_pagar": round(por_pagar, 2), "por_enviar": round(por_enviar, 2),
            "liquidado_total": round(sum(float(x["monto"] or 0) for x in liq), 2), "liquidaciones": liq}


@router_vendedor.get("/saldo")
def mi_saldo(v=Depends(require_vendedor)):
    return _saldo_vendedor(v["id"])


# ───────────────────────── catálogo público ─────────────────────────
def _tarjeta(p: dict, cfg: dict) -> dict:
    vend = p.get("mp_vendedores") or {}
    vars_ = p.get("mp_variantes") or []
    con_stock = [x for x in vars_ if (x.get("stock") or 0) > 0]
    ganancia = float(vend.get("comision_por_par") or COMISION_POR_PAR)
    precio = _precio_publico(float(p["precio"]), ganancia, cfg)
    precio3 = _precio_publico(float(p.get("precio_mayoreo3") or p["precio"]), ganancia, cfg)
    return {"id": p["id"], "slug": p["slug"], "nombre": p["nombre"], "categoria": p.get("categoria"), "precio": precio, "precio_mayoreo3": min(precio3, precio),
            "imagen": (p.get("imagenes") or [None])[0], "vendedor": vend.get("nombre_tienda"), "vendedor_slug": vend.get("slug"),
            "tallas": sorted({x["talla"] for x in con_stock}, key=_talla_key), "hay_stock": bool(con_stock)}


@router.get("/productos")
def productos_publicos(categoria: str = "", q: str = "", vendedor: str = "", limite: int = 60):
    """Productos publicados de vendedores activos y con existencia (cache de 60 s). El precio ya incluye la ganancia del negocio y la comisión de MP."""
    limite = max(1, min(int(limite or 60), 200))
    clave = f"mp_lista_{categoria}_{q}_{vendedor}_{limite}"
    hit = cache_get(clave)
    if hit is not None:
        return hit
    filtro = "estado=eq.publicado&mp_vendedores.estado=eq.activo"
    if categoria:
        filtro += f"&categoria=eq.{_q(categoria.lower()[:30])}"
    if vendedor:
        filtro += f"&mp_vendedores.slug=eq.{_q(vendedor[:60])}"
    filas = supabase_get(f"mp_productos?{filtro}&select=id,slug,nombre,categoria,precio,precio_mayoreo3,imagenes,mp_vendedores!inner(nombre_tienda,slug,estado,comision_por_par),mp_variantes(talla,stock)&order=publicado_at.desc.nullslast&limit=400") or []
    cfg = _cfg_precios()
    out = [_tarjeta(p, cfg) for p in filas]
    out = [x for x in out if x["hay_stock"] and x["imagen"]]
    if q:
        ql = _slug(q).replace("-", " ")
        out = [x for x in out if ql in _slug(x["nombre"]).replace("-", " ") or ql in _slug(x["vendedor"] or "").replace("-", " ")]
    out = out[:limite]
    cache_set(clave, out, 60)
    return out


@router.get("/productos/{slug}")
def producto_publico(slug: str):
    filas = supabase_get(f"mp_productos?slug=eq.{_q(slug[:80])}&estado=eq.publicado&mp_vendedores.estado=eq.activo"
                         f"&select=id,slug,nombre,descripcion,categoria,material,precio,precio_mayoreo3,envio,peso_gramos,imagenes,mp_vendedores!inner(id,nombre_tienda,slug,ciudad,estado_region,descripcion,comision_por_par),mp_variantes(id,color,talla,stock)&limit=1") or []
    if not filas:
        return JSONResponse(status_code=404, content={"error": "Producto no encontrado"})
    p = filas[0]
    cfg = _cfg_precios()
    vend = p.pop("mp_vendedores", None) or {}
    ganancia = float(vend.pop("comision_por_par", None) or COMISION_POR_PAR)   # la ganancia del negocio NO se expone
    neto, neto3 = float(p["precio"]), float(p.get("precio_mayoreo3") or p["precio"])
    p["precio"] = _precio_publico(neto, ganancia, cfg)
    p["precio_mayoreo3"] = min(_precio_publico(neto3, ganancia, cfg), p["precio"])   # lo que paga la clienta con 3+ pares en el carrito
    p["envio"] = _envio_publico(float(p.get("envio") or 0), cfg)
    p["mp_variantes"] = sorted([x for x in p.get("mp_variantes") or [] if (x.get("stock") or 0) > 0],
                               key=lambda x: (x["color"], _talla_key(x["talla"])))
    p["vendedor"] = vend
    return p


# ───────────────────────── carrito único (productos del negocio + de vendedores) ─────────────────────────
_CLAVES_PEDIDO_NEGOCIO = ("cliente_id", "nombre_cliente", "email_cliente", "telefono_cliente", "ciudad_cliente", "estado_cliente", "cp_cliente",
                          "direccion_envio", "notas", "fbc", "fbp", "client_user_agent", "ga_client_id", "gclid", "fbclid", "utm_source", "utm_medium",
                          "utm_campaign", "referrer_origen")


def _umbral_envio_gratis() -> float:
    """Monto del carrito desde el cual el envío es gratis (el mismo que usa la tienda: configuración de envío)."""
    from routers.seo import get_config_envio
    return float(get_config_envio().get("gratis_desde", 1299))


def _envio_tienda(pares: int, subtotal: float) -> float:
    """Envío normal de la tienda (el mismo que calcula el carrito: gratis desde cierto monto y por escalones de pares)."""
    from routers.seo import get_config_envio
    cfg = get_config_envio()
    if subtotal >= float(cfg.get("gratis_desde", 1299)):
        return 0.0
    if pares >= 3:
        return float(cfg.get("tier3", 0))
    if pares >= 2:
        return float(cfg.get("tier2", 0))
    return float(cfg.get("tier1", 0))


@router.post("/checkout-carrito")
@limiter.limit("10/minute")
def checkout_carrito(request: Request, datos: dict):
    """Pago del carrito cuando trae productos de vendedores (con o sin productos del negocio). Todo se calcula aquí; del navegador no se toma ningún precio ni envío.
    Reglas (decididas por el dueño), el carrito es UNO para el negocio y todas las tiendas:
      · Descuento CRUZADO: si el carrito completo suma 3 pares o más, todos los productos usan su precio de 3+ pares (el del negocio: $60 menos; el de cada
        tienda: el que ella puso, que ella financia), aunque de una tienda sea un solo par.
      · Envío gratis ACUMULADO: si el subtotal del carrito completo llega a lo mismo que pide la tienda (hoy $1,299), no se cobra envío.
      · Quién recibe: si son 3+ pares y de 2 o más orígenes (el negocio y/o varias tiendas), el negocio recibe todo (las tiendas se lo traen) y envía en un solo
        paquete; si no, cada origen envía lo suyo.
      · Envío que paga la clienta (si no llega al envío gratis): paquete único = tarifa normal de la tienda por pares; envíos separados = la tarifa de la tienda por
        lo del negocio + el envío que puso cada tienda.
      · Si el envío sale gratis en un pedido cruzado, SU COSTO SE REPARTE entre quienes participan en proporción a lo que vende cada uno (a cada tienda se le
        descuenta su parte de lo que le toca); en envíos separados, cada tienda absorbe su propio paquete.
    Un solo pago de MercadoPago. Si hay productos del negocio se crea además su pedido normal en el ERP (inventario, correos, reportes)."""
    try:
        nombre = _txt(datos.get("nombre_cliente"), 80)
        email = str(datos.get("email_cliente") or "").strip().lower()[:120]
        tel = re.sub(r"\D", "", str(datos.get("telefono_cliente") or ""))[-10:]
        dire = _txt(datos.get("direccion_envio"), 220)
        ciudad, estado = _txt(datos.get("ciudad_cliente"), 60), _txt(datos.get("estado_cliente"), 60)
        cp = re.sub(r"\D", "", str(datos.get("cp_cliente") or ""))[:5]
        if len(nombre) < 3 or not _EMAIL_RX.match(email) or len(tel) != 10 or len(dire) < 6 or not ciudad or len(cp) != 5:
            return JSONResponse(status_code=400, content={"error": "Completa tus datos de envío: nombre, correo, WhatsApp (10 dígitos), dirección, ciudad y código postal."})

        # ── productos de vendedores ──
        pedidas = {}
        for x in [i for i in (datos.get("items_mp") or []) if isinstance(i, dict)][:30]:
            vid, cant = str(x.get("variante_id") or ""), int(_num(x.get("cantidad"), 1, 20, 0) or 0)
            if vid and cant:
                pedidas[vid] = pedidas.get(vid, 0) + cant
        if not pedidas:
            return JSONResponse(status_code=400, content={"error": "No hay productos de tiendas aliadas en tu pedido."})
        vars_ = supabase_get(f"mp_variantes?id=in.({','.join(_q(i) for i in pedidas)})&select=id,color,talla,stock,producto_id,"
                             f"mp_productos(id,nombre,precio,precio_mayoreo3,envio,estado,vendedor_id,mp_vendedores(id,estado,comision_por_par,nombre_tienda))") or []
        if len(vars_) != len(pedidas):
            return JSONResponse(status_code=400, content={"error": "Alguno de los productos ya no está disponible."})
        lineas = []
        for va in vars_:
            pr = va.get("mp_productos") or {}
            vend = pr.get("mp_vendedores") or {}
            if pr.get("estado") != "publicado" or vend.get("estado") != "activo":
                return JSONResponse(status_code=400, content={"error": f"{pr.get('nombre', 'Un producto')} ya no está disponible."})
            cant = pedidas[va["id"]]
            if (va.get("stock") or 0) < cant:
                return JSONResponse(status_code=400, content={"error": f"De {pr['nombre']} (talla {va['talla']}) solo quedan {va.get('stock') or 0}."})
            lineas.append({"va": va, "pr": pr, "vend": vend, "cant": cant,
                           "ganancia": float(vend.get("comision_por_par") if vend.get("comision_por_par") is not None else COMISION_POR_PAR)})

        # ── productos del negocio ──
        neg = []
        for x in [i for i in (datos.get("items") or []) if isinstance(i, dict)][:30]:
            if x.get("es_corrida"):
                return JSONResponse(status_code=400, content={"error": "Las corridas completas se compran por separado, sin productos de otras tiendas."})
            vid, cant = str(x.get("variante_id") or ""), int(_num(x.get("cantidad"), 1, 60, 0) or 0)
            if vid and cant:
                neg.append({"variante_id": vid, "cantidad": cant})
        if neg:
            vn = supabase_get(f"variantes?id=in.({','.join(_q(i['variante_id']) for i in neg)})&select=id,color,talla,producto_id,activa,productos(id,nombre,precio_menudeo,es_oferta,activo)") or []
            por_id = {x["id"]: x for x in vn}
            for it in neg:
                va = por_id.get(it["variante_id"])
                pr = (va or {}).get("productos") or {}
                if not va or va.get("activa") is False or not pr.get("activo"):
                    return JSONResponse(status_code=400, content={"error": "Alguno de los productos ya no está disponible."})
                it.update({"nombre": pr["nombre"], "color": va.get("color"), "talla": va.get("talla"),
                           "web": float(pr["precio_menudeo"] or 0) + (0 if pr.get("es_oferta") else 80), "oferta": bool(pr.get("es_oferta"))})

        # ── precios: el descuento de 3+ pares es CRUZADO (cuentan todos los pares del carrito) ──
        cfg = _cfg_precios()
        pares_neg, pares_mp = sum(i["cantidad"] for i in neg), sum(l["cant"] for l in lineas)
        pares_total = pares_neg + pares_mp
        con_desc = pares_total >= 3
        for it in neg:
            it["precio"] = it["web"] if (it["oferta"] or not con_desc) else it["web"] - 60
        for l in lineas:
            l["neto"] = float(l["pr"].get("precio_mayoreo3") or l["pr"]["precio"]) if con_desc else float(l["pr"]["precio"])
            l["neto"] = min(l["neto"], float(l["pr"]["precio"]))
            l["precio"] = _precio_publico(l["neto"], l["ganancia"], cfg)
        sub_neg = sum(i["precio"] * i["cantidad"] for i in neg)
        sub_mp = sum(l["precio"] * l["cant"] for l in lineas)
        sub_total = sub_neg + sub_mp

        # ── quién recibe y cuánto envío ──
        vendedores = {}
        for l in lineas:
            vendedores.setdefault(l["vend"]["id"], []).append(l)
        origenes = len(vendedores) + (1 if neg else 0)
        consolidado = pares_total >= 3 and origenes >= 2
        gratis = sub_total >= _umbral_envio_gratis()   # el subtotal de TODO el carrito se acumula para el envío gratis
        sub_vend = {vid: sum(l["precio"] * l["cant"] for l in ls) for vid, ls in vendedores.items()}
        envio_neto_vend = {vid: max(float(l["pr"].get("envio") or 0) for l in ls) for vid, ls in vendedores.items()}   # lo que le cuesta enviar a cada tienda
        descuento_envio = {vid: 0.0 for vid in vendedores}    # parte del costo de envío gratis que absorbe cada tienda
        if gratis:
            envio_total = 0.0
            envio_en_pedido_negocio = 0.0
            if consolidado:
                costo = _envio_tienda(pares_total, 0)     # costo estimado del paquete único: la tarifa normal por pares
                for vid in vendedores:
                    descuento_envio[vid] = round(costo * sub_vend[vid] / sub_total, 2)
            else:
                for vid in vendedores:                     # cada quien envía lo suyo y absorbe su paquete
                    descuento_envio[vid] = envio_neto_vend[vid]
            envio_cli = {vid: 0 for vid in vendedores}
        elif consolidado:
            envio_total = _envio_tienda(pares_total, sub_total)
            envio_en_pedido_negocio = envio_total
            envio_cli = {vid: 0 for vid in vendedores}
        else:
            envio_neg = _envio_tienda(pares_neg, sub_neg) if neg else 0.0
            envio_cli = {vid: _envio_publico(envio_neto_vend[vid], cfg) for vid in vendedores}
            envio_total = envio_neg + sum(envio_cli.values())
            envio_en_pedido_negocio = envio_neg
        total_cobrar = round(sub_total + envio_total, 2)

        # ── pedido del negocio (ERP) con sus productos ──
        grupo_id = str(uuid.uuid4())
        pedido_negocio_id = None
        if neg:
            from routers.pedidos import crear_pedido
            payload = {k: datos[k] for k in _CLAVES_PEDIDO_NEGOCIO if k in datos}
            payload.update({
                "items": [{"variante_id": i["variante_id"], "cantidad": i["cantidad"], "precio_unitario": i["precio"], "nombre": i["nombre"], "color": i["color"], "talla": i["talla"]} for i in neg],
                "total": round(sub_neg + envio_en_pedido_negocio, 2), "status": "borrador", "canal": "web",
                "nombre_cliente": nombre, "email_cliente": email, "telefono_cliente": tel,
            })
            payload["notas"] = ((str(payload.get("notas") or "") + " ").strip() + f" [Pago junto con productos de tiendas aliadas: {', '.join(sorted({l['vend']['nombre_tienda'] for l in lineas}))}"
                                + (" · ENVÍO CONSOLIDADO: recibe el negocio]" if consolidado else "]"))[:600]
            r = crear_pedido(payload, request)
            if isinstance(r, JSONResponse):
                return r
            if not isinstance(r, dict) or not r.get("id"):
                return JSONResponse(status_code=500, content={"error": "No se pudo crear tu pedido. Intenta de nuevo."})
            pedido_negocio_id = r["id"]

        # ── un pedido de marketplace por tienda ──
        mp_peds, primero = [], True
        for vid, ls in vendedores.items():
            sub = sub_vend[vid]
            neto = sum(l["neto"] * l["cant"] for l in ls)
            gan = sum(l["ganancia"] * l["cant"] for l in ls)
            if gratis:
                neto -= descuento_envio[vid]                  # absorbe su parte del envío gratis
            elif not consolidado:
                neto += envio_neto_vend[vid]                  # la clienta pagó su envío (lo recibe completo)
            neto = max(neto, 0.0)
            ped = supabase_post("mp_pedidos", {
                "vendedor_id": vid, "cliente_nombre": nombre, "cliente_email": email, "cliente_telefono": tel, "direccion": dire, "ciudad": ciudad,
                "estado_region": estado, "cp": cp, "notas": _txt(datos.get("notas"), 300), "subtotal": round(sub, 2), "envio": float(envio_cli[vid]),
                "total": round(sub + envio_cli[vid], 2), "comision": round(gan, 2), "neto_vendedor": round(neto, 2), "status": "pendiente_pago",
                "grupo_id": grupo_id, "modo_envio": "consolidado" if consolidado else "directo", "pedido_negocio_id": pedido_negocio_id,
                "envio_negocio": float(envio_total) if (consolidado and not neg and primero) else 0,
            })[0]
            primero = False
            for l in ls:
                supabase_post("mp_pedido_items", {
                    "pedido_id": ped["id"], "producto_id": l["pr"]["id"], "variante_id": l["va"]["id"], "nombre": l["pr"]["nombre"], "color": l["va"]["color"],
                    "talla": l["va"]["talla"], "cantidad": l["cant"], "precio_unitario": float(l["precio"]), "neto_unitario": l["neto"], "comision_unitaria": l["ganancia"],
                })
            mp_peds.append(ped)

        # ── un solo pago de MercadoPago ──
        from routers.pagos import sdk
        mp_items = [{"title": f"{i['nombre']} · talla {i['talla']}"[:250], "quantity": i["cantidad"], "unit_price": float(i["precio"]), "currency_id": "MXN"} for i in neg]
        mp_items += [{"title": f"{l['pr']['nombre']} · talla {l['va']['talla']}"[:250], "quantity": l["cant"], "unit_price": float(l["precio"]), "currency_id": "MXN"} for l in lineas]
        if envio_total > 0:
            mp_items.append({"title": "Envío", "quantity": 1, "unit_price": float(envio_total), "currency_id": "MXN"})
        pref = {
            "items": mp_items, "payer": {"name": nombre, "email": email},
            "external_reference": str(pedido_negocio_id) if pedido_negocio_id else f"MP-{grupo_id}",
            "back_urls": {"success": f"{_FRONT}/success", "failure": f"{_FRONT}/checkout", "pending": f"{_FRONT}/success"}, "auto_return": "approved",
        }
        hook = os.getenv("MP_WEBHOOK_URL", "")
        if hook:
            pref["notification_url"] = hook
        r = sdk.preference().create(pref)["response"]
        if "id" not in r:
            print(f"[marketplace/checkout] MP: {r}")
            supabase_patch(f"mp_pedidos?grupo_id=eq.{grupo_id}", {"status": "cancelado"})
            if pedido_negocio_id:
                supabase_patch(f"pedidos?id=eq.{pedido_negocio_id}", {"status": "cancelado"})
            return JSONResponse(status_code=502, content={"error": "No se pudo generar el pago. Intenta de nuevo."})
        supabase_patch(f"mp_pedidos?grupo_id=eq.{grupo_id}", {"mp_preference_id": r["id"]})
        if pedido_negocio_id:
            supabase_patch(f"pedidos?id=eq.{pedido_negocio_id}", {"mp_preference_id": r["id"], "status": "checkout_iniciado"})
        return {"ok": True, "init_point": r["init_point"], "pedido_id": pedido_negocio_id or f"MP-{grupo_id}", "total": total_cobrar, "consolidado": consolidado, "envio": float(envio_total)}
    except Exception:
        import traceback
        print(f"[marketplace/checkout-carrito] {traceback.format_exc()}")
        return JSONResponse(status_code=500, content={"error": "No se pudo crear el pedido. Intenta de nuevo."})


def _pagar_pedidos_mp(filas: list, payment_id, monto_pagado=None, con_pedido_negocio: bool = False):
    """Marca como pagados los pedidos de marketplace de UN pago (atómico por pedido), descuenta existencias y avisa a cada tienda y a la clienta."""
    pagados = []
    for p in filas:
        if p["status"] in _ESTADOS_PAGADOS:
            continue
        if not supabase_patch(f"mp_pedidos?id=eq.{p['id']}&status=in.(pendiente_pago,cancelado)",
                              {"status": "pagado", "mp_payment_id": str(payment_id), "pagado_at": _ahora()}):
            continue
        for it in p.get("mp_pedido_items") or []:
            if it.get("variante_id"):
                try:
                    supabase_rpc("mp_descontar_stock", {"p_variante": it["variante_id"], "p_cantidad": int(it["cantidad"])})
                except Exception as e:
                    print(f"[marketplace/webhook] stock {it['variante_id']}: {e}")
        pagados.append(p)
    if not pagados:
        return
    cache_invalidate_prefix("mp_")
    from email_utils import _boton
    bodega = _bodega_direccion()
    for p in pagados:
        vend = p.get("mp_vendedores") or {}
        lista = "".join(f"<li>{int(i['cantidad'])} × {_html.escape(i['nombre'])} · talla {_html.escape(str(i.get('talla') or ''))} {_html.escape(str(i.get('color') or ''))}</li>" for i in p.get("mp_pedido_items") or [])
        if not vend.get("email"):
            continue
        if p.get("modo_envio") == "consolidado":
            accion = (f"<p style='color:#555;line-height:1.6'><b>Este pedido va junto con otros productos:</b> lo recibimos nosotros y lo enviamos en un solo paquete. "
                      f"<b>Trae estos pares a:</b> {_html.escape(bodega)}.<br>Cuando los recibamos, tu dinero pasa a «por pagarte».</p>")
        else:
            accion = (f"<p style='color:#555;line-height:1.6'><b>Enviar a:</b> {_html.escape(p['cliente_nombre'])}, {_html.escape(p.get('direccion') or '')}, {_html.escape(p.get('ciudad') or '')} "
                      f"{_html.escape(p.get('estado_region') or '')}, CP {_html.escape(p.get('cp') or '')}<br><b>WhatsApp:</b> {_html.escape(p.get('cliente_telefono') or '')}<br>"
                      f"Cuando lo envíes, captura la guía en tu panel.</p>")
        _enviar(vend["email"], f"💰 Nuevo pedido #{p['numero']}",
                f"<h2 style='margin:0 0 10px;color:#2A1A0E'>¡Vendiste!</h2><ul style='color:#444;line-height:1.7'>{lista}</ul>{accion}"
                f"<p style='color:#555'>Te toca: <b>${float(p['neto_vendedor']):,.2f}</b>.</p>{_boton('Abrir mi panel', _FRONT + '/vendedor')}", "marketplace_pedido_vendedor")
    p0 = pagados[0]
    todos = "".join(f"<li>{int(i['cantidad'])} × {_html.escape(i['nombre'])} · talla {_html.escape(str(i.get('talla') or ''))} — {_html.escape((p.get('mp_vendedores') or {}).get('nombre_tienda') or '')}</li>" for p in pagados for i in p.get("mp_pedido_items") or [])
    como = ("Los recibimos nosotros y te los enviamos juntos en un solo paquete." if any(p.get("modo_envio") == "consolidado" for p in pagados)
            else "Cada tienda te lo envía directamente y te mandamos la guía por correo.")
    _enviar(p0["cliente_email"], f"Recibimos tu pago — pedido #{p0['numero']}",
            f"<h2 style='margin:0 0 10px;color:#2A1A0E'>¡Gracias por tu compra! 🎉</h2><p style='color:#555;line-height:1.6'>Recibimos tu pago. De tiendas aliadas llevas:</p>"
            f"<ul style='color:#444;line-height:1.7'>{todos}</ul><p style='color:#555;line-height:1.6'>{como}</p>", "marketplace_pedido_cliente")
    total = sum(float(p["total"]) + float(p.get("envio_negocio") or 0) for p in pagados)
    _avisar_negocio("💰 Venta en el marketplace", f"Pedido #{p0['numero']}: ${total:.0f} ({'consolidado: lo recibes tú' if p0.get('modo_envio') == 'consolidado' else 'envío directo'}) · tu ganancia ${sum(float(p['comision']) for p in pagados):.0f}")
    if monto_pagado is not None and not con_pedido_negocio and float(monto_pagado) + 1 < total:
        _avisar_negocio("⚠️ Marketplace: pago menor al total", f"Pedido #{p0['numero']}: pagó ${float(monto_pagado):.0f} de ${total:.0f}")


_SEL_PEDIDO_MP = "*,mp_pedido_items(*),mp_vendedores(nombre_tienda,email)"


def procesar_pago_marketplace(payment: dict, payment_id) -> dict:
    """Webhook de MercadoPago (routers/pagos.py) para pagos SIN productos del negocio: external_reference = «MP-<grupo>». `payment` ya viene de la API de MP
    (la verdad no viene del aviso)."""
    grupo = str(payment.get("external_reference") or "")[3:]
    status = payment.get("status")
    if status in ("rejected", "cancelled", "expired"):
        try:
            supabase_patch(f"mp_pedidos?grupo_id=eq.{_q(grupo)}&status=eq.pendiente_pago", {"status": "cancelado"})
        except Exception:
            pass
        return {"ok": True}
    if status != "approved":
        return {"ok": True}
    filas = supabase_get(f"mp_pedidos?grupo_id=eq.{_q(grupo)}&select={_SEL_PEDIDO_MP}") or []
    if not filas:
        print(f"[marketplace/webhook] grupo {grupo} no existe")
        return {"ok": True}
    _pagar_pedidos_mp(filas, payment_id, payment.get("transaction_amount"))
    return {"ok": True}


def on_pedido_negocio_pagado(pedido_negocio_id, payment_id, monto_pagado=None):
    """Lo llama el webhook del negocio cuando se confirma un pago cuyo pedido del ERP viene acompañado de productos de vendedores."""
    filas = supabase_get(f"mp_pedidos?pedido_negocio_id=eq.{_q(pedido_negocio_id)}&select={_SEL_PEDIDO_MP}") or []
    if filas:
        _pagar_pedidos_mp(filas, payment_id, monto_pagado, con_pedido_negocio=True)


def on_pedido_negocio_cancelado(pedido_negocio_id):
    supabase_patch(f"mp_pedidos?pedido_negocio_id=eq.{_q(pedido_negocio_id)}&status=eq.pendiente_pago", {"status": "cancelado"})


# ───────────────────────── administración (el negocio) ─────────────────────────
@router.get("/admin/resumen")
def admin_resumen(_a=Depends(require_admin)):
    vend = supabase_get_all("mp_vendedores?select=id,estado") or []
    prods = supabase_get_all("mp_productos?select=id,estado") or []
    ped = supabase_get_all("mp_pedidos?status=in.(pagado,recibido,enviado,entregado)&select=status,modo_envio,total,comision,neto_vendedor,liquidacion_id,recibido_at") or []
    return {
        "vendedores_pendientes": sum(1 for v in vend if v["estado"] == "pendiente"),
        "vendedores_activos": sum(1 for v in vend if v["estado"] == "activo"),
        "productos_por_aprobar": sum(1 for p in prods if p["estado"] == "pendiente"),
        "productos_publicados": sum(1 for p in prods if p["estado"] == "publicado"),
        "pedidos_por_enviar": sum(1 for p in ped if p["status"] == "pagado" and p.get("modo_envio") != "consolidado"),
        "pedidos_por_recibir": sum(1 for p in ped if p["status"] == "pagado" and p.get("modo_envio") == "consolidado"),
        "ventas_total": round(sum(float(p["total"]) for p in ped), 2),
        "comision_total": round(sum(float(p["comision"]) for p in ped), 2),
        "por_liquidar": round(sum(float(p["neto_vendedor"]) for p in ped if _liquidable(p)), 2),
    }


@router.get("/admin/vendedores")
def admin_vendedores(_a=Depends(require_admin)):
    vend = supabase_get_all("mp_vendedores?select=id,email,nombre_tienda,slug,nombre_contacto,telefono,ciudad,estado_region,descripcion,banco,clabe,titular,comision_por_par,estado,notas_admin,created_at,ultimo_login&order=created_at.desc") or []
    prods = supabase_get_all("mp_productos?select=vendedor_id,estado") or []
    ped = supabase_get_all("mp_pedidos?status=in.(pagado,recibido,enviado,entregado)&select=vendedor_id,total,comision") or []
    for v in vend:
        mios = [p for p in prods if p["vendedor_id"] == v["id"]]
        v["productos"] = len(mios)
        v["publicados"] = sum(1 for p in mios if p["estado"] == "publicado")
        v["por_aprobar"] = sum(1 for p in mios if p["estado"] == "pendiente")
        pv = [p for p in ped if p["vendedor_id"] == v["id"]]
        v["pedidos"] = len(pv)
        v["ventas"] = round(sum(float(p["total"]) for p in pv), 2)
        v["comision_ganada"] = round(sum(float(p["comision"]) for p in pv), 2)
    return vend


@router.patch("/admin/vendedores/{vid}")
def admin_editar_vendedor(vid: str, datos: dict, _a=Depends(require_admin)):
    antes = (supabase_get(f"mp_vendedores?id=eq.{_q(vid)}&select=estado,email,nombre_tienda") or [None])[0]
    if not antes:
        return JSONResponse(status_code=404, content={"error": "No encontrado"})
    c = {}
    if datos.get("estado") in ("pendiente", "activo", "suspendido"):
        c["estado"] = datos["estado"]
        if datos["estado"] == "activo" and antes["estado"] != "activo":
            c["aprobado_at"] = _ahora()
    if "comision_por_par" in datos:
        n = _num(datos.get("comision_por_par"), 0, 500)
        if n is None:
            return JSONResponse(status_code=400, content={"error": "La ganancia por par debe estar entre $0 y $500."})
        c["comision_por_par"] = n
    if "notas_admin" in datos:
        c["notas_admin"] = _txt(datos.get("notas_admin"), 500)
    if c:
        supabase_patch(f"mp_vendedores?id=eq.{_q(vid)}", c)
        cache_invalidate_prefix("mp_")
    if c.get("estado") == "activo" and antes["estado"] != "activo":
        from email_utils import _boton
        _enviar(antes["email"], "¡Tu cuenta de vendedor está activa!",
                f"<h2 style='margin:0 0 10px;color:#2A1A0E'>¡Bienvenida, {_html.escape(antes['nombre_tienda'])}!</h2>"
                f"<p style='color:#555;line-height:1.6'>Aprobamos tu cuenta. Entra a tu panel, sube tus productos y mándalos a revisión: en cuanto los aprobemos se publican en zapatillasmay.mx.</p>"
                f"{_boton('Entrar a mi panel', _FRONT + '/vendedor')}", "marketplace_activo")
    return {"ok": True}


@router.get("/admin/productos")
def admin_productos(estado: str = "", _a=Depends(require_admin)):
    filtro = f"&estado=eq.{_q(estado)}" if estado in _ESTADOS_PRODUCTO else ""
    return supabase_get_all(f"mp_productos?select=*,mp_variantes(color,talla,stock),mp_vendedores(nombre_tienda,estado){filtro}&order=updated_at.desc") or []


@router.patch("/admin/productos/{pid}")
def admin_editar_producto(pid: str, datos: dict, _a=Depends(require_admin)):
    p = (supabase_get(f"mp_productos?id=eq.{_q(pid)}&select=id,nombre,vendedor_id,mp_vendedores(email,nombre_tienda)") or [None])[0]
    if not p:
        return JSONResponse(status_code=404, content={"error": "No encontrado"})
    nuevo = datos.get("estado")
    if nuevo not in ("publicado", "rechazado", "pausado", "pendiente"):
        return JSONResponse(status_code=400, content={"error": "Estado no válido"})
    c = {"estado": nuevo, "updated_at": _ahora()}
    if nuevo == "publicado":
        c["publicado_at"] = _ahora(); c["motivo_rechazo"] = None
    if nuevo == "rechazado":
        motivo = _txt(datos.get("motivo_rechazo"), 300)
        if not motivo:
            return JSONResponse(status_code=400, content={"error": "Escribe el motivo para que el vendedor lo corrija."})
        c["motivo_rechazo"] = motivo
    supabase_patch(f"mp_productos?id=eq.{_q(pid)}", c)
    cache_invalidate_prefix("mp_")
    vend = p.get("mp_vendedores") or {}
    if vend.get("email") and nuevo in ("publicado", "rechazado"):
        cuerpo = (f"<h2 style='margin:0 0 10px;color:#2A1A0E'>Tu producto ya está publicado ✅</h2><p style='color:#555'>{_html.escape(p['nombre'])} ya se ve en zapatillasmay.mx.</p>"
                  if nuevo == "publicado" else
                  f"<h2 style='margin:0 0 10px;color:#2A1A0E'>Revisa tu producto</h2><p style='color:#555;line-height:1.6'>No pudimos publicar <b>{_html.escape(p['nombre'])}</b> todavía.<br>Motivo: {_html.escape(c['motivo_rechazo'])}<br>Corrígelo en tu panel y vuelve a mandarlo a revisión.</p>")
        _enviar(vend["email"], "Tu producto " + ("está publicado" if nuevo == "publicado" else "necesita cambios"), cuerpo, "marketplace_producto")
    return {"ok": True}


@router.get("/admin/pedidos")
def admin_pedidos(status: str = "", _a=Depends(require_admin)):
    filtro = f"&status=eq.{_q(status)}" if status in ("pendiente_pago", "pagado", "recibido", "enviado", "entregado", "cancelado") else "&status=neq.pendiente_pago"
    return supabase_get(f"mp_pedidos?select=*,mp_vendedores(nombre_tienda),mp_pedido_items(nombre,color,talla,cantidad,precio_unitario){filtro}&order=created_at.desc&limit=300") or []


@router.post("/admin/pedidos/{pid}/entregado")
def admin_entregado(pid: str, _a=Depends(require_admin)):
    r = supabase_patch(f"mp_pedidos?id=eq.{_q(pid)}&status=in.(enviado,recibido)", {"status": "entregado", "entregado_at": _ahora()})
    return {"ok": bool(r)}


@router.post("/admin/pedidos/{pid}/recibido")
def admin_recibido(pid: str, _a=Depends(require_admin)):
    """Pedido consolidado: el negocio ya recibió los pares de la tienda. Desde aquí el dinero de la tienda pasa a «por pagar»."""
    r = supabase_patch(f"mp_pedidos?id=eq.{_q(pid)}&status=eq.pagado&modo_envio=eq.consolidado", {"status": "recibido", "recibido_at": _ahora()})
    return {"ok": bool(r)}


@router.post("/admin/pedidos/{pid}/cancelar")
def admin_cancelar(pid: str, _a=Depends(require_admin)):
    """Cancela un pedido y regresa las existencias. El reembolso al cliente se hace a mano en MercadoPago."""
    p = (supabase_get(f"mp_pedidos?id=eq.{_q(pid)}&select=id,status,liquidacion_id,mp_pedido_items(variante_id,cantidad)") or [None])[0]
    if not p:
        return JSONResponse(status_code=404, content={"error": "No encontrado"})
    if p["status"] in ("cancelado", "entregado") or p.get("liquidacion_id"):
        return JSONResponse(status_code=400, content={"error": "Este pedido ya no se puede cancelar (entregado, cancelado o ya liquidado)."})
    r = supabase_patch(f"mp_pedidos?id=eq.{p['id']}&status=eq.{p['status']}", {"status": "cancelado"})
    if r and p["status"] in ("pagado", "recibido", "enviado"):
        for it in p.get("mp_pedido_items") or []:
            if it.get("variante_id"):
                try:
                    supabase_rpc("mp_devolver_stock", {"p_variante": it["variante_id"], "p_cantidad": int(it["cantidad"])})
                except Exception as e:
                    print(f"[marketplace] devolver stock: {e}")
        cache_invalidate_prefix("mp_")
    return {"ok": bool(r), "recordatorio": "Reembolsa al cliente desde MercadoPago." if p["status"] in ("pagado", "recibido", "enviado") else ""}


@router.get("/admin/saldos")
def admin_saldos(_a=Depends(require_admin)):
    vend = supabase_get_all("mp_vendedores?select=id,nombre_tienda,banco,clabe,titular,estado&order=nombre_tienda.asc") or []
    ped = supabase_get_all("mp_pedidos?status=in.(pagado,recibido,enviado,entregado)&select=vendedor_id,status,neto_vendedor,comision,liquidacion_id,recibido_at") or []
    liq = supabase_get_all("mp_liquidaciones?select=vendedor_id,monto") or []
    out = []
    for v in vend:
        pv = [p for p in ped if p["vendedor_id"] == v["id"]]
        por_pagar = sum(float(p["neto_vendedor"]) for p in pv if _liquidable(p))
        por_enviar = sum(float(p["neto_vendedor"]) for p in pv if not p.get("liquidacion_id") and not _liquidable(p) and p["status"] in ("pagado", "recibido"))
        pagado = sum(float(x["monto"]) for x in liq if x["vendedor_id"] == v["id"])
        if por_pagar or por_enviar or pagado:
            out.append({**v, "por_pagar": round(por_pagar, 2), "por_enviar": round(por_enviar, 2), "liquidado": round(pagado, 2),
                        "pedidos_por_liquidar": sum(1 for p in pv if _liquidable(p))})
    return out


@router.post("/admin/liquidar")
def admin_liquidar(datos: dict, _a=Depends(require_admin)):
    """Liquida a un vendedor TODO lo que ya se puede pagar (pedidos enviados o entregados, y los recibidos por el negocio hace 24 horas o más): crea la liquidación y marca esos pedidos."""
    vid = str(datos.get("vendedor_id") or "")
    pend = supabase_get(f"mp_pedidos?vendedor_id=eq.{_q(vid)}&status=in.({','.join(_ESTADOS_LIQUIDABLES)})&liquidacion_id=is.null&select=id,status,recibido_at,neto_vendedor") or []
    pend = [p for p in pend if _liquidable(p)]   # los recibidos por el negocio se pagan 24 horas después de recibirlos
    if not pend:
        return JSONResponse(status_code=400, content={"error": "No hay pedidos listos para liquidar (los pares que recibimos se pagan 24 horas después de recibirlos)."})
    monto = round(sum(float(p["neto_vendedor"]) for p in pend), 2)
    quien = str((_a or {}).get("nombre") or (_a or {}).get("email") or "admin")[:60]
    liq = supabase_post("mp_liquidaciones", {"vendedor_id": vid, "monto": monto, "referencia": _txt(datos.get("referencia"), 80),
                                             "nota": _txt(datos.get("nota"), 300), "creado_por": quien})[0]
    ids = ",".join(p["id"] for p in pend)
    supabase_patch(f"mp_pedidos?id=in.({ids})&liquidacion_id=is.null", {"liquidacion_id": liq["id"]})
    v = (supabase_get(f"mp_vendedores?id=eq.{_q(vid)}&select=email,nombre_tienda") or [None])[0]
    if v:
        _enviar(v["email"], f"Te depositamos ${monto:,.2f}",
                f"<h2 style='margin:0 0 10px;color:#2A1A0E'>Liquidación realizada 💸</h2><p style='color:#555;line-height:1.6'>Te depositamos <b>${monto:,.2f}</b> por {len(pend)} pedido(s)."
                f"{(' Referencia: ' + _html.escape(liq.get('referencia') or '')) if liq.get('referencia') else ''}</p>", "marketplace_liquidacion")
    return {"ok": True, "monto": monto, "pedidos": len(pend)}


@router.get("/admin/ajustes")
def admin_ajustes(_a=Depends(require_admin)):
    cfg = _cfg_precios()
    ej = {"neto": 500, "precio_publico": _precio_publico(500, COMISION_POR_PAR, cfg)}
    return {**cfg, "ganancia_por_par": COMISION_POR_PAR, "ejemplo": ej}


@router.patch("/admin/ajustes")
def admin_guardar_ajustes(datos: dict, _a=Depends(require_admin)):
    """Comisión de MercadoPago que se suma al precio: porcentaje, cuota fija por pago e IVA sobre ambas."""
    lim = {"pct": (0, 10), "fijo": (0, 30), "iva": (0, 20)}
    for k, (a, b) in lim.items():
        if k in datos:
            n = _num(datos.get(k), a, b)
            if n is None:
                return JSONResponse(status_code=400, content={"error": f"El valor de «{k}» debe estar entre {a} y {b}."})
            clave = f"mp_{k}"
            if not supabase_patch(f"configuracion?clave=eq.{clave}", {"valor": str(n)}):
                supabase_post("configuracion", {"clave": clave, "valor": str(n)})
    cache_invalidate_prefix("mp_")
    return admin_ajustes(_a)
