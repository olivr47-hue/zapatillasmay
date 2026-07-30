from fastapi import APIRouter, Request
from fastapi.responses import Response, StreamingResponse, RedirectResponse, HTMLResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch
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


def _sin_oferta_interna(productos: list) -> list:
    """Filtra del feed los modelos de uso interno (lotes "OFERTA250", "OFERTA200",
    etc.) -- existen en el ERP para otros canales pero no deben indexarse ni
    anunciarse en Google/Meta/TikTok/sitemap."""
    def _es_oferta(p):
        return re.match(r"^oferta", (p.get("nombre") or ""), re.I) or re.match(r"^oferta", (p.get("sku_interno") or ""), re.I)
    return [p for p in productos if not _es_oferta(p)]


def _img_web(url: str, w: int) -> str:
    """Optimiza imágenes de Cloudinary para la web (ancho específico, auto formato y calidad)."""
    u = (url or "").strip()
    if not u or "res.cloudinary.com" not in u or "/upload/" not in u:
        return u
    if "/upload/f_auto" in u or ",f_auto" in u:
        return u
    cabeza, _, cola = u.partition("/upload/")
    return f"{cabeza}/upload/w_{w},f_auto,q_auto/{cola}"


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
def producto_ssr(sku: str, request: Request):
    """Sirve producto.html con meta tags y datos del producto pre-inyectados para indexación SEO."""
    try:
        return _producto_ssr_inner(sku, request)
    except Exception as e:
        print(f"[seo] producto_ssr crash sku={sku}: {e}")
        return RedirectResponse(url="https://zapatillasmay.mx/", status_code=302)


