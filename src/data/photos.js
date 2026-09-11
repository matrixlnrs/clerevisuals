/**
 * Photo library — built from what is actually on disk.
 *
 * Adding photos:
 *   1. Drop the full-res files into /photos-source/<album>/  (01.jpg, 02.jpg …)
 *   2. Run `npm run images`
 *
 * That regenerates the thumbnails, the lightbox-sized copies and
 * photos.generated.js — album counts and aspect ratios follow automatically,
 * so there is nothing to keep in sync by hand here.
 *
 * To add a new album, add an entry to ALBUMS below.
 * To caption a specific photo, add an entry to CAPTIONS in ./captions.js.
 */

import { albumFiles } from './photos.generated'
import { CAPTIONS }   from './captions'

// ── Albums — folder name → how it is presented ───────────────────────────
const ALBUMS = [
  { folder: 'tf',         category: 'Track & Field', location: 'Provence, France'   },
  { folder: 'cycling',    category: 'Cycling',       location: 'Provence, France'   },
  { folder: 'motorsport', category: 'Motorsport',    location: 'Circuit Paul Ricard' },
  { folder: 'landscape',  category: 'Landscape',     location: 'All around the world' },
  { folder: 'festival',   category: 'Festival',      location: 'Provence, France'   },
  { folder: 'soiree',     category: 'Soirée',        location: 'Provence, France'   },
]

/** Real pixel dimensions → the four masonry shapes the grid knows about. */
function aspectOf(w, h) {
  const ratio = w / h
  if (ratio >= 1.9)  return 'wide'
  if (ratio >= 1.2)  return 'landscape'
  if (ratio >= 0.85) return 'square'
  return 'portrait'
}

export const photos = ALBUMS.flatMap(({ folder, category, location }) =>
  (albumFiles[folder] ?? []).map(({ file, w, h }, i) => {
    const id      = `${folder}-${String(i + 1).padStart(3, '0')}`
    const caption = CAPTIONS[id] ?? {}

    return {
      id,
      src:      `/images/${folder}/${file}`,
      // Captions are optional: without one the photo shows its album name,
      // which reads as a label rather than a made-up title.
      title:    caption.title ?? category,
      location: caption.location ?? location,
      // `alt` describes the image for screen readers and search engines —
      // never the bare filename or an index.
      alt:      caption.alt ?? `${category} photography by Clerevisuals — ${caption.location ?? location}`,
      category,
      aspect:   aspectOf(w, h),
      width:    w,
      height:   h,
    }
  }),
)
