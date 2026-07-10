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

# ─── Proxy de IP fija (Railway cambia de IP constantemente, SHEIN exige IP
# fija en whitelist) -- VM propia (Google Cloud Free Tier) corriendo tinyproxy
# con IP externa estatica reservada. Si SHEIN_PROXY_URL no esta configurada,
# las llamadas salen directo (sin proxy) para no romper nada en dev/local.
SHEIN_PROXY_URL = os.getenv("SHEIN_PROXY_URL", "")


def _shein_opener() -> urllib.request.OpenerDirector:
    if SHEIN_PROXY_URL:
        return urllib.request.build_opener(urllib.request.ProxyHandler({
            "http": SHEIN_PROXY_URL, "https": SHEIN_PROXY_URL,
        }))
    return urllib.request.build_opener()


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
            "language":       "es",
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
        # Requerido por algunos endpoints de goods (category-tree, brand-list);
        # el resto lo ignora sin problema.
        "language":       "es",
    }


def _shein_request(method: str, path: str, body: dict = None, usar_appid: bool = False) -> dict:
    url = f"{SHEIN_API_BASE}{path}"
    data = json.dumps(body or {}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=_headers(path, usar_appid), method=method)
    try:
        with _shein_opener().open(req, timeout=20) as r:
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
        with _shein_opener().open(req, timeout=20) as r:
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
def category_tree():
    """
    Categorías finales (leaf) habilitadas para esta tienda -- la API no acepta
    parent_id, siempre regresa el árbol completo de categorías del vendedor.
    Ruta real confirmada en el SDK oficial (sin "/category/" de por medio,
    ese segmento de mas es lo que rompia la firma).
    """
    try:
        return shein_post("/open-api/goods/query-category-tree", {})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/attribute-template/{product_type_id}")
def attribute_template(product_type_id: int):
    """
    Plantilla de atributos requeridos/opcionales para un product_type_id
    (se obtiene del árbol de categorías, /shein/category-tree). Hasta 10
    ids por llamada -- aqui solo se expone uno para simplificar.
    """
    try:
        return shein_post("/open-api/goods/query-attribute-template", {"product_type_id_list": [product_type_id]})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/colores/{product_type_id}")
def colores_disponibles(product_type_id: int):
    """
    Colores validos de SHEIN (attribute_id=27) para esta categoria -- para el
    selector de "revisar/cambiar color" del panel antes de publicar.
    """
    infos = _attribute_template_cached(product_type_id)
    for a in infos:
        if a.get("attribute_id") == _ATTR_COLOR:
            valores = a.get("attribute_value_info_list") or []
            colores = [{"id": v.get("attribute_value_id"), "nombre": v.get("attribute_value")} for v in valores]
            colores.sort(key=lambda c: c["nombre"] or "")
            return {"colores": colores}
    return {"colores": []}


@router.get("/publish-standard/{category_id}")
def publish_standard(category_id: int):
    """Requisitos de publicacion (idioma, moneda de costo, campos obligatorios) para una categoria."""
    try:
        return shein_post("/open-api/goods/query-publish-fill-in-standard", {"category_id": category_id})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/brand-list")
def brand_list():
    try:
        return shein_post("/open-api/goods/query-brand-list", {})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/site-list")
def site_list():
    try:
        return shein_post("/open-api/goods/query-site-list", {})
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

def _subir_imagen(url_imagen: str, image_type: int = 1, intentos: int = 4) -> tuple[str, str]:
    """
    Sube una imagen (URL de Cloudinary) al CDN de SHEIN. Devuelve (url_shein, error).
    Si todo sale bien, error es "". Si fallan todos los intentos, url_shein es ""
    y error trae el motivo real que dio SHEIN (para no adivinar "rate limit" cuando
    en realidad es, por ejemplo, que la foto no cumple sus requisitos de contenido).
    image_type: 1=principal, 2=detalle, 5=cuadro, 6=color, 7=detalle largo.
    Ruta y campo de respuesta ("transformed") confirmados contra el sandbox real.

    transform-pic tiene limite de velocidad estricto: llamadas seguidas sin pausa
    empiezan a fallar EN SILENCIO (respuesta 200 sin "info", no HTTPException) a
    partir de la ~5a-7a llamada dentro del mismo request -- bug real detectado:
    un modelo con 5 fotos x 3 colores dispara 21 llamadas seguidas y solo la
    primera pasaba, el resto se descartaba sin avisar (fotos faltantes en SHEIN,
    producto quedaba incompleto en borrador). Por eso reintenta con backoff y
    espacia cada llamada exitosa -- PERO si SHEIN responde con un "code" de
    rechazo explicito (ej. 1001001 "la foto no cumple los requisitos"), no tiene
    caso reintentar la MISMA imagen: siempre va a fallar igual, asi que se corta
    de inmediato y se reporta el motivo real.
    """
    ultimo_error = "error desconocido"
    url_imagen = _cloudinary_optimizar(url_imagen)
    for intento in range(intentos):
        try:
            resp = shein_post("/open-api/goods/transform-pic", {"image_type": image_type, "original_url": url_imagen})
            info = resp.get("info", {}) or {}
            url = info.get("transformed") or info.get("url") or ""
            if url:
                time.sleep(0.6)  # pacing: evita saturar el limite de velocidad en la siguiente llamada
                return url, ""
            # SHEIN a veces devuelve code="0"/msg="OK" (nivel superior "exitoso") pero
            # con info.transformed vacio y el motivo real en info.failure_reason -- ej.
            # "Descarga de imagen anormal" cuando el archivo es muy pesado (>3MB, PNG sin
            # comprimir de una foto de 2048x2048). Sin esto el usuario solo veia "OK (code=0)".
            razon = info.get("failure_reason") or ""
            codigo = resp.get("code")
            msg = resp.get("msg") or "sin detalle"
            ultimo_error = f"{razon or msg} (code={codigo})"
            if razon or codigo not in (None, "0", 0):
                # Rechazo explicito de SHEIN (ej. la foto no cumple sus requisitos, o el
                # archivo no se pudo descargar/procesar) -- no es transitorio, reintentar
                # con la misma imagen no cambia el resultado.
                print(f"[SHEIN] transform-pic rechazado (type={image_type}): {ultimo_error}")
                return "", ultimo_error
            print(f"[SHEIN] transform-pic sin url util (intento {intento + 1}/{intentos}, type={image_type}): {resp}")
        except HTTPException as e:
            ultimo_error = f"HTTP {e.status_code}: {e.detail}"
            print(f"[SHEIN] transform-pic error (intento {intento + 1}/{intentos}, type={image_type}): {e.detail}")
        time.sleep(1.2 * (intento + 1))
    return "", ultimo_error


