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

prod = supabase_get("productos?sku_interno=eq.I-SAN-0096")
prod_id = prod[0]["id"]

variants = supabase_get(f"variantes?producto_id=eq.{prod_id}&select=sku,color,talla,created_at")
print("--- VARIANTS CREATION TIMESTAMPS ---")
for v in sorted(variants, key=lambda x: x["created_at"]):
    print(f"SKU: {v['sku']} | Created At: {v['created_at']}")
