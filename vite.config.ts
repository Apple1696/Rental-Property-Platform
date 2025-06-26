import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  console.log('✅ Loaded VITE_API_URL:', env.VITE_API_URL)
  const apiTarget = env.VITE_API_URL || 'http://34.124.245.123:8080'
  
  console.log('api targer: ', apiTarget)

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 8050
    
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      'import.meta.env.VITE_API_URL': JSON.stringify(apiTarget)
    },
  }
})