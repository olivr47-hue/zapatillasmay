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

print("--- PUBLICACIONES_ML OF M-TAC-0146 ---")
publis = supabase_get("publicaciones_ml?sku=ilike.M-TAC-0146*&select=id,sku,item_id,status,created_at")
for p in publis:
    print(f"ID: {p['id']} | SKU: {p['sku']} | ItemID: {p['item_id']} | Status: {p['status']} | Created: {p['created_at']}")
