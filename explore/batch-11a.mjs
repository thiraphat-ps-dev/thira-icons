// Batch 11a worksheet: plain shapes. node explore/batch-11a.mjs
import { writeFileSync } from 'node:fs';
import { f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const poly = (cx, cy, R, n, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((rot + (i * 360) / n) * Math.PI) / 180;
    return [cx + R * Math.sin(a), cy - R * Math.cos(a)];
  });
const rp = (pts, r) => roundedPolygon(pts, pts.map(() => r));

add('circle', 'circle,dot,round,shape,วงกลม,รูปทรง,ทรงกลม', circle(12, 12, 10, true));
add('square', 'square,box,shape,rectangle,สี่เหลี่ยม,จัตุรัส,รูปทรง', rect(3, 3, 18, 18, 4, true));
// Triangle: same proportions as triangle-exclamation-point.
add('triangle', 'triangle,shape,warning,delta,สามเหลี่ยม,รูปทรง',
  p(rp([[12, 1.75], [22.25, 20], [1.75, 20]], 2), true));
add('diamond', 'diamond,rhombus,shape,gem,เพชร,สี่เหลี่ยมข้าวหลามตัด,รูปทรง',
  p(rp([[12, 1.5], [22.5, 12], [12, 22.5], [1.5, 12]], 2.5), true));
add('hexagon', 'hexagon,shape,polygon,six,หกเหลี่ยม,รูปทรง',
  p(rp(poly(12, 12, 10.25, 6), 2), true));
add('pentagon', 'pentagon,shape,polygon,five,ห้าเหลี่ยม,รูปทรง',
  p(rp(poly(12, 12.75, 10.5, 5), 2), true));
add('octagon', 'octagon,shape,polygon,stop,eight,แปดเหลี่ยม,หยุด,รูปทรง',
  p(rp(poly(12, 12, 10.5, 8, 22.5), 2), true));
add('shapes', 'shapes,geometry,figures,design,primitives,รูปทรง,เรขาคณิต,ดีไซน์',
  p(rp([[12, 2.5], [16.5, 10], [7.5, 10]], 1.5), true),
  circle(7, 17.5, 3.5, true), rect(14, 14, 7, 7, 2, true));
{
  // Big star of sparkles.svg (curve 'c.7 5.1 1.9 6.3 7 7'), scaled to extent 10 about (12,12).
  const s = 10 / 7, [cx, cy] = [12, 12];
  const seg = [[0, -7], [0.7, -1.9], [1.9, -0.7], [7, 0]]; // relative to the centre, top -> right
  const rot = (k) => ([x, y]) => { let a = [x, y]; for (let i = 0; i < k; i++) a = [-a[1], a[0]]; return a; };
  const A = (q) => `${f(cx + q[0] * s)} ${f(cy + q[1] * s)}`;
  let d = `M${A(seg[0])}`;
  for (let k = 0; k < 4; k++) {
    const q = seg.map(rot(k));
    // each quadrant: top->right rotated by k*90, in absolute coordinates
    const [, c1, c2, e] = q;
    d += `C${A(c1)} ${A(c2)} ${A(e)}`;
  }
  add('sparkle', 'sparkle,star,shine,magic,new,ประกาย,ดาว,ใหม่', p(d + 'Z', true));
}
{
  const R = 9.5;
  const lines = [0, 60, 120].map((deg) => {
    const a = (deg * Math.PI) / 180, dx = R * Math.sin(a), dy = R * Math.cos(a);
    return p(`M${f(12 - dx)} ${f(12 - dy)}L${f(12 + dx)} ${f(12 + dy)}`);
  });
  add('asterisk', 'asterisk,star,wildcard,required,note,footnote,ดอกจัน,ดาวเล็ก,จำเป็น', ...lines);
}

for (const [name, { tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/core/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
