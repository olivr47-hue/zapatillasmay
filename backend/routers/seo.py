from fastapi import APIRouter
from fastapi.responses import Response, StreamingResponse, RedirectResponse, HTMLResponse
from database import supabase_get, supabase_post, supabase_patch
from cache import cache_get, cache_set, cache_invalidate_prefix, TTL_ESTATICO, TTL_FEEDS
import urllib.request
import json
import os
import re
import io
import html as _html

router = APIRouter(tags=["SEO"])

def _get_api_key():
    return os.environ.get("ANTHROPIC_API_KEY", "")

@router.post("/productos/generar-seo")
def generar_seo(datos: dict):
    """Genera slug, meta título y meta descripción SEO usando IA a partir de los datos del producto."""
    api_key = _get_api_key()

    nombre     = (datos.get("nombre") or "").strip()
    descripcion = (datos.get("descripcion") or "").strip()
    categoria  = (datos.get("categoria") or "").strip()
    material   = (datos.get("material") or "").strip()
    tacon      = (datos.get("tacon") or "").strip()
    tipo_tacon = (datos.get("tipo_tacon") or "").strip()
    precio     = (datos.get("precio") or "").strip()
    horma      = (datos.get("horma") or "").strip()

    if not nombre and not descripcion:
        return {"error": "sin_datos"}

    # ── Si no hay API key, fallback a plantilla ──
    if not api_key:
        return {"error": "no_api_key"}

    prompt = f"""Eres un experto en SEO para e-commerce de calzado femenino mexicano.

Dado los datos de un producto de Zapatillas May (tienda en León, Guanajuato), genera campos SEO optimizados.

DATOS DEL PRODUCTO:
- Nombre/código interno: {nombre}
- Descripción: {descripcion if descripcion else "(sin descripción)"}
- Categoría: {categoria if categoria else "(sin categoría)"}
- Material: {material if material else "(sin especificar)"}
- Tacón: {tipo_tacon + " " + tacon + " cm" if tacon else "(sin especificar)"}
- Horma: {horma if horma else "(sin especificar)"}
- Precio menudeo: {"$" + precio + " MXN" if precio else "(sin especificar)"}

INSTRUCCIONES:
- El nombre interno puede ser un código o abreviatura — infiere el nombre real del producto a partir de la descripción.
- El slug debe ser descriptivo y con palabras clave de búsqueda real (ej: "sandalia-tacon-aguja-nude-plataforma").
- El meta título debe tener máximo 60 caracteres, incluir la palabra clave principal y terminar en "| Zapatillas May".
- La meta descripción debe tener entre 140 y 155 caracteres, incluir precio si está disponible, una llamada a acción, y enfocarse en lo que busca la compradora (comodidad, ocasión, estilo).
- nombre_producto es el nombre bonito y legible para mostrar en la tienda (no el código interno).

Responde ÚNICAMENTE con JSON válido sin markdown ni explicaciones:
{{"slug":"...","meta_titulo":"...","meta_descripcion":"...","nombre_producto":"..."}}"""

    try:
        body = json.dumps({
            "model": "claude-haiku-4-5-20251001",
            "max_tokens": 400,
            "messages": [{"role": "user", "content": prompt}]
        }).encode("utf-8")

        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=body,
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=20) as response:
            result = json.loads(response.read().decode("utf-8"))

        text = result["content"][0]["text"].strip()
        # Strip markdown fences if model wraps in ```json
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.MULTILINE).strip()
        seo = json.loads(text)
        return seo

    except Exception as e:
        return {"error": str(e)}

