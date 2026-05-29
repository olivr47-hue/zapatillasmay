# -*- coding: utf-8 -*-
"""
routers/analytics.py
Datos de Google Analytics 4 (real-time + métricas del día y semana).

Autenticación soportada (se usa la primera disponible):
  A) OAuth2 refresh token (recomendado):
       GA4_CLIENT_ID, GA4_CLIENT_SECRET, GA4_REFRESH_TOKEN
  B) Service account JWT:
       GA4_CREDENTIALS_JSON  (contenido completo del JSON)

Variable requerida en ambos casos:
  GA4_PROPERTY_ID  — solo el número, ej: "473384950"
"""

import os, json, time, urllib.request, urllib.parse, urllib.error
from fastapi import APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse

try:
    import jwt as pyjwt
    JWT_OK = True
except ImportError:
    JWT_OK = False

router = APIRouter(prefix="/analytics", tags=["Analytics"])

GA4_PROPERTY_ID  = os.getenv("GA4_PROPERTY_ID", "")
GA4_CREDENTIALS  = os.getenv("GA4_CREDENTIALS_JSON", "")
GA4_CLIENT_ID    = os.getenv("GA4_CLIENT_ID", "")
GA4_CLIENT_SECRET= os.getenv("GA4_CLIENT_SECRET", "")
GA4_REFRESH_TOKEN= os.getenv("GA4_REFRESH_TOKEN", "")
GA4_BASE         = "https://analyticsdata.googleapis.com/v1beta"

_token_cache: dict = {"token": None, "expires": 0}


def _access_token_oauth2() -> str | None:
    """Obtiene access token usando OAuth2 refresh token."""
    if not all([GA4_CLIENT_ID, GA4_CLIENT_SECRET, GA4_REFRESH_TOKEN]):
        return None

    now = int(time.time())
    if _token_cache["token"] and _token_cache["expires"] > now + 60:
        return _token_cache["token"]

    data = urllib.parse.urlencode({
        "client_id":     GA4_CLIENT_ID,
        "client_secret": GA4_CLIENT_SECRET,
        "refresh_token": GA4_REFRESH_TOKEN,
        "grant_type":    "refresh_token",
    }).encode()

    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as r:
            resp = json.loads(r.read())
        token = resp.get("access_token")
        _token_cache["token"]   = token
        _token_cache["expires"] = now + resp.get("expires_in", 3600)
        return token
    except Exception as e:
        print(f"[analytics] Error OAuth2 refresh: {e}")
        return None


def _access_token_jwt() -> str | None:
    """Obtiene access token usando JWT del service account."""
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
        print(f"[analytics] Error JWT service account: {e}")
        return None


def _access_token() -> str | None:
    """Intenta OAuth2 primero, luego service account JWT."""
    return _access_token_oauth2() or _access_token_jwt()


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


def _esta_configurado() -> bool:
    tiene_oauth2 = bool(GA4_CLIENT_ID and GA4_CLIENT_SECRET and GA4_REFRESH_TOKEN)
    tiene_jwt    = bool(GA4_CREDENTIALS)
    return bool(GA4_PROPERTY_ID) and (tiene_oauth2 or tiene_jwt)


def _no_credenciales():
    return {
        "configurado": False,
        "mensaje": (
            "Google Analytics no está configurado. "
            "Agrega las variables de entorno en Railway."
        ),
        "pasos": [
            "Opción A — OAuth2 (recomendada):",
            "  1. Corre get_ga4_token.py para obtener el refresh token",
            "  2. Agrega GA4_CLIENT_ID, GA4_CLIENT_SECRET, GA4_REFRESH_TOKEN en Railway",
            "  3. Agrega GA4_PROPERTY_ID=473384950 en Railway",
            "",
            "Opción B — Service account:",
            "  1. Crea Service Account en Google Cloud → descarga JSON",
            "  2. Agrega el email como Viewer en GA4 → Property Access Management",
            "  3. Pega el JSON completo en GA4_CREDENTIALS_JSON en Railway",
            "  4. Agrega GA4_PROPERTY_ID=473384950 en Railway",
        ]
    }


_RAILWAY_URL  = "https://zapatillasmay-production.up.railway.app"
_CALLBACK_URI = f"{_RAILWAY_URL}/analytics/setup/callback"
_SECRET_KEY   = os.getenv("SECRET_KEY", "zapatillasmay2024erp")


