from fastapi import APIRouter
from database import supabase_get, supabase_post, supabase_patch, supabase_delete

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
    return supabase_get("variantes?select=id,producto_id,color,color_hex,talla,sku,foto_url,imagenes,activa,created_at,productos(nombre)")

@router.get("/producto/{producto_id}")
def variantes_producto(producto_id: str):
    return supabase_get(f"variantes?producto_id=eq.{producto_id}")

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
    return supabase_post("variantes", variante)

@router.patch("/{variante_id}")
def actualizar_variante(variante_id: str, variante: dict):
    return supabase_patch(f"variantes?id=eq.{variante_id}", variante)

@router.delete("/{variante_id}")
def eliminar_variante(variante_id: str):
    return supabase_delete(f"variantes?id=eq.{variante_id}")
