/**
 * Hand-picked gallery — shown in the "My Favorite Work" section.
 *
 * Add 10–15 of your best shots here. Each entry needs:
 *
 *   id       — unique string (anything, e.g. 'feat-01')
 *   src      — path from /public  (e.g. '/images/tf/03.jpg')
 *   title    — caption shown on hover and in the lightbox
 *   location — location shown on hover and in the lightbox
 *   category — used for the filter tabs:
 *                'Track & Field' | 'Cycling' | 'Motorsport' | 'Landscape'
 *   aspect   — controls card height in the masonry grid:
 *                'landscape' (wide, short)
 *                'portrait'  (tall)
 *                'square'    (1:1)
 *                'wide'      (cinema wide)
 *
 * Example:
 *   {
 *     id:       'feat-01',
 *     src:      '/images/tf/00.jpg',
 *     title:    'Sprint Finish',
 *     location: 'Aix-en-Provence',
 *     category: 'Track & Field',
 *     aspect:   'landscape',
 *   },
 */

/**
 * `alt` is derived rather than hand-written: the title alone ("Superman")
 * tells a screen reader nothing, while title + category + place is honest,
 * useful and impossible to forget to update. Override it on any entry where
 * you want to describe what is actually in the frame — that is always better.
 */
const withAlt = list => list.map(photo => ({
  ...photo,
  alt: photo.alt ?? `${photo.title} — ${photo.category} photography in ${photo.location} by Clerevisuals`,
}))

export const featuredPhotos = withAlt([
  {
    id:       'feat-01',
    src:      '/images/landscape/15.jpg',
    title:    'Busy Street',
    location: 'Hanoï',
    category: 'Landscape',
    aspect:   'portrait',
  },
  {
    id:       'feat-02',
    src:      '/images/cycling/04.jpg',
    title:    'Sunset Bike',
    location: 'Aix-en-Provence',
    category: 'Cycling',
    aspect:   'portrait',
  },
  {
    id:       'feat-03',
    src:      '/images/landscape/03.jpg',
    title:    'Sunny arch',
    location: 'Marseille',
    category: 'Landscape',
    aspect:   'portrait',
  },
  {
    id:       'feat-06',
    src:      '/images/tf/30.jpg',
    title:    'Sunny race',
    location: 'Aix-en-Provence',
    category: 'Track & Field',
    aspect:   'portrait',
  },
  {
    id:       'feat-07',
    src:      '/images/motorsport/01.jpg',
    title:    'Sunset over Paul Ricard',
    location: 'Cuges-les-Pins',
    category: 'Motorsport',
    aspect:   'portrait',
  },
  {
    id:       'feat-08',
    src:      '/images/cycling/29.jpg',
    title:    'In the blur',
    location: 'Aix-en-Provence',
    category: 'Cycling',
    aspect:   'portrait',
  },
  {
    id:       'feat-09',
    src:      '/images/tf/17.jpg',
    title:    'Duplicates',
    location: 'Aix-en-Provence',
    category: 'Track & Field',
    aspect:   'landscape',
  },
  {
    id:       'feat-10',
    src:      '/images/soiree/20.jpg',
    title:    'Spiderman kiss',
    location: 'Toulon',
    category: 'Soiree',
    aspect:   'portrait',
  },
  {
    id:       'feat-11',
    src:      '/images/soiree/09.jpg',
    title:    'A night out',
    location: 'Toulon',
    category: 'Soiree',
    aspect:   'portrait',
  },
  {
    id:       'feat-12',
    src:      '/images/tf/32.jpg',
    title:    'Detailed shot',
    location: 'Aix-en-Provence',
    category: 'Track & Field',
    aspect:   'portrait',
  },
  {
    id:       'feat-13',
    src:      '/images/cycling/17.jpg',
    title:    'Sunset Bike',
    location: 'Aix-en-Provence',
    category: 'Cycling',
    aspect:   'portrait',
  },
  {
    id:       'feat-14',
    src:      '/images/festival/09.jpg',
    title:    'Cotton Candy',
    location: 'Hyères',
    category: 'Festival',
    aspect:   'portrait',
  },
  {
    id:       'feat-15',
    src:      '/images/festival/12.jpg',
    title:    'DJ',
    location: 'Hyères',
    category: 'Festival',
    aspect:   'portrait',
  },
  {
    id:       'feat-16',
    src:      '/images/landscape/02.jpg',
    title:    'Man on fire',
    location: 'Malaysia',
    category: 'Landscape',
    aspect:   'landscape',
  },
  {
    id:       'feat-17',
    src:      '/images/soiree/14.jpg',
    title:    'BDE party',
    location: 'Toulon',
    category: 'Soiree',
    aspect:   'landscape',
  },
  {
    id:       'feat-18',
    src:      '/images/cycling/11.jpg',
    title:    'Sunset Bike',
    location: 'Aix-en-Provence',
    category: 'Cycling',
    aspect:   'landscape',
  },
  {
    id:       'feat-22',
    src:      '/images/tf/33.jpg',
    title:    'Too Easy',
    location: 'Aix-en-Provence',
    category: 'Track & Field',
    aspect:   'landscape',
  },
  {
    id:       'feat-23',
    src:      '/images/motorsport/15.jpg',
    title:    'Dead in the eyes',
    location: 'Cuges-les-Pins',
    category: 'Motorsport',
    aspect:   'portrait',
  },
  {
    id:       'feat-24',
    src:      '/images/motorsport/25.jpg',
    title:    'Focused',
    location: 'Cuges-les-Pins',
    category: 'Motorsport',
    aspect:   'landscape',
  },
  {
    id:       'feat-25',
    src:      '/images/soiree/15.jpg',
    title:    'Over the head shot',
    location: 'Toulon',
    category: 'Soiree',
    aspect:   'landscape',
  },
  {
    id:       'feat-26',
    src:      '/images/motorsport/20.jpg',
    title:    'Friendly rivals',
    location: 'Cuges-les-Pins',
    category: 'Motorsport',
    aspect:   'portrait',
  },
  {
    id:       'feat-27',
    src:      '/images/festival/13.jpg',
    title:    'Group of friends',
    location: 'Hyères',
    category: 'Festival',
    aspect:   'portrait',
  },
  {
    id:       'feat-28',
    src:      '/images/landscape/21.jpg',
    title:    'Tension in the air',
    location: 'Perhentian islands',
    category: 'Landscape',
    aspect:   'landscape',
  },
  {
    id:       'feat-30',
    src:      '/images/tf/34.jpg',
    title:    'Superman',
    location: 'Aix-en-Provence',
    category: 'Track & Field',
    aspect:   'landscape',
  },
])
