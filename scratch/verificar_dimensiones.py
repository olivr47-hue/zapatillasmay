# -*- coding: utf-8 -*-
import os
import json
import urllib.request
import struct
from dotenv import load_dotenv

# Load env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://zulrlnivrhvwfexqktes.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
}

def _get(path, offset=0, limit=1000):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = {**_HEADERS, "Range-Unit": "items", "Range": f"{offset}-{offset+limit-1}"}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        if e.code == 416:
            return []
        raise

def get_all(path):
    todos, offset = [], 0
    while True:
        chunk = _get(path, offset)
        if not isinstance(chunk, list) or not chunk:
            break
        todos.extend(chunk)
        offset += len(chunk)
    return todos

def get_image_size(data):
    size = len(data)
    if size < 24:
        return None
    
    # PNG
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        w, h = struct.unpack('>II', data[16:24])
        return int(w), int(h)
    
    # GIF
    elif data.startswith(b'GIF89a') or data.startswith(b'GIF87a'):
        w, h = struct.unpack('<HH', data[6:10])
        return int(w), int(h)
    
    # WEBP
    elif data.startswith(b'RIFF') and data[8:12] == b'WEBP':
        if data[12:16] == b'VP8 ':
            w, h = struct.unpack('<HH', data[26:30])
            return int(w & 0x3fff), int(h & 0x3fff)
        elif data[12:16] == b'VP8L':
            b1, b2, b3, b4 = data[21:25]
            w = 1 + (((b2 & 0x3f) << 8) | b1)
            h = 1 + (((b4 & 0xf) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6))
            return int(w), int(h)
        elif data[12:16] == b'VP8X':
            w = 1 + struct.unpack('<I', data[24:27] + b'\x00')[0]
            h = 1 + struct.unpack('<I', data[27:30] + b'\x00')[0]
            return int(w), int(h)

    # JPEG
    elif data.startswith(b'\xff\xd8'):
        idx = 2
        while idx < size:
            marker = data[idx:idx+2]
            if len(marker) < 2:
                break
            if marker[0] != 0xff:
                break
            m_type = marker[1]
            if m_type in (0xd9, 0xda):
                break
            segment_len_bytes = data[idx+2:idx+4]
            if len(segment_len_bytes) < 2:
                break
            segment_len = struct.unpack('>H', segment_len_bytes)[0]
            if m_type in (0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf):
                sof_bytes = data[idx+4:idx+9]
                if len(sof_bytes) < 5:
                    break
                h, w = struct.unpack('>HH', sof_bytes[1:5])
                return int(w), int(h)
            idx += 2 + segment_len
            
    return None

def fetch_image_dimensions(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        # Download only first 150 KB to extract size
        with urllib.request.urlopen(req, timeout=5) as r:
            chunk = r.read(150000)
            return get_image_size(chunk)
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    print("Obteniendo productos y variantes de Supabase...")
    productos = get_all("productos")
    variantes = get_all("variantes")
    
    prod_map = {p["id"]: p for p in productos}
    
    print(f"Productos: {len(productos)}, Variantes: {len(variantes)}")
    
    imagenes_analizar = []
    
    # Collect all image URLs
    # 1. Main product images
    for p in productos:
        if p.get("activo") and p.get("imagen_principal"):
            url = p["imagen_principal"]
            imagenes_analizar.append({
                "tipo": "Producto Principal",
                "id": p["id"],
                "nombre": p["nombre"],
                "sku": p["sku_interno"],
                "color": "",
                "url": url
            })
            
    # 2. Variants photos
    for v in variantes:
        p = prod_map.get(v["producto_id"])
        if p and p.get("activo"):
            urls = []
            if v.get("foto_url"):
                urls.append(v["foto_url"])
            if isinstance(v.get("imagenes"), list):
                for img in v["imagenes"]:
                    if img and img not in urls:
                        urls.append(img)
            for url in urls:
                # Avoid duplicate entries for same URL
                if not any(x["url"] == url for x in imagenes_analizar):
                    imagenes_analizar.append({
                        "tipo": f"Variante ({v['color']} - Talla {v['talla']})",
                        "id": p["id"],
                        "nombre": p["nombre"],
                        "sku": p["sku_interno"],
                        "color": v["color"],
                        "url": url
                    })
                    
    print(f"Total de imágenes únicas a verificar: {len(imagenes_analizar)}")
    
    bajo_resolucion = []
    revisadas = 0
    
    for item in imagenes_analizar:
        url = item["url"]
        revisadas += 1
        print(f"[{revisadas}/{len(imagenes_analizar)}] Analizando: {item['nombre']} ({item['sku']}) - {item['tipo']}...")
        
        dims = fetch_image_dimensions(url)
        if dims:
            w, h = dims
            print(f"   -> Dimensiones: {w}x{h} px")
            if w < 500 or h < 500:
                item["w"] = w
                item["h"] = h
                bajo_resolucion.append(item)
        else:
            print("   -> No se pudieron obtener las dimensiones")
            
    print("\n" + "="*50)
    print("REPORTE DE IMÁGENES BAJO EL LÍMITE (500x500 px)")
    print("="*50)
    if bajo_resolucion:
        for idx, item in enumerate(bajo_resolucion, 1):
            print(f"{idx}. SKU: {item['sku']} | Nombre: {item['nombre']} | Color: {item['color']}")
            print(f"   Dimensiones: {item['w']}x{item['h']} px")
            print(f"   URL: {item['url']}")
            print("-" * 30)
        print(f"\nTotal de imágenes rechazadas: {len(bajo_resolucion)}")
    else:
        print("¡Excelente! No se encontraron imágenes con resolución menor a 500x500 px.")

if __name__ == "__main__":
    main()