def _producto_ssr_inner(sku: str, request: Request):
    # 0. Caché del HTML ya armado (baja el TTFB). El JS del navegador re-carga
    #    stock/precio en vivo, así que cachear el SSR no muestra datos viejos al cliente.
    _ck_ssr = f"ssr_prod_{sku}"
    _cached = cache_get(_ck_ssr)
    if _cached is not None:
        return HTMLResponse(content=_cached)
    # 1. Buscar producto por slug (URL amigable para SEO) → SKU (links viejos
    #    ya compartidos/indexados) → id, solo si parece UUID (evita 400 de PostgREST)
    import re as _re
    datos = supabase_get(f"productos?slug=eq.{sku}&activo=eq.true&limit=1")
    if not datos:
        datos = supabase_get(f"productos?sku_interno=eq.{sku}&activo=eq.true&limit=1")
    if not datos and _re.match(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', sku, _re.I):
        try:
            datos = supabase_get(f"productos?id=eq.{sku}&activo=eq.true&limit=1")
        except Exception:
            datos = None
    if not datos:
        return RedirectResponse(url="https://zapatillasmay.mx/", status_code=302)

    p = datos[0]

    # Redirect 301 a la URL canonica (slug) si se pidio por SKU/id viejo -- consolida
    # el indice de Google mas rapido que solo el <link rel=canonical> y hace que las
    # visitas reales (y por lo tanto GA4) ya se registren bajo la URL con slug.
    slug_prod = (p.get("slug") or "").strip()
    if slug_prod and sku != slug_prod:
        query = str(request.url.query)
        destino = f"https://zapatillasmay.mx/producto/{slug_prod}"
        if query:
            destino += f"?{query}"
        return RedirectResponse(url=destino, status_code=301)

    nombre    = (p.get("nombre") or "Calzado").strip()
    meta_titulo = (p.get("meta_titulo") or "").strip()
    meta_desc   = (p.get("meta_descripcion") or "").strip()
    palabras    = (p.get("palabras_clave") or "").strip()
    desc_raw  = (p.get("descripcion") or nombre).strip()
    desc      = (meta_desc or desc_raw)[:160]
    sku_canon = (p.get("sku_interno") or sku).strip()

    # Armar título SEO robusto entre 30 y 60 caracteres y con SKU único para evitar duplicados
    prefix = nombre
    if meta_titulo:
        parts = meta_titulo.split(' | ', 1)
        db_prefix = parts[0].strip()
        if len(db_prefix) > 3:
            prefix = db_prefix

    if sku_canon.lower() not in prefix.lower():
        prefix = f"{prefix} {sku_canon}"

    titulo_seo = f"{prefix} | Zapatillas May"

    if len(titulo_seo) > 60:
        allowed_prefix_len = 60 - len(" | Zapatillas May")
        if prefix.endswith(sku_canon):
            desc_part = prefix[:-len(sku_canon)].strip()
            max_desc_len = allowed_prefix_len - len(sku_canon) - 1
            if max_desc_len > 5:
                desc_part = desc_part[:max_desc_len].strip()
                prefix = f"{desc_part} {sku_canon}"
            else:
                prefix = sku_canon
        else:
            prefix = prefix[:allowed_prefix_len].strip()
        titulo_seo = f"{prefix} | Zapatillas May"

    if len(titulo_seo) < 30:
        prefix = f"Calzado de Dama {prefix}"
        titulo_seo = f"{prefix} | Zapatillas May"
        if len(titulo_seo) < 30:
            prefix = f"{prefix} León GTO"
            titulo_seo = f"{prefix} | Zapatillas May"

    precio    = (p.get("precio_menudeo") or 0)
    precio_display = precio if p.get("es_oferta") else precio + 80
    imagen    = p.get("imagen_principal") or ""
    categoria = (p.get("categoria") or "calzado").strip()
    # La URL canónica prioriza el slug (si existe) sobre el SKU -- sku_canon
    # se sigue usando tal cual para el título (sufijo de unicidad) y el JSON-LD
    # "sku", que deben mostrar el código real, no el slug.
    url_canonica = (p.get("slug") or sku_canon).strip()
    canonical = f"https://zapatillasmay.mx/producto/{url_canonica}"

    # Imágenes para SEO de imágenes (Google Images / Shopping): principal + variantes
    imagenes_seo = []
    if imagen:
        imagenes_seo.append(imagen)
    try:
        variantes = supabase_get(
            f"variantes?producto_id=eq.{p['id']}&activa=eq.true&select=foto_url,imagenes,color"
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

    # Colores disponibles (contenido único por producto — combate el "contenido duplicado")
    colores = []
    _cseen = set()
    for v in (variantes or []):
        c = (v.get("color") or "").strip()
        if c and c.lower() not in _cseen:
            _cseen.add(c.lower())
            colores.append(c)

    # Descripción única generada con los atributos reales del producto.
    # Evita que 186 páginas compartan el mismo texto (causa de que Google elija otra canónica).
    _cat_txt = {
        "tacones": "Tacones", "sandalias": "Sandalias", "botas": "Botas",
        "botines": "Botines", "flats": "Flats", "plataformas": "Plataformas",
        "tenis": "Tenis", "nina": "Calzado para niña", "accesorios": "Accesorios",
    }.get(categoria, (categoria or "Calzado").capitalize())
    _det = []
    if p.get("altura_tacon"):
        _det.append(f"altura de tacón {p.get('altura_tacon')} cm")
    if p.get("tipo_tacon"):
        _det.append(f"tacón {str(p.get('tipo_tacon')).strip().lower()}")
    if p.get("material"):
        _det.append(f"corte {str(p.get('material')).strip().lower()}")
    _partes = [f"{nombre}.", f"{_cat_txt} para dama de Zapatillas May, fabricados en León, Guanajuato."]
    if _det:
        _partes.append("Con " + ", ".join(_det) + ".")
    if colores:
        _partes.append("Disponible en " + ", ".join(colores[:6]) + ".")
    _partes.append("Mayoreo automático desde 3 pares y envíos a todo México.")
    desc_unica = " ".join(_partes)
    # Meta description única: prioriza la del panel si es suficientemente larga; si no, usa la generada automáticamente
    desc = (meta_desc if (meta_desc and len(meta_desc) >= 130) else desc_unica)[:160]

    def _esc(s):
        return _html.escape(str(s or ""), quote=True)

    # 2. Obtener template producto.html (local o desde Vercel)
    cache_key = "tpl_producto_html"
    template  = cache_get(cache_key)
    if template is None:
        # Intentar cargar localmente primero para reducir TTFB (~1ms vs ~500ms)
        local_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "tienda", "producto.html"))
        if os.path.exists(local_path):
            try:
                with open(local_path, "r", encoding="utf-8") as f:
                    template = f.read()
                cache_set(cache_key, template, ttl=300)
            except Exception as e:
                print(f"[seo] Error leyendo producto.html local: {e}")

        if template is None:
            try:
                req = urllib.request.Request(
                    "https://zapatillasmay.mx/producto.html",
                    headers={"User-Agent": "ZapatillasSSR/1.0"}
                )
                with urllib.request.urlopen(req, timeout=8) as r:
                    template = r.read().decode("utf-8")
                cache_set(cache_key, template, ttl=300)
            except Exception as e:
                # Fallback: HTML mínimo con meta tags
                template = None


    # aggregateRating real desde reseñas de clientes (si existen)
    _rating_data = None
    try:
        _resenas = supabase_get(
            f"resenas_producto?producto_id=eq.{p['id']}&aprobada=eq.true&select=calificacion"
        )
        if _resenas and len(_resenas) >= 3:
            _vals = [float(r["calificacion"]) for r in _resenas if r.get("calificacion")]
            if _vals:
                _avg = round(sum(_vals) / len(_vals), 1)
                _rating_data = {
                    "@type": "AggregateRating",
                    "ratingValue": str(_avg),
                    "reviewCount": str(len(_vals)),
                    "bestRating": "5",
                    "worstRating": "1",
                }
    except Exception:
        pass

    # Costo de envío real (mismos valores configurables que usa el checkout) para
    # el shippingDetails del schema -- tarifa base de 1 par, la aplicable a
    # quien llega directo a esta ficha de producto.
    try:
        _envio_cfg = get_config_envio()
    except Exception:
        _envio_cfg = _ENVIO_DEFAULTS

    # JSON-LD del producto (con todas las imágenes) — generado de forma segura
    ld = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": titulo_seo.split(" | ")[0] if " | " in titulo_seo else titulo_seo,
        "image": imagenes_seo or ([imagen] if imagen else []),
        "description": (meta_desc or desc_raw)[:300],
        "sku": sku_canon,
        "brand": {"@type": "Brand", "name": "Zapatillas May"},
        "category": categoria,
        "offers": {
            "@type": "Offer",
            "url": canonical,
            "priceCurrency": "MXN",
            # precio_display = el precio real que se muestra y se cobra en la página
            # (precio_menudeo + $80 salvo ofertas). Usar "precio" a secas aquí
            # generaba un mismatch de $80 contra el precio real -- Merchant Center
            # y Rich Results lo detectan y pueden rechazar el listado por eso.
            "price": str(precio_display),
            "availability": "https://schema.org/InStock",
            "seller": {"@type": "Organization", "name": "Zapatillas May"},
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": str(_envio_cfg.get("tier1", 99)),
                    "currency": "MXN",
                },
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "MX",
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 0, "maxValue": 1, "unitCode": "DAY",
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1, "maxValue": 3, "unitCode": "DAY",
                    },
                },
            },
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "MX",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 30,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/ReturnShippingFees",
            },
        },
    }
    if _rating_data:
        ld["aggregateRating"] = _rating_data

    # BreadcrumbList para SERP
    _cat_slug = {
        "tacones": "tacones", "sandalias": "sandalias", "botas": "botas",
        "botines": "botines", "flats": "flats", "plataformas": "plataformas",
        "tenis": "tenis", "nina": "nina", "accesorios": "accesorios",
    }.get(categoria.lower(), categoria.lower())
    ld_breadcrumb = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Inicio",
             "item": "https://zapatillasmay.mx/"},
            {"@type": "ListItem", "position": 2, "name": categoria.capitalize(),
             "item": f"https://zapatillasmay.mx/{_cat_slug}"},
            {"@type": "ListItem", "position": 3, "name": nombre,
             "item": canonical},
        ]
    }
    ld_json = json.dumps(ld, ensure_ascii=False)
    ld_breadcrumb_json = json.dumps(ld_breadcrumb, ensure_ascii=False)

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

    # 3. Inyectar meta tags producto-específicos y optimización de LCP
    # OJO: antes buscaba el texto exacto "<title>Zapatillas May</title>", que
    # ya no existe en producto.html (el título por defecto cambió) -- el
    # replace() nunca hacía match y CADA página de producto se indexaba con
    # el título genérico en vez del título SEO específico. Con regex sobre
    # cualquier <title>...</title> ya no depende de que el texto por defecto
    # se mantenga idéntico.
    template = re.sub(
        r"<title>.*?</title>",
        f"<title>{_esc(titulo_seo)}</title>",
        template, count=1, flags=re.S
    )
    template = template.replace(
        'content="Calzado de moda para dama. León, Guanajuato."',
        f'content="{_esc(desc)}"'
    )

    # Pre-renderizar imagen principal en el HTML para evitar LCP retrasado
    if imagen:
        img_url_900 = _img_web(imagen, 900)
        img_url_500 = _img_web(imagen, 500)
        src_replacement = (
            f'src="{_esc(img_url_900)}" '
            f'srcset="{_esc(img_url_500)} 500w, {_esc(img_url_900)} 900w" '
            f'sizes="(max-width: 599px) 500px, 900px" '
            f'alt="{_esc(nombre)}"'
        )
        template = template.replace(
            'src="" alt="Imagen principal del producto"',
            src_replacement
        )

    image_preloads = ""
    if imagen:
        img_500 = _img_web(imagen, 500)
        img_900 = _img_web(imagen, 900)
        image_preloads = (
            f'\n  <link rel="preload" as="image" fetchpriority="high" href="{_esc(img_500)}" media="(max-width: 599px)">'
            f'\n  <link rel="preload" as="image" fetchpriority="high" href="{_esc(img_900)}" media="(min-width: 600px)">'
        )

    schema = f"""{image_preloads}
  <link rel="canonical" href="{canonical}">
  <meta name="keywords" content="{_esc(palabras)}">
  <meta property="og:title" content="{_esc(titulo_seo)}">
  <meta property="og:description" content="{_esc(desc)}">
  <meta property="og:image" content="{_esc(imagen)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:type" content="product">
  <meta property="product:price:amount" content="{_esc(str(precio_display))}">
  <meta property="product:price:currency" content="MXN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{_esc(titulo_seo)}">
  <meta name="twitter:image" content="{_esc(imagen)}">
  <script type="application/ld+json">{ld_json}</script>
  <script type="application/ld+json">{ld_breadcrumb_json}</script>
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
        # El contenido visible LIDERA con la descripción única (nombre+specs+colores),
        # luego la descripción original si aporta algo distinto. Así cada página tiene
        # contenido propio aunque varios productos compartan el texto base.
        _vis = [desc_unica]
        if desc_raw and desc_raw[:40].lower() not in desc_unica.lower():
            _vis.append(desc_raw)
        desc_visible = "</p><p>".join(_esc(x) for x in _vis)
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
        if colores:
            _add("Colores disponibles", ", ".join(colores))
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
                '<div class="info-card-body open" id="details-body"></div>',
                f'<div class="info-card-body open" id="details-body">{details_html}</div>'
            )
    except Exception as _e:
        print(f"[seo] No se pudo inyectar contenido server-side: {_e}")

    cache_set(_ck_ssr, template, ttl=900)  # 15 min
    return HTMLResponse(content=template)


# ── #3 — Títulos/descripciones únicos por categoría y páginas fijas (SSR) ──────
_HOME_TITLE = "Calzado de Dama Mayoreo y Menudeo en León | Zapatillas May"
_HOME_DESC = ("Calzado de dama con estilo, hecho en León, Gto. Pensado para sentirte bien, "
              "no solo lucir bien. Mayoreo automático desde 3 pares, sin registro. Envíos a todo México.")

# H1 SEO visibles para crawlers por categoría (el hero genérico no tiene keywords de categoría)
_PAGINAS_H1 = {
    "tacones":     "Tacones de Dama Mayoreo León Guanajuato — Aguja, Bloque y Plataforma | Zapatillas May",
    "sandalias":   "Sandalias de Dama Mayoreo León Guanajuato — Casuales y de Fiesta | Zapatillas May",
    "botas":       "Botas de Dama Mayoreo León Guanajuato — Moda y Calidad | Zapatillas May",
    "botines":     "Botines de Dama Mayoreo León Guanajuato — Botines de Moda | Zapatillas May",
    "flats":       "Flats y Zapatos Bajos de Dama Mayoreo León Guanajuato | Zapatillas May",
    "plataformas": "Plataformas de Dama Mayoreo León Guanajuato — Altura y Comodidad | Zapatillas May",
    "tenis":       "Tenis de Dama Mayoreo León Guanajuato — Moda Deportiva | Zapatillas May",
    "nina":        "Calzado para Niña Mayoreo León Guanajuato — Cómodo y Resistente | Zapatillas May",
    "accesorios":  "Accesorios de Moda Mayoreo León Guanajuato | Zapatillas May",
    "mayoreo":     "Mayoreo de Calzado Dama sin Mínimo desde 3 Pares — León Guanajuato | Zapatillas May",
    "ofertas":     "Ofertas de Calzado de Dama León Guanajuato — Precios Especiales | Zapatillas May",
}

_PAGINAS_SEO = {
    "tacones": ("Tacones de Dama — Mayoreo y Menudeo | Zapatillas May León",
                "Tacones de moda para dama fabricados en León, Guanajuato. Mayoreo desde 3 pares sin registro: aguja, bloque y plataforma. Envíos a todo México."),
    "sandalias": ("Sandalias de Dama — Mayoreo y Menudeo | Zapatillas May",
                  "Sandalias de moda para dama hechas en León, Guanajuato. Precios de mayoreo desde 3 pares, casuales y de fiesta. Envíos a todo México."),
    "botas": ("Botas de Dama — Mayoreo y Menudeo | Zapatillas May León",
              "Botas de moda para dama fabricadas en León, Guanajuato. Mayoreo desde 3 pares sin registro, en cuero y sintético. Envíos a todo México."),
    "botines": ("Botines de Dama — Mayoreo y Menudeo | Zapatillas May",
                "Botines de moda para dama hechos en León, Guanajuato. Precios de mayoreo desde 3 pares sin registro, los últimos estilos. Envíos a todo México."),
    "flats": ("Flats y Zapatos Bajos de Dama — Mayoreo | Zapatillas May",
              "Flats y zapatos bajos de dama, cómodos y de moda, fabricados en León, Guanajuato. Mayoreo desde 3 pares. Envíos a todo México."),
    "plataformas": ("Plataformas de Dama — Mayoreo y Menudeo | Zapatillas May",
                    "Plataformas de moda para dama hechas en León, Guanajuato. Altura con comodidad, mayoreo desde 3 pares. Envíos a todo México."),
    "tenis": ("Tenis de Dama — Mayoreo y Menudeo | Zapatillas May",
              "Tenis de moda para dama fabricados en León, Guanajuato. Mayoreo desde 3 pares sin registro, estilo urbano y deportivo. Envíos a todo México."),
    "nina": ("Calzado para Niña — Mayoreo y Menudeo | Zapatillas May",
             "Calzado de moda para niña fabricado en León, Guanajuato. Cómodo y resistente, mayoreo desde 3 pares. Envíos a todo México."),
    "accesorios": ("Accesorios — Zapatillas May León, Guanajuato",
                   "Accesorios para complementar tu look en Zapatillas May. Fabricado en León, Guanajuato. Mayoreo y menudeo con envíos a todo México."),
    "mayoreo": ("Mayoreo de Calzado desde 3 Pares | Zapatillas May",
                "Compra calzado de dama a precio de mayoreo desde 3 pares, sin registro especial. Fabricado en León, Guanajuato. Envíos a todo México."),
    "ofertas": ("Ofertas de Calzado de Dama | Zapatillas May",
                "Aprovecha las ofertas de calzado femenino de Zapatillas May: tacones, sandalias y más a precios especiales. Envíos a todo México."),
    "nosotros": ("Sobre Nosotras — Fábrica de Calzado | Zapatillas May",
                 "Conoce Zapatillas May, fabricante de calzado femenino de moda en León, Guanajuato. Calidad artesanal a precio de mayoreo y menudeo."),
    "envios": ("Envíos a todo México | Zapatillas May",
               "Información de envíos de Zapatillas May: cobertura nacional, tiempos y costos, con envío gratis desde cierto monto. León, Guanajuato."),
    "contacto": ("Contacto | Zapatillas May — León, Guanajuato",
                 "Contáctanos por WhatsApp, Instagram y redes sociales. Zapatillas May, fábrica de calzado de dama en León, Guanajuato. Mayoreo y menudeo."),
    "tabla-tallas": ("Tabla de Tallas | Zapatillas May",
                     "Consulta la tabla de tallas de Zapatillas May para elegir tu medida correcta. Calzado de dama fabricado en León, Guanajuato."),
    "como-comprar": ("Cómo Comprar — Menudeo y Mayoreo | Zapatillas May",
                     "Guía paso a paso para comprar en Zapatillas May: menudeo y mayoreo desde 3 pares, formas de pago y envíos a todo México."),
    "privacidad": ("Aviso de Privacidad | Zapatillas May",
                   "Aviso de privacidad de Zapatillas May. Conoce cómo recopilamos, protegemos y usamos tus datos personales conforme a la ley mexicana."),
    "politica-de-devoluciones": ("Política de Devoluciones — 30 Días | Zapatillas May",
                                  "Política de cambios y devoluciones de Zapatillas May: 30 días sin complicaciones. Conoce las condiciones y el proceso paso a paso."),
}


# Contenido HTML visible para Google en páginas informacionales (sin JS)
_PAGINAS_CONTENT = {
    "nosotros": """
