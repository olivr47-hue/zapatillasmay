"""
buenfin.py -- Promocion del Buen Fin.

· Los modelos y las fechas se administran desde el panel (se guardan en la tabla `configuracion`, clave `buen_fin`).
· La promocion esta ACTIVA solo si el interruptor esta encendido y la hora actual (horario de Mexico, UTC-6 sin horario de verano)
  cae entre el inicio y el fin.
· En la TIENDA: todos los pares de esos modelos se cobran al precio de 3+ pares desde el primer par.
· En el PORTAL de mayoreo: esos modelos se cobran al precio de corrida, aunque la clienta lleve tallas y colores variados.
"""
import json
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from database import supabase_get, supabase_post, supabase_patch
from security import require_staff
from cache import cache_get, cache_set

router = APIRouter(prefix="/buen-fin", tags=["buen-fin"])

_CLAVE = "buen_fin"
_MX = timezone(timedelta(hours=-6))


def _leer_config() -> dict:
    c = cache_get("buen_fin_config")
    if c is not None:
        return c
    cfg = {"activo": False, "inicio": "", "fin": "", "modelos": []}
    try:
        filas = supabase_get(f"configuracion?clave=eq.{_CLAVE}&select=valor&limit=1") or []
        if filas:
            v = json.loads(filas[0].get("valor") or "{}")
            cfg = {"activo": bool(v.get("activo")), "inicio": str(v.get("inicio") or ""), "fin": str(v.get("fin") or ""),
                   "modelos": [str(x) for x in (v.get("modelos") or [])]}
    except Exception as e:
        print(f"[buen-fin] no se pudo leer la configuracion: {e}")
    cache_set("buen_fin_config", cfg, ttl=30)
    return cfg


def _fecha_mx(s: str):
    """'2026-11-13T00:00' (hora de Mexico) -> datetime con zona; None si viene vacio o mal."""
    try:
        d = datetime.fromisoformat(str(s))
        return d if d.tzinfo else d.replace(tzinfo=_MX)
    except Exception:
        return None


def estado_actual() -> dict:
    """{'activa': bool, 'inicio', 'fin', 'ids': set de ids de producto}. Nunca lanza."""
    cfg = _leer_config()
    ini, fin = _fecha_mx(cfg["inicio"]), _fecha_mx(cfg["fin"])
    ahora = datetime.now(_MX)
    activa = bool(cfg["activo"] and ini and fin and ini <= ahora <= fin and cfg["modelos"])
    return {"activa": activa, "inicio": cfg["inicio"], "fin": cfg["fin"], "ids": set(cfg["modelos"])}


def producto_en_buen_fin(producto_id) -> bool:
    e = estado_actual()
    return bool(e["activa"] and str(producto_id) in e["ids"])


@router.get("/estado")
def buen_fin_estado():
    """PUBLICO. Lo lee la tienda y el portal para saber si la promocion esta activa y que modelos incluye."""
    e = estado_actual()
    return {"activa": e["activa"], "inicio": e["inicio"], "fin": e["fin"], "ids": sorted(e["ids"]) if e["activa"] else []}


@router.get("/config")
def buen_fin_config(_staff=Depends(require_staff)):
    """Para el panel: la configuracion guardada y la lista de modelos disponibles."""
    cfg = _leer_config()
    seleccion = set(cfg["modelos"])
    prods = supabase_get("productos?activo=eq.true&select=id,nombre,sku_interno,categoria,imagen_principal,precio_menudeo,precio_mayoreo3,precio_corrida,es_oferta&order=nombre.asc&limit=2000") or []
    modelos = [{"id": p["id"], "nombre": p.get("nombre"), "sku": p.get("sku_interno"), "categoria": p.get("categoria"), "foto": p.get("imagen_principal"),
                "menudeo": p.get("precio_menudeo"), "mayoreo3": p.get("precio_mayoreo3"), "corrida": p.get("precio_corrida"),
                "seleccionado": p["id"] in seleccion}
               for p in prods if not str(p.get("nombre") or "").lower().startswith("oferta")]
    e = estado_actual()
    return {**cfg, "activa_ahora": e["activa"], "modelos_disponibles": modelos}


@router.put("/config")
def buen_fin_guardar(datos: dict, _staff=Depends(require_staff)):
    activo = bool(datos.get("activo"))
    inicio, fin = str(datos.get("inicio") or "")[:19], str(datos.get("fin") or "")[:19]
    if activo:
        a, b = _fecha_mx(inicio), _fecha_mx(fin)
        if not a or not b or b <= a:
            return JSONResponse(status_code=400, content={"error": "Indica la fecha de inicio y la de fin (el fin debe ser despues del inicio)"})
    modelos = [str(x) for x in (datos.get("modelos") or []) if str(x)][:500]
    valor = json.dumps({"activo": activo, "inicio": inicio, "fin": fin, "modelos": modelos}, separators=(",", ":"))
    existe = supabase_get(f"configuracion?clave=eq.{_CLAVE}&select=clave") or []
    if existe:
        supabase_patch(f"configuracion?clave=eq.{_CLAVE}", {"valor": valor})
    else:
        supabase_post("configuracion", {"clave": _CLAVE, "valor": valor})
    cache_set("buen_fin_config", None, ttl=1)
    e = estado_actual()
    return {"ok": True, "activa_ahora": e["activa"], "modelos": len(modelos)}
