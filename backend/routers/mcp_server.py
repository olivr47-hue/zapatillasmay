# -*- coding: utf-8 -*-
"""
routers/mcp_server.py
Servidor MCP (Model Context Protocol) para Zapatillas May.

Expone herramientas que los agentes de IA (ChatGPT, Claude, Perplexity, etc.)
pueden invocar en tiempo real para consultar el catálogo, stock y datos del negocio.

Protocolo: JSON-RPC 2.0 sobre HTTP (transporte "Streamable HTTP").
Endpoint:  POST /mcp
No requiere autenticación — solo expone información pública del catálogo.
"""

import json
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, Response
from database import supabase_get
from cache import cache_get, cache_set, TTL_ESTATICO

router = APIRouter(tags=["MCP"])

PROTOCOL_VERSION = "2024-11-05"
SERVER_INFO = {"name": "zapatillasmay", "version": "1.0.0"}

# ─── Definición de herramientas ─────────────────────────────────────────────

TOOLS = [
    {
        "name": "buscar_productos",
        "description": (
            "Busca calzado en el catálogo de Zapatillas May por nombre, categoría, "
            "color o características. Devuelve modelos con precios (menudeo y mayoreo), "
            "categoría e imagen. Úsala para responder '¿qué tacones tienen?', "
            "'busco sandalias negras', 'modelos baratos', etc."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "consulta": {"type": "string", "description": "Términos de búsqueda, ej: 'tacones negros', 'sandalias', 'botas'."},
                "categoria": {"type": "string", "description": "Opcional. Filtrar por categoría: tacones, sandalias, botas, botines, flats, plataformas, tenis, nina, accesorios."},
                "limite": {"type": "integer", "description": "Máximo de resultados (default 10)."}
            },
            "required": ["consulta"]
        }
    },
    {
        "name": "consultar_producto",
        "description": (
            "Obtiene el detalle completo de un producto específico por su SKU o nombre, "
            "incluyendo colores y tallas disponibles con stock en tiempo real."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "sku_o_nombre": {"type": "string", "description": "SKU interno (ej: M-TAC-0033) o nombre del modelo."}
            },
            "required": ["sku_o_nombre"]
        }
    },
    {
        "name": "precios_mayoreo",
        "description": (
            "Explica cómo funcionan los precios de mayoreo de Zapatillas May "
            "(descuentos automáticos por volumen). No requiere parámetros."
        ),
        "inputSchema": {"type": "object", "properties": {}}
    },
    {
        "name": "info_negocio",
        "description": (
            "Devuelve información general de Zapatillas May: a qué se dedica, ubicación, "
            "cómo comprar, envíos y datos de contacto. No requiere parámetros."
        ),
        "inputSchema": {"type": "object", "properties": {}}
    },
]


# ─── Lógica de cada herramienta ─────────────────────────────────────────────

def _precios_web(p):
    """Precios públicos del sitio (mismos que el checkout y las páginas SEO): menudeo = panel + $80
    (salvo ofertas); mayoreo = precio web −$60 (3-5 pares) / −$100 (6+). Antes este servidor decía
    el precio de panel (sin el +$80) y descuentos de $30/$70: los asistentes de IA citaban precios
    equivocados a clientes reales."""
    try:
        pm = float(p.get("precio_menudeo") or 0)
    except Exception:
        pm = 0.0
    oferta = bool(p.get("es_oferta"))
    menudeo = pm if oferta else round(pm + 80)
    return menudeo, (menudeo if oferta else menudeo - 60), (menudeo if oferta else menudeo - 100)


