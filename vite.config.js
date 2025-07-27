import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      external: [],
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    },
    copyPublicDir: true
  },
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'public',
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.mp3', '**/*.wav', '**/*.jpg', '**/*.png', '**/*.gif', '**/*.tga'],
  resolve: {
    alias: {
      'three': 'three'
    }
  },
  optimizeDeps: {
    include: ['three', 'three/addons/loaders/GLTFLoader.js', 'three/addons/controls/PointerLockControls.js']
  },
  define: {
    global: 'globalThis'
  },
  esbuild: {
    target: 'es2020'
  }
}) 