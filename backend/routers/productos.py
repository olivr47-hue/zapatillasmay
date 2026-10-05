from fastapi import APIRouter, Body, Depends
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from typing import List
import datetime
import re
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, obtener_consecutivo
from cache import cache_get, cache_set, cache_invalidate_prefix, TTL_FEEDS
from security import require_staff, bearer_opcional, payload_opcional, es_personal

router = APIRouter(prefix="/productos", tags=["Productos"])

_CK = "productos"  # prefijo de caché

# Datos internos que NO deben salir en los GET públicos (los consume la tienda sin login):
# costo, proveedor y alertas de reposición. El panel (token de personal) sigue viéndolos.
_CAMPOS_INTERNOS = ("costo", "proveedor", "proveedor_id", "stock_minimo")


def _publico(data, credentials):
    """Quita los campos internos si quien pide NO es personal con token válido."""
    p = payload_opcional(credentials)
    if p and es_personal(p):
        return data
    def _limpia(row):
        return {k: v for k, v in row.items() if k not in _CAMPOS_INTERNOS} if isinstance(row, dict) else row
    return [_limpia(r) for r in data] if isinstance(data, list) else _limpia(data)


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

_TIPO_SINGULAR_SEO = {
    "tacones": "Tacones", "sandalias": "Sandalias", "botas": "Botas", "botines": "Botines", "flats": "Flats",
    "plataformas": "Plataformas", "tenis": "Tenis", "nina": "Calzado para niña", "accesorios": "Accesorios",
}


_PALABRAS_SUELTAS = {"con", "de", "del", "para", "y", "e", "en", "a", "el", "la", "los", "las", "muy", "un", "una", "al", "por", "sin"}


def _recorta_palabras(texto, maximo):
    """Recorta a `maximo` caracteres sin partir palabras ni dejar conectores sueltos al final ("... con")."""
    t = " ".join(str(texto or "").split())
    if len(t) <= maximo:
        return t
    palabras = t[:maximo].rsplit(" ", 1)[0].split()
    while len(palabras) > 1 and palabras[-1].lower().strip(",.;:") in _PALABRAS_SUELTAS:
        palabras.pop()
    return " ".join(palabras) or t[:maximo]


