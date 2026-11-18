// Batch 7c worksheet: bug, rocket, puzzle, hash, percent, calculator, target, award, crown, battery.
//   node explore/batch-7c.mjs
import { writeFileSync } from 'node:fs';
import { f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const rot = ([x, y], deg, [cx, cy] = [12, 12]) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

add('bug', 'bug,insect,beetle,error,debug,defect,แมลง,บั๊ก,ข้อผิดพลาด,ดีบั๊ก',
  p('M7.5 13.5a4.5 4.5 0 0 1 9 0v2a4.5 4.5 0 0 1-9 0z', true),
  p('M9.5 8.5a2.5 2.5 0 0 1 5 0'),
  p('M12 12v7.5'),
  p('M7.5 13H4'), p('M16.5 13H20'),
  p('M7.5 17H4'), p('M16.5 17H20'));

{
  // Upright rocket, then turned 45 degrees clockwise about the centre.
  const R = (q) => rot(q, 45);
  const body = roundedPolygon([[12, 1.5], [16, 9.5], [16, 17], [8, 17], [8, 9.5]].map(R), [3.5, 1.5, 1.5, 1.5, 1.5]);
  const fin = (pts) => `M${pts.map((q) => pt(R(q))).join('L')}`;
  const win = R([12, 10.5]);
  add('rocket', 'rocket,launch,startup,space,release,deploy,จรวด,เปิดตัว,สตาร์ทอัป,อวกาศ',
    p(body, true), circle(win[0], win[1], 1.75),
    p(fin([[8, 12.5], [5, 16], [5, 19], [8, 17]])), p(fin([[16, 12.5], [19, 16], [19, 19], [16, 17]])),
    p(`M${pt(R([12, 19.5]))}L${pt(R([12, 22.5]))}`));
}

add('puzzle', 'puzzle,piece,jigsaw,plugin,extension,integration,จิ๊กซอว์,ปลั๊กอิน,ส่วนเสริม,ปริศนา',
  p('M6 7.5H8a2.5 2.5 0 1 1 4 0H14a3 3 0 0 1 3 3v2a2.5 2.5 0 1 1 0 4v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2a2.5 2.5 0 1 0 0-4v-2a3 3 0 0 1 3-3z', true));

add('hash', 'hash,number sign,pound,channel,tag,sharp,แฮช,เครื่องหมายเดี่ยว,ช่อง,แท็ก',
  p('M10.5 3.5L8.5 20.5'), p('M16 3.5L14 20.5'), p('M4.5 9h15'), p('M4 15h15'));

add('percent', 'percent,discount,rate,sale,ratio,เปอร์เซ็นต์,ส่วนลด,อัตรา,ลดราคา',
  circle(7, 7, 3.25, true), circle(17, 17, 3.25, true), p('M19 5L5 19'));

add('calculator', 'calculator,calculate,math,accounting,numbers,เครื่องคิดเลข,คำนวณ,บัญชี,ตัวเลข',
  rect(4.5, 2.5, 15, 19, 4, true),
  p('M8.5 8h7'),
  p('M8.5 13h.01'), p('M12 13h.01'), p('M15.5 13h.01'),
  p('M8.5 17h.01'), p('M12 17h.01'), p('M15.5 17h.01'));

add('target', 'target,goal,aim,focus,objective,bullseye,เป้าหมาย,เป้า,วัตถุประสงค์,โฟกัส',
  circle(12, 12, 10, true), circle(12, 12, 5.5), circle(12, 12, 1));

add('award', 'award,medal,badge,prize,achievement,rosette,เหรียญ,รางวัล,เกียรติบัตร,ความสำเร็จ',
  circle(12, 9, 6.5, true), p('M8.5 14.5L7.5 21.5L12 19L16.5 21.5L15.5 14.5'), p('M12 9h.01'));

{
  const pts = [[3.5, 7.5], [8.5, 12], [12, 4.5], [15.5, 12], [20.5, 7.5], [19, 19.5], [5, 19.5]];
  add('crown', 'crown,king,queen,premium,royal,vip,winner,มงกุฎ,พรีเมียม,ราชา,วีไอพี',
    p(roundedPolygon(pts, [1.5, 1, 1.5, 1, 1.5, 2, 2]), true), p('M6 15.5h12'));
}

add('battery', 'battery,power,charge,energy,level,แบตเตอรี่,พลังงาน,ชาร์จ,ไฟฟ้า',
  // The terminal is a cap attached to the body (a floating nub read as a separate mark), and three
  // bars at the 3.75 minimum spacing read as charge, where two looked like a pause button.
  rect(2.5, 6.5, 16, 11, 3, true), p('M18.5 10h1.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1.5'),
  p('M6.25 10v4'), p('M10 10v4'), p('M13.75 10v4'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
