import urllib.request, json

items = [
    "MLM5625637170", "MLM5625637178", "MLM5625668366", "MLM3076657339",
    "MLM5625668370", "MLM3076657343", "MLM3076657345", "MLM5625637188",
    "MLM3076635181", "MLM3076657367", "MLM3076657373", "MLM5625668390",
    "MLM5625668396", "MLM5625668398", "MLM3076635185", "MLM5625668402",
    "MLM5625637212", "MLM3076657387", "MLM3076635193", "MLM3076635195",
    "MLM3076635197", "MLM3076635199", "MLM5625637216", "MLM5625668412",
    "MLM3076657405", "MLM3076657407", "MLM5625637222", "MLM3076657409"
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
