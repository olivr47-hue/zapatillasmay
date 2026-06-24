import { defineConfig } from 'vite'

// Prototipo aislado del portal de cliente mayoreo.
// El proxy evita CORS: todo /api se reenvía al backend.
// Para probar con datos reales, target = Railway. Cambiar a localhost:3000 si corres el backend local.
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://zapatillasmay-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
