from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])

@router.get("/")
def listar_movimientos():
    try:
        return supabase_get("movimientos_inventario?order=created_at.desc&select=*,variantes(*,productos(nombre)),sucursales(nombre)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/ajuste")
def ajuste_inventario(datos: dict):
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

        return {"ok": True, "cantidad_anterior": cantidad_anterior, "cantidad_nueva": cantidad_nueva}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/entrada")
def entrada_mercancia(datos: dict):
    try:
        variante_id = datos.get("variante_id")
        sucursal_id = datos.get("sucursal_id")
        cantidad = datos.get("cantidad")
        motivo = datos.get("motivo", "Entrada de mercancia")

        inv_actual = supabase_get(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}")
        cantidad_anterior = inv_actual[0]["cantidad"] if inv_actual else 0
        cantidad_nueva = cantidad_anterior + cantidad

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
            "tipo": "entrada",
            "variante_id": variante_id,
            "sucursal_id": sucursal_id,
            "cantidad": cantidad,
            "cantidad_anterior": cantidad_anterior,
            "motivo": motivo
        })

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
def registrar_cambio(datos: dict):
    try:
        variante_origen_id = datos.get("variante_origen_id")
        variante_destino_id = datos.get("variante_destino_id")
        sucursal_id = datos.get("sucursal_id")
        motivo = datos.get("motivo", "Cambio de cliente")

        inv_origen = supabase_get(f"inventario?variante_id=eq.{variante_origen_id}&sucursal_id=eq.{sucursal_id}")
        if inv_origen:
            cantidad_origen = inv_origen[0]["cantidad"]
            supabase_patch(
                f"inventario?variante_id=eq.{variante_origen_id}&sucursal_id=eq.{sucursal_id}",
                {"cantidad": cantidad_origen + 1}
            )

        inv_destino = supabase_get(f"inventario?variante_id=eq.{variante_destino_id}&sucursal_id=eq.{sucursal_id}")
        if inv_destino:
            cantidad_destino = inv_destino[0]["cantidad"]
            if cantidad_destino > 0:
                supabase_patch(
                    f"inventario?variante_id=eq.{variante_destino_id}&sucursal_id=eq.{sucursal_id}",
                    {"cantidad": cantidad_destino - 1}
                )

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

        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})