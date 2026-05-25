from fastapi import APIRouter, UploadFile, File
from storage import subir_imagen, eliminar_imagen, subir_video

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

@router.delete("/{public_id:path}")
def eliminar(public_id: str):
    return eliminar_imagen(public_id)