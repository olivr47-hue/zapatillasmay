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
from security import require_staff, require_admin

load_dotenv()

router = APIRouter(prefix="/tiktok", tags=["TikTok Shop"])

TIKTOK_APP_KEY    = os.getenv("TIKTOK_APP_KEY", "")
TIKTOK_APP_SECRET = os.getenv("TIKTOK_APP_SECRET", "")
TIKTOK_REDIRECT_URI = os.getenv(
    "TIKTOK_REDIRECT_URI",
    "https://zapatillasmay-production.up.railway.app/tiktok/callback"
)
# ID del servicio: app "ERP MAY" en el Partner Center → Aplicación y servicio (la anterior, "Zapatillas May ERP" 7641934060004837136, quedó en
# borrador sin aprobar). Se puede cambiar desde el panel (Conexiones → TikTok Shop → Service ID) sin tocar Railway.
TIKTOK_SERVICE_ID = os.getenv("TIKTOK_SERVICE_ID", "7696112354686027541")
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


# ── Lectura de TikTok Shop para la pantalla del panel (SOLO LECTURA: nada de esto escribe en TikTok) ──────────────────────────
def _contexto_tienda():
    """((access_token, tienda), None) de la tienda conectada, o (None, JSONResponse con el error)."""
    access = _token_vigente()
    if not access:
        return None, JSONResponse(status_code=401, content={"error": "Sin token vigente de TikTok: autoriza la tienda otra vez"})
    r = _tiktok_api("GET", "/authorization/202309/shops", access)
    tiendas = (r.get("data") or {}).get("shops") or []
    if not tiendas:
        return None, JSONResponse(status_code=502, content={"error": "TikTok no devolvio tiendas", "detalle": r.get("message")})
    return (access, tiendas[0]), None


def _catalogo_tiktok(access, cipher, forzar=False):
    """Todos los productos de TikTok (con SKUs, existencias y precios), paginado, con cache de 10 min."""
    from cache import cache_get, cache_set
    if not forzar:
        c = cache_get("tiktok_catalogo")
        if c is not None:
            return c, None
    productos, token_pag, paginas = [], "", 0
    while True:
        extra = {"page_size": "100", "shop_cipher": cipher}
        if token_pag:
            extra["page_token"] = token_pag
        p = _tiktok_api("POST", "/product/202309/products/search", access, body={}, extra_params=extra)
        if p.get("code") != 0:
            return None, {"codigo": p.get("code"), "mensaje": p.get("message")}
        d = p.get("data") or {}
        productos.extend(d.get("products") or [])
        paginas += 1
        token_pag = d.get("next_page_token") or ""
        if not token_pag or paginas >= 40:
            break
    cache_set("tiktok_catalogo", productos, ttl=600)
    return productos, None


def _resumen_producto(p):
    skus = p.get("skus") or []
    stock = 0
    precios = []
    sin_sku = 0
    for s in skus:
        stock += sum(int(i.get("quantity") or 0) for i in (s.get("inventory") or []))
        pr = (s.get("price") or {}).get("tax_exclusive_price") or (s.get("price") or {}).get("sale_price")
        try:
            if pr is not None:
                precios.append(float(pr))
        except (TypeError, ValueError):
            pass
        if not (s.get("seller_sku") or "").strip():
            sin_sku += 1
    return {
        "id": p.get("id"), "titulo": p.get("title") or "", "estado": p.get("status") or "",
        "skus": len(skus), "sin_sku": sin_sku, "stock": stock,
        "precio_min": min(precios) if precios else None, "precio_max": max(precios) if precios else None,
        "creado": p.get("create_time"), "actualizado": p.get("update_time"),
        "sku_ejemplo": next(((s.get("seller_sku") or "") for s in skus if s.get("seller_sku")), ""),
    }


@router.get("/resumen")
def tiktok_resumen(refrescar: bool = False, _staff=Depends(require_staff)):
    """Tarjetas de la pantalla: tienda, conexion, productos por estado, SKUs, existencias y pedidos de los ultimos 30 dias."""
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    token = _load_token() or {}
    productos, e = _catalogo_tiktok(access, tienda.get("cipher", ""), forzar=refrescar)
    if productos is None:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la lista de productos", **e})
    por_estado, skus, stock, sin_sku = {}, 0, 0, 0
    for p in productos:
        r = _resumen_producto(p)
        por_estado[r["estado"]] = por_estado.get(r["estado"], 0) + 1
        skus += r["skus"]; stock += r["stock"]; sin_sku += r["sin_sku"]
    salida = {
        "conectado": True,
        "tienda": {"nombre": tienda.get("name"), "region": tienda.get("region"), "tipo": tienda.get("seller_type"), "id": tienda.get("id")},
        "token_vence": _vence_en(token), "permisos": len(token.get("granted_scopes") or []),
        "productos": {"total": len(productos), "por_estado": por_estado, "skus": skus, "stock_total": stock, "skus_sin_sku_vendedor": sin_sku},
        "sync_existencias_activa": TIKTOK_SYNC_ACTIVO,
    }
    ahora = int(time.time())
    o = _tiktok_api("POST", "/order/202309/orders/search", access,
                    body={"create_time_ge": ahora - 30 * 86400, "create_time_lt": ahora},
                    extra_params={"page_size": "100", "shop_cipher": tienda.get("cipher", ""), "sort_field": "create_time", "sort_order": "DESC"})
    if o.get("code") == 0:
        ords = (o.get("data") or {}).get("orders") or []
        est = {}
        total = 0.0
        for x in ords:
            est[x.get("status") or "?"] = est.get(x.get("status") or "?", 0) + 1
            try:
                total += float(((x.get("payment") or {}).get("total_amount")) or 0)
            except (TypeError, ValueError):
                pass
        salida["pedidos_30d"] = {"n": len(ords), "hay_mas": bool((o.get("data") or {}).get("next_page_token")), "por_estado": est, "total": round(total, 2)}
    else:
        salida["pedidos_30d"] = {"error": o.get("message"), "codigo": o.get("code")}
    return salida


