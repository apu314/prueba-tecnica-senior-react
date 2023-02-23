import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  base: '/prueba-tecnica-senior-react/',
  plugins: [react()],
  server: {
    port: 3000
  }
  /* resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  } */
})
