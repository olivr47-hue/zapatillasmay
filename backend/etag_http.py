"""
ETag + 304 para las respuestas PESADAS de datos que son iguales para todos (variantes e inventario).

El panel y el portal piden esas listas una y otra vez (cada vez que se abre Punto de venta, Inventario, Productos...). Con esto el servidor
marca cada respuesta con un ETag (huella de su contenido); si el navegador ya tiene esa misma versión, pregunta "¿cambió algo?" y el servidor
contesta 304 SIN cuerpo (unos cientos de bytes en vez de cientos de KB).

Nunca muestra datos viejos: `Cache-Control: no-cache` significa que el navegador puede guardar la respuesta pero SIEMPRE pregunta antes de usarla
(el stock «fresco» del punto de venta sigue siendo fresco). No se usa en rutas cuyo contenido cambia según quién pregunta (p. ej. /productos/ trae
costos para el personal).
"""
import hashlib

from starlette.responses import Response

# Mismo contenido para cualquiera: no dependen del token.
RUTAS_ETAG = {"/variantes/", "/inventario/", "/inventario/slim"}

_QUITAR = {b"content-length", b"content-encoding", b"transfer-encoding", b"etag"}


def _sin_debil(t: str) -> str:
    t = t.strip()
    return t[2:] if t.startswith("W/") else t


def coincide(if_none_match: str, etag: str) -> bool:
    if not if_none_match:
        return False
    if if_none_match.strip() == "*":
        return True
    return _sin_debil(etag) in {_sin_debil(t) for t in if_none_match.split(",")}


async def con_etag(request, response):
    """Devuelve la respuesta con ETag o, si el navegador ya la tiene, un 304 sin cuerpo."""
    cuerpo = b"".join([c async for c in response.body_iterator])
    etag = 'W/"' + hashlib.sha1(cuerpo).hexdigest() + '"'

    previa = b""
    for k, v in response.raw_headers:
        if k.lower() == b"cache-control":
            previa = v
    if request.headers.get("authorization"):
        cc = b"private, no-cache"           # con sesión: se puede guardar en ese navegador, pero siempre se pregunta antes de usarla
    elif previa:
        cc = previa                         # sin sesión: conserva la caché corta pública que ya tenía (tienda)
    else:
        cc = b"no-cache"

    cabeceras = [(k, v) for k, v in response.raw_headers if k.lower() not in _QUITAR and k.lower() != b"cache-control"]
    cabeceras.append((b"etag", etag.encode()))
    cabeceras.append((b"cache-control", cc))

    if coincide(request.headers.get("if-none-match", ""), etag):
        nueva = Response(status_code=304)
        nueva.raw_headers = [(k, v) for k, v in cabeceras if k.lower() != b"content-type"]
        return nueva

    nueva = Response(content=cuerpo, status_code=response.status_code)
    nueva.raw_headers = cabeceras + [(b"content-length", str(len(cuerpo)).encode())]
    return nueva
