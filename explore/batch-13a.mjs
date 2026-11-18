// Batch 13a worksheet: chart-area, chart-scatter, chart-candlestick, chart-gantt, sigma, infinity, binary, divide, equal, pi.
//   node explore/batch-13a.mjs
import { writeFileSync } from 'node:fs';

const icons = {};
const add = (name, tags, ...body) => (icons[name] = { dir: 'core', tags, body });
const p = (d, duo = false) => `<path d="${d}"${duo ? ' data-duotone' : ''} />`;
const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="1" />`;

// Shared axes (identical to chart-line / chart-bar).
const AXES = 'M3.5 3.5v14a3 3 0 0 0 3 3h14';

add('chart-area', 'chart,area chart,graph,analytics,statistics,trend,กราฟพื้นที่,แผนภูมิ,สถิติ',
  p(AXES), p('M7.5 17v-2.5l4-4 3 3 5-5V17z', true));

add('chart-scatter', 'chart,scatter plot,scatter chart,dots,correlation,กราฟกระจาย,แผนภูมิ,จุดกระจาย',
  p(AXES), dot(8, 15.5), dot(11.5, 10), dot(14.5, 15), dot(17.5, 8.5), dot(18.5, 16));

// Candles: width 3, centres 5 / 12 / 19; wicks run 3 beyond the body.
const candle = (cx, y1, y2, w1, w2) => [
  `<rect x="${cx - 1.5}" y="${y1}" width="3" height="${y2 - y1}" rx="1" data-duotone />`,
  p(`M${cx} ${w1}V${y1}`), p(`M${cx} ${y2}V${w2}`),
];
add('chart-candlestick', 'chart,candlestick,stock chart,trading,ohlc,forex,กราฟแท่งเทียน,หุ้น,เทรด',
  ...candle(5, 9, 16, 4.5, 19.5), ...candle(12, 6.5, 13.5, 3.5, 17), ...candle(19, 8.5, 15.5, 4.5, 19.5));

add('chart-gantt', 'chart,gantt,timeline,schedule,project plan,roadmap,กราฟแกนต์,ไทม์ไลน์,แผนงาน',
  p(AXES), p('M8 7.5h6'), p('M11 12h8'), p('M15 16.5h5'));

add('sigma', 'sigma,sum,summation,total,math,aggregate,ผลรวม,ซิกม่า,คณิตศาสตร์',
  p('M18 5H6.5l6.5 7-6.5 7H18'));

add('infinity', 'infinity,infinite,loop,unlimited,forever,math,อนันต์,ไม่จำกัด,วนซ้ำ',
  p('M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8'));

add('binary', 'binary,bits,zero one,digital,code,data,ไบนารี,เลขฐานสอง,บิต',
  p('M6 5.5 8 3.5V10'), '<rect x="14" y="3.5" width="5" height="6.5" rx="1.5" data-duotone />',
  '<rect x="5" y="14" width="5" height="6.5" rx="1.5" data-duotone />', p('M16 15.5 18 13.5V20'));

add('divide', 'divide,division,math,calculator,operator,หาร,เครื่องหมายหาร,คณิตศาสตร์',
  p('M5 12h14'), dot(12, 5.5), dot(12, 18.5));

add('equal', 'equal,equals,math,calculator,operator,เท่ากับ,เครื่องหมายเท่ากับ,คณิตศาสตร์',
  p('M5 9h14'), p('M5 15h14'));

add('pi', 'pi,math,constant,circle ratio,geometry,พาย,ค่าคงที่,คณิตศาสตร์',
  p('M5 5h14'), p('M9 5v14'), p('M15 5v11a3 3 0 0 0 3 3'));

for (const [name, { dir, tags, body }] of Object.entries(icons)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-tags="${tags}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>\n`;
  writeFileSync(`icons/${dir}/${name}.svg`, svg);
}
console.log(`wrote ${Object.keys(icons).length} icons`);