<section style="max-width:800px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Sobre Zapatillas May</h2>
  <p style="color:#7a6055;margin-bottom:24px">Fabricante de calzado femenino en León, Guanajuato</p>
  <p>Somos una empresa familiar fabricante de calzado femenino de moda con sede en <strong>León, Guanajuato</strong>, la capital mundial del calzado. Llevamos años produciendo tacones, sandalias, botas, botines, flats y plataformas con materiales de calidad y diseños actuales.</p>
  <h2 style="font-size:1.2rem;margin-top:32px">Directo del fabricante</h2>
  <p>Al comprar en Zapatillas May adquieres calzado directamente de la fábrica, sin intermediarios. Eso nos permite ofrecerte precios competitivos tanto en menudeo como en <strong>mayoreo desde 3 pares</strong>, sin necesidad de registro ni mínimos absurdos.</p>
  <h2 style="font-size:1.2rem;margin-top:32px">Precios de mayoreo automáticos</h2>
  <ul style="padding-left:20px">
    <li>1–2 pares: precio de menudeo</li>
    <li>3–5 pares: $60 MXN menos por par</li>
    <li>6+ pares: $100 MXN menos por par</li>
  </ul>
  <p>El descuento se aplica automáticamente al agregar pares al carrito — sin códigos ni trámites.</p>
  <h2 style="font-size:1.2rem;margin-top:32px">Envíos a todo México</h2>
  <p>Enviamos a toda la República Mexicana por paquetería en 1 a 3 días hábiles. También realizamos envíos a <strong>Estados Unidos y Canadá</strong>.</p>
  <p style="margin-top:24px">Más de 2,400 pedidos enviados a clientes satisfechas en toda la República.</p>
</section>""",
    "contacto": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Contacto</h2>
  <p style="color:#7a6055;margin-bottom:24px">Zapatillas May — León, Guanajuato</p>
  <p>Estamos disponibles para atenderte por WhatsApp de lunes a sábado. Puedes escribirnos para preguntas sobre productos, tallas, pedidos al mayoreo o seguimiento de envíos.</p>
  <h2 style="font-size:1.2rem;margin-top:28px">WhatsApp</h2>
  <p>Escríbenos directo desde el botón de WhatsApp en la tienda o desde nuestras redes sociales.</p>
  <h2 style="font-size:1.2rem;margin-top:28px">Redes sociales</h2>
  <ul style="padding-left:20px">
    <li>Instagram: @zapatillasmay</li>
    <li>Facebook: Zapatillas May</li>
    <li>TikTok: @zapatillasmay</li>
  </ul>
  <h2 style="font-size:1.2rem;margin-top:28px">Ubicación</h2>
  <p>León, Guanajuato, México — la capital mundial del calzado.</p>
</section>""",
    "envios": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Información de Envíos</h2>
  <p style="color:#7a6055;margin-bottom:24px">Enviamos a toda la República Mexicana</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Costos de envío</h2>
  <ul style="padding-left:20px">
    <li><strong>1 par:</strong> $99 MXN</li>
    <li><strong>2–3 pares:</strong> $150 MXN</li>
    <li><strong>4 o más pares:</strong> $199 MXN</li>
    <li><strong>Envío gratis</strong> en pedidos de $1,299 MXN o más</li>
  </ul>
  <h2 style="font-size:1.2rem;margin-top:28px">Tiempo de entrega</h2>
  <p>Los pedidos se entregan en <strong>1 a 3 días hábiles</strong> en toda la República Mexicana. Los pedidos se procesan el mismo día si se realizan antes de las 2 pm (hora del centro).</p>
  <h2 style="font-size:1.2rem;margin-top:28px">Cobertura</h2>
  <p>Enviamos a todos los estados de México. También realizamos envíos internacionales a <strong>Estados Unidos y Canadá</strong> — consulta el costo por WhatsApp.</p>
  <h2 style="font-size:1.2rem;margin-top:28px">Seguimiento</h2>
  <p>Al confirmar tu pedido recibirás un correo con el número de guía para rastrear tu paquete en tiempo real.</p>
</section>""",
    "tabla-tallas": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Tabla de Tallas</h2>
  <p style="color:#7a6055;margin-bottom:24px">Calzado de dama — tallas mexicanas</p>
  <p>Nuestro calzado sigue la numeración mexicana estándar. Si tienes dudas sobre tu talla, escríbenos por WhatsApp y con gusto te ayudamos.</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Equivalencias de tallas</h2>
  <table style="width:100%;border-collapse:collapse;margin-top:12px">
    <thead><tr style="background:#f5ece2">
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">MX</th>
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">US</th>
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">EU</th>
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">CM</th>
    </tr></thead>
    <tbody>
      <tr><td style="padding:8px 12px;border:1px solid #e8d8cc">22</td><td style="padding:8px 12px;border:1px solid #e8d8cc">5</td><td style="padding:8px 12px;border:1px solid #e8d8cc">35</td><td style="padding:8px 12px;border:1px solid #e8d8cc">22</td></tr>
      <tr style="background:#fdf8f4"><td style="padding:8px 12px;border:1px solid #e8d8cc">23</td><td style="padding:8px 12px;border:1px solid #e8d8cc">6</td><td style="padding:8px 12px;border:1px solid #e8d8cc">36</td><td style="padding:8px 12px;border:1px solid #e8d8cc">23</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e8d8cc">24</td><td style="padding:8px 12px;border:1px solid #e8d8cc">7</td><td style="padding:8px 12px;border:1px solid #e8d8cc">37</td><td style="padding:8px 12px;border:1px solid #e8d8cc">24</td></tr>
      <tr style="background:#fdf8f4"><td style="padding:8px 12px;border:1px solid #e8d8cc">25</td><td style="padding:8px 12px;border:1px solid #e8d8cc">8</td><td style="padding:8px 12px;border:1px solid #e8d8cc">38</td><td style="padding:8px 12px;border:1px solid #e8d8cc">25</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e8d8cc">26</td><td style="padding:8px 12px;border:1px solid #e8d8cc">9</td><td style="padding:8px 12px;border:1px solid #e8d8cc">39</td><td style="padding:8px 12px;border:1px solid #e8d8cc">26</td></tr>
      <tr style="background:#fdf8f4"><td style="padding:8px 12px;border:1px solid #e8d8cc">27</td><td style="padding:8px 12px;border:1px solid #e8d8cc">10</td><td style="padding:8px 12px;border:1px solid #e8d8cc">40</td><td style="padding:8px 12px;border:1px solid #e8d8cc">27</td></tr>
    </tbody>
  </table>
  <p style="margin-top:16px;font-size:0.9rem;color:#7a6055">¿No encontras tu talla? Escríbenos — manejamos tallas especiales bajo pedido.</p>
</section>""",
    "como-comprar": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Cómo Comprar</h2>
  <p style="color:#7a6055;margin-bottom:24px">Menudeo y mayoreo sin complicaciones</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Paso a paso</h2>
  <ol style="padding-left:20px">
    <li style="margin-bottom:10px"><strong>Explora el catálogo</strong> — navega por categoría o usa el buscador para encontrar tu modelo.</li>
    <li style="margin-bottom:10px"><strong>Elige talla y color</strong> — selecciona la variante que quieras en la página del producto.</li>
    <li style="margin-bottom:10px"><strong>Agrega al carrito</strong> — el precio de mayoreo se aplica automáticamente al agregar 3 o más pares.</li>
    <li style="margin-bottom:10px"><strong>Elige tu forma de pago</strong> — tarjeta, SPEI, OXXO o MercadoPago.</li>
    <li style="margin-bottom:10px"><strong>Recibe en 1–3 días hábiles</strong> — con guía de rastreo por correo.</li>
  </ol>
  <h2 style="font-size:1.2rem;margin-top:28px">Formas de pago</h2>
  <ul style="padding-left:20px">
    <li>Tarjeta de crédito o débito (Visa, Mastercard, Amex)</li>
    <li>Transferencia SPEI</li>
    <li>Pago en efectivo en OXXO</li>
    <li>MercadoPago</li>
  </ul>
  <h2 style="font-size:1.2rem;margin-top:28px">Precios de mayoreo</h2>
  <p>El descuento de mayoreo es automático — no necesitas registro, RFC ni código especial. Solo agrega 3 o más pares al carrito y el precio baja solo.</p>
  <ul style="padding-left:20px">
    <li>3–5 pares: $60 MXN menos por par</li>
    <li>6+ pares: $100 MXN menos por par</li>
  </ul>
