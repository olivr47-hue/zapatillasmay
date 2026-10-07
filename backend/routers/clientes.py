from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials
from database import supabase_get, supabase_get_all, supabase_post, supabase_patch, inventario_ajustar
from security import hash_password, require_staff, bearer_opcional, cliente_autorizado, verify_token, es_personal, limpiar_dict

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

@router.get("/portal-mayoreo")
def listar_accesos_portal_mayoreo(_staff=Depends(require_staff)):
    """Cuentas (tabla usuarios) con acceso al portal mayorista -- para saber
    quién está registrado y cuándo entró por última vez (ultimo_login se
    guarda en /auth/login). El filtro real de "es mayorista" es el tipo del
    cliente ligado, no el tipo del usuario -- por eso el !inner + filtro
    sobre clientes.tipo en vez de usuarios.tipo."""
    try:
        return supabase_get_all(
            "usuarios?select=id,nombre,email,activo,ultimo_login,created_at,"
            "clientes!inner(id,nombre,telefono,ciudad,estado,tipo)"
            "&clientes.tipo=in.(zapateria,mayoreo)"
            "&order=ultimo_login.desc.nullslast"
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/resumen")
def resumen_clientes(_staff=Depends(require_staff)):
    """Solo id y fecha de alta de TODOS los clientes (el dashboard únicamente cuenta y filtra por fecha;
    antes bajaba la ficha completa de cada cliente)."""
    try:
        return supabase_get_all("clientes?select=id,created_at")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/marcar-frecuentes")
def marcar_frecuentes(datos: dict, _staff=Depends(require_staff)):
    """Marca o quita la estrella de 'clienta frecuente' (la lista a la que se le mandan las novedades)."""
    import re as _re
    ids = [str(i) for i in (datos.get("ids") or []) if _re.fullmatch(r"[0-9a-fA-F-]{36}", str(i))][:500]
    if not ids:
        return JSONResponse(status_code=400, content={"ok": False, "error": "No hay clientas elegidas"})
    valor = bool(datos.get("valor", True))
    for i in range(0, len(ids), 50):
        supabase_patch(f"clientes?id=in.({','.join(ids[i:i + 50])})", {"frecuente_wa": valor})
    return {"ok": True, "actualizadas": len(ids), "valor": valor}


@router.post("/enviar-correo")
def enviar_correo_clientes(datos: dict, _staff=Depends(require_staff)):
    """Envía un correo (plantilla de la tienda) a varios clientes elegidos en el panel.
    datos: {"ids": [...], "asunto": "...", "mensaje": "... {nombre} ..."}.
    Se omiten los correos inválidos y los compartidos por varios clientes (no identifican a nadie). Máximo 80 por envío (el
    plan gratis de Resend permite 100 al día). El envío corre en segundo plano y queda en el historial de Correo corporativo."""
    import re as _re, threading, time
    ids = [str(i) for i in (datos.get("ids") or []) if _re.fullmatch(r"[0-9a-fA-F-]{36}", str(i))]
    asunto = str(datos.get("asunto") or "").strip()[:150]
    mensaje = str(datos.get("mensaje") or "").strip()[:3000]
    ids_prod = [str(i) for i in (datos.get("productos") or []) if _re.fullmatch(r"[0-9a-fA-F-]{36}", str(i))][:6]
    productos = []
    if ids_prod:
        productos = supabase_get(f"productos?id=in.({','.join(ids_prod)})&select=id,nombre,slug,sku_interno,imagen_principal,precio_menudeo,es_oferta") or []
    if not ids:
        return JSONResponse(status_code=400, content={"ok": False, "error": "No hay clientes seleccionados"})
    if not asunto or not mensaje:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Escribe el asunto y el mensaje"})
    if len(ids) > 80:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Máximo 80 correos por envío (límite diario del plan gratis de Resend: 100)"})
    filas = []
    for i in range(0, len(ids), 40):
        filas += supabase_get(f"clientes?id=in.({','.join(ids[i:i + 40])})&select=id,nombre,email") or []
    por_correo = {}
    for f in filas:
        e = (f.get("email") or "").strip().lower()
        if e:
            por_correo.setdefault(e, []).append(f)
    destinos, omitidos = [], {"sin_correo": 0, "invalido": 0, "compartido": 0}
    for f in filas:
        e = (f.get("email") or "").strip().lower()
        if not e:
            omitidos["sin_correo"] += 1
        elif not _re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", e):
            omitidos["invalido"] += 1
        elif len(por_correo.get(e, [])) > 1 or len(supabase_get("clientes?email=eq." + __import__("urllib.parse").parse.quote(e, safe="") + "&select=id&limit=2") or []) > 1:
            omitidos["compartido"] += 1
        else:
            destinos.append((e, f.get("nombre") or ""))
    if not destinos:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Ninguno de los seleccionados tiene un correo válido y propio", "omitidos": omitidos})

    def _enviar_todos(lista, asunto_, mensaje_, productos_=None):
        from email_utils import enviar_email, email_mensaje_cliente
        for correo, nombre in lista:
            try:
                primer = (nombre.split() or [""])[0].capitalize() or "Cliente"
                html = email_mensaje_cliente(nombre, mensaje_.replace("{nombre}", primer), productos_)
                enviar_email(correo, asunto_.replace("{nombre}", primer), html, tipo="mensaje_cliente", reply_to="contacto@zapatillasmay.mx")
            except Exception as e:
                print(f"[clientes] correo a {correo} falló: {e}")
            time.sleep(0.7)   # Resend permite ~2 envíos por segundo

    threading.Thread(target=_enviar_todos, args=(destinos, asunto, mensaje, productos), daemon=True).start()
    return {"ok": True, "enviando": len(destinos), "omitidos": omitidos}


@router.get("/{id}")
def obtener_cliente(id: str, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    if not cliente_autorizado(id, credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        return supabase_get(f"clientes?id=eq.{id}")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/")
def crear_cliente(cliente: dict, _staff=Depends(require_staff)):
    try:
        forzar = bool(cliente.pop("forzar", False))
        if not forzar:
            parecidos = _buscar_parecidos(cliente.get("nombre"), cliente.get("telefono"), cliente.get("email"))
            if parecidos:
                return JSONResponse(status_code=409, content={"ok": False, "duplicado": True, "parecidos": parecidos,
                                    "error": "Ya existe un cliente con ese teléfono, correo o nombre"})
        _CACHE_DUP["data"] = None
        return supabase_post("clientes", cliente)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}")
def actualizar_cliente(id: str, cliente: dict, credentials: HTTPAuthorizationCredentials = Depends(bearer_opcional)):
    if not cliente_autorizado(id, credentials):
        raise HTTPException(status_code=403, detail="No autorizado")
    try:
        es_staff = bool(credentials) and bool(es_personal(verify_token(credentials.credentials)))
        if not es_staff:
            # El cliente autoeditando su propia cuenta desde el portal solo puede
            # tocar datos de contacto/envío -- nunca crédito, límite, tipo ni activo.
            cliente = limpiar_dict({k: v for k, v in cliente.items() if k in _CAMPOS_CLIENTE_AUTOEDITABLES})
        return supabase_patch(f"clientes?id=eq.{id}", cliente)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.patch("/{id}/desactivar")
def desactivar_cliente(id: str, _staff=Depends(require_staff)):
    try:
        return supabase_patch(f"clientes?id=eq.{id}", {"activo": False})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/{id}/creditos-historial")
def historial_creditos_cliente(id: str, _staff=Depends(require_staff)):
    try:
        return supabase_get_all(f"clientes_creditos_historial?cliente_id=eq.{id}&order=created_at.desc")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/nota-credito")
def nota_credito_cliente(id: str, datos: dict, _staff=Depends(require_staff)):
    """Registra saldo a favor del cliente (ej. devolvio pares defectuosos por
    correo y en vez de reembolso/reemplazo fisico -- caro en paqueteria en
    ambos sentidos -- se le da credito para su siguiente pedido). Si vienen
    items, entran a inventario igual que una recepcion de mercancia normal.
    El monto SIEMPRE se SUMA al saldo existente (nunca lo reemplaza) y queda
    un renglon de auditoria, a diferencia del ajuste manual viejo de
    Referidos que sobreescribia el numero sin dejar rastro de motivo."""
    try:
        monto = float(datos.get("monto") or 0)
        motivo = (datos.get("motivo") or "").strip()
        sucursal_id = datos.get("sucursal_id")
        items = datos.get("items") or []
        if monto <= 0:
            return JSONResponse(status_code=400, content={"error": "El monto debe ser mayor a 0"})

        clientes_row = supabase_get(f"clientes?id=eq.{id}&select=id,credito_disponible")
        if not clientes_row:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        saldo_actual = float(clientes_row[0].get("credito_disponible") or 0)

        for i in items:
            variante_id = i.get("variante_id")
            cantidad = int(i.get("cantidad") or 0)
            if not variante_id or cantidad <= 0 or not sucursal_id:
                continue
            # entrada ATÓMICA al inventario (crea la fila si no existía)
            _aj = inventario_ajustar(variante_id, sucursal_id, cantidad, crear=True)
            cantidad_anterior = _aj["anterior"] if _aj else 0
            supabase_post("movimientos_inventario", {
                "tipo": "entrada",
                "variante_id": variante_id,
                "sucursal_id": sucursal_id,
                "cantidad": cantidad,
                "cantidad_anterior": cantidad_anterior,
                "motivo": f"Devolucion cliente (nota de credito){' - ' + motivo if motivo else ''}",
            })

        # Suma al saldo con compare-and-swap: dos notas de crédito simultáneas ya no pisan la otra
        # (antes: leer, sumar y escribir sin condición).
        nuevo_saldo = None
        for _ in range(5):
            nuevo_saldo = round(saldo_actual + monto, 2)
            if supabase_patch(f"clientes?id=eq.{id}&credito_disponible=eq.{saldo_actual:.2f}", {"credito_disponible": nuevo_saldo}):
                break
            releido = supabase_get(f"clientes?id=eq.{id}&select=credito_disponible") or [{}]
            saldo_actual = float(releido[0].get("credito_disponible") or 0)
            nuevo_saldo = None
        if nuevo_saldo is None:
            return JSONResponse(status_code=409, content={"error": "El saldo cambió mientras se guardaba; intenta de nuevo"})
        supabase_post("clientes_creditos_historial", {
            "cliente_id": id,
            "monto": monto,
            "tipo": "nota_credito",
            "motivo": motivo or None,
            "saldo_despues": nuevo_saldo,
        })
        return {"ok": True, "credito_disponible": nuevo_saldo}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/{id}/ajustar-credito")
def ajustar_credito_cliente(id: str, datos: dict, _staff=Depends(require_staff)):
    """Fija el saldo a favor del cliente en un monto exacto (corrección manual) y deja renglón de auditoría con
    la diferencia. Antes el panel hacía PATCH credito_disponible=<monto> directo: sobrescribía sin dejar rastro."""
    try:
        try:
            nuevo = round(float(datos.get("nuevo_saldo")), 2)
        except (TypeError, ValueError):
            return JSONResponse(status_code=400, content={"error": "Monto inválido"})
        if nuevo < 0:
            return JSONResponse(status_code=400, content={"error": "El saldo no puede ser negativo"})
        fila = supabase_get(f"clientes?id=eq.{id}&select=credito_disponible")
        if not fila:
            return JSONResponse(status_code=404, content={"error": "Cliente no encontrado"})
        anterior = float(fila[0].get("credito_disponible") or 0)
        supabase_patch(f"clientes?id=eq.{id}", {"credito_disponible": nuevo})
        if round(nuevo - anterior, 2) != 0:
            supabase_post("clientes_creditos_historial", {
                "cliente_id": id, "monto": round(nuevo - anterior, 2), "tipo": "ajuste_manual",
                "motivo": (datos.get("motivo") or "Ajuste manual desde el panel")[:200], "saldo_despues": nuevo,
            })
        return {"ok": True, "credito_disponible": nuevo, "anterior": anterior}
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

# ───────────────────────── Unir clientes duplicados ─────────────────────────
# Tablas que apuntan a clientes(id): al unir, todo lo del duplicado pasa al cliente principal.
_TABLAS_CLIENTE = (
    "pedidos", "usuarios", "crm_seguimientos", "crm_etiquetas", "crm_oportunidades", "portal_otp",
    "sugerencias_clientes", "push_subscriptions", "restock_watchers", "clientes_creditos_historial", "mayorista_registro",
)
_CAMPOS_RELLENAR = ("telefono", "email", "ciudad", "estado", "direccion", "codigo_postal", "lada", "origen")


def _clave_nombre(n) -> str:
    import re, unicodedata
    s = unicodedata.normalize("NFKD", str(n or "")).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def _tel10(t) -> str:
    return "".join(c for c in str(t or "") if c.isdigit())[-10:]


_CACHE_DUP = {"t": 0, "data": None}


def _nombre_contenido(a: str, b: str) -> bool:
    """Los dos nombres (ya normalizados) son la misma persona escrita más corta o más larga: «alejandra vergara» ⊂ «alejandra vergara benitez».
    El corto necesita al menos 2 palabras."""
    ta, tb = set(a.split()), set(b.split())
    corto, largo = (ta, tb) if len(ta) <= len(tb) else (tb, ta)
    return len(corto) >= 2 and corto <= largo


def _buscar_parecidos(nombre, telefono, email) -> list:
    """Clientes activos que ya tienen ese teléfono (10 dígitos), ese correo, ese nombre exacto o un nombre que lo contiene."""
    t10 = _tel10(telefono)
    mail = str(email or "").strip().lower()
    nom = _clave_nombre(nombre)
    cs = supabase_get_all("clientes?activo=eq.true&select=id,nombre,telefono,email,tipo,created_at")
    salida = []
    for c in cs:
        motivo = None
        if len(t10) == 10 and _tel10(c.get("telefono")) == t10:
            motivo = "mismo teléfono"
        elif mail and str(c.get("email") or "").strip().lower() == mail:
            motivo = "mismo correo"
        elif nom and len(nom.split()) >= 2:
            cn = _clave_nombre(c.get("nombre"))
            if cn == nom:
                motivo = "mismo nombre"
            elif _nombre_contenido(nom, cn):
                tc = _tel10(c.get("telefono"))
                if not (len(t10) == 10 and len(tc) == 10 and tc != t10):
                    motivo = "nombre parecido"
        if motivo:
            salida.append({"id": c["id"], "nombre": c.get("nombre"), "telefono": c.get("telefono"), "email": c.get("email"), "motivo": motivo})
    return salida[:5]


@router.get("/duplicados/conteo")
def clientes_duplicados_conteo(_staff=Depends(require_staff)):
    """Cuántos grupos de posibles repetidos hay (para el número del botón Unir clientes)."""
    r = clientes_duplicados(_staff)
    if isinstance(r, dict):
        return {"grupos": len(r.get("grupos") or [])}
    return {"grupos": 0}


@router.get("/duplicados/lista")
def clientes_duplicados(_staff=Depends(require_staff)):
    """Grupos de clientes activos que parecen la misma persona: mismo teléfono (10 dígitos), mismo correo, mismo nombre o un nombre que
    contiene al otro (siempre que los teléfonos no se contradigan). Se guarda 60 segundos en memoria."""
    import time as _t
    if _CACHE_DUP["data"] is not None and _t.time() - _CACHE_DUP["t"] < 60:
        return _CACHE_DUP["data"]
    try:
        r = _clientes_duplicados_calc()
        _CACHE_DUP.update({"t": _t.time(), "data": r})
        return r
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def _clientes_duplicados_calc():
    if True:
        cs = supabase_get_all("clientes?activo=eq.true&select=id,nombre,telefono,email,origen,tipo,created_at,credito_disponible")
        padre = {c["id"]: c["id"] for c in cs}

        def raiz(x):
            while padre[x] != x:
                padre[x] = padre[padre[x]]
                x = padre[x]
            return x

        def unir(a, b):
            ra, rb = raiz(a), raiz(b)
            if ra != rb:
                padre[ra] = rb

        por_tel, por_nom, por_mail = {}, {}, {}
        info_c = {}
        for c in cs:
            t = _tel10(c.get("telefono"))
            if len(t) == 10:
                por_tel.setdefault(t, []).append(c["id"])
            n = _clave_nombre(c.get("nombre"))
            if len(n.split()) >= 2:   # un nombre de una sola palabra no basta para suponer que es la misma persona
                por_nom.setdefault(n, []).append(c["id"])
            m = str(c.get("email") or "").strip().lower()
            if m and not m.startswith("contacto@"):   # el correo genérico del negocio lo comparten muchos mayoristas
                por_mail.setdefault(m, []).append(c["id"])
            info_c[c["id"]] = (n, t)
        for grupo in list(por_tel.values()) + list(por_nom.values()) + list(por_mail.values()):
            for x in grupo[1:]:
                unir(grupo[0], x)
        # nombre contenido en otro («Alejandra Vergara» y «ALEJANDRA VERGARA BENITEZ»), siempre que los teléfonos no se contradigan
        por_primero = {}
        for cid, (n, t) in info_c.items():
            if len(n.split()) >= 2:
                por_primero.setdefault(n.split()[0], []).append(cid)
        for lst in por_primero.values():
            for ia in range(len(lst)):
                for ib in range(ia + 1, len(lst)):
                    na, ta = info_c[lst[ia]]
                    nb, tb = info_c[lst[ib]]
                    if _nombre_contenido(na, nb) and not (len(ta) == 10 and len(tb) == 10 and ta != tb):
                        unir(lst[ia], lst[ib])
        grupos = {}
        for c in cs:
            grupos.setdefault(raiz(c["id"]), []).append(c)
        grupos = [g for g in grupos.values() if len(g) > 1]
        if not grupos:
            return {"grupos": []}

        ids = [c["id"] for g in grupos for c in g]
        pedidos, usuarios = [], set()
        for i in range(0, len(ids), 100):
            lote = ",".join(ids[i:i + 100])
            pedidos += supabase_get_all(f"pedidos?cliente_id=in.({lote})&select=cliente_id,created_at") or []
            usuarios |= {u["cliente_id"] for u in (supabase_get(f"usuarios?cliente_id=in.({lote})&select=cliente_id") or [])}
        info = {}
        for p in pedidos:
            d = info.setdefault(p["cliente_id"], {"n": 0, "ultimo": ""})
            d["n"] += 1
            d["ultimo"] = max(d["ultimo"], p.get("created_at") or "")
        salida = []
        for g in grupos:
            for c in g:
                d = info.get(c["id"], {"n": 0, "ultimo": ""})
                c["pedidos"], c["ultimo_pedido"], c["tiene_acceso"] = d["n"], d["ultimo"] or None, c["id"] in usuarios
            # sugerido como principal: el del pedido más reciente; si nadie tiene, el que tiene acceso al portal; si no, el más nuevo
            g.sort(key=lambda c: (c["ultimo_pedido"] or "", c["tiene_acceso"], c.get("created_at") or ""), reverse=True)
            tels = {_tel10(c.get("telefono")) for c in g}
            noms = {_clave_nombre(c.get("nombre")) for c in g}
            mails = {str(c.get("email") or "").strip().lower() for c in g}
            mismo_tel = len(tels) == 1 and len(next(iter(tels))) == 10
            if mismo_tel and len(noms) == 1:
                motivo = "mismo teléfono y mismo nombre"
            elif mismo_tel:
                motivo = "mismo teléfono"
            elif len(noms) == 1:
                motivo = "mismo nombre"
            elif len(mails) == 1 and "" not in mails:
                motivo = "mismo correo"
            else:
                motivo = "nombre parecido (uno es más corto que el otro)"
            salida.append({"motivo": motivo, "sugerido": g[0]["id"], "clientes": g})
        salida.sort(key=lambda x: -sum(c["pedidos"] for c in x["clientes"]))
        return {"grupos": salida}


@router.post("/duplicados/unir")
def unir_clientes(datos: dict, _staff=Depends(require_staff)):
    """Une clientes duplicados en uno (principal): pedidos, acceso al portal, CRM, crédito, etc. pasan al principal; los datos de contacto
    que le falten se rellenan con los del duplicado. El duplicado NO se borra: queda inactivo (sin teléfono, para que no estorbe) con una nota."""
    import re as _re
    from datetime import datetime
    uuid = r"[0-9a-fA-F-]{36}"
    principal_id = str(datos.get("principal_id") or "")
    dups = [str(i) for i in (datos.get("duplicados") or []) if str(i) != principal_id]
    if not _re.fullmatch(uuid, principal_id) or not dups or not all(_re.fullmatch(uuid, i) for i in dups) or len(dups) > 10:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Elige el cliente principal y al menos un duplicado"})
    try:
        pr = supabase_get(f"clientes?id=eq.{principal_id}")
        if not pr:
            return JSONResponse(status_code=404, content={"ok": False, "error": "No se encontró el cliente principal"})
        principal = pr[0]
        resultado, avisos, notas = [], [], []
        cambios = {}
        credito = float(principal.get("credito_disponible") or 0)
        limite = float(principal.get("limite_credito") or 0)
        for did in dups:
            d = (supabase_get(f"clientes?id=eq.{did}") or [None])[0]
            if not d:
                avisos.append(f"{did}: no existe")
                continue
            movidos = {}
            for t in _TABLAS_CLIENTE:
                try:
                    filas = supabase_get(f"{t}?cliente_id=eq.{did}&select=cliente_id&limit=1000") or []
                    if filas:
                        supabase_patch(f"{t}?cliente_id=eq.{did}", {"cliente_id": principal_id})
                        movidos[t] = len(filas)
                except Exception as e:
                    avisos.append(f"{t}: {str(e)[:120]}")
            for campo in _CAMPOS_RELLENAR:
                if not (principal.get(campo) or cambios.get(campo)) and d.get(campo):
                    cambios[campo] = d[campo]
            credito += float(d.get("credito_disponible") or 0)
            limite = max(limite, float(d.get("limite_credito") or 0))
            if d.get("frecuente_wa") and not principal.get("frecuente_wa"):
                cambios["frecuente_wa"] = True
            if d.get("comentarios_internos"):
                notas.append(str(d["comentarios_internos"]))
            nota = f"Unido a {principal.get('nombre')} ({principal_id}) el {datetime.now().strftime('%Y-%m-%d')}. Teléfono original: {d.get('telefono') or '—'}; correo: {d.get('email') or '—'}."
            supabase_patch(f"clientes?id=eq.{did}", {
                "activo": False, "telefono": None,
                "comentarios_internos": ((d.get("comentarios_internos") or "") + "\n" + nota).strip(),
            })
            resultado.append({"id": did, "nombre": d.get("nombre"), "movidos": movidos})
        if credito != float(principal.get("credito_disponible") or 0):
            cambios["credito_disponible"] = credito
        if limite != float(principal.get("limite_credito") or 0):
            cambios["limite_credito"] = limite
        if notas:
            cambios["comentarios_internos"] = ((principal.get("comentarios_internos") or "") + "\n" + "\n".join(notas)).strip()
        if cambios:
            supabase_patch(f"clientes?id=eq.{principal_id}", cambios)
        _CACHE_DUP["data"] = None
        return {"ok": True, "principal": principal.get("nombre"), "unidos": resultado, "datos_completados": sorted(cambios.keys()), "avisos": avisos}
    except Exception as e:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(e)})


