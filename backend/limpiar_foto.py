"""
limpiar_foto.py -- deja una foto de catálogo lista: fondo blanco parejo y el zapato centrado en un cuadrado.

Pensado para las fotos crudas de la cámara (zapato de lado sobre fondo blanco/gris claro con degradado y viñeta).
No usa IA: mide el color real del fondo en las orillas (superficie cuadrática), lo convierte en blanco y recorta
alrededor de lo que se aleja del fondo (el zapato). La sombra suave del piso se conserva (sombra=True) o se quita.

Si la foto NO se parece a ese tipo de foto (fondo no parejo, zapato tocando las orillas, nada que recortar), lanza
ValueError con el motivo y el que llama conserva la foto original: nunca se sube una foto dañada.
"""
import io
import threading

import numpy as np
from PIL import Image, ImageFilter, ImageOps

MAX_ENTRADA = 3000      # px por lado: más que eso no mejora el resultado y gasta memoria
UMBRAL_ZAPATO = 28      # diferencia con el fondo (0-255) para considerar que ya es zapato y no sombra
_UNA_A_LA_VEZ = threading.Semaphore(1)   # cada foto usa ~220 MB: de una en una para no reventar la memoria del servidor
BLANCO_EN = 0.94        # lo que esté a ese % del brillo del fondo o más se vuelve blanco puro


def _fondo(a):
    """Modelo del fondo por canal: z = c0 + c1*x + c2*y + c3*x² + c4*y² + c5*x*y, ajustado a las orillas
    (donde no hay zapato) con 3 pasadas que quitan atípicos. Devuelve (lista de 3 arrays float32 h×w, residuo típico)."""
    h, w, _ = a.shape
    xn = (np.arange(w, dtype=np.float32) / w - 0.5)
    yn = (np.arange(h, dtype=np.float32) / h - 0.5)
    mh, mw = max(int(h * 0.10), 4), max(int(w * 0.06), 4)
    paso = 3
    # puntos de muestra: franjas de las 4 orillas
    ys, xs = [], []
    for (y0, y1, x0, x1) in ((0, mh, 0, w), (h - mh, h, 0, w), (0, h, 0, mw), (0, h, w - mw, w)):
        gy, gx = np.mgrid[y0:y1:paso, x0:x1:paso]
        ys.append(gy.ravel()); xs.append(gx.ravel())
    ys = np.concatenate(ys); xs = np.concatenate(xs)
    X = np.stack([np.ones(len(xs), np.float32), xn[xs], yn[ys], xn[xs] ** 2, yn[ys] ** 2, xn[xs] * yn[ys]], -1)
    fondos, residuos = [], []
    for c in range(3):
        z = a[ys, xs, c]
        m = np.ones(len(z), bool)
        for _ in range(3):
            coef, *_r = np.linalg.lstsq(X[m], z[m], rcond=None)
            res = z - X @ coef
            m = np.abs(res) < 6
            if m.sum() < len(z) * 0.5:
                raise ValueError("el fondo de las orillas no es parejo")
        residuos.append(float(np.std(res[m])))
        f = (coef[0] + coef[1] * xn[None, :] + coef[2] * yn[:, None] + coef[3] * (xn[None, :] ** 2)
             + coef[4] * (yn[:, None] ** 2) + coef[5] * xn[None, :] * yn[:, None]).astype(np.float32)
        fondos.append(f)
    return fondos, max(residuos)


