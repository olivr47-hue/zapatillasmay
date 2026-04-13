from fastapi import APIRouter
from fastapi.responses import Response
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(tags=["SEO"])

@router.get("/sitemap.xml")
def sitemap():
    try:
        productos = supabase_get("productos?activo=eq.true&select=slug,sku_interno,updated_at")
        categorias = list(set([p.get('categoria','') for p in supabase_get("productos?activo=eq.true&select=categoria") if p.get('categoria')]))
        urls = ['https://zapatillasmay.mx/']
        for cat in categorias:
            urls.append(f'https://zapatillasmay.mx/?categoria={cat}')
        for p in productos:
            slug = p.get('slug') or p.get('sku_interno','')
            if slug:
                urls.append(f'https://zapatillasmay.mx/?producto={slug}')
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