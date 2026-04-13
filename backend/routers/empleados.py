from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post
import hashlib

router = APIRouter(prefix="/empleados", tags=["Empleados"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/login")
def login(datos: dict):
    try:
        email = datos.get("email")
        password = datos.get("password")
        if not email or not password:
            return JSONResponse(status_code=400, content={"error": "Email y contrasena requeridos"})
        password_hash = hash_password(password)
        empleados = supabase_get(f"empleados?email=eq.{email}&password_hash=eq.{password_hash}&activo=eq.true")
        if not empleados:
            return JSONResponse(status_code=401, content={"error": "Email o contrasena incorrectos"})
        e = empleados[0]
        return {
            "id": e["id"],
            "nombre": e["nombre"],
            "email": e["email"],
            "rol": e["rol"]
        }
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": str(ex)})

@router.get("/")
def listar(rol: str = None):
    try:
        query = "empleados?select=id,nombre,email,rol,activo,created_at"
        if rol:
            query += f"&rol=eq.{rol}"
        return supabase_get(query)
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": str(ex)})