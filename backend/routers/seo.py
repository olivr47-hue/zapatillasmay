from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, Response, StreamingResponse, RedirectResponse, HTMLResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch
from cache import cache_get, cache_set, cache_invalidate_prefix, TTL_ESTATICO, TTL_FEEDS
import urllib.request
import urllib.parse
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

# Vercel reutiliza esta página 2 minutos (antes cada visita esperaba ~600 ms a que Railway la armara): la ficha vuelve a pedir
# existencias y precio en vivo desde el navegador, así que el HTML en caché solo trae título, descripción y datos para buscadores.
_CC_SSR_PRODUCTO = {
    "Cache-Control": "public, max-age=0, s-maxage=120, stale-while-revalidate=600",
    # Vercel ignora Cache-Control en páginas que reenvía a otro servidor (rewrites): su memoria se controla con este encabezado propio.
    "Vercel-CDN-Cache-Control": "max-age=120, stale-while-revalidate=600",
}


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
        return HTMLResponse(content=_cached, headers=_CC_SSR_PRODUCTO)
    # 1. Buscar producto por slug (URL amigable para SEO) → SKU (links viejos
    #    ya compartidos/indexados) → id, solo si parece UUID (evita 400 de PostgREST)
    import re as _re
    datos = supabase_get(f"productos?slug=eq.{urllib.parse.quote(sku, safe='')}&activo=eq.true&limit=1")
    if not datos:
        datos = supabase_get(f"productos?sku_interno=eq.{urllib.parse.quote(sku, safe='')}&activo=eq.true&limit=1")
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

    # Título SEO de 30 a 60 caracteres. El SKU interno (D-PLT-0109, C-TAC-0207...) NO va en el título: es un código de bodega, no algo que la
    # clienta busque, y al cortar el texto dejaba títulos rotos («...lisas p C-TAC-0207»). El código de MODELO del fabricante (DD71100, CH2300)
    # ya viene en el nombre del producto y es lo que distingue un título de otro.
    prefix = nombre
    if meta_titulo:
        parts = meta_titulo.split(' | ', 1)
        db_prefix = parts[0].strip()
        if len(db_prefix) > 3:
            prefix = db_prefix

    _SUFIJO = " | Zapatillas May"
    _max_prefix = 60 - len(_SUFIJO)
    if len(prefix) > _max_prefix:
        # se corta en el límite de una palabra y sin dejar conectores colgando («...elegantes de»)
        corte = prefix[:_max_prefix]
        if prefix[_max_prefix] != " " and " " in corte:
            corte = corte.rsplit(" ", 1)[0]
        palabras_corte = corte.rstrip(" ,.-–").split(" ")
        while len(palabras_corte) > 2 and palabras_corte[-1].lower() in ("de", "del", "con", "para", "y", "e", "en", "a", "la", "el", "los", "las", "muy", "por", "sin", "tipo"):
            palabras_corte.pop()
        prefix = " ".join(palabras_corte)
    titulo_seo = f"{prefix}{_SUFIJO}"

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
    _hay_stock = True   # si no se puede comprobar, se asume que hay (no marcar agotado por error)
    imagenes_seo = []
    if imagen:
        imagenes_seo.append(imagen)
    try:
        variantes = supabase_get(
            f"variantes?producto_id=eq.{p['id']}&activa=eq.true&select=id,foto_url,imagenes,color"
        )
        try:
            _ids = [v["id"] for v in (variantes or []) if v.get("id")]
            if _ids:
                _inv = supabase_get(f"inventario?variante_id=in.({','.join(_ids)})&select=cantidad")
                _hay_stock = any((i.get("cantidad") or 0) > 0 for i in (_inv or []))
        except Exception:
            _hay_stock = True
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
    _partes = [f"{nombre}.", f"{_cat_txt} para dama de Zapatillas May, hechos en México con envíos a todo el país."]
    if _det:
        _partes.append("Con " + ", ".join(_det) + ".")
    if colores:
        _partes.append("Disponible en " + ", ".join(colores[:6]) + ".")
    _partes.append("Descuento automático desde 3 pares y envíos a todo México.")
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
        "name": nombre,   # nombre completo del producto (antes salía el título cortado y con el SKU interno)
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
            "availability": "https://schema.org/InStock" if _hay_stock else "https://schema.org/OutOfStock",
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

    # Modelo sin ninguna foto: no se indexa hasta que tenga (Google lo marcaría como página de baja calidad)
    if not imagenes_seo and '</head>' in template:
        template = template.replace('</head>', '<meta name="robots" content="noindex,follow"></head>', 1)

    _gs_cat = GUIA_POR_CATEGORIA.get((p.get("categoria") or "").lower())
    if _gs_cat and "<!-- RESEÑAS -->" in template:
        _gs, _gt = _gs_cat[0]
        _banner = ('<div style="margin:16px;padding:16px 18px;background:#fdf6f1;border:1px solid #eadcd2;border-radius:14px;font-family:DM Sans,sans-serif">'
                   '<p style="margin:0 0 4px;font-size:0.72rem;letter-spacing:.08em;text-transform:uppercase;color:#9a8478;font-weight:700">Guía</p>'
                   f'<a href="/{_gs}" style="color:#2a1f1a;font-weight:700;text-decoration:none;font-size:0.98rem;line-height:1.35;display:block">{_esc_pagina(_gt)} →</a></div>')
        template = template.replace("<!-- RESEÑAS -->", _banner + "\n<!-- RESEÑAS -->", 1)

    cache_set(_ck_ssr, template, ttl=900)  # 15 min
    return HTMLResponse(content=template, headers=_CC_SSR_PRODUCTO)


_GUIA_BANNER_TACONES = (
    '<div style="margin:16px;padding:16px 18px;background:#fdf6f1;border:1px solid #eadcd2;border-radius:14px;font-family:DM Sans,sans-serif">'
    '<p style="margin:0 0 4px;font-size:0.72rem;letter-spacing:.08em;text-transform:uppercase;color:#9a8478;font-weight:700">Guía</p>'
    '<a href="/guia-tacones-8-vs-10-cm" style="color:#2a1f1a;font-weight:700;text-decoration:none;font-size:0.98rem;line-height:1.35;display:block">¿Tacón de 8 o de 10 cm? Cómo elegir el tuyo →</a></div>'
)


# ── #3 — Títulos/descripciones únicos por categoría y páginas fijas (SSR) ──────
# OJO: estos 2 valores deben ser IDÉNTICOS, carácter por carácter, al <title> y
# al <meta name="description"> que está HOY en frontend/tienda/index.html — el
# reemplazo de abajo es un .replace() de texto literal, así que si alguien edita
# el título/descripción de la home en el HTML y no actualiza esto, el SSR de
# categorías deja de funcionar en silencio (no truena, solo no reemplaza nada y
# todas las páginas de categoría se quedan con el título genérico de la home).
# Pasó exactamente eso entre 2026-07 y 2026-09-30: se corrigió comparando
# contra el HTML real.
_HOME_TITLE = "Calzado de Dama | Envíos a todo México | Zapatillas May León"
_HOME_DESC = ("Calzado de dama con estilo, hecho en León, Gto. Pensado para sentirte bien, "
              "no solo lucir bien. Tacones, sandalias, botas y botines. Envíos a todo México, "
              "cambios de talla fáciles.")

# H1 SEO visibles para crawlers por categoría (el hero genérico no tiene keywords de categoría)
_PAGINAS_H1 = {
    "tacones":     "Zapatillas y Tacones de Dama — Aguja, Bloque y Plataforma | Zapatillas May",
    "sandalias":   "Sandalias de Dama — Casuales y de Fiesta | Zapatillas May",
    "botas":       "Botas de Mujer y Dama — Moda y Calidad | Zapatillas May",
    "botines":     "Botines de Dama — Botines de Moda | Zapatillas May",
    "flats":       "Flats y Zapatos Bajos de Dama | Zapatillas May",
    "plataformas": "Plataformas de Dama — Altura y Comodidad | Zapatillas May",
    "tenis":       "Tenis de Dama — Moda Deportiva | Zapatillas May",
    "nina":        "Calzado para Niña — Cómodo y Resistente | Zapatillas May",
    "accesorios":  "Accesorios de Moda para Dama | Zapatillas May",
    "mayoreo":     "Calzado de Dama al Mayoreo en León, Guanajuato — Portal para Mayoristas | Zapatillas May",
    "ofertas":     "Ofertas de Calzado de Dama — Precios Especiales | Zapatillas May",
}

