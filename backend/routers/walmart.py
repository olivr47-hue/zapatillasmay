# -*- coding: utf-8 -*-
"""
Router Walmart Marketplace API (MX) — ERP Zapatillas May.

Autenticación: OAuth2 client_credentials, Client ID/Client Secret sacados del
Walmart Developer Portal (Seller Center -> API keys). El access token dura
15 minutos (900s); se cachea en memoria y se renueva solo cuando falta poco
para vencer, mismo patrón que el token de MercadoLibre.

Headers obligatorios en TODAS las llamadas autenticadas (fuera del Token API):
  WM_SEC.ACCESS_TOKEN, WM_QOS.CORRELATION_ID, WM_SVC.NAME, WM_MARKET=mx.
"""

import os, json, time, uuid, base64, io, shutil
import urllib.request, urllib.error, urllib.parse
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from database import supabase_get_all, supabase_post

router = APIRouter(prefix="/walmart", tags=["Walmart"])

# ─── Configuración ──────────────────────────────────────────────────────────
WALMART_CLIENT_ID     = os.getenv("WALMART_CLIENT_ID", "")
WALMART_CLIENT_SECRET = os.getenv("WALMART_CLIENT_SECRET", "")
WALMART_BASE          = "https://marketplace.walmartapis.com/v3"
WALMART_MARKET        = "mx"

_token_cache = {"token": "", "expires_at": 0.0}


def _walmart_get_token() -> str:
    """Token API (POST /v3/token, grant_type=client_credentials). El token
    dura 900s -- se renueva con 60s de margen antes de que venza."""
    now = time.time()
    if _token_cache["token"] and _token_cache["expires_at"] > now + 60:
        return _token_cache["token"]
    if not (WALMART_CLIENT_ID and WALMART_CLIENT_SECRET):
        raise HTTPException(500, "Faltan WALMART_CLIENT_ID / WALMART_CLIENT_SECRET en el entorno")

    basic = base64.b64encode(f"{WALMART_CLIENT_ID}:{WALMART_CLIENT_SECRET}".encode()).decode()
    body  = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()
    req = urllib.request.Request(
        f"{WALMART_BASE}/token", data=body, method="POST",
        headers={
            "Authorization":          f"Basic {basic}",
            "Content-Type":           "application/x-www-form-urlencoded",
            "Accept":                 "application/json",
            "WM_MARKET":              WALMART_MARKET,
            "WM_SVC.NAME":            "Walmart Marketplace",
            "WM_QOS.CORRELATION_ID":  str(uuid.uuid4()),
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="ignore")
        raise HTTPException(e.code, f"Walmart token error: {detalle}")
    except urllib.error.URLError as e:
        raise HTTPException(502, f"Walmart token: no se pudo conectar ({e.reason})")

    _token_cache["token"]      = resp["access_token"]
    _token_cache["expires_at"] = now + int(resp.get("expires_in", 900))
    return _token_cache["token"]


def _walmart_headers(extra: dict = None) -> dict:
    headers = {
        "WM_SEC.ACCESS_TOKEN":     _walmart_get_token(),
        "WM_SVC.NAME":             "Walmart Marketplace",
        "WM_QOS.CORRELATION_ID":   str(uuid.uuid4()),
        "WM_MARKET":               WALMART_MARKET,
        "Accept":                  "application/json",
    }
    if extra:
        headers.update(extra)
    return headers


def walmart_get(path: str, params: dict = None) -> dict:
    url = f"{WALMART_BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
    req = urllib.request.Request(url, headers=_walmart_headers())
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="ignore")
        raise HTTPException(e.code, f"Walmart API error: {detalle}")


def walmart_post(path: str, data: dict) -> dict:
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{WALMART_BASE}{path}", data=body, method="POST",
        headers=_walmart_headers({"Content-Type": "application/json"}),
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="ignore")
        raise HTTPException(e.code, f"Walmart API error: {detalle}")


def walmart_post_file(path: str, params: dict, filename: str, content: bytes) -> dict:
    """POST multipart/form-data con un archivo en el campo 'file' -- usado por
    la Feeds API (carga masiva). Se arma el multipart a mano porque el resto
    del proyecto no usa la librería `requests`."""
    boundary = uuid.uuid4().hex
    mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    parts = []
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: {mime}\r\n\r\n".encode()
    )
    parts.append(content)
    parts.append(f"\r\n--{boundary}--\r\n".encode())
    body = b"".join(parts)

    url = f"{WALMART_BASE}{path}?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(
        url, data=body, method="POST",
        headers=_walmart_headers({"Content-Type": f"multipart/form-data; boundary={boundary}"}),
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detalle = e.read().decode(errors="ignore")
        raise HTTPException(e.code, f"Walmart API error: {detalle}")


