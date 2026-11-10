"""
tiktok_nuevos.py -- subir modelos NUEVOS del ERP a TikTok Shop por la API (mismo patron que «Publicar nuevo» de MercadoLibre/SHEIN/Walmart):

  lista_nuevos()        modelos del ERP que todavia no estan en TikTok, con lo que les falta para poder subirse
  armar_payload(...)    arma el producto (categoria, marca, fotos, SKUs con color/talla, precio, existencias, medidas del paquete)
  publicar_modelo(...)  sube las fotos, crea el producto (como BORRADOR de prueba o publicado) y lo registra en tiktok_publicaciones

Datos de la tienda confirmados con TikTok (2026-11-10, consulta de solo lectura): marca ZAPATILLAS MAY, bodega de ventas «BODEGA MAY»,
categorias de calzado de mujer (hojas), medidas de paquete obligatorias, guia de tallas y certificaciones NO obligatorias.
"""
import re
import time
import uuid
import unicodedata
import urllib.request
import urllib.parse

from database import supabase_get, supabase_get_all, supabase_post

BRAND_ID = "7592676483462629121"          # ZAPATILLAS MAY
WAREHOUSE_ID = "7497489194144007957"      # BODEGA MAY (SALES_WAREHOUSE)
SIZE_CHART_ID = "7542589447142508295"     # la misma guia de tallas que usa el Excel
# categoria del ERP -> categoria hoja de TikTok (Calzado > Zapatos para mujer)
CAT_TIKTOK = {"tacones": "601396", "plataformas": "601396", "sandalias": "901128", "botas": "601409", "botines": "601409",
              "flats": "901000", "tenis": "900872", "nina": "900872"}
CAT_TIKTOK_DEFECTO = "900872"
NOMBRE_CAT_TIKTOK = {"601396": "Zapatos de tacón", "901128": "Sandalias y chanclas", "601409": "Botas", "901000": "Zapatos planos", "900872": "Zapatillas informales"}
ATRIBUTO_COLOR_ID = "100000"
ATRIBUTO_TALLA_ID = "100007"


def _limpio_sku(s):
    """Texto apto para el SKU de vendedor de TikTok (solo letras, numeros, guion y guion bajo)."""
    s = unicodedata.normalize("NFKD", str(s or "")).encode("ascii", "ignore").decode()
    return re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_")


def _sku_vendedor(spu, color, talla):
    return f"{spu}-{_limpio_sku(color) or 'Unico'}-{_limpio_sku(talla) or 'Unica'}"[:50]


def _precio_tiktok(p):
    """Precio de la tienda (panel +$80, salvo ofertas) +$65 que cubre el IVA que TikTok cobra sobre el precio publicado (igual que el Excel)."""
    return float(p.get("precio_menudeo") or 0) + (0 if p.get("es_oferta") else 80) + 65


def _nombre_ok(nombre):
    n = (nombre or "").strip()
    return len(n) >= 14 and " " in n


def _titulo_limpio(t):
    t = re.sub(r"[\U0001F000-\U0001FFFF☀-➿]", "", str(t or ""))
    t = re.sub(r"\s+", " ", t).strip()
    return t[:300]


def _descripcion_html(p, titulo):
    base = (p.get("descripcion") or "").strip()
    base = re.sub(r"<[^>]+>", " ", base)
    base = re.sub(r"[\U0001F000-\U0001FFFF☀-➿]", "", base)
    base = re.sub(r"\s+", " ", base).strip()
    if len(base) < 40:
        base = (f"{titulo}. Calzado para dama fabricado en Leon, Guanajuato. Consulta la tabla de tallas y elige tu talla y color. "
                "Envio a todo Mexico.")
    base = base.replace("&", "y").replace("<", "").replace(">", "")
    return f"<p>{base[:4000]}</p>"


