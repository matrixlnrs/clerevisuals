/**
 * Hand-drawn CV scribble mark — the Clerevisuals signature.
 * Paths are SVG bezier strokes with round caps, matching the brand brief.
 * Pass animated=true on first render (Hero) to trigger the draw-on CSS animation.
 */
export function ScribbleLogo({
  size = 48,
  animated = false,
  color = '#F5620A',
  className = '',
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.655)}
      viewBox="0 0 110 72"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-label="Clerevisuals mark"
      className={className}
    >
      {/* ── C arc ──────────────────────────────────────── */}
      <path
        d="M 76 10 C 55 2, 22 4, 10 22 C 4 34, 10 50, 24 58 C 38 66, 58 64, 76 56"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'draw-c' : ''}
      />
      {/* ── V left diagonal ────────────────────────────── */}
      <path
        d="M 60 16 L 78 50"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        className={animated ? 'draw-v-left' : ''}
      />
      {/* ── V right diagonal ───────────────────────────── */}
      <path
        d="M 78 50 L 96 20"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        className={animated ? 'draw-v-right' : ''}
      />
      {/* ── Energy texture stroke ──────────────────────── */}
      <path
        d="M 18 8 C 38 2, 58 4, 72 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
        className={animated ? 'draw-texture' : ''}
      />
    </svg>
  )
}