</section>""",
    "mayoreo": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <div style="background:linear-gradient(135deg,#E91E8C,#c8967a);border-radius:18px;padding:28px 26px;margin-bottom:32px;color:white;text-align:center">
    <p style="font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.85;margin:0 0 10px">¿Tienes zapatería o vendes por catálogo?</p>
    <p style="font-size:1.4rem;font-weight:800;margin:0 0 12px;line-height:1.3">Entra al Portal de Mayoristas</p>
    <p style="font-size:0.92rem;opacity:0.95;margin:0 0 20px;line-height:1.6">Ahí puedes descargar catálogos con fotos por categoría, armar tu corrida por talla y color, ver tus precios especiales y hacer tu pedido directo — todo desde tu celular.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:22px">
      <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.78rem;font-weight:600">📥 Catálogos por categoría</span>
      <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.78rem;font-weight:600">👟 Arma tu corrida</span>
      <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.78rem;font-weight:600">💰 Precios de mayoreo</span>
      <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.78rem;font-weight:600">📱 Pide desde tu celular</span>
    </div>
    <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" style="display:inline-block;background:white;color:#E91E8C;font-weight:800;text-decoration:none;padding:13px 32px;border-radius:100px;font-size:0.95rem">Entrar al portal de mayoristas →</a>
  </div>
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Mayoreo de Calzado — Sin Mínimo Absurdo</h2>
  <p style="color:#7a6055;margin-bottom:24px">Desde 3 pares, sin registro especial · León, Guanajuato</p>
  <p>En Zapatillas May puedes comprar a precio de mayoreo desde <strong>3 pares</strong>, sin necesidad de registro, RFC ni trámite especial: el descuento de 3 a 5 pares se aplica automáticamente en el carrito. Para precios de 6 pares en adelante, corrida completa y catálogo con fotos, regístrate gratis en el Portal de Mayoristas.</p>
  <h2 style="font-size:1.2rem;margin-top:28px">Ejemplo de precios de mayoreo</h2>
  <table style="width:100%;border-collapse:collapse;margin-top:12px">
    <thead><tr style="background:#f5ece2">
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">Cantidad</th>
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">Descuento por par</th>
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">Dónde</th>
    </tr></thead>
    <tbody>
      <tr><td style="padding:8px 12px;border:1px solid #e8d8cc">1–2 pares</td><td style="padding:8px 12px;border:1px solid #e8d8cc">Precio de menudeo</td><td style="padding:8px 12px;border:1px solid #e8d8cc">zapatillasmay.mx</td></tr>
      <tr style="background:#fdf8f4"><td style="padding:8px 12px;border:1px solid #e8d8cc">3–5 pares</td><td style="padding:8px 12px;border:1px solid #e8d8cc">−$60 MXN por par</td><td style="padding:8px 12px;border:1px solid #e8d8cc">zapatillasmay.mx (automático)</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e8d8cc">6+ pares</td><td style="padding:8px 12px;border:1px solid #e8d8cc">−$100 MXN por par</td><td style="padding:8px 12px;border:1px solid #e8d8cc">Portal de Mayoristas</td></tr>
      <tr style="background:#fdf8f4"><td style="padding:8px 12px;border:1px solid #e8d8cc">Corrida completa</td><td style="padding:8px 12px;border:1px solid #e8d8cc">−$180 MXN por par</td><td style="padding:8px 12px;border:1px solid #e8d8cc">Portal de Mayoristas</td></tr>
    </tbody>
  </table>
  <h2 style="font-size:1.2rem;margin-top:28px">¿Qué es una corrida?</h2>
  <p>Una corrida es un mismo modelo en todos los colores y tallas disponibles — ideal para revendedoras y tiendas. Al completar una corrida obtienes el mejor precio por par.</p>
  <div style="margin-top:28px;padding:22px 24px;background:linear-gradient(135deg,#fdf0f6,#fdf8f4);border:1px solid #f5c9e0;border-radius:14px;text-align:center">
    <p style="font-size:1.05rem;font-weight:700;margin:0 0 6px;color:#3a2e28">¿Buscas comprar por corrida completa?</p>
    <p style="margin:0 0 16px;color:#7a6055">Entra a nuestro Portal de Mayoristas: precios especiales, arma tu corrida por talla y color, descarga catálogos y haz tu pedido directo.</p>
    <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" style="display:inline-block;background:#E91E8C;color:white;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:100px">Entrar al portal de mayoristas →</a>
  </div>
  <h2 style="font-size:1.2rem;margin-top:28px">Sin registro para empezar</h2>
  <p>No necesitas cuenta especial ni autorización previa para comprar 3 a 5 pares a precio de mayoreo desde tu primer pedido en zapatillasmay.mx. Para precios de 6 pares en adelante y corridas completas, el registro en el Portal de Mayoristas es gratuito.</p>
</section>""",
    "privacidad": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Aviso de Privacidad</h2>
  <p style="color:#7a6055;margin-bottom:24px">Zapatillas May — León, Guanajuato</p>
  <p>En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), Zapatillas May informa lo siguiente:</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Responsable</h2>
  <p>Zapatillas May, con domicilio en León, Guanajuato, México, es responsable del tratamiento de tus datos personales.</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Datos que recopilamos</h2>
  <ul style="padding-left:20px">
    <li>Nombre completo</li>
    <li>Dirección de entrega</li>
    <li>Correo electrónico</li>
    <li>Número de teléfono</li>
  </ul>
  <h2 style="font-size:1.2rem;margin-top:24px">Finalidad</h2>
  <p>Tus datos se utilizan exclusivamente para procesar y entregar tu pedido, enviarte confirmaciones de compra y brindarte atención al cliente.</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Compartición de datos</h2>
  <p>No compartimos tu información con terceros, salvo con la empresa de paquetería necesaria para realizar tu envío y con el procesador de pagos para completar la transacción.</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Derechos ARCO</h2>
  <p>Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación u Oposición escribiéndonos por WhatsApp o a través de nuestras redes sociales.</p>
</section>""",
    "politica-de-devoluciones": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Política de Devoluciones</h2>
  <p style="color:#7a6055;margin-bottom:24px">30 días sin complicaciones</p>
  <p>En Zapatillas May aceptamos devoluciones y cambios dentro de los primeros <strong>30 días</strong> naturales a partir de la fecha de entrega.</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Condiciones</h2>
  <ul style="padding-left:20px">
    <li>El producto debe estar sin uso, en su estado original.</li>
    <li>Debe conservar la caja o empaque original.</li>
    <li>No aplica para productos marcados como "oferta final" o "liquidación".</li>
  </ul>
  <h2 style="font-size:1.2rem;margin-top:24px">Proceso</h2>
  <ol style="padding-left:20px">
    <li style="margin-bottom:8px">Contáctanos por WhatsApp dentro de los 30 días con tu número de pedido.</li>
    <li style="margin-bottom:8px">Te indicamos la dirección para el envío de devolución.</li>
    <li style="margin-bottom:8px">Una vez recibido el producto y verificado su estado, procesamos el cambio o reembolso en un plazo de 3 a 5 días hábiles.</li>
  </ol>
  <h2 style="font-size:1.2rem;margin-top:24px">Costo del envío de devolución</h2>
  <p>Si la devolución es por defecto de fabricación, cubrimos el costo del envío. Si es por cambio de talla u otra razón, el costo del envío corre por cuenta del cliente.</p>
</section>""",
}

