"""
conteo.py -- Conteo fisico de inventario, pensado para hacerse desde el celular.

Se cuenta POR MODELO: se elige el modelo y se va sumando de uno en uno cada talla que aparece (estanteria, amarres, etc.), sin ir talla por talla
por todo el almacen. Lo contado se guarda en el servidor (varias personas pueden ayudar, o seguir despues). Al terminar se REVISA contra el ERP y se
aplican los ajustes, que quedan en el historial de movimientos con el motivo «Conteo fisico» y quien los hizo.
"""
import urllib.parse

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from cache import cache_invalidate_prefix
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_rpc, inventario_ajustar
from security import require_staff

router = APIRouter(prefix="/conteo", tags=["Conteo"])

UBICACIONES = ("estanteria", "amarres", "otro")


def _usuario(staff) -> str:
    if isinstance(staff, dict):
        n = staff.get("nombre") or staff.get("email")
        if n:
            return str(n)[:60]
    return "Personal"


def _talla_num(t):
    try:
        return float(str(t).replace("_", ".").replace(",", "."))
    except (TypeError, ValueError):
        return 999.0


@router.get("/buscar")
def conteo_buscar(q: str = "", _staff=Depends(require_staff)):
    """Modelos activos que coinciden con el texto (nombre o SKU) y los conteos que ya estan en curso."""
    q = (q or "").strip()
    abiertos = supabase_get("conteos?estado=eq.abierto&select=id,producto_id,creado_por,created_at&order=created_at.desc&limit=30") or []
    abiertos_por_prod = {a["producto_id"]: a for a in abiertos}
    ids_abiertos = list(abiertos_por_prod.keys())
    productos = []
    if len(q) >= 2:
        like = urllib.parse.quote(f"*{q}*", safe="*")
        productos = supabase_get(
            f"productos?activo=eq.true&or=(nombre.ilike.{like},sku_interno.ilike.{like})&select=id,nombre,sku_interno,imagen_principal&order=nombre.asc&limit=25") or []
    en_curso = []
    if ids_abiertos:
        en_curso = supabase_get(f"productos?id=in.({','.join(ids_abiertos)})&select=id,nombre,sku_interno,imagen_principal") or []
    for p in productos + en_curso:
        a = abiertos_por_prod.get(p["id"])
        p["conteo_id"] = a["id"] if a else None
        p["conteo_por"] = a.get("creado_por") if a else None
    return {"resultados": productos, "en_curso": en_curso}


@router.post("/iniciar")
def conteo_iniciar(datos: dict, _staff=Depends(require_staff)):
    """Abre el conteo de un modelo (o devuelve el que ya esta abierto: dos personas pueden contar el mismo modelo y se suman)."""
    pid = str(datos.get("producto_id") or "").strip()
    if not pid:
        return JSONResponse(status_code=400, content={"error": "Falta el modelo"})
    existente = supabase_get(f"conteos?producto_id=eq.{pid}&estado=eq.abierto&select=id&limit=1") or []
    if existente:
        return {"id": existente[0]["id"], "nuevo": False}
    try:
        nuevo = supabase_post("conteos", {"producto_id": pid, "creado_por": _usuario(_staff)})
    except Exception:
        nuevo = None   # lo mas probable: otra persona abrio el mismo modelo justo antes (indice unico)
    fila = (nuevo[0] if isinstance(nuevo, list) and nuevo else nuevo) or {}
    if not isinstance(fila, dict):
        fila = {}
    if not fila.get("id"):
        # una carrera: otra persona lo abrio justo antes
        existente = supabase_get(f"conteos?producto_id=eq.{pid}&estado=eq.abierto&select=id&limit=1") or []
        if existente:
            return {"id": existente[0]["id"], "nuevo": False}
        return JSONResponse(status_code=500, content={"error": "No se pudo abrir el conteo"})
    return {"id": fila["id"], "nuevo": True}


