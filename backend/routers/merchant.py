# -*- coding: utf-8 -*-
"""
routers/merchant.py
Lector de Google Merchant Center vía Content API for Shopping (v2.1), server-side,
para revisar el estado real de los productos y sus RECHAZOS/avisos ("Requiere
atención") SIN depender de Windsor.

Autenticación: Service Account JWT (mismo patrón que analytics.py / searchconsole.py).
Usa la MISMA llave que Search Console (una sola variable sirve para ambos):
  MERCHANT_CREDENTIALS_JSON  — JSON completo de la cuenta de servicio, o
  GSC_CREDENTIALS_JSON       — fallback (misma cuenta claude-seo-reader).
  MERCHANT_ID                — ID de la cuenta de Merchant (default 5536736016).

Requisito manual (una sola vez):
  Merchant Center → Acceso y servicios → Usuarios → agregar el email de la cuenta
  de servicio. Y en Google Cloud, habilitar "Content API for Shopping".
"""

import os, json, time, urllib.parse, urllib.request, urllib.error
from fastapi import APIRouter
import google_sa

router = APIRouter(prefix="/merchant", tags=["Merchant"])

MERCHANT_CREDENTIALS = os.getenv("MERCHANT_CREDENTIALS_JSON", "") or os.getenv("GSC_CREDENTIALS_JSON", "")
MERCHANT_ID          = os.getenv("MERCHANT_ID", "5536736016")
MERCHANT_SCOPE       = "https://www.googleapis.com/auth/content"
BASE                 = "https://shoppingcontent.googleapis.com/content/v2.1"

_token_cache: dict = {"token": None, "expires": 0}
_last_error = ""


def _access_token() -> str | None:
    global _last_error
    if not MERCHANT_CREDENTIALS:
        _last_error = "Falta MERCHANT_CREDENTIALS_JSON / GSC_CREDENTIALS_JSON"
        return None
    now = int(time.time())
    if _token_cache["token"] and _token_cache["expires"] > now + 60:
        return _token_cache["token"]
    try:
        token = google_sa.get_access_token(MERCHANT_CREDENTIALS, MERCHANT_SCOPE)
        if not token:
            _last_error = "Respuesta sin access_token"
            return None
        _token_cache["token"]   = token
        _token_cache["expires"] = now + 3500
        _last_error = ""
        return token
    except urllib.error.HTTPError as e:
        _last_error = f"HTTP {e.code}: {e.read().decode(errors='replace')[:300]}"
        print(f"[merchant] {_last_error}")
        return None
    except Exception as e:
        _last_error = f"Error token: {e}"
        print(f"[merchant] {_last_error}")
        return None


def _get(path: str) -> dict | None:
    global _last_error
    token = _access_token()
    if not token:
        return None
    req = urllib.request.Request(
        f"{BASE}/{path}",
        headers={"Authorization": f"Bearer {token}"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(req) as r:
            _last_error = ""
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        _last_error = f"HTTP {e.code}: {e.read().decode(errors='replace')[:600]}"
        print(f"[merchant] {_last_error}")
        return None
    except Exception as e:
        _last_error = str(e)
        print(f"[merchant] {_last_error}")
        return None


def _configurado() -> bool:
    return bool(MERCHANT_CREDENTIALS and MERCHANT_ID)


def _no_config():
    return {
        "configurado": False,
        "mensaje": "Merchant Center no está configurado.",
        "pasos": [
            "1. Merchant Center → Acceso y servicios → Usuarios: agrega el email de la cuenta de servicio.",
            "2. Google Cloud → habilita 'Content API for Shopping' en el proyecto de la cuenta.",
            "3. Railway: MERCHANT_CREDENTIALS_JSON (o reutiliza GSC_CREDENTIALS_JSON) con el JSON de la cuenta.",
            "4. (Opcional) MERCHANT_ID si no es 5536736016.",
        ],
    }


@router.get("/diagnostico")
def diagnostico():
    ok = _configurado()
    token = _access_token() if ok else None
    info = None
    if token:
        info = _get(f"{MERCHANT_ID}/accounts/{MERCHANT_ID}")
    return {
        "build": "2026-06-23d-purepy",
        "tiene_credentials": bool(MERCHANT_CREDENTIALS),
        "merchant_id": MERCHANT_ID,
        "token_ok": bool(token),
        "cuenta_ok": bool(info),
        "ultimo_error": _last_error,
    }


@router.get("/estado-productos")
def estado_productos(limite: int = 250, solo_con_problemas: bool = True):
    """
    Lista el estado de los productos con sus item-level issues (rechazos/avisos).
    solo_con_problemas=True devuelve únicamente los que tienen al menos un issue.
    """
    if not _configurado():
        return _no_config()
    resp = _get(f"{MERCHANT_ID}/productstatuses?maxResults={max(1, min(limite, 250))}")
    if resp is None:
        return {"configurado": True, "error": _last_error}
    salida = []
    for p in resp.get("resources", []):
        issues = p.get("itemLevelIssues", []) or []
        if solo_con_problemas and not issues:
            continue
        salida.append({
            "product_id": p.get("productId"),
            "titulo": p.get("title"),
            "destinos": [
                {"destino": d.get("destination"), "estado": d.get("status")}
                for d in p.get("destinationStatuses", []) or []
            ],
            "issues": [
                {
                    "codigo": i.get("code"),
                    "severidad": i.get("servability"),     # disapproved / demoted / unaffected
                    "atributo": i.get("attributeName"),
                    "descripcion": i.get("description"),
                    "detalle": i.get("detail"),
                    "paises": i.get("applicableCountries"),
                }
                for i in issues
            ],
        })
    return {
        "configurado": True,
        "total_devueltos": len(resp.get("resources", [])),
        "con_problemas": len(salida),
        "hay_mas": bool(resp.get("nextPageToken")),
        "productos": salida,
    }


@router.get("/resumen-problemas")
def resumen_problemas(limite: int = 250):
    """Agrega los problemas por código/descripción y severidad (vista rápida)."""
    if not _configurado():
        return _no_config()
    resp = _get(f"{MERCHANT_ID}/productstatuses?maxResults={max(1, min(limite, 250))}")
    if resp is None:
        return {"configurado": True, "error": _last_error}
    agg: dict = {}
    total = 0
    for p in resp.get("resources", []):
        total += 1
        for i in p.get("itemLevelIssues", []) or []:
            clave = (i.get("description") or i.get("code") or "?", i.get("servability") or "?")
            agg[clave] = agg.get(clave, 0) + 1
    problemas = sorted(
        ({"problema": k[0], "severidad": k[1], "productos_afectados": v} for k, v in agg.items()),
        key=lambda x: -x["productos_afectados"],
    )
    return {
        "configurado": True,
        "productos_analizados": total,
        "hay_mas": bool(resp.get("nextPageToken")),
        "problemas": problemas,
    }
