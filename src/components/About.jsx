import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export function About() {
  const sectionRef  = useRef(null)
  const portraitRef = useRef(null)
  const bioRef      = useRef(null)
  const statsRef    = useRef(null)
  const { t }       = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Portrait slides in from left
      gsap.fromTo(portraitRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 1.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Bio content slides in from right
      gsap.fromTo(
        bioRef.current.querySelectorAll('.bio-item'),
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.9, ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Stats
      gsap.fromTo(
        statsRef.current.querySelectorAll('.stat'),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7, ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const STATS = [
    { value: '2',   labelKey: 'about.stat.years'       },
    { value: '100+', labelKey: 'about.stat.athletes'     },
    { value: '7+',    labelKey: 'about.stat.disciplines'  },
  ]

  // overflow-x-clip on the section: the portrait and the bio slide in from
  // opposite sides, so until the scroll trigger fires they sit 50-60px outside
  // the layout. On a phone that is wider than the screen — and a page wider
  // than the screen is a page a finger can drag sideways. Clipped here, at the
  // element that actually overflows, rather than papered over globally.
  // `clip` rather than `hidden`: `hidden` would make this a scroll container,
  // which ScrollTrigger's pinning does not get along with.
  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-surface border-t border-edge overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* ── Portrait side (always dark — cinematic photo treatment) ── */}
          <div
            ref={portraitRef}
            className="reveal relative overflow-hidden min-h-[420px] lg:min-h-[680px] bg-surface-card"
            style={{ opacity: 0 }}
          >
            <div className="absolute inset-0 portrait-overlay" />
            {/* Lazy: this sits most of a page below the fold, and eagerly it
                was 412 KiB competing with the first screen for bandwidth. */}
            <img
              src="/images/portrait.webp"
              srcSet="/images/portrait-sm.webp 600w, /images/portrait.webp 1000w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Mathis Lenorais, the photographer behind Clerevisuals"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top mix-blend-luminosity opacity-75"
              onError={e => { e.target.style.display = 'none' }}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#F5620A]" />
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 55% 55% at 20% 60%, #F5620A14, transparent)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 portrait-fade-bottom lg:hidden" />
          </div>

          {/* ── Bio side ────────────────────────────── */}
          <div ref={bioRef} className="flex flex-col justify-center px-8 lg:px-16 xl:px-20 py-20 lg:py-28">
            <span className="reveal bio-item block font-sans text-[10px] text-[#F5620A] tracking-[0.38em] uppercase mb-8" style={{ opacity: 0 }}>
              {t('about.label')}
            </span>

            <h2 className="reveal bio-item font-serif text-4xl md:text-[2.8rem] font-light text-ink leading-tight mb-8" style={{ opacity: 0 }}>
              {t('about.heading1')}<br />
              <span className="text-ink-dim italic">{t('about.heading2')}</span>
            </h2>

            <p className="reveal bio-item font-sans font-light text-sm text-ink-muted leading-[1.85] mb-5 max-w-md" style={{ opacity: 0 }}>
              {t('about.bio1')}
            </p>

            <p className="reveal bio-item font-sans font-light text-sm text-ink-dimmer leading-[1.85] mb-14 max-w-md" style={{ opacity: 0 }}>
              {t('about.bio2')}
            </p>

            {/* Stats */}
            <div ref={statsRef} className="flex gap-10 pt-8 border-t border-edge">
              {STATS.map(({ value, labelKey }) => (
                <div key={labelKey} className="reveal stat" style={{ opacity: 0 }}>
                  <div className="font-serif text-[2rem] font-light text-[#F5620A] leading-none">
                    {value}
                  </div>
                  <div className="font-sans text-[9px] text-ink-dimmer tracking-[0.28em] uppercase mt-2">
                    {t(labelKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
