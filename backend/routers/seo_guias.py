"""Guías de SEO de la tienda (/guias y /guia-...).

Cada guía es un diccionario: título SEO, descripción, H1, cuerpo en HTML y preguntas frecuentes.
En el cuerpo, un marcador <!--GRID:categoria:tipo_tacon--> se sustituye (en seo.py) por modelos reales
del catálogo (solo con foto). seo.py arma el HTML final con `construir_guia` y el CSS compartido.
"""
import html as _html

AUTOR = "Por el equipo de Zapatillas May · fábrica de calzado de dama en León, Guanajuato"

# (slug de la guía, texto del enlace) por categoría: se muestra como tarjeta en la categoría y en las fichas
GUIA_POR_CATEGORIA = {
    "tacones": [("guia-tacones-8-vs-10-cm", "¿Tacón de 8 o de 10 cm? Cómo elegir el tuyo"),
                ("guia-tacon-aguja-o-bloque", "Tacón de aguja o de bloque: cuál elegir")],
    "botas": [("guia-botas-o-botines", "Botas o botines: diferencias y cómo elegir")],
    "botines": [("guia-botas-o-botines", "Botas o botines: diferencias y cómo elegir")],
    "sandalias": [("guia-sandalias-segun-ocasion", "Sandalias: cuál elegir según la ocasión")],
    "plataformas": [("guia-plataformas-como-elegir", "Plataformas: cómo elegirlas y combinarlas")],
    "flats": [("guia-flats-como-elegir", "Flats: cómo elegirlos y con qué combinarlos")],
}

