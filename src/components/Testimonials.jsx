/**
 * Testimonials — auto-advancing quote carousel with progress bar.
 *
 * Each testimonial supports both 'en' and 'fr'.
 * The site displays the version matching the visitor's language.
 * If only one language is provided, it shows for both.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../contexts/LanguageContext'

// ── Edit your testimonials here ───────────────────────────────────────────
// Add an `en` and `fr` block per testimonial.
// If a language block is missing, the other language is used as fallback.
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Brad Benavides',
    location: 'Circuit Paul Ricard',
    en: {
      quote: "Incredible eye. Mathis captures moments on the track that you didn't even know existed until you see the shot.",
      role:  'F3 Driver',
    },
    fr: {
      quote: "Un œil incroyable. Mathis capture des instants sur la piste dont vous n'aviez même pas conscience avant de voir le cliché.",
      role:  'Pilote F3',
    },
  },
  {
    id: 2,
    name: 'Lou-Ann H.',
    location: 'Toulon',
    en: {
      quote: "Great photographer! Mathis has already covered several events and the result is always top-notch. Natural photos, a real presence in the moment without being intrusive, and outstanding quality. 100% recommended!",
      role:  'BDE ISEN Toulon Secretary',
    },
    fr: {
      quote: "Super photographe ! Mathis a déjà couvert plusieurs événements et le rendu est toujours au top. Des photos naturelles, une vraie présence sur le moment sans être envahissant, et un résultat de grande qualité. Je recommande à 100 % !",
      role:  'Secrétaire BDE ISEN Toulon',
    },
  },
  {
    id: 3,
    name: 'Louis I.',
    location: 'Sunset Bike Event',
    en: {
      quote: "Very high-quality photos — Mathis followed me during a track session at Paul Ricard and I am more than satisfied with the results he delivered. Thank you so much!",
      role:  'Amateur Cyclist',
    },
    fr: {
      quote: "Des photos très qualitatives, Mathis m'a suivi lors d'une session piste sur le Paul Ricard et je suis plus que satisfait des résultats qu'il m'a proposé. Merci beaucoup !",
      role:  'Cycliste amateur',
    },
  },
]

const DURATION = 6500 // ms per slide

export function Testimonials() {
  const [idx, setIdx]       = useState(0)
  const idxRef              = useRef(0)
  const quoteRef            = useRef(null)
  const authorRef           = useRef(null)
  const timerRef            = useRef(null)
  const { t, lang }         = useLanguage()

  const goTo = useCallback((next) => {
    const n = ((next % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length
    if (n === idxRef.current) return

    clearTimeout(timerRef.current)

    // Fade + slide out
    gsap.to([quoteRef.current, authorRef.current], {
      opacity: 0,
      y: -18,
      duration: 0.38,
      ease: 'power2.in',
      stagger: 0.06,
      onComplete: () => {
        idxRef.current = n
        setIdx(n)
        // Fade + slide in on next frame (DOM updated)
        requestAnimationFrame(() => {
          gsap.fromTo(
            [quoteRef.current, authorRef.current],
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.1 },
          )
        })
      },
    })
  }, [])

  // Auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo(idxRef.current + 1)
    }, DURATION)
    return () => clearTimeout(timerRef.current)
  }, [idx, goTo])

  const current    = TESTIMONIALS[idx]
  // Pick the localised version; fall back to the other language if missing
  const localized  = current[lang] ?? current.en ?? current.fr

  return (
    <section className="py-28 bg-surface-dark border-t border-edge overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 lg:px-16">

        {/* ── Header row ── */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="w-6 h-px bg-[#F5620A]" />
            <span className="font-sans text-[10px] text-[#F5620A] tracking-[0.38em] uppercase">
              {t('testimonials.label')}
            </span>
          </div>

          {/* Number navigation */}
          <div className="flex items-center gap-5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`font-sans text-[10px] tracking-[0.25em] tabular-nums transition-colors duration-300 cursor-pointer ${
                  i === idx
                    ? 'text-[#F5620A]'
                    : 'text-ink-ghost hover:text-ink-faint'
                }`}
                data-cursor
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* ── Quote ── */}
        <div className="relative">
          {/* Decorative large quote mark */}
          <span
            className="absolute font-serif leading-none text-[#F5620A] select-none pointer-events-none"
            style={{
              fontSize: 'clamp(7rem, 16vw, 13rem)',
              top: '-1.5rem',
              left: '-1rem',
              opacity: 0.07,
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            "
          </span>

          <blockquote
            ref={quoteRef}
            className="relative z-10 font-serif font-light text-ink leading-[1.6]"
            style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2rem)' }}
          >
            {localized.quote}
          </blockquote>
        </div>

        {/* ── Author ── */}
        <div ref={authorRef} className="flex items-center gap-5 mt-12">
          <div className="w-8 h-px bg-[#F5620A] flex-shrink-0" />
          <div>
            <p className="font-serif text-ink text-[1rem] font-light">
              {current.name}
            </p>
            <p className="font-sans text-[9px] text-[#F5620A] tracking-[0.32em] uppercase mt-1.5">
              {localized.role}&nbsp;·&nbsp;{current.location}
            </p>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="mt-14 w-full h-px bg-edge">
          {/* key={idx} restarts the CSS animation on every slide change */}
          <div
            key={idx}
            className="h-full w-full bg-[#F5620A] origin-left"
            style={{ animation: `testimonialProgress ${DURATION}ms linear forwards` }}
          />
        </div>

      </div>
    </section>
  )
}
