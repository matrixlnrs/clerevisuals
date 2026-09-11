import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ScribbleLogo } from './ScribbleLogo'
import { useLanguage  } from '../contexts/LanguageContext'
import { prefersReducedMotion } from '../utils/motion'

gsap.registerPlugin(ScrollTrigger)

export function Hero({ triggerAnimation = false }) {
  const sectionRef  = useRef(null)
  const bgRef       = useRef(null)
  const contentRef  = useRef(null)
  const { t }       = useLanguage()

  // ── Scroll-driven effects (always on mount) ──────────────
  useEffect(() => {
    const section = sectionRef.current
    const bg      = bgRef.current
    const content = contentRef.current
    if (!section || !bg || !content) return

    // Scrubbed parallax is the most motion-sickness-inducing effect here.
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.to(bg, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(content, {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: section, start: '40% top', end: 'bottom top', scrub: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ── Entrance animation (fires after loader curtain reveals) ──
  useEffect(() => {
    if (!triggerAnimation) return
    const content = contentRef.current
    if (!content) return
    // The CSS rule on `.reveal` already made these visible; animating them
    // would only hide and re-show them.
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll('.hero-item'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1 },
      )
    }, contentRef)

    return () => ctx.revert()
  }, [triggerAnimation])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Background — fully themed ─────────────────── */}
      <div className="absolute inset-0 bg-surface">
        <div ref={bgRef} className="absolute inset-[-15%]">
          {/* Decorative, and the LCP element — fetched at top priority,
              never lazily. Built by `npm run images` from SINGLES. */}
          <img
            src="/images/hero.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-30"
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>
        {/* Themed top-bottom vignette */}
        <div className="absolute inset-0 hero-vignette-tb" />
        {/* Themed side vignette */}
        <div className="absolute inset-0 hero-vignette-lr" />
        {/* Brand warm glow — looks good in both themes */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, #F5620A18, transparent)' }}
        />
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div ref={contentRef} className="relative z-10 text-center px-6">

        {/* Logo — slightly smaller on mobile to leave more room */}
        <div className="reveal hero-item flex justify-center mb-8 sm:mb-10 scale-75 sm:scale-100 origin-center" style={{ opacity: 0 }}>
          <ScribbleLogo size={100} animated={triggerAnimation} />
        </div>

        {/* Title
            Mobile: smaller size + tight tracking so it fits a 375px screen.
            sm+: restore the wide cinematic spacing.                          */}
        <h1
          className="reveal hero-item font-serif font-light text-ink uppercase mb-4 sm:mb-5"
          style={{
            opacity: 0,
            fontSize: 'clamp(1.9rem, 8vw, 4.5rem)',
            letterSpacing: 'clamp(0.04em, 1.5vw, 0.32em)',
          }}
        >
          Clere<span className="text-[#F5620A]">visuals</span>
        </h1>

        {/* Tagline — tight tracking on mobile, open on desktop */}
        <p
          className="reveal hero-item font-sans text-[9px] sm:text-[10px] font-light text-ink-dim uppercase mb-10 sm:mb-14 px-2"
          style={{ opacity: 0, letterSpacing: 'clamp(0.14em, 1vw, 0.38em)' }}
        >
          {t('hero.tagline')}
        </p>

        {/* CTA */}
        <button
          onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
          className="reveal hero-item group inline-flex items-center gap-3 sm:gap-4 font-sans text-[10px] font-light tracking-[0.22em] sm:tracking-[0.38em] uppercase text-ink-subtle hover:text-[#F5620A] transition-colors duration-300 cursor-pointer"
          style={{ opacity: 0 }}
        >
          <span className="h-px w-5 sm:w-7 bg-current transition-all duration-500 group-hover:w-12 sm:group-hover:w-14" />
          {t('hero.cta')}
          <span className="h-px w-5 sm:w-7 bg-current transition-all duration-500 group-hover:w-12 sm:group-hover:w-14" />
        </button>
      </div>

      {/* ── Scroll line ──────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-px h-14 bg-gradient-to-b from-transparent to-[#F5620A] opacity-60" />
      </div>
    </section>
  )
}
