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
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
import google_sa as _gsa
from database import supabase_get_all
from fastapi import APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

GA4_PROPERTY_ID  = os.getenv("GA4_PROPERTY_ID", "")
# Acepta GA4_CREDENTIALS_JSON o cae a GSC_CREDENTIALS_JSON (misma service account)
GA4_CREDENTIALS  = os.getenv("GA4_CREDENTIALS_JSON", "") or os.getenv("GSC_CREDENTIALS_JSON", "")
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
        with urllib.request.urlopen(req, timeout=15) as r:
            resp = json.loads(r.read())
        token = resp.get("access_token")
        _token_cache["token"]   = token
        _token_cache["expires"] = now + resp.get("expires_in", 3600)
        return token
    except Exception as e:
        print(f"[analytics] Error OAuth2 refresh: {e}")
        return None


def _access_token_jwt() -> str | None:
    """Obtiene access token usando la service account (python puro, sin PyJWT)."""
    if not GA4_CREDENTIALS:
        return None

    now = int(time.time())
    if _token_cache["token"] and _token_cache["expires"] > now + 60:
        return _token_cache["token"]

    try:
        token = _gsa.get_access_token(
            GA4_CREDENTIALS,
            "https://www.googleapis.com/auth/analytics.readonly",
        )
        if token:
            _token_cache["token"]   = token
            _token_cache["expires"] = now + 3600
        return token
    except Exception as e:
        print(f"[analytics] Error service account: {e}")
        return None


def _access_token() -> str | None:
    """Intenta OAuth2 primero, luego service account JWT."""
    return _access_token_oauth2() or _access_token_jwt()


_last_ga4_error = ""

def _ga4_post(endpoint: str, body: dict) -> dict | None:
    """POST a GA4 Data API."""
    global _last_ga4_error
    token = _access_token()
    if not token:
        _last_ga4_error = "No se pudo obtener access token (JWT/OAuth2 falló)"
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
            _last_ga4_error = ""
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors='replace')[:500]
        _last_ga4_error = f"HTTP {e.code}: {detalle}"
        print(f"[analytics] GA4 error {e.code}: {detalle}")
        return None
    except Exception as e:
        _last_ga4_error = str(e)
        print(f"[analytics] GA4 error: {e}")
        return None


@router.get("/diagnostico")
def diagnostico():
    """Diagnóstico de configuración de GA4."""
    # Intentar OAuth2 manualmente y capturar error exacto
    oauth2_error = ""
    oauth2_token = None
    if GA4_CLIENT_ID and GA4_CLIENT_SECRET and GA4_REFRESH_TOKEN:
        try:
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
            with urllib.request.urlopen(req) as r:
                resp = json.loads(r.read())
            oauth2_token = resp.get("access_token")
            if not oauth2_token:
                oauth2_error = f"Respuesta sin access_token: {resp}"
        except urllib.error.HTTPError as e:
            oauth2_error = f"HTTP {e.code}: {e.read().decode(errors='replace')[:300]}"
        except Exception as e:
            oauth2_error = str(e)

    return {
        "tiene_property_id": bool(GA4_PROPERTY_ID),
        "property_id": GA4_PROPERTY_ID,
        "tiene_credentials_json": bool(GA4_CREDENTIALS),
        "tiene_oauth2": bool(GA4_CLIENT_ID and GA4_CLIENT_SECRET and GA4_REFRESH_TOKEN),
        "oauth2_token_ok": bool(oauth2_token),
        "oauth2_error": oauth2_error,
        "ultimo_error_ga4": _last_ga4_error,
    }


def _esta_configurado() -> bool:
    tiene_oauth2 = bool(GA4_CLIENT_ID and GA4_CLIENT_SECRET and GA4_REFRESH_TOKEN)
    tiene_sa     = bool(GA4_CREDENTIALS)
    return bool(GA4_PROPERTY_ID) and (tiene_oauth2 or tiene_sa)


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
_SECRET_KEY   = os.environ["SECRET_KEY"]


@router.get("/setup", include_in_schema=False)
def analytics_setup(secret: str = ""):
    """Inicia el flujo OAuth2 para obtener el refresh token de GA4."""
    # Antes se pedía ?secret=<SECRET_KEY> (la llave que firma los JWT, viajando en la URL).
    # Ahora usa un secreto propio y distinto; si no está configurado, el asistente de OAuth queda apagado.
    _setup_secret = os.environ.get("ANALYTICS_SETUP_SECRET", "")
    if not _setup_secret or secret != _setup_secret:
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
        import html as _html
        return HTMLResponse(f"<h2>❌ Error: {_html.escape(error)}</h2>", status_code=400)
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

    # GA4 no devuelve pagePath en realtime para esta propiedad — omitir segunda llamada

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

    return {
        "configurado":     True,
        "activos_ahora":   total,
        "por_dispositivo": por_dispositivo,
        "por_pais":        [{"pais": k, "activos": v} for k, v in sorted(por_pais.items(), key=lambda x: -x[1])],
    }


