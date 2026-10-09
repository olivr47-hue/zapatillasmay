"""
Utilidades de seguridad: contraseñas, JWT y rate limiting.
Usa bcrypt/PyJWT si están disponibles; cae a stdlib (pbkdf2 + hmac) si no.
"""
import os
import hashlib
import hmac as _hmac
import base64
import json
from datetime import datetime, timedelta, timezone

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 15 * 24  # 15 días -- antes 12h, muy corto para el portal de mayoreo (personal del panel)
TOKEN_CLIENTE_HORAS = 60 * 24  # clientes del portal/tienda: 60 días y se renuevan solos cada vez que entran (POST /auth/renovar)
                               # (clientes que no entran a diario perdían la sincronización
                               # del carrito entre dispositivos al vencer el token en silencio)

# ── Rate limiter (opcional) ───────────────────────────────────────────────────
try:
    from slowapi import Limiter
    from slowapi.util import get_remote_address
    limiter = Limiter(key_func=get_remote_address)
except ImportError:
    class _NoOpLimiter:
        def limit(self, *args, **kwargs):
            def decorator(f):
                return f
            return decorator
    limiter = _NoOpLimiter()

# ── bcrypt (opcional; cae a pbkdf2_hmac que también es seguro) ────────────────
try:
    import bcrypt as _bcrypt
    _BCRYPT = True
except ImportError:
    _bcrypt = None
    _BCRYPT = False

_PBKDF2_ITERS = 260_000


def hash_password(password: str) -> str:
    if _BCRYPT:
        return _bcrypt.hashpw(password.encode(), _bcrypt.gensalt(rounds=12)).decode()
    # Fallback: pbkdf2_hmac con salt aleatorio
    import os as _os
    salt = _os.urandom(16).hex()
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), _PBKDF2_ITERS)
    return f"pbkdf2:{salt}:{dk.hex()}"


def verify_password(plain: str, stored: str) -> bool:
    if not plain or not stored:
        return False
    # bcrypt hash
    if stored.startswith("$2"):
        if _BCRYPT:
            try:
                return _bcrypt.checkpw(plain.encode(), stored.encode())
            except Exception:
                return False
        return False
    # pbkdf2 hash (nuestro fallback)
    if stored.startswith("pbkdf2:"):
        try:
            _, salt, dk_hex = stored.split(":", 2)
            dk = hashlib.pbkdf2_hmac("sha256", plain.encode(), salt.encode(), _PBKDF2_ITERS)
            return _hmac.compare_digest(dk.hex(), dk_hex)
        except Exception:
            return False
    # SHA-256 legacy (migración automática)
    return _hmac.compare_digest(stored, hashlib.sha256(plain.encode()).hexdigest())


# ── JWT (opcional; cae a implementación stdlib) ───────────────────────────────
try:
    import jwt as _jwt
    from jwt.exceptions import InvalidTokenError as _JWTError
    _PYJWT = True
except ImportError:
    _jwt = None
    _JWTError = Exception
    _PYJWT = False


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _b64url_decode(s: str) -> bytes:
    pad = 4 - len(s) % 4
    return base64.urlsafe_b64decode(s + "=" * (pad % 4))


def create_token(payload: dict, expires_hours: int = TOKEN_EXPIRE_HOURS) -> str:
    data = payload.copy()
    exp = datetime.now(tz=timezone.utc) + timedelta(hours=expires_hours)
    data["exp"] = int(exp.timestamp())
    if _PYJWT:
        return _jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    # Fallback stdlib
    header = _b64url_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    body   = _b64url_encode(json.dumps(data).encode())
    sig    = _b64url_encode(
        _hmac.new(SECRET_KEY.encode(), f"{header}.{body}".encode(), hashlib.sha256).digest()
    )
    return f"{header}.{body}.{sig}"


def verify_token(token: str) -> dict:
    from fastapi import HTTPException
    try:
        if _PYJWT:
            return _jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Fallback stdlib
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("token malformado")
        header, body, sig = parts
        expected = _b64url_encode(
            _hmac.new(SECRET_KEY.encode(), f"{header}.{body}".encode(), hashlib.sha256).digest()
        )
        if not _hmac.compare_digest(sig, expected):
            raise ValueError("firma invalida")
        payload = json.loads(_b64url_decode(body))
        if payload.get("exp", 0) < datetime.now(tz=timezone.utc).timestamp():
            raise ValueError("token expirado")
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Token invalido o expirado")


