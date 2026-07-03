import re

filepath = "C:/Users/User/.gemini/antigravity/brain/984c4385-f55e-450e-9cd0-be0f86888af8/.system_generated/tasks/task-142.log"

products = {} # { psku: { color: [tallas] } }

with open(filepath, 'r', encoding='utf-8') as f:
    for line in f:
        # Match pattern: Product: SKU (Name) | Color: '...' | Tallas: [...]
        match = re.search(r"Product:\s*([^\s\(]+)[^|]*\|\s*Color:\s*'([^']+)'\s*\|\s*Tallas:\s*(\[[^\]]*\])", line)
        if match:
            psku = match.group(1)
            color = match.group(2).strip().lower()
            tallas = eval(match.group(3))
            if psku not in products:
                products[psku] = {}
            products[psku][color] = tallas

print("Products with both Vino and Cafe variants:")
for psku, colors in products.items():
    has_vino = any('vino' in c for c in colors)
    has_cafe = any('cafe' in c or 'café' in c for c in colors)
    if has_vino and has_cafe:
        print(f"Product: {psku}")
        for c, t in colors.items():
            if 'vino' in c or 'cafe' in c or 'café' in c:
                print(f"  Color: '{c}' -> Tallas: {t}")
