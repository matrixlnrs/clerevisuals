import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Raise the warning threshold (GSAP is intentionally large)
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate cached chunks
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'gsap-vendor':   ['gsap'],
          'lenis-vendor':  ['lenis'],
        },
      },
    },
  },
})
