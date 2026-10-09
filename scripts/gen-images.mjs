/**
 * gen-images.mjs
 *
 * Builds every derivative the site needs from the full-res originals in
 * public/images/<album>/, then writes the photo catalogue the app imports.
 *
 * Usage:
 *   npm run images
 *
 * For public/images/tf/01.jpg it produces:
 *   public/images/tf/thumbs/01.jpg   900px  jpeg  — grids, album covers
 *   public/images/tf/large/01.webp  2200px  webp  — lightbox (longest side)
 *
 * The originals are never served: they stay on disk as the archive and are
 * excluded from the build (see vite.config.js). It also writes
 * src/data/photos.generated.js, so album contents and real aspect ratios
 * always match the files actually present — no hand-kept counts, plus
 * public/sitemap.xml with an image entry per photo.
 *
 * Settings:
 *   THUMB / LARGE — max width + quality per tier
 */

import sharp from 'sharp'
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, dirname, extname, basename } from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname  = dirname(fileURLToPath(import.meta.url))
const ROOT       = join(__dirname, '..')
const SOURCE_DIR = join(ROOT, 'photos-source')            // archive — never served
const OUTPUT_DIR = join(ROOT, 'public', 'images')         // derivatives — shipped
const CATALOGUE  = join(ROOT, 'src', 'data', 'photos.generated.js')
const SITEMAP    = join(ROOT, 'public', 'sitemap.xml')

// Production origin, no trailing slash. If you change this, change the
// canonical / og:url / JSON-LD block in index.html and public/robots.txt too.
const SITE_URL = 'https://clerevisuals.fr'

// ── Tune these to taste ───────────────────────────────────────────────────
// `width` constrains the width only (thumbs sit in fixed-width grid columns);
// `box` constrains the longest side, so tall portraits don't balloon.
const THUMB = { dir: 'thumbs', width:  900, quality: 72, format: 'jpeg' }
const LARGE = { dir: 'large',  box:   2200, quality: 80, format: 'webp' }

// One-off images that are not part of an album. `source` is a path inside
// photos-source/, `out` a path inside public/images/. The hero itself has no
// photograph — this is the card that shows up when the site is shared, and
// the About portrait.
const SINGLES = [
  {
    source: 'cycling/03.jpg',
    out:    'og-cover.jpg',
    // 1200x630 is the size every social scraper crops to; jpeg because webp
    // support is still uneven across link-preview bots.
    resize: { width: 1200, height: 630, fit: 'cover', position: 'attention' },
    format: 'jpeg', quality: 82,
  },
  {
    source: 'singles/portrait.jpg',
    out:    'portrait.webp',
    resize: { width: 1400, withoutEnlargement: true },
    format: 'webp', quality: 80,
  },
]
// ─────────────────────────────────────────────────────────────────────────

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const extFor = tier => (tier.format === 'webp' ? '.webp' : '.jpg')

const xml = str => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Renders one derivative, skipping it when it is already newer than the source. */
async function derive(src, album, name, tier, srcMtime) {
  const outDir = join(OUTPUT_DIR, album, tier.dir)
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

  const dest = join(outDir, basename(name, extname(name)) + extFor(tier))

  if (existsSync(dest) && (await stat(dest)).mtimeMs >= srcMtime) return false

  const pipeline = sharp(src).resize(
    tier.box
      ? { width: tier.box, height: tier.box, fit: 'inside', withoutEnlargement: true }
      : { width: tier.width, withoutEnlargement: true },
  )

  await (tier.format === 'webp'
    ? pipeline.webp({ quality: tier.quality })
    : pipeline.jpeg({ quality: tier.quality, progressive: true, mozjpeg: true })
  ).toFile(dest)

  return true
}

/** Builds the one-off images listed in SINGLES. */
async function processSingles() {
  for (const single of SINGLES) {
    const src  = join(SOURCE_DIR, single.source)
    const dest = join(OUTPUT_DIR, single.out)

    if (!existsSync(src)) {
      console.log(`  ${single.out.padEnd(16)} ✗  missing source photos-source/${single.source}`)
      continue
    }

    const srcMtime = (await stat(src)).mtimeMs
    if (existsSync(dest) && (await stat(dest)).mtimeMs >= srcMtime) {
      console.log(`  ${single.out.padEnd(16)} up to date`)
      continue
    }

    await mkdir(dirname(dest), { recursive: true })

    const pipeline = sharp(src).rotate().resize(single.resize)
    await (single.format === 'webp'
      ? pipeline.webp({ quality: single.quality })
      : pipeline.jpeg({ quality: single.quality, progressive: true, mozjpeg: true })
    ).toFile(dest)

    console.log(`  ${single.out.padEnd(16)} built from ${single.source}`)
  }
}

