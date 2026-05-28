# -*- coding: utf-8 -*-
"""
routers/analytics.py
Datos de Google Analytics 4 (real-time + métricas del día y semana).

Variables de entorno requeridas:
  GA4_PROPERTY_ID       — solo el número, ej: "123456789"
  GA4_CREDENTIALS_JSON  — contenido completo del JSON del service account de Google

Configuración en Google Cloud:
  1. Habilitar "Google Analytics Data API" en tu proyecto
  2. Crear Service Account → descargar JSON de la llave
  3. En GA4 → Admin → Property Access Management → agregar el email del service account como Viewer
"""

import os, json, time, urllib.request, urllib.error
from fastapi import APIRouter

try:
    import jwt as pyjwt
    JWT_OK = True
except ImportError:
    JWT_OK = False

router = APIRouter(prefix="/analytics", tags=["Analytics"])

GA4_PROPERTY_ID  = os.getenv("GA4_PROPERTY_ID", "")
GA4_CREDENTIALS  = os.getenv("GA4_CREDENTIALS_JSON", "")
GA4_BASE         = "https://analyticsdata.googleapis.com/v1beta"

# Cache simple del token (expira en ~55 min)
_token_cache: dict = {"token": None, "expires": 0}


def _access_token() -> str | None:
    """Obtiene access token de Google usando JWT del service account."""
    if not JWT_OK or not GA4_CREDENTIALS:
        return None

    now = int(time.time())
    if _token_cache["token"] and _token_cache["expires"] > now + 60:
        return _token_cache["token"]

    try:
        creds = json.loads(GA4_CREDENTIALS)
        payload = {
            "iss":   creds["client_email"],
            "sub":   creds["client_email"],
            "scope": "https://www.googleapis.com/auth/analytics.readonly",
            "aud":   "https://oauth2.googleapis.com/token",
            "iat":   now,
            "exp":   now + 3600,
        }
        signed = pyjwt.encode(payload, creds["private_key"], algorithm="RS256")

        data = f"grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion={signed}".encode()
        req  = urllib.request.Request(
            "https://oauth2.googleapis.com/token",
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        with urllib.request.urlopen(req) as r:
            resp = json.loads(r.read())

        token = resp.get("access_token")
        _token_cache["token"]   = token
        _token_cache["expires"] = now + resp.get("expires_in", 3600)
        return token

    except Exception as e:
        print(f"[analytics] Error obteniendo token: {e}")
        return None


def _ga4_post(endpoint: str, body: dict) -> dict | None:
    """POST a GA4 Data API."""
    token = _access_token()
    if not token:
        return None
    url      = f"{GA4_BASE}/properties/{GA4_PROPERTY_ID}:{endpoint}"
    req_body = json.dumps(body).encode()
    req      = urllib.request.Request(
        url, data=req_body,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f"[analytics] GA4 error {e.code}: {e.read().decode(errors='replace')[:300]}")
        return None
    except Exception as e:
        print(f"[analytics] GA4 error: {e}")
        return None


def _no_credenciales():
    return {
        "configurado": False,
        "mensaje": (
            "Google Analytics no está configurado. "
            "Agrega GA4_PROPERTY_ID y GA4_CREDENTIALS_JSON en las variables de entorno de Railway."
        ),
        "pasos": [
            "1. En Google Cloud Console → habilita 'Google Analytics Data API'",
            "2. Crea un Service Account → descarga el JSON de la llave",
            "3. En GA4 → Admin → Property Access Management → agrega el email del service account como Viewer",
            "4. Copia el ID de la propiedad (solo el número) en GA4_PROPERTY_ID",
            "5. Pega el contenido completo del JSON en GA4_CREDENTIALS_JSON",
        ]
    }


@router.get("/tiempo-real")
def usuarios_tiempo_real():
    """Usuarios activos en este momento en el sitio."""
    if not GA4_PROPERTY_ID or not GA4_CREDENTIALS:
        return _no_credenciales()

    resp = _ga4_post("runRealtimeReport", {
        "metrics": [
            {"name": "activeUsers"},
        ],
        "dimensions": [
            {"name": "country"},
            {"name": "deviceCategory"},
        ],
        "minuteRanges": [{"name": "now", "startMinutesAgo": 29, "endMinutesAgo": 0}],
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos de GA4", "activos": 0}

    total = 0
    por_pais    = {}
    por_dispositivo = {}

    for row in resp.get("rows", []):
        dims  = [d.get("value", "") for d in row.get("dimensionValues", [])]
        valor = int(row.get("metricValues", [{}])[0].get("value", 0))
        total += valor
        pais   = dims[0] if len(dims) > 0 else "?"
        dispo  = dims[1] if len(dims) > 1 else "?"
        por_pais[pais]         = por_pais.get(pais, 0) + valor
        por_dispositivo[dispo] = por_dispositivo.get(dispo, 0) + valor

    return {
        "configurado":       True,
        "activos_ahora":     total,
        "por_pais":          dict(sorted(por_pais.items(), key=lambda x: -x[1])[:5]),
        "por_dispositivo":   por_dispositivo,
    }


@router.get("/hoy")
def metricas_hoy():
    """Métricas del día de hoy."""
    if not GA4_PROPERTY_ID or not GA4_CREDENTIALS:
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges":  [{"startDate": "today", "endDate": "today"}],
        "metrics": [
            {"name": "sessions"},
            {"name": "activeUsers"},
            {"name": "newUsers"},
            {"name": "screenPageViews"},
            {"name": "averageSessionDuration"},
            {"name": "bounceRate"},
        ],
        "dimensions": [{"name": "pagePath"}],
        "orderBys":   [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        "limit":      10,
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos de GA4"}

    totals = {}
    for i, h in enumerate(resp.get("metricHeaders", [])):
        totals[h["name"]] = 0
    for row in resp.get("rows", []):
        for i, mv in enumerate(row.get("metricValues", [])):
            key = resp["metricHeaders"][i]["name"]
            try:
                totals[key] = totals.get(key, 0) + float(mv.get("value", 0))
            except Exception:
                pass

    top_paginas = []
    for row in (resp.get("rows") or [])[:10]:
        dims  = row.get("dimensionValues", [])
        metr  = row.get("metricValues",   [])
        pagina = dims[0].get("value", "/") if dims else "/"
        vistas = int(float(metr[3].get("value", 0))) if len(metr) > 3 else 0
        top_paginas.append({"pagina": pagina, "vistas": vistas})

    return {
        "configurado":          True,
        "sesiones":             int(totals.get("sessions", 0)),
        "usuarios_activos":     int(totals.get("activeUsers", 0)),
        "usuarios_nuevos":      int(totals.get("newUsers", 0)),
        "paginas_vistas":       int(totals.get("screenPageViews", 0)),
        "duracion_promedio_s":  round(totals.get("averageSessionDuration", 0)),
        "tasa_rebote":          round(totals.get("bounceRate", 0) * 100, 1),
        "top_paginas":          top_paginas,
    }


@router.get("/semana")
def metricas_semana():
    """Sesiones de los últimos 7 días para la gráfica."""
    if not GA4_PROPERTY_ID or not GA4_CREDENTIALS:
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges":  [{"startDate": "7daysAgo", "endDate": "today"}],
        "metrics":     [{"name": "sessions"}, {"name": "activeUsers"}],
        "dimensions":  [{"name": "date"}],
        "orderBys":    [{"dimension": {"dimensionName": "date"}}],
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos de GA4", "dias": []}

    dias = []
    for row in resp.get("rows", []):
        fecha   = row["dimensionValues"][0]["value"]   # YYYYMMDD
        sesiones = int(row["metricValues"][0]["value"])
        usuarios = int(row["metricValues"][1]["value"])
        dias.append({
            "fecha":    f"{fecha[6:8]}/{fecha[4:6]}",  # DD/MM
            "sesiones": sesiones,
            "usuarios": usuarios,
        })

    return {"configurado": True, "dias": dias}
