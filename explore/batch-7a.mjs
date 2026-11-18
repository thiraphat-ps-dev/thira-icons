// Batch 7a worksheet: text editing icons.
//   node explore/batch-7a.mjs
import { writeFileSync } from 'node:fs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;

add('bold', 'bold,strong,text,format,font weight,heavy,ตัวหนา,จัดรูปแบบ,ข้อความ',
  p('M6 4v16'), p('M6 4h8.5a4 4 0 0 1 0 8H6'), p('M6 12h9a4 4 0 0 1 0 8H6'));

add('italic', 'italic,emphasis,slant,text,format,oblique,ตัวเอียง,จัดรูปแบบ,ข้อความ',
  p('M19 4h-9'), p('M14 20H5'), p('M15 4 9 20'));

add('underline', 'underline,text,format,line under,ขีดเส้นใต้,จัดรูปแบบ,ข้อความ',
  p('M6 3.5v7a6 6 0 0 0 12 0v-7'), p('M4 21h16'));

add('strikethrough', 'strikethrough,strike,cross out,text,format,delete text,ขีดฆ่า,ขีดทับ,จัดรูปแบบ',
  p('M17 7a4 4 0 0 0-4-3h-2a4 4 0 0 0-4 4c0 2 1 3 3 4'), p('M4 12h16'), p('M7 17a4 4 0 0 0 4 3h2a4 4 0 0 0 4-4c0-2-1-3-3-4'));

add('text-align-start', 'align left,align start,text,paragraph,justify,format,จัดชิดซ้าย,ย่อหน้า,จัดข้อความ',
  p('M4 4.5h16'), p('M4 9.5h10'), p('M4 14.5h16'), p('M4 19.5h10'));
add('text-align-center', 'align center,centre,text,paragraph,format,จัดกึ่งกลาง,ย่อหน้า,จัดข้อความ',
  p('M4 4.5h16'), p('M7 9.5h10'), p('M4 14.5h16'), p('M7 19.5h10'));
add('text-align-end', 'align right,align end,text,paragraph,format,จัดชิดขวา,ย่อหน้า,จัดข้อความ',
  p('M4 4.5h16'), p('M10 9.5h10'), p('M4 14.5h16'), p('M10 19.5h10'));

add('list-ordered', 'ordered list,numbered list,numbers,steps,sequence,รายการลำดับ,เลขลำดับ,ขั้นตอน',
  // Only "1" and "2", each as tall as two rows of text: three tiny stacked numerals blobbed together
  // at 16px and broke the 2-unit gap. The middle row is a plain line, like list.svg's rows.
  p('M3.5 4.5 5.25 3v6'), p('M3.25 16.25a2 2 0 0 1 4 0c0 1.5-4 2.25-4 4.75h4'),
  p('M11 6h9'), p('M11 12h9'), p('M11 18h9'));

add('quote', 'quote,blockquote,citation,quotation,testimonial,อ้างอิง,คำพูด,การอ้างอิง',
  // Final review: the tall marks read as the digits "66". Squat rounded blocks with a short tail
  // hooking up from the top-left read as quotation marks.
  p('M4 11.5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 11.5c0-2.5 1.5-4.5 4-5.5', true),
  p('M13.5 11.5a2 2 0 0 1 2-2H18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2.5a2 2 0 0 1-2-2zM13.5 11.5c0-2.5 1.5-4.5 4-5.5', true));

add('type', 'type,text,font,typography,letter,heading,ตัวอักษร,ข้อความ,ฟอนต์',
  p('M4.5 8V6.5A1.5 1.5 0 0 1 6 5h12a1.5 1.5 0 0 1 1.5 1.5V8'), p('M12 5v15'), p('M9 20h6'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