def _cloudinary_optimizar(url_imagen: str) -> str:
    """
    Convierte a JPEG y comprime automaticamente via Cloudinary antes de mandar la
    imagen a SHEIN. Confirmado (log real) que SHEIN rechaza archivos pesados con
    "Descarga de imagen anormal" -- una foto de 2048x2048 en PNG sin comprimir pesaba
    3.27MB, arriba del limite de SHEIN (~3MB). f_jpg tambien aplana transparencia
    sobre fondo blanco (los PNG del catalogo no deberian tener transparencia real,
    pero por si acaso). q_auto reduce el peso sin tocar la resolucion.
    """
    marcador = "/image/upload/"
    if marcador not in url_imagen:
        return url_imagen
    return url_imagen.replace(marcador, f"{marcador}f_jpg,q_auto/", 1)


def _cloudinary_recorte_80x80(url_imagen: str) -> str:
    """
    La imagen de bloque de color (type=6) exige un tamaño EXACTO de 80x80px
    (confirmado contra la API real) -- transform-pic no la genera desde una
    foto normal. En vez de procesar la imagen nosotros mismos (Pillow no se
    instala de forma confiable en Railway para este proyecto -- mismo
    problema historico que cryptography/PyJWT, confirmado con un
    ModuleNotFoundError en produccion), se le pide el recorte directamente
    a Cloudinary via parametros en la URL (ya alojamos ahi las fotos).
    """
    marcador = "/image/upload/"
    if marcador not in url_imagen:
        return url_imagen
    return url_imagen.replace(marcador, f"{marcador}c_fill,g_auto,w_80,h_80/", 1)


# Requisitos OFICIALES confirmados directo del portal de SHEIN (texto exacto visto
# en la pantalla de edicion de un producto real):
#   "Imagenes de detalles hasta 11, proporcion entre 3:4 y 1:1, con un tamano de
#    pixeles de 900px-2200px; la imagen cuadrada debe ser de 900px*900px a
#    2200px*2200px; la imagen de bloques de color debe ser de 80px*80px."
# La "imagen principal" (type=1) es en realidad el primer slot de la MISMA columna
# "Imagenes de detalles" -- comparte el mismo requisito 900-2200px, no es un
# requisito aparte (el numero 1340x1785 encontrado antes en una guia externa
# NO aplicaba). Se usa c_fit (no recorta, solo ajusta tamano preservando
# proporcion) para type=1/2, y c_fill (fuerza cuadrado) solo para type=5.

def _cloudinary_ajustar_detalle(url_imagen: str) -> str:
    """Imagen principal (type=1) y de detalle (type=2): ajusta a 1500px (dentro
    del rango 900-2200px oficial) sin recortar, preservando la proporcion original."""
    marcador = "/image/upload/"
    if marcador not in url_imagen:
        return url_imagen
    return url_imagen.replace(marcador, f"{marcador}c_fit,w_1500,h_1500/", 1)


def _cloudinary_ajustar_cuadrada(url_imagen: str) -> str:
    """Imagen cuadrada (type=5): SHEIN exige que sea cuadrada, 900x900 a 2200x2200px."""
    marcador = "/image/upload/"
    if marcador not in url_imagen:
        return url_imagen
    return url_imagen.replace(marcador, f"{marcador}c_fill,g_auto,w_1500,h_1500/", 1)


@router.get("/mis-productos")
def mis_productos(page: int = 1):
    """Productos ya publicados en esta tienda (para ver como quedo configurado un modelo real)."""
    try:
        return shein_post("/open-api/openapi-business-backend/product/query", {"pageNum": page, "pageSize": 50})
    except HTTPException as e:
        return {"ok": False, "error": e.detail}


@router.get("/producto/{spu_name}")
def detalle_producto(spu_name: str, language: str = "es"):
    """
    Detalle completo (spu/skc/sku + atributos) de un producto ya publicado, por su spuName.
    Prueba snake_case y camelCase para los nombres de campo -- la API de SHEIN no es
    consistente entre endpoints (unos usan pageNum, otros product_type_id_list).
    """
    variantes = [
        {"language_list": [language], "spu_name": spu_name},
        {"languageList": [language], "spuName": spu_name},
        {"language_list": [language], "spuName": spu_name},
        {"languageList": [language], "spu_name": spu_name},
    ]
    resultados = []
    for v in variantes:
        try:
            resp = shein_post("/open-api/goods/spu-info", v)
        except HTTPException as e:
            resp = {"error": e.detail}
        resultados.append({"body_enviado": v, "respuesta": resp})
        if resp.get("code") in (0, "0"):
            return {"variante_exitosa": v, "respuesta": resp}
    return {"ok": False, "ninguna_variante_funciono": True, "intentos": resultados}


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
# Al publicar mandamos supplier_sku = nuestro SKU del ERP (sku_code lo asigna
# SHEIN). /product/query es rapido pero SOLO devuelve el skuCode opaco de
# SHEIN (ej. "I845m8bpegk8") -- NO trae supplierSku, asi que nunca podia
# emparejar contra el SKU del ERP (bug real, confirmado inspeccionando la
# respuesta cruda). El unico endpoint que expone el mapeo supplierSku<->skuCode
# es /goods/spu-info, y SOLO funciona para SPUs ya APROBADOS por SHEIN (para
# los "pendientes de revision" da error "unable to obtain skc information") --
# tambien confirmado: la documentacion de change-inventory dice explicitamente
# que solo se puede modificar inventario de SKUs aprobados. Por eso hay que
# consultar spu-info por cada SPU unico antes de poder sincronizar.

def _spu_info(spu_name: str) -> dict | None:
    """Detalle completo de un SPU (solo funciona si ya fue aprobado por SHEIN).
    Body confirmado contra la API real: languageList/spuName (camelCase)."""
    try:
        resp = shein_post("/open-api/goods/spu-info", {"languageList": ["es"], "spuName": spu_name})
    except HTTPException:
        return None
    if resp.get("code") not in (0, "0"):
        return None
    return resp.get("info") or {}