@router.get("/ping")
def walmart_ping():
    """Prueba de conexión: pide un token y hace una llamada liviana autenticada
    (Get All Items, 1 resultado) para confirmar que las credenciales funcionan
    de punta a punta."""
    _walmart_get_token()
    try:
        resp = walmart_get("/items", params={"limit": 1})
    except HTTPException as e:
        return {"ok": False, "token_ok": True, "error": e.detail}
    return {"ok": True, "respuesta": resp}


# ─── Feed "Zapatos" — carga sin UPC (folio Walmart 15476267) ──────────────────
# Walmart activó la carga sin UPC solo para la categoría/subcategoría Zapatos y
# confirmó por escrito que "la carga sin UPC se puede realizar únicamente a
# través de la carga masiva" (Feeds API), colocando GTIN como Product ID Type
# y la palabra literal CUSTOM como Product ID. La plantilla oficial (spec
# footwear_other v3.24, hoja "Zapatos") se guardó en backend/data/ tal como la
# entregó Walmart -- se llena por posición de columna, no se reconstruye.
_TEMPLATE_PATH  = os.path.join(os.path.dirname(__file__), "..", "data", "walmart_plantilla_zapatos.xlsx")
_TEMPLATE_SHEET = "Zapatos"
_DATA_START_ROW = 10

# ProductTaxCode: la descripción en inglés de la plantilla habla de "Taxware"
# (motor de impuestos genérico de EE.UU.), pero la traducción al español de la
# propia plantilla MX (fila 9, columna N) aclara que en realidad es la clave
# del Catálogo de Productos y Servicios del SAT (c_ClaveProdServ) -- el mismo
# catálogo que usa cualquier factura CFDI. Verificado contra el catálogo
# oficial (familia 5311 Calzado, anexo 20 v4.0), no contra un resumen de IA.
_SAT_CLAVE_PRODSERV = {
    "tacones":     "53111602",  # Zapatos para mujer
    "flats":       "53111602",  # Zapatos para mujer
    "plataformas": "53111602",  # Zapatos para mujer
    "sandalias":   "53111802",  # Sandalias para mujer
    "botas":       "53111502",  # Botas para mujer
    "botines":     "53111502",  # Botas para mujer (el SAT no distingue botín de bota)
    "tenis":       "53111902",  # Calzado deportivo/atlético para mujer
    "nina":        "53111604",  # Zapatos para niña (default -- esta categoría no distingue tipo de calzado)
    "_default":    "53111600",  # Zapatos (genérico)
}

# Medidas de caja por par, confirmadas por el negocio (cm/kg). La medida más
# larga siempre va en "profundidad" (measure/unit de la columna T/U), como
# exige la plantilla.
_CAJAS = {
    "botas":    {"depth": "60", "width": "35", "height": "12", "weight": "1.8"},
    "botines":  {"depth": "35", "width": "35", "height": "12", "weight": "1.3"},
    "_default": {"depth": "30", "width": "26", "height": "12", "weight": "0.9"},
}

_GENERO_POR_CATEGORIA        = {"nina": "Niña"}          # resto -> "Mujer"
_SHOE_CATEGORY_POR_CATEGORIA = {"nina": "Zapatos de niña"}  # resto -> "Zapatos de mujer"
_AGE_GROUP_POR_CATEGORIA     = {"nina": "Infantil"}       # resto -> "Adulto"

