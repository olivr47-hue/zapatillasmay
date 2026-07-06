from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse, Response
from storage import subir_imagen, eliminar_imagen, subir_video
import cloudinary.uploader
import urllib.request

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
    """Sirve un PDF de Cloudinary con Content-Type correcto para que el visor del navegador lo abra."""
    if not url.startswith("https://res.cloudinary.com/"):
        return JSONResponse(status_code=400, content={"error": "URL no permitida"})
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        return Response(
            content=data,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline", "Cache-Control": "max-age=3600"}
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.delete("/{public_id:path}")
def eliminar(public_id: str):
    return eliminar_imagen(public_id)