def _skus_shein() -> list:
    """Devuelve [{"skuCode","supplierSku","skcName","spuName"}] de todos los
    SKUs publicados en SHEIN, consultando spu-info por cada SPU unico (con
    pacing para no saturar el limite de velocidad, mismo motivo que en la
    subida de imagenes)."""
    spu_names = set()
    page = 1
    while True:
        try:
            # Ruta y nombres de parametro (camelCase) confirmados en el SDK oficial --
            # este endpoint vive en el modulo "openapi-business-backend", no en "goods".
            resp = shein_post("/open-api/openapi-business-backend/product/query", {"pageNum": page, "pageSize": 100})
        except HTTPException:
            break
        info = resp.get("info", {}) or {}
        # Forma real confirmada contra el sandbox: info.data = [{"skcName","skuCodeList","spuName"}, ...]
        items = info.get("data") or []
        if not items:
            break
        for prod in items:
            nombre_spu = prod.get("spuName")
            if nombre_spu:
                spu_names.add(nombre_spu)
        if len(items) < 100:
            break
        page += 1
        if page > 50:  # tope de seguridad
            break

    resultado = []
    for spu_name in spu_names:
        detalle = _spu_info(spu_name)
        time.sleep(0.5)
        if not detalle:
            continue
        for skc in detalle.get("skcInfoList") or []:
            for sku in skc.get("skuInfoList") or []:
                supplier_sku = sku.get("supplierSku") or ""
                sku_code = sku.get("skuCode") or ""
                if supplier_sku and sku_code:
                    resultado.append({
                        "skuCode": sku_code, "supplierSku": supplier_sku,
                        "skcName": skc.get("skcName"), "spuName": spu_name,
                    })
    return resultado


def _skus_shein_cached() -> list:
    """_skus_shein() tarda varios minutos (spu-info por cada SPU historico) --
    se cachea para que el listado de "productos sin publicar" y el sync de
    inventario no tengan que recorrer todo de nuevo en cada llamada."""
    cached = cache_get("shein_skus_publicados")
    if cached is not None:
        return cached
    resultado = _skus_shein()
    cache_set("shein_skus_publicados", resultado, ttl=1200)
    return resultado


def _hacer_escaneo_skus_shein():
    """Corre _skus_shein() (varios minutos) en background: GET /catalogo-sin-publicar
    no puede esperarlo directamente porque excede el limite de gateway de Railway (5 min,
    confirmado con un 502 real). Se marca "escaneando" mientras corre para no lanzar
    el mismo escaneo dos veces si el panel pregunta de nuevo antes de que termine."""
    try:
        resultado = _skus_shein()
        cache_set("shein_skus_publicados", resultado, ttl=1200)
    finally:
        cache_set("shein_skus_escaneando", None, ttl=1)


# ─── Publicación masiva (mismo patron que /ml/publicar-catalogo) ───────────

def _productos_sin_publicar_shein() -> list:
    """Productos activos del ERP cuyo SKU no aparece en ningun supplierSku ya
    publicado en SHEIN todavia (mismo criterio que _productos_sin_publicar en
    mercadolibre.py: el sku_interno es el SKU completo menos color y talla).

    OJO: la API de SHEIN solo permite ver productos ya APROBADOS (nada
    "pendiente de revision" -- confirmado con SHEIN, no es un bug nuestro).
    Por eso, ademas del escaneo de SKUs aprobados, se excluye tambien
    cualquier producto con un registro exitoso en `shein_publicaciones`
    (nuestro propio historial local) -- si no, cada corrida de "publicar
    catalogo completo" volveria a mandar duplicados de todo lo que sigue
    en cola de revision desde la corrida anterior."""
    productos = supabase_get_all("productos?activo=eq.true&select=id,sku_interno,nombre,categoria,precio_menudeo,precio_mayoreo6")
    publicados_norm = set()
    for item in _skus_shein_cached():
        sku = _norm_sku(item.get("supplierSku") or "")
        partes = sku.split("-")
        if len(partes) >= 3:
            publicados_norm.add("-".join(partes[:-2]))

    ya_enviados_ids = {
        r["producto_id"] for r in supabase_get_all("shein_publicaciones?exito=eq.true&select=producto_id")
    }

    sin_publicar = []
    for p in productos:
        sku_interno = (p.get("sku_interno") or "").strip()
        if not sku_interno:
            continue
        if _norm_sku(sku_interno) in publicados_norm:
            continue
        if p["id"] in ya_enviados_ids:
            continue
        sin_publicar.append(p)
    return sin_publicar


@router.get("/catalogo-sin-publicar")
def catalogo_sin_publicar_shein(background_tasks: BackgroundTasks):
    """Lista de productos del ERP sin publicar en SHEIN, con el conteo de fotos
    por color (SHEIN exige al menos foto principal+cuadrada, usamos 1 como
    minimo de referencia -- a diferencia de ML no requerimos 3).
    Si la cache de SKUs publicados esta fria (recien desplegado o expiro el TTL),
    dispara el escaneo en background y responde de inmediato con "escaneando":true
    en vez de bloquear la request -- el escaneo completo puede tardar varios
    minutos y Railway corta las requests a los 5 min."""
    if cache_get("shein_skus_publicados") is None:
        if not cache_get("shein_skus_escaneando"):
            cache_set("shein_skus_escaneando", True, ttl=600)
            background_tasks.add_task(_hacer_escaneo_skus_shein)
        return {"escaneando": True, "total": 0, "listos": 0, "productos": []}

    productos = _productos_sin_publicar_shein()
    if not productos:
        return {"total": 0, "productos": []}

    ids_str   = ",".join(p["id"] for p in productos)
    variantes = supabase_get_all(f"variantes?producto_id=in.({ids_str})&activa=eq.true&select=producto_id,color,imagenes,foto_url")

    fotos_por_color: dict = {}
    for v in variantes:
        pid = v.get("producto_id")
        if not pid:
            continue
        color = v.get("color") or "Sin color"
        fotos = list(v.get("imagenes") or [])
        if not fotos and v.get("foto_url"):
            fotos = [v["foto_url"]]
        key = (pid, color)
        fotos_por_color.setdefault(key, set()).update(u for u in fotos if u)

    conteos_por_producto: dict = {}
    for (pid, color), fotos in fotos_por_color.items():
        conteos_por_producto.setdefault(pid, []).append(len(fotos))

    resultado = []
    for p in productos:
        conteos = conteos_por_producto.get(p["id"], [0])
        min_fotos = min(conteos) if conteos else 0
        precio_menudeo = float(p.get("precio_menudeo") or 0)
        precio_mayoreo6 = p.get("precio_mayoreo6")
        precio_sugerido = float(precio_mayoreo6) if precio_mayoreo6 else round(precio_menudeo - 70, 2)
        resultado.append({
            "id": p["id"], "sku_interno": p.get("sku_interno"), "nombre": p.get("nombre"),
            "categoria": p.get("categoria"), "num_colores": len(conteos),
            "num_fotos": min_fotos, "listo": min_fotos >= 1,
            "precio_sugerido": precio_sugerido,
        })
    resultado.sort(key=lambda p: (not p["listo"], -p["num_fotos"]))

    return {
        "total": len(resultado),
        "listos": sum(1 for p in resultado if p["listo"]),
        "productos": resultado,
    }


