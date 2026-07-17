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
TOKEN_EXPIRE_HOURS = 15 * 24  # 15 días -- antes 12h, muy corto para el portal de mayoreo
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


def require_staff(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    """Exige un token de personal (empleado; su JWT lleva 'rol'). Los clientes
    (token con 'tipo', sin 'rol') quedan fuera. Gated por AUTH_ENFORCE."""
    if not AUTH_ENFORCE:
        return {"_auth": "disabled"}
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticacion requerida")
    payload = verify_token(credentials.credentials)
    if not payload.get("rol"):
        raise HTTPException(status_code=403, detail="Se requiere acceso de personal")
    return payload


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
    if payload.get("rol"):
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
    if payload.get("rol"):
        return True
    return payload.get("sub") == usuario_id
