// Batch 12a worksheet: pizza, apple, carrot, cup-soda, wine, beer, ice-cream-cone, sandwich, soup, egg.   node explore/batch-12a.mjs
import { writeFileSync } from 'node:fs';
import { f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;

add('pizza', 'pizza,slice,food,italian,fast food,meal,พิซซ่า,อาหาร,อิตาเลียน,ฟาสต์ฟู้ด',
  p(roundedPolygon([[2.5, 6.5], [21.5, 6.5], [12, 21.5]], [1.5, 1.5, 1.5]), true),
  p('M6.5 10.5h11'), p('M9.5 14h.01'), p('M13.5 16h.01'));

add('apple', 'apple,fruit,fresh,healthy,food,snack,แอปเปิล,ผลไม้,สุขภาพ,อาหาร',
  p('M12 8c-1.5-1.25-3-1.75-4.5-1.75C4.5 6.25 3 9.5 3 13c0 4.5 3.5 8.5 6 8.5 1.2 0 1.8-.75 3-.75s1.8.75 3 .75c2.5 0 6-4 6-8.5 0-3.5-1.5-6.75-4.5-6.75C15 6.25 13.5 6.75 12 8z', true),
  p('M12 8V5.25'), p('M12 5.25c0-1.75 1.5-3 4.25-3 0 2-1.5 3-4.25 3z'));

add('carrot', 'carrot,vegetable,vegetables,healthy,food,garden,แครอท,ผัก,สุขภาพ,อาหาร',
  p(roundedPolygon([[11.96, 4.96], [19.04, 12.04], [4, 20]], [1.5, 1.5, 1.5]), true),
  p('M15.5 8.5V3.75'), p('M15.5 8.5h4.75'), p('M11.75 12.25l1.5 1.5'), p('M9 15.75l1 1'));

add('cup-soda', 'cup soda,soft drink,drink,straw,beverage,takeaway,แก้วน้ำ,น้ำอัดลม,เครื่องดื่ม,หลอด',
  p('M5.5 10l1.4 9.6a2 2 0 0 0 2 1.9h6.2a2 2 0 0 0 2-1.9L18.5 10z', true),
  rect(4, 7, 16, 3, 1.5), p('M13.5 7l1-4.5h3'));

add('wine', 'wine,glass,drink,alcohol,bar,red wine,restaurant,ไวน์,แก้วไวน์,เครื่องดื่ม,บาร์',
  p('M7 3.5v4a5 5 0 0 0 10 0v-4z', true), p('M12 12.5v8'), p('M8 20.5h8'));

add('beer', 'beer,mug,pint,drink,alcohol,pub,bar,เบียร์,แก้วเบียร์,เครื่องดื่ม,ผับ',
  // Reviewer redraw: the two overhanging foam bumps read as a gift bow; a wavy foam line inside a
  // taller mug reads as beer.
  rect(4.5, 4.5, 11, 16.5, 3, true),
  p('M4.5 9.5c1.83 0 1.83 1.5 3.67 1.5s1.83-1.5 3.67-1.5 1.83 1.5 3.66 1.5'),
  p('M15.5 11.5h2a2.5 2.5 0 0 1 2.5 2.5v1.5a2.5 2.5 0 0 1-2.5 2.5h-2'),
  p('M8.5 14.5v3'), p('M11.5 14.5v3'));

add('ice-cream-cone', 'ice cream,cone,dessert,sweet,scoop,gelato,ไอศกรีม,โคน,ของหวาน,ขนม',
  p('M6 11.5A6.25 6.25 0 1 1 18 11.5z', true),
  p(roundedPolygon([[7, 11.5], [17, 11.5], [12, 21.5]], [1, 1, 1.5])));

add('sandwich', 'sandwich,bread,lunch,snack,toast,food,แซนด์วิช,ขนมปัง,อาหารเช้า,มื้อกลางวัน',
  rect(4.5, 5, 15, 4.5, 1.5, true),
  p('M4 12.75q2 1.5 4 0t4 0t4 0t4 0'),
  rect(4.5, 16, 15, 4.5, 1.5, true));

add('soup', 'soup,bowl,hot,steam,meal,ramen,food,ซุป,ชามซุป,ต้ม,อาหารร้อน',
  p('M3.5 12h17a8.5 8.5 0 0 1-17 0z', true),
  p('M9 4.5c-1 1.25 1 2.25 0 3.5'), p('M15 4.5c-1 1.25 1 2.25 0 3.5'));

add('egg', 'egg,breakfast,food,protein,cooking,easter,ไข่,อาหารเช้า,อาหาร',
  // Reviewer redraw: a whole egg — the fried egg with a centred yolk read as a target or donut.
  p('M12 2.5c-4 0-7 6.75-7 11.5a7 7 0 0 0 14 0c0-4.75-3-11.5-7-11.5z', true));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
