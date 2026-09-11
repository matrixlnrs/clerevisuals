# Clerevisuals

Portfolio site for Clerevisuals — sports and event photography in Provence.
React + Vite + Tailwind, with GSAP/Lenis for motion. One page, FR/EN, light
and dark themes.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Adding or changing photos

Photos live in **two** places, and this is the one thing to understand about
the project:

| Where | What | In git? | Served? |
|---|---|---|---|
| `photos-source/<album>/` | full-res originals, the archive | no | never |
| `public/images/<album>/thumbs/` | 900 px JPEG, for grids and covers | yes | yes |
| `public/images/<album>/large/` | 2200 px WebP, for the lightbox | yes | yes |

To add photos:

1. Drop the full-res files into `photos-source/<album>/`, named `01.jpg`,
   `02.jpg`, … (zero-padded, sorted by name).
2. Run the pipeline:

```bash
npm run images
```

That rebuilds only what changed and rewrites three files:
`src/data/photos.generated.js` (the catalogue — album contents and real aspect
ratios), `public/sitemap.xml`, and the derivatives themselves. Album counts are
never maintained by hand.

`photos-source/` is not in the repo, so **keep your own backup of it**. Losing
it means losing the originals; the site would keep working off the derivatives.

### Captions

Photos show their album name by default. To caption a specific one, add an
entry to `src/data/captions.js` keyed by `<album>-<position>` (`tf-003`):

```js
'tf-003': {
  title:    'Sprint Finish',
  location: 'Aix-en-Provence',
  alt:      'Sprinter crossing the line, arms raised, evening light',
},
```

The hand-picked "My Favorite Work" grid is a separate list in
`src/data/featured.js`.

### The hero and the social card

Both are cropped from one source photo, set in `SINGLES` at the top of
`scripts/gen-images.mjs`. Change the `source` there and re-run `npm run images`
to change the shot that greets visitors and the one that shows up when the link
is shared.

## Deploying

Netlify, configured in `netlify.toml` (build command, security headers, cache
policy). The production URL is `https://clerevisuals.fr` — it also appears in
`index.html` (canonical, Open Graph, JSON-LD), `public/robots.txt` and
`SITE_URL` in `scripts/gen-images.mjs`. Change it in all four if the domain
ever changes.

```bash
npm run build    # → dist/, about 49 MB, the vast majority of it photographs
```