@router.get("/setup", include_in_schema=False)
def analytics_setup(secret: str = ""):
    """Inicia el flujo OAuth2 para obtener el refresh token de GA4."""
    if secret != _SECRET_KEY:
        return HTMLResponse("<h2>❌ Acceso denegado.</h2>", status_code=403)

    if not GA4_CLIENT_ID or not GA4_CLIENT_SECRET:
        return HTMLResponse(
            "<h2>❌ Faltan GA4_CLIENT_ID y GA4_CLIENT_SECRET en las variables de entorno.</h2>",
            status_code=400
        )

    params = urllib.parse.urlencode({
        "client_id":     GA4_CLIENT_ID,
        "redirect_uri":  _CALLBACK_URI,
        "scope":         "https://www.googleapis.com/auth/analytics.readonly",
        "response_type": "code",
        "access_type":   "offline",
        "prompt":        "consent",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/auth?{params}")


@router.get("/setup/callback", include_in_schema=False)
def analytics_setup_callback(code: str = "", error: str = ""):
    """Recibe el código de Google y muestra el refresh token."""
    if error:
        return HTMLResponse(f"<h2>❌ Error: {error}</h2>", status_code=400)
    if not code:
        return HTMLResponse("<h2>❌ No se recibió el código de autorización.</h2>", status_code=400)

    data = urllib.parse.urlencode({
        "code":          code,
        "client_id":     GA4_CLIENT_ID,
        "client_secret": GA4_CLIENT_SECRET,
        "redirect_uri":  _CALLBACK_URI,
        "grant_type":    "authorization_code",
    }).encode()

    try:
        req = urllib.request.Request(
            "https://oauth2.googleapis.com/token",
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST"
        )
        with urllib.request.urlopen(req) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="replace")
        return HTMLResponse(f"<h2>❌ Error al intercambiar código:</h2><pre>{detalle}</pre>", status_code=400)

    refresh_token = resp.get("refresh_token", "")
    if not refresh_token:
        return HTMLResponse(
            f"<h2>❌ No se obtuvo refresh_token.</h2><pre>{json.dumps(resp, indent=2)}</pre>",
            status_code=400
        )

    html = f"""<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<title>GA4 Token</title>
<style>
  body {{ font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; }}
  .token {{ background: #f4f4f4; border: 1px solid #ccc; border-radius: 6px;
             padding: 16px; word-break: break-all; font-family: monospace; font-size: 13px; }}
  .card {{ background: #e8f5e9; border-left: 4px solid #4caf50; padding: 16px;
           border-radius: 4px; margin: 16px 0; }}
  h2 {{ color: #2e7d32; }}
  code {{ background: #eee; padding: 2px 6px; border-radius: 3px; }}
</style>
</head><body>
<h2>✅ Refresh token obtenido</h2>
<p>Copia este valor y agrégalo en Railway como <code>GA4_REFRESH_TOKEN</code>:</p>
<div class="token">{refresh_token}</div>
<div class="card">
<b>Variables que debes agregar en Railway:</b><br><br>
<code>GA4_REFRESH_TOKEN</code> = <em>(el token de arriba)</em><br>
<code>GA4_CLIENT_ID</code> = <em>{GA4_CLIENT_ID}</em><br>
<code>GA4_CLIENT_SECRET</code> = <em>{GA4_CLIENT_SECRET}</em><br>
<code>GA4_PROPERTY_ID</code> = 473384950
</div>
<p>Una vez agregadas las variables, el panel de Analytics funcionará automáticamente.</p>
</body></html>"""
    return HTMLResponse(html)


@router.get("/tiempo-real")
def usuarios_tiempo_real():
    """Usuarios activos en este momento en el sitio."""
    if not _esta_configurado():
        return _no_credenciales()

    # Usuarios por país + dispositivo
    resp = _ga4_post("runRealtimeReport", {
        "metrics":    [{"name": "activeUsers"}],
        "dimensions": [{"name": "country"}, {"name": "deviceCategory"}],
        "minuteRanges": [{"name": "now", "startMinutesAgo": 29, "endMinutesAgo": 0}],
    })

    # Usuarios por página en tiempo real — intentar pagePath
    resp_pags = _ga4_post("runRealtimeReport", {
        "metrics":    [{"name": "activeUsers"}],
        "dimensions": [{"name": "pagePath"}],
        "minuteRanges": [{"name": "now", "startMinutesAgo": 29, "endMinutesAgo": 0}],
        "orderBys":   [{"metric": {"metricName": "activeUsers"}, "desc": True}],
        "limit":      10,
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos de GA4", "activos": 0}

    total = 0
    por_pais        = {}
    por_dispositivo = {}

    for row in resp.get("rows", []):
        dims  = [d.get("value", "") for d in row.get("dimensionValues", [])]
        valor = int(row.get("metricValues", [{}])[0].get("value", 0))
        total += valor
        pais  = dims[0] if len(dims) > 0 else "?"
        dispo = dims[1] if len(dims) > 1 else "?"
        por_pais[pais]         = por_pais.get(pais, 0) + valor
        por_dispositivo[dispo] = por_dispositivo.get(dispo, 0) + valor

    por_pagina = []
    for row in (resp_pags or {}).get("rows", []):
        dims  = [d.get("value", "") for d in row.get("dimensionValues", [])]
        valor = int(row.get("metricValues", [{}])[0].get("value", 0))
        por_pagina.append({"pagina": dims[0] if dims else "/", "activos": valor})

    return {
        "configurado":     True,
        "activos_ahora":   total,
        "por_dispositivo": por_dispositivo,
        "por_pagina":      por_pagina,
    }


@router.get("/hoy")
def metricas_hoy():
    """Métricas del día de hoy."""
    if not _esta_configurado():
        return _no_credenciales()

    # Intentar hoy primero; si no hay datos (GA4 tiene delay), usar ayer
    resp = _ga4_post("runReport", {
        "dateRanges": [{"startDate": "today", "endDate": "today"}],
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
    _periodo = "hoy"
    # Si hoy no tiene filas todavía (GA4 procesa con delay), usar ayer
    if resp and not resp.get("rows"):
        resp = _ga4_post("runReport", {
            "dateRanges": [{"startDate": "yesterday", "endDate": "yesterday"}],
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
        _periodo = "ayer"

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos de GA4"}

    totals = {h["name"]: 0 for h in resp.get("metricHeaders", [])}
    for row in resp.get("rows", []):
        for i, mv in enumerate(row.get("metricValues", [])):
            key = resp["metricHeaders"][i]["name"]
            try:
                totals[key] = totals.get(key, 0) + float(mv.get("value", 0))
            except Exception:
                pass

    top_paginas = []
    for row in (resp.get("rows") or [])[:10]:
        dims   = row.get("dimensionValues", [])
        metr   = row.get("metricValues",   [])
        pagina = dims[0].get("value", "/") if dims else "/"
        vistas = int(float(metr[3].get("value", 0))) if len(metr) > 3 else 0
        top_paginas.append({"pagina": pagina, "vistas": vistas})

    return {
        "configurado":         True,
        "periodo":             _periodo,
        "sesiones":            int(totals.get("sessions", 0)),
        "usuarios_activos":    int(totals.get("activeUsers", 0)),
        "usuarios_nuevos":     int(totals.get("newUsers", 0)),
        "paginas_vistas":      int(totals.get("screenPageViews", 0)),
        "duracion_promedio_s": round(totals.get("averageSessionDuration", 0)),
        "tasa_rebote":         round(totals.get("bounceRate", 0) * 100, 1),
        "top_paginas":         top_paginas,
    }


@router.get("/semana")
def metricas_semana():
    """Sesiones de los últimos 7 días para la gráfica."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
        "metrics":    [{"name": "sessions"}, {"name": "activeUsers"}],
        "dimensions": [{"name": "date"}],
        "orderBys":   [{"dimension": {"dimensionName": "date"}}],
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos de GA4", "dias": []}

    dias = []
    for row in resp.get("rows", []):
        fecha    = row["dimensionValues"][0]["value"]  # YYYYMMDD
        sesiones = int(row["metricValues"][0]["value"])
        usuarios = int(row["metricValues"][1]["value"])
        dias.append({
            "fecha":    f"{fecha[6:8]}/{fecha[4:6]}",
            "sesiones": sesiones,
            "usuarios": usuarios,
        })

    return {"configurado": True, "dias": dias}