def _hacer_publicar_catalogo_shein(producto_ids: list, producto_overrides: dict = None):
    """producto_overrides (opcional): {producto_id: {"precio": 220, "titulo": "..."}}
    -- precio/titulo editados a mano por producto en el panel antes de publicar."""
    producto_overrides = producto_overrides or {}
    pendientes = _productos_sin_publicar_shein()
    if producto_ids:
        ids_set = set(producto_ids)
        productos = [p for p in pendientes if p["id"] in ids_set]
    else:
        productos = pendientes

    resumen = {"ts": time.time(), "total_productos": len(productos), "publicados": 0, "con_error": 0, "detalle": [], "en_progreso": True}
    # Guardar el resumen DESPUES DE CADA PRODUCTO (no solo al final): si el proceso
    # se cae a la mitad (redeploy de Railway, reinicio, etc.) el log en cache ya
    # tiene registrado hasta donde se alcanzo a publicar -- antes se perdia TODO
    # el avance porque el cache_set solo corria una vez, al terminar el for.
    cache_set("shein_publicar_catalogo_log", resumen, ttl=3600)
    cache_set("shein_publicar_catalogo_cancelar", False, ttl=21600)  # limpiar cancelacion de una corrida anterior
    for p in productos:
        if cache_get("shein_publicar_catalogo_cancelar"):
            resumen["detalle"].append({"cancelado": True, "nota": "Publicacion masiva cancelada por el usuario"})
            break
        over = producto_overrides.get(p["id"]) or {}
        try:
            res = publicar_producto({
                "producto_id":  p["id"],
                "solo_preview": False,
                "precio":       over.get("precio") or None,
                "nombre":       over.get("titulo") or None,
                "_origen":      "masiva",
            })
            ok = res.get("info", {}).get("success") is True
            if ok:
                resumen["publicados"] += 1
            else:
                resumen["con_error"] += 1
            resumen["detalle"].append({
                "sku_interno": p.get("sku_interno"), "nombre": p.get("nombre"),
                "exito": ok, "advertencias_fotos": res.get("_advertencias_fotos") or [],
            })
        except HTTPException as e:
            resumen["con_error"] += 1
            resumen["detalle"].append({"sku_interno": p.get("sku_interno"), "nombre": p.get("nombre"), "error": e.detail})
        except Exception as e:
            resumen["con_error"] += 1
            resumen["detalle"].append({"sku_interno": p.get("sku_interno"), "nombre": p.get("nombre"), "error": str(e)})
        cache_set("shein_publicar_catalogo_log", resumen, ttl=3600)
        # Pausa entre modelos -- cada uno ya sube varias fotos con su propio
        # pacing, esto solo evita encimar el arranque de un modelo con el cierre
        # de subida de imagenes del anterior.
        time.sleep(1.5)
    resumen["en_progreso"] = False
    cache_set("shein_publicar_catalogo_log", resumen, ttl=3600)
    cache_set("shein_skus_publicados", None, ttl=1)  # invalidar cache: hay productos nuevos publicados


@router.post("/publicar-catalogo")
def publicar_catalogo_shein(body: dict, background_tasks: BackgroundTasks):
    """
    Publica en SHEIN todos los productos activos del ERP que todavia no tienen
    ninguna publicacion. Se ejecuta en background (una publicacion completa por
    producto, con varias subidas de foto cada una).
    Body: { "producto_ids": ["uuid", ...] (opcional, si no se manda son todos los pendientes),
            "producto_overrides": {"uuid": {"precio": 220, "titulo": "..."}} (opcional,
            precio/titulo editados a mano por producto) }
    """
    producto_ids       = body.get("producto_ids") or None
    producto_overrides = body.get("producto_overrides") or {}
    pendientes   = len(_productos_sin_publicar_shein())
    total = len(producto_ids) if producto_ids else pendientes
    background_tasks.add_task(_hacer_publicar_catalogo_shein, producto_ids, producto_overrides)
    return {"message": f"Publicacion masiva iniciada para {total} producto(s). Consulta /shein/publicar-catalogo/log en unos minutos.", "pendientes": pendientes}


@router.get("/publicar-catalogo/log")
def publicar_catalogo_log_shein():
    log = cache_get("shein_publicar_catalogo_log")
    if not log:
        return {"message": "Todavia no hay resultados. ¿Ya iniciaste la publicacion masiva?"}
    return log


