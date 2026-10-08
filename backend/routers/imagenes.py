from fastapi import APIRouter, UploadFile, File, Depends
from security import require_staff
from fastapi.responses import JSONResponse, Response, RedirectResponse
from storage import subir_imagen, eliminar_imagen, subir_video
import cloudinary.uploader
import urllib.request as _urllib
import urllib.error
import urllib.parse as _up
import os

router = APIRouter(prefix="/imagenes", tags=["Imágenes"])

_SUPABASE_URL = os.getenv("SUPABASE_URL", "")
_SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")


def _subir_pdf_supabase(contenido: bytes, filename: str) -> str:
    """Sube un PDF al bucket wa-media (ya existe) y devuelve la URL pública."""
    if not _SUPABASE_URL or not _SUPABASE_KEY:
        raise RuntimeError("SUPABASE_URL o SUPABASE_KEY no configurados")
    req = _urllib.Request(
        f"{_SUPABASE_URL}/storage/v1/object/wa-media/{filename}",
        data=contenido, method="POST",
        headers={
            "Authorization": f"Bearer {_SUPABASE_KEY}",
            "Content-Type": "application/pdf",
            "x-upsert": "true"
        }
    )
    try:
        with _urllib.urlopen(req, timeout=30) as r:
            r.read()
    except _urllib.error.HTTPError as e:
        raise RuntimeError(f"Supabase Storage {e.code}: {e.read().decode()}")
    return f"{_SUPABASE_URL}/storage/v1/object/public/wa-media/{filename}"


# OJO: estas rutas son `def` (no `async def`): Cloudinary sube de forma síncrona y, dentro de una ruta async, bloqueaba el
# servidor ENTERO durante cada foto (varios segundos): las fotos de un producto se subían una por una y todo el sistema
# se ponía lento mientras tanto. Como `def` corren en hilos y se pueden subir varias a la vez.
@router.post("/subir")
def subir(archivo: UploadFile = File(...), carpeta: str = "productos", _staff=Depends(require_staff)):
    contenido = archivo.file.read()
    resultado = subir_imagen(contenido, carpeta)
    return resultado


@router.post("/videos/subir")
def subir_video_endpoint(archivo: UploadFile = File(...), carpeta: str = "productos_video", _staff=Depends(require_staff)):
    contenido = archivo.file.read()
    resultado = subir_video(contenido, carpeta)
    return resultado


@router.post("/upload-temp")
def upload_temp(archivo: UploadFile = File(None), file: UploadFile = File(None), _staff=Depends(require_staff)):
    """Sube cualquier archivo (imagen, video, PDF) para enviar por WhatsApp.
    PDFs van a Supabase Storage; imágenes/videos a Cloudinary."""
    try:
        upload = archivo or file
        if not upload:
            return JSONResponse(status_code=422, content={"error": "Se requiere un archivo (campo 'archivo' o 'file')"})
        contenido = upload.file.read()
        content_type = upload.content_type or ""
        archivo = upload

        if content_type.startswith("video/"):
            # WhatsApp solo acepta mp4 H.264 + AAC "normal": los celulares graban HEVC (H.265) y el grabador del navegador saca mp4 fragmentado,
            # y ambos los rechaza (códigos 131053). Cloudinary lo reconvierte al subirlo (síncrono) y se manda esa versión.
            resultado = cloudinary.uploader.upload(
                contenido,
                folder="wa_media",
                resource_type="video",
                eager=[{"format": "mp4", "video_codec": "h264:main:3.1", "audio_codec": "aac",
                        "width": 720, "crop": "limit", "quality": "auto:good"}],
                eager_async=False,
            )
            url = resultado.get("secure_url", "")
            if not url:
                return JSONResponse(status_code=500, content={"error": "Cloudinary no devolvió URL"})
            try:
                eager_url = ((resultado.get("eager") or [{}])[0]).get("secure_url", "")
                if eager_url:
                    url = eager_url
                else:
                    print("[upload-temp] Cloudinary no devolvió la versión convertida del video; se manda el original")
            except Exception as e_eager:
                print(f"[upload-temp] eager video: {e_eager}")
            return {"url": url, "public_url": url, "public_id": resultado.get("public_id", "")}

        elif content_type == "application/pdf" or archivo.filename.lower().endswith(".pdf"):
            safe_name = archivo.filename.replace(" ", "_")
            url = _subir_pdf_supabase(contenido, safe_name)
            return {"url": url, "public_url": url, "public_id": safe_name}

        else:
            resultado = cloudinary.uploader.upload(
                contenido,
                folder="wa_media",
                transformation=[{"quality": "auto"}, {"fetch_format": "auto"}]
            )
            url = resultado.get("secure_url", "")
            if not url:
                return JSONResponse(status_code=500, content={"error": "Cloudinary no devolvió URL"})
            return {"url": url, "public_url": url, "public_id": resultado.get("public_id", "")}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/pdf-viewer")
def pdf_viewer(url: str):
    """Proxy para PDFs de Cloudinary con fallback a Google Docs Viewer (URLs legacy)."""
    if not url.startswith("https://res.cloudinary.com/"):
        return JSONResponse(status_code=400, content={"error": "URL no permitida"})
    import requests as _req
    try:
        resp = _req.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/pdf,*/*;q=0.9"
        }, allow_redirects=True)
        resp.raise_for_status()
        return Response(
            content=resp.content,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline", "Cache-Control": "max-age=3600"}
        )
    except Exception:
        return RedirectResponse(
            url=f"https://docs.google.com/viewer?url={_up.quote(url, safe='')}",
            status_code=302
        )


@router.delete("/{public_id:path}")
def eliminar(public_id: str, _staff=Depends(require_staff)):
    return eliminar_imagen(public_id)
