# -*- coding: utf-8 -*-
"""
routers/pinterest.py
Pinterest Conversions API (CAPI) — server-side events.
Token: variable de entorno PINTEREST_ACCESS_TOKEN
Ad Account ID: variable de entorno PINTEREST_AD_ACCOUNT_ID
"""

import os, hashlib, time, uuid, json, urllib.request, urllib.error
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/pinterest", tags=["Pinterest"])

_TOKEN      = os.getenv("PINTEREST_ACCESS_TOKEN", "")
_AD_ACCOUNT = os.getenv("PINTEREST_AD_ACCOUNT_ID", "549762988608")
_API_URL    = f"https://api.pinterest.com/v5/ad_accounts/{_AD_ACCOUNT}/events"


def _sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


def _enviar(eventos: list, test: bool = False) -> dict:
    """Envía una lista de eventos a la Pinterest CAPI. Retorna la respuesta."""
    if not _TOKEN:
        print("[pinterest] PINTEREST_ACCESS_TOKEN no configurado")
        return {"ok": False, "error": "token_not_set"}
    url = _API_URL + ("?test=true" if test else "")
    body = json.dumps({"data": eventos}).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {_TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as r:
            resp = json.loads(r.read())
            return {"ok": True, "response": resp}
    except urllib.error.HTTPError as e:
        err = e.read().decode(errors="replace")
        print(f"[pinterest] Error CAPI {e.code}: {err}")
        return {"ok": False, "code": e.code, "error": err}
    except Exception as e:
        print(f"[pinterest] Error CAPI: {e}")
        return {"ok": False, "error": str(e)}


# ── Helper público para llamar desde otros routers (ej. pagos.py) ──────────

def enviar_checkout(pedido: dict, payment: dict) -> dict:
    """
    Dispara el evento 'checkout' de Pinterest CAPI cuando se confirma un pago.
    Llamado desde el webhook de MercadoPago en pagos.py.
    """
    total      = float(pedido.get("total") or 0)
    email      = (pedido.get("email_cliente") or "").strip().lower()
    telefono   = (pedido.get("telefono_cliente") or "").strip()
    nombre     = (pedido.get("nombre_cliente") or "").strip()
    pedido_id  = str(pedido.get("id") or "")
    cliente_id = str(pedido.get("cliente_id") or "")
    ip         = pedido.get("client_ip_address") or ""
    ua         = pedido.get("client_user_agent") or ""
    items      = pedido.get("pedido_items") or []

    nombre_parts = nombre.split(" ", 1)
    fn = nombre_parts[0] if nombre_parts else ""
    ln = nombre_parts[1] if len(nombre_parts) > 1 else ""

    user_data: dict = {
        "client_ip_address": ip,
        "client_user_agent": ua,
    }
    if email:
        user_data["em"] = [_sha256(email)]
    if telefono:
        # Solo dígitos + código de país (52)
        tel_digits = "".join(c for c in telefono if c.isdigit())
        if not tel_digits.startswith("52"):
            tel_digits = "52" + tel_digits
        user_data["ph"] = [_sha256(tel_digits)]
    if fn:
        user_data["fn"] = [_sha256(fn)]
    if ln:
        user_data["ln"] = [_sha256(ln)]
    # external_id: identificador estable del comprador. Pinterest lo recomienda
    # en todos los eventos de checkout; si no hay cuenta (compra de invitado,
    # el caso mas comun), se usa el email o en ultimo caso el id del pedido
    # para no dejarlo vacio.
    external_id_raw = cliente_id or email or pedido_id
    if external_id_raw:
        user_data["external_id"] = [_sha256(external_id_raw)]
    user_data["country"] = [_sha256("mx")]

    content_ids = [str(it.get("variante_id") or it.get("producto_id") or "") for it in items if it]
    contents    = [
        {"item_price": str(float(it.get("precio_unitario") or 0)), "quantity": int(it.get("cantidad") or 1)}
        for it in items if it
    ]

    evento = {
        "event_name":       "checkout",
        "action_source":    "web",
        "event_time":       int(time.time()),
        "event_id":         pedido_id or str(uuid.uuid4()),
        "event_source_url": "https://zapatillasmay.mx/success",
        "user_data":        user_data,
        "custom_data": {
            "currency":     "MXN",
            "value":        str(total),
            "content_ids":  [c for c in content_ids if c],
            "contents":     contents,
            "num_items":    len(items),
            "order_id":     pedido_id,
            "content_brand": "May",
        },
        "language": "es",
    }
    return _enviar([evento])


# ── Endpoint para eventos del frontend (add_to_cart, page_visit, etc.) ──────

@router.post("/event")
async def recibir_evento(request: Request):
    """
    Recibe eventos del frontend y los reenvía a Pinterest CAPI.
    Body esperado:
    {
        "event_name": "add_to_cart" | "page_visit" | "view_category" | "lead",
        "event_source_url": "https://zapatillasmay.mx/...",
        "value": 799.0,               // opcional
        "currency": "MXN",            // opcional, default MXN
        "content_ids": ["SKU-001"],   // opcional
        "content_name": "Sandalia X", // opcional
        "email": "user@example.com",  // opcional — se hashea en el servidor
        "event_id": "abc123"          // opcional — para deduplicar con el pixel
    }
    """
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"error": "JSON inválido"})

    event_name = body.get("event_name", "page_visit")
    if event_name not in {"add_to_cart", "page_visit", "view_category", "lead", "search", "signup"}:
        return JSONResponse(status_code=400, content={"error": f"event_name '{event_name}' no permitido"})

    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "").split(",")[0].strip()
    ua = request.headers.get("user-agent", "")

    user_data: dict = {"client_ip_address": ip, "client_user_agent": ua}
    email = (body.get("email") or "").strip().lower()
    if email:
        user_data["em"] = [_sha256(email)]
    # external_id: usa el visitante anonimo persistente que manda el frontend
    # (o el email si ya se conoce) para que Pinterest pueda enlazar eventos
    # del mismo usuario a traves de varias visitas.
    external_id_raw = (body.get("external_id") or "").strip() or email
    if external_id_raw:
        user_data["external_id"] = [_sha256(external_id_raw)]

    custom_data: dict = {"currency": body.get("currency", "MXN")}
    if body.get("value"):
        custom_data["value"] = str(float(body["value"]))
    if body.get("content_ids"):
        custom_data["content_ids"] = body["content_ids"]
    if body.get("content_name"):
        custom_data["content_name"] = body["content_name"]
    if body.get("num_items"):
        custom_data["num_items"] = body["num_items"]

    evento = {
        "event_name":       event_name,
        "action_source":    "web",
        "event_time":       int(time.time()),
        "event_id":         body.get("event_id") or str(uuid.uuid4()),
        "event_source_url": body.get("event_source_url", "https://zapatillasmay.mx"),
        "user_data":        user_data,
        "custom_data":      custom_data,
        "language":         "es",
    }

    result = _enviar([evento])
    return result


@router.post("/test")
async def test_evento(request: Request):
    """Envía un checkout de prueba a Pinterest (no registra el evento real)."""
    evento = {
        "event_name":       "checkout",
        "action_source":    "web",
        "event_time":       int(time.time()),
        "event_id":         str(uuid.uuid4()),
        "event_source_url": "https://zapatillasmay.mx/success",
        "user_data": {
            "client_ip_address": "127.0.0.1",
            "client_user_agent": "test",
            "em": [_sha256("test@zapatillasmay.mx")],
            "country": [_sha256("mx")],
        },
        "custom_data": {
            "currency": "MXN",
            "value": "100",
            "order_id": "test-001",
            "content_brand": "May",
        },
        "language": "es",
    }
    return _enviar([evento], test=True)
