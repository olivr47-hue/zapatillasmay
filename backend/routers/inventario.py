from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch
from cache import cache_get, cache_set, cache_invalidate_prefix, TTL_STOCK
from security import require_staff

router = APIRouter(prefix="/inventario", tags=["Inventario"])


def _avisar_restock(variante_id: str):
    """Notifica (push) a quienes pidieron aviso de esta variante y marca
    los avisos como enviados. Nunca lanza excepción al caller."""
    try:
        from routers.push import enviar_push
        watchers = supabase_get(f"restock_watchers?variante_id=eq.{variante_id}&notificado=eq.false&select=id,cliente_id")
        if not watchers:
            return
        var = supabase_get(f"variantes?id=eq.{variante_id}&select=talla,color,productos(nombre)")
        nombre_prod = (var[0].get("productos") or {}).get("nombre") if var else "Un modelo"
        detalle = f"{var[0].get('color','')} T{var[0].get('talla','')}".strip() if var else ""
        for w in watchers:
            try:
                enviar_push(
                    "¡Ya volvió el stock! 🎉",
                    f"{nombre_prod} {detalle} ya está disponible otra vez.",
                    url="/", cliente_id=w.get("cliente_id"),
                )
            except Exception:
                pass
            supabase_patch(f"restock_watchers?id=eq.{w['id']}", {"notificado": True, "notificado_at": "now()"})
    except Exception as e:
        print(f"[inventario] Error avisando restock de {variante_id}: {e}")


@router.post("/avisame")
def avisame_stock(datos: dict):
    """Portal mayorista: el cliente pide que le avisen cuando vuelva a haber
    stock de una variante agotada. No duplica si ya tiene un aviso pendiente."""
    variante_id = datos.get("variante_id")
    cliente_id = datos.get("cliente_id")
    if not variante_id or not cliente_id:
        return JSONResponse(status_code=400, content={"error": "Faltan variante_id/cliente_id"})
    try:
        existente = supabase_get(f"restock_watchers?variante_id=eq.{variante_id}&cliente_id=eq.{cliente_id}&notificado=eq.false")
        if existente:
            return {"ok": True, "ya_registrado": True}
        supabase_post("restock_watchers", {"variante_id": variante_id, "cliente_id": cliente_id})
        return {"ok": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

_CK = "inventario"  # prefijo de caché

@router.get("/slim")
def inventario_slim():
    """
    Versión ligera para la tienda pública.
    Solo devuelve variante_id + cantidad. Sin JOINs.
    ~50KB vs ~3-5MB del endpoint completo.
    """
    try:
        cached = cache_get(_CK + "_slim")
        if cached is not None:
            return cached
        data = supabase_get_all("inventario?select=variante_id,cantidad")
        # Si hay múltiples sucursales, sumar el stock de todas para la tienda
        stock: dict = {}
        for row in data:
            vid = row.get("variante_id")
            if vid:
                stock[vid] = stock.get(vid, 0) + (row.get("cantidad") or 0)
        result = [{"variante_id": k, "cantidad": v} for k, v in stock.items()]
        cache_set(_CK + "_slim", result, ttl=TTL_STOCK)
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/alertas")
def alertas_stock_bajo():
    try:
        data = supabase_get_all("inventario?select=*,variantes(*,productos(nombre,sku_interno)),sucursales(nombre)")
        alertas = [i for i in data if i.get("cantidad", 0) <= i.get("stock_minimo", 3)]
        return alertas
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/")
def listar_inventario(fresh: bool = False):
    """fresh=true evita la cache de 10 min — lo usa el POS para no vender
    con stock desactualizado si hubo una venta/ajuste reciente en otro lado."""
    try:
        if not fresh:
            cached = cache_get(_CK + "_all")
            if cached is not None:
                return cached
        data = supabase_get_all("inventario?select=*,variantes(*,productos(nombre,sku_interno,marca)),sucursales(nombre)")
        cache_set(_CK + "_all", data, ttl=TTL_STOCK)
        return data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/sucursal/{sucursal_id}")
def inventario_por_sucursal(sucursal_id: str):
    try:
        return supabase_get_all(f"inventario?sucursal_id=eq.{sucursal_id}&select=*,variantes(*,productos(nombre,sku_interno))")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/producto/{producto_id}")
def inventario_por_producto(producto_id: str):
    try:
        return supabase_get(f"inventario?select=*,variantes(*,productos(*)),sucursales(nombre)")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/")
def agregar_inventario(datos: dict, _staff=Depends(require_staff)):
    try:
        resultado = supabase_post("inventario", datos)
        cache_invalidate_prefix(_CK)
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/actualizar")
def actualizar_inventario(datos: dict, _staff=Depends(require_staff)):
    try:
        variante_id = datos.get("variante_id")
        sucursal_id = datos.get("sucursal_id")
        nueva_cantidad = datos.get("cantidad")

        # Detectar transición 0 -> con stock (sumando TODAS las sucursales, no
        # solo la que se está editando) para avisar a quien pidió restock.
        avisar = False
        if nueva_cantidad and nueva_cantidad > 0:
            try:
                actual = supabase_get(f"inventario?variante_id=eq.{variante_id}&select=sucursal_id,cantidad")
                total_antes = sum((r.get("cantidad") or 0) for r in actual)
                fila_actual = next((r for r in actual if r.get("sucursal_id") == sucursal_id), None)
                cantidad_antes_aqui = fila_actual.get("cantidad", 0) if fila_actual else 0
                total_despues = total_antes - cantidad_antes_aqui + nueva_cantidad
                avisar = total_antes <= 0 and total_despues > 0
            except Exception:
                avisar = False

        resultado = supabase_patch(
            f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{sucursal_id}",
            {"cantidad": nueva_cantidad, "stock_minimo": datos.get("stock_minimo", 3)}
        )
        cache_invalidate_prefix(_CK)
        if avisar:
            _avisar_restock(variante_id)
        return resultado
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