@router.post("/publicar-catalogo/cancelar")
def cancelar_publicar_catalogo_shein():
    """Detiene la publicacion masiva en curso antes del siguiente producto (no
    interrumpe a medias una publicacion ya en marcha, para no dejar un producto
    a medio subir). Antes la unica forma de detenerla era forzar un redeploy."""
    cache_set("shein_publicar_catalogo_cancelar", True, ttl=21600)
    return {"ok": True, "message": "Se cancelara antes de procesar el siguiente producto pendiente."}


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
        sin_match, errores, actualizados = [], [], []

        # change-inventory es UNA actualizacion por llamada (no batch): el
        # cuerpo real es {"updateSkuInventoryQuantityRequests": {"skuCodeList":
        # <sku_code>, "warehouseCodeList": <warehouse_code>, "saleInventory":
        # <cantidad>}} -- confirmado contra el SDK oficial (Python). El campo
        # "saleInventory" (cantidad absoluta a dejar) y "changeInventoryQuantity"
        # (delta) son mutuamente excluyentes, se usa solo saleInventory.
        # La estructura anterior ("skuStockList" como lista) no existe en la
        # API real -- por eso SHEIN respondia "inventory data cannot be empty"
        # (no encontraba el campo que realmente espera).
        for item in publicadas:
            sku_code = item["skuCode"]
            sku_norm = _norm_sku(item["supplierSku"])
            if sku_norm not in stock_erp:
                sin_match.append({"skuCode": sku_code, "supplierSku": item["supplierSku"]})
                continue
            cantidad = stock_erp[sku_norm]
            # updateSkuInventoryQuantityRequests debe ser una LISTA (no un objeto
            # suelto) -- confirmado con el error real de SHEIN: "Cannot deserialize
            # ArrayList... from Object value (token START_OBJECT)". El SDK de
            # referencia (Python) lo manda como objeto suelto, pero eso no es lo
            # que el backend de SHEIN acepta en la practica.
            payload = {
                "updateSkuInventoryQuantityRequests": [
                    {
                        "skuCodeList":       [sku_code],
                        "warehouseCodeList": [warehouse_code] if warehouse_code else [],
                        "saleInventory":     cantidad,
                    }
                ]
            }
            try:
                resp = shein_post("/open-api/gsp/goods/change-inventory", payload)
                if resp.get("code") in (0, "0"):
                    actualizados.append({"skuCode": sku_code, "inventoryNum": cantidad})
                else:
                    errores.append({"skuCode": sku_code, "error": resp})
            except HTTPException as e:
                errores.append({"skuCode": sku_code, "error": e.detail})
            time.sleep(0.4)  # pacing -- mismo motivo que en la subida de imagenes

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
# Esquema real confirmado contra la documentacion oficial de SHEIN (Postman
# collection oficial) + contra un producto real ya publicado en esta tienda
# (via /shein/producto/{spu_name}). Puntos clave:
#   - site_list (no "publish_site"): [{"main_site":"shein","sub_site_list":["shein-mx"]}]
#   - SKC.image_info = {"image_info_list":[{"image_sort","image_type"(1/2/5/6),"image_url"}]}
#   - SKC.sale_attribute (objeto) = color; SKU.sale_attribute_list (lista) = talla
#   - SKU.supplier_sku = nuestro SKU del ERP; SKU.sku_code se deja "" (lo asigna SHEIN)
#   - product_attribute_list puede ir vacio: attribute_status=3 es lo obligatorio,
#     todo lo visto en /shein/attribute-template para tacones era status=2 (opcional)

SITE_ABBR = "shein-mx"
MONEDA    = "MXN"

# categoria ERP -> (category_id, product_type_id) de SHEIN, descubiertos en
# /shein/category-tree (arbol real de esta tienda, "Zapatos de Mujer")
_CATEGORY_SHEIN = {
    "tacones":     (1750, 1690),  # Zapatos de tacón de mujer
    "sandalias":   (1751, 76),    # Sandalias de tacón para mujer
    "botas":       (1748, 77),    # Botas y Botines de Mujer
    "botines":     (1748, 77),    # Botas y Botines de Mujer
    "flats":       (1881, 83),    # Bailarinas de mujer
    "plataformas": (1749, 1689),  # Cuñas & plataformas de mujer
    "tenis":       (2863, 798),   # Zapatillas de deporte para mujer
}
_CATEGORY_SHEIN_DEFAULT = _CATEGORY_SHEIN["tacones"]

# attribute_id fijos de SHEIN para calzado (confirmados iguales en varias
# categorias de "Zapatos de Mujer"): 27=Color (SKC), 87=Talla (SKU)
_ATTR_COLOR = 27
_ATTR_TALLA = 87


def _default_language_cached(category_id: int) -> str:
    """
    Idioma por defecto de la tienda para esta categoria -- el titulo/descripcion
    multi-idioma DEBEN incluir una entrada en este idioma o SHEIN rechaza el
    publish con "el titulo no puede estar vacio", aunque se haya mandado texto
    en otro idioma (confirmado empiricamente contra el sandbox).
    """
    key = f"shein_default_lang_{category_id}"
    cached = cache_get(key)
    if cached is not None:
        return cached
    try:
        resp = shein_post("/open-api/goods/query-publish-fill-in-standard", {"category_id": category_id})
        idioma = (resp.get("info") or {}).get("default_language") or "es"
    except Exception:
        idioma = "es"
    cache_set(key, idioma, ttl=3600)
    return idioma


def _attribute_template_cached(product_type_id: int) -> list:
    """Plantilla de atributos de una categoria, cacheada 1h (cambia poco)."""
    key = f"shein_attrtpl_{product_type_id}"
    cached = cache_get(key)
    if cached is not None:
        return cached
    resp = shein_post("/open-api/goods/query-attribute-template", {"product_type_id_list": [product_type_id]})
    data = (resp.get("info") or {}).get("data") or []
    infos = data[0].get("attribute_infos", []) if data else []
    cache_set(key, infos, ttl=3600)
    return infos


def _buscar_attribute_value_id(product_type_id: int, attribute_id: int, texto: str) -> int | None:
    """Busca el attribute_value_id cuyo texto coincide (exacto o parcial) con `texto`."""
    if not texto:
        return None
    texto_norm = texto.strip().lower()
    infos = _attribute_template_cached(product_type_id)
    for a in infos:
        if a.get("attribute_id") != attribute_id:
            continue
        valores = a.get("attribute_value_info_list") or []
        # 1) coincidencia exacta
        for v in valores:
            if (v.get("attribute_value") or "").strip().lower() == texto_norm:
                return v.get("attribute_value_id")
        # 2) coincidencia parcial (por si el texto del ERP trae variaciones)
        for v in valores:
            val = (v.get("attribute_value") or "").strip().lower()
            if val and (val in texto_norm or texto_norm in val):
                return v.get("attribute_value_id")
    return None