@router.get("/seo/producto/{sku}")
def producto_ssr(sku: str):
    """Sirve producto.html con meta tags y datos del producto pre-inyectados para indexación SEO."""
    # 0. Caché del HTML ya armado (baja el TTFB). El JS del navegador re-carga
    #    stock/precio en vivo, así que cachear el SSR no muestra datos viejos al cliente.
    _ck_ssr = f"ssr_prod_{sku}"
    _cached = cache_get(_ck_ssr)
    if _cached is not None:
        return HTMLResponse(content=_cached)
    # 1. Buscar producto
    datos = supabase_get(f"productos?sku_interno=eq.{sku}&activo=eq.true&limit=1")
    if not datos:
        datos = supabase_get(f"productos?id=eq.{sku}&activo=eq.true&limit=1")
    if not datos:
        return RedirectResponse(url="https://zapatillasmay.mx/", status_code=302)

    p = datos[0]
    nombre    = (p.get("nombre") or "Calzado").strip()
    # SEO generado en el panel (si existe) tiene prioridad sobre los datos crudos
    meta_titulo = (p.get("meta_titulo") or "").strip()
    meta_desc   = (p.get("meta_descripcion") or "").strip()
    palabras    = (p.get("palabras_clave") or "").strip()
    desc_raw  = (p.get("descripcion") or nombre).strip()
    desc      = (meta_desc or desc_raw)[:160]
    titulo_seo = meta_titulo or f"{nombre} | Zapatillas May — León, Guanajuato"
    precio    = (p.get("precio_menudeo") or 0)
    precio_display = precio if p.get("es_oferta") else precio + 80
    imagen    = p.get("imagen_principal") or ""
    categoria = (p.get("categoria") or "calzado").strip()
    sku_canon = p.get("sku_interno") or sku
    canonical = f"https://zapatillasmay.mx/producto/{sku_canon}"

    # Imágenes para SEO de imágenes (Google Images / Shopping): principal + variantes
    imagenes_seo = []
    if imagen:
        imagenes_seo.append(imagen)
    try:
        variantes = supabase_get(
            f"variantes?producto_id=eq.{p['id']}&activa=eq.true&select=foto_url,imagenes"
        )
        for v in (variantes or []):
            if v.get("foto_url"):
                imagenes_seo.append(v["foto_url"])
            extra = v.get("imagenes")
            if isinstance(extra, list):
                imagenes_seo.extend([u for u in extra if u])
    except Exception:
        pass
    # Quitar duplicados conservando el orden
    _seen = set()
    imagenes_seo = [u for u in imagenes_seo if u and not (u in _seen or _seen.add(u))]

    def _esc(s):
        return _html.escape(str(s or ""), quote=True)

    # 2. Obtener template producto.html desde Vercel (cacheado)
    cache_key = "tpl_producto_html"
    template  = cache_get(cache_key)
    if template is None:
        try:
            req = urllib.request.Request(
                "https://zapatillasmay.mx/producto.html",
                headers={"User-Agent": "ZapatillasSSR/1.0"}
            )
            with urllib.request.urlopen(req, timeout=8) as r:
                template = r.read().decode("utf-8")
            cache_set(cache_key, template, ttl=3600)
        except Exception as e:
            # Fallback: HTML mínimo con meta tags
            template = None

    # JSON-LD del producto (con todas las imágenes) — generado de forma segura
    ld = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": nombre,
        "image": imagenes_seo or ([imagen] if imagen else []),
        "description": (meta_desc or desc_raw)[:300],
        "sku": sku_canon,
        "brand": {"@type": "Brand", "name": "Zapatillas May"},
        "category": categoria,
        "offers": {
            "@type": "Offer",
            "url": canonical,
            "priceCurrency": "MXN",
            "price": str(precio_display),
            "availability": "https://schema.org/InStock",
            "seller": {"@type": "Organization", "name": "Zapatillas May"},
        },
    }
    ld_json = json.dumps(ld, ensure_ascii=False)

    if not template:
        # Fallback minimal HTML
        html = f"""<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{_esc(titulo_seo)}</title>
<meta name="description" content="{_esc(desc)}">
<meta name="keywords" content="{_esc(palabras)}">
<link rel="canonical" href="{canonical}">
<meta property="og:title" content="{_esc(titulo_seo)}">
<meta property="og:image" content="{_esc(imagen)}">
<meta property="og:url" content="{canonical}">
<script type="application/ld+json">{ld_json}</script>
</head><body>
<script>window.__ZM_PRODUCT__={json.dumps(p, ensure_ascii=False)};</script>
<script>setTimeout(()=>{{ if(!window.__ZM_LOADED__) window.location.href='{canonical}' }}, 3000)</script>
</body></html>"""
        return HTMLResponse(content=html)

    # 3. Inyectar meta tags producto-específicos
    template = template.replace(
        "<title>Zapatillas May</title>",
        f"<title>{_esc(titulo_seo)}</title>"
    )
    template = template.replace(
        'content="Calzado de moda para dama. León, Guanajuato."',
        f'content="{_esc(desc)}"'
    )

    schema = f"""
  <link rel="canonical" href="{canonical}">
  <meta name="keywords" content="{_esc(palabras)}">
  <meta property="og:title" content="{_esc(titulo_seo)}">
  <meta property="og:description" content="{_esc(desc)}">
  <meta property="og:image" content="{_esc(imagen)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:type" content="product">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{_esc(titulo_seo)}">
  <meta name="twitter:image" content="{_esc(imagen)}">
  <script type="application/ld+json">{ld_json}</script>
  <script>window.__ZM_PRODUCT__ = {json.dumps(p, ensure_ascii=False)}; window.__ZM_LOADED__ = true;</script>"""

    template = template.replace("</head>", schema + "\n</head>")

    # #4 — Contenido visible renderizado en servidor (descripción + ficha técnica),
    # para que cuente en SEO sin depender de que el robot ejecute JavaScript.
    # El JS de producto.html re-llena estos contenedores en el navegador (mismo
    # contenido), así que no hay cambio visual para la clienta.
    try:
        # H1 del producto renderizado en servidor (el JS lo re-pinta igual al cargar)
        template = template.replace(
            '<div class="product-section" id="product-section">',
            f'<div class="product-section" id="product-section">\n  <h1 class="product-name">{_esc(nombre)}</h1>'
        )
        desc_visible = _esc(desc_raw)
        if desc_visible:
            template = template.replace(
                '<div id="desc-card" style="display:none" class="info-card">',
                '<div id="desc-card" class="info-card">'
            )
            template = template.replace(
                '<div class="info-card-body open" id="desc-body"></div>',
                f'<div class="info-card-body open" id="desc-body"><p>{desc_visible}</p></div>'
            )
        specs = []
        def _add(label, val):
            v = ("" if val is None else str(val)).strip()
            if v:
                specs.append(f"{label}: {_esc(v)}")
        _add("Categoría", categoria)
        _add("Material", p.get("material"))
        _add("Forro", p.get("forro"))
        _add("Suela", p.get("material_suela"))
        _add("Horma", p.get("horma"))
        if p.get("altura_tacon"):
            _add("Altura de tacón", f"{p.get('altura_tacon')} cm")
        _add("Tipo de tacón", p.get("tipo_tacon"))
        tallas = p.get("tallas_disponibles")
        if isinstance(tallas, list) and tallas:
            _add("Tallas disponibles", ", ".join(str(t) for t in tallas))
        if specs:
            details_html = "".join(f"<p>{s}</p>" for s in specs)
            template = template.replace(
                '<div id="details-card" style="display:none" class="info-card">',
                '<div id="details-card" class="info-card">'
            )
            template = template.replace(
                '<div class="info-card-body" id="details-body"></div>',
                f'<div class="info-card-body" id="details-body">{details_html}</div>'
            )
    except Exception as _e:
        print(f"[seo] No se pudo inyectar contenido server-side: {_e}")

    cache_set(_ck_ssr, template, ttl=900)  # 15 min
    return HTMLResponse(content=template)


# ── #3 — Títulos/descripciones únicos por categoría y páginas fijas (SSR) ──────
_HOME_TITLE = "Zapatillas May | Calzado de Moda Mayoreo y Menudeo — León, Guanajuato"
_HOME_DESC = ("Calzado femenino de moda hecho en León, Guanajuato. Mayoreo desde 3 pares "
              "sin registro. Tacones, sandalias, botas y botines. Envíos a todo México.")

_PAGINAS_SEO = {
    "tacones": ("Tacones de Dama — Mayoreo y Menudeo | Zapatillas May León",
                "Tacones de moda para dama fabricados en León, Guanajuato. Mayoreo desde 3 pares sin registro: aguja, bloque y plataforma. Envíos a todo México."),
    "sandalias": ("Sandalias de Dama — Mayoreo y Menudeo | Zapatillas May",
                  "Sandalias de moda para dama hechas en León, Guanajuato. Precios de mayoreo desde 3 pares, casuales y de fiesta. Envíos a todo México."),
    "botas": ("Botas de Dama — Mayoreo y Menudeo | Zapatillas May León",
              "Botas de moda para dama fabricadas en León, Guanajuato. Mayoreo desde 3 pares sin registro. Envíos a todo México."),
    "botines": ("Botines de Dama — Mayoreo y Menudeo | Zapatillas May",
                "Botines de moda para dama hechos en León, Guanajuato. Precios de mayoreo desde 3 pares. Envíos a todo México."),
    "flats": ("Flats y Zapatos Bajos de Dama — Mayoreo | Zapatillas May",
              "Flats y zapatos bajos de dama, cómodos y de moda, fabricados en León, Guanajuato. Mayoreo desde 3 pares. Envíos a todo México."),
    "plataformas": ("Plataformas de Dama — Mayoreo y Menudeo | Zapatillas May",
                    "Plataformas de moda para dama hechas en León, Guanajuato. Altura con comodidad, mayoreo desde 3 pares. Envíos a todo México."),
    "tenis": ("Tenis de Dama — Mayoreo y Menudeo | Zapatillas May",
              "Tenis de moda para dama fabricados en León, Guanajuato. Mayoreo desde 3 pares sin registro. Envíos a todo México."),
    "nina": ("Calzado para Niña — Mayoreo y Menudeo | Zapatillas May",
             "Calzado de moda para niña fabricado en León, Guanajuato. Cómodo y resistente, mayoreo desde 3 pares. Envíos a todo México."),
    "accesorios": ("Accesorios — Zapatillas May León, Guanajuato",
                   "Accesorios para complementar tu look en Zapatillas May. Fabricado en León, Guanajuato. Mayoreo y menudeo con envíos a todo México."),
    "mayoreo": ("Mayoreo de Calzado sin Mínimo — desde 3 Pares | Zapatillas May",
                "Compra calzado de dama a precio de mayoreo desde 3 pares, sin registro especial. Fabricado en León, Guanajuato. Envíos a todo México."),
    "ofertas": ("Ofertas de Calzado de Dama | Zapatillas May",
                "Aprovecha las ofertas de calzado femenino de Zapatillas May: tacones, sandalias y más a precios especiales. Envíos a todo México."),
    "nosotros": ("Sobre Nosotras — Fábrica de Calzado en León | Zapatillas May",
                 "Conoce Zapatillas May, fabricante de calzado femenino de moda en León, Guanajuato. Calidad artesanal a precio de mayoreo y menudeo."),
    "envios": ("Envíos a todo México | Zapatillas May",
               "Información de envíos de Zapatillas May: cobertura nacional, tiempos y costos, con envío gratis desde cierto monto. León, Guanajuato."),
    "contacto": ("Contacto | Zapatillas May — León, Guanajuato",
                 "Contáctanos por WhatsApp y redes sociales. Zapatillas May, calzado de dama de mayoreo y menudeo en León, Guanajuato."),
    "tabla-tallas": ("Tabla de Tallas | Zapatillas May",
                     "Consulta la tabla de tallas de Zapatillas May para elegir tu medida correcta. Calzado de dama fabricado en León, Guanajuato."),
    "como-comprar": ("Cómo Comprar — Menudeo y Mayoreo | Zapatillas May",
                     "Guía paso a paso para comprar en Zapatillas May: menudeo y mayoreo desde 3 pares, formas de pago y envíos a todo México."),
    "privacidad": ("Aviso de Privacidad | Zapatillas May",
                   "Aviso de privacidad de Zapatillas May. Conoce cómo protegemos y usamos tus datos personales."),
}


