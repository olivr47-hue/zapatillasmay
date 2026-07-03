import urllib.request, json

url = "https://zapatillasmay-production.up.railway.app/ml/items"
print(f"Calling: {url}")
try:
    with urllib.request.urlopen(url) as r:
        data = json.loads(r.read())
        print(f"Total: {data.get('total')}")
        print(f"Con SKU: {data.get('con_sku')}")
        print(f"Sin SKU: {data.get('sin_sku')}")
        items = data.get("items", [])
        # Sort items by item_id or title
        for it in sorted(items, key=lambda x: x.get('item_id', '')):
            if any(c in it.get('title','').lower() for c in ['vino', 'cafe', 'café', 'ip832']):
                print(f"ID: {it['item_id']} | SKU: {it['seller_sku']} | Title: {it['title']} | Qty: {it['qty']} | Status: {it['status']}")
except Exception as e:
    print(f"Error calling production: {e}")
