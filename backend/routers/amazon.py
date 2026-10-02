# -*- coding: utf-8 -*-
"""
Router Amazon (Selling Partner API, Amazon Mexico) -- ERP Zapatillas May.

Autenticacion (verificada contra la documentacion oficial 2026): SOLO token LWA.
Ya no se pide AWS IAM ni firma SigV4. Cada llamada lleva:
  x-amz-access-token: <token LWA>   (dura 1 hora)
  user-agent: NombreApp/version (Language=Python)
El token LWA sale de POST https://api.amazon.com/auth/o2/token con
grant_type=refresh_token + refresh_token + client_id + client_secret.

Mexico va en la region Norteamerica:
  produccion: https://sellingpartnerapi-na.amazon.com
  sandbox:    https://sandbox.sellingpartnerapi-na.amazon.com   (usa el MISMO refresh token)
Marketplace ID de Amazon Mexico: A1AM78C64UM0Y8.

Variables de entorno (Railway):
  AMAZON_LWA_CLIENT_ID, AMAZON_LWA_CLIENT_SECRET, AMAZON_REFRESH_TOKEN,
  AMAZON_SELLER_ID  (el "Merchant Token"/Seller ID, lo pide la Listings Items API),
  AMAZON_SANDBOX=1  (para probar contra el sandbox; quitarla para produccion),
  AMAZON_MARKETPLACE_ID (opcional, por defecto Mexico).

El SKU que se publica en Amazon es el SKU REAL del ERP (variantes.sku) -- sin
codigos cortos ni hashes (esa fue la leccion de Walmart).
"""

import os, json, time, datetime as _dt
import urllib.request, urllib.error, urllib.parse
from fastapi import APIRouter, HTTPException
from database import supabase_get_all, supabase_post, supabase_patch

router = APIRouter(prefix="/amazon", tags=["Amazon"])

LWA_CLIENT_ID     = os.getenv("AMAZON_LWA_CLIENT_ID", "")
LWA_CLIENT_SECRET = os.getenv("AMAZON_LWA_CLIENT_SECRET", "")
REFRESH_TOKEN     = os.getenv("AMAZON_REFRESH_TOKEN", "")
SELLER_ID         = os.getenv("AMAZON_SELLER_ID", "")
MARKETPLACE_ID    = os.getenv("AMAZON_MARKETPLACE_ID", "A1AM78C64UM0Y8")
SANDBOX           = os.getenv("AMAZON_SANDBOX", "0") == "1"
BASE = ("https://sandbox.sellingpartnerapi-na.amazon.com" if SANDBOX
        else "https://sellingpartnerapi-na.amazon.com")
USER_AGENT = "ZapatillasMayERP/1.0 (Language=Python)"

_token_cache = {"token": "", "expires_at": 0.0}


def _configurado() -> bool:
    return bool(LWA_CLIENT_ID and LWA_CLIENT_SECRET and REFRESH_TOKEN)


