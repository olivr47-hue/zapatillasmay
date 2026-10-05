# -*- coding: utf-8 -*-
"""
routers/seo_auditoria.py
Auditoría de SEO por página para el panel (SEO y Sitio → SEO por página).

Lee el sitemap público, descarga cada página tal como la ve Google y extrae título, descripción, H1, canonical, datos
estructurados, palabras e imágenes sin texto alternativo. Se cruza con el rendimiento de Search Console (clics, impresiones y
posición de los últimos 28 días). Corre en segundo plano y deja el resultado en memoria (la tienda tiene ~340 páginas).
Todo bajo /seo/* => exige sesión de personal (ver _PREFIJOS_PROTEGIDOS en main.py).
"""
import re
import json
import time
import threading
import urllib.request
import urllib.error
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter

router = APIRouter(prefix="/seo", tags=["SEO auditoría"])

BASE = "https://zapatillasmay.mx"
_ESTADO = {"estado": "sin_datos", "hechas": 0, "total": 0, "inicio": 0, "fin": 0, "paginas": [], "error": ""}
_GSC = {"t": 0, "por_url": {}, "error": ""}
_LOCK = threading.Lock()


class _Lector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.desc = ""
        self.canonical = ""
        self.robots = ""
        self.og_image = ""
        self.h1 = []
        self.jsonld = []
        self.imgs = 0
        self.imgs_sin_alt = 0
        self.enlaces = 0
        self.texto = []
        self._en = []          # pila de etiquetas "especiales"
        self._buf = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self._en and self._en[-1] == "h1":
            self._buf += " "   # <br>/<span> dentro del H1: que las palabras no se peguen
        if tag in ("script", "style", "noscript", "template"):
            self._en.append(tag)
            self._buf = ""
            self._ld = (tag == "script" and a.get("type") == "application/ld+json")
            return
        if tag == "title":
            self._en.append("title"); self._buf = ""
        elif tag == "h1":
            self._en.append("h1"); self._buf = ""
        elif tag == "meta":
            n = (a.get("name") or a.get("property") or "").lower()
            if n == "description":
                self.desc = a.get("content") or ""
            elif n == "robots":
                self.robots = (a.get("content") or "").lower()
            elif n == "og:image":
                self.og_image = a.get("content") or ""
        elif tag == "link" and (a.get("rel") or "").lower() == "canonical":
            self.canonical = a.get("href") or ""
        elif tag == "img":
            self.imgs += 1
            if not (a.get("alt") or "").strip():
                self.imgs_sin_alt += 1
        elif tag == "a":
            h = a.get("href") or ""
            if h.startswith("/") or "zapatillasmay.mx" in h:
                self.enlaces += 1

    def handle_endtag(self, tag):
        if not self._en or self._en[-1] != tag:
            return
        self._en.pop()
        if tag == "title":
            self.title = re.sub(r"\s+", " ", self._buf).strip()
        elif tag == "h1":
            self.h1.append(re.sub(r"\s+", " ", self._buf).strip())
        elif tag == "script" and getattr(self, "_ld", False):
            try:
                self.jsonld.append(json.loads(self._buf))
            except Exception:
                self.jsonld.append({"@type": "(JSON-LD con error)"})
        self._buf = ""

    def handle_data(self, d):
        if self._en and self._en[-1] in ("title", "h1", "script"):
            self._buf += d
            return
        if self._en and self._en[-1] in ("style", "noscript", "template"):
            return
        if self._en and self._en[-1] == "h1":
            return
        self.texto.append(d)


def _tipos_ld(items):
    out = []

    def rec(x):
        if isinstance(x, list):
            for i in x:
                rec(i)
        elif isinstance(x, dict):
            t = x.get("@type")
            if isinstance(t, list):
                out.extend(str(i) for i in t)
            elif t:
                out.append(str(t))
            if "@graph" in x:
                rec(x["@graph"])
    rec(items)
    return sorted(set(out))


def _tipo_pagina(path):
    if path in ("", "/"):
        return "portada"
    p = path.strip("/").split("/")
    if p[0] == "producto":
        return "producto"
    if p[0].startswith("guia"):
        return "guía"
    if p[0] in ("tacones", "sandalias", "botas", "botines", "flats", "plataformas", "tenis", "ofertas"):
        return "categoría"
    return "página"


def _auditar(url):
    path = url.replace(BASE, "") or "/"
    r = {"url": url, "ruta": path, "tipo": _tipo_pagina(path), "estado_http": 0}
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; ZapatillasMay-AuditoriaSEO/1.0)"})
        with urllib.request.urlopen(req, timeout=25) as resp:
            r["estado_http"] = resp.status
            html = resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        r["estado_http"] = e.code
        r["problemas"] = [f"La página responde {e.code}"]
        return r
    except Exception as e:
        r["problemas"] = [f"No se pudo leer: {str(e)[:80]}"]
        return r
    L = _Lector()
    try:
        L.feed(html)
    except Exception:
        pass
    texto = re.sub(r"\s+", " ", " ".join(L.texto)).strip()
    r.update({
        "titulo": L.title, "titulo_len": len(L.title),
        "descripcion": L.desc, "descripcion_len": len(L.desc),
        "h1": L.h1[0] if L.h1 else "", "h1_n": len(L.h1),
        "canonical": L.canonical, "robots": L.robots,
        "og_image": bool(L.og_image),
        "datos_estructurados": _tipos_ld(L.jsonld),
        "palabras": len(texto.split()) if texto else 0,
        "imagenes": L.imgs, "imagenes_sin_alt": L.imgs_sin_alt,
        "enlaces_internos": L.enlaces,
    })
    return r


