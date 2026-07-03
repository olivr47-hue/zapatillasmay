import os, json, urllib.request, urllib.parse
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Accept": "application/json"
}

def supabase_get_all(tabla_base, page_size=1000):
    todos = []
    offset = 0
    url = f"{SUPABASE_URL}/rest/v1/{tabla_base}"
    while True:
        headers = {
            **HEADERS,
            "Range-Unit": "items",
            "Range": f"{offset}-{offset + page_size - 1}"
        }
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req) as response:
                chunk = json.loads(response.read())
        except urllib.error.HTTPError as e:
            if e.code == 416:
                break
            break
        except Exception:
            break
        if not isinstance(chunk, list):
            break
        todos.extend(chunk)
        if len(chunk) < page_size:
            break
        offset += page_size
    return todos

print("--- FETCHING ALL VARIANTS PAGINATED ---")
q_params = urllib.parse.quote("activa=eq.true&or=(color.ilike.*vino*,color.ilike.*cafe*,color.ilike.*café*)")
variants = supabase_get_all(f"variantes?{q_params}")
print(f"Total variants found: {len(variants)}")

prods_cache = {}
for v in variants:
    pid = v["producto_id"]
    if pid not in prods_cache:
        url = f"productos?id=eq.{pid}&select=sku_interno,nombre"
        p_info = supabase_get_all(url)
        prods_cache[pid] = p_info[0] if p_info else {"sku_interno": "None", "nombre": "None"}
    p = prods_cache[pid]
    v["sku_interno"] = p.get("sku_interno")
    v["nombre"] = p.get("nombre")

by_prod_color = {}
for v in variants:
    key = (v["producto_id"], v["sku_interno"], v["nombre"], (v["color"] or "").strip())
    if key not in by_prod_color:
        by_prod_color[key] = []
    by_prod_color[key].append(v["talla"])

for (pid, psku, pname, color), tallas in sorted(by_prod_color.items(), key=lambda x: x[0][1] or ""):
    tallas_sorted = sorted(tallas, key=lambda x: float(x.replace('_', '.')) if x.replace('_', '.').replace('.', '', 1).isdigit() else 99)
    print(f"Product: {psku} ({pname}) | Color: '{color}' | Tallas: {tallas_sorted} (count: {len(tallas_sorted)})")
