from fastapi import APIRouter, BackgroundTasks
import os, time, uuid, json, urllib.request

router = APIRouter(tags=["Campanas"])

_jobs = {}

EVOLUTION_URL      = os.environ.get("EVOLUTION_URL", "https://evolution-api-production-fd49.up.railway.app")
EVOLUTION_INSTANCE = os.environ.get("EVOLUTION_INSTANCE", "zapatillasmay")
EVOLUTION_APIKEY   = os.environ.get("EVOLUTION_APIKEY", "")

# Bridge local (PC del negocio con ngrok) — tiene prioridad si está configurado
WA_BRIDGE_URL = os.environ.get("WA_BRIDGE_URL", "").rstrip("/")


def _enviar_wa_texto(to, texto):
    # Usar bridge ngrok si está configurado
    if WA_BRIDGE_URL:
        url = f"{WA_BRIDGE_URL}/send-text"
        body = json.dumps({"phone": to, "message": texto}).encode("utf-8")
        req = urllib.request.Request(url, data=body,
            headers={"Content-Type": "application/json"}, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=15):
                return True, ""
        except urllib.error.HTTPError as e:
            return False, e.read().decode()
        except Exception as e:
            return False, str(e)
    # Fallback: Evolution API
    url = f"{EVOLUTION_URL}/message/sendText/{EVOLUTION_INSTANCE}"
    body = json.dumps({"number": to, "text": texto}).encode("utf-8")
    req = urllib.request.Request(url, data=body,
        headers={"apikey": EVOLUTION_APIKEY, "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15):
            return True, ""
    except urllib.error.HTTPError as e:
        return False, e.read().decode()
    except Exception as e:
        return False, str(e)


def _enviar_wa_imagen(to, img_url, caption=""):
    # Usar bridge ngrok si está configurado
    if WA_BRIDGE_URL:
        url = f"{WA_BRIDGE_URL}/send-image"
        body = json.dumps({"phone": to, "imageUrl": img_url, "caption": caption}).encode("utf-8")
        req = urllib.request.Request(url, data=body,
            headers={"Content-Type": "application/json"}, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=20):
                return True, ""
        except urllib.error.HTTPError as e:
            return False, e.read().decode()
        except Exception as e:
            return False, str(e)
    # Fallback: Evolution API
    url = f"{EVOLUTION_URL}/message/sendMedia/{EVOLUTION_INSTANCE}"
    body = json.dumps({
        "number": to, "mediatype": "image",
        "mimetype": "image/jpeg", "media": img_url, "caption": caption
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body,
        headers={"apikey": EVOLUTION_APIKEY, "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=20):
            return True, ""
    except urllib.error.HTTPError as e:
        return False, e.read().decode()
    except Exception as e:
        return False, str(e)


def _normalizar_tel(telefono):
    t = str(telefono).replace(" ", "").replace("+", "").replace("-", "").replace("(", "").replace(")", "")
    if not t.startswith("52"):
        t = "52" + t
    return t


def _procesar_campana(job_id: str, destinatarios: list, fotos_urls: list, imagen_url: str, delay: float, fotos_con_caption: list = None):
    """
    fotos_con_caption: lista de {url, caption} — se envía cada foto con su propio caption.
    Si se pasa, tiene prioridad sobre fotos_urls.
    """
    job = _jobs[job_id]
    total = len(destinatarios)

    for i, dest in enumerate(destinatarios):
        if job.get("cancelado"):
            job["terminado"] = True
            job["estado"] = "cancelado"
            return

        nombre = dest.get("nombre", "Cliente")
        tel = _normalizar_tel(dest.get("telefono", ""))
        msg = dest.get("mensaje", "").strip()

        ok, err = True, ""

        if fotos_con_caption:
            # Cada foto va con su propio caption (color)
            # El mensaje de texto va primero, luego las fotos
            ok, err = _enviar_wa_texto(tel, msg)
            for foto_item in fotos_con_caption:
                if job.get("cancelado"):
                    break
                time.sleep(1.2)
                _enviar_wa_imagen(tel, foto_item["url"], foto_item.get("caption", ""))
        elif fotos_urls:
            # Backward compat: primera foto con mensaje, resto sin caption
            ok, err = _enviar_wa_imagen(tel, fotos_urls[0], msg)
            for foto in fotos_urls[1:]:
                if not job.get("cancelado"):
                    time.sleep(1.5)
                    _enviar_wa_imagen(tel, foto, "")
        elif imagen_url:
            ok, err = _enviar_wa_imagen(tel, imagen_url, msg)
        else:
            ok, err = _enviar_wa_texto(tel, msg)

        job["progreso"] = i + 1
        job["resultados"].append({"nombre": nombre, "telefono": tel, "ok": ok, "error": err})
        job["enviados"] += (1 if ok else 0)
        job["fallidos"] += (0 if ok else 1)

        if i < total - 1 and not job.get("cancelado"):
            time.sleep(delay)

    job["terminado"] = True
    job["estado"] = "completado"


@router.post("/campanas/enviar")
async def enviar_campana(datos: dict, background_tasks: BackgroundTasks):
    destinatarios     = datos.get("destinatarios", [])
    fotos_urls        = [u for u in (datos.get("fotos_urls") or []) if u]
    fotos_con_caption = datos.get("fotos_con_caption") or None  # [{url, caption}]
    imagen_url        = (datos.get("imagen_url") or "").strip()
    delay             = float(datos.get("delay_segundos", 4))

    if not destinatarios:
        return {"error": "No hay destinatarios"}

    job_id = str(uuid.uuid4())[:8]
    _jobs[job_id] = {
        "total": len(destinatarios), "progreso": 0,
        "enviados": 0, "fallidos": 0, "resultados": [],
        "terminado": False, "cancelado": False, "estado": "enviando"
    }

    background_tasks.add_task(_procesar_campana, job_id, destinatarios, fotos_urls, imagen_url, delay, fotos_con_caption)
    return {"job_id": job_id, "total": len(destinatarios)}


@router.get("/campanas/estado/{job_id}")
def estado_campana(job_id: str):
    job = _jobs.get(job_id)
    if not job:
        return {"error": "Campaña no encontrada"}
    return job


@router.post("/campanas/cancelar/{job_id}")
def cancelar_campana(job_id: str):
    job = _jobs.get(job_id)
    if not job:
        return {"error": "Campaña no encontrada"}
    job["cancelado"] = True
    return {"ok": True}


@router.get("/campanas/wa-estado")
def wa_estado():
    """Estado de conexión de la instancia Evolution API."""
    url = f"{EVOLUTION_URL}/instance/connectionState/{EVOLUTION_INSTANCE}"
    try:
        req = urllib.request.Request(url, headers={"apikey": EVOLUTION_APIKEY})
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read())
        state = data.get("instance", {}).get("state") or data.get("state", "close")
        return {"estado": state, "conectado": state == "open"}
    except Exception as e:
        return {"estado": "error", "conectado": False, "detalle": str(e)}


@router.get("/campanas/wa-qr")
def wa_qr():
    """Obtiene el QR para conectar WhatsApp Business."""
    url = f"{EVOLUTION_URL}/instance/connect/{EVOLUTION_INSTANCE}"
    try:
        req = urllib.request.Request(url, headers={"apikey": EVOLUTION_APIKEY})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        # Evolution API puede devolver el QR como 'base64' o dentro de 'qrcode'
        qr = data.get("base64") or data.get("qrcode", {}).get("base64") or data.get("code")
        return {"qr": qr, "raw": data}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return {"error": body}
    except Exception as e:
        return {"error": str(e)}


@router.post("/campanas/wa-desconectar")
def wa_desconectar():
    """Cierra la sesión de WhatsApp Business."""
    headers = {"apikey": EVOLUTION_APIKEY, "Content-Type": "application/json"}
    errores = []
    # Intentar logout
    for method in ["DELETE", "POST"]:
        try:
            url = f"{EVOLUTION_URL}/instance/logout/{EVOLUTION_INSTANCE}"
            req = urllib.request.Request(url, data=b"{}" if method=="POST" else None,
                                         headers=headers, method=method)
            with urllib.request.urlopen(req, timeout=8) as r:
                r.read()
            return {"ok": True}
        except Exception as e:
            errores.append(str(e))
    return {"error": " | ".join(errores)}


@router.post("/campanas/wa-reiniciar")
def wa_reiniciar():
    """Fuerza el reinicio de la sesión para poder reconectar con QR."""
    headers = {"apikey": EVOLUTION_APIKEY, "Content-Type": "application/json"}
    resultados = {}

    # 1. Intentar logout (ignorar error)
    for method in ["DELETE", "POST"]:
        try:
            url = f"{EVOLUTION_URL}/instance/logout/{EVOLUTION_INSTANCE}"
            req = urllib.request.Request(url, data=b"{}" if method=="POST" else None,
                                         headers=headers, method=method)
            with urllib.request.urlopen(req, timeout=6) as r:
                resultados["logout"] = r.read().decode()
            break
        except Exception as e:
            resultados["logout_err"] = str(e)

    # 2. Intentar restart
    try:
        url = f"{EVOLUTION_URL}/instance/restart/{EVOLUTION_INSTANCE}"
        req = urllib.request.Request(url, data=b"{}", headers=headers, method="PUT")
        with urllib.request.urlopen(req, timeout=8) as r:
            resultados["restart"] = r.read().decode()
    except Exception as e:
        resultados["restart_err"] = str(e)

    # 3. Obtener QR de reconexión
    import time as _time
    _time.sleep(2)
    try:
        url = f"{EVOLUTION_URL}/instance/connect/{EVOLUTION_INSTANCE}"
        req = urllib.request.Request(url, headers={"apikey": EVOLUTION_APIKEY})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
        qr = data.get("base64") or data.get("qrcode", {}).get("base64") or data.get("code")
        resultados["qr"] = qr
    except urllib.error.HTTPError as e:
        resultados["qr_err"] = e.read().decode()
    except Exception as e:
        resultados["qr_err"] = str(e)

    return resultados
