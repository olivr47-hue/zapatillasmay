# -*- coding: utf-8 -*-
"""
google_sa.py — Autenticación de Service Account de Google SIN dependencias externas.

Railway no está reinstalando PyJWT/cryptography (caché de build pegada), así que
firmamos el JWT RS256 en Python puro (stdlib: hashlib, base64, urllib).
Soporta llaves PKCS#8 ("BEGIN PRIVATE KEY", lo que usan las cuentas de servicio
de Google) y PKCS#1 ("BEGIN RSA PRIVATE KEY").
"""

import base64, json, hashlib, time, urllib.request, urllib.parse


def _b64u(b: bytes) -> bytes:
    return base64.urlsafe_b64encode(b).rstrip(b"=")


def _read_len(data: bytes, idx: int):
    first = data[idx]; idx += 1
    if first < 0x80:
        return first, idx
    n = first & 0x7F
    return int.from_bytes(data[idx:idx + n], "big"), idx + n


def _read_tlv(data: bytes, idx: int):
    """Lee un TLV DER. Devuelve (tag, value_bytes, next_idx)."""
    tag = data[idx]; idx += 1
    length, idx = _read_len(data, idx)
    return tag, data[idx:idx + length], idx + length


def _pem_to_der(pem: str) -> tuple[bytes, bool]:
    """Devuelve (der_bytes, es_pkcs1)."""
    es_pkcs1 = "BEGIN RSA PRIVATE KEY" in pem
    body = "".join(l.strip() for l in pem.strip().splitlines() if "-----" not in l)
    return base64.b64decode(body), es_pkcs1


def _rsa_n_d(private_key_pem: str):
    """Extrae (modulus n, private exponent d) de una llave RSA PEM."""
    der, es_pkcs1 = _pem_to_der(private_key_pem)
    if not es_pkcs1:
        # PKCS#8: SEQUENCE { version, algId, OCTET STRING(pkcs1) }
        _, seq, _ = _read_tlv(der, 0)
        idx = 0
        _, _, idx = _read_tlv(seq, idx)        # version
        _, _, idx = _read_tlv(seq, idx)        # algorithm id
        _, octet, idx = _read_tlv(seq, idx)    # privateKey OCTET STRING
        der = octet
    # PKCS#1 RSAPrivateKey: SEQUENCE { version, n, e, d, ... }
    _, rsa, _ = _read_tlv(der, 0)
    j = 0
    _, _,   j = _read_tlv(rsa, j)   # version
    _, n_b, j = _read_tlv(rsa, j)   # modulus
    _, _,   j = _read_tlv(rsa, j)   # publicExponent
    _, d_b, j = _read_tlv(rsa, j)   # privateExponent
    return int.from_bytes(n_b, "big"), int.from_bytes(d_b, "big")


def _sign_rs256(private_key_pem: str, message: bytes) -> bytes:
    n, d = _rsa_n_d(private_key_pem)
    k = (n.bit_length() + 7) // 8
    digest = hashlib.sha256(message).digest()
    # DigestInfo (ASN.1) prefijo para SHA-256
    t = bytes.fromhex("3031300d060960864801650304020105000420") + digest
    ps_len = k - len(t) - 3
    if ps_len < 8:
        raise ValueError("Llave RSA demasiado corta")
    em = b"\x00\x01" + b"\xff" * ps_len + b"\x00" + t
    s = pow(int.from_bytes(em, "big"), d, n)
    return s.to_bytes(k, "big")


def get_access_token(creds_json: str, scope: str, timeout: int = 15) -> str | None:
    """Obtiene un access token OAuth2 a partir del JSON de la cuenta de servicio."""
    creds = json.loads(creds_json)
    now = int(time.time())
    header = _b64u(json.dumps({"alg": "RS256", "typ": "JWT"}, separators=(",", ":")).encode())
    claims = _b64u(json.dumps({
        "iss": creds["client_email"],
        "sub": creds["client_email"],
        "scope": scope,
        "aud": "https://oauth2.googleapis.com/token",
        "iat": now,
        "exp": now + 3600,
    }, separators=(",", ":")).encode())
    signing_input = header + b"." + claims
    sig = _b64u(_sign_rs256(creds["private_key"], signing_input))
    assertion = (signing_input + b"." + sig).decode()

    data = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": assertion,
    }).encode()
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read()).get("access_token")