def _tool_buscar_productos(args):
    consulta = (args.get("consulta") or "").lower().strip()
    categoria = (args.get("categoria") or "").lower().strip()
    limite = args.get("limite") or 10
    try:
        limite = min(int(limite), 25)
    except Exception:
        limite = 10

    productos = supabase_get(
        "productos?activo=eq.true&select=id,nombre,sku_interno,categoria,"
        "precio_menudeo,es_oferta,imagen_principal,material"
    )
    if not isinstance(productos, list):
        return "No se pudo consultar el catálogo en este momento."

    terminos = [t for t in consulta.split() if t]
    resultados = []
    for p in productos:
        if categoria and (p.get("categoria") or "").lower() != categoria:
            continue
        texto = " ".join([
            str(p.get("nombre") or ""), str(p.get("sku_interno") or ""),
            str(p.get("categoria") or ""), str(p.get("material") or "")
        ]).lower()
        if terminos and not all(t in texto for t in terminos):
            continue
        resultados.append(p)

    resultados = resultados[:limite]
    if not resultados:
        return f"No se encontraron productos para '{consulta}'. Categorías disponibles: tacones, sandalias, botas, botines, flats, plataformas."

    lineas = [f"Se encontraron {len(resultados)} modelo(s):", ""]
    for p in resultados:
        slug = p.get("sku_interno") or p.get("id", "")
        menudeo, _may3, may6 = _precios_web(p)
        lineas.append(
            f"• {p.get('nombre','')} ({p.get('categoria','')}) — "
            f"Menudeo ${menudeo:.0f} MXN | 3 o más pares ${_may3:.0f} MXN/par. "
            f"SKU: {p.get('sku_interno','')}. "
            f"Ver: https://zapatillasmay.mx/producto/{slug}"
        )
    return "\n".join(lineas)


def _tool_consultar_producto(args):
    q = (args.get("sku_o_nombre") or "").strip()
    if not q:
        return "Indica el SKU o nombre del producto."

    # Buscar por SKU exacto primero, luego por nombre
    import urllib.parse as _up
    qe = _up.quote(q, safe="")   # evita que '&', '=' o ',' del texto inyecten filtros en la consulta
    productos = supabase_get(
        f"productos?activo=eq.true&sku_interno=ilike.*{qe}*&select=*"
    )
    if not productos:
        productos = supabase_get(
            f"productos?activo=eq.true&nombre=ilike.*{qe}*&select=*"
        )
    if not productos:
        return f"No se encontró ningún producto con '{q}'."

    p = productos[0]
    pid = p.get("id")
    slug = p.get("sku_interno") or pid

    # Variantes + stock
    variantes = supabase_get(
        f"variantes?producto_id=eq.{pid}&activa=eq.true&select=id,color,talla"
    )
    inventario = supabase_get("inventario/slim") if False else supabase_get(
        "inventario?select=variante_id,cantidad"
    )
    stock_map = {}
    if isinstance(inventario, list):
        for i in inventario:
            stock_map[i.get("variante_id")] = stock_map.get(i.get("variante_id"), 0) + (i.get("cantidad") or 0)

    menudeo_w, may3, may6 = _precios_web(p)

    lineas = [
        f"{p.get('nombre','')} (SKU: {p.get('sku_interno','')})",
        f"Categoría: {p.get('categoria','')}",
        f"Precio menudeo: ${menudeo_w:.0f} MXN",
        f"3 o más pares: ${may3:.0f} MXN/par (descuento automático en el carrito)",
        "Mayoreo formal (6+ pares, corridas): precios en el Portal Mayorista https://portal.zapatillasmay.mx",
    ]
    if p.get("descripcion"):
        lineas.append(f"Descripción: {p.get('descripcion')}")

    if isinstance(variantes, list) and variantes:
        # Agrupar por color
        por_color = {}
        for v in variantes:
            color = v.get("color") or "Único"
            stock = stock_map.get(v.get("id"), 0)
            por_color.setdefault(color, [])
            if stock > 0:
                por_color[color].append(f"T{v.get('talla','')}({stock})")
        lineas.append("")
        lineas.append("Disponibilidad (talla y pares en stock):")
        for color, tallas in por_color.items():
            if tallas:
                lineas.append(f"  - {color}: {', '.join(tallas)}")
            else:
                lineas.append(f"  - {color}: agotado")

    lineas.append("")
    lineas.append(f"Comprar: https://zapatillasmay.mx/producto/{slug}")
    return "\n".join(lineas)


def _tool_precios_mayoreo(args):
    return (
        "Precios por volumen en Zapatillas May:\n"
        "• 1-2 pares: precio de menudeo del sitio.\n"
        "• Desde 3 pares: $60 MXN menos por par (descuento automático en el carrito del sitio, sin registro).\n"
        "• Mayoreo formal (mínimo 6 pares, pueden ser de diferentes modelos, colores y tallas; corridas; zapaterías "
        "y revendedoras): los precios de mayoreo se ven registrándose gratis en el Portal Mayorista: "
        "https://portal.zapatillasmay.mx (ahí ven el catálogo con fotos, arman su corrida, apartan sus pares y "
        "dan seguimiento a sus pedidos). Los precios de mayoreo no se publican fuera del portal.\n\n"
        "Más info: https://zapatillasmay.mx/mayoreo"
    )


