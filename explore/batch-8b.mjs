// Batch 8b worksheet: phone-call, phone-off, video-off, megaphone, rss, smile, frown, thumbs-down, hand, messages-square.
//   node explore/batch-8b.mjs
import { writeFileSync } from 'node:fs';
import { cubicAt, distToLine, f, onCircle, roundedPolygon, splitCubic } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

// ── path clipping: segments (line / arc / cubic) are cut away where they come within `clear` of a slash.
const line = (a, b) => {
  const at = (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  return { at, cmd: (t0, t1) => `L${pt(at(t1))}` };
};
const arc = (a, b, r, sweep) => {
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const h = Math.sqrt(r * r - (d / 2) ** 2) * (sweep ? 1 : -1);
  const c = [m[0] + (h * -(b[1] - a[1])) / d, m[1] + (h * (b[0] - a[0])) / d];
  const a0 = Math.atan2(a[1] - c[1], a[0] - c[0]);
  let da = Math.atan2(b[1] - c[1], b[0] - c[0]) - a0;
  if (sweep && da < 0) da += 2 * Math.PI;
  if (!sweep && da > 0) da -= 2 * Math.PI;
  const at = (t) => [c[0] + r * Math.cos(a0 + da * t), c[1] + r * Math.sin(a0 + da * t)];
  return { at, cmd: (t0, t1) => `A${f(r)} ${f(r)} 0 0 ${sweep} ${pt(at(t1))}` };
};
const cubic = (c) => ({
  at: (t) => cubicAt(c, t),
  cmd: (t0, t1) => {
    const right = t0 > 0 ? splitCubic(c, t0)[1] : c;
    const tt = t0 > 0 ? (t1 - t0) / (1 - t0) : t1;
    const q = tt < 1 ? splitCubic(right, tt)[0] : right;
    return `C${pt(q[1])} ${pt(q[2])} ${pt(q[3])}`;
  },
});
function clipClosed(segs, keep, N = 4000) {
  const pieces = [];
  let cur = null;
  segs.forEach((seg, i) => {
    let start = null;
    const close = (a, b) => {
      if (a === 0 && cur) cur.d += seg.cmd(a, b);
      else {
        if (cur) pieces.push(cur);
        cur = { d: `M${pt(seg.at(a))}${seg.cmd(a, b)}`, first: i === 0 && a === 0 };
      }
      cur.end = b === 1;
      if (b < 1) {
        pieces.push(cur);
        cur = null;
      }
    };
    for (let k = 0; k <= N; k++) {
      const t = k / N, ok = keep(seg.at(t));
      if (ok && start === null) start = t;
      if (!ok && start !== null) {
        close(start, (k - 1) / N);
        start = null;
      }
    }
    if (start !== null) close(start, 1);
    else if (cur && !cur.end) cur = null;
  });
  if (cur) pieces.push(cur);
  if (pieces.length > 1 && pieces[0].first && pieces.at(-1).end) {
    const last = pieces.pop();
    pieces[0].d = last.d + pieces[0].d.replace(/^M[^A-Z]*/, '');
  }
  return pieces.map((x) => x.d);
}
const slashA = [3.5, 3.5], slashB = [20.5, 20.5];
const clearOfSlash = (q) => distToLine(q, slashA, slashB) >= 2.75;
const slash = p(`M${pt(slashA)}L${pt(slashB)}`);

// ── phone, as segments (same outline as phone.svg).
const phoneSegs = [
  line([8.6, 3.5], [6, 3.5]),
  arc([6, 3.5], [3.5, 6], 2.5, 0),
  cubic([[3.5, 6], [3.5, 14], [10, 20.5], [18, 20.5]]),
  arc([18, 20.5], [20.5, 18], 2.5, 0),
  line([20.5, 18], [20.5, 15.4]),
  arc([20.5, 15.4], [19.8, 14.45], 1, 0),
  line([19.8, 14.45], [16.4, 13.35]),
  arc([16.4, 13.35], [15.4, 13.6], 1, 0),
  line([15.4, 13.6], [13.8, 15.2]),
  arc([13.8, 15.2], [8.3, 9.7], 12, 1),
  line([8.3, 9.7], [9.9, 8.1]),
  arc([9.9, 8.1], [10.15, 7.1], 1, 0),
  line([10.15, 7.1], [9.55, 4.2]),
  arc([9.55, 4.2], [8.6, 3.5], 1, 0),
];
const phoneD =
  'M8.6 3.5H6A2.5 2.5 0 0 0 3.5 6c0 8 6.5 14.5 14.5 14.5a2.5 2.5 0 0 0 2.5-2.5v-2.6a1 1 0 0 0-.7-.95l-3.4-1.1a1 1 0 0 0-1 .25l-1.6 1.6a12 12 0 0 1-5.5-5.5l1.6-1.6a1 1 0 0 0 .25-1L9.55 4.2a1 1 0 0 0-.95-.7z';

// ── phone-call: phone.svg + two sound arcs at the top-right (concentric, like bell-ring).
{
  const C = [13, 11];
  const sound = (r, a, b) => `M${pt(onCircle(...C, r, a))}A${r} ${r} 0 0 1 ${pt(onCircle(...C, r, b))}`;
  add('phone-call', 'phone call,calling,ringing,telephone,dial,โทรออก,สายเรียกเข้า,โทรศัพท์',
    p(phoneD, true), p(sound(5, 20, 70)), p(sound(9, 20, 70)));
}

// ── phone-off: the one exception to the standard slash. The handset lies along the 3.5,3.5 → 20.5,20.5
// diagonal, so that slash cut it to an unreadable arc; the opposite diagonal crosses it instead.
{
  const a = [20.5, 3.5], b = [3.5, 20.5];
  add('phone-off', 'phone off,hang up,end call,no phone,disconnected,วางสาย,ตัดสาย,ปิดโทรศัพท์',
    ...clipClosed(phoneSegs, (q) => distToLine(q, a, b) >= 2.75).map((d) => p(d, true)), p(`M${pt(a)}L${pt(b)}`));
}

// ── video-off
{
  const x0 = 2.5, y0 = 6, x1 = 13.5, y1 = 18, r = 3;
  const rectSegs = [
    line([x0 + r, y0], [x1 - r, y0]), arc([x1 - r, y0], [x1, y0 + r], r, 1),
    line([x1, y0 + r], [x1, y1 - r]), arc([x1, y1 - r], [x1 - r, y1], r, 1),
    line([x1 - r, y1], [x0 + r, y1]), arc([x0 + r, y1], [x0, y1 - r], r, 1),
    line([x0, y1 - r], [x0, y0 + r]), arc([x0, y0 + r], [x0 + r, y0], r, 1),
  ];
  add('video-off', 'video off,camera off,no video,mute camera,hide video,ปิดกล้อง,ปิดวิดีโอ,กล้องวิดีโอ',
    ...clipClosed(rectSegs, clearOfSlash).map((d) => p(d, true)),
    p('M17.89 11.04L19.86 9.38A1 1 0 0 1 21.5 10.15L21.5 13.85A1 1 0 0 1 19.86 14.62L17.89 12.96A1.25 1.25 0 0 1 17.89 11.04Z'),
    slash);
}

// ── megaphone: cone opening right, short handle under the mouthpiece.
add('megaphone', 'megaphone,announce,broadcast,loudspeaker,promote,ประกาศ,โฆษณา,โทรโข่ง',
  p(roundedPolygon([[3, 9.5], [18, 4.5], [18, 19.5], [3, 15.5]], [1.5, 2, 2, 1.5]), true),
  p('M7 16.6V19a1.5 1.5 0 0 0 1.5 1.5H11'));

// ── rss: dot + two quarter arcs, centre bottom-left.
{
  const [cx, cy] = [4.5, 19.5];
  add('rss', 'rss,feed,subscribe,broadcast,news,ฟีด,ติดตาม,สมัครรับข่าว',
    circle(cx, cy, 1),
    p(`M${cx} ${cy - 8}A8 8 0 0 1 ${cx + 8} ${cy}`),
    p(`M${cx} ${cy - 15}A15 15 0 0 1 ${cx + 15} ${cy}`));
}

// ── smile / frown: r10 ring, two eye dots, mouth arc.
const eyes = [p('M9 9.5h.01'), p('M15 9.5h.01')];
add('smile', 'smile,happy,emoji,face,good mood,ยิ้ม,มีความสุข,อิโมจิ',
  circle(12, 12, 10, true), ...eyes, p('M8 14a5 5 0 0 0 8 0'));
add('frown', 'frown,sad,unhappy,emoji,face,bad mood,เศร้า,ไม่พอใจ,อิโมจิ',
  circle(12, 12, 10, true), ...eyes, p('M8 16.5a5 5 0 0 1 8 0'));

// ── thumbs-down: thumbs-up.svg rotated 180° about the centre, done in code.
{
  const params = { M: 2, L: 2, H: 1, V: 1, A: 7, Z: 0 };
  const rot180 = (d) => {
    const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+/g);
    const parts = [];
    let i = 0;
    while (i < toks.length) {
      const cmd = toks[i++], up = cmd.toUpperCase(), rel = cmd !== up, n = params[up];
      parts.push(cmd);
      if (n === 0) continue;
      let first = true;
      do {
        const g = toks.slice(i, i + n).map(Number);
        i += n;
        const fl = (v) => (rel ? -v : 24 - v);
        const r = up === 'A' ? [g[0], g[1], g[2], g[3], g[4], fl(g[5]), fl(g[6])] : g.map(fl);
        parts.push((first ? '' : ' ') + r.map(f).join(' '));
        first = false;
      } while (i < toks.length && /^[-\d.]/.test(toks[i]));
    }
    return parts.join('');
  };
  add('thumbs-down', 'dislike,thumbs down,disapprove,bad,disagree,ไม่ถูกใจ,ไม่เห็นด้วย,แย่',
    p(rot180('M6.5 10.5 10 3.5a2.5 2.5 0 0 1 3.5 2.6L13 10h5.6a2.5 2.5 0 0 1 2.4 3.1l-1.6 6A2.5 2.5 0 0 1 17 21H6.5z'), true),
    p(rot180('M6.5 10.5H4a1.5 1.5 0 0 0-1.5 1.5v7.5A1.5 1.5 0 0 0 4 21h2.5')));
}

