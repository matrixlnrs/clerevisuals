import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { largeSrc, thumbSrc } from '../utils/imageUtils'
import { lockScroll } from '../utils/scrollLock'

export function Lightbox({ photos, initialIndex, onClose }) {
  const [index, setIndex]             = useState(initialIndex)
  const [visible, setVisible]         = useState(true)
  const hideTimer                     = useRef(null)
  const photo                         = photos[index]

  /* ── Controls auto-hide ──────────────────────────── */
  const showControls = useCallback(() => {
    setVisible(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 2600)
  }, [])

  useEffect(() => {
    showControls()
    return () => clearTimeout(hideTimer.current)
  }, [showControls])

  /* ── Navigation ──────────────────────────────────── */
  const prev = useCallback(() => {
    setIndex(i => (i - 1 + photos.length) % photos.length)
    showControls()
  }, [photos.length, showControls])

  const next = useCallback(() => {
    setIndex(i => (i + 1) % photos.length)
    showControls()
  }, [photos.length, showControls])

  /* ── Keyboard ────────────────────────────────────── */
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  /* ── Prefetch the neighbours so arrow-key nav feels instant ── */
  useEffect(() => {
    for (const i of [index + 1, index - 1]) {
      const neighbour = photos[(i + photos.length) % photos.length]
      if (neighbour) new Image().src = largeSrc(neighbour.src)
    }
  }, [index, photos])

  /* ── Lock page scroll ────────────────────────────── */
  useEffect(() => lockScroll(), [])

  const ctrl = `transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`

  return createPortal(
    <div
      /* Above the album overlay (z-9000), below the custom cursor (z-9999).
         The lightbox can be opened from the album grid, which lives inside
         that overlay — at a lower z-index it opens invisibly behind it. */
      className="fixed inset-0 z-[9500] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.80)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
      }}
      onMouseMove={showControls}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* Counter */}
      <div className={`absolute top-7 left-1/2 -translate-x-1/2 font-sans text-[10px] text-neutral-600 tracking-[0.28em] pointer-events-none ${ctrl}`}>
        {index + 1} / {photos.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className={`absolute top-6 right-6 text-white/35 hover:text-white cursor-pointer p-1 transition-colors ${ctrl}`}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="20" y1="6"  x2="6"  y2="20" />
          <line x1="6"  y1="6"  x2="20" y2="20" />
        </svg>
      </button>

      {/* Image — key forces fade-in on nav.
          Serves the 2200px webp; falls back to the thumbnail if that tier is
          missing (a photo added without re-running `npm run images`). The
          originals live outside public/ and are never reachable from here. */}
      <img
        key={index}
        src={largeSrc(photo.src)}
        alt={photo.alt ?? photo.title}
        className="max-w-[88vw] max-h-[82vh] object-contain animate-fade-in"
        onError={e => {
          const fallback = thumbSrc(photo.src)
          if (!e.target.src.endsWith(fallback)) e.target.src = fallback
        }}
      />

      {/* Caption */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none ${ctrl}`}>
        <p className="font-serif text-xl font-light text-white tracking-wide">
          {photo.title}
        </p>
        <p className="font-sans text-[10px] text-[#F5620A] tracking-[0.28em] uppercase mt-2">
          {photo.location} · {photo.category}
        </p>
      </div>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); prev() }}
        aria-label="Previous photo"
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white cursor-pointer p-4 transition-colors ${ctrl}`}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="19,6 9,15 19,24" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); next() }}
        aria-label="Next photo"
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white cursor-pointer p-4 transition-colors ${ctrl}`}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="11,6 21,15 11,24" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}
