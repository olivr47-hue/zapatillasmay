from fastapi import APIRouter, UploadFile, File
from storage import subir_imagen, eliminar_imagen

router = APIRouter(prefix="/imagenes", tags=["Imágenes"])

@router.post("/subir")
async def subir(archivo: UploadFile = File(...), carpeta: str = "productos"):
    contenido = await archivo.read()
    resultado = subir_imagen(contenido, carpeta)
    return resultado

@router.delete("/{public_id:path}")
def eliminar(public_id: str):
    return eliminar_imagen(public_id)