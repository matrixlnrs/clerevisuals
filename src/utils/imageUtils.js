/**
 * Derivative URLs for a full-res image src.
 *
 * The originals (up to 25 MB each) are never served — they are the archive.
 * Everything on the page comes from one of the two tiers built by
 * `npm run images`:
 *
 *   Original:  /images/tf/01.jpg
 *   thumbSrc:  /images/tf/thumbs/01.jpg    900px jpeg  — grids, covers
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
  return `${dir}/thumbs/${name}.jpg`
}

export function largeSrc(src) {
  const { dir, name } = parts(src)
  return `${dir}/large/${name}.webp`
}
