// ═══ Reempaquetar audio Opus de webm (lo que graba Chrome) a OGG/Opus, sin volver a comprimir ═══════════════════════════════
// WhatsApp solo acepta como NOTA DE VOZ (voice: true) archivos .ogg con códec OPUS. Chrome graba Opus pero dentro de un contenedor webm:
// el sonido es el mismo, solo cambia la «caja». Aquí se sacan los paquetes Opus del webm y se escriben en páginas Ogg (RFC 3533 / RFC 7845).
const _crcTabla = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) { let r = i << 24; for (let j = 0; j < 8; j++) r = (r & 0x80000000) ? ((r << 1) ^ 0x04C11DB7) : (r << 1); t[i] = r >>> 0 }
  return t
})()
const _crcOgg = (bytes) => { let c = 0; for (let i = 0; i < bytes.length; i++) c = ((c << 8) ^ _crcTabla[((c >>> 24) ^ bytes[i]) & 0xFF]) >>> 0; return c >>> 0 }

// Muestras (a 48 kHz) que dura un paquete Opus, según su byte TOC (RFC 6716)
const _muestrasPaquete = (p) => {
  const toc = p[0], cfg = toc >> 3
  let ms
  if (cfg < 12) ms = [10, 20, 40, 60][cfg & 3]
  else if (cfg < 16) ms = [10, 20][cfg & 1]
  else ms = [2.5, 5, 10, 20][cfg & 3]
  const c = toc & 3
  const tramas = c === 0 ? 1 : (c === 3 ? (p[1] & 0x3F) : 2)
  return Math.round(ms * 48 * tramas)
}

// Lee los paquetes Opus (y el OpusHead, si viene) de un webm
const _leerWebm = (u8) => {
  const MAESTROS = new Set([0x18538067, 0x1F43B675, 0xA0, 0x1654AE6B, 0xAE])   // Segment, Cluster, BlockGroup, Tracks, TrackEntry: se entra en ellos
  const paquetes = []; let cabeza = null, pos = 0
  const vint = (quitarMarca) => {
    const b = u8[pos]; if (b === undefined) return null
    let len = 1; while (len <= 8 && !(b & (0x80 >> (len - 1)))) len++
    if (len > 8) return null
    let v = quitarMarca ? (b & (0xFF >> len)) : b
    let desconocido = quitarMarca && (b & (0xFF >> len)) === (0xFF >> len)
    for (let i = 1; i < len; i++) { const x = u8[pos + i]; v = v * 256 + x; if (x !== 0xFF) desconocido = false }
    pos += len
    return { v, len, desconocido }
  }
  while (pos < u8.length) {
    const id = vint(false); if (!id) break
    const tam = vint(true); if (!tam) break
    if (MAESTROS.has(id.v)) continue
    const fin = tam.desconocido ? u8.length : pos + tam.v
    if (id.v === 0x63A2 && !cabeza) cabeza = u8.slice(pos, fin)                   // CodecPrivate = OpusHead
    else if (id.v === 0xA3 || id.v === 0xA1) {                                     // SimpleBlock / Block
      let q = pos; const b = u8[q]; let l = 1; while (l <= 8 && !(b & (0x80 >> (l - 1)))) l++
      q += l + 2                                                                    // número de pista + marca de tiempo
      const flags = u8[q]; q += 1
      if (flags & 0x06) throw new Error('webm con lacing: no soportado')
      const trama = u8.slice(q, fin); if (trama.length) paquetes.push(trama)
    }
    pos = fin
  }
  return { paquetes, cabeza }
}

const _pagina = (tipo, granule, serie, num, paquetes) => {
  const segs = []
  paquetes.forEach(p => { let r = p.length; while (r >= 255) { segs.push(255); r -= 255 } segs.push(r) })
  if (segs.length > 255) throw new Error('página Ogg demasiado grande')
  const datos = paquetes.reduce((t, p) => t + p.length, 0)
  const out = new Uint8Array(27 + segs.length + datos), dv = new DataView(out.buffer)
  out.set([0x4F, 0x67, 0x67, 0x53, 0, tipo]); dv.setUint32(6, granule % 4294967296, true); dv.setUint32(10, Math.floor(granule / 4294967296), true)
  dv.setUint32(14, serie, true); dv.setUint32(18, num, true); out[26] = segs.length; out.set(segs, 27)
  let o = 27 + segs.length; paquetes.forEach(p => { out.set(p, o); o += p.length })
  dv.setUint32(22, _crcOgg(out), true)
  return out
}

window.webmOpusAOgg = async (blob) => {
  const { paquetes, cabeza } = _leerWebm(new Uint8Array(await blob.arrayBuffer()))
  if (!paquetes.length) throw new Error('no se encontraron paquetes de audio')
  let head = cabeza
  if (!head || String.fromCharCode(...head.slice(0, 8)) !== 'OpusHead') {           // sin OpusHead: uno estándar mono
    head = new Uint8Array(19); head.set([0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64, 1, 1, 0x38, 0x01]); new DataView(head.buffer).setUint32(12, 48000, true)
  }
  const vendor = new TextEncoder().encode('Zapatillas May'), tags = new Uint8Array(8 + 4 + vendor.length + 4), tdv = new DataView(tags.buffer)
  tags.set([0x4F, 0x70, 0x75, 0x73, 0x54, 0x61, 0x67, 0x73]); tdv.setUint32(8, vendor.length, true); tags.set(vendor, 12)
  const serie = (Math.random() * 4294967295) >>> 0
  const paginas = [_pagina(0x02, 0, serie, 0, [head]), _pagina(0x00, 0, serie, 1, [tags])]
  let num = 2, total = 0
  for (let i = 0; i < paquetes.length; i += 40) {                                  // ~0.8 s por página
    const grupo = paquetes.slice(i, i + 40)
    grupo.forEach(p => { total += _muestrasPaquete(p) })
    paginas.push(_pagina(i + 40 >= paquetes.length ? 0x04 : 0x00, total, serie, num++, grupo))
  }
  return new File(paginas, 'audio.ogg', { type: 'audio/ogg' })
}
