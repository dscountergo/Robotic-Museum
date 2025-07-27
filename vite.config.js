import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'public',
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.mp3', '**/*.wav', '**/*.jpg', '**/*.png', '**/*.gif', '**/*.tga']
}) 