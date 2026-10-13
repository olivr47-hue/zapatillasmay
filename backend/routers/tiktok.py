from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse, RedirectResponse
import os
import json
import time
import hmac
import hashlib
import urllib.request
import urllib.parse
import urllib.error
from dotenv import load_dotenv
from database import supabase_get, supabase_patch, supabase_post
from security import require_staff

load_dotenv()

router = APIRouter(prefix="/tiktok", tags=["TikTok Shop"])

TIKTOK_APP_KEY    = os.getenv("TIKTOK_APP_KEY", "")
TIKTOK_APP_SECRET = os.getenv("TIKTOK_APP_SECRET", "")
TIKTOK_REDIRECT_URI = os.getenv(
    "TIKTOK_REDIRECT_URI",
    "https://zapatillasmay-production.up.railway.app/tiktok/callback"
)
# ID del servicio (app "Zapatillas May ERP" en el Partner Center → Aplicación y servicio)
TIKTOK_SERVICE_ID = os.getenv("TIKTOK_SERVICE_ID", "7641934060004837136")
TIKTOK_AUTH_URL   = "https://services.tiktokshop.com/open/authorize"          # mercados fuera de EE. UU.
TIKTOK_TOKEN_URL  = "https://auth.tiktok-shops.com/api/v2/token/get"          # GET
TIKTOK_REFRESH_URL = "https://auth.tiktok-shops.com/api/v2/token/refresh"     # GET
TIKTOK_API_BASE   = "https://open-api.tiktokglobalshop.com"
# La escritura de existencias en TikTok queda APAGADA hasta que se pruebe la lectura y se reescriba sync_stock con la API vigente
TIKTOK_SYNC_ACTIVO = os.getenv("TIKTOK_SYNC_STOCK", "") == "1"

# ── Token storage (Supabase configuracion table con fallback a /tmp) ──────────

def _load_token() -> dict | None:
    """Carga el token de TikTok desde Supabase o /tmp."""
    try:
        rows = supabase_get("configuracion?clave=eq.tiktok_token&select=valor")
        if rows and rows[0].get("valor"):
            return json.loads(rows[0]["valor"])
    except Exception:
        pass
    # Fallback: archivo temporal
    try:
        path = "/tmp/tiktok_token.json"
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
    except Exception:
        pass
    return None


def _save_token(data: dict):
    """Guarda el token de TikTok en Supabase y /tmp."""
    valor = json.dumps(data)
    try:
        existing = supabase_get("configuracion?clave=eq.tiktok_token")
        if existing:
            supabase_patch("configuracion?clave=eq.tiktok_token", {"valor": valor})
        else:
            supabase_post("configuracion", {"clave": "tiktok_token", "valor": valor})
    except Exception as e:
        print(f"[TikTok] Error guardando token en Supabase: {e}")
    # Siempre guardar en /tmp como respaldo
    try:
        with open("/tmp/tiktok_token.json", "w") as f:
            f.write(valor)
    except Exception:
        pass


# ── Firma TikTok Open API (HMAC-SHA256 con path + parámetros ordenados + cuerpo, envuelto con el secreto) ──

def _sign(path: str, params: dict, body_str: str = "") -> str:
    """Firma según 'Sign your API request': se excluyen sign y access_token; el token va en el encabezado x-tts-access-token."""
    entrada = path + "".join(f"{k}{v}" for k, v in sorted(params.items()) if k not in ("sign", "access_token"))
    if body_str:
        entrada += body_str
    entrada = TIKTOK_APP_SECRET + entrada + TIKTOK_APP_SECRET
    return hmac.new(TIKTOK_APP_SECRET.encode("utf-8"), entrada.encode("utf-8"), hashlib.sha256).hexdigest()


def _tiktok_api(method: str, path: str, access_token: str,
                body: dict = None, extra_params: dict = None) -> dict:
    """Petición firmada a TikTok Shop Open API (versiones 202309 en adelante)."""
    params = {"app_key": TIKTOK_APP_KEY, "timestamp": str(int(time.time()))}
    if extra_params:
        params.update(extra_params)
    body_str = json.dumps(body, separators=(",", ":")) if body else ""
    params["sign"] = _sign(path, params, body_str)

    url = TIKTOK_API_BASE + path + "?" + urllib.parse.urlencode(params)
    data = body_str.encode("utf-8") if body_str else None
    headers = {"Content-Type": "application/json", "x-tts-access-token": access_token}
    req = urllib.request.Request(url, data=data, headers=headers, method=method.upper())
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read())
        except Exception:
            return {"code": e.code, "message": f"HTTP {e.code}"}


