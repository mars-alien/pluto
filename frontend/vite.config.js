import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite automatically loads .env files
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  publicDir: 'public',
  // Ensure .env is loaded from frontend directory
  envDir: '.',
  // Log loaded env vars for debugging
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV)
  }
})