GUIAS = {
    "guia-tacon-aguja-o-bloque": {
        "corto": "Tacón de aguja o de bloque",
        "title": "Tacón de aguja o de bloque: cuál elegir | Zapatillas May",
        "desc": "Diferencias entre tacón de aguja y de bloque: comodidad, estabilidad y cuándo usar cada uno, con modelos reales fabricados en León, Guanajuato.",
        "h1": "Tacón de aguja o de bloque: cuál elegir",
        "resumen": "Estabilidad, comodidad y estilo: en qué se diferencian y cuándo conviene cada uno.",
        "body": """
  <p>Dos tacones de la misma altura pueden sentirse totalmente distintos al caminar. La diferencia está en la superficie de apoyo: el tacón de aguja es delgado y estilizado; el de bloque es ancho y reparte mejor el peso. Esta guía te ayuda a escoger según cómo lo vas a usar.</p>
  <h2>Comparativa rápida</h2>
  <table>
    <thead><tr><th></th><th>Tacón de aguja</th><th>Tacón de bloque</th></tr></thead>
    <tbody>
      <tr><td>Estabilidad</td><td data-l="Aguja">Menor superficie de apoyo; pide más equilibrio</td><td data-l="Bloque">Mayor superficie; se siente más firme al caminar</td></tr>
      <tr><td>Estilo</td><td data-l="Aguja">Muy estilizado, ideal para ocasiones formales</td><td data-l="Bloque">Versátil: sirve de diario y para eventos</td></tr>
      <tr><td>Superficies</td><td data-l="Aguja">Mejor en pisos lisos; se puede atorar en rejillas, adoquín o pasto</td><td data-l="Bloque">Se defiende mejor en banquetas, adoquín y exteriores</td></tr>
      <tr><td>Uso prolongado</td><td data-l="Aguja">Mejor para ratos cortos</td><td data-l="Bloque">Mejor para jornadas largas</td></tr>
    </tbody>
  </table>
  <h2>Cómo elegir según la ocasión</h2>
  <ul>
    <li><strong>Oficina o jornada larga:</strong> el bloque es la opción más cómoda porque reparte el peso del cuerpo.</li>
    <li><strong>Boda, cena o fiesta de noche:</strong> la aguja alarga la silueta y da un acabado más formal.</li>
    <li><strong>Eventos al aire libre:</strong> elige bloque o cuña para no hundirte en pasto ni atorarte en el piso.</li>
    <li><strong>Si no estás acostumbrada al tacón:</strong> empieza con un bloque de altura media y ve subiendo.</li>
  </ul>
  <h2>Consejos para caminar mejor</h2>
  <ul>
    <li>Apoya primero el talón y baja con suavidad el resto del pie; con aguja da pasos más cortos.</li>
    <li>Una tira al tobillo ayuda a que el pie no se deslice hacia adelante.</li>
    <li>Revisa la altura del tacón en la ficha de cada modelo y la <a class="g-link" href="/tabla-tallas">tabla de tallas</a> antes de comprar.</li>
  </ul>
  <h2>Modelos con tacón de aguja</h2>
  <!--GRID:tacones:aguja-->
  <h2>Modelos con tacón de bloque</h2>
  <!--GRID:tacones:bloque-->""",
        "faq": [
            ("¿Qué tacón es más cómodo, el de aguja o el de bloque?", "Por lo general el de bloque, porque tiene más superficie de apoyo y reparte mejor el peso. La comodidad también depende de la altura y de la plantilla del modelo."),
            ("¿Puedo usar tacones de aguja en exteriores?", "Se puede, pero conviene evitar rejillas, adoquín irregular y pasto, donde la aguja se atora o se hunde. Para exteriores suele funcionar mejor un tacón de bloque o de cuña."),
            ("¿Qué tacón me recomiendan para una boda de jardín?", "Un tacón de bloque o de cuña, porque no se hunde en el pasto y te da más estabilidad durante varias horas."),
        ],
        "cta": ("/tacones", "Ver todos los tacones"),
        "relacionadas": ["guia-tacones-8-vs-10-cm", "guia-plataformas-como-elegir"],
    },
    "guia-botas-o-botines": {
        "corto": "Botas o botines",
        "title": "Botas o botines: diferencias y cómo elegir | Zapatillas May",
        "desc": "Guía para elegir entre botas y botines de dama: largo, combinaciones, comodidad y consejos de talla, con modelos reales fabricados en León, Guanajuato.",
        "h1": "Botas o botines: diferencias y cómo elegir",
        "resumen": "Largo, combinaciones y comodidad: cuál te conviene según tu estilo.",
        "body": """
  <p>Botas y botines se parecen, pero se usan distinto. El botín llega al tobillo o poco más arriba; la bota cubre la pantorrilla o llega hasta la rodilla. Elegir bien depende de cómo te vistes y de cuánto quieras cubrir.</p>
  <h2>Comparativa rápida</h2>
  <table>
    <thead><tr><th></th><th>Botín</th><th>Bota</th></tr></thead>
    <tbody>
      <tr><td>Largo</td><td data-l="Botín">Tobillo o un poco más arriba</td><td data-l="Bota">Media caña, pantorrilla o hasta la rodilla</td></tr>
      <tr><td>Combina con</td><td data-l="Botín">Jeans, faldas, vestidos y shorts</td><td data-l="Bota">Faldas, vestidos y pantalón ajustado dentro de la bota</td></tr>
      <tr><td>Versatilidad</td><td data-l="Botín">Muy alta: sirve para casi todo</td><td data-l="Bota">Más marcada: da carácter al outfit</td></tr>
      <tr><td>Al calzar</td><td data-l="Botín">Más fácil de poner y quitar</td><td data-l="Bota">Pide revisar el ajuste en la pantorrilla</td></tr>
    </tbody>
  </table>
  <h2>Cómo elegir</h2>
  <ul>
    <li><strong>Si quieres un solo par para todo:</strong> un botín con tacón de bloque combina con jeans, faldas y vestidos.</li>
    <li><strong>Si buscas un look más marcado:</strong> una bota alta con falda o vestido alarga la silueta.</li>
    <li><strong>Si tienes pantorrilla ancha:</strong> busca botas con elástico o cierre y revisa la ficha del modelo.</li>
    <li><strong>Para caminar mucho:</strong> prefiere tacón de bloque o medio y plantilla acolchada.</li>
  </ul>
  <h2>Consejos de talla y cuidado</h2>
  <ul>
    <li>Pruébalas con el tipo de calcetín o media que vas a usar y consulta la <a class="g-link" href="/tabla-tallas">tabla de tallas</a>.</li>
    <li>Guárdalas con algo que mantenga la caña recta para que no se marquen pliegues.</li>
    <li>Limpia el polvo con un paño suave después de usarlas.</li>
  </ul>
  <h2>Botas con tacón de bloque</h2>
  <!--GRID:botas:bloque-->
  <h2>Botines con tacón de bloque</h2>
  <!--GRID:botines:bloque-->
  <h2>Botines con tacón de aguja</h2>
  <!--GRID:botines:aguja-->""",
        "faq": [
            ("¿Qué es más versátil, una bota o un botín?", "El botín, porque combina con jeans, faldas y vestidos y es más fácil de poner y quitar. La bota da un look más marcado y funciona muy bien con faldas y vestidos."),
            ("¿Las botas son solo para el frío?", "Se usan sobre todo en otoño e invierno, pero un botín con tacón de bloque puede usarse buena parte del año."),
            ("¿Cómo sé si una bota me va a quedar bien en la pantorrilla?", "Revisa en la ficha del modelo si trae cierre o elástico y pruébala con la prenda que vas a usar debajo. Si tienes dudas, escríbenos por WhatsApp."),
        ],
        "cta": ("/botas", "Ver botas y botines"),
        "relacionadas": ["guia-como-elegir-tu-talla", "guia-tacon-aguja-o-bloque"],
    },
    "guia-sandalias-segun-ocasion": {
        "corto": "Sandalias según la ocasión",
        "title": "Sandalias: cuál elegir según la ocasión | Zapatillas May",
        "desc": "Cómo elegir sandalias de dama según la ocasión: planas, de bloque o de plataforma, para diario, fiesta y vacaciones, con modelos reales de León, Guanajuato.",
        "h1": "Sandalias: cuál elegir según la ocasión",
        "resumen": "Planas, de bloque o de plataforma: la sandalia correcta para cada plan.",
        "body": """
  <p>Una sandalia puede ser para caminar todo el día o para lucir en una fiesta, pero rara vez sirve igual para las dos cosas. Estos son los tipos más comunes y para qué plan funciona mejor cada uno.</p>
  <h2>Tipos de sandalia y cuándo usarlas</h2>
  <table>
    <thead><tr><th>Tipo</th><th>Ideal para</th><th>Ten en cuenta</th></tr></thead>
    <tbody>
      <tr><td>Planas</td><td data-l="Ideal para">Diario, paseo, vacaciones, calor</td><td data-l="Ten en cuenta">Busca plantilla acolchada si vas a caminar mucho</td></tr>
      <tr><td>Con tacón de bloque</td><td data-l="Ideal para">Oficina casual, comidas, eventos de día</td><td data-l="Ten en cuenta">Más firmes que una aguja, buenas para varias horas</td></tr>
      <tr><td>De plataforma</td><td data-l="Ideal para">Salidas largas y looks con altura</td><td data-l="Ten en cuenta">La altura se reparte, pero pesan un poco más</td></tr>
      <tr><td>Con tiras al tobillo</td><td data-l="Ideal para">Fiestas y eventos</td><td data-l="Ten en cuenta">Ajusta la tira para que el pie no se deslice</td></tr>
    </tbody>
  </table>
  <h2>Cómo elegir bien</h2>
  <ul>
    <li><strong>Para uso diario:</strong> elige sandalias planas o de tacón bajo con tiras que sujeten bien el pie.</li>
    <li><strong>Para una fiesta:</strong> una sandalia de plataforma o con tacón de bloque se ve arreglada y aguanta más tiempo que una de aguja.</li>
    <li><strong>Con calor:</strong> el pie se hincha un poco; si estás entre dos tallas, revisa la <a class="g-link" href="/tabla-tallas">tabla de tallas</a> y las tiras ajustables.</li>
    <li><strong>Combina con lo que ya tienes:</strong> los tonos nude, negro y dorado van con casi todo.</li>
  </ul>
  <h2>Sandalias planas</h2>
  <!--GRID:sandalias:sin_tacon-->
  <h2>Sandalias con tacón de bloque</h2>
  <!--GRID:sandalias:bloque-->
  <h2>Sandalias de plataforma</h2>
  <!--GRID:sandalias:plataforma-->""",
        "faq": [
            ("¿Qué sandalias son más cómodas para caminar todo el día?", "Las planas con plantilla acolchada y las de tacón bajo o de bloque, porque reparten mejor el peso que una sandalia de aguja."),
            ("¿Qué sandalias uso en una fiesta?", "Una sandalia de plataforma o con tacón de bloque y tira al tobillo se ve arreglada y es más estable para bailar."),
            ("¿Las sandalias se ajustan?", "Muchas traen tiras o hebillas ajustables. Revisa la ficha de cada modelo y la tabla de tallas para elegir tu medida."),
        ],
        "cta": ("/sandalias", "Ver todas las sandalias"),
        "relacionadas": ["guia-como-elegir-tu-talla", "guia-plataformas-como-elegir"],
    },
    "guia-plataformas-como-elegir": {
        "corto": "Plataformas: cómo elegirlas",
        "title": "Plataformas: cómo elegirlas y combinarlas | Zapatillas May",
        "desc": "Guía de plataformas de dama: qué es la altura real, por qué son más cómodas que un tacón y con qué combinarlas. Modelos de León, Guanajuato.",
        "h1": "Plataformas: cómo elegirlas y combinarlas",
        "resumen": "Qué las hace distintas, cómo leer su altura y con qué combinarlas.",
        "body": """
  <p>La plataforma es la suela gruesa que levanta también la parte delantera del pie. Por eso, a igual altura de tacón, suele sentirse menos inclinada que un tacón normal. Aquí te explicamos cómo leer su altura y cómo sacarles partido.</p>
  <h2>La altura real: lo que importa al caminar</h2>
  <p>Lo que siente tu pie es la diferencia entre el tacón y la plataforma, no la altura total. Un ejemplo sencillo:</p>
  <table>
    <thead><tr><th>Altura del tacón</th><th>Plataforma</th><th>Inclinación que sientes</th></tr></thead>
    <tbody>
      <tr><td>10 cm</td><td data-l="Plataforma">2 cm</td><td data-l="Inclinación">8 cm</td></tr>
      <tr><td>10 cm</td><td data-l="Plataforma">3 cm</td><td data-l="Inclinación">7 cm</td></tr>
      <tr><td>8 cm</td><td data-l="Plataforma">2 cm</td><td data-l="Inclinación">6 cm</td></tr>
    </tbody>
  </table>
  <p>Así, una plataforma te da altura sin exigirle tanto a la planta del pie.</p>
  <h2>Con qué combinarlas</h2>
  <ul>
    <li><strong>Jeans y pantalones anchos:</strong> la plataforma evita que el pantalón arrastre y equilibra la silueta.</li>
    <li><strong>Vestidos y faldas:</strong> funcionan igual de bien, de día o de noche, según el color.</li>
    <li><strong>Un toque de moda:</strong> los modelos en tonos metálicos o claros destacan en cualquier outfit sencillo.</li>
  </ul>
  <h2>Qué revisar antes de comprar</h2>
  <ul>
    <li>La altura del tacón aparece en la ficha de cada modelo; nuestras plataformas van de 3 a 10 cm de base.</li>
    <li>Las plataformas pesan un poco más que un zapato plano; si caminas mucho, elige una altura media.</li>
    <li>Revisa la <a class="g-link" href="/tabla-tallas">tabla de tallas</a> para elegir bien tu medida.</li>
  </ul>
  <h2>Modelos de plataforma</h2>
  <!--GRID:plataformas:-->""",
        "faq": [
            ("¿Las plataformas son más cómodas que un tacón normal?", "Con la misma altura de tacón, normalmente sí, porque la plataforma reduce la inclinación real del pie. La comodidad también depende de la plantilla y del peso del zapato."),
            ("¿Cómo sé qué tan alta es una plataforma?", "La ficha de cada producto indica la altura del tacón en centímetros."),
            ("¿Qué plataforma recomiendan para empezar a usar tacones?", "Una de altura media, con tacón de bloque o plataforma ancha, porque es más estable que una aguja."),
        ],
        "cta": ("/plataformas", "Ver plataformas"),
        "relacionadas": ["guia-tacones-8-vs-10-cm", "guia-tacon-aguja-o-bloque"],
    },
    "guia-como-elegir-tu-talla": {
        "corto": "Cómo medir tu pie y elegir tu talla",
        "title": "Cómo medir tu pie y elegir tu talla | Zapatillas May",
        "desc": "Aprende a medir tu pie en casa y a elegir tu talla de calzado de dama: pasos, equivalencia en centímetros y consejos si estás entre dos tallas.",
        "h1": "Cómo medir tu pie y elegir tu talla",
        "resumen": "Mide en casa en 5 minutos y compra calzado en línea con más seguridad.",
        "body": """
  <p>Comprar calzado en línea es más fácil cuando conoces la medida exacta de tu pie. En cinco minutos puedes medirlo en casa con una hoja y una regla.</p>
  <h2>Paso a paso para medir tu pie</h2>
  <ol style="padding-left:20px;margin:0 0 14px">
    <li style="margin-bottom:8px">Pega una hoja en el piso, contra la pared, y párate encima con el talón tocando la pared.</li>
    <li style="margin-bottom:8px">Marca con un lápiz el punto de tu dedo más largo (no siempre es el gordo).</li>
    <li style="margin-bottom:8px">Mide en centímetros del borde de la hoja a la marca.</li>
    <li style="margin-bottom:8px">Repite con el otro pie y quédate con la medida mayor.</li>
  </ol>
  <h2>Cómo usar tu medida</h2>
  <p>De forma orientativa, la talla mexicana se acerca a la longitud de tu pie en centímetros (un pie de 24 cm suele corresponder a una talla 24). Después confirma en la <a class="g-link" href="/tabla-tallas">tabla de tallas</a> de Zapatillas May, que es la referencia para nuestros modelos. La mayoría de los modelos llegan de la talla 22 a la 27.</p>
  <h2>Si estás entre dos tallas</h2>
  <ul>
    <li><strong>Zapatos de punta cerrada o puntiaguda:</strong> elige la talla mayor para que no aprieten los dedos.</li>
    <li><strong>Sandalias con tiras ajustables:</strong> la talla menor puede funcionar si la tira se ajusta bien.</li>
    <li><strong>Botas y botines:</strong> piensa en el calcetín o la media que vas a usar.</li>
  </ul>
  <h2>Tips para acertar</h2>
  <ul>
    <li>Mide por la tarde, cuando el pie está un poco más hinchado.</li>
    <li>Un tacón más alto carga más peso en la punta: si vas a usar tacón alto, no elijas una talla justa.</li>
    <li>Cada modelo tiene su propia horma; revisa las notas de la ficha del producto.</li>
  </ul>
  <h2>¿Y si no me queda?</h2>
  <p>Aceptamos devoluciones y cambios dentro de los 30 días naturales si el producto está en su estado original y sin uso. Si el cambio es por talla, el envío corre por cuenta del cliente. Si tienes dudas antes de comprar, escríbenos por WhatsApp.</p>""",
        "faq": [
            ("¿Cómo sé mi talla de calzado mexicana?", "Mide la longitud de tu pie en centímetros: la talla mexicana se acerca a ese número. Después confirma en la tabla de tallas de Zapatillas May."),
            ("¿Qué hago si estoy entre dos tallas?", "En zapatos de punta cerrada elige la mayor; en sandalias con tiras ajustables puede funcionar la menor."),
            ("¿Puedo cambiar el calzado si no me queda?", "Sí, dentro de los 30 días naturales si está en su estado original y sin uso. En cambios por talla el envío corre por cuenta del cliente."),
        ],
        "cta": ("/tabla-tallas", "Ver la tabla de tallas"),
        "relacionadas": ["guia-botas-o-botines", "guia-sandalias-segun-ocasion"],
    },
    "guia-flats-como-elegir": {
        "corto": "Flats: cómo elegirlos",
        "title": "Flats: cómo elegirlos y con qué combinarlos | Zapatillas May",
        "desc": "Guía de flats y zapatos bajos de dama: tipos (bailarina, mocasín, puntiagudo), cómo elegirlos y con qué combinarlos. Modelos de León, Guanajuato.",
        "h1": "Flats: cómo elegirlos y con qué combinarlos",
        "resumen": "Bailarina, mocasín o puntiagudo: el flat ideal para tu día a día.",
        "body": """
  <p>Los flats son zapatos de piso, sin tacón o con muy poca altura, y son los favoritos para caminar y trabajar. Hay varios estilos y cada uno da un aire distinto a tu outfit.</p>
  <h2>Tipos de flat y cuándo usarlos</h2>
  <table>
    <thead><tr><th>Estilo</th><th>Ideal para</th><th>Combina con</th></tr></thead>
    <tbody>
      <tr><td>Bailarina</td><td data-l="Ideal para">Diario, escuela, paseo</td><td data-l="Combina con">Jeans, vestidos, faldas</td></tr>
      <tr><td>Mocasín o loafer</td><td data-l="Ideal para">Oficina y estilo clásico</td><td data-l="Combina con">Pantalón de vestir, jeans, faldas</td></tr>
      <tr><td>Puntiagudo</td><td data-l="Ideal para">Oficina y eventos casuales</td><td data-l="Combina con">Pantalón recto y vestidos</td></tr>
    </tbody>
  </table>
  <h2>Cómo elegir unos flats cómodos</h2>
  <ul>
    <li><strong>Plantilla acolchada:</strong> hace la diferencia si pasas muchas horas de pie.</li>
    <li><strong>Talón que no roce:</strong> revisa que el ajuste sea firme sin apretar.</li>
    <li><strong>Punta:</strong> la punta redonda da más espacio a los dedos; la puntiaguda estiliza, pero pide la talla correcta.</li>
    <li><strong>Color básico:</strong> negro, nude y beige combinan con casi todo y sirven todo el año.</li>
  </ul>
  <h2>Consejos de talla</h2>
  <p>Mide tu pie y confirma en la <a class="g-link" href="/tabla-tallas">tabla de tallas</a>. En flats de punta cerrada, si estás entre dos tallas, elige la mayor.</p>
  <h2>Modelos de flats</h2>
  <!--GRID:flats:sin_tacon-->""",
        "faq": [
            ("¿Qué flats son mejores para la oficina?", "Los mocasines o loafers y los puntiagudos en colores básicos como negro o nude, que se ven formales y son cómodos para estar de pie."),
            ("¿Los flats son cómodos para usar todo el día?", "Sí, sobre todo con plantilla acolchada y buen ajuste en el talón. Revisa los detalles de materiales en la ficha de cada modelo."),
            ("¿Qué hago si estoy entre dos tallas en flats?", "Elige la talla mayor en modelos de punta cerrada para que los dedos no queden apretados."),
        ],
        "cta": ("/flats", "Ver todos los flats"),
        "relacionadas": ["guia-como-elegir-tu-talla", "guia-sandalias-segun-ocasion"],
    },
}

