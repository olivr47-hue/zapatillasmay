from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
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
        import hashlib

@router.post("/")
def crear_empleado(datos: dict):
    try:
        nombre = datos.get("nombre")
        email = datos.get("email")
        password = datos.get("password")
        rol = datos.get("rol", "vendedor")
        if not nombre or not email or not password:
            return JSONResponse(status_code=400, content={"error": "Faltan datos obligatorios"})
        existente = supabase_get(f"empleados?email=eq.{email}")
        if existente:
            return JSONResponse(status_code=400, content={"error": "El email ya esta registrado"})
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        return supabase_post("empleados", {"nombre": nombre, "email": email, "password_hash": password_hash, "rol": rol, "activo": True})
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": str(ex)})

@router.patch("/{empleado_id}")
def actualizar_empleado(empleado_id: str, datos: dict):
    try:
        update = {}
        if "nombre" in datos: update["nombre"] = datos["nombre"]
        if "email" in datos: update["email"] = datos["email"]
        if "rol" in datos: update["rol"] = datos["rol"]
        if "activo" in datos: update["activo"] = datos["activo"]
        if "password" in datos and datos["password"]:
            update["password_hash"] = hashlib.sha256(datos["password"].encode()).hexdigest()
        return supabase_patch(f"empleados?id=eq.{empleado_id}", update)
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": str(ex)})