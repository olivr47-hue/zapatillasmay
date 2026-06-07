"""
Caché en memoria con TTL para reducir llamadas a Supabase.
Un dict simple: { key: (data, timestamp, ttl) }
Se limpia solo cuando se lee una clave expirada.
"""
import time
from typing import Any, Optional

_cache: dict = {}

TTL_PUBLICO  = 1800  # 30 min — productos, variantes (cambian poco)
TTL_STOCK    = 600   # 10 min — inventario
TTL_ESTATICO = 86400 # 24 h  — config SEO, sucursales (casi nunca cambian)
TTL_FEEDS    = 3600  #  1 h  — feeds SEO (feed.json, llms.txt, sitemap) — balance frescura/rendimiento


def cache_get(key: str) -> Optional[Any]:
    """Devuelve el valor si existe y no expiró. Si expiró lo borra y devuelve None."""
    entry = _cache.get(key)
    if entry is None:
        return None
    data, ts, ttl = entry
    if time.time() - ts < ttl:
        return data
    del _cache[key]
    return None


def cache_set(key: str, data: Any, ttl: int = TTL_PUBLICO) -> None:
    """Guarda un valor en caché con el TTL indicado (segundos)."""
    _cache[key] = (data, time.time(), ttl)


def cache_invalidate(*keys: str) -> None:
    """Elimina claves específicas del caché."""
    for key in keys:
        _cache.pop(key, None)


def cache_invalidate_prefix(prefix: str) -> None:
    """Elimina todas las claves que empiezan con el prefijo dado."""
    to_delete = [k for k in _cache if k.startswith(prefix)]
    for k in to_delete:
        del _cache[k]


def cache_stats() -> dict:
    """Resumen del estado del caché (para debugging)."""
    now = time.time()
    return {
        "total_keys": len(_cache),
        "entries": [
            {
                "key": k,
                "expires_in_sec": round(v[2] - (now - v[1]), 1)
            }
            for k, v in _cache.items()
        ]
    }
