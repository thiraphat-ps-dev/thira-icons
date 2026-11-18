// Batch 13b worksheet: cat, dog, bird, fish, rabbit, turtle, snail, feather, sprout, shell.
//   node explore/batch-13b.mjs
import { writeFileSync } from 'node:fs';
import { f, onCircle } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

add('cat', 'cat,kitten,pet,animal,feline,meow,แมว,ลูกแมว,สัตว์เลี้ยง,สัตว์',
  p('M5 4.5L9 7.5C10.5 7 13.5 7 15 7.5L19 4.5V12c0 4.5-3 8-7 8s-7-3.5-7-8Z', true),
  p('M9.25 12.5h.01'), p('M14.75 12.5h.01'));

add('dog', 'dog,puppy,pet,animal,canine,woof,สุนัข,หมา,ลูกหมา,สัตว์เลี้ยง,สัตว์',
  p('M12 4.5c3.5 0 5.5 2 5.5 5v3c0 3.5-2.5 6.5-5.5 6.5s-5.5-3-5.5-6.5v-3c0-3 2-5 5.5-5Z', true),
  p('M6.8 6C4 5 2.5 7 2.5 11c0 2 1 3 2.5 2.5 1.2-.4 1.5-2 1.5-3.5'),
  p('M17.2 6C20 5 21.5 7 21.5 11c0 2-1 3-2.5 2.5-1.2-.4-1.5-2-1.5-3.5'),
  p('M10 10.5h.01'), p('M14 10.5h.01'), p('M12 14.5h.01'));

add('bird', 'bird,tweet,animal,fly,wildlife,sparrow,นก,สัตว์,บิน,สัตว์ปีก',
  p('M2.5 10L6 8.5C6 5.5 8.5 4 11 4c3 0 5 2 5.5 5l5 6.5-6 2c-1 .8-2 1-3 1-4 0-6.5-3-6.5-7Z', true),
  p('M8.75 8h.01'), p('M10.5 18.5V21'), p('M13.75 18v3'));

add('fish', 'fish,seafood,aquarium,ocean,animal,sea,ปลา,อาหารทะเล,ตู้ปลา,ทะเล,สัตว์น้ำ',
  p('M2.5 12C5 8 9 7 12.5 7.5c2 .3 3.5 1.5 4.5 3L21.5 7v10L17 13.5c-1 1.5-2.5 2.7-4.5 3C9 17 5 16 2.5 12Z', true),
  p('M6.5 11.25h.01'), p('M10.5 10.5q1.5 1.5 0 3'));

add('rabbit', 'rabbit,bunny,hare,pet,animal,easter,กระต่าย,สัตว์เลี้ยง,สัตว์,อีสเตอร์',
  p('M5.5 15c0-2.5 1.5-4.5 3.5-5.5C7.5 7 7 4.5 8 3c1.2-1 2.2.5 2.5 2.5l.3 3.7c.7-.1 1.7-.1 2.4 0l.3-3.7c.3-2 1.3-3.5 2.5-2.5 1 1.5.5 4-1 6.5 2 1 3.5 3 3.5 5.5 0 3.5-3 6-6.5 6s-6.5-2.5-6.5-6Z', true),
  p('M9.75 15h.01'), p('M14.25 15h.01'), p('M12 17.5h.01'));

add('turtle', 'turtle,tortoise,animal,slow,reptile,sea,เต่า,สัตว์,สัตว์เลื้อยคลาน,ช้า',
  p('M2.5 16.5a7.5 7.5 0 0 1 15 0Z', true),
  p('M17.7 13.5c.2-2 1-3 2-3 1.3 0 1.8 1.2 1.8 2.5 0 1.5-1 3.5-2.5 3.5'),
  p('M6 16.5v3'), p('M13 16.5v3'),
  p('M20.25 12.5h.01'));

add('snail', 'snail,slow,shell,animal,garden,slug,หอยทาก,ช้า,สัตว์,สวน',
  p('M14 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Z', true),
  p('M7.5 17V11.5a2.25 2.25 0 0 0-4.5 0V18a2.5 2.5 0 0 0 2.5 2.5H19a2.5 2.5 0 0 0 2.5-2.5l-1.9-3.25'),
  p('M11.25 10.5a2.75 2.75 0 1 1 2.75 2.75'));

add('feather', 'feather,quill,light,write,bird,soft,ขนนก,ปากกาขนนก,เบา,เขียน',
  p('M20.5 3.5C15 4 10.5 7.5 8.5 12L7 17.5C10 19.5 14.5 19 16.5 16L14 13.5L18.5 11.5C20.5 9 21 6 20.5 3.5Z', true),
  p('M3.5 20.5L18 6'));

{
  // Leaf shape from leaf.svg, mapped base->tip (complex similarity; mirror for the right leaf).
  const base = [6.5, 17.5], tip = [19.5, 4.5];
  const leaf = [[6, 10], [11, 4.5], [20, 12.5], [15, 18]];
  const mapper = (B, T, mirror) => {
    const [vx, vy] = [tip[0] - base[0], tip[1] - base[1]];
    const [wx, wy] = [T[0] - B[0], T[1] - B[1]];
    const d = vx * vx + vy * vy;
    const mx = (wx * vx + wy * vy) / d, my = (wy * vx - wx * vy) / d;
    return ([x, y]) => {
      const [a, b] = [x - base[0], y - base[1]];
      let nx = B[0] + a * mx - b * my, ny = B[1] + a * my + b * mx;
      if (mirror) { const t = [nx - B[0], ny - B[1]], u = [(T[0] - B[0]), (T[1] - B[1])]; const L = u[0] ** 2 + u[1] ** 2; const k = (t[0] * u[0] + t[1] * u[1]) / L; const proj = [u[0] * k, u[1] * k]; nx = B[0] + 2 * proj[0] - t[0]; ny = B[1] + 2 * proj[1] - t[1]; }
      return [nx, ny];
    };
  };
  const mk = (B, T, mirror) => {
    const m = mapper(B, T, mirror);
    const [c1, c2, c3, c4] = leaf.map(m);
    return `M${pt(B)}C${pt(c1)} ${pt(c2)} ${pt(T)}C${pt(c3)} ${pt(c4)} ${pt(B)}Z`;
  };
  add('sprout', 'sprout,seedling,plant,grow,growth,new,garden,ต้นกล้า,งอก,เติบโต,พืช,ต้นอ่อน',
    p(mk([12, 12.5], [4, 4.5], false), true),
    p(mk([12, 12.5], [20, 4.5], true), true),
    p('M12 21V12.5'));
}

{
  const C = [12, 20.5], R = 13, P = (deg, r = R) => onCircle(C[0], C[1], r, deg);
  const j = [-45, -15, 15, 45].map((a) => P(a));
  const d = `M10 20.5L${pt(j[0])}A4 4 0 0 1 ${pt(j[1])}A4 4 0 0 1 ${pt(j[2])}A4 4 0 0 1 ${pt(j[3])}L14 20.5Z`;
  const rib = (a) => `M${pt(onCircle(C[0], C[1], 4.5, a))}L${pt(onCircle(C[0], C[1], 9, a))}`;
  add('shell', 'shell,seashell,scallop,beach,ocean,sea,summer,เปลือกหอย,หอยพัด,ชายหาด,ทะเล',
    p(d, true), p(rib(-15)), p(rib(15)));
}

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
