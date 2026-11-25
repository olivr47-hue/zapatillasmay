"""
cuadrar_foto.py -- deja una foto en formato 1:1 SIN recortarla.

Las fotos que no son cuadradas (retrato de modelo, foto horizontal...) se mostraban recortadas por el centro en la tienda, los
catálogos y los marketplaces (a veces casi sin zapato). Aquí se centra la foto completa sobre un lienzo cuadrado: lo que sobra a los
lados (o arriba y abajo) se rellena con el color del fondo de la propia foto si es parejo (blanco o gris claro) o con blanco si no.

Si la foto ya es cuadrada (diferencia menor al 2%) se devuelve tal cual, sin recomprimirla.
"""
import io

import numpy as np
from PIL import Image, ImageOps

LADO_MAX = 2000          # px del lado del cuadrado resultante (no se agranda una foto chica)
TOLERANCIA_CUADRADA = 0.02


def _color_fondo(im: Image.Image):
    """Color de relleno: mediana de las orillas si son parejas y claras; si no, blanco."""
    a = np.asarray(im.convert("RGB"), dtype=np.float32)
    h, w, _ = a.shape
    m = max(int(min(h, w) * 0.03), 2)
    orillas = np.concatenate([a[:m].reshape(-1, 3), a[-m:].reshape(-1, 3), a[:, :m].reshape(-1, 3), a[:, -m:].reshape(-1, 3)])
    med = np.median(orillas, axis=0)
    dispersion = float(np.mean(np.abs(orillas - med)))
    if dispersion <= 8 and float(med.min()) >= 200:     # fondo parejo y claro -> se reutiliza ese tono
        return tuple(int(round(c)) for c in med)
    return (255, 255, 255)


def cuadrar_foto(data: bytes) -> tuple:
    """Devuelve (bytes_jpeg, cambio: bool). cambio=False si la foto ya era cuadrada (se devuelve el original)."""
    im = Image.open(io.BytesIO(data))
    im = ImageOps.exif_transpose(im)
    w, h = im.size
    if abs(w - h) / max(w, h) <= TOLERANCIA_CUADRADA:
        return data, False
    if im.mode in ("RGBA", "LA", "P"):
        fondo = Image.new("RGB", im.size, (255, 255, 255))
        fondo.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
        im = fondo
    else:
        im = im.convert("RGB")
    lado = max(w, h)
    lienzo = Image.new("RGB", (lado, lado), _color_fondo(im))
    lienzo.paste(im, ((lado - w) // 2, (lado - h) // 2))
    if lado > LADO_MAX:
        lienzo = lienzo.resize((LADO_MAX, LADO_MAX), Image.LANCZOS)
    salida = io.BytesIO()
    lienzo.save(salida, format="JPEG", quality=92, optimize=True)
    return salida.getvalue(), True
