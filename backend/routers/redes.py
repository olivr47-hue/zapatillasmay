"""Publicaciones en Facebook, Instagram y Pinterest (Estudio de publicaciones del panel).

El panel arma las imágenes (canvas) y las sube a Cloudinary; aquí solo se publican por la Graph API de Meta con el token de la
página (FB_PAGE_ACCESS_TOKEN, el mismo que ya usa Maya para Messenger/Instagram). Hace falta que ese token tenga los permisos
`pages_manage_posts` (Facebook) e `instagram_content_publish` (Instagram); /redes/estado lo revisa y explica qué falta.
"""
import os
import json
import time
import base64
import threading
import urllib.request
import urllib.error
import urllib.parse

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, HTMLResponse

from database import supabase_get, supabase_post
from security import require_staff, create_token, verify_token

router = APIRouter(prefix="/redes", tags=["Redes sociales"])

_GRAPH = "https://graph.facebook.com/v21.0"
_PIN = "https://api.pinterest.com/v5"
_cache_tableros = {"t": 0, "d": None}


_PIN_SANDBOX = "https://api-sandbox.pinterest.com/v5"
_PIN_SCOPES = "boards:read,pins:read,pins:write,user_accounts:read"
_API_PUBLICA = os.environ.get("PUBLIC_API_URL") or "https://zapatillasmay-production.up.railway.app"
_PIN_REDIRECT = _API_PUBLICA.rstrip("/") + "/redes/pinterest/callback"
_pin_lock = threading.Lock()


def _pin_base() -> str:
    # Mientras la app de Pinterest esté en acceso «Trial», las escrituras solo funcionan en su entorno de pruebas (sandbox).
    return _PIN_SANDBOX if os.environ.get("PINTEREST_SANDBOX", "") == "1" else _PIN


