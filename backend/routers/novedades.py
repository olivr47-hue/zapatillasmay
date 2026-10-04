"""Novedades por WhatsApp Business, de pocas en pocas.

MODO MANUAL (el que usa el panel): NO manda nada por la API de pago. Solo lleva la cuenta de a quién ya se le avisó y propone
las siguientes 5 clientas; la persona comparte las fotos desde su propia app de WhatsApp Business (gratis) y marca el lote como
enviado. (El modo "api" de abajo, con envío automático por la API oficial, queda sin usar en el panel.)

Se eligen modelos (como en "Anunciar modelos" de Productos) y un grupo de clientes; el sistema NO manda a todas de golpe:
envía por LOTES chicos (5 por default, máximo 10), ya sea cuando la persona toca "Enviar siguientes 5" o solo, cada cierto
tiempo y dentro de un horario (9:00 a 21:00, hora de México).

A cada clienta se le manda de la forma que WhatsApp permite:
  - Si ella escribió en las últimas 24 h  -> texto + una foto por modelo (con nombre, precio y link).
  - Si NO                                 -> la plantilla aprobada por Meta "novedades_modelos" (texto + botón al sitio).
"""
import re
import time
import datetime as _dt
import threading
import urllib.parse

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, supabase_delete
from security import require_staff
from telefonos import a_e164_mx

router = APIRouter(prefix="/novedades", tags=["Novedades WhatsApp"])

_TZ_MX = _dt.timezone(_dt.timedelta(hours=-6))
_UUID = re.compile(r"^[0-9a-fA-F-]{36}$")
_LOCK = threading.Lock()
_MAX_LOTE = 10
_MAX_CLIENTES = 500
_PLANTILLA = "novedades_modelos"
_ENTRANTES = "texto,imagen,audio,documento,video,button_reply,list_reply,sticker,ubicacion,interactive,pendiente"


def _precio_web(p: dict) -> float:
    """Mismo precio que ve la clienta en la tienda: precio del panel + $80, salvo ofertas."""
    try:
        return float(p.get("precio_menudeo") or 0) + (0 if p.get("es_oferta") else 80)
    except (TypeError, ValueError):
        return 0.0


def _resolver_modelos(items: list) -> list:
    """items = [{producto_id, color}] -> [{nombre, color, imagen, precio, url}] con la foto del color si la hay."""
    salida = []
    for it in items[:6]:
        pid = str(it.get("producto_id") or "")
        if not _UUID.match(pid):
            continue
        pr = (supabase_get(f"productos?id=eq.{pid}&select=id,nombre,slug,sku_interno,imagen_principal,precio_menudeo,es_oferta") or [None])[0]
        if not pr:
            continue
        color = str(it.get("color") or "").strip()
        imagen = pr.get("imagen_principal") or ""
        if color and color != "default":
            v = supabase_get(f"variantes?producto_id=eq.{pid}&color=eq.{urllib.parse.quote(color, safe='')}&select=foto_url&limit=1") or []
            if v and v[0].get("foto_url"):
                imagen = v[0]["foto_url"]
        slug = (pr.get("slug") or pr.get("sku_interno") or "").strip()
        salida.append({
            "producto_id": pid, "nombre": pr.get("nombre") or "", "color": "" if color == "default" else color, "imagen": imagen,
            "precio": round(_precio_web(pr)), "url": f"https://zapatillasmay.mx/producto/{slug}" if slug else "https://zapatillasmay.mx",
        })
    return salida


def _ventana_abierta(telefono_e164: str) -> bool:
    """¿La clienta escribió en las últimas 24 h? (solo entonces WhatsApp deja mandarle texto/fotos libres)."""
    tel10 = telefono_e164[-10:]
    try:
        filas = supabase_get(
            f"conversaciones_whatsapp?telefono=in.(52{tel10},521{tel10})&tipo=in.({_ENTRANTES})&order=created_at.desc&limit=1&select=created_at"
        ) or []
        if not filas:
            return False
        ult = _dt.datetime.fromisoformat(str(filas[0]["created_at"]).replace("Z", "+00:00"))
        if ult.tzinfo is None:
            ult = ult.replace(tzinfo=_dt.timezone.utc)
        return (_dt.datetime.now(_dt.timezone.utc) - ult) < _dt.timedelta(hours=23, minutes=30)
    except Exception as e:
        print(f"[novedades] no se pudo revisar la ventana de 24 h: {e}")
        return False