# Normalizado (sin acentos, minúsculas) -> valor de la lista cerrada colorCategory
# de Walmart (Hidden_footwear_other!BN21:BN56). Mismo criterio que _MAIN_COLOR
# de mercadolibre.py, adaptado a las opciones que sí existen en esta lista.
_COLOR_CATEGORY = {
    "negro": "Negro", "black": "Negro",
    "blanco": "Blanco", "white": "Blanco",
    "azul": "Azul", "blue": "Azul",
    "rojo": "Rojo", "red": "Rojo",
    "marron": "Café", "cafe": "Café", "brown": "Café", "camel": "Café", "camello": "Camello",
    "latte": "Beige", "beige": "Beige", "nude": "Beige", "hueso": "Beige",
    "rosa": "Rosa", "pink": "Rosa", "fucsia": "Fucsia",
    "violeta": "Morado", "morado": "Morado", "lila": "Lila", "purpura": "Morado",
    "verde": "Verde", "green": "Verde",
    "naranja": "Anaranjado", "orange": "Anaranjado", "anaranjado": "Anaranjado",
    "amarillo": "Amarillo", "yellow": "Amarillo",
    "gris": "Gris", "gray": "Gris",
    "dorado": "Dorado", "gold": "Dorado", "oro": "Dorado",
    "plateado": "Plateado", "silver": "Plateado", "plata": "Plateado", "inox": "Acero Inox",
    "celeste": "Aqua", "aqua": "Aqua", "turquesa": "Turquesa",
    "transparente": "Transparente", "vino": "Vino", "chocolate": "Chocolate", "tabaco": "Tabaco",
    "multicolor": "Multicolor",
}

# Tallas válidas de la lista cerrada shoeSize (Hidden_footwear_other!BK21:BK59):
# "12 (MX)" .. "31 (MX)" en pasos de 0.5.
_TALLAS_VALIDAS_MX = {f"{n/2:g} (MX)" for n in range(24, 63)}


def _normalizar(s: str) -> str:
    s = (s or "").strip().lower()
    for a, b in (("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u"), ("ñ", "n")):
        s = s.replace(a, b)
    return s


def _cloudinary_cuadrada(url: str, size: int = 2200) -> str:
    marcador = "/image/upload/"
    if not url or marcador not in url:
        return url
    return url.replace(marcador, f"{marcador}c_fill,g_auto,w_{size},h_{size}/", 1)


def _talla_display(talla) -> str:
    return str(talla or "").strip().replace("_", ".")


def _fila_variante(producto: dict, variante: dict, es_primaria: bool) -> dict:
    """Arma un dict {columna_Zapatos: valor} para una variante (talla+color =
    1 SKU). Las columnas están fijas a mano según la plantilla oficial (hoja
    Zapatos, filas 4/5) -- varias columnas repiten el mismo xmlName
    (measure/unit x4, productSecondaryImageURL x4) por lo que no se puede
    resolver por nombre, solo por posición."""
    categoria = producto.get("categoria") or ""
    nombre    = producto.get("nombre") or ""
    sku       = variante.get("sku") or ""
    color     = variante.get("color") or ""
    talla     = _talla_display(variante.get("talla"))
    caja      = _CAJAS.get(categoria, _CAJAS["_default"])
    clave_sat = _SAT_CLAVE_PRODSERV.get(categoria, _SAT_CLAVE_PRODSERV["_default"])

    fotos = list(variante.get("imagenes") or [])
    if not fotos and variante.get("foto_url"):
        fotos = [variante["foto_url"]]
    if not fotos and producto.get("imagen_principal"):
        fotos = [producto["imagen_principal"]]
    fotos = [f for f in fotos if f]
    imagen_principal = _cloudinary_cuadrada(fotos[0]) if fotos else ""
    imagenes_extra    = [_cloudinary_cuadrada(u) for u in fotos[1:4]]

    color_categoria = _COLOR_CATEGORY.get(_normalizar(color), "Multicolor")
    genero          = _GENERO_POR_CATEGORIA.get(categoria, "Mujer")
    shoe_category   = _SHOE_CATEGORY_POR_CATEGORIA.get(categoria, "Zapatos de mujer")
    age_group       = _AGE_GROUP_POR_CATEGORIA.get(categoria, "Adulto")
    material        = producto.get("material") or "Sintético"
    talla_walmart   = f"{talla} (MX)"

    fila = {
        "D": sku, "E": "GTIN", "F": "CUSTOM",
        "G": f"{nombre} {color} Talla {talla} - Marca May"[:200],
        "H": "May",
        "I": imagen_principal,
        "J": f"Calzado {nombre} color {color}; Marca May; talla {talla} (sistema mexicano)"[:4000],
        "K": (producto.get("descripcion") or f"{nombre}. Calzado Marca May, color {color}, talla {talla}.")[:4000],
        "L": float(producto.get("precio_menudeo") or 0),
        "M": "May",
        "N": clave_sat,
        "O": "No",
        "P": caja["width"],  "Q": "cm",
        "R": caja["height"], "S": "cm",
        "T": caja["depth"],  "U": "cm",
        "V": caja["weight"], "W": "kg",
        "X": "0",
        "Y": "Garantía de 30 días por defectos de fabricación.",
        "Z": "Aplica por defectos de fabricación bajo uso normal del producto.",
        "AA": "1",
        "AB": "MX - México",
        "AC": "1 par de zapatos",
        "AD": "Nuevo",
        "AE": genero,
        "AF": color_categoria,
        "AG": "1",
        "AH": material,
        "AI": "Uso diario",
        "AQ": "México",
        "BL": shoe_category,
        "BK": age_group,
        "BP": color,
        "DB": f"{producto.get('sku_interno','')}-{_normalizar(color)}",
        "DC": "Talla del Zapato",
        "DD": "Sí" if es_primaria else "No",
        "DI": "No",
        "DK": "No",
    }
    if talla_walmart in _TALLAS_VALIDAS_MX:
        fila["BJ"] = talla_walmart
    for letra, url in zip(("AJ", "AK", "AL"), imagenes_extra):
        fila[letra] = url
    return fila