def _pedir_token(url: str, params: dict) -> dict:
    """GET a los endpoints de token (get / refresh). El secreto viaja en la consulta, como lo define TikTok."""
    full = url + "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(urllib.request.Request(full, method="GET"), timeout=20) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read())
        except Exception:
            return {"code": e.code, "message": f"HTTP {e.code}"}


def _vence_en(token: dict) -> int:
    """access_token_expire_in es una marca de tiempo Unix (no segundos de vigencia)."""
    exp = int(token.get("access_token_expire_in", 0) or 0)
    return exp if exp > 10**9 else int(token.get("obtained_at", 0) or 0) + exp


def _token_vigente() -> str:
    """Devuelve un access_token válido; si le queda menos de un día intenta renovarlo con el refresh_token."""
    token = _load_token()
    if not token or not token.get("access_token"):
        return ""
    if time.time() > _vence_en(token) - 86400 and token.get("refresh_token"):
        res = _pedir_token(TIKTOK_REFRESH_URL, {
            "app_key": TIKTOK_APP_KEY, "app_secret": TIKTOK_APP_SECRET,
            "refresh_token": token["refresh_token"], "grant_type": "refresh_token",
        })
        if res.get("code") == 0:
            nuevo = res.get("data", {})
            nuevo["obtained_at"] = int(time.time())
            _save_token(nuevo)
            token = nuevo
    return token.get("access_token", "") if time.time() < _vence_en(token) else ""


# ── Endpoints ──────────────────────────────────────────────────────────────

@router.get("/authorize")
def authorize():
    """Devuelve la URL de autorización para conectar tu tienda TikTok Shop (entrar con la cuenta administradora del Seller Center)."""
    params = {"service_id": TIKTOK_SERVICE_ID, "state": "zapatillasmay"}
    url = TIKTOK_AUTH_URL + "?" + urllib.parse.urlencode(params)
    return {
        "auth_url": url,
        "instruccion": "Abre esta URL en tu navegador y autoriza la tienda TikTok Shop."
    }


