# -*- coding: utf-8 -*-
"""
Precio de TikTok Shop por modelo.

Objetivo (decisión del dueño, 2026-11-24): que TikTok DEPOSITE por cada par al menos «precio de corrida + $70» aun cuando
  - la campaña le quite $30 al precio de lista (descuento que paga el vendedor), y
  - la venta venga de un creador afiliado al 5% (peor caso).
Si el precio de siempre (panel + $80 + $65) ya cumple, se conserva: este cálculo solo SUBE precios, nunca los baja.

Tarifas + impuestos de TikTok: salen de 10 pedidos reales sin afiliado (estados de cuenta del 2026-11-24): venta neta S -> descuento F.
Entre esos puntos se interpola; fuera de ese rango se usa una pendiente conservadora. El afiliado al 5% cuesta 5% de S
(comisión sobre S/1.16 más su IVA 16%). Los impuestos retenidos (ISR 1%, IVA 8%) se cuentan como dinero que no llega: son acreditables
en las declaraciones, así que la utilidad real es algo mayor.
"""
import math

# (venta neta, tarifas e impuestos descontados por TikTok) - pedidos reales sin afiliado
_OBS = [(345, 92.98), (490, 129.08), (520, 135.48), (540, 138.92), (600, 149.24), (605, 150.10), (615, 151.82),
        (675, 162.15), (684, 163.69), (710, 168.16)]
_PEND_BAJA, _PEND_ALTA = 0.25, 0.19   # fuera del rango observado: pendiente conservadora (más tarifa de la real)

UTILIDAD = 70        # pesos por par sobre el precio de corrida
DESCUENTO = 30       # descuento de campaña que paga el vendedor
AFILIADO = 0.05      # comisión de afiliados (5%) -> 5% de la venta neta con su IVA


def tarifas(S: float) -> float:
    """Tarifas + impuestos que TikTok descuenta de una venta neta S (sin afiliado)."""
    if S <= _OBS[0][0]:
        return _OBS[0][1] - (_OBS[0][0] - S) * _PEND_BAJA
    if S >= _OBS[-1][0]:
        return _OBS[-1][1] + (S - _OBS[-1][0]) * _PEND_ALTA
    for (x0, y0), (x1, y1) in zip(_OBS, _OBS[1:]):
        if x0 <= S <= x1:
            return y0 + (y1 - y0) * (S - x0) / (x1 - x0)
    return _OBS[-1][1]


def deposito(S: float, afiliado: bool = True) -> float:
    """Lo que TikTok deposita por una venta neta S."""
    return S - tarifas(S) - (AFILIADO * S if afiliado else 0.0)


def precio_corrida(p: dict) -> float:
    """Precio de corrida del producto; si no lo tiene, precio de menudeo del panel - $100."""
    menudeo = float(p.get("precio_menudeo") or 0)
    return float(p.get("precio_corrida") or 0) or max(0.0, menudeo - 100)


def precio_anterior(p: dict) -> float:
    """El de siempre: panel + $80 (salvo ofertas) + $65 del IVA."""
    return float(p.get("precio_menudeo") or 0) + (0 if p.get("es_oferta") else 80) + 65


def precio_minimo(p: dict) -> int:
    """Menor precio de lista (múltiplo de $5) con el que TikTok deposita >= corrida + utilidad, con campaña de $30 y afiliado."""
    objetivo = precio_corrida(p) + UTILIDAD
    L = max(1, int(objetivo))
    while deposito(L - DESCUENTO, True) < objetivo:
        L += 1
    return int(math.ceil(L / 5.0) * 5)


def precio_tiktok(p: dict) -> float:
    """Precio de lista en TikTok: el de siempre o el mínimo para la utilidad, el que sea MAYOR."""
    if float(p.get("precio_menudeo") or 0) <= 0:
        return 0.0
    return float(max(precio_anterior(p), precio_minimo(p)))
