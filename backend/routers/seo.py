from fastapi import APIRouter
from fastapi.responses import Response
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(tags=["SEO"])

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
        variantes = supabase_get("variantes?select=id,producto_id,color,color_hex,foto_url,talla")
        inventario = supabase_get("inventario?select=variante_id,cantidad")
        
        # Inventario por variante
        inv_por_variante = {}
        for i in inventario:
            inv_por_variante[i['variante_id']] = i.get('cantidad', 0)
        
        # Variantes por producto
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
                # Agrupar por color
                colores = {}
                for v in vars_prod:
                    color = v.get('color', '')
                    if color not in colores:
                        colores[color] = {'variantes': [], 'foto': v.get('foto_url') or p.get('imagen_principal', '')}
                    colores[color]['variantes'].append(v)
                
                for color, data in colores.items():
                    # Calcular cantidad total del color sumando todas las tallas
                    cantidad_total = sum(inv_por_variante.get(v['id'], 0) for v in data['variantes'])
                    if cantidad_total <= 0:
                        continue  # No incluir variantes sin stock
                    
                    # Tallas disponibles para este color
                    tallas = [v.get('talla', '') for v in data['variantes'] if inv_por_variante.get(v['id'], 0) > 0 and v.get('talla')]
                    
                    var_id = f"{sku}-{color.replace(' ','_').replace('/','_')}"
                    nombre = p.get("nombre", "").title()
                    color_title = color.title()
                    
                    xml += '<item>\n'
                    xml += f'  <g:id>{var_id}</g:id>\n'
                    xml += f'  <g:item_group_id>{sku}</g:item_group_id>\n'
                    xml += f'  <g:title>{nombre} - {color_title}</g:title>\n'
                    xml += f'  <g:description>{p.get("descripcion","") or p.get("nombre","")}</g:description>\n'
                    xml += f'  <g:link>{url}</g:link>\n'
                    xml += f'  <g:image_link>{data["foto"]}</g:image_link>\n'
                    xml += f'  <g:price>{p.get("precio_menudeo",0)} MXN</g:price>\n'
                    xml += f'  <g:availability>in stock</g:availability>\n'
                    xml += f'  <g:quantity>{cantidad_total}</g:quantity>\n'
                    xml += f'  <g:condition>new</g:condition>\n'
                    xml += f'  <g:brand>Zapatillas May</g:brand>\n'
                    xml += f'  <g:google_product_category>187</g:google_product_category>\n'
                    xml += f'  <g:product_type>{p.get("categoria","Calzado")}</g:product_type>\n'
                    xml += f'  <g:color>{color}</g:color>\n'
                    if tallas:
                        xml += f'  <g:size>{", ".join(tallas)}</g:size>\n'
                    xml += '</item>\n'
            else:
                xml += '<item>\n'
                xml += f'  <g:id>{sku}</g:id>\n'
                xml += f'  <g:title>{p.get("nombre","").title()}</g:title>\n'
                xml += f'  <g:description>{p.get("descripcion","") or p.get("nombre","")}</g:description>\n'
                xml += f'  <g:link>{url}</g:link>\n'
                xml += f'  <g:image_link>{p.get("imagen_principal","")}</g:image_link>\n'
                xml += f'  <g:price>{p.get("precio_menudeo",0)} MXN</g:price>\n'
                xml += f'  <g:availability>in stock</g:availability>\n'
                xml += f'  <g:quantity>10</g:quantity>\n'
                xml += f'  <g:condition>new</g:condition>\n'
                xml += f'  <g:brand>Zapatillas May</g:brand>\n'
                xml += f'  <g:google_product_category>187</g:google_product_category>\n'
                xml += f'  <g:product_type>{p.get("categoria","Calzado")}</g:product_type>\n'
                xml += '</item>\n'
        
        xml += '</channel>\n</rss>'
        return Response(content=xml, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)
    
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
    