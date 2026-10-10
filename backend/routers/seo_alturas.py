"""Páginas de SEO por altura de tacón: /tacones-de-10-cm, /tacones-de-8-a-10-cm, etc.

Salen solas de la `altura_tacon` que se captura al dar de alta cada producto: una página existe
solo si hay MIN_MODELOS o más modelos con foto en esa altura (así no se crean páginas vacías).
Lógica pura (sin base de datos ni FastAPI) para poder probarla aislada; seo.py le pasa las filas.
"""
import html as _h
import re

MIN_MODELOS = 5
RANGOS = {
    "tacones-de-6-a-8-cm": (6.0, 8.0),
    "tacones-de-8-a-10-cm": (8.0, 10.0),
    "tacones-de-10-a-13-cm": (10.0, 13.0),
}
_SLUG_RE = re.compile(r"^tacones-de-(\d{1,2})-cm$")
MAX_TARJETAS = 36

_TIPOS = {"aguja": ("de aguja", "de aguja"), "bloque": ("de bloque", "de bloque"),
          "plataforma": ("con plataforma", "con plataforma"), "cuña": ("de cuña", "de cuña"), "cuna": ("de cuña", "de cuña")}

# Notas orientativas (consejos generales de uso, sin datos del catálogo) para dar texto propio a cada altura.
_NOTAS = {
    6: "Con 6 cm tienes una altura de uso diario: se nota el tacón, pero el paso sigue siendo natural y estable. Es una opción cómoda para la oficina, las comidas y los días de muchas horas de pie.",
    7: "Un tacón de 7 cm queda entre el medio y el alto: estiliza la pierna sin exigir tanto equilibrio. Funciona bien para eventos de varias horas.",
    8: "Con 8 cm el pie ya queda claramente elevado, pero todavía es manejable para caminar y estar de pie un buen rato. Es una altura muy elegida para la oficina, las cenas y los eventos.",
    9: "A 9 cm el tacón es alto y estiliza mucho. Conviene si ya estás acostumbrada a usar tacones, y se siente más cómodo en modelos de bloque o con plataforma al frente.",
    10: "Los tacones de 10 cm dan la silueta más alargada y son favoritos para fiestas, bodas y salidas de noche. Una plataforma al frente de 1 a 2 cm reduce la inclinación real del pie.",
    11: "A 11 cm hablamos de un tacón muy alto, pensado para ocasiones especiales. Pruébalos con calma y prefiere modelos con tira al tobillo o plataforma, que dan más sujeción.",
    13: "Con 13 cm es una altura extrema, pensada para fiestas y ocasiones cortas. Pruébalos con calma y prefiere los que traen plataforma o tira al tobillo.",
}
_NOTA_RANGO = {
    "tacones-de-6-a-8-cm": "De 6 a 8 cm están los tacones más cómodos para el día a día: se nota la altura, pero el paso sigue siendo estable. Son una buena opción para la oficina y para jornadas largas.",
    "tacones-de-8-a-10-cm": "Entre 8 y 10 cm está el rango más popular para vestir: más elegante que un tacón medio y todavía manejable. Los de 8 cm son más cómodos para varias horas y los de 10 cm dan más estilo para fiestas.",
    "tacones-de-10-a-13-cm": "De 10 a 13 cm son tacones altos para fiestas, bodas y salidas de noche. Prefiere modelos con plataforma o tira al tobillo, que dan más sujeción.",
}


def es_slug_altura(slug):
    return bool(_SLUG_RE.match(slug or "")) or slug in RANGOS


def _fmt(h):
    return str(int(h)) if h == int(h) else (f"{h:.1f}".rstrip("0").rstrip("."))


def _esc(s):
    return _h.escape(str(s or ""), quote=True)


def _tipos(mods):
    c = {}
    for x in mods:
        t = (x.get("tipo_tacon") or "").strip().lower()
        if t in _TIPOS:
            k = _TIPOS[t][0]
            c[k] = c.get(k, 0) + 1
    return c


def _info(slug, etiqueta, mods, a, b):
    tipos = _tipos(mods)
    return {"slug": slug, "etiqueta": etiqueta, "n": len(mods), "modelos": mods, "tipos": tipos, "a": a, "b": b}