_PAGINAS_SEO = {
    "tacones": ("Tacones y Zapatillas de Dama | Envíos a todo México | Zapatillas May",
                "Zapatillas y tacones de moda para dama fabricados en León, Guanajuato. Descuento automático desde 3 pares: aguja, bloque y plataforma. Envíos a todo México."),
    "sandalias": ("Sandalias de Dama | Envíos a todo México | Zapatillas May León",
                  "Sandalias de moda para dama hechas en León, Guanajuato. Descuento automático desde 3 pares, casuales y de fiesta. Envíos a todo México."),
    "botas": ("Botas de Mujer y Dama | Envíos a todo México | Zapatillas May",
              "Botas de mujer y dama fabricadas en León, Guanajuato. Descuento automático desde 3 pares, en cuero y sintético. Envíos a todo México."),
    "botines": ("Botines de Dama | Envíos a todo México | Zapatillas May León",
                "Botines de moda para dama hechos en León, Guanajuato. Descuento automático desde 3 pares, los últimos estilos. Envíos a todo México."),
    "flats": ("Flats de Dama | Envíos a todo México | Zapatillas May León",
              "Flats y zapatos bajos de dama, cómodos y de moda, fabricados en León, Guanajuato. Descuento automático desde 3 pares. Envíos a todo México."),
    "plataformas": ("Plataformas de Dama | Envíos a todo México | Zapatillas May León",
                    "Plataformas de moda para dama hechas en León, Guanajuato. Altura con comodidad, descuento desde 3 pares. Envíos a todo México."),
    "tenis": ("Tenis de Dama | Envíos a todo México | Zapatillas May León",
              "Tenis de moda para dama fabricados en León, Guanajuato. Descuento automático desde 3 pares, estilo urbano y deportivo. Envíos a todo México."),
    "nina": ("Calzado para Niña | Envíos a todo México | Zapatillas May León",
             "Calzado de moda para niña fabricado en León, Guanajuato. Cómodo y resistente, descuento desde 3 pares. Envíos a todo México."),
    "accesorios": ("Accesorios de Moda | Envíos a todo México | Zapatillas May León",
                   "Accesorios para complementar tu look en Zapatillas May. Fabricado en León, Guanajuato. Mayoreo y menudeo con envíos a todo México."),
    "mayoreo": ("Calzado de Dama al Mayoreo en León — Fábrica | Zapatillas May",
                "Fábrica de calzado de dama en León, Guanajuato: mayoreo por corrida, catálogo con fotos y precios para zapaterías y revendedoras. Registro gratis en el Portal de Mayoristas."),
    "guias": ("Guías de calzado para dama | Zapatillas May",
              "Guías prácticas de Zapatillas May: cómo elegir la altura de tu tacón y cómo comprar calzado al mayoreo directo de fábrica en León, Guanajuato."),
    "guia-tacones-8-vs-10-cm": ("Tacones de 8 cm o de 10 cm: cuál elegir | Zapatillas May",
                                "Guía para elegir entre tacón de 8 y de 10 cm: comodidad, ocasiones de uso y consejos de talla, con modelos reales fabricados en León, Guanajuato."),
    "guia-comprar-calzado-mayoreo-leon": ("Cómo comprar calzado al mayoreo en León, Gto. | Zapatillas May",
                                          "Guía para zapaterías y revendedoras: cómo comprar calzado de dama al mayoreo directo de fábrica en León, qué es una corrida y cómo registrarte en el portal."),
    "ofertas": ("Ofertas de Calzado de Dama | Zapatillas May",
                "Aprovecha las ofertas de calzado femenino de Zapatillas May: tacones, sandalias y más a precios especiales. Envíos a todo México."),
    "nosotros": ("Sobre Nosotras — Fábrica de Calzado | Zapatillas May",
                 "Conoce Zapatillas May, fabricante de calzado femenino de moda en León, Guanajuato. Calidad artesanal en menudeo y mayoreo (Portal de Mayoristas)."),
    "envios": ("Envíos a todo México | Zapatillas May",
               "Información de envíos de Zapatillas May: cobertura nacional, tiempos y costos, con envío gratis desde cierto monto. León, Guanajuato."),
    "contacto": ("Contacto | Zapatillas May — León, Guanajuato",
                 "Contáctanos por WhatsApp, Instagram y redes sociales. Zapatillas May, fábrica de calzado de dama en León, Guanajuato. Mayoreo y menudeo."),
    "tabla-tallas": ("Tabla de Tallas | Zapatillas May",
                     "Consulta la tabla de tallas de Zapatillas May para elegir tu medida correcta. Calzado de dama fabricado en León, Guanajuato."),
    "como-comprar": ("Cómo Comprar — Menudeo y Mayoreo | Zapatillas May",
                     "Guía paso a paso para comprar en Zapatillas May: menudeo con descuento desde 3 pares, mayoreo en el portal, formas de pago y envíos a todo México."),
    "privacidad": ("Aviso de Privacidad | Zapatillas May",
                   "Aviso de privacidad de Zapatillas May. Conoce cómo recopilamos, protegemos y usamos tus datos personales conforme a la ley mexicana."),
    "politica-de-devoluciones": ("Política de Devoluciones — 30 Días | Zapatillas May",
                                  "Política de cambios y devoluciones de Zapatillas May: 30 días sin complicaciones. Conoce las condiciones y el proceso paso a paso."),
}


