# -*- coding: utf-8 -*-
"""
zoho_mail.py
Lectura del buzón real de Zoho Mail (contacto@zapatillasmay.mx) vía su API
oficial (OAuth2), para poder ver correos enviados y recibidos desde el panel
sin entrar a mail.zoho.com. Esto es independiente de ZeptoMail (email_utils.py),
que solo sirve para ENVIAR correos transaccionales y no da acceso al buzón.

Variables de entorno necesarias (Railway):
  ZOHO_MAIL_CLIENT_ID
  ZOHO_MAIL_CLIENT_SECRET
  ZOHO_MAIL_REFRESH_TOKEN
  ZOHO_MAIL_ACCOUNT_ID   (opcional — si no está, se detecta solo vía /accounts)
"""

import html as _html
import os
import json
import re
import time
import urllib.request
import urllib.error
import urllib.parse

CLIENT_ID     = os.getenv("ZOHO_MAIL_CLIENT_ID", "")
CLIENT_SECRET = os.getenv("ZOHO_MAIL_CLIENT_SECRET", "")
REFRESH_TOKEN = os.getenv("ZOHO_MAIL_REFRESH_TOKEN", "")
ACCOUNT_ID_ENV = os.getenv("ZOHO_MAIL_ACCOUNT_ID", "")

_TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token"
_API_BASE  = "https://mail.zoho.com/api"

_cache = {"access_token": None, "expira": 0, "account_id": ACCOUNT_ID_ENV}


def configurado() -> bool:
    return bool(CLIENT_ID and CLIENT_SECRET and REFRESH_TOKEN)


