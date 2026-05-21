from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
from security import hash_password, verify_password, create_token, require_admin, limiter

router = APIRouter(prefix="/empleados", tags=["Empleados"])


@router.post("/login")
@limiter.limit("10/minute")
async def login(request: Request, datos: dict):
    try:
        email = datos.get("email")
        password = datos.get("password")
        if not email or not password:
            return JSONResponse(status_code=400, content={"error": "Email y contrasena requeridos"})

        # Buscar solo por email (nunca enviar el hash en la URL)
        empleados = supabase_get(f"empleados?email=eq.{email}&activo=eq.true&select=id,nombre,email,rol,password_hash")
        if not empleados:
            return JSONResponse(status_code=401, content={"error": "Email o contrasena incorrectos"})

        e = empleados[0]
        if not verify_password(password, e.get("password_hash", "")):
            return JSONResponse(status_code=401, content={"error": "Email o contrasena incorrectos"})

        # Migrar SHA-256 → bcrypt si aplica
        stored = e.get("password_hash", "")
        if not stored.startswith("$2"):
            nuevo_hash = hash_password(password)
            supabase_patch(f"empleados?id=eq.{e['id']}", {"password_hash": nuevo_hash})

        token = create_token({"sub": e["id"], "email": e["email"], "rol": e["rol"]})
        return {
            "token": token,
            "id": e["id"],
            "nombre": e["nombre"],
            "email": e["email"],
            "rol": e["rol"],
        }
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.get("/")
def listar(rol: str = None, _admin=Depends(require_admin)):
    try:
        query = "empleados?select=id,nombre,email,rol,activo,created_at"
        if rol:
            query += f"&rol=eq.{rol}"
        return supabase_get(query)
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.post("/")
def crear_empleado(datos: dict, _admin=Depends(require_admin)):
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
        password_hash = hash_password(password)
        return supabase_post("empleados", {"nombre": nombre, "email": email, "password_hash": password_hash, "rol": rol, "activo": True})
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})


@router.patch("/{empleado_id}")
def actualizar_empleado(empleado_id: str, datos: dict, _admin=Depends(require_admin)):
    try:
        update = {}
        if "nombre" in datos:
            update["nombre"] = datos["nombre"]
        if "email" in datos:
            update["email"] = datos["email"]
        if "rol" in datos:
            update["rol"] = datos["rol"]
        if "activo" in datos:
            update["activo"] = datos["activo"]
        if datos.get("password"):
            update["password_hash"] = hash_password(datos["password"])
        return supabase_patch(f"empleados?id=eq.{empleado_id}", update)
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})
