# -*- coding: utf-8 -*-
"""
Catálogos que se actualizan solos.

Cada catálogo (Tacones, Sandalias, Flats, Botas, Botines, Plataformas) con auto_activo=true se arma con lo que HAY EN STOCK:
una página por modelo y color (1 a 3 fotos, nombre, color y los demás colores con existencia). Cada madrugada se compara la
«firma» de lo que debería tener contra la que se publicó y, SOLO si cambió (llegó un color, se agotó otro, cambió una foto),
se vuelven a generar las páginas, se suben a Cloudinary (mismas rutas, se sobreescriben) y se reemplazan en catalogo_paginas.
Si algo falla antes de reemplazar, el catálogo publicado se queda como estaba.
"""
import os
import io
import re
import json
import hashlib
import threading
import datetime as _dt
import urllib.request
import concurrent.futures as cf
from collections import defaultdict

from PIL import Image, ImageDraw, ImageFont

import storage  # configura cloudinary con las claves del entorno
import cloudinary.uploader

from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete
from cache import cache_invalidate, cache_invalidate_prefix

_DIR_FUENTES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
W, H = 1080, 1440
_LOCK = threading.Lock()
_PAGINAS_MAX = 400   # tope de seguridad por catálogo

_HEX = {'negro': '#1C1C1C', 'blanco': '#F8F8F8', 'hueso': '#F0EBE1', 'beige': '#D9C9A8', 'camel': '#C19A6B', 'cafe': '#6B3A2A',
        'chocolate': '#3D1C02', 'cognac': '#9B4421', 'taupe': '#8B7355', 'nude': '#D4A97A', 'salmon': '#FA8072',
        'coral': '#FF6B4A', 'rojo': '#CC2200', 'vino': '#722F37', 'rosa': '#F4607A', 'naranja': '#FF8C00', 'amarillo': '#F5C518',
        'dorado': '#D4AF37', 'oro': '#CFB53B', 'plata': '#C0C0C0', 'plateado': '#C0C0C0', 'inox': '#B8B8B8', 'azul': '#1E4080',
        'verde': '#2D6A4F', 'gris': '#909090', 'morado': '#7B2D8B', 'lila': '#C8A0D8', 'moka': '#6F4E37', 'latte': '#C8A27C',
        'madera': '#8B5A2B', 'maquillaje': '#D8A88E', 'miel': '#C8892B', 'sandalo': '#E0C9A6', 'capuchino': '#A98467',
        'carey': '#7A4B2A', 'vaca': '#E8E2D8', 'ferrero': '#5A3A22', 'murano': '#8C7B6B'}

_FUENTES = {}


def _fuente(sz, bold=False):
    k = (sz, bold)
    if k not in _FUENTES:
        _FUENTES[k] = ImageFont.truetype(os.path.join(_DIR_FUENTES, "WorkSans-Bold.ttf" if bold else "WorkSans-Regular.ttf"), sz)
    return _FUENTES[k]


def _tracked(d, texto, cx, y, f, fill, sp=0):
    w = sum(d.textlength(c, font=f) + sp for c in texto) - sp
    x = cx - w / 2
    for c in texto:
        d.text((x, y), c, font=f, fill=fill)
        x += d.textlength(c, font=f) + sp


def _partir(d, texto, f, maxw, sp=0):
    lineas, act = [], ""
    for w in texto.split():
        t = (act + " " + w).strip()
        if sum(d.textlength(c, font=f) + sp for c in t) > maxw and act:
            lineas.append(act)
            act = w
        else:
            act = t
    if act:
        lineas.append(act)
    return lineas


def _hex_de(color, h):
    if h and str(h).startswith("#"):
        return h
    low = (color or "").lower()
    for k, v in _HEX.items():
        if k in low:
            return v
    return "#BBAA99"


def _bajar(url):
    if "res.cloudinary.com" in url and "/upload/" in url and "/upload/w_" not in url:
        url = url.replace("/upload/", "/upload/w_1300,q_88,f_jpg/", 1)
    for _ in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "zm-catalogos"})
            return Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert("RGB")
        except Exception:
            pass
    return None


