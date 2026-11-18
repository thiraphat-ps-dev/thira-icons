// Batch 5b worksheet: file/folder/image modifiers, bookmark-check, message-square, mail-open, bell-ring, map, compass, user-check/minus.
//   node explore/batch-5b.mjs
import { writeFileSync } from 'node:fs';
import { cornerMid, f, onCircle, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

// Badge contents (zone: circle at 18,18 r4.5). Base shapes are cut at 6.5 from (18,18), as in user-plus.
const PLUS = [p('M18 15v6'), p('M15 18h6')];
const CHECK = [p('m15 17.75 2.25 2.25 3.75-4')];
const MINUS = [p('M15 18h6')];

// ── file-plus: file.svg cut where the right edge (x 20) and bottom edge (y 21.5) meet the cut circle.
add('file-plus', 'file plus,new file,add file,create document,เพิ่มไฟล์,สร้างไฟล์,ไฟล์ใหม่',
  p('M20 11.75V9.12A1.5 1.5 0 0 0 19.56 8.06L14.44 2.94A1.5 1.5 0 0 0 13.38 2.5L8 2.5A4 4 0 0 0 4 6.5L4 17.5A4 4 0 0 0 8 21.5L12.5 21.5', true),
  p('M14 2.5V6.5a2 2 0 0 0 2 2h4'), ...PLUS);

// ── file-check: same cut, check in the badge.
add('file-check', 'file check,file done,verified file,approved document,ไฟล์ผ่าน,ตรวจแล้ว,เอกสารยืนยัน',
  p('M20 11.75V9.12A1.5 1.5 0 0 0 19.56 8.06L14.44 2.94A1.5 1.5 0 0 0 13.38 2.5L8 2.5A4 4 0 0 0 4 6.5L4 17.5A4 4 0 0 0 8 21.5L12.5 21.5', true),
  p('M14 2.5V6.5a2 2 0 0 0 2 2h4'), ...CHECK);

// ── folder-plus: folder.svg cut at x 21.5 (y 12.5) and y 19.5 (x 11.7).
add('folder-plus', 'folder plus,new folder,add folder,create directory,เพิ่มโฟลเดอร์,สร้างโฟลเดอร์,โฟลเดอร์ใหม่',
  p('M21.5 12.5V10.5A3 3 0 0 0 18.5 7.5L11.48 7.5A1 1 0 0 1 10.7 7.12L9.3 5.38A1 1 0 0 0 8.52 5L5.5 5A3 3 0 0 0 2.5 8L2.5 16.5A3 3 0 0 0 5.5 19.5L11.7 19.5', true),
  ...PLUS);

// ── image-plus: image.svg frame cut at x 21.5 (y 12.5) and y 20 (x 11.8); a short hill replaces the slope.
add('image-plus', 'image plus,add image,upload photo,add picture,เพิ่มรูปภาพ,เพิ่มรูป,อัปโหลดรูป',
  p('M21.5 12.5V8A4 4 0 0 0 17.5 4L6.5 4A4 4 0 0 0 2.5 8L2.5 16A4 4 0 0 0 6.5 20L11.8 20', true),
  circle(8.5, 9.5, 1.75), p('M3.5 18.5l3.6-3.6a2 2 0 0 1 2.8 0L12 17'), ...PLUS);

// ── bookmark-check: the full bookmark.svg with the check inside (spec §6 content exception, like
// calendar-check) — cutting the narrow bookmark for a badge left too little to recognise it.
add('bookmark-check', 'bookmark check,saved,saved item,confirmed bookmark,บันทึกแล้ว,บุ๊กมาร์กแล้ว,เก็บไว้แล้ว',
  p('M8.5 3L15.5 3A2.5 2.5 0 0 1 18 5.5L18 19A1 1 0 0 1 16.4 19.8L12.6 16.95A1 1 0 0 0 11.4 16.95L7.6 19.8A1 1 0 0 1 6 19L6 5.5A2.5 2.5 0 0 1 8.5 3Z', true),
  p('m9.25 10 2 2 3.5-4'));

// ── message-square: rounded speech box, tail at the bottom-left like message-circle.
add('message-square', 'message,chat,comment,speech bubble,conversation,ข้อความ,แชท,ความคิดเห็น,กล่องข้อความ',
  p(roundedPolygon([[3, 3], [21, 3], [21, 17], [7, 17], [3, 21]], [4, 4, 4, 1, 1]), true));

// ── mail-open: envelope with the flap open (pointed top), and the front flap edge as a V inside.
add('mail-open', 'mail open,read email,opened letter,inbox,เปิดอีเมล,อ่านแล้ว,จดหมายที่เปิดแล้ว',
  p(roundedPolygon([[12, 3], [21.5, 10], [21.5, 20], [2.5, 20], [2.5, 10]], [2, 2.5, 4, 4, 2.5]), true),
  p('m6.5 12.5 4.15 2.95a2.25 2.25 0 0 0 2.7 0L17.5 12.5'));

// ── bell-ring: bell.svg unchanged, plus a sound arc each side (concentric with the dome, r 10, 50°–80°).
{
  const [cx, cy, r] = [12, 9.5, 10];
  const arc = (a, b) => `M${pt(onCircle(cx, cy, r, a))}A${r} ${r} 0 0 ${a < b ? 1 : 0} ${pt(onCircle(cx, cy, r, b))}`;
  add('bell-ring', 'bell ring,ringing,notification,alarm,new alert,แจ้งเตือน,กระดิ่งดัง,เตือนใหม่',
    p('M6 9.5C6 6.19 8.69 3.5 12 3.5C15.31 3.5 18 6.19 18 9.5C18 13 19 15 20.5 16.5H3.5C5 15 6 13 6 9.5Z', true),
    p('M10 19a2 2 0 0 0 4 0'), p(arc(80, 50)), p(arc(310, 280)));
}

// ── map: folded map, three panels; the folds meet the outline at its rounded vertices.
{
  const pts = [[2.5, 7], [9, 4], [15, 7], [21.5, 4], [21.5, 17], [15, 20], [9, 17], [2.5, 20]];
  const rs = [3, 1.5, 1.5, 2.5, 3, 1.5, 1.5, 2.5];
  const a = cornerMid(pts, 1, 1.5), b = cornerMid(pts, 6, 1.5);
  const c = cornerMid(pts, 2, 1.5), d = cornerMid(pts, 5, 1.5);
  add('map', 'map,folded map,directions,navigate,area,แผนที่,นำทาง,เส้นทาง',
    p(roundedPolygon(pts, rs), true), p(`M${pt(a)}L${pt(b)}`), p(`M${pt(c)}L${pt(d)}`));
}

// ── compass: globe-sized ring and a diamond needle on the NE–SW diagonal.
{
  const o = 12, L = 4.24, w = 1.77;
  const pts = [[o + L, o - L], [o + w, o + w], [o - L, o + L], [o - w, o - w]];
  add('compass', 'compass,direction,navigate,explore,north,เข็มทิศ,ทิศทาง,สำรวจ',
    circle(12, 12, 10, true), p(roundedPolygon(pts, [1, 0.75, 1, 0.75])));
}

// ── user-check / user-minus: user-plus's base, other badge.
const USER = [circle(10, 8, 4, true), p('M2.5 20.5A7.5 7.5 0 0 1 13.11 13.68', true)];
add('user-check', 'user check,verified user,approved,confirmed account,ผู้ใช้ยืนยันแล้ว,อนุมัติ,ตรวจสอบแล้ว', ...USER, ...CHECK);
add('user-minus', 'user minus,remove user,delete member,unfollow,ลบผู้ใช้,นำผู้ใช้ออก,เอาออก', ...USER, ...MINUS);

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
