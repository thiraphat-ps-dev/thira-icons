// Batch 14c worksheet: meh, laugh, angry, party-popper, handshake, hand-heart, user-round, users-round, ghost, smile-plus.
//   node explore/batch-14c.mjs
import { writeFileSync } from 'node:fs';
import { arcPieces, f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, r, duo = false) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const dot = (x, y) => p(`M${f(x)} ${f(y)}h.01`);
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

// ── faces: smile.svg's ring and eyes.
const eyes = [dot(9, 9.5), dot(15, 9.5)];
add('meh', 'meh,neutral,indifferent,emoji,face,so-so,เฉยๆ,ไม่รู้สึก,อิโมจิ',
  circle(12, 12, 10, true), ...eyes, p('M8.5 15h7'));

add('laugh', 'laugh,lol,haha,funny,emoji,face,joy,หัวเราะ,ขำ,อิโมจิ',
  circle(12, 12, 10, true),
  p('M7.75 10.25a1.25 1.25 0 0 1 2.5 0'), p('M13.75 10.25a1.25 1.25 0 0 1 2.5 0'),
  p('M7.5 13.5h9a4.5 4.5 0 0 1-9 0z'));

add('angry', 'angry,mad,rage,upset,emoji,face,furious,โกรธ,โมโห,อิโมจิ',
  circle(12, 12, 10, true),
  p('M7.25 7.25L10.5 9'), p('M16.75 7.25L13.5 9'),
  dot(9, 11.75), dot(15, 11.75),
  p('M8.5 17a4 4 0 0 1 7 0'));

// ── smile-plus: smile.svg, ring and mouth cut 6.5 from the badge centre (18,18), plus badge.
{
  const keep = (q) => Math.hypot(q[0] - 18, q[1] - 18) >= 6.5;
  const ring = arcPieces(12, 12, 10, 135, 495, keep).map((d) => p(d, true));
  // mouth: smile.svg's arc (centre 12,11, r5), from its left end round to where the cut starts
  const mouth = arcPieces(12, 11, 5, 180, 233.13, keep).map((d) => p(d));
  add('smile-plus', 'smile plus,add reaction,add emoji,react,new emoji,เพิ่มอิโมจิ,รีแอคชัน,เพิ่มอารมณ์',
    ...ring, ...eyes, ...mouth, p('M18 15v6'), p('M15 18h6'));
}

// ── party-popper: cone on the 45° diagonal, rim at its open end, three confetti marks.
add('party-popper', 'party popper,celebrate,celebration,party,congratulations,confetti,ฉลอง,ปาร์ตี้,แสดงความยินดี',
  p(roundedPolygon([[3.5, 20.5], [9.8, 7.8], [16.2, 14.2]], [1.5, 2, 2]), true),
  p('M16 8l3-3'), dot(12, 4), dot(20.5, 12));

// handshake: dropped in review (read as a wrapped sweet at 16px); to be redrawn from scratch later.

// ── hand-heart: heart.svg scaled onto an open palm.
{
  const s = 0.55, ox = 12 - 12 * s, oy = 8 - 11.5 * s; // heart centre (12, 11.5 in source) -> (12, 8)
  const P = ([x, y]) => pt([x * s + ox, y * s + oy]);
  const r = 4.5 * s;
  const heart = `M${P([12, 20.5])}C${P([9, 18.5])} ${P([3, 14])} ${P([3, 9])}a${f(r)} ${f(r)} 0 0 1 ${f(9 * s)} 0 ${f(r)} ${f(r)} 0 0 1 ${f(9 * s)} 0c0 ${f(5 * s)} ${f(-6 * s)} ${f(9.5 * s)} ${f(-9 * s)} ${f(11.5 * s)}z`;
  add('hand-heart', 'hand heart,give love,charity,donate,care,kindness,volunteer,ให้,ใจดี,บริจาค,การกุศล',
    p(heart, true),
    rect(2.5, 14.5, 3, 7, 1.5),
    p('M5.5 16.5l3-1.5h5.5a1.75 1.75 0 0 1 0 3.5H11'),
    p('M5.5 19.5l5 1.5h4.5l6-3.25a1.5 1.5 0 0 0-1.6-2.5l-4 1.75'));
}

// ── user-round: user.svg's head, shoulders closed into a rounded bust.
const bust = (x0, w, y, r, top) => `M${x0} ${y}a${w / 2} ${w / 2} 0 0 1 ${w} 0v.5a1.5 1.5 0 0 1-1.5 1.5H${f(x0 + 1.5)}A1.5 1.5 0 0 1 ${x0} ${f(y + 0.5)}z`;
add('user-round', 'user round,person,profile,avatar,account,member,ผู้ใช้,โปรไฟล์,สมาชิก',
  circle(12, 8, 4, true), p(bust(4.5, 15, 20), true));

// ── users-round: user-round at users.svg's size, plus the second figure behind.
add('users-round', 'users round,people,team,group,community,members,ผู้คน,ทีม,กลุ่ม,ชุมชน',
  circle(9, 8, 3.75, true), p(bust(2.5, 13, 20), true),
  p('M15 4.25a3.75 3.75 0 0 1 0 7.5'), p('M16.5 14.18a6.5 6.5 0 0 1 5 6.32'));

// ── ghost: dome, straight sides, three scallops along the bottom, two eyes.
add('ghost', 'ghost,spooky,halloween,boo,phantom,game over,ผี,ฮาโลวีน,น่ากลัว',
  p('M4.5 9.5a7.5 7.5 0 0 1 15 0V19.5a3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-5 0z', true),
  dot(9.25, 10), dot(14.75, 10));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
