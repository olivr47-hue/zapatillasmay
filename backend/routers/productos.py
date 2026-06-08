from fastapi import APIRouter, Body
from typing import List
from database import supabase_get, supabase_post, supabase_patch, obtener_consecutivo
from cache import cache_get, cache_set, cache_invalidate_prefix

router = APIRouter(prefix="/productos", tags=["Productos"])

_CK = "productos"  # prefijo de caché

@router.get("/siguiente-sku/{categoria}/{proveedor}")
def siguiente_sku(categoria: str, proveedor: str):
    num = obtener_consecutivo("productos")
    cat_prefijos = {
        "tacones": "TAC", "sandalias": "SAN", "botas": "BOT",
        "botines": "BTN", "flats": "FLT", "plataformas": "PLT",
        "tenis": "TEN", "nina": "NIN", "accesorios": "ACC"
    }
    prefix = cat_prefijos.get(categoria, "MAY")
    prov = proveedor[0].upper() if proveedor else "M"
    sku_base = f"{prov}-{prefix}-{str(num).zfill(4)}"
    return {"sku_base": sku_base, "consecutivo": num}

@router.get("/")
def listar_productos():
    cached = cache_get(_CK + "_all")
    if cached is not None:
        return cached
    data = supabase_get("productos?order=orden_home.asc.nullslast,created_at.desc")
    cache_set(_CK + "_all", data)
    return data

@router.get("/destacados")
def productos_destacados():
    cached = cache_get(_CK + "_destacados")
    if cached is not None:
        return cached
    data = supabase_get("productos?destacado=eq.true&activo=eq.true")
    cache_set(_CK + "_destacados", data)
    return data

@router.get("/nuevos")
def productos_nuevos():
    cached = cache_get(_CK + "_nuevos")
    if cached is not None:
        return cached
    data = supabase_get("productos?nuevo=eq.true&activo=eq.true")
    cache_set(_CK + "_nuevos", data)
    return data

@router.get("/categoria/{categoria}")
def productos_por_categoria(categoria: str):
    key = f"{_CK}_cat_{categoria}"
    cached = cache_get(key)
    if cached is not None:
        return cached
    data = supabase_get(f"productos?categoria=eq.{categoria}&activo=eq.true")
    cache_set(key, data)
    return data

@router.get("/sku/{sku}")
def producto_por_sku(sku: str):
    return supabase_get(f"productos?sku_interno=eq.{sku}")

@router.get("/{id}")
def obtener_producto(id: str):
    return supabase_get(f"productos?id=eq.{id}")

@router.post("/")
def crear_producto(producto: dict):
    # Si tiene SKU, verificar que no exista
    if producto.get("sku_interno"):
        existente = supabase_get(f"productos?sku_interno=eq.{producto['sku_interno']}")
        if existente:
            # Generar nuevo SKU
            num = obtener_consecutivo("productos")
            categoria = producto.get("categoria", "tacones")
            proveedor = producto.get("proveedor", "M")
            cat_prefijos = {
                "tacones": "TAC", "sandalias": "SAN", "botas": "BOT",
                "botines": "BTN", "flats": "FLT", "plataformas": "PLT",
                "tenis": "TEN", "nina": "NIN", "accesorios": "ACC"
            }
            prefix = cat_prefijos.get(categoria, "MAY")
            prov = proveedor[0].upper() if proveedor else "M"
            producto["sku_interno"] = f"{prov}-{prefix}-{str(num).zfill(4)}"
    resultado = supabase_post("productos", producto)
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}")
def actualizar_producto(id: str, producto: dict):
    if producto.get("sku_interno"):
        existente = supabase_get(f"productos?sku_interno=eq.{producto['sku_interno']}&id=neq.{id}")
        if existente:
            return {"error": f"El SKU {producto['sku_interno']} ya existe en otro producto"}
    resultado = supabase_patch(f"productos?id=eq.{id}", producto)
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}/desactivar")
def desactivar_producto(id: str):
    resultado = supabase_patch(f"productos?id=eq.{id}", {"activo": False})
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}/activar")
def activar_producto(id: str):
    resultado = supabase_patch(f"productos?id=eq.{id}", {"activo": True})
    cache_invalidate_prefix(_CK)
    return resultado

