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
      port: 8050,
      proxy: {
        // Match any request starting with /user-service
        '^/user-service/.*': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          logLevel: 'debug', // This will show proxy logs
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('❌ Proxy error:', err.message);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`🔄 Proxying: ${req.method} ${req.url} -> ${options.target}${req.url}`);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log(`✅ Proxy response: ${proxyRes.statusCode} for ${req.url}`);
            });
          }
        },
        // Match any request starting with /booking-service
        '^/booking-service/.*': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          logLevel: 'debug',
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('❌ Proxy error:', err.message);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`🔄 Proxying: ${req.method} ${req.url} -> ${options.target}${req.url}`);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log(`✅ Proxy response: ${proxyRes.statusCode} for ${req.url}`);
            });
          }
        }
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      'import.meta.env.VITE_API_URL': JSON.stringify(apiTarget)
    },
  }
})