@router.get("/productos")
def tiktok_productos(q: str = "", estado: str = "", pagina: int = 1, por_pagina: int = 50, refrescar: bool = False, _staff=Depends(require_staff)):
    """Lista de productos de TikTok (filtro por texto/SKU y por estado), con existencias y rango de precios."""
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    productos, e = _catalogo_tiktok(access, tienda.get("cipher", ""), forzar=refrescar)
    if productos is None:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la lista de productos", **e})
    filas = [_resumen_producto(p) for p in productos]
    nq = (q or "").strip().lower()
    if nq:
        ids_por_sku = {}
        for p in productos:
            for s in p.get("skus") or []:
                if nq in (s.get("seller_sku") or "").lower():
                    ids_por_sku[p.get("id")] = True
        filas = [f for f in filas if nq in f["titulo"].lower() or f["id"] in ids_por_sku or nq in str(f["id"])]
    if estado:
        filas = [f for f in filas if f["estado"] == estado]
    filas.sort(key=lambda f: f.get("actualizado") or 0, reverse=True)
    por_pagina = max(1, min(int(por_pagina), 200))
    ini = (max(1, int(pagina)) - 1) * por_pagina
    return {"total": len(filas), "pagina": pagina, "por_pagina": por_pagina, "productos": filas[ini:ini + por_pagina]}


@router.get("/producto/{producto_id}")
def tiktok_producto(producto_id: str, crudo: bool = False, _staff=Depends(require_staff)):
    """Detalle de un producto de TikTok (fotos, descripcion, SKUs con existencias y precio) junto con las fotos que tiene el ERP del mismo modelo."""
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    r = _tiktok_api("GET", f"/product/202309/products/{producto_id}", access, extra_params={"shop_cipher": tienda.get("cipher", "")})
    if r.get("code") != 0:
        return JSONResponse(status_code=502, content={"error": "TikTok no entrego el producto", "codigo": r.get("code"), "mensaje": r.get("message")})
    d = r.get("data") or {}
    salida = {
        "id": d.get("id"), "titulo": d.get("title"), "estado": d.get("status"),
        "fotos": [(i.get("urls") or [i.get("thumb_urls", [None])[0]])[0] if isinstance(i, dict) else i for i in (d.get("main_images") or [])],
        "descripcion": (d.get("description") or "")[:600],
        "categoria": [c.get("local_name") or c.get("name") for c in (d.get("category_chains") or [])],
        "skus": [{"id": s.get("id"), "seller_sku": s.get("seller_sku"), "precio": (s.get("price") or {}).get("tax_exclusive_price") or (s.get("price") or {}).get("sale_price"),
                  "existencias": sum(int(i.get("quantity") or 0) for i in (s.get("inventory") or [])),
                  "atributos": [(a.get("name"), a.get("value_name")) for a in (s.get("sales_attributes") or [])]} for s in (d.get("skus") or [])],
    }
    # Fotos del ERP para el mismo modelo (el SKU del vendedor empieza con el sku_interno: LETRA-TIPO-NNNN)
    try:
        sku0 = next(((s.get("seller_sku") or "") for s in (d.get("skus") or []) if s.get("seller_sku")), "")
        partes = sku0.split("-")
        sku_int = "-".join(partes[:3]) if len(partes) >= 3 else ""
        if sku_int:
            prod = supabase_get(f"productos?sku_interno=eq.{urllib.parse.quote(sku_int, safe='')}&select=id,nombre,imagen_principal&limit=1") or []
            if prod:
                vs = supabase_get(f"variantes?producto_id=eq.{prod[0]['id']}&activa=eq.true&select=color,foto_url,imagenes") or []
                fotos_erp = {}
                for v in vs:
                    lista = [u for u in ([v.get("foto_url")] + list(v.get("imagenes") or [])) if u]
                    fotos_erp.setdefault(v.get("color") or "", [])
                    for u in lista:
                        if u not in fotos_erp[v.get("color") or ""]:
                            fotos_erp[v.get("color") or ""].append(u)
                salida["erp"] = {"sku_interno": sku_int, "nombre": prod[0].get("nombre"), "fotos_por_color": fotos_erp,
                                 "total_fotos": sum(len(x) for x in fotos_erp.values())}
    except Exception as e:
        salida["erp_error"] = str(e)[:120]
    if crudo:
        salida["crudo"] = d
    return salida


