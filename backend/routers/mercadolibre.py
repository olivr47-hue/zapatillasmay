# -*- coding: utf-8 -*-
"""
Router MercadoLibre — ERP Zapatillas May
Gestiona el token, busca publicaciones y sincroniza inventario.
"""

import os, json, time, secrets, hashlib, base64, urllib.request, urllib.error, urllib.parse
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
from database import supabase_get_all, supabase_get
from cache import cache_get, cache_set, cache_invalidate

router = APIRouter(prefix="/ml", tags=["MercadoLibre"])

# ─── Configuración ─────────────────────────────────────────────────────────────
ML_BASE       = "https://api.mercadolibre.com"
ML_USER_ID    = os.getenv("ML_USER_ID", "381682237")
ML_APP_ID     = os.getenv("ML_APP_ID", "")
ML_SECRET     = os.getenv("ML_CLIENT_SECRET", "")
ML_TOKEN_ENV  = os.getenv("ML_ACCESS_TOKEN", "")
ML_REFRESH    = os.getenv("ML_REFRESH_TOKEN", "")

# Catálogos de las 3 publicaciones manuales
CATALOGOS = {
    "MLMU4011297427": "Sandalia tacon con plataforma",
    "MLMU4011417333": "Sandalia plataforma corrida / yute",
    "MLMU4024786106": "Sandalia tacon alto para fiesta",
}

# ─── Token management ──────────────────────────────────────────────────────────

_token_cache = {
    "token":      ML_TOKEN_ENV,
    "expires_at": time.time() + 21600 if ML_TOKEN_ENV else 0,  # asume 6h si viene del env
    "refresh":    ML_REFRESH,
}

def get_token() -> str:
    """Devuelve el token vigente; lo refresca si tiene refresh_token."""
    now = time.time()
    # Si el token en caché todavía es válido (con 5 min de margen)
    if _token_cache["token"] and _token_cache["expires_at"] > now + 300:
        return _token_cache["token"]

    # Intentar refrescar con refresh_token
    # Prioridad: 1) token renovado durante la sesión, 2) variable de entorno
    refresh = _token_cache.get("refresh") or ML_REFRESH
    if refresh and ML_APP_ID and ML_SECRET:
        body = urllib.parse.urlencode({
            "grant_type":    "refresh_token",
            "client_id":     ML_APP_ID,
            "client_secret": ML_SECRET,
            "refresh_token": refresh,
        }).encode()
        req = urllib.request.Request(
            f"{ML_BASE}/oauth/token",
            data=body,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req) as r:
                resp = json.loads(r.read())
                _token_cache["token"]      = resp["access_token"]
                _token_cache["expires_at"] = now + resp.get("expires_in", 21600)
                # Actualizar refresh token si vino uno nuevo
                if "refresh_token" in resp:
                    _token_cache["refresh"] = resp["refresh_token"]
                return _token_cache["token"]
        except Exception as e:
            pass  # Caer al token del .env

    # Usar el token del .env tal cual (puede estar vencido)
    return _token_cache["token"] or ML_TOKEN_ENV


def ml_headers():
    return {"Authorization": f"Bearer {get_token()}", "Content-Type": "application/json"}

def ml_get(path: str):
    req = urllib.request.Request(f"{ML_BASE}{path}", headers=ml_headers())
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise HTTPException(status_code=e.code, detail=json.loads(e.read()).get("message", str(e)))

def ml_put(path: str, data: dict):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{ML_BASE}{path}", data=body,
        headers=ml_headers(), method="PUT"
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body_err = json.loads(e.read())
        return {"error": body_err.get("message", str(e)), "cause": body_err.get("cause")}

# ─── OAuth — obtener / renovar token ──────────────────────────────────────────

RAILWAY_URL = "https://zapatillasmay-production.up.railway.app"

# Almacén temporal del code_verifier (PKCE) — se limpia tras usarse
_pkce_store: dict = {}

def _make_code_verifier() -> str:
    return secrets.token_urlsafe(64)  # 86 chars URL-safe

def _make_code_challenge(verifier: str) -> str:
    digest = hashlib.sha256(verifier.encode()).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode()


@router.get("/auth", response_class=HTMLResponse)
def auth_inicio():
    """
    Paso 1: Genera la URL de autorización de ML con PKCE y muestra el botón.
    Abre en el navegador: https://zapatillasmay-production.up.railway.app/ml/auth
    """
    if not ML_APP_ID:
        return HTMLResponse("<h2>Falta ML_APP_ID en Railway Variables</h2>", status_code=500)

    verifier   = _make_code_verifier()
    challenge  = _make_code_challenge(verifier)
    state      = secrets.token_hex(16)

    # Guardar verifier ligado al state para recuperarlo en el callback
    _pkce_store[state] = verifier

    redirect_uri = f"{RAILWAY_URL}/ml/callback"
    params = urllib.parse.urlencode({
        "response_type":         "code",
        "client_id":             ML_APP_ID,
        "redirect_uri":          redirect_uri,
        "code_challenge":        challenge,
        "code_challenge_method": "S256",
        "state":                 state,
    })
    url = f"https://auth.mercadolibre.com.mx/authorization?{params}"

    return HTMLResponse(f"""
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:sans-serif;display:flex;align-items:center;justify-content:center;
    height:100vh;margin:0;background:#f5f5f5}}
    .box{{background:white;padding:40px;border-radius:12px;text-align:center;max-width:400px;
    box-shadow:0 4px 20px rgba(0,0,0,.1)}}
    a{{display:inline-block;margin-top:20px;padding:14px 32px;background:#FFE600;
    color:#333;border-radius:8px;text-decoration:none;font-weight:700;font-size:1rem}}</style>
    </head><body><div class="box">
    <h2>Conectar MercadoLibre</h2>
    <p>Haz clic para autorizar el acceso a tu cuenta <strong>ZAPATILLAS MAY</strong></p>
    <a href="{url}">Autorizar con MercadoLibre</a>
    </div></body></html>
    """)


