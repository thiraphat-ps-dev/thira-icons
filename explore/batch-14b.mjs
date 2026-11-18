// Batch 14b worksheet: layout icons.
//   node explore/batch-14b.mjs
import { writeFileSync } from 'node:fs';
import { f } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;

// sliders-horizontal rotated 90 degrees clockwise: (x, y) -> (24 - y, x)
const rot = (x, y) => [24 - y, x];
const hseg = (x, y, len) => { const [a, b] = rot(x, y); return p(`M${f(a)} ${f(b)}v${f(len)}`); };
const hknob = (x, y) => { const [a, b] = rot(x, y); return circle(a, b, 2, true); };
add('sliders-vertical', 'settings,adjust,controls,sliders,equalizer,mixer,options,ปรับ,ตั้งค่า,ตัวเลือก',
  hseg(4, 6, 9), hseg(17, 6, 3), hknob(15, 6),
  hseg(4, 12, 2), hseg(10, 12, 10), hknob(8, 12),
  hseg(4, 18, 8), hseg(16, 18, 4), hknob(14, 18));

const chk = (y) => p(`M3.5 ${f(y)}l1.75 1.75L8.5 ${f(y - 2)}`);
add('list-checks', 'list,checklist,tasks,todo,done,items,รายการ,งาน,เช็คลิสต์,เสร็จ',
  chk(6.25), chk(12.25), chk(18.25),
  p('M12 6h8'), p('M12 12h8'), p('M12 18h8'));

add('layout-list', 'layout,list,rows,items,cards,view,เลย์เอาต์,รายการ,แถว,มุมมอง',
  rect(4, 4, 6, 6, 2, true), p('M14 7h6'),
  rect(4, 14, 6, 6, 2, true), p('M14 17h6'));

const win = rect(2.5, 4, 19, 16, 4, true);
const tags = 'layout,panel,split,divide,pane,เลย์เอาต์,แผง,แบ่ง';
add('columns-2', 'columns,two,split,layout,divide,vertical,คอลัมน์,แบ่ง,เลย์เอาต์', win, p('M12 4v16'));
add('rows-2', 'rows,two,split,layout,divide,horizontal,แถว,แบ่ง,เลย์เอาต์', win, p('M2.5 12h19'));
add('panel-top', 'panel,header,top,layout,pane,toolbar,แผง,ส่วนหัว,เลย์เอาต์', win, p('M2.5 9h19'));
add('panel-bottom', 'panel,footer,bottom,layout,pane,drawer,แผง,ส่วนท้าย,เลย์เอาต์', win, p('M2.5 15h19'));

// grip-vertical rotated 90 degrees clockwise
const g = [[9, 5], [15, 5], [9, 12], [15, 12], [9, 19], [15, 19]].map(([x, y]) => rot(x, y));
add('grip-horizontal', 'grip,drag,handle,move,reorder,resize,ลาก,ย้าย,จัดลำดับ',
  ...g.map(([x, y]) => circle(x, y, 1)));

add('text-cursor', 'text,cursor,caret,i-beam,input,edit,เคอร์เซอร์,ข้อความ,พิมพ์,แก้ไข',
  p('M9 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3'), p('M15 3a3 3 0 0 0-3 3'), p('M15 21a3 3 0 0 1-3-3'));

add('separator-horizontal', 'separator,divider,split,line,break,ตัวแบ่ง,เส้นคั่น,แบ่ง',
  p('M4 12h16'), p('m8.5 8 3.5-3.5L15.5 8'), p('m8.5 16 3.5 3.5 3.5-3.5'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
