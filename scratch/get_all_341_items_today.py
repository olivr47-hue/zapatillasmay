import urllib.request, json, concurrent.futures

url = "https://zapatillasmay-production.up.railway.app/ml/items?limit=400"
print(f"Calling: {url}")
try:
    with urllib.request.urlopen(url) as r:
        data = json.loads(r.read())
        items = data.get("items", [])
        print(f"Total items in response: {len(items)}")
        
        item_ids = [it["item_id"] for it in items]
        print(f"Checking all {len(item_ids)} items for creation date...")
        
        def check_item(item_id):
            item_url = f"https://zapatillasmay-production.up.railway.app/ml/item/{item_id}"
            try:
                req = urllib.request.Request(item_url)
                with urllib.request.urlopen(req) as r_item:
                    item_data = json.loads(r_item.read())
                    created = item_data.get("date_created", "")
                    if created.startswith("2026-07-02") or created.startswith("2026-07-03"):
                        sku = ""
                        category = item_data.get("category_id")
                        for attr in item_data.get("attributes", []):
                            if attr.get("id") == "SELLER_SKU":
                                sku = attr.get("value_name")
                        return {
                            "item_id": item_id,
                            "sku": sku,
                            "title": item_data.get("title"),
                            "created": created,
                            "status": item_data.get("status"),
                            "category": category
                        }
            except Exception as e:
                pass
            return None

        created_today = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=30) as executor:
            results = executor.map(check_item, item_ids)
            for res in results:
                if res:
                    created_today.append(res)
                    
        print(f"\n--- ALL ITEMS CREATED TODAY ({len(created_today)}) ---")
        for x in sorted(created_today, key=lambda i: i["created"]):
            print(f"ID: {x['item_id']} | SKU: {x['sku']} | Created: {x['created']} | Cat: {x['category']} | Title: {x['title']}")
            
except Exception as e:
    print(f"Error: {e}")