@router.get("/callback")
def auth_callback(code: str = "", state: str = "", error: str = ""):
    """
    Paso 2: ML redirige aquí con el código. Lo intercambiamos por access_token + refresh_token.
    """
    if error:
        return HTMLResponse(f"<h2>Error ML: {error}</h2>", status_code=400)
    if not code:
        return HTMLResponse("<h2>No se recibio codigo de autorizacion</h2>", status_code=400)

    # Recuperar el code_verifier por state
    verifier = _pkce_store.pop(state, "")
    if not verifier:
        return HTMLResponse("<h2>State invalido o expirado. Vuelve a /ml/auth</h2>", status_code=400)

    redirect_uri = f"{RAILWAY_URL}/ml/callback"
    body = urllib.parse.urlencode({
        "grant_type":    "authorization_code",
        "client_id":     ML_APP_ID,
        "client_secret": ML_SECRET,
        "code":          code,
        "redirect_uri":  redirect_uri,
        "code_verifier": verifier,
    }).encode()

    req = urllib.request.Request(
        f"{ML_BASE}/oauth/token", data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        err = json.loads(e.read())
        return HTMLResponse(f"<h2>Error ML: {err}</h2>", status_code=400)

    access_token  = resp.get("access_token", "")
    refresh_token = resp.get("refresh_token", "")
    expires_in    = resp.get("expires_in", 21600)

    _token_cache["token"]      = access_token
    _token_cache["expires_at"] = time.time() + expires_in
    if refresh_token:
        _token_cache["refresh"] = refresh_token

    cache_invalidate("ml_items")

    return HTMLResponse(f"""
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:sans-serif;display:flex;align-items:center;justify-content:center;
    height:100vh;margin:0;background:#f5f5f5}}
    .box{{background:white;padding:40px;border-radius:12px;text-align:center;max-width:520px;
    box-shadow:0 4px 20px rgba(0,0,0,.1)}}
    .token{{background:#f0f0f0;padding:10px;border-radius:6px;font-family:monospace;
    font-size:.72rem;word-break:break-all;text-align:left;margin:12px 0}}
    .ok{{color:#22c55e;font-size:2rem}}</style>
    </head><body><div class="box">
    <p class="ok">&#10003;</p>
    <h2>Cuenta conectada!</h2>
    <p>Token activo por <strong>{expires_in // 3600}h</strong>. El servidor lo usa automaticamente.</p>
    <p style="font-size:.8rem;color:#888">Guarda en Railway Variables como <code>ML_ACCESS_TOKEN</code>
    para que sobreviva reinicios:</p>
    <div class="token">{access_token}</div>
    {"<p style='font-size:.8rem;color:#888'>Guarda como <code>ML_REFRESH_TOKEN</code>:</p><div class='token'>" + refresh_token + "</div>" if refresh_token else ""}
    <p style="margin-top:24px"><a href="{RAILWAY_URL}/ml/ping"
    style="padding:10px 24px;background:#333;color:white;border-radius:8px;text-decoration:none;font-weight:600">
    Verificar conexion</a></p>
    </div></body></html>
    """)


# ─── Endpoints de diagnóstico ──────────────────────────────────────────────────

@router.get("/ping")
def ping():
    """Verifica que el token funcione y muestra info del vendedor."""
    try:
        info = ml_get(f"/users/{ML_USER_ID}")
        return {
            "ok": True,
            "seller": info.get("nickname"),
            "seller_id": info.get("id"),
            "pais": info.get("country_id"),
            "reputacion": info.get("seller_reputation", {}).get("level_id"),
        }
    except HTTPException as e:
        return {"ok": False, "error": e.detail, "tip": "Actualiza ML_ACCESS_TOKEN en Railway Variables"}

# ─── Listar todos los items con su SELLER_SKU ────────────────────────────────

def _get_all_item_ids() -> list:
    """Trae todos los IDs de items del vendedor."""
    all_ids, offset = [], 0
    while True:
        resp = ml_get(f"/users/{ML_USER_ID}/items/search?limit=100&offset={offset}")
        batch = resp.get("results", [])
        all_ids.extend(batch)
        if len(batch) < 100:
            break
        offset += 100
    return all_ids

def _get_items_with_sku(all_ids: list) -> list:
    """Devuelve lista de dicts con item_id, title, status, qty, seller_sku."""
    items = []
    for i in range(0, len(all_ids), 20):
        batch = ",".join(all_ids[i:i+20])
        resp = ml_get(f"/items?ids={batch}&attributes=id,title,status,available_quantity,attributes")
        for entry in resp:
            if entry.get("code") != 200:
                continue
            b = entry["body"]
            sku = ""
            for attr in b.get("attributes", []):
                if attr.get("id") == "SELLER_SKU":
                    sku = (attr.get("value_name") or "").strip()
                    break
            items.append({
                "item_id":    b["id"],
                "title":      b.get("title", ""),
                "status":     b.get("status", ""),
                "qty":        b.get("available_quantity", 0),
                "seller_sku": sku,
            })
    return items


@router.get("/item/{item_id}")
def detalle_item(item_id: str):
    """Devuelve el detalle completo de un item de ML (para ver estructura)."""
    return ml_get(f"/items/{item_id}")

@router.get("/items")
def listar_items():
    """Devuelve todos los items del vendedor con su SELLER_SKU del ERP."""
    cached = cache_get("ml_items")
    if cached:
        return cached
    all_ids = _get_all_item_ids()
    items   = _get_items_with_sku(all_ids)
    con_sku = [it for it in items if it["seller_sku"]]
    result  = {
        "total":    len(items),
        "con_sku":  len(con_sku),
        "sin_sku":  len(items) - len(con_sku),
        "items":    items,
    }
    cache_set("ml_items", result, ttl=300)
    return result

# ─── Stock del ERP ────────────────────────────────────────────────────────────

def _norm_sku(sku: str) -> str:
    """Normaliza un SKU para comparar ML vs ERP:
    - Mayúsculas
    - Punto decimal de talla → guión bajo  (23.5 → 23_5)
    - Reemplaza Ñ/ñ → N (COGÑAC → COGNAC)
    """
    s = (sku or "").upper().strip()
    s = s.replace("Ñ", "N").replace("ñ", "N")
    # Normalizar talla: último segmento con punto → guión bajo
    partes = s.split("-")
    if partes:
        partes[-1] = partes[-1].replace(".", "_")
    return "-".join(partes)

def _stock_erp() -> dict:
    """
    SKU normalizado → cantidad total.
    Indexa por DOS claves por variante:
      1. SKU abreviado del ERP:  M-TAC-0022-NEG-24
      2. SKU con color completo: M-TAC-0022-NEGRO-24
    Así matchea tanto los items subidos manualmente (nombre completo)
    como los generados por el ERP (código corto).
    """
    rows = supabase_get_all("inventario?select=variante_id,cantidad")
    por_variante: dict = {}
    for r in rows:
        vid = r.get("variante_id")
        if vid:
            por_variante[vid] = por_variante.get(vid, 0) + (r.get("cantidad") or 0)

    variantes = supabase_get_all("variantes?activa=eq.true&select=id,sku,color,talla")
    stock = {}
    for v in variantes:
        if not v.get("sku"):
            continue
        qty = por_variante.get(v["id"], 0)
        # Clave 1: SKU abreviado normalizado (como está en el ERP)
        stock[_norm_sku(v["sku"])] = qty
        # Clave 2: SKU con color completo (como puede estar en ML manual)
        # Estructura: {sku_interno}-{cod_color}-{cod_talla}
        # Reconstruir con el nombre completo del color
        partes = v["sku"].split("-")
        if len(partes) >= 3 and v.get("color"):
            sku_base  = "-".join(partes[:-2])     # M-TAC-0022
            cod_talla = partes[-1]                  # 24
            color_completo = _norm_sku(v["color"]) # NEGRO, NUDE, COGNAC
            talla_norm = cod_talla.replace(".", "_")
            clave_full = f"{sku_base}-{color_completo}-{talla_norm}"
            stock[clave_full] = qty
    return stock

# ─── Comparar stock ERP vs ML ─────────────────────────────────────────────────

@router.get("/stock")
def ver_stock_ml():
    """Compara stock ERP vs ML para cada item. Muestra diferencias."""
    items_data = listar_items()
    stock_erp  = _stock_erp()
    reporte, sin_match = [], []

    for it in items_data["items"]:
        if it["status"] != "active":
            continue
        sku = _norm_sku(it["seller_sku"])
        if not sku:
            sin_match.append(it["item_id"])
            continue
        qty_erp = stock_erp.get(sku)
        reporte.append({
            "item_id":    it["item_id"],
            "seller_sku": sku,
            "qty_ml":     it["qty"],
            "qty_erp":    qty_erp if qty_erp is not None else "no encontrado",
            "ok":         qty_erp == it["qty"] if qty_erp is not None else False,
        })

    desactualizados = [r for r in reporte if not r["ok"]]
    return {
        "total_items":      len(reporte),
        "desactualizados":  len(desactualizados),
        "sin_sku":          len(sin_match),
        "diferencias":      desactualizados[:50],   # primeras 50
    }

# ─── Sincronización de inventario ─────────────────────────────────────────────

@router.post("/sync")
def sincronizar_inventario(background_tasks: BackgroundTasks):
    """
    Actualiza el stock de todos los items en ML desde el ERP (por SELLER_SKU).
    Se ejecuta en background.
    """
    background_tasks.add_task(_hacer_sync)
    return {"message": "Sincronizacion iniciada. Consulta /ml/sync/log en ~30s"}


def _hacer_sync():
    """Sincroniza available_quantity de cada item activo usando SELLER_SKU → ERP stock."""
    try:
        all_ids   = _get_all_item_ids()
        items     = _get_items_with_sku(all_ids)
        stock_erp = _stock_erp()
        actualizados, sin_match, errores, iguales = [], [], [], []

        for it in items:
            if it["status"] != "active":
                continue
            sku = _norm_sku(it["seller_sku"])
            if not sku or sku not in stock_erp:
                sin_match.append({"item": it["item_id"], "sku": sku or "(vacio)"})
                continue
            nueva_qty = stock_erp[sku]
            if nueva_qty == it["qty"]:
                iguales.append(it["item_id"])
                continue
            resultado = ml_put(f"/items/{it['item_id']}", {"available_quantity": nueva_qty})
            if resultado and "error" not in resultado:
                actualizados.append({"item": it["item_id"], "sku": sku, "antes": it["qty"], "despues": nueva_qty})
            else:
                errores.append({"item": it["item_id"], "sku": sku, "error": str(resultado)})

        cache_set("ml_sync_log", {
            "ts":           time.time(),
            "actualizados": len(actualizados),
            "sin_cambio":   len(iguales),
            "sin_match":    len(sin_match),
            "errores":      len(errores),
            "detalle_actualizados": actualizados,
            "detalle_errores":      errores,
            "detalle_sin_match":    sin_match[:20],
        }, ttl=3600)
    except Exception as e:
        cache_set("ml_sync_log", {"ts": time.time(), "error": str(e)}, ttl=3600)


@router.get("/sync/log")
def ver_log_sync():
    """Consulta el resultado de la última sincronización."""
    log = cache_get("ml_sync_log")
    if not log:
        return {"message": "No hay sincronizaciones recientes"}
    return log


# ─── Publicar productos en ML ──────────────────────────────────────────────────

# ERP categoria → nombre de calzado para el título
_TIPO_CALZADO = {
    "sandalia": "Sandalia", "sandalias": "Sandalia",
    "tacon": "Tacón", "tacones": "Tacón",
    "botin": "Botín", "botines": "Botines",
    "flat": "Flat", "flats": "Flat",
    "balerina": "Balerina", "balerinas": "Balerina",
    "sneaker": "Tenis", "tenis": "Tenis",
    "plataforma": "Plataforma", "mocasin": "Mocasín",
    "oxford": "Oxford", "mule": "Mule",
}

# ERP categoria → category_id de ML México
# Verificados 2026-06-15 contra /categories/{id}/attributes:
#   MLM192717=Sandalias y Chanclas, MLM193324=Zapatillas y Tacones,
#   MLM192062=Botas y Botines, MLM193197=Flats, MLM6585=Tenis
_CATEGORY_ID = {
    "sandalia": "MLM192717", "sandalias": "MLM192717",
    # Tacones, botines, flats y balerinas van todos a MLM192717 (Sandalias):
    # es la categoría donde el vendedor siempre publicó su calzado. Tiene
    # guía de tallas 487994 y envío me2 configurados. Las categorías "puras"
    # (MLM193324 tacones, MLM193197 flats) exigen guías propias que la cuenta
    # no tiene — ML responde cause 2613 (invalid.fashion_grid.grid_id.values).
    "tacon": "MLM192717",    "tacones":   "MLM192717",
    "botin": "MLM192717",    "botines":   "MLM192717",
    "flat":  "MLM192717",    "flats":     "MLM192717",
    "balerina": "MLM192717", "balerinas": "MLM192717",
    "tenis": "MLM6585",
}
_CATEGORY_DEFAULT = "MLM192717"

# category_id → (value_id, value_name) de FOOTWEAR_TYPE válido en esa categoría.
# Cada categoría acepta SOLO sus propios valores; mandar el texto equivocado
# (ej. "Tacón" en Sandalias) provoca cause_id 3510 invalid.item.attribute.values.
# MLM192062 (Botas y Botines) no tiene el atributo → no aparece aquí.
_FOOTWEAR_BY_CAT = {
    "MLM192717": ("517585",  "Sandalia"),   # Sandalias y Chanclas
    "MLM193324": ("4097913", "Tacos"),      # Zapatillas y Tacones
    "MLM193197": ("4102827", "Flats"),      # Flats
    "MLM6585":   ("517583",  "Tenis"),      # Tenis
}

# Categoría → SIZE_GRID_ID verificado en items existentes.
# Las categorías que NO aparecen aquí publican SIZE como valor directo
# ("23", "24.5") sin grid. MLM193324 (Zapatillas y Tacones, dominio
# MLM-HEELS_AND_WEDGES) NO usa el grid de sandalias: lo rechaza
# (cause 2613 invalid.fashion_grid.grid_id.values).
_SIZE_GRID = {
    "MLM192717": "487994",   # Sandalias y Chanclas (también tacones, botines, flats)
    "MLM192062": "356657",   # Botas y Botines
}

# Color ERP → (value_id ML, value_name estándar)
_MAIN_COLOR = {
    "negro": ("2450295","Negro"),    "black": ("2450295","Negro"),
    "blanco":("2450308","Blanco"),   "white": ("2450308","Blanco"),
    "azul":  ("2450293","Azul"),     "blue":  ("2450293","Azul"),
    "rojo":  ("2450307","Rojo"),     "red":   ("2450307","Rojo"),
    "marron":("2450291","Marrón"),   "cafe":  ("2450291","Marrón"),
    "brown": ("2450291","Marrón"),   "camel": ("2450291","Marrón"),
    "latte": ("2450281","Beige"),    "beige": ("2450281","Beige"),
    "nude":  ("2450281","Beige"),    "hueso": ("2450281","Beige"),
    "rosa":  ("2450312","Rosa"),     "pink":  ("2450312","Rosa"),
    "violeta":("2450311","Violeta"), "morado":("2450311","Violeta"),
    "verde": ("2450314","Verde"),    "green": ("2450314","Verde"),
    "naranja":("2450327","Naranja"), "orange":("2450327","Naranja"),
    "amarillo":("2450296","Amarillo"),"yellow":("2450296","Amarillo"),
    "gris":  ("2450294","Gris"),     "gray":  ("2450294","Gris"),
    "dorado":("2450289","Dorado"),   "gold":  ("2450289","Dorado"),
    "oro":   ("2450289","Dorado"),   "inox":  ("2450303","Plateado"),
    "plateado":("2450303","Plateado"),"silver":("2450303","Plateado"),
    "plata": ("2450303","Plateado"), "celeste":("2450278","Celeste"),
    "multicolor":("46671867","Multicolor"),
}


def _talla_to_row(talla, grid_id: str = "487994") -> str | None:
    """
    Talla MX → SIZE_GRID_ROW_ID.
    Grid 487994: base 23 = row 1, cada 0.5 = +1 row (verificado en items existentes).
    """
    try:
        t = float(str(talla).replace("_", "."))
        row = int(round((t - 23) * 2)) + 1
        if 1 <= row <= 20:
            return f"{grid_id}:{row}"
    except Exception:
        pass
    return None


def _build_item(producto: dict, variante: dict, qty: int,
                category_id: str, listing_type: str) -> dict:
    """
    Construye el payload de POST /items para ML.
    Título: "{Tipo} {nombre del producto} Marca May"  (máx 60 chars)
    Marca:  siempre "May"
    """
    cat    = (producto.get("categoria") or "sandalia").lower().strip()
    tipo   = _TIPO_CALZADO.get(cat, "Sandalia")
    nombre = (producto.get("nombre") or "").strip()

    talla_raw     = str(variante.get("talla") or "")
    talla_display = talla_raw.replace("_", ".")
    color_raw     = (variante.get("color") or "").strip()
    # Nombre completo (normalizando espacios) — antes se truncaba a la primera
    # palabra, lo que hacía que colores distintos como "Azul claro" y
    # "Azul marino charol" colisionaran en el mismo valor "Azul" al publicar.
    color_simple  = " ".join(color_raw.split()).title() if color_raw else ""

    # ── Título ML (máx 60 chars, sin color ni talla — ML los agrega solo) ──
    # Usar el nombre del producto para que ML lo asocie al catálogo correcto.
    # Ej: "Sandalia De Tacón Con Plataforma Para Fiesta Marca May"
    title_raw   = f"{tipo} {nombre} Marca May".strip() if nombre else f"{tipo} Marca May"
    title       = title_raw[:60].strip()
    family_name = title

    # ── Imágenes (Cloudinary) ──
    fotos = list(variante.get("imagenes") or [])
    if not fotos and variante.get("foto_url"):
        fotos = [variante["foto_url"]]
    if not fotos and producto.get("imagen_principal"):
        fotos = [producto["imagen_principal"]]
    pictures = [{"source": u} for u in fotos[:12] if u]

    # ── Tallas: con grid (sandalias/botas) o valor directo (tacones/heels) ──
    # Si la categoría tiene un size grid válido → "{talla} MX" + grid + row.
    # Si no → SIZE como valor directo ("23", "24.5"), que es lo que acepta
    # MLM-HEELS_AND_WEDGES; mandar un grid ajeno da error 2613.
    grid_id = _SIZE_GRID.get(category_id)
    if grid_id:
        size_value = f"{talla_display} MX"
        row_id     = _talla_to_row(talla_display, grid_id)
    else:
        size_value = talla_display
        row_id     = None

    # ── MAIN_COLOR con value_id estándar de ML ──
    color_key = color_raw.lower().split()[0] if color_raw else ""
    mc_id, mc_name = _MAIN_COLOR.get(color_key, ("46671867", "Multicolor"))

    # ── Temporada desde descripción ──
    descripcion  = (producto.get("descripcion") or "").strip()[:4000]
    desc_lower   = descripcion.lower()
    season = ("Otoño/Invierno"
              if any(p in desc_lower for p in ("otoño", "invierno"))
              else "Primavera/Verano")

    # FOOTWEAR_TYPE válido según la categoría (value_id estándar de ML).
    fw = _FOOTWEAR_BY_CAT.get(category_id)

    attrs = [
        {"id": "SELLER_SKU",    "value_name": variante.get("sku", "")},
        {"id": "BRAND",         "value_name": "May"},
        {"id": "GENDER",        "value_name": "Mujer"},
        {"id": "AGE_GROUP",     "value_id": "6725189"},   # Adultos (ML lo pide en MLM193324)
        {"id": "COLOR",         "value_name": color_simple},
        {"id": "MAIN_COLOR",    "value_id": mc_id, "value_name": mc_name},
        {"id": "SIZE",          "value_name": size_value},
    ]
    if fw:
        attrs.append({"id": "FOOTWEAR_TYPE", "value_id": fw[0], "value_name": fw[1]})
    if grid_id:
        attrs.append({"id": "SIZE_GRID_ID", "value_name": grid_id})
    if row_id:
        attrs.append({"id": "SIZE_GRID_ROW_ID", "value_name": row_id})
    if nombre:
        attrs.append({"id": "MODEL", "value_name": nombre})

    precio = float(producto.get("precio_menudeo") or 0)

    return {
        "family_name":        title,
        "category_id":        category_id,
        "price":              precio,
        "currency_id":        "MXN",
        "available_quantity": max(1, int(qty)),
        "buying_mode":        "buy_it_now",
        "listing_type_id":    listing_type,
        "condition":          "new",
        "catalog_listing":    False,
        # Envío Mercado Envíos me2 + envío gratis, igual que los items que ya
        # tiene publicados el vendedor (sin esto ML da 400 por me1 faltante).
        "shipping":           {"mode": "me2", "local_pick_up": False, "free_shipping": True},
        "description":        {"plain_text": descripcion},
        "pictures":           pictures,
        "attributes":         attrs,
    }


@router.post("/publicar-payloads")
def publicar_payloads_raw(body: dict):
    """
    Publica uno o varios payloads editados manualmente desde el panel.
    Body: { "payloads": [ { ...item payload... }, ... ] }
    Devuelve resultado por cada payload.
    """
    payloads = body.get("payloads") or []
    if not payloads:
        raise HTTPException(400, "Se requiere 'payloads' (lista de items a publicar)")

    resultados = []
    for payload in payloads:
        # ML requiere family_name y rechaza title cuando family_name está presente.
        if not payload.get("family_name") and payload.get("title"):
            payload["family_name"] = payload.pop("title")
        elif payload.get("family_name") and "title" in payload:
            del payload["title"]

        sku = ""
        for attr in payload.get("attributes") or []:
            if attr.get("id") == "SELLER_SKU":
                sku = attr.get("value_name", "")
        req_body = json.dumps(payload).encode()
        req = urllib.request.Request(
            f"{ML_BASE}/items", data=req_body, headers=ml_headers(), method="POST"
        )
        try:
            with urllib.request.urlopen(req) as r:
                resp = json.loads(r.read())
                resultados.append({
                    "sku":       sku,
                    "ok":        True,
                    "item_id":   resp.get("id"),
                    "permalink": resp.get("permalink"),
                    "title":     resp.get("title"),
                })
        except urllib.error.HTTPError as e:
            raw = e.read()
            try:
                err = json.loads(raw)
            except Exception:
                err = {"raw": raw.decode(errors="replace")}
            resultados.append({
                "sku":    sku,
                "ok":     False,
                "codigo": e.code,
                "error":  err.get("message") or str(err),
                "causa":  err.get("cause") or [],
                "ml_raw": err,
            })

    ok  = [r for r in resultados if r["ok"]]
    err = [r for r in resultados if not r["ok"]]
    return {
        "total":      len(resultados),
        "publicados": len(ok),
        "errores":    len(err),
        "resultados": resultados,
    }


@router.post("/test-item")
def test_item_ml(body: dict):
    """
    Envía un payload minimalista a ML para diagnóstico.
    Útil para probar qué campos acepta antes de publicar real.
    Body: el payload exacto que se enviará a POST /items.
    """
    req_body = json.dumps(body).encode()
    req = urllib.request.Request(
        f"{ML_BASE}/items",
        data=req_body,
        headers=ml_headers(),
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as r:
            return {"ok": True, "response": json.loads(r.read())}
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            err = json.loads(raw)
        except Exception:
            err = {"raw": raw.decode(errors="replace")}
        return {"ok": False, "codigo": e.code, "error": err}


@router.post("/debug-publicar")
def debug_publicar(body: dict):
    """
    Construye el payload de la PRIMERA variante activa del producto y lo envía a ML.
    Devuelve el payload completo + la respuesta/error de ML con el cause array.
    Útil para diagnosticar body.invalid_fields sin tener que publicar todas las variantes.
    Body: { "sku_interno": "O-TAC-0118" }
    """
    sku_interno = (body.get("sku_interno") or "").strip().upper()
    producto_id = (body.get("producto_id") or "").strip()
    listing_type = body.get("listing_type") or "gold_special"

    if not sku_interno and not producto_id:
        raise HTTPException(400, "Se requiere sku_interno o producto_id")

    if producto_id:
        prods = supabase_get_all(f"productos?id=eq.{producto_id}&select=*&limit=1")
    else:
        prods = supabase_get_all(f"productos?sku_interno=eq.{sku_interno}&select=*&limit=1")
    if not prods:
        raise HTTPException(404, "Producto no encontrado")
    producto = prods[0]
    producto_id = producto_id or producto.get("id", "")

    variantes = supabase_get_all(
        f"variantes?producto_id=eq.{producto_id}&activa=eq.true&select=*&limit=1"
    )
    if not variantes:
        raise HTTPException(404, "Sin variantes activas")
    variante = variantes[0]

    cat_key     = (producto.get("categoria") or "sandalia").lower().strip()
    category_id = _CATEGORY_ID.get(cat_key, _CATEGORY_DEFAULT)
    payload     = _build_item(producto, variante, 5, category_id, listing_type)

    # Enviar a ML y devolver error completo
    req_body = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{ML_BASE}/items", data=req_body, headers=ml_headers(), method="POST"
    )
    try:
        with urllib.request.urlopen(req) as r:
            ml_resp = json.loads(r.read())
            return {"ok": True, "payload_enviado": payload, "ml_response": ml_resp}
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            err = json.loads(raw)
        except Exception:
            err = {"raw": raw.decode(errors="replace")}
        return {
            "ok": False,
            "payload_enviado": payload,
            "ml_error": err,
            "causa_detalle": err.get("cause") or [],
            "mensaje": err.get("message") or "",
        }


@router.post("/cerrar/{item_id}")
def cerrar_item(item_id: str):
    """Pausa, cierra y elimina una publicación de ML (ej. una de prueba)."""
    pasos = {}
    pasos["pausar"] = ml_put(f"/items/{item_id}", {"status": "paused"})
    pasos["cerrar"] = ml_put(f"/items/{item_id}", {"status": "closed"})
    pasos["eliminar"] = ml_put(f"/items/{item_id}", {"deleted": "true"})
    return {"item_id": item_id, "pasos": pasos}


@router.post("/reparar-titulo-color")
def reparar_titulo_color(body: dict):
    """
    Corrige título y atributo COLOR de publicaciones ya activas cuya variante
    tenga colisión de color (bug de color_simple truncado a la 1a palabra) o
    título inconsistente (enriquecido distinto por publicación en ML).
    Body: { "item_ids": ["MLM...", ...] }  (si viene vacío, no hace nada)
    Reconstruye título y color desde la fuente de verdad: producto + variante
    en el ERP, buscados por SELLER_SKU de cada item.
    """
    item_ids = body.get("item_ids") or []
    if not item_ids:
        return {"error": "item_ids requerido"}

    resultados = []
    for item_id in item_ids:
        try:
            item = ml_get(f"/items/{item_id}")
            seller_sku = ""
            for attr in item.get("attributes", []):
                if attr.get("id") == "SELLER_SKU":
                    seller_sku = (attr.get("value_name") or "").strip()
                    break
            if not seller_sku:
                resultados.append({"item_id": item_id, "error": "sin SELLER_SKU"})
                continue

            variantes = supabase_get(f"variantes?sku=eq.{seller_sku}&select=id,color,producto_id")
            if not variantes:
                resultados.append({"item_id": item_id, "seller_sku": seller_sku, "error": "variante no encontrada en ERP"})
                continue
            variante = variantes[0]
            productos = supabase_get(f"productos?id=eq.{variante['producto_id']}&select=nombre,categoria")
            if not productos:
                resultados.append({"item_id": item_id, "seller_sku": seller_sku, "error": "producto no encontrado"})
                continue
            producto = productos[0]

            cat    = (producto.get("categoria") or "sandalia").lower().strip()
            tipo   = _TIPO_CALZADO.get(cat, "Sandalia")
            nombre = (producto.get("nombre") or "").strip()
            title_raw = f"{tipo} {nombre} Marca May".strip() if nombre else f"{tipo} Marca May"
            title_nuevo = title_raw[:60].strip()

            color_raw = (variante.get("color") or "").strip()
            color_nuevo = " ".join(color_raw.split()).title() if color_raw else ""

            # Enviar SOLO los campos a cambiar (no reenviar el array completo de
            # attributes tal como lo devuelve el GET: trae metadatos internos
            # de solo-lectura que ML rechaza con BODY_INVALID_FIELDS en el PUT).
            resp_titulo = ml_put(f"/items/{item_id}", {"title": title_nuevo})
            resp_color  = ml_put(f"/items/{item_id}", {"attributes": [{"id": "COLOR", "value_name": color_nuevo}]})
            ok = "error" not in resp_titulo and "error" not in resp_color
            resultados.append({
                "item_id": item_id, "seller_sku": seller_sku,
                "title_anterior": item.get("title"), "title_nuevo": title_nuevo,
                "color_nuevo": color_nuevo,
                "ok": ok,
                "detalle": {
                    "titulo": {"error": resp_titulo.get("error"), "cause": resp_titulo.get("cause")} if "error" in resp_titulo else None,
                    "color": {"error": resp_color.get("error"), "cause": resp_color.get("cause")} if "error" in resp_color else None,
                } if not ok else None,
            })
        except Exception as e:
            resultados.append({"item_id": item_id, "error": str(e)})

    return {"total": len(item_ids), "reparados": sum(1 for r in resultados if r.get("ok")), "resultados": resultados}


@router.post("/validar")
def validar_publicacion(body: dict):
    """
    Valida en SECO la primera variante activa de un producto contra ML
    (POST /items/validate) — NO crea ninguna publicación.
    Devuelve el payload + el resultado de la validación con su array `cause`.
    Body: { "sku_interno": "M-TAC-0106" } o { "producto_id": "uuid" }
    """
    sku_interno = (body.get("sku_interno") or "").strip().upper()
    producto_id = (body.get("producto_id") or "").strip()
    listing_type = body.get("listing_type") or "gold_special"

    if not sku_interno and not producto_id:
        raise HTTPException(400, "Se requiere sku_interno o producto_id")

    if producto_id:
        prods = supabase_get_all(f"productos?id=eq.{producto_id}&select=*&limit=1")
    else:
        prods = supabase_get_all(f"productos?sku_interno=eq.{sku_interno}&select=*&limit=1")
    if not prods:
        raise HTTPException(404, "Producto no encontrado")
    producto = prods[0]
    producto_id = producto_id or producto.get("id", "")

    variantes = supabase_get_all(
        f"variantes?producto_id=eq.{producto_id}&activa=eq.true&select=*&limit=1"
    )
    if not variantes:
        raise HTTPException(404, "Sin variantes activas")
    variante = variantes[0]

    cat_key     = (producto.get("categoria") or "sandalia").lower().strip()
    category_id = _CATEGORY_ID.get(cat_key, _CATEGORY_DEFAULT)
    payload     = _build_item(producto, variante, 5, category_id, listing_type)

    req_body = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{ML_BASE}/items/validate", data=req_body, headers=ml_headers(), method="POST"
    )
    try:
        with urllib.request.urlopen(req) as r:
            # 204/200 sin cuerpo = payload válido
            raw = r.read()
            return {"ok": True, "valido": True, "category_id": category_id,
                    "payload_enviado": payload,
                    "ml_response": json.loads(raw) if raw else None}
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            err = json.loads(raw)
        except Exception:
            err = {"raw": raw.decode(errors="replace")}
        return {
            "ok": True, "valido": False, "codigo": e.code,
            "category_id": category_id,
            "payload_enviado": payload,
            "causa_detalle": err.get("cause") or [],
            "mensaje": err.get("message") or "",
            "ml_error": err,
        }


