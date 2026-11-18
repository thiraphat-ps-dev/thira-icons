// Batch 4 worksheet: misc and the extended Thai set. Writes icons/core/*.svg and icons/thai/*.svg.
//   node explore/batch-4.mjs
import { writeFileSync } from 'node:fs';
import { arcPieces, circleIntersect, distToLine, f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const addThai = (name, tags, ...body) => (icons[name] = { dir: 'thai', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

// ── Misc ─────────────────────────────────────────────────────────────────────────────────
{
  // Five-point star; inner radius 0.45 of the outer, tips rounded a little.
  const cx = 12, cy = 12.75, R = 10, r = 4.5;
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = ((i * 36) * Math.PI) / 180;
    const rad = i % 2 === 0 ? R : r;
    return [cx + rad * Math.sin(a), cy - rad * Math.cos(a)];
  });
  add('star', 'star,favorite,rating,bookmark,highlight,ดาว,รายการโปรด,คะแนน',
    p(roundedPolygon(pts, pts.map((_, i) => (i % 2 === 0 ? 1.5 : 0.5))), true));
}
add('heart', 'heart,like,love,favorite,health,หัวใจ,ถูกใจ,ชอบ',
  p('M12 20.5C9 18.5 3 14 3 9a4.5 4.5 0 0 1 9 0 4.5 4.5 0 0 1 9 0c0 5-6 9.5-9 11.5z', true));
add('thumbs-up', 'like,thumbs up,approve,good,agree,ถูกใจ,เห็นด้วย,ดี',
  p('M6.5 10.5 10 3.5a2.5 2.5 0 0 1 3.5 2.6L13 10h5.6a2.5 2.5 0 0 1 2.4 3.1l-1.6 6A2.5 2.5 0 0 1 17 21H6.5z', true),
  p('M6.5 10.5H4a1.5 1.5 0 0 0-1.5 1.5v7.5A1.5 1.5 0 0 0 4 21h2.5'));
add('sparkles', 'sparkles,ai,magic,new,shine,special,ประกาย,เวทมนตร์,ใหม่',
  p('M10 6.5c.7 5.1 1.9 6.3 7 7-5.1.7-6.3 1.9-7 7-.7-5.1-1.9-6.3-7-7 5.1-.7 6.3-1.9 7-7z', true), p('M18.5 3v5'), p('M16 5.5h5'));
add('zap', 'zap,lightning,power,energy,fast,flash,สายฟ้า,พลังงาน,เร็ว',
  p(roundedPolygon([[13.5, 2.5], [4.5, 13.5], [11.5, 13.5], [10.5, 21.5], [19.5, 10.5], [12.5, 10.5]], 1), true));
add('lightbulb', 'idea,lightbulb,tip,hint,insight,ไอเดีย,หลอดไฟ,คำแนะนำ',
  p('M9 18v-1.5c0-1-.6-1.8-1.3-2.6a6.5 6.5 0 1 1 8.6 0c-.7.8-1.3 1.6-1.3 2.6V18z', true), p('M9.5 21h5'));
add('flag', 'flag,report,mark,milestone,goal,ธง,รายงาน,เป้าหมาย',
  p('M5 21.5V3.5'), p('M5 4.5c4.5-2.5 9.5 2.5 14 0v9c-4.5 2.5-9.5-2.5-14 0', true));
// Gaps of 4 between panels: 1.75 strokes leave 2.25 of clear space (spec §5).
add('layout-dashboard', 'dashboard,layout,panels,overview,widgets,แดชบอร์ด,ภาพรวม',
  rect(3, 3, 7, 9, 2, true), rect(14, 3, 7, 5, 1.5, true), rect(14, 12, 7, 9, 2, true), rect(3, 16, 7, 5, 1.5, true));
add('list', 'list,items,bullets,menu,lines,รายการ,ลิสต์',
  p('M4 6h.01'), p('M4 12h.01'), p('M4 18h.01'), p('M8.5 6H20'), p('M8.5 12H20'), p('M8.5 18H20'));
add('layout-grid', 'grid,layout,gallery,tiles,apps,ตาราง,กริด,แอป',
  rect(3, 3, 7, 7, 2, true), rect(14, 3, 7, 7, 2, true), rect(3, 14, 7, 7, 2, true), rect(14, 14, 7, 7, 2, true));
add('code', 'code,developer,html,programming,source,โค้ด,โปรแกรม,นักพัฒนา',
  p('m8 6-5.5 6L8 18'), p('m16 6 5.5 6-5.5 6'), p('m13.5 4-3 16'));
add('terminal', 'terminal,console,command line,shell,cli,เทอร์มินัล,คอมมานด์ไลน์',
  rect(2.5, 4, 19, 16, 4, true), p('m7 9 3 3-3 3'), p('M12.5 15H17'));
add('git-branch', 'git,branch,version control,fork,source,สาขา,เวอร์ชัน',
  circle(6, 18.5, 2.5, true), circle(18, 6, 2.5, true), p('M6 3v13'), p('M15.5 6A9.5 9.5 0 0 0 6 15.5'));
{
  // Cloud: three circles joined at their intersections, on a flat base.
  const C1 = [[6.75, 15], 4.5], C2 = [[12, 10.5], 6], C3 = [[16.75, 14.5], 5];
  const base = 19.5;
  const i12 = circleIntersect(C1[0], C1[1], C2[0], C2[1]).sort((a, b) => a[1] - b[1])[0]; // upper one
  const i23 = circleIntersect(C2[0], C2[1], C3[0], C3[1]).sort((a, b) => a[1] - b[1])[0];
  const bottomOf = ([c, r]) => [c[0], c[1] + r];
  add('cloud', 'cloud,weather,storage,sync,online,คลาวด์,เมฆ,ออนไลน์',
    p(`M${pt([C1[0][0], base])}A${C1[1]} ${C1[1]} 0 0 1 ${pt(i12)}A${C2[1]} ${C2[1]} 0 0 1 ${pt(i23)}` +
      `A${C3[1]} ${C3[1]} 0 0 1 ${pt(bottomOf(C3))}Z`, true));
}
{
  // Wi-Fi: three arcs around (12, 21) and a dot; wifi-off cuts them where the slash passes.
  const ARCS = [[5, 45], [10, 45], [14, 40]];
  const dot = 'M12 19.5h.01';
  add('wifi', 'wifi,wireless,internet,network,signal,ไวไฟ,อินเทอร์เน็ต,สัญญาณ',
    ...ARCS.flatMap(([r, span]) => arcPieces(12, 21, r, 360 - span, 360 + span, () => true).map((d) => p(d))), p(dot));
  const a = [3.5, 3.5], b = [20.5, 20.5];
  const clear = (q) => distToLine(q, a, b) >= 2.75;
  add('wifi-off', 'wifi off,offline,no internet,disconnected,ออฟไลน์,ไม่มีอินเทอร์เน็ต,ขาดการเชื่อมต่อ',
    ...ARCS.flatMap(([r, span]) => arcPieces(12, 21, r, 360 - span, 360 + span, clear).map((d) => p(d))),
    p(dot), p(`M${pt(a)}L${pt(b)}`));
}

// ── Thai (extended) ──────────────────────────────────────────────────────────────────────
// QR payment: three finder squares and a small ฿ where the fourth corner would be.
addThai('qr-payment', 'qr,qr code,payment,scan to pay,thai qr,สแกนจ่าย,คิวอาร์,ชำระเงิน',
  rect(3, 3, 7, 7, 2, true), rect(14, 3, 7, 7, 2, true), rect(3, 14, 7, 7, 2, true),
  p('M6.5 6.5h.01'), p('M17.5 6.5h.01'), p('M6.5 17.5h.01'),
  p('M15 14.5h2.5a1.5 1.5 0 0 1 0 3H15z'), p('M15 17.5h3a1.5 1.5 0 0 1 0 3H15z'), p('M16.75 13.5v8'));
// Buddhist Era calendar: the letter พ (for พ.ศ.) fills the body; no header line, so it can be large.
addThai('calendar-thai', 'buddhist era,thai calendar,be,date,พ.ศ.,ปฏิทินไทย,พุทธศักราช,วันที่',
  rect(3.5, 5, 17, 15.5, 4, true), p('M8 3v4'), p('M16 3v4'), p('M8 11.25a1.25 1.25 0 1 1 0 .01V17l4-4 4 4v-6'));
// Wai: two palms pressed together (fingertips up), thumbs, and forearms meeting at the wrists.
addThai('wai', 'wai,greeting,thanks,respect,pray,hello,ไหว้,สวัสดี,ขอบคุณ',
  p('M12 3c-1.2 0-1.8 1-2 2.2L9 12'), p('M12 3c1.2 0 1.8 1 2 2.2L15 12'), p('M12 3v11'),
  p('M9 12l-2-1.5a1.4 1.4 0 0 0-2 1.8l2.6 4.2L10 18.5'), p('M15 12l2-1.5a1.4 1.4 0 0 1 2 1.8l-2.6 4.2L14 18.5'),
  p('M10 18.5 8 21.5'), p('M14 18.5l2 3'), p('M10 18.5h4'));
// Elephant, face on: big ears, domed head, trunk curling at the tip. Reads at 16 px, unlike a side view.
addThai('elephant', 'elephant,thailand,animal,wildlife,strong,ช้าง,สัตว์,ประเทศไทย',
  p('M8.6 6.6C6 4.8 2.5 5.8 2.5 9.5c0 3.4 2.6 5.6 6 5.4'), p('M15.4 6.6c2.6-1.8 6.1-.8 6.1 2.9 0 3.4-2.6 5.6-6 5.4'),
  p('M8 12.5V9a4 4 0 0 1 8 0v3.5c0 1.6-1 2.5-2 3V19a2 2 0 0 0 2 2'), p('M8 12.5c0 1.6 1 2.5 2 3V19'),
  p('M10.25 9.25h.01'), p('M13.75 9.25h.01'));
// Spirit house (ศาลพระภูมิ): a small shrine with a Thai roof on a single pillar.
addThai('spirit-house', 'spirit house,shrine,san phra phum,belief,offering,ศาลพระภูมิ,ศาล,ศาลเจ้า',
  p('M12 2v2.5'), p('M6 9.5 12 4.5l6 5', true), p('M6 9.5 5 8'), p('M18 9.5l1-1.5'),
  rect(7.5, 9.5, 9, 5.5, 1.5, true), p('M10.5 15v-2a1.5 1.5 0 0 1 3 0v2'), p('M12 15v5.5'), p('M8 20.5h8'));
// Kratip (กระติบข้าวเหนียว): round woven basket, domed lid, slats, carrying loop on top.
addThai('sticky-rice', 'sticky rice,kratip,basket,isan,food,ข้าวเหนียว,กระติบ,อีสาน,อาหาร',
  p('M6 11.5V8a6 2.5 0 0 1 12 0v3.5'), p('M5.5 11.5h13'), p('M6.5 11.5v5.5a5.5 2.5 0 0 0 11 0v-5.5'),
  p('M9.5 14v3.5'), p('M12 14.5v4'), p('M14.5 14v3.5'), p('M8 5.5c.5-3 7.5-3 8 0'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
