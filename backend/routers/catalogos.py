from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch, supabase_delete

router = APIRouter(prefix="/catalogos", tags=["Catálogos"])


# ── Catálogos ────────────────────────────────────────────────

@router.get("/")
def listar_catalogos():
    """Catálogos activos, ordenados por campo 'orden' y fecha."""
    try:
        return supabase_get("catalogos?activo=eq.true&order=orden.asc,created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/todos")
def listar_todos_catalogos():
    """Todos los catálogos (activos e inactivos) — para el panel."""
    try:
        return supabase_get("catalogos?order=orden.asc,created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/{catalogo_id}")
def obtener_catalogo(catalogo_id: str):
    try:
        return supabase_get(f"catalogos?id=eq.{catalogo_id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/{catalogo_id}/paginas")
def paginas_catalogo(catalogo_id: str):
    """Páginas de un catálogo ordenadas por número de página."""
    try:
        return supabase_get(f"catalogo_paginas?catalogo_id=eq.{catalogo_id}&order=pagina_numero.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/")
def crear_catalogo(datos: dict):
    try:
        return supabase_post("catalogos", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/{catalogo_id}")
def actualizar_catalogo(catalogo_id: str, datos: dict):
    try:
        return supabase_patch(f"catalogos?id=eq.{catalogo_id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/{catalogo_id}")
def eliminar_catalogo(catalogo_id: str):
    """Desactiva el catálogo (soft delete)."""
    try:
        return supabase_patch(f"catalogos?id=eq.{catalogo_id}", {"activo": False})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# ── Páginas ──────────────────────────────────────────────────

@router.post("/{catalogo_id}/paginas")
def agregar_pagina(catalogo_id: str, datos: dict):
    """Agrega una página al catálogo. datos debe incluir imagen_url y pagina_numero."""
    try:
        datos["catalogo_id"] = catalogo_id
        return supabase_post("catalogo_paginas", datos)
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
        return {"ok": True, "agregadas": len(resultados)}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.patch("/paginas/{pagina_id}")
def actualizar_pagina(pagina_id: str, datos: dict):
    try:
        return supabase_patch(f"catalogo_paginas?id=eq.{pagina_id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.delete("/paginas/{pagina_id}")
def eliminar_pagina(pagina_id: str):
    try:
        return supabase_delete(f"catalogo_paginas?id=eq.{pagina_id}")
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
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
