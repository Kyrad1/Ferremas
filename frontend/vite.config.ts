import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Redirige las peticiones de /api al backend
      "/api": {
        target: process.env.TARGET_URL || "http://localhost:3001",
        changeOrigin: true,
        // Opcional: si no quieres que /api se incluya en la URL del backend
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
