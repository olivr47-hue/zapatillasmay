"""
Medición pasiva del tráfico y de los picos de memoria del servidor (diagnóstico de costos de Railway).

NO cambia el comportamiento de nada: solo cuenta bytes y anota qué estaba corriendo cuando la memoria
sube de golpe. Todo vive en memoria (se reinicia con cada deploy) y cualquier fallo de la medición se traga
en silencio para no afectar jamás una petición real. Se consulta en GET /diagnostico/trafico (solo admin).

Qué mide:
  - Por ruta de la API: bytes que ENTRAN (peticiones) y que SALEN (respuestas).
  - Por destino externo (Supabase por tabla, MercadoLibre, Walmart, SHEIN, Cloudinary, Meta...): bytes enviados y recibidos
    por las llamadas urllib del backend (httpx/requests no se miden).
  - Picos de memoria (+250 MB entre muestras de 10 s): qué rutas estaban en curso y qué hilos estaban trabajando.
"""
import re
import sys
import threading
import time
import traceback
import urllib.request
from urllib.parse import urlsplit

_LOCK = threading.Lock()
_INICIO = time.time()
_MAX_CLAVES = 400

_rutas: dict = {}      # "GET /productos/{id}" -> [peticiones, bytes_in, bytes_out]
_externo: dict = {}    # "supabase:inventario" -> [llamadas, bytes_enviados, bytes_recibidos]
_en_curso: dict = {}   # ruta -> cuántas peticiones están corriendo ahora
_picos: list = []      # eventos de salto de memoria
_muestras: list = []   # (ts, rss_mb)

_RE_ID = re.compile(r"/([0-9a-fA-F]{8}-[0-9a-fA-F-]{27,}|\d+)(?=/|$)")


def _clave_ruta(metodo: str, path: str) -> str:
    return f"{metodo} {_RE_ID.sub('/{id}', path)[:90]}"


def _sumar(tabla: dict, clave: str, a: int = 0, b: int = 0):
    with _LOCK:
        fila = tabla.get(clave)
        if fila is None:
            if len(tabla) >= _MAX_CLAVES:
                clave = "(otros)"
                fila = tabla.setdefault(clave, [0, 0, 0])
            else:
                fila = tabla.setdefault(clave, [0, 0, 0])
        fila[0] += 1
        fila[1] += a
        fila[2] += b


