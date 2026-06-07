# -*- coding: utf-8 -*-
"""Genera descripciones de producto ricas (~130-150 palabras) a partir de los
datos estructurados y las guarda vía el backend. Uso:
  python gen_descripciones.py            -> dry-run (imprime 3 ejemplos, no guarda)
  python gen_descripciones.py --commit   -> genera y guarda TODAS las delgadas
"""
import sys, json, re, hashlib, urllib.request, time

API = "https://zapatillasmay-production.up.railway.app"
COMMIT = "--commit" in sys.argv

def fetch(url):
    return json.loads(urllib.request.urlopen(urllib.request.Request(url), timeout=60).read())

def patch(pid, descripcion):
    body = json.dumps({"descripcion": descripcion}).encode()
    req = urllib.request.Request(f"{API}/productos/{pid}", data=body,
                                 headers={"Content-Type": "application/json"}, method="PATCH")
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.status

def wc(s): return len((s or "").split())
def clean(s): return re.sub(r"\s+", " ", (s or "")).strip()

_ACENTOS = {
    "sintetico": "sintético", "sintetica": "sintética", "sinteticos": "sintéticos",
    "sinteticas": "sintéticas", "textil": "textil", "charol": "charol", "gamuza": "gamuza",
    "napa": "napa", "piel": "piel", "cuero": "cuero",
}
def norm_mat(s):
    s = clean(s).lower()
    return _ACENTOS.get(s, s)

CAT = {
    "sandalias": ("Sandalia", "a"), "tacones": ("Tacón", "o"), "botas": ("Bota", "a"),
    "botines": ("Botín", "o"), "flats": ("Flat", "o"), "plataformas": ("Plataforma", "a"),
    "tenis": ("Tenis", "o"), "nina": ("Modelo para niña", "o"), "accesorios": ("Accesorio", "o"),
}

def heel(p):
    a = p.get("altura_tacon")
    if a:
        try: return float(a)
        except (TypeError, ValueError): pass
    d = p.get("descripcion") or ""
    m = re.search(r"(\d{1,2}(?:\.\d)?)\s*cm", d, re.I) or re.search(r"alto\s*(\d{1,2}(?:\.\d)?)", d, re.I)
    return float(m.group(1)) if m else None

def pick(opts, seed, salt=0):
    h = int(hashlib.md5(f"{seed}|{salt}".encode()).hexdigest(), 16)
    return opts[h % len(opts)]

OCASION = {
    "FIESTA": ["para destacar en bodas, eventos y noches especiales",
               "pensado para fiestas, graduaciones y ocasiones especiales",
               "el aliado perfecto para tus eventos y celebraciones",
               "diseñado para brillar en fiestas y momentos especiales"],
    "CASUAL": ["ideal para tu día a día", "perfecto para el uso diario con estilo",
               "el compañero ideal de tu rutina diaria",
               "pensado para llevar cómoda de la mañana a la noche"],
    "VESTIR": ["ideal para la oficina y reuniones de vestir",
               "perfecto para un look formal y elegante",
               "una opción pulida para el trabajo y compromisos formales"],
}
STYLE = {
    "tacones": ["Combínalo con vestidos de cóctel, pantalón de vestir o un look formal de oficina",
                "Lúcelo con un vestido entallado o un conjunto elegante",
                "Queda increíble con falda lápiz, jumpsuit o un vestido de noche",
                "Perfecto con pantalón sastre o un vestido midi para destacar"],
    "sandalias": ["Combínala con jeans, vestidos ligeros o shorts para un look fresco",
                  "Perfecta con un vestido veraniego o un outfit casual de temporada",
                  "Ideal con falda fluida, shorts de mezclilla o un maxivestido",
                  "Lúcela con un conjunto fresco de primavera-verano"],
    "botas": ["Combínalas con jeans ajustados, faldas o vestidos con medias",
              "Ideales para un look otoño-invierno con mezclilla o abrigo",
              "Quedan geniales con leggings, falda de punto o vestido con medias"],
    "botines": ["Combínalos con jeans, faldas midi o vestidos con medias",
                "Ideales para un look de entretiempo con mezclilla",
                "Perfectos con skinny jeans, falda de cuadros o vestido corto"],
    "flats": ["Cómodos con jeans, faldas midi o vestidos casuales de diario",
              "Ideales con pantalón culotte, mezclilla o un vestido ligero"],
    "plataformas": ["Combínala con jeans acampanados o vestidos para ganar altura con comodidad",
                    "Ideal con pantalón ancho o vestido largo para estilizar sin esfuerzo"],
    "tenis": ["Combínalos con jeans, leggings o un look deportivo casual",
              "Ideales con mezclilla, joggers o un outfit athleisure"],
    "nina": ["Cómodos y prácticos para el día a día de las más pequeñas",
             "Ideales para la escuela, paseos y ocasiones especiales"],
    "accesorios": ["El complemento ideal para redondear tu look",
                   "El detalle perfecto para completar tu outfit"],
}
BENEFICIO = [
    "Su acabado cuidado y sus detalles bien rematados elevan cualquier outfit.",
    "Un modelo versátil que combina comodidad y estilo en partes iguales.",
    "Pensado para que te sientas segura y luzcas espectacular todo el día.",
    "La mezcla justa entre tendencia, comodidad y precio accesible.",
    "Un imprescindible que no puede faltar en tu clóset esta temporada.",
]
MARCA = [
    "Calzado hecho en León, Guanajuato, capital del zapato en México.",
    "Fabricado en León, Guanajuato, con la calidad artesanal que nos distingue.",
    "Producido en León, Guanajuato, cuna del mejor calzado mexicano.",
]

