from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse, Response
from storage import subir_imagen, eliminar_imagen, subir_video
import cloudinary.uploader

router = APIRouter(prefix="/imagenes", tags=["Imágenes"])

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
    """Sube cualquier archivo (imagen, video, PDF) a Cloudinary para enviar por WhatsApp.
    Devuelve { url, public_id } compatible con el panel."""
    try:
        upload = archivo or file
        if not upload:
            return JSONResponse(status_code=422, content={"error": "Se requiere un archivo (campo 'archivo' o 'file')"})
        contenido = await upload.read()
        content_type = upload.content_type or ""
        archivo = upload  # normalizar nombre para las líneas siguientes

        if content_type.startswith("video/"):
            resultado = cloudinary.uploader.upload(
                contenido,
                folder="wa_media",
                resource_type="video"
            )
        elif content_type == "application/pdf" or archivo.filename.lower().endswith(".pdf"):
            safe_name = archivo.filename.replace(" ", "_")
            resultado = cloudinary.uploader.upload(
                contenido,
                folder="wa_media",
                resource_type="raw",
                public_id=safe_name
            )
        else:
            # imagen u otro archivo
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
    """Sirve un PDF con Content-Type correcto. Fallback a Google Docs Viewer si Cloudinary bloquea el servidor."""
    if not url.startswith("https://res.cloudinary.com/"):
        return JSONResponse(status_code=400, content={"error": "URL no permitida"})
    import requests as _req
    import urllib.parse as _up
    from fastapi.responses import RedirectResponse
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