def _variantes_publicables() -> list:
    """Productos activos (excepto 'accesorios', fuera del alcance de la
    categoría Zapatos aprobada) con sus variantes activas, listas para armar
    el feed. Se agrupa por (producto_id, color) para elegir una variante
    "primaria" por grupo de talla -- Walmart la exige para variantes."""
    productos = supabase_get_all(
        "productos?activo=eq.true&categoria=neq.accesorios"
        "&select=id,sku_interno,nombre,categoria,precio_menudeo,descripcion,material,imagen_principal"
    )
    # Modelos de uso interno (lotes "OFERTA250", "OFERTA200", etc.) no se publican
    # en ningún canal externo, solo existen para uso interno del ERP.
    productos = [p for p in productos if not _normalizar(p.get("nombre") or "").startswith("oferta")
                 and not _normalizar(p.get("sku_interno") or "").startswith("oferta")]
    if not productos:
        return []
    ids_str   = ",".join(p["id"] for p in productos)
    variantes = supabase_get_all(
        f"variantes?producto_id=in.({ids_str})&activa=eq.true"
        "&select=id,producto_id,sku,color,talla,foto_url,imagenes"
    )
    inventario = supabase_get_all("inventario?select=variante_id,cantidad")
    stock_por_variante: dict = {}
    for row in inventario:
        stock_por_variante[row["variante_id"]] = stock_por_variante.get(row["variante_id"], 0) + (row.get("cantidad") or 0)

    productos_por_id = {p["id"]: p for p in productos}
    grupos: dict = {}   # (producto_id, color) -> [variantes]
    for v in variantes:
        grupos.setdefault((v["producto_id"], v.get("color")), []).append(v)

    resultado = []
    for (pid, color), vs in grupos.items():
        producto = productos_por_id.get(pid)
        if not producto or not producto.get("sku_interno"):
            continue
        vs_ordenadas = sorted(vs, key=lambda v: _talla_display(v.get("talla")))
        for i, v in enumerate(vs_ordenadas):
            resultado.append({
                "producto": producto,
                "variante": v,
                "es_primaria": i == 0,
                "stock": stock_por_variante.get(v["id"], 0),
            })
    return resultado


def _validar_fila(item: dict) -> list:
    """Devuelve la lista de problemas encontrados en un item antes de mandarlo
    a Walmart (no bloquea la generación del preview, solo informa)."""
    problemas = []
    p, v = item["producto"], item["variante"]
    if not v.get("sku"):
        problemas.append("variante sin SKU")
    if not v.get("color"):
        problemas.append("variante sin color")
    if not v.get("talla"):
        problemas.append("variante sin talla")
    fotos = list(v.get("imagenes") or [])
    if not fotos and v.get("foto_url"):
        fotos = [v["foto_url"]]
    if not fotos and not p.get("imagen_principal"):
        problemas.append("sin fotos (ni de la variante ni del producto)")
    if not float(p.get("precio_menudeo") or 0):
        problemas.append("precio_menudeo vacío o 0")
    talla_w = f"{_talla_display(v.get('talla'))} (MX)"
    if talla_w not in _TALLAS_VALIDAS_MX:
        problemas.append(f"talla '{v.get('talla')}' fuera del rango 12-31 (MX) de Walmart")
    return problemas


