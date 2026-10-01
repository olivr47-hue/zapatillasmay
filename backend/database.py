import os
import urllib.request
import json
from dotenv import load_dotenv

load_dotenv()

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