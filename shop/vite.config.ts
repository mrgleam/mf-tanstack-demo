import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/shop/',
  plugins: [
    react(),
    federation({
      name: 'shop',
      filename: 'remoteEntry.js',
      exposes: { './ShopRoutes': './src/routes/ShopRoutes.tsx' },
      shared: ['react','react-dom','@tanstack/react-router'],
    }),
  ] as any,
  server: {
    port: 3001,
    allowedHosts: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    outDir: 'dist'
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
})