def _productos_pendientes_walmart() -> list:
    """Agrupa _variantes_publicables() por producto y excluye los que ya
    tienen un registro exitoso en `walmart_publicaciones` -- mismo patrón que
    _productos_sin_publicar_shein() -- para que "publicar catálogo" solo
    ofrezca modelos nuevos, no reenvíe todo cada vez."""
    items = _variantes_publicables()
    ya_enviados_ids = {
        r["producto_id"] for r in supabase_get_all("walmart_publicaciones?exito=eq.true&select=producto_id")
    }
    por_producto: dict = {}
    for it in items:
        pid = it["producto"]["id"]
        if pid in ya_enviados_ids:
            continue
        grupo = por_producto.setdefault(pid, {"producto": it["producto"], "items": []})
        grupo["items"].append(it)
    return list(por_producto.values())


@router.get("/catalogo-sin-publicar")
def catalogo_sin_publicar():
    """Lista de productos del ERP que todavía no se han enviado (con éxito) a
    Walmart, con el detalle de si están listos o tienen pendientes -- para
    publicar de a uno o varios desde el panel, igual que en MercadoLibre/SHEIN."""
    grupos = _productos_pendientes_walmart()
    resultado = []
    for g in grupos:
        problemas_por_item = [_validar_fila(it) for it in g["items"]]
        listo = all(not p for p in problemas_por_item)
        problemas_unicos = sorted({p for lista in problemas_por_item for p in lista})
        colores = sorted({it["variante"].get("color") for it in g["items"] if it["variante"].get("color")})
        resultado.append({
            "id": g["producto"]["id"],
            "sku_interno": g["producto"].get("sku_interno"),
            "nombre": g["producto"].get("nombre"),
            "categoria": g["producto"].get("categoria"),
            "num_variantes": len(g["items"]),
            "num_colores": len(colores),
            "listo": listo,
            "problemas": problemas_unicos,
        })
    resultado.sort(key=lambda p: (not p["listo"], p["nombre"] or ""))
    return {"total": len(resultado), "listos": sum(1 for p in resultado if p["listo"]), "productos": resultado}


@router.get("/feed/preview")
def feed_preview():
    """Dry-run: arma las filas del feed en memoria SIN tocar Walmart, para
    revisar antes de subir nada. Muestra conteos y qué le falta a cada item."""
    items = _variantes_publicables()
    filas_ok, filas_con_problemas = [], []
    for item in items:
        problemas = _validar_fila(item)
        entrada = {
            "sku": item["variante"].get("sku"),
            "producto": item["producto"].get("nombre"),
            "color": item["variante"].get("color"),
            "talla": item["variante"].get("talla"),
            "stock": item["stock"],
            "problemas": problemas,
        }
        (filas_con_problemas if problemas else filas_ok).append(entrada)
    return {
        "total": len(items),
        "listos_para_walmart": len(filas_ok),
        "con_problemas": len(filas_con_problemas),
        "muestra_listos": filas_ok[:10],
        "items_con_problemas": filas_con_problemas,
    }


def _generar_workbook(items: list) -> bytes:
    import openpyxl
    wb = openpyxl.load_workbook(_TEMPLATE_PATH)
    ws = wb[_TEMPLATE_SHEET]
    row = _DATA_START_ROW
    for item in items:
        fila = _fila_variante(item["producto"], item["variante"], item["es_primaria"])
        for col, val in fila.items():
            ws[f"{col}{row}"] = val
        row += 1
    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


@router.get("/feed/plantilla")
def feed_plantilla(solo_listos: bool = True):
    """Genera y descarga la plantilla oficial de Walmart ya llena con el
    catálogo actual -- para revisarla a mano o subirla manualmente desde
    Seller Center si no se quiere usar la API todavía."""
    items = _variantes_publicables()
    if solo_listos:
        items = [it for it in items if not _validar_fila(it)]
    if not items:
        raise HTTPException(400, "No hay variantes listas para incluir en el feed")
    contenido = _generar_workbook(items)
    nombre = f"walmart_zapatos_{datetime_now_str()}.xlsx"
    return StreamingResponse(
        io.BytesIO(contenido),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{nombre}"'},
    )


def datetime_now_str() -> str:
    import datetime as _dt
    return _dt.datetime.now().strftime("%Y%m%d_%H%M%S")


