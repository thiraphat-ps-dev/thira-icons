// Batch 10b worksheet: skip-back, skip-forward, rewind, fast-forward, circle-play, circle-pause, circle-stop, volume-1, volume, radio.
//   node explore/batch-10b.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { f, onCircle, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const mirror = (pts) => pts.map(([x, y]) => [24 - x, y]).reverse(); // keeps clockwise order

// ── skip: triangle + bar at its tip.
{
  const tri = [[5, 5.5], [16.5, 12], [5, 18.5]];
  const fwd = p(roundedPolygon(tri, 1.5), true);
  const back = p(roundedPolygon(mirror(tri), 1.5), true);
  add('skip-forward', 'skip,next,forward,media,track,ข้าม,ถัดไป,เพลงถัดไป', fwd, p('M19 5V19'));
  add('skip-back', 'skip,previous,back,media,track,ย้อนกลับ,ก่อนหน้า,เพลงก่อนหน้า', back, p('M5 5V19'));
}

// ── fast-forward / rewind: two triangles, clear gap between tip and next base.
{
  const w = 8.2, h = 6, gap = 3.75;
  const inset = 1.5 / Math.sin(Math.atan2(h, w)) - 1.5;
  const x1 = 3, x2 = x1 + (w - inset) + gap; // base of 2nd triangle
  const t = (x) => [[x, 12 - h], [x + w, 12], [x, 12 + h]];
  const a = t(x1), b = t(x2);
  console.log('ff right tip', x2 + w - inset);
  add('fast-forward', 'fast forward,skip,media,speed,forward,เร็ว,กรอไปข้างหน้า', p(roundedPolygon(a, 1.5), true), p(roundedPolygon(b, 1.5), true));
  add('rewind', 'rewind,back,media,reverse,กรอกลับ,ย้อนกลับ', p(roundedPolygon(mirror(b), 1.5), true), p(roundedPolygon(mirror(a), 1.5), true));
}

// ── circle-play / pause / stop
const ring = '<circle cx="12" cy="12" r="10" data-duotone />';
add('circle-play', 'play,start,media,circle,เล่น,เริ่ม,วิดีโอ', ring,
  p(roundedPolygon([[9.25, 7.25], [16.5, 12], [9.25, 16.75]], 1.25)));
add('circle-pause', 'pause,hold,media,circle,หยุดชั่วคราว,พัก', ring, p('M9.5 8.5v7'), p('M14.5 8.5v7'));
add('circle-stop', 'stop,end,media,circle,หยุด,จบ', ring, '<rect x="9" y="9" width="6" height="6" rx="2" />');

// ── volume: reuse the speaker path from volume-2 exactly.
const v2 = readFileSync('icons/core/volume-2.svg', 'utf8');
const speaker = v2.match(/<path d="([^"]+)" data-duotone \/>/)[1];
const arc1 = v2.match(/<path d="(M15\.5[^"]+)" \/>/)[1];
add('volume-1', 'volume,low,quiet,sound,audio,speaker,เสียงเบา,ลำโพง,เสียง', p(speaker, true), p(arc1));
add('volume', 'volume,speaker,sound,audio,เสียง,ลำโพง', p(speaker, true));

// ── radio: centre dot with two pairs of arcs left and right.
{
  const pt = ([x, y]) => `${f(x)} ${f(y)}`;
  const arcs = [];
  for (const r of [5, 9]) {
    arcs.push(p(`M${pt(onCircle(12, 12, r, 50))}A${r} ${r} 0 0 1 ${pt(onCircle(12, 12, r, 130))}`));
    arcs.push(p(`M${pt(onCircle(12, 12, r, 230))}A${r} ${r} 0 0 1 ${pt(onCircle(12, 12, r, 310))}`));
  }
  add('radio', 'radio,broadcast,signal,antenna,wave,วิทยุ,กระจายเสียง,สัญญาณ', '<circle cx="12" cy="12" r="1" />', ...arcs);
}

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
