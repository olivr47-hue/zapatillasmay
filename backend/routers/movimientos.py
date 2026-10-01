from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, inventario_ajustar
from cache import cache_invalidate_prefix
from security import require_staff

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])

@router.get("/")
def listar_movimientos(desde: str = None, hasta: str = None, _staff=Depends(require_staff)):
    """Sin desde/hasta trae TODA la tabla (13,000+ filas y creciendo) -- el
    panel siempre manda un rango (30 días por default) para no tener que
    paginar y renderizar todo el historial en cada carga."""
    try:
        filtro = "movimientos_inventario?order=created_at.desc&select=*,variantes(*,productos(nombre)),sucursales(nombre)"
        if desde:
            filtro += f"&created_at=gte.{desde}T00:00:00"
        if hasta:
            filtro += f"&created_at=lte.{hasta}T23:59:59"
        return supabase_get_all(filtro)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ajuste")
def ajuste_inventario(datos: dict, _staff=Depends(require_staff)):
    try:
        variante_id = datos.get("variante_id")
        sucursal_id = datos.get("sucursal_id")
        cantidad_nueva = datos.get("cantidad")
        motivo = datos.get("motivo", "Ajuste manual")
        usuario = datos.get("usuario", "Admin")

        inv_actual = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
        cantidad_anterior = inv_actual[0]["cantidad"] if inv_actual else 0

        if inv_actual:
            supabase_patch(
                f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
                {"cantidad": cantidad_nueva}
            )
        else:
            supabase_post("inventario", {
                "variante_id": variante_id,
                "sucursal_id": sucursal_id,
                "cantidad": cantidad_nueva,
                "stock_minimo": 3
            })

        supabase_post("movimientos_inventario", {
            "tipo": "ajuste",
            "variante_id": variante_id,
            "sucursal_id": sucursal_id,
            "cantidad": cantidad_nueva - cantidad_anterior,
            "cantidad_anterior": cantidad_anterior,
            "motivo": motivo,
            "usuario": usuario
        })

        cache_invalidate_prefix("inventario")
        return {"ok": True, "cantidad_anterior": cantidad_anterior, "cantidad_nueva": cantidad_nueva}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/entrada")
def entrada_mercancia(datos: dict, _staff=Depends(require_staff)):
    try:
        variante_id = datos.get("variante_id")
        sucursal_id = datos.get("sucursal_id")
        cantidad = datos.get("cantidad")
        motivo = datos.get("motivo", "Entrada de mercancia")

        # entrada ATÓMICA (crea la fila si no existía)
        _aj = inventario_ajustar(variante_id, sucursal_id, int(cantidad), crear=True)
        cantidad_anterior = _aj["anterior"] if _aj else 0
        cantidad_nueva = _aj["nueva"] if _aj else int(cantidad)

        supabase_post("movimientos_inventario", {
            "tipo": "entrada",
            "variante_id": variante_id,
            "sucursal_id": sucursal_id,
            "cantidad": cantidad,
            "cantidad_anterior": cantidad_anterior,
            "motivo": motivo
        })

        cache_invalidate_prefix("inventario")
        return {"ok": True, "cantidad_anterior": cantidad_anterior, "cantidad_nueva": cantidad_nueva}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/cambios")
def listar_cambios():
    try:
        return supabase_get("cambios_producto?order=created_at.desc&select=*,variantes_origen:variante_origen_id(*,productos(nombre)),variantes_destino:variante_destino_id(*,productos(nombre)),sucursales(nombre)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/cambio")
def registrar_cambio(datos: dict, _staff=Depends(require_staff)):
    try:
        variante_origen_id = datos.get("variante_origen_id")
        variante_destino_id = datos.get("variante_destino_id")
        sucursal_id = datos.get("sucursal_id")
        motivo = datos.get("motivo", "Cambio de cliente")

        # +1 al par que regresa, -1 al que se lleva (atómico; el destino nunca baja de 0)
        inventario_ajustar(variante_origen_id, sucursal_id, 1)
        inventario_ajustar(variante_destino_id, sucursal_id, -1)

        supabase_post("cambios_producto", {
            "variante_origen_id": variante_origen_id,
            "variante_destino_id": variante_destino_id,
            "sucursal_id": sucursal_id,
            "motivo": motivo
        })

        supabase_post("movimientos_inventario", {
            "tipo": "cambio_salida",
            "variante_id": variante_destino_id,
            "sucursal_id": sucursal_id,
            "cantidad": -1,
            "motivo": motivo
        })

        supabase_post("movimientos_inventario", {
            "tipo": "cambio_entrada",
            "variante_id": variante_origen_id,
            "sucursal_id": sucursal_id,
            "cantidad": 1,
            "motivo": motivo
        })

        cache_invalidate_prefix("inventario")
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/traspaso")
def registrar_traspaso(datos: dict, _staff=Depends(require_staff)):
    try:
        variante_id = datos.get("variante_id")
        sucursal_origen_id = datos.get("sucursal_origen_id")
        sucursal_destino_id = datos.get("sucursal_destino_id")
        cantidad = datos.get("cantidad")
        motivo = "Traspaso entre sucursales"

        if sucursal_origen_id == sucursal_destino_id:
            return JSONResponse(status_code=400, content={"error": "La sucursal origen y destino no pueden ser la misma"})

        # Salida atómica del origen; si no había suficiente (otra venta se adelantó), se revierte lo tomado.
        _sal = inventario_ajustar(variante_id, sucursal_origen_id, -int(cantidad))
        if not _sal or (_sal["anterior"] - _sal["nueva"]) < int(cantidad):
            if _sal and _sal["anterior"] > _sal["nueva"]:
                inventario_ajustar(variante_id, sucursal_origen_id, _sal["anterior"] - _sal["nueva"])
            return JSONResponse(status_code=400, content={"error": "No hay suficiente inventario en la sucursal origen"})
        inventario_ajustar(variante_id, sucursal_destino_id, int(cantidad), crear=True)

        supabase_post("movimientos_inventario", {
            "tipo": "traspaso_salida",
            "variante_id": variante_id,
            "sucursal_id": sucursal_origen_id,
            "cantidad": -cantidad,
            "motivo": motivo
        })

        supabase_post("movimientos_inventario", {
            "tipo": "traspaso_entrada",
            "variante_id": variante_id,
            "sucursal_id": sucursal_destino_id,
            "cantidad": cantidad,
            "motivo": motivo
        })

        cache_invalidate_prefix("inventario")
        return {"ok": True, "cantidad_movida": cantidad}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})