# Brand artwork

The original hand-drawn logo files, white on transparency.

| File | What it is |
|---|---|
| `mark.png` | the square mark alone — the source the website's SVG is traced from |
| `lockup-horizontal.png` | mark + "Clere Visuals" side by side |
| `lockup-vertical.png` | mark + "ClereVisuals" stacked |

Only `mark.png` feeds the site. `src/data/logoMark.js` holds its vector trace,
split into the five parts the draw-on animation needs.

## Re-tracing after a change to mark.png

```bash
npm i -D potrace          # not a project dependency; this is a rare, manual job
```

Then, in a scratch script: take the PNG's alpha channel, blur it by 5 and
threshold at 175 (that pair is what thins the strokes to the weight used on
the site — drop the threshold for a heavier mark, raise it for a lighter one),
negate it, and run potrace with `turdSize: 30`. Split the resulting subpaths
into frame / C / flower / oval / V, shift them by (-93, -94) so they land in
the `0 0 483 492` box the pen paths are calibrated against, and paste them
into `MARK_PARTS`.