def _problemas(r, titulos_repetidos):
    if r.get("estado_http") != 200 or "titulo" not in r:
        return r.get("problemas") or []
    p = []
    n = r["titulo_len"]
    if not n:
        p.append("Sin título")
    elif n < 30:
        p.append(f"Título muy corto ({n})")
    elif n > 65:
        p.append(f"Título muy largo ({n}): Google lo corta")
    if r["titulo"] and titulos_repetidos.get(r["titulo"], 0) > 1:
        p.append("Título repetido en otra página")
    d = r["descripcion_len"]
    if not d:
        p.append("Sin descripción")
    elif d < 90:
        p.append(f"Descripción muy corta ({d})")
    elif d > 165:
        p.append(f"Descripción muy larga ({d})")
    if r["h1_n"] == 0:
        p.append("Sin H1")
    elif r["h1_n"] > 1:
        p.append(f"{r['h1_n']} H1 (debe ser uno)")
    if not r["canonical"]:
        p.append("Sin canonical")
    if "noindex" in (r.get("robots") or ""):
        p.append("Marcada noindex: Google no la indexa")
    if not r["og_image"]:
        p.append("Sin imagen para compartir (og:image)")
    if r["imagenes_sin_alt"]:
        p.append(f"{r['imagenes_sin_alt']} imagen(es) sin texto alternativo")
    minimo = 120 if r["tipo"] == "producto" else 200
    if r["palabras"] < minimo:
        p.append(f"Contenido delgado ({r['palabras']} palabras)")
    if r["tipo"] == "producto" and "Product" not in r["datos_estructurados"]:
        p.append("Sin datos estructurados de producto")
    return p


def _urls_sitemap():
    req = urllib.request.Request(BASE + "/sitemap.xml", headers={"User-Agent": "ZapatillasMay-AuditoriaSEO/1.0"})
    with urllib.request.urlopen(req, timeout=25) as resp:
        xml = resp.read().decode("utf-8", errors="replace")
    urls = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", xml)
    vistos, out = set(), []
    for u in urls:
        u = u.replace("&amp;", "&")
        if u not in vistos:
            vistos.add(u); out.append(u)
    return out


def _correr():
    try:
        urls = _urls_sitemap()
        with _LOCK:
            _ESTADO.update({"estado": "trabajando", "hechas": 0, "total": len(urls), "inicio": time.time(), "error": ""})
        resultados = []

        def uno(u):
            r = _auditar(u)
            with _LOCK:
                _ESTADO["hechas"] += 1
            return r
        with ThreadPoolExecutor(max_workers=6) as ex:
            resultados = list(ex.map(uno, urls))
        reps = {}
        for r in resultados:
            t = r.get("titulo")
            if t:
                reps[t] = reps.get(t, 0) + 1
        for r in resultados:
            r["problemas"] = _problemas(r, reps)
        with _LOCK:
            _ESTADO.update({"estado": "listo", "paginas": resultados, "fin": time.time()})
    except Exception as e:
        with _LOCK:
            _ESTADO.update({"estado": "error", "error": str(e)[:200], "fin": time.time()})


def _norm(u):
    return (u or "").split("#")[0].rstrip("/") or BASE


def _gsc_por_pagina():
    """Clics / impresiones / posición por URL de los últimos 28 días (cache de 1 h)."""
    if _GSC["por_url"] and time.time() - _GSC["t"] < 3600:
        return _GSC
    try:
        from routers import searchconsole
        d = searchconsole.search_analytics(dias=28, dimension="page", limite=1000)
        if d.get("error") or d.get("configurado") is False:
            _GSC.update({"t": time.time(), "por_url": {}, "error": d.get("error") or "Search Console no está configurado"})
        else:
            _GSC.update({"t": time.time(), "error": "", "por_url": {
                _norm(f["page"]): {"clics": f["clicks"], "impresiones": f["impresiones"], "ctr": f["ctr"], "posicion": f["posicion"]}
                for f in d.get("filas", [])}})
    except Exception as e:
        _GSC.update({"t": time.time(), "por_url": {}, "error": str(e)[:150]})
    return _GSC


@router.get("/auditoria")
def auditoria(refrescar: bool = False):
    """Estado y resultado de la auditoría. Con refrescar=true arranca una nueva (si no hay una corriendo)."""
    with _LOCK:
        corriendo = _ESTADO["estado"] == "trabajando"
        antigua = _ESTADO["estado"] == "listo" and time.time() - _ESTADO["fin"] > 6 * 3600
    if not corriendo and (refrescar or _ESTADO["estado"] == "sin_datos" or antigua):
        with _LOCK:
            _ESTADO["estado"] = "trabajando"; _ESTADO["hechas"] = 0; _ESTADO["total"] = 0
        threading.Thread(target=_correr, daemon=True).start()
    with _LOCK:
        base = {k: _ESTADO[k] for k in ("estado", "hechas", "total", "fin", "error")}
        pags = list(_ESTADO["paginas"])
    if pags:
        g = _gsc_por_pagina()
        for p in pags:
            p["gsc"] = g["por_url"].get(_norm(p["url"]))
        base["gsc_error"] = g["error"]
    base["paginas"] = pags
    return base