@router.get("/hoy")
def metricas_hoy():
    """Métricas del día de hoy (o de ayer si GA4 todavía no procesa hoy)."""
    if not _esta_configurado():
        return _no_credenciales()

    # OJO: los totales se piden SIN dimensión de página. Antes se sumaban las filas por pagePath, y eso cuenta de más:
    # una persona que ve 3 páginas aparece en las 3 filas (usuarios y sesiones salían inflados), y con limit=10 las
    # páginas fuera del top 10 ni siquiera entraban. Sin dimensión GA4 regresa una sola fila con el total real
    # (también para el promedio de duración y la tasa de rebote, que además no se pueden sumar).
    metricas = [{"name": "sessions"}, {"name": "activeUsers"}, {"name": "newUsers"}, {"name": "screenPageViews"},
                {"name": "averageSessionDuration"}, {"name": "bounceRate"}]

    def _consulta(dia: str):
        total = _ga4_post("runReport", {"dateRanges": [{"startDate": dia, "endDate": dia}], "metrics": metricas})
        if not total:
            return None, None
        paginas = _ga4_post("runReport", {
            "dateRanges": [{"startDate": dia, "endDate": dia}],
            "metrics": [{"name": "screenPageViews"}], "dimensions": [{"name": "pagePath"}],
            "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": True}], "limit": 10,
        })
        return total, paginas

    _periodo = "hoy"
    total, paginas = _consulta("today")
    # Si hoy todavía no tiene filas (GA4 procesa con retraso), se usa ayer
    if total is not None and not total.get("rows"):
        total, paginas = _consulta("yesterday")
        _periodo = "ayer"
    if total is None:
        return {"configurado": True, "error": "No se pudo obtener datos de GA4"}

    vals = {}
    if total.get("rows"):
        for h, mv in zip(total.get("metricHeaders", []), total["rows"][0].get("metricValues", [])):
            try:
                vals[h["name"]] = float(mv.get("value", 0))
            except Exception:
                vals[h["name"]] = 0.0

    top_paginas = []
    for row in ((paginas or {}).get("rows") or [])[:10]:
        dims = row.get("dimensionValues", [])
        metr = row.get("metricValues", [])
        top_paginas.append({
            "pagina": dims[0].get("value", "/") if dims else "/",
            "vistas": int(float(metr[0].get("value", 0))) if metr else 0,
        })

    return {
        "configurado":         True,
        "periodo":             _periodo,
        "sesiones":            int(vals.get("sessions", 0)),
        "usuarios_activos":    int(vals.get("activeUsers", 0)),
        "usuarios_nuevos":     int(vals.get("newUsers", 0)),
        "paginas_vistas":      int(vals.get("screenPageViews", 0)),
        "duracion_promedio_s": round(vals.get("averageSessionDuration", 0)),
        "tasa_rebote":         round(vals.get("bounceRate", 0) * 100, 1),
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


@router.get("/mes")
def metricas_mes():
    """Sesiones de los últimos 30 días para la gráfica mensual."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
        "metrics":    [{"name": "sessions"}, {"name": "activeUsers"}],
        "dimensions": [{"name": "date"}],
        "orderBys":   [{"dimension": {"dimensionName": "date"}}],
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos de GA4", "dias": []}

    dias = []
    for row in resp.get("rows", []):
        fecha    = row["dimensionValues"][0]["value"]
        sesiones = int(row["metricValues"][0]["value"])
        usuarios = int(row["metricValues"][1]["value"])
        dias.append({
            "fecha":    f"{fecha[6:8]}/{fecha[4:6]}",
            "sesiones": sesiones,
            "usuarios": usuarios,
        })

    return {"configurado": True, "dias": dias}


@router.get("/compras")
def compras_por_dia(dias: int = 14):
    """Transacciones (compras) y su ingreso reportadas por GA4, por día."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges": [{"startDate": f"{dias}daysAgo", "endDate": "today"}],
        "metrics":    [{"name": "transactions"}, {"name": "purchaseRevenue"}, {"name": "sessions"}],
        "dimensions": [{"name": "date"}],
        "orderBys":   [{"dimension": {"dimensionName": "date"}}],
    })

    if not resp:
        return {"configurado": True, "error": _last_ga4_error, "dias": []}

    filas = []
    for row in resp.get("rows", []):
        fecha = row["dimensionValues"][0]["value"]  # YYYYMMDD
        vals  = row["metricValues"]
        filas.append({
            "fecha":       f"{fecha[0:4]}-{fecha[4:6]}-{fecha[6:8]}",
            "transacciones": int(float(vals[0]["value"])),
            "ingreso":       round(float(vals[1]["value"]), 2),
            "sesiones":      int(float(vals[2]["value"])),
        })

    return {"configurado": True, "dias": filas}


@router.get("/fuentes")
def fuentes_trafico():
    """Top fuentes/medios de tráfico de los últimos 7 días."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
        "metrics":    [{"name": "sessions"}, {"name": "activeUsers"}, {"name": "newUsers"},
                        {"name": "transactions"}, {"name": "purchaseRevenue"}],
        "dimensions": [{"name": "sessionSource"}, {"name": "sessionMedium"}],
        "orderBys":   [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit":      15,
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos", "fuentes": []}

    total = 0
    fuentes = []
    for row in resp.get("rows", []):
        dims     = row.get("dimensionValues", [])
        metr     = row.get("metricValues", [])
        source   = dims[0].get("value", "(direct)") if len(dims) > 0 else "(direct)"
        medium   = dims[1].get("value", "(none)")   if len(dims) > 1 else "(none)"
        sesiones = int(metr[0].get("value", 0))     if len(metr) > 0 else 0
        usuarios = int(metr[1].get("value", 0))     if len(metr) > 1 else 0
        nuevos   = int(metr[2].get("value", 0))     if len(metr) > 2 else 0
        compras  = int(float(metr[3].get("value", 0))) if len(metr) > 3 else 0
        ingreso  = round(float(metr[4].get("value", 0)), 2) if len(metr) > 4 else 0.0
        if source == "(not set)": continue
        fuentes.append({
            "source":   source,
            "medium":   medium,
            "sesiones": sesiones,
            "usuarios": usuarios,
            "nuevos":   nuevos,
            "compras":  compras,
            "ingreso":  ingreso,
        })
        total += sesiones

    # Agrupar por source para simplificar (sumar mediums del mismo origen)
    agrupado: dict = {}
    for f in fuentes:
        key = f["source"]
        if key not in agrupado:
            agrupado[key] = {"source": key, "medium": f["medium"],
                             "sesiones": 0, "usuarios": 0, "nuevos": 0,
                             "compras": 0, "ingreso": 0.0}
        agrupado[key]["sesiones"] += f["sesiones"]
        agrupado[key]["usuarios"] += f["usuarios"]
        agrupado[key]["nuevos"]   += f["nuevos"]
        agrupado[key]["compras"]  += f["compras"]
        agrupado[key]["ingreso"]  += f["ingreso"]

    for v in agrupado.values():
        v["ingreso"] = round(v["ingreso"], 2)

    result = sorted(agrupado.values(), key=lambda x: -x["sesiones"])
    return {"configurado": True, "total_sesiones": total, "fuentes": result[:12]}


@router.get("/portal-visitas")
def portal_visitas():
    """Sesiones y usuarios del portal de clientes mayoristas (últimos 30 días).
    GA4 solo se activa ahí para sesiones de clientes reales, nunca para el
    panel de administración -- se filtra por pagePath para no mezclarlo con
    las métricas de la tienda pública, que comparten la misma propiedad GA4."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges":      [{"startDate": "30daysAgo", "endDate": "today"}],
        "metrics":         [{"name": "sessions"}, {"name": "activeUsers"}, {"name": "newUsers"}],
        "dimensions":      [{"name": "date"}],
        "dimensionFilter": {"filter": {"fieldName": "pagePath",
                             "stringFilter": {"matchType": "BEGINS_WITH", "value": "/portal-mayoreo"}}},
        "orderBys":        [{"dimension": {"dimensionName": "date"}}],
        "limit":           35,
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos", "total_sesiones": 0, "dias": []}

    dias = []
    total = 0
    for row in resp.get("rows", []):
        dims = row.get("dimensionValues", [])
        metr = row.get("metricValues", [])
        fecha    = dims[0].get("value", "") if len(dims) > 0 else ""
        sesiones = int(metr[0].get("value", 0)) if len(metr) > 0 else 0
        usuarios = int(metr[1].get("value", 0)) if len(metr) > 1 else 0
        nuevos   = int(metr[2].get("value", 0)) if len(metr) > 2 else 0
        dias.append({"fecha": fecha, "sesiones": sesiones, "usuarios": usuarios, "nuevos": nuevos})
        total += sesiones

    return {"configurado": True, "total_sesiones": total, "dias": dias}


