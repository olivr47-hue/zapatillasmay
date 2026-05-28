# -*- coding: utf-8 -*-
"""
Router MercadoLibre — ERP Zapatillas May
Gestiona el token, busca publicaciones y sincroniza inventario.
"""

import os, json, time, urllib.request, urllib.error, urllib.parse
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from database import supabase_get_all
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

_token_cache = {"token": ML_TOKEN_ENV, "expires_at": 0}

def get_token() -> str:
    """Devuelve el token vigente; lo refresca si tiene refresh_token."""
    now = time.time()
    # Si el token en caché todavía es válido (con 5 min de margen)
    if _token_cache["token"] and _token_cache["expires_at"] > now + 300:
        return _token_cache["token"]

    # Intentar refrescar con refresh_token
    refresh = ML_REFRESH or os.getenv("ML_REFRESH_TOKEN", "")
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
        return {"error": json.loads(e.read()).get("message", str(e))}

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

# ─── Buscar Item IDs de las 3 publicaciones ────────────────────────────────────

@router.get("/items")
def listar_items():
    """Devuelve los Item IDs reales (MLM...) de las 3 publicaciones del catálogo."""
    cached = cache_get("ml_items")
    if cached:
        return cached

    # 1. Traer todos los items del vendedor
    all_ids = []
    offset = 0
    while True:
        resp = ml_get(f"/users/{ML_USER_ID}/items/search?limit=100&offset={offset}")
        batch = resp.get("results", [])
        all_ids.extend(batch)
        if len(batch) < 100:
            break
        offset += 100

    if not all_ids:
        return {"items": [], "message": "No se encontraron publicaciones"}

    # 2. Consultar detalles en batches de 20
    encontrados = {}
    for i in range(0, len(all_ids), 20):
        ids_str = ",".join(all_ids[i:i+20])
        resp = ml_get(f"/items?ids={ids_str}&attributes=id,title,catalog_product_id,available_quantity,status,variations")
        for entry in resp:
            if entry.get("code") != 200:
                continue
            item = entry["body"]
            cat_id = item.get("catalog_product_id", "")
            if cat_id in CATALOGOS:
                encontrados[cat_id] = {
                    "item_id":    item["id"],
                    "title":      item.get("title"),
                    "status":     item.get("status"),
                    "qty":        item.get("available_quantity", 0),
                    "variaciones": len(item.get("variations", [])),
                    "catalogo":   CATALOGOS[cat_id],
                }

    result = {"total_publicaciones": len(all_ids), "encontrados": encontrados}
    cache_set("ml_items", result, ttl=300)
    return result

# ─── Stock del ERP ────────────────────────────────────────────────────────────

def _stock_erp() -> dict:
    """SKU → cantidad total en todas las sucursales."""
    rows = supabase_get_all("inventario?select=variante_id,cantidad")
    por_variante: dict = {}
    for r in rows:
        vid = r.get("variante_id")
        if vid:
            por_variante[vid] = por_variante.get(vid, 0) + (r.get("cantidad") or 0)

    variantes = supabase_get_all("variantes?activa=eq.true&select=id,sku")
    return {
        v["sku"].upper().strip(): por_variante.get(v["id"], 0)
        for v in variantes if v.get("sku")
    }

# ─── Sincronización de inventario ─────────────────────────────────────────────

@router.get("/stock")
def ver_stock_ml():
    """Compara el stock del ERP vs el stock actual en ML para las 3 publicaciones."""
    items_data = listar_items()
    stock_erp = _stock_erp()
    encontrados = items_data.get("encontrados", {})

    reporte = []
    for cat_id, item in encontrados.items():
        item_id = item["item_id"]
        variaciones_ml = ml_get(f"/items/{item_id}?attributes=variations").get("variations", [])

        for var in variaciones_ml:
            seller_sku = ""
            for attr in var.get("attributes", []):
                if attr.get("id") == "SELLER_SKU":
                    seller_sku = (attr.get("value_name") or "").upper().strip()
                    break
            qty_ml  = var.get("available_quantity", 0)
            qty_erp = stock_erp.get(seller_sku, None)
            reporte.append({
                "catalogo":   CATALOGOS[cat_id],
                "item_id":    item_id,
                "var_id":     var["id"],
                "seller_sku": seller_sku,
                "qty_ml":     qty_ml,
                "qty_erp":    qty_erp,
                "diferencia": (qty_erp - qty_ml) if qty_erp is not None else "SKU no encontrado",
            })

    return {"comparacion": reporte, "total_skus_erp": len(stock_erp)}


@router.post("/sync")
def sincronizar_inventario(background_tasks: BackgroundTasks):
    """
    Actualiza el stock de las 3 publicaciones en ML desde el ERP.
    Se ejecuta en background para no bloquear la respuesta.
    """
    background_tasks.add_task(_hacer_sync)
    return {"message": "Sincronización iniciada en background", "catalogos": list(CATALOGOS.values())}


def _hacer_sync():
    """Lógica real de sincronización (corre en background)."""
    try:
        items_data = listar_items()
        stock_erp  = _stock_erp()
        encontrados = items_data.get("encontrados", {})
        log = []

        for cat_id, item in encontrados.items():
            item_id = item["item_id"]
            detalles = ml_get(f"/items/{item_id}?attributes=variations")
            variaciones = detalles.get("variations", [])

            if not variaciones:
                log.append({"item": item_id, "tipo": "simple", "skipped": True})
                continue

            for var in variaciones:
                var_id = var["id"]
                seller_sku = ""
                for attr in var.get("attributes", []):
                    if attr.get("id") == "SELLER_SKU":
                        seller_sku = (attr.get("value_name") or "").upper().strip()
                        break

                if not seller_sku or seller_sku not in stock_erp:
                    log.append({"item": item_id, "var": var_id, "sku": seller_sku, "resultado": "SKU no encontrado"})
                    continue

                nueva_qty = stock_erp[seller_sku]
                resultado = ml_put(f"/items/{item_id}/variations/{var_id}", {"available_quantity": nueva_qty})
                log.append({
                    "item": item_id, "var": var_id,
                    "sku": seller_sku, "nueva_qty": nueva_qty,
                    "resultado": "ok" if "error" not in resultado else resultado.get("error")
                })

        # Guardar log en caché para consultarlo
        cache_set("ml_sync_log", {"ts": time.time(), "log": log}, ttl=3600)
    except Exception as e:
        cache_set("ml_sync_log", {"ts": time.time(), "error": str(e)}, ttl=3600)


@router.get("/sync/log")
def ver_log_sync():
    """Consulta el resultado de la última sincronización."""
    log = cache_get("ml_sync_log")
    if not log:
        return {"message": "No hay sincronizaciones recientes"}
    return log


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
