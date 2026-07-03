import urllib.request, json

def search_sku(sku):
    url = f"https://zapatillasmay-production.up.railway.app/ml/items"
    # Wait, the production /ml/items returns all items.
    # Let's call it and search in the returned items for the SKU.
    # But wait, does /ml/items return paused/closed items too?
    # Let's check:
    # _get_all_item_ids() queries: /users/{ML_USER_ID}/items/search?limit=100
    # Search API in MercadoLibre by default returns both active and paused items.
    # Let's query the production API to search for all items, and check if any item matches the SKU.
    pass

# Actually, let's write a script that queries the ML API directly using the token to search for M-TAC-0146-CAFE-25_5
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))
ML_TOKEN = os.getenv("ML_ACCESS_TOKEN")
ML_USER_ID = os.getenv("ML_USER_ID")

def ml_get(path):
    url = f"https://api.mercadolibre.com{path}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {ML_TOKEN}"})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"Error {path}: {e}")
        return None

print("Searching by SKU M-TAC-0146-CAFE-25_5...")
res = ml_get(f"/users/{ML_USER_ID}/items/search?q=M-TAC-0146-CAFE-25_5")
if res:
    print(json.dumps(res, indent=2))