def lista_nuevos(catalogo, cargado):
    """Modelos del ERP que NO estan en TikTok. catalogo = productos de TikTok (con skus); cargado = _cargar_erp()."""
    from routers.tiktok_excel import _spu_de, _ALIAS_ID
    productos, vars_por_prod, inv, inv_por_sku = cargado
    vivos, eliminados = set(), set()
    for tp in catalogo:
        destino = eliminados if tp.get("status") == "DELETED" else vivos
        for s in tp.get("skus") or []:
            sv = (s.get("seller_sku") or "").strip()
            spu, _r = _spu_de(sv, inv_por_sku) if sv else (None, [])
            if spu is not None:
                destino.add(_ALIAS_ID.get(spu, spu))
    try:
        ya = {r["sku_interno"] for r in (supabase_get_all("tiktok_publicaciones?exito=eq.true&select=sku_interno") or []) if r.get("sku_interno")}
    except Exception:
        ya = set()
    salida = []
    for p in productos:
        if (p.get("categoria") or "").lower().strip() == "accesorios":
            continue
        spu = p.get("sku_interno") or str(p["id"])
        if (p.get("nombre") or "").lower().startswith("oferta") or spu.lower().startswith("oferta"):
            continue
        if spu in vivos or spu in ya:
            continue
        vs = vars_por_prod.get(p["id"], [])
        colores = {}
        for v in vs:
            c = (v.get("color") or "Unico").strip()
            fotos = [u for u in ([v.get("foto_url")] + list(v.get("imagenes") or [])) if u]
            colores.setdefault(c, set()).update(fotos)
        todas = set().union(*colores.values()) if colores else set()
        if p.get("imagen_principal"):
            todas.add(p["imagen_principal"])
        stock = sum(inv.get(v["id"], 0) for v in vs)
        problemas = []
        if not vs:
            problemas.append("sin tallas/colores activos")
        if not todas:
            problemas.append("sin fotos")
        if not _nombre_ok(p.get("nombre")):
            problemas.append("el nombre es solo un codigo: ponle un nombre descriptivo (TikTok lo rechaza)")
        if not float(p.get("precio_menudeo") or 0):
            problemas.append("sin precio")
        if len(vs) > 300:
            problemas.append("mas de 300 SKUs")
        if stock <= 0:
            problemas.append("sin existencias")
        cat = CAT_TIKTOK.get((p.get("categoria") or "").lower().strip(), CAT_TIKTOK_DEFECTO)
        salida.append({"id": p["id"], "sku_interno": spu, "nombre": p.get("nombre"), "categoria_erp": p.get("categoria"),
                       "categoria_tiktok": NOMBRE_CAT_TIKTOK.get(cat, cat), "colores": len(colores), "skus": len(vs), "fotos": len(todas), "stock": stock,
                       "precio_tiktok": round(_precio_tiktok(p), 2), "estaba_eliminado": spu in eliminados,
                       "problemas": problemas, "listo": not problemas})
    salida.sort(key=lambda x: (not x["listo"], x["estaba_eliminado"], x["nombre"] or ""))
    return salida


def _fotos_para(p, vs, maximo=9):
    """(galeria, foto_por_color): galeria = portada y luego una de cada color por turnos (hasta 9); foto_por_color = primera foto de cada color."""
    from routers.tiktok_excel import _resize_cloudinary
    vistas, galeria = set(), []

    def agrega(u):
        if u and u not in vistas and len(galeria) < maximo:
            vistas.add(u)
            galeria.append(u)
    agrega(p.get("imagen_principal"))
    colas, por_color = {}, {}
    for v in vs:
        c = (v.get("color") or "Unico").strip()
        fotos = [x for x in ([v.get("foto_url")] + list(v.get("imagenes") or [])) if x]
        cola = colas.setdefault(c, [])
        for f in fotos:
            if f not in cola:
                cola.append(f)
    for c, cola in colas.items():
        if cola:
            por_color[c] = cola[0]
    ronda = 0
    while len(galeria) < maximo and any(ronda < len(c) for c in colas.values()):
        for c in colas.values():
            if ronda < len(c):
                agrega(c[ronda])
        ronda += 1
    if not galeria and por_color:
        galeria = list(por_color.values())[:maximo]
    return [_resize_cloudinary(u) for u in galeria], {c: _resize_cloudinary(u) for c, u in por_color.items()}


def armar_payload(p, vs, inv, uris, uri_color, titulo=None, precio=None, modo="AS_DRAFT", con_guia_tallas=True):
    spu = p.get("sku_interno") or str(p["id"])
    t = _titulo_limpio(titulo or p.get("nombre"))
    precio_final = round(float(precio) if precio else _precio_tiktok(p), 2)
    skus = []
    for v in vs:
        color = (v.get("color") or "Unico").strip()
        talla = str(v.get("talla") or "Unica").strip()
        sa_color = {"id": ATRIBUTO_COLOR_ID, "name": "Color", "value_name": color[:50]}
        if uri_color.get(color):
            sa_color["sku_img"] = {"uri": uri_color[color]}
        skus.append({
            "seller_sku": _sku_vendedor(spu, color, talla),
            "sales_attributes": [sa_color, {"id": ATRIBUTO_TALLA_ID, "name": "Talla", "value_name": talla[:50]}],
            "price": {"amount": f"{precio_final:.2f}", "currency": "MXN"},
            "inventory": [{"warehouse_id": WAREHOUSE_ID, "quantity": max(0, int(inv.get(v["id"], 0)))}],
        })
    payload = {
        "save_mode": modo,
        "title": t,
        "description": _descripcion_html(p, t),
        "category_id": CAT_TIKTOK.get((p.get("categoria") or "").lower().strip(), CAT_TIKTOK_DEFECTO),
        "brand_id": BRAND_ID,
        "main_images": [{"uri": u} for u in uris],
        "skus": skus,
        "package_weight": {"value": "1.0", "unit": "KILOGRAM"},
        "package_dimensions": {"length": "30", "width": "20", "height": "10", "unit": "CENTIMETER"},
        "idempotency_key": f"zm-{p['id']}"[:128],
        "external_product_id": spu[:200],
    }
    if con_guia_tallas:
        payload["size_chart"] = {"template": {"id": SIZE_CHART_ID}}
    return payload


