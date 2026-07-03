import sys, os, json, urllib.request

# Add backend directory to path
backend_path = os.path.join(os.path.dirname(__file__), "../backend")
sys.path.append(backend_path)

from routers.mercadolibre import get_token, ML_USER_ID, ML_BASE

token = get_token()
print(f"Token obtained: {token[:10]}...")

def ml_get(path):
    url = f"{ML_BASE}{path}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"Error {path}: {e}")
        return None

sku_to_search = "M-TAC-0146-CAFE-25_5"
print(f"Searching for SKU: {sku_to_search}...")
res = ml_get(f"/users/{ML_USER_ID}/items/search?q={sku_to_search}")
if res:
    print(json.dumps(res, indent=2))
