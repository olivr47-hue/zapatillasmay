import os
import urllib.request
import json
from dotenv import load_dotenv

load_dotenv()

# ── Timeout por defecto para TODAS las llamadas urllib del backend ───────────────────────────
# urllib.request.urlopen no tiene timeout por defecto: si Meta/Google/MercadoLibre dejan una conexión
# colgada, el hilo (y, con los candados de sincronización, la sync completa) se queda esperando
# para siempre. ~50 llamadas del backend no pasaban timeout. Las que ya lo pasan no cambian.
import socket as _socket
_urlopen_original = urllib.request.urlopen


def _urlopen_con_timeout(url, data=None, timeout=_socket._GLOBAL_DEFAULT_TIMEOUT, *args, **kwargs):
    if timeout is _socket._GLOBAL_DEFAULT_TIMEOUT:
        timeout = 90
    return _urlopen_original(url, data, timeout, *args, **kwargs)


urllib.request.urlopen = _urlopen_con_timeout

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

_TIMEOUT = 30  # segundos: sin timeout, un Supabase lento colgaba el hilo del request para siempre

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def supabase_get(tabla):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise Exception(f"HTTP {e.code}: {error_body}")

def supabase_get_all(tabla_base, page_size=1000):
    """Trae todos los registros paginando con Range headers (método oficial PostgREST/Supabase)."""
    todos = []
    offset = 0
    url = f"{SUPABASE_URL}/rest/v1/{tabla_base}"
    while True:
        headers = {
            **HEADERS,
            "Range-Unit": "items",
            "Range": f"{offset}-{offset + page_size - 1}"
        }
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=_TIMEOUT) as response:
                chunk = json.loads(response.read())
        except urllib.error.HTTPError as e:
            if e.code == 416:
                # 416 Range Not Satisfiable = ya no hay más registros
                break
            # Antes se devolvía en silencio lo acumulado: un sync/reporte trabajaba con datos
            # incompletos sin enterarse. Ahora el error se propaga.
            raise Exception(f"HTTP {e.code}: {e.read().decode(errors='replace')}")
        if not isinstance(chunk, list):
            break
        todos.extend(chunk)
        if len(chunk) < page_size:
            break
        offset += page_size
    return todos

def supabase_post(tabla, data):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise Exception(f"HTTP {e.code}: {error_body}")

def supabase_patch(tabla, data):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=HEADERS, method="PATCH")
    try:
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise Exception(f"HTTP {e.code}: {error_body}")

def obtener_consecutivo(nombre):
    """Siguiente consecutivo. El PATCH es condicional (compare-and-swap sobre el valor
    leído): si otra petición lo incrementó en medio, reintenta en vez de entregar el
    mismo número dos veces (antes duplicaba SKUs)."""
    for _ in range(8):
        resultado = supabase_get(f"consecutivos?id=eq.{nombre}")
        if not resultado:
            return 1
        valor = resultado[0]["valor"]
        if supabase_patch(f"consecutivos?id=eq.{nombre}&valor=eq.{valor}", {"valor": valor + 1}):
            return valor
    raise Exception(f"No se pudo obtener el consecutivo '{nombre}' (contención)")

def get_url():
    return SUPABASE_URL

def get_headers():
    return HEADERS

def supabase_delete(tabla):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    headers = {**HEADERS, "Prefer": "return=minimal"}
    req = urllib.request.Request(url, headers=headers, method="DELETE")
    try:
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as response:
            return {"ok": True}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise Exception(f"HTTP {e.code}: {error_body}")

def inventario_ajustar(variante_id, sucursal_id, delta, crear=False):
    """Suma `delta` (negativo = descontar) al inventario de una variante en una sucursal de forma
    ATÓMICA, usando la función SQL public.ajustar_inventario (bloquea la fila). Antes cada venta
    leía la cantidad, restaba en Python y escribía: dos ventas simultáneas se pisaban y el stock
    quedaba mal. Nunca baja de 0. `crear=True` crea la fila si no existe (entradas de mercancía).

    Devuelve {"anterior": N, "nueva": M}, o None si no hay fila de inventario y crear=False.
    Si la función SQL no existe todavía en la base, cae al método anterior (no atómico)."""
    url = f"{SUPABASE_URL}/rest/v1/rpc/ajustar_inventario"
    body = json.dumps({
        "p_variante": str(variante_id), "p_sucursal": str(sucursal_id),
        "p_delta": int(delta), "p_crear": bool(crear),
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as response:
            raw = response.read()
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="replace")
        if e.code in (401, 403, 404) or "PGRST202" in detalle or "42501" in detalle:   # función ausente o sin permiso: método anterior
            return _inventario_ajustar_legacy(variante_id, sucursal_id, delta, crear)
        raise Exception(f"HTTP {e.code}: {detalle}")


def _inventario_ajustar_legacy(variante_id, sucursal_id, delta, crear):
    filas = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}&select=cantidad")
    if not filas:
        if not crear:
            return None
        nueva = max(0, int(delta))
        supabase_post("inventario", {"variante_id": variante_id, "sucursal_id": sucursal_id, "cantidad": nueva, "stock_minimo": 3})
        return {"anterior": 0, "nueva": nueva}
    anterior = int(filas[0].get("cantidad") or 0)
    nueva = max(0, anterior + int(delta))
    supabase_patch(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}", {"cantidad": nueva})
    return {"anterior": anterior, "nueva": nueva}
