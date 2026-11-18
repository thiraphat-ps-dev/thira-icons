// Batch 11b worksheet: lock-keyhole, shield-x, shield-plus, scan, scan-line, scan-face, siren, alarm-clock, hourglass, bell-dot.
//   node explore/batch-11b.mjs
import { writeFileSync } from 'node:fs';
import { f, onCircle, cubicAt, splitCubic } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;
const cub = ([, a, b, c]) => `C${pt(a)} ${pt(b)} ${pt(c)}`;

// ── lock-keyhole: lock.svg with a keyhole (circle + slot) instead of the single dash.
add('lock-keyhole', 'lock keyhole,secure,private,password,vault,ล็อก,รูกุญแจ,ปลอดภัย,รหัสผ่าน',
  rect(4, 10.5, 16, 10.5, 3, true), p('M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3'),
  circle(12, 14.75, 1), p('M12 16.5v1.5'));

// ── shield-x / shield-plus: shield-check's shield, mark inside (content exception).
const SHIELD = p('M12 3.25 18.5 5.6a1.5 1.5 0 0 1 1 1.4v4.5c0 4.6-3.2 8.2-7.5 9.75C7.7 19.7 4.5 16.1 4.5 11.5V7a1.5 1.5 0 0 1 1-1.4z', true);
add('shield-x', 'shield x,security alert,threat,blocked,unsafe,vulnerable,ไม่ปลอดภัย,ภัยคุกคาม,ถูกบล็อก,โล่',
  SHIELD, p('m9.75 10 4.5 4.5'), p('m14.25 10-4.5 4.5'));
add('shield-plus', 'shield plus,add protection,security boost,add guard,เพิ่มความปลอดภัย,เสริมโล่,ป้องกันเพิ่ม',
  SHIELD, p('M12 9.25v5.5'), p('M9.25 12h5.5'));

// ── scan family: four corner brackets, inset 1 from maximize's corners, r3.
const SCAN = [
  p('M4 9V7a3 3 0 0 1 3-3h2'), p('M15 4h2a3 3 0 0 1 3 3v2'),
  p('M4 15v2a3 3 0 0 0 3 3h2'), p('M20 15v2a3 3 0 0 1-3 3h-2'),
];
add('scan', 'scan,scanner,frame,focus,capture,qr scanner,สแกน,โฟกัส,จับภาพ', ...SCAN);
add('scan-line', 'scan line,barcode scan,scanning,laser,reading,สแกนบาร์โค้ด,เส้นสแกน,อ่านรหัส', ...SCAN, p('M7.5 12h9'));
add('scan-face', 'scan face,face id,face recognition,biometric,facial scan,สแกนใบหน้า,จดจำใบหน้า,ไบโอเมตริก', ...SCAN,
  p('M9.5 10h.01'), p('M14.5 10h.01'), p('M9.5 14a3.5 3.5 0 0 0 5 0'));

// ── siren: dome on a base, rays above (sun's ray style).
const sirenRays = [0, -50, 50].map((a) => {
  const [x1, y1] = onCircle(12, 15, 8.75, a);
  const [x2, y2] = onCircle(12, 15, 11.25, a);
  return p(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`);
});
add('siren', 'siren,alarm,emergency,police,warning light,beacon,ไซเรน,ฉุกเฉิน,สัญญาณเตือน,ไฟฉุกเฉิน',
  p('M7 17v-2a5 5 0 0 1 10 0v2z', true), rect(4, 17, 16, 4, 1.5), ...sirenRays);

// ── alarm-clock: clock face, bell ears (arcs concentric with the face), two legs.
const [cx, cy, fr] = [12, 13.5, 6.75];
const arc = (r, a, b) => `M${pt(onCircle(cx, cy, r, a))}A${f(r)} ${f(r)} 0 0 1 ${pt(onCircle(cx, cy, r, b))}`;
const leg = (a) => `M${pt(onCircle(cx, cy, fr, a))}L${pt(onCircle(cx, cy, fr + 3, a))}`;
add('alarm-clock', 'alarm clock,alarm,wake up,reminder,time,morning,นาฬิกาปลุก,ปลุก,ตั้งปลุก,เวลา',
  circle(cx, cy, fr, true), p('M12 10.5v3.25l2.25 1.5'),
  p(arc(10.5, 295, 335)), p(arc(10.5, 25, 65)), p(leg(135)), p(leg(225)));

// ── hourglass: two bars, two rounded bulbs meeting at the middle.
add('hourglass', 'hourglass,wait,loading,time,sand timer,pending,นาฬิกาทราย,รอ,กำลังโหลด,เวลา',
  p('M7.5 3h9v2.5c0 3-4.5 5-4.5 6.5s4.5 3.5 4.5 6.5V21h-9v-2.5c0-3 4.5-5 4.5-6.5S7.5 8.5 7.5 5.5z', true),
  p('M5.5 3h13'), p('M5.5 21h13'));

// ── bell-dot: bell.svg, cut back 4.5 from the dot centre (dot zone r2.5 + 2).
const D = [18, 6], CUT = 4.5;
const dist = (q) => Math.hypot(q[0] - D[0], q[1] - D[1]);
const crossing = (c, inside) => { // t where dist crosses CUT; inside = dist is < CUT at t=1
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    const isIn = dist(cubicAt(c, m)) < CUT;
    if (isIn === inside) hi = m; else lo = m;
  }
  return lo;
};
const c2 = [[12, 3.5], [15.31, 3.5], [18, 6.19], [18, 9.5]];
const c3 = [[18, 9.5], [18, 13], [19, 15], [20.5, 16.5]];
const ta = crossing(c2, true);          // c2 leaves outside, ends inside
const tb = (() => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (dist(cubicAt(c3, m)) < CUT) lo = m; else hi = m; } return hi; })();
const right = splitCubic(c3, tb)[1];
const left = splitCubic(c2, ta)[0];
const bellD = `M${pt(right[0])}${cub(right)}H3.5C5 15 6 13 6 9.5C6 6.19 8.69 3.5 12 3.5${cub(left)}`;
add('bell-dot', 'bell dot,new notification,unread,notification badge,alert,แจ้งเตือนใหม่,ยังไม่อ่าน,จุดแจ้งเตือน',
  p(bellD, true), p('M10 19a2 2 0 0 0 4 0'), circle(D[0], D[1], 1.5));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