@router.get("/pedidos")
def tiktok_pedidos(dias: int = 30, estado: str = "", crudo: bool = False, _staff=Depends(require_staff)):
    """Pedidos de TikTok Shop de los ultimos N dias (maximo 100 por consulta)."""
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    ahora = int(time.time())
    cuerpo = {"create_time_ge": ahora - max(1, min(int(dias), 90)) * 86400, "create_time_lt": ahora}
    if estado:
        cuerpo["order_status"] = estado
    o = _tiktok_api("POST", "/order/202309/orders/search", access, body=cuerpo,
                    extra_params={"page_size": "100", "shop_cipher": tienda.get("cipher", ""), "sort_field": "create_time", "sort_order": "DESC"})
    if o.get("code") != 0:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la busqueda de pedidos", "codigo": o.get("code"), "mensaje": o.get("message")})
    d = o.get("data") or {}
    filas = []
    for x in d.get("orders") or []:
        pago = x.get("payment") or {}
        items = x.get("line_items") or []
        filas.append({
            "id": x.get("id"), "estado": x.get("status"), "creado": x.get("create_time"),
            "total": pago.get("total_amount"), "moneda": pago.get("currency"),
            "pares": len(items),
            "articulos": [{"producto": (i.get("product_name") or "")[:60], "sku": i.get("seller_sku"), "variante": i.get("sku_name")} for i in items][:6],
            "paqueteria": x.get("shipping_provider"), "guia": x.get("tracking_number"),
            "pago_metodo": x.get("payment_method_name"),
        })
    salida = {"total_en_pagina": len(filas), "hay_mas": bool(d.get("next_page_token")), "pedidos": filas}
    if crudo and d.get("orders"):
        x = dict(d["orders"][0]); x.pop("recipient_address", None); x.pop("buyer_email", None); x.pop("buyer_message", None)
        salida["primer_pedido_crudo"] = x
    return salida


@router.get("/devoluciones")
def tiktok_devoluciones(dias: int = 90, crudo: bool = False, _staff=Depends(require_staff)):
    """Devoluciones y reembolsos de TikTok Shop."""
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    ahora = int(time.time())
    r = _tiktok_api("POST", "/return_refund/202309/returns/search", access,
                    body={"create_time_ge": ahora - max(1, min(int(dias), 180)) * 86400, "create_time_lt": ahora},
                    extra_params={"page_size": "50", "shop_cipher": tienda.get("cipher", "")})
    if r.get("code") != 0:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la busqueda de devoluciones", "codigo": r.get("code"), "mensaje": r.get("message")})
    d = r.get("data") or {}
    lista = d.get("return_orders") or d.get("returns") or []
    salida = {"total_en_pagina": len(lista), "devoluciones": [{
        "id": x.get("id") or x.get("return_id"), "pedido": x.get("order_id"), "estado": x.get("status") or x.get("return_status"),
        "tipo": x.get("return_type"), "motivo": x.get("return_reason_text") or x.get("return_reason"), "creado": x.get("create_time"),
        "monto": ((x.get("refund_amount") or {}).get("refund_total") if isinstance(x.get("refund_amount"), dict) else x.get("refund_amount")),
    } for x in lista]}
    if crudo and lista:
        salida["primera_crudo"] = lista[0]
    return salida


@router.get("/finanzas")
def tiktok_finanzas(crudo: bool = False, _staff=Depends(require_staff)):
    """Estados de cuenta (liquidaciones) recientes de TikTok Shop."""
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    r = _tiktok_api("GET", "/finance/202309/statements", access,
                    extra_params={"shop_cipher": tienda.get("cipher", ""), "sort_field": "statement_time", "sort_order": "DESC", "page_size": "20"})
    if r.get("code") != 0:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la consulta de finanzas", "codigo": r.get("code"), "mensaje": r.get("message")})
    d = r.get("data") or {}
    lista = d.get("statements") or []
    salida = {"total_en_pagina": len(lista), "liquidaciones": [{
        "id": x.get("id"), "fecha": x.get("statement_time"), "estado": x.get("payment_status"), "moneda": x.get("currency"),
        "ingresos": x.get("revenue_amount"), "comisiones": x.get("fee_amount"), "ajustes": x.get("adjustment_amount"), "neto": x.get("settlement_amount"),
        "pago_id": x.get("payment_id"),
    } for x in lista]}
    if crudo and lista:
        salida["primera_crudo"] = lista[0]
    return salida


# ── Fotos: llevar a TikTok las fotos que el ERP ya tiene de cada modelo ───────────────────────────────────────────────────────
def _tiktok_subir_imagen(access, contenido: bytes, use_case: str = "MAIN_IMAGE"):
    """Sube UNA imagen a TikTok (multipart) y devuelve su uri. La firma no incluye el cuerpo cuando es multipart."""
    import secrets
    path = "/product/202309/images/upload"
    params = {"app_key": TIKTOK_APP_KEY, "timestamp": str(int(time.time()))}
    params["sign"] = _sign(path, params, "")
    limite = "----zm" + secrets.token_hex(12)
    cuerpo = b"".join([
        f"--{limite}\r\nContent-Disposition: form-data; name=\"data\"; filename=\"foto.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n".encode(),
        contenido, b"\r\n",
        f"--{limite}\r\nContent-Disposition: form-data; name=\"use_case\"\r\n\r\n{use_case}\r\n".encode(),
        f"--{limite}--\r\n".encode(),
    ])
    req = urllib.request.Request(TIKTOK_API_BASE + path + "?" + urllib.parse.urlencode(params), data=cuerpo, method="POST",
                                 headers={"Content-Type": f"multipart/form-data; boundary={limite}", "x-tts-access-token": access})
    try:
        with urllib.request.urlopen(req, timeout=40) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read())
        except Exception:
            return {"code": e.code, "message": f"HTTP {e.code}"}


