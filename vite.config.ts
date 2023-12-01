import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  envDir:"env",
  base:'/mdc/',
  server: {
    // host: 'localhost',
    // port: 9000,
    open: true,
    // cors: true,
  },
  plugins: [
      react(),
    ],
  },
)
