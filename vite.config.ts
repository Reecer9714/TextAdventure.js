import env from "./src/env";
import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  root: '.',
  build: {
    outDir: 'dist/web/static',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'src/web/static/index.html',
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
    target: 'es2020',
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: env.DEV_SERVER_PORT,
    allowedHosts: ['truenas.local'],
    proxy: {
      '/console': {
        target: `http://${env.WEB_SERVER_IP}:${env.WEB_SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
  publicDir: 'src/web/static',
})