def _fondo_filas(a):
    """Plan B para fotos con piso o mesa (el fondo cambia de golpe hacia abajo): el fondo de cada fila se toma de las franjas izquierda y
    derecha de ESA fila (ahi no hay zapato) y se interpola en linea recta entre ambas. Devuelve (lista de 3 arrays h×w, residuo)."""
    h, w, _ = a.shape
    mw = max(int(w * 0.05), 4)
    xn = (np.arange(w, dtype=np.float32) / max(w - 1, 1))[None, :]
    fondos, residuos = [], []
    for c in range(3):
        izq = np.median(a[:, :mw, c], axis=1)
        der = np.median(a[:, w - mw:, c], axis=1)
        k = 9   # suaviza a lo largo de la altura (quita manchas sueltas sin borrar el cambio de piso)
        pad = lambda v: np.convolve(np.pad(v, k // 2, mode="edge"), np.ones(k) / k, mode="valid")
        izq, der = pad(izq).astype(np.float32), pad(der).astype(np.float32)
        f = izq[:, None] + (der - izq)[:, None] * xn
        fondos.append(f.astype(np.float32))
        residuos.append(float(np.std(a[:, :mw, c] - f[:, :mw])))
    return fondos, max(residuos)


def limpiar_foto(data: bytes, lado: int = 2000, ocupa: float = 0.90, sombra: bool = True) -> bytes:
    with _UNA_A_LA_VEZ:
        return _limpiar(data, lado, ocupa, sombra)


def _limpiar(data, lado, ocupa, sombra):
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")
    im.thumbnail((MAX_ENTRADA, MAX_ENTRADA), Image.LANCZOS)
    a = np.asarray(im, dtype=np.float32)
    h, w, _ = a.shape
    try:
        fondos, residuo = _fondo(a)
        if residuo > 7:
            raise ValueError("el fondo no es liso (¿hay objetos o personas en las orillas?)")
    except ValueError as e1:
        # fotos con piso/mesa: el fondo cambia de golpe y la curva suave no lo alcanza -> plan B por filas
        fondos, residuo = _fondo_filas(a)
        if residuo > 9:
            raise e1
    claro = np.mean([f.mean() for f in fondos])
    if claro < 150:
        raise ValueError("el fondo es oscuro: la limpieza es para fondos blancos o gris claro")

    # zapato = lo que se aleja del fondo (la sombra suave queda bajo el umbral)
    dif = np.zeros((h, w), np.float32)
    for c in range(3):
        np.maximum(dif, np.abs(a[..., c] - fondos[c]), out=dif)
    m = Image.fromarray(((dif > UMBRAL_ZAPATO) * 255).astype(np.uint8))
    del dif
    m = m.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))
    mm = np.asarray(m) > 127
    cobertura = float(mm.mean())
    if cobertura < 0.02:
        raise ValueError("no se encontró el zapato en la foto")
    xs_v = np.where(mm.sum(0) > 3)[0]
    ys_v = np.where(mm.sum(1) > 3)[0]
    if not len(xs_v) or not len(ys_v):
        raise ValueError("no se encontró el zapato en la foto")
    x0, x1, y0, y1 = int(xs_v.min()), int(xs_v.max()), int(ys_v.min()), int(ys_v.max())
    if x0 <= 2 or y0 <= 2 or x1 >= w - 3 or y1 >= h - 3:
        raise ValueError("el zapato toca las orillas de la foto (deja más espacio alrededor)")
    if cobertura > 0.75:
        raise ValueError("la foto no parece un zapato sobre fondo liso")

    # fondo -> blanco: se divide entre el fondo estimado y se sube el blanco al 94 %
    out = np.empty((h, w, 3), np.uint8)
    k = 255.0 / BLANCO_EN
    for c in range(3):
        out[..., c] = np.clip(a[..., c] / np.maximum(fondos[c], 1.0) * k, 0, 255).astype(np.uint8)
    del a, fondos
    img = Image.fromarray(out)
    if not sombra:
        # alfa = zapato con borde suave; el resto (incluida la sombra) pasa a blanco puro
        alfa = m.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(2.5))
        img = Image.composite(img, Image.new("RGB", img.size, (255, 255, 255)), alfa)

    caja = img.crop((x0, y0, x1 + 1, y1 + 1))
    esc = (lado * ocupa) / max(caja.size)
    caja = caja.resize((max(1, round(caja.width * esc)), max(1, round(caja.height * esc))), Image.LANCZOS)
    lienzo = Image.new("RGB", (lado, lado), (255, 255, 255))
    lienzo.paste(caja, ((lado - caja.width) // 2, (lado - caja.height) // 2))
    buf = io.BytesIO()
    lienzo.save(buf, format="JPEG", quality=92, optimize=True)
    return buf.getvalue()
