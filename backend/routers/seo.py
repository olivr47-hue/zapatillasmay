from fastapi import APIRouter
from fastapi.responses import Response, StreamingResponse, RedirectResponse, HTMLResponse
from database import supabase_get, supabase_post, supabase_patch
from cache import cache_get, cache_set, cache_invalidate_prefix, TTL_ESTATICO
import urllib.request
import json
import os
import re
import io

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
    # 1. Buscar producto
    datos = supabase_get(f"productos?sku_interno=eq.{sku}&activo=eq.true&limit=1")
    if not datos:
        datos = supabase_get(f"productos?id=eq.{sku}&activo=eq.true&limit=1")
    if not datos:
        return RedirectResponse(url="https://zapatillasmay.mx/", status_code=302)

    p = datos[0]
    nombre    = (p.get("nombre") or "Calzado").strip()
    desc_raw  = (p.get("descripcion") or nombre).strip()
    desc      = desc_raw[:155]
    precio    = (p.get("precio_menudeo") or 0)
    precio_display = precio if p.get("es_oferta") else precio + 80
    imagen    = p.get("imagen_principal") or ""
    categoria = (p.get("categoria") or "calzado").strip()
    sku_canon = p.get("sku_interno") or sku
    canonical = f"https://zapatillasmay.mx/producto/{sku_canon}"

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

    if not template:
        # Fallback minimal HTML
        html = f"""<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{nombre} | Zapatillas May</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">
<meta property="og:title" content="{nombre} | Zapatillas May">
<meta property="og:image" content="{imagen}">
<meta property="og:url" content="{canonical}">
<script type="application/ld+json">{{"@context":"https://schema.org/","@type":"Product","name":"{nombre}","image":"{imagen}","description":"{desc_raw[:200]}","brand":{{"@type":"Brand","name":"Zapatillas May"}},"offers":{{"@type":"Offer","priceCurrency":"MXN","price":"{precio_display}","availability":"https://schema.org/InStock","url":"{canonical}"}}}}</script>
</head><body>
<script>window.__ZM_PRODUCT__={json.dumps(p, ensure_ascii=False)};</script>
<script>setTimeout(()=>{{ if(!window.__ZM_LOADED__) window.location.href='{canonical}' }}, 3000)</script>
</body></html>"""
        return HTMLResponse(content=html)

    # 3. Inyectar meta tags producto-específicos
    template = template.replace(
        "<title>Zapatillas May</title>",
        f"<title>{nombre} | Zapatillas May — León, Guanajuato</title>"
    )
    template = template.replace(
        'content="Calzado de moda para dama. León, Guanajuato."',
        f'content="{desc}"'
    )

    schema = f"""
  <link rel="canonical" href="{canonical}">
  <meta property="og:title" content="{nombre} | Zapatillas May">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{imagen}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:type" content="product">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{nombre} | Zapatillas May">
  <meta name="twitter:image" content="{imagen}">
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "{nombre}",
    "image": "{imagen}",
    "description": "{desc_raw[:300]}",
    "sku": "{sku_canon}",
    "brand": {{"@type": "Brand", "name": "Zapatillas May"}},
    "category": "{categoria}",
    "offers": {{
      "@type": "Offer",
      "url": "{canonical}",
      "priceCurrency": "MXN",
      "price": "{precio_display}",
      "availability": "https://schema.org/InStock",
      "seller": {{"@type": "Organization", "name": "Zapatillas May"}}
    }}
  }}
  </script>
  <script>window.__ZM_PRODUCT__ = {json.dumps(p, ensure_ascii=False)}; window.__ZM_LOADED__ = true;</script>"""

    template = template.replace("</head>", schema + "\n</head>")
    return HTMLResponse(content=template)


_ENVIO_DEFAULTS = {"costo": 99, "gratis_desde": 1299}

@router.get("/config/envio")
def get_config_envio():
    """Devuelve configuración de envío (costo y monto para envío gratis)."""
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
        for campo in ["costo", "gratis_desde"]:
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
        productos = supabase_get("productos?activo=eq.true&select=id,slug,sku_interno,updated_at")
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
        ]
        for cat in categorias:
            slug_cat = _CAT_SLUG.get(cat.lower(), cat.lower())
            urls.append(f'https://zapatillasmay.mx/{slug_cat}')
        for p in productos:
            slug = p.get('sku_interno') or p.get('id','')
            if slug:
                urls.append(f'https://zapatillasmay.mx/producto/{slug}')
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        for url in urls:
            xml += f'  <url>\n    <loc>{url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n'
        xml += '</urlset>'
        cache_set("seo_sitemap", xml, ttl=TTL_ESTATICO)
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

@router.get("/robots.txt")
def robots():
    content = "User-agent: *\nAllow: /\nSitemap: https://zapatillasmay.mx/sitemap.xml\n"
    return Response(content=content, media_type="text/plain")

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
        productos = supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,categoria,imagen_principal,slug")
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

                    nombre = p.get("nombre", "").title()
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
                    xml += f'  <g:title>{nombre} - {color_title}</g:title>\n'
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
                xml += f'  <g:title>{p.get("nombre","").title()}</g:title>\n'
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
        productos = supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,categoria,imagen_principal,slug")
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">\n'
        for p in productos:
            sku = p.get('sku_interno') or p.get('id')
            url = f"https://zapatillasmay.mx/producto/{sku}"
            xml += '<entry>\n'
            xml += f'  <g:id>{sku}</g:id>\n'
            xml += f'  <g:title>{p.get("nombre","")}</g:title>\n'
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
        productos = supabase_get("productos?activo=eq.true&select=id,nombre,descripcion,sku_interno,precio_menudeo,categoria,imagen_principal,slug")
        items = []
        for p in productos:
            sku = p.get('sku_interno') or p.get('id')
            items.append({
                "sku_id": sku,
                "title": p.get("nombre",""),
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