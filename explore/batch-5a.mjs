// Batch 5a worksheet: arrows, chevrons, circle/square variants, clipboard, list-filter.
//   node explore/batch-5a.mjs
import { writeFileSync } from 'node:fs';
import { f } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;

add('arrow-up-down', 'arrow,up,down,sort,reorder,swap,transfer,เรียง,ขึ้นลง,สลับ',
  p('M7 20V4'), p('m3 8 4-4 4 4'), p('M17 4v16'), p('m13 16 4 4 4-4'));
add('corner-down-left', 'arrow,corner,return,enter,reply,back,กลับ,ย้อนกลับ,ขึ้นบรรทัดใหม่',
  p('M20 4v7a4 4 0 0 1-4 4H4'), p('m9 10-5 5 5 5'));
add('chevrons-left', 'chevrons,left,first,rewind,back,collapse,ซ้าย,ย้อนกลับ,หน้าแรก',
  p('M11.25 7.5 6.75 12l4.5 4.5'), p('M17.25 7.5 12.75 12l4.5 4.5'));
add('chevrons-right', 'chevrons,right,last,fast forward,next,expand,ขวา,ถัดไป,หน้าสุดท้าย',
  p('M6.75 7.5 11.25 12l-4.5 4.5'), p('M12.75 7.5 17.25 12l-4.5 4.5'));
add('circle-plus', 'add,plus,new,create,circle,เพิ่ม,สร้าง,ใหม่',
  circle(12, 12, 10, true), p('M12 8v8'), p('M8 12h8'));
add('circle-minus', 'minus,remove,subtract,less,circle,ลบ,ลด,เอาออก',
  circle(12, 12, 10, true), p('M8 12h8'));

// Square with the top-right corner left open and the pencil from `pencil` (scaled) writing across the gap.
{
  const s = 0.85, dx = 2, dy = -2;
  const T = ([x, y]) => `${f(12 + s * (x - 12) + dx)} ${f(12 + s * (y - 12) + dy)}`;
  const r = 2.25 * s;
  const pen = `M${T([4, 20])}L${T([5.24, 15.58])}L${T([16.2, 4.62])}A${f(r)} ${f(r)} 0 0 1 ${T([19.38, 7.8])}L${T([8.42, 18.76])}Z`;
  const tip = `M${T([14.08, 6.74])}L${T([17.26, 9.92])}`;
  add('square-pen', 'edit,write,compose,pen,note,แก้ไข,เขียน,สร้างโน้ต',
    p('M13 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-6', true), p(pen), p(tip));
}

const board = 'M9 4H8a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1';
add('clipboard', 'clipboard,copy,paste,tasks,board,คลิปบอร์ด,คัดลอก,วาง',
  p(board, true), rect(9, 2, 6, 4, 1.5));
add('clipboard-check', 'clipboard check,copied,done,checklist,approved,คัดลอกแล้ว,เสร็จ,รายการตรวจสอบ',
  p(board, true), rect(9, 2, 6, 4, 1.5), p('m8.5 14 2.5 2.5 4.5-5'));
add('list-filter', 'filter,list,sort,refine,search results,กรอง,รายการ,คัดกรอง',
  p('M4 6h16'), p('M7 12h10'), p('M10 18h4'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
