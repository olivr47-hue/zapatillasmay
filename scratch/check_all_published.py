import urllib.request, json

items = [
    "MLM3075945019", "MLM3075945021", "MLM3075945031", "MLM3076069067",
    "MLM5623771834", "MLM5623771854", "MLM5623771860",
    "MLM3076091121", "MLM3076091143", "MLM5623771820", "MLM5623771822",
    "MLM5623771830", "MLM5623771878", "MLM5623771884"
]

for item_id in items:
    url = f"https://zapatillasmay-production.up.railway.app/ml/item/{item_id}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as r:
            item = json.loads(r.read())
            sku = "None"
            size = "None"
            grid_row = "None"
            color = "None"
            for attr in item.get("attributes", []):
                if attr.get("id") == "SELLER_SKU":
                    sku = attr.get("value_name")
                elif attr.get("id") == "SIZE":
                    size = attr.get("value_name")
                elif attr.get("id") == "SIZE_GRID_ROW_ID":
                    grid_row = attr.get("value_name")
                elif attr.get("id") == "COLOR":
                    color = attr.get("value_name")
            print(f"ID: {item_id} | Color: {color} | Size: {size} | GridRow: {grid_row} | SKU: {sku}")
    except Exception as e:
        print(f"Error {item_id}: {e}")
