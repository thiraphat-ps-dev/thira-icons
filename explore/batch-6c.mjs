// Batch 6c worksheet: book, building, briefcase, graduation-cap, trophy, music, umbrella, cloud-rain, cloud-sun, coffee.
//   node explore/batch-6c.mjs
import { writeFileSync } from 'node:fs';
import { arcPieces, f, rays, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;

add('book', 'book,read,library,study,notebook,story,หนังสือ,อ่าน,ห้องสมุด',
  p('M7 2.5h11.5a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H7A2.5 2.5 0 0 1 4.5 19V5A2.5 2.5 0 0 1 7 2.5z', true),
  p('M4.5 19A2.5 2.5 0 0 1 7 16.5h12.5'),
  p('M9 7h6'));

add('building', 'building,office,company,business,tower,city,อาคาร,ตึก,ออฟฟิศ,บริษัท',
  rect(5, 2.5, 14, 19, 3, true),
  p('M9.5 7h.01'), p('M14.5 7h.01'), p('M9.5 11.5h.01'), p('M14.5 11.5h.01'),
  p('M10 21.5v-3.5a2 2 0 0 1 4 0v3.5'));

add('briefcase', 'briefcase,work,job,business,career,portfolio,กระเป๋าเอกสาร,งาน,อาชีพ,ธุรกิจ',
  rect(2.5, 7.5, 19, 13, 3, true),
  p('M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5'),
  p('M2.5 13.5h19'));

{
  const dia = roundedPolygon([[12, 4.5], [21.5, 9.5], [12, 14.5], [2.5, 9.5]], 1.25);
  add('graduation-cap', 'graduation cap,education,school,university,degree,graduate,mortarboard,การศึกษา,จบการศึกษา,มหาวิทยาลัย,หมวกบัณฑิต',
    p(dia, true),
    p('M6.5 12.3V16c0 1.5 2.5 3.5 5.5 3.5s5.5-2 5.5-3.5v-3.7'),
    p('M21.5 9.5v6'));
}

add('trophy', 'trophy,winner,award,prize,champion,achievement,ถ้วยรางวัล,ชนะ,แชมป์,รางวัล',
  p('M7 3.5h10v5a5 5 0 0 1-10 0z', true),
  p('M7 5.5H5a1.5 1.5 0 0 0-1.5 1.5v.5A4.5 4.5 0 0 0 8 11.5'),
  p('M17 5.5h2a1.5 1.5 0 0 1 1.5 1.5v.5A4.5 4.5 0 0 1 16 11.5'),
  p('M12 13.5v7.5'), p('M8 21h8'));

add('music', 'music,note,song,audio,melody,sound,เพลง,ดนตรี,โน้ตเพลง',
  circle(6.5, 17.5, 2.5, true), circle(16.5, 16, 2.5, true),
  p('M9 17.5V6.5l10-2.5V16'));

add('umbrella', 'umbrella,rain,weather,protection,insurance,ร่ม,ฝน,สภาพอากาศ',
  // Hem scallops curve UP between the rib tips (r3.5 over a 6 chord, 1.7 deep); hanging scallops
  // read as a mushroom at 16px. The pole starts at the middle scallop's top.
  p('M3 13a9 9 0 0 1 18 0a3.5 3.5 0 0 0-6 0a3.5 3.5 0 0 0-6 0a3.5 3.5 0 0 0-6 0z', true),
  p('M12 4V2.5'),
  p('M12 11.3v8a2 2 0 0 1-4 0'));

// Cloud geometry is the exact cloud.svg path, uniformly scaled by s then shifted by (tx, ty).
const cloud = (s, tx, ty) => {
  const X = (v) => f(v * s + tx), Y = (v) => f(v * s + ty), R = (v) => f(v * s);
  return `M${X(6.75)} ${Y(19.5)}A${R(4.5)} ${R(4.5)} 0 0 1 ${X(6)} ${Y(10.56)}A${R(6)} ${R(6)} 0 0 1 ${X(17.94)} ${Y(9.64)}A${R(5)} ${R(5)} 0 0 1 ${X(16.75)} ${Y(19.5)}Z`;
};

add('cloud-rain', 'cloud rain,rain,weather,forecast,shower,wet,ฝน,ฝนตก,พยากรณ์อากาศ,เมฆฝน',
  p(cloud(0.8, 2.4, 0.4), true),
  p('M8 17.5l-1 3'), p('M12.5 17.5l-1 3'), p('M17 17.5l-1 3'));

{
  const s = 0.75, tx = 5.6, ty = 5.6;
  const lobes = [[6.4, 15.03, 4.5], [11.97, 10.1, 6], [17.35, 14.57, 5]].map(([x, y, r]) => [x * s + tx, y * s + ty, r * s]);
  const bodyBottom = 19.5 * s + ty;
  const cx = 9.5, cy = 9.5, r = 3.5;
  const gap = 2.9;
  const keep = ([x, y]) =>
    lobes.every(([lx, ly, lr]) => Math.hypot(x - lx, y - ly) > lr + gap) &&
    !(y > 14 * s + ty - 3 && y < bodyBottom + gap && x > lobes[0][0] - 2 && x < lobes[2][0] + 2);
  add('cloud-sun', 'cloud sun,partly cloudy,weather,forecast,sunny,day,อากาศ,มีเมฆบางส่วน,แดด,เมฆ',
    p(cloud(s, tx, ty), true),
    ...arcPieces(cx, cy, r, 270, 450, keep).map((d) => p(d)),
    ...rays(cx, cy, 5.75, 7.5, 8, 0).filter((_, i) => [0, 5, 6, 7].includes(i)).map((d) => p(d)));
}

add('coffee', 'coffee,cup,tea,drink,cafe,break,กาแฟ,ถ้วย,เครื่องดื่ม,คาเฟ่',
  p('M4 11a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 16 11v3.5a5.5 5.5 0 0 1-5.5 5.5h-1A5.5 5.5 0 0 1 4 14.5z', true),
  p('M16 11.5h1.5a2.5 2.5 0 0 1 0 5H16'),
  p('M7.5 3c-1 1.25 1 2.25 0 3.5'), p('M12 3c-1 1.25 1 2.25 0 3.5'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
