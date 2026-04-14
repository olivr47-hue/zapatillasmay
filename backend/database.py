import os
import urllib.request
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def supabase_get(tabla):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())

def supabase_post(tabla, data):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise Exception(f"HTTP {e.code}: {error_body}")

def supabase_patch(tabla, data):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=HEADERS, method="PATCH")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise Exception(f"HTTP {e.code}: {error_body}")

def obtener_consecutivo(nombre):
    resultado = supabase_get(f"consecutivos?id=eq.{nombre}")
    if resultado and len(resultado) > 0:
        valor = resultado[0]["valor"]
        supabase_patch(f"consecutivos?id=eq.{nombre}", {"valor": valor + 1})
        return valor
    return 1

def get_url():
    return SUPABASE_URL

def get_headers():
    return HEADERS
    def supabase_delete(tabla):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    req = urllib.request.Request(url, headers=HEADERS, method="DELETE")
    try:
        with urllib.request.urlopen(req) as response:
            return {"ok": True}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise Exception(f"HTTP {e.code}: {error_body}")