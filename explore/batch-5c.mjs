// Batch 5c worksheet: camera, video, mic, mic-off, headphones, printer, plane, car.
//   node explore/batch-5c.mjs
import { writeFileSync } from 'node:fs';
import { arcPieces, distToLine, f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

add('camera', 'camera,photo,picture,capture,snapshot,กล้อง,ถ่ายรูป,ภาพถ่าย',
  p('M2.5 10a3 3 0 0 1 3-3H8l1.1-1.7a2 2 0 0 1 1.7-.95h2.4a2 2 0 0 1 1.7.95L16 7h2.5a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-13a3 3 0 0 1-3-3z', true),
  circle(12, 13.5, 3.25));

add('video', 'video,camcorder,record,film,movie,วิดีโอ,กล้องวิดีโอ,บันทึก',
  rect(2.5, 6, 11, 12, 3, true),
  p(roundedPolygon([[16.75, 12], [21.5, 8], [21.5, 16]], [1.25, 1, 1])));

const capsule = 'M9 5.5a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z';
add('mic', 'microphone,mic,voice,record,audio,podcast,ไมค์,ไมโครโฟน,บันทึกเสียง',
  p(capsule, true), p('M5 11a7 7 0 0 0 14 0'), p('M12 18v3'), p('M8.5 21h7'));
{
  const a = [3.5, 3.5], b = [20.5, 20.5];
  const clear = (q) => distToLine(q, a, b) >= 2.75;
  add('mic-off', 'mic off,mute,microphone off,silent,no audio,ปิดไมค์,ปิดเสียง,ไมโครโฟน',
    p('M9.02 5.13A3 3 0 0 1 15 5.5v5.25', true),
    ...arcPieces(12, 11, 7, 90, 270, clear).map((d) => p(d)),
    p('M12 18v3'), p('M8.5 21h7'), p(`M${pt(a)}L${pt(b)}`));
}

add('headphones', 'headphones,headset,audio,music,listen,หูฟัง,ฟังเพลง,เสียง',
  p('M4.5 13.5V12a7.5 7.5 0 0 1 15 0v1.5'),
  rect(2, 13.5, 5, 7, 1.5, true), rect(17, 13.5, 5, 7, 1.5, true));

add('printer', 'printer,print,paper,document,office,เครื่องพิมพ์,พิมพ์,เอกสาร',
  p('M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3'),
  rect(2.5, 8, 19, 9, 2, true),
  p('M7 17v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2'),
  p('M17.5 12.5h.01'));

{
  // Top-view plane, nose up, drawn right half then mirrored; rotated 45° so it flies up-right.
  const half = [[0, -10], [1.75, -6], [1.75, -2], [9.5, 3], [9.5, 5], [1.75, 2.5], [1.75, 5.5], [4.5, 8], [4.5, 9.5], [0, 8.5]];
  const pts = [...half, ...half.slice(1, -1).reverse().map(([x, y]) => [-x, y])];
  const radii = pts.map((_, i) => (i === 0 ? 1.25 : 0.75));
  const ang = (45 * Math.PI) / 180, s = 1;
  const rot = pts.map(([x, y]) => [12 + s * (x * Math.cos(ang) - y * Math.sin(ang)), 12 + s * (x * Math.sin(ang) + y * Math.cos(ang))]);
  add('plane', 'plane,airplane,flight,travel,airport,เครื่องบิน,เที่ยวบิน,เดินทาง',
    p(roundedPolygon(rot, radii), true));
}

add('car', 'car,vehicle,drive,auto,transport,รถยนต์,รถ,ขับรถ',
  p('M5 17.5H4.5a2 2 0 0 1-2-2V12.5a2 2 0 0 1 1.5-1.94L6.5 9.5 8.2 6.2a2 2 0 0 1 1.8-1.2H14.5a2 2 0 0 1 1.6.8L18 9.5l1.9.5a2 2 0 0 1 1.6 2v3.5a2 2 0 0 1-2 2H19', true),
  p('M9 17.5h6'), circle(7, 17.5, 2), circle(17, 17.5, 2));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