def _talla_a_attribute_value_id(product_type_id: int, talla: str) -> int | None:
    """SHEIN espera la talla como 'MX{numero}', ej. talla '22.5' -> 'MX22.5'."""
    talla_limpia = (talla or "").replace("_", ".").strip()
    if not talla_limpia:
        return None
    return _buscar_attribute_value_id(product_type_id, _ATTR_TALLA, f"MX{talla_limpia}")


# Sinónimos: el ERP usa terminos coloquiales que SHEIN no siempre tiene
# igual (ej. "Oro"/"Plata" -- SHEIN usa "Dorado"/"Plateado"). Se prueban
# ANTES de la coincidencia parcial generica para evitar falsos positivos
# (ej. "Oro" -> "Oro rosa" por coincidencia de substring, un color distinto).
_COLOR_SINONIMOS = {
    "oro": "Dorado", "dorado": "Dorado", "oro metalico": "Dorado",
    "plata": "Plateado", "plateado": "Plateado",
    "cafe": "Marrón", "café": "Marrón", "marron": "Marrón", "moka": "Marrón",
    "madera": "Marrón", "cafe charol": "Marrón", "cafe serpiente": "Marrón",
    "vino": "Burdeos", "guinda": "Burdeos", "vino charol": "Burdeos",
    "hueso": "Beis", "nude": "Beis", "capuchino": "Beis",
    "latte": "Beis", "miga": "Beis", "beige": "Beis",
    "tang": "Camel", "tan": "Camel", "cognac": "Camel", "cogñac": "Camel",
    "maquillaje": "Caqui", "natural": "Caqui",
    "inox": "Gris",
    "azul marino": "Azul Marino", "aul marino": "Azul Marino",
    "mezclilla": "Azul Índigo", "denim": "Azul Índigo", "jean": "Azul Índigo",
}


# Sinónimos "aprendidos": los que el usuario confirma/cambia desde el editor
# de colores del panel antes de publicar se guardan en Supabase (tabla
# configuracion, clave shein_color_sinonimos) y tienen PRIORIDAD sobre
# _COLOR_SINONIMOS y la coincidencia parcial -- asi no hay que volver a
# preguntar por el mismo color de la misma categoria. Clave = "{product_type_id}:{color en minusculas}".

def _load_color_sinonimos_aprendidos() -> dict:
    try:
        rows = supabase_get("configuracion?clave=eq.shein_color_sinonimos&select=valor")
        if rows and rows[0].get("valor"):
            return json.loads(rows[0]["valor"])
    except Exception:
        pass
    return {}


def _guardar_color_sinonimo_aprendido(product_type_id: int, color_erp: str, attribute_value_id: int):
    color_norm = (color_erp or "").strip().lower()
    if not color_norm or not attribute_value_id:
        return
    clave = f"{product_type_id}:{color_norm}"
    try:
        actuales = _load_color_sinonimos_aprendidos()
        actuales[clave] = attribute_value_id
        valor = json.dumps(actuales)
        existing = supabase_get("configuracion?clave=eq.shein_color_sinonimos")
        if existing:
            supabase_patch("configuracion?clave=eq.shein_color_sinonimos", {"valor": valor})
        else:
            supabase_post("configuracion", {"clave": "shein_color_sinonimos", "valor": valor})
    except Exception as e:
        print(f"[SHEIN] Error guardando sinonimo de color aprendido: {e}")


def _color_a_attribute_value_id(product_type_id: int, color: str, aprendidos: dict = None) -> int | None:
    color_norm = (color or "").strip().lower()
    aprendidos = _load_color_sinonimos_aprendidos() if aprendidos is None else aprendidos
    clave = f"{product_type_id}:{color_norm}"
    if clave in aprendidos:
        return aprendidos[clave]
    if color_norm in _COLOR_SINONIMOS:
        encontrado = _buscar_attribute_value_id(product_type_id, _ATTR_COLOR, _COLOR_SINONIMOS[color_norm])
        if encontrado:
            return encontrado
    return _buscar_attribute_value_id(product_type_id, _ATTR_COLOR, color)


