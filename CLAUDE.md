# thira-icons — guide for Claude

Icon library being **drawn from scratch** in the "Soft" style (chosen 2026-11-18 over Crisp and Duotone, see `explore/styles.html`), plus an original Thai set, shipped as React components, SVG files, an SVG sprite and an icon font. Until the core set is done, undrawn names fall back to restyled Lucide icons. Companion to thira-ui and Thira Sans.

**Draw every icon to `docs/design-spec.md`** and run `npm run lint:icons`. New general icons go in `icons/core/` (same name as Lucide's = replaces it, keeping component name and codepoint); Thai ones in `icons/thai/`. Show new drawings to the maintainer at 16/24/48 px in light and dark before committing — design decisions are theirs.

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
| `npm run progress`   | Regenerates `docs/v1-icons.md` (0.1.0 list + drawn status) from `docs/v1-icons.json` |
| `npm run lint:icons` | Checks own icons against `docs/design-spec.md`                                  |
| `npm run site`       | Preview site → `site/` (serve it, e.g. `python -m http.server` inside `site/`) |

## Decisions (keep unless the maintainer agrees to change them)

1. **Lucide is not copied into the repo** and is only a fill-in. `lucide-static` is pinned to an exact version; the build reads its `icon-nodes.json` and `tags.json`. Deprecated Lucide alias names are skipped. The plan is to drop it once ~100 core icons are drawn (release 0.1.0).
2. **Own icons are drawn to the spec, not restyled.** `scripts/style.mjs` (stroke 1.75, rect radius ×1.5) applies to the Lucide fill-ins only. Source-only attributes (`data-tags`, `data-duotone`) are stripped from outputs.
3. **React names are `<Pascal>Icon`** (`SearchIcon`) so they never shadow `Map`, `Image`, `Link`. React 19+, `ref` as a prop, size defaults to `1em`, decorative (`aria-hidden`) unless `title`.
4. **Icon font codepoints are permanent.** `icons/codepoints.json` is managed by the build and committed; removed icons keep their codepoint reserved. CI fails if the build changes it — run `npm run build` locally and commit the file after adding icons.
5. **Source format** (`scripts/sources.mjs` parses it): one self-closing element per line, English + Thai words in `data-tags`, main area marked `data-duotone` (for a future duotone variant). No logos or trademarks (e.g. draw a generic QR payment, not the PromptPay mark).
6. The sprite's stroke width is `var(--thira-icon-stroke-width, 1.75)` in a `style` attribute on each `<symbol>` so `<use>` instances can override it.

## Gotchas

- **Windows + Vitest:** run from an uppercase `C:` path (`cd /C/thira-works/projects/thira-icons` in Git Bash).
- `npm run build` deletes `dist/`, including the font; rebuild the font afterwards if you need it.
- picosvg/skia-pathops installs and runs fine in a venv on this machine (unlike gftools in thira-sans).
