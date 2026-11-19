# Changelog

## Unreleased

### Added

- Batch 15: 14 new icons for sorting, filters and search states, sidebars and date pickers (453 icons in total). Font codepoints `e1b7`–`e1c4`.
  - Sorting: `arrow-down-narrow-wide`, `arrow-down-wide-narrow`, `arrow-up-narrow-wide`, `arrow-up-wide-narrow`
  - Actions: `copy-check`, `funnel-x`, `search-x`, `pin`
  - Files and dates: `file-search`, `calendar-range`, `calendar-clock`
  - Layout: `list-tree`, `panel-left-close`, `panel-left-open`

## 0.2.0 — 2026-11-19

### Fixed

- **React: icons labelled with `aria-label` or `aria-labelledby` are no longer hidden from screen readers.** Before, an icon was `aria-hidden` unless it had a `title`, so `<button><XIcon aria-label="Close" /></button>` had no accessible name. Now any of `title`, `aria-label` or `aria-labelledby` makes the icon `role="img"`; without one it is still decorative (`aria-hidden`).

### Changed

- Renamed two icons to Lucide's names (general icons follow Lucide's names where the idea is the same):
  - `circle-exclamation-point` → `circle-alert` (`CircleAlertIcon`)
  - `triangle-exclamation-point` → `triangle-alert` (`TriangleAlertIcon`)

### Deprecated

- The old names above still work in every format, unchanged from 0.1.0: React exports and `thira-icons/react/<old-name>` modules (marked `@deprecated`), SVG files, sprite symbols and icon font classes. They use the same font codepoints as before (`e01c`, `e07d`), now shared with the new names. `icons.json` lists them under the icon's `aliases`. They will be removed in a future major release.

## 0.1.0 — 2026-11-18

First release: 439 icons (427 general + 12 Thai), all drawn from scratch in the "Soft" style (1.75 round strokes on a 24×24 grid), with names that follow Lucide's where the idea is the same.

- React components (`<Name>Icon`, React 19+, `ref` as a prop, `size` defaults to `1em`), one module per icon, also importable as `thira-icons/react/<name>`
- SVG files, an SVG sprite (stroke width adjustable with `--thira-icon-stroke-width`) and an icon font with permanent codepoints
- `icons.json` with names, components, codepoints and English + Thai search tags

Note: the git history labels batches 5–14 as "for 0.2.0", but those icons were part of the 0.1.0 release (published from commit `584b7cf`). 0.2.0 is the release described above.
