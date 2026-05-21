"""
Utilidades de seguridad: bcrypt, JWT, rate limiting y dependencias para FastAPI.
"""
import os
import hashlib
from datetime import datetime, timedelta, timezone
try:
    from slowapi import Limiter
    from slowapi.util import get_remote_address
    limiter = Limiter(key_func=get_remote_address)
except ImportError:
    # Fallback si slowapi aún no está instalado: decorador no-op
    class _NoOpLimiter:
        def limit(self, *args, **kwargs):
            def decorator(f):
                return f
            return decorator
    limiter = _NoOpLimiter()

import bcrypt
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = os.getenv("SECRET_KEY", "zapatillasmay2024erp")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 12

_bearer = HTTPBearer(auto_error=False)


# ── Passwords ─────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hashea con bcrypt (salt incluido)."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()


def verify_password(plain: str, stored_hash: str) -> bool:
    """
    Verifica la contraseña. Soporta bcrypt (nuevo) y SHA-256 (legacy).
    Si el hash es SHA-256 la verificación tiene éxito para permitir la migración
    automática al siguiente login.
    """
    if not plain or not stored_hash:
        return False
    # Intentar bcrypt primero
    try:
        if stored_hash.startswith("$2"):
            return bcrypt.checkpw(plain.encode(), stored_hash.encode())
    except Exception:
        pass
    # Fallback SHA-256 (migración)
    return stored_hash == hashlib.sha256(plain.encode()).hexdigest()


# ── JWT ───────────────────────────────────────────────────────────────────────

def create_token(payload: dict, expires_hours: int = TOKEN_EXPIRE_HOURS) -> str:
    data = payload.copy()
    data["exp"] = datetime.now(tz=timezone.utc) + timedelta(hours=expires_hours)
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalido o expirado")


# ── Dependencias FastAPI ──────────────────────────────────────────────────────

def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    """Dependencia que exige JWT con rol='admin'."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticacion requerida")
    payload = verify_token(credentials.credentials)
    if payload.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="Se requiere rol de administrador")
    return payload


def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    """Dependencia que exige cualquier JWT valido."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Autenticacion requerida")
    return verify_token(credentials.credentials)
