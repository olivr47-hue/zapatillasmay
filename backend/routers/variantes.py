from fastapi import APIRouter, Request, Depends
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete
from fastapi.responses import Response, JSONResponse
from cache import cache_get, cache_set, cache_invalidate_prefix
from security import require_staff

router = APIRouter(prefix="/variantes", tags=["Variantes"])

_CK = "variantes"  # prefijo de caché

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
    # Fallback: usar hasta 6 caracteres del nombre, SOLO letras y números: un color como "NEGRO/" dejaba una "/" dentro
    # del SKU (inválida en marketplaces y etiquetas).
    import re
    codigo = re.sub(r'[^A-Z0-9]', '', color.upper().replace('Ñ', 'N'))
    return (codigo[:6] if len(codigo) >= 6 else codigo) or 'COL'

def talla_a_codigo(talla):
    return talla.replace('.', '_')

@router.get("/")
def listar_variantes(producto_ids: str = None, ligero: bool = False):
    if producto_ids:
        ids_list = [i.strip() for i in producto_ids.split(",") if i.strip()]
        if not ids_list:
            return []
        ids_str = ",".join(ids_list)
        return supabase_get(f"variantes?producto_id=in.({ids_str})&or=(activa.eq.true,activa.is.null)&select=id,producto_id,color,color_hex,foto_url")

    if ligero:
        # Pantalla de Inventario: sin fotos ni producto anidado (con 4,000+ variantes eran ~2 MB de más)
        cached = cache_get(_CK + "_ligero")
        if cached is not None:
            return cached
        data = supabase_get_all("variantes?or=(activa.eq.true,activa.is.null)&select=id,producto_id,color,color_hex,talla,sku,activa,foto_url")
        cache_set(_CK + "_ligero", data)
        return data

    cached = cache_get(_CK + "_all")
    if cached is not None:
        return cached
    # Usar paginación para traer las 1400+ variantes (Supabase limita a 1000 por defecto)
    data = supabase_get_all("variantes?or=(activa.eq.true,activa.is.null)&select=id,producto_id,color,color_hex,talla,sku,foto_url,imagenes,activa,created_at,productos(nombre)")
    cache_set(_CK + "_all", data)
    return data

@router.get("/producto/{producto_id}")
def variantes_producto(producto_id: str):
    # Incluir variantes activas Y las que tienen activa=null
    return supabase_get(f"variantes?producto_id=eq.{producto_id}&or=(activa.eq.true,activa.is.null)")

@router.get("/producto/{producto_id}/todas")
def variantes_producto_todas(producto_id: str):
    """TODAS las variantes del producto, incluidas las desactivadas (activa=false),
    para poder gestionar colores (ocultar/mostrar en el sitio)."""
    return supabase_get(f"variantes?producto_id=eq.{producto_id}&select=id,color,color_hex,talla,activa,foto_url")

@router.get("/sku/{sku}")
def variante_por_sku(sku: str):
    """Público (sin login): usado por el QR de las etiquetas de caja para
    mostrar los datos del estilo a clientes zapaterias que escanean la caja."""
    data = supabase_get(
        f"variantes?sku=eq.{sku}&select=id,color,color_hex,talla,sku,foto_url,imagenes,producto_id,"
        "productos(nombre,sku_interno,categoria,material,imagen_principal,"
        "material_suela,forro,horma,altura_tacon,tipo_tacon,"
        "precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida)"
    )
    return data

@router.post("/toggle-color")
def toggle_color(datos: dict, _staff=Depends(require_staff)):
    """Activa o desactiva TODAS las variantes de un color de un producto (mostrar/ocultar en el sitio)."""
    from urllib.parse import quote
    producto_id = datos.get("producto_id")
    color = datos.get("color")
    activa = bool(datos.get("activa"))
    if not producto_id or color is None:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Falta producto_id o color"})
    try:
        supabase_patch(
            f"variantes?producto_id=eq.{producto_id}&color=eq.{quote(str(color), safe='')}",
            {"activa": activa}
        )
        cache_invalidate_prefix(_CK)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})