def _fotos_erp_de_modelo(producto, variantes, maximo=9):
    """Fotos del ERP para el modelo: la portada primero y luego una de cada color por turnos (así la galeria muestra todos los colores),
    sin repetir, hasta `maximo` (TikTok acepta 9). Tamano 1200 px como pide TikTok."""
    from routers.tiktok_excel import _resize_cloudinary
    vistas = set()
    salida = []
    def agrega(u):
        if u and u not in vistas and len(salida) < maximo:
            vistas.add(u); salida.append(u)
    agrega(producto.get("imagen_principal"))
    colas = []
    for v in variantes:
        colas.append([x for x in ([v.get("foto_url")] + list(v.get("imagenes") or [])) if x])
    ronda = 0
    while len(salida) < maximo and any(ronda < len(c) for c in colas):
        for c in colas:
            if ronda < len(c):
                agrega(c[ronda])
        ronda += 1
    return [_resize_cloudinary(u) for u in salida]


def _producto_erp_de_tiktok(tk_producto, cargado):
    """Producto del ERP (y sus variantes) que corresponde a un producto de TikTok, por el SKU de vendedor. (None, None) si no hay."""
    from routers.tiktok_excel import _spu_de, _ALIAS_ID
    productos, vars_por_prod, _inv, inv_por_sku = cargado
    for s in tk_producto.get("skus") or []:
        sv = (s.get("seller_sku") or "").strip()
        if not sv:
            continue
        spu, _resto = _spu_de(sv, inv_por_sku)
        if spu is None:
            continue
        clave = _ALIAS_ID.get(spu, spu)
        for p in productos:
            if (p.get("sku_interno") or str(p["id"])) == clave:
                return p, vars_por_prod.get(p["id"], [])
    return None, None


@router.get("/fotos-pendientes")
def tiktok_fotos_pendientes(refrescar: bool = False, _staff=Depends(require_staff)):
    """SOLO LECTURA. Modelos ACTIVOS en TikTok que tienen MENOS fotos que las que ya existen en el ERP (por ejemplo, los que se subieron con una sola foto).
    Consulta el detalle de cada producto activo (cache de 30 min)."""
    from cache import cache_get, cache_set
    if not refrescar:
        c = cache_get("tiktok_fotos_pendientes")
        if c is not None:
            return c
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    cipher = tienda.get("cipher", "")
    productos, e = _catalogo_tiktok(access, cipher)
    if productos is None:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la lista de productos", **e})
    activos = [p for p in productos if p.get("status") == "ACTIVATE"]
    from routers.tiktok_excel import _cargar_erp
    cargado = _cargar_erp()
    from concurrent.futures import ThreadPoolExecutor

    def _uno(p):
        try:
            r = _tiktok_api("GET", f"/product/202309/products/{p.get('id')}", access, extra_params={"shop_cipher": cipher})
            if r.get("code") != 0:
                return {"id": p.get("id"), "titulo": p.get("title"), "error": r.get("message")}
            d = r.get("data") or {}
            n_tk = len(d.get("main_images") or [])
            prod, vars_ = _producto_erp_de_tiktok(p, cargado)
            if not prod:
                return {"id": p.get("id"), "titulo": d.get("title"), "fotos_tiktok": n_tk, "sin_modelo_erp": True}
            fotos = _fotos_erp_de_modelo(prod, vars_)
            return {"id": p.get("id"), "titulo": d.get("title"), "sku_interno": prod.get("sku_interno"),
                    "fotos_tiktok": n_tk, "fotos_erp": len(fotos), "portada_tiktok": ((d.get("main_images") or [{}])[0].get("urls") or [""])[0]}
        except Exception as ex:
            return {"id": p.get("id"), "titulo": p.get("title"), "error": str(ex)[:100]}

    with ThreadPoolExecutor(max_workers=5) as ex:
        filas = list(ex.map(_uno, activos))
    pendientes = [f for f in filas if f.get("fotos_erp") and f["fotos_erp"] > f.get("fotos_tiktok", 0)]
    pendientes.sort(key=lambda f: (f["fotos_tiktok"], -f["fotos_erp"]))
    salida = {
        "activos_revisados": len(filas),
        "con_una_sola_foto": sum(1 for f in filas if f.get("fotos_tiktok") == 1),
        "pendientes": len(pendientes),
        "sin_modelo_erp": sum(1 for f in filas if f.get("sin_modelo_erp")),
        "con_error": sum(1 for f in filas if f.get("error")),
        "productos": pendientes,
    }
    cache_set("tiktok_fotos_pendientes", salida, ttl=1800)
    return salida


