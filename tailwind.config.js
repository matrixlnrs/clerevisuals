/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand constants (never change with theme) ──
        clere: {
          orange: '#F5620A',
          burnt:  '#C44900',
          black:  '#0E0E0E',
          soft:   '#1A1A1A',
        },
        // ── Semantic surface tokens ────────────────────
        surface: {
          DEFAULT: 'var(--surface)',
          soft:    'var(--surface-soft)',
          card:    'var(--surface-card)',
          dark:    'var(--surface-dark)',
        },
        // ── Semantic ink (text/icon) tokens ───────────
        ink: {
          DEFAULT: 'var(--ink)',
          muted:   'var(--ink-muted)',
          dim:     'var(--ink-dim)',
          dimmer:  'var(--ink-dimmer)',
          faint:   'var(--ink-faint)',
          ghost:   'var(--ink-ghost)',
          subtle:  'var(--ink-subtle)',   /* faint hero CTA — theme-aware opacity */
        },
        // ── Semantic border tokens ─────────────────────
        edge: {
          DEFAULT: 'var(--edge)',
          soft:    'var(--edge-soft)',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
    },
  },
  plugins: [],
}
