import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Feature-based path aliases keep imports stable as the project grows.
// Whenever a new top-level directory is added under /src, register it here.
const alias = {
  '@': path.resolve(__dirname, 'src'),
  '@app': path.resolve(__dirname, 'src/app'),
  '@features': path.resolve(__dirname, 'src/features'),
  '@shared': path.resolve(__dirname, 'src/shared'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@scene': path.resolve(__dirname, 'src/scene'),
  '@scenes': path.resolve(__dirname, 'src/scene'),
  '@pages': path.resolve(__dirname, 'src/pages'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@assets': path.resolve(__dirname, 'src/assets'),
  '@styles': path.resolve(__dirname, 'src/styles'),
  '@animations': path.resolve(__dirname, 'src/animations'),
  '@data': path.resolve(__dirname, 'src/data'),
  '@providers': path.resolve(__dirname, 'src/providers'),
  '@shaders': path.resolve(__dirname, 'src/shaders'),
  '@config': path.resolve(__dirname, 'src/config'),
  '@services': path.resolve(__dirname, 'src/services'),
}

export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: ['**/*.glsl', '**/*.wgsl', '**/*.vert', '**/*.frag', '**/*.vs', '**/*.fs'],
      warnDuplicatedImports: true,
      defaultExtension: 'glsl',
      compress: false,
    }),
  ],
  resolve: { alias },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    allowedHosts: [
      "samir-mustached-doris.ngrok-free.dev"
    ],
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Vite 8 / rolldown requires `manualChunks` to be a function. This
        // predicate splits heavy vendor dependencies into their own long-lived
        // chunks so app code changes don't bust their caches.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom|scheduler)[\\/]/.test(id))
            return 'react-vendor'
          if (/[\\/]node_modules[\\/](three|@react-three)[\\/]/.test(id)) return 'three-vendor'
          if (/[\\/]node_modules[\\/](gsap|lenis|framer-motion|motion)[\\/]/.test(id))
            return 'motion-vendor'
          if (/[\\/]node_modules[\\/]@tanstack[\\/]/.test(id)) return 'query-vendor'
        },
      },
    },
  },
})
