"""
Título que ve Google para cada producto (<title> de la ficha). Se arma con la fórmula
    <Tipo> [rasgo] para dama [material/detalle] [con tacón de N cm] | Zapatillas May
a partir de los datos del producto (categoría, altura y tipo de tacón, nombre). El código del modelo NO va en el título
(nadie lo busca en Google); queda en el nombre interno, que usan el panel y los marketplaces. Nunca se corta a media frase.
Solo toca el título y la descripción para buscadores: no el nombre, ni el slug (dirección web).
"""
import re

SUF = " | Zapatillas May"
LIM_TITULO = 60
_STOP = {"de", "con", "tipo", "para", "y", "e", "el", "la", "en", "a", "del", "muy", "su", "un", "una", "por", "al", "estilo"}
_FILLER = [r"\bmuy c[oó]modos?\b", r"\bde moda\b", r"\bexcelente calidad\b", r"\bmoda 20\d\d\b", r"\bmoda\b$"]
_NOUN_CAT = {"tacones": "Tacones", "sandalias": "Sandalias", "botines": "Botines", "botas": "Botas", "flats": "Flats",
             "plataformas": "Plataformas", "tenis": "Tenis"}
_NOUN_BODY = {"botas": "Botas", "botines": "Botines", "botin": "Botín", "flats": "Flats", "flat": "Flats", "sandalias": "Sandalias",
              "sandalia": "Sandalias", "plataformas": "Plataformas", "plataforma": "Plataformas", "tenis": "Tenis", "tacones": "Tacones",
              "estilleto": "Tacones estilleto", "estilletos": "Tacones estilleto", "zapatillas": "Zapatillas",
              "mocasin": "Mocasines", "mocasines": "Mocasines", "mocasín": "Mocasines"}
# estilo corto que va pegado al tipo ("Sandalias de verano", "Tenis urbano")
_ADJ = [("verano", "de verano"), ("invierno", "de invierno"), ("otono", "de otoño"), ("chunky", "chunky"), ("combat", "estilo combat"), ("tubo alto", "de tubo alto"), ("urbano", "urbano"), ("casual", "casual"), ("elegante", "elegantes"),
        ("vestir", "de vestir"), ("fiesta", "de fiesta"), ("formal", "formales")]
# materiales y detalles que sí se buscan (palabra en el nombre -> frase)
_DESCR = [("vaquer", "estilo vaquero"), ("cowboy", "estilo vaquero"), ("charol", "de charol"), ("gamuza", "de gamuza"), ("terciopelo", "de terciopelo"), ("yute", "tipo yute"), ("piel", "de piel"),
          ("encaje", "de encaje"), ("malla", "de malla"), ("pata de gallo", "pata de gallo"), ("hebilla", "con hebilla"), ("tiras", "con tiras"), ("correa", "con correa"),
          ("latigo", "con látigo"), ("resorte", "con resorte"), ("cuna", "de cuña"), ("tractor", "suela tractor"),
          ("alpargata", "tipo alpargata"), ("punta cuadrada", "punta cuadrada"), ("plataforma", "con plataforma"), ("moño", "con moño"),
          ("agujeta", "con agujetas"), ("brillo", "con brillos"), ("estoperol", "con estoperoles")]
_CAT_CON_TACON = ("tacones", "botines", "botas", "plataformas", "sandalias")


def _sin_tilde(t):
    return (t or "").lower().replace("ñ", "n").replace("ó", "o").replace("á", "a").replace("é", "e").replace("í", "i").replace("ú", "u")


def codigo_modelo(p):
    """Código del modelo (primer 'palabra' del nombre, p. ej. MA6050) o, si no hay, el SKU interno. Va al final del título para que
    dos productos parecidos NO tengan el mismo título (Google penaliza títulos repetidos) y para que se pueda buscar por código."""
    m = re.match(r"^\s*([A-Za-z]{0,4}\d+[A-Za-z0-9]*)", p.get("nombre") or "")
    return (m.group(1) if m else (p.get("sku_interno") or "")).upper()


