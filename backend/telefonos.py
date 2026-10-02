"""Normalización de teléfonos para WhatsApp (formato internacional sin '+')."""
import re


def a_e164_mx(valor) -> str:
    """Devuelve el número en formato internacional para la API de WhatsApp.
    - 10 dígitos -> México: se antepone 52.
    - 12 dígitos con 52 -> ya está completo.
    - 13 dígitos con 521 (formato móvil antiguo) -> 52 + los 10 dígitos.
    - Cualquier otro (ej. EE. UU./Canadá con 11 dígitos que empiezan en 1) se deja tal cual.
    Antes cada envío hacía `if not empieza con "52": "52" + número`, lo que rompía los números de EE. UU./Canadá
    (a los que la tienda también envía) anteponiéndoles 52 y decidía mal según los primeros dígitos."""
    d = re.sub(r"\D", "", str(valor or ""))
    if len(d) == 10:
        return "52" + d
    if len(d) == 13 and d.startswith("521"):
        return "52" + d[3:]
    return d
