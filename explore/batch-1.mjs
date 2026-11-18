// Batch 1 worksheet: computes the geometry and writes icons/core/*.svg.
//   node explore/batch-1.mjs
// The SVG files are the source of truth afterwards; edit them directly or rerun this to regenerate.
import { writeFileSync } from 'node:fs';
import {
  cubicPath, cubicTo, distToLine, f, findT, rays, roundedPolygon, splitCubic,
} from '../scripts/geometry.mjs';

/** @type {Record<string, { tags: string, body: string[] }>} element lines, `*` marks data-duotone */
const icons = {};
const add = (name, tags, ...body) => (icons[name] = { tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${cx}" cy="${cy}" r="${r}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;

// ── Chevrons: 14 wide at 45°, a touch larger than usual so they read at 16 px ──────────────
add('chevron-down', 'chevron,down,expand,dropdown,open,ลง,ขยาย,เปิด', p('m5 8.5 7 7 7-7'));
add('chevron-up', 'chevron,up,collapse,close,ขึ้น,ย่อ,ปิด', p('m5 15.5 7-7 7 7'));
add('chevron-left', 'chevron,left,back,previous,ซ้าย,ย้อนกลับ,ก่อนหน้า', p('m15.5 5-7 7 7 7'));
add('chevron-right', 'chevron,right,next,forward,ขวา,ถัดไป,ต่อไป', p('m8.5 5 7 7-7 7'));
add('chevrons-up-down', 'chevrons,sort,select,expand,dropdown,เรียง,เลือก', p('m7.5 9 4.5-4.5 4.5 4.5'), p('m7.5 15 4.5 4.5 4.5-4.5'));

// ── Arrows: 16 long, heads 7 deep at 45° ──────────────────────────────────────────────────
add('arrow-right', 'arrow,right,next,forward,go,ลูกศร,ขวา,ถัดไป', p('M4 12h16'), p('m13 5 7 7-7 7'));
add('arrow-left', 'arrow,left,back,previous,return,ลูกศร,ซ้าย,ย้อนกลับ', p('M20 12H4'), p('m11 5-7 7 7 7'));
add('arrow-up', 'arrow,up,top,ascending,ลูกศร,ขึ้น,บน', p('M12 20V4'), p('m5 11 7-7 7 7'));
add('arrow-down', 'arrow,down,bottom,descending,ลูกศร,ลง,ล่าง', p('M12 4v16'), p('m5 13 7 7 7-7'));
add('arrow-up-right', 'arrow,up right,external,open,link,ลูกศร,เปิด,ลิงก์', p('M7 17 17 7'), p('M8.5 7H17v8.5'));
add(
  'external-link',
  'external link,open,new tab,website,ลิงก์,เปิดลิงก์,แท็บใหม่',
  p('M10 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2', true),
  p('M14 4h6v6'),
  p('M20 4 11 13'),
);

// ── Actions ──────────────────────────────────────────────────────────────────────────────
add('check', 'check,done,ok,confirm,tick,yes,ถูก,เสร็จ,ยืนยัน', p('m4.5 12.5 5 5L19.5 6.5'));
add('x', 'x,close,cancel,remove,dismiss,ปิด,ยกเลิก,ลบ', p('M6 6l12 12'), p('M18 6 6 18'));
add('minus', 'minus,subtract,less,remove,indeterminate,ลบ,ลด', p('M5 12h14'));
add('plus', 'plus,add,new,create,more,เพิ่ม,สร้าง,ใหม่', p('M12 5v14'), p('M5 12h14'));
// Prominent dots are r1 circles (a 3.75 dot at the default stroke), not zero-length lines.
add('ellipsis', 'more,ellipsis,options,menu,dots,เพิ่มเติม,ตัวเลือก,เมนู', circle(5, 12, 1), circle(12, 12, 1), circle(19, 12, 1));
add('ellipsis-vertical', 'more,ellipsis,options,menu,kebab,เพิ่มเติม,ตัวเลือก,เมนู', circle(12, 5, 1), circle(12, 12, 1), circle(12, 19, 1));
add('menu', 'menu,hamburger,navigation,list,เมนู,รายการ', p('M4 6h16'), p('M4 12h16'), p('M4 18h16'));

{
  // Pencil at 45° from the tip (4, 20): a 4.5-wide body with a round end, and a ferrule line.
  const s = Math.SQRT1_2;
  const dir = [s, -s];
  const nrm = [2.25 * s, 2.25 * s];
  const at = (dist) => [4 + dir[0] * dist, 20 + dir[1] * dist];
  const shaft = at(4); // where the tip widens to the full body
  const end = at(19.5);
  const ferrule = at(16.5);
  const pt = ([x, y]) => `${f(x)} ${f(y)}`;
  const plus = (a) => [a[0] + nrm[0], a[1] + nrm[1]];
  const minus = (a) => [a[0] - nrm[0], a[1] - nrm[1]];
  add(
    'pencil',
    'pencil,edit,write,rename,draw,แก้ไข,เขียน,ดินสอ',
    p(`M4 20L${pt(minus(shaft))}L${pt(minus(end))}A2.25 2.25 0 0 1 ${pt(plus(end))}L${pt(plus(shaft))}Z`, true),
    p(`M${pt(minus(ferrule))}L${pt(plus(ferrule))}`),
  );
}

add(
  'copy',
  'copy,duplicate,clipboard,clone,คัดลอก,ทำสำเนา',
  rect(8, 8, 13, 13, 3, true),
  p('M16 8V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h2'),
);

// ── Status: circle keyline (r 10) ────────────────────────────────────────────────────────
add('circle-check', 'success,check,done,ok,complete,สำเร็จ,เสร็จ,ผ่าน', circle(12, 12, 10, true), p('m8 12 3 3 5-5.5'));
add('circle-x', 'error,fail,close,cancel,wrong,ผิดพลาด,ล้มเหลว,ยกเลิก', circle(12, 12, 10, true), p('m9 9 6 6'), p('m15 9-6 6'));
add('circle-exclamation-point', 'alert,error,warning,attention,important,แจ้งเตือน,ข้อผิดพลาด,สำคัญ', circle(12, 12, 10, true), p('M12 7.5V13'), p('M12 16.5h.01'));
add('info', 'info,information,about,help,details,ข้อมูล,รายละเอียด', circle(12, 12, 10, true), p('M12 16.5V11'), p('M12 7.5h.01'));
add(
  'triangle-exclamation-point',
  'warning,alert,caution,danger,attention,คำเตือน,ระวัง,อันตราย',
  // Rounding eats into 60° corners, so the vertices sit past the live area; the drawn
  // outline ends up ~3.75–20 tall and ~3.5–20.5 wide, like the circle keyline.
  p(roundedPolygon([[12, 1.75], [22.25, 20], [1.75, 20]], 2), true),
  p('M12 9.5V14'),
  p('M12 17h.01'),
);
// Three quarters of a circle; spins in CSS. Starts at the top so rotation reads evenly.
add('loader-circle', 'loading,spinner,progress,wait,busy,กำลังโหลด,รอ', p('M12 3a9 9 0 1 0 9 9'));

// ── Places ───────────────────────────────────────────────────────────────────────────────
add(
  'house',
  'home,house,main,start,dashboard,บ้าน,หน้าแรก',
  p(roundedPolygon([[12, 3], [20, 9.75], [20, 20.5], [4, 20.5], [4, 9.75]], [2, 1.5, 3, 3, 1.5]), true),
  p('M9.5 20.5V16a2.5 2.5 0 0 1 5 0v4.5'),
);

// ── Theme & visibility ───────────────────────────────────────────────────────────────────
add('sun', 'sun,light,light mode,day,bright,theme,สว่าง,กลางวัน,ธีม', circle(12, 12, 4, true), ...rays(12, 12, 7, 9, 8).map((d) => p(d)));
add(
  'moon',
  'moon,dark,dark mode,night,theme,มืด,กลางคืน,ธีม',
  // Outer arc on a circle through both tips; the inner edge bows back towards the centre.
  p('M20 14.5A8.73 8.73 0 1 1 9.5 4A8 8 0 0 0 20 14.5Z', true),
);

// Eye: four cubics with pointed corners at x 2.5 and 21.5 (softened by the round join).
const EYE = {
  ul: [[2.5, 12], [4.6, 7.6], [8, 5], [12, 5]],
  ur: [[12, 5], [16, 5], [19.4, 7.6], [21.5, 12]],
  lr: [[21.5, 12], [19.4, 16.4], [16, 19], [12, 19]],
  ll: [[12, 19], [8, 19], [4.6, 16.4], [2.5, 12]],
};
add(
  'eye',
  'eye,show,visible,view,watch,preview,ดู,แสดง,มองเห็น',
  p(cubicPath(EYE.ul) + cubicTo(EYE.ur) + cubicTo(EYE.lr) + cubicTo(EYE.ll) + 'Z', true),
  circle(12, 12, 3),
);
{
  // Eye-off: the outline is cut where the slash crosses it, leaving clear space either side.
  const a = [3.5, 3.5];
  const b = [20.5, 20.5];
  const gap = 2.75; // from the slash's centreline: 0.875 + 0.875 half-strokes + 1 clear
  const near = (pt) => distToLine(pt, a, b) < gap;
  const tUlEnd = findT(EYE.ul, near, 0, 1); // left piece stops before the slash
  const tUlStart = findT(EYE.ul, near, 1, 0); // right piece starts after it
  const tLrEnd = findT(EYE.lr, near, 0, 1);
  const tLrStart = findT(EYE.lr, near, 1, 0);
  const ulLeft = splitCubic(EYE.ul, tUlEnd)[0];
  const ulRight = splitCubic(EYE.ul, tUlStart)[1];
  const lrTop = splitCubic(EYE.lr, tLrEnd)[0];
  const lrBottom = splitCubic(EYE.lr, tLrStart)[1];
  add(
    'eye-off',
    'eye off,hide,hidden,invisible,private,ซ่อน,ไม่แสดง,มองไม่เห็น',
    p(cubicPath(ulRight) + cubicTo(EYE.ur) + cubicTo(lrTop), true),
    p(cubicPath(lrBottom) + cubicTo(EYE.ll) + cubicTo(ulLeft), true),
    p(`M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`),
  );
}

for (const [name, { tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/core/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons to icons/core/`);
