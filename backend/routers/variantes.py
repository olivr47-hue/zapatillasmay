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
    'Morado': 'MOR', 'Lila': 'LIL', 'Multicolor': 'MUL',
    # Colores paleta que no estaban y causaban colision de SKU
    'Nude': 'NUD', 'Nude claro': 'NUDCL', 'Nude oscuro': 'NUDOC', 'Nude rosa': 'NUDRS',
    'Palo de rosa': 'PALRS',
    'Oro rosa': 'OROS', 'Oro': 'ORO', 'Oro viejo': 'ORVJ', 'Oro metalico': 'ORMT',
}

def color_a_codigo(color):
    # Buscar exacto (case-insensitive)
    for k, v in COLORES_CODIGO.items():
        if k.lower() == color.lower():
            return v
    # Fallback: usar hasta 6 caracteres del nombre sin espacios (reduce colisiones vs 3 chars)
    codigo = color.upper().replace(' ', '')
    return codigo[:6] if len(codigo) >= 6 else codigo

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
            color_nuevo = variante.get("color", "")
            existente = supabase_get(f"variantes?sku=eq.{sku}&select=id,color")
            if existente and len(existente) > 0:
                color_existente = existente[0].get("color", "")
                variante_id = existente[0]["id"]
                # Si es el mismo color: actualizar (resurtido o edicion)
                if color_existente.strip().lower() == color_nuevo.strip().lower():
                    update = {k: v for k, v in variante.items() if k in ["foto_url", "imagenes", "color_hex"]}
                    return supabase_patch(f"variantes?id=eq.{variante_id}", update)
                else:
                    # Colision de SKU entre colores distintos: agregar sufijo numerico al SKU
                    for sufijo in range(2, 10):
                        sku_nuevo = f"{sku}-{sufijo}"
                        variante_mod = dict(variante)
                        variante_mod["sku"] = sku_nuevo
                        try:
                            return supabase_post("variantes", variante_mod)
                        except Exception:
                            continue
                    # Si todos los sufijos fallan, forzar con timestamp
                    import time
                    variante["sku"] = f"{sku}-{int(time.time()) % 10000}"
                    return supabase_post("variantes", variante)
        raise e

@router.post("/activar-todas")
def activar_variantes_sin_activa():
    """Activa todas las variantes que tienen activa=null (creadas sin el campo)"""
    from database import get_url, get_headers
    import urllib.request, json
    url = f"{get_url()}/rest/v1/variantes?activa=is.null"
    body = json.dumps({"activa": True}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=get_headers(), method="PATCH")
    try:
        with urllib.request.urlopen(req) as r:
            return {"ok": True, "actualizadas": r.read().decode()}
    except Exception as e:
        return {"error": str(e)}

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