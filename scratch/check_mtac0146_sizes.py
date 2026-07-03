import urllib.request, json

items = [
    "MLM5625625400", "MLM5625490674", "MLM5625625404", "MLM5625490680",
    "MLM3076551829", "MLM5625338404", "MLM5625490688", "MLM5625490690",
    "MLM5625625410", "MLM3076551837", "MLM3076551841", "MLM5625490698",
    "MLM5625625414"
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
