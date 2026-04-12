import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def subir_imagen(archivo, carpeta="productos"):
    resultado = cloudinary.uploader.upload(
        archivo,
        folder=carpeta,
        transformation=[
            {"quality": "auto"},
            {"fetch_format": "auto"}
        ]
    )
    return {
        "url": resultado["secure_url"],
        "public_id": resultado["public_id"]
    }

def eliminar_imagen(public_id):
    return cloudinary.uploader.destroy(public_id)