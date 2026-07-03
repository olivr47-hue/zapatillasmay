import urllib.request, json, concurrent.futures

url = "https://zapatillasmay-production.up.railway.app/ml/items?limit=150"
try:
    with urllib.request.urlopen(url) as r:
        data = json.loads(r.read())
        items = data.get("items", [])
        
        # Filter out items created today (I-SAN-0096, M-TAC-0146, M-TAC-0019)
        candidate_ids = []
        for it in items:
            sku = it.get("seller_sku") or ""
            if not any(prefix in sku for prefix in ["I-SAN-0096", "M-TAC-0146", "M-TAC-0019"]):
                candidate_ids.append(it["item_id"])
                
        print(f"Found {len(candidate_ids)} non-today items to inspect.")
        
        def check_item(item_id):
            item_url = f"https://zapatillasmay-production.up.railway.app/ml/item/{item_id}"
            try:
                req = urllib.request.Request(item_url)
                with urllib.request.urlopen(req) as r_item:
                    item_data = json.loads(r_item.read())
                    sku = ""
                    size = ""
                    grid_row = ""
                    grid_id = ""
                    category = item_data.get("category_id")
                    for attr in item_data.get("attributes", []):
                        if attr.get("id") == "SELLER_SKU":
                            sku = attr.get("value_name")
                        elif attr.get("id") == "SIZE":
                            size = attr.get("value_name")
                        elif attr.get("id") == "SIZE_GRID_ID":
                            grid_id = attr.get("value_name")
                        elif attr.get("id") == "SIZE_GRID_ROW_ID":
                            grid_row = attr.get("value_name")
                    return {
                        "sku": sku,
                        "size": size,
                        "grid_id": grid_id,
                        "grid_row": grid_row,
                        "category": category
                    }
            except Exception:
                pass
            return None

        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            res_list = executor.map(check_item, candidate_ids[:100])
            for res in res_list:
                if res:
                    results.append(res)
                    
        # Group by category and grid_id
        grouped = {}
        for r in results:
            key = (r["category"], r["grid_id"])
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(r)
            
        print("\n--- GRID AND CATEGORY GROUPS IN OLD ITEMS ---")
        for (cat, grid), list_items in grouped.items():
            print(f"Category: {cat} | Grid: {grid} (Count: {len(list_items)})")
            # print first 3 examples
            for x in list_items[:3]:
                print(f"  SKU: {x['sku']} | Size: {x['size']} | GridRow: {x['grid_row']}")
            
except Exception as e:
    print(f"Error: {e}")