async function processAlbum(album) {
  const folder  = join(SOURCE_DIR, album)
  const entries = await readdir(folder, { withFileTypes: true })
  const images  = entries
    .filter(e => e.isFile() && SUPPORTED.has(extname(e.name).toLowerCase()))
    .map(e => e.name)
    .sort()

  if (images.length === 0) return null

  let built = 0
  const files = []

  for (const name of images) {
    const src     = join(folder, name)
    const srcStat = await stat(src)
    const meta    = await sharp(src).metadata()

    // EXIF orientations 5-8 swap the reported width/height.
    const rotated = meta.orientation >= 5
    const width   = rotated ? meta.height : meta.width
    const height  = rotated ? meta.width  : meta.height

    for (const tier of [THUMB, LARGE]) {
      if (await derive(src, album, name, tier, srcStat.mtimeMs)) built++
    }

    files.push({ file: name, w: width, h: height })
  }

  console.log(
    `  ${album.padEnd(12)} ${String(images.length).padStart(3)} images` +
    `  →  ${built ? `+${built} derivatives` : 'up to date'}`,
  )

  return { folder: album, files }
}

/**
 * One URL — the site is a single page — carrying an image entry per photo, so
 * the albums are discoverable in image search even though no photo has a page
 * of its own. Points at the `large` derivatives: those are the copies that are
 * actually served.
 */
async function writeSitemap(albums) {
  const images = albums.flatMap(({ folder, files }) =>
    files.map(({ file }) => {
      const name = basename(file, extname(file))
      return `    <image:image>\n` +
             `      <image:loc>${xml(`${SITE_URL}/images/${folder}/${LARGE.dir}/${name}.webp`)}</image:loc>\n` +
             `    </image:image>`
    }),
  )

  await writeFile(
    SITEMAP,
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!-- AUTO-GENERATED by scripts/gen-images.mjs — do not edit by hand. -->\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    `  <url>\n` +
    `    <loc>${SITE_URL}/</loc>\n` +
    `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n` +
    `    <changefreq>monthly</changefreq>\n` +
    `    <priority>1.0</priority>\n` +
    `${images.join('\n')}\n` +
    `  </url>\n` +
    `</urlset>\n`,
    'utf8',
  )

  console.log(`🗺   Sitemap written — 1 URL, ${images.length} images`)
}

async function main() {
  console.log('\n🖼   Building image derivatives…\n')
  for (const tier of [THUMB, LARGE]) {
    const limit = tier.box ? `${tier.box}px longest side` : `${tier.width}px wide`
    console.log(`   ${tier.dir.padEnd(7)} ${limit.padEnd(20)} ${tier.format} q${tier.quality}`)
  }
  console.log('')

  if (!existsSync(SOURCE_DIR)) {
    console.error(`✗  No photos-source/ directory at ${SOURCE_DIR}`)
    console.error('   Put your full-res albums there, e.g. photos-source/tf/01.jpg\n')
    process.exit(1)
  }

  const entries = await readdir(SOURCE_DIR, { withFileTypes: true })
  const names   = entries
    .filter(e => e.isDirectory() && e.name !== 'singles')
    .map(e => e.name)
    .sort()

  const albums = []
  for (const name of names) {
    const album = await processAlbum(name)
    if (album) albums.push(album)
  }

  const body = albums
    .map(a => {
      const rows = a.files
        .map(f => `    { file: '${f.file}', w: ${f.w}, h: ${f.h} },`)
        .join('\n')
      return `  '${a.folder}': [\n${rows}\n  ],`
    })
    .join('\n')

  await writeFile(
    CATALOGUE,
    `/**\n * AUTO-GENERATED by scripts/gen-images.mjs — do not edit by hand.\n` +
    ` * Run \`npm run images\` after adding or removing photos.\n */\n\n` +
    `export const albumFiles = {\n${body}\n}\n`,
    'utf8',
  )

  console.log('\n🎬  One-off images…\n')
  await processSingles()

  await writeSitemap(albums)

  const total = albums.reduce((n, a) => n + a.files.length, 0)
  console.log(`\n📝  Catalogue written — ${total} photos across ${albums.length} albums`)
  console.log('✅  Done.\n')
}

main().catch(err => { console.error(err); process.exit(1) })