def _cargar(conteo_id: str):
    c = (supabase_get(f"conteos?id=eq.{conteo_id}&select=*&limit=1") or [None])[0]
    if not c:
        return None
    prod = (supabase_get(f"productos?id=eq.{c['producto_id']}&select=id,nombre,sku_interno,imagen_principal&limit=1") or [None])[0] or {}
    variantes = supabase_get(f"variantes?producto_id=eq.{c['producto_id']}&activa=eq.true&select=id,color,talla,foto_url") or []
    ids = [v["id"] for v in variantes]
    erp, contado = {}, {}
    if ids:
        for r in supabase_get_all(f"inventario?variante_id=in.({','.join(ids)})&select=variante_id,cantidad") or []:
            erp[r["variante_id"]] = erp.get(r["variante_id"], 0) + int(r.get("cantidad") or 0)
        for l in supabase_get_all(f"conteo_lineas?conteo_id=eq.{conteo_id}&select=variante_id,ubicacion,cantidad") or []:
            contado.setdefault(l["variante_id"], {})[l["ubicacion"]] = int(l.get("cantidad") or 0)
    filas = []
    for v in variantes:
        ub = contado.get(v["id"])
        filas.append({"id": v["id"], "color": v.get("color") or "", "talla": str(v.get("talla") or ""), "erp": erp.get(v["id"], 0),
                      "tocada": ub is not None, "contado": ub or {}, "total": sum((ub or {}).values())})
    filas.sort(key=lambda f: (f["color"].lower(), _talla_num(f["talla"])))
    return {"conteo": {"id": c["id"], "estado": c["estado"], "creado_por": c.get("creado_por"), "created_at": c.get("created_at")},
            "producto": prod, "variantes": filas, "ubicaciones": list(UBICACIONES)}


@router.get("/{conteo_id}")
def conteo_ver(conteo_id: str, _staff=Depends(require_staff)):
    d = _cargar(conteo_id)
    if not d:
        return JSONResponse(status_code=404, content={"error": "Conteo no encontrado"})
    return d


@router.post("/{conteo_id}/sumar")
def conteo_sumar(conteo_id: str, datos: dict, _staff=Depends(require_staff)):
    """Suma (o resta) pares de UNA talla/color en una ubicacion. Atomico: varias personas pueden contar a la vez."""
    vid = str(datos.get("variante_id") or "").strip()
    ub = str(datos.get("ubicacion") or "estanteria").strip().lower()
    try:
        delta = int(datos.get("delta", 1))
    except (TypeError, ValueError):
        delta = 0
    if ub not in UBICACIONES or not vid or delta == 0 or abs(delta) > 50:
        return JSONResponse(status_code=400, content={"error": "Datos invalidos"})
    c = (supabase_get(f"conteos?id=eq.{conteo_id}&select=id,estado,producto_id&limit=1") or [None])[0]
    if not c:
        return JSONResponse(status_code=404, content={"error": "Conteo no encontrado"})
    if c["estado"] != "abierto":
        return JSONResponse(status_code=409, content={"error": "Este conteo ya se cerro"})
    ok = supabase_get(f"variantes?id=eq.{vid}&producto_id=eq.{c['producto_id']}&select=id&limit=1") or []
    if not ok:
        return JSONResponse(status_code=400, content={"error": "Esa talla no es de este modelo"})
    nueva = supabase_rpc("conteo_sumar", {"p_conteo": conteo_id, "p_variante": vid, "p_ubicacion": ub, "p_delta": delta})
    lineas = supabase_get(f"conteo_lineas?conteo_id=eq.{conteo_id}&variante_id=eq.{vid}&select=ubicacion,cantidad") or []
    return {"ok": True, "ubicacion": ub, "cantidad": nueva, "total": sum(int(l.get("cantidad") or 0) for l in lineas)}


