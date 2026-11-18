// Batch 3 worksheet: time, data, devices & media, commerce. Writes icons/core/*.svg.
//   node explore/batch-3.mjs
import { writeFileSync } from 'node:fs';
import { arcArrow, cornerMid, f, onCircle, roundedPolygon } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const ellipse = (cx, cy, rx, ry, duo = false) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${duo ? ' data-duotone' : ''} />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

// ── Time ─────────────────────────────────────────────────────────────────────────────────
add('clock', 'clock,time,hour,schedule,watch,นาฬิกา,เวลา', circle(12, 12, 10, true), p('M12 7v5l3.5 2'));
// The check goes inside the calendar body: it's about the content, not a badge on the object.
add('calendar-check', 'calendar check,booked,scheduled,confirmed,event done,นัดหมายแล้ว,ยืนยันวัน,จองแล้ว',
  rect(3.5, 5, 17, 15.5, 4, true), p('M8 3v4'), p('M16 3v4'), p('M3.5 10.5h17'), p('m9 15.5 2 2 4-4'));
add('rotate-ccw-clock', 'history,recent,past,log,time,ประวัติ,ล่าสุด,ย้อนหลัง',
  ...arcArrow(12, 12, 8.5, 300, 600, 3.5, true).map((d) => p(d)), p('M12 8v4.5l3 1.5'));
add('timer', 'timer,stopwatch,countdown,duration,speed,จับเวลา,นาฬิกาจับเวลา',
  circle(12, 13.5, 8, true), p('M10 2.5h4'), p('M12 2.5v3'), p('m12 13.5 3-3'));

// ── Charts & data ────────────────────────────────────────────────────────────────────────
const AXES = 'M3.5 3.5v14a3 3 0 0 0 3 3h14';
add('chart-line', 'chart,line chart,graph,analytics,statistics,trend,กราฟ,แผนภูมิ,สถิติ', p(AXES), p('m7.5 14.5 4-4 3 3 5.5-5.5'));
add('chart-bar', 'chart,bar chart,graph,analytics,statistics,compare,กราฟแท่ง,แผนภูมิ,สถิติ',
  p(AXES), p('M8 7.5h7'), p('M8 12h11'), p('M8 16.5h4'));
add('chart-pie', 'chart,pie chart,share,proportion,analytics,แผนภูมิวงกลม,สัดส่วน',
  p('M11.5 3.5A9 9 0 1 0 20.5 12.5H11.5z', true), p('M13 2A9 9 0 0 1 22 11H13z'));
add('activity', 'activity,pulse,heartbeat,health,monitor,uptime,กิจกรรม,ชีพจร,สถานะ', p('M2.5 12.5H6l2.5-6 4 12 3-9 1.5 3h4.5'));
add('trending-up', 'trending up,growth,increase,rise,profit,เพิ่มขึ้น,เติบโต,ขาขึ้น', p('m2.5 17 6.5-6.5 4 4 8.5-8.5'), p('M15.5 6h6v6'));
add('trending-down', 'trending down,decline,decrease,fall,loss,ลดลง,ขาลง', p('m2.5 7 6.5 6.5 4-4 8.5 8.5'), p('M15.5 18h6v-6'));
{
  const a = onCircle(12, 14, 9, 240);
  const b = onCircle(12, 14, 9, 120);
  add('gauge', 'gauge,speed,performance,meter,dashboard,wpm,มาตรวัด,ความเร็ว,ประสิทธิภาพ',
    p(`M${pt(a)}A9 9 0 1 1 ${pt(b)}`), p('m12 14 4-4.5'), p('M12 14h.01'));
}
add('database', 'database,storage,data,sql,records,ฐานข้อมูล,ข้อมูล',
  ellipse(12, 5.5, 8, 3, true), p('M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13'), p('M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3'));
add('server', 'server,host,hardware,rack,backend,เซิร์ฟเวอร์,โฮสต์',
  rect(3, 3, 18, 8, 2, true), rect(3, 13, 18, 8, 2, true), p('M7 7h.01'), p('M10.5 7h.01'), p('M7 17h.01'), p('M10.5 17h.01'));

// ── Devices & media ──────────────────────────────────────────────────────────────────────
add('delete', 'backspace,delete,erase,clear,remove,ลบ,ลบตัวอักษร',
  p(roundedPolygon([[2, 12], [8.5, 5], [21.5, 5], [21.5, 19], [8.5, 19]], [1.5, 1.5, 3, 3, 1.5]), true),
  p('m12.5 9.5 5 5'), p('m17.5 9.5-5 5'));
add('keyboard', 'keyboard,type,typing,input,keys,คีย์บอร์ด,แป้นพิมพ์,พิมพ์',
  rect(2.5, 5.5, 19, 13, 3, true), p('M6.5 9.5h.01'), p('M10 9.5h.01'), p('M14 9.5h.01'), p('M17.5 9.5h.01'), p('M8 14.5h8'));
add('command', 'command,cmd,mac,shortcut,keyboard,คำสั่ง,ปุ่มลัด',
  p('M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3'));
add('monitor', 'monitor,screen,desktop,display,computer,จอ,คอมพิวเตอร์,หน้าจอ',
  rect(2.5, 3.5, 19, 13, 3, true), p('M12 16.5v4'), p('M8 20.5h8'));
add('smartphone', 'phone,mobile,smartphone,device,cell,มือถือ,โทรศัพท์มือถือ,สมาร์ตโฟน',
  rect(6, 2.5, 12, 19, 3, true), p('M10.5 18h3'));
