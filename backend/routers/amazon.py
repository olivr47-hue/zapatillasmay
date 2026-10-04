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

import os, json, time, threading, datetime as _dt
import urllib.request, urllib.error, urllib.parse
from fastapi import APIRouter, HTTPException
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, inventario_ajustar

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


def amazon_request(method: str, path: str, params: dict = None, body: dict = None, base: str = None) -> dict:
    url = f"{base or BASE}{path}"
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
def amazon_ping(sandbox: bool = None):
    """Estado de la conexión: variables presentes, token LWA y, si se puede, los
    marketplaces donde la cuenta participa (muestra si está suspendida)."""
    usar_sandbox = SANDBOX if sandbox is None else sandbox   # ?sandbox=true prueba el sandbox sin tocar Railway
    base = "https://sandbox.sellingpartnerapi-na.amazon.com" if usar_sandbox else "https://sellingpartnerapi-na.amazon.com"
    estado = {
        "sandbox": usar_sandbox, "marketplace_id": MARKETPLACE_ID,
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
        resp = amazon_request("GET", "/sellers/v1/marketplaceParticipations", base=base)
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
    inventario_ajustar(variante_id, fila["sucursal_id"], -cantidad)   # descuento atómico (nunca baja de 0)
    supabase_post("movimientos_inventario", {
        "variante_id": variante_id, "sucursal_id": fila["sucursal_id"],
        "tipo": "salida", "cantidad": -cantidad, "motivo": "Venta Amazon",
    })
    return True


def _actualizar_estados_amazon(ordenes: list, resultado: dict):
    """Pone al día los pedidos de Amazon que el ERP ya tiene: orden cancelada -> pedido 'cancelado' y el inventario
    regresa; orden enviada (Shipped) -> pedido 'enviado' (cubre lo que se confirme desde Seller Central). La API de
    pedidos de Amazon no informa 'entregado' en envíos propios, por eso ahí no se da seguimiento a la entrega."""
    vivos = supabase_get("pedidos?canal=eq.amazon&status=in.(pagado,confirmado)&select=id,amazon_order_id,status") or []
    if not vivos:
        return
    por_id = {o.get("AmazonOrderId"): o for o in ordenes}
    from routers.mercadolibre import _cancelar_pedido_ml, _hist_ml
    for p in vivos:
        o = por_id.get(p.get("amazon_order_id"))
        if not o:
            continue
        st = o.get("OrderStatus")
        if st in ("Canceled", "Cancelled"):
            _cancelar_pedido_ml(p, p["amazon_order_id"], origen="Amazon")
            resultado["cancelados"] += 1
        elif st == "Shipped":
            supabase_patch(f"pedidos?id=eq.{p['id']}", {
                "status": "enviado", "paqueteria": "Amazon", "enviado_at": _dt.datetime.now(_dt.timezone.utc).isoformat()})
            _hist_ml(p["id"], "enviado", "Amazon reporta la orden como enviada")
            resultado["enviados"] += 1


def _hacer_sync_ventas_amazon() -> dict:
    """Trae órdenes pagadas de Amazon que el ERP todavía no tiene, crea el pedido
    (status 'pagado' para que salga en "Por enviar") y descuenta inventario.
    Las órdenes 'Pending' (sin pago autorizado) se ignoran hasta que pasen a Unshipped."""
    resultado = {"revisadas": 0, "procesadas": 0, "sin_match": [], "errores": [], "enviados": 0, "cancelados": 0}
    try:
        todas = _ordenes_amazon(30)
        ordenes = [o for o in todas if o.get("OrderStatus") in ("Unshipped", "PartiallyShipped", "Shipped")]
    except HTTPException as e:
        resultado["errores"].append({"error_general": str(e.detail)})
        return resultado
    try:
        _actualizar_estados_amazon(todas, resultado)
    except Exception as e:
        resultado["errores"].append({"error_estados": str(e)})
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


# ─── Existencias de TODO lo publicado (corre solo cada 30 min cuando Amazon está activo) ─────────

def _listados_amazon() -> list:
    """Todas las publicaciones del vendedor en Amazon México: [{sku, asin, estado, cantidad}] (Listings Items API,
    searchListingsItems, 20 por página)."""
    if not SELLER_ID:
        raise HTTPException(500, "Falta AMAZON_SELLER_ID en el entorno")
    out, token = [], None
    for _ in range(100):
        params = {"marketplaceIds": MARKETPLACE_ID, "includedData": "summaries,fulfillmentAvailability", "pageSize": 20}
        if token:
            params["pageToken"] = token
        r = amazon_request("GET", f"/listings/2021-08-01/items/{urllib.parse.quote(SELLER_ID, safe='')}", params=params)
        for it in r.get("items") or []:
            resumen = (it.get("summaries") or [{}])[0]
            disp = it.get("fulfillmentAvailability") or []
            out.append({"sku": it.get("sku"), "asin": resumen.get("asin"), "estado": resumen.get("status"),
                        "cantidad": sum(int(d.get("quantity") or 0) for d in disp)})
        token = (r.get("pagination") or {}).get("nextToken")
        if not token:
            break
        time.sleep(0.25)
    return out


_STOCK_LOCK = threading.Lock()


def _hacer_sync_stock_amazon() -> dict:
    """Manda a Amazon el stock del ERP de cada publicación cuya cantidad cambió. No hace nada en sandbox ni sin credenciales."""
    res = {"revisados": 0, "actualizados": 0, "errores": []}
    if not (_configurado() and SELLER_ID) or SANDBOX:
        res["omitido"] = "Amazon no está activo (sin credenciales, sin AMAZON_SELLER_ID o en sandbox)"
        return res
    if not _STOCK_LOCK.acquire(blocking=False):
        res["omitido"] = "ya hay una sincronización en curso"
        return res
    try:
        stock = {v["sku"]: v["stock"] for v in _variantes_producto()}
        for it in _listados_amazon():
            res["revisados"] += 1
            sku = it.get("sku")
            if sku not in stock or stock[sku] == it["cantidad"]:
                continue
            body = {"productType": _PRODUCT_TYPE, "patches": [{
                "op": "replace", "path": "/attributes/fulfillment_availability",
                "value": [{"fulfillment_channel_code": "DEFAULT", "quantity": stock[sku]}]}]}
            try:
                amazon_request("PATCH", f"/listings/2021-08-01/items/{urllib.parse.quote(SELLER_ID, safe='')}/{urllib.parse.quote(sku, safe='')}",
                               params={"marketplaceIds": MARKETPLACE_ID, "issueLocale": "es_MX"}, body=body)
                res["actualizados"] += 1
            except HTTPException as e:
                res["errores"].append({"sku": sku, "error": str(e.detail)[:200]})
            time.sleep(0.25)
    except HTTPException as e:
        res["errores"].append({"error_general": str(e.detail)[:300]})
    finally:
        _STOCK_LOCK.release()
    return res


@router.post("/stock/sincronizar-todo")
def amazon_sincronizar_stock_todo():
    """Trigger manual del envío de existencias de todo lo publicado (también corre solo cada 30 min)."""
    return _hacer_sync_stock_amazon()


# ─── Preparación: qué falta para empezar a vender ────────────────────────────────

@router.get("/preparacion")
def amazon_preparacion():
    """Lista de verificación para dejar Amazon listo: conexión real (no sandbox), cuenta activa en México, esquema de
    zapatos accesible y qué datos de los productos del ERP faltan para publicar."""
    pasos = []

    def paso(clave, titulo, ok, detalle="", accion=""):
        pasos.append({"clave": clave, "titulo": titulo, "ok": bool(ok), "detalle": detalle, "accion": accion})

    paso("variables", "Claves de Amazon en Railway", _configurado() and bool(SELLER_ID),
         "AMAZON_LWA_CLIENT_ID, AMAZON_LWA_CLIENT_SECRET, AMAZON_REFRESH_TOKEN y AMAZON_SELLER_ID",
         "Agrégalas en Railway > Variables" if not (_configurado() and SELLER_ID) else "")
    paso("produccion", "Conectado a producción (no sandbox)", not SANDBOX,
         "AMAZON_SANDBOX=1 hace que todo sea de prueba", "Quita AMAZON_SANDBOX en Railway cuando la cuenta esté activa" if SANDBOX else "")
    token_ok = False
    if _configurado():
        try:
            _lwa_token()
            token_ok = True
        except HTTPException as e:
            paso("token", "El token de Amazon funciona", False, str(e.detail)[:240],
                 "Regenera el refresh token con «Autorizar» en la consola de desarrollador de Amazon (cuenta activa)")
        if token_ok:
            paso("token", "El token de Amazon funciona", True)
    participa = False
    if token_ok:
        try:
            r = amazon_request("GET", "/sellers/v1/marketplaceParticipations")
            filas = r.get("payload", r) if isinstance(r, dict) else r
            mx = [f for f in (filas or []) if (f.get("marketplace") or {}).get("id") == MARKETPLACE_ID]
            participa = bool(mx and (mx[0].get("participation") or {}).get("isParticipating"))
            suspendida = bool(mx and (mx[0].get("participation") or {}).get("hasSuspendedListings"))
            paso("cuenta", "Cuenta activa vendiendo en Amazon México", participa and not suspendida,
                 "La cuenta participa en el marketplace de México" if participa else "La cuenta no aparece como participante en México",
                 "" if (participa and not suspendida) else "Revisa en Seller Central que la cuenta esté activa (verificación de identidad, método de pago y datos fiscales)")
        except HTTPException as e:
            paso("cuenta", "Cuenta activa vendiendo en Amazon México", False, str(e.detail)[:240], "Revisa el estado de la cuenta en Seller Central")
        try:
            amazon_request("GET", f"/definitions/2020-09-01/productTypes/{_PRODUCT_TYPE}",
                           params={"marketplaceIds": MARKETPLACE_ID, "requirements": "LISTING", "locale": "es_MX"})
            paso("esquema", "Esquema oficial de zapatos disponible", True)
        except HTTPException as e:
            paso("esquema", "Esquema oficial de zapatos disponible", False, str(e.detail)[:240])
    # Datos del ERP
    faltan = {"sin_descripcion": [], "sin_material": [], "sin_foto": [], "sin_marca": []}
    productos = supabase_get_all("productos?activo=eq.true&categoria=neq.accesorios&select=id,sku_interno,nombre,descripcion,material,marca,imagen_principal&order=id")
    for p in productos:
        if not (p.get("descripcion") or "").strip():
            faltan["sin_descripcion"].append(p.get("sku_interno"))
        if not (p.get("material") or "").strip():
            faltan["sin_material"].append(p.get("sku_interno"))
        if not (p.get("imagen_principal") or "").strip():
            faltan["sin_foto"].append(p.get("sku_interno"))
        if not (p.get("marca") or "").strip():
            faltan["sin_marca"].append(p.get("sku_interno"))
    paso("datos", "Productos del ERP con los datos que pide Amazon", not any(faltan.values()),
         f"{len(productos)} modelos activos · sin descripción: {len(faltan['sin_descripcion'])} · sin material: {len(faltan['sin_material'])} · "
         f"sin foto: {len(faltan['sin_foto'])} · sin marca (se usará «Zapatillas May»): {len(faltan['sin_marca'])}")
    manual = [
        "Solicitar en Seller Central la exención de código de barras (GTIN/UPC) para tu marca en calzado: sin ella Amazon rechaza publicaciones sin UPC.",
        "Que la foto principal de cada modelo sea sobre fondo blanco puro (regla de Amazon para la imagen principal).",
        "Configurar en Seller Central la plantilla de envío y la dirección de devoluciones.",
        "Opcional: Registro de Marca de Amazon (Brand Registry) para proteger tu marca y dar de alta la ficha más completa.",
    ]
    return {"ok": all(p["ok"] for p in pasos if p["clave"] != "datos"), "pasos": pasos,
            "faltan": {k: v[:25] for k, v in faltan.items()}, "pendientes_en_seller_central": manual}


# ─── Publicación: se arma, se REVISA con Amazon (VALIDATION_PREVIEW) y solo entonces se publica ─────
# Lección de Walmart: nada se manda a ciegas. Antes de crear una publicación Amazon valida el payload sin
# crearla (mode=VALIDATION_PREVIEW) y devuelve cada problema con su atributo. Los atributos que Amazon pida
# y no estén mapeados aquí se pueden añadir sin tocar código con `atributos_extra` y se pueden quitar con `quitar`.
# NOTA: armado con la documentación de Listings Items API; NO se ha probado contra el esquema real de México
# (la cuenta aún no está activa), por eso la primera revisión puede pedir 1-2 ajustes.

_AMAZON_AJUSTE_PRECIO = float(os.getenv("AMAZON_AJUSTE_PRECIO", "0"))
_VARIATION_THEME = os.getenv("AMAZON_VARIATION_THEME", "SIZE/COLOR")
_BROWSE_NODE = os.getenv("AMAZON_BROWSE_NODE", "")
_IDIOMA = "es_MX"


def _a(valor, idioma=False, **extra):
    d = {"value": valor, "marketplace_id": MARKETPLACE_ID, **extra}
    if idioma:
        d["language_tag"] = _IDIOMA
    return [d]


def _precio_web(p: dict, ajuste: float = None) -> float:
    """El mismo precio que ve la clienta en la tienda (+$80 salvo ofertas) más el ajuste de Amazon (AMAZON_AJUSTE_PRECIO, por defecto 0)."""
    base = float(p.get("precio_menudeo") or 0) + (0 if p.get("es_oferta") else 80)
    return round(base + (_AMAZON_AJUSTE_PRECIO if ajuste is None else ajuste), 2)


def _datos_producto_amazon(sku_interno: str):
    prods = supabase_get_all(f"productos?sku_interno=eq.{urllib.parse.quote(sku_interno, safe='')}&select=*&order=id")
    if not prods:
        raise HTTPException(404, f"No existe el modelo {sku_interno} en el ERP")
    p = prods[0]
    variantes = supabase_get_all(f"variantes?producto_id=eq.{p['id']}&activa=eq.true&select=id,sku,color,talla,foto_url,imagenes&order=id")
    inv = supabase_get_all("inventario?select=variante_id,cantidad&order=variante_id,sucursal_id")
    stock = {}
    for r in inv:
        stock[r["variante_id"]] = stock.get(r["variante_id"], 0) + (r.get("cantidad") or 0)
    for v in variantes:
        v["stock"] = max(0, int(stock.get(v["id"], 0)))
    return p, [v for v in variantes if (v.get("sku") or "").strip()]


def _bullets(p: dict) -> list:
    b = []
    if p.get("material"):
        b.append(f"Material: {str(p['material']).strip().capitalize()}")
    if p.get("tipo_tacon") or p.get("altura_tacon"):
        b.append("Tacón " + " ".join(x for x in [str(p.get("tipo_tacon") or "").strip(), (f"de {p['altura_tacon']} cm" if p.get("altura_tacon") else "")] if x))
    if p.get("material_suela"):
        b.append(f"Suela de {str(p['material_suela']).strip()}")
    if p.get("forro"):
        b.append(f"Forro: {str(p['forro']).strip()}")
    if p.get("recomendacion_talla"):
        b.append(str(p["recomendacion_talla"]).strip()[:200])
    b.append("Calzado de moda para dama, hecho en México. Envío a todo el país")
    return [x[:500] for x in b][:5]


def _construir_listados(p: dict, variantes: list, precio: float, variaciones: bool, extra: dict, quitar: list) -> list:
    """[{sku, tipo: 'parent'|'child'|'simple', body}] listos para PUT /listings/2021-08-01/items."""
    marca = (p.get("marca") or "").strip() or "Zapatillas May"
    nombre = str(p.get("nombre") or "").strip()
    descripcion = (p.get("descripcion") or "").strip() or f"{nombre}. Calzado de moda para dama de la marca {marca}."
    base = {
        "brand": _a(marca, True),
        "product_description": _a(descripcion[:2000], True),
        "bullet_point": [{"value": b, "language_tag": _IDIOMA, "marketplace_id": MARKETPLACE_ID} for b in _bullets(p)],
        "country_of_origin": _a("MX"),
        "supplier_declared_has_product_identifier_exemption": _a(True),
        "supplier_declared_dg_hz_regulation": _a("not_applicable"),
        "department": _a("womens", True),
    }
    if p.get("material"):
        base["outer_material"] = _a(str(p["material"]).strip(), True)
    if p.get("material_suela"):
        base["sole_material"] = _a(str(p["material_suela"]).strip(), True)
    if _BROWSE_NODE:
        base["recommended_browse_nodes"] = _a(_BROWSE_NODE)
    out = []
    if variaciones:
        pad = {**base, "item_name": _a(f"{marca} {nombre}"[:200], True), "parentage_level": _a("parent"),
               "variation_theme": [{"name": _VARIATION_THEME}]}
        out.append({"sku": p["sku_interno"], "tipo": "parent", "attrs": pad})
    for v in variantes:
        imgs = [u for u in ([v.get("foto_url")] + list(v.get("imagenes") or []) + [p.get("imagen_principal")] + list(p.get("imagenes") or [])) if u]
        vistos, fotos = set(), []
        for u in imgs:
            if u not in vistos:
                vistos.add(u); fotos.append(u)
        at = {
            **base,
            "item_name": _a(f"{marca} {nombre} {v.get('color') or ''}".strip()[:200], True),
            "condition_type": _a("new_new"),
            "color": _a(str(v.get("color") or "").strip(), True),
            "size": _a(str(v.get("talla") or "").strip(), True),
            "purchasable_offer": [{"marketplace_id": MARKETPLACE_ID, "currency": "MXN", "our_price": [{"schedule": [{"value_with_tax": precio}]}]}],
            "fulfillment_availability": [{"fulfillment_channel_code": "DEFAULT", "quantity": v["stock"]}],
        }
        if fotos:
            at["main_product_image_locator"] = [{"media_location": fotos[0], "marketplace_id": MARKETPLACE_ID}]
            for i, u in enumerate(fotos[1:8], start=1):
                at[f"other_product_image_locator_{i}"] = [{"media_location": u, "marketplace_id": MARKETPLACE_ID}]
        if variaciones:
            at["parentage_level"] = _a("child")
            at["child_parent_sku_relationship"] = [{"child_relationship_type": "variation", "parent_sku": p["sku_interno"], "marketplace_id": MARKETPLACE_ID}]
        out.append({"sku": v["sku"].strip(), "tipo": "child" if variaciones else "simple", "attrs": at})
    for l in out:
        for k, val in (extra or {}).items():
            l["attrs"][k] = val
        for k in (quitar or []):
            l["attrs"].pop(k, None)
        l["body"] = {"productType": _PRODUCT_TYPE, "requirements": "LISTING", "attributes": l["attrs"]}
    return out


def _put_listado(sku: str, body: dict, validar: bool) -> dict:
    params = {"marketplaceIds": MARKETPLACE_ID, "issueLocale": "es_MX"}
    if validar:
        params["mode"] = "VALIDATION_PREVIEW"
    return amazon_request("PUT", f"/listings/2021-08-01/items/{urllib.parse.quote(SELLER_ID, safe='')}/{urllib.parse.quote(sku, safe='')}",
                          params=params, body=body)


def _revisar_publicacion(datos: dict, validar_en_amazon: bool = True) -> dict:
    sku_interno = (datos.get("sku_interno") or "").strip()
    if not sku_interno:
        raise HTTPException(400, "Falta sku_interno")
    p, variantes = _datos_producto_amazon(sku_interno)
    if not variantes:
        raise HTTPException(409, "El modelo no tiene variantes activas con SKU")
    try:
        precio = round(float(datos["precio"]), 2) if datos.get("precio") not in (None, "") else _precio_web(p)
    except (TypeError, ValueError):
        raise HTTPException(400, "Precio inválido")
    variaciones = datos.get("variaciones", True) is not False
    listados = _construir_listados(p, variantes, precio, variaciones, datos.get("atributos_extra") or {}, datos.get("quitar") or [])
    problemas, estados, error_conexion = [], {}, None
    if validar_en_amazon:
        if not (_configurado() and SELLER_ID):
            error_conexion = "Faltan las claves de Amazon en Railway: se armó la publicación pero no se pudo revisar con Amazon."
        else:
            for l in listados:
                try:
                    r = _put_listado(l["sku"], l["body"], validar=True)
                    estados[l["sku"]] = r.get("status")
                    for i in r.get("issues") or []:
                        problemas.append({"sku": l["sku"], "gravedad": i.get("severity"), "codigo": i.get("code"),
                                          "mensaje": i.get("message"), "atributos": i.get("attributeNames") or []})
                except HTTPException as e:
                    error_conexion = f"Amazon no dejó revisar la publicación: {str(e.detail)[:300]}"
                    break
                time.sleep(0.25)
    errores = [x for x in problemas if (x.get("gravedad") or "").upper() == "ERROR"]
    return {
        "sku_interno": sku_interno, "nombre": p.get("nombre"), "precio": precio, "variaciones": variaciones,
        "listados": len(listados), "tallas": sorted({str(v.get("talla")) for v in variantes}), "colores": sorted({str(v.get("color")) for v in variantes}),
        "revisado_con_amazon": bool(validar_en_amazon and not error_conexion), "error_conexion": error_conexion,
        "estados": estados, "problemas": problemas, "errores": len(errores), "listo_para_publicar": bool(validar_en_amazon and not error_conexion and not errores),
        "ejemplo": next((l["body"] for l in listados if l["tipo"] != "parent"), None),
    }


@router.post("/publicar/revisar")
def amazon_publicar_revisar(datos: dict):
    """Arma la publicación y la VALIDA con Amazon sin crear nada. Body: {sku_interno, precio?, variaciones?, atributos_extra?, quitar?}."""
    return _revisar_publicacion(datos, True)


@router.post("/publicar")
def amazon_publicar(datos: dict):
    """Publica un modelo (familia padre + hijos por color/talla). Exige confirmar=true y que la revisión de Amazon no traiga errores."""
    if datos.get("confirmar") is not True:
        raise HTTPException(400, "Falta confirmar=true (primero usa /amazon/publicar/revisar)")
    rev = _revisar_publicacion(datos, True)
    if not rev["listo_para_publicar"]:
        return {"ok": False, "motivo": rev["error_conexion"] or "Amazon encontró errores: corrígelos y vuelve a revisar", "revision": rev}
    p, variantes = _datos_producto_amazon(rev["sku_interno"])
    listados = _construir_listados(p, variantes, rev["precio"], rev["variaciones"], datos.get("atributos_extra") or {}, datos.get("quitar") or [])
    resultados, fallos = [], 0
    for l in sorted(listados, key=lambda x: 0 if x["tipo"] == "parent" else 1):   # el padre primero
        try:
            r = _put_listado(l["sku"], l["body"], validar=False)
            resultados.append({"sku": l["sku"], "estado": r.get("status"), "problemas": r.get("issues")})
            if r.get("status") not in ("ACCEPTED", "VALID"):
                fallos += 1
        except HTTPException as e:
            resultados.append({"sku": l["sku"], "error": str(e.detail)[:300]}); fallos += 1
        time.sleep(0.25)
    try:
        supabase_post("amazon_publicaciones", {"producto_id": p["id"], "sku_interno": rev["sku_interno"], "exito": fallos == 0,
                                               "error": None if fallos == 0 else f"{fallos} listado(s) con problema"})
    except Exception as e:
        print(f"[amazon] no se pudo registrar la publicación: {e}")
    return {"ok": fallos == 0, "publicados": len(resultados) - fallos, "fallidos": fallos, "resultados": resultados}
