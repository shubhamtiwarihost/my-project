import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/techbio/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Local PHP API (php -S localhost:8080 -t .)
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