@router.get("/seo/pagina/{slug}")
def pagina_ssr(slug: str):
    """Sirve index.html con título/descripción/canónica propios por ruta (categorías
    y páginas fijas). A prueba de fallos: si algo falla, cae al index.html normal."""
    _ck_ssr = f"ssr_pagina_{slug}"
    _cached = cache_get(_ck_ssr)
    if _cached is not None:
        return HTMLResponse(content=_cached)

    titulo, desc = _PAGINAS_SEO.get(slug, (_HOME_TITLE, _HOME_DESC))

    template = cache_get("tpl_index_html")
    if template is None:
        try:
            req = urllib.request.Request(
                "https://zapatillasmay.mx/index.html",
                headers={"User-Agent": "ZapatillasSSR/1.0"}
            )
            with urllib.request.urlopen(req, timeout=8) as r:
                template = r.read().decode("utf-8")
            cache_set("tpl_index_html", template, ttl=3600)
        except Exception:
            template = None

    if not template:
        # No se pudo obtener la plantilla: caer al archivo estático (no genera bucle)
        return RedirectResponse(url="https://zapatillasmay.mx/index.html", status_code=302)

    try:
        canonical = f"https://zapatillasmay.mx/{slug}"
        template = template.replace(f"<title>{_HOME_TITLE}</title>", f"<title>{_esc_pagina(titulo)}</title>")
        template = template.replace(f'content="{_HOME_DESC}"', f'content="{_esc_pagina(desc)}"')
        template = template.replace(
            '<link rel="canonical" href="https://zapatillasmay.mx/">',
            f'<link rel="canonical" href="{canonical}">'
        )
        template = template.replace(
            'content="Zapatillas May | Calzado de Moda Mayoreo y Menudeo — León, Guanajuato"',
            f'content="{_esc_pagina(titulo)}"'
        )  # og:title si comparte el texto del title
    except Exception as e:
        print(f"[seo] pagina_ssr replace error ({slug}): {e}")

    cache_set(_ck_ssr, template, ttl=900)  # 15 min
    return HTMLResponse(content=template)


def _esc_pagina(s):
    return _html.escape(str(s or ""), quote=True)


# ── Título descriptivo para los feeds de Shopping (Google/Meta/TikTok) ─────────
# Mantiene el CÓDIGO interno al inicio (así se sigue localizando el modelo en el
# panel) y le añade tipo, tacón, altura y material a partir de los datos del alta.
# No modifica el campo `nombre` en la base de datos.
_TIPO_SINGULAR = {
    "tacones": "Tacón", "sandalias": "Sandalia", "botas": "Bota",
    "botines": "Botín", "flats": "Flat", "plataformas": "Plataforma",
    "tenis": "Tenis", "nina": "Calzado niña", "accesorios": "Accesorio",
}


def _cap(s):
    """Primera letra mayúscula, resto minúsculas (normaliza 'SINTETICO ' → 'Sintetico')."""
    s = (s or "").strip()
    return (s[:1].upper() + s[1:].lower()) if s else ""


def _titulo_feed(p):
    codigo = (p.get("nombre") or p.get("sku_interno") or "").strip()
    cat = (p.get("categoria") or "").strip().lower()
    tipo = _TIPO_SINGULAR.get(cat) or (_cap(p.get("categoria")) or "Calzado")
    partes = [codigo, tipo, "de dama"]

    # Tacón: tipo (aguja, bloque, …) + altura en cm
    heel = []
    tt = (p.get("tipo_tacon") or "").strip()
    if tt:
        heel.append(tt)
    alt = p.get("altura_tacon")
    try:
        if alt and float(alt) > 0:
            f = float(alt)
            heel.append(f"{int(f) if f == int(f) else f} cm")
    except Exception:
        pass
    if heel:
        hs = " ".join(heel).lower()
        # Evita repetir la palabra "tacón" cuando la categoría ya es Tacón
        partes.append(hs if cat == "tacones" else f"tacón {hs}")

    mat = (p.get("material") or "").strip()
    if mat:
        partes.append(mat.lower())

    titulo = re.sub(r"\s+", " ", " ".join(partes)).strip()
    return titulo[:150]


_ENVIO_DEFAULTS = {"tier1": 99, "tier2": 150, "tier3": 199, "gratis_desde": 1299}

@router.get("/config/envio")
def get_config_envio():
    """Devuelve configuración de envío escalonada por pares."""
    cached = cache_get("config_envio")
    if cached is not None:
        return cached
    try:
        rows = supabase_get("configuracion?clave=like.envio_*&select=clave,valor")
        cfg = dict(_ENVIO_DEFAULTS)
        for r in rows:
            clave = r["clave"].replace("envio_", "")
            try:
                cfg[clave] = float(r["valor"])
            except Exception:
                cfg[clave] = r["valor"]
        cache_set("config_envio", cfg, ttl=300)
        return cfg
    except Exception:
        return _ENVIO_DEFAULTS