def _caja(im, foto, x, y, w, h):
    d = ImageDraw.Draw(im)
    d.rectangle([x, y, x + w, y + h], fill="#FFFFFF")
    if not foto:
        return
    r = foto.width / foto.height
    if r > w / h:
        dw, dh = w, w / r
    else:
        dh, dw = h, h * r
    foto = foto.resize((max(1, int(dw)), max(1, int(dh))))
    im.paste(foto, (int(x + (w - dw) / 2), int(y + (h - dh) / 2)))


def _pagina(it, fotos):
    """Una página 1080x1440: fotos (sin recortar), modelo, color y puntos de los colores con existencia."""
    im = Image.new("RGB", (W, H), "#FAFAF8")
    d = ImageDraw.Draw(im)
    _tracked(d, "ZAPATILLAS MAY", W / 2, 10, _fuente(24), "#2A1A0E", 8)
    d.rectangle([60, 48, 1020, 48], fill="#C8967A")
    d.rectangle([60, 58, 1020, 58], fill="#C8967A")
    c_top, alto = 62, 1080
    n = len(fotos)
    if n >= 3:
        lw = 648
        rw = W - lw - 10
        rh = (alto - 10) // 2
        _caja(im, fotos[0], 0, c_top, lw, alto)
        _caja(im, fotos[1], lw + 10, c_top, rw, rh)
        _caja(im, fotos[2], lw + 10, c_top + rh + 10, rw, rh)
    elif n == 2:
        cw = (W - 10) // 2
        _caja(im, fotos[0], 0, c_top, cw, alto)
        _caja(im, fotos[1], cw + 10, c_top, cw, alto)
    else:
        _caja(im, fotos[0], 40, c_top, 1000, alto)
    ny = c_top + alto + 12
    d.rectangle([0, ny, W, ny], fill="#E8DDD5")
    f = _fuente(26, True)
    yy = ny + 22
    for l in _partir(d, re.sub(r"\s+", " ", it["nombre"]).upper(), f, 960, 3)[:2]:
        _tracked(d, l, W / 2, yy, f, "#2A1A0E", 3)
        yy += 34
    _tracked(d, it["color"], W / 2, yy + 2, _fuente(18), "#A07860", 3)
    pts = it["dots"][:14]
    r, g = 11, 8
    tw = len(pts) * 2 * r + (len(pts) - 1) * g
    x = 540 - tw / 2 + r
    cy = 1296
    for c, hx in pts:
        d.ellipse([x - r, cy - r, x + r, cy + r], fill=_hex_de(c, hx), outline="#C9C2BA", width=2)
        x += 2 * r + g
    d.rectangle([60, 1340, 1020, 1340], fill="#C8967A")
    _tracked(d, "@ZAPATILLASMAY", W / 2, 1352, _fuente(20), "#A07860", 3)
    _tracked(d, "zapatillasmay.mx  ·  León, Guanajuato  ·  WhatsApp 479 224 4560", W / 2, 1392, _fuente(16), "#B8A89C", 0)
    return im


def _datos():
    """Productos, variantes y existencias por variante (todas las sucursales)."""
    prods = supabase_get_all("productos?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal")
    vars_ = supabase_get_all("variantes?activa=eq.true&select=id,producto_id,color,color_hex,foto_url,imagenes")
    stock = defaultdict(int)
    for r in supabase_get_all("inventario?select=variante_id,cantidad"):
        stock[r["variante_id"]] += int(r.get("cantidad") or 0)
    return prods, vars_, stock


def paginas_de(categoria, datos):
    """Una página por modelo y color con existencia y al menos una foto."""
    prods, vars_, stock = datos
    por_prod = defaultdict(list)
    for v in vars_:
        por_prod[v["producto_id"]].append(v)
    out = []
    ordenados = sorted([p for p in prods if (p.get("categoria") or "").strip().lower() == categoria],
                       key=lambda p: (p.get("nombre") or "").lower())
    for p in ordenados:
        por_color = defaultdict(list)
        for v in por_prod.get(p["id"], []):
            c = (v.get("color") or "").strip().upper()
            if c:
                por_color[c].append(v)
        con_stock = [(c, vl) for c, vl in sorted(por_color.items()) if sum(stock[v["id"]] for v in vl) > 0]
        if not con_stock:
            continue
        dots = [(c, next((v.get("color_hex") for v in vl if v.get("color_hex")), None)) for c, vl in con_stock]
        for c, vl in con_stock:
            fotos = []
            for v in vl:
                for u in [v.get("foto_url")] + list(v.get("imagenes") or []):
                    if u and u not in fotos:
                        fotos.append(u)
            if not fotos and p.get("imagen_principal"):
                fotos = [p["imagen_principal"]]
            if not fotos:
                continue
            out.append({"nombre": p["nombre"], "color": c, "fotos": fotos[:3], "dots": dots})
    return out[:_PAGINAS_MAX]


