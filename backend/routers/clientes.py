from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch
from security import hash_password, require_staff, bearer_opcional, cliente_autorizado, verify_token

router = APIRouter(prefix="/clientes", tags=["Clientes"])

# Campos que un cliente puede autoeditar desde el portal (nunca crédito, límite,
# tipo ni activo -- eso solo lo toca personal via require_staff en otras rutas).
_CAMPOS_CLIENTE_AUTOEDITABLES = {
    "nombre", "telefono", "email", "ciudad", "estado",
    "direccion", "codigo_postal",
}

@router.get("/")
def listar_clientes(_staff=Depends(require_staff)):
    try:
        return supabase_get_all("clientes?activo=eq.true&order=nombre.asc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/referidos")
def listar_referidos(_staff=Depends(require_staff)):
    try:
        return supabase_get_all("clientes?tipo=eq.menudeo&activo=eq.true&order=credito_disponible.desc&select=id,nombre,email,telefono,codigo_referido,referido_por,credito_disponible")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/{id}")
def obtener_cliente(id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    if not cliente_autorizado(id, credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        return supabase_get(f"clientes?id=eq.{id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/")
def crear_cliente(cliente: dict):
    try:
        return supabase_post("clientes", cliente)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}")
def actualizar_cliente(id: str, cliente: dict, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    if not cliente_autorizado(id, credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        es_staff = bool(credentials) and bool(verify_token(credentials.credentials).get("rol"))
        if not es_staff:
            # El cliente autoeditando su propia cuenta desde el portal solo puede
            # tocar datos de contacto/envío -- nunca crédito, límite, tipo ni activo.
            cliente = {k: v for k, v in cliente.items() if k in _CAMPOS_CLIENTE_AUTOEDITABLES}
        return supabase_patch(f"clientes?id=eq.{id}", cliente)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}/desactivar")
def desactivar_cliente(id: str, _staff=Depends(require_staff)):
    try:
        return supabase_patch(f"clientes?id=eq.{id}", {"activo": False})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/dar-acceso")
def dar_acceso_portal(id: str, _staff=Depends(require_staff)):
    """Crea (o resetea) el acceso al portal mayorista de un cliente.
    Genera una contraseña ALEATORIA (antes eran los últimos 4 dígitos del teléfono,
    predecibles: cualquiera con el teléfono público entraba). Se devuelve al admin
    autenticado para que la comparta; el cliente también puede entrar por OTP."""
    import secrets as _secrets
    try:
        clientes = supabase_get(f"clientes?id=eq.{id}")
        if not clientes:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        c = clientes[0]

        if c.get("tipo") not in ("zapateria", "mayoreo"):
            return JSONResponse(status_code=400, content={"error": "Solo clientes de tipo mayoreo/zapatería pueden tener acceso al portal"})

        telefono = "".join(ch for ch in (c.get("telefono") or "") if ch.isdigit())
        if not telefono and not c.get("email"):
            return JSONResponse(status_code=400, content={"error": "El cliente necesita teléfono o email para crear su acceso"})

        # Contraseña aleatoria legible (sin caracteres ambiguos como 0/O, 1/l/I).
        _alfabeto = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        password = "".join(_secrets.choice(_alfabeto) for _ in range(8))
        password_hash = hash_password(password)

        email_usuario = c.get("email") or f"tel{telefono}@portal.zapatillasmay.com"

        existentes = supabase_get(f"usuarios?cliente_id=eq.{id}")
        if existentes:
            supabase_patch(f"usuarios?id=eq.{existentes[0]['id']}", {
                "password_hash": password_hash,
                "activo": True,
                "email": email_usuario
            })
        else:
            supabase_post("usuarios", {
                "nombre": c.get("nombre"),
                "email": email_usuario,
                "password_hash": password_hash,
                "tipo": c.get("tipo"),
                "cliente_id": id,
                "activo": True
            })

        return {
            "telefono": c.get("telefono"),
            "usuario": telefono if telefono else email_usuario,
            "password": password,
            "nombre": c.get("nombre")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})