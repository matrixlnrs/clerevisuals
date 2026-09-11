import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * "Split Second" — Cinematic chronometer intro loader.
 *
 * Timeline:
 *   0 ms      → RAF counter + runner lap begin simultaneously
 *   800 ms    → counter locks at 00.80
 *   900 ms    → shutter flash (250 ms)
 *  1 150 ms   → curtains slide away (700 ms)
 *  1 850 ms   → onComplete()
 *
 * ── 400 m Track geometry ──────────────────────────────────────────────────
 *
 * viewBox 800 × 320, centre (400, 160)
 *
 * Real IAAF proportions:  total_width / total_height ≈ 1.91
 *   Straight ≈ 84.39 m,  outer radius ≈ 46.56 m  →  ratio 1.907
 *
 * SVG mapping (R_OUT = 136):
 *   Straight   = 244 px        (≈ 84.39 / 46.56 × 136  × 2  / 2 ≈ 246)
 *   Outer oval = 516 × 272 px  → ratio 516/272 = 1.897 ✓
 *
 *   CX_L = 278  (left  bend centre)
 *   CX_R = 522  (right bend centre — also start/finish x)
 *   CY   = 160  (vertical centre)
 *
 * 8 lanes of 9 px  = 72 px total track width
 *   R_IN  = 64    inner boundary (infield edge)
 *   R_OUT = 136   outer boundary
 *   Dividers: 64, 73, 82, 91, 100, 109, 118, 127, 136
 *
 * Stagger marks (home straight, top of SVG, lanes 2–5 only):
 *   offset per lane = 2π × 9 ≈ 56.5 px
 *   lane 2: x ≈ 465   lane 3: x ≈ 409   lane 4: x ≈ 352   lane 5: x ≈ 296
 */

// ── Geometry constants ────────────────────────────────────────────────────
const VB_W    = 800
const VB_H    = 320
const CX_L    = 278
const CX_R    = 522
const CY      = 160

const N_LANES = 8
const LANE_W  = 9
const TRACK_W = N_LANES * LANE_W   // 72
const R_OUT   = 136
const R_IN    = R_OUT - TRACK_W    // 64
const R_MID   = (R_IN + R_OUT) / 2 // 100

// [64, 73, 82, 91, 100, 109, 118, 127, 136]
const DIVIDERS = Array.from({ length: N_LANES + 1 }, (_, i) => R_IN + i * LANE_W)



// ── Path builder ─────────────────────────────────────────────────────────
/**
 * Closed discorectangle at bend-radius r, running CCW:
 *   top-right → left along top straight → left CCW bend →
 *   right along bottom straight → right CW bend → close
 */
function discorect(r) {
  const t = CY - r
  const b = CY + r
  return (
    `M ${CX_R},${t} ` +          // top-right
    `L ${CX_L},${t} ` +          // → top-left (home straight)
    `A ${r},${r} 0 0,0 ${CX_L},${b} ` + // CCW left bend → bottom-left ✓
    `L ${CX_R},${b} ` +          // → bottom-right (back straight)
    `A ${r},${r} 0 0,0 ${CX_R},${t}`    // CCW right bend → top-right ✓
  )
}

// Runner path — starts at BOTTOM-RIGHT (finish line) and runs CCW:
//   right bend → top straight → left bend → bottom straight → arrives at finish
const RUNNER_PATH = (() => {
  const r = R_OUT, t = CY - r, b = CY + r
  return (
    `M ${CX_R},${b} ` +                   // bottom-right (finish line)
    `A ${r},${r} 0 0,0 ${CX_R},${t} ` +   // CCW right bend → top-right
    `L ${CX_L},${t} ` +                    // top straight → top-left
    `A ${r},${r} 0 0,0 ${CX_L},${b} ` +   // CCW left bend → bottom-left
    `L ${CX_R},${b}`                        // bottom straight → back to finish
  )
})()

