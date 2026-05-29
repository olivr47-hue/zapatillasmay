# -*- coding: utf-8 -*-
"""
ml_inventario.py
================
Sincroniza el stock de tus 3 publicaciones de MercadoLibre con el ERP (Supabase).

Uso:
    python ml_inventario.py            # muestra resumen de items y stock actual
    python ml_inventario.py --sync     # sincroniza el stock desde Supabase a ML

Requiere:
    pip install requests python-dotenv

Publicaciones (catálogo ML):
    MLMU4011297427  Sandalia tacón con plataforma
    MLMU4011417333  Sandalia plataforma corrida / sueco yute
    MLMU4024786106  Sandalia tacón alto para fiesta
"""

import os, sys, json, urllib.request, urllib.parse, urllib.error
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# ─── Configuración ────────────────────────────────────────────────────────────
ML_TOKEN   = os.getenv("ML_ACCESS_TOKEN", "")
ML_USER_ID = os.getenv("ML_USER_ID", "381682237")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Catálogos de tus 3 publicaciones
CATALOGOS = {
    "MLMU4011297427": "Sandalia tacon con plataforma",
    "MLMU4011417333": "Sandalia plataforma corrida / yute",
    "MLMU4024786106": "Sandalia tacon alto para fiesta",
}

ML_BASE = "https://api.mercadolibre.com"

# ─── Helpers HTTP ─────────────────────────────────────────────────────────────

def ml_get(path):
    url = ML_BASE + path
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {ML_TOKEN}"})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = json.loads(e.read())
        print(f"  ERROR {e.code} en {path}: {body.get('message','')}")
        return None

def ml_put(path, data):
    url = ML_BASE + path
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        url, data=body,
        headers={"Authorization": f"Bearer {ML_TOKEN}", "Content-Type": "application/json"},
        method="PUT"
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = json.loads(e.read())
        print(f"  ERROR {e.code} en PUT {path}: {body.get('message','')}")
        return None

def supabase_get(endpoint):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Accept": "application/json"
    })
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

# ─── 1. Encontrar los Item IDs reales de las 3 publicaciones ──────────────────

def obtener_mis_items():
    """Devuelve todos los Item IDs (MLM...) del vendedor."""
    ids = []
    scroll = None
    while True:
        path = f"/users/{ML_USER_ID}/items/search?limit=100"
        if scroll:
            path += f"&scroll_id={scroll}"
        resp = ml_get(path)
        if not resp:
            break
        items = resp.get("results", [])
        ids.extend(items)
        scroll = resp.get("scroll_id")
        if not items or not scroll:
            break
    return ids

def encontrar_items_por_catalogo(item_ids, catalogos_objetivo):
    """
    Para cada Item ID, obtiene el detalle y filtra los que pertenecen
    a uno de los catálogos objetivo (MLMU...).
    Devuelve: { catalog_id: { item_id, title, variations, available_quantity } }
    """
    encontrados = {}
    print(f"\nRevisando {len(item_ids)} publicaciones tuyas en ML...")

    # ML permite traer hasta 20 items por batch
    for i in range(0, len(item_ids), 20):
        batch = item_ids[i:i+20]
        ids_str = ",".join(batch)
        resp = ml_get(f"/items?ids={ids_str}&attributes=id,title,catalog_product_id,available_quantity,variations,status")
        if not resp:
            continue
        for entry in resp:
            if entry.get("code") != 200:
                continue
            item = entry.get("body", {})
            cat_id = item.get("catalog_product_id", "")
            if cat_id in catalogos_objetivo:
                item_id = item["id"]
                print(f"  OK: {item_id} -> {cat_id} | {item.get('title','')[:50]}")
                encontrados[cat_id] = {
                    "item_id":    item_id,
                    "title":      item.get("title", ""),
                    "status":     item.get("status", ""),
                    "qty":        item.get("available_quantity", 0),
                    "variations": item.get("variations", []),
                }

    # Items no encontrados
    for cat_id, nombre in catalogos_objetivo.items():
        if cat_id not in encontrados:
            print(f"  NO encontrado: {cat_id} ({nombre})")

    return encontrados

# ─── 2. Stock desde Supabase ──────────────────────────────────────────────────

def stock_supabase():
    """Lee inventario total por SKU desde Supabase."""
    rows = supabase_get("inventario?select=variante_id,cantidad")
    # Sumar stock de todas las sucursales por variante
    stock: dict = {}
    for r in rows:
        vid = r.get("variante_id")
        if vid:
            stock[vid] = stock.get(vid, 0) + (r.get("cantidad") or 0)
    return stock

def variantes_supabase():
    """Lee variantes activas con su SKU."""
    return supabase_get("variantes?activa=eq.true&select=id,sku,color,talla,producto_id")

# ─── 3. Sincronizar stock ML ──────────────────────────────────────────────────

