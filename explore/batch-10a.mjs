// Batch 10a worksheet: diagonal arrows, arrow-left-right, corner-up-left/right, chevron-first/last, undo, redo.
//   node explore/batch-10a.mjs
import { writeFileSync } from 'node:fs';
import { f } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d) => `<path d="${d}" />`;

// Path ops in absolute coords: ['M',x,y] ['L',x,y] ['A',r,x,y,sweep]
// T maps a point; reflect = true flips arc sweeps.
function build(ops, T, reflect = false) {
  return ops.map(([c, ...a]) => {
    if (c === 'A') {
      const [r, x, y, sw] = a; const [X, Y] = T(x, y);
      return `A${f(r)} ${f(r)} 0 0 ${reflect ? 1 - sw : sw} ${f(X)} ${f(Y)}`;
    }
    const [X, Y] = T(a[0], a[1]);
    return `${c}${f(X)} ${f(Y)}`;
  }).join('');
}
const ID = (x, y) => [x, y];
const MX = (x, y) => [24 - x, y];
const MY = (x, y) => [x, 24 - y];
const R180 = (x, y) => [24 - x, 24 - y];
const R90 = (x, y) => [24 - y, x];
const TR = (x, y) => [y, x];

// arrow-up-right base
const uprShaft = [['M', 7, 17], ['L', 17, 7]];
const uprHead = [['M', 8.5, 7], ['L', 17, 7], ['L', 17, 15.5]];
const diag = (name, tags, T, refl) =>
  add(name, tags, p(build(uprShaft, T, refl)), p(build(uprHead, T, refl)));
diag('arrow-down-right', 'arrow,down right,diagonal,southeast,ลูกศร,ลง,ขวาล่าง', MY, true);
diag('arrow-down-left', 'arrow,down left,diagonal,southwest,ลูกศร,ลง,ซ้ายล่าง', R180, false);
diag('arrow-up-left', 'arrow,up left,diagonal,northwest,ลูกศร,ขึ้น,ซ้ายบน', MX, true);

// arrow-left-right = arrow-up-down rotated 90deg
const udShaft1 = [['M', 7, 20], ['L', 7, 4]];
const udHead1 = [['M', 3, 8], ['L', 7, 4], ['L', 11, 8]];
const udShaft2 = [['M', 17, 4], ['L', 17, 20]];
const udHead2 = [['M', 13, 16], ['L', 17, 20], ['L', 21, 16]];
add('arrow-left-right', 'arrow,left,right,swap,transfer,exchange,horizontal,สลับ,ซ้ายขวา,โอนย้าย',
  ...[udShaft1, udHead1, udShaft2, udHead2].map((o) => p(build(o, R90))));

// corner-down-left transposed -> arrow points up
const cdlLine = [['M', 20, 4], ['L', 20, 11], ['A', 4, 16, 15, 1], ['L', 4, 15]];
const cdlHead = [['M', 9, 10], ['L', 4, 15], ['L', 9, 20]];
add('corner-up-right', 'arrow,corner,up,right,turn,ลูกศร,เลี้ยว,ขึ้น,ขวา',
  p(build(cdlLine, TR, true)), p(build(cdlHead, TR, true)));
const MXT = (x, y) => [24 - y, x]; // mirror of transposed in x
add('corner-up-left', 'arrow,corner,up,left,turn,ลูกศร,เลี้ยว,ขึ้น,ซ้าย',
  p(build(cdlLine, MXT, false)), p(build(cdlHead, MXT, false)));

// chevrons with a bar
add('chevron-first', 'chevron,first,start,beginning,skip back,หน้าแรก,เริ่มต้น,ข้ามไปแรกสุด',
  p('m17.5 5-7 7 7 7'), p('M6.5 5v14'));
add('chevron-last', 'chevron,last,end,skip forward,หน้าสุดท้าย,สุดท้าย,ข้ามไปท้ายสุด',
  p('m6.5 5 7 7-7 7'), p('M17.5 5v14'));

// undo / redo: single-stroke U-turn
const uturn = [['M', 18.5, 19], ['L', 18.5, 11.5], ['A', 6.5, 5.5, 11.5, 0], ['L', 5.5, 15.5]];
const uHead = [['M', 2.5, 12.5], ['L', 5.5, 15.5], ['L', 8.5, 12.5]];
add('undo', 'undo,back,revert,u-turn,history,เลิกทำ,ย้อนกลับ,วกกลับ',
  p(build(uturn, ID)), p(build(uHead, ID)));
add('redo', 'redo,forward,repeat,u-turn,history,ทำซ้ำ,ทำใหม่,วกกลับ',
  p(build(uturn, MX, true)), p(build(uHead, MX, true)));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
