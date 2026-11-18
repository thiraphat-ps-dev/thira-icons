// Batch 13c worksheet: hospital, school, factory, warehouse, hotel, castle, tree-palm, signpost,
// traffic-cone, fuel.   node explore/batch-13c.mjs
import { writeFileSync } from 'node:fs';
import { f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const door = (cx, base = 21.5) => p(`M${cx - 2} ${base}v-3.5a2 2 0 0 1 4 0v3.5`);

add('hospital', 'hospital,clinic,medical,health,emergency,doctor,โรงพยาบาล,คลินิก,การแพทย์,สุขภาพ',
  rect(5, 2.5, 14, 19, 3, true), p('M12 6v5'), p('M9.5 8.5h5'), door(12));

add('school', 'school,education,learning,class,college,academy,โรงเรียน,การศึกษา,สถานศึกษา,เรียน',
  p(roundedPolygon([[3, 21.5], [3, 12.5], [8.5, 12.5], [8.5, 9], [15.5, 9], [15.5, 12.5], [21, 12.5], [21, 21.5]], [3, 2, 1, 1, 1, 1, 2, 3]), true),
  p('M12 9V2.5'), p('M12 2.5l4 1.5-4 1.5Z'), p('M7 17h.01'), p('M17 17h.01'), door(12));

{
  const pts = [[3, 21.5], [3, 13], [8, 9], [8, 13], [13, 9], [13, 13], [16, 13], [16, 3.5], [21, 3.5], [21, 21.5]];
  add('factory', 'factory,industry,plant,manufacturing,production,chimney,โรงงาน,อุตสาหกรรม,การผลิต,ปล่องไฟ',
    p(roundedPolygon(pts, [3, 1, 1, 1, 1, 1, 1, 1, 1, 3]), true), p('M7.5 17.5h.01'), p('M12 17.5h.01'), p('M16.5 17.5h.01'));
}

add('warehouse', 'warehouse,storage,depot,stock,logistics,inventory,โกดัง,คลังสินค้า,จัดเก็บ,โลจิสติกส์',
  p(roundedPolygon([[3, 21.5], [3, 9.5], [12, 4.5], [21, 9.5], [21, 21.5]], [3, 1.5, 1.5, 1.5, 3]), true),
  p('M7.5 21.5V13.5h9v8'), p('M7.5 17.5h9'));

add('hotel', 'hotel,lodging,stay,accommodation,resort,bed,booking,โรงแรม,ที่พัก,รีสอร์ท,จองห้อง',
  rect(5, 2.5, 14, 19, 3, true), p('M9.5 7v6'), p('M14.5 7v6'), p('M9.5 10h5'), p('M9.5 21.5v-3a2.5 2.5 0 0 1 5 0v3'));

{
  const pts = [[3, 21.5], [3, 4], [6.5, 4], [6.5, 6.5], [10.25, 6.5], [10.25, 4], [13.75, 4], [13.75, 6.5], [17.5, 6.5], [17.5, 4], [21, 4], [21, 21.5]];
  add('castle', 'castle,fortress,tower,kingdom,medieval,palace,ปราสาท,ป้อมปราการ,พระราชวัง,อาณาจักร',
    p(roundedPolygon(pts, [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3]), true), p('M7 12h.01'), p('M17 12h.01'), door(12));
}

add('tree-palm', 'palm,tree,tropical,beach,coconut,island,summer,ต้นปาล์ม,ต้นมะพร้าว,เกาะ,ชายหาด,เขตร้อน',
  p('M9.5 21.5C9.5 17 11.5 13.5 12.5 10'),
  p('M12.5 10C11 6.5 7.5 5.5 4 8.5'), p('M12.5 10C14 6.5 17.5 5.5 21 8.5'),
  p('M12.5 10C10 9 7 10 5 13.5'), p('M12.5 10C15 9 18 10 20 13.5'), p('M12.5 10V4'));

add('signpost', 'signpost,sign,direction,way,guide,road,navigate,ป้ายบอกทาง,ป้าย,ทิศทาง,นำทาง',
  p(roundedPolygon([[4.5, 3.5], [17.5, 3.5], [21, 6], [17.5, 8.5], [4.5, 8.5]], [1.25, 1, 1, 1, 1.25]), true),
  p(roundedPolygon([[19.5, 12], [19.5, 17], [6.5, 17], [3, 14.5], [6.5, 12]], [1.25, 1.25, 1, 1, 1]), true),
  p('M12 8.5V12'), p('M12 17v4.5'), p('M8 21.5h8'));

{
  const x = (y, s) => 12 + s * (1.5 + 5 * (y - 3) / 14.5); // cone edge
  add('traffic-cone', 'traffic cone,cone,road,construction,warning,caution,barrier,กรวยจราจร,กรวย,ก่อสร้าง,เตือน',
    p(roundedPolygon([[10.5, 3], [13.5, 3], [17.5, 17.5], [6.5, 17.5]], [1, 1, 1, 1]), true),
    p(`M${f(x(9, -1) + 0.2)} 9H${f(x(9, 1) - 0.2)}`), p(`M${f(x(13.25, -1) + 0.2)} 13.25H${f(x(13.25, 1) - 0.2)}`),
    rect(3, 17.5, 18, 4, 1.5));
}

add('fuel', 'fuel,gas,petrol,pump,station,diesel,refuel,ปั๊มน้ำมัน,น้ำมัน,เชื้อเพลิง,เติมน้ำมัน',
  rect(3.5, 3, 11, 18.5, 3, true), p('M7 8h4.5'),
  p('M14.5 12h2a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0V9.5l-3-3'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
