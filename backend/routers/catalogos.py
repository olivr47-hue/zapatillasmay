from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch, supabase_delete
from cache import cache_get, cache_set, cache_invalidate, cache_invalidate_prefix, TTL_PUBLICO

router = APIRouter(prefix="/catalogos", tags=["Catálogos"])


def _invalidar_catalogo(catalogo_id: str = None):
    """Limpia caché de listas y, si se da id, también el caché de ese catálogo."""
    cache_invalidate("catalogos_activos", "catalogos_todos")
    if catalogo_id:
        cache_invalidate(f"catalogo_{catalogo_id}", f"catalogo_{catalogo_id}_paginas")


# ── Catálogos ────────────────────────────────────────────────

@router.get("/")
def listar_catalogos():
    """Catálogos activos, ordenados por campo 'orden' y fecha."""
    try:
        cached = cache_get("catalogos_activos")
        if cached is not None:
            return cached
        data = supabase_get("catalogos?activo=eq.true&order=orden.asc,created_at.desc")
        cache_set("catalogos_activos", data, ttl=TTL_PUBLICO)
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/todos")
def listar_todos_catalogos():
    """Todos los catálogos (activos e inactivos) — para el panel."""
    try:
        cached = cache_get("catalogos_todos")
        if cached is not None:
            return cached
        data = supabase_get("catalogos?order=orden.asc,created_at.desc")
        cache_set("catalogos_todos", data, ttl=TTL_PUBLICO)
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/{catalogo_id}")
def obtener_catalogo(catalogo_id: str):
    try:
        ckey = f"catalogo_{catalogo_id}"
        cached = cache_get(ckey)
        if cached is not None:
            return cached
        data = supabase_get(f"catalogos?id=eq.{catalogo_id}")
        cache_set(ckey, data, ttl=TTL_PUBLICO)
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/{catalogo_id}/paginas")
def paginas_catalogo(catalogo_id: str):
    """Páginas de un catálogo ordenadas por número de página."""
    try:
        ckey = f"catalogo_{catalogo_id}_paginas"
        cached = cache_get(ckey)
        if cached is not None:
            return cached
        data = supabase_get(f"catalogo_paginas?catalogo_id=eq.{catalogo_id}&order=pagina_numero.asc")
        cache_set(ckey, data, ttl=TTL_PUBLICO)
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/")
def crear_catalogo(datos: dict):
    try:
        result = supabase_post("catalogos", datos)
        _invalidar_catalogo()
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/{catalogo_id}")
def actualizar_catalogo(catalogo_id: str, datos: dict):
    try:
        result = supabase_patch(f"catalogos?id=eq.{catalogo_id}", datos)
        _invalidar_catalogo(catalogo_id)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/{catalogo_id}")
def eliminar_catalogo(catalogo_id: str):
    """Desactiva el catálogo (soft delete)."""
    try:
        result = supabase_patch(f"catalogos?id=eq.{catalogo_id}", {"activo": False})
        _invalidar_catalogo(catalogo_id)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ── Páginas ──────────────────────────────────────────────────

@router.post("/{catalogo_id}/paginas")
def agregar_pagina(catalogo_id: str, datos: dict):
    """Agrega una página al catálogo. datos debe incluir imagen_url y pagina_numero."""
    try:
        datos["catalogo_id"] = catalogo_id
        result = supabase_post("catalogo_paginas", datos)
        _invalidar_catalogo(catalogo_id)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/{catalogo_id}/paginas/lote")
def agregar_paginas_lote(catalogo_id: str, datos: dict):
    """
    Agrega múltiples páginas de una vez.
    datos = { "paginas": [ { "imagen_url": "...", "pagina_numero": 1 }, ... ] }
    """
    try:
        paginas = datos.get("paginas", [])
        resultados = []
        for p in paginas:
            p["catalogo_id"] = catalogo_id
            resultados.append(supabase_post("catalogo_paginas", p))
        _invalidar_catalogo(catalogo_id)
        return {"ok": True, "agregadas": len(resultados)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/paginas/{pagina_id}")
def actualizar_pagina(pagina_id: str, datos: dict):
    try:
        result = supabase_patch(f"catalogo_paginas?id=eq.{pagina_id}", datos)
        # Invalidamos todas las páginas cacheadas (no sabemos el catalogo_id aquí)
        cache_invalidate_prefix("catalogo_")
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/paginas/{pagina_id}")
def eliminar_pagina(pagina_id: str):
    try:
        result = supabase_delete(f"catalogo_paginas?id=eq.{pagina_id}")
        cache_invalidate_prefix("catalogo_")
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/{catalogo_id}/reordenar")
def reordenar_paginas(catalogo_id: str, datos: dict):
    """
    Reordena páginas en lote.
    datos = { "orden": [ { "id": "uuid", "pagina_numero": 1 }, ... ] }
    """
    try:
        for item in datos.get("orden", []):
            supabase_patch(
                f"catalogo_paginas?id=eq.{item['id']}",
                {"pagina_numero": item["pagina_numero"]}
            )
        _invalidar_catalogo(catalogo_id)
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
