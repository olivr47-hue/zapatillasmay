# -*- coding: utf-8 -*-
"""
routers/searchconsole.py
Lector de Google Search Console vía API (server-side), para diagnosticar
indexación, cobertura y rendimiento de búsqueda SIN depender de Windsor.

Autenticación: Service Account JWT (mismo patrón que analytics.py).
Variables de entorno (en Railway):
  GSC_CREDENTIALS_JSON  — contenido COMPLETO del JSON de la cuenta de servicio
                          (p. ej. claude-seo-reader@...iam.gserviceaccount.com)
  GSC_SITE_URL          — propiedad en Search Console. Para propiedad de dominio
                          usar "sc-domain:zapatillasmay.mx" (valor por defecto).

Requisito manual (una sola vez):
  En Search Console → Configuración → Usuarios y permisos → Agregar usuario →
  pegar el email de la cuenta de servicio con permiso "Completo".
"""

import os, json, time, urllib.parse, urllib.request, urllib.error
from fastapi import APIRouter
import google_sa

router = APIRouter(prefix="/searchconsole", tags=["SearchConsole"])

GSC_CREDENTIALS = os.getenv("GSC_CREDENTIALS_JSON", "")
GSC_SITE_URL    = os.getenv("GSC_SITE_URL", "sc-domain:zapatillasmay.mx")
GSC_SCOPE       = "https://www.googleapis.com/auth/webmasters.readonly"

_token_cache: dict = {"token": None, "expires": 0}
_last_error = ""


def _access_token() -> str | None:
    """Access token del service account (firma RS256 en Python puro)."""
    global _last_error
    if not GSC_CREDENTIALS:
        _last_error = "Falta GSC_CREDENTIALS_JSON"
        return None
    now = int(time.time())
    if _token_cache["token"] and _token_cache["expires"] > now + 60:
        return _token_cache["token"]
    try:
        token = google_sa.get_access_token(GSC_CREDENTIALS, GSC_SCOPE)
        if not token:
            _last_error = "Respuesta sin access_token"
            return None
        _token_cache["token"]   = token
        _token_cache["expires"] = now + 3500
        _last_error = ""
        return token
    except urllib.error.HTTPError as e:
        _last_error = f"HTTP {e.code}: {e.read().decode(errors='replace')[:300]}"
        print(f"[searchconsole] {_last_error}")
        return None
    except Exception as e:
        _last_error = f"Error token: {e}"
        print(f"[searchconsole] {_last_error}")
        return None


def _api(url: str, body: dict | None = None) -> dict | None:
    """Llama a la API de Search Console. POST si hay body, GET si no."""
    global _last_error
    token = _access_token()
    if not token:
        return None
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url, data=data, headers=headers, method="POST" if body is not None else "GET"
    )
    try:
        with urllib.request.urlopen(req) as r:
            _last_error = ""
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="replace")[:600]
        _last_error = f"HTTP {e.code}: {detalle}"
        print(f"[searchconsole] {_last_error}")
        return None
    except Exception as e:
        _last_error = str(e)
        print(f"[searchconsole] {_last_error}")
        return None


def _configurado() -> bool:
    return bool(GSC_CREDENTIALS and GSC_SITE_URL)


def _no_config():
    return {
        "configurado": False,
        "mensaje": "Search Console no está configurado.",
        "pasos": [
            "1. En Search Console → Configuración → Usuarios y permisos → Agregar usuario:",
            "   pega el email de la cuenta de servicio con permiso 'Completo'.",
            "2. En Railway agrega GSC_CREDENTIALS_JSON con el JSON completo de la cuenta.",
            "3. (Opcional) GSC_SITE_URL si la propiedad no es sc-domain:zapatillasmay.mx",
        ],
    }


@router.get("/diagnostico")
def diagnostico():
    """Verifica configuración y conectividad con la API."""
    import sys
    ok = _configurado()
    token = _access_token() if ok else None
    return {
        "build": "2026-06-23d-purepy",   # marcador para confirmar despliegue
        "python": sys.version.split()[0],
        "tiene_credentials": bool(GSC_CREDENTIALS),
        "site_url": GSC_SITE_URL,
        "token_ok": bool(token),
        "ultimo_error": _last_error,
    }


@router.get("/analytics")
def search_analytics(dias: int = 28, dimension: str = "query", limite: int = 100):
    """
    Rendimiento de búsqueda (clicks, impresiones, CTR, posición).
    dimension: query | page | country | device | date
    """
    if not _configurado():
        return _no_config()
    import datetime as _dt
    hoy = _dt.date.today()
    inicio = hoy - _dt.timedelta(days=dias)
    site = urllib.parse.quote(GSC_SITE_URL, safe="")
    url = f"https://www.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query"
    resp = _api(url, {
        "startDate": inicio.isoformat(),
        "endDate": hoy.isoformat(),
        "dimensions": [dimension],
        "rowLimit": max(1, min(limite, 1000)),
    })
    if resp is None:
        return {"configurado": True, "error": _last_error}
    filas = []
    for row in resp.get("rows", []):
        keys = row.get("keys", [])
        filas.append({
            dimension: keys[0] if keys else "",
            "clicks": row.get("clicks", 0),
            "impresiones": row.get("impressions", 0),
            "ctr": round(row.get("ctr", 0) * 100, 2),
            "posicion": round(row.get("position", 0), 1),
        })
    return {"configurado": True, "dias": dias, "dimension": dimension, "filas": filas}


@router.get("/inspeccionar")
def inspeccionar_url(url: str):
    """
    Inspección de URL (estado de indexación, cobertura, último rastreo).
    Devuelve por qué Google NO indexa una página concreta.
    """
    if not _configurado():
        return _no_config()
    if not url:
        return {"configurado": True, "error": "Falta el parámetro url"}
    resp = _api(
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        {"inspectionUrl": url, "siteUrl": GSC_SITE_URL},
    )
    if resp is None:
        return {"configurado": True, "error": _last_error}
    idx = (resp.get("inspectionResult") or {}).get("indexStatusResult", {})
    return {
        "configurado": True,
        "url": url,
        "veredicto": idx.get("verdict"),                 # PASS / NEUTRAL / FAIL
        "cobertura": idx.get("coverageState"),           # ej: "Submitted and indexed"
        "robots": idx.get("robotsTxtState"),
        "indexacion": idx.get("indexingState"),
        "ultimo_rastreo": idx.get("lastCrawlTime"),
        "url_canonica_google": idx.get("googleCanonical"),
        "url_canonica_declarada": idx.get("userCanonical"),
        "page_fetch": idx.get("pageFetchState"),
        "_raw": resp.get("inspectionResult"),
    }


@router.get("/inspeccionar-muestra")
def inspeccionar_muestra(urls: str):
    """Inspecciona varias URLs (separadas por coma) para diagnosticar en lote."""
    if not _configurado():
        return _no_config()
    lista = [u.strip() for u in (urls or "").split(",") if u.strip()][:20]
    resultados = []
    for u in lista:
        r = inspeccionar_url(u)
        resultados.append({
            "url": u,
            "veredicto": r.get("veredicto"),
            "cobertura": r.get("cobertura"),
            "canonica_google": r.get("url_canonica_google"),
            "error": r.get("error"),
        })
    return {"configurado": True, "total": len(resultados), "resultados": resultados}
