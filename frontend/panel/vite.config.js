import { defineConfig } from 'vite'
export default defineConfig({
  server: {
    allowedHosts: ['luckless-unsettled-scurvy.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})