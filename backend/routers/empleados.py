from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from database import supabase_get, supabase_post, supabase_patch
from security import hash_password, verify_password, create_token, require_admin, limiter, invalidar_empleado
import time
import urllib.parse as _up

_ROLES_VALIDOS = ("admin", "vendedor")
# Bloqueo temporal por cuenta (además del límite por IP): 5 fallos -> 5 minutos sin poder intentar
_FALLOS: dict = {}
_MAX_FALLOS = 5
_BLOQUEO_SEG = 300

router = APIRouter(prefix="/empleados", tags=["Empleados"])


@router.post("/login")
@limiter.limit("10/minute")
def login(request: Request, datos: dict):
    try:
        email = (datos.get("email") or "").strip().lower()
        password = datos.get("password")
        if not email or not password:
            return JSONResponse(status_code=400, content={"error": "Email y contrasena requeridos"})

        n, hasta = _FALLOS.get(email, (0, 0))
        if hasta > time.time():
            return JSONResponse(status_code=429, content={"error": "Demasiados intentos. Espera unos minutos e intenta de nuevo."})

        # Sin distinguir mayúsculas (antes "Ana@x.com" no entraba si se guardó "ana@x.com"), valor codificado,
        # y coincidencia exacta (ilike trata '_' y '%' como comodines).
        filas = supabase_get(f"empleados?email=ilike.{_up.quote(email, safe='')}&activo=eq.true&select=id,nombre,email,rol,password_hash")
        empleados = [x for x in (filas or []) if (x.get("email") or "").strip().lower() == email]
        e = empleados[0] if empleados else None
        if not e or not verify_password(password, e.get("password_hash", "")):
            n += 1
            _FALLOS[email] = (n, time.time() + _BLOQUEO_SEG if n >= _MAX_FALLOS else 0)
            return JSONResponse(status_code=401, content={"error": "Email o contrasena incorrectos"})
        _FALLOS.pop(email, None)

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
        email = str(email).strip().lower()
        if rol not in _ROLES_VALIDOS:
            return JSONResponse(status_code=400, content={"error": "Rol inválido (admin o vendedor)"})
        if len(str(password)) < 8:
            return JSONResponse(status_code=400, content={"error": "La contraseña debe tener al menos 8 caracteres"})
        existente = supabase_get(f"empleados?email=ilike.{_up.quote(email, safe='')}")
        existente = [x for x in (existente or []) if (x.get("email") or "").strip().lower() == email]
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
            if datos["rol"] not in _ROLES_VALIDOS:
                return JSONResponse(status_code=400, content={"error": "Rol inválido (admin o vendedor)"})
            update["rol"] = datos["rol"]
        if "activo" in datos:
            update["activo"] = bool(datos["activo"])
        if datos.get("password"):
            if len(str(datos["password"])) < 8:
                return JSONResponse(status_code=400, content={"error": "La contraseña debe tener al menos 8 caracteres"})
            update["password_hash"] = hash_password(datos["password"])
        if "email" in update:
            update["email"] = str(update["email"]).strip().lower()
        resultado = supabase_patch(f"empleados?id=eq.{_up.quote(str(empleado_id), safe='')}", update)
        invalidar_empleado(empleado_id)   # desactivar / cambiar rol surte efecto de inmediato, no en 60 s
        return resultado
    except Exception as ex:
        return JSONResponse(status_code=500, content={"error": "Error interno del servidor"})