def _enviar_a_cliente(env: dict, nov: dict) -> tuple:
    """Devuelve (ok, via, error). Intenta fotos si la ventana está abierta; si no, plantilla."""
    from routers import chatbot as cb
    to = a_e164_mx(env["telefono"])
    nombre = (env.get("nombre") or "").strip()
    primer = (nombre.split() or [""])[0].capitalize() or "Hola"
    modelos = nov.get("modelos") or []
    intro = str(nov.get("mensaje") or "").replace("{nombre}", primer)

    def _log(texto, tipo):
        try:
            supabase_post("conversaciones_whatsapp", {"telefono": to, "mensaje": texto, "respuesta": None, "tipo": tipo, "leido": True})
        except Exception:
            pass

    if _ventana_abierta(to):
        if not cb.enviar_whatsapp_texto(to, intro):
            return False, "fotos", cb._explicar_error_wa()
        for m in modelos[:5]:
            pie = f"*{m['nombre']}*" + (f" · {m['color']}" if m.get("color") else "") + (f"\n${m['precio']:,} MXN" if m.get("precio") else "") + f"\n{m['url']}"
            if m.get("imagen"):
                cb.enviar_whatsapp_imagen(to, m["imagen"], pie)
            else:
                cb.enviar_whatsapp_texto(to, pie)
            time.sleep(0.4)
        _log(f"[Sistema]: Novedades enviadas ({len(modelos)} modelo(s))", "plantilla_saliente")
        return True, "fotos", None

    # Fuera de la ventana de 24 h: plantilla aprobada
    nombres = ", ".join(m["nombre"].split()[0] + (f" {m['color']}" if m.get("color") else "") for m in modelos[:4])
    wamid = cb.enviar_whatsapp_plantilla(to, _PLANTILLA, "es_MX", [primer, nombres or "modelos nuevos"])
    if not wamid:
        err = cb._WA_ULTIMO_ERROR or {}
        if err.get("codigo") in (132001, 132000, 132012, 132015, 132016):
            return False, "plantilla", f"La plantilla '{_PLANTILLA}' aún no está aprobada por Meta (o está pausada)."
        return False, "plantilla", cb._explicar_error_wa()
    _log(f"[Plantilla]: {_PLANTILLA} — novedades ({primer})", "plantilla_saliente")
    return True, "plantilla", None


def procesar_lote(novedad_id: str, respetar_horario: bool = False) -> dict:
    """Envía el siguiente lote de la campaña. Devuelve conteos. Un solo envío a la vez (candado)."""
    if not _LOCK.acquire(blocking=False):
        return {"ok": False, "error": "Ya hay un envío en curso, espera unos segundos."}
    try:
        nov = (supabase_get(f"wa_novedades?id=eq.{novedad_id}") or [None])[0]
        if not nov:
            return {"ok": False, "error": "Campaña no encontrada"}
        if nov.get("estado") != "activa":
            return {"ok": False, "error": f"La campaña está {nov.get('estado')}"}
        if respetar_horario:
            h = _dt.datetime.now(_TZ_MX).hour
            if h < 9 or h >= 21:
                return {"ok": True, "enviados": 0, "fallidos": 0, "omitido": "fuera de horario"}
        lote = max(1, min(int(nov.get("lote") or 5), _MAX_LOTE))
        pend = supabase_get(f"wa_novedades_envios?novedad_id=eq.{novedad_id}&estado=eq.pendiente&order=created_at.asc&limit={lote}") or []
        ok_n = mal_n = 0
        for env in pend:
            try:
                ok, via, err = _enviar_a_cliente(env, nov)
            except Exception as e:
                ok, via, err = False, None, str(e)[:200]
            supabase_patch(f"wa_novedades_envios?id=eq.{env['id']}", {
                "estado": "enviado" if ok else "fallido", "via": via, "error": (err or None) and str(err)[:300],
                "enviado_at": _dt.datetime.now(_dt.timezone.utc).isoformat() if ok else None,
            })
            ok_n += 1 if ok else 0
            mal_n += 0 if ok else 1
            time.sleep(1.2)
        quedan = supabase_get(f"wa_novedades_envios?novedad_id=eq.{novedad_id}&estado=eq.pendiente&select=id&limit=1") or []
        cambios = {}
        if not quedan:
            cambios["estado"] = "terminada"
        if int(nov.get("intervalo_min") or 0) > 0:
            cambios["proxima_at"] = (_dt.datetime.now(_dt.timezone.utc) + _dt.timedelta(minutes=int(nov["intervalo_min"]))).isoformat()
        if cambios:
            supabase_patch(f"wa_novedades?id=eq.{novedad_id}", cambios)
        return {"ok": True, "enviados": ok_n, "fallidos": mal_n, "terminada": not quedan}
    finally:
        _LOCK.release()