@router.post("/feed/subir")
def feed_subir(solo_listos: bool = True, confirmar: bool = False, sku_interno: str = None):
    """Sube el feed a Walmart vía Feeds API (POST /v3/feeds?feedType=item,
    multipart). Crea publicaciones REALES en Walmart -- por eso exige
    confirmar=true explícito y no corre solo. Devuelve el feedId para
    consultar el estado con GET /walmart/feed/{feed_id}.

    Pasa sku_interno para limitar la subida a un solo producto (todas sus
    variantes/colores/tallas) -- útil para probar antes de subir el catálogo
    completo."""
    if not confirmar:
        raise HTTPException(400, "Pasa confirmar=true para subir el feed de verdad a Walmart (esto publica productos reales)")
    items = _variantes_publicables()
    if sku_interno:
        items = [it for it in items if it["producto"].get("sku_interno") == sku_interno]
        if not items:
            raise HTTPException(404, f"No se encontraron variantes publicables para sku_interno='{sku_interno}'")
    if solo_listos:
        items = [it for it in items if not _validar_fila(it)]
    if not items:
        raise HTTPException(400, "No hay variantes listas para incluir en el feed")
    contenido = _generar_workbook(items)
    try:
        resp = walmart_post_file("/feeds", {"feedType": "item"}, "walmart_zapatos.xlsx", contenido)
    except HTTPException as e:
        _registrar_publicaciones(items, exito=False, feed_id=None, error=str(e.detail)[:2000])
        raise
    feed_id = resp.get("feedId")
    # Registro PERSISTENTE de que estos productos ya se mandaron a Walmart --
    # así "publicar catálogo pendiente" no los vuelve a ofrecer la próxima vez
    # (mismo patrón que shein_publicaciones). "Éxito" aquí es "Walmart aceptó
    # el feed para procesar", no "ya está aprobado" -- eso se confirma aparte
    # con GET /walmart/feed/{feed_id}.
    _registrar_publicaciones(items, exito=True, feed_id=feed_id, error=None)
    return {"total_enviado": len(items), "skus_enviados": [it["variante"]["sku"] for it in items], "respuesta": resp}


def _registrar_publicaciones(items: list, exito: bool, feed_id: str, error: str):
    productos_unicos = {}
    for it in items:
        productos_unicos[it["producto"]["id"]] = it["producto"]
    for pid, producto in productos_unicos.items():
        try:
            supabase_post("walmart_publicaciones", {
                "producto_id": pid,
                "sku_interno": producto.get("sku_interno"),
                "exito": exito,
                "error": error,
                "feed_id": feed_id,
                "origen": "individual" if len(productos_unicos) == 1 else "masivo",
            })
        except Exception as e:
            print(f"[walmart] No se pudo guardar registro de publicacion (no critico): {e}")


@router.get("/feed/{feed_id}")
def feed_estado(feed_id: str):
    """Consulta el estado de un feed subido previamente."""
    return walmart_get(f"/feeds/{feed_id}", params={"includeDetails": "true"})


# ─── Sincronización de inventario ──────────────────────────────────────────
# A diferencia del feed de items (que crea publicaciones y por eso exige
# confirmar=true), esto solo actualiza la cantidad de SKUs que YA existen en
# Walmart -- mismo patrón que /tiktok/sync-stock. Un SKU del ERP que Walmart
# no conozca simplemente no tiene efecto, no genera error de feed completo.

@router.post("/inventario/sincronizar")
def sincronizar_inventario():
    """Manda a Walmart el stock actual del ERP para todas las variantes
    publicables, vía Feeds API (POST /v3/feeds?feedType=inventory)."""
    items = _variantes_publicables()
    registros = [
        {"sku": it["variante"]["sku"], "quantity": {"unit": "EACH", "amount": max(0, int(it["stock"] or 0))}}
        for it in items if it["variante"].get("sku")
    ]
    if not registros:
        return {"total_variantes": 0, "enviados": 0}
    body = {"InventoryHeader": {"version": "1.4"}, "Inventory": registros}
    resp = walmart_post("/feeds?feedType=inventory", body)
    return {"total_variantes": len(items), "enviados": len(registros), "respuesta": resp}


@router.get("/inventario/{sku}")
def inventario_sku(sku: str):
    """Consulta el inventario actual en Walmart para un SKU puntual (útil
    para confirmar que una sincronización sí se aplicó)."""
    return walmart_get("/inventory", params={"sku": sku})
