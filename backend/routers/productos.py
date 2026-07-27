from fastapi import APIRouter, Body, Depends
from fastapi.responses import JSONResponse
from typing import List
import datetime
import re
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, obtener_consecutivo
from cache import cache_get, cache_set, cache_invalidate_prefix, TTL_FEEDS
from security import require_staff

router = APIRouter(prefix="/productos", tags=["Productos"])

_CK = "productos"  # prefijo de caché


def _asegurar_slug_unico(slug: str, sku_interno: str, excluir_id: str = None) -> str:
    """Si el slug ya lo usa otro producto activo, le agrega el SKU al final
    para desambiguar (mismo criterio que se usó para limpiar los duplicados
    existentes en 2026-07-21 -- 44 productos con slugs repetidos, incluyendo
    varios reducidos a una sola letra por un bug previo de generación)."""
    if not slug:
        return slug
    filtro = f"productos?slug=eq.{slug}&activo=eq.true"
    if excluir_id:
        filtro += f"&id=neq.{excluir_id}"
    existente = supabase_get(filtro)
    if existente:
        sufijo = re.sub(r"[^a-zA-Z0-9]+", "-", (sku_interno or "")).strip("-").lower()
        return f"{slug}-{sufijo}" if sufijo else slug
    return slug

@router.get("/mas-vendidos")
def productos_mas_vendidos(dias: int = 30, limit: int = 12):
    """Modelos más vendidos en los últimos N días (pedidos reales, sin cancelados
    ni borradores) -- usado como "Tendencia" en el catálogo del portal mayoreo."""
    cache_key = f"{_CK}_mas_vendidos_{dias}"
    cached = cache_get(cache_key)
    if cached is not None:
        return cached[:limit]
    try:
        fecha_inicio = (datetime.datetime.utcnow() - datetime.timedelta(days=dias)).isoformat()
        pedidos = supabase_get_all(
            f"pedidos?created_at=gte.{fecha_inicio}"
            f"&status=not.in.(cancelado,borrador,checkout_iniciado)&select=id"
        )
        pedido_ids = [p["id"] for p in pedidos]
        if not pedido_ids:
            cache_set(cache_key, [], ttl=TTL_FEEDS)
            return []

        conteo: dict = {}
        CHUNK = 200  # trocear el filtro in.() para no armar URLs gigantes
        for i in range(0, len(pedido_ids), CHUNK):
            bloque = pedido_ids[i:i + CHUNK]
            items = supabase_get_all(f"pedido_items?pedido_id=in.({','.join(bloque)})&select=variante_id,cantidad")
            var_ids = list({it["variante_id"] for it in items if it.get("variante_id")})
            if not var_ids:
                continue
            variantes = supabase_get_all(f"variantes?id=in.({','.join(var_ids)})&select=id,producto_id")
            var_a_prod = {v["id"]: v["producto_id"] for v in variantes}
            for it in items:
                pid = var_a_prod.get(it.get("variante_id"))
                if pid:
                    conteo[pid] = conteo.get(pid, 0) + (it.get("cantidad") or 0)

        ranking = sorted(conteo.items(), key=lambda x: x[1], reverse=True)[:max(limit, 20)]
        prod_ids = [pid for pid, _ in ranking]
        if not prod_ids:
            cache_set(cache_key, [], ttl=TTL_FEEDS)
            return []

        productos = supabase_get(
            f"productos?id=in.({','.join(prod_ids)})&activo=eq.true"
            f"&select=id,nombre,sku_interno,precio_menudeo,precio_mayoreo3,precio_mayoreo6,precio_corrida,es_oferta,imagen_principal,categoria"
        )
        prod_map = {p["id"]: p for p in productos}
        resultado = [dict(prod_map[pid], pares_vendidos=cant) for pid, cant in ranking if pid in prod_map]
        cache_set(cache_key, resultado, ttl=TTL_FEEDS)
        return resultado[:limit]
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

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
def listar_productos(categoria: str = None, activo: str = None, q: str = None, limit: int = None):
    cached = cache_get(_CK + "_all")
    if cached is not None:
        data = cached
    else:
        data = supabase_get("productos?order=orden_home.asc.nullslast,created_at.desc")
        cache_set(_CK + "_all", data)

    if categoria:
        cat_val = categoria.replace("eq.", "").strip().lower()
        data = [p for p in data if p.get("categoria") and p.get("categoria").strip().lower() == cat_val]

    if activo:
        act_val = activo.replace("eq.", "").strip().lower() == "true"
        data = [p for p in data if p.get("activo") == act_val]

    # Buscador del sitio (header): antes mandaba nombre=ilike.*termino* pero esta
    # función solo reconoce parámetros explícitos de FastAPI, así que ese filtro
    # (y el limit) se ignoraban en silencio -> siempre regresaba el catálogo
    # completo en el orden de acomodo, no lo que el cliente buscó.
    if q:
        q_val = q.strip().lower()
        data = [p for p in data if q_val in (p.get("nombre") or "").lower() or q_val in (p.get("sku_interno") or "").lower()]

    if limit:
        data = data[:limit]

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

@router.get("/slug/{slug}")
def producto_por_slug(slug: str):
    return supabase_get(f"productos?slug=eq.{slug}")

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

@router.get("/{id}")
def obtener_producto(id: str):
    return supabase_get(f"productos?id=eq.{id}")