@router.post("/config/envio")
def save_config_envio(datos: dict):
    """Guarda configuración de envío desde el panel."""
    try:
        for campo in ["tier1", "tier2", "tier3", "gratis_desde"]:
            if campo not in datos:
                continue
            clave = f"envio_{campo}"
            valor = str(datos[campo])
            existente = supabase_get(f"configuracion?clave=eq.{clave}")
            if existente:
                supabase_patch(f"configuracion?clave=eq.{clave}", {"valor": valor})
            else:
                supabase_post("configuracion", {"clave": clave, "valor": valor})
        cache_invalidate_prefix("config_envio")
        return {"ok": True}
    except Exception as e:
        return {"error": str(e)}


@router.get("/sitemap.xml")
def sitemap():
    cached = cache_get("seo_sitemap")
    if cached is not None:
        return Response(content=cached, media_type="application/xml")
    try:
        productos = supabase_get("productos?activo=eq.true&select=id,slug,sku_interno,updated_at,imagen_principal,nombre,meta_titulo,categoria")
        categorias = list(set([p.get('categoria','') for p in supabase_get("productos?activo=eq.true&select=categoria") if p.get('categoria')]))
        # Mapeo de categoría → URL limpia
        _CAT_SLUG = {
            "tacones": "tacones", "sandalias": "sandalias", "botas": "botas",
            "botines": "botines", "flats": "flats", "plataformas": "plataformas",
            "tenis": "tenis", "nina": "nina", "accesorios": "accesorios"
        }
        urls = [
            'https://zapatillasmay.mx/',
            'https://zapatillasmay.mx/mayoreo',
            'https://zapatillasmay.mx/nosotros',
            'https://zapatillasmay.mx/envios',
            'https://zapatillasmay.mx/contacto',
            'https://zapatillasmay.mx/privacidad',
            'https://zapatillasmay.mx/politica-de-devoluciones',
            'https://zapatillasmay.mx/tabla-tallas',
            'https://zapatillasmay.mx/como-comprar',
        ]
        for cat in categorias:
            slug_cat = _CAT_SLUG.get(cat.lower(), cat.lower())
            urls.append(f'https://zapatillasmay.mx/{slug_cat}')
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += ('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
                'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n')
        # URLs sin imagen (home, categorías, páginas fijas)
        for url in urls:
            xml += f'  <url>\n    <loc>{url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n'
        # URLs de producto, cada una con su imagen (SEO de imágenes para Google)
        for p in productos:
            slug = p.get('sku_interno') or p.get('id', '')
            if not slug:
                continue
            loc = f'https://zapatillasmay.mx/producto/{slug}'
            xml += f'  <url>\n    <loc>{loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n'
            img = (p.get('imagen_principal') or '').strip()
            if img:
                img_esc = _html.escape(img, quote=True)
                # Título de imagen descriptivo: usa el SEO generado; si no, nombre + categoría
                titulo_base = (p.get('meta_titulo') or '').strip()
                if not titulo_base:
                    titulo_base = f"{(p.get('nombre') or '').strip()} {(p.get('categoria') or '').strip()}".strip()
                titulo_base = (titulo_base or 'Zapatillas May')[:200]
                titulo_img = _html.escape(titulo_base, quote=True)
                xml += (f'    <image:image>\n      <image:loc>{img_esc}</image:loc>\n'
                        f'      <image:title>{titulo_img}</image:title>\n    </image:image>\n')
            xml += '  </url>\n'
        xml += '</urlset>'
        cache_set("seo_sitemap", xml, ttl=TTL_FEEDS)
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

@router.get("/robots.txt")
def robots():
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "# Agentes de IA permitidos\n"
        "User-agent: GPTBot\nAllow: /\n"
        "User-agent: OAI-SearchBot\nAllow: /\n"
        "User-agent: ChatGPT-User\nAllow: /\n"
        "User-agent: PerplexityBot\nAllow: /\n"
        "User-agent: ClaudeBot\nAllow: /\n"
        "User-agent: Claude-Web\nAllow: /\n"
        "User-agent: Google-Extended\nAllow: /\n"
        "User-agent: Applebot-Extended\nAllow: /\n"
        "User-agent: Amazonbot\nAllow: /\n"
        "User-agent: Bytespider\nAllow: /\n"
        "\n"
        "Sitemap: https://zapatillasmay.mx/sitemap.xml\n"
        "# Indice IA: https://zapatillasmay.mx/llms.txt\n"
    )
    return Response(
        content=content,
        media_type="text/plain; charset=utf-8",
        headers={"Cache-Control": "public, max-age=300, s-maxage=300"}
    )


@router.get("/llms.txt")
def llms_txt():
    """Índice para agentes de IA (estándar llms.txt)."""
    cached = cache_get("seo_llms")
    if cached is not None:
        return Response(content=cached, media_type="text/plain; charset=utf-8")
    try:
        categorias = sorted(set(
            p.get("categoria", "") for p in supabase_get("productos?activo=eq.true&select=categoria")
            if p.get("categoria")
        ))
        total = supabase_get("productos?activo=eq.true&select=id")
        n = len(total) if isinstance(total, list) else 0

        lineas = [
            "# Zapatillas May",
            "",
            "> Tienda de calzado femenino de moda fabricado en León, Guanajuato, México. "
            "Venta a mayoreo (desde 3 pares, sin registro especial) y menudeo. "
            "Tacones, sandalias, botas, botines, flats, plataformas y más. Envíos a todo México. "
            "Precios de mayoreo automáticos: a más pares, mejor precio por par.",
            "",
            f"Catálogo con {n} modelos activos, siempre actualizado desde el inventario en tiempo real.",
            "",
            "## Acceso de agentes de IA (MCP)",
            "",
            "Este sitio expone un servidor MCP (Model Context Protocol) para que los agentes de IA "
            "consulten el catálogo, stock y datos del negocio en tiempo real, sin scraping.",
            "",
            "- **Punto de conexión MCP:** https://zapatillasmay.mx/mcp",
            "- **Protocolo:** JSON-RPC 2.0 sobre HTTP. No requiere autenticación (solo información pública).",
            "",
            "### Herramientas MCP disponibles",
            "- `buscar_productos`: busca calzado por nombre, categoría o características. Devuelve precios y enlaces.",
            "- `consultar_producto`: detalle de un modelo con colores, tallas y stock en tiempo real.",
            "- `precios_mayoreo`: explica los descuentos automáticos por volumen.",
            "- `info_negocio`: datos del negocio, ubicación, envíos y cómo comprar.",
            "",
            "## Catálogo y datos",
            "- [Feed de productos (JSON)](https://zapatillasmay.mx/feed.json): catálogo completo con nombre, precios (menudeo y mayoreo), categoría, tallas, **colores disponibles** e imágenes por color.",
            "- [Sitemap](https://zapatillasmay.mx/sitemap.xml): todas las URLs del sitio.",
            "",
            "## Categorías",
        ]
        _CAT_SLUG = {
            "tacones": "tacones", "sandalias": "sandalias", "botas": "botas",
            "botines": "botines", "flats": "flats", "plataformas": "plataformas",
            "tenis": "tenis", "nina": "nina", "accesorios": "accesorios"
        }
        for cat in categorias:
            slug = _CAT_SLUG.get(cat.lower(), cat.lower())
            lineas.append(f"- [{cat.capitalize()}](https://zapatillasmay.mx/{slug})")
        lineas += [
            "",
            "## Precios de mayoreo",
            "- 1-2 pares: precio de menudeo (precio normal al público).",
            "- 3-5 pares: precio de mayoreo — $80 MXN menos por par vs. menudeo.",
            "- 6-11 pares: mejor precio de mayoreo — $150 MXN menos por par vs. menudeo.",
            "- 12+ pares (corrida completa): precio máximo mayoreo — $180 MXN menos por par vs. menudeo.",
            "- El descuento se aplica automáticamente al agregar pares al carrito, sin registro ni código especial.",
            "- Ejemplo: si un modelo vale $650 menudeo, a 3 pares cuesta $570/par, a 6+ cuesta $500/par.",
            "",
            "## Qué pueden hacer los agentes de IA",
            "- Buscar y recomendar modelos del catálogo.",
            "- Consultar disponibilidad (color, talla, pares en stock) en tiempo real.",
            "- Explicar precios de mayoreo y cómo comprar.",
            "- Dirigir al cliente a la página del producto para completar la compra.",
            "",
            "## Información",
            "- [Cómo comprar a mayoreo](https://zapatillasmay.mx/mayoreo)",
            "- [Envíos](https://zapatillasmay.mx/envios)",
            "- [Nosotros](https://zapatillasmay.mx/nosotros)",
            "",
            "## Contacto",
            "- Sitio: https://zapatillasmay.mx",
            "- WhatsApp y pedidos en línea disponibles en el sitio.",
        ]
        contenido = "\n".join(lineas) + "\n"
        cache_set("seo_llms", contenido, ttl=TTL_FEEDS)
        return Response(content=contenido, media_type="text/plain; charset=utf-8",
                        headers={"Cache-Control": "public, max-age=600, s-maxage=600"})
    except Exception as e:
        return Response(content=str(e), status_code=500)


