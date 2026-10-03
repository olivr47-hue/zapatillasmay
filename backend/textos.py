"""Limpieza de texto que escribe el PÚBLICO (registro, checkout, reseñas...). El panel de administración pinta muchos de estos
campos con innerHTML; quitar "<" y ">" en la entrada evita que un nombre como <img onerror=...> se ejecute en la sesión de
quien administra (defensa en profundidad: el panel además escapa lo que viene de chats)."""


def sin_html(valor):
    if not isinstance(valor, str):
        return valor
    return valor.replace("<", "").replace(">", "").strip()


def limpiar_campos(d, campos):
    """Modifica d en sitio: aplica sin_html a los campos de texto indicados. Devuelve d."""
    if isinstance(d, dict):
        for c in campos:
            if isinstance(d.get(c), str):
                d[c] = sin_html(d[c])
    return d
