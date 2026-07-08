# -*- coding: utf-8 -*-
"""
Router SHEIN Open Platform (Seller / SPI, modelo semi-administrado) — ERP Zapatillas May.

El vendedor solo gestiona producto/stock/precio; SHEIN asigna la paquetería y
genera la guía (modelo semi-managed). Por eso este router usa:
  - POST /open-api/gsp/goods/change-inventory   (inventario semi-managed)
  y NO /open-api/goods/stock-update (esa es solo para fully-managed/self-owned).

Autenticación: OAuth-like propio de SHEIN.
  1. Redirigir a https://openapi-sem.sheincorp.com/#/empower?appid=...&redirectUrl=...&state=...
  2. SHEIN redirige de vuelta con tempToken (valido 10 min) + state.
  3. POST /open-api/auth/get-by-token {"tempToken":...} -> {"code":0,"info":{"secretKey":"<cifrado>", "openKeyId":...}}
  4. secretKey viene cifrado con AES-128-CBC (IV fijo "space-station-de", clave = primeros
     16 bytes del appSecret) -> se descifra con shein_crypto.shein_decrypt (Python puro,
     sin cryptography/pycryptodome — ver shein_crypto.py, mismo motivo que google_sa.py:
     esas librerías no se instalan de forma confiable en Railway para este proyecto).

Firma de cada request (headers x-lt-*):
  signStr = f"{openKeyId}&{timestampMs}&{path}"
  signKey = f"{secretKey}{random5}"
  firma   = random5 + base64(hexdigest(HMAC-SHA256(key=signKey, msg=signStr)))
Verificado contra 3 SDKs independientes (PHP oficial, Java oficial, Python comunitario).
"""

import os, json, time, random, string, hmac, hashlib, base64, secrets
import urllib.request, urllib.error, urllib.parse
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from fastapi.responses import HTMLResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch
from cache import cache_get, cache_set
from shein_crypto import shein_decrypt

router = APIRouter(prefix="/shein", tags=["SHEIN"])

# ─── Configuración ──────────────────────────────────────────────────────────
SHEIN_APP_ID     = os.getenv("SHEIN_APP_ID", "")
SHEIN_APP_SECRET = os.getenv("SHEIN_APP_SECRET", "")

# Semi-managed / self-operation -> dominio .com (NO .cn, ese es fully-managed/self-owned)
SHEIN_API_BASE  = "https://openapi.sheincorp.com"
SHEIN_AUTH_BASE = "https://openapi-sem.sheincorp.com"

RAILWAY_URL  = "https://zapatillasmay-production.up.railway.app"
REDIRECT_URI = f"{RAILWAY_URL}/shein/callback"

_pkce_store: dict = {}  # state -> True (solo para validar que el callback corresponde a un /auth nuestro)


# ─── Almacén del openKeyId/secretKey (tabla configuracion, igual que TikTok) ──

def _load_creds() -> dict | None:
    try:
        rows = supabase_get("configuracion?clave=eq.shein_token&select=valor")
        if rows and rows[0].get("valor"):
            return json.loads(rows[0]["valor"])
    except Exception:
        pass
    return None


def _save_creds(data: dict):
    valor = json.dumps(data)
    try:
        existing = supabase_get("configuracion?clave=eq.shein_token")
        if existing:
            supabase_patch("configuracion?clave=eq.shein_token", {"valor": valor})
        else:
            supabase_post("configuracion", {"clave": "shein_token", "valor": valor})
    except Exception as e:
        print(f"[SHEIN] Error guardando credenciales en Supabase: {e}")


def _open_key_id() -> str:
    creds = _load_creds()
    return (creds or {}).get("openKeyId", "")


def _secret_key() -> str:
    creds = _load_creds()
    return (creds or {}).get("secretKey", "")


# ─── Firma de requests ──────────────────────────────────────────────────────

def _random5() -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(random.choices(alphabet, k=5))


def _firmar(path: str, open_key_id: str, secret_key: str) -> tuple:
    """Devuelve (timestamp_ms_str, firma)."""
    ts = str(int(time.time() * 1000))
    sign_str = f"{open_key_id}&{ts}&{path}"
    r5 = _random5()
    sign_key = f"{secret_key}{r5}"
    hex_digest = hmac.new(sign_key.encode("utf-8"), sign_str.encode("utf-8"), hashlib.sha256).hexdigest()
    firma = r5 + base64.b64encode(hex_digest.encode("utf-8")).decode("utf-8")
    return ts, firma


