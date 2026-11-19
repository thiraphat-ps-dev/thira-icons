# thira-icons

Friendly, rounded stroke icons for React and plain HTML, with a **Thai set** (฿ baht, Thai ID card, temple, tuk-tuk, lotus…). Made to sit with [thira-ui](https://github.com/thiraphat-ps-dev/thira-ui) and [Thira Sans](https://github.com/thiraphat-ps-dev/thira-sans).

439 icons — 427 everyday icons and 12 Thai ones — every one drawn from scratch to the same [design spec](docs/design-spec.md): UI and arrows, files, communication, media and devices, text editing, charts, money, travel, food, nature and weather, animals, buildings, people and feelings. The set grows release by release; if you need an icon it doesn't have yet, [open an issue](https://github.com/thiraphat-ps-dev/thira-icons/issues).

**Browse and search all icons (English or Thai):** https://thiraphat-ps-dev.github.io/thira-icons/

- **Four ways to use them:** React components, SVG files, an SVG sprite, and an icon font.
- **Soft style:** 1.75 round strokes, generous corners and full, friendly proportions on a 24×24 grid.
- **Familiar names:** general icons use the same names as [Lucide](https://lucide.dev) where the idea is the same (`search`, `trash`, `circle-check`), so switching is mostly a find-and-replace.
- **Accessible by default:** decorative (`aria-hidden`) unless you give a `title`, `aria-label` or `aria-labelledby`.
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
| `title`       | —        | Accessible name. Without it (or `aria-label` / `aria-labelledby`) the icon is `aria-hidden`, which is right next to text. |
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

Copy `thira-icons/sprite.svg` into your public folder. The stroke width is a CSS custom property, so it can change per use: `style="--thira-icon-stroke-width: 1.5"`. The full sprite is ~165 KB (~21 KB gzipped).

## Icon font

```js
import 'thira-icons/font/thira-icons.css';
```

```html
<i class="ti ti-search" aria-hidden="true"></i>
```

Classes are `ti ti-<name>`; glyphs are in the Private Use Area (codepoints in [icons/codepoints.json](icons/codepoints.json)). The font has a fixed 1.75 stroke and is ~30 KB as WOFF2. Prefer the other formats when you can: they need no font download, and the stroke can change.

## Thai set

| Name           | Icon                                          | Tags (excerpt)              |
| -------------- | --------------------------------------------- | --------------------------- |
| `baht`         | ฿                                              | currency, บาท, เงิน          |
| `baht-circle`  | ฿ in a coin                                   | price, บาท, เหรียญ           |
| `thai-id-card` | Card with chip on the left, photo on the right | บัตรประชาชน                 |
| `temple`       | Two-tier roof with upturned eaves              | wat, วัด, โบสถ์               |
| `tuk-tuk`      | Auto rickshaw                                 | transport, ตุ๊กตุ๊ก           |
| `lotus`        | Lotus flower                                  | buddhism, บัว                |
| `qr-payment`   | Generic QR code with ฿ (not the PromptPay mark) | scan to pay, สแกนจ่าย, คิวอาร์ |
| `calendar-thai`| Calendar with พ (Buddhist Era)                 | พ.ศ., ปฏิทินไทย                  |
| `wai`          | Hands pressed together                        | greeting, thanks, ไหว้        |
| `elephant`     | Elephant face with big ears                   | animal, ช้าง                         |
| `spirit-house` | Spirit house on its post                      | shrine, ศาลพระภูมิ                    |
| `sticky-rice`  | Woven sticky-rice basket                      | กระติบ, ข้าวเหนียว             |

Sources are in [icons/thai/](icons/thai/).

## Drawing icons

Every icon is drawn to [docs/design-spec.md](docs/design-spec.md): 24 grid with 2 units of padding, keylines, 1.75 round strokes, a corner-radius table, 2-unit gaps, a bottom-right badge zone for modifiers, and English + Thai tags. `npm run lint:icons` checks the measurable rules (it also runs in `npm test`).

- `icons/core/` — general UI icons. Use Lucide's name when the idea is the same.
- `icons/thai/` — the Thai set.

## How it's built

```sh
npm run lint:icons   # check icons/core and icons/thai against the design spec
npm run build        # icons/ → dist/ (svg, sprite, react, icons.json)
npm run build:font   # dist/svg → dist/font (needs Python: pip install -r requirements.txt)
npm test
npm run site         # preview site → site/
```

| Path                     | What it is                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `docs/design-spec.md`    | The drawing rules                                                                              |
| `scripts/lint-icons.mjs` | Checks own icons against the spec (elements, attributes, radii, live area, tags, duotone mark) |
| `scripts/build.mjs`      | Reads `icons/core` and `icons/thai`, writes `dist/`                                            |
| `explore/styles.html`    | The three style directions that were compared; "A · Soft" was chosen                          |
| `scripts/font.py`        | Expands strokes to outlines with picosvg and builds the font with fontTools                    |
| `icons/codepoints.json`  | Icon font codepoints. Managed by the build; commit it whenever icons are added                 |
| `src/create-icon.ts`     | The React runtime behind every icon component                                                  |

## License

ISC, see [LICENSE](LICENSE).