def procesar_automaticas() -> int:
    """La llamada el hilo de main.py cada pocos minutos: manda el siguiente lote de las campañas automáticas que ya toca."""
    ahora = _dt.datetime.now(_dt.timezone.utc).isoformat()
    camps = supabase_get(
        f"wa_novedades?estado=eq.activa&modo=eq.api&intervalo_min=gt.0&or=(proxima_at.is.null,proxima_at.lte.{urllib.parse.quote(ahora, safe='')})&select=id&limit=5"
    ) or []
    n = 0
    for c in camps:
        r = procesar_lote(c["id"], respetar_horario=True)
        n += int(r.get("enviados") or 0)
    return n


def _con_conteos(rows: list) -> list:
    ids = [r["id"] for r in rows]
    cuenta = {}
    if ids:
        for e in supabase_get_all(f"wa_novedades_envios?novedad_id=in.({','.join(ids)})&select=novedad_id,estado") or []:
            c = cuenta.setdefault(e["novedad_id"], {"pendiente": 0, "enviado": 0, "fallido": 0})
            c[e["estado"]] = c.get(e["estado"], 0) + 1
    for r in rows:
        r["conteo"] = cuenta.get(r["id"], {"pendiente": 0, "enviado": 0, "fallido": 0})
    return rows


@router.get("/plantilla/estado")
def estado_plantilla(_staff=Depends(require_staff)):
    """¿Meta ya aprobó la plantilla 'novedades_modelos'? (la necesitan las clientas que no escribieron en 24 h)."""
    try:
        from routers import chatbot as cb
        waba = cb._get_waba_id()
        if not waba:
            return {"estado": "sin_configurar"}
        data = cb._wa_graph(f"{waba}/message_templates?name={_PLANTILLA}&fields=name,status")
        filas = data.get("data", [])
        return {"estado": (filas[0].get("status") if filas else "no_creada")}
    except Exception as e:
        return {"estado": "error", "detalle": str(e)[:200]}


@router.get("/")
def listar(_staff=Depends(require_staff)):
    rows = supabase_get("wa_novedades?order=created_at.desc&limit=20") or []
    return _con_conteos(rows)


@router.get("/{id}")
def detalle(id: str, _staff=Depends(require_staff)):
    if not _UUID.match(id):
        return JSONResponse(status_code=400, content={"error": "Id inválido"})
    nov = (supabase_get(f"wa_novedades?id=eq.{id}") or [None])[0]
    if not nov:
        return JSONResponse(status_code=404, content={"error": "No encontrada"})
    nov = _con_conteos([nov])[0]
    nov["envios"] = supabase_get(f"wa_novedades_envios?novedad_id=eq.{id}&order=created_at.asc&select=id,nombre,telefono,estado,via,error,enviado_at&limit=600") or []
    return nov


@router.post("/manual")
def crear_manual(datos: dict, _staff=Depends(require_staff)):
    """Campaña de seguimiento manual: guarda modelos + clientas en lotes, sin enviar nada."""
    return _crear({**datos, "enviar_ahora": False, "intervalo_min": 0}, _staff, "manual")


@router.post("/{id}/marcar")
def marcar(id: str, datos: dict, _staff=Depends(require_staff)):
    """Marca clientas de la campaña como enviadas/omitidas/pendientes (lo hace la persona tras compartir desde su WhatsApp)."""
    if not _UUID.match(id):
        return JSONResponse(status_code=400, content={"ok": False, "error": "Id inválido"})
    estado = str(datos.get("estado") or "")
    if estado not in ("enviado", "omitido", "pendiente"):
        return JSONResponse(status_code=400, content={"ok": False, "error": "Estado no válido"})
    ids = [str(i) for i in (datos.get("ids") or []) if _UUID.match(str(i))][:50]
    if not ids:
        return JSONResponse(status_code=400, content={"ok": False, "error": "No hay clientas que marcar"})
    cambios = {"estado": estado, "enviado_at": _dt.datetime.now(_dt.timezone.utc).isoformat() if estado == "enviado" else None, "via": "manual"}
    supabase_patch(f"wa_novedades_envios?novedad_id=eq.{id}&id=in.({','.join(ids)})", cambios)
    quedan = supabase_get(f"wa_novedades_envios?novedad_id=eq.{id}&estado=eq.pendiente&select=id&limit=1") or []
    supabase_patch(f"wa_novedades?id=eq.{id}", {"estado": "activa" if quedan else "terminada"})
    return {"ok": True, "quedan": bool(quedan)}


