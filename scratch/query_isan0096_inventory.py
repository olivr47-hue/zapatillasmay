import os, json, urllib.request
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def supabase_get(endpoint):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Accept": "application/json"
    })
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

# First, find product ID for I-SAN-0096
prod = supabase_get("productos?sku_interno=eq.I-SAN-0096")
prod_id = prod[0]["id"]

variants = supabase_get(f"variantes?producto_id=eq.{prod_id}")
vids = [v["id"] for v in variants]
vids_str = ",".join(vids)

inv_rows = supabase_get(f"inventario?variante_id=in.({vids_str})")
inv_map = {}
for row in inv_rows:
    vid = row["variante_id"]
    inv_map[vid] = inv_map.get(vid, 0) + (row.get("cantidad") or 0)

print("--- INVENTORY OF I-SAN-0096 ---")
for v in sorted(variants, key=lambda x: (x["color"] or "", x["talla"] or "")):
    qty = inv_map.get(v["id"], 0)
    print(f"SKU: {v['sku']} | Color: {v['color']} | Talla: {v['talla']} | Active: {v['activa']} | Stock: {qty}")