_FAQS: dict[str, list[dict]] = {
    "tacones": [
        {"q": "¿Qué tipos de tacones venden?",
         "a": "Vendemos tacones de aguja, bloque, cuña, plataforma y kitten heel para dama, todos fabricados en León, Guanajuato. Contamos con modelos para oficina, eventos especiales y uso diario en una amplia variedad de colores y materiales."},
        {"q": "¿Puedo comprar tacones al mayoreo sin registro?",
         "a": "Sí. El mayoreo es automático desde 3 pares: no necesitas registro, RFC ni trámite especial. Con 3–5 pares el descuento es $60 MXN por par. El precio de 6 o más pares ($100 MXN por par) y de corrida completa (hasta $180 MXN por par) están disponibles solo en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿Qué tallas manejan en tacones?",
         "a": "La mayoría de nuestros modelos de tacones están disponibles en tallas del 22 al 27 (numeración mexicana), equivalentes a las tallas 5 a 10 US. Algunos modelos especiales pueden tener rango reducido; consulta la ficha de cada producto."},
        {"q": "¿Hacen envíos de tacones a todo México?",
         "a": "Sí, enviamos a toda la República Mexicana en 1 a 3 días hábiles. El costo de envío parte de $99 MXN por 1 par y es gratis en pedidos de $1,299 MXN o más."},
    ],
    "sandalias": [
        {"q": "¿Qué estilos de sandalias tienen disponibles?",
         "a": "Contamos con sandalias casuales, de fiesta, de cuña, planas y con tiras para dama, fabricadas en León, Guanajuato. Tenemos modelos para playa, uso diario y eventos en materiales como cuero sintético, textil y charol."},
        {"q": "¿Puedo comprar sandalias al mayoreo?",
         "a": "Sí, vendemos sandalias al mayoreo desde 3 pares sin registro especial. El descuento de $60 MXN por par (3–5 pares) se aplica automáticamente en el carrito. El precio de 6 o más pares ($100 MXN por par) y de corrida completa (hasta $180 MXN por par) están disponibles solo en el Portal de Mayoristas."},
        {"q": "¿Las sandalias están disponibles en talla grande?",
         "a": "Manejamos tallas del 22 al 27 (MX) en la mayoría de modelos de sandalias. Si necesitas una talla especial o tienes dudas sobre disponibilidad, escríbenos por WhatsApp antes de realizar tu pedido."},
        {"q": "¿Cuánto tarda en llegar un pedido de sandalias?",
         "a": "Los pedidos se procesan el mismo día si se realizan antes de las 2 pm hora del centro. La entrega es de 1 a 3 días hábiles a toda la República Mexicana."},
    ],
    "botas": [
        {"q": "¿Qué tipos de botas para dama tienen?",
         "a": "Manejamos botas altas, medianas y cortas para dama en materiales como cuero sintético, charol y textil. Nuestros modelos van desde botas de moda urbana hasta botas vaqueras y de temporada, fabricadas en León, Guanajuato."},
        {"q": "¿Venden botas al mayoreo?",
         "a": "Sí. El precio de mayoreo aplica automáticamente desde 3 pares sin ningún trámite: $60 MXN de descuento por par con 3–5 pares. El precio de 6 o más pares ($100 MXN por par) y de corrida completa (hasta $180 MXN por par) están disponibles solo en el Portal de Mayoristas."},
        {"q": "¿Las botas tienen garantía de fabricación?",
         "a": "Sí. Aceptamos devoluciones y cambios dentro de los 30 días naturales si el producto presenta defecto de fabricación. En ese caso cubrimos el costo del envío de devolución."},
        {"q": "¿Tienen botas para temporada de frío?",
         "a": "Sí, actualizamos el catálogo cada temporada con nuevos modelos de botas. Puedes revisar las novedades en nuestra tienda en línea o preguntarnos por WhatsApp por los modelos más recientes."},
    ],
    "botines": [
        {"q": "¿Qué estilos de botines manejan?",
         "a": "Tenemos botines con tacón, botines planos, con hebilla, con cremallera y con elástico para dama. Todos fabricados en León, Guanajuato en materiales de calidad: cuero sintético, ante, charol y textil."},
        {"q": "¿Puedo comprar botines al mayoreo sin ser tienda?",
         "a": "Sí, cualquier persona puede comprar a precio de mayoreo. Solo necesitas agregar 3 o más pares al carrito y el descuento se aplica solo. No se requiere RFC, registro de negocio ni trámite previo."},
        {"q": "¿Los botines vienen en corrida completa de tallas?",
         "a": "Sí, pero la corrida completa (un mismo modelo en todas las tallas disponibles) con el mejor precio por par ($180 MXN menos que el precio de menudeo) está disponible solo en el Portal de Mayoristas."},
        {"q": "¿Hacen envíos de botines a todo México?",
         "a": "Sí. Enviamos botines a toda la República en 1 a 3 días hábiles. El envío es gratis en pedidos de $1,299 MXN o más."},
    ],
    "flats": [
        {"q": "¿Qué son los flats y qué modelos tienen?",
         "a": "Los flats son zapatos de piso sin tacón, cómodos para uso diario. En Zapatillas May manejamos flats tipo bailarina, mocasín, loafer y puntiagudos para dama, fabricados en León, Guanajuato en cuero sintético, charol y textil."},
        {"q": "¿Tienen flats al mayoreo?",
         "a": "Sí, los flats también aplican para el mayoreo automático desde 3 pares: el precio baja $60 MXN por par con 3–5 pares. El precio de 6 o más pares ($100 por par) y de corrida completa (hasta $180) están disponibles solo en el Portal de Mayoristas."},
        {"q": "¿Los flats son cómodos para usar todo el día?",
         "a": "Sí. Nuestros flats están diseñados para uso prolongado con plantilla acolchada y horma cómoda. Son ideales para oficina, school y uso cotidiano. Puedes consultar los detalles de materiales y suela en la ficha de cada modelo."},
        {"q": "¿Puedo devolver unos flats si no son de mi talla?",
         "a": "Sí. Aceptamos devoluciones dentro de los 30 días naturales si el producto está en su estado original y sin uso. El costo del envío de devolución por cambio de talla corre por cuenta del cliente."},
    ],
    "plataformas": [
        {"q": "¿Qué altura tienen las plataformas que venden?",
         "a": "Nuestras plataformas para dama varían entre 3 y 10 cm de altura de base, dependiendo del modelo. Puedes ver la altura exacta en la ficha técnica de cada producto. Fabricadas en León, Guanajuato."},
        {"q": "¿Las plataformas son cómodas para uso prolongado?",
         "a": "Sí. La plataforma distribuye el peso del pie de forma más uniforme que un tacón alto tradicional, lo que las hace más cómodas para caminar. Nuestros modelos incluyen plantilla acolchada y suela antiderrapante."},
        {"q": "¿Tienen plataformas al mayoreo?",
         "a": "Sí. Mayoreo automático desde 3 pares sin registro: $60 MXN de descuento por par con 3–5 pares. El precio de 6 o más pares ($100 por par) y de corrida completa (hasta $180) están disponibles solo en el Portal de Mayoristas."},
        {"q": "¿En qué materiales están disponibles las plataformas?",
         "a": "Manejamos plataformas en cuero sintético, charol, ante y textil en distintos colores de temporada. Consulta el catálogo actualizado en nuestra tienda en línea."},
    ],
    "tenis": [
        {"q": "¿Qué tipo de tenis para dama venden?",
         "a": "Vendemos tenis de moda urbana y casual para dama, fabricados en León, Guanajuato. Nuestros modelos incluyen tenis plataforma, tenis chunky y tenis ligeros para uso diario en materiales textiles y sintéticos."},
        {"q": "¿Los tenis aplican para mayoreo?",
         "a": "Sí. El mayoreo automático aplica desde 3 pares: $60 MXN menos por par con 3–5 pares, sin registro ni trámite previo. El precio de 6 o más pares ($100 por par) y de corrida completa (hasta $180) están disponibles solo en el Portal de Mayoristas."},
        {"q": "¿Tienen tenis deportivos o solo de moda?",
         "a": "Nuestro catálogo está enfocado en tenis de moda y estilo urbano para dama. No manejamos tenis deportivos de alto rendimiento. Son ideales para uso casual, escolar y street style."},
        {"q": "¿Cuánto tarda el envío de tenis?",
         "a": "El envío es de 1 a 3 días hábiles a toda la República Mexicana. Enviamos también a Estados Unidos y Canadá (consultar costo por WhatsApp)."},
    ],
    "nina": [
        {"q": "¿Qué tipos de calzado para niña manejan?",
         "a": "Tenemos zapatillas, sandalias, botines y zapatos escolares para niña, fabricados en León, Guanajuato. Los modelos están diseñados para ser cómodos, resistentes y de moda para las más pequeñas."},
        {"q": "¿Venden calzado de niña al mayoreo?",
         "a": "Sí, el mayoreo automático aplica desde 3 pares sin registro: $60 MXN de descuento por par con 3–5 pares. Para 6 o más pares y corrida completa (hasta $180 MXN por par), regístrate gratis en el Portal de Mayoristas."},
        {"q": "¿Qué tallas manejan en calzado para niña?",
         "a": "Manejamos tallas infantiles desde el 14 hasta el 21 (MX) aproximadamente, dependiendo del modelo. Consulta la ficha de cada producto o escríbenos por WhatsApp para verificar disponibilidad en tallas específicas."},
        {"q": "¿El calzado de niña es de buena calidad y resistente?",
         "a": "Sí. Nuestro calzado infantil está fabricado con materiales seleccionados para resistir el uso activo de las niñas, con suelas antiderrapantes y puntas reforzadas. Fabricado directamente en León, Guanajuato."},
    ],
    "accesorios": [
        {"q": "¿Qué tipo de accesorios venden?",
         "a": "Manejamos accesorios de moda para complementar tus outfits: bolsas, cinturones y complementos de moda fabricados o distribuidos desde León, Guanajuato. El catálogo se actualiza con cada temporada."},
        {"q": "¿Los accesorios tienen precio de mayoreo?",
         "a": "Sí. El precio de mayoreo aplica automáticamente desde 3 piezas en el carrito: $60 MXN de descuento por pieza (3–5), sin registro especial. Para 6 o más piezas y corrida completa (hasta $180 MXN por pieza), regístrate gratis en el Portal de Mayoristas."},
        {"q": "¿Hacen envíos de accesorios a todo México?",
         "a": "Sí. Enviamos accesorios a toda la República Mexicana en 1 a 3 días hábiles. El envío es gratis en pedidos de $1,299 MXN o más."},
    ],
    "mayoreo": [
        {"q": "¿Cuántos pares necesito comprar para obtener precio de mayoreo?",
         "a": "Solo necesitas 3 pares para activar el precio de mayoreo. El descuento de $60 MXN por par (3–5 pares) es automático en el carrito, sin registro. El precio de 6 o más pares ($100 MXN por par) y de corrida completa (hasta $180 MXN por par) están disponibles solo en el Portal de Mayoristas."},
        {"q": "¿Necesito RFC o estar registrada como negocio para comprar al mayoreo?",
         "a": "No, para comprar 3 a 5 pares: agrega los pares al carrito en zapatillasmay.mx y el precio baja automáticamente, sin RFC ni aprobación previa. Para precios de 6 pares en adelante y corrida completa sí necesitas una cuenta gratuita en el Portal de Mayoristas."},
        {"q": "¿Puedo mezclar modelos y tallas en mi pedido de mayoreo?",
         "a": "Sí. Puedes combinar diferentes modelos, colores y tallas en un mismo pedido. El precio de mayoreo se calcula sobre el total de pares en el carrito, no por modelo."},
        {"q": "¿Qué es una corrida completa?",
         "a": "Una corrida es un mismo modelo en todos sus colores y tallas disponibles. Es la opción ideal para tiendas y revendedoras, y da el mejor precio: $180 MXN menos por par vs. precio de menudeo. Está disponible solo en el Portal de Mayoristas."},
        {"q": "¿Hacen envíos de pedidos de mayoreo a todo México?",
         "a": "Sí. Enviamos a toda la República Mexicana en 1 a 3 días hábiles. Los pedidos grandes de mayoreo se envían por paquetería terrestre con número de guía para rastreo. También despachamos a EE.UU. y Canadá."},
    ],
    "ofertas": [
        {"q": "¿Cómo puedo aprovechar las ofertas de Zapatillas May?",
         "a": "Las ofertas se aplican automáticamente en el carrito — no necesitas cupones ni códigos. Los productos en oferta ya muestran su precio especial directamente en el catálogo. Además, combinando ofertas con el mayoreo de 3+ pares maximizas el ahorro."},
        {"q": "¿Las ofertas incluyen todos los modelos?",
         "a": "No. Las ofertas aplican a modelos seleccionados de temporada o de liquidación. El catálogo de ofertas se actualiza continuamente. Te recomendamos revisarlo seguido para encontrar los mejores precios."},
        {"q": "¿Puedo comprar calzado en oferta al mayoreo?",
         "a": "Sí. Los modelos en oferta ya tienen un precio especial de liquidación rebajado al máximo, por lo que no aplican descuentos adicionales de mayoreo en el carrito."},
    ],
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
        # Intentar cargar localmente primero para reducir TTFB (~1ms vs ~500ms)
        local_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "tienda", "index.html"))
        if os.path.exists(local_path):
            try:
                with open(local_path, "r", encoding="utf-8") as f:
                    template = f.read()
                cache_set("tpl_index_html", template, ttl=3600)
            except Exception as e:
                print(f"[seo] Error leyendo index.html local: {e}")

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
        # Demotar el H1 del hero a <div> — cada subpágina tiene su propio H1 inyectado más abajo
        template = re.sub(
            r'<h1(\s[^>]*class="hero-title"[^>]*)>(.*?)</h1>',
            r'<div\1>\2</div>',
            template, count=1, flags=re.DOTALL
        )
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
        template = template.replace(
            '<meta property="og:url" content="https://zapatillasmay.mx/">',
            f'<meta property="og:url" content="{canonical}">'
        )

        # Inyectar contenido HTML visible para páginas informacionales.
        # Siempre visible: Google lo lee en el HTML inicial; el SPA lo deja intacto
        # porque no referencia este ID. Los usuarios lo ven mientras carga el JS.
        page_content = _PAGINAS_CONTENT.get(slug)
        if page_content:
            template = template.replace(
                '<div class="section section-cats-desktop">',
                f'<div id="ssr-page-content">{page_content}</div>'
                + '<div class="section section-cats-desktop">',
                1
            )

        # ItemList + BreadcrumbList schema para categorías (rich results en SERP)
        _cat_productos = []
        try:
            _cat_productos = supabase_get(
                f"productos?activo=eq.true&categoria=eq.{slug}&select=sku_interno,slug,nombre,meta_titulo,imagen_principal,precio_menudeo,es_oferta&limit=20"
            ) or []
        except Exception:
            pass

        # Inyectar H1 + listado de productos visible en HTML inicial.
        # Hace cada página de categoría genuinamente diferente a la home para Google
        # (soluciona "Duplicate, Google chose different canonical than user").
        # El JS carga el catálogo debajo; esta sección queda como acceso rápido.
        _CAT_DESCS = {
            "tacones":     "Tacones de moda para dama fabricados en León, Guanajuato. Mayoreo desde 3 pares sin registro: aguja, bloque y plataforma. Envíos a todo México.",
            "sandalias":   "Sandalias de dama hechas en León, Guanajuato: casuales, de fiesta y de cuña. Mayoreo desde 3 pares. Envíos a todo México.",
            "botas":       "Botas de moda para dama fabricadas en León, Guanajuato. Mayoreo desde 3 pares sin registro. Envíos a todo México.",
            "botines":     "Botines de dama de temporada fabricados en León, Guanajuato. Mayoreo desde 3 pares. Envíos a todo México.",
            "flats":       "Flats y zapatos bajos de dama, cómodos y de moda, hechos en León, Guanajuato. Mayoreo desde 3 pares. Envíos a todo México.",
            "plataformas": "Plataformas de dama con altura y comodidad, fabricadas en León, Guanajuato. Mayoreo desde 3 pares. Envíos a todo México.",
            "tenis":       "Tenis de moda para dama fabricados en León, Guanajuato. Mayoreo desde 3 pares. Envíos a todo México.",
            "nina":        "Calzado para niña cómodo y resistente, fabricado en León, Guanajuato. Mayoreo desde 3 pares. Envíos a todo México.",
            "accesorios":  "Accesorios de moda de Zapatillas May, fabricados en León, Guanajuato. Mayoreo y menudeo con envíos a todo México.",
            "ofertas":     "Ofertas de calzado femenino de Zapatillas May: tacones, sandalias y más a precios especiales. Envíos a todo México.",
            "mayoreo":     "Compra calzado de dama a precio de mayoreo desde 3 pares, sin registro especial. Fabricado en León, Guanajuato.",
        }
        h1_seo = _PAGINAS_H1.get(slug)
        _cat_desc_txt = _CAT_DESCS.get(slug, "")
        if h1_seo:
            _h1_tag = (
                f'<h1 style="font-size:0.78rem;font-weight:500;color:#9c7c6e;letter-spacing:0.3px;'
                f'padding:8px 20px 0;margin:0;font-family:DM Sans,sans-serif;opacity:0.85">'
                f'{_esc_pagina(h1_seo)}</h1>'
            )
            _prod_links = ""
            if _cat_productos and _cat_desc_txt:
                _prod_links = "".join(
                    f'<li style="flex:0 0 auto"><a href="/producto/{_esc_pagina(_pp.get("slug") or _pp.get("sku_interno") or "")}"'
                    f' style="display:block;padding:6px 12px;background:#fff;border:1px solid #e8e0da;'
                    f'border-radius:20px;text-decoration:none;color:#5a4a40;font-size:0.78rem;white-space:nowrap">'
                    f'{_esc_pagina((_pp.get("nombre") or "").strip())}</a></li>'
                    for _pp in _cat_productos[:15] if _pp.get("sku_interno")
                )
            _ssr_inner = _h1_tag
            if _prod_links:
                _ssr_inner += (
                    f'<section aria-hidden="true" style="display:none">'
                    f'<ul style="list-style:none;padding:0;margin:0">'
                    f'{_prod_links}</ul></section>'
                )
            template = template.replace('<div class="section" id="productos-section"',
                                        _ssr_inner + '\n<div class="section" id="productos-section"', 1)

        if _cat_productos:
            _items_ld = []
            for _i, _pp in enumerate(_cat_productos, 1):
                _pslug = _pp.get("slug") or _pp.get("sku_interno") or str(_pp.get("id", ""))
                _pnombre = (_pp.get("nombre") or _pslug).strip()
                _pprecio = (_pp.get("precio_menudeo") or 0)
                _pprecio_d = _pprecio if _pp.get("es_oferta") else round(float(_pprecio) + 80)
                _items_ld.append({
                    "@type": "ListItem",
                    "position": _i,
                    "url": f"https://zapatillasmay.mx/producto/{_pslug}",
                    "name": _pnombre,
                })
            ld_list = {
                "@context": "https://schema.org/",
                "@type": "ItemList",
                "name": titulo,
                "url": canonical,
                "itemListElement": _items_ld,
            }
            ld_breadcrumb_cat = {
                "@context": "https://schema.org/",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://zapatillasmay.mx/"},
                    {"@type": "ListItem", "position": 2, "name": titulo.split(" |")[0], "item": canonical},
                ]
            }
            schemas_json = (
                f'<script type="application/ld+json">{json.dumps(ld_list, ensure_ascii=False)}</script>\n'
                f'<script type="application/ld+json">{json.dumps(ld_breadcrumb_cat, ensure_ascii=False)}</script>'
            )
            # FAQPage schema — rich snippet "Preguntas frecuentes" en la SERP
            _faq_items = _FAQS.get(slug)
            if _faq_items:
                ld_faq = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": f["q"],
                            "acceptedAnswer": {"@type": "Answer", "text": f["a"]},
                        }
                        for f in _faq_items
                    ],
                }
                schemas_json += f'\n<script type="application/ld+json">{json.dumps(ld_faq, ensure_ascii=False)}</script>'
            template = template.replace("</head>", schemas_json + "\n</head>", 1)
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