@router.get("/categorias")
def predecir_categoria(q: str = "sandalia mujer"):
    """Llama al predictor de ML para encontrar la category_id correcta."""
    return ml_get(f"/sites/MLM/category_predictor/select?title={urllib.parse.quote(q)}")


@router.get("/size-charts")
def size_charts(cat: str = "MLM193197"):
    """Devuelve las guías de tallas válidas para una categoría de ML."""
    return ml_get(f"/catalog_options/size_chart/search?category_id={cat}&site_id=MLM")


@router.post("/publicar")
def publicar_producto(body: dict):
    """
    Publica variantes de un producto ERP en ML como items individuales.

    Body:
    {
        "producto_id":  "uuid",
        "variante_ids": ["uuid1", ...],   // opcional; vacío = todas las activas
        "category_id":  "MLM192717",      // opcional; se auto-detecta por categoria ERP
        "listing_type": "free" | "bronze" | "silver" | "gold_pro",
        "solo_preview": true              // true = solo muestra payloads, no publica
    }
    """
    producto_id  = (body.get("producto_id") or "").strip()
    sku_interno  = (body.get("sku_interno") or "").strip().upper()
    variante_ids = body.get("variante_ids") or []
    listing_type = body.get("listing_type") or "gold_special"
    solo_preview = bool(body.get("solo_preview", False))

    if not producto_id and not sku_interno:
        raise HTTPException(400, "Se requiere producto_id o sku_interno")

    # Leer producto (por ID o por SKU)
    if producto_id:
        prods = supabase_get_all(f"productos?id=eq.{producto_id}&select=*&limit=1")
    else:
        prods = supabase_get_all(f"productos?sku_interno=eq.{sku_interno}&select=*&limit=1")
    if not prods:
        raise HTTPException(404, f"Producto no encontrado (sku={sku_interno or producto_id})")
    producto = prods[0]
    producto_id = producto_id or producto.get("id", "")  # FIX: usar ID real si se buscó por SKU

    # Leer variantes
    if variante_ids:
        ids_str  = ",".join(variante_ids)
        variantes = supabase_get_all(
            f"variantes?id=in.({ids_str})&activa=eq.true&select=*"
        )
    else:
        variantes = supabase_get_all(
            f"variantes?producto_id=eq.{producto_id}&activa=eq.true&select=*"
        )

    if not variantes:
        raise HTTPException(404, "Sin variantes activas para este producto")

    # Leer stock ERP solo de estas variantes
    vids_str = ",".join(v["id"] for v in variantes)
    inv_rows = supabase_get_all(
        f"inventario?variante_id=in.({vids_str})&select=variante_id,cantidad"
    )
    stock_map: dict = {}
    for row in inv_rows:
        vid = row.get("variante_id")
        if vid:
            stock_map[vid] = stock_map.get(vid, 0) + (row.get("cantidad") or 0)

    # Determinar category_id
    cat_key     = (producto.get("categoria") or "sandalia").lower().strip()
    category_id = (body.get("category_id") or "").strip() or _CATEGORY_ID.get(cat_key, _CATEGORY_DEFAULT)

    # Construir y publicar
    resultados = []
    for variante in variantes:
        qty     = stock_map.get(variante["id"], 0)
        payload = _build_item(producto, variante, qty, category_id, listing_type)

        if solo_preview:
            resultados.append({
                "sku":     variante.get("sku"),
                "color":   variante.get("color", ""),
                "talla":   variante.get("talla", ""),
                "preview": payload,
            })
            continue

        # POST a ML
        req_body = json.dumps(payload).encode()
        req = urllib.request.Request(
            f"{ML_BASE}/items",
            data=req_body,
            headers=ml_headers(),
            method="POST"
        )
        try:
            with urllib.request.urlopen(req) as r:
                resp = json.loads(r.read())
                resultados.append({
                    "sku":     variante.get("sku"),
                    "item_id": resp.get("id"),
                    "title":   resp.get("title"),
                    "status":  "publicado",
                    "permalink": resp.get("permalink"),
                })
        except urllib.error.HTTPError as e:
            raw = e.read()
            try:
                err = json.loads(raw)
            except Exception:
                err = {"raw_text": raw.decode(errors="replace")}
            resultados.append({
                "sku":    variante.get("sku"),
                "status": "error",
                "codigo": e.code,
                "error":  err.get("message") or err.get("error") or str(err),
                "causas": err.get("cause") or [],
                "ml_raw": err,   # respuesta completa de ML para debug
            })

    ok  = [r for r in resultados if r.get("status") == "publicado"]
    err = [r for r in resultados if r.get("status") == "error"]

    return {
        "producto":   producto.get("nombre"),
        "categoria":  cat_key,
        "category_id": category_id,
        "total":      len(resultados),
        "publicados": len(ok),
        "errores":    len(err),
        "resultados": resultados,
    }


# ─── Actualizar token manualmente ─────────────────────────────────────────────

@router.post("/token")
def actualizar_token(body: dict):
    """
    Actualiza el Access Token sin reiniciar Railway.
    Body: { "access_token": "APP_USR-...", "refresh_token": "..." (opcional) }
    """
    token = body.get("access_token", "").strip()
    if not token:
        raise HTTPException(400, "access_token requerido")
    _token_cache["token"]      = token
    _token_cache["expires_at"] = time.time() + 21600  # asumir 6h
    if body.get("refresh_token"):
        _token_cache["refresh"] = body["refresh_token"]
    cache_invalidate("ml_items")
    return {"ok": True, "message": "Token actualizado en memoria"}