# Contenido HTML visible para Google en páginas informacionales (sin JS)
_GUIA_INDEX_HTML = '<style>#hero-section,.section,.banner-mayoreo,.cro-trust-strip{display:none!important}.guia{max-width:760px;margin:0 auto;padding:150px 20px 56px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7;font-size:1rem}.guia p{margin:0 0 14px}.guia ul{padding-left:20px;margin:0 0 14px}.guia li{margin-bottom:8px}.guia .g-miga{font-size:.82rem;color:#9a8478;margin:0 0 14px;line-height:1.4}.guia .g-h1,.guia h2,.g-item b{font-variant-numeric:lining-nums;font-feature-settings:"lnum" 1}.guia .g-h1{font-family:Cormorant Garamond,Georgia,serif;font-size:clamp(1.7rem,7vw,2.5rem);font-weight:600;line-height:1.15;margin:0 0 10px;color:#2a1f1a}.guia .g-sub{color:#9a8478;font-size:.9rem;margin:0 0 22px;padding-bottom:18px;border-bottom:1px solid #eadcd2}.guia h2{font-family:Cormorant Garamond,Georgia,serif;font-size:clamp(1.35rem,5vw,1.7rem);font-weight:600;line-height:1.25;margin:34px 0 12px;color:#2a1f1a}.guia a.g-link{color:#C0357F;text-decoration:underline;text-underline-offset:2px}.guia table{width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #eadcd2;border-radius:12px;overflow:hidden}.guia th,.guia td{padding:11px 14px;border-bottom:1px solid #eadcd2;text-align:left;font-size:.92rem;vertical-align:top;line-height:1.5}.guia th{background:#f5ece2;font-weight:700}.guia tr:last-child td{border-bottom:none}.guia td:first-child{font-weight:700;color:#7a6055}.g-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:16px 0 8px}.g-card{display:block;text-decoration:none;color:#3a2e28;background:#fff;border:1px solid #eadcd2;border-radius:14px;overflow:hidden}.g-card img{width:100%;aspect-ratio:1/1;object-fit:cover;object-position:center 70%;display:block;background:#f5ece2}.g-card span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:10px 12px 12px;font-size:.82rem;line-height:1.35;font-weight:600}.g-cta{margin:34px 0;padding:24px 22px;background:linear-gradient(135deg,#fdf0f6,#fdf8f4);border:1px solid #f5c9e0;border-radius:16px;text-align:center}.g-cta p{margin:0 0 14px}.g-btn{display:inline-block;background:#E91E8C;color:#fff!important;font-weight:700;text-decoration:none!important;padding:13px 28px;border-radius:100px}.g-lista{display:grid;gap:14px;margin-top:8px}.g-item{display:block;text-decoration:none;color:#3a2e28;background:#fff;border:1px solid #eadcd2;border-radius:16px;padding:20px 20px 18px}.g-item b{display:block;font-family:Cormorant Garamond,Georgia,serif;font-size:1.35rem;font-weight:600;line-height:1.25;margin-bottom:6px;color:#2a1f1a}.g-item em{display:block;font-style:normal;color:#7a6055;font-size:.92rem;line-height:1.55;margin-bottom:10px}.g-item i{font-style:normal;font-weight:700;color:#C0357F;font-size:.9rem}@media(min-width:700px){.g-grid{grid-template-columns:repeat(4,1fr)}.guia{padding-top:130px}}@media(max-width:600px){.guia table,.guia thead,.guia tbody,.guia tr,.guia td,.guia th{display:block}.guia thead{display:none}.guia table{border:none}.guia tr{border:1px solid #eadcd2;border-radius:12px;margin-bottom:12px;overflow:hidden;background:#fff}.guia td{border-bottom:1px solid #f1e6dd;padding:9px 14px}.guia td:first-child{background:#f5ece2;color:#2a1f1a}.guia td[data-l]::before{content:attr(data-l);display:block;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:#9a8478;font-weight:700;margin-bottom:2px}}</style><section class="guia">\n  <p class="g-miga"><a class="g-link" href="/">Inicio</a> › Guías</p>\n  <h1 class="g-h1">Guías de calzado para dama</h1>\n  <p class="g-sub">Consejos prácticos de la fábrica de Zapatillas May, en León, Guanajuato.</p>\n  <div class="g-lista">\n    <a class="g-item" href="/guia-tacones-8-vs-10-cm"><b>Tacones de 8 cm o de 10 cm: cuál elegir</b><em>Comodidad, ocasiones de uso y consejos de talla, con modelos reales de nuestro catálogo.</em><i>Leer guía →</i></a>\n    <a class="g-item" href="/guia-comprar-calzado-mayoreo-leon"><b>Cómo comprar calzado al mayoreo en León</b><em>Para zapaterías, boutiques y revendedoras: qué es una corrida y cómo hacer tu primer pedido directo con la fábrica.</em><i>Leer guía →</i></a>\n  </div>\n</section>'
_GUIA_TACONES_HTML = '<style>#hero-section,.section,.banner-mayoreo,.cro-trust-strip{display:none!important}.guia{max-width:760px;margin:0 auto;padding:150px 20px 56px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7;font-size:1rem}.guia p{margin:0 0 14px}.guia ul{padding-left:20px;margin:0 0 14px}.guia li{margin-bottom:8px}.guia .g-miga{font-size:.82rem;color:#9a8478;margin:0 0 14px;line-height:1.4}.guia .g-h1,.guia h2,.g-item b{font-variant-numeric:lining-nums;font-feature-settings:"lnum" 1}.guia .g-h1{font-family:Cormorant Garamond,Georgia,serif;font-size:clamp(1.7rem,7vw,2.5rem);font-weight:600;line-height:1.15;margin:0 0 10px;color:#2a1f1a}.guia .g-sub{color:#9a8478;font-size:.9rem;margin:0 0 22px;padding-bottom:18px;border-bottom:1px solid #eadcd2}.guia h2{font-family:Cormorant Garamond,Georgia,serif;font-size:clamp(1.35rem,5vw,1.7rem);font-weight:600;line-height:1.25;margin:34px 0 12px;color:#2a1f1a}.guia a.g-link{color:#C0357F;text-decoration:underline;text-underline-offset:2px}.guia table{width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #eadcd2;border-radius:12px;overflow:hidden}.guia th,.guia td{padding:11px 14px;border-bottom:1px solid #eadcd2;text-align:left;font-size:.92rem;vertical-align:top;line-height:1.5}.guia th{background:#f5ece2;font-weight:700}.guia tr:last-child td{border-bottom:none}.guia td:first-child{font-weight:700;color:#7a6055}.g-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:16px 0 8px}.g-card{display:block;text-decoration:none;color:#3a2e28;background:#fff;border:1px solid #eadcd2;border-radius:14px;overflow:hidden}.g-card img{width:100%;aspect-ratio:1/1;object-fit:cover;object-position:center 70%;display:block;background:#f5ece2}.g-card span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:10px 12px 12px;font-size:.82rem;line-height:1.35;font-weight:600}.g-cta{margin:34px 0;padding:24px 22px;background:linear-gradient(135deg,#fdf0f6,#fdf8f4);border:1px solid #f5c9e0;border-radius:16px;text-align:center}.g-cta p{margin:0 0 14px}.g-btn{display:inline-block;background:#E91E8C;color:#fff!important;font-weight:700;text-decoration:none!important;padding:13px 28px;border-radius:100px}.g-lista{display:grid;gap:14px;margin-top:8px}.g-item{display:block;text-decoration:none;color:#3a2e28;background:#fff;border:1px solid #eadcd2;border-radius:16px;padding:20px 20px 18px}.g-item b{display:block;font-family:Cormorant Garamond,Georgia,serif;font-size:1.35rem;font-weight:600;line-height:1.25;margin-bottom:6px;color:#2a1f1a}.g-item em{display:block;font-style:normal;color:#7a6055;font-size:.92rem;line-height:1.55;margin-bottom:10px}.g-item i{font-style:normal;font-weight:700;color:#C0357F;font-size:.9rem}@media(min-width:700px){.g-grid{grid-template-columns:repeat(4,1fr)}.guia{padding-top:130px}}@media(max-width:600px){.guia table,.guia thead,.guia tbody,.guia tr,.guia td,.guia th{display:block}.guia thead{display:none}.guia table{border:none}.guia tr{border:1px solid #eadcd2;border-radius:12px;margin-bottom:12px;overflow:hidden;background:#fff}.guia td{border-bottom:1px solid #f1e6dd;padding:9px 14px}.guia td:first-child{background:#f5ece2;color:#2a1f1a}.guia td[data-l]::before{content:attr(data-l);display:block;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:#9a8478;font-weight:700;margin-bottom:2px}}</style><section class="guia">\n  <p class="g-miga"><a class="g-link" href="/">Inicio</a> › <a class="g-link" href="/guias">Guías</a> › Tacones de 8 vs 10 cm</p>\n  <h1 class="g-h1">Tacones de 8 cm o de 10 cm: cuál elegir</h1>\n  <p class="g-sub">Por el equipo de Zapatillas May · fábrica de calzado de dama en León, Guanajuato</p>\n  <p>Entre un tacón de 8 cm y uno de 10 cm solo hay dos centímetros, pero se nota mucho al caminar, al estar de pie varias horas y al combinar con la ropa. Esta guía te ayuda a decidir según cómo lo vas a usar.</p>\n  <h2>Comparativa rápida</h2>\n  <table>\n    <thead><tr><th></th><th>Tacón de 8 cm</th><th>Tacón de 10 cm</th></tr></thead>\n    <tbody>\n      <tr><td>Para quién</td><td data-l="Tacón de 8 cm">Quien busca elegancia sin sacrificar tanta comodidad</td><td data-l="Tacón de 10 cm">Quien quiere el máximo estilizado y está acostumbrada al tacón alto</td></tr>\n      <tr><td>Uso recomendado</td><td data-l="Tacón de 8 cm">Oficina, cenas, eventos de varias horas</td><td data-l="Tacón de 10 cm">Fiestas, bodas, salidas de noche, sesiones de fotos</td></tr>\n      <tr><td>Al caminar</td><td data-l="Tacón de 8 cm">Más estable; el pie queda menos inclinado</td><td data-l="Tacón de 10 cm">Exige más equilibrio y se cansa antes el empeine</td></tr>\n      <tr><td>Con plataforma al frente</td><td data-l="Tacón de 8 cm">Casi se siente como un tacón más bajo</td><td data-l="Tacón de 10 cm">Una plataforma de 1–2 cm reduce la inclinación real del pie</td></tr>\n    </tbody>\n  </table>\n  <h2>Cómo elegir según la ocasión</h2>\n  <ul>\n    <li><strong>Si los vas a usar mucho tiempo:</strong> empieza por 8 cm, y si te gustan más altos busca un modelo con plataforma o con tacón de bloque, que reparte mejor el peso que uno de aguja.</li>\n    <li><strong>Si es para un evento específico:</strong> 10 cm da la silueta más alargada en vestidos y faldas largas.</li>\n    <li><strong>Si no estás segura:</strong> prueba una altura intermedia como 9 cm, o elige 8 cm con detalles (tiras, pulsera al tobillo) que den sujeción.</li>\n  </ul>\n  <h2>Consejos para que te queden bien</h2>\n  <ul>\n    <li>Pruébalos por la tarde, cuando el pie está un poco más hinchado, para que no te aprieten al final del día.</li>\n    <li>Revisa la <a class="g-link" href="/tabla-tallas">tabla de tallas</a> y mide tu pie; si estás entre dos tallas, elige la mayor en modelos de punta cerrada.</li>\n    <li>Las tiras al tobillo ayudan a que el pie no se deslice hacia adelante en tacones altos.</li>\n    <li>Camina con ellos unos minutos en casa antes de estrenarlos en un evento largo.</li>\n  </ul>\n  <h2>Modelos de 8 cm</h2>\n  <!--GUIA_TACONES_8-->\n  <h2>Modelos de 10 cm</h2>\n  <!--GUIA_TACONES_10-->\n  <div class="g-cta">\n    <p style="font-size:1.1rem;font-weight:700;margin:0 0 6px">Ver todos los tacones</p>\n    <p style="margin:0 0 16px;color:#7a6055">Filtra por color y talla, y si compras 3 o más pares el descuento se aplica solo en el carrito. Envíos a todo México.</p>\n    <a class="g-btn" href="/tacones">Ver tacones →</a>\n  </div>\n  <h2>Preguntas frecuentes</h2>\n  <p><strong>¿Cuál es la altura de tacón más cómoda?</strong><br>Depende de cada persona, pero para uso de varias horas la mayoría prefiere alturas de 5 a 8 cm, sobre todo en bloque o con plataforma.</p>\n  <p><strong>¿Cada modelo indica su altura?</strong><br>Sí, la ficha de cada producto muestra la altura del tacón en centímetros.</p>\n  <p><strong>¿Hacen envíos a todo México?</strong><br>Sí, enviamos a toda la República en 1 a 3 días hábiles.</p>\n</section>'
_GUIA_MAYOREO_HTML = '<style>#hero-section,.section,.banner-mayoreo,.cro-trust-strip{display:none!important}.guia{max-width:760px;margin:0 auto;padding:150px 20px 56px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7;font-size:1rem}.guia p{margin:0 0 14px}.guia ul{padding-left:20px;margin:0 0 14px}.guia li{margin-bottom:8px}.guia .g-miga{font-size:.82rem;color:#9a8478;margin:0 0 14px;line-height:1.4}.guia .g-h1,.guia h2,.g-item b{font-variant-numeric:lining-nums;font-feature-settings:"lnum" 1}.guia .g-h1{font-family:Cormorant Garamond,Georgia,serif;font-size:clamp(1.7rem,7vw,2.5rem);font-weight:600;line-height:1.15;margin:0 0 10px;color:#2a1f1a}.guia .g-sub{color:#9a8478;font-size:.9rem;margin:0 0 22px;padding-bottom:18px;border-bottom:1px solid #eadcd2}.guia h2{font-family:Cormorant Garamond,Georgia,serif;font-size:clamp(1.35rem,5vw,1.7rem);font-weight:600;line-height:1.25;margin:34px 0 12px;color:#2a1f1a}.guia a.g-link{color:#C0357F;text-decoration:underline;text-underline-offset:2px}.guia table{width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #eadcd2;border-radius:12px;overflow:hidden}.guia th,.guia td{padding:11px 14px;border-bottom:1px solid #eadcd2;text-align:left;font-size:.92rem;vertical-align:top;line-height:1.5}.guia th{background:#f5ece2;font-weight:700}.guia tr:last-child td{border-bottom:none}.guia td:first-child{font-weight:700;color:#7a6055}.g-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:16px 0 8px}.g-card{display:block;text-decoration:none;color:#3a2e28;background:#fff;border:1px solid #eadcd2;border-radius:14px;overflow:hidden}.g-card img{width:100%;aspect-ratio:1/1;object-fit:cover;object-position:center 70%;display:block;background:#f5ece2}.g-card span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:10px 12px 12px;font-size:.82rem;line-height:1.35;font-weight:600}.g-cta{margin:34px 0;padding:24px 22px;background:linear-gradient(135deg,#fdf0f6,#fdf8f4);border:1px solid #f5c9e0;border-radius:16px;text-align:center}.g-cta p{margin:0 0 14px}.g-btn{display:inline-block;background:#E91E8C;color:#fff!important;font-weight:700;text-decoration:none!important;padding:13px 28px;border-radius:100px}.g-lista{display:grid;gap:14px;margin-top:8px}.g-item{display:block;text-decoration:none;color:#3a2e28;background:#fff;border:1px solid #eadcd2;border-radius:16px;padding:20px 20px 18px}.g-item b{display:block;font-family:Cormorant Garamond,Georgia,serif;font-size:1.35rem;font-weight:600;line-height:1.25;margin-bottom:6px;color:#2a1f1a}.g-item em{display:block;font-style:normal;color:#7a6055;font-size:.92rem;line-height:1.55;margin-bottom:10px}.g-item i{font-style:normal;font-weight:700;color:#C0357F;font-size:.9rem}@media(min-width:700px){.g-grid{grid-template-columns:repeat(4,1fr)}.guia{padding-top:130px}}@media(max-width:600px){.guia table,.guia thead,.guia tbody,.guia tr,.guia td,.guia th{display:block}.guia thead{display:none}.guia table{border:none}.guia tr{border:1px solid #eadcd2;border-radius:12px;margin-bottom:12px;overflow:hidden;background:#fff}.guia td{border-bottom:1px solid #f1e6dd;padding:9px 14px}.guia td:first-child{background:#f5ece2;color:#2a1f1a}.guia td[data-l]::before{content:attr(data-l);display:block;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:#9a8478;font-weight:700;margin-bottom:2px}}</style><section class="guia">\n  <p class="g-miga"><a class="g-link" href="/">Inicio</a> › <a class="g-link" href="/guias">Guías</a> › Cómo comprar al mayoreo</p>\n  <h1 class="g-h1">Cómo comprar calzado al mayoreo en León, Guanajuato</h1>\n  <p class="g-sub">Guía para zapaterías, boutiques y revendedoras · directo con la fábrica</p>\n  <p>León es la capital del calzado en México, pero comprar al mayoreo sin conocer a nadie puede ser confuso. Zapatillas May es fábrica de calzado de dama y atiende pedidos de mayoreo a todo el país a través de su <strong>Portal de Mayoristas</strong>. Así funciona.</p>\n  <h2>1. Regístrate en el portal (gratis)</h2>\n  <p>Crea tu cuenta en <a class="g-link" href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener">portal.zapatillasmay.mx</a>. No necesitas tener un local establecido para empezar. Dentro verás el catálogo completo con fotos y tus precios de mayoreo.</p>\n  <h2>2. Entiende qué es una corrida</h2>\n  <p>Una corrida es un mismo modelo en todos los colores y tallas disponibles. Es lo más cómodo para surtir una tienda porque cubres todas las tallas de tus clientas, y es la forma de comprar con el mejor precio por par.</p>\n  <h2>3. Cómo bajan los precios según el volumen</h2>\n  <table>\n    <thead><tr><th>Cantidad</th><th>Descuento por par</th><th>Dónde</th></tr></thead>\n    <tbody>\n      <tr><td>1–2 pares</td><td data-l="Descuento por par">Precio de menudeo</td><td data-l="Dónde">Tienda en línea</td></tr>\n      <tr><td>3–5 pares</td><td data-l="Descuento por par">−$60 MXN</td><td data-l="Dónde">Tienda en línea (automático en el carrito)</td></tr>\n      <tr><td>6 o más pares</td><td data-l="Descuento por par">−$100 MXN</td><td data-l="Dónde">Portal de Mayoristas</td></tr>\n      <tr><td>Corrida completa</td><td data-l="Descuento por par">Hasta −$180 MXN</td><td data-l="Dónde">Portal de Mayoristas</td></tr>\n    </tbody>\n  </table>\n  <p>Los precios de mayoreo se manejan únicamente en el portal; los de la tienda en línea son de menudeo.</p>\n  <h2>4. Arma tu pedido</h2>\n  <p>En el portal armas tu carrito mezclando modelos, colores y tallas, y puedes apartar tus pares. Después das seguimiento a tu pedido desde la misma cuenta.</p>\n  <h2>5. Envío a todo México</h2>\n  <p>Los pedidos de mayoreo se envían por paquetería con número de guía para rastreo. También despachamos a Estados Unidos y Canadá.</p>\n  <h2>Cambios y garantía</h2>\n  <ul>\n    <li><strong>Cambios (22 días):</strong> dentro de los primeros 22 días desde que recibes tu pedido puedes cambiar por cualquier otro estilo, con el calzado sin uso, limpio y en su caja (sujeto a existencia).</li>\n    <li><strong>Garantía (30 días):</strong> defectos de fábrica en costuras, pegado, suela o materiales. Aplica cuando el par se entrega en nuestra tienda física (Cuautla 211, Col. Killian, León, Gto.) para hacer la devolución.</li>\n    <li>La paquetería corre por cuenta del comprador.</li>\n    <li>Herrajes y pedrería: no hay devoluciones por su acabado artesanal.</li>\n    <li>No se aceptan zapatos mojados, sucios, usados ni alterados; la garantía no cubre desgaste normal, golpes, humedad ni un uso distinto al que fue fabricado.</li>\n  </ul>\n  <h2>Consejos para tu primer pedido</h2>\n  <ul>\n    <li>Combina estilos: así pruebas qué rota mejor en tu zona antes de comprar más de un solo modelo.</li>\n    <li>Revisa la <a class="g-link" href="/tabla-tallas">tabla de tallas</a> para que tus clientas elijan bien y bajen las devoluciones.</li>\n    <li>Puedes usar las fotos y videos de los modelos para promocionarlos en tus redes sociales.</li>\n    <li>Si tienes dudas, escríbenos por WhatsApp y una asesora te ayuda a armar el pedido.</li>\n  </ul>\n  <div class="g-cta">\n    <p style="font-size:1.1rem;font-weight:700;margin:0 0 6px">¿Lista para surtir tu tienda?</p>\n    <p style="margin:0 0 16px;color:#7a6055">Regístrate gratis y ve tu catálogo con precios de mayoreo.</p>\n    <a class="g-btn" href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener">Entrar al portal de mayoristas →</a>\n    <p style="margin:14px 0 0"><a class="g-link" href="https://wa.me/5214792244560?text=Hola%2C%20quiero%20informaci%C3%B3n%20de%20mayoreo" target="_blank" rel="noopener">o escríbenos por WhatsApp</a></p>\n  </div>\n</section>'