def _slug_de(texto):
    import unicodedata
    t = unicodedata.normalize("NFD", str(texto or "").lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = re.sub(r"[^a-z0-9\s-]", "", t)
    return re.sub(r"-+", "-", re.sub(r"\s+", "-", t.strip())).strip("-")


def _completar_seo(p, base=None):
    """Garantiza slug, meta título y meta descripción con buena estructura. Solo rellena lo que está VACÍO (nunca pisa lo que
    ya escribió la dueña ni lo generado con IA); lo que sí se corrige siempre es el largo (Google corta títulos de más de
    60 y descripciones de más de 160 caracteres). `base` = datos ya guardados del producto (al editar)."""
    b = dict(base or {})
    b.update({k: v for k, v in p.items() if v not in (None, "")})
    nombre = " ".join(str(b.get("nombre") or "").split())
    if not nombre:
        return p
    cat = (b.get("categoria") or "").strip().lower()
    cat_txt = _TIPO_SINGULAR_SEO.get(cat, "Calzado")
    # Nombre "legible": si es solo un código (1 palabra, ej. "Mar1702") se le agrega el tipo de calzado
    base_nombre = nombre if len(nombre.split()) >= 3 else f"{nombre} {cat_txt}"
    # slug
    if not (p.get("slug") or "").strip():
        p["slug"] = _slug_de(base_nombre)[:90].strip("-")
    # meta título: "<nombre legible> | Zapatillas May" (30-60 caracteres)
    mt = (p.get("meta_titulo") or "").strip()
    if not mt:
        corto = _recorta_palabras(base_nombre, 60 - len(" | Zapatillas May"))
        mt = f"{corto} | Zapatillas May"
        if len(mt) < 30:
            mt = f"{corto} para Dama | Zapatillas May"
    p["meta_titulo"] = _recorta_palabras(mt, 60) if len(mt) > 60 else mt
    # meta descripción (140-160 caracteres, con tipo, material, tacón, precio y envío)
    md = (p.get("meta_descripcion") or "").strip()
    if not md:
        extras = []   # en orden de importancia: se agregan mientras quepan en 158 caracteres
        try:
            precio = float(b.get("precio_menudeo") or 0)
            if precio > 0:
                precio = precio if b.get("es_oferta") else precio + 80
                extras.append(f"Desde ${precio:,.0f} MXN.")
        except (TypeError, ValueError):
            pass
        extras.append("Envío a todo México.")
        if b.get("material"):
            extras.append(f"Material {str(b['material']).strip().capitalize()}.")
        try:
            altura = float(b.get("altura_tacon") or 0)
        except (TypeError, ValueError):
            altura = 0
        if altura > 0:
            tipo = str(b.get("tipo_tacon") or "").strip().replace("_", " ")
            tipo = "" if tipo.lower() in ("sin tacon", "sin tacón", "") else tipo
            extras.append(f"Tacón {tipo + ' ' if tipo else ''}de {altura:g} cm.")
        extras.append("Hecho en México.")
        md = f"Compra {_recorta_palabras(base_nombre, 55)} en Zapatillas May."
        for e in extras:
            if len(md) + 1 + len(e) <= 158:
                md += " " + e
    p["meta_descripcion"] = md
    return p


_CAT_PREFIJOS = {
    "tacones": "TAC", "sandalias": "SAN", "botas": "BOT", "botines": "BTN",
    "flats": "FLT", "plataformas": "PLT", "tenis": "TEN", "nina": "NIN", "accesorios": "ACC",
}


def _generar_sku(categoria, proveedor=None, nombre=None):
    """SKU base 'P-CAT-0001'. La letra sale del proveedor; si no hay, de la primera letra del nombre del modelo
    (MA6902 -> M); y si tampoco es letra, 'M'. Antes el SKU solo se generaba con proveedor capturado y, sin él, el
    modelo se guardaba SIN SKU (y sus variantes salían como 'None-NEGRO-24')."""
    num = obtener_consecutivo("productos")
    prefix = _CAT_PREFIJOS.get(categoria, "MAY")
    letra = ""
    for texto in (proveedor, nombre):
        t = (texto or "").strip()
        if t and t[0].isalpha():
            letra = t[0].upper()
            break
    return f"{letra or 'M'}-{prefix}-{str(num).zfill(4)}", num


@router.get("/siguiente-sku/{categoria}/{proveedor}")
def siguiente_sku(categoria: str, proveedor: str, _staff=Depends(require_staff)):
    sku_base, num = _generar_sku(categoria, proveedor)
    return {"sku_base": sku_base, "consecutivo": num}

@router.get("/")
def listar_productos(categoria: str = None, activo: str = None, q: str = None, limit: int = None,
                     credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
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

    return _publico(data, credentials)

@router.get("/destacados")
def productos_destacados(credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    cached = cache_get(_CK + "_destacados")
    if cached is not None:
        return _publico(cached, credentials)
    data = supabase_get("productos?destacado=eq.true&activo=eq.true")
    cache_set(_CK + "_destacados", data)
    return _publico(data, credentials)

@router.get("/nuevos")
def productos_nuevos(credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    cached = cache_get(_CK + "_nuevos")
    if cached is not None:
        return _publico(cached, credentials)
    data = supabase_get("productos?nuevo=eq.true&activo=eq.true")
    cache_set(_CK + "_nuevos", data)
    return _publico(data, credentials)

@router.get("/categoria/{categoria}")
def productos_por_categoria(categoria: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    key = f"{_CK}_cat_{categoria}"
    cached = cache_get(key)
    if cached is not None:
        return _publico(cached, credentials)
    data = supabase_get(f"productos?categoria=eq.{categoria}&activo=eq.true")
    cache_set(key, data)
    return _publico(data, credentials)

@router.get("/sku/{sku}")
def producto_por_sku(sku: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    return _publico(supabase_get(f"productos?sku_interno=eq.{sku}"), credentials)

@router.get("/slug/{slug}")
def producto_por_slug(slug: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    return _publico(supabase_get(f"productos?slug=eq.{slug}"), credentials)

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
def obtener_producto(id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    return _publico(supabase_get(f"productos?id=eq.{id}"), credentials)

@router.post("/")
def crear_producto(producto: dict, _staff=Depends(require_staff)):
    if isinstance(producto.get("nombre"), str):
        producto["nombre"] = " ".join(producto["nombre"].split())   # sin espacios al borde (109 modelos los tenían)
    sku_dado = (producto.get("sku_interno") or "").strip()
    producto["sku_interno"] = sku_dado or None
    # Sin SKU, o con uno que ya existe: se genera uno nuevo (un modelo NUNCA se guarda sin SKU)
    if not sku_dado or supabase_get(f"productos?sku_interno=eq.{sku_dado}"):
        producto["sku_interno"], _ = _generar_sku(producto.get("categoria", "tacones"), producto.get("proveedor"), producto.get("nombre"))
    _completar_seo(producto)   # slug / meta título / meta descripción siempre presentes y con buen largo
    if producto.get("slug"):
        producto["slug"] = _asegurar_slug_unico(producto["slug"], producto.get("sku_interno"))
    resultado = supabase_post("productos", producto)
    cache_invalidate_prefix(_CK)
    return resultado

@router.patch("/{id}")
def actualizar_producto(id: str, producto: dict, _staff=Depends(require_staff)):
    if isinstance(producto.get("nombre"), str):
        producto["nombre"] = " ".join(producto["nombre"].split())
    # Un campo SKU vacío en el formulario NO debe borrar el SKU que ya tiene el modelo (así lo perdió RX2201)
    if "sku_interno" in producto and not (producto.get("sku_interno") or "").strip():
        producto.pop("sku_interno")
        actual = (supabase_get(f"productos?id=eq.{id}&select=sku_interno,categoria,proveedor,nombre") or [{}])[0]
        if not (actual.get("sku_interno") or "").strip():
            producto["sku_interno"], _ = _generar_sku(producto.get("categoria") or actual.get("categoria"), producto.get("proveedor") or actual.get("proveedor"), producto.get("nombre") or actual.get("nombre"))
    # SEO: si el formulario mandó alguno de los campos SEO vacío, se completa (con los datos ya guardados del modelo)
    if any(k in producto for k in ("slug", "meta_titulo", "meta_descripcion")):
        actual_seo = (supabase_get(f"productos?id=eq.{id}&select=nombre,categoria,material,altura_tacon,tipo_tacon,precio_menudeo,es_oferta,slug,meta_titulo,meta_descripcion") or [{}])[0]
        for k in ("slug", "meta_titulo", "meta_descripcion"):
            if k in producto and not (producto.get(k) or "").strip():
                producto.pop(k)
                if (actual_seo.get(k) or "").strip():
                    continue          # ya tenía uno guardado: se conserva
                producto[k] = ""      # vacío y sin respaldo: lo genera _completar_seo
        if any(producto.get(k) == "" for k in ("slug", "meta_titulo", "meta_descripcion")):
            _completar_seo(producto, actual_seo)
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
_CAMPOS_BULK = {"costo", "precio_menudeo", "categoria", "subcategoria", "activo", "altura_tacon", "ocasion", "descripcion", "temporada"}
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


@router.post("/bulk-guardar")
def bulk_guardar(datos: dict = Body(...), _staff=Depends(require_staff)):
    """Guarda una tabla de edición masiva tipo hoja de cálculo, donde cada producto
    puede tener valores distintos (ej. corregir el costo de 20 productos que traían
    números diferentes, todo en un solo guardado, en vez de repetir el mismo valor
    en todos como hace /bulk-actualizar.
    Body: {"items": [{"id": "...", "costo": 120, "precio_menudeo": 350, "ocasion": [...], ...}, ...]}"""
    items = datos.get("items") or []
    if not items:
        return {"ok": False, "error": "No hay cambios que guardar"}

    ok = 0
    errores = []
    for item in items:
        pid = item.get("id")
        if not pid or not _UUID_RE.match(str(pid)):
            errores.append({"id": pid, "error": "id inválido"})
            continue
        cambios = {k: v for k, v in item.items() if k != "id" and k in _CAMPOS_BULK}
        if not cambios:
            continue
        try:
            supabase_patch(f"productos?id=eq.{pid}", cambios)
            ok += 1
        except Exception as e:
            errores.append({"id": pid, "error": str(e)})

    import time
    cache_invalidate_prefix(_CK)
    cache_set(_CK + "_version", {"v": int(time.time())}, ttl=3600)
    return {"ok": True, "actualizados": ok, "errores": errores}