@router.post("/")
def crear(datos: dict, _staff=Depends(require_staff)):
    return _crear(datos, _staff, "api")


def _crear(datos: dict, _staff, modo: str):
    items = [i for i in (datos.get("items") or []) if isinstance(i, dict)]
    ids_cli = [str(i) for i in (datos.get("clientes_ids") or []) if _UUID.match(str(i))]
    mensaje = str(datos.get("mensaje") or "").strip()[:900]
    if not items or not mensaje:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Elige al menos un modelo y escribe el mensaje"})
    if not ids_cli:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Elige a quién se las mandas"})
    if len(ids_cli) > _MAX_CLIENTES:
        return JSONResponse(status_code=400, content={"ok": False, "error": f"Máximo {_MAX_CLIENTES} clientas por campaña"})
    try:
        lote = max(1, min(int(datos.get("lote") or 5), _MAX_LOTE))
        intervalo = max(0, min(int(datos.get("intervalo_min") or 0), 1440))
    except (TypeError, ValueError):
        return JSONResponse(status_code=400, content={"ok": False, "error": "Lote o intervalo inválido"})
    modelos = _resolver_modelos(items)
    if not modelos:
        return JSONResponse(status_code=400, content={"ok": False, "error": "No se encontraron los modelos elegidos"})
    clientes = []
    for i in range(0, len(ids_cli), 40):
        clientes += supabase_get(f"clientes?id=in.({','.join(ids_cli[i:i + 40])})&select=id,nombre,telefono") or []
    vistos, filas, sin_tel = set(), [], 0
    for c in clientes:
        tel = a_e164_mx(c.get("telefono"))
        if len(re.sub(r"\D", "", tel)) < 11:
            sin_tel += 1
            continue
        if tel in vistos:
            continue
        vistos.add(tel)
        filas.append({"cliente_id": c["id"], "telefono": tel, "nombre": c.get("nombre") or ""})
    if not filas:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Ninguna de las clientas elegidas tiene teléfono válido"})
    quien = (_staff or {}).get("nombre") or (_staff or {}).get("email") or "personal"
    nov = supabase_post("wa_novedades", {
        "nombre": str(datos.get("nombre") or "Novedades " + _dt.datetime.now(_TZ_MX).strftime("%d/%m"))[:80],
        "modelos": modelos, "mensaje": mensaje, "lote": lote, "intervalo_min": intervalo, "modo": modo,
        "estado": "activa", "creado_por": str(quien)[:60],
        "proxima_at": (_dt.datetime.now(_dt.timezone.utc) + _dt.timedelta(minutes=intervalo)).isoformat() if intervalo else None,
    })
    nov_id = (nov[0] if isinstance(nov, list) else nov)["id"]
    for i in range(0, len(filas), 100):
        supabase_post("wa_novedades_envios", [{**f, "novedad_id": nov_id} for f in filas[i:i + 100]])
    primer = None
    if datos.get("enviar_ahora"):
        primer = procesar_lote(nov_id)
    return {"ok": True, "id": nov_id, "clientas": len(filas), "sin_telefono": sin_tel, "primer_lote": primer}


@router.post("/{id}/enviar-lote")
def enviar_lote(id: str, _staff=Depends(require_staff)):
    if not _UUID.match(id):
        return JSONResponse(status_code=400, content={"ok": False, "error": "Id inválido"})
    cab = (supabase_get(f"wa_novedades?id=eq.{id}&select=modo") or [{}])[0]
    if cab.get("modo") == "manual":
        return JSONResponse(status_code=400, content={"ok": False, "error": "Esta campaña es manual: se comparte desde tu WhatsApp Business."})
    r = procesar_lote(id)
    return r if r.get("ok") else JSONResponse(status_code=409, content=r)


@router.post("/{id}/estado")
def cambiar_estado(id: str, datos: dict, _staff=Depends(require_staff)):
    if not _UUID.match(id):
        return JSONResponse(status_code=400, content={"ok": False, "error": "Id inválido"})
    nuevo = str(datos.get("estado") or "")
    if nuevo not in ("activa", "pausada", "cancelada"):
        return JSONResponse(status_code=400, content={"ok": False, "error": "Estado no válido"})
    supabase_patch(f"wa_novedades?id=eq.{id}", {"estado": nuevo})
    if nuevo == "cancelada":
        supabase_patch(f"wa_novedades_envios?novedad_id=eq.{id}&estado=eq.pendiente", {"estado": "omitido"})
    return {"ok": True}