def _lwa_token() -> str:
    now = time.time()
    if _token_cache["token"] and _token_cache["expires_at"] > now + 60:
        return _token_cache["token"]
    if not _configurado():
        raise HTTPException(500, "Faltan AMAZON_LWA_CLIENT_ID / AMAZON_LWA_CLIENT_SECRET / AMAZON_REFRESH_TOKEN en el entorno")
    body = urllib.parse.urlencode({
        "grant_type": "refresh_token", "refresh_token": REFRESH_TOKEN,
        "client_id": LWA_CLIENT_ID, "client_secret": LWA_CLIENT_SECRET,
    }).encode()
    req = urllib.request.Request(
        "https://api.amazon.com/auth/o2/token", data=body, method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise HTTPException(e.code, f"Amazon LWA error: {e.read().decode(errors='ignore')}")
    except urllib.error.URLError as e:
        raise HTTPException(502, f"Amazon LWA: no se pudo conectar ({e.reason})")
    _token_cache["token"] = resp["access_token"]
    _token_cache["expires_at"] = now + int(resp.get("expires_in", 3600))
    return _token_cache["token"]


def amazon_request(method: str, path: str, params: dict = None, body: dict = None) -> dict:
    url = f"{BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode({k: v for k, v in params.items() if v is not None}, doseq=True)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "x-amz-access-token": _lwa_token(),
        "user-agent": USER_AGENT,
        "accept": "application/json",
        **({"content-type": "application/json"} if body is not None else {}),
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raise HTTPException(e.code, f"Amazon API error: {e.read().decode(errors='ignore')}")
    except urllib.error.URLError as e:
        raise HTTPException(502, f"Amazon API: no se pudo conectar ({e.reason})")


# ─── Diagnóstico ─────────────────────────────────────────────────────────────

@router.get("/ping")
def amazon_ping():
    """Estado de la conexión: variables presentes, token LWA y, si se puede, los
    marketplaces donde la cuenta participa (muestra si está suspendida)."""
    estado = {
        "sandbox": SANDBOX, "marketplace_id": MARKETPLACE_ID,
        "tiene_client_id": bool(LWA_CLIENT_ID), "tiene_client_secret": bool(LWA_CLIENT_SECRET),
        "tiene_refresh_token": bool(REFRESH_TOKEN), "tiene_seller_id": bool(SELLER_ID),
    }
    if not _configurado():
        return {**estado, "ok": False, "token_ok": False,
                "error": "Faltan variables AMAZON_LWA_CLIENT_ID / AMAZON_LWA_CLIENT_SECRET / AMAZON_REFRESH_TOKEN en Railway"}
    try:
        _lwa_token()
    except HTTPException as e:
        return {**estado, "ok": False, "token_ok": False, "error": str(e.detail)}
    try:
        resp = amazon_request("GET", "/sellers/v1/marketplaceParticipations")
        return {**estado, "ok": True, "token_ok": True, "participaciones": resp.get("payload", resp)}
    except HTTPException as e:
        return {**estado, "ok": False, "token_ok": True, "error": str(e.detail)}


# ─── Pedidos ─────────────────────────────────────────────────────────────────

def _ordenes_amazon(dias: int, max_paginas: int = 5) -> list:
    desde = (_dt.datetime.utcnow() - _dt.timedelta(days=max(1, min(dias, 90)))).strftime("%Y-%m-%dT%H:%M:%SZ")
    params = {"MarketplaceIds": MARKETPLACE_ID, "CreatedAfter": desde}
    ordenes, token = [], None
    for _ in range(max_paginas):
        p = {"NextToken": token} if token else params
        resp = amazon_request("GET", "/orders/v0/orders", params=p)
        payload = resp.get("payload") or {}
        ordenes.extend(payload.get("Orders") or [])
        token = payload.get("NextToken")
        if not token:
            break
    return ordenes


def _items_orden(order_id: str) -> list:
    resp = amazon_request("GET", f"/orders/v0/orders/{urllib.parse.quote(order_id, safe='')}/orderItems")
    return (resp.get("payload") or {}).get("OrderItems") or []


@router.get("/ordenes")
def amazon_ordenes(dias: int = 30):
    """Órdenes recientes directo de Amazon (no del ERP). El nombre y la dirección
    del comprador requieren el rol restringido de Amazon (datos personales) y un
    Restricted Data Token: todavía no se piden."""
    ordenes = _ordenes_amazon(dias)
    return {"total": len(ordenes), "ordenes": [{
        "id": o.get("AmazonOrderId"), "fecha": o.get("PurchaseDate"),
        "estatus": o.get("OrderStatus"), "total": (o.get("OrderTotal") or {}).get("Amount"),
        "moneda": (o.get("OrderTotal") or {}).get("CurrencyCode"),
        "canal_cumplimiento": o.get("FulfillmentChannel"),
        "articulos_sin_enviar": o.get("NumberOfItemsUnshipped"),
    } for o in ordenes]}


def _descontar_inventario_variante_amazon(variante_id: str, cantidad: int):
    filas = supabase_get_all(f"inventario?variante_id=eq.{variante_id}&select=sucursal_id,cantidad&order=cantidad.desc,sucursal_id")
    if not filas:
        return False
    fila = filas[0]
    nueva = max(0, (fila.get("cantidad") or 0) - cantidad)
    supabase_patch(f"inventario?variante_id=eq.{variante_id}&sucursal_id=eq.{fila['sucursal_id']}", {"cantidad": nueva})
    supabase_post("movimientos_inventario", {
        "variante_id": variante_id, "sucursal_id": fila["sucursal_id"],
        "tipo": "salida", "cantidad": -cantidad, "motivo": "Venta Amazon",
    })
    return True


def _hacer_sync_ventas_amazon() -> dict:
    """Trae órdenes pagadas de Amazon que el ERP todavía no tiene, crea el pedido
    (status 'pagado' para que salga en "Por enviar") y descuenta inventario.
    Las órdenes 'Pending' (sin pago autorizado) se ignoran hasta que pasen a Unshipped."""
    resultado = {"revisadas": 0, "procesadas": 0, "sin_match": [], "errores": []}
    try:
        ordenes = [o for o in _ordenes_amazon(30)
                   if o.get("OrderStatus") in ("Unshipped", "PartiallyShipped", "Shipped")]
    except HTTPException as e:
        resultado["errores"].append({"error_general": str(e.detail)})
        return resultado
    if not ordenes:
        return resultado
    ids = [o["AmazonOrderId"] for o in ordenes]
    ya = {r["amazon_order_id"] for r in supabase_get_all(
        f"pedidos?amazon_order_id=in.({','.join(urllib.parse.quote(i, safe='') for i in ids)})&select=amazon_order_id")}
    for orden in [o for o in ordenes if o["AmazonOrderId"] not in ya][:25]:
        resultado["revisadas"] += 1
        order_id = orden["AmazonOrderId"]
        try:
            items_pedido, faltante = [], False
            for oi in _items_orden(order_id):
                sku = (oi.get("SellerSKU") or "").strip()
                cantidad = int(oi.get("QuantityOrdered") or 0)
                if not sku or cantidad <= 0:
                    continue
                variantes = supabase_get_all(f"variantes?sku=eq.{urllib.parse.quote(sku, safe='')}&select=id,sku,color,talla,producto_id")
                if not variantes:
                    resultado["sin_match"].append({"orden": order_id, "sku": sku})
                    faltante = True
                    continue
                v = variantes[0]
                precio = float((oi.get("ItemPrice") or {}).get("Amount") or 0) / max(cantidad, 1)
                items_pedido.append({
                    "variante_id": v["id"], "cantidad": cantidad, "precio_unitario": round(precio, 2),
                    "nombre": oi.get("Title") or "", "color": v.get("color") or "", "talla": v.get("talla") or "",
                })
            if not items_pedido:
                continue
            total = sum(i["precio_unitario"] * i["cantidad"] for i in items_pedido)
            datos = {
                "amazon_order_id": order_id, "canal": "amazon", "status": "pagado", "tipo": "online",
                "total": round(total, 2), "subtotal": round(total, 2), "forma_pago": "amazon",
                "nombre_cliente": "Comprador Amazon",
                "notas": f"Pedido generado automáticamente desde Amazon (orden {order_id})"
                         + (" — faltó match de algún SKU" if faltante else ""),
            }
            if orden.get("PurchaseDate"):
                datos["created_at"] = orden["PurchaseDate"]
            pedido = supabase_post("pedidos", datos)
            pedido_id = pedido[0]["id"] if pedido else None
            if pedido_id:
                for it in items_pedido:
                    supabase_post("pedido_items", {
                        "pedido_id": pedido_id, "variante_id": it["variante_id"], "cantidad": it["cantidad"],
                        "precio_unitario": it["precio_unitario"], "nombre": it["nombre"],
                        "color": it["color"], "talla": it["talla"],
                    })
            for it in items_pedido:
                try:
                    _descontar_inventario_variante_amazon(it["variante_id"], it["cantidad"])
                except Exception as e_inv:
                    resultado["errores"].append({"orden": order_id, "error": f"pedido creado pero falló el descuento de inventario: {e_inv}"})
            resultado["procesadas"] += 1
            time.sleep(2)   # getOrderItems: ~0.5 solicitudes/seg
        except Exception as e:
            resultado["errores"].append({"orden": order_id, "error": str(e)})
    return resultado


@router.post("/sync-ventas")
def sincronizar_ventas_amazon():
    """Trigger manual (también corre solo cada 10 min cuando Amazon está configurado)."""
    return _hacer_sync_ventas_amazon()


@router.get("/ventas")
def listar_ventas_amazon():
    """Pedidos ya sincronizados desde Amazon, para la pestaña Ventas del panel."""
    return supabase_get_all("pedidos?canal=eq.amazon&order=created_at.desc&select=*")


@router.post("/ordenes/{order_id}/enviar")
def amazon_confirmar_envio(order_id: str, datos: dict):
    """Confirma el envío de una orden surtida por el vendedor (MFN) con paquetería y guía.
    Body: {paqueteria, numero_guia}. SIN PROBAR contra una orden real todavía."""
    paqueteria = (datos.get("paqueteria") or "").strip()
    guia = (datos.get("numero_guia") or "").strip()
    if not paqueteria or not guia:
        raise HTTPException(400, "Faltan paqueteria y numero_guia")
    items = _items_orden(order_id)
    if not items:
        raise HTTPException(404, "La orden no trae artículos")
    ahora = _dt.datetime.now(_dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    body = {
        "marketplaceId": MARKETPLACE_ID,
        "packageDetail": {
            "packageReferenceId": "1", "carrierName": paqueteria, "shippingMethod": "Estandar",
            "trackingNumber": guia, "shipDate": ahora,
            "orderItems": [{"orderItemId": i["OrderItemId"], "quantity": int(i.get("QuantityOrdered") or 1)} for i in items],
        },
    }
    amazon_request("POST", f"/orders/v0/orders/{urllib.parse.quote(order_id, safe='')}/shipmentConfirmation", body=body)
    try:
        supabase_patch(f"pedidos?amazon_order_id=eq.{urllib.parse.quote(order_id, safe='')}", {
            "status": "enviado", "paqueteria": paqueteria, "numero_guia": guia,
            "enviado_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        })
    except Exception as e:
        print(f"[amazon] Enviado en Amazon pero no se pudo actualizar el pedido del ERP: {e}")
    return {"ok": True}


# ─── Inventario (FBM: el vendedor surte) ─────────────────────────────────────

_PRODUCT_TYPE = os.getenv("AMAZON_PRODUCT_TYPE", "SHOES")


def _variantes_producto(sku_interno: str = None) -> list:
    filtro = f"&sku_interno=eq.{urllib.parse.quote(sku_interno, safe='')}" if sku_interno else ""
    productos = supabase_get_all(
        f"productos?activo=eq.true&categoria=neq.accesorios{filtro}&select=id,sku_interno,nombre&order=id")
    if not productos:
        return []
    ids = ",".join(p["id"] for p in productos)
    variantes = supabase_get_all(f"variantes?producto_id=in.({ids})&activa=eq.true&select=id,sku,producto_id&order=id")
    inv = supabase_get_all("inventario?select=variante_id,cantidad&order=variante_id,sucursal_id")
    stock = {}
    for r in inv:
        stock[r["variante_id"]] = stock.get(r["variante_id"], 0) + (r.get("cantidad") or 0)
    return [{"sku": (v.get("sku") or "").strip(), "stock": max(0, int(stock.get(v["id"], 0)))}
            for v in variantes if v.get("sku")]


@router.post("/inventario/sincronizar")
def amazon_sincronizar_inventario(sku_interno: str):
    """Manda a Amazon las existencias del ERP de UN modelo (todas sus variantes) con
    Listings Items API (PATCH fulfillment_availability). Solo funciona para SKUs que
    ya existen como publicación en Amazon. Se exige sku_interno a propósito: una
    llamada por SKU, y así no se dispara el catálogo completo por accidente."""
    if not SELLER_ID:
        raise HTTPException(500, "Falta AMAZON_SELLER_ID en el entorno")
    resultados = []
    for v in _variantes_producto(sku_interno):
        body = {"productType": _PRODUCT_TYPE, "patches": [{
            "op": "replace", "path": "/attributes/fulfillment_availability",
            "value": [{"fulfillment_channel_code": "DEFAULT", "quantity": v["stock"]}],
        }]}
        try:
            r = amazon_request("PATCH", f"/listings/2021-08-01/items/{urllib.parse.quote(SELLER_ID, safe='')}/{urllib.parse.quote(v['sku'], safe='')}",
                               params={"marketplaceIds": MARKETPLACE_ID, "issueLocale": "es_MX"}, body=body)
            resultados.append({"sku": v["sku"], "cantidad": v["stock"], "estatus": r.get("status"), "problemas": r.get("issues")})
        except HTTPException as e:
            resultados.append({"sku": v["sku"], "cantidad": v["stock"], "error": str(e.detail)[:400]})
        time.sleep(0.25)   # 5 solicitudes/seg máximo
    return {"enviados": len(resultados), "resultados": resultados}


# ─── Publicación: esquema real de Amazon (se consulta, no se supone) ─────────
# La lección de Walmart: NO armar el payload de publicación a partir de ejemplos de
# documentación. Amazon publica el esquema JSON real de cada tipo de producto en
# Product Type Definitions API; con estos 2 endpoints se baja el esquema de ZAPATOS
# para México y de ahí se construye la fase de publicación.

@router.get("/tipos-producto")
def amazon_buscar_tipos(q: str = "shoes"):
    return amazon_request("GET", "/definitions/2020-09-01/productTypes",
                          params={"marketplaceIds": MARKETPLACE_ID, "keywords": q, "locale": "es_MX"})


@router.get("/tipos-producto/{product_type}")
def amazon_definicion_tipo(product_type: str):
    """Definición del tipo de producto: devuelve el enlace al JSON Schema completo
    (atributos obligatorios, valores permitidos) para publicar ese tipo en Mexico."""
    return amazon_request("GET", f"/definitions/2020-09-01/productTypes/{urllib.parse.quote(product_type, safe='')}",
                          params={"marketplaceIds": MARKETPLACE_ID, "requirements": "LISTING",
                                  "requirementsEnforced": "ENFORCED", "locale": "es_MX"})
