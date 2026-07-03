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

print("--- PRODUCTS CREATED/UPDATED TODAY ---")
prods = supabase_get("productos?created_at=gte.2026-07-02T00:00:00Z&select=id,sku_interno,nombre,created_at")
for p in prods:
    print(f"ID: {p['id']} | SKU: {p['sku_interno']} | Name: {p['nombre']} | Created: {p['created_at']}")
    
print("\n--- VARIANTS CREATED/UPDATED TODAY ---")
variants = supabase_get("variantes?created_at=gte.2026-07-02T00:00:00Z&select=id,sku,color,talla,created_at")
for v in variants:
    print(f"ID: {v['id']} | SKU: {v['sku']} | Color: {v['color']} | Talla: {v['talla']} | Created: {v['created_at']}")
