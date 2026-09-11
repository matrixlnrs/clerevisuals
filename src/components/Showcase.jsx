/**
 * Showcase — horizontal-scroll album cards.
 * Click an album → full-screen overlay with masonry grid + Lightbox.
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { photos      } from '../data/photos'
import { Lightbox    } from './Lightbox'
import { useLanguage } from '../contexts/LanguageContext'
import { thumbSrc   } from '../utils/imageUtils'

gsap.registerPlugin(ScrollTrigger)

// ── Albums (one per category) ─────────────────────────────────────────────
const ALBUM_DEFS = [
  { category: 'Track & Field', labelKey: 'gallery.filter.tf'  },
  { category: 'Cycling',       labelKey: 'gallery.filter.cy'  },
  { category: 'Motorsport',    labelKey: 'gallery.filter.ms'  },
  { category: 'Landscape',     labelKey: 'gallery.filter.ls'  },
  { category: 'Festival',      labelKey: 'gallery.filter.fst' },
  { category: 'Soirée',        labelKey: 'gallery.filter.soi' },
]

const ALBUMS = ALBUM_DEFS.map(def => ({
  ...def,
  photos: photos.filter(p => p.category === def.category),
  cover:  photos.find(p => p.category === def.category),
}))

// ── Album card (horizontal scroll) ───────────────────────────────────────
function AlbumCard({ album, index, onOpen, t }) {
  // Width is set via CSS classes — never via a JS window.innerWidth check —
  // so it is always correct regardless of when the component first rendered.
  // Mobile (<640 px): 80 vw, no min-width floor (intro card is hidden so albums
  //   can be wide; second card peeks ~28 px from the right to signal more content).
  // Desktop (≥640 px): 38 vw with a 260 px floor (original proportional layout).
  return (
    <button
      className="relative flex-shrink-0 h-[70vh] overflow-hidden group text-left focus-visible:outline-none
                 w-[80vw] sm:w-[38vw] sm:min-w-[260px] max-sm:snap-center"
      onClick={() => onOpen(album)}
      data-cursor
      aria-label={`Open ${album.category} album`}
    >
      {/* Fallback bg */}
      <div className="absolute inset-0 slide-fallback-bg" />

      {/* Cover — thumbnail for fast load */}
      <img
        src={thumbSrc(album.cover.src)}
        alt={`${album.category} album cover`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        onError={e => { e.target.style.display = 'none' }}
      />

      {/* Permanent gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/10 to-transparent" />

      {/* Top-left: index */}
      <div className="absolute top-6 left-6">
        <span className="font-sans text-[9px] text-white/25 tracking-[0.25em]">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <span className="font-sans text-[9px] text-[#F5620A] tracking-[0.32em] uppercase block mb-2">
          {album.photos.length}&nbsp;{album.photos.length === 1 ? t('showcase.photo_one') : t('showcase.photo_many')}
        </span>
        <p className="font-serif text-white text-[1.65rem] font-light leading-tight">
          {t(album.labelKey)}
        </p>

        {/* CTA — slides up on hover */}
        <div
          className="flex items-center gap-3 mt-5
            translate-y-3 opacity-0
            group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-500"
        >
          <div className="w-5 h-px bg-[#F5620A]" />
          <span className="font-sans text-[9px] text-white/60 tracking-[0.3em] uppercase">
            {t('showcase.open')}
          </span>
        </div>
      </div>
    </button>
  )
}

