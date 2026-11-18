// Review page for a batch: each new drawing next to the Lucide icon it replaces, at 16/24/48 px,
// in light and dark, plus a large view on the 24 grid.
//   npm run build && node explore/review.mjs 1   →  explore/review.html
import { readFileSync, writeFileSync } from 'node:fs';
import { loadPlan } from '../scripts/progress.mjs';

const batch = process.argv[2] ?? '1';
const { rows } = loadPlan();
const names = rows.filter((r) => String(r.batch) === batch && r.drawn).map((r) => r.name);

const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const ours = (n) => inner(readFileSync(`dist/svg/${n}.svg`, 'utf8'));
const lucide = (n) => {
  try {
    return inner(readFileSync(`node_modules/lucide-static/icons/${n}.svg`, 'utf8'));
  } catch {
    return null;
  }
};
const svg = (body, width) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const row = (n) => {
  const l = lucide(n);
  return `<tr>
    <th>${n}</th>
    <td class="s16">${svg(ours(n), 1.75)}</td><td class="s24">${svg(ours(n), 1.75)}</td><td class="s48">${svg(ours(n), 1.75)}</td>
    <td class="sep"></td>
    <td class="s16 ref">${l ? svg(l, 2) : '—'}</td><td class="s24 ref">${l ? svg(l, 2) : ''}</td><td class="s48 ref">${l ? svg(l, 2) : ''}</td>
  </tr>`;
};
const table = (theme) => `<div class="theme ${theme}"><table>
  <thead><tr><th></th><th colspan="3">thira-icons (new)</th><th class="sep"></th><th colspan="3">Lucide (replaced)</th></tr>
  <tr><th></th><th>16</th><th>24</th><th>48</th><th class="sep"></th><th>16</th><th>24</th><th>48</th></tr></thead>
  <tbody>${names.map(row).join('')}</tbody></table></div>`;

const html = `<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>thira-icons · batch ${batch} review</title>
<style>
  @font-face { font-family: 'Thira Sans'; src: url('https://thiraphat-ps-dev.github.io/thira-sans/fonts/ThiraSans-VF.woff2') format('woff2'); font-weight: 100 700; }
  body { margin: 0; font: 14px/1.5 'Thira Sans', system-ui, sans-serif; background: #e9eaf0; color: #1d2130; }
  h1 { font-size: 20px; margin: 20px 16px 4px; } p { margin: 0 16px 12px; color: #5d6275; }
  .themes { display: grid; grid-template-columns: repeat(auto-fit, minmax(520px, 1fr)); gap: 16px; padding: 0 16px 24px; }
  .theme { --bg: #fcfcfe; --text: #1d2130; --muted: #8a8fa3; background: var(--bg); color: var(--text); border-radius: 16px; padding: 12px; }
  .dark { --bg: #14161d; --text: #eef0f6; --muted: #7d8295; }
  table { border-collapse: collapse; width: 100%; }
  th { font-weight: 500; font-size: 12px; color: var(--muted); text-align: left; padding: 4px 8px; white-space: nowrap; }
  td { padding: 4px 8px; text-align: center; vertical-align: middle; }
  tbody tr + tr td, tbody tr + tr th { border-top: 1px solid color-mix(in oklab, var(--muted) 25%, transparent); }
  .ref { opacity: .55; } .sep { width: 12px; }
  .s16 svg { width: 16px; height: 16px; } .s24 svg { width: 24px; height: 24px; } .s48 svg { width: 48px; height: 48px; }
  .grid { display: flex; flex-wrap: wrap; gap: 10px; padding: 0 16px 32px; }
  figure { margin: 0; background: #fff; border-radius: 12px; padding: 6px; text-align: center; font-size: 11px; color: #5d6275; }
  figure svg { width: 96px; height: 96px; background: linear-gradient(#e6e8f5 1px, transparent 1px) 0 0 / 4px 4px, linear-gradient(90deg, #e6e8f5 1px, transparent 1px) 0 0 / 4px 4px;
    box-shadow: inset 8px 8px 0 0 #fff0f0, inset -8px -8px 0 0 #fff0f0; }
</style></head><body>
<h1>thira-icons · batch ${batch} (${names.length} icons)</h1>
<p>ซ้าย: ที่วาดใหม่ (Soft, เส้น 1.75) · ขวา: Lucide ที่ถูกแทน (จาง, เส้น 2) · ล่างสุด: ขยายบน grid 24 — แถบชมพูคือ padding 2 หน่วย</p>
<div class="themes">${table('light')}${table('dark')}</div>
<div class="grid">${names.map((n) => `<figure>${svg(ours(n), 1.75)}<figcaption>${n}</figcaption></figure>`).join('')}</div>
</body></html>`;
writeFileSync('explore/review.html', html);
console.log(`explore/review.html: batch ${batch}, ${names.length} icons`);
