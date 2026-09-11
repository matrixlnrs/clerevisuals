/**
 * Lenis smooth scroll + GSAP ScrollTrigger sync.
 * Must be called once at the App root.
 */
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/motion'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  useEffect(() => {
    // Hijacking the scroll wheel is exactly what reduced-motion asks us not to
    // do — leave the browser's native scrolling alone.
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.3,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
    })

    // Keep ScrollTrigger in sync with Lenis position
    lenis.on('scroll', ScrollTrigger.update)

    const tickerId = gsap.ticker.add(time => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerId)
    }
  }, [])
}
