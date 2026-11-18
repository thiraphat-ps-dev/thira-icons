// Batch 14a worksheet: laptop, tablet, tv, speaker, mouse, usb, bluetooth, battery-charging, webcam, router.
//   node explore/batch-14a.mjs
import { writeFileSync } from 'node:fs';
import { f, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;

// Reviewer redraw: an open screen on a flat line read as an upturned box; the screen now sits on a
// keyboard deck (a trapezoid that flares out), which is what makes a laptop. No brand names in tags.
add('laptop', 'laptop,notebook,computer,portable,แล็ปท็อป,โน้ตบุ๊ก,คอมพิวเตอร์,เครื่องพกพา',
  p('M4.5 15.5V7a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v8.5', true),
  p(roundedPolygon([[4.5, 15.5], [19.5, 15.5], [21.5, 20], [2.5, 20]], 1)));

add('tablet', 'tablet,ipad,device,touch,screen,แท็บเล็ต,ไอแพด,อุปกรณ์,หน้าจอสัมผัส',
  rect(4, 2.5, 16, 19, 4, true), p('M12 18h.01'));

add('tv', 'tv,television,screen,broadcast,antenna,ทีวี,โทรทัศน์,จอ,เสาอากาศ',
  rect(2.5, 8, 19, 12.5, 3, true), p('M12 8L8.5 3.5'), p('M12 8L15.5 3.5'));

add('speaker', 'speaker,audio,sound,woofer,music,loudspeaker,ลำโพง,เสียง,เพลง,เครื่องเสียง',
  rect(5, 2.5, 14, 19, 3, true), circle(12, 14.5, 3.5), p('M12 7h.01'));

add('mouse', 'mouse,cursor,pointer,click,peripheral,เมาส์,เมาท์,คลิก,เคอร์เซอร์',
  p('M12 2.5a5.5 5.5 0 0 1 5.5 5.5v8a5.5 5.5 0 0 1-11 0V8A5.5 5.5 0 0 1 12 2.5z', true), p('M12 7v3.5'));

add('usb', 'usb,connector,plug,port,cable,data,ยูเอสบี,พอร์ต,สายเชื่อมต่อ,ปลั๊ก',
  p('M12 17.75V4.5'), p('M9.5 7L12 4.5L14.5 7'), circle(12, 19.5, 1.75),
  p('M12 16.5L6.5 14V11.75'), circle(6.5, 10, 1.75),
  p('M12 14.5H18V12.5'), rect(16, 8.5, 4, 4, 1, true));

add('bluetooth', 'bluetooth,wireless,pair,connect,device,บลูทูธ,ไร้สาย,เชื่อมต่อ,จับคู่',
  p('M7 7.5L17 16.5L12 21V3L17 7.5L7 16.5'));

{
  add('battery-charging', 'battery charging,charge,plug in,power,energy,charging,กำลังชาร์จ,ชาร์จแบต,แบตเตอรี่,พลังงาน',
    rect(2.5, 6.5, 16, 11, 3, true), p('M18.5 10h1.5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1.5'), p('M11.75 8.5L8.75 12.5H12.25L9.25 15.5'));
}

add('webcam', 'webcam,camera,video call,stream,meeting,เว็บแคม,กล้อง,วิดีโอคอล,ประชุม',
  circle(12, 9.5, 7.5, true), circle(12, 9.5, 2.5), p('M12 17v3.5'), p('M8 20.5h8'));

add('router', 'router,wifi,modem,network,internet,เราเตอร์,โมเด็ม,เครือข่าย,อินเทอร์เน็ต',
  rect(2.5, 12.5, 19, 8, 2, true), p('M7 12.5V5.5'), p('M17 12.5V5.5'),
  p('M6.5 16.5h.01'), p('M10 16.5h.01'), p('M13.5 16.5h.01'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
