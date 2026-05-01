from fastapi import APIRouter, Request
from database import supabase_get, supabase_post, supabase_patch, supabase_delete
from fastapi.responses import Response, JSONResponse

router = APIRouter(prefix="/variantes", tags=["Variantes"])

COLORES_CODIGO = {
    'Negro': 'NEG', 'Blanco': 'BLA', 'Hueso': 'HUE', 'Beige': 'BEI',
    'Camel': 'CAM', 'Miel': 'MIE', 'Cafe claro': 'CFC', 'Cafe medio': 'CFM',
    'Cafe oscuro': 'CFO', 'Chocolate': 'CHO', 'Cognac': 'COG', 'Taupe': 'TAU',
    'Gris claro': 'GRC', 'Gris': 'GRI', 'Gris oscuro': 'GRO',
    'Rojo': 'ROJ', 'Vino': 'VIN', 'Bordo': 'BOR',
    'Rosa claro': 'RSC', 'Rosa': 'ROS', 'Fusha': 'FUS', 'Coral': 'COR',
    'Salmon': 'SAL', 'Naranja': 'NAR', 'Amarillo': 'AMA',
    'Dorado': 'DOR', 'Plateado': 'PLA',
    'Azul claro': 'AZC', 'Azul': 'AZU', 'Azul marino': 'AZM', 'Turquesa': 'TUR',
    'Verde': 'VER', 'Verde menta': 'VRM',
    'Morado': 'MOR', 'Lila': 'LIL', 'Multicolor': 'MUL'
}

def color_a_codigo(color):
    if color in COLORES_CODIGO:
        return COLORES_CODIGO[color]
    return color.upper().replace(' ', '')[:3]

def talla_a_codigo(talla):
    return talla.replace('.', '_')

@router.get("/")
def listar_variantes():
    return supabase_get("variantes?activa=eq.true&select=id,producto_id,color,color_hex,talla,sku,foto_url,imagenes,activa,created_at,productos(nombre)")

@router.get("/producto/{producto_id}")
def variantes_producto(producto_id: str):
    return supabase_get(f"variantes?producto_id=eq.{producto_id}&activa=eq.true")

@router.post("/")
def crear_variante(variante: dict):
    producto_id = variante.get("producto_id")
    color = variante.get("color", "")
    talla = variante.get("talla", "")
    if producto_id:
        producto = supabase_get(f"productos?id=eq.{producto_id}&select=sku_interno")
        if producto and len(producto) > 0:
            sku_base = producto[0].get("sku_interno", "MAY")
            cod_color = color_a_codigo(color)
            cod_talla = talla_a_codigo(talla)
            variante["sku"] = f"{sku_base}-{cod_color}-{cod_talla}"
    try:
        return supabase_post("variantes", variante)
    except Exception as e:
        if "23505" in str(e):
            sku = variante.get("sku", "")
            existente = supabase_get(f"variantes?sku=eq.{sku}&select=id")
            if existente and len(existente) > 0:
                variante_id = existente[0]["id"]
                update = {k: v for k, v in variante.items() if k in ["foto_url", "imagenes", "color_hex"]}
                return supabase_patch(f"variantes?id=eq.{variante_id}", update)
        raise e

@router.patch("/{variante_id}")
def actualizar_variante(variante_id: str, variante: dict):
    return supabase_patch(f"variantes?id=eq.{variante_id}", variante)

@router.delete("/{variante_id}")
def eliminar_variante(variante_id: str):
    try:
        return supabase_patch(f"variantes?id=eq.{variante_id}", {"activa": False})
    except Exception as e:
        return {"error": str(e)}

@router.post("/{variante_id}/eliminar")
def eliminar_variante_post(variante_id: str):
    try:
        return supabase_patch(f"variantes?id=eq.{variante_id}", {"activa": False})
    except Exception as e:
        return {"error": str(e)}

@router.options("/")
def options_variantes():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )