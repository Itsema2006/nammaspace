import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      '/api': { target: 'http://127.0.0.1:5001', changeOrigin: true },
      '/uploads': { target: 'http://127.0.0.1:5001', changeOrigin: true },
      '/outputs': { target: 'http://127.0.0.1:5001', changeOrigin: true },
      '/reconstruct': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/reconstruction-assets': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
})
