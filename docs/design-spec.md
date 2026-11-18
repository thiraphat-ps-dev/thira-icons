# thira-icons design spec

The rules every thira-icons icon is drawn to. The style is **Soft**: round strokes, generous corners and full, friendly proportions, to sit with [Thira Sans](https://github.com/thiraphat-ps-dev/thira-sans) (rounded corners) and [thira-ui](https://github.com/thiraphat-ps-dev/thira-ui).

Rules marked **(lint)** are checked by `scripts/lint-icons.mjs`, which runs in `npm test` and CI. The rest are for review: look at every new icon at 16, 24 and 48 px, in light and dark, before it's merged.

## 1. Canvas

| Rule | Value |
| --- | --- |
| Grid | 24 × 24, `viewBox="0 0 24 24"` **(lint)** |
| Live area | 2 – 22 (2 units of padding). Geometry (the stroke centreline) stays inside it **(lint: warning)** |
| Bleed | Only for wide or tall silhouettes that need it (roof eaves, long arrows), never past 1 – 23 **(lint: error)** |
| Coordinates | Multiples of 0.25 where possible; never more than 2 decimals **(lint)** |

Draw on whole and half units first. Quarter units are for optical corrections, not for the main structure.

## 2. Keylines

Pick the keyline that matches the icon's silhouette, so icons look the same size next to each other:

| Shape | Keyline | Example |
| --- | --- | --- |
| Circle | Ø 20 (centre 12, 12, r 10) | `baht-circle`, clock |
| Square | 18 × 18 (3 – 21) | calendar, card-like containers seen face-on |
| Portrait | 16 × 20 (x 4 – 20, y 2 – 22) | file, phone, trash |
| Landscape | 20 × 16 (x 2 – 22, y 4 – 20) | card, tuk-tuk, window |

Open shapes (search, user) are balanced by eye: their visual mass should match a filled keyline shape.

## 3. Stroke

| Rule | Value |
| --- | --- |
| Width | 1.75, uniform. No per-element `stroke-width` **(lint)** |
| Caps and joins | Round (set on the root by the build) |
| Colour | `currentColor` only; no `stroke`/`fill` colours in sources **(lint)** |
| Dots | Detail dots (calendar days, the dot of `i` and `!`): a zero-length line, `<path d="M8 15h.01" />` — the round cap draws a 1.75 dot. Dots that *are* the icon (ellipsis): `<circle r="1" />`, a 3.75 dot |

The default can change at use time (`strokeWidth`, sprite CSS variable), so icons must still read at 1.5 and 2.

## 4. Corners

Containers get a radius from their shortest side **(lint, for `<rect>`)**:

| Shortest side | Radius |
| --- | --- |
| ≥ 15 | 4 |
| 10 – 14.99 | 3 |
| 6 – 9.99 | 2 |
| < 6 | 1 – 1.5 |

Paths with corners follow the same table: draw them with arcs (`a2 2 0 0 1 …`) at these radii. Sharp corners are only for things that are sharp in the real world (arrowheads, a pen tip, star points) — and even then, the round join softens them.

## 5. Spacing and detail

- **Clear gap:** at least 2 units between parallel strokes (centre to centre ≥ 2 + 1.75), so they don't merge at 16 px.
- **Detail budget:** if it doesn't read at 16 px, leave it out. Inner details (lines on a document, dots on a calendar) are 3 at most.
- **Interior lines** stop at least 2 units short of the container's stroke.
- **Angles:** 45° first, then 30° / 60°. Other angles only when the object needs them.
- **Proportions are full:** bodies are a little rounder and wider than in technical icon sets (e.g. the trash can tapers and its lid overhangs; the user's shoulders are a full half-circle).

## 6. Modifiers

Variants of an icon (`calendar-check`, `user-plus`, `file-x`) put the modifier in the **bottom-right badge zone**: a circle at (18, 18), r 4.5. The base icon is cut back so there are 2 units of clear space around the badge. Keep the base recognisable with the badge removed.

## 7. Duotone-ready

A `variant="duotone"` (soft 20% fill behind the main shape) may be added later without redrawing. So:

- The main area of each icon should be a **closed** shape (or an open arc that closes sensibly, like the user's shoulders). Pure line icons (arrows, chevrons, check, x) have no area and no mark.
- Mark the element(s) that would be filled with `data-duotone` **(lint: the attribute takes no value)**. The build strips `data-*` attributes from all outputs today.

## 8. Elements

Allowed: `path`, `circle`, `rect`, `line`, `polyline`, `polygon`, `ellipse` **(lint)**. No `g`, `transform`, `style`, `class`, masks, gradients or text — the build and the icon font need flat, stroked geometry. One self-closing element per line.

## 9. Naming and metaphors

- **Names:** kebab-case, object first, then modifier: `calendar-check`, `arrow-up-right`, `file-plus` **(lint)**.
- **Tags:** `data-tags` on the root, comma-separated, English and Thai: `data-tags="delete,remove,bin,ลบ,ถังขยะ"`. At least 3 **(lint)**.
- **One metaphor per idea:** delete is always the trash can, settings is always the gear, add is always the plus. Don't introduce a second metaphor for the same action.
- **Thai icons** use English names (`tuk-tuk`, `thai-id-card`) with Thai tags. No logos, trademarks or official emblems — draw the generic object (a QR payment, not the PromptPay mark).

## 10. Review checklist

- [ ] Reads at 16 px in light and dark
- [ ] Looks the same size as its neighbours (keyline)
- [ ] Still reads at stroke 1.5 and 2
- [ ] Corners follow the radius table; gaps ≥ 2
- [ ] Main area marked `data-duotone`
- [ ] Name and tags (English + Thai) make sense; same metaphor as related icons
- [ ] `npm test` passes (includes the lint)
