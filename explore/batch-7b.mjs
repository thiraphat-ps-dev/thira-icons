// Batch 7b worksheet: navigation, route, bus, train-front, bike, luggage, ticket, mountain, tent, anchor.
//   node explore/batch-7b.mjs
import { writeFileSync } from 'node:fs';
import { f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;

{
  // Classic heading arrow (tip up), turned 45deg clockwise about the centre.
  const rot = ([x, y]) => {
    const a = Math.PI / 4, dx = x - 12, dy = y - 12;
    return [12 + dx * Math.cos(a) - dy * Math.sin(a), 12 + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  const pts = [[12, 3], [18.5, 19.5], [12, 15.5], [5.5, 19.5]].map(rot);
  add('navigation', 'navigation,gps,heading,direction,location,cursor,นำทาง,ทิศทาง,จีพีเอส,ตำแหน่ง',
    p(roundedPolygon(pts, [1.5, 1.5, 1.25, 1.5]), true));
}

add('route', 'route,path,directions,trip,journey,waypoints,เส้นทาง,เดินทาง,จุดหมาย,ทริป',
  circle(6, 18, 2.5, true), circle(18, 6, 2.5, true),
  p('M8.5 18H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.5'));

add('bus', 'bus,coach,transport,public transport,vehicle,รถบัส,รถเมล์,ขนส่งสาธารณะ,รถโดยสาร',
  rect(3, 3.5, 18, 15, 4, true),
  p('M3 10.5h18'),
  p('M7.5 14.5h.01'), p('M16.5 14.5h.01'),
  p('M7 18.5v3'), p('M17 18.5v3'));

add('train-front', 'train,rail,metro,subway,transport,station,รถไฟ,รถไฟฟ้า,สถานี,ขนส่งสาธารณะ',
  p('M5 8a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z', true),
  rect(8.5, 7, 7, 4, 1.5),
  p('M9 15h.01'), p('M15 15h.01'),
  p('M8 19l-2 2.5'), p('M16 19l2 2.5'));

add('bike', 'bike,bicycle,cycling,ride,sport,transport,จักรยาน,ปั่นจักรยาน,กีฬา',
  circle(6.25, 16, 4.25, true), circle(17.75, 16, 4.25, true),
  p('M6.25 16L10 8.5h5.5l2.25 7.5'),
  p('M15.5 8.5L12.5 16H6.25'),
  p('M14 6.25h3'));

add('luggage', 'luggage,suitcase,baggage,travel,trip,holiday,กระเป๋าเดินทาง,สัมภาระ,ท่องเที่ยว',
  rect(5, 6.5, 14, 14, 3, true),
  p('M9.5 6.5V4.5A1.5 1.5 0 0 1 11 3h2a1.5 1.5 0 0 1 1.5 1.5v2'),
  p('M9.5 11v5'), p('M14.5 11v5'));

add('ticket', 'ticket,admission,pass,event,coupon,booking,ตั๋ว,บัตร,งานอีเวนต์,จอง',
  p('M5.5 5h13a3 3 0 0 1 3 3v2a2 2 0 0 0 0 4v2a3 3 0 0 1-3 3h-13a3 3 0 0 1-3-3v-2a2 2 0 0 0 0-4V8a3 3 0 0 1 3-3z', true),
  p('M15 9.5h.01'), p('M15 12h.01'), p('M15 14.5h.01'));

add('mountain', 'mountain,peak,hiking,outdoor,nature,landscape,ภูเขา,เขา,ปีนเขา,ธรรมชาติ',
  p(roundedPolygon([[2.5, 19.5], [9.5, 5.5], [13, 12.5], [15.5, 8.5], [21.5, 19.5]], [1.25, 1.5, 1.5, 1.5, 1.25]), true));


add('tent', 'tent,camping,camp,outdoor,shelter,trip,เต็นท์,แคมป์ปิ้ง,ตั้งแคมป์,กางเต็นท์',
  p(roundedPolygon([[12, 3.5], [21.5, 19.5], [2.5, 19.5]], [1.5, 1.25, 1.25]), true),
  p('M9 19.5l3-6 3 6'));

add('anchor', 'anchor,ship,boat,harbor,sea,marine,nautical,สมอเรือ,เรือ,ท่าเรือ,ทะเล',
  circle(12, 4.75, 2.25, true),
  p('M12 7V21'),
  p('M8.5 10.5h7'),
  p('M4.5 13.5a7.5 7.5 0 0 0 15 0'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
