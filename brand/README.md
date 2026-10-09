# Brand artwork

The original vector logo files, as supplied by the designer.

| File | What it is |
|---|---|
| `svg/ecusson.svg` | the square mark — **the source the site uses** |
| `svg/logo-horizontal.svg` | mark + wordmark, side by side |
| `svg/logo-vertical.svg` | mark + wordmark, stacked |
| `svg/picto-1…4.svg` | the individual pictograms |

`src/data/logoMark.js` holds `ecusson.svg`'s five paths verbatim, split one per
part (frame, C, flower, oval, V) so the mark can draw itself on the hero. The
geometry is untouched and stays in the file's own viewBox units.

## If the mark changes

Copy the new `d` attributes across into `MARK_PARTS`, keeping one path per
part. `PEN_PATHS` is expressed in the same units, so as long as the proportions
hold the draw-on animation keeps working — and if a part moves, nudge its pen
centreline to match.

The site colours the mark through the `color` prop on `<ScribbleLogo>`, so
these files stay neutral; there is no orange copy to maintain.
