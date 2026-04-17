from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch, supabase_delete

router = APIRouter(prefix="/crm", tags=["CRM"])

# ─── SEGUIMIENTOS ────────────────────────────────
@router.get("/seguimientos/{cliente_id}")
def get_seguimientos(cliente_id: str):
    try:
        return supabase_get(f"crm_seguimientos?cliente_id=eq.{cliente_id}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/seguimientos/pendientes/todos")
def get_pendientes():
    try:
        return supabase_get("crm_seguimientos?completado=eq.false&fecha_recordatorio=not.is.null&order=fecha_recordatorio.asc&select=*,clientes(nombre,telefono)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/seguimientos")
def crear_seguimiento(datos: dict):
    try:
        return supabase_post("crm_seguimientos", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/seguimientos/{id}")
def actualizar_seguimiento(id: str, datos: dict):
    try:
        return supabase_patch(f"crm_seguimientos?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/seguimientos/{id}")
def eliminar_seguimiento(id: str):
    try:
        return supabase_delete(f"crm_seguimientos?id=eq.{id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── ETIQUETAS ────────────────────────────────────
@router.get("/etiquetas/{cliente_id}")
def get_etiquetas(cliente_id: str):
    try:
        return supabase_get(f"crm_etiquetas?cliente_id=eq.{cliente_id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/etiquetas")
def crear_etiqueta(datos: dict):
    try:
        return supabase_post("crm_etiquetas", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/etiquetas/{id}")
def eliminar_etiqueta(id: str):
    try:
        return supabase_delete(f"crm_etiquetas?id=eq.{id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── OPORTUNIDADES ────────────────────────────────
@router.get("/oportunidades")
def get_oportunidades():
    try:
        return supabase_get("crm_oportunidades?order=created_at.desc&select=*,clientes(nombre,telefono)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/oportunidades/{cliente_id}")
def get_oportunidades_cliente(cliente_id: str):
    try:
        return supabase_get(f"crm_oportunidades?cliente_id=eq.{cliente_id}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/oportunidades")
def crear_oportunidad(datos: dict):
    try:
        return supabase_post("crm_oportunidades", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/oportunidades/{id}")
def actualizar_oportunidad(id: str, datos: dict):
    try:
        return supabase_patch(f"crm_oportunidades?id=eq.{id}", datos)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/oportunidades/{id}")
def eliminar_oportunidad(id: str):
    try:
        return supabase_delete(f"crm_oportunidades?id=eq.{id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ─── DASHBOARD CRM ────────────────────────────────
@router.get("/dashboard")
def dashboard_crm():
    try:
        clientes = supabase_get("clientes?select=*")
        pedidos = supabase_get("pedidos?select=*,clientes(nombre)&order=created_at.desc")
        seguimientos = supabase_get("crm_seguimientos?completado=eq.false&fecha_recordatorio=not.is.null&select=*,clientes(nombre,telefono)")
        
        return {
            "total_clientes": len(clientes),
            "pedidos_recientes": pedidos[:10],
            "recordatorios_pendientes": seguimientos,
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})