# Guías anteriores (definidas en seo.py): slug -> (título corto, resumen), para el índice y los enlaces "Otras guías"
GUIAS_BASE = {
    "guia-tacones-8-vs-10-cm": ("Tacones de 8 cm o de 10 cm: cuál elegir", "Comodidad, ocasiones de uso y consejos de talla, con modelos reales de nuestro catálogo."),
    "guia-comprar-calzado-mayoreo-leon": ("Cómo comprar calzado al mayoreo en León", "Para zapaterías, boutiques y revendedoras: qué es una corrida y cómo hacer tu primer pedido directo con la fábrica."),
}


def _e(x):
    return _html.escape(str(x or ""), quote=True)


def titulo_corto(slug):
    if slug in GUIAS:
        return GUIAS[slug]["h1"]
    return GUIAS_BASE.get(slug, ("", ""))[0]


def resumen(slug):
    if slug in GUIAS:
        return GUIAS[slug]["resumen"]
    return GUIAS_BASE.get(slug, ("", ""))[1]


def todas_las_guias():
    """Orden de aparición en el índice."""
    return ["guia-tacones-8-vs-10-cm", "guia-tacon-aguja-o-bloque", "guia-botas-o-botines", "guia-sandalias-segun-ocasion",
            "guia-plataformas-como-elegir", "guia-flats-como-elegir", "guia-como-elegir-tu-talla", "guia-comprar-calzado-mayoreo-leon"]