@router.post("/producto/{producto_id}/actualizar-fotos")
def tiktok_actualizar_fotos(producto_id: str, confirmar: bool = False, _staff=Depends(require_staff)):
    """ESCRIBE EN TIKTOK (solo las fotos de la galeria de ESE producto; no toca precio, existencias ni texto).
    Sin confirmar=true solo muestra que fotos se subirian. Con confirmar=true las sube a TikTok y las pone en la galeria del producto.
    Ojo: TikTok puede volver a revisar el producto despues de cambiarle fotos."""
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    cipher = tienda.get("cipher", "")
    r = _tiktok_api("GET", f"/product/202309/products/{producto_id}", access, extra_params={"shop_cipher": cipher})
    if r.get("code") != 0:
        return JSONResponse(status_code=502, content={"error": "TikTok no entrego el producto", "mensaje": r.get("message")})
    d = r.get("data") or {}
    if d.get("status") != "ACTIVATE":
        return JSONResponse(status_code=409, content={"error": f"El producto no esta activo en TikTok (estado {d.get('status')})"})
    from routers.tiktok_excel import _cargar_erp
    prod, vars_ = _producto_erp_de_tiktok(d, _cargar_erp())
    if not prod:
        return JSONResponse(status_code=404, content={"error": "No se encontro el modelo en el ERP por el SKU de vendedor"})
    fotos = _fotos_erp_de_modelo(prod, vars_)
    n_tk = len(d.get("main_images") or [])
    resumen = {"producto": d.get("title"), "modelo_erp": prod.get("sku_interno"), "fotos_actuales_tiktok": n_tk, "fotos_que_se_subirian": len(fotos), "fotos": fotos}
    if len(fotos) <= n_tk:
        return {**resumen, "hecho": False, "mensaje": "TikTok ya tiene igual o mas fotos que el ERP: no hay nada que actualizar"}
    if not confirmar:
        return {**resumen, "hecho": False, "mensaje": "Vista previa. Pasa confirmar=true para subirlas a TikTok"}
    uris, fallos = [], []
    for u in fotos:
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as resp:
                contenido = resp.read()
            s = _tiktok_subir_imagen(access, contenido)
            uri = ((s.get("data") or {}).get("uri"))
            if s.get("code") == 0 and uri:
                uris.append(uri)
            else:
                fallos.append({"url": u[-60:], "codigo": s.get("code"), "mensaje": s.get("message")})
        except Exception as ex:
            fallos.append({"url": u[-60:], "error": str(ex)[:100]})
    if len(uris) <= n_tk:
        return JSONResponse(status_code=502, content={**resumen, "hecho": False, "error": "No se pudieron subir suficientes fotos; no se cambio nada en TikTok", "fallos": fallos})
    e = _tiktok_api("POST", f"/product/202309/products/{producto_id}/partial_edit", access,
                    body={"main_images": [{"uri": x} for x in uris]}, extra_params={"shop_cipher": cipher})
    if e.get("code") != 0:
        return JSONResponse(status_code=502, content={**resumen, "hecho": False, "error": "TikTok rechazo el cambio de fotos", "codigo": e.get("code"), "mensaje": e.get("message"), "fallos": fallos})
    from cache import cache_set
    cache_set("tiktok_fotos_pendientes", None, ttl=1)
    return {**resumen, "hecho": True, "fotos_subidas": len(uris), "fallos": fallos, "respuesta_tiktok": e.get("data")}


# ── Sincronizacion con el ERP (ver tiktok_sync.py): existencias hacia TikTok y pedidos hacia el ERP ───────────────────────────
@router.get("/existencias/plan")
def tiktok_existencias_plan(producto_id: str = "", refrescar: bool = False, _staff=Depends(require_staff)):
    """SOLO LECTURA. Que cambiaria en TikTok para que muestre lo mismo que el ERP (solo productos activos)."""
    import tiktok_sync
    from routers.tiktok_excel import _cargar_erp
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    productos, e = _catalogo_tiktok(access, tienda.get("cipher", ""), forzar=refrescar)
    if productos is None:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la lista de productos", **e})
    cambios, r = tiktok_sync.plan_existencias(productos, _cargar_erp(), solo_producto=producto_id or None)
    mas = [c for c in cambios if c["a"] > c["de"]]
    menos = [c for c in cambios if c["a"] < c["de"]]
    relleno = [c for c in cambios if c["de"] >= 9000]
    cambios.sort(key=lambda c: abs(c["a"] - c["de"]), reverse=True)
    return {**r, "cambios": len(cambios), "subirian": len(mas), "bajarian": len(menos), "de_relleno_9000_o_mas": len(relleno),
            "productos_afectados": len({c["producto_id"] for c in cambios}), "ejemplos": cambios[:40],
            "automatico_activo": tiktok_sync.estado_automatico()["existencias"]}


@router.post("/existencias/aplicar")
def tiktok_existencias_aplicar(producto_id: str = "", limite_productos: int = 0, todo: bool = False, confirmar: bool = False, _staff=Depends(require_staff)):
    """ESCRIBE EN TIKTOK (solo existencias de SKUs que difieren del ERP). Exige confirmar=true y alcance explicito:
    producto_id (uno), limite_productos (los primeros N con cambios) o todo=true."""
    import tiktok_sync
    from routers.tiktok_excel import _cargar_erp
    if not confirmar:
        return JSONResponse(status_code=400, content={"error": "Pasa confirmar=true: esto cambia las existencias reales en TikTok"})
    if not (producto_id or limite_productos or todo):
        return JSONResponse(status_code=400, content={"error": "Indica producto_id, limite_productos o todo=true"})
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    productos, e = _catalogo_tiktok(access, tienda.get("cipher", ""), forzar=True)
    if productos is None:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la lista de productos", **e})
    cambios, r = tiktok_sync.plan_existencias(productos, _cargar_erp(), solo_producto=producto_id or None)
    if limite_productos:
        ids = []
        for c in cambios:
            if c["producto_id"] not in ids:
                ids.append(c["producto_id"])
        permitidos = set(ids[:limite_productos])
        cambios = [c for c in cambios if c["producto_id"] in permitidos]
    if not cambios:
        return {**r, "cambios": 0, "mensaje": "TikTok ya coincide con el ERP en lo seleccionado"}
    res = tiktok_sync.aplicar_cambios(cambios, access, tienda.get("cipher", ""))
    return {**r, "cambios": len(cambios), **res, "ejemplos": cambios[:15]}