# ───────────────────────── Ritmo de compra de los mayoristas ─────────────────────────
_CACHE_RITMO = {"t": 0, "data": None}
_RITMO_MIN_COMPRAS = 3   # compras en días distintos para poder hablar de un «ritmo» (2 intervalos)


def calcular_ritmo_mayoristas() -> list:
    """Mayoristas/zapaterías que ya pasaron su tiempo promedio entre pedidos.
    Promedio = días entre sus compras (varias compras el mismo día cuentan como una). Atrasado = días sin pedir >= su promedio.
    nivel: 'pasado' (1 a 1.5 veces su promedio), 'atrasado' (1.5 a 3) y 'posible_perdido' (3 o más: quizá ya no compra)."""
    import time as _t
    from datetime import datetime, timezone, timedelta
    if _CACHE_RITMO["data"] is not None and _t.time() - _CACHE_RITMO["t"] < 600:
        return _CACHE_RITMO["data"]
    cs = supabase_get_all("clientes?activo=eq.true&tipo=in.(mayoreo,zapateria)&select=id,nombre,telefono,tipo")
    por_id = {c["id"]: c for c in cs}
    pedidos = supabase_get_all("pedidos?status=in.(confirmado,pagado,enviado,entregado)&cliente_id=not.is.null&select=cliente_id,confirmado_at,created_at")
    tz = timezone(timedelta(hours=-6))
    dias = {}
    for p in pedidos:
        cid = p.get("cliente_id")
        if cid not in por_id:
            continue
        ts = p.get("confirmado_at") or p.get("created_at")
        try:
            d = datetime.fromisoformat(str(ts).replace("Z", "+00:00")).astimezone(tz).date()
        except Exception:
            continue
        dias.setdefault(cid, set()).add(d)
    hoy = datetime.now(tz).date()
    salida = []
    for cid, ds in dias.items():
        ds = sorted(ds)
        if len(ds) < _RITMO_MIN_COMPRAS:
            continue
        intervalos = [(b - a).days for a, b in zip(ds, ds[1:])]
        prom = sum(intervalos) / len(intervalos)
        if prom <= 0:
            continue
        sin_pedir = (hoy - ds[-1]).days
        razon = sin_pedir / prom
        if razon < 1:
            continue
        nivel = "pasado" if razon < 1.5 else ("atrasado" if razon < 3 else "posible_perdido")
        cl = por_id[cid]
        salida.append({"id": cid, "nombre": (cl.get("nombre") or "").strip(), "telefono": cl.get("telefono"), "tipo": cl.get("tipo"),
                       "compras": len(ds), "promedio_dias": round(prom, 1), "ultimo_pedido": ds[-1].isoformat(),
                       "dias_sin_pedir": sin_pedir, "veces_su_promedio": round(razon, 1), "nivel": nivel,
                       "cruzo_hoy": prom <= sin_pedir < prom + 1})
    orden = {"pasado": 0, "atrasado": 1, "posible_perdido": 2}
    salida.sort(key=lambda x: (orden[x["nivel"]], -x["veces_su_promedio"]))
    _CACHE_RITMO.update({"t": _t.time(), "data": salida})
    return salida


@router.get("/ritmo-compra")
def ritmo_mayoristas(_staff=Depends(require_staff)):
    """Mayoristas que ya pasaron su tiempo promedio de pedido (ver calcular_ritmo_mayoristas)."""
    try:
        return {"clientes": calcular_ritmo_mayoristas()}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)[:300]})