def _build_spu_payload(producto: dict, variantes: list, stock_map: dict,
                        category_id: int, product_type_id: int, overrides: dict = None) -> tuple[dict, list]:
    """
    Construye el payload real de POST /open-api/goods/product/publishOrEdit.
    SPU = modelo, SKC = color, SKU = color+talla (analogo a producto/variante del ERP).
    Devuelve (payload, advertencias) -- advertencias lista las fotos que no se
    pudieron subir a SHEIN tras reintentar, para que el usuario lo sepa en vez
    de que el producto quede incompleto en silencio.

    overrides (opcional, valores editados por el usuario en el panel antes de
    publicar): {"nombre", "descripcion", "precio", "fotos_excluidas": [urls],
    "color_overrides": {"COLOR_ERP": attribute_value_id}}.
    """
    overrides = overrides or {}
    advertencias: list = []
    nombre = (overrides.get("nombre") or producto.get("nombre") or "").strip()
    descripcion = (overrides.get("descripcion") or producto.get("descripcion") or "").strip() or nombre
    fotos_excluidas = set(overrides.get("fotos_excluidas") or [])
    color_overrides = overrides.get("color_overrides") or {}
    aprendidos = _load_color_sinonimos_aprendidos()
    # SHEIN semi-managed: el vendedor solo declara UN precio (lo que SHEIN le
    # paga); SHEIN le pone su propio margen al cliente final. Ese precio es
    # el de mayoreo variado 6+ pares (NO precio_corrida, ni el "costo" del
    # ERP -- ese es el costo de compra al proveedor, no debe mandarse a
    # SHEIN). Si el modelo no tiene precio_mayoreo6 capturado, se calcula
    # como precio_menudeo - $70 (formula indicada por el usuario). El usuario
    # puede sobreescribir este calculo desde el panel antes de publicar.
    precio_override = overrides.get("precio")
    if precio_override:
        precio = float(precio_override)
    else:
        precio_menudeo = float(producto.get("precio_menudeo") or 0)
        precio_mayoreo6 = producto.get("precio_mayoreo6")
        precio = float(precio_mayoreo6) if precio_mayoreo6 else round(precio_menudeo - 70, 2)
    # Ajuste opcional (publicacion masiva): igual que en ML, por si se quiere
    # sumar/aumentar el precio declarado a SHEIN de todo un lote de un jalon.
    ajuste_tipo = overrides.get("ajuste_tipo")
    ajuste_valor = overrides.get("ajuste_valor")
    if ajuste_tipo == "fijo" and ajuste_valor:
        precio = round(precio + float(ajuste_valor), 2)
    elif ajuste_tipo == "porcentaje" and ajuste_valor:
        precio = round(precio * (1 + float(ajuste_valor) / 100), 2)
    sku_modelo = (producto.get("sku_interno") or "").strip()

    # Dimensiones/peso de paquete por defecto para calzado (cm/gramos) -- el ERP
    # no captura esto por modelo; son valores tipicos de caja de zapatos.
    # length/width/height son string (cm); weight es numerico (double, gramos)
    # -- confirmado en la documentacion oficial de publishOrEdit.
    DIM_DEFAULT = {"length": "30.50", "width": "18.00", "height": "10.00", "weight": 400}

    por_color: dict = {}
    for v in variantes:
        color = (v.get("color") or "Unico").strip()
        por_color.setdefault(color, []).append(v)

    multi_skc = len(por_color) > 1

    skc_list = []
    for color, vs in por_color.items():
        fotos = []
        for v in vs:
            fotos.extend(v.get("imagenes") or ([v["foto_url"]] if v.get("foto_url") else []))
        fotos_unicas = [u for u in dict.fromkeys(fotos) if u and u not in fotos_excluidas]

        # Minimo exigido por SKC: 1 imagen principal (type=1) + 1 cuadrada (type=5),
        # ambas generadas de la MISMA foto principal (confirmado que type=5
        # convierte bien desde una foto normal de producto). Si hay mas de un
        # color (SKC), tambien exige 1 imagen de bloque de color (type=6) --
        # esa SI requiere una foto ya cuadrada/aislada (80x80), asi que se
        # intenta pero se omite en silencio si SHEIN la rechaza (fallo
        # conocido, pendiente de generar un recorte cuadrado real).
        image_info_list = []
        foto_principal = fotos_unicas[0] if fotos_unicas else None
        if foto_principal:
            for tipo in [1, 5]:
                # type=1 (principal): 900-2200px, respeta proporcion. type=5 (cuadrada):
                # 900x900 a 2200x2200px, debe ser CUADRADA -- confirmado en el texto
                # oficial del portal de SHEIN.
                foto_ajustada = _cloudinary_ajustar_cuadrada(foto_principal) if tipo == 5 else _cloudinary_ajustar_detalle(foto_principal)
                url_shein, error = _subir_imagen(foto_ajustada, image_type=tipo)
                if url_shein:
                    image_info_list.append({"image_sort": len(image_info_list) + 1, "image_type": tipo, "image_url": url_shein})
                else:
                    # type=1 y type=5 son obligatorios -- SHEIN rechaza el SKC completo sin ellos
                    # ("SKC debe tener solo una imagen cuadrada" es su mensaje tanto para 0 como para >1).
                    # Mejor fallar aqui con el motivo REAL de SHEIN que mandar un payload que se sabe invalido.
                    raise HTTPException(502, f"No se pudo subir la foto principal de '{color}' a SHEIN "
                                              f"(type={tipo}): {error}")
            if multi_skc:
                # Recorte 80x80 via Cloudinary (no procesamiento local) + transform-pic normal
                url_swatch, error = _subir_imagen(_cloudinary_recorte_80x80(foto_principal), image_type=6)
                if url_swatch:
                    image_info_list.append({"image_sort": len(image_info_list) + 1, "image_type": 6, "image_url": url_swatch})
                else:
                    advertencias.append(f"{color}: no se pudo subir la imagen de color (swatch 80x80) -- {error}")
        # Fotos adicionales (distintas a la principal) como "detalle" (type=2): 900-2200px
        for i, url in enumerate(fotos_unicas[1:10], start=2):
            url_shein, error = _subir_imagen(_cloudinary_ajustar_detalle(url), image_type=2)
            if url_shein:
                image_info_list.append({"image_sort": len(image_info_list) + 1, "image_type": 2, "image_url": url_shein})
            else:
                advertencias.append(f"{color}: no se pudo subir la foto #{i} de {len(fotos_unicas)} -- {error}")

        color_value_id = color_overrides.get(color) or _color_a_attribute_value_id(product_type_id, color, aprendidos)
        if not color_value_id:
            raise HTTPException(422, f"No se encontro un color de SHEIN equivalente a '{color}' "
                                      f"para esta categoria. Usa el editor de colores en el panel antes de publicar, "
                                      f"o revisa /shein/colores/{product_type_id}.")
        # Se guarda como aprendido (el usuario ya lo confirmo o lo detecto el auto-match) para no volver a preguntar.
        _guardar_color_sinonimo_aprendido(product_type_id, color, color_value_id)

        sku_list = []
        for v in vs:
            talla = str(v.get("talla") or "")
            talla_value_id = _talla_a_attribute_value_id(product_type_id, talla)
            if not talla_value_id:
                raise HTTPException(422, f"No se encontro la talla 'MX{talla}' en SHEIN para esta categoria "
                                          f"(color {color}). Revisa /shein/attribute-template/{product_type_id} "
                                          f"(attribute_id={_ATTR_TALLA}).")
            sku_list.append({
                "sku_code":            "",
                "supplier_sku":        v.get("sku", ""),
                "mall_state":          1,
                "stop_purchase":       1,
                "sale_attribute_list": [{"attribute_id": _ATTR_TALLA, "attribute_value_id": talla_value_id}] if talla_value_id else [],
                "price_info_list":     [{"base_price": precio, "currency": MONEDA, "sub_site": SITE_ABBR}],
                "stock_info_list":     [{"inventory_num": stock_map.get(v["id"], 0)}],
                # cost_info es un OBJETO singular (no lista) -- confirmado en la
                # documentacion oficial de publishOrEdit. cost_price es string.
                # Mismo "precio" que price_info_list -- es lo que SHEIN le paga
                # al vendedor en el modelo semi-managed, NO el costo de compra
                # al proveedor (ese es interno del ERP y no se manda a SHEIN).
                "cost_info":           {"currency": MONEDA, "cost_price": f"{precio:.2f}"},
                "length": DIM_DEFAULT["length"], "width": DIM_DEFAULT["width"],
                "height": DIM_DEFAULT["height"], "weight": DIM_DEFAULT["weight"],
                "image_info":          None,
            })

        skc_entry = {
            "sale_attribute":    {"attribute_id": _ATTR_COLOR, "attribute_value_id": color_value_id} if color_value_id else None,
            "skc_title":         None,
            "sku_list":          sku_list,
            "shelf_require":     "0",
            "shelf_way":         "1",
            "hope_on_sale_date": None,
            "supplier_code":     sku_modelo,
        }
        if image_info_list:
            skc_entry["image_info"] = {"image_info_list": image_info_list}
        skc_list.append(skc_entry)

    idioma = _default_language_cached(category_id)
    payload = {
        "spu_name":                 "",
        "spu_code":                 None,
        "brand_code":               "",
        "category_id":              category_id,
        "product_type_id":          product_type_id,
        "multi_language_name_list": [{"language": idioma, "name": nombre[:100]}],
        "multi_language_desc_list": [{"language": idioma, "name": descripcion[:4000]}],
        "product_attribute_list":   [],
        "site_list":                [{"main_site": "shein", "sub_site_list": [SITE_ABBR]}],
        "size_attribute_list":      [],
        "sale_attribute_sort_list": [],
        "source_system":            "openapi",
        "suit_flag":                0,
        "supplier_code":            "",
        "image_info":               None,
        "is_spu_pic":               False,
        "sample_info":              None,
        "skc_list":                 skc_list,
    }
    return payload, advertencias


