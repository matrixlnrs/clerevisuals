/**
 * Motion preferences.
 *
 * The site leans hard on movement — smooth scroll, parallax, staggered
 * reveals, a trailing cursor. For a visitor with vestibular disorders that
 * range from unpleasant to genuinely nauseating, so every one of those is
 * gated on this check. What stays is the layout and the photographs.
 *
 * The CSS counterpart lives in src/index.css: elements that GSAP reveals are
 * hidden with an inline `opacity: 0`, and a stylesheet rule with `!important`
 * is what overrides an inline style, so both halves are needed.
 */

const QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(QUERY).matches
}