def _get_access_token() -> str:
    if _cache["access_token"] and time.time() < _cache["expira"] - 60:
        return _cache["access_token"]
    if not configurado():
        raise RuntimeError("Zoho Mail no configurado (faltan variables ZOHO_MAIL_* en Railway)")

    body = urllib.parse.urlencode({
        "grant_type": "refresh_token",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN,
    }).encode()
    req = urllib.request.Request(_TOKEN_URL, data=body, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Zoho token error {e.code}: {e.read().decode()}")

    token = data.get("access_token")
    if not token:
        raise RuntimeError(f"Zoho no devolvió access_token: {data}")
    _cache["access_token"] = token
    _cache["expira"] = time.time() + int(data.get("expires_in", 3600))
    return token


def _request(path: str, params: dict = None) -> dict:
    token = _get_access_token()
    url = f"{_API_BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Authorization": f"Zoho-oauthtoken {token}"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Zoho Mail API {e.code}: {e.read().decode()}")


def _request_post(path: str, payload: dict) -> dict:
    token = _get_access_token()
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{_API_BASE}{path}", data=body, method="POST",
        headers={"Authorization": f"Zoho-oauthtoken {token}", "Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Zoho Mail API {e.code}: {e.read().decode('utf-8', errors='replace')}")


def _account_id() -> str:
    if _cache["account_id"]:
        return _cache["account_id"]
    data = _request("/accounts")
    cuentas = data.get("data", [])
    if not cuentas:
        raise RuntimeError("No se encontró ninguna cuenta de Zoho Mail")
    _cache["account_id"] = cuentas[0]["accountId"]
    return _cache["account_id"]


_FOLDERS_CACHE = {"data": None, "expira": 0}


def _folder_id(nombre: str) -> str:
    """nombre: 'Inbox' o 'Sent' (folderType de Zoho)."""
    if not _FOLDERS_CACHE["data"] or time.time() > _FOLDERS_CACHE["expira"]:
        data = _request(f"/accounts/{_account_id()}/folders")
        _FOLDERS_CACHE["data"] = data.get("data", [])
        _FOLDERS_CACHE["expira"] = time.time() + 3600
    for f in _FOLDERS_CACHE["data"]:
        if f.get("folderType") == nombre and f.get("path") == f"/{nombre}":
            return f["folderId"]
    # fallback: primer folder que matchee el tipo
    for f in _FOLDERS_CACHE["data"]:
        if f.get("folderType") == nombre:
            return f["folderId"]
    raise RuntimeError(f"No se encontró la carpeta {nombre}")


def _limpiar_direccion(valor: str) -> str:
    return (valor or "").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"').replace("&amp;", "&").strip()


_CLAVE_VISTOS = "zoho_mensajes_vistos_panel"


def _leer_vistos() -> set:
    """La API de Zoho no nos autorizó a marcar mensajes como leídos (falta scope
    ZohoMail.messages.UPDATE, no solicitado), así que el panel lleva su propio
    registro de 'ya lo abrí' en la tabla configuracion, capado a los últimos 300."""
    from database import supabase_get
    fila = supabase_get(f"configuracion?clave=eq.{_CLAVE_VISTOS}&select=valor")
    if not fila or not fila[0].get("valor"):
        return set()
    try:
        return set(json.loads(fila[0]["valor"]))
    except Exception:
        return set()


def marcar_visto(message_id: str):
    from database import supabase_get, supabase_post, supabase_patch
    vistos = _leer_vistos()
    vistos.add(str(message_id))
    vistos = set(list(vistos)[-300:])
    valor = json.dumps(list(vistos))
    fila = supabase_get(f"configuracion?clave=eq.{_CLAVE_VISTOS}&select=valor")
    if fila:
        supabase_patch(f"configuracion?clave=eq.{_CLAVE_VISTOS}", {"valor": valor})
    else:
        supabase_post("configuracion", {"clave": _CLAVE_VISTOS, "valor": valor})


def listar_mensajes(carpeta: str = "Inbox", limite: int = 30, start: int = 1) -> list:
    """carpeta: 'Inbox' o 'Sent'. Devuelve lista simplificada para el panel."""
    folder_id = _folder_id(carpeta)
    data = _request(f"/accounts/{_account_id()}/messages/view", {
        "folderId": folder_id,
        "limit": limite,
        "start": start,
    })
    mensajes = data.get("data", [])
    vistos = _leer_vistos() if carpeta == "Inbox" else set()
    out = []
    for m in mensajes:
        mid = m.get("messageId")
        out.append({
            "messageId": mid,
            "asunto": m.get("subject") or "(sin asunto)",
            "de": _limpiar_direccion(m.get("fromAddress")),
            "para": _limpiar_direccion(m.get("toAddress")),
            "resumen": (m.get("summary") or "")[:200],
            "fecha_ms": int(m.get("receivedTime") or m.get("sentDateInGMT") or 0),
            "tiene_adjunto": m.get("hasAttachment") == "1",
            "leido": (m.get("status") != "0") or (str(mid) in vistos),
            "folderId": folder_id,
        })
    return out


def _info_adjuntos(message_id: str, folder_id: str) -> dict:
    """Metadatos de adjuntos (incluye los embebidos inline en el cuerpo) de un
    mensaje: {"attachments": [...], "inline": [...]}, cada uno con attachmentId,
    attachmentName, attachmentSize y (los inline) cid."""
    data = _request(
        f"/accounts/{_account_id()}/folders/{folder_id}/messages/{message_id}/attachmentinfo",
        {"includeInline": "true"},
    )
    return data.get("data", {}) or {}


def obtener_contenido(message_id: str, folder_id: str, base_url: str = "") -> dict:
    """HTML completo de un mensaje (los metadatos ya vienen del listado) más la
    lista de adjuntos reales (no inline), para que el panel pueda mostrarlos."""
    data = _request(f"/accounts/{_account_id()}/folders/{folder_id}/messages/{message_id}/content")
    contenido = data.get("data", {}).get("content") or ""
    try:
        info = _info_adjuntos(message_id, folder_id)
    except Exception:
        info = {}
    inline = info.get("inline", []) or []
    adjuntos = info.get("attachments", []) or []
    if base_url:
        contenido = _reescribir_imagenes(contenido, base_url, folder_id, message_id, inline)
    return {"html": contenido, "adjuntos": adjuntos}


_SRC_RE = re.compile(r'''src\s*=\s*(["'])(.*?)\1''', re.IGNORECASE)


def _reescribir_imagenes(contenido: str, base_url: str, folder_id: str, message_id: str, inline: list) -> str:
    """Las imágenes embebidas en el cuerpo del correo vienen en el HTML de Zoho
    como un link a /mail/ImageDisplay -- una ruta interna del webmail que exige
    la sesión de mail.zoho.com y NO acepta el token OAuth de la API (por más que
    se le anteponga /api, Zoho responde 404, o con /mail solo, la página de
    login). La única forma real de bajarlas con OAuth es la API de adjuntos
    (attachmentinfo + /attachments/{attachmentId}), así que aquí se resuelve
    cada <img> contra esa lista (matchea por cid, si no por nombre de archivo,
    si no por orden de aparición) y se reescribe apuntando a nuestro proxy
    /emails/buzon/adjunto/{folderId}/{messageId}/{attachmentId}."""
    por_cid = {}
    por_nombre = {}
    for a in inline:
        aid = a.get("attachmentId")
        cid = (a.get("cid") or "").strip()
        nombre = (a.get("attachmentName") or "").strip().lower()
        if cid:
            por_cid[cid] = aid
        if nombre:
            por_nombre.setdefault(nombre, aid)
    usados = set()

    def _reemplazar(m):
        comilla, src = m.group(1), m.group(2)
        if src.startswith("data:") or (src.startswith("http") and "zoho.com" not in src):
            return m.group(0)  # ya es una imagen pública o embebida en base64, no tocar
        # El HTML de Zoho trae la query del src con entidades HTML sin decodificar
        # (p.ej. "&amp;" en vez de "&"), hay que decodificarlas antes de leer
        # sus parámetros (cid, f = nombre de archivo).
        src = _html.unescape(src)
        qs = urllib.parse.parse_qs(urllib.parse.urlparse(src).query)
        cid_val = (qs.get("cid") or [""])[0]
        nombre_val = (qs.get("f") or [""])[0].strip().lower()
        aid = None
        if cid_val:
            for k, v in por_cid.items():
                if cid_val in k or k in cid_val:
                    aid = v
                    break
        if not aid and nombre_val:
            aid = por_nombre.get(nombre_val)
        if not aid:
            restantes = [a.get("attachmentId") for a in inline if a.get("attachmentId") not in usados]
            if restantes:
                aid = restantes[0]
        if not aid:
            return m.group(0)  # no se pudo resolver contra ningún inline conocido
        usados.add(aid)
        proxied = f"{base_url.rstrip('/')}/emails/buzon/adjunto/{folder_id}/{message_id}/{aid}"
        return f'src={comilla}{proxied}{comilla}'
    return _SRC_RE.sub(_reemplazar, contenido)


def descargar_adjunto(folder_id: str, message_id: str, attachment_id: str) -> tuple:
    """Descarga el contenido real de un adjunto (inline o archivo aparte) vía la
    API de adjuntos de Zoho Mail, con el token OAuth del backend. Devuelve
    (bytes, content_type)."""
    token = _get_access_token()
    url = f"{_API_BASE}/accounts/{_account_id()}/folders/{folder_id}/messages/{message_id}/attachments/{attachment_id}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Zoho-oauthtoken {token}",
        "Accept": "application/octet-stream",
    })
    with urllib.request.urlopen(req, timeout=20) as r:
        content_type = r.headers.get("Content-Type") or "application/octet-stream"
        return r.read(), content_type


