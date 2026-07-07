import { defineConfig } from 'vite'
export default defineConfig({
  server: {
    allowedHosts: ['luckless-unsettled-scurvy.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'https://zapatillasmay-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})