def construir_paginas(filas):
    """filas: dicts de productos de la categoría tacones, cada uno con '_h' (altura en cm, float > 0).
    Devuelve {slug: info} solo con las alturas/rangos que tienen suficientes modelos."""
    paginas = {}
    enteras = sorted({x["_h"] for x in filas if x["_h"] == int(x["_h"])})
    for h in enteras:
        mods = [x for x in filas if x["_h"] == h]
        if len(mods) >= MIN_MODELOS:
            n = int(h)
            paginas[f"tacones-de-{n}-cm"] = _info(f"tacones-de-{n}-cm", f"{n} cm", mods, h, h)
    for slug, (a, b) in RANGOS.items():
        mods = [x for x in filas if a <= x["_h"] <= b]
        if len(mods) >= MIN_MODELOS:
            paginas[slug] = _info(slug, f"{_fmt(a)} a {_fmt(b)} cm", mods, a, b)
    return paginas


def titulo(info):
    return f"Tacones de {info['etiqueta']} para Dama | Envíos a todo México"


def descripcion(info):
    n = info["n"]
    base = f"{n} modelos de tacones de {info['etiqueta']} para dama, fabricados en León, Guanajuato"
    if info["tipos"] and len(info["tipos"]) <= 2:
        base += ", en modelos " + " y ".join(info["tipos"].keys())
    d = base + ". Descuento automático desde 3 pares. Envíos a todo México."
    if len(d) > 160:
        d = f"{n} modelos de tacones de {info['etiqueta']} para dama, fabricados en León, Guanajuato. Descuento automático desde 3 pares. Envíos a todo México."
    return d


def _img(p, w=420, h=420):
    img = (p.get("foto_limpia") or p.get("imagen_principal") or "").strip()
    if "res.cloudinary.com" in img and "/upload/" in img:
        img = img.replace("/upload/", f"/upload/w_{w},h_{h},c_fill,g_south,f_auto,q_auto/", 1)
    return img


def og_imagen(info):
    for p in info["modelos"]:
        img = (p.get("foto_limpia") or p.get("imagen_principal") or "").strip()
        if "res.cloudinary.com" in img and "/upload/" in img:
            return img.replace("/upload/", "/upload/w_1200,h_630,c_fill,g_auto,f_auto,q_auto/", 1)
    return ""


def _tarjetas(mods):
    out = []
    for p in mods[:MAX_TARJETAS]:
        slug_p = p.get("slug") or p.get("sku_interno") or ""
        nombre = _esc((p.get("nombre") or slug_p).strip())
        out.append(f'<a class="g-card" href="/producto/{_esc(slug_p)}"><img src="{_esc(_img(p))}" alt="{nombre}" loading="lazy" width="360" height="360"><span>{nombre}</span></a>')
    return '<div class="g-grid">' + "".join(out) + "</div>"


_CSS_EXTRA = ('<style>.alt-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px;padding:0;list-style:none}'
              '.alt-chips a{display:block;padding:9px 15px;border:1px solid #eadcd2;border-radius:100px;background:#fff;color:#3a2e28;'
              'text-decoration:none;font-size:.88rem;font-weight:600;line-height:1.2}'
              '.alt-chips a.on{background:#2a1f1a;color:#fff;border-color:#2a1f1a}.alt-chips small{font-weight:400;opacity:.7}</style>')


def chips(paginas, actual=None):
    """Lista de enlaces entre alturas (hace de filtro): primero cada altura, luego los rangos."""
    sing = [p for s, p in paginas.items() if s not in RANGOS]
    sing.sort(key=lambda p: p["a"])
    rang = [paginas[s] for s in RANGOS if s in paginas]
    items = []
    for p in sing + rang:
        on = ' class="on" aria-current="page"' if p["slug"] == actual else ""
        items.append(f'<li><a href="/{p["slug"]}"{on}>{_esc(p["etiqueta"])} <small>({p["n"]})</small></a></li>')
    return '<ul class="alt-chips">' + "".join(items) + "</ul>" if items else ""


def bloque_tacones(paginas):
    """Bloque de enlaces para el final de /tacones (descubrimiento de las páginas por altura)."""
    c = chips(paginas)
    if not c:
        return ""
    return ('<section style="max-width:1100px;margin:8px auto 36px;padding:0 20px;font-family:DM Sans,sans-serif">'
            '<p style="margin:0 0 10px;font-size:0.72rem;letter-spacing:.08em;text-transform:uppercase;color:#9a8478;font-weight:700">Tacones por altura</p>'
            + _CSS_EXTRA + c + "</section>")


