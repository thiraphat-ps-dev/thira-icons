// Small geometry helpers for drawing icons precisely (rounded polygons, rays, split curves).
// Used by the batch worksheets in explore/; the icons themselves are plain SVG in icons/.

/** Round to 2 decimals and drop trailing zeros: 3.10 → "3.1", -0 → "0". */
export const f = (n) => {
  const r = Math.round(n * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
};

/**
 * Closed polygon with rounded corners. `points` go clockwise on screen; `radii` is one radius
 * per corner (or a single number). Each corner becomes an arc tangent to both edges.
 * @param {[number, number][]} points
 * @param {number | number[]} radii
 */
export function roundedPolygon(points, radii) {
  const n = points.length;
  const rs = Array.isArray(radii) ? radii : points.map(() => radii);
  const corners = points.map((v, i) => {
    const p = points[(i - 1 + n) % n];
    const q = points[(i + 1) % n];
    const a = norm([p[0] - v[0], p[1] - v[1]]);
    const b = norm([q[0] - v[0], q[1] - v[1]]);
    const angle = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1])));
    const t = rs[i] / Math.tan(angle / 2); // distance from the corner to each tangent point
    const start = [v[0] + a[0] * t, v[1] + a[1] * t];
    const end = [v[0] + b[0] * t, v[1] + b[1] * t];
    const cross = a[0] * b[1] - a[1] * b[0];
    return { start, end, r: rs[i], sweep: cross < 0 ? 1 : 0 };
  });
  let d = `M${f(corners[0].end[0])} ${f(corners[0].end[1])}`;
  for (let i = 1; i <= n; i++) {
    const c = corners[i % n];
    d += `L${f(c.start[0])} ${f(c.start[1])}`;
    d += `A${f(c.r)} ${f(c.r)} 0 0 ${c.sweep} ${f(c.end[0])} ${f(c.end[1])}`;
  }
  return d + 'Z';
}

function norm([x, y]) {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
}

/** Lines radiating from (cx, cy) between radius r1 and r2, `count` of them, starting at `start` degrees (0 = up). */
export function rays(cx, cy, r1, r2, count, start = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((start + (360 / count) * i) * Math.PI) / 180;
    const [sx, sy] = [Math.sin(a), -Math.cos(a)];
    return `M${f(cx + sx * r1)} ${f(cy + sy * r1)}L${f(cx + sx * r2)} ${f(cy + sy * r2)}`;
  });
}

/** Point on a cubic Bézier at t. */
export function cubicAt([p0, p1, p2, p3], t) {
  const u = 1 - t;
  return [0, 1].map(
    (k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k],
  );
}

/** Split a cubic at t (de Casteljau) → [left, right], each a cubic. */
export function splitCubic([p0, p1, p2, p3], t) {
  const lerp = (a, b) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const a = lerp(p0, p1), b = lerp(p1, p2), c = lerp(p2, p3);
  const d = lerp(a, b), e = lerp(b, c);
  const m = lerp(d, e);
  return [
    [p0, a, d, m],
    [m, e, c, p3],
  ];
}

/** First t in [from, to] (scanning in that direction) where `test(point)` turns true. */
export function findT(curve, test, from = 0, to = 1, steps = 2000) {
  for (let i = 0; i <= steps; i++) {
    const t = from + ((to - from) * i) / steps;
    if (test(cubicAt(curve, t))) return t;
  }
  return null;
}

/** Distance from point p to the infinite line through a and b. */
export function distToLine(p, a, b) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / Math.hypot(dx, dy);
}

/** SVG path data for a cubic (with a leading M). */
export const cubicPath = ([p0, p1, p2, p3]) =>
  `M${f(p0[0])} ${f(p0[1])}C${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])} ${f(p3[0])} ${f(p3[1])}`;
/** SVG path data continuing a path with a cubic (no M). */
export const cubicTo = ([, p1, p2, p3]) =>
  `C${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])} ${f(p3[0])} ${f(p3[1])}`;
