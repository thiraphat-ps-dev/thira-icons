// Batch 6a worksheet: chevrons-up/down, rotate-cw, repeat, shuffle, move, scissors, zoom-in/out, power.
//   node explore/batch-6a.mjs
import { writeFileSync } from 'node:fs';
import { f, onCircle } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;

add('chevrons-up', 'chevrons,up,top,scroll up,collapse,ขึ้น,บน,เลื่อนขึ้น',
  p('M7.5 11.25 12 6.75l4.5 4.5'), p('M7.5 17.25 12 12.75l4.5 4.5'));
add('chevrons-down', 'chevrons,down,bottom,scroll down,expand,ลง,ล่าง,เลื่อนลง',
  p('M7.5 6.75 12 11.25l4.5-4.5'), p('M7.5 12.75 12 17.25l4.5-4.5'));

// rotate-cw = rotate-ccw mirrored in x
add('rotate-cw', 'rotate,redo,clockwise,refresh,turn,หมุน,ตามเข็มนาฬิกา,ทำซ้ำ',
  p('M19.36 7.75A8.5 8.5 0 1 0 19.36 16.25'), p('M16.07 6.55L19.36 7.75L19.97 4.3'));

add('repeat', 'repeat,loop,cycle,replay,again,วนซ้ำ,ซ้ำ,เล่นซ้ำ',
  p('M4 12v-1a4 4 0 0 1 4-4h12'), p('m16 3 4 4-4 4'),
  p('M20 12v1a4 4 0 0 1-4 4H4'), p('m8 21-4-4 4-4'));

add('shuffle', 'shuffle,random,mix,crossing,สุ่ม,สลับ,เล่นสุ่ม',
  p('M3 17h1.5a4 4 0 0 0 3.3-1.75l4.4-6.5A4 4 0 0 1 15.5 7H21'), p('m17 3 4 4-4 4'),
  p('M3 7h1.5a4 4 0 0 1 3.3 1.75'),
  p('M21 17h-5.5a4 4 0 0 1-3.3-1.75'), p('m17 13 4 4-4 4'));

add('move', 'move,drag,pan,arrows,reposition,ย้าย,ลาก,เลื่อน',
  p('M12 2.5v19'), p('M2.5 12h19'),
  p('m9 5.5 3-3 3 3'), p('m9 18.5 3 3 3-3'), p('m5.5 9-3 3 3 3'), p('m18.5 9 3 3-3 3'));

add('scissors', 'scissors,cut,trim,clip,snip,ตัด,กรรไกร,ตัดต่อ',
  circle(6, 6, 3, true), circle(6, 18, 3, true),
  p('M8.12 8.12 12 12'), p('M20 4 8.12 15.88'), p('M14.75 14.75 20 20'));

const lens = [circle(10.5, 10.5, 6.5, true), p('m15.5 15.5 4.5 4.5')];
add('zoom-in', 'zoom in,magnify,enlarge,search,plus,ขยาย,ซูมเข้า,แว่นขยาย',
  ...lens, p('M10.5 7.75v5.5'), p('M7.75 10.5h5.5'));
add('zoom-out', 'zoom out,shrink,reduce,search,minus,ย่อ,ซูมออก,แว่นขยาย',
  ...lens, p('M7.75 10.5h5.5'));

{
  const [ax, ay] = onCircle(12, 13, 8.5, 45);
  const [bx, by] = onCircle(12, 13, 8.5, 315);
  add('power', 'power,on,off,shutdown,switch,turn off,เปิด,ปิด,พลังงาน,สวิตช์',
    p(`M${f(ax)} ${f(ay)}A8.5 8.5 0 1 1 ${f(bx)} ${f(by)}`), p('M12 2.5v9'));
}

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