// ── Component ─────────────────────────────────────────────────────────────
export function Loader({ onComplete }) {
  const [time,  setTime]  = useState('00.00')
  const [phase, setPhase] = useState('counting')
  const rafRef  = useRef(null)
  const doneRef = useRef(false)
  const { t }   = useLanguage()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const COUNT_DURATION = 800
    const startTs        = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTs) / COUNT_DURATION, 1)
      const n        = Math.min(Math.floor(progress * 80), 80)

      setTime(`00.${String(n).padStart(2, '0')}`)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (doneRef.current) return
      doneRef.current = true

      setTimeout(() => setPhase('flash'),  100)
      setTimeout(() => setPhase('reveal'), 100 + 250)
      setTimeout(() => {
        document.body.style.overflow = ''
        onComplete?.()
      }, 100 + 250 + 700)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.body.style.overflow = ''
    }
  }, [onComplete])

  const isFlash  = phase === 'flash'
  const isReveal = phase === 'reveal'

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 99999, pointerEvents: isReveal ? 'none' : 'all' }}
      aria-hidden="true"
    >
      {/* ── Curtains ────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0A0A0A]"
        style={{
          transform:  isReveal ? 'translateY(-100%)' : 'translateY(0)',
          transition: isReveal ? 'transform 700ms cubic-bezier(0.76,0,0.24,1)' : 'none',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0A0A]"
        style={{
          transform:  isReveal ? 'translateY(100%)' : 'translateY(0)',
          transition: isReveal ? 'transform 700ms cubic-bezier(0.76,0,0.24,1)' : 'none',
        }}
      />

      {/* ── Shutter flash ───────────────────────────────── */}
      {isFlash && (
        <div
          className="absolute inset-0 bg-white"
          style={{ zIndex: 10, animation: 'shutterFlash 250ms ease-in-out forwards' }}
        />
      )}

      {/* ── Track SVG + Timer ───────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 20, opacity: isReveal ? 0 : 1, transition: 'opacity 80ms ease' }}
      >

        {/* SVG — centred, scales with viewport */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            style={{ width: 'min(92vw, 820px)', height: 'auto', overflow: 'visible' }}
          >
            {/* ① Infield fill — subtle inner-field distinction */}
            <path
              d={discorect(R_IN)}
              fill="rgba(255,255,255,0.018)"
              stroke="none"
            />

            {/* ② Track band fill — full 72 px width */}
            <path
              d={discorect(R_MID)}
              stroke="rgba(255,255,255,0.042)"
              strokeWidth={TRACK_W}
              fill="none"
            />

            {/* ③ Inner lane dividers (7 internal lines for 8 lanes) */}
            {DIVIDERS.slice(1, -1).map(r => (
              <path
                key={r}
                d={discorect(r)}
                stroke="rgba(255,255,255,0.072)"
                strokeWidth="0.8"
                fill="none"
              />
            ))}

            {/* ④ Inner boundary — infield edge */}
            <path
              d={discorect(R_IN)}
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="1.2"
              fill="none"
            />

            {/* ⑤ Outer boundary */}
            <path
              d={discorect(R_OUT)}
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="1.2"
              fill="none"
            />

            {/* ⑥ Start / finish line — orange, bottom straight, all 8 lanes */}
            <line
              x1={CX_R} y1={CY + R_IN}
              x2={CX_R} y2={CY + R_OUT}
              stroke="#F5620A"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.60"
            />

            {/* ⑧ Orange runner — one full CCW lap in exactly 800 ms */}
            <path
              d={RUNNER_PATH}
              pathLength="1000"
              stroke="#F5620A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray:  '1000',
                strokeDashoffset: '1000',
                animation:        'runnerLap 800ms linear forwards',
                filter:           'drop-shadow(0 0 6px rgba(245,98,10,0.70))',
              }}
            />
          </svg>
        </div>

        {/* Timer — floats above the SVG, centred */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">

          <p
            className="font-sans font-light uppercase loader-brand-label"
            style={{
              fontSize:      '9px',
              letterSpacing: '0.55em',
              color:          isFlash ? '#0A0A0A' : 'rgba(245,98,10,0.55)',
              transition:    'color 60ms',
            }}
          >
            Clerevisuals
          </p>

          <p
            className="font-sans font-thin tabular-nums leading-none"
            style={{
              fontSize:      'clamp(3.5rem, 10vw, 7.5rem)',
              letterSpacing: '0.08em',
              color:          isFlash ? '#0A0A0A' : '#ffffff',
              textShadow:    isFlash ? 'none' : '0 0 80px rgba(245,98,10,0.10)',
              transition:    'color 60ms, text-shadow 60ms',
            }}
          >
            {time}
          </p>

          <div
            className="loader-divider max-sm:hidden"
            style={{
              width:           '2rem',
              height:          '1px',
              backgroundColor: isFlash ? '#0A0A0A' : 'rgba(245,98,10,0.45)',
              transition:      'background-color 60ms',
            }}
          />

          <p
            className="font-sans font-light uppercase loader-seconds-label"
            style={{
              fontSize:      '8px',
              letterSpacing: '0.45em',
              color:          isFlash ? '#0A0A0A' : 'rgba(255,255,255,0.2)',
              transition:    'color 60ms',
            }}
          >
            {t('loader.seconds')}
          </p>

        </div>
      </div>
    </div>
  )
}