class MedicionTrafico:
    """Middleware ASGI puro: cuenta los bytes de cada petición/respuesta HTTP sin tocarlos."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http":
            return await self.app(scope, receive, send)
        try:
            clave = _clave_ruta(scope.get("method", "?"), scope.get("path", "?"))
        except Exception:
            return await self.app(scope, receive, send)
        cuenta = {"in": 0, "out": 0}
        with _LOCK:
            _en_curso[clave] = _en_curso.get(clave, 0) + 1

        async def _receive():
            msg = await receive()
            try:
                if msg.get("type") == "http.request":
                    cuenta["in"] += len(msg.get("body") or b"")
            except Exception:
                pass
            return msg

        async def _send(msg):
            try:
                if msg.get("type") == "http.response.body":
                    cuenta["out"] += len(msg.get("body") or b"")
            except Exception:
                pass
            await send(msg)

        try:
            await self.app(scope, _receive, _send)
        finally:
            try:
                with _LOCK:
                    n = _en_curso.get(clave, 1) - 1
                    if n <= 0:
                        _en_curso.pop(clave, None)
                    else:
                        _en_curso[clave] = n
                _sumar(_rutas, clave, cuenta["in"], cuenta["out"])
            except Exception:
                pass


def _etiqueta_destino(url: str) -> str:
    try:
        partes = urlsplit(url)
        host = partes.netloc.lower()
        if "supabase" in host:
            m = re.match(r"/rest/v1/([^/?]+)", partes.path)
            return f"supabase:{m.group(1) if m else partes.path[:30]}"
        return host
    except Exception:
        return "?"


def _instalar_urlopen():
    previo = urllib.request.urlopen

    def urlopen_medido(url, data=None, *args, **kwargs):
        resp = previo(url, data, *args, **kwargs)
        try:
            u = url.full_url if hasattr(url, "full_url") else str(url)
            cuerpo = data if data is not None else getattr(url, "data", None)
            etiqueta = _etiqueta_destino(u)
            enviados = len(cuerpo) if isinstance(cuerpo, (bytes, bytearray)) else 0
            _sumar(_externo, etiqueta, enviados, 0)
            leer = resp.read

            def read_medido(*a, **k):
                datos = leer(*a, **k)
                try:
                    with _LOCK:
                        fila = _externo.get(etiqueta) or _externo.setdefault("(otros)", [0, 0, 0])
                        fila[2] += len(datos or b"")
                except Exception:
                    pass
                return datos

            resp.read = read_medido
        except Exception:
            pass
        return resp

    urllib.request.urlopen = urlopen_medido


def _rss_mb():
    try:
        with open("/proc/self/status") as f:
            for linea in f:
                if linea.startswith("VmRSS:"):
                    return int(linea.split()[1]) / 1024.0
    except Exception:
        return None
    return None


def _hilos_trabajando() -> list:
    """Hilos que NO están dormidos (time.sleep / esperando), con las últimas funciones de su pila."""
    salida = []
    try:
        nombres = {t.ident: t.name for t in threading.enumerate()}
        for ident, frame in sys._current_frames().items():
            pila = traceback.extract_stack(frame)
            if not pila:
                continue
            ultima = pila[-1]
            if ultima.name in ("sleep", "wait", "_wait_for_tstate_lock", "select", "poll", "run_forever", "_run_once") \
                    or "selectors" in ultima.filename or "threading" in ultima.filename:
                continue
            resumen = " > ".join(f"{p.filename.split('/')[-1]}:{p.name}" for p in pila[-5:])
            salida.append({"hilo": nombres.get(ident, str(ident)), "pila": resumen})
    except Exception:
        pass
    return salida[:8]


def _muestreo():
    time.sleep(30)
    while True:
        try:
            rss = _rss_mb()
            if rss is not None:
                ahora = time.time()
                with _LOCK:
                    _muestras.append((ahora, rss))
                    del _muestras[:-60]
                    previas = [m[1] for m in _muestras[-4:-1]]
                if previas and rss - min(previas) >= 250:
                    evento = {
                        "ts": ahora, "rss_mb": round(rss), "antes_mb": round(min(previas)),
                        "peticiones_en_curso": dict(list(_en_curso.items())[:8]),
                        "hilos": _hilos_trabajando(),
                    }
                    with _LOCK:
                        _picos.append(evento)
                        del _picos[:-30]
        except Exception:
            pass
        time.sleep(10)


def resumen() -> dict:
    def top(tabla, idx, n=25):
        filas = sorted(tabla.items(), key=lambda kv: kv[1][idx], reverse=True)[:n]
        return [{"clave": k, "n": v[0], "mb_entran": round(v[1] / 1e6, 2), "mb_salen": round(v[2] / 1e6, 2)} for k, v in filas]

    with _LOCK:
        rutas_in_total = sum(v[1] for v in _rutas.values())
        rutas_out_total = sum(v[2] for v in _rutas.values())
        ext_env = sum(v[1] for v in _externo.values())
        ext_rec = sum(v[2] for v in _externo.values())
        rss = _muestras[-1][1] if _muestras else None
        return {
            "desde_hace_min": round((time.time() - _INICIO) / 60, 1),
            "memoria_actual_mb": round(rss) if rss else None,
            "api_total": {"mb_entran": round(rutas_in_total / 1e6, 1), "mb_salen": round(rutas_out_total / 1e6, 1)},
            "externo_total": {"mb_enviados": round(ext_env / 1e6, 1), "mb_recibidos": round(ext_rec / 1e6, 1)},
            "api_rutas_por_salida": top(_rutas, 2),
            "api_rutas_por_entrada": top(_rutas, 1, 10),
            "externo_por_recibido": top(_externo, 2),
            "externo_por_enviado": top(_externo, 1, 10),
            "picos_memoria": list(_picos[-15:]),
            "nota": "api: [entran=lo que recibe el servidor, salen=lo que responde]. externo: lo que el servidor manda/recibe de otros servicios (urllib). Se reinicia en cada deploy.",
        }


def instalar(app):
    """Activa la medición. Si algo falla, el servidor sigue exactamente igual que antes."""
    try:
        _instalar_urlopen()
        app.add_middleware(MedicionTrafico)
        threading.Thread(target=_muestreo, daemon=True, name="medicion-memoria").start()
    except Exception as e:
        print(f"[medicion] no se pudo activar (no afecta al servidor): {e}")
