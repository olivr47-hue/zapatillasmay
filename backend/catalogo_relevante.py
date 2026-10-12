"""
Catálogo RECORTADO para Maya.

Antes cada mensaje mandaba a la IA el catálogo completo (~320 productos, ~28 mil tokens). Aquí se eligen solo los productos que mejor
coinciden con lo que pide la clienta (código del modelo, categoría, altura del tacón, color, ocasión, material, palabras del nombre) más los
que ya se mencionaron en la conversación. Mismo formato de línea que `construir_catalogo`, así todo lo demás (SKU exactos, [IMG:...]) no cambia.
Funciones puras (sin red ni base de datos): el llamador pasa productos y colores.
"""
import re
import unicodedata

_STOP = {
    "hola", "buenas", "buenos", "dias", "tardes", "noches", "quiero", "quisiera", "busco", "necesito", "tienen", "tiene", "tienes", "hay",
    "para", "por", "con", "sin", "los", "las", "una", "uno", "unos", "unas", "que", "del", "mas", "muy", "favor", "gracias", "precio",
    "precios", "cuanto", "cuesta", "cuestan", "modelo", "modelos", "talla", "tallas", "color", "colores", "zapatos", "zapato", "calzado",
    "dama", "mujer", "ver", "mandame", "mandar", "enviame", "envio", "comprar", "compra", "pares", "par", "como", "esta", "estan", "algun",
    "alguna", "otro", "otra", "estos", "estas", "ese", "esa", "eso", "este", "esto", "info", "informacion", "puedes", "pueden", "podrias",
    "ustedes", "tambien", "pero", "cual", "cuales", "donde", "cuando", "bien", "solo", "todo", "toda", "todos", "todas", "hacer", "algo",
}

# palabra de la clienta -> categoría del ERP
_CATEGORIAS = {
    "tacon": "tacones", "tacones": "tacones", "zapatilla": "tacones", "zapatillas": "tacones", "estilleto": "tacones", "estilleta": "tacones",
    "estiletos": "tacones", "stiletto": "tacones", "stilettos": "tacones", "pump": "tacones", "pumps": "tacones",
    "bota": "botas", "botas": "botas", "botin": "botines", "botines": "botines", "botines": "botines",
    "sandalia": "sandalias", "sandalias": "sandalias", "huarache": "sandalias", "huaraches": "sandalias",
    "flat": "flats", "flats": "flats", "balerina": "flats", "balerinas": "flats", "mocasin": "flats", "mocasines": "flats", "piso": "flats",
    "plataforma": "plataformas", "plataformas": "plataformas", "tenis": "tenis",
}
_OCASIONES = {
    "fiesta": "fiesta", "fiestas": "fiesta", "boda": "fiesta", "xv": "fiesta", "graduacion": "fiesta", "evento": "fiesta", "noche": "fiesta",
    "trabajo": "trabajo", "oficina": "trabajo", "formal": "formal", "vestir": "formal", "elegante": "formal", "elegantes": "formal",
    "casual": "casual", "diario": "casual", "urbano": "urbano", "calle": "urbano",
}
_TIPOS_TACON = {"aguja": "aguja", "delgado": "aguja", "fino": "aguja", "bloque": "bloque", "grueso": "bloque", "cuadrado": "bloque",
                "cuna": "cuna", "plataforma": "plataforma"}
_MATERIALES = {"piel", "charol", "gamuza", "terciopelo", "tornasol", "metalico", "brillos", "glitter", "encaje", "malla", "yute", "vaquero", "vaquera"}


def _norm(t) -> str:
    t = unicodedata.normalize("NFD", str(t or "").lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9\s]", " ", t)


def _tokens(t: str) -> list:
    return [w for w in _norm(t).split() if len(w) >= 3 and w not in _STOP]


def _codigo_de(p: dict) -> str:
    """Código del modelo (primera palabra del nombre si parece código) normalizado, p. ej. 'ma302'."""
    m = re.match(r"^\s*([A-Za-z]{0,4}\d+[A-Za-z0-9]*)", p.get("nombre") or "")
    return _norm(m.group(1)).replace(" ", "") if m else ""


def _alturas(texto: str) -> list:
    n = _norm(texto)
    return [float(x.replace(",", ".")) for x in re.findall(r"(\d{1,2}(?:[.,]\d)?)\s*(?:cm|centimetros|centimetro)", n)] + \
           [float(x) for x in re.findall(r"(?:tacon|tacones|de|del)\s+(\d{1,2})\b(?!\d)", n) if 1 <= int(x) <= 14]


def _codigos_en(texto: str) -> set:
    return {c for c in re.findall(r"\b([a-z]{1,4}\d{2,}[a-z0-9]*)\b", _norm(texto))}