@router.get("/ia-referrals")
def ia_referrals():
    """Tráfico proveniente de asistentes de IA (ChatGPT, Perplexity, Gemini, Copilot...)
    de los últimos 30 días -- GA4 ya los etiqueta con medium="ai-assistant" al
    detectar el referrer. Desglosado por fuente + página de aterrizaje para saber
    qué está citando/recomendando la IA de nuestro catálogo."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges":      [{"startDate": "30daysAgo", "endDate": "today"}],
        "metrics":         [{"name": "sessions"}, {"name": "activeUsers"}],
        "dimensions":      [{"name": "sessionSource"}, {"name": "landingPage"}],
        "dimensionFilter": {"filter": {"fieldName": "sessionMedium",
                             "stringFilter": {"matchType": "EXACT", "value": "ai-assistant"}}},
        "orderBys":        [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit":           50,
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos", "total_sesiones": 0, "referencias": []}

    referencias = []
    total = 0
    for row in resp.get("rows", []):
        dims     = row.get("dimensionValues", [])
        metr     = row.get("metricValues", [])
        source   = dims[0].get("value", "")  if len(dims) > 0 else ""
        landing  = dims[1].get("value", "/") if len(dims) > 1 else "/"
        sesiones = int(metr[0].get("value", 0)) if len(metr) > 0 else 0
        usuarios = int(metr[1].get("value", 0)) if len(metr) > 1 else 0
        referencias.append({"source": source, "landing_page": landing,
                             "sesiones": sesiones, "usuarios": usuarios})
        total += sesiones

    return {"configurado": True, "total_sesiones": total, "referencias": referencias}


def _rango_dias(dias: int) -> dict:
    """"dias=1" debe ser SOLO hoy, no "1daysAgo" (que en GA4 incluye ayer +
    hoy, 2 días) -- para cualquier otro valor sí se resta directo. "dias=0"
    es un valor especial para "Ayer" (un solo día, el anterior a hoy)."""
    if dias == 0:
        return {"startDate": "yesterday", "endDate": "yesterday"}
    if dias <= 1:
        return {"startDate": "today", "endDate": "today"}
    return {"startDate": f"{dias}daysAgo", "endDate": "today"}


@router.get("/embudo")
def embudo_compra(dias: int = 30):
    """Embudo de compra: cuántas veces se dispararon los eventos view_item ->
    add_to_cart -> begin_checkout -> purchase en el sitio (conteo de eventos,
    no de personas únicas -- GA4 Data API estándar no calcula "usuarios únicos
    por paso" sin la API de exploraciones de embudo, que es más compleja; este
    conteo ya sirve para ver en qué escalón se cae la mayor parte del tráfico)."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges":      [_rango_dias(dias)],
        "metrics":         [{"name": "eventCount"}],
        "dimensions":      [{"name": "eventName"}],
        "dimensionFilter": {"filter": {"fieldName": "eventName",
                             "inListFilter": {"values": ["view_item", "add_to_cart", "begin_checkout", "purchase"]}}},
    })

    if not resp:
        return {"configurado": True, "error": _last_ga4_error, "pasos": []}

    conteos = {"view_item": 0, "add_to_cart": 0, "begin_checkout": 0, "purchase": 0}
    for row in resp.get("rows", []):
        nombre = row["dimensionValues"][0]["value"]
        valor  = int(float(row["metricValues"][0]["value"]))
        if nombre in conteos:
            conteos[nombre] = valor

    etiquetas = {
        "view_item":      "Vieron un producto",
        "add_to_cart":    "Agregaron al carrito",
        "begin_checkout": "Iniciaron el pago",
        "purchase":       "Compraron",
    }
    base = conteos["view_item"] or 1
    pasos = []
    for clave in ["view_item", "add_to_cart", "begin_checkout", "purchase"]:
        pasos.append({
            "paso":       clave,
            "etiqueta":   etiquetas[clave],
            "eventos":    conteos[clave],
            "pct_del_total": round(conteos[clave] / base * 100, 1),
        })

    return {"configurado": True, "dias": dias, "pasos": pasos}


