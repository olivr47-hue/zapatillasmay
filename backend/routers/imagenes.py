from fastapi import APIRouter, UploadFile, File
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


@router.post("/subir")
async def subir(archivo: UploadFile = File(...), carpeta: str = "productos"):
    contenido = await archivo.read()
    resultado = subir_imagen(contenido, carpeta)
    return resultado


@router.post("/videos/subir")
async def subir_video_endpoint(archivo: UploadFile = File(...), carpeta: str = "productos_video"):
    contenido = await archivo.read()
    resultado = subir_video(contenido, carpeta)
    return resultado


@router.post("/upload-temp")
async def upload_temp(archivo: UploadFile = File(None), file: UploadFile = File(None)):
    """Sube cualquier archivo (imagen, video, PDF) para enviar por WhatsApp.
    PDFs van a Supabase Storage; imágenes/videos a Cloudinary."""
    try:
        upload = archivo or file
        if not upload:
            return JSONResponse(status_code=422, content={"error": "Se requiere un archivo (campo 'archivo' o 'file')"})
        contenido = await upload.read()
        content_type = upload.content_type or ""
        archivo = upload

        if content_type.startswith("video/"):
            resultado = cloudinary.uploader.upload(
                contenido,
                folder="wa_media",
                resource_type="video"
            )
            url = resultado.get("secure_url", "")
            if not url:
                return JSONResponse(status_code=500, content={"error": "Cloudinary no devolvió URL"})
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
async def pdf_viewer(url: str):
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
def eliminar(public_id: str):
    return eliminar_imagen(public_id)
