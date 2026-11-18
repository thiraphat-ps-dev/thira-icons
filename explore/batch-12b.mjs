// Batch 12b worksheet: wrench, hammer, paintbrush, palette, pen-tool, ruler, pipette, eraser, highlighter, magnet.
//   node explore/batch-12b.mjs
import { writeFileSync } from 'node:fs';
import { f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const dot = (x, y) => p(`M${f(x)} ${f(y)}h.01`);

// Local frame on the 45 degree diagonal: u runs toward the upper right, v toward the lower right.
const K = Math.SQRT1_2;
const frame = (ox, oy) => (u, v) => [ox + K * (u + v), oy + K * (v - u)];
const xy = (P, u, v) => P(u, v).map(f).join(' ');
const poly = (P, pts, r) => roundedPolygon(pts.map(([u, v]) => P(u, v)), r);

// wrench: open-end, handle + round head with a slot
{
  const P = frame(4, 20);
  const hr = 6, hc = 16, hw = 2.25, sw = 2; // head radius/centre, handle half width, slot half width
  const uh = hc - Math.sqrt(hr * hr - hw * hw);
  const us = hc + Math.sqrt(hr * hr - sw * sw);
  const d =
    `M${xy(P, uh, -hw)}A${hr} ${hr} 0 0 1 ${xy(P, us, -sw)}` +
    `L${xy(P, 17.5, -sw)}A${sw} ${sw} 0 0 0 ${xy(P, 17.5, sw)}` +
    `L${xy(P, us, sw)}A${hr} ${hr} 0 0 1 ${xy(P, uh, hw)}` +
    `L${xy(P, hw, hw)}A${hw} ${hw} 0 0 1 ${xy(P, hw, -hw)}Z`;
  add('wrench', 'wrench,spanner,tool,fix,repair,settings,maintenance,ประแจ,เครื่องมือ,ซ่อม,ตั้งค่า', p(d, true));
}

// hammer: T-shaped, handle on the diagonal
{
  const P = frame(4, 20);
  add('hammer', 'hammer,tool,build,mallet,judge,construction,ค้อน,เครื่องมือ,ก่อสร้าง,ตี',
    p(poly(P, [[12.5, -4.5], [18.5, -4.5], [18.5, 7.5], [12.5, 7.5]], 2), true),
    p(`M${xy(P, 0.5, 0)}L${xy(P, 12.5, 0)}`));
}

// paintbrush: bristles, ferrule, handle
{
  const P = frame(3.5, 20.5);
  const bristle = `M${xy(P, 9, -2.5)}C${xy(P, 5.5, -2.5)} ${xy(P, 3, -1.8)} ${xy(P, 1, 0)}C${xy(P, 3, 1.8)} ${xy(P, 5.5, 2.5)} ${xy(P, 9, 2.5)}`;
  add('paintbrush', 'paintbrush,brush,paint,art,draw,design,creative,พู่กัน,แปรง,ระบายสี,ศิลปะ',
    p(bristle, true),
    p(poly(P, [[9, -2.5], [13.5, -2.5], [13.5, 2.5], [9, 2.5]], 1)),
    p(`M${xy(P, 13.5, 0)}L${xy(P, 23.5, 0)}`));
}

// palette: blob with a thumb scoop and three paint dots
add('palette', 'palette,paint,colors,colours,art,theme,design,จานสี,สี,ศิลปะ,ธีม',
  p('M12 2.5A9.5 9.5 0 0 0 12 21.5c1.5 0 2.4-1.6 1.5-2.8a2 2 0 0 1 1.6-3.2H17.5A4.5 4.5 0 0 0 22 11A10 8.5 0 0 0 12 2.5Z', true),
  dot(7.5, 12), dot(10, 7.25), dot(15.25, 7.5));

// pen-tool: vector pen nib
{
  const P = frame(3.5, 20.5);
  const nib = poly(P, [[0, 0], [11, -6.5], [17, -4], [17, 4], [11, 6.5]], [0.5, 2, 2, 2, 2]);
  add('pen-tool', 'pen tool,vector,bezier,nib,pen,design,path,ปากกา,เวกเตอร์,ออกแบบ',
    p(nib, true),
    circle(...P(9, 0), 1.5),
    p(`M${xy(P, 3, 0)}L${xy(P, 7.5, 0)}`));
}

// ruler: diagonal bar with three ticks
{
  const P = frame(12, 12);
  add('ruler', 'ruler,measure,length,size,scale,dimension,ไม้บรรทัด,วัด,ขนาด,ความยาว',
    p(poly(P, [[-10, -3.5], [10, -3.5], [10, 3.5], [-10, 3.5]], 2), true),
    p(`M${xy(P, -5, -3.5)}L${xy(P, -5, -1.25)}`),
    p(`M${xy(P, 0, -3.5)}L${xy(P, 0, -0.75)}`),
    p(`M${xy(P, 5, -3.5)}L${xy(P, 5, -1.25)}`));
}

// pipette: tube, collar, bulb
{
  const P = frame(3, 21);
  const L = (u, v) => `${xy(P, u, v)}`;
  const d = `M${L(15.5, -2.5)}L${L(6.5, -2.5)}L${L(1, -0.9)}A1 1 0 0 0 ${L(1, 0.9)}L${L(6.5, 2.5)}L${L(15.5, 2.5)}`;
  add('pipette', 'pipette,eyedropper,color picker,pick,sample,dropper,หลอดหยด,เลือกสี,ดูดสี',
    p(d, true),
    p(`M${L(15.5, -4.5)}L${L(15.5, 4.5)}`),
    p(`M${L(15.5, -3)}L${L(18.5, -3)}A3 3 0 0 1 ${L(18.5, 3)}L${L(15.5, 3)}`));
}

// eraser: rounded block on the diagonal, band, baseline
{
  const oy = 12.84;
  const P = frame(11.5, oy);
  const base = f(oy + K * 12 - (2 * Math.SQRT2 - 2));
  add('eraser', 'eraser,rubber,delete,clear,remove,erase,ยางลบ,ลบ,ล้าง',
    p(poly(P, [[-7.5, -4.5], [7.5, -4.5], [7.5, 4.5], [-7.5, 4.5]], 2), true),
    p(`M${xy(P, -2, -4.5)}L${xy(P, -2, 4.5)}`),
    p(`M4.5 ${base}H19.5`));
}

// highlighter: wide marker with a chisel tip, resting on its mark
{
  const oy = 17.5;
  const P = frame(8, oy);
  const body = poly(P, [[0, -2], [5, -3.5], [17, -3.5], [17, 3.5], [5, 3.5], [0, 2]], [1, 1.5, 2, 2, 1.5, 1]);
  const lowest = f(P(0, 2)[1] + 0.5);
  add('highlighter', 'highlighter,marker,mark,emphasize,text,annotate,ปากกาเน้นข้อความ,ไฮไลต์,มาร์คเกอร์',
    p(body, true),
    p(`M${xy(P, 5, -3.5)}L${xy(P, 5, 3.5)}`),
    p(`M3 ${lowest}H12`));
}

// magnet: horseshoe with two pole bands
add('magnet', 'magnet,attract,horseshoe,pull,magnetic,pole,แม่เหล็ก,ดึงดูด',
  p('M4 5.5A1.5 1.5 0 0 1 5.5 4H7.5A1.5 1.5 0 0 1 9 5.5V12.5A3 3 0 0 0 15 12.5V5.5A1.5 1.5 0 0 1 16.5 4H18.5A1.5 1.5 0 0 1 20 5.5V12.5A8 8 0 0 1 4 12.5Z', true),
  p('M4 8.5H9'), p('M15 8.5H20'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