@router.get("/automatico")
def tiktok_automatico(_staff=Depends(require_staff)):
    import tiktok_sync
    return tiktok_sync.estado_automatico()


@router.post("/automatico")
def tiktok_automatico_cambiar(existencias: str = "", ventas: str = "", _admin=Depends(require_admin)):
    """Enciende o apaga las dos sincronizaciones. ventas=on guarda el momento de activacion: solo se importan pedidos creados desde entonces."""
    import tiktok_sync
    if existencias in ("on", "off"):
        tiktok_sync.cfg_set(tiktok_sync.CLAVE_EXISTENCIAS, "1" if existencias == "on" else "0")
    if ventas == "on":
        if not tiktok_sync.estado_automatico()["ventas_desde"]:
            tiktok_sync.sync_utilidad_tiktok()   # primero se cierra la utilidad hasta este momento (esos pedidos no se importan como pedido)
            tiktok_sync.cfg_set(tiktok_sync.CLAVE_VENTAS, str(int(time.time())))
    elif ventas == "off":
        tiktok_sync.cfg_set(tiktok_sync.CLAVE_VENTAS, None)
    return tiktok_sync.estado_automatico()


_ERR_GUIA = {
    21023035: "TikTok todavia no tiene preparado el envio de este pedido: en TikTok toca «Preparar envio» (o «Arrange shipment») y vuelve a intentar",
    21042104: "TikTok todavia no tiene preparado el envio de este pedido: en TikTok toca «Preparar envio» y vuelve a intentar",
    21042102: "La paqueteria ya recogio el paquete: la guia ya no se puede imprimir",
    21023046: "El paquete ya fue enviado: la guia ya no se puede imprimir",
    21023059: "El paquete fue cancelado",
    11034037: "La paqueteria todavia esta generando la guia: intenta de nuevo en un minuto",
    11034023: "La guia tardo en generarse: intenta de nuevo en un minuto",
    11034002: "Este pedido no es de envio por TikTok: la guia se imprime fuera de TikTok",
    21008017: "Este pedido no es de envio por TikTok: la guia se imprime fuera de TikTok",
    21008043: "Este paquete lo envia TikTok (FBT): no hay guia que imprimir",
}


@router.get("/guia/{order_id}")
def tiktok_guia(order_id: str, _staff=Depends(require_staff)):
    """PDF de la guia de envio (etiqueta A6) de un pedido de TikTok Shop enviado con TikTok Shipping. Solo se puede obtener DESPUES de preparar el
    envio en TikTok y ANTES de que la paqueteria recoja el paquete. Si el pedido trae varios paquetes, se unen en un solo PDF. No cambia nada."""
    from fastapi import Response
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    cipher = tienda.get("cipher", "")
    d = _tiktok_api("GET", "/order/202309/orders", access, extra_params={"ids": order_id, "shop_cipher": cipher})
    if d.get("code") != 0:
        return JSONResponse(status_code=502, content={"error": "TikTok no entrego el pedido", "mensaje": d.get("message")})
    ords = (d.get("data") or {}).get("orders") or []
    if not ords:
        return JSONResponse(status_code=404, content={"error": "TikTok no encontro ese pedido"})
    orden = ords[0]
    if orden.get("status") == "CANCELLED":
        return JSONResponse(status_code=409, content={"error": "El pedido esta cancelado en TikTok"})
    paquetes = [p.get("id") for p in (orden.get("packages") or []) if p.get("id")]
    if not paquetes:
        return JSONResponse(status_code=409, content={"error": "TikTok todavia no genera el paquete de este pedido: en TikTok toca «Preparar envio» y vuelve a intentar"})
    pdfs = []
    for pid in paquetes:
        r = _tiktok_api("GET", f"/fulfillment/202309/packages/{pid}/shipping_documents", access,
                        extra_params={"document_type": "SHIPPING_LABEL", "document_size": "A6", "document_format": "PDF", "shop_cipher": cipher})
        if r.get("code") != 0:
            msg = _ERR_GUIA.get(r.get("code")) or f"TikTok no entrego la guia: {r.get('message')}"
            return JSONResponse(status_code=409, content={"error": msg, "codigo": r.get("code")})
        url = ((r.get("data") or {}).get("doc_url") or "")
        if not url.startswith("https://"):
            return JSONResponse(status_code=502, content={"error": "TikTok regreso un enlace de guia no valido"})
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as resp:
                pdfs.append(resp.read())
        except Exception as e:
            return JSONResponse(status_code=502, content={"error": f"No se pudo descargar la guia de TikTok: {type(e).__name__}"})
    contenido = pdfs[0]
    if len(pdfs) > 1:
        try:
            import io
            from pypdf import PdfWriter, PdfReader
            w = PdfWriter()
            for b in pdfs:
                for pg in PdfReader(io.BytesIO(b)).pages:
                    w.add_page(pg)
            buf = io.BytesIO()
            w.write(buf)
            contenido = buf.getvalue()
        except Exception:
            return JSONResponse(status_code=500, content={"error": "El pedido trae varios paquetes y no se pudieron unir las guias; imprimelas desde TikTok"})
    return Response(content=contenido, media_type="application/pdf", headers={"Content-Disposition": f'inline; filename="guia_tiktok_{order_id}.pdf"'})