def _tool_info_negocio(args):
    return (
        "Zapatillas May — Calzado femenino de moda fabricado en León, Guanajuato, México.\n"
        "Venta a menudeo (descuento automático desde 3 pares) y mayoreo desde 6 pares en el Portal Mayorista (registro gratuito).\n"
        "Categorías: tacones, sandalias, botas, botines, flats, plataformas y más.\n"
        "Envíos a todo México. Pedidos en línea y atención por WhatsApp desde el sitio.\n"
        "Sitio web: https://zapatillasmay.mx\n"
        "Cómo comprar a mayoreo: https://zapatillasmay.mx/mayoreo\n"
        "Envíos: https://zapatillasmay.mx/envios"
    )


TOOL_FUNCS = {
    "buscar_productos": _tool_buscar_productos,
    "consultar_producto": _tool_consultar_producto,
    "precios_mayoreo": _tool_precios_mayoreo,
    "info_negocio": _tool_info_negocio,
}


# ─── Manejo del protocolo JSON-RPC ──────────────────────────────────────────

def _rpc_result(req_id, result):
    return {"jsonrpc": "2.0", "id": req_id, "result": result}


def _rpc_error(req_id, code, message):
    return {"jsonrpc": "2.0", "id": req_id, "error": {"code": code, "message": message}}


def _manejar_mensaje(msg):
    """Procesa un mensaje JSON-RPC y devuelve la respuesta (o None si es notificación)."""
    metodo = msg.get("method")
    req_id = msg.get("id")
    params = msg.get("params") or {}

    # Notificaciones (sin id) — no requieren respuesta
    if metodo == "notifications/initialized" or (req_id is None and metodo and metodo.startswith("notifications/")):
        return None

    if metodo == "initialize":
        return _rpc_result(req_id, {
            "protocolVersion": PROTOCOL_VERSION,
            "capabilities": {"tools": {"listChanged": False}},
            "serverInfo": SERVER_INFO,
            "instructions": (
                "Servidor de Zapatillas May, tienda de calzado femenino de mayoreo y menudeo "
                "en León, Guanajuato. Usa buscar_productos para consultar el catálogo, "
                "consultar_producto para ver stock de un modelo, precios_mayoreo para los "
                "descuentos por volumen e info_negocio para datos generales."
            )
        })

    if metodo == "ping":
        return _rpc_result(req_id, {})

    if metodo == "tools/list":
        return _rpc_result(req_id, {"tools": TOOLS})

    if metodo == "tools/call":
        nombre = params.get("name")
        args = params.get("arguments") or {}
        func = TOOL_FUNCS.get(nombre)
        if not func:
            return _rpc_error(req_id, -32602, f"Herramienta desconocida: {nombre}")
        try:
            texto = func(args)
        except Exception as e:
            texto = f"Error al ejecutar la herramienta: {e}"
        return _rpc_result(req_id, {
            "content": [{"type": "text", "text": texto}],
            "isError": False
        })

    return _rpc_error(req_id, -32601, f"Método no soportado: {metodo}")


@router.post("/mcp")
async def mcp_endpoint(request: Request):
    """Endpoint principal MCP (JSON-RPC 2.0 sobre HTTP)."""
    try:
        body = await request.body()
        data = json.loads(body)
    except Exception:
        return JSONResponse(
            status_code=400,
            content={"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "JSON inválido"}}
        )

    # Puede venir un solo mensaje o un batch (lista)
    if isinstance(data, list):
        respuestas = [r for r in (_manejar_mensaje(m) for m in data) if r is not None]
        if not respuestas:
            return Response(status_code=202)
        return JSONResponse(content=respuestas)

    respuesta = _manejar_mensaje(data)
    if respuesta is None:
        return Response(status_code=202)
    return JSONResponse(content=respuesta)


@router.get("/mcp")
def mcp_info():
    """Info legible del endpoint MCP (para humanos que visiten la URL)."""
    return {
        "servidor": "Zapatillas May MCP",
        "protocolo": "Model Context Protocol (JSON-RPC 2.0)",
        "uso": "Envía peticiones JSON-RPC por POST a esta misma URL.",
        "herramientas": [t["name"] for t in TOOLS],
    }
