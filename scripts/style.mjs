// The Thira style, applied to every icon at build time.
// Lucide is drawn on a 24×24 grid with 2px round strokes. thira-icons keeps the grid and the
// round caps/joins, and changes what is listed here. Edit these rules, rebuild, and every
// output (SVG, sprite, React, font) follows.

/** Default stroke width. Lighter than Lucide's 2, to sit with Thira Sans at text sizes. */
export const STROKE_WIDTH = 1.75;

/** Rounded rectangles get softer corners, to match thira-ui's radii. */
const RECT_RADIUS_SCALE = 1.5;

/**
 * Restyle one element in place. `tag` is the SVG element name, `attrs` its attributes
 * (string values, as in Lucide's icon-nodes.json).
 * @param {string} tag
 * @param {Record<string, string>} attrs
 * @returns {Record<string, string>}
 */
export function restyle(tag, attrs) {
  if (tag === 'rect' && attrs.rx) {
    const max = Math.min(Number(attrs.width), Number(attrs.height)) / 2;
    const rx = Math.min(max, Number(attrs.rx) * RECT_RADIUS_SCALE);
    const out = { ...attrs, rx: trim(rx) };
    if (attrs.ry) out.ry = trim(Math.min(max, Number(attrs.ry) * RECT_RADIUS_SCALE));
    return out;
  }
  return attrs;
}

/** 3.0000001 → "3", 1.35 → "1.35" */
function trim(n) {
  return String(Math.round(n * 1000) / 1000);
}
