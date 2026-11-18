# thira-icons

Friendly, rounded stroke icons for React and plain HTML: **2,091 icons restyled from [Lucide](https://lucide.dev)**, plus a **Thai set** (฿ baht, Thai ID card, temple, tuk-tuk, lotus…). Made to sit with [thira-ui](https://github.com/thiraphat-ps-dev/thira-ui) and [Thira Sans](https://github.com/thiraphat-ps-dev/thira-sans).

**Browse and search all icons (English or Thai):** https://thiraphat-ps-dev.github.io/thira-icons/

- **Four ways to use them:** React components, SVG files, an SVG sprite, and an icon font.
- **Lighter, softer style:** 1.75 stroke (Lucide uses 2) and rounder rectangle corners, on Lucide's 24×24 grid with round caps and joins.
- **Accessible by default:** decorative (`aria-hidden`) unless you give a `title`.
- **Stable names and codepoints:** icon font codepoints never change or get reused between versions.

```sh
npm install thira-icons
```

## React

```tsx
import { SearchIcon, BahtCircleIcon } from 'thira-icons';

<button>
  <SearchIcon /> Search
</button>

<BahtCircleIcon size={20} strokeWidth={2} title="Price in baht" />
```

Every icon is `<Name>Icon` in PascalCase: `arrow-up-right` → `ArrowUpRightIcon`, `tuk-tuk` → `TukTukIcon`. The `Icon` suffix keeps names like `Map`, `Image` and `Link` from shadowing built-ins.

| Prop          | Default  | Notes                                                                               |
| ------------- | -------- | ----------------------------------------------------------------------------------- |
| `size`        | `'1em'`  | Width and height. `1em` follows the surrounding font size.                          |
| `strokeWidth` | `1.75`   | In grid units (the grid is 24).                                                     |
| `title`       | —        | Accessible name. Without it the icon is `aria-hidden`, which is right next to text. |
| any SVG prop  |          | `className`, `style`, `color`, `ref`, `onClick`…                                    |

Colour is `currentColor`, so icons take the text colour. Each module is separate and the package has `"sideEffects": false`, so bundlers only ship the icons you import. You can also import one icon directly: `import TempleIcon from 'thira-icons/react/temple'`. Needs React 19 (`ref` is a regular prop).

## SVG files

```html
<img src="node_modules/thira-icons/dist/svg/search.svg" alt="Search" width="24" height="24" />
```

Exported as `thira-icons/svg/<name>.svg`, for Astro, Vue, Svelte, plain HTML or design tools. Inline the SVG if you want it to take `currentColor`.

## SVG sprite

```html
<svg width="24" height="24" aria-hidden="true">
  <use href="/sprite.svg#search" />
</svg>
```

Copy `thira-icons/sprite.svg` into your public folder. The stroke width is a CSS custom property, so it can change per use: `style="--thira-icon-stroke-width: 1.5"`. The full sprite is large (all icons, ~830 KB); for production, build a sprite with only the icons you use.

## Icon font

```js
import 'thira-icons/font/thira-icons.css';
```

```html
<i class="ti ti-search" aria-hidden="true"></i>
```

Classes are `ti ti-<name>`; glyphs are in the Private Use Area (codepoints in [icons/codepoints.json](icons/codepoints.json)). The font has a fixed 1.75 stroke and is ~135 KB as WOFF2. Prefer the other formats when you can: they need no font download, and the stroke can change.

## Thai set

| Name           | Icon                                          | Tags (excerpt)              |
| -------------- | --------------------------------------------- | --------------------------- |
| `baht`         | ฿                                              | currency, บาท, เงิน          |
| `baht-circle`  | ฿ in a coin                                   | price, บาท, เหรียญ           |
| `thai-id-card` | Card with chip on the left, photo on the right | บัตรประชาชน                 |
| `temple`       | Two-tier roof with upturned eaves              | wat, วัด, โบสถ์               |
| `tuk-tuk`      | Auto rickshaw                                 | transport, ตุ๊กตุ๊ก           |
| `lotus`        | Lotus flower                                  | buddhism, บัว                |

Sources are in [icons/thai/](icons/thai/). Draw on the 24×24 grid, strokes only, round caps and joins, about 2px of padding; put search words (English and Thai) in `data-tags`. Avoid logos and trademarks.

## How it's built

```sh
npm run build        # Lucide + icons/thai → dist/ (svg, sprite, react, icons.json)
npm run build:font   # dist/svg → dist/font (needs Python: pip install -r requirements.txt)
npm test
npm run site         # preview site → site/
```

| Path                     | What it is                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `scripts/style.mjs`      | The Thira style rules (stroke width, corner radius) applied to every icon                      |
| `scripts/build.mjs`      | Reads Lucide's `icon-nodes.json` (pinned `lucide-static`) and `icons/thai/*.svg`, writes `dist/` |
| `scripts/font.py`        | Expands strokes to outlines with picosvg and builds the font with fontTools                    |
| `icons/codepoints.json`  | Icon font codepoints. Managed by the build; commit it whenever icons are added                 |
| `src/create-icon.ts`     | The React runtime behind every icon component                                                  |

Lucide icons are not copied into this repo. They come from the exact `lucide-static` version in `package.json`, so updating Lucide is a version bump and a rebuild. Lucide's deprecated alias names are not included.

## License

ISC. Icons from Lucide are under Lucide's ISC license (and MIT for those derived from Feather); see [LICENSE](LICENSE).
