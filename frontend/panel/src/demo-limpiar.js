// ═══ DEMO: limpiador de fondo blanco que corre en el navegador (no usa ningún servidor) ══════════════════════════════════
// Misma idea que el del sistema real: mide el color del fondo en las orillas, lo vuelve blanco parejo y centra el zapato en un cuadrado.
// Funciona con fotos de zapato sobre fondo liso y claro. Si la foto no se presta, avisa por qué (igual que el sistema real).
const MAX = 2000

async function cargar(file) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const esc = Math.min(1, MAX / Math.max(bmp.width, bmp.height))
  const w = Math.max(1, Math.round(bmp.width * esc)), h = Math.max(1, Math.round(bmp.height * esc))
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const x = c.getContext('2d', { willReadFrequently: true })
  x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(bmp, 0, 0, w, h)
  return { c, x, w, h }
}

// Plano de color del fondo por canal: z = a + b*x + c*y, ajustado a las orillas (donde no hay zapato), con 2 pasadas que quitan atípicos
function ajustarFondo(d, w, h) {
  const m = Math.max(4, Math.round(Math.min(w, h) * 0.05)), paso = 3
  const pts = []
  const tomar = (x, y) => { const i = (y * w + x) * 4; pts.push([x / w - 0.5, y / h - 0.5, d[i], d[i + 1], d[i + 2]]) }
  for (let y = 0; y < h; y += paso) { for (let x = 0; x < m; x += paso) tomar(x, y); for (let x = w - m; x < w; x += paso) tomar(x, y) }
  for (let x = m; x < w - m; x += paso) { for (let y = 0; y < m; y += paso) tomar(x, y); for (let y = h - m; y < h; y += paso) tomar(x, y) }
  const coef = [], res = []
  for (let ch = 0; ch < 3; ch++) {
    let uso = pts, k
    for (let it = 0; it < 3; it++) {
      // mínimos cuadrados 3x3 (normal equations)
      let sxx = 0, sxy = 0, sx = 0, syy = 0, sy = 0, n = 0, bz = 0, bx = 0, by = 0
      for (const p of uso) { const z = p[2 + ch]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; sx += p[0]; syy += p[1] * p[1]; sy += p[1]; n++; bz += z; bx += z * p[0]; by += z * p[1] }
      const A = [[n, sx, sy], [sx, sxx, sxy], [sy, sxy, syy]], B = [bz, bx, by]
      const det = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
      const D = det(A) || 1e-9
      const col = (j) => A.map((r, i) => r.map((v, c) => c === j ? B[i] : v))
      k = [det(col(0)) / D, det(col(1)) / D, det(col(2)) / D]
      const err = pts.map(p => p[2 + ch] - (k[0] + k[1] * p[0] + k[2] * p[1]))
      uso = pts.filter((p, i) => Math.abs(err[i]) < 12)
      if (uso.length < pts.length * 0.5) throw new Error('el fondo de las orillas no es parejo')
    }
    const e = pts.filter(p => Math.abs(p[2 + ch] - (k[0] + k[1] * p[0] + k[2] * p[1])) < 12).map(p => p[2 + ch] - (k[0] + k[1] * p[0] + k[2] * p[1]))
    res.push(Math.sqrt(e.reduce((s, v) => s + v * v, 0) / Math.max(1, e.length)))
    coef.push(k)
  }
  return { coef, resid: Math.max(...res) }
}