def publicar_modelo(sku_interno, modo="AS_DRAFT", titulo=None, precio=None, solo_vista=False):
    """Sube las fotos y crea el producto en TikTok. modo: 'AS_DRAFT' (borrador de prueba, no se publica) o 'LISTING' (publicado, pasa a revision).
    solo_vista=True arma el producto SIN subir nada y lo devuelve para revisarlo."""
    from routers.tiktok import _contexto_tienda, _tiktok_api, _tiktok_subir_imagen
    from routers.tiktok_excel import _cargar_erp
    productos, vars_por_prod, inv, inv_por_sku = _cargar_erp()
    p = next((x for x in productos if (x.get("sku_interno") or str(x["id"])) == sku_interno), None)
    if not p:
        return {"ok": False, "error": "No se encontro el modelo en el ERP (¿esta activo?)"}
    vs = vars_por_prod.get(p["id"], [])
    if not vs:
        return {"ok": False, "error": "El modelo no tiene tallas/colores activos"}
    galeria, por_color = _fotos_para(p, vs)
    if not galeria:
        return {"ok": False, "error": "El modelo no tiene fotos"}
    if solo_vista:
        pl = armar_payload(p, vs, inv, ["(uri-1)"] * len(galeria), {c: "(uri)" for c in por_color}, titulo, precio, modo)
        return {"ok": True, "vista": True, "producto": {k: pl[k] for k in ("title", "category_id", "save_mode", "package_weight", "package_dimensions")},
                "fotos": len(galeria), "skus": len(pl["skus"]), "ejemplo_sku": pl["skus"][0]}
    ctx, err = _contexto_tienda()
    if err:
        return {"ok": False, "error": "sin conexion con TikTok"}
    access, tienda = ctx
    cipher = tienda.get("cipher", "")
    # 1) fotos: cada foto distinta se sube una sola vez
    uri_por_url, fallos = {}, []
    for u in list(dict.fromkeys(galeria + list(por_color.values()))):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as resp:
                contenido = resp.read()
            s = _tiktok_subir_imagen(access, contenido)
            uri = (s.get("data") or {}).get("uri")
            if s.get("code") == 0 and uri:
                uri_por_url[u] = uri
            else:
                fallos.append({"foto": u[-50:], "codigo": s.get("code"), "mensaje": s.get("message")})
        except Exception as e:
            fallos.append({"foto": u[-50:], "error": str(e)[:100]})
        time.sleep(0.2)
    uris = [uri_por_url[u] for u in galeria if u in uri_por_url]
    if not uris:
        return {"ok": False, "error": "No se pudo subir ninguna foto a TikTok", "fallos": fallos}
    uri_color = {c: uri_por_url[u] for c, u in por_color.items() if u in uri_por_url}
    # 2) crear el producto (si TikTok no encuentra la guia de tallas se reintenta sin ella)
    payload = armar_payload(p, vs, inv, uris, uri_color, titulo, precio, modo)
    r = _tiktok_api("POST", "/product/202309/products", access, body=payload, extra_params={"shop_cipher": cipher})
    if r.get("code") == 12052128:
        payload = armar_payload(p, vs, inv, uris, uri_color, titulo, precio, modo, con_guia_tallas=False)
        r = _tiktok_api("POST", "/product/202309/products", access, body=payload, extra_params={"shop_cipher": cipher})
    ok = r.get("code") == 0
    datos = r.get("data") or {}
    pid_tt = str(datos.get("product_id") or "")
    try:
        supabase_post("tiktok_publicaciones", {"producto_id": p["id"], "sku_interno": sku_interno, "exito": ok and bool(pid_tt), "modo": modo,
                                              "tiktok_product_id": pid_tt or None, "error": None if ok else f"{r.get('code')}: {r.get('message')}"[:500]})
    except Exception as e:
        print(f"[tiktok-nuevos] no se pudo guardar el registro: {e}")
    if not ok:
        return {"ok": False, "error": r.get("message"), "codigo": r.get("code"), "detalle": datos, "fotos_subidas": len(uris), "fallos_fotos": fallos}
    try:
        from cache import cache_set
        cache_set("tiktok_catalogo", None, ttl=1)
    except Exception:
        pass
    return {"ok": True, "modo": modo, "tiktok_product_id": pid_tt, "skus": len(payload["skus"]), "fotos_subidas": len(uris), "fallos_fotos": fallos,
            "respuesta": datos}
