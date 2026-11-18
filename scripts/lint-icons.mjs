// Checks the hand-drawn icons (icons/core, icons/thai) against docs/design-spec.md.
// Errors fail `npm test` / CI; warnings are printed for review.
//   node scripts/lint-icons.mjs
import { svgPathBbox } from 'svg-path-bbox';
import { loadSources } from './sources.mjs';

const ALLOWED = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);
// Styling belongs to the build (stroke width, caps, colour) — never in a source element.
const FORBIDDEN_ATTRS = new Set([
  'stroke', 'fill', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'style', 'class',
  'transform', 'opacity', 'fill-opacity', 'stroke-opacity', 'id',
]);
const LIVE = [2, 22];
const BLEED = [1, 23];

/** Expected corner radius for a container, from its shortest side (spec §4). */
export function expectedRadius(shortest) {
  if (shortest >= 15) return [4, 4];
  if (shortest >= 10) return [3, 3];
  if (shortest >= 6) return [2, 2];
  return [1, 1.5];
}

const num = (v) => Number(v);
const points = (s) => s.trim().split(/[\s,]+/).map(Number);

/** Bounding box of an element's geometry (stroke centreline), or null if it can't be computed. */
function bbox({ tag, attrs: a }) {
  switch (tag) {
    case 'circle':
      return [num(a.cx) - num(a.r), num(a.cy) - num(a.r), num(a.cx) + num(a.r), num(a.cy) + num(a.r)];
    case 'ellipse':
      return [num(a.cx) - num(a.rx), num(a.cy) - num(a.ry), num(a.cx) + num(a.rx), num(a.cy) + num(a.ry)];
    case 'rect':
      return [num(a.x ?? 0), num(a.y ?? 0), num(a.x ?? 0) + num(a.width), num(a.y ?? 0) + num(a.height)];
    case 'line':
      return [Math.min(num(a.x1), num(a.x2)), Math.min(num(a.y1), num(a.y2)), Math.max(num(a.x1), num(a.x2)), Math.max(num(a.y1), num(a.y2))];
    case 'polyline':
    case 'polygon': {
      const p = points(String(a.points));
      const xs = p.filter((_, i) => i % 2 === 0);
      const ys = p.filter((_, i) => i % 2 === 1);
      return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    }
    case 'path':
      return svgPathBbox(String(a.d));
    default:
      return null;
  }
}

/**
 * @returns {{ file: string, level: 'error' | 'warning', message: string }[]}
 */
export function lint(icons = loadSources()) {
  const problems = [];
  const seen = new Map();
  for (const icon of icons) {
    const report = (level, message, line) =>
      problems.push({ file: icon.file.replace(/\\/g, '/') + (line ? `:${line}` : ''), level, message });

    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(icon.name)) report('error', `name "${icon.name}" must be kebab-case`);
    if (seen.has(icon.name)) report('error', `name "${icon.name}" is also used by ${seen.get(icon.name)}`);
    seen.set(icon.name, icon.file);
    if (icon.root.viewBox !== '0 0 24 24') report('error', 'root needs viewBox="0 0 24 24"');
    if (icon.tags.length < 3) report('error', `needs at least 3 data-tags (has ${icon.tags.length})`);
    for (const tag of icon.otherTags) report('error', `<${tag}> isn't allowed: flat, self-closing elements only`);
    if (icon.elements.length === 0) report('error', 'no elements');
    // Only icons with an area need a duotone mark; pure line icons (arrows, check) have none.
    const closed = icon.elements.some(
      (e) =>
        (e.tag === 'circle' && num(e.attrs.r) > 1.5) || // r ≤ 1.5 circles are dots, not areas
        ['rect', 'ellipse', 'polygon'].includes(e.tag) ||
        (e.tag === 'path' && /z\s*$/i.test(String(e.attrs.d))),
    );
    if (closed && !icon.elements.some((e) => e.attrs['data-duotone'])) report('warning', 'no element is marked data-duotone');

    const box = [Infinity, Infinity, -Infinity, -Infinity];
    for (const el of icon.elements) {
      if (!ALLOWED.has(el.tag)) report('error', `<${el.tag}> isn't allowed`, el.line);
      for (const [key, value] of Object.entries(el.attrs)) {
        if (FORBIDDEN_ATTRS.has(key)) report('error', `"${key}" isn't allowed: styling comes from the build`, el.line);
        else if (key === 'data-duotone') {
          if (value !== true) report('error', 'data-duotone takes no value', el.line);
        } else if (key.startsWith('data-')) report('error', `unknown attribute "${key}"`, el.line);
        else if (typeof value === 'string' && /\d\.\d{3,}/.test(value)) report('error', `"${key}" has more than 2 decimals`, el.line);
      }
      if (el.tag === 'rect') {
        const shortest = Math.min(num(el.attrs.width), num(el.attrs.height));
        const [lo, hi] = expectedRadius(shortest);
        const rx = num(el.attrs.rx ?? 0);
        if (rx < lo || rx > hi) report('error', `rect with shortest side ${shortest} needs rx ${lo === hi ? lo : `${lo}–${hi}`} (has ${rx})`, el.line);
      }
      const b = bbox(el);
      if (b && b.every(Number.isFinite)) {
        box[0] = Math.min(box[0], b[0]);
        box[1] = Math.min(box[1], b[1]);
        box[2] = Math.max(box[2], b[2]);
        box[3] = Math.max(box[3], b[3]);
      } else if (ALLOWED.has(el.tag)) report('error', `can't read the geometry of <${el.tag}>`, el.line);
    }
    if (Number.isFinite(box[0])) {
      const r = (n) => Math.round(n * 100) / 100;
      const fmt = `${r(box[0])},${r(box[1])} → ${r(box[2])},${r(box[3])}`;
      const E = 0.01; // arc bounding boxes come back with float noise (22.0000001)
      const outside = ([lo, hi]) => box[0] < lo - E || box[1] < lo - E || box[2] > hi + E || box[3] > hi + E;
      if (outside(BLEED)) report('error', `geometry ${fmt} goes past the bleed limit ${BLEED.join('–')}`);
      else if (outside(LIVE))
        report('warning', `geometry ${fmt} uses the bleed (live area is ${LIVE.join('–')})`);
    }
  }
  return problems;
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/lint-icons.mjs')) {
  const problems = lint();
  for (const p of problems) console.log(`${p.level === 'error' ? '✗' : '!'} ${p.file}  ${p.message}`);
  const errors = problems.filter((p) => p.level === 'error').length;
  console.log(`${errors} error(s), ${problems.length - errors} warning(s)`);
  process.exitCode = errors ? 1 : 0;
}
