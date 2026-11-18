// Batch 8c worksheet: cpu, hard-drive, git-merge, git-pull-request, git-commit-horizontal, file-code,
// key, fingerprint, qr-code, plug.   node explore/batch-8c.mjs
import { writeFileSync } from 'node:fs';
import { f, onCircle } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;
const arc = (cx, cy, r, from, to) =>
  `M${pt(onCircle(cx, cy, r, from))}A${f(r)} ${f(r)} 0 ${to - from > 180 ? 1 : 0} 1 ${pt(onCircle(cx, cy, r, to))}`;

add('cpu', 'cpu,processor,chip,hardware,microchip,compute,ซีพียู,หน่วยประมวลผล,ชิป,ฮาร์ดแวร์',
  rect(5, 5, 14, 14, 3, true), rect(9, 9, 6, 6, 2),
  p('M9.5 2.5V5'), p('M14.5 2.5V5'), p('M9.5 19v2.5'), p('M14.5 19v2.5'),
  p('M2.5 9.5H5'), p('M2.5 14.5H5'), p('M19 9.5h2.5'), p('M19 14.5h2.5'));

add('hard-drive', 'hard drive,disk,hdd,ssd,storage,drive,ฮาร์ดดิสก์,ดิสก์,ที่เก็บข้อมูล,หน่วยความจำ',
  rect(2.5, 4, 19, 16, 4, true), p('M2.5 12h19'), p('M7 16h.01'), p('M10.5 16h.01'));

// Git family: node rings r 2.5 as in git-branch.
add('git-merge', 'git,merge,combine,join,version control,รวม,ผสาน,เวอร์ชัน,สาขา',
  circle(6, 5.5, 2.5, true), circle(6, 18.5, 2.5, true), circle(18, 5.5, 2.5, true),
  p('M6 8v8'), p('M18 8v1a3 3 0 0 1-3 3H6'));

add('git-pull-request', 'git,pull request,pr,merge request,review,version control,พูลรีเควสต์,รีวิว,เวอร์ชัน,สาขา',
  circle(6, 5.5, 2.5, true), circle(6, 18.5, 2.5, true), circle(18, 18.5, 2.5, true),
  p('M6 8v8'), p('M18 16V10a3 3 0 0 0-3-3h-2.5'), p('M15 4.5L12.5 7L15 9.5'));

add('git-commit-horizontal', 'git,commit,save,checkpoint,version control,คอมมิต,บันทึก,เวอร์ชัน,จุดบันทึก',
  circle(12, 12, 2.5, true), p('M2.5 12h7'), p('M14.5 12h7'));

add('file-code', 'file,code,source,script,document,developer,ไฟล์,โค้ด,ซอร์สโค้ด,สคริปต์',
  p('M8 2.5L13.38 2.5A1.5 1.5 0 0 1 14.44 2.94L19.56 8.06A1.5 1.5 0 0 1 20 9.12L20 17.5A4 4 0 0 1 16 21.5L8 21.5A4 4 0 0 1 4 17.5L4 6.5A4 4 0 0 1 8 2.5Z', true),
  p('M14 2.5V6.5a2 2 0 0 0 2 2h4'),
  p('M10 12.5L7.5 15L10 17.5'), p('M14 12.5L16.5 15L14 17.5'));

add('key', 'key,password,lock,access,unlock,secret,กุญแจ,รหัสผ่าน,ปลดล็อก,ความลับ',
  circle(12, 7, 4, true), p('M12 11v10.5'), p('M12 15.5h3.5'), p('M12 19.5h3.5'));

add('fingerprint', 'fingerprint,biometric,touch id,identity,security,login,ลายนิ้วมือ,ไบโอเมตริก,ยืนยันตัวตน,ความปลอดภัย',
  // Redrawn by the reviewer: two clean symmetric arches read as a rainbow/magnet. A print is
  // asymmetric ridges with breaks: an outer ridge broken at the upper right, a middle ridge, and a
  // centre ridge that sweeps down — all on centre (12, 12), 4 units apart.
  p('M4 17.5V12a8 8 0 0 1 14.93-4'), p('M20 12v2.5c0 2.2-.6 4.2-1.75 6'),
  p('M8 20.5V12a4 4 0 0 1 8 0v3.5'), p('M12 12v4c0 2 .75 3.75 2 5'));

add('qr-code', 'qr,qr code,scan,barcode,link,code,คิวอาร์,สแกน,บาร์โค้ด,ลิงก์',
  rect(3, 3, 7, 7, 2, true), rect(14, 3, 7, 7, 2, true), rect(3, 14, 7, 7, 2, true),
  p('M6.5 6.5h.01'), p('M17.5 6.5h.01'), p('M6.5 17.5h.01'),
  p('M14.5 14.5h.01'), p('M20 14.5h.01'), p('M17.25 20h.01'));

add('plug', 'plug,power,electric,socket,connect,integration,ปลั๊ก,ไฟฟ้า,เชื่อมต่อ,ปลั๊กอิน',
  p('M6 9.5A1.5 1.5 0 0 1 7.5 8h9A1.5 1.5 0 0 1 18 9.5V11a6 6 0 0 1-12 0z', true),
  p('M9 2.5V8'), p('M15 2.5V8'), p('M12 17v4.5'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
