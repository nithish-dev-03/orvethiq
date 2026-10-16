import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register': 'http://localhost:8000',
      '/login': 'http://localhost:8000',
      '/forget': 'http://localhost:8000',
      '/logout': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    },
  },
})