def puntuar(p: dict, consulta: str, historial_codigos: set, colores_producto: set) -> float:
    q = _norm(consulta)
    toks = _tokens(consulta)
    pts = 0.0
    codigo = _codigo_de(p)
    sku = _norm(p.get("sku_interno") or "").replace(" ", "")
    codigos_q = _codigos_en(consulta)
    if codigo and codigo in codigos_q or (sku and sku in codigos_q):
        pts += 120
    elif codigo and any(c.startswith(codigo) or codigo.startswith(c) for c in codigos_q if len(c) >= 4):
        pts += 55
    if codigo and codigo in historial_codigos:
        pts += 70                                   # ya se habló de este modelo en la conversación
    cat = (p.get("categoria") or "").lower()
    cats_q = {_CATEGORIAS[t] for t in toks if t in _CATEGORIAS}
    if cats_q and cat in cats_q:
        pts += 25
    nombre_n = _norm(p.get("nombre"))
    nombre_w = set(nombre_n.split())
    for t in toks:
        if t in nombre_w:
            pts += 10 + (10 if t in _OCASIONES else 0)   # una palabra de ocasión (oficina, fiesta...) escrita en el nombre pesa mucho
        elif len(t) >= 5 and any(w.startswith(t[:5]) for w in nombre_w):
            pts += 4
    if re.search(r"(bajit[oa]s?|bajo|baja)", q) and re.search(r"(bajit[oa]s?|bajo|baja)", nombre_n):
        pts += 15
    # altura del tacón
    try:
        alt = float(p.get("altura_tacon")) if p.get("altura_tacon") is not None else None
    except (TypeError, ValueError):
        alt = None
    if alt is not None:
        for a in _alturas(consulta):
            if abs(alt - a) < 0.01:
                pts += 30
            elif abs(alt - a) <= 1:
                pts += 12
        if "bajito" in q or "bajitos" in q or "bajita" in q or "bajo" in q:
            pts += 20 if alt <= 4 else 0
        if " alto" in q or "altos" in q or "altisimo" in q:
            pts += 15 if alt >= 9 else 0
        if "mediano" in q or "medianos" in q or "mediana" in q:
            pts += 15 if 5 <= alt <= 8 else 0
    tipo = (p.get("tipo_tacon") or "").lower()
    if tipo and any(_TIPOS_TACON.get(t) == tipo for t in toks):
        pts += 10
    # ocasión
    ocs = p.get("ocasion") or []
    for t in toks:
        o = _OCASIONES.get(t)
        if o and o in [x.lower() for x in ocs]:
            pts += 12
    # color
    for t in toks:
        if t in colores_producto or any(c.startswith(t) for c in colores_producto if len(t) >= 4):
            pts += 20
    # material / detalles
    mat = _norm(p.get("material"))
    for t in toks:
        if t in _MATERIALES and (t in nombre_w or t in mat):
            pts += 8
    if pts > 0 and p.get("nuevo"):
        pts += 2
    return pts


def codigos_del_historial(historial: list) -> set:
    cods = set()
    for m in (historial or [])[-10:]:
        c = m.get("content")
        if isinstance(c, str):
            cods |= _codigos_en(c)
            cods |= {_norm(x).replace(" ", "") for x in re.findall(r"\[SKU:([^\]]+)\]", c)}
    return cods


def seleccionar(productos: list, consulta: str, historial: list = None, colores_por_producto: dict = None, n: int = 10) -> list:
    hist = codigos_del_historial(historial)
    colores_por_producto = colores_por_producto or {}
    puntuados = []
    for p in productos:
        pts = puntuar(p, consulta, hist, colores_por_producto.get(p.get("id"), set()))
        if pts > 0:
            puntuados.append((pts, p))
    puntuados.sort(key=lambda x: (-x[0], str(x[1].get("nombre"))))
    elegidos = [p for _, p in puntuados[:n]]
    if len(elegidos) < 6:                           # pregunta general o sin coincidencias: completa con novedades y ofertas
        ids = {p.get("id") for p in elegidos}
        extra = [p for p in productos if p.get("id") not in ids and (p.get("nuevo") or p.get("es_oferta"))]
        extra.sort(key=lambda p: (not p.get("nuevo"), str(p.get("nombre"))))
        elegidos += extra[:6 - len(elegidos)]
    return elegidos


def resumen_categorias(productos: list) -> str:
    cuenta = {}
    for p in productos:
        c = (p.get("categoria") or "otros").lower()
        cuenta[c] = cuenta.get(c, 0) + 1
    return ", ".join(f"{k} ({v})" for k, v in sorted(cuenta.items(), key=lambda x: -x[1]))


ENCABEZADO = (
    "AVISO IMPORTANTE SOBRE ESTE CATÁLOGO: abajo solo ves los modelos que MEJOR COINCIDEN con lo que pide la clienta; NO es el catálogo completo "
    "(la tienda tiene {total} modelos: {categorias}). Reglas: (1) si lo que pide no aparece aquí, NUNCA digas que no existe ni inventes un modelo, "
    "un precio o una talla; di que lo revisas y ofrécele el catálogo completo en https://zapatillasmay.mx (por categoría: /tacones, /botas, /botines, "
    "/sandalias, /plataformas, /flats; tacones por altura: /tacones-de-8-cm, /tacones-de-10-cm) o pásala con una asesora. (2) Para una pregunta "
    "muy general, pregunta qué tipo de calzado busca (tacones, botas, botines, sandalias, flats o plataformas), para qué ocasión y qué talla, y "
    "muestra solo 2 o 3 opciones. (3) Usa SOLO los SKU, precios y tallas de las líneas de abajo.\n"
)


def construir(productos: list, consulta: str, historial: list, mayorista: bool, colores_por_producto: dict, construir_lineas, n: int = 10) -> str:
    """`construir_lineas(lista, mayorista)` es construir_catalogo del chatbot (mismo formato de línea)."""
    elegidos = seleccionar(productos, consulta, historial, colores_por_producto, n)
    return ENCABEZADO.format(total=len(productos), categorias=resumen_categorias(productos)) + construir_lineas(elegidos, mayorista)
