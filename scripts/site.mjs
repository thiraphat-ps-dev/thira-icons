// Builds the preview site into site/ (deployed to GitHub Pages): a searchable grid of every
// icon, drawn from the sprite. Run after scripts/build.mjs.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const icons = JSON.parse(readFileSync('dist/icons.json', 'utf8'));
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));

// Overwrite in place (removing the folder fails on Windows while a dev server runs inside it).
mkdirSync('site', { recursive: true });
copyFileSync('dist/sprite.svg', 'site/sprite.svg');
writeFileSync('site/icons.json', JSON.stringify(icons));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>thira-icons</title>
<meta name="description" content="${icons.length} friendly, rounded stroke icons for React and HTML, with a Thai set.">
<style>
  :root { color-scheme: light dark; --bg: #fcfcfe; --surface: #fff; --text: #1d2130; --muted: #5d6275; --border: #e3e5ee; --accent: #4f46e5; --soft: #eef0ff; }
  @media (prefers-color-scheme: dark) { :root { --bg: #14161d; --surface: #1b1e27; --text: #eef0f6; --muted: #a7acbd; --border: #2c303d; --accent: #a5b4fc; --soft: #272b45; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.5 'Thira Sans', system-ui, sans-serif; }
  header { position: sticky; top: 0; z-index: 1; background: var(--bg); border-bottom: 1px solid var(--border); padding: 16px; }
  .bar { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; }
  h1 { margin: 0; font-size: 20px; }
  h1 small { color: var(--muted); font-weight: 400; font-size: 14px; }
  input[type=search] { flex: 1 1 240px; min-width: 0; padding: 8px 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); color: inherit; font: inherit; }
  label { display: inline-flex; gap: 8px; align-items: center; color: var(--muted); font-size: 14px; }
  main { max-width: 1200px; margin: 0 auto; padding: 16px; }
  h2 { font-size: 15px; margin: 24px 0 12px; color: var(--muted); font-weight: 600; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 8px; list-style: none; margin: 0; padding: 0; }
  .grid button { display: grid; place-items: center; gap: 8px; width: 100%; padding: 16px 6px 10px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); color: inherit; font: inherit; cursor: pointer; }
  .grid button:hover { border-color: var(--accent); }
  .grid button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .grid svg { width: var(--size, 24px); height: var(--size, 24px); }
  .name { font-size: 11px; color: var(--muted); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .thai button { background: var(--soft); }
  #status { min-height: 1.5em; color: var(--muted); font-size: 14px; }
  footer { max-width: 1200px; margin: 0 auto; padding: 24px 16px 48px; color: var(--muted); font-size: 13px; }
  a { color: var(--accent); }
</style>
</head>
<body>
<header>
  <div class="bar">
    <h1>thira-icons <small>v${version} · ${icons.length} icons</small></h1>
    <input type="search" id="q" placeholder="Search icons (English or Thai)…" aria-label="Search icons">
    <label>Size <input type="range" id="size" min="16" max="48" value="24" step="4"></label>
    <label>Stroke <input type="range" id="stroke" min="1" max="2.5" value="1.75" step="0.25"></label>
  </div>
</header>
<main>
  <p id="status" role="status"></p>
  <section aria-labelledby="h-thai"><h2 id="h-thai">Thai set</h2><ul class="grid thai" id="thai"></ul></section>
  <section aria-labelledby="h-all"><h2 id="h-all">All icons</h2><ul class="grid" id="all"></ul></section>
</main>
<footer>
  Click an icon to copy its React component name. Based on <a href="https://lucide.dev">Lucide</a> (ISC), restyled; Thai set by thira-icons.
</footer>
<script type="module">
  const icons = await (await fetch('icons.json')).json();
  const item = (i) => {
    const li = document.createElement('li');
    li.dataset.search = [i.name, ...i.tags].join(' ').toLowerCase();
    li.innerHTML = \`<button type="button" title="\${i.component}"><svg aria-hidden="true"><use href="sprite.svg#\${i.name}"/></svg><span class="name">\${i.name}</span></button>\`;
    li.querySelector('button').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(i.component); status.textContent = \`Copied \${i.component}\`; }
      catch { status.textContent = i.component; }
    });
    return li;
  };
  const status = document.getElementById('status');
  document.getElementById('thai').append(...icons.filter((i) => i.source === 'thai').map(item));
  document.getElementById('all').append(...icons.filter((i) => i.source !== 'thai').map(item));
  const q = document.getElementById('q');
  q.addEventListener('input', () => {
    const term = q.value.trim().toLowerCase();
    let shown = 0;
    for (const li of document.querySelectorAll('.grid li')) {
      const hit = !term || li.dataset.search.includes(term);
      li.hidden = !hit;
      if (hit) shown++;
    }
    status.textContent = term ? \`\${shown} icons\` : '';
  });
  const root = document.documentElement.style;
  document.getElementById('size').addEventListener('input', (e) => root.setProperty('--size', e.target.value + 'px'));
  document.getElementById('stroke').addEventListener('input', (e) => root.setProperty('--thira-icon-stroke-width', e.target.value));
</script>
</body>
</html>
`;
writeFileSync('site/index.html', html);
console.log(`site/ ready (${icons.length} icons)`);
