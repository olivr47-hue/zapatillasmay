# -*- coding: utf-8 -*-
"""
routers/businessprofile.py
Lector de Google Business Profile (My Business) vía API, para confirmar la tienda
verificada y su store_code (necesario para Local Inventory Ads).

Auth: misma cuenta de servicio (GSC_CREDENTIALS_JSON), firma RS256 en Python puro.
Scope: https://www.googleapis.com/auth/business.manage

Requisitos:
  - La cuenta de servicio debe estar agregada como administrador/gerente en la
    cuenta de Business Profile.
  - APIs habilitadas: My Business Account Management + Business Information.
    (Google a veces exige solicitar acceso/cuota; si da 403, ese es el motivo.)
"""

import os, json, time, urllib.parse, urllib.request, urllib.error
from fastapi import APIRouter
import google_sa

router = APIRouter(prefix="/businessprofile", tags=["BusinessProfile"])

CREDENTIALS = os.getenv("GSC_CREDENTIALS_JSON", "") or os.getenv("MERCHANT_CREDENTIALS_JSON", "")
SCOPE = "https://www.googleapis.com/auth/business.manage"

_token_cache: dict = {"token": None, "expires": 0}
_last_error = ""


def _access_token() -> str | None:
    global _last_error
    if not CREDENTIALS:
        _last_error = "Falta GSC_CREDENTIALS_JSON"
        return None
    now = int(time.time())
    if _token_cache["token"] and _token_cache["expires"] > now + 60:
        return _token_cache["token"]
    try:
        token = google_sa.get_access_token(CREDENTIALS, SCOPE)
        if not token:
            _last_error = "Respuesta sin access_token"
            return None
        _token_cache["token"] = token
        _token_cache["expires"] = now + 3500
        _last_error = ""
        return token
    except urllib.error.HTTPError as e:
        _last_error = f"HTTP {e.code}: {e.read().decode(errors='replace')[:300]}"
        return None
    except Exception as e:
        _last_error = f"Error token: {e}"
        return None


def _get(url: str) -> dict | None:
    global _last_error
    token = _access_token()
    if not token:
        return None
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"}, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            _last_error = ""
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        _last_error = f"HTTP {e.code}: {e.read().decode(errors='replace')[:400]}"
        return None
    except Exception as e:
        _last_error = str(e)
        return None


@router.get("/diagnostico")
def diagnostico():
    token = _access_token() if CREDENTIALS else None
    return {"tiene_credentials": bool(CREDENTIALS), "token_ok": bool(token), "ultimo_error": _last_error}


@router.get("/cuentas")
def cuentas():
    """Lista las cuentas de Business Profile accesibles por la cuenta de servicio."""
    if not CREDENTIALS:
        return {"error": "Falta GSC_CREDENTIALS_JSON"}
    resp = _get("https://mybusinessaccountmanagement.googleapis.com/v1/accounts")
    if resp is None:
        return {"error": _last_error}
    return resp


@router.get("/tiendas")
def tiendas(account: str = ""):
    """
    Lista las ubicaciones (tiendas) de una cuenta con su store_code y verificación.
    account: 'accounts/123...'. Si se omite, usa la primera cuenta encontrada.
    """
    if not CREDENTIALS:
        return {"error": "Falta GSC_CREDENTIALS_JSON"}
    if not account:
        cs = _get("https://mybusinessaccountmanagement.googleapis.com/v1/accounts")
        if not cs or not cs.get("accounts"):
            return {"error": _last_error or "Sin cuentas accesibles (¿agregaste la cuenta de servicio como gerente?)"}
        account = cs["accounts"][0]["name"]
    mask = "name,title,storeCode,storefrontAddress,metadata,phoneNumbers"
    url = (
        f"https://mybusinessbusinessinformation.googleapis.com/v1/{account}/locations"
        f"?readMask={urllib.parse.quote(mask)}&pageSize=100"
    )
    resp = _get(url)
    if resp is None:
        return {"account": account, "error": _last_error}
    tiendas = []
    for loc in resp.get("locations", []):
        md = loc.get("metadata", {}) or {}
        tiendas.append({
            "nombre": loc.get("title"),
            "store_code": loc.get("storeCode"),
            "resource": loc.get("name"),
            "verificada_voz_comerciante": md.get("hasVoiceOfMerchant"),
            "puede_operar": md.get("canOperateLocalPost"),
        })
    return {"account": account, "total": len(tiendas), "tiendas": tiendas}