@router.post("/publicar")
def publicar_producto(body: dict):
    """
    Body: { "producto_id": "uuid" } o { "sku_interno": "..." }, opcional "solo_preview": true.
    category_id/product_type_id se resuelven solos desde la categoria del ERP (_CATEGORY_SHEIN).
    """
    producto_id  = (body.get("producto_id") or "").strip()
    sku_interno  = (body.get("sku_interno") or "").strip().upper()
    solo_preview = bool(body.get("solo_preview", False))

    if not producto_id and not sku_interno:
        raise HTTPException(400, "Se requiere producto_id o sku_interno")

    if producto_id:
        prods = supabase_get_all(f"productos?id=eq.{producto_id}&select=*&limit=1")
    else:
        prods = supabase_get_all(f"productos?sku_interno=eq.{sku_interno}&select=*&limit=1")
    if not prods:
        raise HTTPException(404, f"Producto no encontrado (sku={sku_interno or producto_id})")
    producto = prods[0]
    producto_id = producto_id or producto.get("id", "")

    cat_key = (producto.get("categoria") or "").lower().strip()
    category_id, product_type_id = _CATEGORY_SHEIN.get(cat_key, _CATEGORY_SHEIN_DEFAULT)

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
        # En preview no subimos imagenes de verdad (evita gastar cuota de transform-pic);
        # solo se listan las URLs ya alojadas en Cloudinary para que el panel las muestre
        # como miniaturas y el usuario pueda excluir las que no quiera mandar.
        precio_menudeo = float(producto.get("precio_menudeo") or 0)
        precio_mayoreo6 = producto.get("precio_mayoreo6")
        precio_shein = float(precio_mayoreo6) if precio_mayoreo6 else round(precio_menudeo - 70, 2)

        por_color: dict = {}
        for v in variantes:
            color = (v.get("color") or "Unico").strip()
            por_color.setdefault(color, []).append(v)

        aprendidos = _load_color_sinonimos_aprendidos()
        colores_info = []
        for color, vs in por_color.items():
            fotos = []
            for v in vs:
                fotos.extend(v.get("imagenes") or ([v["foto_url"]] if v.get("foto_url") else []))
            fotos_unicas = [u for u in dict.fromkeys(fotos) if u]
            tallas_info = [
                {"talla": v.get("talla"), "sku": v.get("sku"), "stock": stock_map.get(v["id"], 0)}
                for v in vs
            ]
            color_shein_id = _color_a_attribute_value_id(product_type_id, color, aprendidos)
            colores_info.append({"color": color, "fotos": fotos_unicas, "tallas": tallas_info, "color_shein_id": color_shein_id})

        return {
            "producto":         producto.get("nombre"),
            "descripcion":      producto.get("descripcion") or producto.get("nombre"),
            "categoria":        cat_key,
            "category_id":      category_id,
            "product_type_id":  product_type_id,
            "variaciones":      len(variantes),
            "colores":          list({(v.get("color") or "Unico") for v in variantes}),
            "colores_info":     colores_info,
            "precio_menudeo":   precio_menudeo,
            "precio_mayoreo6_capturado": bool(precio_mayoreo6),
            "precio_enviado_a_shein": precio_shein,
        }

    overrides = {
        "nombre":          (body.get("nombre") or "").strip() or None,
        "descripcion":     (body.get("descripcion") or "").strip() or None,
        "precio":          body.get("precio") or None,
        "fotos_excluidas": body.get("fotos_excluidas") or [],
        "color_overrides": body.get("color_overrides") or {},
        "ajuste_tipo":     (body.get("precio_ajuste_tipo") or "").strip() or None,
        "ajuste_valor":    body.get("precio_ajuste_valor") or None,
    }
    payload, advertencias = _build_spu_payload(producto, variantes, stock_map, category_id, product_type_id, overrides)
    resultado = shein_post("/open-api/goods/product/publishOrEdit", payload)
    if advertencias:
        resultado["_advertencias_fotos"] = advertencias

    # Registro PERSISTENTE de que este producto ya se mando a SHEIN. Es indispensable
    # porque la API de SHEIN no expone ningun endpoint para consultar productos
    # "pendientes de revision" (solo aprobados) -- sin este registro propio no hay
    # forma de saber, tras un reinicio o dias despues, que un producto ya se publico
    # y evitar volver a mandarlo duplicado mientras sigue en cola de revision.
    try:
        exito = resultado.get("info", {}).get("success") is True
        supabase_post("shein_publicaciones", {
            "producto_id": producto_id,
            "sku_interno": producto.get("sku_interno"),
            "exito": exito,
            "error": None if exito else json.dumps(resultado)[:2000],
            "spu_name": (payload.get("spu_name") or None),
            "origen": body.get("_origen") or "individual",
        })
    except Exception as e:
        print(f"[shein] No se pudo guardar registro de publicacion (no critico): {e}")

    return resultado
