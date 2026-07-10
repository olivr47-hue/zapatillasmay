# -*- coding: utf-8 -*-
"""
Router Walmart Marketplace API (MX) — ERP Zapatillas May.

Autenticación: OAuth2 client_credentials, Client ID/Client Secret sacados del
Walmart Developer Portal (Seller Center -> API keys). El access token dura
15 minutos (900s); se cachea en memoria y se renueva solo cuando falta poco
para vencer, mismo patrón que el token de MercadoLibre.

Headers obligatorios en TODAS las llamadas autenticadas (fuera del Token API):
  WM_SEC.ACCESS_TOKEN, WM_QOS.CORRELATION_ID, WM_SVC.NAME, WM_MARKET=mx.
"""

import os, json, time, uuid, base64
import urllib.request, urllib.error, urllib.parse
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/walmart", tags=["Walmart"])

# ─── Configuración ──────────────────────────────────────────────────────────
WALMART_CLIENT_ID     = os.getenv("WALMART_CLIENT_ID", "")
WALMART_CLIENT_SECRET = os.getenv("WALMART_CLIENT_SECRET", "")
WALMART_BASE          = "https://marketplace.walmartapis.com/v3"
WALMART_MARKET        = "mx"

_token_cache = {"token": "", "expires_at": 0.0}


def _walmart_get_token() -> str:
    """Token API (POST /v3/token, grant_type=client_credentials). El token
    dura 900s -- se renueva con 60s de margen antes de que venza."""
    now = time.time()
    if _token_cache["token"] and _token_cache["expires_at"] > now + 60:
        return _token_cache["token"]
    if not (WALMART_CLIENT_ID and WALMART_CLIENT_SECRET):
        raise HTTPException(500, "Faltan WALMART_CLIENT_ID / WALMART_CLIENT_SECRET en el entorno")

    basic = base64.b64encode(f"{WALMART_CLIENT_ID}:{WALMART_CLIENT_SECRET}".encode()).decode()
    body  = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()
    req = urllib.request.Request(
        f"{WALMART_BASE}/token", data=body, method="POST",
        headers={
            "Authorization":          f"Basic {basic}",
            "Content-Type":           "application/x-www-form-urlencoded",
            "Accept":                 "application/json",
            "WM_MARKET":              WALMART_MARKET,
            "WM_SVC.NAME":            "Walmart Marketplace",
            "WM_QOS.CORRELATION_ID":  str(uuid.uuid4()),
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="ignore")
        raise HTTPException(e.code, f"Walmart token error: {detalle}")
    except urllib.error.URLError as e:
        raise HTTPException(502, f"Walmart token: no se pudo conectar ({e.reason})")

    _token_cache["token"]      = resp["access_token"]
    _token_cache["expires_at"] = now + int(resp.get("expires_in", 900))
    return _token_cache["token"]


def _walmart_headers(extra: dict = None) -> dict:
    headers = {
        "WM_SEC.ACCESS_TOKEN":     _walmart_get_token(),
        "WM_SVC.NAME":             "Walmart Marketplace",
        "WM_QOS.CORRELATION_ID":   str(uuid.uuid4()),
        "WM_MARKET":               WALMART_MARKET,
        "Accept":                  "application/json",
    }
    if extra:
        headers.update(extra)
    return headers


def walmart_get(path: str, params: dict = None) -> dict:
    url = f"{WALMART_BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
    req = urllib.request.Request(url, headers=_walmart_headers())
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="ignore")
        raise HTTPException(e.code, f"Walmart API error: {detalle}")


def walmart_post(path: str, data: dict) -> dict:
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{WALMART_BASE}{path}", data=body, method="POST",
        headers=_walmart_headers({"Content-Type": "application/json"}),
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="ignore")
        raise HTTPException(e.code, f"Walmart API error: {detalle}")


@router.get("/ping")
def walmart_ping():
    """Prueba de conexión: pide un token y hace una llamada liviana autenticada
    (Get All Items, 1 resultado) para confirmar que las credenciales funcionan
    de punta a punta."""
    _walmart_get_token()
    try:
        resp = walmart_get("/items", params={"limit": 1})
    except HTTPException as e:
        return {"ok": False, "token_ok": True, "error": e.detail}
    return {"ok": True, "respuesta": resp}
