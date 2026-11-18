// Batch 11c worksheet: folder-check, folder-x, file-image, file-down, file-up, files, cloud-download, cloud-off, link-2, hard-drive-download.
//   node explore/batch-11c.mjs
import { writeFileSync } from 'node:fs';
import { cubicAt, distToLine, f, roundedPolygon, splitCubic } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

// ── folder-check / folder-x: folder-plus's cut base, badge in the zone.
const FOLDER = p('M21.5 12.5V10.5A3 3 0 0 0 18.5 7.5L11.48 7.5A1 1 0 0 1 10.7 7.12L9.3 5.38A1 1 0 0 0 8.52 5L5.5 5A3 3 0 0 0 2.5 8L2.5 16.5A3 3 0 0 0 5.5 19.5L11.7 19.5', true);
add('folder-check', 'folder check,folder done,verified folder,approved directory,โฟลเดอร์ผ่าน,ตรวจแล้ว,แฟ้มยืนยัน', FOLDER, p('m15 17.75 2.25 2.25 3.75-4'));
add('folder-x', 'folder x,delete folder,invalid folder,failed directory,ลบโฟลเดอร์,โฟลเดอร์ผิดพลาด,แฟ้มไม่ถูกต้อง', FOLDER, p('m16 16 4 4'), p('m20 16-4 4'));

// ── file-based: file.svg's exact outline + fold.
const FILE = [
  p('M8 2.5L13.38 2.5A1.5 1.5 0 0 1 14.44 2.94L19.56 8.06A1.5 1.5 0 0 1 20 9.12L20 17.5A4 4 0 0 1 16 21.5L8 21.5A4 4 0 0 1 4 17.5L4 6.5A4 4 0 0 1 8 2.5Z', true),
  p('M14 2.5V6.5a2 2 0 0 0 2 2h4'),
];
add('file-image', 'file image,image file,picture file,photo document,ไฟล์รูปภาพ,ไฟล์ภาพ,เอกสารรูป', ...FILE,
  // Reviewer redraw: image.svg's own sun and hill (the hill runs from the right edge into the
  // bottom-left corner), so it reads as a picture — the small chevron read as a caret.
  '<circle cx="9" cy="9" r="1.5" />', p('M20 15.5l-3.1-3.1a2 2 0 0 0-2.83 0L5.17 20.33'));
add('file-down', 'file down,download file,save document,get file,ดาวน์โหลดไฟล์,บันทึกไฟล์,รับไฟล์', ...FILE,
  p('M12 11.5v6'), p('m9.25 14.75 2.75 2.75 2.75-2.75'));
add('file-up', 'file up,upload file,send document,attach file,อัปโหลดไฟล์,ส่งไฟล์,แนบไฟล์', ...FILE,
  p('M12 17.5v-6'), p('m9.25 14.25 2.75-2.75 2.75 2.75'));

// ── files: a smaller file.svg in front, the back sheet peeking out top-right, 2-unit gap.
add('files', 'files,multiple files,documents,copy,duplicate,หลายไฟล์,เอกสารหลายฉบับ,คัดลอกไฟล์',
  p(roundedPolygon([[3.5, 7], [11.5, 7], [16.5, 12], [16.5, 21.5], [3.5, 21.5]], [3, 1.25, 1.25, 3, 3]), true),
  p('M11.5 7v2.5a2 2 0 0 0 2 2h3'),
  p('M7.5 3.25H17.25a3 3 0 0 1 3 3V15'));

// ── cloud-download: cloud-upload's cloud with the base opened wide, arrow pointing down through it.
const CLOUD_OPEN = 'M6.75 19.5A4.5 4.5 0 0 1 6 10.56A6 6 0 0 1 17.94 9.64A5 5 0 0 1 16.75 19.5';
add('cloud-download', 'cloud download,download from cloud,sync down,restore,get from cloud,ดาวน์โหลดจากคลาวด์,กู้คืนข้อมูล,ซิงก์',
  p(CLOUD_OPEN, true), p('M12 11v9.5'), p('m9.5 18 2.5 2.5 2.5-2.5'));

// ── cloud-off: cloud.svg cut 2.75 back from the standard slash.
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
      if (b < 1) { pieces.push(cur); cur = null; }
    };
    for (let k = 0; k <= N; k++) {
      const t = k / N, ok = keep(seg.at(t));
      if (ok && start === null) start = t;
      if (!ok && start !== null) { close(start, (k - 1) / N); start = null; }
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
{
  const a = [3.5, 3.5], b = [20.5, 20.5];
  const cloudSegs = [
    arc([6.75, 19.5], [6, 10.56], 4.5, 1),
    arc([6, 10.56], [17.94, 9.64], 6, 1),
    arc([17.94, 9.64], [16.75, 19.5], 5, 1),
    line([16.75, 19.5], [6.75, 19.5]),
  ];
  add('cloud-off', 'cloud off,offline,no connection,disconnected,no sync,ออฟไลน์,ไม่มีสัญญาณ,ปิดคลาวด์',
    ...clipClosed(cloudSegs, (q) => distToLine(q, a, b) >= 2.75).map((d) => p(d, true)), p(`M${pt(a)}L${pt(b)}`));
}

// ── link-2: slimmer, rounder half-loops than link.svg, ends apart, straight bar between.
add('link-2', 'link 2,chain,connect,url,short link,join,ลิงก์,เชื่อมต่อ,โซ่',
  p('M10 8H6a4 4 0 0 0 0 8h4'), p('M14 8h4a4 4 0 0 1 0 8h-4'), p('M8 12h8'));

// ── hard-drive-download: a flatter drive box with the arrow landing on its top edge.
add('hard-drive-download', 'hard drive download,save to disk,disk download,backup to drive,บันทึกลงดิสก์,ดาวน์โหลดลงไดรฟ์,สำรองข้อมูล',
  '<rect x="2.5" y="13.5" width="19" height="8" rx="2" data-duotone />',
  p('M12 2.75v10.75'), p('m8.5 10 3.5 3.5 3.5-3.5'), p('M7 17.5h.01'), p('M10.5 17.5h.01'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
