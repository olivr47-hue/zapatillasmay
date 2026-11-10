"""
sync_estado.py -- Que tareas automaticas de los canales (MercadoLibre, SHEIN, Walmart, TikTok...) corrieron bien y cuales fallan.

Antes un error en un ciclo automatico solo quedaba en el registro del servidor y nadie se enteraba. Aqui cada tarea anota cuando corrio por
ultima vez, cuando salio bien por ultima vez y su ultimo error; el panel lo muestra. Vive en memoria: al reiniciar el servidor se vacia
y se vuelve a llenar en la primera vuelta de cada tarea.
"""
import threading
import time
from datetime import datetime, timezone

_E: dict = {}
_L = threading.Lock()


def registrar(canal: str, tarea: str, ok: bool, detalle="", cada_min: int = 10) -> None:
    try:
        ahora = time.time()
        with _L:
            e = _E.setdefault((canal, tarea), {"canal": canal, "tarea": tarea, "ultima": None, "ultimo_ok": None,
                                               "fallos_seguidos": 0, "ultimo_error": "", "ultimo_error_en": None, "cada_min": cada_min})
            e["ultima"] = ahora
            e["cada_min"] = cada_min
            if ok:
                e["ultimo_ok"] = ahora
                e["fallos_seguidos"] = 0
            else:
                e["fallos_seguidos"] += 1
                e["ultimo_error"] = str(detalle)[:300]
                e["ultimo_error_en"] = ahora
    except Exception:
        pass


def _iso(ts):
    return datetime.fromtimestamp(ts, timezone.utc).isoformat() if ts else None


def estado() -> list:
    """Una fila por tarea, con su salud: 'ok', 'con_error' (la ultima vuelta fallo) o 'atrasada' (no corre desde hace mas de 3 vueltas)."""
    ahora = time.time()
    out = []
    with _L:
        filas = [dict(v) for v in _E.values()]
    for e in filas:
        limite = max(e["cada_min"], 1) * 60 * 3
        if e["fallos_seguidos"] > 0:
            salud = "con_error"
        elif e["ultima"] and ahora - e["ultima"] > limite:
            salud = "atrasada"
        else:
            salud = "ok"
        out.append({"canal": e["canal"], "tarea": e["tarea"], "salud": salud, "ultima": _iso(e["ultima"]), "ultimo_ok": _iso(e["ultimo_ok"]),
                    "fallos_seguidos": e["fallos_seguidos"], "ultimo_error": e["ultimo_error"], "ultimo_error_en": _iso(e["ultimo_error_en"]), "cada_min": e["cada_min"]})
    out.sort(key=lambda x: ({"con_error": 0, "atrasada": 1, "ok": 2}[x["salud"]], x["canal"], x["tarea"]))
    return out


def ok_res(canal: str, tarea: str, res, cada_min: int = 10) -> None:
    """Anota el resultado de una tarea: si trae una lista de 'errores' cuenta como fallo parcial."""
    errs = res.get("errores") if isinstance(res, dict) else None
    registrar(canal, tarea, not errs, (errs[0] if isinstance(errs, list) and errs else errs) or "", cada_min)


def mal(canal: str, tarea: str, exc, cada_min: int = 10) -> None:
    registrar(canal, tarea, False, f"{type(exc).__name__}: {exc}", cada_min)