// ── Album overlay (portal) ────────────────────────────────────────────────
function AlbumOverlay({ album, onClose, t }) {
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  // Animate in + lock page scrollbar
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' },
    )
    gsap.fromTo(contentRef.current,
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.08 },
    )
    return () => { document.body.style.overflow = '' }
  }, [])

  // ESC closes overlay (but not if lightbox is open — Lightbox handles that)
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape' && lightboxIdx === null) handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIdx])

  const handleClose = useCallback(() => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }, [onClose])

  return createPortal(
    <>
      {/* Full-screen overlay — frosted glass backdrop */}
      <div
        ref={overlayRef}
        className="reveal fixed inset-0 z-[9000] overflow-y-auto"
        style={{
          opacity: 0,
          backgroundColor: 'rgb(var(--surface-rgb) / 0.82)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
        }}
        data-lenis-prevent
      >
        {/* ── Sticky header ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-edge"
          style={{
            backgroundColor: 'rgb(var(--surface-rgb) / 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-px bg-[#F5620A]" />
            <span className="font-sans text-[9px] text-[#F5620A] tracking-[0.38em] uppercase">
              {t('showcase.label')}
            </span>
            <span className="font-sans text-[9px] text-ink-faint mx-1">/</span>
            <span className="font-sans text-[9px] text-ink-dim tracking-[0.25em] uppercase">
              {t(album.labelKey)}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-sans text-[9px] text-ink-faint tracking-[0.2em]">
              {album.photos.length}&nbsp;{t('showcase.photo_many')}
            </span>
            <button
              onClick={handleClose}
              className="flex items-center gap-2 font-sans text-[9px] text-ink-dim
                hover:text-ink tracking-[0.3em] uppercase transition-colors duration-200 cursor-pointer"
              data-cursor
            >
              {t('showcase.close')}
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <line x1="1" y1="1" x2="10" y2="10" />
                <line x1="10" y1="1" x2="1"  y2="10" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Masonry grid ── */}
        <div
          ref={contentRef}
          className="reveal columns-1 sm:columns-2 lg:columns-3 gap-3 p-8"
          style={{ opacity: 0 }}
        >
          {album.photos.map((photo, i) => (
            <div
              key={photo.id}
              className="relative break-inside-avoid mb-3 overflow-hidden group cursor-pointer"
              onClick={() => setLightboxIdx(i)}
              data-cursor
            >
              {/* Fallback */}
              <div className="absolute inset-0 slide-fallback-bg" />

              {/* Thumbnail in grid — click → Lightbox loads the 2200px copy */}
              <img
                src={thumbSrc(photo.src)}
                alt={photo.alt ?? photo.title}
                loading="lazy"
                decoding="async"
                className="relative w-full object-cover block
                  transition-transform duration-500 group-hover:scale-[1.03]"
                onError={e => { e.target.style.display = 'none' }}
              />

              {/* Hover info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-400
                flex items-end p-5 pointer-events-none">
                <div>
                  <p className="font-serif text-white text-base font-light leading-snug">
                    {photo.title}
                  </p>
                  <p className="font-sans text-[#F5620A] text-[9px] tracking-[0.25em] uppercase mt-1">
                    {photo.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox — above the overlay */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={album.photos}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>,
    document.body,
  )
}

// ── Showcase section ──────────────────────────────────────────────────────
export function Showcase() {
  const sectionRef    = useRef(null)
  const trackRef      = useRef(null)
  const progressRef   = useRef(null)
  const scrollHintRef = useRef(null)
  const [openAlbum, setOpenAlbum] = useState(null)
  const { t } = useLanguage()

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    // Desktop (≥640 px): vertical scroll drives the track sideways (pinned section).
    mm.add('(min-width: 640px)', () => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
            // Stay fully visible until 20 % progress, then fade out over the next ~15 %
            if (scrollHintRef.current) {
              scrollHintRef.current.style.opacity = Math.max(0, 1 - Math.max(0, self.progress - 0.20) * 7)
            }
          },
        },
      })
    })

    // Mobile (<640 px): no pin, no scroll hijack — the track is a native swipe
    // carousel (overflow-x-auto via max-sm classes). Only the progress bar needs
    // JS: it mirrors the horizontal swipe position.
    mm.add('(max-width: 639px)', () => {
      const onScroll = () => {
        const max = track.scrollWidth - track.clientWidth
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${max > 0 ? track.scrollLeft / max : 0})`
        }
      }
      track.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => track.removeEventListener('scroll', onScroll)
    })

    return () => mm.revert()
  }, [])

  return (
    <>
      <section ref={sectionRef} className="relative bg-surface overflow-hidden">

        {/* Scroll hint */}
        <div className="absolute top-8 left-8 z-10 flex items-center gap-4 pointer-events-none">
          <div className="w-6 h-px bg-[#F5620A]" />
          <span className="font-sans text-[9px] text-ink-dimmer tracking-[0.35em] uppercase">
            {/* Mobile swipes the carousel directly; desktop scrolls to drive it */}
            <span className="sm:hidden">{t('showcase.swipe')}</span>
            <span className="max-sm:hidden">{t('showcase.scroll')}</span>
          </span>
        </div>

        {/* Album count */}
        <div className="absolute top-8 right-8 z-10 pointer-events-none">
          <span className="font-sans text-[9px] text-ink-faint tracking-[0.25em]">
            {String(ALBUMS.length).padStart(2, '0')}&nbsp;{t('showcase.albums')}
          </span>
        </div>

        {/* Horizontal track.
            Desktop (≥640 px): width max-content, translated by GSAP (pinned scroll).
            Mobile  (<640 px): native swipe carousel — overflow-x-auto + snap,
            width stays at 100 % so the element itself is the scroll container. */}
        <div
          ref={trackRef}
          className="flex items-center gap-4 h-screen px-8 sm:w-max
                     max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory no-scrollbar"
        >
          {/* Intro text card — hidden on mobile (text overflows the narrow column) */}
          <div className="max-sm:hidden flex-shrink-0 w-[26vw] h-[70vh] flex flex-col justify-end pb-10 pr-8 border-r border-edge">
            <span className="font-sans text-[10px] text-[#F5620A] tracking-[0.38em] uppercase mb-5 block">
              {t('showcase.label')}
            </span>
            <h2 className="font-serif text-4xl font-light text-ink leading-snug">
              {t('showcase.heading1')}<br />
              <span className="text-ink-dimmer">{t('showcase.heading2')}</span>
            </h2>
          </div>

          {ALBUMS.map((album, i) => (
            <AlbumCard
              key={album.category}
              album={album}
              index={i}
              onOpen={setOpenAlbum}
              t={t}
            />
          ))}

          {/* End padding */}
          <div className="flex-shrink-0 w-[10vw]" />
        </div>

        {/* ── Scroll-down hint — fades once user starts scrolling ──
            Hidden on mobile: the carousel is swiped directly there, and the
            mouse icon makes no sense on a touchscreen. */}
        <div
          ref={scrollHintRef}
          className="max-sm:hidden absolute bottom-14 left-1/2 -translate-x-1/2 z-10
            flex flex-col items-center gap-3 pointer-events-none select-none"
        >
          {/* Label */}
          <span className="font-sans text-[8px] text-ink-faint tracking-[0.45em] uppercase">
            {t('showcase.scrollDown')}
          </span>

          {/* Mouse icon with animated dot */}
          <div className="relative w-[18px] h-[28px] rounded-[9px] border border-ink-faint/40 flex justify-center">
            <div
              className="w-[3px] h-[6px] rounded-full bg-[#F5620A] mt-[5px]"
              style={{ animation: 'scrollDot 1.5s cubic-bezier(0.4,0,0.6,1) infinite' }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-edge">
          <div
            ref={progressRef}
            className="h-full bg-[#F5620A] origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </section>

      {/* Album overlay */}
      {openAlbum && (
        <AlbumOverlay
          album={openAlbum}
          onClose={() => setOpenAlbum(null)}
          t={t}
        />
      )}
    </>
  )
}