add('maximize-2', 'maximize,expand,fullscreen,enlarge,ขยาย,เต็มจอ',
  p('M14.5 3.5h6v6'), p('M20.5 3.5 14 10'), p('M3.5 20.5 10 14'), p('M9.5 20.5h-6v-6'));
add('minimize-2', 'minimize,shrink,collapse,exit fullscreen,ย่อ,ออกจากเต็มจอ',
  p('m14 10 6.5-6.5'), p('M20 10h-6V4'), p('m3.5 20.5 6.5-6.5'), p('M4 14h6v6'));
// Nudged right so the triangle's mass sits on the centre line.
add('play', 'play,start,video,media,run,เล่น,เริ่ม', p(roundedPolygon([[7.5, 4], [20, 12], [7.5, 20]], 2), true));
add('pause', 'pause,stop,hold,media,หยุดชั่วคราว,พัก', rect(6, 4.5, 4, 15, 1.5, true), rect(14, 4.5, 4, 15, 1.5, true));
const SPEAKER = roundedPolygon([[3, 9], [7, 9], [12, 4.5], [12, 19.5], [7, 15], [3, 15]], [1.5, 0.5, 1, 1, 0.5, 1.5]);
add('volume-2', 'volume,sound,audio,speaker,loud,เสียง,ลำโพง', p(SPEAKER, true), p('M15.5 8.5a5 5 0 0 1 0 7'), p('M18.5 5.5a9 9 0 0 1 0 13'));
add('volume-x', 'mute,silent,no sound,volume off,ปิดเสียง,เงียบ', p(SPEAKER, true), p('m16 9.5 5 5'), p('m21 9.5-5 5'));
add('languages', 'language,translate,i18n,thai english,locale,ภาษา,แปล,เปลี่ยนภาษา',
  p('M3 5.5h9'), p('M7.5 3.5v2'), p('M5 5.5c.5 3 2.5 5.5 6 7'), p('M10 5.5c-.5 3-3 6-6.5 7.5'),
  p('m12.5 20.5 4-9.5 4 9.5'), p('M14 17h5'));

// ── Commerce ─────────────────────────────────────────────────────────────────────────────
add('shopping-cart', 'cart,shopping,basket,buy,checkout,ตะกร้า,รถเข็น,ซื้อ',
  p('M2.5 3.5h2.2l2.2 11a2 2 0 0 0 2 1.5h9.2a2 2 0 0 0 1.9-1.5L21.5 7.5H5.5'), circle(9, 20, 1.25), circle(18, 20, 1.25));
add('shopping-bag', 'bag,shopping,store,buy,purchase,กระเป๋า,ถุง,ช้อปปิ้ง',
  p('M4.5 7h15l-.9 11.6a2.5 2.5 0 0 1-2.5 2.4H7.9a2.5 2.5 0 0 1-2.5-2.4z', true), p('M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10'));
add('credit-card', 'credit card,card,payment,pay,debit,บัตรเครดิต,บัตร,ชำระเงิน',
  rect(2, 5, 20, 14, 3, true), p('M2 10h20'), p('M6 15h3'));
add('wallet', 'wallet,money,payment,balance,purse,กระเป๋าเงิน,เงิน,ยอดเงิน',
  rect(2.5, 5, 19, 15, 4, true), p('M21.5 10.5h-4a2 2 0 0 0 0 4h4'), p('M17.5 12.5h.01'));
add('receipt', 'receipt,bill,invoice,payment,order,ใบเสร็จ,บิล,ใบแจ้งหนี้',
  p('M5 21V6a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 6v15l-2.33-1.5-2.34 1.5-2.33-1.5-2.33 1.5-2.34-1.5z', true),
  p('M8.5 8h7'), p('M8.5 12h7'), p('M8.5 16h4'));
add('gift', 'gift,present,reward,promotion,bonus,ของขวัญ,รางวัล,โปรโมชัน',
  rect(2.5, 7, 19, 4, 1), p('M4 11v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7', true), p('M12 7v14'),
  p('M12 7c-1-2.5-5-4-5.5-1.5S9.5 7 12 7'), p('M12 7c1-2.5 5-4 5.5-1.5S14.5 7 12 7'));
add('store', 'store,shop,market,business,storefront,ร้านค้า,ร้าน,ตลาด',
  p('M3 9l1.6-4.3A2 2 0 0 1 6.5 3.5h11a2 2 0 0 1 1.9 1.2L21 9'), p('M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0'),
  p('M4.5 11.5V18a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-6.5', true), p('M10 20.5v-4a2 2 0 0 1 4 0v4'));
{
  // Box: rounded hexagon; inner edges end on the rounded corners' arcs.
  const HEX = [[12, 2.5], [20.5, 7], [20.5, 17], [12, 21.5], [3.5, 17], [3.5, 7]];
  const r = 1.5;
  const mid = (i) => cornerMid(HEX, i, r);
  add('package', 'package,box,parcel,delivery,shipping,product,พัสดุ,กล่อง,จัดส่ง,สินค้า',
    p(roundedPolygon(HEX, r), true),
    p(`M${pt(mid(5))}L12 11.5L${pt(mid(1))}`),
    p(`M12 11.5L${pt(mid(3))}`),
    p('m7.75 4.75 8.5 4.5'));
}

for (const [name, { tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/core/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons to icons/core/`);
