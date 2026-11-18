// Batch 6b worksheet: file-x/minus, folder-minus, user-x, calendar-plus/x, mail-plus, bell-plus, shield, cloud-upload.
//   node explore/batch-6b.mjs
import { writeFileSync } from 'node:fs';
import { f } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

// Badge contents (zone: circle at 18,18 r4.5); base shapes are cut at 6.5 from (18,18), as in batch 5b.
const PLUS = [p('M18 15v6'), p('M15 18h6')];
const MINUS = [p('M15 18h6')];
const X = [p('m16 16 4 4'), p('m20 16-4 4')];

// ── file-x / file-minus: file-plus's cut base and fold.
const FILE = [
  p('M20 11.75V9.12A1.5 1.5 0 0 0 19.56 8.06L14.44 2.94A1.5 1.5 0 0 0 13.38 2.5L8 2.5A4 4 0 0 0 4 6.5L4 17.5A4 4 0 0 0 8 21.5L12.5 21.5', true),
  p('M14 2.5V6.5a2 2 0 0 0 2 2h4'),
];
add('file-x', 'file x,delete file,remove document,invalid file,failed file,ลบไฟล์,ไฟล์ผิดพลาด,เอกสารไม่ถูกต้อง', ...FILE, ...X);
add('file-minus', 'file minus,remove file,delete document,subtract file,ลบไฟล์,เอาไฟล์ออก,นำเอกสารออก', ...FILE, ...MINUS);

// ── folder-minus: folder-plus's cut base.
add('folder-minus', 'folder minus,remove folder,delete directory,ลบโฟลเดอร์,เอาโฟลเดอร์ออก,นำแฟ้มออก',
  p('M21.5 12.5V10.5A3 3 0 0 0 18.5 7.5L11.48 7.5A1 1 0 0 1 10.7 7.12L9.3 5.38A1 1 0 0 0 8.52 5L5.5 5A3 3 0 0 0 2.5 8L2.5 16.5A3 3 0 0 0 5.5 19.5L11.7 19.5', true),
  ...MINUS);

// ── user-x: user-plus's base, x badge.
add('user-x', 'user x,remove user,block user,delete account,ลบผู้ใช้,บล็อกผู้ใช้,ปฏิเสธ',
  circle(10, 8, 4, true), p('M2.5 20.5A7.5 7.5 0 0 1 13.11 13.68', true), ...X);

// ── calendar-plus / calendar-x: calendar-check's body, mark inside (content exception, spec §6).
const CAL = [
  '<rect x="3.5" y="5" width="17" height="15.5" rx="4" data-duotone />',
  p('M8 3v4'), p('M16 3v4'), p('M3.5 10.5h17'),
];
add('calendar-plus', 'calendar plus,add event,new appointment,schedule event,เพิ่มนัดหมาย,เพิ่มกิจกรรม,สร้างนัด', ...CAL,
  p('M12 13.5v4'), p('M10 15.5h4'));
add('calendar-x', 'calendar x,cancel event,cancelled,remove appointment,ยกเลิกนัด,ยกเลิกกิจกรรม,ลบนัดหมาย', ...CAL,
  p('m10 13.5 4 4'), p('m14 13.5-4 4'));

// ── mail-plus: mail.svg cut at x 21.5 (y 12.5) and y 19.5 (x 11.7).
add('mail-plus', 'mail plus,compose,new email,add message,เขียนอีเมล,อีเมลใหม่,เพิ่มจดหมาย',
  p('M21.5 12.5V8.5A4 4 0 0 0 17.5 4.5L6.5 4.5A4 4 0 0 0 2.5 8.5L2.5 15.5A4 4 0 0 0 6.5 19.5L11.7 19.5', true),
  p('m6 8.5 4.65 3.45a2.25 2.25 0 0 0 2.7 0L18 8.5'), ...PLUS);

// ── bell-plus: bell.svg whole, plus inside the dome (spec §6 narrow-base exception: the flare and
// clapper both run into the badge zone, and cutting them left no recognisable bell).
add('bell-plus', 'bell plus,add alert,new notification,add reminder,เพิ่มแจ้งเตือน,สร้างการแจ้งเตือน,เพิ่มกระดิ่ง',
  p('M6 9.5C6 6.19 8.69 3.5 12 3.5C15.31 3.5 18 6.19 18 9.5C18 13 19 15 20.5 16.5H3.5C5 15 6 13 6 9.5Z', true),
  p('M10 19a2 2 0 0 0 4 0'), p('M12 8.5v5'), p('M9.5 11h5'));

// ── shield: shield-check with nothing inside.
add('shield', 'shield,security,protect,guard,defense,ความปลอดภัย,โล่,ป้องกัน',
  p('M12 3.25 18.5 5.6a1.5 1.5 0 0 1 1 1.4v4.5c0 4.6-3.2 8.2-7.5 9.75C7.7 19.7 4.5 16.1 4.5 11.5V7a1.5 1.5 0 0 1 1-1.4z', true));

// ── cloud-upload: cloud.svg with its base opened for an arrow that runs through it.
add('cloud-upload', 'cloud upload,upload to cloud,sync up,backup,save online,อัปโหลดขึ้นคลาวด์,สำรองข้อมูล,ซิงก์',
  p('M8.25 19.5H6.75A4.5 4.5 0 0 1 6 10.56A6 6 0 0 1 17.94 9.64A5 5 0 0 1 16.75 19.5H15.75', true),
  p('M12 21V11.5'), p('m9 14.5 3-3 3 3'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