# ── Dependencias FastAPI ──────────────────────────────────────────────────────
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

_bearer = HTTPBearer(auto_error=False)
bearer_opcional = _bearer  # alias público para usar Depends(bearer_opcional) en otros routers


def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticacion requerida")
    payload = verify_token(credentials.credentials)
    if es_personal(payload):
        payload = _aplicar_vigencia(payload)
    if payload.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="Se requiere rol de administrador")
    return payload


def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticacion requerida")
    return verify_token(credentials.credentials)


# Interruptor de despliegue seguro: mientras AUTH_ENFORCE != "1", require_staff NO
# bloquea (permite desplegar el backend ANTES que el panel sin romper producción).
# Activar AUTH_ENFORCE=1 en Railway SOLO cuando el panel (con el interceptor que
# adjunta el token a /api) ya esté en vivo en Vercel. Ver memoria project_env_vars_pendientes.
AUTH_ENFORCE = os.getenv("AUTH_ENFORCE", "0") == "1"


def es_personal(payload: dict) -> bool:
    """True si el JWT es de un empleado. Los tokens del portal mayorista llevan
    rol='cliente' (ver routers/portal.py) y NO cuentan como personal -- antes
    cualquier 'rol' truthy pasaba, así que un cliente de mayoreo logueado
    entraba como si fuera staff a todo lo protegido con require_staff."""
    rol = (payload or {}).get("rol")
    return bool(rol) and rol != "cliente"


_EMP_CACHE: dict = {}   # sub -> (timestamp, {"activo":bool,"rol":str})
_EMP_TTL = 60


def empleado_vigente(sub) -> dict:
    """Estado ACTUAL del empleado en la base (activo y rol), con caché de 60 s. Un JWT dura 15 días: sin esto,
    desactivar o degradar a un empleado no surtía efecto hasta que su token venciera. Si la base no responde se
    deja pasar (no se bloquea a todo el personal por una falla temporal) y no se cachea ese resultado."""
    import time as _t
    from urllib.parse import quote as _q
    ahora = _t.time()
    c = _EMP_CACHE.get(sub)
    if c and ahora - c[0] < _EMP_TTL:
        return c[1]
    try:
        from database import supabase_get
        filas = supabase_get(f"empleados?id=eq.{_q(str(sub), safe='')}&select=activo,rol,ver_finanzas")
        data = ({"activo": bool(filas[0].get("activo", True)), "rol": filas[0].get("rol"), "ver_finanzas": filas[0].get("ver_finanzas") is not False}
                if filas else {"activo": False, "rol": None, "ver_finanzas": True})
    except Exception as e:
        print(f"[auth] no se pudo verificar al empleado {sub}: {e}")
        return {"activo": True, "rol": None}
    _EMP_CACHE[sub] = (ahora, data)
    return data


def invalidar_empleado(sub) -> None:
    _EMP_CACHE.pop(sub, None)


def _aplicar_vigencia(payload: dict) -> dict:
    """Si el token es de personal: rechaza cuentas desactivadas y usa el rol vigente de la base, no el del token."""
    if es_personal(payload):
        v = empleado_vigente(payload.get("sub"))
        if not v["activo"]:
            raise HTTPException(status_code=401, detail="Cuenta desactivada")
        if v.get("rol"):
            payload = dict(payload, rol=v["rol"])
        payload = dict(payload, ver_finanzas=v.get("ver_finanzas", True))   # permiso aparte: un administrador puede no ver Finanzas
    return payload