def _firma(items):
    base = json.dumps([[i["nombre"], i["color"], i["fotos"], [d[0] for d in i["dots"]]] for i in items], ensure_ascii=False, sort_keys=True)
    return hashlib.sha1(base.encode("utf-8")).hexdigest()


def actualizar_catalogo(cat, datos=None, forzar=False):
    """Regenera UN catálogo si cambió lo que hay en stock. Devuelve un dict con lo que pasó."""
    cid = cat["id"]
    slug = re.sub(r"[^a-z0-9]+", "-", (cat.get("nombre") or "").lower()).strip("-")
    categoria = (cat.get("nombre") or "").strip().lower()
    datos = datos or _datos()
    items = paginas_de(categoria, datos)
    if not items:
        return {"catalogo": cat.get("nombre"), "omitido": "sin modelos con existencia y foto: se deja como está"}
    firma = _firma(items)
    if not forzar and firma == cat.get("auto_firma"):
        return {"catalogo": cat.get("nombre"), "sin_cambios": True, "paginas": len(items)}
    # 1) se generan y suben TODAS las páginas nuevas antes de tocar las publicadas
    urls = []
    for n, it in enumerate(items, 1):
        with cf.ThreadPoolExecutor(3) as ex:
            ims = [x for x in ex.map(_bajar, it["fotos"]) if x is not None]
        if not ims:
            continue
        buf = io.BytesIO()
        _pagina(it, ims).save(buf, "JPEG", quality=84, optimize=True)
        r = cloudinary.uploader.upload(buf.getvalue(), public_id=f"catalogos_auto/{slug}/p{len(urls) + 1:03d}",
                                       overwrite=True, invalidate=True, resource_type="image")
        urls.append(r["secure_url"])
    if len(urls) < max(3, int(len(items) * 0.8)):
        raise RuntimeError(f"solo se pudieron armar {len(urls)} de {len(items)} páginas: no se reemplaza el catálogo publicado")
    # 2) se reemplazan las páginas publicadas
    supabase_delete(f"catalogo_paginas?catalogo_id=eq.{cid}")
    for n, u in enumerate(urls, 1):
        supabase_post("catalogo_paginas", {"catalogo_id": cid, "imagen_url": u, "pagina_numero": n})
    # 3) sobran páginas de la vez pasada: se borran de Cloudinary
    antes = int(cat.get("auto_paginas") or 0)
    for n in range(len(urls) + 1, antes + 1):
        try:
            cloudinary.uploader.destroy(f"catalogos_auto/{slug}/p{n:03d}", invalidate=True)
        except Exception:
            pass
    supabase_patch(f"catalogos?id=eq.{cid}", {"auto_firma": firma, "auto_at": _dt.datetime.now(_dt.timezone.utc).isoformat(), "auto_paginas": len(urls)})
    cache_invalidate("catalogos_activos", "catalogos_todos")
    cache_invalidate(f"catalogo_{cid}", f"catalogo_{cid}_paginas")
    cache_invalidate_prefix("catalogo_")
    return {"catalogo": cat.get("nombre"), "actualizado": True, "paginas": len(urls)}


def actualizar_todos(forzar=False, solo_id=None):
    """Recorre los catálogos con auto_activo=true. Un solo proceso a la vez; un error en uno no frena a los demás."""
    if not _LOCK.acquire(blocking=False):
        return {"ocupado": True}
    try:
        cats = supabase_get("catalogos?auto_activo=eq.true&select=*") or []
        if solo_id:
            cats = [c for c in cats if c["id"] == solo_id]
        if not cats:
            return {"catalogos": []}
        datos = _datos()
        res = []
        for c in cats:
            try:
                res.append(actualizar_catalogo(c, datos, forzar))
            except Exception as e:
                res.append({"catalogo": c.get("nombre"), "error": str(e)[:200]})
                print(f"[catalogos-auto] {c.get('nombre')}: {e}")
        print(f"[catalogos-auto] {res}")
        return {"catalogos": res}
    finally:
        _LOCK.release()
