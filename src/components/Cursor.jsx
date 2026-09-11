import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

export function Cursor() {
  const dotRef      = useRef(null)
  const ringRef     = useRef(null)
  const [show, setShow] = useState(false)

  // `(hover: hover) and (pointer: fine)` is true only on real mouse/trackpad devices.
  // On mobile / touch-only devices this is false, so we skip rendering entirely.
  // A lagging ring that chases the pointer is also movement the visitor may
  // have asked not to see — in that case the native cursor is the right answer.
  const [hasMouse] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !prefersReducedMotion()
  )

  useEffect(() => {
    if (!hasMouse) return
    const dot  = dotRef.current
    const ring = ringRef.current

    const onMove = ({ clientX: x, clientY: y }) => {
      if (!show) setShow(true)
      gsap.to(dot,  { x, y, duration: 0.08, ease: 'none' })
      gsap.to(ring, { x, y, duration: 0.38, ease: 'power2.out' })
    }

    const grow = () => {
      gsap.to(ring, { scale: 2.2, borderColor: '#F5620A', opacity: 0.6, duration: 0.3 })
      gsap.to(dot,  { scale: 0,   duration: 0.25 })
    }

    const shrink = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.35)', opacity: 1, duration: 0.3 })
      gsap.to(dot,  { scale: 1, duration: 0.25 })
    }

    const onLeave = () => setShow(false)
    const onEnter = () => setShow(true)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    // Grow on any interactive element
    const clickables = () => document.querySelectorAll('a, button, [data-cursor]')
    const attach = () => {
      clickables().forEach(el => {
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    }
    attach()

    // Re-attach after DOM updates (e.g. after filter changes)
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      observer.disconnect()
    }
  }, [])

  if (!hasMouse) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{ opacity: show ? 1 : 0, transition: 'opacity 0.4s' }}
      aria-hidden="true"
    >
      {/* Orange dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-[6px] h-[6px] rounded-full bg-[#F5620A]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-8 h-8 rounded-full border"
        style={{
          borderColor: 'rgba(255,255,255,0.35)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  )
}