def _faq(info):
    e = info["etiqueta"]
    qa = []
    if info["tipos"]:
        partes = [f"{v} {k}" for k, v in sorted(info["tipos"].items(), key=lambda kv: -kv[1])]
        qa.append((f"¿Qué tipos de tacón de {e} tienen?", f"Hoy tenemos {info['n']} modelos de {e}: " + ", ".join(partes) + ". Puedes verlos todos en esta página."))
    qa.append(("¿Cada modelo indica la altura del tacón?", "Sí, la ficha de cada producto muestra la altura del tacón en centímetros."))
    qa.append(("¿Hacen envíos a todo México?", "Sí, enviamos a toda la República en 1 a 3 días hábiles."))
    return qa


def html_pagina(info, paginas, css_base):
    """HTML visible de la página (reutiliza el CSS de las guías). css_base = '<style>...</style>' de las guías."""
    e, slug = info["etiqueta"], info["slug"]
    es_rango = slug in RANGOS
    nota = _NOTA_RANGO[slug] if es_rango else _NOTAS.get(int(info["a"]), "")
    tipos_txt = ""
    if info["tipos"]:
        tipos_txt = " Hay " + ", ".join(f"{v} {k}" for k, v in sorted(info["tipos"].items(), key=lambda kv: -kv[1])) + "."
    intro = (f"Estos son los tacones de {e} de Zapatillas May: {info['n']} modelos fabricados en León, Guanajuato.{tipos_txt} "
             "Cada ficha indica la altura exacta del tacón, las tallas y los colores disponibles.")
    otras = chips(paginas, actual=slug)
    partes = [css_base, _CSS_EXTRA, '<section class="guia">',
              f'<p class="g-miga"><a class="g-link" href="/">Inicio</a> › <a class="g-link" href="/tacones">Tacones</a> › Tacones de {_esc(e)}</p>',
              f'<h1 class="g-h1">Tacones de {_esc(e)} para dama</h1>',
              f'<p class="g-sub">{info["n"]} modelos · fabricados en León, Guanajuato · envíos a todo México</p>',
              f"<p>{_esc(intro)}</p>"]
    if otras:
        partes += ['<h2>Ver otra altura</h2>', otras]
    partes += [f"<h2>Modelos de tacones de {_esc(e)}</h2>", _tarjetas(info["modelos"])]
    if info["n"] > MAX_TARJETAS:
        partes.append('<p>Hay más modelos en esta altura: míralos todos en <a class="g-link" href="/tacones">tacones</a>.</p>')
    if nota:
        partes += [f"<h2>Cómo es un tacón de {_esc(e)}</h2>", f"<p>{_esc(nota)}</p>"]
    partes.append('<p>¿Dudas entre dos alturas? Lee la guía <a class="g-link" href="/guia-tacones-8-vs-10-cm">Tacones de 8 cm o de 10 cm: cuál elegir</a>.</p>')
    partes.append("<h2>Preguntas frecuentes</h2>")
    for q, a in _faq(info):
        partes.append(f"<p><strong>{_esc(q)}</strong><br>{_esc(a)}</p>")
    partes.append('<div class="g-cta"><p style="font-size:1.1rem;font-weight:700;margin:0 0 6px">Ver todos los tacones</p>'
                  '<p style="margin:0 0 16px;color:#7a6055">Filtra por color y talla. Si compras 3 o más pares, el descuento se aplica solo en el carrito. Envíos a todo México.</p>'
                  '<a class="g-btn" href="/tacones">Ver tacones →</a></div></section>')
    return "".join(partes)


def datos_estructurados(info, titulo_pag, canonical, og_img):
    """Lista de objetos JSON-LD: migas, lista de productos y preguntas frecuentes."""
    lista = []
    for i, p in enumerate(info["modelos"][:MAX_TARJETAS], 1):
        s = p.get("slug") or p.get("sku_interno") or ""
        lista.append({"@type": "ListItem", "position": i, "url": f"https://zapatillasmay.mx/producto/{s}", "name": (p.get("nombre") or s).strip()})
    ld = [
        {"@context": "https://schema.org/", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://zapatillasmay.mx/"},
            {"@type": "ListItem", "position": 2, "name": "Tacones", "item": "https://zapatillasmay.mx/tacones"},
            {"@type": "ListItem", "position": 3, "name": f"Tacones de {info['etiqueta']}", "item": canonical}]},
        {"@context": "https://schema.org/", "@type": "ItemList", "name": titulo_pag.split(" |")[0], "url": canonical, "itemListElement": lista},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in _faq(info)]},
    ]
    return ld