@router.post("/generar-nombres")
def generar_nombres(datos: dict = Body(default={})):
    """Genera nombres descriptivos para todos los productos basándose en
    SKU + categoría + descripción/SEO. Muestra preview o aplica según modo."""
    modo = datos.get("modo", "preview")  # "preview" o "aplicar"
    solo_sin_descripcion = datos.get("solo_sin_descripcion", False)

    CATEGORIA_LABEL = {
        "tacones":    "Tacones",
        "sandalias":  "Sandalias",
        "botas":      "Botas",
        "botines":    "Botines",
        "flats":      "Flats",
        "plataformas":"Plataformas",
        "tenis":      "Tenis",
        "nina":       "Calzado Niña",
        "accesorios": "Accesorios",
    }

    try:
        productos = supabase_get(
            "productos?select=id,nombre,sku_interno,categoria,descripcion,"
            "meta_titulo,meta_descripcion,altura_tacon,activo"
        )
    except Exception as e:
        return {"ok": False, "error": str(e)}

    resultados = []
    for p in productos:
        sku       = (p.get("sku_interno") or "").strip()
        nombre    = (p.get("nombre") or "").strip()
        categoria = (p.get("categoria") or "").strip().lower()
        desc      = (p.get("descripcion") or "").strip()
        meta_t    = (p.get("meta_titulo") or "").strip()
        meta_d    = (p.get("meta_descripcion") or "").strip()
        tacon     = p.get("altura_tacon")

        if solo_sin_descripcion and len(nombre.split()) > 2:
            # Ya tiene nombre descriptivo, saltar
            continue

        # Plantillas base por categoría — suenan naturales en tienda
        # {tacon_parte} se reemplaza solo si hay altura, si no queda vacío
        PLANTILLAS = {
            "tacones":    "Tacones {estilo}{tacon_parte}",
            "sandalias":  "Sandalias {estilo}para dama",
            "botas":      "Botas {estilo}para dama",
            "botines":    "Botines {estilo}para dama",
            "flats":      "Flats {estilo}para dama",
            "plataformas":"Plataformas {estilo}{tacon_parte}",
            "tenis":      "Tenis {estilo}para dama",
            "nina":       "Calzado niña {estilo}",
            "accesorios": "Accesorios {estilo}de moda",
        }

        # Extraer palabra de estilo/ocasión de la fuente más rica
        fuente = desc or meta_d or meta_t or ""
        fuente_lower = fuente.lower()

        OCASIONES = [
            ("fiesta",        "para fiesta "),
            ("boda",          "para boda "),
            ("graduacion",    "para graduación "),
            ("graduación",    "para graduación "),
            ("quinceanera",   "para quinceañera "),
            ("quinceañera",   "para quinceañera "),
            ("oficina",       "de oficina "),
            ("casual",        "casual "),
            ("diario",        "casual "),
            ("elegante",      "elegantes "),
            ("comodo",        "cómodas "),
            ("cómodo",        "cómodas "),
            ("verano",        "de verano "),
            ("moda",          "de moda "),
        ]
        estilo_str = ""
        for kw, label in OCASIONES:
            if kw in fuente_lower:
                estilo_str = label
                break

        # Altura del tacón
        tacon_str = ""
        if tacon:
            try:
                h = float(tacon)
                if h >= 9:
                    tacon_str = f"alto {h:.0f} cm"
                elif h >= 6:
                    tacon_str = f"medianos {h:.0f} cm"
                else:
                    tacon_str = f"bajo {h:.0f} cm"
            except Exception:
                pass

        tacon_parte = f"de {tacon_str} " if tacon_str else ""
        plantilla = PLANTILLAS.get(categoria, "{estilo}calzado de moda")
        descripcion_base = plantilla.format(
            estilo=estilo_str,
            tacon_parte=tacon_parte
        ).strip()

        # Nombre final: SKU original + descripción natural
        # El SKU siempre se preserva al inicio
        codigo = sku if sku else nombre.split()[0] if nombre else ""
        nombre_nuevo = f"{codigo} {descripcion_base}".strip() if codigo else descripcion_base

        resultados.append({
            "id":          p["id"],
            "nombre_orig": nombre,
            "nombre_nuevo": nombre_nuevo,
            "sku":         sku,
        })

        if modo == "aplicar":
            try:
                supabase_patch(f"productos?id=eq.{p['id']}", {"nombre": nombre_nuevo})
            except Exception as e:
                resultados[-1]["error"] = str(e)

    if modo == "aplicar":
        cache_invalidate_prefix(_CK)

    return {
        "ok":       True,
        "modo":     modo,
        "total":    len(resultados),
        "productos": resultados
    }

@router.get("/catalog-version")
def catalog_version():
    """Versión del catálogo — la tienda lo usa para invalidar su caché local."""
    cached = cache_get(_CK + "_version")
    if cached is not None:
        return cached
    import time
    v = {"v": int(time.time())}
    cache_set(_CK + "_version", v, ttl=3600)
    return v

@router.post("/orden-home")
def guardar_orden_home(ordenes: List[dict] = Body(...)):
    """Guarda el orden de aparición en la home. Recibe [{id, orden_home}]."""
    errores = []
    for item in ordenes:
        try:
            supabase_patch(f"productos?id=eq.{item['id']}", {"orden_home": item["orden_home"]})
        except Exception as e:
            errores.append({"id": item["id"], "error": str(e)})
    import time
    cache_invalidate_prefix(_CK)
    # Actualizar versión del catálogo para que la tienda invalide su caché
    cache_set(_CK + "_version", {"v": int(time.time())}, ttl=3600)
    return {"ok": True, "actualizados": len(ordenes) - len(errores), "errores": errores}