@router.get("/callback")
def callback(code: str = None, state: str = None, error: str = None):
    """Recibe el código de autorización de TikTok y lo canjea por access_token y refresh_token."""
    if error or not code or code == "null":
        return JSONResponse(
            status_code=400,
            content={"error": f"TikTok devolvio error: {error or 'sin codigo'}"}
        )
    try:
        result = _pedir_token(TIKTOK_TOKEN_URL, {
            "app_key": TIKTOK_APP_KEY, "app_secret": TIKTOK_APP_SECRET,
            "auth_code": code, "grant_type": "authorized_code",
        })
        if result.get("code") == 0:
            token_data = result.get("data", {})
            token_data["obtained_at"] = int(time.time())
            _save_token(token_data)
            seller = token_data.get("seller_name") or token_data.get("open_id", "TikTok Shop")
            return RedirectResponse(
                url=f"https://portal.zapatillasmay.mx/?tiktok_connected=1&shop={urllib.parse.quote(seller)}",
                status_code=302
            )
        return JSONResponse(
            status_code=400,
            content={"error": "No se pudo obtener el token", "detalle": {"code": result.get("code"), "message": result.get("message")}}
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/status")
def status():
    """Verifica si la tienda TikTok Shop esta conectada."""
    token = _load_token()
    if not token:
        return {"connected": False, "message": "No hay tienda TikTok conectada"}
    expires_at = _vence_en(token)
    expired = time.time() > expires_at
    return {
        "connected":  not expired,
        "expired":    expired,
        "shop":       token.get("seller_name", ""),
        "shop_id":    token.get("open_id", ""),
        "expires_at": expires_at,
        "scopes":     token.get("granted_scopes", []),
    }


@router.get("/diagnostico")
def diagnostico(_staff=Depends(require_staff)):
    """Prueba de SOLO LECTURA: confirma que la app tiene acceso (tiendas autorizadas y 3 productos de ejemplo). No escribe nada en TikTok."""
    if not TIKTOK_APP_KEY or not TIKTOK_APP_SECRET:
        return JSONResponse(status_code=500, content={"error": "Faltan TIKTOK_APP_KEY / TIKTOK_APP_SECRET en el servidor"})
    access = _token_vigente()
    if not access:
        return JSONResponse(status_code=401, content={"error": "Sin token vigente: abre /tiktok/authorize y autoriza la tienda"})
    salida = {"scopes_autorizados": (_load_token() or {}).get("granted_scopes", [])}
    try:
        r = _tiktok_api("GET", "/authorization/202309/shops", access)
        salida["tiendas_codigo"] = r.get("code")
        salida["tiendas_mensaje"] = r.get("message")
        tiendas = (r.get("data") or {}).get("shops") or []
        salida["tiendas"] = [{"nombre": s.get("name"), "region": s.get("region"), "tipo": s.get("seller_type"), "id": s.get("id")} for s in tiendas]
        if tiendas:
            cipher = tiendas[0].get("cipher", "")
            p = _tiktok_api("POST", "/product/202309/products/search", access,
                            body={}, extra_params={"page_size": "3", "shop_cipher": cipher})
            salida["productos_codigo"] = p.get("code")
            salida["productos_mensaje"] = p.get("message")
            d = p.get("data") or {}
            salida["productos_total"] = d.get("total_count")
            salida["productos_ejemplo"] = [{"id": x.get("id"), "titulo": (x.get("title") or "")[:60], "estado": x.get("status")} for x in (d.get("products") or [])]
    except Exception as e:
        salida["error"] = str(e)
    return salida


@router.post("/sync-stock")
def sync_stock():
    """
    Sincroniza el inventario del ERP a TikTok Shop.
    Busca cada producto de TikTok por seller_sku (debe coincidir con el
    formato usado al importar: SKU_ERP-COLOR-TALLA).
    """
    if not TIKTOK_SYNC_ACTIVO:
        return {"ok": False, "desactivado": True,
                "mensaje": "Sincronizacion de existencias APAGADA: primero hay que probar la lectura y reescribirla con la API vigente (TIKTOK_SYNC_STOCK=1 para activarla)."}
    token = _load_token()
    if not token:
        return JSONResponse(
            status_code=401,
            content={
                "error": "Tienda TikTok no conectada.",
                "action": "Visita GET /tiktok/authorize para obtener la URL de conexion."
            }
        )

    access_token = token.get("access_token", "")
    if not access_token:
        return JSONResponse(status_code=401, content={"error": "Token invalido"})

    try:
        # 1. Cargar inventario del ERP
        variantes  = supabase_get("variantes?activa=eq.true&select=id,producto_id,color,talla,sku_interno")
        productos  = supabase_get("productos?activo=eq.true&select=id,sku_interno")
        inventario = supabase_get("inventario?select=variante_id,cantidad")

        inv_map = {i["variante_id"]: int(i.get("cantidad", 0) or 0) for i in inventario}
        prod_sku = {p["id"]: p.get("sku_interno", "") for p in productos}

        # Mapa: sku_erp_variante -> cantidad
        erp_stock = {}
        for v in variantes:
            color = (v.get("color") or "").upper().replace(" ", "")
            talla = str(v.get("talla") or "").upper().replace(" ", "")
            sku_prod = prod_sku.get(v["producto_id"], "")
            # Formato importado: SKU_PRODUCTO-COLOR-TALLA
            sku_key = f"{sku_prod}-{color}-{talla}"
            cantidad = inv_map.get(v["id"], 0)
            erp_stock[sku_key] = cantidad

        # 2. Obtener productos de TikTok
        tiktok_products = []
        page_token = ""
        while True:
            extra = {"page_size": "100"}
            if page_token:
                extra["page_token"] = page_token
            resp = _tiktok_api("GET", "/api/products/search", access_token, extra_params=extra)
            data = resp.get("data", {})
            tiktok_products.extend(data.get("products", []))
            page_token = data.get("next_page_token", "")
            if not page_token:
                break

        # 3. Por cada SKU de TikTok, actualizar con stock del ERP
        updates_ok  = 0
        updates_err = 0
        not_found   = 0

        for product in tiktok_products:
            product_id = product.get("id")
            for sku in product.get("skus", []):
                sku_id      = sku.get("id")
                seller_sku  = (sku.get("seller_sku") or "").upper().replace(" ", "")

                if not seller_sku or seller_sku not in erp_stock:
                    not_found += 1
                    continue

                nueva_cantidad = erp_stock[seller_sku]
                body = {
                    "product_id": product_id,
                    "skus": [
                        {
                            "id": sku_id,
                            "inventory": [
                                {
                                    "warehouse_type": 3,  # MAIN_WAREHOUSE
                                    "quantity": nueva_cantidad,
                                }
                            ],
                        }
                    ],
                }
                try:
                    result = _tiktok_api("PUT", "/api/products/inventory", access_token, body=body)
                    if result.get("code") == 0:
                        updates_ok += 1
                    else:
                        updates_err += 1
                        print(f"[TikTok] Error actualizando {seller_sku}: {result}")
                except Exception as e:
                    updates_err += 1
                    print(f"[TikTok] Excepcion actualizando {seller_sku}: {e}")

        return {
            "ok": True,
            "actualizados": updates_ok,
            "errores":      updates_err,
            "sin_match":    not_found,
            "total_tiktok": len(tiktok_products),
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/disconnect")
def disconnect():
    """Elimina el token de TikTok (desconecta la tienda)."""
    try:
        supabase_patch("configuracion?clave=eq.tiktok_token", {"valor": ""})
    except Exception:
        pass
    try:
        if os.path.exists("/tmp/tiktok_token.json"):
            os.remove("/tmp/tiktok_token.json")
    except Exception:
        pass
    return {"ok": True, "message": "Tienda TikTok desconectada"}


# ── Funcion interna: actualizar stock de items vendidos ───────────────────────

def actualizar_stock_tiktok_tras_venta(items: list, prod_sku_map: dict, inv_map: dict):
    """
    Llamada desde pagos.py despues de confirmar un pago.
    Descuenta en TikTok el stock de los items vendidos.
    items: lista de {variante_id, cantidad}
    prod_sku_map: {variante_id: seller_sku_tiktok}
    inv_map: {variante_id: nueva_cantidad_erp}
    """
    if not TIKTOK_SYNC_ACTIVO:
        return
    token = _load_token()
    if not token or not token.get("access_token"):
        return  # Si no hay conexion, ignorar silenciosamente

    access_token = token["access_token"]

    # Obtener todos los productos TikTok una vez (cache minima)
    try:
        resp = _tiktok_api("GET", "/api/products/search", access_token,
                           extra_params={"page_size": "100"})
        tiktok_products = resp.get("data", {}).get("products", [])
    except Exception as e:
        print(f"[TikTok] Error obteniendo productos: {e}")
        return

    # Indice: seller_sku -> (product_id, sku_id)
    sku_index = {}
    for prod in tiktok_products:
        for sku in prod.get("skus", []):
            s_sku = (sku.get("seller_sku") or "").upper().replace(" ", "")
            if s_sku:
                sku_index[s_sku] = (prod["id"], sku["id"])

    for item in items:
        vid      = item.get("variante_id")
        cantidad = item.get("cantidad", 1)
        s_sku    = (prod_sku_map.get(vid) or "").upper().replace(" ", "")

        if not s_sku or s_sku not in sku_index:
            continue

        product_id, sku_id = sku_index[s_sku]
        nueva_cantidad = max(0, inv_map.get(vid, 0) - cantidad)

        body = {
            "product_id": product_id,
            "skus": [{
                "id": sku_id,
                "inventory": [{"warehouse_type": 3, "quantity": nueva_cantidad}],
            }],
        }
        try:
            _tiktok_api("PUT", "/api/products/inventory", access_token, body=body)
        except Exception as e:
            print(f"[TikTok] Error actualizando stock post-venta {s_sku}: {e}")