def enviar_correo(para: str, asunto: str, html: str, cc: str = "", responder_a_message_id: str = "") -> dict:
    """Manda un correo real desde contacto@zapatillasmay.mx vía Zoho Mail API
    (aparece en la carpeta Sent del buzón real y permite responder hilos)."""
    payload = {
        "fromAddress": "contacto@zapatillasmay.mx",
        "toAddress": para,
        "subject": asunto,
        "content": html,
        "mailFormat": "html",
    }
    if cc:
        payload["ccAddress"] = cc
    if responder_a_message_id:
        payload["refMessageId"] = responder_a_message_id
        payload["mode"] = "reply"
    return _request_post(f"/accounts/{_account_id()}/messages", payload)


def contar_no_leidos(limite: int = 50) -> int:
    """Cuenta mensajes no leídos en Inbox (para el badge del panel)."""
    return sum(1 for m in listar_mensajes("Inbox", limite) if not m["leido"])


_CLAVE_ULTIMO_ID = "zoho_ultimo_email_id"


def verificar_correo_nuevo() -> list:
    """Compara el mensaje más reciente del Inbox contra el último visto
    (guardado en la tabla `configuracion`). Devuelve los mensajes nuevos
    (para disparar notificaciones push) y actualiza el marcador.
    En la primera corrida (sin marcador previo) no notifica nada — solo
    establece el punto de partida, para no disparar un aluvión de avisos
    con correo viejo."""
    from database import supabase_get, supabase_post, supabase_patch

    mensajes = listar_mensajes("Inbox", 20)
    if not mensajes:
        return []

    fila = supabase_get(f"configuracion?clave=eq.{_CLAVE_ULTIMO_ID}&select=valor")
    ultimo_visto = int(fila[0]["valor"]) if fila and fila[0].get("valor") else None

    nuevo_top = max(int(m["messageId"]) for m in mensajes)

    if ultimo_visto is None:
        if fila:
            supabase_patch(f"configuracion?clave=eq.{_CLAVE_ULTIMO_ID}", {"valor": str(nuevo_top)})
        else:
            supabase_post("configuracion", {"clave": _CLAVE_ULTIMO_ID, "valor": str(nuevo_top)})
        return []

    nuevos = [m for m in mensajes if int(m["messageId"]) > ultimo_visto]
    if nuevos:
        supabase_patch(f"configuracion?clave=eq.{_CLAVE_ULTIMO_ID}", {"valor": str(nuevo_top)})
    return nuevos


def diagnostico() -> dict:
    if not configurado():
        return {"configurado": False}
    try:
        cid = _account_id()
        return {"configurado": True, "account_id": cid}
    except Exception as e:
        return {"configurado": True, "error": str(e)}
