// Batch 9a worksheet: bed, sofa, lamp, utensils, shirt, glasses, watch, cake, pill, dumbbell.   node explore/batch-9a.mjs
import { writeFileSync } from 'node:fs';
import { f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const ellipse = (cx, cy, rx, ry, duo = false) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${duo ? ' data-duotone' : ''} />`;

add('bed', 'bed,sleep,bedroom,rest,hotel,furniture,เตียง,นอน,ห้องนอน,โรงแรม',
  rect(3.5, 13, 17, 5.5, 1.5, true), p('M3.5 4.5V20'), p('M20.5 18.5v1.5'),
  p('M7.5 13v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'));

add('sofa', 'sofa,couch,living room,furniture,seat,home,โซฟา,เก้าอี้นวม,ห้องนั่งเล่น,เฟอร์นิเจอร์',
  rect(2.5, 11, 19, 9, 2, true),
  p('M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3'),
  p('M7 14.5V20'), p('M17 14.5V20'));

add('lamp', 'lamp,light,table lamp,desk,lighting,home,โคมไฟ,ตะเกียง,โต๊ะ,แสงสว่าง',
  p(roundedPolygon([[8, 3.5], [16, 3.5], [19.5, 12], [4.5, 12]], [1.5, 1.5, 1.5, 1.5]), true),
  p('M12 12v8.5'), p('M8 20.5h8'));

add('utensils', 'utensils,fork,spoon,cutlery,food,restaurant,eat,meal,ช้อนส้อม,อาหาร,ร้านอาหาร,กิน',
  p('M5.5 3v4.5a2.5 2.5 0 0 0 5 0V3'), p('M8 10v11.5'),
  ellipse(17, 7.25, 2.75, 4.25, true), p('M17 11.5v10'));

{
  const pts = [[9, 3.5], [3.5, 5.75], [2.5, 9.75], [5.75, 11.25], [5.75, 20], [18.25, 20], [18.25, 11.25], [21.5, 9.75], [20.5, 5.75], [15, 3.5]];
  let d = roundedPolygon(pts, [0.5, 1.5, 1, 1, 3, 3, 1, 1, 1.5, 0.5]);
  // replace the straight neck edge (last L before closing arc) with a round neckline
  const i = d.lastIndexOf('L');
  const j = d.indexOf('A', i);
  const target = d.slice(i + 1, j);
  d = d.slice(0, i) + `A2.5 2.5 0 0 1 ${target}` + d.slice(j);
  add('shirt', 'shirt,t-shirt,clothes,clothing,apparel,fashion,tee,เสื้อ,เสื้อยืด,เสื้อผ้า,แฟชั่น', p(d, true));
}

add('glasses', 'glasses,eyeglasses,spectacles,vision,reading,eyewear,แว่นตา,แว่น,สายตา,มองเห็น',
  circle(6.5, 13, 4, true), circle(17.5, 13, 4, true), p('M10.5 13a1.5 1.5 0 0 1 3 0'));

add('watch', 'watch,wristwatch,time,smartwatch,wearable,accessory,นาฬิกาข้อมือ,นาฬิกา,สมาร์ทวอทช์,เวลา',
  rect(6, 6.5, 12, 11, 3, true), p('M9 6.5v-3h6v3'), p('M9 17.5v3h6v-3'), p('M12 9.75V12l2 1.5'));

add('cake', 'cake,birthday,dessert,party,celebration,bakery,เค้ก,วันเกิด,ขนม,ปาร์ตี้,ฉลอง',
  rect(3, 12, 18, 8.5, 2, true), p('M3 16h18'),
  p('M12 8.5V12'), p('M12 2.5c-2.5 2-2 4.5 0 6c2-1.5 2.5-4 0-6z'));

add('pill', 'pill,capsule,medicine,drug,health,pharmacy,tablet,ยา,แคปซูล,เภสัช,สุขภาพ',
  p('M18.36 11.29L11.29 18.36A4 4 0 0 1 5.64 12.71L12.71 5.64A4 4 0 0 1 18.36 11.29Z', true), p('M9.17 9.17L14.83 14.83'));

add('dumbbell', 'dumbbell,weight,gym,fitness,workout,exercise,strength,ดัมเบล,ฟิตเนส,ออกกำลังกาย,ยิม',
  rect(5, 6, 3.5, 12, 1.5, true), rect(15.5, 6, 3.5, 12, 1.5, true), p('M8.5 12h7'), p('M2.5 12H5'), p('M19 12h2.5'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