export async function limpiarFotoDemo(file, lado = 1600, ocupa = 0.9) {
  const { c, x, w, h } = await cargar(file)
  const img = x.getImageData(0, 0, w, h), d = img.data
  const { coef, resid } = ajustarFondo(d, w, h)
  const claro = (coef[0][0] + coef[1][0] + coef[2][0]) / 3
  if (resid > 16) throw new Error('el fondo de las orillas no es parejo')
  if (claro < 150) throw new Error('el fondo es muy oscuro; usa una foto sobre fondo blanco o gris claro')
  const dist = new Float32Array(w * h)
  let fuertes = 0, x0 = w, x1 = -1, y0 = h, y1 = -1
  const filas = new Uint32Array(h), cols = new Uint32Array(w)
  for (let y = 0; y < h; y++) {
    const yn = y / h - 0.5
    for (let xx = 0; xx < w; xx++) {
      const i = (y * w + xx) * 4, xn = xx / w - 0.5
      const dr = d[i] - (coef[0][0] + coef[0][1] * xn + coef[0][2] * yn), dg = d[i + 1] - (coef[1][0] + coef[1][1] * xn + coef[1][2] * yn), db = d[i + 2] - (coef[2][0] + coef[2][1] * xn + coef[2][2] * yn)
      const t = Math.sqrt(dr * dr + dg * dg + db * db)
      dist[y * w + xx] = t
      if (t > 46) { fuertes++; filas[y]++; cols[xx]++ }
    }
  }
  if (fuertes < w * h * 0.004) throw new Error('no se encontró el zapato en la foto')
  const minF = Math.max(2, Math.round(w * 0.004)), minC = Math.max(2, Math.round(h * 0.004))
  for (let y = 0; y < h; y++) if (filas[y] >= minF) { y0 = y; break }
  for (let y = h - 1; y >= 0; y--) if (filas[y] >= minF) { y1 = y; break }
  for (let xx = 0; xx < w; xx++) if (cols[xx] >= minC) { x0 = xx; break }
  for (let xx = w - 1; xx >= 0; xx--) if (cols[xx] >= minC) { x1 = xx; break }
  if (x1 <= x0 || y1 <= y0) throw new Error('no se encontró el zapato en la foto')
  const bordes = (x0 < w * 0.01 ? 1 : 0) + (x1 > w * 0.99 ? 1 : 0) + (y0 < h * 0.01 ? 1 : 0) + (y1 > h * 0.99 ? 1 : 0)
  if (bordes >= 2) throw new Error('el zapato toca las orillas de la foto')
  // fondo → blanco (conserva la sombra suave: lo que apenas se aleja del fondo queda a medias)
  for (let p = 0, i = 0; p < w * h; p++, i += 4) {
    const a = Math.min(1, Math.max(0, (dist[p] - 14) / 30))
    d[i] = 255 + (d[i] - 255) * a; d[i + 1] = 255 + (d[i + 1] - 255) * a; d[i + 2] = 255 + (d[i + 2] - 255) * a
  }
  x.putImageData(img, 0, 0)
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1
  const s = (lado * ocupa) / Math.max(bw, bh)
  const out = document.createElement('canvas'); out.width = lado; out.height = lado
  const o = out.getContext('2d'); o.fillStyle = '#fff'; o.fillRect(0, 0, lado, lado)
  o.imageSmoothingQuality = 'high'
  o.drawImage(c, x0, y0, bw, bh, (lado - bw * s) / 2, (lado - bh * s) / 2, bw * s, bh * s)
  return await new Promise(r => out.toBlob(r, 'image/jpeg', 0.92))
}

// Foto que no es 1:1: se centra completa en un cuadrado (sin recortar)
export async function cuadrarFotoDemo(file) {
  const { c, w, h } = await cargar(file)
  if (Math.abs(w - h) / Math.max(w, h) <= 0.02) return file
  const L = Math.max(w, h)
  const out = document.createElement('canvas'); out.width = L; out.height = L
  const o = out.getContext('2d'); o.fillStyle = '#fff'; o.fillRect(0, 0, L, L); o.drawImage(c, (L - w) / 2, (L - h) / 2)
  return await new Promise(r => out.toBlob(r, 'image/jpeg', 0.92))
}

export const aDataUrl = (blob) => new Promise((res, rej) => { const f = new FileReader(); f.onload = () => res(f.result); f.onerror = rej; f.readAsDataURL(blob) })
