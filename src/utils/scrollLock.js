/**
 * Freezes page scrolling while a full-screen layer is open.
 *
 * Locking `body` alone is not enough. The page scrolls on the root element, so
 * the root keeps its scrollbar — and since the scrollbars here are painted
 * brand orange, that leaves a second orange bar sitting beside the overlay's
 * own, frozen, pointing at nothing.
 *
 * The depth counter matters: these layers stack. Open an album, then a photo
 * inside it, and closing the photo must not hand scrolling back to the page
 * while the album is still covering it.
 *
 * Taking the scrollbar away also widens the viewport by its own width, which
 * would shunt the page sideways as a layer opens and back again as it closes.
 * `scrollbar-gutter: stable` ought to cover this, but Chrome stops reserving
 * the gutter once overflow is hidden — so the width is measured and given back
 * as padding instead.
 */

let depth = 0
let saved = null

/** Locks scrolling. Returns the function that releases this particular lock. */
export function lockScroll() {
  if (depth === 0) {
    const html = document.documentElement
    const scrollbar = window.innerWidth - html.clientWidth

    saved = {
      overflow: html.style.overflow,
      paddingRight: html.style.paddingRight,
      bodyOverflow: document.body.style.overflow,
    }

    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`
  }
  depth += 1

  let released = false
  return () => {
    if (released) return          // a double cleanup must not unbalance the count
    released = true
    depth -= 1
    if (depth === 0 && saved) {
      document.documentElement.style.overflow = saved.overflow
      document.documentElement.style.paddingRight = saved.paddingRight
      document.body.style.overflow = saved.bodyOverflow
      saved = null
    }
  }
}
