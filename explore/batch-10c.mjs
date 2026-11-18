// Batch 10c worksheet: heart-pulse, stethoscope, user-cog, accessibility, baby, paw-print, share, unlink, sun-moon, gamepad-2.
//   node explore/batch-10c.mjs
import { writeFileSync } from 'node:fs';
import { f, rays, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const ellipse = (cx, cy, rx, ry, duo = false) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}"${duo ? ' data-duotone' : ''} />`;
const dot = (x, y) => p(`M${f(x)} ${f(y)}h.01`);

// ── heart-pulse: heart.svg exactly, pulse running inside it.
add('heart-pulse', 'heart pulse,heartbeat,health,cardio,vital signs,สุขภาพ,ชีพจร,หัวใจเต้น',
  p('M12 20.5C9 18.5 3 14 3 9a4.5 4.5 0 0 1 9 0 4.5 4.5 0 0 1 9 0c0 5-6 9.5-9 11.5z', true),
  p('M7 13.25h2.5l1.75-2.5 2 5 1.75-2.5H17'));

// ── stethoscope: U of earpiece tubes, a long tube sweeping right, a round chest piece.
add('stethoscope', 'stethoscope,doctor,medical,health,checkup,clinic,หูฟังแพทย์,หมอ,ตรวจสุขภาพ',
  p('M4.5 3v5a4 4 0 0 0 8 0V3'),
  p('M8.5 12v3a5 5 0 0 0 10 0v-.75'),
  circle(18.5, 12, 2.25, true));

// ── user-cog: user-plus's base, a small gear (ring + 6 teeth) in the badge zone.
const GX = 18, GY = 18;
add('user-cog', 'user cog,user settings,account settings,manage user,profile settings,ตั้งค่าผู้ใช้,จัดการบัญชี,ตั้งค่าโปรไฟล์',
  circle(10, 8, 4, true), p('M2.5 20.5A7.5 7.5 0 0 1 13.11 13.68', true),
  circle(GX, GY, 2),
  ...rays(GX, GY, 2.5, 3.5, 6, 0).map((d) => p(d)));

// ── accessibility: ring, head dot, arms out, body and legs.
add('accessibility', 'accessibility,a11y,accessible,disability,inclusive,การเข้าถึง,ผู้พิการ,ความช่วยเหลือ',
  circle(12, 12, 10, true),
  circle(12, 6.75, 1),
  p('M7 10.75h10'),
  p('M12 10.75V13.5'),
  p('M9.75 17.5 12 13.5l2.25 4'));

// ── baby: round face with a curl, two eyes and a smile.
add('baby', 'baby,infant,child,newborn,kid,เด็กทารก,ทารก,ลูก',
  circle(12, 13.5, 8.5, true),
  p('M12 5V4.5a2 2 0 0 1 2-2'),
  dot(9, 12.5), dot(15, 12.5),
  p('M9.5 16a3.5 3.5 0 0 0 5 0'));

// ── paw-print: four toes and a pad.
add('paw-print', 'paw print,pet,animal,dog,cat,footprint,รอยเท้าสัตว์,สัตว์เลี้ยง,อุ้งเท้า',
  ellipse(4.5, 11.25, 1.25, 2, true), ellipse(8.75, 6, 1.25, 2, true),
  ellipse(15.25, 6, 1.25, 2, true), ellipse(19.5, 11.25, 1.25, 2, true),
  ellipse(12, 16.75, 5, 4, true));

// ── share: open box with an arrow rising out of it (share sheet).
add('share', 'share,share sheet,send,export,forward,แชร์,ส่งต่อ,แบ่งปัน',
  p('M8 11.5H7a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-4a3 3 0 0 0-3-3h-1', true),
  p('M12 15V3.5'),
  p('m8.5 7 3.5-3.5L15.5 7'));

// ── unlink: link.svg's two hooks, bar gone, two break ticks between them.
add('unlink', 'unlink,broken link,disconnect,detach,remove link,ยกเลิกลิงก์,ลิงก์เสีย,ตัดการเชื่อมต่อ',
  p('M9 17H7A5 5 0 0 1 7 7h2'),
  p('M15 7h2a5 5 0 0 1 0 10h-2'),
  p('M12 3.5v2'), p('M12 18.5v2'));

// ── sun-moon: half sun (5 rays) top-left, moon.svg's crescent scaled into the bottom-right.
const MOON = [[20, 14.5], [9.5, 4]];
const s = 0.6, ox = 22 - 20.45 * s, oy = 21.5 - 20.5 * s; // fitted so the crescent's far edges reach 22
const mp = ([x, y]) => `${f(x * s + ox)} ${f(y * s + oy)}`;
const SX = 8.25, SY = 8.25;
add('sun-moon', 'sun moon,theme,auto theme,day night,light dark,system theme,ธีมอัตโนมัติ,กลางวันกลางคืน,สว่างมืด',
  circle(SX, SY, 2.25, true),
  ...[270, 315, 0, 45, 225].flatMap((a) => rays(SX, SY, 4.75, 5.75, 1, a)).map((d) => p(d)),
  p(`M${mp(MOON[0])}A${f(8.73 * s)} ${f(8.73 * s)} 0 1 1 ${mp(MOON[1])}A${f(8 * s)} ${f(8 * s)} 0 0 0 ${mp(MOON[0])}Z`, true));

// ── gamepad-2: controller silhouette, d-pad left, two buttons right.
add('gamepad-2', 'gamepad,controller,game,play,console,joystick,เกม,จอยเกม,คอนโทรลเลอร์',
  p(roundedPolygon([[3.5, 6.5], [20.5, 6.5], [22, 16.5], [19, 19.5], [15.5, 16], [8.5, 16], [5, 19.5], [2, 16.5]], [3, 3, 2, 2, 2, 2, 2, 2]), true),
  p('M5.5 11.5h4'), p('M7.5 9.5v4'),
  dot(16, 12.5), dot(18.5, 10));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
