// Builds every output from two sources:
//   - Lucide (lucide-static, pinned in package.json): icon-nodes.json + tags.json
//   - icons/thai/*.svg: thira-icons' own Thai set
// Each icon goes through scripts/style.mjs, then out to dist/:
//   svg/<name>.svg, sprite.svg, icons.json, react/icons/<name>.js(+.d.ts), react/index.js(+.d.ts)
// The React runtime (src/create-icon.ts) is compiled separately by `tsc` into dist/react/.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { STROKE_WIDTH, restyle } from './style.mjs';

const require = createRequire(import.meta.url);
const DIST = 'dist';
const THAI_DIR = 'icons/thai';
const ELEMENTS = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);

/** @typedef {[string, Record<string, string>][]} Node */
/** @typedef {{ name: string, component: string, tags: string[], source: 'lucide' | 'thai', node: Node }} Icon */

/** Lucide icons, keyed by name. */
function loadLucide() {
  /** @type {Record<string, Node>} */
  const nodes = require('lucide-static/icon-nodes.json');
  /** @type {Record<string, string[]>} */
  const tags = require('lucide-static/tags.json');
  return Object.keys(nodes).map((name) => ({ name, tags: tags[name] ?? [], source: 'lucide', node: nodes[name] }));
}

/** Parses the small, regular SVGs in icons/thai (one element per line, self-closing). */
function loadThai() {
  return readdirSync(THAI_DIR)
    .filter((f) => f.endsWith('.svg'))
    .map((file) => {
      const name = file.slice(0, -4);
      const text = readFileSync(join(THAI_DIR, file), 'utf8');
      const tags = (/data-tags="([^"]*)"/.exec(text)?.[1] ?? '').split(',').filter(Boolean);
      /** @type {Node} */
      const node = [];
      for (const [, tag, attrText] of text.matchAll(/<(\w+)\s+([^>]*?)\s*\/>/g)) {
        if (!ELEMENTS.has(tag)) throw new Error(`${file}: unsupported element <${tag}>`);
        const attrs = Object.fromEntries([...attrText.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
        node.push([tag, attrs]);
      }
      if (node.length === 0) throw new Error(`${file}: no elements`);
      return { name, tags, source: 'thai', node };
    });
}

/** "arrow-up-right" → "ArrowUpRightIcon" */
function componentName(name) {
  return (
    name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Icon'
  );
}

/**
 * Icon font codepoints (Private Use Area) must never change between versions, or apps using the
 * font would show the wrong icon. They live in icons/codepoints.json: existing names keep theirs,
 * new names get the next free one, and removed names stay reserved so nothing is reused.
 */
const CODEPOINTS = 'icons/codepoints.json';
const FIRST_CODEPOINT = 0xe000;
function assignCodepoints(icons) {
  /** @type {Record<string, number>} */
  let map = {};
  try {
    const saved = JSON.parse(readFileSync(CODEPOINTS, 'utf8'));
    map = Object.fromEntries(Object.entries(saved).map(([k, hex]) => [k, parseInt(hex, 16)]));
  } catch {
    /* first build */
  }
  let next = Math.max(FIRST_CODEPOINT - 1, ...Object.values(map)) + 1;
  for (const icon of icons) {
    map[icon.name] ??= next++;
    icon.codepoint = map[icon.name];
  }
  if (next > 0xf8ff) throw new Error('Out of Private Use Area codepoints');
  const sorted = Object.entries(map)
    .sort(([, a], [, b]) => a - b)
    .map(([k, cp]) => [k, cp.toString(16)]);
  writeFileSync(CODEPOINTS, JSON.stringify(Object.fromEntries(sorted), null, 2) + '\n');
}

function check(icons) {
  const seen = new Map();
  for (const icon of icons) {
    if (!/^[a-z][a-z0-9-]*$/.test(icon.name)) throw new Error(`Bad icon name: ${icon.name}`);
    for (const key of [icon.name, icon.component]) {
      if (seen.has(key)) throw new Error(`"${icon.name}" clashes with "${seen.get(key)}" (${key})`);
      seen.set(key, icon.name);
    }
  }
}

const escape = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const attrs = (a) =>
  Object.entries(a)
    .map(([k, v]) => `${k}="${escape(v)}"`)
    .join(' ');
const elements = (node, indent) => node.map(([tag, a]) => `${indent}<${tag} ${attrs(a)} />`).join('\n');

const SVG_ATTRS = `xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"`;

function main() {
  /** @type {Icon[]} */
  const icons = [...loadLucide(), ...loadThai()]
    .map((icon) => ({
      ...icon,
      component: componentName(icon.name),
      node: icon.node.map(([tag, a]) => [tag, restyle(tag, a)]),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  check(icons);
  assignCodepoints(icons);

  rmSync(DIST, { recursive: true, force: true });
  for (const dir of ['svg', 'react/icons']) mkdirSync(join(DIST, dir), { recursive: true });

  for (const icon of icons) {
    // Raw SVG
    writeFileSync(
      join(DIST, 'svg', `${icon.name}.svg`),
      `<svg ${SVG_ATTRS} class="thira-icon thira-icon-${icon.name}">\n${elements(icon.node, '  ')}\n</svg>\n`,
    );
    // React module per icon (tree-shakeable, also importable as thira-icons/react/<name>)
    const node = JSON.stringify(icon.node);
    writeFileSync(
      join(DIST, 'react/icons', `${icon.name}.js`),
      `import { createIcon } from '../create-icon.js';\n\n` +
        `export const ${icon.component} = /* @__PURE__ */ createIcon(${JSON.stringify(icon.component)}, ${node}, ${JSON.stringify(icon.name)});\n` +
        `export default ${icon.component};\n`,
    );
    writeFileSync(
      join(DIST, 'react/icons', `${icon.name}.d.ts`),
      `import type { ThiraIcon } from '../create-icon.js';\n\n` +
        `export declare const ${icon.component}: ThiraIcon;\nexport default ${icon.component};\n`,
    );
  }

  const reexports = icons.map((i) => `export { ${i.component} } from './icons/${i.name}.js';`).join('\n');
  writeFileSync(
    join(DIST, 'react/index.js'),
    `export { createIcon } from './create-icon.js';\n${reexports}\n`,
  );
  writeFileSync(
    join(DIST, 'react/index.d.ts'),
    `export { createIcon, type IconNode, type IconProps, type ThiraIcon } from './create-icon.js';\n${reexports}\n`,
  );

  // Sprite: stroke width comes from a custom property so <use> instances can change it,
  // e.g. <svg style="--thira-icon-stroke-width: 1.5">. Presentation attributes on the symbol
  // would win over anything inherited from the page.
  const symbols = icons
    .map(
      (i) =>
        `  <symbol id="${i.name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width: var(--thira-icon-stroke-width, ${STROKE_WIDTH})">\n${elements(i.node, '    ')}\n  </symbol>`,
    )
    .join('\n');
  writeFileSync(join(DIST, 'sprite.svg'), `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols}\n</svg>\n`);

  writeFileSync(
    join(DIST, 'icons.json'),
    JSON.stringify(
      icons.map(({ name, component, tags, source, codepoint }) => ({
        name,
        component,
        codepoint: codepoint.toString(16),
        tags,
        source,
      })),
      null,
      0,
    ) + '\n',
  );

  const thai = icons.filter((i) => i.source === 'thai').length;
  console.log(`built ${icons.length} icons (${icons.length - thai} Lucide, ${thai} Thai)`);
}

main();