@router.post("/utilidad/sincronizar")
def tiktok_utilidad_sincronizar(_staff=Depends(require_staff)):
    """Trae los pedidos de TikTok posteriores al ultimo registro y los suma a la utilidad (general y «Tu utilidad»). No mueve inventario."""
    import tiktok_sync
    return tiktok_sync.sync_utilidad_tiktok()


@router.post("/sync-ventas")
def tiktok_sync_ventas(_staff=Depends(require_staff)):
    """Corre ahora la importacion de pedidos de TikTok (solo si el interruptor de ventas esta encendido)."""
    import tiktok_sync
    return tiktok_sync.hacer_sync_ventas_tiktok()


@router.get("/nuevos/preparacion")
def tiktok_nuevos_preparacion(_staff=Depends(require_staff)):
    """SOLO LECTURA. Averigua con TikTok lo necesario para crear productos: requisitos de la tienda, ids de las categorias de calzado,
    sus reglas y atributos obligatorios, la marca, la guia de tallas y la bodega."""
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    cipher = tienda.get("cipher", "")
    sal = {}

    def lee(ruta, extra=None):
        q = {"shop_cipher": cipher}
        q.update(extra or {})
        return _tiktok_api("GET", ruta, access, extra_params=q)

    pre = lee("/product/202309/prerequisites")
    sal["requisitos"] = {"code": pre.get("code"), "message": pre.get("message"), "data": pre.get("data")}
    cat = lee("/product/202309/categories", {"locale": "es-MX", "category_version": "v1"})
    cats = (cat.get("data") or {}).get("categories") or []
    sal["categorias_total"] = len(cats)
    por_id = {c.get("id"): c for c in cats}
    buscadas = {"zapatos de tacón", "sandalias y chanclas", "zapatos planos", "botas", "zapatillas informales", "botas para mujer"}
    halladas = []
    for c in cats:
        nom = (c.get("local_name") or "").strip().lower()
        if nom in buscadas:
            padre = por_id.get(c.get("parent_id")) or {}
            abuelo = por_id.get(padre.get("parent_id")) or {}
            halladas.append({"id": c.get("id"), "nombre": c.get("local_name"), "hoja": c.get("is_leaf"), "padre": padre.get("local_name"), "abuelo": abuelo.get("local_name"),
                             "permiso": c.get("permission_statuses")})
    sal["categorias_calzado"] = halladas
    sal["reglas_y_atributos"] = {}
    for c in halladas:
        if c.get("abuelo") and "mujer" not in str(c.get("abuelo")).lower() and "mujer" not in str(c.get("padre")).lower():
            continue
        if not c.get("hoja"):
            continue
        cid = c["id"]
        reglas = lee(f"/product/202309/categories/{cid}/rules", {"locale": "es-MX"})
        atr = lee(f"/product/202309/categories/{cid}/attributes", {"locale": "es-MX"})
        lista = (atr.get("data") or {}).get("attributes") or []
        sal["reglas_y_atributos"][cid] = {
            "nombre": c["nombre"], "padre": c.get("padre"),
            "reglas": (reglas.get("data") or {}) if reglas.get("code") == 0 else {"error": reglas.get("message")},
            "atributos": [{"id": a.get("id"), "nombre": a.get("name"), "obligatorio": a.get("is_requried") or a.get("is_required"), "tipo": a.get("type"),
                           "multiple": a.get("is_multiple_selection"), "personalizable": a.get("is_customizable"),
                           "valores": [(v.get("id"), v.get("name")) for v in (a.get("values") or [])[:6]]} for a in lista],
            "atributos_codigo": atr.get("code"), "atributos_mensaje": atr.get("message"),
        }
    marcas = lee("/product/202309/brands", {"brand_name": "ZAPATILLAS", "page_size": "20"})
    sal["marcas"] = {"code": marcas.get("code"), "message": marcas.get("message"), "data": (marcas.get("data") or {})}
    bod = lee("/logistics/202309/warehouses")
    sal["bodegas"] = {"code": bod.get("code"), "message": bod.get("message"), "data": bod.get("data")}
    return sal


@router.get("/nuevos/lista")
def tiktok_nuevos_lista(refrescar: bool = False, _staff=Depends(require_staff)):
    """SOLO LECTURA. Modelos del ERP que todavia no estan en TikTok y que les falta para poder subirse."""
    import tiktok_nuevos
    from routers.tiktok_excel import _cargar_erp
    ctx, err = _contexto_tienda()
    if err:
        return err
    access, tienda = ctx
    catalogo, e = _catalogo_tiktok(access, tienda.get("cipher", ""), forzar=refrescar)
    if catalogo is None:
        return JSONResponse(status_code=502, content={"error": "TikTok rechazo la lista de productos", **e})
    lista = tiktok_nuevos.lista_nuevos(catalogo, _cargar_erp())
    return {"total": len(lista), "listos": sum(1 for x in lista if x["listo"]), "modelos": lista}