def construir_guia(slug, css):
    g = GUIAS[slug]
    faq = "".join(f"<p><strong>{_e(q)}</strong><br>{_e(a)}</p>" for q, a in g["faq"])
    rel = "".join(f'<a class="g-item" href="/{s}"><b>{_e(titulo_corto(s))}</b><em>{_e(resumen(s))}</em><i>Leer guía →</i></a>' for s in g["relacionadas"])
    cta_url, cta_txt = g["cta"]
    return (css + '<section class="guia">'
            f'<p class="g-miga"><a class="g-link" href="/">Inicio</a> › <a class="g-link" href="/guias">Guías</a> › {_e(g["corto"])}</p>'
            f'<h1 class="g-h1">{_e(g["h1"])}</h1>'
            f'<p class="g-sub">{_e(AUTOR)}</p>'
            + g["body"] +
            f'<div class="g-cta"><p style="font-size:1.1rem;font-weight:700;margin:0 0 6px">¿Lista para elegir?</p>'
            f'<p style="margin:0 0 14px;color:#7a6055">Envíos a todo México y descuento automático desde 3 pares.</p>'
            f'<a class="g-btn" href="{_e(cta_url)}">{_e(cta_txt)} →</a></div>'
            f'<h2>Preguntas frecuentes</h2>{faq}'
            f'<h2>Otras guías</h2><div class="g-lista">{rel}</div>'
            '</section>')


def construir_indice(css):
    items = "".join(f'<a class="g-item" href="/{s}"><b>{_e(titulo_corto(s))}</b><em>{_e(resumen(s))}</em><i>Leer guía →</i></a>' for s in todas_las_guias())
    return (css + '<section class="guia">'
            '<p class="g-miga"><a class="g-link" href="/">Inicio</a> › Guías</p>'
            '<h1 class="g-h1">Guías de calzado para dama</h1>'
            '<p class="g-sub">Consejos prácticos de la fábrica de Zapatillas May, en León, Guanajuato.</p>'
            f'<div class="g-lista">{items}</div></section>')
