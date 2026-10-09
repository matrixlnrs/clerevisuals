/**
 * The Clerevisuals mark — the hand-drawn C ✻ / ◯ V square.
 *
 * Pass animated=true (the Hero does) and the logo draws itself: frame, C,
 * flower, oval, V. Each part is wrapped in its own mask containing a thick
 * pen stroke; animating that stroke's dash offset walks the ink along the
 * artwork instead of fading or wiping it in, which is what makes it read as
 * a hand rather than a transition.
 *
 * Everywhere else it renders as a plain static mark, no masks, no animation.
 *
 * The geometry lives in src/data/logoMark.js — see the note there before
 * touching the numbers.
 */
import { useId } from 'react'
import { prefersReducedMotion } from '../utils/motion'
import {
  MARK_VIEWBOX,
  MARK_PARTS,
  PEN_PATHS,
  DRAW_TIMELINE,
} from '../data/logoMark'

// Drawing order. Also the mask order, so later parts paint over earlier ones.
const PARTS = ['frame', 'c', 'flower', 'oval', 'v']

export function ScribbleLogo({
  size = 48,
  animated = false,
  color = '#F5620A',
  className = '',
}) {
  // The mark appears up to four times on one page; without unique ids every
  // copy would reach for the first one's masks.
  const uid = useId().replace(/:/g, '')

  // Reduced motion gets the finished mark, immediately.
  const draw = animated && !prefersReducedMotion()

  const [, , vbW, vbH] = MARK_VIEWBOX.split(' ').map(Number)

  return (
    <svg
      width={size}
      height={Math.round((size * vbH) / vbW)}
      viewBox={MARK_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Clerevisuals"
      className={className}
    >
      {draw && (
        <defs>
          {PARTS.map(part => {
            const pen = PEN_PATHS[part]
            const { delay, duration } = DRAW_TIMELINE[part]
            return (
              <mask key={part} id={`${uid}-${part}`} maskUnits="userSpaceOnUse">
                <path
                  d={pen.d}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={pen.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  /* pathLength normalises every pen path to 1, so one CSS
                     rule drives strokes of wildly different lengths. */
                  pathLength="1"
                  className="logo-ink"
                  style={{
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              </mask>
            )
          })}
        </defs>
      )}

      {PARTS.map(part => (
        <path
          key={part}
          d={MARK_PARTS[part]}
          fill={color}
          fillRule="evenodd"
          mask={draw ? `url(#${uid}-${part})` : undefined}
        />
      ))}
    </svg>
  )
}
