import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { thumbSrc, thumbSrcSet } from '../utils/imageUtils'

gsap.registerPlugin(ScrollTrigger)

const PADDING = {
  portrait:  '133.33%',
  square:    '100%',
  landscape: '66.67%',
  wide:      '56.25%',
}

export function GalleryCard({ photo, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)
  const cardRef = useRef(null)

  const pb = PADDING[photo.aspect] ?? '66.67%'

  // ── Scroll-reveal per card ─────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 55 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, cardRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cardRef}
      className="reveal group relative cursor-pointer overflow-hidden bg-surface-card"
      style={{ paddingBottom: pb, opacity: 0 }}
      onClick={onClick}
      data-cursor
    >
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-surface-card" />
      )}

      {/* Error placeholder */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-card p-8">
          <div className="w-8 h-px bg-[#F5620A] mb-4" />
          <span className="font-sans text-[9px] text-[#F5620A] tracking-[0.35em] uppercase block mb-3">
            {photo.category}
          </span>
          <span className="font-serif text-ink-dimmer text-sm font-light text-center leading-relaxed">
            {photo.title}
          </span>
          <span className="font-sans text-[9px] text-ink-faint tracking-[0.2em] uppercase mt-2">
            {photo.location}
          </span>
        </div>
      )}

      {/* Image — 900px thumbnail; the lightbox loads the 2200px copy */}
      <img
        src={thumbSrc(photo.src)}
        srcSet={thumbSrcSet(photo.src)}
        /* The masonry is 1 column below 640px, 2 below 1024, 3 above. */
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        alt={photo.alt ?? photo.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out
          group-hover:scale-[1.04]
          ${loaded && !error ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Hover overlay — theme-aware surface gradient */}
      <div
        className="absolute inset-0 flex items-end p-5 pointer-events-none
          card-hover-overlay
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      >
        <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
          <p className="font-serif text-[1.1rem] font-light text-ink leading-snug">
            {photo.title}
          </p>
          <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#F5620A] mt-1.5">
            {photo.location}
          </p>
        </div>
      </div>
    </div>
  )
}