def actualizar_qty_item(item_id, nueva_qty):
    """Actualiza el stock total de un item sin variaciones."""
    print(f"  PUT /items/{item_id} -> available_quantity: {nueva_qty}")
    return ml_put(f"/items/{item_id}", {"available_quantity": nueva_qty})

def actualizar_qty_variacion(item_id, var_id, nueva_qty):
    """Actualiza el stock de una variación específica."""
    print(f"  PUT /items/{item_id}/variations/{var_id} -> available_quantity: {nueva_qty}")
    return ml_put(f"/items/{item_id}/variations/{var_id}", {"available_quantity": nueva_qty})

def sincronizar(items_ml, stock_erp, variantes_erp):
    """
    Para cada item de ML, intenta hacer match con el SKU del ERP
    y actualiza la cantidad disponible.
    """
    print("\n=== SINCRONIZANDO STOCK ===\n")
    stock_por_sku = {}
    for v in variantes_erp:
        sku = (v.get("sku") or "").strip()
        vid = v.get("id")
        if sku and vid in stock_erp:
            stock_por_sku[sku.upper()] = stock_erp[vid]

    for cat_id, item in items_ml.items():
        item_id  = item["item_id"]
        variaciones = item["variations"]
        nombre   = CATALOGOS.get(cat_id, cat_id)
        print(f"Publicacion: {nombre}")
        print(f"  Item ID: {item_id}")

        if not variaciones:
            # Item simple — actualizar cantidad total
            # Busca el SKU del ERP que coincida
            # Para items sin variaciones no hay SKU directo en ML, usar stock acumulado
            qty_total = sum(stock_erp.values())  # ajustar según lógica de negocio
            actualizar_qty_item(item_id, qty_total)
        else:
            # Item con variaciones — iterar cada variación
            for var in variaciones:
                var_id = var.get("id")
                # Buscar el SKU del vendedor en los atributos de la variación
                seller_sku = ""
                for attr in var.get("attribute_combinations", []):
                    pass
                for attr in var.get("attributes", []):
                    if attr.get("id") == "SELLER_SKU":
                        seller_sku = (attr.get("value_name") or "").upper().strip()
                        break

                if seller_sku and seller_sku in stock_por_sku:
                    nueva_qty = stock_por_sku[seller_sku]
                    actualizar_qty_variacion(item_id, var_id, nueva_qty)
                else:
                    print(f"  SKIP variacion {var_id} (SKU '{seller_sku}' no encontrado en ERP)")
        print()

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    sync_mode = "--sync" in sys.argv

    if not ML_TOKEN or ML_TOKEN == "tu_access_token_de_pruebas":
        print("ERROR: Configura ML_ACCESS_TOKEN en el .env")
        print("El token debe empezar con APP_USR- o similar")
        print("Obtenlo en: https://developers.mercadolibre.com.mx/apps")
        sys.exit(1)

    print("=== ML INVENTARIO — Zapatillas May ===")
    print(f"Vendedor: {ML_USER_ID}")
    print(f"Publicaciones a gestionar: {len(CATALOGOS)}")

    # Paso 1: encontrar los Item IDs reales
    print("\n[1/3] Buscando tus publicaciones en ML...")
    item_ids = obtener_mis_items()
    print(f"  Total publicaciones encontradas: {len(item_ids)}")

    items_ml = encontrar_items_por_catalogo(item_ids, set(CATALOGOS.keys()))

    if not items_ml:
        print("\nNo se encontraron publicaciones. Verifica el token y los IDs de catalogo.")
        sys.exit(1)

    # Mostrar resumen
    print("\n=== RESUMEN ===")
    for cat_id, item in items_ml.items():
        print(f"  {item['item_id']}  |  {item['status']}  |  stock={item['qty']}  |  {CATALOGOS[cat_id]}")
        if item['variations']:
            for v in item['variations'][:3]:
                attrs = {a['id']: a.get('value_name','') for a in v.get('attributes',[])}
                print(f"    VAR {v['id']} | SKU={attrs.get('SELLER_SKU','-')} | qty={v.get('available_quantity',0)}")
            if len(item['variations']) > 3:
                print(f"    ... y {len(item['variations'])-3} variaciones más")

    if sync_mode:
        # Paso 2: leer stock del ERP
        print("\n[2/3] Leyendo stock desde Supabase...")
        stock_erp  = stock_supabase()
        variantes  = variantes_supabase()
        print(f"  {len(variantes)} variantes | {sum(stock_erp.values())} pares en stock")

        # Paso 3: sincronizar
        print("\n[3/3] Actualizando stock en ML...")
        sincronizar(items_ml, stock_erp, variantes)
        print("\nListo.")
    else:
        print("\nEjecuta con --sync para actualizar el stock en ML:")
        print("  python ml_inventario.py --sync")

if __name__ == "__main__":
    main()
