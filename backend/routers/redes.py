"""Publicaciones en Facebook, Instagram y Pinterest (Estudio de publicaciones del panel).

El panel arma las imágenes (canvas) y las sube a Cloudinary; aquí solo se publican por la Graph API de Meta con el token de la
página (FB_PAGE_ACCESS_TOKEN, el mismo que ya usa Maya para Messenger/Instagram). Hace falta que ese token tenga los permisos
`pages_manage_posts` (Facebook) e `instagram_content_publish` (Instagram); /redes/estado lo revisa y explica qué falta.
"""
import os
import json
import time
import urllib.request
import urllib.error
import urllib.parse

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from database import supabase_get, supabase_post
from security import require_staff

router = APIRouter(prefix="/redes", tags=["Redes sociales"])

_GRAPH = "https://graph.facebook.com/v21.0"
_PIN = "https://api.pinterest.com/v5"
_cache_tableros = {"t": 0, "d": None}


def _pin_token() -> str:
    # Para publicar pines hace falta un token con permisos boards:read, pins:read y pins:write (el de la API de conversiones, PINTEREST_ACCESS_TOKEN, puede no
    # traerlos). Si existe PINTEREST_PUBLISH_TOKEN se usa ese; si no, el de siempre.
    return os.environ.get("PINTEREST_PUBLISH_TOKEN", "") or os.environ.get("PINTEREST_ACCESS_TOKEN", "")


def _pin_api(ruta: str, metodo: str = "GET", datos: dict = None):
    t = _pin_token()
    if not t:
        raise _GraphError(None, "Falta el token de Pinterest (PINTEREST_PUBLISH_TOKEN o PINTEREST_ACCESS_TOKEN)")
    req = urllib.request.Request(f"{_PIN}/{ruta}", data=(json.dumps(datos).encode("utf-8") if datos is not None else None), method=metodo,
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
        c = crear({"image_url": urls[0], "media_type": "STORIES"})
        _esperar_contenedor(c)
        return _graph(f"{ig}/media_publish", "POST", {"creation_id": c}).get("id"), aviso
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
