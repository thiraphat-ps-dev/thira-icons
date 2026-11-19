"""Builds the icon font from dist/svg (run after scripts/build.mjs).

Fonts can only fill shapes, so each stroked icon is first expanded into filled outlines with
picosvg (skia-pathops underneath), at the default stroke width. The font therefore has one fixed
stroke weight; use the React components, SVG files or sprite if you need to change it.

Writes dist/font/thira-icons.{ttf,woff2} and dist/font/thira-icons.css.

    pip install -r requirements.txt
    python scripts/font.py
"""

import json
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.svgLib.path import parse_path
from picosvg.svg import SVG

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
OUT = DIST / "font"
FAMILY = "thira-icons"

GRID = 24
SCALE = 40  # 24-unit grid → 960 units per em
UPM = GRID * SCALE
ASCENT = 840  # icon spans descender..ascender, so it sits on the text like a capital with a tail
DESCENT = ASCENT - UPM


def glyph_for(svg_path: Path):
    pico = SVG.parse(str(svg_path)).topicosvg()  # strokes → fills, transforms applied, unions
    pen = TTGlyphPen(None)
    # SVG y grows down; font y grows up. Flip and move the grid's top to the ascender.
    transform = TransformPen(Cu2QuPen(pen, max_err=1, reverse_direction=True), (SCALE, 0, 0, -SCALE, 0, ASCENT))
    for shape in pico.shapes():
        parse_path(shape.as_path().d, transform)
    return pen.glyph()


def main() -> None:
    icons = json.loads((DIST / "icons.json").read_text(encoding="utf-8"))
    version = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]

    order = [".notdef"] + [i["name"] for i in icons]
    glyphs = {".notdef": TTGlyphPen(None).glyph()}
    for i in icons:
        glyphs[i["name"]] = glyph_for(DIST / "svg" / f"{i['name']}.svg")

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap({int(i["codepoint"], 16): i["name"] for i in icons})
    fb.setupGlyf(glyphs)
    glyf = fb.font["glyf"]
    lsb = {}
    for name in order:
        glyf[name].recalcBounds(glyf)
        lsb[name] = getattr(glyf[name], "xMin", 0)
    fb.setupHorizontalMetrics({name: (UPM, lsb[name]) for name in order})
    fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT)
    fb.setupNameTable({"familyName": FAMILY, "styleName": "Regular", "version": f"Version {version}"})
    fb.setupOS2(sTypoAscender=ASCENT, sTypoDescender=DESCENT, usWinAscent=ASCENT, usWinDescent=-DESCENT)
    fb.setupPost()

    OUT.mkdir(parents=True, exist_ok=True)
    fb.save(str(OUT / f"{FAMILY}.ttf"))
    fb.font.flavor = "woff2"
    fb.save(str(OUT / f"{FAMILY}.woff2"))

    # Deprecated old names (icons.json "aliases") get a class on the same codepoint.
    classes = [(name, i["codepoint"]) for i in icons for name in [i["name"], *i.get("aliases", [])]]
    rules = "\n".join(f'.ti-{name}::before {{ content: "\\{cp}"; content: "\\{cp}" / ""; }}' for name, cp in classes)
    (OUT / f"{FAMILY}.css").write_text(
        f"""/* thira-icons icon font. Prefer the React components, SVG files or sprite: they scale the
 * stroke and need no font download. Mark icons decorative with aria-hidden, or give the
 * element that holds them a text label:
 *   <i class="ti ti-search" aria-hidden="true"></i>
 * The `content: "…" / ""` form also gives screen readers empty alt text where supported. */
@font-face {{
  font-family: '{FAMILY}';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('./{FAMILY}.woff2') format('woff2');
}}

.ti {{
  display: inline-block;
  font-family: '{FAMILY}';
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  line-height: 1;
  text-transform: none;
  vertical-align: -0.125em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}}

{rules}
""",
        encoding="utf-8",
        newline="\n",
    )
    print(f"font: {len(icons)} glyphs → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
