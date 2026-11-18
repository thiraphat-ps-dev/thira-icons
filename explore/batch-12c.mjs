// Batch 12c worksheet: reply, reply-all, forward, send-horizontal, mail-x, mail-check, message-circle-more,
// message-square-text, contact, phone-incoming.
//   node explore/batch-12c.mjs
import { writeFileSync } from 'node:fs';
import { f } from '../scripts/geometry.mjs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;

const mirror = (d) => {
  // mirror x about 12 for absolute M/H/L/A/V paths
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+/g);
  const n = { M: 2, L: 2, H: 1, V: 1, A: 7 };
  const out = [];
  let i = 0;
  while (i < toks.length) {
    const c = toks[i++];
    const k = n[c];
    const g = toks.slice(i, i + k).map(Number);
    i += k;
    if (c === 'H') g[0] = 24 - g[0];
    else if (c === 'A') { g[4] = 1 - g[4]; g[5] = 24 - g[5]; }
    else if (c !== 'V') g[0] = 24 - g[0];
    out.push(c + g.map(f).join(' '));
  }
  return out.join('');
};

// ── reply: arrowhead on the left, shaft runs right then curves down.
const REPLY = ['M9 6 4 11l5 5', 'M4 11H15A5 5 0 0 1 20 16V19'];
add('reply', 'reply,respond,answer,email reply,ตอบกลับ,ตอบอีเมล,โต้ตอบ', ...REPLY.map((d) => p(d)));
add('forward', 'forward,share,pass on,email forward,ส่งต่อ,แชร์,ส่งต่ออีเมล', p('M15 6 20 11l-5 5'), p(mirror(REPLY[1])));
add('reply-all', 'reply all,respond all,answer everyone,ตอบทั้งหมด,ตอบกลับทุกคน,ตอบทุกคน',
  p('M8 6 3 11l5 5'), p('M14 5.5 9 10.5l5 5'), p('M9 10.5H15.5A4.5 4.5 0 0 1 20 15V19'));

// ── send-horizontal: send.svg rotated 45° clockwise about its centre, recentred.
{
  const src = 'M19.91 6.01L15.78 17.46A1.5 1.5 0 0 1 12.99 17.55L11.16 13.36A1 1 0 0 0 10.64 12.84L6.45 11.01A1.5 1.5 0 0 1 6.54 8.22L17.99 4.09A1.5 1.5 0 0 1 19.91 6.01Z';
  const fold = 'M19.56 4.44L11 13';
  const th = Math.PI / 4, cs = Math.cos(th), sn = Math.sin(th);
  const rot = ([x, y]) => [(x - 12) * cs - (y - 12) * sn + 12, (x - 12) * sn + (y - 12) * cs + 12];
  const parse = (d) => [...d.matchAll(/([MLAZ])([^MLAZ]*)/g)].map(([, c, a]) => ({ c, a: a.trim() ? a.trim().split(/[ ,]+/).map(Number) : [] }));
  const pts = [];
  for (const { c, a } of [...parse(src), ...parse(fold)]) {
    if (c === 'M' || c === 'L') pts.push([a[0], a[1]]);
    if (c === 'A') pts.push([a[5], a[6]]);
  }
  const rp = pts.map(rot);
  const xs = rp.map((q) => q[0]), ys = rp.map((q) => q[1]);
  const dx = 12 - (Math.min(...xs) + Math.max(...xs)) / 2, dy = 12 - (Math.min(...ys) + Math.max(...ys)) / 2;
  const tr = (q) => { const r = rot(q); return [r[0] + dx, r[1] + dy]; };
  const build = (d) => parse(d).map(({ c, a }) => {
    if (c === 'Z') return 'Z';
    if (c === 'A') { const e = tr([a[5], a[6]]); return `A${a[0]} ${a[1]} ${a[2]} ${a[3]} ${a[4]} ${f(e[0])} ${f(e[1])}`; }
    const e = tr(a); return `${c}${f(e[0])} ${f(e[1])}`;
  }).join('');
  console.log('send-horizontal shift', f(dx), f(dy));
  add('send-horizontal', 'send,submit,paper plane,message,send right,ส่ง,ส่งข้อความ,เครื่องบินกระดาษ',
    p(build(src), true), p(build(fold)));
}

// ── mail-x / mail-check: mail-plus's cut base.
const MAIL = [
  p('M21.5 12.5V8.5A4 4 0 0 0 17.5 4.5L6.5 4.5A4 4 0 0 0 2.5 8.5L2.5 15.5A4 4 0 0 0 6.5 19.5L11.7 19.5', true),
  p('m6 8.5 4.65 3.45a2.25 2.25 0 0 0 2.7 0L18 8.5'),
];
add('mail-x', 'mail x,failed email,bounced,delete email,remove message,อีเมลล้มเหลว,ลบอีเมล,ส่งไม่สำเร็จ', ...MAIL,
  p('m16 16 4 4'), p('m20 16-4 4'));
add('mail-check', 'mail check,email sent,verified email,delivered,read message,ส่งอีเมลแล้ว,ยืนยันอีเมล,ได้รับแล้ว', ...MAIL,
  p('m15 17.75 2.25 2.25 3.75-4'));

// ── message-circle-more: message-circle + three detail dots.
const MC = 'M7.5 19.29A9 9 0 1 0 4.21 16L3 21Z';
add('message-circle-more', 'message more,typing,chat more,comment more,conversation,กำลังพิมพ์,แชท,ข้อความเพิ่มเติม',
  p(MC, true), p('M8 12h.01'), p('M12 12h.01'), p('M16 12h.01'));

// ── message-square-text: message-square + two text lines.
add('message-square-text', 'message text,chat text,comment,speech bubble text,conversation,ข้อความ,แชท,กล่องข้อความ',
  p('M7 3L17 3A4 4 0 0 1 21 7L21 13A4 4 0 0 1 17 17L7.41 17A1 1 0 0 0 6.71 17.29L4.71 19.29A1 1 0 0 1 3 18.59L3 7A4 4 0 0 1 7 3Z', true),
  p('M8 8h8'), p('M8 12h5'));

// ── contact: address book — portrait card, person inside, index tabs on the right edge.
add('contact', 'contact,address book,contacts,directory,person card,รายชื่อ,สมุดโทรศัพท์,ผู้ติดต่อ',
  '<rect x="3.5" y="2.5" width="14" height="19" rx="3" data-duotone />',
  '<circle cx="10.5" cy="8.5" r="2" />',
  p('M7 17a3.5 3.5 0 0 1 7 0'), p('M17.5 7h3'), p('M17.5 12h3'), p('M17.5 17h3'));

// ── phone-incoming: phone.svg + arrow pointing down-left into the handset, top-right.
add('phone-incoming', 'phone incoming,incoming call,receive call,answer call,สายเรียกเข้า,รับสาย,โทรเข้า',
  p('M8.6 3.5H6A2.5 2.5 0 0 0 3.5 6c0 8 6.5 14.5 14.5 14.5a2.5 2.5 0 0 0 2.5-2.5v-2.6a1 1 0 0 0-.7-.95l-3.4-1.1a1 1 0 0 0-1 .25l-1.6 1.6a12 12 0 0 1-5.5-5.5l1.6-1.6a1 1 0 0 0 .25-1L9.55 4.2a1 1 0 0 0-.95-.7z', true),
  p('M21 3 14.5 9.5'), p('M19 9.5H14.5V5'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