@router.post("/")
def crear_variante(variante: dict, _staff=Depends(require_staff)):
    variante["activa"] = True  # Siempre activa al crear
    producto_id = variante.get("producto_id")
    # Sin espacios al borde ni dobles ("NEGRO " y "NEGRO" contaban como colores distintos: había 2,580 variantes así)
    color = " ".join(str(variante.get("color") or "").split())
    talla = str(variante.get("talla") or "").strip()
    variante["color"] = color
    variante["talla"] = talla
    if producto_id:
        producto = supabase_get(f"productos?id=eq.{producto_id}&select=sku_interno")
        if producto and len(producto) > 0:
            sku_base = producto[0].get("sku_interno") or "MAY"   # .get(..., "MAY") devolvía None si la clave existía vacía -> "None-NEGRO-24"
            cod_color = color_a_codigo(color)
            cod_talla = talla_a_codigo(talla)
            variante["sku"] = f"{sku_base}-{cod_color}-{cod_talla}"
    try:
        resultado = supabase_post("variantes", variante)
        cache_invalidate_prefix(_CK)
        return resultado
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
                    resultado = supabase_patch(f"variantes?id=eq.{variante_id}", update)
                    cache_invalidate_prefix(_CK)
                    return resultado
                else:
                    # Colision de SKU entre colores distintos: agregar sufijo numerico al SKU
                    for sufijo in range(2, 10):
                        sku_nuevo = f"{sku}-{sufijo}"
                        variante_mod = dict(variante)
                        variante_mod["sku"] = sku_nuevo
                        try:
                            resultado = supabase_post("variantes", variante_mod)
                            cache_invalidate_prefix(_CK)
                            return resultado
                        except Exception:
                            continue
                    # Si todos los sufijos fallan, forzar con timestamp
                    import time
                    variante["sku"] = f"{sku}-{int(time.time()) % 10000}"
                    resultado = supabase_post("variantes", variante)
                    cache_invalidate_prefix(_CK)
                    return resultado
        raise e

