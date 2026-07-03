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

# Get product
prod = supabase_get("productos?sku_interno=eq.I-SAN-0096")
p_id = prod[0]["id"]

# Get variants
vars = supabase_get(f"variantes?producto_id=eq.{p_id}&select=id,color,talla,sku")

# Get inventory
inv = supabase_get(f"inventario?variante_id=in.({','.join(v['id'] for v in vars)})&select=variante_id,cantidad")
stock_map = {}
for i in inv:
    stock_map[i["variante_id"]] = stock_map.get(i["variante_id"], 0) + (i["cantidad"] or 0)

print("--- SKU | Color | Talla | Stock ---")
for v in sorted(vars, key=lambda x: (x["color"], float(x["talla"]))):
    print(f"SKU: {v['sku']} | Color: {v['color']} | Talla: {v['talla']} | Stock: {stock_map.get(v['id'], 0)}")