def _pin_oauth(campos: dict) -> dict:
    """Pide o renueva el token en Pinterest (necesita el ID y la clave secreta de la app)."""
    app_id, secreto = os.environ.get("PINTEREST_APP_ID", ""), os.environ.get("PINTEREST_APP_SECRET", "")
    if not app_id or not secreto:
        raise _GraphError(None, "Faltan el ID y la clave secreta de la app de Pinterest (Conexiones → Pinterest)")
    basico = base64.b64encode(f"{app_id}:{secreto}".encode()).decode()
    req = urllib.request.Request("https://api.pinterest.com/v5/oauth/token", data=urllib.parse.urlencode(campos).encode(), method="POST",
                                 headers={"Authorization": f"Basic {basico}", "Content-Type": "application/x-www-form-urlencoded"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        crudo = e.read().decode("utf-8", errors="replace")
        try:
            j = json.loads(crudo)
        except Exception:
            j = {}
        raise _GraphError(e.code, j.get("message") or crudo[:200])
    except Exception as e:
        raise _GraphError(None, str(e))


def _pin_guardar_tokens(d: dict, quien: str = "Pinterest (automático)"):
    import integraciones_cfg as cfg
    if d.get("access_token"):
        cfg.guardar("PINTEREST_PUBLISH_TOKEN", d["access_token"], quien)
    if d.get("refresh_token"):
        cfg.guardar("PINTEREST_REFRESH_TOKEN", d["refresh_token"], quien)
    cfg.guardar("PINTEREST_TOKEN_EXPIRA", str(int(time.time()) + int(d.get("expires_in") or 2592000)), quien)
    _cache_tableros.update({"t": 0, "d": None})


def _pin_renovar_si_hace_falta(forzar: bool = False):
    """Si la cuenta se conectó con el botón «Conectar Pinterest», el token dura ~30 días: se renueva solo con el refresh token."""
    refresco = os.environ.get("PINTEREST_REFRESH_TOKEN", "")
    if not refresco:
        return
    try:
        vence = float(os.environ.get("PINTEREST_TOKEN_EXPIRA") or 0)
    except ValueError:
        vence = 0
    if not forzar and vence and vence - time.time() > 3 * 86400:
        return
    with _pin_lock:
        try:   # otro hilo pudo haberlo renovado mientras esperábamos
            vence = float(os.environ.get("PINTEREST_TOKEN_EXPIRA") or 0)
        except ValueError:
            vence = 0
        if not forzar and vence and vence - time.time() > 3 * 86400:
            return
        try:
            _pin_guardar_tokens(_pin_oauth({"grant_type": "refresh_token", "refresh_token": os.environ.get("PINTEREST_REFRESH_TOKEN", ""), "scope": _PIN_SCOPES}))
        except _GraphError as e:
            print(f"[pinterest] no se pudo renovar el token: {e.mensaje}")


def _pin_token() -> str:
    # Para publicar pines hace falta un token con permisos boards:read, pins:read y pins:write (el de la API de conversiones, PINTEREST_ACCESS_TOKEN, puede no
    # traerlos). Si existe PINTEREST_PUBLISH_TOKEN se usa ese; si no, el de siempre.
    _pin_renovar_si_hace_falta()
    return os.environ.get("PINTEREST_PUBLISH_TOKEN", "") or os.environ.get("PINTEREST_ACCESS_TOKEN", "")


def _pin_api(ruta: str, metodo: str = "GET", datos: dict = None):
    t = _pin_token()
    if not t:
        raise _GraphError(None, "Falta el token de Pinterest (PINTEREST_PUBLISH_TOKEN o PINTEREST_ACCESS_TOKEN)")
    req = urllib.request.Request(f"{_pin_base()}/{ruta}", data=(json.dumps(datos).encode("utf-8") if datos is not None else None), method=metodo,
                                 headers={"Authorization": f"Bearer {t}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        crudo = e.read().decode("utf-8", errors="replace")
        try:
            j = json.loads(crudo)
        except Exception:
            j = {}
        raise _GraphError(e.code, j.get("message") or crudo[:200])
    except Exception as e:
        raise _GraphError(None, str(e))


def _explicar_pin(e: "_GraphError") -> str:
    c, m = e.codigo, (e.mensaje or "")
    if c in (401, 403) or "scope" in m.lower() or "permission" in m.lower() or "not authorized" in m.lower():
        return ("Pinterest no deja publicar con este token: necesita los permisos boards:read, pins:read y pins:write (y la app de Pinterest con acceso para publicar). "
                "Genera un token con esos permisos y guárdalo en Conexiones → Pinterest → «Token para publicar».")
    if c == 429:
        return "Pinterest pidió esperar un momento (demasiadas publicaciones). Intenta de nuevo en unos minutos."
    return f"Pinterest respondió: {m[:180]}"


def _tableros_pinterest(forzar: bool = False):
    """Tableros de la cuenta (se guardan 5 minutos). Devuelve (lista, problema)."""
    if not forzar and _cache_tableros["d"] is not None and time.time() - _cache_tableros["t"] < 300:
        return _cache_tableros["d"]
    if not _pin_token():
        return [], "Falta el token de Pinterest"
    try:
        d = _pin_api("boards?page_size=100")
        lista = [{"id": b.get("id"), "nombre": b.get("name")} for b in (d.get("items") or []) if b.get("id")]
        res = (lista, "" if lista else "Tu cuenta de Pinterest no tiene tableros: crea uno en Pinterest.")
    except _GraphError as e:
        res = ([], _explicar_pin(e))
    if not res[1]:
        _cache_tableros.update({"t": time.time(), "d": res})
    return res


def _publicar_pinterest(urls, caption, link, board_id):
    lineas = [l.strip() for l in (caption or "").split("\n") if l.strip()]
    titulo = (lineas[0] if lineas else "Zapatillas May")[:100]
    desc = (caption or "")[:800]
    cuerpo = {"board_id": board_id, "title": titulo, "description": desc}
    if link:
        cuerpo["link"] = link
    if len(urls) == 1:
        cuerpo["media_source"] = {"source_type": "image_url", "url": urls[0]}
    else:
        cuerpo["media_source"] = {"source_type": "multiple_image_urls", "items": [{"url": u, **({"link": link} if link else {})} for u in urls[:5]]}
    return _pin_api("pins", "POST", cuerpo).get("id")


class _GraphError(Exception):
    def __init__(self, codigo, mensaje):
        super().__init__(mensaje)
        self.codigo = codigo
        self.mensaje = mensaje


def _token() -> str:
    # Clave propia para publicar (FB_PUBLISH_TOKEN): así se puede darle permisos de publicar sin tocar la clave de Maya (mensajes).
    # Si no existe, se usa la clave de siempre.
    return os.environ.get("FB_PUBLISH_TOKEN", "") or os.environ.get("FB_PAGE_ACCESS_TOKEN", "")


def _graph(ruta: str, metodo: str = "GET", datos: dict = None, token: str = None):
    t = token or _token()
    if not t:
        raise _GraphError(None, "Falta FB_PAGE_ACCESS_TOKEN en Railway")
    url = f"{_GRAPH}/{ruta}"
    cuerpo = None
    if metodo == "GET":
        sep = "&" if "?" in url else "?"
        url += f"{sep}access_token={urllib.parse.quote(t)}"
    else:
        datos = dict(datos or {})
        datos["access_token"] = t
        cuerpo = json.dumps(datos).encode("utf-8")
    req = urllib.request.Request(url, data=cuerpo, method=metodo, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        crudo = e.read().decode("utf-8", errors="replace")
        try:
            err = (json.loads(crudo).get("error") or {})
        except Exception:
            err = {}
        det = err.get("error_user_msg") or err.get("error_user_title") or ""
        sub = err.get("error_subcode")
        msg = (err.get("message") or crudo[:200]) + (f" [subcódigo {sub}]" if sub else "") + (f" — {det}" if det else "")
        raise _GraphError(err.get("code"), msg)
    except Exception as e:
        raise _GraphError(None, str(e))


def _explicar(e: _GraphError, destino: str) -> str:
    c = e.codigo
    m = (e.mensaje or "").lower()
    if c in (10, 200, 283) or "permission" in m or "permiso" in m:
        falta = "pages_manage_posts" if destino == "facebook" else "instagram_content_publish"
        return (f"Meta no deja publicar con el token actual: falta el permiso «{falta}». Hay que agregarlo a tu app de Meta y "
                "volver a generar el token de la página (te explico cómo en el panel).")
    if c in (190, 102):
        return "El token de la página venció o es inválido: hay que generar uno nuevo en Meta."
    if c == 9007 or "not ready" in m:
        return "Instagram aún estaba procesando la imagen. Intenta de nuevo en un minuto."
    if c == 36003 or "aspect" in m:
        return "Instagram rechazó el tamaño de la imagen (usa formatos entre 4:5 y 1.91:1)."
    return f"Meta respondió: {e.mensaje[:180]}"


def _cuentas() -> dict:
    """{page_id, page_name, ig_id, ig_user} de la página a la que pertenece el token."""
    d = _graph("me?fields=id,name,instagram_business_account{id,username}")
    ig = d.get("instagram_business_account") or {}
    return {"page_id": d.get("id"), "page_name": d.get("name"), "ig_id": ig.get("id"), "ig_user": ig.get("username")}


@router.get("/pinterest/info")
def pinterest_info(_staff=Depends(require_staff)):
    """Datos para el botón «Conectar Pinterest» de Conexiones (nada secreto)."""
    try:
        vence = float(os.environ.get("PINTEREST_TOKEN_EXPIRA") or 0)
    except ValueError:
        vence = 0
    return {"redirect_uri": _PIN_REDIRECT, "tiene_app_id": bool(os.environ.get("PINTEREST_APP_ID")), "tiene_secreto": bool(os.environ.get("PINTEREST_APP_SECRET")),
            "conectado_con_boton": bool(os.environ.get("PINTEREST_REFRESH_TOKEN")), "token_vence": int(vence) or None,
            "sandbox": os.environ.get("PINTEREST_SANDBOX", "") == "1", "permisos": _PIN_SCOPES}


@router.get("/pinterest/autorizar")
def pinterest_autorizar(_staff=Depends(require_staff)):
    """URL de Pinterest para que el administrador autorice la app (leer tableros y crear pines). El `state` va firmado y vence en 1 hora."""
    app_id = os.environ.get("PINTEREST_APP_ID", "")
    if not app_id or not os.environ.get("PINTEREST_APP_SECRET"):
        return JSONResponse(status_code=400, content={"error": "Primero guarda el ID y la clave secreta de la app de Pinterest en Conexiones → Pinterest."})
    estado_firmado = create_token({"fin": "pinterest"}, expires_hours=1)
    params = {"client_id": app_id, "redirect_uri": _PIN_REDIRECT, "response_type": "code", "scope": _PIN_SCOPES, "state": estado_firmado}
    return {"url": "https://www.pinterest.com/oauth/?" + urllib.parse.urlencode(params), "redirect_uri": _PIN_REDIRECT}


@router.get("/pinterest/callback")
def pinterest_callback(code: str = None, state: str = None, error: str = None):
    """Pinterest regresa aquí con el código; se canjea por el token y se guarda cifrado (público: lo valida el `state` firmado)."""
    def pagina(ok, titulo, detalle):
        color = "#2e7d32" if ok else "#b3261e"
        return HTMLResponse(f"<!doctype html><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>"
                            f"<body style='font-family:system-ui;max-width:520px;margin:12vh auto;padding:0 20px;text-align:center'>"
                            f"<h2 style='color:{color}'>{titulo}</h2><p>{detalle}</p>"
                            f"<p><a href='https://zapatillasmay-panel.vercel.app/' style='color:#E91E8C;font-weight:700'>Volver al panel</a></p></body>",
                            status_code=200 if ok else 400)
    try:
        if error or not code:
            return pagina(False, "Pinterest no autorizó la conexión", f"Motivo: {urllib.parse.quote(str(error or 'sin código'))[:120]}")
        try:
            if (verify_token(state or "") or {}).get("fin") != "pinterest":
                raise ValueError()
        except Exception:
            return pagina(False, "El enlace de autorización venció o no es válido", "Vuelve al panel (Conexiones → Pinterest) y presiona «Conectar Pinterest» otra vez.")
        d = _pin_oauth({"grant_type": "authorization_code", "code": code, "redirect_uri": _PIN_REDIRECT, "continuous_refresh": "true"})
        if not d.get("access_token"):
            return pagina(False, "Pinterest no entregó el token", "Intenta de nuevo.")
        _pin_guardar_tokens(d, "Pinterest (botón Conectar)")
        return pagina(True, "✅ Pinterest conectado", "Ya puedes publicar pines desde el panel. Puedes cerrar esta ventana.")
    except _GraphError as e:
        return pagina(False, "No se pudo completar la conexión", (e.mensaje or "")[:200].replace("<", "‹"))
    except Exception as e:
        print(f"[pinterest] callback: {e}")
        return pagina(False, "No se pudo completar la conexión", "Error interno. Intenta de nuevo.")


@router.get("/pinterest/ping")
def pinterest_ping(_staff=Depends(require_staff)):
    """Prueba de solo lectura (botón «Probar conexión» de Conexiones)."""
    tabs, problema = _tableros_pinterest(forzar=True)
    modo = " (modo de pruebas)" if os.environ.get("PINTEREST_SANDBOX", "") == "1" else ""
    if tabs:
        return {"ok": True, "mensaje": f"Conectado{modo}: {len(tabs)} tablero(s) disponibles."}
    return {"ok": False, "mensaje": problema or "Sin tableros"}


@router.get("/estado")
def estado(_staff=Depends(require_staff)):
    """¿Qué tan lista está la conexión para publicar? (sin publicar nada)."""
    r = _estado_meta()
    tabs, problema = _tableros_pinterest()
    r["pinterest"] = {"conectado": bool(tabs), "tableros": tabs, "problema": problema, "tablero_predeterminado": os.environ.get("PINTEREST_BOARD_ID", "")}
    return r


def _estado_meta():
    if not _token():
        return {"conectado": False, "problema": "Falta FB_PAGE_ACCESS_TOKEN en Railway", "facebook": False, "instagram": False}
    try:
        c = _cuentas()
    except _GraphError as e:
        return {"conectado": False, "problema": _explicar(e, "facebook"), "facebook": False, "instagram": False}
    permisos = []
    try:
        dt = _graph(f"debug_token?input_token={urllib.parse.quote(_token())}")
        permisos = (dt.get("data") or {}).get("scopes") or []
    except _GraphError:
        permisos = []
    return {
        "conectado": True, "pagina": c["page_name"], "instagram_usuario": c["ig_user"],
        "facebook": bool(c["page_id"]), "instagram": bool(c["ig_id"]),
        "permisos_conocidos": bool(permisos),
        "puede_facebook": ("pages_manage_posts" in permisos) if permisos else None,
        "puede_instagram": ("instagram_content_publish" in permisos) if permisos else None,
    }


def _publicar_facebook(cuentas, urls, caption):
    pid = cuentas["page_id"]
    if len(urls) == 1:
        r = _graph(f"{pid}/photos", "POST", {"url": urls[0], "caption": caption, "published": True})
        return r.get("post_id") or r.get("id")
    ids = []
    for u in urls:
        r = _graph(f"{pid}/photos", "POST", {"url": u, "published": False})
        ids.append({"media_fbid": r["id"]})
    r = _graph(f"{pid}/feed", "POST", {"message": caption, "attached_media": ids})
    return r.get("id")


def _esperar_contenedor(cid: str):
    for _ in range(12):
        try:
            st = _graph(f"{cid}?fields=status_code").get("status_code")
        except _GraphError:
            st = None
        if st == "FINISHED":
            return
        if st == "ERROR":
            raise _GraphError(None, "Instagram no pudo procesar la imagen")
        time.sleep(2.5)


_CACHE_META_ID = {}


def _ig_producto_meta(cuentas, producto_id):
    """product_id del catálogo de Meta para etiquetar un modelo en Instagram. El feed manda un artículo por variante cuyo id
    (retailer_id) es «SKU_INTERNO-COLOR-TALLA» (ej. C-TAC-0328-ROJO_MIRANDA-24.5), NO el id interno de la variante; por eso se
    busca por el SKU del modelo y se toma cualquier artículo cuyo retailer_id empiece con «SKU-». Devuelve (product_id, motivo_si_no)."""
    ig = cuentas.get("ig_id")
    if not ig or not producto_id:
        return None, "sin cuenta de Instagram o sin modelo"
    hit = _CACHE_META_ID.get(producto_id)
    if hit and time.time() - hit[0] < 600:   # 10 min: así un color recién sincronizado en el feed entra pronto
        return hit[1], ""
    try:
        cats = _graph(f"{ig}/available_catalogs").get("data") or []
        if not cats:
            return None, "Instagram no tiene un catálogo/tienda conectado a esta cuenta"
        catalogo = cats[0].get("catalog_id")
        fila = (supabase_get(f"productos?id=eq.{urllib.parse.quote(str(producto_id), safe='')}&select=sku_interno,nombre&limit=1") or [{}])[0]
        sku = (fila.get("sku_interno") or "").strip()
        if not sku:
            return None, "el modelo no tiene SKU interno para buscarlo en el catálogo"
        r = _graph(f"{ig}/catalog_product_search?catalog_id={catalogo}&q={urllib.parse.quote(sku)}&limit=50").get("data") or []
        # Se devuelven TODOS los artículos del modelo (uno por color/talla): si Meta rechaza el primero (por ejemplo una variante sin
        # existencia o que aún no termina de aprobarse), se prueba con el siguiente en vez de publicar sin etiqueta.
        mios = [it for it in r if str(it.get("retailer_id") or "").startswith(sku + "-") and it.get("product_id")]
        # Meta solo deja etiquetar artículos APROBADOS (review_status); los demás (pendientes o rechazados) dan «Invalid parameter»
        aprobados = [it for it in mios if str(it.get("review_status") or "approved").lower() == "approved"]
        if mios and not aprobados:
            estados = sorted({str(it.get("review_status") or "?") for it in mios})
            return None, f"el modelo {sku} está en tu catálogo de Meta pero ningún artículo está aprobado todavía (estado: {', '.join(estados)})"
        ids = []
        for it in aprobados:
            if str(it["product_id"]) not in ids:
                ids.append(str(it["product_id"]))
        if ids:
            _CACHE_META_ID[producto_id] = (time.time(), ids)
            return ids, ""
        return None, f"no se encontró el modelo {sku} en tu catálogo de Meta (puede que aún no se haya sincronizado el feed)"
    except _GraphError as e:
        return None, _explicar_etiqueta(e)


def _explicar_etiqueta(e: _GraphError) -> str:
    m = (e.mensaje or "").lower()
    if e.codigo in (10, 200, 283) or "permission" in m or "permiso" in m:
        return "falta el permiso «instagram_shopping_tag_products» en la clave de publicar (FB_PUBLISH_TOKEN)"
    return "Meta respondió: " + (e.mensaje or "")[:140]


def _publicar_instagram(cuentas, urls, caption, historia=False, meta_id=None):
    """Devuelve (id_publicacion, aviso). Si se pasa meta_id se intenta etiquetar el producto; si Meta lo rechaza, se publica sin
    etiqueta y el aviso explica por qué (nunca se bloquea la publicación por esto)."""
    ig = cuentas["ig_id"]
    aviso = ""
    candidatos = [] if (not meta_id or historia) else ([meta_id] if isinstance(meta_id, str) else list(meta_id))
    candidatos = candidatos[:8]

    def crear(datos):
        nonlocal candidatos, aviso
        while candidatos:
            pid = candidatos[0]
            try:
                return _graph(f"{ig}/media", "POST", {**datos, "product_tags": [{"product_id": pid, "x": 0.5, "y": 0.82}]})["id"]
            except _GraphError as e:
                candidatos = candidatos[1:]   # ese artículo no se pudo etiquetar: se prueba con otro del mismo modelo
                if not candidatos:
                    aviso = "Se publicó SIN etiqueta de producto: " + _explicar_etiqueta(e) + " (se probaron los artículos del modelo; si el color es nuevo, espera a que Meta sincronice el feed)"
        return _graph(f"{ig}/media", "POST", datos)["id"]

    if historia:
        # una historia por cada imagen (antes solo subía la primera), en el orden en que vienen
        ultimo = None
        for u in urls[:10]:
            c = crear({"image_url": u, "media_type": "STORIES"})
            _esperar_contenedor(c)
            ultimo = _graph(f"{ig}/media_publish", "POST", {"creation_id": c}).get("id")
        return ultimo, aviso
    if len(urls) == 1:
        c = crear({"image_url": urls[0], "caption": caption})
    else:
        hijos = []
        for u in urls[:10]:
            h = crear({"image_url": u, "is_carousel_item": True})
            _esperar_contenedor(h)
            hijos.append(h)
        c = _graph(f"{ig}/media", "POST", {"media_type": "CAROUSEL", "children": ",".join(hijos), "caption": caption})["id"]
    _esperar_contenedor(c)
    return _graph(f"{ig}/media_publish", "POST", {"creation_id": c}).get("id"), aviso


@router.get("/diagnostico-etiqueta/{producto_id}")
def diagnostico_etiqueta(producto_id: str, _staff=Depends(require_staff)):
    """Solo lectura: qué artículos de este modelo ve Meta en el catálogo de Instagram y en qué estado están (no publica nada)."""
    try:
        cuentas = _cuentas()
        ig = cuentas.get("ig_id")
        cats = _graph(f"{ig}/available_catalogs").get("data") or []
        fila = (supabase_get(f"productos?id=eq.{urllib.parse.quote(str(producto_id), safe='')}&select=sku_interno,nombre&limit=1") or [{}])[0]
        sku = (fila.get("sku_interno") or "").strip()
        out = {"sku": sku, "nombre": fila.get("nombre"), "catalogos": [{"id": c.get("catalog_id"), "nombre": c.get("catalog_name")} for c in cats], "articulos": []}
        if cats and sku:
            r = _graph(f"{ig}/catalog_product_search?catalog_id={cats[0].get('catalog_id')}&q={urllib.parse.quote(sku)}&limit=50").get("data") or []
            out["articulos"] = [{"retailer_id": it.get("retailer_id"), "product_id": it.get("product_id"), "estado": it.get("review_status"), "checkout": it.get("is_checkout_flow")} for it in r]
        return out
    except _GraphError as e:
        return JSONResponse(status_code=502, content={"error": e.mensaje})


@router.post("/publicar")
def publicar(datos: dict, _staff=Depends(require_staff)):
    """datos: {urls:[...], caption, destinos:['facebook','instagram'], historia:bool, producto_ids:[...]}.
    Devuelve el resultado por destino (si uno falla el otro igual se intenta)."""
    urls = [u for u in (datos.get("urls") or []) if isinstance(u, str) and u.startswith("https://")][:10]
    destinos = [d for d in (datos.get("destinos") or []) if d in ("facebook", "instagram", "pinterest")]
    caption = str(datos.get("caption") or "")[:2100]
    historia = bool(datos.get("historia"))
    if not urls or not destinos:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Faltan imágenes o destino"})
    cuentas = {}
    if any(d in ("facebook", "instagram") for d in destinos):
        try:
            cuentas = _cuentas()
        except _GraphError as e:
            return JSONResponse(status_code=502, content={"ok": False, "error": _explicar(e, "facebook")})
    resultados = {}
    quien = (_staff or {}).get("nombre") or (_staff or {}).get("email") or "personal"
    # Etiqueta de producto en Instagram: solo cuando la publicación es de UN solo modelo (con varios no se sabe qué foto es de cuál)
    meta_id, aviso_tag = None, ""
    ids_prod = [x for x in (datos.get("producto_ids") or []) if isinstance(x, str)]
    if "instagram" in destinos and not historia:
        if len(ids_prod) == 1:
            meta_id, motivo = _ig_producto_meta(cuentas, ids_prod[0])
            if not meta_id:
                aviso_tag = "Se publicó sin etiqueta de producto: " + motivo
        elif len(ids_prod) > 1:
            aviso_tag = "Con varios modelos no se etiquetan productos (se puede hacer a mano en la app de Instagram)."
    for d in destinos:
        try:
            if d == "pinterest":
                if historia:
                    raise _GraphError(None, "Las historias solo se publican en Instagram desde aquí")
                tabs, problema = _tableros_pinterest()
                board = str(datos.get("pinterest_board") or os.environ.get("PINTEREST_BOARD_ID") or "")
                if board and tabs and board not in [t["id"] for t in tabs]:
                    raise _GraphError(None, "Ese tablero de Pinterest ya no existe: elige otro")
                if not board:
                    if not tabs:
                        raise _GraphError(None, problema or "No hay tableros de Pinterest")
                    board = tabs[0]["id"]
                post = _publicar_pinterest(urls, caption, _link_pin(datos), board)
            elif d == "facebook":
                if historia:
                    raise _GraphError(None, "Las historias solo se publican en Instagram desde aquí")
                post = _publicar_facebook(cuentas, urls, caption)
            else:
                if not cuentas.get("ig_id"):
                    raise _GraphError(None, "Tu página de Facebook no tiene una cuenta de Instagram profesional vinculada")
                post, aviso = _publicar_instagram(cuentas, urls, caption, historia, meta_id)
            resultados[d] = {"ok": True, "post_id": post}
            if d == "instagram" and (aviso or aviso_tag):
                resultados[d]["aviso"] = aviso or aviso_tag
            try:
                supabase_post("redes_publicaciones", {
                    "producto_ids": datos.get("producto_ids") or [], "destino": d, "tipo": "historia" if historia else ("carrusel" if len(urls) > 1 else "foto"),
                    "post_id": str(post or ""), "caption": caption, "imagenes": urls, "usuario": str(quien)[:60],
                })
            except Exception as e:
                print(f"[redes] no se pudo guardar el historial: {e}")
        except _GraphError as e:
            resultados[d] = {"ok": False, "error": _explicar_pin(e) if d == "pinterest" else _explicar(e, d)}
        except Exception as e:
            resultados[d] = {"ok": False, "error": str(e)[:200]}
    return {"ok": all(r["ok"] for r in resultados.values()), "resultados": resultados}


def _link_pin(datos: dict) -> str:
    """Enlace del pin: la ficha del modelo si la publicación es de uno solo; si no, la tienda."""
    ids = [x for x in (datos.get("producto_ids") or []) if isinstance(x, str)]
    if len(ids) == 1 and all(ch.isalnum() or ch == "-" for ch in ids[0]):
        try:
            f = supabase_get(f"productos?id=eq.{ids[0]}&select=slug,sku_interno&limit=1") or []
            slug = (f[0].get("slug") or f[0].get("sku_interno")) if f else None
            if slug:
                return f"https://zapatillasmay.mx/producto/{urllib.parse.quote(str(slug))}"
        except Exception:
            pass
    return "https://zapatillasmay.mx"


@router.get("/historial")
def historial(_staff=Depends(require_staff)):
    return supabase_get("redes_publicaciones?order=created_at.desc&limit=40&select=id,destino,tipo,post_id,caption,producto_ids,usuario,created_at") or []


@router.get("/publicados")
def ids_publicados(_staff=Depends(require_staff)):
    """IDs de productos que ya se publicaron (para sugerir solo los modelos nuevos que faltan)."""
    filas = supabase_get("redes_publicaciones?select=producto_ids&limit=1000") or []
    ids = set()
    for f in filas:
        for i in (f.get("producto_ids") or []):
            ids.add(i)
    return {"ids": list(ids)}


# ═══ COLA DE PUBLICACIONES AUTOMÁTICAS (con aprobación) ═══
# Cada mañana el sistema propone publicaciones de los modelos nuevos o resurtidos que aún no se han publicado (mismo formato de texto
# que el panel + una frase de gancho de Claude). Quedan como «propuesta»: el dueño las aprueba (o edita/descarta) y se publican solas
# a su hora. Con redes_auto_aprobar=1 en configuracion se aprueban solas (se puede activar cuando ya guste cómo quedan).
from datetime import datetime as _dtm, timedelta as _td, timezone as _tz
_TZ_MX_R = _tz(_td(hours=-6))
_WA_PUB_TXT = "479 224 4560"
_HASHTAGS = "#zapatillas #calzadodama #zapatosdemujer #leonguanajuato #modamexicana #nuevacoleccion #zapatillasmay #tacones #botines #sandalias"


def _cfg_redes(clave: str, defecto: str) -> str:
    try:
        f = supabase_get(f"configuracion?clave=eq.{clave}&select=valor") or []
        return str(f[0]["valor"]) if f and f[0].get("valor") not in (None, "") else defecto
    except Exception:
        return defecto


def _frase_gancho(nombre: str) -> str:
    """Una sola frase corta de Claude para abrir la publicación. Si no hay API o falla, se publica sin ella."""
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        return ""
    cuerpo = {"model": os.getenv("REDES_MODELO", "claude-sonnet-4-6"), "max_tokens": 80, "messages": [{"role": "user", "content":
              f"Escribe UNA frase corta (máx. 12 palabras), cálida y sin exagerar, en español de México, para abrir una publicación de Instagram "
              f"de una zapatería de dama sobre este modelo: «{nombre[:100]}». Solo la frase, sin comillas ni hashtags, puede llevar un emoji."}]}
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=json.dumps(cuerpo).encode(), method="POST",
                                 headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = json.loads(r.read())
        t = "".join(b.get("text", "") for b in resp.get("content", []) if b.get("type") == "text").strip().strip('"“”')
        return t.split("\n")[0][:140]
    except Exception as e:
        print(f"[redes-cola] sin frase de Claude: {e}")
        return ""


def _texto_publicacion(p: dict, colores: list, gancho: str) -> str:
    from routers.chatbot import precios_web
    precio = precios_web(p).get("menudeo")
    l = []
    if gancho:
        l += [gancho, ""]
    l.append("✨ NUEVO en Zapatillas May ✨" if (p.get("novedad") or "") != "resurtido" else "🔁 ¡De regreso! Ya lo resurtimos")
    l.append("")
    col = f" · {', '.join(colores[:4])}" if colores else ""
    l.append(f"👠 {p.get('nombre') or ''}{f' — ${precio:,.0f} MXN' if precio else ''}{col}")
    l.append(f"🔗 https://zapatillasmay.mx/producto/{urllib.parse.quote(str(p.get('slug') or p.get('sku_interno') or ''))}")
    l += ["", "🚚 Envíos a todo México · 📍 León, Guanajuato", f"💬 Pídelos por WhatsApp: {_WA_PUB_TXT}", "", _HASHTAGS]
    return "\n".join(l)


def _siguiente_horario(ocupados: set) -> str:
    """Próximo horario libre de publicación (hora de México), uno por franja."""
    horas = [h.strip() for h in _cfg_redes("redes_horas", "13:00,19:30").split(",") if h.strip()]
    ahora = _dtm.now(_TZ_MX_R)
    for dias in range(0, 14):
        d = (ahora + _td(days=dias)).date()
        for h in horas:
            try:
                hh, mm = (int(x) for x in h.split(":"))
            except ValueError:
                continue
            t = _dtm(d.year, d.month, d.day, hh, mm, tzinfo=_TZ_MX_R)
            iso = t.astimezone(_tz.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
            if t > ahora + _td(minutes=20) and iso not in ocupados:
                return iso
    return (ahora + _td(days=1)).astimezone(_tz.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def generar_propuestas(maximo: int = None) -> int:
    """Propone publicaciones de modelos nuevos/resurtidos con existencia que todavía no se publicaron ni están en la cola."""
    if maximo is None:
        try:
            maximo = max(0, min(5, int(_cfg_redes("redes_por_dia", "1"))))
        except ValueError:
            maximo = 1
    if not maximo:
        return 0
    publicados = set()
    for f in supabase_get("redes_publicaciones?select=producto_ids&limit=2000") or []:
        publicados.update(f.get("producto_ids") or [])
    en_cola, ocupados = set(), set()
    for f in supabase_get("redes_cola?estado=in.(propuesta,aprobada,publicada)&select=producto_ids,programado_para&limit=2000") or []:
        en_cola.update(f.get("producto_ids") or [])
        if f.get("programado_para"):
            ocupados.add(str(f["programado_para"]).replace("+00:00", "Z")[:19] + "Z")
    hace30 = (_dtm.now(_tz.utc) - _td(days=30)).strftime("%Y-%m-%dT%H:%M:%SZ")
    cands = supabase_get(f"productos?activo=eq.true&imagen_principal=not.is.null&or=(created_at.gte.{hace30},novedad.in.(nuevo,resurtido))"
                         f"&select=id,nombre,slug,sku_interno,precio_menudeo,es_oferta,imagen_principal,novedad,tallas_disponibles,created_at"
                         f"&order=created_at.desc&limit=60") or []
    hechos = 0
    for p in cands:
        if hechos >= maximo:
            break
        if p["id"] in publicados or p["id"] in en_cola or p.get("novedad") == "no":
            continue
        if p.get("tallas_disponibles") == []:
            continue                                             # agotado: no se anuncia
        vars_ = supabase_get(f"variantes?producto_id=eq.{p['id']}&activa=eq.true&select=color,foto_url") or []
        colores, urls = [], [p["imagen_principal"]]
        for v in vars_:
            c = (v.get("color") or "").strip().title()
            if c and c not in colores:
                colores.append(c)
                if v.get("foto_url") and v["foto_url"] not in urls and len(urls) < 4:
                    urls.append(v["foto_url"])
        cuando = _siguiente_horario(ocupados)
        ocupados.add(cuando)
        auto = _cfg_redes("redes_auto_aprobar", "0") == "1"
        supabase_post("redes_cola", {"producto_ids": [p["id"]], "tipo": p.get("novedad") or "nuevo", "urls": urls,
                                     "caption": _texto_publicacion(p, colores, _frase_gancho(p.get("nombre") or "")),
                                     "destinos": ["instagram", "facebook"], "programado_para": cuando,
                                     "estado": "aprobada" if auto else "propuesta", "aprobado_por": "automático" if auto else None})
        hechos += 1
    return hechos


def publicar_pendientes_cola() -> int:
    """Publica las aprobadas cuya hora ya llegó (una por vuelta, para no saturar)."""
    ahora = _dtm.now(_tz.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    filas = supabase_get(f"redes_cola?estado=eq.aprobada&programado_para=lte.{ahora}&select=*&order=programado_para.asc&limit=1") or []
    for f in filas:
        supabase_patch_r(f"redes_cola?id=eq.{f['id']}&estado=eq.aprobada", {"estado": "publicando"})
        try:
            r = publicar({"urls": f.get("urls") or [], "caption": f.get("caption") or "", "destinos": f.get("destinos") or ["instagram", "facebook"],
                          "producto_ids": f.get("producto_ids") or []}, {"nombre": "Automático (cola)"})
            res = r if isinstance(r, dict) else json.loads(getattr(r, "body", b"{}") or b"{}")
            ok = bool(res.get("ok"))
            supabase_patch_r(f"redes_cola?id=eq.{f['id']}", {"estado": "publicada" if ok else "error", "resultado": res,
                                                             "publicada_at": _dtm.now(_tz.utc).isoformat() if ok else None})
        except Exception as e:
            supabase_patch_r(f"redes_cola?id=eq.{f['id']}", {"estado": "error", "resultado": {"error": str(e)[:300]}})
    return len(filas)


def supabase_patch_r(ruta: str, datos: dict):
    from database import supabase_patch
    return supabase_patch(ruta, datos)


@router.get("/cola")
def ver_cola(_staff=Depends(require_staff)):
    filas = supabase_get("redes_cola?estado=in.(propuesta,aprobada,publicando,error)&select=*&order=programado_para.asc&limit=50") or []
    hechas = supabase_get("redes_cola?estado=eq.publicada&select=*&order=publicada_at.desc&limit=10") or []
    return {"pendientes": filas, "publicadas": hechas, "auto_aprobar": _cfg_redes("redes_auto_aprobar", "0") == "1",
            "por_dia": _cfg_redes("redes_por_dia", "1"), "horas": _cfg_redes("redes_horas", "13:00,19:30")}


@router.post("/cola/generar")
def cola_generar(_staff=Depends(require_staff)):
    return {"ok": True, "nuevas": generar_propuestas()}


@router.patch("/cola/{cid}")
def cola_editar(cid: str, datos: dict, _staff=Depends(require_staff)):
    if not (len(cid) == 36 and all(ch.isalnum() or ch == "-" for ch in cid)):
        return JSONResponse(status_code=400, content={"error": "Id inválido"})
    cambios = {}
    if isinstance(datos.get("caption"), str):
        cambios["caption"] = datos["caption"][:2100]
    if datos.get("estado") in ("aprobada", "descartada", "propuesta"):
        cambios["estado"] = datos["estado"]
        if datos["estado"] == "aprobada":
            cambios["aprobado_por"] = str((_staff or {}).get("nombre") or "panel")[:60]
    if isinstance(datos.get("destinos"), list):
        cambios["destinos"] = [d for d in datos["destinos"] if d in ("instagram", "facebook", "pinterest")] or ["instagram"]
    if datos.get("ahora"):
        cambios["programado_para"] = _dtm.now(_tz.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    if not cambios:
        return JSONResponse(status_code=400, content={"error": "Nada que cambiar"})
    supabase_patch_r(f"redes_cola?id=eq.{cid}&estado=in.(propuesta,aprobada,error)", cambios)
    return {"ok": True}


@router.post("/cola/config")
def cola_config(datos: dict, _staff=Depends(require_staff)):
    """Ajustes de la cola: cuántas propuestas por día (0-5), horarios (HH:MM separados por coma) y si se aprueban solas."""
    from database import supabase_patch
    guardar = {}
    if "por_dia" in datos:
        try:
            guardar["redes_por_dia"] = str(max(0, min(5, int(datos["por_dia"]))))
        except (TypeError, ValueError):
            return JSONResponse(status_code=400, content={"error": "Número inválido"})
    if "horas" in datos:
        hs = [h.strip() for h in str(datos["horas"]).split(",") if h.strip()]
        if not hs or any(len(h) != 5 or h[2] != ":" or not (h[:2] + h[3:]).isdigit() for h in hs):
            return JSONResponse(status_code=400, content={"error": "Horarios inválidos (usa HH:MM separados por coma)"})
        guardar["redes_horas"] = ",".join(hs[:4])
    if "auto_aprobar" in datos:
        guardar["redes_auto_aprobar"] = "1" if datos["auto_aprobar"] else "0"
    for k, v in guardar.items():
        if supabase_get(f"configuracion?clave=eq.{k}&select=clave"):
            supabase_patch(f"configuracion?clave=eq.{k}", {"valor": v})
        else:
            supabase_post("configuracion", {"clave": k, "valor": v})
    return {"ok": True, **guardar}
