from fastapi import APIRouter
from fastapi.responses import Response
from database import supabase_get, supabase_post, supabase_patch
import urllib.request
import json
import os
import re

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

@router.get("/sitemap.xml")
def sitemap():
    try:
        productos = supabase_get("productos?activo=eq.true&select=id,slug,sku_interno,updated_at")
        categorias = list(set([p.get('categoria','') for p in supabase_get("productos?activo=eq.true&select=categoria") if p.get('categoria')]))
        urls = ['https://zapatillasmay.mx/']
        for cat in categorias:
            urls.append(f'https://zapatillasmay.mx/?categoria={cat}')
        for p in productos:
            slug = p.get('sku_interno') or p.get('id','')
            if slug:
                urls.append(f'https://zapatillasmay.mx/producto/{slug}')
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        for url in urls:
            xml += f'  <url>\n    <loc>{url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n'
        xml += '</urlset>'
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

@router.get("/robots.txt")
def robots():
    content = "User-agent: *\nAllow: /\nSitemap: https://zapatillasmay.mx/sitemap.xml\n"
    return Response(content=content, media_type="text/plain")

@router.get("/seo/config")
def get_config():
    try:
        return supabase_get("configuracion_seo?select=clave,valor")
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
        return {"ok": True}
    except Exception as e:
        return {"error": str(e)}

@router.get("/feed/meta.xml")
def feed_meta():
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
                    precio = p.get("precio_menudeo", 0)

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
                    xml += '</item>\n'

            else:
                imagen_p = p.get('imagen_principal', '')
                desc2 = (p.get("descripcion","") or p.get("nombre","")).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
                precio = p.get("precio_menudeo", 0)
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
                xml += '</item>\n'

        xml += '</channel>\n</rss>'
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

@router.post("/catalogo/sincronizar-colecciones")
def sincronizar_colecciones():
    """Crea o actualiza los Product Sets (colecciones) en el catálogo de Meta por categoría."""
    wa_token = os.environ.get("WHATSAPP_TOKEN", "")
    catalog_id = os.environ.get("WHATSAPP_CATALOG_ID", "")
    if not wa_token or not catalog_id:
        return {"error": "Faltan variables WHATSAPP_TOKEN o WHATSAPP_CATALOG_ID"}

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
        except Exception as e:
            resultados.append({"categoria": cat, "accion": "error", "detalle": str(e)})

    return {"ok": True, "resultados": resultados}

@router.get("/feed/google.xml")
def feed_google():
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
            xml += f'  <g:price>{p.get("precio_menudeo",0)} MXN</g:price>\n'
            xml += f'  <g:availability>in stock</g:availability>\n'
            xml += f'  <g:condition>new</g:condition>\n'
            xml += f'  <g:brand>Zapatillas May</g:brand>\n'
            xml += f'  <g:google_product_category>187</g:google_product_category>\n'
            xml += f'  <g:product_type>{p.get("categoria","Calzado")}</g:product_type>\n'
            xml += '</entry>\n'
        xml += '</feed>'
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
                "price": f"{p.get('precio_menudeo',0)} MXN",
                "link": f"https://zapatillasmay.mx/producto/{sku}",
                "image_link": p.get("imagen_principal",""),
                "brand": "Zapatillas May",
                "google_product_category": "187"
            })
        return {"items": items}
    except Exception as e:
        return {"error": str(e)}