@router.get("/dispositivos")
def dispositivos(dias: int = 30):
    """Sesiones, ingresos y tasa de rebote por tipo de dispositivo
    (mobile/desktop/tablet), más las páginas con más rebote."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges": [_rango_dias(dias)],
        "metrics":    [{"name": "sessions"}, {"name": "activeUsers"},
                        {"name": "transactions"}, {"name": "purchaseRevenue"}],
        "dimensions": [{"name": "deviceCategory"}],
        "orderBys":   [{"metric": {"metricName": "sessions"}, "desc": True}],
    })

    dispositivos_lista = []
    if resp:
        for row in resp.get("rows", []):
            dims = row.get("dimensionValues", [])
            metr = row.get("metricValues", [])
            dispositivos_lista.append({
                "dispositivo": dims[0].get("value", "?") if dims else "?",
                "sesiones":    int(float(metr[0].get("value", 0))) if len(metr) > 0 else 0,
                "usuarios":    int(float(metr[1].get("value", 0))) if len(metr) > 1 else 0,
                "compras":     int(float(metr[2].get("value", 0))) if len(metr) > 2 else 0,
                "ingreso":     round(float(metr[3].get("value", 0)), 2) if len(metr) > 3 else 0.0,
            })

    # Páginas con más tráfico y su tasa de rebote, para ver cuáles hacen que
    # la gente se vaya más rápido (bounceRate SÍ se puede pedir por página,
    # a diferencia del promedio general -- ver nota en /hoy).
    resp_paginas = _ga4_post("runReport", {
        "dateRanges": [_rango_dias(dias)],
        "metrics":    [{"name": "screenPageViews"}, {"name": "bounceRate"}],
        "dimensions": [{"name": "pagePath"}],
        "orderBys":   [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        "limit":      10,
    })
    paginas_rebote = []
    if resp_paginas:
        for row in resp_paginas.get("rows", []):
            dims = row.get("dimensionValues", [])
            metr = row.get("metricValues", [])
            paginas_rebote.append({
                "pagina": dims[0].get("value", "/") if dims else "/",
                "vistas": int(float(metr[0].get("value", 0))) if len(metr) > 0 else 0,
                "rebote": round(float(metr[1].get("value", 0)) * 100, 1) if len(metr) > 1 else 0.0,
            })

    return {"configurado": True, "dispositivos": dispositivos_lista, "paginas_rebote": paginas_rebote}


@router.get("/ciudades")
def top_ciudades():
    """Top ciudades de los últimos 7 días."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
        "metrics":    [{"name": "sessions"}, {"name": "activeUsers"}],
        "dimensions": [{"name": "city"}, {"name": "region"}],
        "orderBys":   [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit":      15,
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos", "ciudades": []}

    ciudades = []
    for row in resp.get("rows", []):
        dims     = row.get("dimensionValues", [])
        metr     = row.get("metricValues", [])
        ciudad   = dims[0].get("value", "Desconocida") if len(dims) > 0 else "Desconocida"
        region   = dims[1].get("value", "")            if len(dims) > 1 else ""
        sesiones = int(metr[0].get("value", 0))        if len(metr) > 0 else 0
        usuarios = int(metr[1].get("value", 0))        if len(metr) > 1 else 0
        if ciudad in ("(not set)", "not set"): continue
        ciudades.append({
            "ciudad":   ciudad,
            "region":   region,
            "sesiones": sesiones,
            "usuarios": usuarios,
        })

    return {"configurado": True, "ciudades": ciudades[:12]}


_pop_cache: dict = {"data": None, "expira": 0}


@router.get("/producto-popularidad")
def producto_popularidad():
    """Nivel de '\U0001f441 X personas viendo' (1-6) por producto, calculado con
    vistas reales de GA4 de los últimos 7 días -- no un número inventado igual
    para todos. Solo los modelos con tráfico real (>= 3 vistas esta semana)
    aparecen en el mapa; el resto no debe mostrar el contador en el sitio.
    Cache de 1h: no tiene sentido pegarle a GA4 en cada carga de ficha."""
    now = time.time()
    if _pop_cache["data"] is not None and now < _pop_cache["expira"]:
        return _pop_cache["data"]

    if not _esta_configurado():
        resultado = {"configurado": False, "niveles": {}}
        _pop_cache["data"], _pop_cache["expira"] = resultado, now + 300
        return resultado

    resp = _ga4_post("runReport", {
        "dateRanges":      [{"startDate": "7daysAgo", "endDate": "today"}],
        "metrics":         [{"name": "screenPageViews"}],
        "dimensions":      [{"name": "pagePath"}],
        "dimensionFilter": {"filter": {"fieldName": "pagePath",
                             "stringFilter": {"matchType": "BEGINS_WITH", "value": "/producto/"}}},
        "orderBys":        [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        "limit":           200,
    })

    niveles: dict = {}
    if resp and resp.get("rows"):
        vistas_por_slug: dict = {}
        for row in resp["rows"]:
            path = row["dimensionValues"][0]["value"]
            slug = path.split("/producto/")[-1].split("?")[0].strip("/")
            if not slug:
                continue
            vistas = int(float(row["metricValues"][0]["value"]))
            vistas_por_slug[slug] = vistas_por_slug.get(slug, 0) + vistas

        MIN_VISITAS = 3  # menos que esto = "nadie lo visita", no se muestra
        calificantes = {s: v for s, v in vistas_por_slug.items() if v >= MIN_VISITAS}
        if calificantes:
            max_vistas = max(calificantes.values())
            for slug, vistas in calificantes.items():
                nivel = -(-6 * vistas // max_vistas)  # ceil(6 * vistas / max_vistas)
                niveles[slug] = max(1, min(6, nivel))

    resultado = {"configurado": True, "niveles": niveles}
    _pop_cache["data"], _pop_cache["expira"] = resultado, now + 3600
    return resultado


META_ACCESS_TOKEN  = os.getenv("META_ADS_READ_TOKEN", "") or os.getenv("META_ACCESS_TOKEN", "")
META_AD_ACCOUNT_ID = os.getenv("META_AD_ACCOUNT_ID", "454211741318261")
_META_GRAPH = "https://graph.facebook.com/v21.0"


@router.get("/meta-ads")
def meta_ads(periodo: str = "last_30d"):
    """Gasto, compras y ROAS de las campañas activas de Meta Ads, para verlas
    junto a las métricas de GA4 sin salir del panel. Usa el mismo
    META_ACCESS_TOKEN que ya existe para las Conversions API (Conversiones)
    -- si ese token no tiene permiso ads_read, Meta responde con un error que
    se regresa tal cual para poder diagnosticarlo."""
    if not META_ACCESS_TOKEN:
        return {"configurado": False, "mensaje": "Falta META_ACCESS_TOKEN en las variables de entorno."}

    # OJO: "effective_status" no es un campo filtrable en /insights (eso es
    # de la edge /campaigns) -- se pidió antes y Meta lo rechazaba con
    # HTTP 400. En su lugar se filtran campañas sin gasto ya del lado de
    # Python (más abajo), que en la práctica logra lo mismo (ocultar las
    # campañas viejas pausadas que no gastaron nada en el período).
    params = urllib.parse.urlencode({
        "access_token": META_ACCESS_TOKEN,
        "level":        "campaign",
        "date_preset":  periodo,
        "fields":       "campaign_name,spend,impressions,clicks,ctr,cpm,reach,frequency,actions,action_values,purchase_roas",
        "limit":        50,
    })
    url = f"{_META_GRAPH}/act_{META_AD_ACCOUNT_ID}/insights?{params}"

    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            data = json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="replace")[:500]
        return {"configurado": True, "error": f"HTTP {e.code}: {detalle}"}
    except Exception as e:
        return {"configurado": True, "error": str(e)}

    campanas = []
    total_gasto = 0.0
    total_compras = 0
    total_ingreso = 0.0
    for row in data.get("data", []):
        gasto = float(row.get("spend", 0) or 0)
        if gasto <= 0:
            continue  # campañas viejas pausadas sin gasto en el período -- no interesan aquí
        compras = 0
        ingreso = 0.0
        for a in row.get("actions", []) or []:
            if a.get("action_type") == "omni_purchase":
                compras = int(float(a.get("value", 0)))
        for a in row.get("action_values", []) or []:
            if a.get("action_type") == "omni_purchase":
                ingreso = float(a.get("value", 0))
        roas = 0.0
        for r_ in row.get("purchase_roas", []) or []:
            if r_.get("action_type") == "omni_purchase":
                roas = float(r_.get("value", 0))
        campanas.append({
            "nombre":      row.get("campaign_name", ""),
            "gasto":       round(gasto, 2),
            "impresiones": int(row.get("impressions", 0) or 0),
            "clics":       int(row.get("clicks", 0) or 0),
            "ctr":         round(float(row.get("ctr", 0) or 0), 2),
            "cpm":         round(float(row.get("cpm", 0) or 0), 2),
            "compras":     compras,
            "ingreso":     round(ingreso, 2),
            "roas":        round(roas, 2),
        })
        total_gasto   += gasto
        total_compras += compras
        total_ingreso += ingreso

    return {
        "configurado":    True,
        "periodo":        periodo,
        "total_gasto":    round(total_gasto, 2),
        "total_compras":  total_compras,
        "total_ingreso":  round(total_ingreso, 2),
        "roas_promedio":  round(total_ingreso / total_gasto, 2) if total_gasto else 0,
        "campanas":       campanas,
    }


@router.get("/horario")
def horario_trafico():
    """Tráfico por hora del día (últimos 7 días)."""
    if not _esta_configurado():
        return _no_credenciales()

    resp = _ga4_post("runReport", {
        "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
        "metrics":    [{"name": "sessions"}],
        "dimensions": [{"name": "hour"}],
        "orderBys":   [{"dimension": {"dimensionName": "hour"}}],
    })

    if not resp:
        return {"configurado": True, "error": "No se pudo obtener datos", "horas": []}

    por_hora: dict = {str(h).zfill(2): 0 for h in range(24)}
    for row in resp.get("rows", []):
        hora     = row["dimensionValues"][0]["value"].zfill(2)
        sesiones = int(row["metricValues"][0]["value"])
        por_hora[hora] = por_hora.get(hora, 0) + sesiones

    horas = [{"hora": f"{h}:00", "sesiones": por_hora[h]} for h in sorted(por_hora)]
    return {"configurado": True, "horas": horas}



# ═══════════════════════════════════════════════════════════════════════════════
# Análisis ampliado (2026-10): comparativo, productos, canales/campañas, clientas nuevas vs recurrentes,
# páginas de entrada, tecnología, demografía, ventas por origen (ERP), Google vs ERP, ROAS y búsquedas.
# Todos aceptan ?dias= (1-365). Las respuestas se guardan 5 min en memoria: la API de Google tiene cuotas por
# propiedad y cada pestaña del panel hace varias consultas.
# ═══════════════════════════════════════════════════════════════════════════════

_cache_ga: dict = {}


def _con_cache(clave: str, fn, ttl: int = 300):
    ahora = time.time()
    hit = _cache_ga.get(clave)
    if hit and hit[0] > ahora:
        return hit[1]
    res = fn()
    # los errores no se guardan: se reintenta en la siguiente petición
    if isinstance(res, dict) and not res.get("error"):
        _cache_ga[clave] = (ahora + ttl, res)
    return res


def _n(v) -> float:
    try:
        return float(v)
    except Exception:
        return 0.0


def _dias_ok(dias) -> int:
    try:
        return max(1, min(int(dias), 365))
    except Exception:
        return 30


def _rango_n(dias: int, name: str = None) -> dict:
    """Los últimos `dias` días incluyendo hoy (dias=1 -> solo hoy)."""
    r = {"startDate": "today" if dias == 1 else f"{dias - 1}daysAgo", "endDate": "today"}
    if name:
        r["name"] = name
    return r


def _rango_previo(dias: int, name: str = None) -> dict:
    """El periodo inmediato anterior de la misma duración."""
    r = {"startDate": f"{2 * dias - 1}daysAgo", "endDate": f"{dias}daysAgo"}
    if name:
        r["name"] = name
    return r


def _filas(resp: dict, dims: list, mets: list) -> list:
    """Respuesta de GA4 -> lista de dicts {dim: valor, metrica: número}."""
    out = []
    for row in (resp or {}).get("rows") or []:
        d = {}
        dv = row.get("dimensionValues") or []
        for i, nombre in enumerate(dims):
            d[nombre] = dv[i].get("value", "") if i < len(dv) else ""
        for i, nombre in enumerate(mets):
            mv = row.get("metricValues") or []
            d[nombre] = _n(mv[i].get("value")) if i < len(mv) else 0.0
        out.append(d)
    return out


def _error_ga(extra: dict = None) -> dict:
    return {"configurado": True, "error": _last_ga4_error or "No se pudo obtener datos de GA4", **(extra or {})}


def _delta(actual: float, previo: float):
    """Cambio porcentual contra el periodo anterior (None si no hay base para comparar)."""
    if not previo:
        return None
    return round((actual - previo) / previo * 100, 1)


@router.get("/resumen")
def resumen(dias: int = 7):
    """KPIs del periodo contra el periodo anterior de igual duración (con cambio porcentual)."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        mets = ["sessions", "activeUsers", "newUsers", "screenPageViews", "transactions", "purchaseRevenue",
                "engagementRate", "averageSessionDuration"]
        resp = _ga4_post("runReport", {
            "dateRanges": [_rango_n(dias, "actual"), _rango_previo(dias, "anterior")],
            "metrics": [{"name": m} for m in mets],
        })
        if not resp:
            return _error_ga()
        por = {}
        for row in resp.get("rows") or []:
            nombre = (row.get("dimensionValues") or [{}])[0].get("value", "")
            por[nombre] = {m: _n(v.get("value")) for m, v in zip(mets, row.get("metricValues") or [])}
        a, b = por.get("actual", {}), por.get("anterior", {})

        def derivados(x):
            ses, tr, ing = x.get("sessions", 0), x.get("transactions", 0), x.get("purchaseRevenue", 0)
            return {**x,
                    "conversion": round(tr / ses * 100, 2) if ses else 0.0,
                    "ticket": round(ing / tr, 2) if tr else 0.0,
                    "ingreso_por_sesion": round(ing / ses, 2) if ses else 0.0,
                    "sesiones_por_usuario": round(ses / x["activeUsers"], 2) if x.get("activeUsers") else 0.0}
        a, b = derivados(a), derivados(b)
        claves = ["sessions", "activeUsers", "newUsers", "screenPageViews", "transactions", "purchaseRevenue",
                  "engagementRate", "averageSessionDuration", "conversion", "ticket", "ingreso_por_sesion"]
        return {"configurado": True, "dias": dias,
                "actual": {k: round(a.get(k, 0), 4) for k in claves},
                "anterior": {k: round(b.get(k, 0), 4) for k in claves},
                "cambio_pct": {k: _delta(a.get(k, 0), b.get(k, 0)) for k in claves}}
    return _con_cache(f"resumen:{dias}", _calc)


@router.get("/serie")
def serie(dias: int = 30):
    """Sesiones, usuarios, compras e ingreso por día."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        mets = ["sessions", "activeUsers", "transactions", "purchaseRevenue"]
        resp = _ga4_post("runReport", {
            "dateRanges": [_rango_n(dias)], "metrics": [{"name": m} for m in mets],
            "dimensions": [{"name": "date"}], "orderBys": [{"dimension": {"dimensionName": "date"}}],
        })
        if not resp:
            return _error_ga({"dias_serie": []})
        filas = []
        for f in _filas(resp, ["date"], mets):
            d = f["date"]
            filas.append({"fecha": f"{d[0:4]}-{d[4:6]}-{d[6:8]}", "sesiones": int(f["sessions"]), "usuarios": int(f["activeUsers"]),
                          "compras": int(f["transactions"]), "ingreso": round(f["purchaseRevenue"], 2)})
        return {"configurado": True, "dias": dias, "serie": filas}
    return _con_cache(f"serie:{dias}", _calc)


@router.get("/productos")
def productos_ga(dias: int = 30):
    """Por modelo: vistas, agregados al carrito, compras e ingreso (eventos de ecommerce de la tienda)."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        mets = ["itemsViewed", "itemsAddedToCart", "itemsPurchased", "itemRevenue"]
        resp = _ga4_post("runReport", {
            "dateRanges": [_rango_n(dias)], "metrics": [{"name": m} for m in mets],
            "dimensions": [{"name": "itemName"}],
            "orderBys": [{"metric": {"metricName": "itemsViewed"}, "desc": True}], "limit": 80,
        })
        if not resp:
            return _error_ga({"productos": []})
        lista = []
        for f in _filas(resp, ["itemName"], mets):
            nombre = f["itemName"]
            if not nombre or nombre == "(not set)":
                continue
            v, c, k = int(f["itemsViewed"]), int(f["itemsAddedToCart"]), int(f["itemsPurchased"])
            lista.append({"modelo": nombre, "vistas": v, "carrito": c, "compras": k, "ingreso": round(f["itemRevenue"], 2),
                          "pct_carrito": round(c / v * 100, 1) if v else 0.0,
                          "pct_compra": round(k / c * 100, 1) if c else 0.0})
        # señales útiles: se ve mucho y no se agrega / se agrega y no se compra
        se_ve_no_se_agrega = [x for x in lista if x["vistas"] >= 15 and x["carrito"] == 0][:8]
        se_agrega_no_se_compra = [x for x in lista if x["carrito"] >= 3 and x["compras"] == 0][:8]
        mejores = sorted([x for x in lista if x["vistas"] >= 10], key=lambda x: -(x["compras"] * 1000 + x["pct_carrito"]))[:8]
        return {"configurado": True, "dias": dias, "productos": lista,
                "alertas": {"se_ve_no_se_agrega": se_ve_no_se_agrega, "se_agrega_no_se_compra": se_agrega_no_se_compra, "mejores": mejores}}
    return _con_cache(f"productos:{dias}", _calc)


_DIM_CANALES = {
    "canal": ("sessionDefaultChannelGroup", "Canal"), "fuente": ("sessionSourceMedium", "Fuente / medio"),
    "campana": ("sessionCampaignName", "Campaña"), "dispositivo": ("deviceCategory", "Dispositivo"),
}


@router.get("/canales")
def canales(dias: int = 30, por: str = "canal"):
    """Sesiones, compras, ingreso, conversión, ingreso por sesión y ticket por canal / fuente / campaña / dispositivo."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)
    if por not in _DIM_CANALES:
        por = "canal"
    dim, etiqueta = _DIM_CANALES[por]

    def _calc():
        mets = ["sessions", "activeUsers", "engagementRate", "transactions", "purchaseRevenue"]
        resp = _ga4_post("runReport", {
            "dateRanges": [_rango_n(dias)], "metrics": [{"name": m} for m in mets],
            "dimensions": [{"name": dim}],
            "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}], "limit": 30,
        })
        if not resp:
            return _error_ga({"filas": []})
        filas = []
        for f in _filas(resp, [dim], mets):
            ses, tr, ing = int(f["sessions"]), int(f["transactions"]), f["purchaseRevenue"]
            nombre = f[dim]
            if por == "campana" and nombre in ("(not set)", "(direct)", "(organic)", "(referral)"):
                continue
            filas.append({"nombre": nombre or "(sin dato)", "sesiones": ses, "usuarios": int(f["activeUsers"]),
                          "interaccion": round(f["engagementRate"] * 100, 1), "compras": tr, "ingreso": round(ing, 2),
                          "conversion": round(tr / ses * 100, 2) if ses else 0.0,
                          "ingreso_por_sesion": round(ing / ses, 2) if ses else 0.0,
                          "ticket": round(ing / tr, 2) if tr else 0.0})
        return {"configurado": True, "dias": dias, "por": por, "etiqueta": etiqueta, "filas": filas}
    return _con_cache(f"canales:{por}:{dias}", _calc)


@router.get("/clientas")
def clientas(dias: int = 30):
    """Nuevas contra recurrentes: cuántas son, cuánto compran y cómo se comportan."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        mets = ["activeUsers", "sessions", "engagementRate", "averageSessionDuration", "transactions", "purchaseRevenue", "screenPageViews"]
        resp = _ga4_post("runReport", {"dateRanges": [_rango_n(dias)], "metrics": [{"name": m} for m in mets],
                                       "dimensions": [{"name": "newVsReturning"}]})
        if not resp:
            return _error_ga({"grupos": []})
        et = {"new": "Nuevas", "returning": "Recurrentes"}
        grupos = []
        for f in _filas(resp, ["newVsReturning"], mets):
            clave = f["newVsReturning"]
            if clave not in et:
                continue
            ses, tr, ing = int(f["sessions"]), int(f["transactions"]), f["purchaseRevenue"]
            grupos.append({"grupo": et[clave], "clave": clave, "usuarios": int(f["activeUsers"]), "sesiones": ses,
                           "interaccion": round(f["engagementRate"] * 100, 1), "duracion_s": round(f["averageSessionDuration"]),
                           "paginas_por_sesion": round(f["screenPageViews"] / ses, 1) if ses else 0.0,
                           "compras": tr, "ingreso": round(ing, 2),
                           "conversion": round(tr / ses * 100, 2) if ses else 0.0})
        total_u = sum(g["usuarios"] for g in grupos) or 1
        for g in grupos:
            g["pct_usuarios"] = round(g["usuarios"] / total_u * 100, 1)
        return {"configurado": True, "dias": dias, "grupos": grupos}
    return _con_cache(f"clientas:{dias}", _calc)


@router.get("/paginas")
def paginas(dias: int = 30):
    """Páginas por las que más gente entra (con rebote y compras) y las más vistas."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        m1 = ["sessions", "bounceRate", "transactions", "purchaseRevenue"]
        entrada = _ga4_post("runReport", {"dateRanges": [_rango_n(dias)], "metrics": [{"name": m} for m in m1],
                                          "dimensions": [{"name": "landingPage"}],
                                          "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}], "limit": 15})
        if not entrada:
            return _error_ga({"entrada": [], "vistas": []})
        m2 = ["screenPageViews", "userEngagementDuration", "activeUsers"]
        vistas = _ga4_post("runReport", {"dateRanges": [_rango_n(dias)], "metrics": [{"name": m} for m in m2],
                                         "dimensions": [{"name": "pagePath"}],
                                         "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": True}], "limit": 15})
        ent = [{"pagina": f["landingPage"], "sesiones": int(f["sessions"]), "rebote": round(f["bounceRate"] * 100, 1),
                "compras": int(f["transactions"]), "ingreso": round(f["purchaseRevenue"], 2)}
               for f in _filas(entrada, ["landingPage"], m1)]
        vis = []
        for f in _filas(vistas, ["pagePath"], m2):
            vp = int(f["screenPageViews"])
            vis.append({"pagina": f["pagePath"], "vistas": vp, "usuarios": int(f["activeUsers"]),
                        "tiempo_s": round(f["userEngagementDuration"] / f["activeUsers"]) if f["activeUsers"] else 0})
        return {"configurado": True, "dias": dias, "entrada": ent, "vistas": vis}
    return _con_cache(f"paginas:{dias}", _calc)


@router.get("/tecnologia")
def tecnologia(dias: int = 30):
    """Navegador, sistema operativo e idioma de quienes visitan."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        res = {}
        for clave, dim in (("navegadores", "browser"), ("sistemas", "operatingSystem"), ("idiomas", "language")):
            r = _ga4_post("runReport", {"dateRanges": [_rango_n(dias)], "metrics": [{"name": "sessions"}, {"name": "transactions"}],
                                        "dimensions": [{"name": dim}],
                                        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}], "limit": 8})
            if not r:
                return _error_ga({k: [] for k in ("navegadores", "sistemas", "idiomas")})
            res[clave] = [{"nombre": f[dim] or "(sin dato)", "sesiones": int(f["sessions"]), "compras": int(f["transactions"])}
                          for f in _filas(r, [dim], ["sessions", "transactions"]) if f[dim] != "(not set)"]
        return {"configurado": True, "dias": dias, **res}
    return _con_cache(f"tecnologia:{dias}", _calc)


@router.get("/demografia")
def demografia(dias: int = 30):
    """Edad, género e intereses. Google solo los entrega si están activadas las «señales de Google» en la propiedad y hay
    suficientes usuarios (por privacidad oculta los grupos chicos)."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        res = {}
        hubo_error = False
        for clave, dim in (("edad", "userAgeBracket"), ("genero", "userGender"), ("intereses", "brandingInterest")):
            r = _ga4_post("runReport", {"dateRanges": [_rango_n(dias)], "metrics": [{"name": "activeUsers"}, {"name": "transactions"}],
                                        "dimensions": [{"name": dim}],
                                        "orderBys": [{"metric": {"metricName": "activeUsers"}, "desc": True}], "limit": 10})
            if not r:
                hubo_error = True
                res[clave] = []
                continue
            res[clave] = [{"nombre": f[dim], "usuarios": int(f["activeUsers"]), "compras": int(f["transactions"])}
                          for f in _filas(r, [dim], ["activeUsers", "transactions"]) if f[dim] not in ("(not set)", "unknown", "")]
        disponible = any(res.values())
        return {"configurado": True, "dias": dias, "disponible": disponible, **res,
                "motivo": None if disponible else ("Google no entregó datos demográficos: " + (_last_ga4_error[:160] if hubo_error and _last_ga4_error else
                           "activa las «señales de Google» en Analytics (Administrar > Configuración de datos > Recopilación de datos) y espera a tener más visitas."))}
    return _con_cache(f"demografia:{dias}", _calc)


@router.get("/busquedas")
def busquedas(dias: int = 30):
    """Lo que la gente escribe en el buscador de la tienda y si el catálogo lo tiene. (Se registra desde 2026-10-04.)"""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        resp = _ga4_post("runReport", {
            "dateRanges": [_rango_n(dias)], "metrics": [{"name": "eventCount"}], "dimensions": [{"name": "searchTerm"}],
            "dimensionFilter": {"filter": {"fieldName": "eventName", "stringFilter": {"matchType": "EXACT", "value": "view_search_results"}}},
            "orderBys": [{"metric": {"metricName": "eventCount"}, "desc": True}], "limit": 60,
        })
        if not resp:
            return _error_ga({"terminos": []})
        try:
            prods = supabase_get_all("productos?activo=eq.true&select=nombre,sku_interno,categoria") or []
        except Exception:
            prods = []
        textos = [((p.get("nombre") or "") + " " + (p.get("sku_interno") or "") + " " + (p.get("categoria") or "")).lower() for p in prods]
        terminos = []
        for f in _filas(resp, ["searchTerm"], ["eventCount"]):
            t = (f["searchTerm"] or "").strip().lower()
            if not t or t == "(not set)":
                continue
            palabras = [w for w in t.split() if w]
            hay = sum(1 for tx in textos if all(w in tx for w in palabras)) if textos else None
            terminos.append({"termino": t, "busquedas": int(f["eventCount"]), "modelos": hay,
                             "sin_resultados": (hay == 0) if hay is not None else None})
        return {"configurado": True, "dias": dias, "terminos": terminos,
                "sin_resultados": [x for x in terminos if x["sin_resultados"]][:15]}
    return _con_cache(f"busquedas:{dias}", _calc)


# ─── Ventas reales del ERP por origen (no dependen de que el seguimiento de Google funcione) ─────────────────

_ESTADOS_VENTA = "confirmado,pagado,enviado,entregado"


def _origen_pedido(p: dict) -> str:
    src = (p.get("utm_source") or "").strip().lower()
    if src in ("fb", "facebook", "ig", "instagram", "meta", "facebook.com", "instagram.com", "l.facebook.com", "m.facebook.com"):
        return "Meta (Facebook / Instagram)"
    if p.get("gclid") or src in ("google_ads", "googleads", "adwords"):
        return "Google (anuncios)"
    if src in ("google", "google.com"):
        return "Google"
    if src in ("tiktok", "tt"):
        return "TikTok"
    if src in ("chatgpt.com", "chatgpt", "perplexity", "perplexity.ai", "gemini", "copilot", "claude.ai"):
        return "Asistentes de IA"
    if src in ("whatsapp", "wa"):
        return "WhatsApp"
    if src in ("email", "correo", "newsletter"):
        return "Correo"
    if src:
        return src[:40]
    if p.get("fbclid") or p.get("fbc"):
        return "Meta (Facebook / Instagram)"
    ref = (p.get("referrer_origen") or "").strip().lower()
    if ref:
        return f"Referido: {ref[:40]}"
    return "Directo / sin dato"


def _pedidos_web(dias: int) -> list:
    import datetime as _dt
    desde = (_dt.datetime.utcnow() - _dt.timedelta(days=dias)).strftime("%Y-%m-%dT%H:%M:%SZ")
    return supabase_get_all(
        f"pedidos?canal=eq.web&status=in.({_ESTADOS_VENTA})&created_at=gte.{desde}"
        f"&select=id,total,created_at,utm_source,utm_medium,utm_campaign,gclid,fbclid,fbc,referrer_origen,pedido_items(nombre,cantidad)"
    ) or []


@router.get("/origen-erp")
def origen_erp(dias: int = 90):
    """Ventas web reales del ERP agrupadas por origen: pedidos, ventas, ticket y modelos más comprados de cada origen."""
    dias = _dias_ok(dias)

    def _calc():
        try:
            pedidos = _pedidos_web(dias)
        except Exception as e:
            return {"error": f"No se pudieron leer los pedidos: {e}"}
        grupos, camp = {}, {}
        total_ventas = 0.0
        for p in pedidos:
            o = _origen_pedido(p)
            t = float(p.get("total") or 0)
            total_ventas += t
            g = grupos.setdefault(o, {"origen": o, "pedidos": 0, "ventas": 0.0, "modelos": {}})
            g["pedidos"] += 1
            g["ventas"] += t
            for it in p.get("pedido_items") or []:
                nom = (it.get("nombre") or "").strip()
                if nom:
                    g["modelos"][nom] = g["modelos"].get(nom, 0) + int(it.get("cantidad") or 1)
            c = (p.get("utm_campaign") or "").strip()
            if c:
                cc = camp.setdefault(c, {"campana": c, "pedidos": 0, "ventas": 0.0})
                cc["pedidos"] += 1
                cc["ventas"] += t
        por_origen = []
        for g in sorted(grupos.values(), key=lambda x: -x["ventas"]):
            top = sorted(g["modelos"].items(), key=lambda kv: -kv[1])[:3]
            por_origen.append({"origen": g["origen"], "pedidos": g["pedidos"], "ventas": round(g["ventas"]),
                               "ticket": round(g["ventas"] / g["pedidos"]) if g["pedidos"] else 0,
                               "pct_ventas": round(g["ventas"] / total_ventas * 100, 1) if total_ventas else 0.0,
                               "top_modelos": [{"modelo": n, "pares": q} for n, q in top]})
        return {"dias": dias, "pedidos": len(pedidos), "ventas": round(total_ventas),
                "ticket": round(total_ventas / len(pedidos)) if pedidos else 0, "por_origen": por_origen,
                "por_campana": sorted([{**c, "ventas": round(c["ventas"])} for c in camp.values()], key=lambda x: -x["ventas"])[:15]}
    return _con_cache(f"origen_erp:{dias}", _calc)


@router.get("/google-vs-erp")
def google_vs_erp(dias: int = 30):
    """Compras que reporta Google Analytics contra los pedidos web reales del ERP, para saber si el seguimiento pierde ventas."""
    if not _esta_configurado():
        return _no_credenciales()
    dias = _dias_ok(dias)

    def _calc():
        resp = _ga4_post("runReport", {"dateRanges": [_rango_n(dias)], "metrics": [{"name": "transactions"}, {"name": "purchaseRevenue"}],
                                       "dimensions": [{"name": "date"}], "orderBys": [{"dimension": {"dimensionName": "date"}}]})
        if not resp:
            return _error_ga()
        try:
            pedidos = _pedidos_web(dias)
        except Exception as e:
            return {"configurado": True, "error": f"No se pudieron leer los pedidos del ERP: {e}"}
        import datetime as _dt
        from zoneinfo import ZoneInfo
        mx = ZoneInfo("America/Mexico_City")
        erp_dia = {}
        for p in pedidos:
            try:
                d = _dt.datetime.fromisoformat(str(p["created_at"]).replace("Z", "+00:00")).astimezone(mx).date().isoformat()
            except Exception:
                continue
            x = erp_dia.setdefault(d, [0, 0.0])
            x[0] += 1
            x[1] += float(p.get("total") or 0)
        ga_dia = {}
        for f in _filas(resp, ["date"], ["transactions", "purchaseRevenue"]):
            d = f["date"]
            ga_dia[f"{d[0:4]}-{d[4:6]}-{d[6:8]}"] = [int(f["transactions"]), f["purchaseRevenue"]]
        dias_union = sorted(set(ga_dia) | set(erp_dia))
        tabla = [{"fecha": d, "ga_compras": ga_dia.get(d, [0, 0])[0], "erp_pedidos": erp_dia.get(d, [0, 0])[0],
                  "ga_ingreso": round(ga_dia.get(d, [0, 0.0])[1]), "erp_ventas": round(erp_dia.get(d, [0, 0.0])[1])} for d in dias_union]
        ga_c = sum(v[0] for v in ga_dia.values()); ga_i = sum(v[1] for v in ga_dia.values())
        erp_c = sum(v[0] for v in erp_dia.values()); erp_i = sum(v[1] for v in erp_dia.values())
        return {"configurado": True, "dias": dias,
                "ga_compras": ga_c, "erp_pedidos": erp_c, "ga_ingreso": round(ga_i), "erp_ventas": round(erp_i),
                "compras_sin_registrar_en_ga_pct": round((erp_c - ga_c) / erp_c * 100, 1) if erp_c else None,
                "tabla": [t for t in tabla if t["ga_compras"] or t["erp_pedidos"]][-31:]}
    return _con_cache(f"gve:{dias}", _calc)


@router.get("/roas")
def roas(dias: int = 30):
    """Cuánto se gasta en anuncios y cuánto se vende de verdad (ventas del ERP por origen). Meta: gasto real de la cuenta;
    Google Ads: todavía no está conectado (se muestran las ventas que llegan con clic de anuncio, sin costo)."""
    dias = _dias_ok(dias)
    preset = "last_7d" if dias <= 7 else "last_14d" if dias <= 14 else "last_30d" if dias <= 30 else "last_90d"

    def _calc():
        meta = meta_ads(preset)
        erp = origen_erp(dias)
        if erp.get("error"):
            return {"error": erp["error"]}
        def buscar(prefijo):
            return next((o for o in erp["por_origen"] if o["origen"].startswith(prefijo)), {"pedidos": 0, "ventas": 0, "ticket": 0})
        m, g = buscar("Meta"), buscar("Google (anuncios)")
        gasto = float(meta.get("total_gasto") or 0) if meta.get("configurado") and not meta.get("error") else None
        return {
            "dias": dias, "periodo_meta": preset,
            "meta": {"conectado": bool(meta.get("configurado")) and not meta.get("error"), "error": meta.get("error") or meta.get("mensaje"),
                     "gasto": round(gasto, 2) if gasto is not None else None, "ventas_erp": m["ventas"], "pedidos_erp": m["pedidos"],
                     "roas_erp": round(m["ventas"] / gasto, 2) if gasto else None,
                     "costo_por_pedido": round(gasto / m["pedidos"], 2) if gasto and m["pedidos"] else None,
                     "roas_reportado_por_meta": meta.get("roas_promedio"), "compras_reportadas_por_meta": meta.get("total_compras")},
            "google_ads": {"conectado": False, "ventas_erp": g["ventas"], "pedidos_erp": g["pedidos"], "ticket": g["ticket"],
                           "nota": "Google Ads no está conectado: se ven las ventas que llegaron con clic de anuncio, pero no su costo."},
        }
    return _con_cache(f"roas:{dias}", _calc)