// ── hand: open palm, four fingers sharing dividers, thumb out to the left.
{
  const w = 3.75, r = w / 2, xs = [6.5, 6.5 + w, 6.5 + 2 * w, 6.5 + 3 * w, 6.5 + 4 * w];
  const tops = [4.5, 2.75, 3.75, 6.25]; // outermost y of each fingertip
  const s = tops.map((t) => t + r); // where each straight side starts
  const cap = `a${f(r)} ${f(r)} 0 0 1 ${f(w)} 0`;
  // thumb: a capsule pointing up-left at 30° from horizontal, merged into the outline
  const k = Math.tan((30 * Math.PI) / 180), len = Math.hypot(1, k);
  const dir = [-1 / len, -k / len], nrm = [dir[1], -dir[0]]; // nrm points down-left
  const A = [10.5, 17.5], B = [A[0] + dir[0] * 7, A[1] + dir[1] * 7];
  const lo = (q) => [q[0] + nrm[0] * r, q[1] + nrm[1] * r], up = (q) => [q[0] - nrm[0] * r, q[1] - nrm[1] * r];
  const bottomX = lo(A)[0] + (21.5 - lo(A)[1]) / k;
  const joinY = up(B)[1] + (xs[0] - up(B)[0]) * k;
  console.log('thumb', pt(A), pt(B), bottomX, joinY);
  const d =
    `M${xs[0]} ${f(joinY)}V${f(s[0])}${cap}V${f(s[1])}${cap}V${f(s[2])}${cap}V${f(s[3])}${cap}V14` +
    `A7.5 7.5 0 0 1 14 21.5H${f(bottomX)}L${pt(lo(B))}A${f(r)} ${f(r)} 0 0 1 ${pt(up(B))}Z`;
  add('hand', 'hand,palm,stop,wave,high five,มือ,ฝ่ามือ,หยุด',
    p(d, true),
    p(`M${f(xs[1])} ${f(s[0])}V12`), p(`M${f(xs[2])} ${f(s[1])}V12`), p(`M${f(xs[3])} ${f(s[2])}V12`));
}

// ── messages-square: message-square (smaller) + a second bubble peeking behind, top-right, 4 apart.
add('messages-square', 'messages,chat,conversation,discussion,replies,comments,ข้อความ,แชท,สนทนา,ความคิดเห็น',
  p(roundedPolygon([[3, 7], [17, 7], [17, 17], [7, 17], [3, 21]], [3, 3, 3, 1, 1]), true),
  p('M7.5 3H17a4 4 0 0 1 4 4v6'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