def _plan(d: dict, sin_contar: str) -> list:
    """Cambios que se harian: [{id, color, talla, erp, nuevo, dif}] solo donde el nuevo valor difiere del ERP.
    Las tallas que no se tocaron se dejan igual, salvo que se pida ponerlas en 0."""
    cambios = []
    for v in d["variantes"]:
        if v["tocada"]:
            nuevo = v["total"]
        elif sin_contar == "cero":
            nuevo = 0
        else:
            continue
        if nuevo != v["erp"]:
            cambios.append({"id": v["id"], "color": v["color"], "talla": v["talla"], "erp": v["erp"], "nuevo": nuevo, "dif": nuevo - v["erp"]})
    return cambios


@router.post("/{conteo_id}/aplicar")
def conteo_aplicar(conteo_id: str, datos: dict, _staff=Depends(require_staff)):
    """Aplica el conteo al inventario. Sin confirmar=true solo muestra los cambios. Las tallas sin contar se quedan igual (sin_contar='igual')
    o se ponen en 0 (sin_contar='cero')."""
    d = _cargar(conteo_id)
    if not d:
        return JSONResponse(status_code=404, content={"error": "Conteo no encontrado"})
    if d["conteo"]["estado"] != "abierto":
        return JSONResponse(status_code=409, content={"error": "Este conteo ya se cerro"})
    sin_contar = "cero" if str(datos.get("sin_contar") or "igual").lower() == "cero" else "igual"
    cambios = _plan(d, sin_contar)
    resumen = {"sin_contar": sin_contar, "tallas_cambian": len(cambios), "pares_mas": sum(c["dif"] for c in cambios if c["dif"] > 0),
               "pares_menos": -sum(c["dif"] for c in cambios if c["dif"] < 0), "sin_tocar": sum(1 for v in d["variantes"] if not v["tocada"])}
    if not datos.get("confirmar"):
        return {"hecho": False, "resumen": resumen, "cambios": cambios}
    # sucursal: la de su fila de inventario, o la primera sucursal
    suc_default = (supabase_get("sucursales?select=id&limit=1") or [{}])[0].get("id")
    quien = _usuario(_staff)
    aplicados, errores = 0, []
    for c in cambios:
        try:
            fila = (supabase_get(f"inventario?variante_id=eq.{c['id']}&select=sucursal_id,cantidad&order=cantidad.desc&limit=1") or [None])[0]
            suc = (fila or {}).get("sucursal_id") or suc_default
            if not suc:
                errores.append(f"{c['color']} T{c['talla']}: sin sucursal")
                continue
            # el delta se calcula contra el valor de AHORA (por si hubo una venta mientras se contaba)
            actual = int((fila or {}).get("cantidad") or 0)
            delta = c["nuevo"] - actual
            if delta == 0:
                continue
            r = inventario_ajustar(c["id"], suc, delta, crear=True)
            supabase_post("movimientos_inventario", {
                "tipo": "ajuste", "variante_id": c["id"], "sucursal_id": suc, "cantidad": delta,
                "cantidad_anterior": (r or {}).get("anterior", actual), "motivo": f"Conteo fisico {conteo_id[:8]}",
                "referencia": conteo_id, "usuario": quien})
            aplicados += 1
        except Exception as e:
            errores.append(f"{c['color']} T{c['talla']}: {str(e)[:80]}")
    import datetime as _dt
    resumen["aplicados"] = aplicados
    resumen["errores"] = errores
    supabase_patch(f"conteos?id=eq.{conteo_id}", {"estado": "aplicado", "aplicado_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
                                                   "aplicado_por": quien, "resumen": resumen})
    cache_invalidate_prefix("inventario")
    return {"hecho": True, "resumen": resumen}


@router.post("/{conteo_id}/cancelar")
def conteo_cancelar(conteo_id: str, _staff=Depends(require_staff)):
    c = (supabase_get(f"conteos?id=eq.{conteo_id}&select=id,estado&limit=1") or [None])[0]
    if not c:
        return JSONResponse(status_code=404, content={"error": "Conteo no encontrado"})
    if c["estado"] != "abierto":
        return JSONResponse(status_code=409, content={"error": "Este conteo ya se cerro"})
    supabase_patch(f"conteos?id=eq.{conteo_id}", {"estado": "cancelado"})
    return {"ok": True}
