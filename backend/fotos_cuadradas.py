"""
fotos_cuadradas.py -- corrige las fotos YA subidas que no son 1:1 (centrándolas completas en un cuadrado, sin recortar).

Flujo (todo en segundo plano, con avance en ESTADO):
  1) iniciar_escaneo(): mide todas las fotos de Cloudinary de variantes y productos y cuenta las que no son cuadradas.
  2) iniciar_correccion(): sube una versión cuadrada de cada una y cambia la dirección en variantes (imagenes, foto_url) y productos
     (imagen_principal, imagenes, foto_limpia).
Las fotos originales NO se borran de Cloudinary y el mapa foto-vieja -> foto-nueva queda guardado (configuracion.fotos_cuadradas_respaldo)
para poder revertir con revertir().
"""
import io
import json
import threading
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

from database import supabase_get_all, supabase_patch, supabase_get, supabase_post
from cuadrar_foto import cuadrar_foto, TOLERANCIA_CUADRADA

CLAVE_RESPALDO = "fotos_cuadradas_respaldo"
ESTADO = {"fase": "libre", "corriendo": False, "total": 0, "hechas": 0, "errores": [], "terminado": False, "filas_actualizadas": 0,
          "escaneo": None, "medidas_hechas": 0, "medidas_total": 0}
_NO = {}   # fotos no cuadradas del último escaneo: url -> (ancho, alto)


def _es_cloudinary(u) -> bool:
    return isinstance(u, str) and "res.cloudinary.com" in u and "/image/upload/" in u


def _medir(url: str):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "zm", "Range": "bytes=0-32767"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return url, Image.open(io.BytesIO(r.read())).size
    except Exception:
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "zm"}), timeout=40) as r:
                return url, Image.open(io.BytesIO(r.read())).size
        except Exception:
            return url, None


def _filas():
    vs = supabase_get_all("variantes?select=id,foto_url,imagenes") or []
    ps = supabase_get_all("productos?select=id,imagen_principal,imagenes,foto_limpia") or []
    return vs, ps


def escanear() -> dict:
    vs, ps = _filas()
    urls = set()
    for v in vs:
        for u in (v.get("imagenes") or []) + [v.get("foto_url")]:
            if _es_cloudinary(u):
                urls.add(u)
    for p in ps:
        for u in (p.get("imagenes") or []) + [p.get("imagen_principal"), p.get("foto_limpia")]:
            if _es_cloudinary(u):
                urls.add(u)
    ESTADO["medidas_total"] = len(urls)
    ESTADO["medidas_hechas"] = 0
    medidas = {}
    with ThreadPoolExecutor(24) as ex:
        for u, d in ex.map(_medir, sorted(urls)):
            medidas[u] = d
            ESTADO["medidas_hechas"] += 1
    no = {u: d for u, d in medidas.items() if d and abs(d[0] - d[1]) / max(d) > TOLERANCIA_CUADRADA}
    return {"fotos": len(urls), "sin_medir": sum(1 for d in medidas.values() if not d), "no_cuadradas": no}


def _escaneo_hilo():
    try:
        r = escanear()
        no = r["no_cuadradas"]
        _NO.clear()
        _NO.update(no)
        ESTADO["escaneo"] = {"fotos_revisadas": r["fotos"], "sin_medir": r["sin_medir"], "no_cuadradas": len(no),
                             "verticales": sum(1 for d in no.values() if d[1] > d[0]),
                             "horizontales": sum(1 for d in no.values() if d[0] > d[1])}
        ESTADO["fase"] = "listo"
    except Exception as e:
        ESTADO["errores"].append(f"escaneo: {str(e)[:150]}")
        ESTADO["fase"] = "libre"
    finally:
        ESTADO["corriendo"] = False


def iniciar_escaneo() -> bool:
    if ESTADO["corriendo"]:
        return False
    ESTADO.update({"corriendo": True, "fase": "escaneando", "escaneo": None, "errores": [], "terminado": False})
    threading.Thread(target=_escaneo_hilo, daemon=True).start()
    return True


def _corregir_una(url: str) -> str:
    from storage import subir_imagen
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "zm"}), timeout=60) as r:
        datos = r.read()
    nuevo, cambio = cuadrar_foto(datos)
    if not cambio:
        return url
    return subir_imagen(nuevo, "productos")["url"]


