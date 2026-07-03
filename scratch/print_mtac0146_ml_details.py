import urllib.request, json, concurrent.futures

url = "https://zapatillasmay-production.up.railway.app/ml/items?limit=400"
try:
    with urllib.request.urlopen(url) as r:
        data = json.loads(r.read())
        items = data.get("items", [])
        
        candidate_ids = []
        for it in items:
            sku = it.get("seller_sku") or ""
            if "M-TAC-0146" in sku:
                candidate_ids.append(it["item_id"])
                
        def check_item(item_id):
            item_url = f"https://zapatillasmay-production.up.railway.app/ml/item/{item_id}"
            try:
                req = urllib.request.Request(item_url)
                with urllib.request.urlopen(req) as r_item:
                    item_data = json.loads(r_item.read())
                    sku = ""
                    size = ""
                    color = ""
                    grid_row = ""
                    grid_id = ""
                    for attr in item_data.get("attributes", []):
                        if attr.get("id") == "SELLER_SKU":
                            sku = attr.get("value_name")
                        elif attr.get("id") == "SIZE":
                            size = attr.get("value_name")
                        elif attr.get("id") == "COLOR":
                            color = attr.get("value_name")
                        elif attr.get("id") == "SIZE_GRID_ID":
                            grid_id = attr.get("value_name")
                        elif attr.get("id") == "SIZE_GRID_ROW_ID":
                            grid_row = attr.get("value_name")
                    return {
                        "sku": sku,
                        "size": size,
                        "color": color,
                        "grid_id": grid_id,
                        "grid_row": grid_row
                    }
            except Exception:
                pass
            return None

        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            res_list = executor.map(check_item, candidate_ids)
            for res in res_list:
                if res:
                    results.append(res)
                    
        print("\n--- M-TAC-0146 LIVE DETAILS ON MERCADOLIBRE ---")
        for x in sorted(results, key=lambda i: (i["color"] or "", i["size"] or "")):
            print(f"SKU: {x['sku']} | Color: {x['color']} | Size: {x['size']} | GridID: {x['grid_id']} | GridRow: {x['grid_row']}")
            
except Exception as e:
    print(f"Error: {e}")