def _img_feed(url):
    """Normaliza la imagen para los feeds de Shopping.
    Solo toca URLs de Cloudinary: si la imagen mide menos de 800px de ancho la
    agranda a 1200 (con sharpen) para cumplir el mínimo de Google; las que ya son
    grandes NO se tocan (solo se limitan a 1600 y se optimizan). Es no-destructivo:
    transforma en la entrega, no modifica el original guardado."""
    u = (url or "").strip()
    if not u or "res.cloudinary.com" not in u or "/upload/" not in u:
        return u
    # Evitar doble transformación si ya viene con una
    cabeza, _, cola = u.partition("/upload/")
    transform = "if_w_lt_800/c_scale,w_1200,e_sharpen:60/if_end/c_limit,w_1600,f_auto,q_auto"
    return f"{cabeza}/upload/{transform}/{cola}"


def _titulo_feed(p):
    nombre = (p.get("nombre") or p.get("sku_interno") or "").strip()
    cat = (p.get("categoria") or "").strip().lower()
    tipo = _TIPO_SINGULAR.get(cat) or (_cap(p.get("categoria")) or "Calzado")

    # Si el nombre ya es descriptivo (más de una palabra), lo usamos directamente
    # y nos aseguramos de que mencione la categoría/tipo y "de dama"
    if len(nombre.split()) > 1:
        titulo = nombre
        if tipo.lower() not in titulo.lower():
            titulo = f"{titulo} {tipo}"
        if "dama" not in titulo.lower() and "niña" not in titulo.lower() and "nina" not in titulo.lower():
            titulo = f"{titulo} de dama"
        return re.sub(r"\s+", " ", titulo).strip()[:150]

    # Fallback para nombres cortos o códigos puros
    partes = [nombre, tipo, "de dama"]

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
        productos = _sin_oferta_interna(supabase_get("productos?activo=eq.true&select=id,slug,sku_interno,updated_at,imagen_principal,nombre,meta_titulo,categoria"))
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
            'https://zapatillasmay.mx/ofertas',
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
        import datetime as _dt_sm
        _today = _dt_sm.date.today().isoformat()
        # URLs sin imagen — priorities diferenciadas
        for url in urls:
            if url == 'https://zapatillasmay.mx/':
                _pri, _freq = '1.0', 'daily'
            elif any(url.endswith(f'/{c}') for c in ['tacones','sandalias','botas','botines','flats','plataformas','tenis','nina','accesorios','mayoreo']):
                _pri, _freq = '0.9', 'weekly'
            else:
                _pri, _freq = '0.5', 'monthly'
            xml += f'  <url>\n    <loc>{url}</loc>\n    <lastmod>{_today}</lastmod>\n    <changefreq>{_freq}</changefreq>\n    <priority>{_pri}</priority>\n  </url>\n'
        # URLs de producto, cada una con su imagen (SEO de imágenes para Google)
        for p in productos:
            slug = p.get('slug') or p.get('sku_interno') or p.get('id', '')
            if not slug:
                continue
            loc = f'https://zapatillasmay.mx/producto/{slug}'
            # lastmod real desde updated_at de la DB
            _lastmod = (p.get('updated_at') or _today)[:10]
            xml += f'  <url>\n    <loc>{loc}</loc>\n    <lastmod>{_lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n'
            img = (p.get('imagen_principal') or '').strip()
            if img:
                img_esc = _html.escape(img, quote=True)
                # Título de imagen descriptivo: usa el SEO generado (limpiando marca); si no, nombre descriptivo
                meta_titulo = (p.get('meta_titulo') or '').strip()
                if meta_titulo:
                    for suffix in [' | Zapatillas May León GTO', ' | Zapatillas May', '| Zapatillas May']:
                        if meta_titulo.endswith(suffix):
                            meta_titulo = meta_titulo[:-len(suffix)].strip()
                            break
                titulo_base = meta_titulo
                # Fallback si el meta_titulo es nulo o demasiado corto para ser útil (ej: "2", "C", "I")
                if not titulo_base or len(titulo_base) < 3:
                    nombre = (p.get('nombre') or '').strip()
                    categoria = (p.get('categoria') or '').strip().lower()
                    cat_label = _TIPO_SINGULAR.get(categoria, (categoria or 'Calzado').capitalize())
                    
                    if len(nombre.split()) <= 1:
                        titulo_base = f"{nombre} {cat_label}".strip()
                    else:
                        titulo_base = nombre
                        if len(titulo_base.split()) < 3 and cat_label.lower() not in titulo_base.lower():
                            titulo_base = f"{titulo_base} {cat_label}".strip()
                else:
                    # Si viene de meta_titulo pero es corto, le agregamos la categoría para más relevancia SEO
                    categoria = (p.get('categoria') or '').strip().lower()
                    cat_label = _TIPO_SINGULAR.get(categoria, (categoria or 'Calzado').capitalize())
                    if len(titulo_base.split()) < 3 and cat_label.lower() not in titulo_base.lower():
                        titulo_base = f"{titulo_base} {cat_label}".strip()
                
                titulo_base = (titulo_base or 'Zapatillas May')[:150]
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
        "Disallow: /panel\n"
        "Disallow: /checkout\n"
        "Disallow: /success\n"
        "Disallow: /pedido-exitoso\n"
        "Disallow: /pedido-pendiente\n"
        "Disallow: /pedido-fallido\n"
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
        "LLMs: https://zapatillasmay.mx/llms.txt\n"
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
            "- 3-5 pares: precio de mayoreo — $60 MXN menos por par vs. menudeo.",
            "- 6+ pares: mejor precio de mayoreo — $100 MXN menos por par vs. menudeo.",
            "- 12+ pares (corrida completa): precio máximo mayoreo — hasta $180 MXN menos por par vs. menudeo.",
            "- El descuento se aplica automáticamente al agregar pares al carrito, sin registro ni código especial.",
            "- No se requiere registro, RFC, ni trámite para comprar a mayoreo.",
            "- Ejemplo: si un modelo vale $650 menudeo, a 3 pares cuesta $590/par, a 6+ cuesta $550/par.",
            "",
            "## Envíos",
            "- Envíos a todo México por paquetería (1-3 días hábiles).",
            "- Costo: $99 MXN por 1 par · $150 MXN por 2-3 pares · $199 MXN por 4+ pares.",
            "- **Envío gratis** en pedidos de $1,299 MXN o más.",
            "- [Más información sobre envíos](https://zapatillasmay.mx/envios)",
            "",
            "## Devoluciones",
            "- Devoluciones aceptadas en los primeros 30 días.",
            "- [Política de devoluciones](https://zapatillasmay.mx/politica-de-devoluciones)",
            "",
            "## Métodos de pago",
            "- Tarjeta de crédito/débito, SPEI, OXXO, MercadoPago.",
            "- Pago 100% seguro. No se guarda información de tarjeta.",
            "",
            "## Qué pueden hacer los agentes de IA",
            "- Buscar y recomendar modelos del catálogo.",
            "- Consultar disponibilidad (color, talla, pares en stock) en tiempo real.",
            "- Explicar precios de mayoreo, envíos y cómo comprar.",
            "- Dirigir al cliente a la página del producto para completar la compra.",
            "- Responder preguntas sobre tallas: [Tabla de tallas](https://zapatillasmay.mx/tabla-tallas)",
            "",
            "## Información",
            "- [Cómo comprar a mayoreo](https://zapatillasmay.mx/mayoreo)",
            "- [Tabla de tallas](https://zapatillasmay.mx/tabla-tallas)",
            "- [Envíos](https://zapatillasmay.mx/envios)",
            "- [Nosotros](https://zapatillasmay.mx/nosotros)",
            "- [Cómo comprar paso a paso](https://zapatillasmay.mx/como-comprar)",
            "",
            "## Contacto",
            "- Sitio: https://zapatillasmay.mx",
            "- WhatsApp disponible en el sitio para consultas y pedidos.",
            "- Fabricante: León, Guanajuato, México.",
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
        productos = _sin_oferta_interna(supabase_get(
            "productos?activo=eq.true&select=id,nombre,sku_interno,descripcion,categoria,"
            "precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,es_oferta,"
            "imagen_principal,material,tallas_disponibles,tipo_tacon,altura_tacon"
        ))

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
            # DB precio_menudeo = precio base de tienda. Menudeo display = base + 80 (salvo ofertas)
            menudeo_display = base_f if (es_oferta or base_f is None) else round(base_f + 80)
            def _precio(campo, descuento_vs_base):
                v = p.get(campo)
                try:
                    return float(v) if v is not None else (round(base_f - descuento_vs_base) if base_f else None)
                except Exception:
                    return None

            precios = {
                "menudeo":            menudeo_display,
                "mayoreo_3a5_pares":  _precio("precio_mayoreo3", 30),   # base - 30 = menudeo - 110
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

            tiene_stock = any(
                sum(d.get("tallas", {}).values()) > 0
                for d in colores_dict.values()
            ) if colores_dict else False

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
                "es_oferta": bool(p.get("es_oferta")),
                "moneda":    "MXN",
                "imagen":    _img_feed(p.get("imagen_principal")),
                "url":       f"https://zapatillasmay.mx/producto/{slug}" if slug else None,
                "disponible": tiene_stock or bool(colores_list),
                "disponibilidad": "in_stock" if tiene_stock else ("available" if colores_list else "out_of_stock"),
            })

        import datetime as _dt
        salida = {
            "tienda": "Zapatillas May",
            "descripcion": "Calzado femenino de moda fabricado en León, Guanajuato. Mayoreo y menudeo.",
            "url": "https://zapatillasmay.mx",
            "moneda": "MXN",
            "pais": "México",
            "ciudad": "León, Guanajuato",
            "envio": {
                "nota": "Envíos a todo México por paquetería.",
                "gratis_desde_mxn": 1299,
                "tarifas_mxn": {"1_par": 99, "2_3_pares": 150, "4_mas_pares": 199},
                "tiempo_estimado": "1-3 días hábiles"
            },
            "devoluciones": "30 días. Más info: https://zapatillasmay.mx/politica-de-devoluciones",
            "mayoreo": {
                "nota": "El precio baja automáticamente según cuántos pares hay en el carrito: 1-2 pares = menudeo; 3-5 pares = $60 menos/par; 6+ pares = $100 menos/par; 12+ pares (corrida) = hasta $180 menos/par.",
                "sin_registro": True,
                "minimo_pares_mayoreo": 3
            },
            "total_productos": len(items),
            "fecha_generacion": _dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
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
        data = supabase_get("configuracion_seo?select=clave,valor") or []
        # Agregar claves de env vars que el frontend necesita (no secretas)
        gcid = os.environ.get("GOOGLE_CLIENT_ID", "")
        if gcid:
            data = list(data) + [{"clave": "google_client_id", "valor": gcid}]
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
        productos = _sin_oferta_interna(supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,es_oferta,categoria,imagen_principal,slug,material,tipo_tacon,altura_tacon"))
        variantes = supabase_get_all("variantes?activa=eq.true&select=id,producto_id,color,color_hex,foto_url,talla,imagenes")
        inventario = supabase_get_all("inventario?select=variante_id,cantidad")

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
                    es_oferta = p.get("es_oferta", False)
                    base_precio = float(p.get("precio_menudeo") or 0)
                    precio_normal = round(base_precio + 80)
                    precio_oferta = round(base_precio)
                    precio_mayoreo = round(base_precio)  # precio mayoreo (3+ pares)
                    mat = (p.get("material") or "").strip()
                    cat_label = (p.get("categoria") or "").strip().lower()
                    mayoreo_label = "mayoreo_disponible"

                    xml += '<item>\n'
                    xml += f'  <g:id>{var_id}</g:id>\n'
                    xml += f'  <g:item_group_id>{sku}</g:item_group_id>\n'
                    xml += f'  <g:title>{_html.escape(titulo_base + (" - " + color_title if color_title else ""), quote=True)}</g:title>\n'
                    xml += f'  <g:description>{desc}</g:description>\n'
                    xml += f'  <g:link>{url}?color={color_encoded}&amp;talla={talla}</g:link>\n'
                    xml += f'  <g:image_link>{_img_feed(imagen)}</g:image_link>\n'
                    for img_extra in imagenes_extra[:9]:
                        xml += f'  <g:additional_image_link>{_img_feed(img_extra)}</g:additional_image_link>\n'
                    xml += f'  <g:price>{precio_normal} MXN</g:price>\n'
                    if es_oferta:
                        xml += f'  <g:sale_price>{precio_oferta} MXN</g:sale_price>\n'
                    xml += f'  <g:availability>{availability}</g:availability>\n'
                    xml += f'  <g:quantity>{max(int(cantidad or 0), 0)}</g:quantity>\n'
                    xml += f'  <g:condition>new</g:condition>\n'
                    xml += f'  <g:brand>Zapatillas May</g:brand>\n'
                    xml += f'  <g:identifier_exists>no</g:identifier_exists>\n'
                    xml += f'  <g:google_product_category>187</g:google_product_category>\n'
                    xml += f'  <g:product_type>{p.get("categoria","Calzado")}</g:product_type>\n'
                    xml += f'  <g:color>{color}</g:color>\n'
                    xml += f'  <g:size>{talla_feed}</g:size>\n'
                    xml += f'  <g:size_system>MEX</g:size_system>\n'
                    xml += f'  <g:size_type>regular</g:size_type>\n'
                    xml += f'  <g:size_chart>https://zapatillasmay.mx/tabla-tallas</g:size_chart>\n'
                    xml += f'  <g:gender>female</g:gender>\n'
                    xml += f'  <g:age_group>adult</g:age_group>\n'
                    if mat:
                        xml += f'  <g:material>{_html.escape(mat, quote=True)}</g:material>\n'
                    xml += f'  <g:custom_label_0>{mayoreo_label}</g:custom_label_0>\n'
                    xml += f'  <g:custom_label_1>{cat_label}</g:custom_label_1>\n'
                    xml += f'  <g:custom_label_2>{"oferta" if es_oferta else "precio_regular"}</g:custom_label_2>\n'
                    xml += '</item>\n'

            else:
                imagen_p = p.get('imagen_principal', '')
                desc2 = (p.get("descripcion","") or p.get("nombre","")).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
                es_oferta2 = p.get("es_oferta", False)
                base2 = float(p.get("precio_menudeo") or 0)
                precio_normal2 = round(base2 + 80)
                precio_oferta2 = round(base2)
                mat2 = (p.get("material") or "").strip()
                cat_label2 = (p.get("categoria") or "").strip().lower()
                xml += '<item>\n'
                xml += f'  <g:id>{sku}</g:id>\n'
                xml += f'  <g:title>{_html.escape(_titulo_feed(p), quote=True)}</g:title>\n'
                xml += f'  <g:description>{desc2}</g:description>\n'
                xml += f'  <g:link>{url}</g:link>\n'
                xml += f'  <g:image_link>{_img_feed(imagen_p)}</g:image_link>\n'
                xml += f'  <g:price>{precio_normal2} MXN</g:price>\n'
                if es_oferta2:
                    xml += f'  <g:sale_price>{precio_oferta2} MXN</g:sale_price>\n'
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
                xml += f'  <g:size_system>MEX</g:size_system>\n'
                if mat2:
                    xml += f'  <g:material>{_html.escape(mat2, quote=True)}</g:material>\n'
                xml += f'  <g:custom_label_0>mayoreo_disponible</g:custom_label_0>\n'
                xml += f'  <g:custom_label_1>{cat_label2}</g:custom_label_1>\n'
                xml += f'  <g:custom_label_2>{"oferta" if es_oferta2 else "precio_regular"}</g:custom_label_2>\n'
                xml += '</item>\n'

        xml += '</channel>\n</rss>'
        cache_set("feed_meta", xml, ttl=TTL_FEEDS)
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
        productos = _sin_oferta_interna(supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,es_oferta,categoria,imagen_principal,slug,material,tipo_tacon,altura_tacon"))
        variantes = supabase_get_all("variantes?activa=eq.true&select=id,producto_id,color,color_hex,foto_url,talla,imagenes")
        inventario = supabase_get_all("inventario?select=variante_id,cantidad")

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
        xml += '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">\n'
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
                    color_norm = color.replace(' ', '_').replace('/', '_').replace('-', '_').strip('_')
                    var_id = f"{sku}-{color_norm}-{talla}" if talla else f"{sku}-{color_norm}"
                    desc = (p.get("descripcion","") or p.get("nombre","")).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
                    color_encoded = color_norm

                    if not talla or str(talla).strip() == '':
                        talla_feed = 'Única'
                    elif talla in ('Unica', 'Única', 'unica', 'única'):
                        talla_feed = 'One Size'
                    else:
                        talla_feed = str(talla)

                    es_oferta = p.get("es_oferta", False)
                    base_precio = float(p.get("precio_menudeo") or 0)
                    precio_normal = round(base_precio + 80)
                    precio_oferta = round(base_precio)
                    mat = (p.get("material") or "").strip()
                    cat_label = (p.get("categoria") or "").strip().lower()

                    xml += '<entry>\n'
                    xml += f'  <g:id>{var_id}</g:id>\n'
                    xml += f'  <g:item_group_id>{sku}</g:item_group_id>\n'
                    xml += f'  <g:title>{_html.escape(titulo_base + (" - " + color_title if color_title else ""), quote=True)}</g:title>\n'
                    xml += f'  <g:description>{desc}</g:description>\n'
                    xml += f'  <g:link>{url}?color={color_encoded}&amp;talla={talla}</g:link>\n'
                    xml += f'  <g:checkout_link_template>https://zapatillasmay.mx/checkout?products={var_id}:{{quantity}}</g:checkout_link_template>\n'
                    xml += f'  <g:image_link>{_img_feed(imagen)}</g:image_link>\n'
                    for img_extra in imagenes_extra[:9]:
                        xml += f'  <g:additional_image_link>{_img_feed(img_extra)}</g:additional_image_link>\n'
                    xml += f'  <g:price>{precio_normal} MXN</g:price>\n'
                    if es_oferta:
                        xml += f'  <g:sale_price>{precio_oferta} MXN</g:sale_price>\n'
                    xml += f'  <g:availability>{availability}</g:availability>\n'
                    xml += f'  <g:condition>new</g:condition>\n'
                    xml += f'  <g:brand>Zapatillas May</g:brand>\n'
                    xml += f'  <g:identifier_exists>no</g:identifier_exists>\n'
                    xml += f'  <g:google_product_category>187</g:google_product_category>\n'
                    xml += f'  <g:product_type>{p.get("categoria","Calzado")}</g:product_type>\n'
                    xml += f'  <g:color>{color or "Multicolor"}</g:color>\n'
                    xml += f'  <g:gender>female</g:gender>\n'
                    xml += f'  <g:age_group>adult</g:age_group>\n'
                    xml += f'  <g:size>{talla_feed}</g:size>\n'
                    xml += f'  <g:size_system>MEX</g:size_system>\n'
                    xml += f'  <g:size_type>regular</g:size_type>\n'
                    xml += f'  <g:size_chart>https://zapatillasmay.mx/tabla-tallas</g:size_chart>\n'
                    if mat:
                        xml += f'  <g:material>{_html.escape(mat, quote=True)}</g:material>\n'
                    xml += f'  <g:custom_label_0>mayoreo_disponible</g:custom_label_0>\n'
                    xml += f'  <g:custom_label_1>{cat_label}</g:custom_label_1>\n'
                    xml += f'  <g:custom_label_2>{"oferta" if es_oferta else "precio_regular"}</g:custom_label_2>\n'
                    xml += '</entry>\n'
            else:
                imagen_p = p.get('imagen_principal', '')
                desc2 = (p.get("descripcion","") or p.get("nombre","")).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
                es_oferta2 = p.get("es_oferta", False)
                base2 = float(p.get("precio_menudeo") or 0)
                precio_normal2 = round(base2 + 80)
                precio_oferta2 = round(base2)
                mat2 = (p.get("material") or "").strip()
                cat_label2 = (p.get("categoria") or "").strip().lower()

                xml += '<entry>\n'
                xml += f'  <g:id>{sku}</g:id>\n'
                xml += f'  <g:title>{_html.escape(_titulo_feed(p), quote=True)}</g:title>\n'
                xml += f'  <g:description>{desc2}</g:description>\n'
                xml += f'  <g:link>{url}</g:link>\n'
                xml += f'  <g:image_link>{_img_feed(imagen_p)}</g:image_link>\n'
                xml += f'  <g:price>{precio_normal2} MXN</g:price>\n'
                if es_oferta2:
                    xml += f'  <g:sale_price>{precio_oferta2} MXN</g:sale_price>\n'
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
                xml += f'  <g:size_system>MEX</g:size_system>\n'
                if mat2:
                    xml += f'  <g:material>{_html.escape(mat2, quote=True)}</g:material>\n'
                xml += f'  <g:custom_label_0>mayoreo_disponible</g:custom_label_0>\n'
                xml += f'  <g:custom_label_1>{cat_label2}</g:custom_label_1>\n'
                xml += f'  <g:custom_label_2>{"oferta" if es_oferta2 else "precio_regular"}</g:custom_label_2>\n'
                xml += '</entry>\n'

        xml += '</feed>'
        cache_set("feed_google", xml, ttl=TTL_FEEDS)
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

STORE_CODE = "MAY-LEON"

@router.get("/feed/google-local.xml")
def feed_google_local():
    """Feed de inventario local — IDs deben coincidir exactamente con google.xml (var_id por variante)."""
    cached = cache_get("feed_google_local")
    if cached is not None:
        return Response(content=cached, media_type="application/xml")
    try:
        productos  = _sin_oferta_interna(supabase_get("productos?activo=eq.true&select=id,sku_interno,precio_menudeo,es_oferta"))
        variantes  = supabase_get_all("variantes?activa=eq.true&select=id,producto_id,color,talla")
        inventario = supabase_get_all("inventario?select=variante_id,cantidad")

        # Stock por variante (suma todas las sucursales)
        inv_map: dict = {}
        for i in (inventario or []):
            vid = i.get("variante_id")
            if vid:
                inv_map[vid] = inv_map.get(vid, 0) + int(i.get("cantidad") or 0)

        # Variantes agrupadas por producto_id
        vars_por_producto: dict = {}
        for v in (variantes or []):
            pid = v.get("producto_id")
            if pid:
                vars_por_producto.setdefault(pid, []).append(v)

        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">\n'

        for p in productos:
            sku = p.get("sku_interno") or p.get("id")
            pid = p.get("id")
            base = float(p.get("precio_menudeo") or 0)
            precio = base if p.get("es_oferta") else round(base + 80)
            if not sku or precio <= 0:
                continue

            variantes_p = vars_por_producto.get(pid, [])
            if variantes_p:
                # Una entrada por variante — mismo var_id que feed primario
                for v in variantes_p:
                    vid = v.get("id")
                    color = (v.get("color") or "").strip()
                    talla = str(v.get("talla") or "").strip()
                    color_norm = color.replace(' ', '_').replace('/', '_').replace('-', '_').strip('_')
                    var_id = f"{sku}-{color_norm}-{talla}" if talla else f"{sku}-{color_norm}"
                    qty = max(inv_map.get(vid, 0), 0)
                    availability = "in stock" if qty > 0 else "out of stock"
                    xml += '<entry>\n'
                    xml += f'  <g:store_code>{_html.escape(STORE_CODE)}</g:store_code>\n'
                    xml += f'  <g:id>{_html.escape(var_id)}</g:id>\n'
                    xml += f'  <g:availability>{availability}</g:availability>\n'
                    xml += f'  <g:price>{precio} MXN</g:price>\n'
                    xml += f'  <g:quantity>{qty}</g:quantity>\n'
                    xml += f'  <g:checkout_link_template>https://zapatillasmay.mx/checkout?products={var_id}:{{quantity}}</g:checkout_link_template>\n'
                    xml += '</entry>\n'
            else:
                # Sin variantes: ID simple igual que fallback del feed primario
                xml += '<entry>\n'
                xml += f'  <g:store_code>{_html.escape(STORE_CODE)}</g:store_code>\n'
                xml += f'  <g:id>{_html.escape(str(sku))}</g:id>\n'
                xml += f'  <g:availability>out of stock</g:availability>\n'
                xml += f'  <g:price>{precio} MXN</g:price>\n'
                xml += f'  <g:quantity>0</g:quantity>\n'
                xml += f'  <g:checkout_link_template>https://zapatillasmay.mx/checkout?products={_html.escape(str(sku))}:{{quantity}}</g:checkout_link_template>\n'
                xml += '</entry>\n'

        xml += '</feed>'
        cache_set("feed_google_local", xml, ttl=TTL_FEEDS)
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

@router.get("/feed/tiktok.json")
def feed_tiktok():
    try:
        productos  = _sin_oferta_interna(supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,es_oferta,categoria,imagen_principal,material,tipo_tacon,altura_tacon"))
        variantes  = supabase_get_all("variantes?activa=eq.true&select=id,producto_id,color,foto_url,talla")
        inventario = supabase_get_all("inventario?select=variante_id,cantidad")

        inv_map = {i["variante_id"]: int(i.get("cantidad") or 0) for i in (inventario or []) if i.get("variante_id")}
        vars_map: dict = {}
        for v in (variantes or []):
            vars_map.setdefault(v["producto_id"], []).append(v)

        items = []
        for p in productos:
            sku = p.get('sku_interno') or p.get('id')
            pid = p.get('id')
            es_oferta = p.get("es_oferta", False)
            base = float(p.get("precio_menudeo") or 0)
            precio = base if es_oferta else round(base + 80)
            titulo = _titulo_feed(p)
            desc = (p.get("descripcion") or p.get("nombre") or "").strip()
            url_base = f"https://zapatillasmay.mx/producto/{sku}"

            pvars = vars_map.get(pid, [])
            if pvars:
                # Agrupar por color para imagen principal
                colores_vistos = {}
                for v in pvars:
                    c = (v.get("color") or "").strip()
                    if c and c not in colores_vistos:
                        colores_vistos[c] = v

                for v in pvars:
                    color = (v.get("color") or "").strip()
                    talla = (v.get("talla") or "").strip()
                    vid   = v.get("id")
                    stock = inv_map.get(vid, 0)
                    availability = "in stock" if stock > 0 else "out of stock"
                    imagen = (colores_vistos.get(color) or v).get("foto_url") or p.get("imagen_principal", "")
                    color_norm = color.replace(' ','_').replace('/','_').replace('-','_').strip('_')
                    var_id = f"{sku}-{color_norm}-{talla}" if talla else f"{sku}-{color_norm}"
                    if not talla or talla in ('Unica', 'Única', 'unica', 'única'):
                        talla_feed = "One Size"
                    else:
                        talla_feed = talla

                    item = {
                        "sku_id": var_id,
                        "item_group_id": sku,
                        "title": titulo + (f" - {color.title()}" if color else ""),
                        "description": desc,
                        "availability": availability,
                        "condition": "new",
                        "price": f"{precio} MXN",
                        "link": f"{url_base}?color={color_norm}&talla={talla}",
                        "image_link": imagen,
                        "brand": "Zapatillas May",
                        "google_product_category": "187",
                        "color": color,
                        "size": talla_feed,
                        "gender": "female",
                        "age_group": "adult",
                    }
                    if es_oferta:
                        item["sale_price"] = f"{precio} MXN"
                    if p.get("material"):
                        item["material"] = p.get("material")
                    items.append(item)
            else:
                item = {
                    "sku_id": sku,
                    "title": titulo,
                    "description": desc,
                    "availability": "out of stock",
                    "condition": "new",
                    "price": f"{precio} MXN",
                    "link": url_base,
                    "image_link": p.get("imagen_principal", ""),
                    "brand": "Zapatillas May",
                    "google_product_category": "187",
                    "gender": "female",
                    "age_group": "adult",
                }
                if es_oferta:
                    item["sale_price"] = f"{precio} MXN"
                if p.get("material"):
                    item["material"] = p.get("material")
                items.append(item)

        return {"items": items, "total": len(items)}
    except Exception as e:
        return {"error": str(e)}


@router.get("/tiktok/import-excel")
def tiktok_import_excel():
    """Genera CSV listo para importar al TikTok Shop Seller Center."""
    try:
        import csv

        productos  = supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,imagen_principal")
        variantes  = supabase_get_all("variantes?activa=eq.true&select=id,producto_id,color,foto_url,talla")
        inventario = supabase_get_all("inventario?select=variante_id,cantidad")

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

        variantes  = supabase_get_all("variantes?activa=eq.true&select=id,producto_id,color,talla")
        productos  = supabase_get("productos?activo=eq.true&select=id,sku_interno,nombre")
        inventario = supabase_get_all("inventario?select=variante_id,cantidad")

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


@router.post("/seo/purge-template")
def purge_template_cache():
    """Limpia el cache del template de producto.html para que Railway lo vuelva a leer."""
    cache_invalidate_prefix("tpl_producto")
    cache_invalidate_prefix("tpl_index")
    return {"ok": True, "msg": "Cache de templates eliminado."}