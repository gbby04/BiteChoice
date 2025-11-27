import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This forces the server to listen to ALL addresses
    port: 5555,      // We are forcing Port 5555
    strictPort: true,
  }
})