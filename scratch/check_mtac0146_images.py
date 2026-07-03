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

print("--- IMAGES OF M-TAC-0146 VARIANTS ---")
variants = supabase_get("variantes?sku=ilike.M-TAC-0146*&select=sku,imagenes,foto_url")
for v in variants:
    imgs = v.get("imagenes") or []
    f_url = v.get("foto_url")
    print(f"SKU: {v['sku']} | Images count: {len(imgs)} | Has foto_url: {bool(f_url)}")
