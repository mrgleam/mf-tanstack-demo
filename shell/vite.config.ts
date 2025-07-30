import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: {
        shop: 'http://localhost:3001/shop/assets/remoteEntry.js',
      },
      shared: ['react','react-dom','@tanstack/react-router'],
    }),
  ],
  server: {
    port: 3000,
    allowedHosts: true,
  },
  build: {
    target: 'chrome89',
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
})
