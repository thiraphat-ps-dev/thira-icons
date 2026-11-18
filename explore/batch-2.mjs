// Batch 2 worksheet: status, account, files, communication. Writes icons/core/*.svg.
//   node explore/batch-2.mjs
import { writeFileSync } from 'node:fs';
import {
  arcArrow, cubicPath, cubicTo, distToLine, f, findT, onCircle, roundedPolygon, splitCubic,
} from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const circle = (cx, cy, r, duo = false) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"${duo ? ' data-duotone' : ''} />`;
const ellipse = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" />`;
const rect = (x, y, w, h, rx, duo = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${duo ? ' data-duotone' : ''} />`;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

// ── Arrows & navigation ──────────────────────────────────────────────────────────────────
add('refresh-cw', 'refresh,reload,sync,update,repeat,รีเฟรช,โหลดใหม่,ซิงก์', ...arcArrow(12, 12, 8.5, 285, 420).map((d) => p(d)), ...arcArrow(12, 12, 8.5, 105, 240).map((d) => p(d)));
add('rotate-ccw', 'rotate,reset,restore,back,counterclockwise,หมุน,รีเซ็ต,คืนค่า', ...arcArrow(12, 12, 8.5, 300, 600, 3.5, true).map((d) => p(d)));
add('undo-2', 'undo,back,revert,history,เลิกทำ,ย้อนกลับ', p('m9 14-5-5 5-5'), p('M4 9h10.5a5.5 5.5 0 0 1 0 11H11'));
add('redo-2', 'redo,forward,repeat,ทำซ้ำ,ทำใหม่', p('m15 14 5-5-5-5'), p('M20 9H9.5a5.5 5.5 0 0 0 0 11H13'));
add('log-in', 'log in,sign in,enter,login,เข้าสู่ระบบ,ล็อกอิน', p('M14 4h3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-3'), p('M3.5 12H14'), p('m10 8 4 4-4 4'));
add('log-out', 'log out,sign out,exit,leave,logout,ออกจากระบบ,ล็อกเอาต์', p('M10 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h3'), p('M10 12h10.5'), p('m16.5 8 4 4-4 4'));

// ── Actions ──────────────────────────────────────────────────────────────────────────────
add('funnel', 'filter,funnel,sort,refine,narrow,กรอง,ตัวกรอง',
  p(roundedPolygon([[3.5, 4], [20.5, 4], [14, 11.75], [14, 19.5], [10, 21], [10, 11.75]], [1.5, 1.5, 1.5, 1, 1, 1.5]), true));
add('sliders-horizontal', 'settings,adjust,controls,sliders,options,filter,ปรับ,ตั้งค่า,ตัวเลือก',
  p('M4 6h9'), p('M17 6h3'), circle(15, 6, 2, true),
  p('M4 12h2'), p('M10 12h10'), circle(8, 12, 2, true),
  p('M4 18h8'), p('M16 18h4'), circle(14, 18, 2, true));
const TRAY = 'M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3';
add('download', 'download,save,get,export,import,ดาวน์โหลด,บันทึก', p(TRAY), p('M12 3.5V15'), p('m7.5 10.5 4.5 4.5 4.5-4.5'));
add('upload', 'upload,send,import,attach,อัปโหลด,ส่ง', p(TRAY), p('M12 15V3.5'), p('m7.5 8 4.5-4.5L16.5 8'));
{
  // Three nodes, connectors from edge to edge.
  const nodes = [[17.5, 5.5], [6.5, 12], [17.5, 18.5]];
  const r = 2.75;
  const link = (a, b) => {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const u = [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
    return p(`M${pt([a[0] + u[0] * r, a[1] + u[1] * r])}L${pt([b[0] - u[0] * r, b[1] - u[1] * r])}`);
  };
  add('share-2', 'share,send,network,connect,distribute,แชร์,แบ่งปัน',
    ...nodes.map(([x, y]) => circle(x, y, r, true)), link(nodes[1], nodes[0]), link(nodes[1], nodes[2]));
}
add('link', 'link,url,chain,connect,hyperlink,ลิงก์,เชื่อมโยง', p('M9 17H7A5 5 0 0 1 7 7h2'), p('M15 7h2a5 5 0 0 1 0 10h-2'), p('M8 12h8'));
add('save', 'save,floppy,disk,store,keep,บันทึก',
  p(roundedPolygon([[3.5, 3.5], [16.5, 3.5], [20.5, 7.5], [20.5, 20.5], [3.5, 20.5]], [4, 1.5, 1.5, 4, 4]), true),
  p('M7.5 20.5V15a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v5.5'),
  p('M7.5 3.5V7a1 1 0 0 0 1 1h5.5'));
add('grip-vertical', 'grip,drag,handle,move,reorder,ลาก,ย้าย,จัดลำดับ',
  ...[5, 12, 19].flatMap((y) => [circle(9, y, 1), circle(15, y, 1)]));

// ── Status & feedback ────────────────────────────────────────────────────────────────────
add('circle-question-mark', 'help,question,support,faq,unknown,ช่วยเหลือ,คำถาม,สงสัย',
  circle(12, 12, 10, true), p('M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.27-1 .85-1 1.5v.7'), p('M12 17h.01'));
{
  // Bell: dome (two quarter circles as cubics), flared sides, flat base, clapper.
  const k = 0.5523 * 6;
  const B = {
    domeL: [[6, 9.5], [6, 9.5 - k], [12 - k, 3.5], [12, 3.5]],
    domeR: [[12, 3.5], [12 + k, 3.5], [18, 9.5 - k], [18, 9.5]],
    sideR: [[18, 9.5], [18, 13], [19, 15], [20.5, 16.5]],
    sideL: [[3.5, 16.5], [5, 15], [6, 13], [6, 9.5]],
  };
  const clapper = 'M10 19a2 2 0 0 0 4 0';
  add('bell', 'notification,bell,alert,reminder,notify,แจ้งเตือน,กระดิ่ง',
    p(cubicPath(B.domeL) + cubicTo(B.domeR) + cubicTo(B.sideR) + 'H3.5' + cubicTo(B.sideL) + 'Z', true), p(clapper));

  // Bell-off: the slash cuts the dome on the left and the base on the right.
  const a = [4, 4];
  const b = [20, 20];
  const gap = 2.75;
  const near = (q) => distToLine(q, a, b) < gap;
  // The slash runs close past the top of the left side, so that side is cut too: the left
  // piece is base + lower left side, the right piece starts on the dome after the slash.
  const tSideEnd = findT(B.sideL, near, 0, 1);
  const tDomeStart = findT(B.domeL, near, 1, 0);
  const sideBefore = splitCubic(B.sideL, tSideEnd)[0];
  const domeAfter = splitCubic(B.domeL, tDomeStart)[1];
  const baseCutX = 16.5 - gap * Math.SQRT2; // base y = 16.5 crosses the slash at x = 16.5
  add('bell-off', 'notifications off,mute,silent,bell off,quiet,ปิดแจ้งเตือน,ปิดเสียง',
    p(cubicPath(domeAfter) + cubicTo(B.domeR) + cubicTo(B.sideR), true),
    p(`M${f(baseCutX)} 16.5H3.5` + cubicTo(sideBefore), true),
    p(clapper),
    p(`M${pt(a)}L${pt(b)}`));
}
add('ban', 'ban,block,forbidden,prohibited,disabled,ห้าม,บล็อก,ระงับ', circle(12, 12, 10, true), p('m4.93 4.93 14.14 14.14'));
add('lock', 'lock,secure,private,password,locked,ล็อก,ปลอดภัย,รหัสผ่าน',
  rect(4, 10.5, 16, 10.5, 3, true), p('M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3'), p('M12 14.75v2'));
{
  const end = onCircle(12, 7.5, 4.5, 60);
  add('lock-open', 'unlock,open,unlocked,access,ปลดล็อก,เปิด',
    rect(4, 10.5, 16, 10.5, 3, true), p(`M7.5 10.5V7.5A4.5 4.5 0 0 1 ${pt(end)}`), p('M12 14.75v2'));
}
add('shield-check', 'security,shield,protected,safe,verified,ความปลอดภัย,ปกป้อง,ยืนยันแล้ว',
  p('M12 3.25 18.5 5.6a1.5 1.5 0 0 1 1 1.4v4.5c0 4.6-3.2 8.2-7.5 9.75C7.7 19.7 4.5 16.1 4.5 11.5V7a1.5 1.5 0 0 1 1-1.4z', true),
  p('m9 12 2 2 4-4.5'));

// ── People & account ─────────────────────────────────────────────────────────────────────
add('users', 'users,people,team,group,members,ผู้ใช้,ทีม,กลุ่ม,สมาชิก',
  circle(9, 8, 3.75, true), p('M2.5 20.5a6.5 6.5 0 0 1 13 0', true),
  p('M15 4.25a3.75 3.75 0 0 1 0 7.5'), p('M16.5 14.18a6.5 6.5 0 0 1 5 6.32'));
{
  // Body arc stops 2 units outside the badge zone (18, 18, r 4.5).
  const cx = 10, cy = 20.5, r = 7.5;
  let cut = null;
  for (let deg = 180; deg >= 0; deg -= 0.25) {
    const x = cx + r * Math.cos((deg * Math.PI) / 180);
    const y = cy - r * Math.sin((deg * Math.PI) / 180);
    if (Math.hypot(x - 18, y - 18) < 6.5) break;
    cut = [x, y];
  }
  add('user-plus', 'add user,invite,new user,user plus,เพิ่มผู้ใช้,เชิญ',
    circle(10, 8, 4, true), p(`M2.5 20.5A7.5 7.5 0 0 1 ${pt(cut)}`, true), p('M18 15v6'), p('M15 18h6'));
}
add('circle-user', 'account,profile,user,avatar,me,บัญชี,โปรไฟล์,ผู้ใช้',
  circle(12, 12, 10, true), circle(12, 10, 3.25), p('M6 20a7 7 0 0 1 12 0'));
add('key-round', 'key,password,access,credentials,unlock,กุญแจ,รหัสผ่าน,สิทธิ์',
  circle(8.5, 15.5, 4.5, true), p('M11.68 12.32 20 4'), p('M17 7l2.5 2.5'), p('M14.5 9.5l1.75 1.75'), p('M7.25 16.75h.01'));

// ── Files & content ──────────────────────────────────────────────────────────────────────
const FILE = roundedPolygon([[4, 2.5], [14, 2.5], [20, 8.5], [20, 21.5], [4, 21.5]], [4, 1.5, 1.5, 4, 4]);
const FOLD = 'M14 2.5V6.5a2 2 0 0 0 2 2h4';
add('file', 'file,document,page,paper,ไฟล์,เอกสาร', p(FILE, true), p(FOLD));
add('file-text', 'document,text,file,page,article,report,เอกสาร,ข้อความ,รายงาน', p(FILE, true), p(FOLD), p('M8 9h2'), p('M8 13h8'), p('M8 17h8'));
const FOLDER = roundedPolygon([[2.5, 5], [9, 5], [11, 7.5], [21.5, 7.5], [21.5, 19.5], [2.5, 19.5]], [3, 1, 1, 3, 3, 3]);
add('folder', 'folder,directory,files,project,โฟลเดอร์,แฟ้ม', p(FOLDER, true));
add('folder-open', 'folder open,open,browse,directory,เปิดโฟลเดอร์,เรียกดู',
  p('M18.5 10.5V10a2.5 2.5 0 0 0-2.5-2.5h-5L9 5H5.5a3 3 0 0 0-3 3v8.5a3 3 0 0 0 3 3'),
  // The flap's bottom-left corner meets the back panel exactly where its rounded corner ends.
  p(roundedPolygon([[7.75, 10.5], [21.75, 10.5], [18.75, 19.5], [5.5, 19.5]], [1.5, 1.5, 1.5, 0.01]), true));
add('image', 'image,picture,photo,gallery,media,รูปภาพ,ภาพ,รูป',
  rect(2.5, 4, 19, 16, 4, true), circle(8.5, 9.5, 1.75), p('M21.5 15.5l-3.6-3.6a2 2 0 0 0-2.8 0L6.5 20'));
add('paperclip', 'attach,attachment,paperclip,file,แนบ,ไฟล์แนบ,คลิปหนีบ', p('M17.5 8v8a5.5 5.5 0 0 1-11 0V6.5a4 4 0 0 1 8 0V16a2.5 2.5 0 0 1-5 0V8'));
add('book-open', 'book,read,docs,documentation,learn,guide,หนังสือ,อ่าน,คู่มือ',
  p('M12 7.5C10.5 5.5 8 4.5 3 4.5v13c5 0 7.5 1 9 3', true), p('M12 7.5c1.5-2 4-3 9-3v13c-5 0-7.5 1-9 3', true), p('M12 7.5v13'));
add('bookmark', 'bookmark,save,favorite,later,read later,บุ๊กมาร์ก,บันทึกไว้',
  p(roundedPolygon([[6, 3], [18, 3], [18, 21], [12, 16.5], [6, 21]], [2.5, 2.5, 1, 1, 1]), true));
add('tag', 'tag,label,price,category,ป้าย,แท็ก,ราคา,หมวดหมู่',
  p(roundedPolygon([[3, 3], [11.5, 3], [21, 12.5], [12.5, 21], [3, 11.5]], [3, 1.5, 2, 2, 1.5]), true), circle(7.5, 7.5, 1));
add('inbox', 'inbox,mail,messages,received,tray,กล่องจดหมาย,ข้อความเข้า',
  p('M2.5 13 5.4 5.6A2.5 2.5 0 0 1 7.7 4h8.6a2.5 2.5 0 0 1 2.3 1.6L21.5 13v4.5a3 3 0 0 1-3 3h-13a3 3 0 0 1-3-3z', true),
  p('M2.5 13h5l1.5 2.5h6l1.5-2.5h5'));
add('archive', 'archive,box,store,storage,backup,เก็บถาวร,คลัง,กล่อง',
  rect(2.5, 3.5, 19, 5, 1.5), p('M4.5 8.5v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-9', true), p('M10 12.5h4'));

// ── Communication & places ───────────────────────────────────────────────────────────────
add('mail', 'mail,email,message,letter,envelope,อีเมล,จดหมาย,ข้อความ',
  rect(2.5, 4.5, 19, 15, 4, true), p('m6 8.5 4.65 3.45a2.25 2.25 0 0 0 2.7 0L18 8.5'));
{
  const s = onCircle(12, 11.5, 9, 210);
  const e = onCircle(12, 11.5, 9, 240);
  add('message-circle', 'message,chat,comment,conversation,reply,ข้อความ,แชท,ความคิดเห็น',
    p(`M${pt(s)}A9 9 0 1 0 ${pt(e)}L3 21Z`, true));
}
add('phone', 'phone,call,telephone,contact,โทรศัพท์,โทร,ติดต่อ',
  p('M8.6 3.5H6A2.5 2.5 0 0 0 3.5 6c0 8 6.5 14.5 14.5 14.5a2.5 2.5 0 0 0 2.5-2.5v-2.6a1 1 0 0 0-.7-.95l-3.4-1.1a1 1 0 0 0-1 .25l-1.6 1.6a12 12 0 0 1-5.5-5.5l1.6-1.6a1 1 0 0 0 .25-1L9.55 4.2a1 1 0 0 0-.95-.7z', true));
{
  const end = onCircle(12, 12, 9.5, 135);
  add('at-sign', 'at,email,mention,address,username,แอท,อีเมล,กล่าวถึง',
    circle(12, 12, 4, true), p(`M16 8v5a2.75 2.75 0 0 0 5.5 0v-1A9.5 9.5 0 1 0 ${pt(end)}`));
}
add('globe', 'globe,world,internet,web,language,international,โลก,อินเทอร์เน็ต,ภาษา',
  circle(12, 12, 10, true), ellipse(12, 12, 4.5, 10), p('M2 12h20'));
add('map-pin', 'location,pin,map,place,address,marker,ตำแหน่ง,แผนที่,สถานที่,ที่อยู่',
  p('M19.5 10c0 5-5.5 10.5-7.5 11.5C10 20.5 4.5 15 4.5 10a7.5 7.5 0 0 1 15 0z', true), circle(12, 10, 2.5));
{
  // The fold line starts on the rounded tip (the arc's midpoint), not at the sharp vertex.
  const V = [21, 3], A = [3, 9.5], B = [14.5, 21], inner = [11, 13], r = 1.5;
  const unit = (q) => { const l = Math.hypot(q[0] - V[0], q[1] - V[1]); return [(q[0] - V[0]) / l, (q[1] - V[1]) / l]; };
  const angle = Math.acos(unit(A)[0] * unit(B)[0] + unit(A)[1] * unit(B)[1]);
  const inset = r / Math.sin(angle / 2) - r; // vertex → arc midpoint, along the bisector
  const dir = unit(inner);
  const tip = [V[0] + dir[0] * inset, V[1] + dir[1] * inset];
  add('send', 'send,submit,message,paper plane,ส่ง,ส่งข้อความ',
    p(roundedPolygon([V, B, inner, A], [r, 1.5, 1, 1.5]), true), p(`M${pt(tip)}L${pt(inner)}`));
}

for (const [name, { tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/core/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons to icons/core/`);
