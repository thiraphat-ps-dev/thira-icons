// Batch 9c worksheet: banknote, coins, piggy-bank, landmark, presentation, file-spreadsheet,
// clipboard-list, id-card, badge-check, scale.   node explore/batch-9c.mjs
import { writeFileSync } from 'node:fs';
import { f, onCircle, arcPieces } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

add('banknote', 'banknote,cash,money,bill,note,payment,ธนบัตร,เงินสด,เงิน,แบงก์',
  rect(2, 5.5, 20, 13, 3, true), circle(12, 12, 2.5), p('M6 12h.01'), p('M18 12h.01'));

// coins: front coin + back coin, the back one cut where it would meet the front.
{
  const front = [8.5, 15.5], back = [15, 9], r = 6;
  const keep = ([x, y]) => Math.hypot(x - front[0], y - front[1]) >= r + 2.75; // final review: same 2.75 cut as the slash rule, so more of the back coin shows
  add('coins', 'coins,money,cash,change,currency,savings,เหรียญ,เงิน,เงินทอน,เงินออม',
    circle(front[0], front[1], r, true), p('M7.25 13.5 9 12.5v6'), // a small "1": a coin's face value
    ...arcPieces(back[0], back[1], r, 0, 360, keep).map((d) => p(d)));
  // (the front coin's vertical mark was dropped in the final review: ring + bar read as a power button)
}

add('piggy-bank', 'piggy bank,savings,save,money,pig,deposit,กระปุกออมสิน,หมู,เงินออม,ออม',
  p('M10.5 6H14L16 3.75L17.25 6.5C19.5 7.25 21 9.25 21 11.75V13.5a2 2 0 0 1-2 2H18.5V19a1.5 1.5 0 0 1-3 0V17.5H9V19a1.5 1.5 0 0 1-3 0V17.5C3.5 16 3 13.5 3.5 11C4 8 7 6 10.5 6Z', true),
  p('M8.5 10h4'), p('M17.5 11h.01'));

add('landmark', 'landmark,bank,government,museum,court,institution,ธนาคาร,สถาบัน,ราชการ,พิพิธภัณฑ์',
  p('M3 9.5L12 3.5L21 9.5Z', true), p('M6.5 13v4.5'), p('M12 13v4.5'), p('M17.5 13v4.5'), p('M3 20.5h18'));

add('presentation', 'presentation,slides,board,chart,meeting,report,present,นำเสนอ,สไลด์,กระดาน,ประชุม',
  rect(3, 3.5, 18, 12, 3, true), p('M7.5 12L10.5 9L13 11L16.5 7.5'), p('M12 15.5V21'), p('M8.5 21h7'));

add('file-spreadsheet', 'file,spreadsheet,excel,table,sheet,csv,data,ไฟล์,สเปรดชีต,ตาราง,ข้อมูล',
  p('M8 2.5L13.38 2.5A1.5 1.5 0 0 1 14.44 2.94L19.56 8.06A1.5 1.5 0 0 1 20 9.12L20 17.5A4 4 0 0 1 16 21.5L8 21.5A4 4 0 0 1 4 17.5L4 6.5A4 4 0 0 1 8 2.5Z', true),
  p('M14 2.5V6.5a2 2 0 0 0 2 2h4'),
  rect(7, 11.5, 10, 6.5, 2), p('M7 14.75h10'), p('M12 11.5v6.5'));

const board = 'M9 4H8a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1';
add('clipboard-list', 'clipboard,list,tasks,checklist,todo,plan,รายการ,คลิปบอร์ด,งาน,สิ่งที่ต้องทำ',
  p(board, true), rect(9, 2, 6, 4, 1.5),
  p('M8.5 10.5h.01'), p('M12 10.5h4'), p('M8.5 14.5h.01'), p('M12 14.5h4'), p('M8.5 18.5h.01'), p('M12 18.5h4'));

add('id-card', 'id card,identity,badge,employee,member,license,บัตรประจำตัว,บัตรพนักงาน,บัตร,ตัวตน',
  rect(2, 5, 20, 14, 3, true), circle(8, 10.5, 1.75), p('M5 16a3 3 0 0 1 6 0'),
  p('M14 10h4'), p('M14 14h4'));

// badge-check: 8-bump scalloped badge (arcs between valleys on r 8.2) with the check inside.
{
  const R = 8, ar = 3.1, n = 8;
  let d = '';
  for (let k = 0; k <= n; k++) {
    const q = onCircle(12, 12, R, 22.5 + 45 * k);
    d += k === 0 ? `M${pt(q)}` : `A${f(ar)} ${f(ar)} 0 0 1 ${pt(q)}`;
  }
  add('badge-check', 'badge,check,verified,certified,approved,trusted,ยืนยันแล้ว,ตรา,รับรอง,น่าเชื่อถือ',
    p(d + 'Z', true), p('m8.5 12.25 2.5 2.5 4.5-5'));
}

add('scale', 'scale,balance,justice,law,compare,weigh,fair,ตาชั่ง,ความยุติธรรม,กฎหมาย,เปรียบเทียบ',
  p('M12 4.5V20.5'), p('M8 20.5h8'), p('M5.5 7h13'),
  p('M2.5 13.5L5.5 7L8.5 13.5'), p('M15.5 13.5L18.5 7L21.5 13.5'),
  p('M2.5 13.5h6a3 3 0 0 1-6 0Z', true), p('M15.5 13.5h6a3 3 0 0 1-6 0Z', true));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
