// Batch 9b worksheet: leaf, tree-pine, flower, snowflake, droplet, thermometer, wind, cloud-lightning, sunrise, moon-star.
//   node explore/batch-9b.mjs
import { writeFileSync } from 'node:fs';
import { circleIntersect, f, onCircle, rays, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

add('leaf', 'leaf,plant,nature,eco,green,organic,vegan,ใบไม้,ใบ,ธรรมชาติ,พืช,รักษ์โลก',
  p('M6.5 17.5C6 10 11 4.5 19.5 4.5C20 12.5 15 18 6.5 17.5Z', true),
  p('M4 20L13 11'));

{
  const pts = [[12, 2.5], [16.5, 8.5], [14.5, 8.5], [19, 15.5], [5, 15.5], [9.5, 8.5], [7.5, 8.5]];
  add('tree-pine', 'tree,pine,fir,forest,nature,christmas,camp,ต้นไม้,ต้นสน,ป่า,ธรรมชาติ',
    p(roundedPolygon(pts, [1.5, 1, 0.5, 1.5, 1.5, 0.5, 1]), true),
    p('M12 15.5V21.5'));
}

{
  const c = [12, 12], d = 6, r = 3.9, n = 5;
  const cs = Array.from({ length: n }, (_, i) => onCircle(c[0], c[1], d, (360 / n) * i));
  const outer = (i) => {
    const hit = circleIntersect(cs[i], r, cs[(i + 1) % n], r);
    return hit.sort((a, b) => Math.hypot(b[0] - 12, b[1] - 12) - Math.hypot(a[0] - 12, a[1] - 12))[0];
  };
  let dd = `M${pt(outer(n - 1))}`;
  for (let i = 0; i < n; i++) dd += `A${f(r)} ${f(r)} 0 1 1 ${pt(outer(i))}`;
  add('flower', 'flower,bloom,blossom,garden,spring,nature,ดอกไม้,ดอก,สวน,ฤดูใบไม้ผลิ',
    p(dd + 'Z', true),
    circle(12, 12, 2));
}

{
  // 3 lines through the centre, a small outward-opening V on every arm.
  const R = 9.5, apex = 6.5, out = 1.75, side = 1.75;
  const ds = [];
  for (let k = 0; k < 3; k++) {
    const a = k * 60;
    ds.push(`M${pt(onCircle(12, 12, R, a))}L${pt(onCircle(12, 12, R, a + 180))}`);
  }
  for (let k = 0; k < 6; k++) {
    const a = k * 60, ap = onCircle(12, 12, apex, a);
    const dir = [Math.sin((a * Math.PI) / 180), -Math.cos((a * Math.PI) / 180)];
    const perp = [-dir[1], dir[0]];
    const e = (s) => [ap[0] + dir[0] * out + perp[0] * side * s, ap[1] + dir[1] * out + perp[1] * side * s];
    ds.push(`M${pt(e(-1))}L${pt(ap)}L${pt(e(1))}`);
  }
  add('snowflake', 'snowflake,snow,winter,cold,freeze,ice,frost,หิมะ,เกล็ดหิมะ,ฤดูหนาว,เย็น,แช่แข็ง',
    ...ds.map((d) => p(d)));
}

add('droplet', 'droplet,drop,water,liquid,rain,humidity,หยดน้ำ,น้ำ,ของเหลว,ความชื้น',
  p('M12 3C9 6.8 5.5 10.2 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10.2 15 6.8 12 3Z', true));

add('thermometer', 'thermometer,temperature,heat,cold,weather,fever,degree,เทอร์โมมิเตอร์,อุณหภูมิ,ร้อน,ไข้,องศา',
  p('M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0Z', true),
  // Scale marks start on the tube wall: the single tick floating at x 17.5 read as a separate mark.
  p('M14 6.5h2.5'), p('M14 10.5h2.5'));

add('wind', 'wind,breeze,air,weather,windy,blow,ลม,สายลม,อากาศ,พัด',
  p('M3 8h6a2.5 2.5 0 1 0-2.5-2.5'),
  p('M3 12h15a2.5 2.5 0 1 0-2.5-2.5'),
  p('M3 16h9a2.5 2.5 0 1 1-2.5 2.5'));

{
  const s = 0.8, tx = 2.4, ty = -0.6;
  const X = (v) => f(v * s + tx), Y = (v) => f(v * s + ty), R = (v) => f(v * s);
  const cloud = `M${X(6.75)} ${Y(19.5)}A${R(4.5)} ${R(4.5)} 0 0 1 ${X(6)} ${Y(10.56)}A${R(6)} ${R(6)} 0 0 1 ${X(17.94)} ${Y(9.64)}A${R(5)} ${R(5)} 0 0 1 ${X(16.75)} ${Y(19.5)}Z`;
  add('cloud-lightning', 'cloud lightning,thunderstorm,storm,thunder,weather,lightning,พายุ,ฟ้าผ่า,ฟ้าร้อง,เมฆฝน',
    p(cloud, true),
    p('M13.5 15L10.5 18.5H14.5L11.5 22'));
}

{
  const cy = 17, r = 5;
  add('sunrise', 'sunrise,dawn,morning,sun,horizon,daybreak,พระอาทิตย์ขึ้น,เช้า,รุ่งเช้า,ขอบฟ้า',
    p(`M${f(12 - r)} ${cy}a${r} ${r} 0 0 1 ${r * 2} 0`, true),
    p('M2.5 17h19'),
    ...rays(12, cy, r + 1, r + 3, 8, 0).filter((_, i) => [0, 1, 7].includes(i)).map((d) => p(d)));
}

{
  const a = 3.25, k = a / 7, cx = 16.75, cy = 7.25;
  const q = (...v) => v.map((n) => f(n * k)).join(' ');
  const star = `M${f(cx)} ${f(cy - a)}c${q(0.7, 5.1, 1.9, 6.3, 7, 7)}c${q(-5.1, 0.7, -6.3, 1.9, -7, 7)}c${q(-0.7, -5.1, -1.9, -6.3, -7, -7)}c${q(5.1, -0.7, 6.3, -1.9, 7, -7)}z`;
  add('moon-star', 'moon star,night,sleep,dark mode,evening,sky,bedtime,ดวงจันทร์,ดาว,กลางคืน,นอน,ท้องฟ้า',
    p('M20 14.5A8.73 8.73 0 1 1 9.5 4A8 8 0 0 0 20 14.5Z', true),
    p(star));
}

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
