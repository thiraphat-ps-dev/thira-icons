# thira-icons — guide for Claude

Icon library: Lucide icons restyled ("Thira style") plus an original Thai set, shipped as React components, SVG files, an SVG sprite and an icon font. Companion to thira-ui and Thira Sans.

## Working with the maintainer

- **Talk to the maintainer in Thai.** Code, comments, commit messages, README in English.
- Commit locally when a piece of work is done and `npm run build && npm test` pass.
- **Ask before:** pushing, creating the GitHub repo, publishing to npm, bumping the version, adding a runtime dependency.

## Commands

| Command              | What it does                                                                    |
| -------------------- | ------------------------------------------------------------------------------- |
| `npm run build`      | Lucide + `icons/thai` → `dist/` (svg, sprite, react, icons.json) and `tsc`      |
| `npm run build:font` | `dist/svg` → `dist/font` (Python: `pip install -r requirements.txt`, ~1–2 min)   |
| `npm test`           | Typechecks tests against generated `.d.ts`, then Vitest on `dist/`              |
| `npm run site`       | Preview site → `site/` (serve it, e.g. `python -m http.server` inside `site/`) |

## Decisions (keep unless the maintainer agrees to change them)

1. **Lucide is not copied into the repo.** `lucide-static` is pinned to an exact version; the build reads its `icon-nodes.json` and `tags.json`. Deprecated Lucide alias names are skipped.
2. **Style lives in `scripts/style.mjs`** (stroke 1.75, rect radius ×1.5). Change it there, never per output.
3. **React names are `<Pascal>Icon`** (`SearchIcon`) so they never shadow `Map`, `Image`, `Link`. React 19+, `ref` as a prop, size defaults to `1em`, decorative (`aria-hidden`) unless `title`.
4. **Icon font codepoints are permanent.** `icons/codepoints.json` is managed by the build and committed; removed icons keep their codepoint reserved. CI fails if the build changes it — run `npm run build` locally and commit the file after adding icons.
5. **Thai icons** live in `icons/thai/*.svg`: 24×24 grid, stroke-only, round caps/joins, ~2px padding, one self-closing element per line (the build's parser expects that), English + Thai search words in `data-tags`. No logos or trademarks (e.g. draw a generic QR payment, not the PromptPay mark). Check new drawings at 24px and large before committing.
6. The sprite's stroke width is `var(--thira-icon-stroke-width, 1.75)` in a `style` attribute on each `<symbol>` so `<use>` instances can override it.

## Gotchas

- **Windows + Vitest:** run from an uppercase `C:` path (`cd /C/thira-works/projects/thira-icons` in Git Bash).
- `npm run build` deletes `dist/`, including the font; rebuild the font afterwards if you need it.
- picosvg/skia-pathops installs and runs fine in a venv on this machine (unlike gftools in thira-sans).
