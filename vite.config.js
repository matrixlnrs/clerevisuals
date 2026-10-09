import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

/**
 * Inlines the built stylesheet into index.html.
 *
 * The site is one page, so a separately cached stylesheet buys nothing, while
 * the <link> to it blocks the first render on a round trip of its own —
 * Lighthouse put that at ~300ms on a throttled phone. Inlined, the first paint
 * needs exactly one request. It gzips with the HTML, which is tiny.
 *
 * Only worth doing while the CSS stays small. Past roughly 50KB the inlining
 * costs more on repeat visits than the round trip it saves.
 */
function inlineStylesheet() {
  return {
    name: 'inline-stylesheet',
    enforce: 'post',
    apply: 'build',
    generateBundle(_options, bundle) {
      const html = Object.values(bundle).find(f => f.fileName === 'index.html')
      if (!html) return

      for (const [name, asset] of Object.entries(bundle)) {
        if (!name.endsWith('.css')) continue
        const tag = new RegExp(`<link[^>]+href="/${name.replace(/[.*+?^$()|[\\]\\\\]/g, '\\\\$&')}"[^>]*>`)
        if (!tag.test(html.source)) continue
        html.source = html.source.replace(tag, `<style>${asset.source}</style>`)
        delete bundle[name]
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), inlineStylesheet()],

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
