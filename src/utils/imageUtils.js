/**
 * Derivative URLs for a full-res image src.
 *
 * The originals (up to 25 MB each) are never served — they are the archive.
 * Everything on the page comes from one of the two tiers built by
 * `npm run images`:
 *
 *   Original:  /images/tf/01.jpg
 *   thumbSrc:  /images/tf/thumbs/01.webp     900px webp — grids, covers
 *   thumbSrcSet: both thumb widths, for the browser to choose from
 *   largeSrc:  /images/tf/large/01.webp   2200px webp  — lightbox
 */

/** Splits "/images/tf/01.jpg" into its folder path and extension-less name. */
function parts(src) {
  const slash = src.lastIndexOf('/')
  const dir   = src.slice(0, slash)
  const file  = src.slice(slash + 1)
  const dot   = file.lastIndexOf('.')
  return { dir, name: dot === -1 ? file : file.slice(0, dot) }
}

export function thumbSrc(src) {
  const { dir, name } = parts(src)
  return `${dir}/thumbs/${name}.webp`
}

export function largeSrc(src) {
  const { dir, name } = parts(src)
  return `${dir}/large/${name}.webp`
}

/**
 * The two thumbnail widths as a srcset.
 *
 * A grid slot is 300-375 CSS px, which is 600-750 device pixels on a phone —
 * so 900px was always a little too much and 640px is often exactly right.
 * Pair it with a `sizes` attribute describing the slot, or the browser assumes
 * the image fills the viewport and picks the larger file every time.
 */
export function thumbSrcSet(src) {
  const { dir, name } = parts(src)
  return `${dir}/thumbs-md/${name}.webp 640w, ${dir}/thumbs/${name}.webp 900w`
}