@router.post("/")
def crear_producto(producto: dict, _staff=Depends(require_staff)):
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
    if producto.get("slug"):
        producto["slug"] = _asegurar_slug_unico(producto["slug"], producto.get("sku_interno"))
    resultado = supabase_post("productos", producto)
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}")
def actualizar_producto(id: str, producto: dict, _staff=Depends(require_staff)):
    if producto.get("sku_interno"):
        existente = supabase_get(f"productos?sku_interno=eq.{producto['sku_interno']}&id=neq.{id}")
        if existente:
            return {"error": f"El SKU {producto['sku_interno']} ya existe en otro producto"}
    if producto.get("slug"):
        sku_actual = producto.get("sku_interno") or (supabase_get(f"productos?id=eq.{id}&select=sku_interno") or [{}])[0].get("sku_interno")
        producto["slug"] = _asegurar_slug_unico(producto["slug"], sku_actual, excluir_id=id)
    resultado = supabase_patch(f"productos?id=eq.{id}", producto)
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}/desactivar")
def desactivar_producto(id: str, _staff=Depends(require_staff)):
    resultado = supabase_patch(f"productos?id=eq.{id}", {"activo": False})
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}/activar")
def activar_producto(id: str, _staff=Depends(require_staff)):
    resultado = supabase_patch(f"productos?id=eq.{id}", {"activo": True})
    cache_invalidate_prefix(_CK)
    return resultado

@router.post("/generar-nombres")
def generar_nombres(datos: dict = Body(default={}), _staff=Depends(require_staff)):
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

        tacon_parte = f"de {tacon_str}" if tacon_str else ""
        plantilla = PLANTILLAS.get(categoria, "{estilo}calzado de moda")
        descripcion_base = plantilla.format(
            estilo=estilo_str,
            tacon_parte=tacon_parte + " " if tacon_parte else ""
        ).strip()

        # Limpiar doble "de" (ej: "de verano de 11 cm" → "de verano 11 cm")
        import re as _re
        descripcion_base = _re.sub(r'\bde\s+de\b', 'de', descripcion_base)
        # Quitar "de" o "para" al final si quedó colgado
        descripcion_base = _re.sub(r'\s+(de|para|y)$', '', descripcion_base).strip()

        # Código: primer token del nombre original (CH2367, MA201, etc.)
        # NO usar sku_interno — ese es el código interno del sistema
        codigo_orig = nombre.split()[0] if nombre else (sku or "")
        nombre_nuevo = f"{codigo_orig} {descripcion_base}".strip() if codigo_orig else descripcion_base

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

@router.post("/orden-home")
def guardar_orden_home(ordenes: List[dict] = Body(...), _staff=Depends(require_staff)):
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


# Campos editables desde "Edición masiva" en el panel -- lista blanca a propósito,
# nunca aceptar un nombre de campo arbitrario del cliente (evita sobreescribir
# columnas como id/sku_interno/slug por error o de forma maliciosa).
_CAMPOS_BULK = {"costo", "precio_menudeo", "categoria", "subcategoria", "activo", "altura_tacon", "ocasion"}
_UUID_RE = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.I)


def _calcular_ocasion(actual, valor, modo):
    actual_set = set(actual or [])
    valor_set = set(valor if isinstance(valor, list) else [valor])
    if modo == "agregar":
        return sorted(actual_set | valor_set)
    if modo == "quitar":
        return sorted(actual_set - valor_set)
    return sorted(valor_set)  # reemplazar


@router.post("/bulk-actualizar")
def bulk_actualizar(datos: dict = Body(...), _staff=Depends(require_staff)):
    """Edita el mismo campo en varios productos a la vez (ej. corregir costo mal
    capturado en 20 productos de un jalón, en vez de entrar uno por uno).
    Body: {"ids": [...], "campo": "costo", "valor": 123.5, "modo": "preview"|"aplicar"}
    Para campo="ocasion" (array), "valor" es lista y "modo_ocasion" define si se
    agrega, se quita o se reemplaza por completo la lista actual de cada producto."""
    ids = [i for i in (datos.get("ids") or []) if _UUID_RE.match(str(i))]
    campo = datos.get("campo")
    valor = datos.get("valor")
    modo = datos.get("modo", "aplicar")
    modo_ocasion = datos.get("modo_ocasion", "reemplazar")

    if not ids:
        return {"ok": False, "error": "Selecciona al menos un producto válido"}
    if campo not in _CAMPOS_BULK:
        return {"ok": False, "error": f"Campo '{campo}' no permitido para edición masiva"}

    try:
        actuales = supabase_get(f"productos?id=in.({','.join(ids)})&select=id,nombre,sku_interno,{campo}") or []
    except Exception as e:
        return {"ok": False, "error": str(e)}
    por_id = {p["id"]: p for p in actuales}

    if modo == "preview":
        cambios = []
        for pid in ids:
            p = por_id.get(pid)
            if not p:
                continue
            actual_val = p.get(campo)
            nuevo_val = _calcular_ocasion(actual_val, valor, modo_ocasion) if campo == "ocasion" else valor
            cambios.append({
                "id": pid, "nombre": p.get("nombre"), "sku_interno": p.get("sku_interno"),
                "actual": actual_val, "nuevo": nuevo_val,
            })
        return {"ok": True, "modo": "preview", "total": len(cambios), "cambios": cambios}

    ok = 0
    errores = []
    for pid in ids:
        try:
            if campo == "ocasion":
                actual_val = (por_id.get(pid) or {}).get("ocasion") or []
                supabase_patch(f"productos?id=eq.{pid}", {"ocasion": _calcular_ocasion(actual_val, valor, modo_ocasion)})
            else:
                supabase_patch(f"productos?id=eq.{pid}", {campo: valor})
            ok += 1
        except Exception as e:
            errores.append({"id": pid, "error": str(e)})

    import time
    cache_invalidate_prefix(_CK)
    cache_set(_CK + "_version", {"v": int(time.time())}, ttl=3600)
    return {"ok": True, "modo": "aplicar", "actualizados": ok, "errores": errores}
