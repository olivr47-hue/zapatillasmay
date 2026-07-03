import os, json, urllib.request
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))
ML_TOKEN = os.getenv("ML_ACCESS_TOKEN")
ML_USER_ID = os.getenv("ML_USER_ID")
ML_BASE = "https://api.mercadolibre.com"

def ml_get(path):
    url = ML_BASE + path
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {ML_TOKEN}"})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"Error {path}: {e}")
        return None

# Search recent items
print("Searching recent items in ML...")
search_url = f"/users/{ML_USER_ID}/items/search?limit=10&sort=date_created_desc"
resp = ml_get(search_url)
if resp:
    results = resp.get("results", [])
    print(f"Total items found: {len(results)}")
    if results:
        # Fetch details in batch
        ids_str = ",".join(results)
        details = ml_get(f"/items?ids={ids_str}&attributes=id,title,catalog_product_id,status,seller_sku,price,attributes,variations,date_created")
        if details:
            for item_resp in details:
                if item_resp.get("code") == 200:
                    body = item_resp.get("body", {})
                    print(f"\nItem: {body.get('id')} | Title: {body.get('title')} | Created: {body.get('date_created')} | Status: {body.get('status')}")
                    # Print variations or attributes
                    sku = ""
                    for attr in body.get("attributes", []):
                        if attr.get("id") == "SELLER_SKU":
                            sku = attr.get("value_name")
                    print(f"  Seller SKU: {sku}")
                    vars = body.get("variations", [])
                    print(f"  Variations count: {len(vars)}")
                    for var in vars:
                        v_sku = ""
                        v_color = ""
                        v_size = ""
                        for comb in var.get("attribute_combinations", []):
                            if comb.get("id") == "COLOR":
                                v_color = comb.get("value_name")
                            if comb.get("id") == "SIZE":
                                v_size = comb.get("value_name")
                        for attr in var.get("attributes", []):
                            if attr.get("id") == "SELLER_SKU":
                                v_sku = attr.get("value_name")
                        print(f"    Var ID: {var.get('id')} | SKU: {v_sku} | Color: {v_color} | Size: {v_size}")
else:
    print("Could not search items.")
