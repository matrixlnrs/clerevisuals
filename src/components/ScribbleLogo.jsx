/**
 * The Clerevisuals mark — the hand-drawn C ✻ / ◯ V square.
 *
 * Pass animated=true (the Hero does) and the logo draws itself: frame, C,
 * flower, oval, V. Each part is wrapped in its own mask containing a thick
 * pen stroke; animating that stroke's dash offset walks the ink along the
 * artwork instead of fading or wiping it in, which is what makes it read as
 * a hand rather than a transition.
 *
 * Each mask comes off the instant its own part has finished drawing. A pen
 * stroke is a straight-ish band and the artwork wobbles, so a mask left in
 * place shaves whatever the band did not sweep — the outer edge of the frame,
 * the tail at its corner — and leaves a blockier mark than the one the
 * designer drew. Dropping them one at a time rather than all at the end means
 * the frame is whole from the moment it is drawn, instead of sitting there
 * clipped while the C, the flower and the rest take their turns.
 *
 * The geometry lives in src/data/logoMark.js — see the note there before
 * touching the numbers.
 */
import { useEffect, useId, useState } from 'react'
import { prefersReducedMotion } from '../utils/motion'
import {
  MARK_VIEWBOX,
  MARK_PARTS,
  PEN_PATHS,
  DRAW_TIMELINE,
} from '../data/logoMark'

// Drawing order. Also the mask order, so later parts paint over earlier ones.
const PARTS = ['frame', 'c', 'flower', 'oval', 'v']

// A beat after a part's stroke lands, so its mask never lifts early.
const settleMs = part =>
  (DRAW_TIMELINE[part].delay + DRAW_TIMELINE[part].duration) * 1000 + 60

const ALL_DRAWN = new Set(PARTS)

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
  const wantsDraw = animated && !prefersReducedMotion()
  const [drawn, setDrawn] = useState(() => (wantsDraw ? new Set() : ALL_DRAWN))

  // The Hero mounts this with animated=false and flips it to true once the
  // intro clears, so the switch has to happen during the render that sees it.
  // An effect would run after that render has painted, and the logo would
  // flash complete for a frame before dropping back to be drawn.
  const [wasDrawing, setWasDrawing] = useState(wantsDraw)
  if (wasDrawing !== wantsDraw) {
    setWasDrawing(wantsDraw)
    setDrawn(wantsDraw ? new Set() : ALL_DRAWN)
  }

  useEffect(() => {
    if (!wantsDraw) return
    const timers = PARTS.map(part =>
      setTimeout(
        () => setDrawn(prev => new Set(prev).add(part)),
        settleMs(part),
      ),
    )
    return () => timers.forEach(clearTimeout)
  }, [wantsDraw])

  const [vbX, vbY, vbW, vbH] = MARK_VIEWBOX.split(' ').map(Number)

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
      {wantsDraw && (
        <defs>
          {PARTS.filter(part => !drawn.has(part)).map(part => {
            const pen = PEN_PATHS[part]
            const { delay, duration } = DRAW_TIMELINE[part]
            return (
              <mask
                key={part}
                id={`${uid}-${part}`}
                maskUnits="userSpaceOnUse"
                /* A mask's default region is -10%/120%, and those percentages
                   resolve against the viewport, not the viewBox. With a
                   viewBox whose origin is not 0,0 the region lands offset and
                   quietly crops the mark — this is what was shaving the right
                   edge and the bottom of the frame. State it explicitly, with
                   room to spare. */
                x={vbX - vbW * 0.25}
                y={vbY - vbH * 0.25}
                width={vbW * 1.5}
                height={vbH * 1.5}
              >
                {/* pathLength normalises every pen path to 1, so one CSS
                    rule drives a 300-unit perimeter and a 70-unit spike alike. */}
                <path
                  d={pen.d}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={pen.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
          mask={drawn.has(part) ? undefined : `url(#${uid}-${part})`}
        />
      ))}
    </svg>
  )
}
