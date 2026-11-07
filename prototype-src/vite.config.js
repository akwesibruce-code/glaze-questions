import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
export default defineConfig({
  plugins: [react()],
  base: '/glaze-questions/',
  build: { rollupOptions: { input: { site: resolve(__dirname, 'site/index.html'), staff: resolve(__dirname, 'staff/index.html') } } },
})
