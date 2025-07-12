import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 8080,
    allowedHosts: [
      'r8atvrksvn.eu-central-1.awsapprunner.com',
      '.awsapprunner.com'
    ]
  }
})