@router.get("/feed.json")
def feed_json():
    """Feed de productos para agentes de IA y motores de compra. Incluye variantes (colores, tallas, fotos)."""
    cached = cache_get("seo_feed")
    if cached is not None:
        return Response(content=cached, media_type="application/json; charset=utf-8")
    try:
        productos = supabase_get(
            "productos?activo=eq.true&select=id,nombre,sku_interno,descripcion,categoria,"
            "precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,es_oferta,"
            "imagen_principal,material,tallas_disponibles,tipo_tacon,altura_tacon"
        )

        # Fetch all active variants + inventory in one call each, group by producto_id
        variantes_raw = supabase_get(
            "variantes?activa=eq.true&select=id,producto_id,color,color_hex,foto_url,talla"
        )
        inventario_raw = supabase_get(
            "inventario?select=variante_id,cantidad"
        )
        # Mapa inventario: variante_id -> cantidad
        inv_map: dict = {i["variante_id"]: (i.get("cantidad") or 0) for i in (inventario_raw or []) if i.get("variante_id")}

        # Agrupar variantes por producto_id
        variantes_map: dict = {}
        for v in (variantes_raw or []):
            pid = v.get("producto_id")
            if pid is None:
                continue
            if pid not in variantes_map:
                variantes_map[pid] = {"colores": {}, "tallas": set()}
            color = (v.get("color") or "").strip()
            talla = (v.get("talla") or "").strip()
            vid   = v.get("id")
            stock = inv_map.get(vid, 0)

            # Agrupar por color: {"negro": {"foto": ..., "hex": ..., "tallas": {"23": 5, "24": 3}}}
            if color:
                if color not in variantes_map[pid]["colores"]:
                    variantes_map[pid]["colores"][color] = {
                        "hex": v.get("color_hex"),
                        "foto": v.get("foto_url") or "",
                        "tallas": {}
                    }
                if talla and stock > 0:
                    variantes_map[pid]["colores"][color]["tallas"][talla] = stock
            if talla:
                variantes_map[pid]["tallas"].add(talla)

        items = []
        for p in productos:
            slug   = p.get("sku_interno") or p.get("id", "")
            pid    = p.get("id")
            es_oferta = p.get("es_oferta", False)
            base   = p.get("precio_menudeo")
            try:
                base_f = float(base) if base is not None else None
            except Exception:
                base_f = None

            # Precios correctos:
            # DB precio_menudeo = precio base (= mayoreo3). Menudeo display = base + 80 (salvo ofertas)
            menudeo_display = base_f if (es_oferta or base_f is None) else round(base_f + 80)
            def _precio(campo, descuento_vs_base):
                v = p.get(campo)
                try:
                    return float(v) if v is not None else (round(base_f - descuento_vs_base) if base_f else None)
                except Exception:
                    return None

            precios = {
                "menudeo":            menudeo_display,
                "mayoreo_3a5_pares":  _precio("precio_mayoreo3", 0),   # = base (ya es el precio mayoreo)
                "mayoreo_6mas_pares": _precio("precio_mayoreo6", 70),  # base - 70 = menudeo - 150
                "corrida_completa":   _precio("precio_corrida",  100), # base - 100 = menudeo - 180
            }

            vdata  = variantes_map.get(pid, {})
            colores_dict = vdata.get("colores", {})
            tallas_var   = sorted(vdata.get("tallas", set()))

            # Tallas: preferir las de variantes activas sobre el campo texto del producto
            tallas_final = tallas_var if tallas_var else (p.get("tallas_disponibles") or [])

            # Formato colores legible para LLMs:
            # [{"color": "negro", "hex": "#000", "foto": "...", "tallas_con_stock": {"23": 5, "24": 2}}]
            colores_list = [
                {
                    "color": c,
                    "hex":   d.get("hex"),
                    "foto":  d.get("foto"),
                    "tallas_con_stock": d.get("tallas", {}),
                }
                for c, d in colores_dict.items()
            ]

            items.append({
                "id":        pid,
                "sku":       p.get("sku_interno"),
                "nombre":    _titulo_feed(p),
                "descripcion": (p.get("descripcion") or "").strip(),
                "categoria": p.get("categoria"),
                "material":  p.get("material"),
                "tallas_disponibles": tallas_final,
                "colores":   colores_list,
                "precios_mxn": precios,
                "moneda":    "MXN",
                "imagen":    p.get("imagen_principal"),
                "url":       f"https://zapatillasmay.mx/producto/{slug}" if slug else None,
                "disponibilidad": "in_stock" if colores_list else "available",
            })

        salida = {
            "tienda": "Zapatillas May",
            "descripcion": "Calzado femenino de moda fabricado en León, Guanajuato. Mayoreo y menudeo.",
            "url": "https://zapatillasmay.mx",
            "moneda": "MXN",
            "total_productos": len(items),
            "nota_mayoreo": (
                "El precio baja automáticamente según cuántos pares hay en el carrito: "
                "1-2 pares = menudeo; 3-5 pares = $80 menos/par; "
                "6-11 pares = $150 menos/par; 12+ pares (corrida) = $180 menos/par."
            ),
            "productos": items,
        }
        contenido = json.dumps(salida, ensure_ascii=False)
        cache_set("seo_feed", contenido, ttl=TTL_FEEDS)
        return Response(content=contenido, media_type="application/json; charset=utf-8",
                        headers={"Cache-Control": "public, max-age=600, s-maxage=600"})
    except Exception as e:
        return Response(content=json.dumps({"error": str(e)}), status_code=500, media_type="application/json")

