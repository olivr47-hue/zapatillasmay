"""Publicaciones en Facebook e Instagram (Estudio de publicaciones del panel).

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
        raise _GraphError(err.get("code"), err.get("message") or crudo[:200])
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
    """product_id del catálogo de Meta para etiquetar un modelo en Instagram. El feed manda un artículo por variante (g:id = id de la
    variante), así que se busca en el catálogo por el id de alguna variante del modelo. Devuelve (product_id, motivo_si_no)."""
    ig = cuentas.get("ig_id")
    if not ig or not producto_id:
        return None, "sin cuenta de Instagram o sin modelo"
    if producto_id in _CACHE_META_ID:
        return _CACHE_META_ID[producto_id], ""
    try:
        cats = _graph(f"{ig}/available_catalogs").get("data") or []
        if not cats:
            return None, "Instagram no tiene un catálogo/tienda conectado a esta cuenta"
        catalogo = cats[0].get("catalog_id")
        variantes = supabase_get(f"variantes?producto_id=eq.{urllib.parse.quote(str(producto_id), safe='')}&activa=eq.true&select=id&limit=6") or []
        for v in variantes:
            vid = str(v.get("id"))
            r = _graph(f"{ig}/catalog_product_search?catalog_id={catalogo}&q={urllib.parse.quote(vid)}&limit=5").get("data") or []
            for it in r:
                if str(it.get("retailer_id")) == vid and it.get("product_id"):
                    _CACHE_META_ID[producto_id] = str(it["product_id"])
                    return _CACHE_META_ID[producto_id], ""
        return None, "no se encontró este modelo en tu catálogo de Meta (puede que aún no se haya sincronizado el feed)"
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
    tags = [{"product_id": meta_id, "x": 0.5, "y": 0.82}] if (meta_id and not historia) else None

    def crear(datos):
        nonlocal tags, aviso
        if tags:
            try:
                return _graph(f"{ig}/media", "POST", {**datos, "product_tags": tags})["id"]
            except _GraphError as e:
                aviso = "Se publicó SIN etiqueta de producto: " + _explicar_etiqueta(e)
                tags = None
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


@router.post("/publicar")
def publicar(datos: dict, _staff=Depends(require_staff)):
    """datos: {urls:[...], caption, destinos:['facebook','instagram'], historia:bool, producto_ids:[...]}.
    Devuelve el resultado por destino (si uno falla el otro igual se intenta)."""
    urls = [u for u in (datos.get("urls") or []) if isinstance(u, str) and u.startswith("https://")][:10]
    destinos = [d for d in (datos.get("destinos") or []) if d in ("facebook", "instagram")]
    caption = str(datos.get("caption") or "")[:2100]
    historia = bool(datos.get("historia"))
    if not urls or not destinos:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Faltan imágenes o destino"})
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
            if d == "facebook":
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
            resultados[d] = {"ok": False, "error": _explicar(e, d)}
        except Exception as e:
            resultados[d] = {"ok": False, "error": str(e)[:200]}
    return {"ok": all(r["ok"] for r in resultados.values()), "resultados": resultados}


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
