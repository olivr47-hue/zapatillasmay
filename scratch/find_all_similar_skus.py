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

print("--- PRODUCTS SIMILAR TO 0096 OR SAN-0096 ---")
prods = supabase_get("productos?or=(sku_interno.ilike.*0096*,sku_interno.ilike.*096*)")
for p in prods:
    print(f"ID: {p['id']} | SKU: {p['sku_interno']} | Name: {p['nombre']}")