@router.post("/lote")
def crear_variantes_lote(datos: dict, _staff=Depends(require_staff)):
    """Crea/actualiza TODAS las variantes (color x talla) de un modelo en una sola petición.
    Antes el panel mandaba una petición por cada color y talla (20-60 a la vez), cada una con su propia consulta del
    producto y su propia invalidación de caché: guardar un modelo con varios colores tardaba muchísimo.
    Body: {"producto_id": "...", "variantes": [{"color","color_hex","talla","foto_url","imagenes"}...]}"""
    import re as _re
    producto_id = str(datos.get("producto_id") or "")
    items = datos.get("variantes") or []
    if not _re.match(r"^[0-9a-fA-F-]{36}$", producto_id):
        return JSONResponse(status_code=400, content={"ok": False, "error": "producto_id inválido"})
    if not isinstance(items, list) or not items or len(items) > 600:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Lista de variantes inválida"})
    prod = supabase_get(f"productos?id=eq.{producto_id}&select=sku_interno")
    if not prod:
        return JSONResponse(status_code=404, content={"ok": False, "error": "Producto no encontrado"})
    sku_base = prod[0].get("sku_interno") or "MAY"

    existentes = supabase_get_all(f"variantes?producto_id=eq.{producto_id}&select=id,color,talla,sku,color_hex,foto_url,imagenes,activa")
    por_clave = {((e.get("color") or "").strip().lower(), str(e.get("talla") or "").strip()): e for e in existentes}
    skus_usados = {e["sku"] for e in existentes if e.get("sku")}

    nuevas, a_parchar, vistos = [], [], set()
    for it in items:
        color = " ".join(str(it.get("color") or "").split())
        talla = str(it.get("talla") or "").strip()
        if not color or not talla:
            continue
        clave = (color.lower(), talla)
        if clave in vistos:
            continue
        vistos.add(clave)
        fotos = [u for u in (it.get("imagenes") or []) if u]
        foto = it.get("foto_url") or (fotos[0] if fotos else None)
        hex_ = it.get("color_hex") or None
        ex = por_clave.get(clave)
        if ex:
            cambio = {}
            if ex.get("activa") is not True:
                cambio["activa"] = True            # una talla que se había quitado y se vuelve a marcar debe reactivarse
            if hex_ and ex.get("color_hex") != hex_:
                cambio["color_hex"] = hex_
            if foto != ex.get("foto_url") and (foto or fotos):
                cambio["foto_url"] = foto
            if fotos != (ex.get("imagenes") or []) and fotos:
                cambio["imagenes"] = fotos
            if cambio:
                a_parchar.append((ex["id"], cambio))
        else:
            sku = f"{sku_base}-{color_a_codigo(color)}-{talla_a_codigo(talla)}"
            nuevas.append({"producto_id": producto_id, "color": color, "color_hex": hex_, "talla": talla, "sku": sku,
                           "foto_url": foto, "imagenes": fotos, "activa": True})

    # SKU únicos: dentro del lote y contra TODA la tabla (dos colores pueden dar el mismo código corto)
    if nuevas:
        candidatos = list({n["sku"] for n in nuevas})
        ocupados = set()
        for i in range(0, len(candidatos), 80):
            trozo = ",".join('"' + c.replace('"', '') + '"' for c in candidatos[i:i + 80])
            ocupados |= {r["sku"] for r in (supabase_get(f"variantes?sku=in.({trozo})&select=sku") or [])}
        usados = set(skus_usados) | ocupados
        for n in nuevas:
            base = n["sku"]
            k = 2
            while n["sku"] in usados:
                n["sku"] = f"{base}-{k}"
                k += 1
            usados.add(n["sku"])

    creadas = 0
    try:
        if nuevas:
            supabase_post("variantes", nuevas)      # un solo insert, todo o nada
            creadas = len(nuevas)
    except Exception as e:
        # carrera con otra alta: se reintenta una por una con la lógica de colisiones de siempre
        print(f"[variantes/lote] insert masivo falló ({e}); reintentando una por una")
        creadas = 0
        for n in nuevas:
            try:
                crear_variante(dict(n), _staff)
                creadas += 1
            except Exception as e2:
                print(f"[variantes/lote] no se pudo crear {n.get('sku')}: {e2}")
    errores = 0
    for vid, cambio in a_parchar:
        try:
            supabase_patch(f"variantes?id=eq.{vid}", cambio)
        except Exception:
            errores += 1
    cache_invalidate_prefix(_CK)
    return {"ok": errores == 0 and creadas == len(nuevas), "creadas": creadas, "actualizadas": len(a_parchar) - errores, "errores": errores}


@router.post("/activar-todas")
def activar_variantes_sin_activa(_staff=Depends(require_staff)):
    """Activa todas las variantes que tienen activa=null (creadas sin el campo)"""
    from database import get_url, get_headers
    import urllib.request, json
    url = f"{get_url()}/rest/v1/variantes?activa=is.null"
    body = json.dumps({"activa": True}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=get_headers(), method="PATCH")
    try:
        with urllib.request.urlopen(req) as r:
            cache_invalidate_prefix(_CK)
            return {"ok": True, "actualizadas": r.read().decode()}
    except Exception as e:
        return {"error": str(e)}

@router.patch("/{variante_id}")
def actualizar_variante(variante_id: str, variante: dict, _staff=Depends(require_staff)):
    resultado = supabase_patch(f"variantes?id=eq.{variante_id}", variante)
    cache_invalidate_prefix(_CK)
    return resultado

@router.delete("/{variante_id}")
def eliminar_variante(variante_id: str, _staff=Depends(require_staff)):
    try:
        resultado = supabase_patch(f"variantes?id=eq.{variante_id}", {"activa": False})
        cache_invalidate_prefix(_CK)
        return resultado
    except Exception as e:
        return {"error": str(e)}

@router.post("/{variante_id}/eliminar")
def eliminar_variante_post(variante_id: str, _staff=Depends(require_staff)):
    try:
        resultado = supabase_patch(f"variantes?id=eq.{variante_id}", {"activa": False})
        cache_invalidate_prefix(_CK)
        return resultado
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