@router.get("/seo/config")
def get_config():
    cached = cache_get("seo_config")
    if cached is not None:
        return cached
    try:
        data = supabase_get("configuracion_seo?select=clave,valor")
        cache_set("seo_config", data, ttl=TTL_ESTATICO)
        return data
    except Exception as e:
        return []

@router.post("/seo/config")
def save_config(datos: dict):
    try:
        for clave, valor in datos.items():
            existente = supabase_get(f"configuracion_seo?clave=eq.{clave}")
            if existente:
                supabase_patch(f"configuracion_seo?clave=eq.{clave}", {"valor": valor})
            else:
                supabase_post("configuracion_seo", {"clave": clave, "valor": valor})
        cache_invalidate_prefix("seo_")
        return {"ok": True}
    except Exception as e:
        return {"error": str(e)}

@router.get("/feed/meta.xml")
def feed_meta():
    cached = cache_get("feed_meta")
    if cached is not None:
        return Response(content=cached, media_type="application/xml")
    try:
        productos = supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,categoria,imagen_principal,slug,material,tipo_tacon,altura_tacon")
        variantes = supabase_get("variantes?activa=eq.true&select=id,producto_id,color,color_hex,foto_url,talla,imagenes")
        inventario = supabase_get("inventario?select=variante_id,cantidad")

        inv_por_variante = {}
        for i in inventario:
            inv_por_variante[i['variante_id']] = i.get('cantidad', 0)

        variantes_por_producto = {}
        for v in variantes:
            pid = v['producto_id']
            if pid not in variantes_por_producto:
                variantes_por_producto[pid] = []
            variantes_por_producto[pid].append(v)

        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n<channel>\n'
        xml += '<title>Zapatillas May</title>\n'
        xml += '<link>https://zapatillasmay.mx</link>\n'
        xml += '<description>Calzado de moda para dama. Leon, Guanajuato.</description>\n'

        for p in productos:
            sku = p.get('sku_interno') or p.get('id')
            url = f"https://zapatillasmay.mx/producto/{sku}"
            vars_prod = variantes_por_producto.get(p['id'], [])

            if vars_prod:
                # Agrupar por color para no repetir imágenes
                colores_vistos = {}
                for v in vars_prod:
                    color = v.get('color', '')
                    if color not in colores_vistos:
                        colores_vistos[color] = v

                for v in vars_prod:
                    color = (v.get('color', '') or '').strip()
                    talla = (v.get('talla', '') or '').strip()
                    cantidad = inv_por_variante.get(v['id'], 0)
                    availability = 'in stock' if cantidad > 0 else 'out of stock'

                    # Imagen principal del color
                    v_color = colores_vistos.get(color, v)
                    imagen = v_color.get('foto_url') or p.get('imagen_principal', '')

                    # Imágenes adicionales
                    imagenes_extra = v_color.get('imagenes') or []
                    if isinstance(imagenes_extra, list):
                        imagenes_extra = [img for img in imagenes_extra if img and img != imagen]
                    else:
                        imagenes_extra = []

                    titulo_base = _titulo_feed(p)
                    color_title = color.title()
                    # Limpiar color: quitar underscores sobrantes al inicio/fin
                    color_norm = color.replace(' ', '_').replace('/', '_').replace('-', '_').strip('_')
                    var_id = f"{sku}-{color_norm}-{talla}" if talla else f"{sku}-{color_norm}"
                    desc = (p.get("descripcion","") or p.get("nombre","")).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
                    color_encoded = color_norm
                    # Normalizar talla: vacío o None → "Única", "Unica" → "One Size
                    if not talla or str(talla).strip() == '':
                        talla_feed = 'Única'
                    elif talla in ('Unica', 'Única', 'unica', 'única'):
                        talla_feed = 'One Size'
                    else:
                        talla_feed = str(talla)
                    precio = (p.get("precio_menudeo") or 0) + 80

                    xml += '<item>\n'
                    xml += f'  <g:id>{var_id}</g:id>\n'
                    xml += f'  <g:item_group_id>{sku}</g:item_group_id>\n'
                    xml += f'  <g:title>{_html.escape(titulo_base + (" - " + color_title if color_title else ""), quote=True)}</g:title>\n'
                    xml += f'  <g:description>{desc}</g:description>\n'
                    xml += f'  <g:link>{url}?color={color_encoded}&amp;talla={talla}</g:link>\n'
                    xml += f'  <g:image_link>{imagen}</g:image_link>\n'
                    for img_extra in imagenes_extra[:9]:
                        xml += f'  <g:additional_image_link>{img_extra}</g:additional_image_link>\n'
                    xml += f'  <g:price>{precio} MXN</g:price>\n'
                    xml += f'  <g:availability>{availability}</g:availability>\n'
                    xml += f'  <g:quantity>{max(int(cantidad or 0), 0)}</g:quantity>\n'
                    xml += f'  <g:condition>new</g:condition>\n'
                    xml += f'  <g:brand>Zapatillas May</g:brand>\n'
                    xml += f'  <g:identifier_exists>no</g:identifier_exists>\n'
                    xml += f'  <g:google_product_category>187</g:google_product_category>\n'
                    xml += f'  <g:product_type>{p.get("categoria","Calzado")}</g:product_type>\n'
                    xml += f'  <g:color>{color}</g:color>\n'
                    xml += f'  <g:size>{talla_feed}</g:size>\n'
                    xml += f'  <g:size_system>MX</g:size_system>\n'
                    xml += f'  <g:size_type>regular</g:size_type>\n'
                    xml += f'  <g:size_chart>https://zapatillasmay.mx/tabla-tallas</g:size_chart>\n'
                    xml += f'  <g:gender>female</g:gender>\n'
                    xml += f'  <g:age_group>adult</g:age_group>\n'
                    xml += '</item>\n'

            else:
                imagen_p = p.get('imagen_principal', '')
                desc2 = (p.get("descripcion","") or p.get("nombre","")).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
                precio = (p.get("precio_menudeo") or 0) + 80
                xml += '<item>\n'
                xml += f'  <g:id>{sku}</g:id>\n'
                xml += f'  <g:title>{_html.escape(_titulo_feed(p), quote=True)}</g:title>\n'
                xml += f'  <g:description>{desc2}</g:description>\n'
                xml += f'  <g:link>{url}</g:link>\n'
                xml += f'  <g:image_link>{imagen_p}</g:image_link>\n'
                xml += f'  <g:price>{precio} MXN</g:price>\n'
                xml += f'  <g:availability>out of stock</g:availability>\n'
                xml += f'  <g:condition>new</g:condition>\n'
                xml += f'  <g:brand>Zapatillas May</g:brand>\n'
                xml += f'  <g:identifier_exists>no</g:identifier_exists>\n'
                xml += f'  <g:google_product_category>187</g:google_product_category>\n'
                xml += f'  <g:product_type>{p.get("categoria","Calzado")}</g:product_type>\n'
                xml += f'  <g:color>Multicolor</g:color>\n'
                xml += f'  <g:gender>female</g:gender>\n'
                xml += f'  <g:age_group>adult</g:age_group>\n'
                xml += f'  <g:size>One Size</g:size>\n'
                xml += f'  <g:size_system>MX</g:size_system>\n'
                xml += '</item>\n'

        xml += '</channel>\n</rss>'
        cache_set("feed_meta", xml, ttl=TTL_ESTATICO)
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