def _aplicar(no_cuadradas: dict):
    mapa = {}
    try:
        ESTADO.update({"corriendo": True, "fase": "corrigiendo", "terminado": False, "total": len(no_cuadradas), "hechas": 0,
                       "errores": [], "filas_actualizadas": 0})
        for url in list(no_cuadradas):
            try:
                nueva = _corregir_una(url)
                if nueva != url:
                    mapa[url] = nueva
            except Exception as e:
                ESTADO["errores"].append(f"{url[-40:]}: {str(e)[:100]}")
            ESTADO["hechas"] += 1
        if mapa:
            try:
                valor = json.dumps(mapa)
                ya = supabase_get(f"configuracion?clave=eq.{CLAVE_RESPALDO}&select=id")
                if ya:
                    supabase_patch(f"configuracion?clave=eq.{CLAVE_RESPALDO}", {"valor": valor})
                else:
                    supabase_post("configuracion", {"clave": CLAVE_RESPALDO, "valor": valor})
            except Exception as e:
                ESTADO["errores"].append(f"respaldo: {str(e)[:100]}")
            vs, ps = _filas()
            for v in vs:
                imgs = v.get("imagenes") or []
                cambios = {}
                if any(u in mapa for u in imgs):
                    cambios["imagenes"] = [mapa.get(u, u) for u in imgs]
                if v.get("foto_url") in mapa:
                    cambios["foto_url"] = mapa[v["foto_url"]]
                if cambios:
                    supabase_patch(f"variantes?id=eq.{v['id']}", cambios)
                    ESTADO["filas_actualizadas"] += 1
            for p in ps:
                imgs = p.get("imagenes") or []
                cambios = {}
                if any(u in mapa for u in imgs):
                    cambios["imagenes"] = [mapa.get(u, u) for u in imgs]
                for campo in ("imagen_principal", "foto_limpia"):
                    if p.get(campo) in mapa:
                        cambios[campo] = mapa[p[campo]]
                if cambios:
                    supabase_patch(f"productos?id=eq.{p['id']}", cambios)
                    ESTADO["filas_actualizadas"] += 1
            try:
                from cache import cache_invalidate_prefix
                for pre in ("productos", "variantes", "catalogo", "tienda"):
                    cache_invalidate_prefix(pre)
            except Exception:
                pass
    except Exception as e:
        ESTADO["errores"].append(f"general: {str(e)[:150]}")
    finally:
        ESTADO["corriendo"] = False
        ESTADO["terminado"] = True
        ESTADO["fase"] = "terminado"


def iniciar_correccion() -> bool:
    if ESTADO["corriendo"] or not _NO:
        return False
    ESTADO["corriendo"] = True   # se marca ya, antes de que arranque el hilo, para que un doble clic no lance dos
    ESTADO["fase"] = "corrigiendo"
    threading.Thread(target=_aplicar, args=(dict(_NO),), daemon=True).start()
    return True


def revertir() -> dict:
    filas = supabase_get(f"configuracion?clave=eq.{CLAVE_RESPALDO}&select=valor") or []
    if not filas:
        return {"error": "no hay respaldo"}
    mapa = json.loads(filas[0]["valor"] or "{}")
    inv = {nueva: vieja for vieja, nueva in mapa.items()}
    vs, ps = _filas()
    n = 0
    for v in vs:
        imgs = v.get("imagenes") or []
        c = {}
        if any(u in inv for u in imgs):
            c["imagenes"] = [inv.get(u, u) for u in imgs]
        if v.get("foto_url") in inv:
            c["foto_url"] = inv[v["foto_url"]]
        if c:
            supabase_patch(f"variantes?id=eq.{v['id']}", c)
            n += 1
    for p in ps:
        imgs = p.get("imagenes") or []
        c = {}
        if any(u in inv for u in imgs):
            c["imagenes"] = [inv.get(u, u) for u in imgs]
        for campo in ("imagen_principal", "foto_limpia"):
            if p.get(campo) in inv:
                c[campo] = inv[p[campo]]
        if c:
            supabase_patch(f"productos?id=eq.{p['id']}", c)
            n += 1
    return {"revertidas": n}
