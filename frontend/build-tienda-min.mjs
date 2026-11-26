// Genera frontend/tienda-min/ = la tienda con el código comprimido (sin comentarios ni nombres legibles). frontend/tienda/ sigue siendo
// el código fuente que se edita; tienda-min/ es lo que se despliega y lo que lee el servidor para armar las páginas de producto.
//
// Uso (desde la carpeta frontend):  node build-tienda-min.mjs
//
// Qué hace:
//  · copia la tienda a tienda-min/ sin archivos de trabajo (.claude, .vercel, .bak) y sin las versiones viejas de assets/ que ningún HTML usa;
//  · comprime con esbuild los .js, los .css, y los <script> y <style> que van dentro de los .html;
//  · NO toca los marcadores del HTML que el servidor usa para inyectar datos (<!-- RESEÑAS -->, <!--GRID:...-->, etc.) ni los JSON-LD.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const esbuild = require('./panel/node_modules/esbuild')

const SRC = path.resolve('tienda'), OUT = path.resolve('tienda-min')
const IGNORAR = new Set(['.claude', '.vercel', '.gitignore', 'index.html.bak', 'node_modules'])

fs.rmSync(OUT, { recursive: true, force: true })

// 1) assets que algún archivo realmente usa (los demás son versiones viejas con hash)
const todos = []
const recorre = (d) => { for (const n of fs.readdirSync(d)) { if (IGNORAR.has(n)) continue; const p = path.join(d, n); fs.statSync(p).isDirectory() ? recorre(p) : todos.push(p) } }
recorre(SRC)
const usados = new Set()
for (const f of todos) {
  if (!/\.(html|js|css|json)$/.test(f)) continue
  const t = fs.readFileSync(f, 'utf8')
  for (const m of t.matchAll(/assets\/([A-Za-z0-9._\-]+\.(?:js|css))/g)) usados.add(m[1])
}

let nJs = 0, nCss = 0, nHtml = 0, nInline = 0, saltados = 0, antes = 0, despues = 0
const errores = []
const min = (codigo, loader, nombre) => {
  try { return esbuild.transformSync(codigo, { loader, minify: true, legalComments: 'none', target: 'es2019' }).code }
  catch (e) { errores.push(`${nombre}: ${String(e.message).split('\n')[0]}`); return null }
}

for (const f of todos) {
  const rel = path.relative(SRC, f).replace(/\\/g, '/')
  if (rel.startsWith('assets/') && !usados.has(rel.slice(7))) { saltados++; continue }
  const destino = path.join(OUT, rel)
  fs.mkdirSync(path.dirname(destino), { recursive: true })
  const orig = fs.readFileSync(f)
  antes += orig.length
  let sal = orig
  if (/\.js$/.test(f)) {
    const r = min(orig.toString('utf8'), 'js', rel)
    if (r != null) { sal = Buffer.from(r); nJs++ }
  } else if (/\.css$/.test(f)) {
    const r = min(orig.toString('utf8'), 'css', rel)
    if (r != null) { sal = Buffer.from(r); nCss++ }
  } else if (/\.html$/.test(f)) {
    let t = orig.toString('utf8')
    // Una sola pasada: <script>/<style> se comprimen; los comentarios HTML se quitan EXCEPTO los marcadores que usa el servidor
    // (<!--GRID:...-->, <!--GUIA_TACONES_N-->, <!-- RESEÑAS -->). El comentario que aparece antes de un <script> evita confundirlo con uno real.
    t = t.replace(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)|(<!--[\s\S]*?-->)/g, (m, bloque, comentario) => {
      if (comentario) return /^<!--\s*(GRID:|GUIA_|RESEÑAS)/.test(comentario) ? comentario : ''
      const ap = bloque.match(/^<(script|style)\b([^>]*)>/i)
      const tag = ap[1].toLowerCase(), attrs = ap[2]
      const cuerpo = bloque.slice(ap[0].length, bloque.length - `</${tag}>`.length)
      if (!cuerpo.trim()) return bloque
      if (tag === 'script') {
        if (/\bsrc\s*=/.test(attrs) || /type\s*=\s*["']?(?!text\/javascript|module)/i.test(attrs)) return bloque   // con src, JSON-LD y otros tipos: intactos
        const r = min(cuerpo, 'js', rel + ' <script>')
        if (r == null) return bloque
        nInline++
        return `<script${attrs}>${r.replace(/<\/script/gi, '<\\/script')}</script>`
      }
      const r = min(cuerpo, 'css', rel + ' <style>')
      return r == null ? bloque : `<style${attrs}>${r}</style>`
    })
    sal = Buffer.from(t); nHtml++
  }
  despues += sal.length
  fs.writeFileSync(destino, sal)
}
console.log(`js:${nJs} css:${nCss} html:${nHtml} (scripts dentro del html: ${nInline}) | assets viejos descartados: ${saltados}`)
console.log(`peso de lo procesado: ${(antes / 1024).toFixed(0)} KB -> ${(despues / 1024).toFixed(0)} KB`)
if (errores.length) { console.log('\nNO se pudieron comprimir (se dejaron como estaban):'); errores.forEach(e => console.log(' -', e)) }
// Nombres nuevos con hash del CONTENIDO comprimido: Cloudflare/los navegadores guardan assets/ por un año (immutable) y, con el mismo nombre, seguirían
// mostrando la versión vieja sin comprimir. Con el nombre nuevo se descarga la comprimida.
import crypto from 'node:crypto'
const renombres = {}
for (const n of fs.readdirSync(path.join(OUT, 'assets'))) {
  const m = n.match(/^(.*?)(?:\.v\d+|\.[0-9a-f]{8})?\.(js|css)$/)
  if (!m) continue
  const h = crypto.createHash('sha1').update(fs.readFileSync(path.join(OUT, 'assets', n))).digest('hex').slice(0, 8)
  const nuevo = `${m[1]}.${h}.${m[2]}`
  if (nuevo !== n) { fs.renameSync(path.join(OUT, 'assets', n), path.join(OUT, 'assets', nuevo)); renombres[n] = nuevo }
}
const textoFinal = []
const recorreOut = (d) => { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); fs.statSync(p).isDirectory() ? recorreOut(p) : (/\.(html|js|css|json)$/.test(n) && textoFinal.push(p)) } }
recorreOut(OUT)
for (const f of textoFinal) {
  let t = fs.readFileSync(f, 'utf8'), cambio = false
  for (const [viejo, nuevo] of Object.entries(renombres)) { if (t.includes('assets/' + viejo)) { t = t.split('assets/' + viejo).join('assets/' + nuevo); cambio = true } }
  if (cambio) fs.writeFileSync(f, t)
}
console.log('assets renombrados con hash nuevo:', Object.entries(renombres).map(([a, b]) => `${a} -> ${b}`).join(' | '))
// COMPAT=1: durante el cambio de nombres se dejan también los nombres viejos (con el contenido ya comprimido) para que las páginas que todavía
// los pidan (por ejemplo el HTML que arma el servidor antes de actualizarse) no den 404. Se quita después reconstruyendo sin COMPAT.
if (process.env.COMPAT === '1') for (const [viejo, nuevo] of Object.entries(renombres)) fs.copyFileSync(path.join(OUT, 'assets', nuevo), path.join(OUT, 'assets', viejo))
// el .gitignore de la carpeta (para no subir el enlace local a Vercel)
fs.writeFileSync(path.join(OUT, '.gitignore'), '.vercel\n')