def require_staff(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    """Exige un token de personal (empleado). Los clientes (portal mayorista
    rol='cliente', o tienda con 'tipo' sin 'rol') quedan fuera. Gated por AUTH_ENFORCE."""
    if not AUTH_ENFORCE:
        return {"_auth": "disabled"}
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticacion requerida")
    payload = verify_token(credentials.credentials)
    if not es_personal(payload):
        raise HTTPException(status_code=403, detail="Se requiere acceso de personal")
    return _aplicar_vigencia(payload)


def payload_opcional(credentials) -> dict | None:
    """Payload del JWT si viene y es válido; None si no hay token o es inválido."""
    if not credentials:
        return None
    try:
        return verify_token(credentials.credentials)
    except HTTPException:
        return None


def exigir_personal_o_dueno(cliente_id_recurso, credentials) -> dict:
    """Personal, o el cliente dueño del recurso (cliente_id del token == cliente_id
    del recurso). Lanza 401/403 si no. Respeta AUTH_ENFORCE (despliegue seguro)."""
    if not AUTH_ENFORCE:
        return {"_auth": "disabled"}
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticacion requerida")
    payload = verify_token(credentials.credentials)
    if es_personal(payload):
        return payload
    if cliente_id_recurso and payload.get("cliente_id") == cliente_id_recurso:
        return payload
    raise HTTPException(status_code=403, detail="No autorizado")


def cliente_autorizado(cliente_id: str, credentials: HTTPAuthorizationCredentials) -> bool:
    """True si el token es de personal (rol), o de ese mismo cliente_id.
    Usar en endpoints del portal mayorista que reciben un cliente_id en la ruta
    (/clientes/{id}, /auth/pedidos/{cliente_id}) para que un cliente logueado no
    pueda leer/editar los datos de otro cambiando el id en la URL."""
    if not credentials:
        return False
    try:
        payload = verify_token(credentials.credentials)
    except HTTPException:
        return False
    if es_personal(payload):
        return True
    return payload.get("cliente_id") == cliente_id


def usuario_autorizado(usuario_id: str, credentials: HTTPAuthorizationCredentials) -> bool:
    """True si el token es de personal (rol), o de ese mismo usuario_id (sub)."""
    if not credentials:
        return False
    try:
        payload = verify_token(credentials.credentials)
    except HTTPException:
        return False
    if es_personal(payload):
        return True
    return payload.get("sub") == usuario_id


# ── Texto que viene del público ───────────────────────────────────────────────
# El panel pinta muchos datos de clientes con innerHTML sin escapar (nombres, notas,
# mensajes de WhatsApp...). Para que un nombre como <img onerror=...> no se convierta en
# XSS contra quien abra el panel, todo texto que ENTRA desde el público se neutraliza:
# '<' y '>' pasan a las comillas angulares tipográficas (‹ ›), visualmente casi iguales
# (un "<3" sigue leyéndose) pero inertes para el HTML.
_TRADUCE_ANGULOS = str.maketrans({"<": "‹", ">": "›"})
# Para texto que acaba dentro de atributos HTML del panel (value="...", data-nombre="..."): una comilla doble
# permitiría salirse del atributo e inyectar onmouseover=... aun sin '<'. Se cambia por la comilla tipográfica.
_TRADUCE_ANGULOS_Y_COMILLAS = str.maketrans({"<": "‹", ">": "›", '"': "”"})
# Campos donde NO se tocan las comillas (correos, URLs, identificadores de rastreo, user agent)
_CLAVES_SIN_COMILLAS = {
    "email", "email_cliente", "correo", "fbc", "fbp", "fbclid", "gclid", "ga_client_id", "client_user_agent",
    "referrer_origen", "utm_source", "utm_medium", "utm_campaign", "url", "imagen", "foto_url", "password",
    "password_nueva", "token", "client_ip_address",
}


def limpiar_texto(valor, comillas: bool = False):
    if not isinstance(valor, str):
        return valor
    return valor.translate(_TRADUCE_ANGULOS_Y_COMILLAS if comillas else _TRADUCE_ANGULOS)


def limpiar_dict(d: dict) -> dict:
    """Aplica limpiar_texto a los valores string de un dict (recursivo en dict/list). Los campos de nombre,
    dirección, notas... también pierden la comilla doble; correos/URLs/rastreo solo pierden '<' y '>'."""
    def _l(v, k=None):
        if isinstance(v, str):
            return limpiar_texto(v, comillas=(k not in _CLAVES_SIN_COMILLAS))
        if isinstance(v, dict):
            return {kk: _l(x, kk) for kk, x in v.items()}
        if isinstance(v, list):
            return [_l(x, k) for x in v]
        return v
    return {k: _l(v, k) for k, v in d.items()}
