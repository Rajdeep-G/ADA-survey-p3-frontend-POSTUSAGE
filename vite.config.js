import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const API = 'http://134.209.215.255:8000'
const api = { target: API, changeOrigin: true }


export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/survey_post/check': 'http://localhost:8000',
      '/survey_post/start': 'http://localhost:8000',
      '/survey_post/progress': 'http://localhost:8000',
      '/survey_post/submit': 'http://localhost:8000',
      '/healthz': 'http://localhost:8000',
    }


  }
})






