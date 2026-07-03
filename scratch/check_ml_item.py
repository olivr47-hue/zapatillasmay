import urllib.request, json

def check_item(item_id):
    url = f"https://zapatillasmay-production.up.railway.app/ml/item/{item_id}"
    print(f"\n--- ITEM {item_id} DETAILS ---")
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as r:
            item = json.loads(r.read())
            print(f"Title: {item.get('title')}")
            print(f"Category: {item.get('category_id')}")
            print(f"Status: {item.get('status')}")
            print("Attributes:")
            for attr in item.get("attributes", []):
                if attr.get("id") in ["SELLER_SKU", "SIZE", "COLOR", "MAIN_COLOR", "SIZE_GRID_ID", "SIZE_GRID_ROW_ID"]:
                    print(f"  {attr.get('id')}: {attr.get('value_name')} (ID: {attr.get('value_id')})")
    except Exception as e:
        print(f"Error checking {item_id}: {e}")

# Check one Cafe item and one Vino item
check_item("MLM3076091121")  # Cafe 24
check_item("MLM3075945019")  # Vino 24
