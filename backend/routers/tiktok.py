from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, RedirectResponse
import os
import json
import time
import hmac
import hashlib
import urllib.request
import urllib.parse
from dotenv import load_dotenv
from database import supabase_get, supabase_patch, supabase_post

load_dotenv()

router = APIRouter(prefix="/tiktok", tags=["TikTok Shop"])

TIKTOK_APP_KEY    = os.getenv("TIKTOK_APP_KEY", "")
TIKTOK_APP_SECRET = os.getenv("TIKTOK_APP_SECRET", "")
TIKTOK_REDIRECT_URI = os.getenv(
    "TIKTOK_REDIRECT_URI",
    "https://zapatillasmay-production.up.railway.app/tiktok/callback"
)
TIKTOK_AUTH_URL  = "https://auth.tiktok-shops.com/oauth/authorize"
TIKTOK_TOKEN_URL = "https://auth.tiktok-shops.com/oauth/token"
TIKTOK_API_BASE  = "https://open-api.tiktokglobalshop.com"

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


# ── Firma TikTok Open API ─────────────────────────────────────────────────────

def _sign(params: dict, body_str: str = "") -> str:
    """Genera la firma HMAC-SHA256 para las peticiones a TikTok Open API."""
    sorted_params = sorted(params.items())
    sign_str = TIKTOK_APP_SECRET
    for k, v in sorted_params:
        sign_str += str(k) + str(v)
    if body_str:
        sign_str += body_str
    sign_str += TIKTOK_APP_SECRET
    return hashlib.sha256(sign_str.encode()).hexdigest()


def _tiktok_api(method: str, path: str, access_token: str,
                body: dict = None, extra_params: dict = None) -> dict:
    """Realiza una petición firmada a TikTok Shop Open API."""
    timestamp = str(int(time.time()))
    params = {
        "app_key":      TIKTOK_APP_KEY,
        "access_token": access_token,
        "timestamp":    timestamp,
        "version":      "202309",
    }
    if extra_params:
        params.update(extra_params)

    body_str = json.dumps(body, separators=(",", ":")) if body else ""
    params["sign"] = _sign(params, body_str)

    url = TIKTOK_API_BASE + path + "?" + urllib.parse.urlencode(params)
    data = body_str.encode() if body_str else None
    headers = {"Content-Type": "application/json"}

    req = urllib.request.Request(url, data=data, headers=headers, method=method.upper())
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read())


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/authorize")
def authorize():
    """Devuelve la URL de autorización OAuth para conectar tu tienda TikTok Shop."""
    params = {
        "app_key": TIKTOK_APP_KEY,
        "state":   "zapatillasmay",
    }
    url = TIKTOK_AUTH_URL + "?" + urllib.parse.urlencode(params)
    return {
        "auth_url": url,
        "instruccion": "Abre esta URL en tu navegador y autoriza la tienda TikTok Shop."
    }


@router.get("/callback")
def callback(code: str = None, state: str = None, error: str = None):
    """Recibe el código OAuth de TikTok y lo canjea por un access_token."""
    if error or not code:
        return JSONResponse(
            status_code=400,
            content={"error": f"TikTok devolvio error: {error or 'sin codigo'}"}
        )
    try:
        body = json.dumps({
            "app_key":    TIKTOK_APP_KEY,
            "app_secret": TIKTOK_APP_SECRET,
            "auth_code":  code,
            "grant_type": "authorized_code",
        }).encode()

        req = urllib.request.Request(
            TIKTOK_TOKEN_URL,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read())

        if result.get("code") == 0:
            token_data = result.get("data", {})
            token_data["obtained_at"] = int(time.time())
            _save_token(token_data)
            seller = token_data.get("seller_name") or token_data.get("open_id", "TikTok Shop")
            return RedirectResponse(
                url=f"/?tiktok_connected=1&shop={urllib.parse.quote(seller)}",
                status_code=302
            )
        else:
            return JSONResponse(
                status_code=400,
                content={"error": "No se pudo obtener el token", "detalle": result}
            )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/status")
def status():
    """Verifica si la tienda TikTok Shop esta conectada."""
    token = _load_token()
    if not token:
        return {"connected": False, "message": "No hay tienda TikTok conectada"}

    obtained_at = token.get("obtained_at", 0)
    expires_in  = token.get("access_token_expire_in", 0)
    expires_at  = obtained_at + expires_in
    expired     = time.time() > expires_at

    return {
        "connected":  not expired,
        "expired":    expired,
        "shop":       token.get("seller_name", ""),
        "shop_id":    token.get("open_id", ""),
        "expires_at": expires_at,
    }


@router.post("/sync-stock")
def sync_stock():
    """
    Sincroniza el inventario del ERP a TikTok Shop.
    Busca cada producto de TikTok por seller_sku (debe coincidir con el
    formato usado al importar: SKU_ERP-COLOR-TALLA).
    """
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
