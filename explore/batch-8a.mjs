// Batch 8a worksheet: panel-left, panel-right, table, kanban, square-check, toggle-left, toggle-right, circle-dot, maximize, minimize.
//   node explore/batch-8a.mjs
import { writeFileSync } from 'node:fs';
import { f } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;

add('panel-left', 'panel,sidebar,left,layout,drawer,pane,แผง,แถบด้านข้าง,เลย์เอาต์',
  rect(2.5, 4, 19, 16, 4, true), p('M9 4v16'));
add('panel-right', 'panel,sidebar,right,layout,drawer,pane,แผง,แถบด้านข้าง,เลย์เอาต์',
  rect(2.5, 4, 19, 16, 4, true), p('M15 4v16'));
add('table', 'table,grid,spreadsheet,data,rows,columns,ตาราง,แถว,คอลัมน์,ข้อมูล',
  rect(3, 3, 18, 18, 4, true), p('M3 9h18'), p('M3 15h18'), p('M12 9v12'));
add('kanban', 'kanban,board,columns,cards,tasks,workflow,คัมบัง,บอร์ด,งาน,คอลัมน์',
  rect(3, 3, 18, 18, 4, true), p('M8 7v10'), p('M12 7v7'), p('M16 7v4'));
add('square-check', 'checkbox,check,square,done,select,tick,ช่องทำเครื่องหมาย,เลือก,เสร็จ,ถูก',
  rect(3, 3, 18, 18, 4, true), p('m7.5 12.5 3.5 3.5 5.5-6'));
add('toggle-left', 'toggle,switch,off,disabled,setting,สวิตช์,ปิด,ตั้งค่า',
  p('M9 5h6a7 7 0 0 1 0 14H9A7 7 0 0 1 9 5z', true), circle(9, 12, 3));
add('toggle-right', 'toggle,switch,on,enabled,setting,สวิตช์,เปิด,ตั้งค่า',
  p('M9 5h6a7 7 0 0 1 0 14H9A7 7 0 0 1 9 5z', true), circle(15, 12, 3));
add('circle-dot', 'radio,dot,select,record,option,active,ปุ่มตัวเลือก,จุด,เลือก,บันทึก',
  circle(12, 12, 10, true), circle(12, 12, 1.5));
add('maximize', 'maximize,fullscreen,expand,enlarge,corners,ขยาย,เต็มจอ,ขยายเต็ม',
  p('M3 9V6a3 3 0 0 1 3-3h3'), p('M15 3h3a3 3 0 0 1 3 3v3'), p('M3 15v3a3 3 0 0 0 3 3h3'), p('M21 15v3a3 3 0 0 1-3 3h-3'));
add('minimize', 'minimize,shrink,exit fullscreen,collapse,corners,ย่อ,ออกจากเต็มจอ,ย่อขนาด',
  p('M9 3v3a3 3 0 0 1-3 3H3'), p('M15 3v3a3 3 0 0 0 3 3h3'), p('M3 15h3a3 3 0 0 1 3 3v3'), p('M21 15h-3a3 3 0 0 0-3 3v3'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