from routers.seo_guias import GUIAS as _GUIAS_NUEVAS, GUIA_POR_CATEGORIA, construir_guia, construir_indice
_GUIA_CSS = re.search(r"<style>.*?</style>", _GUIA_TACONES_HTML, re.S).group(0)
_GUIA_INDEX_HTML = construir_indice(_GUIA_CSS)
for _s_g, _g_g in _GUIAS_NUEVAS.items():
    _PAGINAS_SEO[_s_g] = (_g_g["title"], _g_g["desc"])

_PAGINAS_CONTENT = {
    **{_s_g: construir_guia(_s_g, _GUIA_CSS) for _s_g in _GUIAS_NUEVAS},
    "guias": _GUIA_INDEX_HTML,
    "guia-tacones-8-vs-10-cm": _GUIA_TACONES_HTML,
    "guia-comprar-calzado-mayoreo-leon": _GUIA_MAYOREO_HTML,
    "nosotros": """
<section style="max-width:800px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Sobre Zapatillas May</h1>
  <p style="color:#7a6055;margin-bottom:24px">Fabricante de calzado femenino en León, Guanajuato</p>
  <p>Somos una empresa familiar fabricante de calzado femenino de moda con sede en <strong>León, Guanajuato</strong>, la capital mundial del calzado. Llevamos años produciendo tacones, sandalias, botas, botines, flats y plataformas con materiales de calidad y diseños actuales.</p>
  <h2 style="font-size:1.2rem;margin-top:32px">Directo del fabricante</h2>
  <p>Al comprar en Zapatillas May adquieres calzado directamente de la fábrica, sin intermediarios. Eso nos permite ofrecerte precios competitivos tanto en menudeo (con <strong>descuento automático desde 3 pares</strong>) como en mayoreo por corrida a través del Portal de Mayoristas.</p>
  <h2 style="font-size:1.2rem;margin-top:32px">Precios de mayoreo automáticos</h2>
  <ul style="padding-left:20px">
    <li>1–2 pares: precio de menudeo</li>
    <li>3–5 pares: $60 MXN menos por par</li>
    <li>6+ pares y corridas: precios especiales de mayoreo en el <a href="https://portal.zapatillasmay.mx">Portal de Mayoristas</a></li>
  </ul>
  <p>El descuento de 3 a 5 pares se aplica automáticamente al agregar pares al carrito — sin códigos ni trámites.</p>
  <h2 style="font-size:1.2rem;margin-top:32px">Envíos a todo México</h2>
  <p>Enviamos a toda la República Mexicana por paquetería en 1 a 3 días hábiles. También realizamos envíos a <strong>Estados Unidos y Canadá</strong>.</p>
  <p style="margin-top:24px">Más de 3,000 pares vendidos a clientas satisfechas en toda la República.</p>
</section>""",
    "contacto": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Contacto</h1>
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
  <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Información de Envíos</h1>
  <p style="color:#7a6055;margin-bottom:24px">Enviamos a toda la República Mexicana</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Costos de envío</h2>
  <ul style="padding-left:20px">
    <li><strong>1 par:</strong> $99 MXN</li>
    <li><strong>2 pares:</strong> $150 MXN</li>
    <li><strong>3 o más pares:</strong> $199 MXN</li>
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
  <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Tabla de Tallas</h1>
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
  <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Cómo Comprar</h1>
  <p style="color:#7a6055;margin-bottom:24px">Menudeo y mayoreo sin complicaciones</p>
  <h2 style="font-size:1.2rem;margin-top:24px">Paso a paso</h2>
  <ol style="padding-left:20px">
    <li style="margin-bottom:10px"><strong>Explora el catálogo</strong> — navega por categoría o usa el buscador para encontrar tu modelo.</li>
    <li style="margin-bottom:10px"><strong>Elige talla y color</strong> — selecciona la variante que quieras en la página del producto.</li>
    <li style="margin-bottom:10px"><strong>Agrega al carrito</strong> — el descuento por varios pares se aplica automáticamente al agregar 3 o más pares.</li>
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
    <li>6+ pares y corridas: precios especiales en el <a href="https://portal.zapatillasmay.mx">Portal de Mayoristas</a></li>
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
      <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.78rem;font-weight:600">💰 Precios de mayoreo (solo en el portal)</span>
      <span style="background:rgba(255,255,255,0.18);border-radius:100px;padding:6px 14px;font-size:0.78rem;font-weight:600">📱 Pide desde tu celular</span>
    </div>
    <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" style="display:inline-block;background:white;color:#E91E8C;font-weight:800;text-decoration:none;padding:13px 32px;border-radius:100px;font-size:0.95rem">Entrar al portal de mayoristas →</a>
  </div>
  <h2 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Calzado de Dama al Mayoreo — Fábrica en León, Guanajuato</h2>
  <p style="color:#7a6055;margin-bottom:24px">Para zapaterías, boutiques y revendedoras · Envíos a todo México</p>
  <p>Somos fabricantes de calzado de dama en León, Guanajuato. Si compras para revender, el <strong>Portal de Mayoristas</strong> te da tu catálogo con fotos, tus precios de mayoreo, el armado de tu corrida por talla y color y el seguimiento de tus pedidos. El registro es gratuito. <strong>El mínimo para precios de mayoreo es de 6 pares</strong>, y pueden ser de diferentes modelos, colores y tallas.</p>
  <h2 style="font-size:1.2rem;margin-top:28px">Cómo bajan los precios según lo que compras</h2>
  <table style="width:100%;border-collapse:collapse;margin-top:12px">
    <thead><tr style="background:#f5ece2">
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">Cantidad</th>
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">Descuento por par</th>
      <th style="padding:8px 12px;text-align:left;border:1px solid #e8d8cc">Dónde</th>
    </tr></thead>
    <tbody>
      <tr><td style="padding:8px 12px;border:1px solid #e8d8cc">1–2 pares</td><td style="padding:8px 12px;border:1px solid #e8d8cc">Precio de menudeo</td><td style="padding:8px 12px;border:1px solid #e8d8cc">zapatillasmay.mx</td></tr>
      <tr style="background:#fdf8f4"><td style="padding:8px 12px;border:1px solid #e8d8cc">3–5 pares</td><td style="padding:8px 12px;border:1px solid #e8d8cc">−$60 MXN por par</td><td style="padding:8px 12px;border:1px solid #e8d8cc">zapatillasmay.mx (descuento automático en el carrito)</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e8d8cc">6+ pares</td><td style="padding:8px 12px;border:1px solid #e8d8cc">−$100 MXN por par</td><td style="padding:8px 12px;border:1px solid #e8d8cc">Portal de Mayoristas</td></tr>
      <tr style="background:#fdf8f4"><td style="padding:8px 12px;border:1px solid #e8d8cc">Corrida completa</td><td style="padding:8px 12px;border:1px solid #e8d8cc">−$180 MXN por par</td><td style="padding:8px 12px;border:1px solid #e8d8cc">Portal de Mayoristas</td></tr>
    </tbody>
  </table>
  <p style="margin-top:18px">¿Primera vez comprando al mayoreo? Lee la <a href="/guia-comprar-calzado-mayoreo-leon" style="color:#E91E8C">guía para comprar calzado al mayoreo en León</a>.</p>
  <h2 style="font-size:1.2rem;margin-top:28px">¿Qué es una corrida?</h2>
  <p>Una corrida es un mismo modelo en todos los colores y tallas disponibles — ideal para revendedoras y tiendas. Al completar una corrida obtienes el mejor precio por par.</p>
  <div style="margin-top:28px;padding:22px 24px;background:linear-gradient(135deg,#fdf0f6,#fdf8f4);border:1px solid #f5c9e0;border-radius:14px;text-align:center">
    <p style="font-size:1.05rem;font-weight:700;margin:0 0 6px;color:#3a2e28">¿Buscas comprar por corrida completa?</p>
    <p style="margin:0 0 16px;color:#7a6055">Entra a nuestro Portal de Mayoristas: precios especiales, arma tu corrida por talla y color, descarga catálogos y haz tu pedido directo.</p>
    <a href="https://portal.zapatillasmay.mx" target="_blank" rel="noopener" style="display:inline-block;background:#E91E8C;color:white;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:100px">Entrar al portal de mayoristas →</a>
  </div>
  <h2 style="font-size:1.2rem;margin-top:28px">Cambios y garantía para mayoristas</h2>
  <ul style="padding-left:20px">
    <li><strong>Cambios (22 días):</strong> dentro de los primeros 22 días desde que recibes tu pedido puedes cambiar por <strong>cualquier otro estilo</strong>. El calzado debe estar sin uso, limpio y en su caja, y el cambio está sujeto a existencia.</li>
    <li><strong>Garantía (30 días):</strong> cubre defectos de fábrica en costuras, pegado, suela o materiales. Aplica cuando el par se entrega en nuestra tienda física (Cuautla 211, Col. Killian, León, Gto.) para poder hacer la devolución.</li>
    <li><strong>Paquetería:</strong> el costo del envío corre por cuenta del comprador.</li>
    <li><strong>Herrajes y pedrería:</strong> no hay devoluciones por su acabado artesanal (pequeñas variaciones son normales en piezas hechas a mano).</li>
    <li><strong>No se aceptan</strong> zapatos mojados, sucios, usados ni alterados. La garantía tampoco cubre desgaste normal, golpes, humedad, mala conservación ni un uso distinto a aquel para el que fue fabricado el calzado.</li>
  </ul>
  <h2 style="font-size:1.2rem;margin-top:28px">¿Solo quieres unos cuantos pares?</h2>
  <p>Si tu compra es para ti o para pocos pares, puedes comprar directo en <a href="/" style="color:#E91E8C">zapatillasmay.mx</a>: desde 3 pares el descuento de $60 por par se aplica automáticamente en el carrito, sin registro. Para 6 pares en adelante y corridas completas, el registro en el Portal de Mayoristas es gratuito.</p>
  <h2 style="font-size:1.2rem;margin-top:28px">Precios de mayoreo solo en el portal</h2>
  <p>Fabricamos y surtimos sandalias, tacones, botas, botines, flats, plataformas y tenis de dama. <strong>Los precios de mayoreo se manejan únicamente en el Portal de Mayoristas</strong>: los precios de la tienda en línea son de menudeo. Regístrate gratis en el portal para ver el catálogo completo con fotos y tus precios.</p>
  <p style="margin-top:18px"><a href="https://wa.me/5214792244560?text=Hola%2C%20quiero%20informaci%C3%B3n%20de%20mayoreo" target="_blank" rel="noopener" style="display:inline-block;border:2px solid #25D366;color:#128C4A;font-weight:700;text-decoration:none;padding:10px 24px;border-radius:100px">Escríbenos por WhatsApp para mayoreo</a></p>
</section>""",
    "privacidad": """
<section style="max-width:700px;margin:40px auto;padding:0 20px;font-family:DM Sans,sans-serif;color:#3a2e28;line-height:1.7">
  <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Aviso de Privacidad</h1>
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
  <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:8px">Política de Devoluciones</h1>
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
        {"q": "¿Hay descuento si compro varios pares de tacones?",
         "a": "Sí. Con 3–5 pares el descuento es de $60 MXN por par y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más pares: −$100 MXN por par; corrida completa: hasta −$180 MXN por par) están en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿Qué tallas manejan en tacones?",
         "a": "La mayoría de nuestros modelos de tacones están disponibles en tallas del 22 al 27 (numeración mexicana), equivalentes a las tallas 5 a 10 US. Algunos modelos especiales pueden tener rango reducido; consulta la ficha de cada producto."},
        {"q": "¿Hacen envíos de tacones a todo México?",
         "a": "Sí, enviamos a toda la República Mexicana en 1 a 3 días hábiles. El costo de envío parte de $99 MXN por 1 par y es gratis en pedidos de $1,299 MXN o más."},
    ],
    "sandalias": [
        {"q": "¿Qué estilos de sandalias tienen disponibles?",
         "a": "Contamos con sandalias casuales, de fiesta, de cuña, planas y con tiras para dama, fabricadas en León, Guanajuato. Tenemos modelos para playa, uso diario y eventos en materiales como cuero sintético, textil y charol."},
        {"q": "¿Hay descuento por varios pares de sandalias?",
         "a": "Sí. Con 3–5 pares el descuento es de $60 MXN por par y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más pares: −$100 MXN por par; corrida completa: hasta −$180 MXN por par) están en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿Las sandalias están disponibles en talla grande?",
         "a": "Manejamos tallas del 22 al 27 (MX) en la mayoría de modelos de sandalias. Si necesitas una talla especial o tienes dudas sobre disponibilidad, escríbenos por WhatsApp antes de realizar tu pedido."},
        {"q": "¿Cuánto tarda en llegar un pedido de sandalias?",
         "a": "Los pedidos se procesan el mismo día si se realizan antes de las 2 pm hora del centro. La entrega es de 1 a 3 días hábiles a toda la República Mexicana."},
    ],
    "botas": [
        {"q": "¿Qué tipos de botas para mujer tienen?",
         "a": "Manejamos botas altas, medianas y cortas para mujer en materiales como cuero sintético, charol y textil. Nuestros modelos van desde botas de moda urbana hasta botas vaqueras y de temporada, fabricadas en León, Guanajuato."},
        {"q": "¿Hay descuento por varios pares de botas?",
         "a": "Sí. Con 3–5 pares el descuento es de $60 MXN por par y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más pares: −$100 MXN por par; corrida completa: hasta −$180 MXN por par) están en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿Las botas tienen garantía de fabricación?",
         "a": "Sí. Aceptamos devoluciones y cambios dentro de los 30 días naturales si el producto presenta defecto de fabricación. En ese caso cubrimos el costo del envío de devolución."},
        {"q": "¿Tienen botas para temporada de frío?",
         "a": "Sí, actualizamos el catálogo cada temporada con nuevos modelos de botas. Puedes revisar las novedades en nuestra tienda en línea o preguntarnos por WhatsApp por los modelos más recientes."},
    ],
    "botines": [
        {"q": "¿Qué estilos de botines manejan?",
         "a": "Tenemos botines con tacón, botines planos, con hebilla, con cremallera y con elástico para dama. Todos fabricados en León, Guanajuato en materiales de calidad: cuero sintético, ante, charol y textil."},
        {"q": "¿Hay descuento por varios pares de botines?",
         "a": "Sí. Con 3–5 pares el descuento es de $60 MXN por par y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más pares: −$100 MXN por par; corrida completa: hasta −$180 MXN por par) están en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿Los botines vienen en corrida completa de tallas?",
         "a": "Sí, pero la corrida completa (un mismo modelo en todas las tallas disponibles) con el mejor precio por par ($180 MXN menos que el precio de menudeo) está disponible solo en el Portal de Mayoristas."},
        {"q": "¿Hacen envíos de botines a todo México?",
         "a": "Sí. Enviamos botines a toda la República en 1 a 3 días hábiles. El envío es gratis en pedidos de $1,299 MXN o más."},
    ],
    "flats": [
        {"q": "¿Qué son los flats y qué modelos tienen?",
         "a": "Los flats son zapatos de piso sin tacón, cómodos para uso diario. En Zapatillas May manejamos flats tipo bailarina, mocasín, loafer y puntiagudos para dama, fabricados en León, Guanajuato en cuero sintético, charol y textil."},
        {"q": "¿Hay descuento por varios pares de flats?",
         "a": "Sí. Con 3–5 pares el descuento es de $60 MXN por par y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más pares: −$100 MXN por par; corrida completa: hasta −$180 MXN por par) están en el Portal de Mayoristas, con registro gratuito."},
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
        {"q": "¿Hay descuento por varios pares de plataformas?",
         "a": "Sí. Con 3–5 pares el descuento es de $60 MXN por par y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más pares: −$100 MXN por par; corrida completa: hasta −$180 MXN por par) están en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿En qué materiales están disponibles las plataformas?",
         "a": "Manejamos plataformas en cuero sintético, charol, ante y textil en distintos colores de temporada. Consulta el catálogo actualizado en nuestra tienda en línea."},
    ],
    "tenis": [
        {"q": "¿Qué tipo de tenis para dama venden?",
         "a": "Vendemos tenis de moda urbana y casual para dama, fabricados en León, Guanajuato. Nuestros modelos incluyen tenis plataforma, tenis chunky y tenis ligeros para uso diario en materiales textiles y sintéticos."},
        {"q": "¿Hay descuento por varios pares de tenis?",
         "a": "Sí. Con 3–5 pares el descuento es de $60 MXN por par y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más pares: −$100 MXN por par; corrida completa: hasta −$180 MXN por par) están en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿Tienen tenis deportivos o solo de moda?",
         "a": "Nuestro catálogo está enfocado en tenis de moda y estilo urbano para dama. No manejamos tenis deportivos de alto rendimiento. Son ideales para uso casual, escolar y street style."},
        {"q": "¿Cuánto tarda el envío de tenis?",
         "a": "El envío es de 1 a 3 días hábiles a toda la República Mexicana. Enviamos también a Estados Unidos y Canadá (consultar costo por WhatsApp)."},
    ],
    "nina": [
        {"q": "¿Qué tipos de calzado para niña manejan?",
         "a": "Tenemos zapatillas, sandalias, botines y zapatos escolares para niña, fabricados en León, Guanajuato. Los modelos están diseñados para ser cómodos, resistentes y de moda para las más pequeñas."},
        {"q": "¿Hay descuento por varios pares de calzado de niña?",
         "a": "Sí. Con 3–5 pares el descuento es de $60 MXN por par y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más pares: −$100 MXN por par; corrida completa: hasta −$180 MXN por par) están en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿Qué tallas manejan en calzado para niña?",
         "a": "Manejamos tallas infantiles desde el 14 hasta el 21 (MX) aproximadamente, dependiendo del modelo. Consulta la ficha de cada producto o escríbenos por WhatsApp para verificar disponibilidad en tallas específicas."},
        {"q": "¿El calzado de niña es de buena calidad y resistente?",
         "a": "Sí. Nuestro calzado infantil está fabricado con materiales seleccionados para resistir el uso activo de las niñas, con suelas antiderrapantes y puntas reforzadas. Fabricado directamente en León, Guanajuato."},
    ],
    "accesorios": [
        {"q": "¿Qué tipo de accesorios venden?",
         "a": "Manejamos accesorios de moda para complementar tus outfits: bolsas, cinturones y complementos de moda fabricados o distribuidos desde León, Guanajuato. El catálogo se actualiza con cada temporada."},
        {"q": "¿Hay descuento por varias piezas de accesorios?",
         "a": "Sí. Con 3–5 piezas el descuento es de $60 MXN por pieza y se aplica solo en el carrito, sin registro. Los precios de mayoreo (6 o más piezas: −$100 MXN por pieza; corrida completa: hasta −$180 MXN por pieza) están en el Portal de Mayoristas, con registro gratuito."},
        {"q": "¿Hacen envíos de accesorios a todo México?",
         "a": "Sí. Enviamos accesorios a toda la República Mexicana en 1 a 3 días hábiles. El envío es gratis en pedidos de $1,299 MXN o más."},
    ],
    "mayoreo": [
        {"q": "¿Cuál es el mínimo de compra para precios de mayoreo?",
         "a": "El mínimo para precios de mayoreo es de 6 pares, y pueden ser de diferentes modelos, estilos, colores y tallas. Los precios de mayoreo se ven al registrarte, de forma gratuita, en el Portal de Mayoristas."},
        {"q": "¿Puedo usar sus fotos y videos para promocionar los modelos en mis redes sociales?",
         "a": "Sí. Las clientas mayoristas pueden usar las fotos y videos de los modelos para promocionarlos en sus redes sociales."},
        {"q": "¿Cómo manejan los cambios y la garantía en mayoreo?",
         "a": "Cambios: dentro de los primeros 22 días desde que recibes tu pedido puedes cambiar por cualquier otro estilo; el calzado debe estar sin uso, limpio y en su caja, y el cambio está sujeto a existencia. Garantía: 30 días por defectos de fábrica (costuras, pegado, suela o materiales); aplica cuando el par se entrega en nuestra tienda física (Cuautla 211, Col. Killian, León, Gto.) para hacer la devolución. No cubre desgaste normal, daños por humedad, golpes, modificaciones, mala conservación ni uso distinto al que fue fabricado el calzado. En herrajes y pedrería no hay devoluciones por su acabado artesanal. No se aceptan zapatos mojados, sucios ni usados. El costo de la paquetería corre por cuenta del comprador."},
        {"q": "¿Tienen catálogo con fotos y precios de mayoreo?",
         "a": "Sí. Al registrarte gratis en el Portal de Mayoristas (portal.zapatillasmay.mx) ves el catálogo completo con fotos, tus precios de mayoreo y la disponibilidad por talla y color, y armas tu corrida o tu pedido ahí mismo."},
        {"q": "¿Cómo compro calzado al mayoreo en Zapatillas May?",
         "a": "Regístrate gratis en el Portal de Mayoristas (portal.zapatillasmay.mx): ahí ves el catálogo completo con fotos, tus precios de mayoreo, armas tu corrida por talla y color y haces tu pedido directo con la fábrica en León, Guanajuato."},
        {"q": "¿Hay descuento si compro pocos pares en la tienda en línea?",
         "a": "Sí. Desde 3 pares el descuento es de $60 MXN por par y se aplica automáticamente en el carrito de zapatillasmay.mx, sin registro ni RFC. Con 6 o más pares ($100 MXN menos por par) y corrida completa (hasta $180 MXN menos por par) los precios están en el Portal de Mayoristas."},
        {"q": "¿Puedo mezclar modelos y tallas en mi pedido?",
         "a": "Sí. Puedes combinar diferentes modelos, colores y tallas en un mismo pedido. El descuento se calcula sobre el total de pares en el carrito, no por modelo."},
        {"q": "¿Qué es una corrida completa?",
         "a": "Una corrida es un mismo modelo en todos sus colores y tallas disponibles. Es la opción ideal para tiendas y revendedoras y da el mejor precio: hasta $180 MXN menos por par que el menudeo. Está disponible solo en el Portal de Mayoristas."},
        {"q": "¿Hacen envíos de pedidos de mayoreo a todo México?",
         "a": "Sí. Enviamos a toda la República Mexicana en 1 a 3 días hábiles. Los pedidos grandes se envían por paquetería terrestre con número de guía para rastreo. También despachamos a EE.UU. y Canadá."},
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
            'content="Zapatillas May — Calzado de Moda para Dama | León, Guanajuato"',
            f'content="{_esc_pagina(titulo)}"'
        )  # og:title si comparte el texto del title
        template = template.replace(
            '<meta property="og:url" content="https://zapatillasmay.mx/">',
            f'<meta property="og:url" content="{canonical}">'
        )
        template = template.replace(
            'content="Calzado de moda para dama. Tacones, sandalias, botas y botines. Hecho en León, Guanajuato. Envíos a todo México."',
            f'content="{_esc_pagina(desc)}"'
        )  # og:description

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

        if slug in _GUIAS_SLUGS:
            try:
                template = _guia_extras(slug, template, titulo, desc, canonical)
            except Exception as e:
                print(f"[seo] guia extras error ({slug}): {e}")

        # ItemList + BreadcrumbList schema para categorías (rich results en SERP)
        _cat_productos = []
        try:
            _cat_productos = supabase_get(
                f"productos?activo=eq.true&categoria=eq.{slug}&select=sku_interno,slug,nombre,meta_titulo,imagen_principal,precio_menudeo,es_oferta&limit=20"
            ) or []
            _cat_productos = [x for x in _cat_productos if (x.get("imagen_principal") or "").strip()]   # sin foto no se lista
        except Exception:
            pass

        # Inyectar H1 + listado de productos visible en HTML inicial.
        # Hace cada página de categoría genuinamente diferente a la home para Google
        # (soluciona "Duplicate, Google chose different canonical than user").
        # El JS carga el catálogo debajo; esta sección queda como acceso rápido.
        _CAT_DESCS = {
            "tacones":     "Zapatillas y tacones de moda para dama fabricados en León, Guanajuato. Descuento automático desde 3 pares: aguja, bloque y plataforma. Envíos a todo México.",
            "sandalias":   "Sandalias de dama hechas en León, Guanajuato: casuales, de fiesta y de cuña. Descuento automático desde 3 pares. Envíos a todo México.",
            "botas":       "Botas de mujer y dama fabricadas en León, Guanajuato. Descuento automático desde 3 pares. Envíos a todo México.",
            "botines":     "Botines de dama de temporada fabricados en León, Guanajuato. Descuento automático desde 3 pares. Envíos a todo México.",
            "flats":       "Flats y zapatos bajos de dama, cómodos y de moda, hechos en León, Guanajuato. Descuento automático desde 3 pares. Envíos a todo México.",
            "plataformas": "Plataformas de dama con altura y comodidad, fabricadas en León, Guanajuato. Descuento automático desde 3 pares. Envíos a todo México.",
            "tenis":       "Tenis de moda para dama fabricados en León, Guanajuato. Descuento automático desde 3 pares. Envíos a todo México.",
            "nina":        "Calzado para niña cómodo y resistente, fabricado en León, Guanajuato. Descuento automático desde 3 pares. Envíos a todo México.",
            "accesorios":  "Accesorios de moda de Zapatillas May, fabricados en León, Guanajuato. Mayoreo y menudeo con envíos a todo México.",
            "ofertas":     "Ofertas de calzado femenino de Zapatillas May: tacones, sandalias y más a precios especiales. Envíos a todo México.",
            "mayoreo":     "Fábrica de calzado de dama en León, Guanajuato: mayoreo por corrida, catálogo con fotos y precios para zapaterías y revendedoras. Registro gratis en el Portal de Mayoristas.",
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
            _guias_html = ""
            if GUIA_POR_CATEGORIA.get(slug):
                _guias_html = ('<div style="margin:0;padding:0;font-family:DM Sans,sans-serif;display:grid;gap:8px">'
                               + "".join(f'<a href="/{_gs}" style="display:block;padding:12px 16px;background:#fdf6f1;border:1px solid #eadcd2;border-radius:12px;color:#2a1f1a;text-decoration:none;font-size:0.9rem;font-weight:600">'
                                         f'📖 Guía: {_esc_pagina(_gt)} →</a>' for _gs, _gt in GUIA_POR_CATEGORIA[slug])
                               + '</div>')
            if _prod_links:
                _ssr_inner += (
                    f'<section aria-hidden="true" style="display:none">'
                    f'<ul style="list-style:none;padding:0;margin:0">'
                    f'{_prod_links}</ul></section>'
                )
            template = template.replace('<div class="section" id="productos-section"',
                                        _ssr_inner + '\n<div class="section" id="productos-section"', 1)
            if _guias_html:
                # Al final de la categoría (después de los productos, antes del pie), no encima de ellos
                _bloque = ('<section style="max-width:1100px;margin:8px auto 36px;padding:0 20px;font-family:DM Sans,sans-serif">'
                           '<p style="margin:0 0 10px;font-size:0.72rem;letter-spacing:.08em;text-transform:uppercase;color:#9a8478;font-weight:700">Guías para elegir mejor</p>'
                           + _guias_html + '</section>')
                template = template.replace('<footer', _bloque + '<footer', 1)

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


_GUIAS_SLUGS = {"guias", "guia-tacones-8-vs-10-cm", "guia-comprar-calzado-mayoreo-leon"} | set(_GUIAS_NUEVAS)


def _guia_grids(template):
    """Sustituye <!--GRID:categoria:tipo_tacon--> por modelos reales (solo con foto). Devuelve (html, primera_imagen)."""
    primero = [""]

    def _sub(m):
        cat, tipo = m.group(1), m.group(2)
        ck = f"guia_grid_{cat}_{tipo}"
        lista = cache_get(ck)
        if lista is None:
            filas = supabase_get(f"productos?activo=eq.true&categoria=eq.{cat}&select=id,slug,sku_interno,nombre,imagen_principal,foto_limpia,tipo_tacon,es_oferta,updated_at&order=updated_at.desc&limit=300") or []
            filas = [x for x in _sin_oferta_interna(filas) if (x.get("imagen_principal") or "").strip()]
            if tipo:
                filas = [x for x in filas if (x.get("tipo_tacon") or "").strip().lower() == tipo]
            lista = filas[:8]
            cache_set(ck, lista, ttl=900)
        if lista and not primero[0]:
            primero[0] = lista[0].get("foto_limpia") or lista[0].get("imagen_principal") or ""
        return _guia_tarjetas(lista)

    return re.sub(r"<!--GRID:([a-z]+):([a-z_]*)-->", _sub, template), primero[0]


def _guia_tarjetas(prods):
    tarjetas = []
    for p in prods[:8]:
        img = (p.get("foto_limpia") or p.get("imagen_principal") or "").strip()   # la foto limpia del zapato, si el panel la marcó
        if "res.cloudinary.com" in img and "/upload/" in img:
            img = img.replace("/upload/", "/upload/w_420,h_420,c_fill,g_south,f_auto,q_auto/", 1)
        slug_p = p.get("slug") or p.get("sku_interno") or ""
        nombre = _esc_pagina((p.get("nombre") or slug_p).strip())
        tarjetas.append(f'<a class="g-card" href="/producto/{_esc_pagina(slug_p)}"><img src="{_esc_pagina(img)}" alt="{nombre}" loading="lazy" width="360" height="360"><span>{nombre}</span></a>')
    return '<div class="g-grid">' + "".join(tarjetas) + '</div>' if tarjetas else '<p>Consulta los modelos disponibles en la categoría de tacones.</p>'


def _guia_extras(slug, template, titulo, desc, canonical):
    """Inyecta modelos reales (por altura de tacón) en la guía de tacones y el schema Article/Breadcrumb de las guías."""
    if slug == "guia-tacones-8-vs-10-cm":
        ck = "guia_tacones_prods"
        grupos = cache_get(ck)
        if grupos is None:
            filas = supabase_get("productos?activo=eq.true&categoria=eq.tacones&select=id,slug,sku_interno,nombre,imagen_principal,foto_limpia,altura_tacon,es_oferta,updated_at&order=updated_at.desc&limit=300") or []
            filas = [x for x in _sin_oferta_interna(filas) if (x.get("imagen_principal") or "").strip()]
            def _alt(x):
                try:
                    return float(x.get("altura_tacon"))
                except Exception:
                    return None
            grupos = {"8": [x for x in filas if _alt(x) == 8.0], "10": [x for x in filas if _alt(x) == 10.0]}
            cache_set(ck, grupos, ttl=900)
        template = template.replace("<!--GUIA_TACONES_8-->", _guia_tarjetas(grupos["8"]))
        template = template.replace("<!--GUIA_TACONES_10-->", _guia_tarjetas(grupos["10"]))
    ld = []
    og_img = ""
    if slug in _GUIAS_NUEVAS:
        template, _primera = _guia_grids(template)
        if "res.cloudinary.com" in _primera and "/upload/" in _primera:
            og_img = _primera.replace("/upload/", "/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/", 1)
        ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in _GUIAS_NUEVAS[slug]["faq"]]})
    if slug == "guia-tacones-8-vs-10-cm":
        _g = cache_get("guia_tacones_prods") or {}
        _img = next((x.get("foto_limpia") or x.get("imagen_principal") for x in (_g.get("8") or []) + (_g.get("10") or []) if x.get("foto_limpia") or x.get("imagen_principal")), "")
        if "res.cloudinary.com" in _img and "/upload/" in _img:
            og_img = _img.replace("/upload/", "/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/", 1)
    if og_img:
        template = re.sub(r'(<meta property="og:image" content=")[^"]*(")', lambda m: m.group(1) + og_img + m.group(2), template, count=1)
        template = re.sub(r'(<meta name="twitter:image" content=")[^"]*(")', lambda m: m.group(1) + og_img + m.group(2), template, count=1)
    if slug == "guia-tacones-8-vs-10-cm":
        ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": "¿Cuál es la altura de tacón más cómoda?", "acceptedAnswer": {"@type": "Answer", "text": "Depende de cada persona, pero para uso de varias horas la mayoría prefiere alturas de 5 a 8 cm, sobre todo en bloque o con plataforma."}},
            {"@type": "Question", "name": "¿Cada modelo indica su altura?", "acceptedAnswer": {"@type": "Answer", "text": "Sí, la ficha de cada producto muestra la altura del tacón en centímetros."}},
            {"@type": "Question", "name": "¿Hacen envíos a todo México?", "acceptedAnswer": {"@type": "Answer", "text": "Sí, enviamos a toda la República en 1 a 3 días hábiles."}}]})
    if slug != "guias":
        ld.append({"@context": "https://schema.org", "@type": "Article", "headline": titulo.split(" |")[0], "description": desc,
                   "datePublished": "2026-10-04", "dateModified": "2026-10-04",
                   "mainEntityOfPage": canonical, "inLanguage": "es-MX",
                   "image": [og_img or "https://zapatillasmay.mx/logo.png"],
                   "author": {"@type": "Organization", "name": "Zapatillas May"},
                   "publisher": {"@type": "Organization", "name": "Zapatillas May", "logo": {"@type": "ImageObject", "url": "https://zapatillasmay.mx/logo.png"}}})
    miga = [{"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://zapatillasmay.mx/"},
            {"@type": "ListItem", "position": 2, "name": "Guías", "item": "https://zapatillasmay.mx/guias"}]
    if slug != "guias":
        miga.append({"@type": "ListItem", "position": 3, "name": titulo.split(" |")[0], "item": canonical})
    ld.append({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": miga})
    bloque = "\n".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in ld)
    return template.replace("</head>", bloque + "\n</head>", 1)


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

# Envío calculado del portal mayorista -- por caja (hasta 50kg cada una; si
# el pedido pesa más, se reparte en varias cajas y se suma la tarifa de cada
# una, la misma tabla para todas). Dictado por el dueño 2026-08-03, editable
# desde el panel (Envíos → Portal mayorista).
_ENVIO_MAYOREO_TIERS_DEFAULT = [
    {"min_kg": 3,  "max_kg": 6,  "precio": 230},
    {"min_kg": 6,  "max_kg": 12, "precio": 280},
    {"min_kg": 12, "max_kg": 30, "precio": 360},
    {"min_kg": 30, "max_kg": 50, "precio": 440},
]

@router.get("/config/envio")
def get_config_envio():
    """Devuelve configuración de envío escalonada por pares (tienda) y por
    kilos (portal mayorista)."""
    cached = cache_get("config_envio")
    if cached is not None:
        return cached
    try:
        rows = supabase_get("configuracion?clave=like.envio_*&select=clave,valor")
        cfg = dict(_ENVIO_DEFAULTS)
        cfg["mayoreo_tiers"] = _ENVIO_MAYOREO_TIERS_DEFAULT
        for r in rows:
            clave = r["clave"].replace("envio_", "")
            if clave == "mayoreo_tiers":
                try:
                    cfg["mayoreo_tiers"] = json.loads(r["valor"])
                except Exception:
                    pass
                continue
            try:
                cfg[clave] = float(r["valor"])
            except Exception:
                cfg[clave] = r["valor"]
        cache_set("config_envio", cfg, ttl=300)
        return cfg
    except Exception:
        cfg = dict(_ENVIO_DEFAULTS)
        cfg["mayoreo_tiers"] = _ENVIO_MAYOREO_TIERS_DEFAULT
        return cfg

@router.post("/config/envio")
def save_config_envio(datos: dict):
    """Guarda configuración de envío desde el panel. Valida los montos: antes aceptaba cualquier cosa (un -99 o un
    texto) y esas tarifas se cobran tal cual en el checkout."""
    try:
        for campo in ["tier1", "tier2", "tier3", "gratis_desde"]:
            if campo in datos:
                try:
                    if float(datos[campo]) < 0:
                        raise ValueError
                except (TypeError, ValueError):
                    return JSONResponse(status_code=400, content={"error": f"'{campo}' debe ser un monto numérico mayor o igual a 0"})
        if "mayoreo_tiers" in datos:
            t = datos["mayoreo_tiers"]
            try:
                assert isinstance(t, list) and t
                for r in t:
                    if float(r["min_kg"]) < 0 or float(r["max_kg"]) <= float(r["min_kg"]) or float(r["precio"]) < 0:
                        raise ValueError
            except Exception:
                return JSONResponse(status_code=400, content={"error": "Los tramos de mayoreo deben ser una lista con min_kg, max_kg (mayor que min_kg) y precio >= 0"})
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
        if "mayoreo_tiers" in datos:
            clave = "envio_mayoreo_tiers"
            valor = json.dumps(datos["mayoreo_tiers"])
            existente = supabase_get(f"configuracion?clave=eq.{clave}")
            if existente:
                supabase_patch(f"configuracion?clave=eq.{clave}", {"valor": valor})
            else:
                supabase_post("configuracion", {"clave": clave, "valor": valor})
        cache_invalidate_prefix("config_envio")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


_PAGO_TRANSFERENCIA_CAMPOS = ["banco", "clabe", "cuenta", "tarjeta_oxxo", "titular"]

@router.get("/config/pago-transferencia")
def get_config_pago_transferencia():
    """Datos bancarios reales para mostrar al cliente cuando cierra un apartado
    pagando por transferencia/OXXO (portal mayorista)."""
    cached = cache_get("config_pago_transferencia")
    if cached is not None:
        return cached
    try:
        rows = supabase_get("configuracion?clave=like.banco_*&select=clave,valor")
        cfg = {campo: "" for campo in _PAGO_TRANSFERENCIA_CAMPOS}
        for r in rows:
            clave = r["clave"].replace("banco_", "")
            if clave in cfg:
                cfg[clave] = r["valor"]
        cache_set("config_pago_transferencia", cfg, ttl=3600)
        return cfg
    except Exception:
        return {campo: "" for campo in _PAGO_TRANSFERENCIA_CAMPOS}


@router.post("/config/pago-transferencia")
def save_config_pago_transferencia(datos: dict):
    """Guarda los datos bancarios desde el panel. La CLABE se valida (18 dígitos y dígito verificador): una captura
    con error mandaría los depósitos de tus clientas a una cuenta equivocada."""
    try:
        clabe = str(datos.get("clabe") or "").replace(" ", "").replace("-", "")
        if "clabe" in datos and clabe:
            pesos = [3, 7, 1] * 6
            if not (clabe.isdigit() and len(clabe) == 18 and
                    (10 - sum((int(clabe[i]) * pesos[i]) % 10 for i in range(17)) % 10) % 10 == int(clabe[17])):
                return JSONResponse(status_code=400, content={"error": "La CLABE no es válida (18 dígitos con dígito verificador correcto). Revísala."})
            datos = dict(datos, clabe=clabe)
        for campo in _PAGO_TRANSFERENCIA_CAMPOS:
            if campo not in datos:
                continue
            clave = f"banco_{campo}"
            valor = str(datos[campo]).strip()
            existente = supabase_get(f"configuracion?clave=eq.{clave}")
            if existente:
                supabase_patch(f"configuracion?clave=eq.{clave}", {"valor": valor})
            else:
                supabase_post("configuracion", {"clave": clave, "valor": valor})
        cache_invalidate_prefix("config_pago_transferencia")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


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
            'https://zapatillasmay.mx/guias',
            'https://zapatillasmay.mx/guia-tacones-8-vs-10-cm',
            'https://zapatillasmay.mx/guia-comprar-calzado-mayoreo-leon',
            'https://zapatillasmay.mx/guia-tacon-aguja-o-bloque',
            'https://zapatillasmay.mx/guia-botas-o-botines',
            'https://zapatillasmay.mx/guia-sandalias-segun-ocasion',
            'https://zapatillasmay.mx/guia-plataformas-como-elegir',
            'https://zapatillasmay.mx/guia-como-elegir-tu-talla',
            'https://zapatillasmay.mx/guia-flats-como-elegir',
            'https://zapatillasmay.mx/vender',
            'https://zapatillasmay.mx/marketplace',
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
        productos = [x for x in productos if (x.get('imagen_principal') or '').strip()]   # sin foto no se lista en el sitemap
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
        # Marketplace: productos publicados de tiendas activas, con existencia y foto
        try:
            for mp in supabase_get("mp_productos?estado=eq.publicado&mp_vendedores.estado=eq.activo&select=slug,nombre,imagenes,updated_at,mp_vendedores!inner(estado),mp_variantes(stock)&limit=500") or []:
                imgs = [u for u in (mp.get("imagenes") or []) if u]
                if not mp.get("slug") or not imgs or not any((v.get("stock") or 0) > 0 for v in (mp.get("mp_variantes") or [])):
                    continue
                xml += (f'  <url>\n    <loc>https://zapatillasmay.mx/marketplace/{_html.escape(mp["slug"], quote=True)}</loc>\n    <lastmod>{(mp.get("updated_at") or _today)[:10]}</lastmod>\n'
                        f'    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n    <image:image>\n      <image:loc>{_html.escape(imgs[0], quote=True)}</image:loc>\n'
                        f'      <image:title>{_html.escape(str(mp.get("nombre") or "Calzado")[:150], quote=True)}</image:title>\n    </image:image>\n  </url>\n')
        except Exception as e_mp:
            print(f"[sitemap] marketplace: {e_mp}")
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
        "Disallow: /vendedor\n"
        "Disallow: /checkout\n"
        "Disallow: /success\n"
        "Disallow: /pedido-exitoso\n"
        "Disallow: /pedido-pendiente\n"
        "Disallow: /pedido-fallido\n"
        "\n"
        "# Storebot-Google necesita rastrear /checkout para validar el\n"
        "# checkout_link_template del feed de Merchant Center -- si no, Google\n"
        "# marca la URL como invalida aunque el enlace funcione de verdad.\n"
        "User-agent: Storebot-Google\nAllow: /\n"
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
            "Venta a menudeo (descuento automático desde 3 pares) y mayoreo en el Portal de Mayoristas. "
            "Tacones, sandalias, botas, botines, flats, plataformas y más. Envíos a todo México. "
            "Mayoreo para zapaterías y revendedoras: mínimo 6 pares, con registro gratuito en el Portal de Mayoristas.",
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
            "## Mayoreo para zapaterías y revendedoras (fábrica en León, Guanajuato)",
            "- Zapatillas May es fábrica de calzado de dama: vende directo, sin intermediarios.",
            "- **Mínimo para precios de mayoreo: 6 pares.** Pueden ser de diferentes modelos, estilos, colores y tallas.",
            "- **Cómo comprar al mayoreo:** registrarse gratis en el Portal de Mayoristas, https://portal.zapatillasmay.mx. Ahí ven el catálogo completo con fotos, sus precios de mayoreo, arman su corrida por talla y color, apartan pares y dan seguimiento a sus pedidos.",
            "- Los precios de mayoreo se ven únicamente dentro del portal (no están en el sitio público ni se dan por chat).",
            "- Las clientas mayoristas pueden usar las fotos y videos de los modelos para promocionarlos en sus redes sociales.",
            "- Envíos de mayoreo a todo México por paquetería, con número de guía.",
            "- **Cambios y garantía (mayoreo):** cambios por cualquier otro estilo dentro de los primeros 22 días desde la entrega (calzado sin uso, limpio y en su caja; sujeto a existencia). Garantía de 30 días por defectos de fábrica (costuras, pegado, suela o materiales); aplica cuando el par se entrega en la tienda física (Cuautla 211, Col. Killian, León, Gto.) para hacer la devolución. No cubre desgaste normal, humedad, golpes, modificaciones ni uso distinto al fabricado. En herrajes y pedrería no hay devoluciones por su acabado artesanal. No se aceptan zapatos mojados, sucios ni usados. La paquetería corre por cuenta del comprador.",
            "- Dudas: WhatsApp +52 1 479 224 4560. Guía completa: https://zapatillasmay.mx/guia-comprar-calzado-mayoreo-leon",
            "",
            "## Compra en la tienda en línea (menudeo)",
            "- 1-2 pares: precio de menudeo (precio normal al público).",
            "- Desde 3 pares: $60 MXN menos por par (descuento automático en el carrito de zapatillasmay.mx, sin registro ni código). Esto es descuento por varios pares, no es el precio de mayoreo.",
            "- Ejemplo: si un modelo vale $650 en menudeo, a 3 o más pares cuesta $590 por par en el carrito del sitio.",
            "",
            "## Envíos",
            "- Envíos a todo México por paquetería (1-3 días hábiles).",
            "- Costo: $99 MXN por 1 par · $150 MXN por 2 pares · $199 MXN por 3 o más pares.",
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
                "tarifas_mxn": {"1_par": 99, "2_pares": 150, "3_o_mas_pares": 199},
                "tiempo_estimado": "1-3 días hábiles"
            },
            "devoluciones": "30 días. Más info: https://zapatillasmay.mx/politica-de-devoluciones",
            "mayoreo": {
                "nota": "El precio baja automáticamente a partir de 3 pares en el carrito: 1-2 pares = menudeo; 3 o más pares = $60 menos por par. Los precios de 6+ pares y corrida completa están solo en el Portal de Mayoristas (https://portal.zapatillasmay.mx).",
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
        cache_set("seo_config", data, ttl=1800)
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
                    # Sin foto Merchant Center/Meta/TikTok rechazan el artículo (image_link vacío): se omite hasta que tenga foto
                    if not (imagen or '').strip():
                        continue

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
                    # Sin foto Merchant Center/Meta/TikTok rechazan el artículo (image_link vacío): se omite hasta que tenga foto
                    if not (imagen or '').strip():
                        continue

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
                    # Sin foto Merchant Center/Meta/TikTok rechazan el artículo (image_link vacío): se omite hasta que tenga foto
                    if not (imagen or '').strip():
                        continue
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