def _limpiar(nombre):
    n = (nombre or "").strip()
    n = re.sub(r"^[A-Za-z]{0,4}\d+[A-Za-z0-9]*\s*", "", n)       # quita el código del modelo
    for f in _FILLER:
        n = re.sub(f, "", n, flags=re.I)
    return re.sub(r"\s+", " ", n).strip(" ,.-")


def _altura(alt, tipo):
    try:
        a = float(alt)
    except (TypeError, ValueError):
        return ""
    if a <= 0 or (tipo or "") == "sin_tacon":
        return ""
    return (f"{int(a)}" if a == int(a) else f"{a:g}".replace(".", ",")) + " cm"


def pieza_titulo(p, reservado=0):
    """Devuelve el título SIN el sufijo ' | Zapatillas May' (≤ 44 caracteres menos `reservado`, nunca cortado a media frase)."""
    cat = (p.get("categoria") or "").strip().lower()
    body = _limpiar(p.get("nombre"))
    low = _sin_tilde(body)
    primero = low.split(" ")[0] if low else ""
    noun = _NOUN_BODY.get(primero) or _NOUN_CAT.get(cat) or (cat.capitalize() if cat else "Calzado")
    if noun == "Tacones" and ("estilleto" in low or "stiletto" in low):
        noun = "Tacones estilleto"
    es_tacones = noun.startswith("Tacones")
    adj = next((f for k, f in _ADJ if k in low), "")
    descr = []
    for k, f in _DESCR:
        if k in low and f not in descr and not (k == "plataforma" and noun == "Plataformas") and not (k == "cuna" and primero.startswith("cu")):
            descr.append(f)
    alt = _altura(p.get("altura_tacon"), p.get("tipo_tacon"))
    if not alt:
        m = re.search(r"(\d+(?:[.,]\d+)?)\s*cm", low)
        if m:
            alt = m.group(1).replace(".", ",") + " cm"
    con_tacon = bool(alt) and (cat in _CAT_CON_TACON or es_tacones)
    try:
        if noun == "Botines" and 0 < float(p.get("altura_tacon")) <= 4 and not adj:
            adj = "bajitos"
    except (TypeError, ValueError):
        pass
    room = LIM_TITULO - len(SUF) - reservado

    def arma(adj_, ds, heel):
        if es_tacones and heel:
            base = f"{noun} de {alt}"
            s = base + (f" {adj_}" if adj_ else "") + " para dama"
        else:
            s = noun + (f" {adj_}" if adj_ else "") + " para dama"
        ex = ""
        for i, d_ in enumerate(ds):
            ex += (" y " + d_[4:] if (i and d_.startswith("con ") and ds[i - 1].startswith("con ")) else (" " if i else "") + d_)
        if ex:
            s += " " + ex
        if heel and not es_tacones:
            s += (" y" if ex.startswith("con ") else " con") + f" tacón de {alt}"
        return s

    if es_tacones:
        intentos = [(adj, descr[:2], con_tacon), (adj, descr[:1], con_tacon), ("", descr[:1], con_tacon), (adj, [], con_tacon),
                    ("", [], con_tacon), (adj, descr[:1], False), ("", descr[:1], False), (adj, [], False), ("", [], False)]
    else:   # botas, botines, sandalias, flats...: el detalle (tubo alto, vaqueras, charol...) pesa más que la altura
        intentos = [(adj, descr[:2], con_tacon), (adj, descr[:1], con_tacon), (adj, descr[:2], False), (adj, descr[:1], False),
                    ("", descr[:1], con_tacon), ("", descr[:1], False), (adj, [], con_tacon), ("", [], con_tacon), (adj, [], False), ("", [], False)]
    core = arma("", [], False)
    for a, d, h in intentos:
        c = arma(a, d, h)
        if len(c) <= room:
            core = c
            break
    pal = core.split()
    while pal and pal[-1].lower() in _STOP:
        pal.pop()
    return " ".join(pal)


def titulo_google(p, codigo=None):
    """Título completo: '<tipo + detalle + tacón> <CÓDIGO> | Zapatillas May' (≤ 60 caracteres, único por el código)."""
    cod = (codigo if codigo is not None else codigo_modelo(p)).strip()
    reservado = (len(cod) + 1) if cod else 0
    core = pieza_titulo(p, reservado)
    return core + (" " + cod if cod else "") + SUF
