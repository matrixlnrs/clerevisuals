import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { featuredPhotos } from '../data/featured'
import { GalleryCard    } from './GalleryCard'
import { Lightbox      } from './Lightbox'
import { useLanguage   } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

// key   = filter value (matches photo.category)
// labelKey = translation key
const CATEGORIES = [
  { key: 'All',           labelKey: 'gallery.filter.all' },
  { key: 'Track & Field', labelKey: 'gallery.filter.tf'  },
  { key: 'Motorsport',    labelKey: 'gallery.filter.ms'  },
  { key: 'Cycling',       labelKey: 'gallery.filter.cy'  },
  { key: 'Landscape',     labelKey: 'gallery.filter.ls'  },
]

export function Gallery() {
  const [active, setActive]           = useState('All')
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const headerRef = useRef(null)
  const { t }     = useLanguage()

  const filtered = active === 'All'
    ? featuredPhotos
    : featuredPhotos.filter(p => p.category === active)

  // ── Section header animation ───────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current.querySelectorAll('.header-item'),
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, headerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="gallery" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Section header ──────────────────────────── */}
        <div ref={headerRef} className="mb-14">
          <span className="reveal header-item block font-sans text-[10px] text-[#F5620A] tracking-[0.38em] uppercase mb-4" style={{ opacity: 0 }}>
            {t('gallery.label')}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="reveal header-item font-serif text-4xl md:text-5xl font-light text-ink" style={{ opacity: 0 }}>
              {t('gallery.heading')}
            </h2>

            <div className="flex flex-wrap gap-x-7 gap-y-3" role="group" aria-label="Filter by category">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  aria-pressed={active === cat.key}
                  className={`reveal header-item font-sans text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 cursor-pointer ${
                    active === cat.key
                      ? 'text-[#F5620A]'
                      : 'text-ink-dimmer hover:text-ink-muted'
                  }`}
                  style={{ opacity: 0, transitionDelay: `${i * 40}ms` }}
                >
                  {t(cat.labelKey)}
                </button>
              ))}
            </div>
          </div>
          <div className="reveal header-item w-10 h-px bg-[#F5620A] mt-6" style={{ opacity: 0 }} />
        </div>

        {/* ── Masonry grid ────────────────────────────── */}
        {/* Mobile: show only first 8 photos to keep the page light.
            sm+: show all. The hidden class only applies below 640px.   */}
        <div key={active} className="columns-1 sm:columns-2 lg:columns-3 gap-3">
          {filtered.map((photo, i) => (
            <div
              key={photo.id}
              className={`break-inside-avoid mb-3 ${i >= 8 ? 'hidden sm:block' : ''}`}
            >
              <GalleryCard photo={photo} onClick={() => setLightboxIdx(i)} />
            </div>
          ))}
        </div>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          photos={filtered}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </section>
  )
}
