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

import os
import json
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


def listar_mensajes(carpeta: str = "Inbox", limite: int = 30, start: int = 1) -> list:
    """carpeta: 'Inbox' o 'Sent'. Devuelve lista simplificada para el panel."""
    folder_id = _folder_id(carpeta)
    data = _request(f"/accounts/{_account_id()}/messages/view", {
        "folderId": folder_id,
        "limit": limite,
        "start": start,
    })
    mensajes = data.get("data", [])
    out = []
    for m in mensajes:
        out.append({
            "messageId": m.get("messageId"),
            "asunto": m.get("subject") or "(sin asunto)",
            "de": _limpiar_direccion(m.get("fromAddress")),
            "para": _limpiar_direccion(m.get("toAddress")),
            "resumen": (m.get("summary") or "")[:200],
            "fecha_ms": int(m.get("receivedTime") or m.get("sentDateInGMT") or 0),
            "tiene_adjunto": m.get("hasAttachment") == "1",
            "leido": m.get("status") != "0",
            "folderId": folder_id,
        })
    return out


def obtener_contenido(message_id: str, folder_id: str) -> str:
    """HTML completo de un mensaje (los metadatos ya vienen del listado)."""
    data = _request(f"/accounts/{_account_id()}/folders/{folder_id}/messages/{message_id}/content")
    return data.get("data", {}).get("content") or ""


def diagnostico() -> dict:
    if not configurado():
        return {"configurado": False}
    try:
        cid = _account_id()
        return {"configurado": True, "account_id": cid}
    except Exception as e:
        return {"configurado": True, "error": str(e)}