@router.post("/nuevos/publicar")
def tiktok_nuevos_publicar(sku_interno: str, modo: str = "borrador", titulo: str = "", precio: float = 0, solo_vista: bool = False, _admin=Depends(require_admin)):
    """Sube UN modelo nuevo a TikTok. modo=borrador lo deja como borrador de prueba (no se publica); modo=publicar lo crea publicado (pasa a revision de TikTok).
    solo_vista=true arma el producto sin subir nada. Una llamada por modelo."""
    import tiktok_nuevos
    m = "LISTING" if modo == "publicar" else "AS_DRAFT"
    r = tiktok_nuevos.publicar_modelo(sku_interno, modo=m, titulo=titulo or None, precio=precio or None, solo_vista=solo_vista)
    if not r.get("ok"):
        return JSONResponse(status_code=409, content=r)
    return r


@router.get("/comparar-existencias")
def comparar_existencias(limite_productos: int = 0, crudo: bool = False, _staff=Depends(require_staff)):
    """SOLO LECTURA. Lee de TikTok las existencias de cada SKU publicado y las compara con las del ERP (mismo cruce por SKU de vendedor que
    usa el Excel de existencias). No escribe nada en TikTok ni en el ERP.
    - limite_productos: revisa solo los primeros N productos de TikTok (0 = todos).
    - crudo=true: incluye el JSON del primer producto de TikTok para ver su estructura."""
    from routers.tiktok_excel import _cargar_erp, _buscar_qty
    access = _token_vigente()
    if not access:
        return JSONResponse(status_code=401, content={"error": "Sin token vigente de TikTok"})
    r = _tiktok_api("GET", "/authorization/202309/shops", access)
    tiendas = (r.get("data") or {}).get("shops") or []
    if not tiendas:
        return JSONResponse(status_code=502, content={"error": "TikTok no devolvio tiendas", "detalle": r.get("message")})
    cipher = tiendas[0].get("cipher", "")

    productos_tt, token_pag, paginas = [], "", 0
    while True:
        extra = {"page_size": "100", "shop_cipher": cipher}
        if token_pag:
            extra["page_token"] = token_pag
        p = _tiktok_api("POST", "/product/202309/products/search", access, body={}, extra_params=extra)
        if p.get("code") != 0:
            return JSONResponse(status_code=502, content={"error": "TikTok rechazo la busqueda de productos", "codigo": p.get("code"), "mensaje": p.get("message")})
        d = p.get("data") or {}
        productos_tt.extend(d.get("products") or [])
        paginas += 1
        token_pag = d.get("next_page_token") or ""
        if not token_pag or (limite_productos and len(productos_tt) >= limite_productos) or paginas >= 40:
            break
    if limite_productos:
        productos_tt = productos_tt[:limite_productos]

    salida = {"productos_revisados": len(productos_tt)}
    if crudo and productos_tt:
        salida["primer_producto_crudo"] = productos_tt[0]
    _, _, _, inv_por_sku = _cargar_erp()

    skus_total = sin_inventario = sin_sku = sin_match = iguales = 0
    mas_en_tiktok, menos_en_tiktok = [], []
    for prod in productos_tt:
        if prod.get("status") != "ACTIVATE":
            continue   # borrados, en borrador o desactivados: no se venden, no cuentan
        for s in prod.get("skus") or []:
            skus_total += 1
            sv = (s.get("seller_sku") or "").strip()
            inv = s.get("inventory")
            if inv is None:
                sin_inventario += 1
                continue
            qtt = sum(int(i.get("quantity") or 0) for i in inv)
            if not sv:
                sin_sku += 1
                continue
            qerp = _buscar_qty(sv, inv_por_sku)
            if qerp is None:
                sin_match += 1
                continue
            fila = {"sku": sv, "producto": (prod.get("title") or "")[:40], "tiktok": qtt, "erp": qerp}
            if qtt == qerp:
                iguales += 1
            elif qtt > qerp:
                mas_en_tiktok.append(fila)      # TikTok muestra MAS de lo que hay: riesgo de vender de mas
            else:
                menos_en_tiktok.append(fila)    # TikTok muestra MENOS de lo que hay: ventas perdidas
    mas_en_tiktok.sort(key=lambda f: f["tiktok"] - f["erp"], reverse=True)
    menos_en_tiktok.sort(key=lambda f: f["erp"] - f["tiktok"], reverse=True)
    salida.update({
        "skus_en_tiktok": skus_total, "sin_inventario_en_la_busqueda": sin_inventario, "sin_sku_vendedor": sin_sku,
        "sin_match_en_erp": sin_match, "iguales": iguales,
        "tiktok_muestra_mas_que_erp": len(mas_en_tiktok), "tiktok_muestra_menos_que_erp": len(menos_en_tiktok),
        "pares_de_mas_en_tiktok": sum(f["tiktok"] - f["erp"] for f in mas_en_tiktok),
        "pares_de_menos_en_tiktok": sum(f["erp"] - f["tiktok"] for f in menos_en_tiktok),
        "ejemplos_de_mas": mas_en_tiktok[:25], "ejemplos_de_menos": menos_en_tiktok[:25],
    })
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