@router.get("/catalogo/listar")
def listar_catalogos():
    """Lista todos los catálogos accesibles con el token actual."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    if not wa_token:
        return {"error": "WHATSAPP_TOKEN no configurado"}
    results = {}
    # Listar catálogos del usuario/token
    for endpoint in [
        "me/product_catalogs?fields=id,name,vertical",
        "me?fields=businesses.limit(5){id,name,product_catalogs{id,name,vertical}}",
    ]:
        try:
            req = urllib.request.Request(
                f"https://graph.facebook.com/v21.0/{endpoint}",
                headers={"Authorization": f"Bearer {wa_token}"}
            )
            with urllib.request.urlopen(req, timeout=10) as r:
                results[endpoint] = json.loads(r.read())
        except urllib.error.HTTPError as e:
            results[endpoint] = {"error": json.loads(e.read().decode())}
        except Exception as e:
            results[endpoint] = {"error": str(e)}
    return results


@router.get("/catalogo/diagnostico")
def diagnostico_catalogo():
    """Verifica el catalog_id configurado y devuelve info del objeto Meta."""
    wa_token = os.environ.get("META_CATALOG_TOKEN") or os.environ.get("WHATSAPP_TOKEN", "")
    catalog_id = os.environ.get("WHATSAPP_CATALOG_ID", "844924814623850")
    waba_id = os.environ.get("WHATSAPP_WABA_ID", os.environ.get("WHATSAPP_BUSINESS_ACCOUNT_ID", os.environ.get("WABA_ID", "")))
    tiene_catalog_token = bool(os.environ.get("META_CATALOG_TOKEN"))
    results = {"catalog_id_env": catalog_id, "waba_id_env": waba_id, "usa_meta_catalog_token": tiene_catalog_token}
    if wa_token and catalog_id:
        try:
            req = urllib.request.Request(
                f"https://graph.facebook.com/v21.0/{catalog_id}?fields=id,name,type",
                headers={"Authorization": f"Bearer {wa_token}"}
            )
            with urllib.request.urlopen(req, timeout=8) as r:
                results["objeto_meta"] = json.loads(r.read())
        except urllib.error.HTTPError as e:
            results["objeto_meta_error"] = json.loads(e.read().decode())
        # Intentar listar catálogos del WABA si está disponible
        if waba_id:
            try:
                req = urllib.request.Request(
                    f"https://graph.facebook.com/v21.0/{waba_id}/product_catalogs?fields=id,name",
                    headers={"Authorization": f"Bearer {wa_token}"}
                )
                with urllib.request.urlopen(req, timeout=8) as r:
                    results["catalogos_waba"] = json.loads(r.read())
            except urllib.error.HTTPError as e:
                results["catalogos_waba_error"] = json.loads(e.read().decode())
    return results


@router.post("/catalogo/sincronizar-colecciones")
def sincronizar_colecciones():
    """Crea o actualiza los Product Sets (colecciones) en el catálogo de Meta por categoría."""
    # Usa META_CATALOG_TOKEN si existe (necesita catalog_management), si no intenta con WHATSAPP_TOKEN
    wa_token = os.environ.get("META_CATALOG_TOKEN") or os.environ.get("WHATSAPP_TOKEN", "")
    catalog_id = os.environ.get("WHATSAPP_CATALOG_ID", "844924814623850")
    if not wa_token or not catalog_id:
        return {"error": "Faltan variables META_CATALOG_TOKEN o WHATSAPP_CATALOG_ID"}

    categorias_fijas = ["Tacones", "Sandalias", "Botas", "Botines", "Flats", "Plataformas", "Tenis", "Calzado Niña", "Accesorios"]
    try:
        prods_cat = supabase_get("productos?activo=eq.true&select=categoria")
        categorias_bd = list(set([p.get("categoria","").strip() for p in prods_cat if p.get("categoria","").strip()]))
        categorias = list(set(categorias_fijas + categorias_bd))
    except:
        categorias = categorias_fijas

    try:
        req = urllib.request.Request(
            f"https://graph.facebook.com/v19.0/{catalog_id}/product_sets?fields=id,name&limit=100",
            headers={"Authorization": f"Bearer {wa_token}"}
        )
        with urllib.request.urlopen(req) as r:
            existing = json.loads(r.read())
        sets_existentes = {s["name"]: s["id"] for s in existing.get("data", [])}
    except:
        sets_existentes = {}

    resultados = []
    headers_api = {"Authorization": f"Bearer {wa_token}", "Content-Type": "application/json"}

    for cat in categorias:
        if not cat:
            continue
        filtro = {"product_type": {"i_contains": cat}}
        try:
            if cat in sets_existentes:
                set_id = sets_existentes[cat]
                body = json.dumps({"name": cat, "filter": filtro}).encode("utf-8")
                req = urllib.request.Request(
                    f"https://graph.facebook.com/v21.0/{set_id}",
                    data=body, headers=headers_api, method="POST"
                )
                with urllib.request.urlopen(req) as r:
                    r.read()
                resultados.append({"categoria": cat, "accion": "actualizada", "id": set_id})
            else:
                body = json.dumps({"name": cat, "filter": filtro}).encode("utf-8")
                req = urllib.request.Request(
                    f"https://graph.facebook.com/v21.0/{catalog_id}/product_sets",
                    data=body, headers=headers_api, method="POST"
                )
                with urllib.request.urlopen(req) as r:
                    res = json.loads(r.read())
                resultados.append({"categoria": cat, "accion": "creada", "id": res.get("id")})
        except urllib.error.HTTPError as e:
            body_err = e.read().decode("utf-8", errors="replace")
            resultados.append({"categoria": cat, "accion": "error", "detalle": body_err})
        except Exception as e:
            resultados.append({"categoria": cat, "accion": "error", "detalle": str(e)})

    return {"ok": True, "resultados": resultados}

@router.get("/feed/google.xml")
def feed_google():
    cached = cache_get("feed_google")
    if cached is not None:
        return Response(content=cached, media_type="application/xml")
    try:
        productos = supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,categoria,imagen_principal,slug,material,tipo_tacon,altura_tacon")
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">\n'
        for p in productos:
            sku = p.get('sku_interno') or p.get('id')
            url = f"https://zapatillasmay.mx/producto/{sku}"
            xml += '<entry>\n'
            xml += f'  <g:id>{sku}</g:id>\n'
            xml += f'  <g:title>{_html.escape(_titulo_feed(p), quote=True)}</g:title>\n'
            xml += f'  <g:description>{p.get("descripcion","") or p.get("nombre","")}</g:description>\n'
            xml += f'  <g:link>{url}</g:link>\n'
            xml += f'  <g:image_link>{p.get("imagen_principal","")}</g:image_link>\n'
            xml += f'  <g:price>{(p.get("precio_menudeo") or 0) + 80} MXN</g:price>\n'
            xml += f'  <g:availability>in stock</g:availability>\n'
            xml += f'  <g:condition>new</g:condition>\n'
            xml += f'  <g:brand>Zapatillas May</g:brand>\n'
            xml += f'  <g:identifier_exists>no</g:identifier_exists>\n'
            xml += f'  <g:google_product_category>187</g:google_product_category>\n'
            xml += f'  <g:product_type>{p.get("categoria","Calzado")}</g:product_type>\n'
            xml += f'  <g:color>Multicolor</g:color>\n'
            xml += f'  <g:gender>female</g:gender>\n'
            xml += f'  <g:age_group>adult</g:age_group>\n'
            xml += f'  <g:size>One Size</g:size>\n'
            xml += f'  <g:size_system>MX</g:size_system>\n'
            xml += '</entry>\n'
        xml += '</feed>'
        cache_set("feed_google", xml, ttl=TTL_ESTATICO)
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

@router.get("/feed/tiktok.json")
def feed_tiktok():
    try:
        productos = supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,categoria,imagen_principal,slug,material,tipo_tacon,altura_tacon")
        items = []
        for p in productos:
            sku = p.get('sku_interno') or p.get('id')
            items.append({
                "sku_id": sku,
                "title": _titulo_feed(p),
                "description": p.get("descripcion","") or p.get("nombre",""),
                "availability": "in stock",
                "condition": "new",
                "price": f"{(p.get('precio_menudeo') or 0) + 80} MXN",
                "link": f"https://zapatillasmay.mx/producto/{sku}",
                "image_link": p.get("imagen_principal",""),
                "brand": "Zapatillas May",
                "google_product_category": "187"
            })
        return {"items": items}
    except Exception as e:
        return {"error": str(e)}


@router.get("/tiktok/import-excel")
def tiktok_import_excel():
    """Genera CSV listo para importar al TikTok Shop Seller Center."""
    try:
        import csv

        productos  = supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,imagen_principal")
        variantes  = supabase_get("variantes?activa=eq.true&select=id,producto_id,color,foto_url,talla")
        inventario = supabase_get("inventario?select=variante_id,cantidad")

        inv = {i["variante_id"]: int(i.get("cantidad", 0) or 0) for i in inventario}

        vars_por_prod = {}
        for v in variantes:
            vars_por_prod.setdefault(v["producto_id"], []).append(v)

        buf = io.StringIO()
        writer = csv.writer(buf)

        headers = [
            "SPU", "SKU", "Titulo", "Alias",
            "Variante1", "Valor Variante1",
            "Variante2", "Valor Variante2",
            "Variante3", "Valor Variante3",
            "Variante4", "Valor Variante4",
            "Variante5", "Valor Variante5",
            "Precio", "Costo", "Cantidad",
            "Anaquel", "Codigo Barras", "Imagen",
            "Peso g", "Largo cm", "Ancho cm", "Alto cm", "Enlace Proveedor"
        ]
        writer.writerow(headers)

        for p in productos:
            pid    = p["id"]
            spu    = (p.get("sku_interno") or str(pid))[:200]
            title  = (p.get("nombre") or spu)[:500]
            precio = float(p.get("precio_menudeo") or 0) + 80
            img    = p.get("imagen_principal") or ""
            pvars  = vars_por_prod.get(pid, [])

            if not pvars:
                writer.writerow([
                    spu, f"{spu}-UNICA", title, "",
                    "Color", "Unico", "Talla", "Unica",
                    "", "", "", "", "", "",
                    precio, "", 0, "", "", img,
                    1000, 30, 20, 10, ""
                ])
                continue

            imagen_por_color = {}
            for v in pvars:
                color = (v.get("color") or "Unico").strip()
                if color not in imagen_por_color:
                    imagen_por_color[color] = v.get("foto_url") or img

            for v in pvars:
                color    = (v.get("color") or "Unico").strip()
                talla    = str(v.get("talla") or "Unica").strip()
                imagen   = imagen_por_color.get(color) or img
                cantidad = inv.get(v["id"], 0)
                color_sku = re.sub(r"[^A-Za-z0-9]", "", color.upper())[:20]
                talla_sku = re.sub(r"[^A-Za-z0-9]", "", talla)[:10]
                sku_cell  = f"{spu}-{color_sku}-{talla_sku}"[:200]
                writer.writerow([
                    spu, sku_cell, title, "",
                    "Color", color, "Talla", talla,
                    "", "", "", "", "", "",
                    precio, "", cantidad, "", "", imagen,
                    1000, 30, 20, 10, ""
                ])

        csv_bytes = buf.getvalue().encode("utf-8-sig")  # utf-8-sig = BOM para Excel
        return Response(
            content=csv_bytes,
            media_type="text/csv; charset=utf-8",
            headers={"Content-Disposition": "attachment; filename=TikTok_Import_ZapatillasMay.csv"}
        )
    except Exception as e:
        return Response(content=str(e), status_code=500)


@router.get("/tiktok/stock-excel")
def tiktok_stock_excel():
    """Genera CSV de reabastecimiento de stock para TikTok Shop."""
    try:
        import csv

        variantes  = supabase_get("variantes?activa=eq.true&select=id,producto_id,color,talla")
        productos  = supabase_get("productos?activo=eq.true&select=id,sku_interno,nombre")
        inventario = supabase_get("inventario?select=variante_id,cantidad")

        inv      = {i["variante_id"]: int(i.get("cantidad", 0) or 0) for i in inventario}
        prod_map = {p["id"]: p for p in productos}

        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(["SKU Vendedor", "Producto", "Color", "Talla", "Cantidad", "Notas"])

        for v in variantes:
            p        = prod_map.get(v["producto_id"], {})
            spu      = (p.get("sku_interno") or str(v["producto_id"]))[:200]
            color    = (v.get("color") or "Unico").strip()
            talla    = str(v.get("talla") or "Unica").strip()
            color_sku = re.sub(r"[^A-Za-z0-9]", "", color.upper())[:20]
            talla_sku = re.sub(r"[^A-Za-z0-9]", "", talla)[:10]
            sku_cell  = f"{spu}-{color_sku}-{talla_sku}"[:200]
            cantidad  = inv.get(v["id"], 0)
            writer.writerow([sku_cell, p.get("nombre", ""), color, talla, cantidad, ""])

        csv_bytes = buf.getvalue().encode("utf-8-sig")
        return Response(
            content=csv_bytes,
            media_type="text/csv; charset=utf-8",
            headers={"Content-Disposition": "attachment; filename=TikTok_Stock_ZapatillasMay.csv"}
        )
    except Exception as e:
        return Response(content=str(e), status_code=500)