def comfort(h, cat):
    if h is None:
        return pick(["Su diseño cómodo y ligero acompaña tus actividades de todo el día",
                     "Su construcción cómoda lo hace perfecto para llevar muchas horas"], cat)
    h_txt = (f"{h:.1f}".rstrip("0").rstrip(".")) + " cm"
    if h >= 9:
        return pick([f"Su tacón de {h_txt} estiliza la figura y alarga visualmente la pierna",
                     f"Con un tacón de {h_txt}, realza tu silueta y aporta elegancia"], cat, 1)
    if h >= 4:
        return pick([f"Su tacón de {h_txt} da altura con buena estabilidad para caminar cómoda",
                     f"El tacón de {h_txt} ofrece altura elegante sin sacrificar comodidad"], cat, 1)
    return pick([f"Su tacón bajo de {h_txt} aporta un toque femenino sin sacrificar comodidad",
                 f"Con apenas {h_txt} de tacón, suma estilo y total comodidad"], cat, 1)

_FEM = {"sintético": "sintética", "sintéticos": "sintéticas"}
def fem(s):  # concordancia femenina para 'suela'
    return _FEM.get(s, s)

def materiales(p, g="o"):
    mat = norm_mat(p.get("material") or "sintético")
    forro = norm_mat(p.get("forro") or "")
    suela = norm_mat(p.get("material_suela") or "")
    partes = [f"Confeccionad{g} con corte {mat}"]
    if forro: partes.append(f"forro {forro}")
    if suela: partes.append(f"suela {fem(suela)} con buen agarre")
    return ", ".join(partes)

def cuidado(p):
    mat = (p.get("material") or "").lower()
    if "piel" in mat or "cuero" in mat:
        return "Cuidado: nutre la piel con productos específicos y guárdalos en un lugar seco."
    return "Cuidado: limpia con un paño húmedo y evita la humedad prolongada para conservar el color y los herrajes."

def tallas(p):
    t = [str(x) for x in (p.get("tallas_disponibles") or [])]
    if not t: return ""
    medias = " (incluye medias tallas)" if any("." in x or "_5" in x for x in t) else ""
    return f" Disponible de la talla {t[0]} a la {t[-1]}{medias}."

def horma(p):
    h = clean(p.get("horma") or "normal").lower()
    if "normal" in h:
        return "De horma normal: elige tu talla habitual."
    return f"De horma {h}."

def generar(p):
    cat = (p.get("categoria") or "").lower()
    noun = CAT.get(cat, ("Modelo", "o"))[0]
    sub = clean(p.get("subcategoria") or "").upper()
    seed = p.get("id") or p.get("sku_interno") or ""
    ocas = None
    for k in OCASION:
        if k in sub:
            ocas = pick(OCASION[k], seed, 2); break
    if not ocas:
        ocas = pick(["ideal para cualquier ocasión", "un modelo para lucir donde quieras"], seed, 2)
    g = CAT.get(cat, ("", "o"))[1] or "o"
    intro = f"{noun} de Zapatillas May, {ocas}."
    frases = [
        intro,
        comfort(heel(p), cat) + ".",
        materiales(p, g) + ".",
        horma(p) + tallas(p),
        pick(STYLE.get(cat, ["Un básico versátil para tu clóset"]), seed, 3) + ".",
        pick(BENEFICIO, seed, 4),
        pick(MARCA, seed, 5),
        cuidado(p),
        "Garantía de 22 días tras la compra.",
    ]
    return " ".join(clean(f) for f in frases)

def main():
    prods = fetch(f"{API}/productos/")
    thin = [p for p in prods if p.get("activo") and wc(p.get("descripcion")) < 60]
    print(f"Productos activos con descripción delgada: {len(thin)}")
    if not COMMIT:
        print("\n=== DRY-RUN (no se guarda). 3 ejemplos: ===")
        for p in thin[:3]:
            d = generar(p)
            print(f"\n--- {p.get('sku_interno')} · {clean(p.get('nombre'))} ({p.get('categoria')}) · {wc(d)} palabras ---")
            print(d)
        print("\nEjecuta con --commit para guardar las", len(thin))
        return
    ok = err = 0
    for i, p in enumerate(thin, 1):
        try:
            patch(p["id"], generar(p))
            ok += 1
        except Exception as e:
            err += 1
            print(f"  ERROR {p.get('sku_interno')}: {e}")
        if i % 10 == 0:
            print(f"  {i}/{len(thin)}...")
        time.sleep(0.15)
    print(f"\nListo. Guardadas OK: {ok} · Errores: {err}")

if __name__ == "__main__":
    main()