def _headers(path: str, usar_appid: bool = False) -> dict:
    """
    usar_appid=True: modo APPID (solo para /auth/get-by-token, firmado con appid+appSecret).
    usar_appid=False: modo OPEN_KEY_ID (todas las demas llamadas, firmado con openKeyId+secretKey).
    """
    if usar_appid:
        ts, firma = _firmar(path, SHEIN_APP_ID, SHEIN_APP_SECRET)
        return {
            "x-lt-appid":     SHEIN_APP_ID,
            "x-lt-openKeyId": SHEIN_APP_ID,
            "x-lt-timestamp": ts,
            "x-lt-signature": firma,
            "Content-Type":   "application/json;charset=UTF-8",
        }
    open_key_id = _open_key_id()
    secret_key  = _secret_key()
    ts, firma = _firmar(path, open_key_id, secret_key)
    return {
        "x-lt-appid":     SHEIN_APP_ID,
        "x-lt-openKeyId": open_key_id,
        "x-lt-timestamp": ts,
        "x-lt-signature": firma,
        "Content-Type":   "application/json;charset=UTF-8",
    }


def _shein_request(method: str, path: str, body: dict = None, usar_appid: bool = False) -> dict:
    url = f"{SHEIN_API_BASE}{path}"
    data = json.dumps(body or {}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=_headers(path, usar_appid), method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            err = json.loads(raw)
        except Exception:
            err = {"raw": raw.decode(errors="replace")}
        raise HTTPException(status_code=e.code, detail=err)


def shein_get(path: str, params: dict = None) -> dict:
    qs = f"?{urllib.parse.urlencode(params)}" if params else ""
    full_path = f"{path}{qs}"
    url = f"{SHEIN_API_BASE}{full_path}"
    # La firma debe calcularse sobre el path completo, incluyendo el query
    # string, si lo hay -- de lo contrario SHEIN responde "openapi00007"
    # (verificacion de firma fallida) en cualquier GET con parametros.
    req = urllib.request.Request(url, headers=_headers(full_path), method="GET")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            err = json.loads(raw)
        except Exception:
            err = {"raw": raw.decode(errors="replace")}
        raise HTTPException(status_code=e.code, detail=err)


def shein_post(path: str, body: dict) -> dict:
    return _shein_request("POST", path, body)


# ─── Autorización (flujo tipo OAuth propio de SHEIN) ───────────────────────

@router.get("/auth", response_class=HTMLResponse)
def auth_inicio():
    """
    Paso 1: genera la URL de autorizacion de SHEIN y muestra el boton.
    Abrir en el navegador: https://zapatillasmay-production.up.railway.app/shein/auth
    """
    if not SHEIN_APP_ID:
        return HTMLResponse("<h2>Falta SHEIN_APP_ID en Railway Variables</h2>", status_code=500)

    state = secrets.token_hex(16)
    _pkce_store[state] = True

    redirect_b64 = base64.b64encode(REDIRECT_URI.encode()).decode()
    params = urllib.parse.urlencode({
        "appid":       SHEIN_APP_ID,
        "redirectUrl": redirect_b64,
        "state":       state,
    })
    url = f"{SHEIN_AUTH_BASE}/#/empower?{params}"

    return HTMLResponse(f"""
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:sans-serif;display:flex;align-items:center;justify-content:center;
    height:100vh;margin:0;background:#f5f5f5}}
    .box{{background:white;padding:40px;border-radius:12px;text-align:center;max-width:400px;
    box-shadow:0 4px 20px rgba(0,0,0,.1)}}
    a{{display:inline-block;margin-top:20px;padding:14px 32px;background:#f43f5e;
    color:white;border-radius:8px;text-decoration:none;font-weight:700;font-size:1rem}}</style>
    </head><body><div class="box">
    <h2>Conectar SHEIN</h2>
    <p>Haz clic para autorizar el acceso a tu tienda <strong>ZAPATILLAS MAY</strong></p>
    <a href="{url}">Autorizar con SHEIN</a>
    </div></body></html>
    """)


@router.get("/callback")
def auth_callback(tempToken: str = "", state: str = "", error: str = ""):
    """
    Paso 2: SHEIN redirige aqui con tempToken (valido 10 min). Lo intercambiamos
    por openKeyId + secretKey (cifrada, se descifra con AES-128-CBC puro-Python).
    """
    if error:
        return HTMLResponse(f"<h2>Error SHEIN: {error}</h2>", status_code=400)
    if not tempToken:
        return HTMLResponse("<h2>No se recibio tempToken</h2>", status_code=400)
    if state and state not in _pkce_store:
        return HTMLResponse("<h2>State invalido o expirado. Vuelve a /shein/auth</h2>", status_code=400)
    _pkce_store.pop(state, None)

    try:
        resp = _shein_request("POST", "/open-api/auth/get-by-token", {"tempToken": tempToken}, usar_appid=True)
    except HTTPException as e:
        return HTMLResponse(f"<h2>Error SHEIN: {e.detail}</h2>", status_code=400)

    if resp.get("code") not in (0, "0"):
        return HTMLResponse(f"<h2>Error SHEIN: {resp}</h2>", status_code=400)

    info = resp.get("info", {}) or {}
    secret_key_cifrada = info.get("secretKey", "")
    open_key_id = info.get("openKeyId") or info.get("open_key_id") or SHEIN_APP_ID

    try:
        secret_key = shein_decrypt(secret_key_cifrada, SHEIN_APP_SECRET) if secret_key_cifrada else ""
    except Exception as e:
        return HTMLResponse(f"<h2>Error descifrando secretKey: {e}</h2>", status_code=500)

    _save_creds({"openKeyId": open_key_id, "secretKey": secret_key, "info_raw": info})

    return HTMLResponse(f"""
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{{font-family:sans-serif;display:flex;align-items:center;justify-content:center;
    height:100vh;margin:0;background:#f5f5f5}}
    .box{{background:white;padding:40px;border-radius:12px;text-align:center;max-width:520px;
    box-shadow:0 4px 20px rgba(0,0,0,.1)}}
    .ok{{color:#22c55e;font-size:2rem}}</style>
    </head><body><div class="box">
    <p class="ok">&#10003;</p>
    <h2>Tienda conectada!</h2>
    <p>openKeyId: <code>{open_key_id}</code></p>
    <p style="margin-top:24px"><a href="{RAILWAY_URL}/shein/ping"
    style="padding:10px 24px;background:#333;color:white;border-radius:8px;text-decoration:none;font-weight:600">
    Verificar conexion</a></p>
    </div></body></html>
    """)


@router.get("/ping")
def ping():
    """Verifica que las credenciales guardadas funcionen."""
    if not _secret_key():
        return {"ok": False, "error": "No hay credenciales guardadas. Ve a /shein/auth"}
    try:
        resp = shein_get("/open-api/msc/warehouse/list")
        return {"ok": resp.get("code") in (0, "0"), "respuesta": resp}
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


# ─── Endpoints de diagnóstico (necesarios antes de poder publicar bien) ─────

@router.get("/category-tree")
def category_tree(parent_id: int = 0):
    """Árbol de categorías de SHEIN — necesario para saber a qué category_id publicar.
    Endpoint POST con body (como get-by-token/change-inventory), no GET+query."""
    try:
        return shein_post("/open-api/goods/category/query-category-tree", {"categoryId": parent_id})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/attribute-template/{category_id}")
def attribute_template(category_id: int):
    """Plantilla de atributos requeridos/opcionales para una categoría."""
    try:
        return shein_post("/open-api/goods/category/query-attribute-template", {"categoryId": category_id})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/brand-list")
def brand_list():
    try:
        return shein_post("/open-api/goods/brand/query-brand-list", {})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/site-list")
def site_list():
    try:
        return shein_post("/open-api/goods/site/query-site-list", {})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/warehouse-list")
def warehouse_list():
    """Lista de almacenes — el warehouse_code se necesita para change-inventory."""
    cached = cache_get("shein_warehouses")
    if cached:
        return cached
    try:
        resp = shein_get("/open-api/msc/warehouse/list")
        cache_set("shein_warehouses", resp, ttl=3600)
        return resp
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


def _default_warehouse_code() -> str:
    """Toma el primer almacen de la lista (la mayoria de vendedores solo tiene uno)."""
    cached = cache_get("shein_warehouse_code")
    if cached:
        return cached
    resp = warehouse_list()
    lista = (resp or {}).get("info") or (resp or {}).get("data") or []
    if isinstance(lista, dict):
        lista = lista.get("list") or lista.get("warehouseList") or []
    code = ""
    if lista:
        primero = lista[0]
        code = primero.get("warehouseCode") or primero.get("warehouse_code") or ""
    if code:
        cache_set("shein_warehouse_code", code, ttl=3600)
    return code


# ─── Imágenes: SHEIN exige alojarlas en su propio CDN (transform-pic) ───────

def _subir_imagen(url_imagen: str) -> str:
    """Sube una imagen (URL de Cloudinary) al CDN de SHEIN. Devuelve la URL de SHEIN."""
    resp = shein_post("/open-api/goods/pic/transform-pic", {"picUrl": url_imagen})
    info = resp.get("info", {}) or {}
    return info.get("picUrl") or info.get("pic_url") or ""


# ─── Stock del ERP (mismo patrón que mercadolibre.py) ───────────────────────

def _norm_sku(sku: str) -> str:
    s = (sku or "").upper().strip()
    s = s.replace("Ñ", "N").replace("ñ", "N")
    partes = s.split("-")
    if partes:
        partes[-1] = partes[-1].replace(".", "_")
    return "-".join(partes)


def _stock_erp() -> dict:
    """SKU normalizado -> cantidad total, igual que en mercadolibre.py."""
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
        stock[_norm_sku(v["sku"])] = qty
    return stock


# ─── SKUs ya publicados en SHEIN ────────────────────────────────────────────
# Igual que en mercadolibre.py: no se guarda ninguna columna nueva en el ERP.
# Al publicar mandamos skuCode = sku del ERP (igual que SELLER_SKU en ML), y
# para sincronizar despues simplemente consultamos que SKUs tiene SHEIN vivos.

def _skus_shein() -> list:
    """Devuelve [{"skuCode": ..., "estado": ...}] de todos los SKUs publicados en SHEIN."""
    resultado = []
    page = 1
    while True:
        try:
            resp = shein_post("/open-api/goods/product/query", {"page": page, "pageSize": 100})
        except HTTPException:
            break
        info = resp.get("info", {}) or {}
        items = info.get("list") or info.get("productList") or []
        if not items:
            break
        for prod in items:
            for skc in prod.get("skcList", []) or []:
                for sku in skc.get("skuList", []) or []:
                    sku_code = sku.get("skuCode") or sku.get("sku_code")
                    if sku_code:
                        resultado.append({"skuCode": sku_code, "estado": prod.get("status") or prod.get("auditStatus")})
        if len(items) < 100:
            break
        page += 1
        if page > 50:  # tope de seguridad
            break
    return resultado


# ─── Sincronización de inventario (change-inventory, modelo semi-managed) ──

@router.post("/sync")
def sincronizar_inventario(background_tasks: BackgroundTasks):
    """Actualiza el stock en SHEIN de todas las variantes ya publicadas. Corre en background."""
    background_tasks.add_task(_hacer_sync)
    return {"message": "Sincronizacion iniciada. Consulta /shein/sync/log en ~30s"}


def _hacer_sync():
    try:
        publicadas = _skus_shein()
        if not publicadas:
            cache_set("shein_sync_log", {"ts": time.time(), "error": "Sin SKUs publicados en SHEIN todavia"}, ttl=3600)
            return

        stock_erp = _stock_erp()
        warehouse_code = _default_warehouse_code()
        sin_match, errores = [], []

        cambios = []
        for item in publicadas:
            sku_code = item["skuCode"]
            sku_norm = _norm_sku(sku_code)
            if sku_norm not in stock_erp:
                sin_match.append({"skuCode": sku_code})
                continue
            cambios.append({
                "skuCode":        sku_code,
                "inventoryNum":   stock_erp[sku_norm],
                "warehouseCode":  warehouse_code,
            })
        actualizados = []

        # SHEIN acepta un batch de cambios de inventario por request.
        for i in range(0, len(cambios), 50):
            lote = cambios[i:i + 50]
            resp = shein_post("/open-api/gsp/goods/change-inventory", {"skuStockList": lote})
            if resp.get("code") in (0, "0"):
                actualizados.extend(lote)
            else:
                errores.append({"lote": lote, "error": resp})

        cache_set("shein_sync_log", {
            "ts":           time.time(),
            "actualizados": len(actualizados),
            "sin_match":    len(sin_match),
            "errores":      len(errores),
            "detalle_sin_match": sin_match[:20],
            "detalle_errores":   errores[:20],
        }, ttl=3600)
    except Exception as e:
        cache_set("shein_sync_log", {"ts": time.time(), "error": str(e)}, ttl=3600)


@router.get("/sync/log")
def ver_log_sync():
    log = cache_get("shein_sync_log")
    if not log:
        return {"message": "No hay sincronizaciones recientes"}
    return log


# ─── Publicar productos ──────────────────────────────────────────────────────
# NOTA: category_id y los atributos obligatorios de calzado dependen de la
# categoria exacta de SHEIN (consultar /shein/category-tree y
# /shein/attribute-template/{category_id} primero, igual que se hizo con
# MercadoLibre — ahi tambien las categorias/atributos se descubrieron
# iterando con la API real antes de fijarlos en el codigo).

def _build_spu_payload(producto: dict, variantes: list, stock_map: dict,
                        category_id: int, attributes: list = None) -> dict:
    """
    Construye el payload de POST /open-api/goods/product/publishOrEdit.
    SPU = modelo, SKC = color, SKU = color+talla (analogo a producto/variante del ERP).
    """
    nombre = (producto.get("nombre") or "").strip()
    descripcion = (producto.get("descripcion") or "").strip()[:4000]
    precio = float(producto.get("precio_menudeo") or 0)

    # Agrupar variantes por color -> un SKC por color, un SKU por talla dentro del SKC
    por_color: dict = {}
    for v in variantes:
        color = (v.get("color") or "Unico").strip()
        por_color.setdefault(color, []).append(v)

    skc_list = []
    for color, vs in por_color.items():
        fotos = []
        for v in vs:
            fotos.extend(v.get("imagenes") or ([v["foto_url"]] if v.get("foto_url") else []))
        fotos_shein = [_subir_imagen(u) for u in dict.fromkeys(fotos) if u][:12]

        sku_list = []
        for v in vs:
            talla = str(v.get("talla") or "").replace("_", ".")
            sku_list.append({
                "skuCode":      v.get("sku", ""),
                "size":         talla,
                "inventoryNum": stock_map.get(v["id"], 0),
                "price":        precio,
            })

        skc_list.append({
            "color":    color,
            "pictures": fotos_shein,
            "skuList":  sku_list,
        })

    payload = {
        "productName":   nombre[:100],
        "categoryId":    category_id,
        "description":   descripcion,
        "brandCode":     "",  # completar con /shein/brand-list si SHEIN lo exige
        "attributeList": attributes or [],
        "skcList":       skc_list,
    }
    return payload


@router.post("/publicar")
def publicar_producto(body: dict):
    """
    Body: { "producto_id": "uuid", "category_id": 12345, "attributes": [...], "solo_preview": true }
    category_id y attributes se obtienen de /shein/category-tree y /shein/attribute-template.
    """
    producto_id  = (body.get("producto_id") or "").strip()
    sku_interno  = (body.get("sku_interno") or "").strip().upper()
    category_id  = body.get("category_id")
    attributes   = body.get("attributes") or []
    solo_preview = bool(body.get("solo_preview", False))

    if not producto_id and not sku_interno:
        raise HTTPException(400, "Se requiere producto_id o sku_interno")
    if not category_id:
        raise HTTPException(400, "Se requiere category_id (consulta /shein/category-tree)")

    if producto_id:
        prods = supabase_get_all(f"productos?id=eq.{producto_id}&select=*&limit=1")
    else:
        prods = supabase_get_all(f"productos?sku_interno=eq.{sku_interno}&select=*&limit=1")
    if not prods:
        raise HTTPException(404, f"Producto no encontrado (sku={sku_interno or producto_id})")
    producto = prods[0]
    producto_id = producto_id or producto.get("id", "")

    variantes = supabase_get_all(f"variantes?producto_id=eq.{producto_id}&activa=eq.true&select=*")
    if not variantes:
        raise HTTPException(404, "Sin variantes activas para este producto")

    vids_str = ",".join(v["id"] for v in variantes)
    inv_rows = supabase_get_all(f"inventario?variante_id=in.({vids_str})&select=variante_id,cantidad")
    stock_map: dict = {}
    for row in inv_rows:
        vid = row.get("variante_id")
        if vid:
            stock_map[vid] = stock_map.get(vid, 0) + (row.get("cantidad") or 0)

    if solo_preview:
        # En preview no subimos imagenes de verdad (evita gastar cuota de transform-pic).
        payload_preview = {
            "productName": producto.get("nombre"),
            "categoryId":  category_id,
            "variaciones": len(variantes),
            "colores":     list({(v.get("color") or "Unico") for v in variantes}),
        }
        return {"preview": payload_preview}

    payload = _build_spu_payload(producto, variantes, stock_map, category_id, attributes)
    return shein_post("/open-api/goods/product/publishOrEdit", payload)
