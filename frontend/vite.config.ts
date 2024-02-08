import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:3000',
        target: 'http://43.202.40.0:3000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'ws://43.202.40.0:3000',
        ws: true
      }
    }
  }
})