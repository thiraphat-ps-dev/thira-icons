// Reads thira-icons' own SVG sources (icons/core, icons/thai). They are small and regular by
// design (see docs/design-spec.md §8): one self-closing element per line, no groups or styles.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Folders of hand-drawn icons, highest priority first. A name here replaces Lucide's. */
export const SOURCE_DIRS = [
  { dir: 'icons/core', source: 'core' },
  { dir: 'icons/thai', source: 'thai' },
];

/**
 * @typedef {{ tag: string, attrs: Record<string, string | true>, line: number }} SourceElement
 * @typedef {{ name: string, file: string, source: string, root: Record<string, string | true>, tags: string[], elements: SourceElement[], otherTags: string[] }} SourceIcon
 */

/** `a="1" data-duotone` → { a: "1", "data-duotone": true } */
function parseAttrs(text) {
  /** @type {Record<string, string | true>} */
  const out = {};
  for (const [, key, value] of text.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) out[key] = value ?? true;
  return out;
}

/** @returns {SourceIcon} */
export function parseSource(file, source) {
  const text = readFileSync(file, 'utf8');
  const name = file.replace(/\\/g, '/').split('/').pop().replace(/\.svg$/, '');
  const rootMatch = /<svg\b([^>]*)>/.exec(text);
  const root = rootMatch ? parseAttrs(rootMatch[1]) : {};
  const tags = typeof root['data-tags'] === 'string' ? root['data-tags'].split(',').map((t) => t.trim()).filter(Boolean) : [];
  /** @type {SourceElement[]} */
  const elements = [];
  const otherTags = [];
  text.split('\n').forEach((lineText, i) => {
    for (const [, tag, attrText, selfClosing] of lineText.matchAll(/<(\w+)\b([^>]*?)\s*(\/?)>/g)) {
      if (tag === 'svg') continue;
      if (selfClosing) elements.push({ tag, attrs: parseAttrs(attrText), line: i + 1 });
      else otherTags.push(tag); // <g>, <text>, … — not allowed; the lint reports them
    }
  });
  return { name, file, source, root, tags, elements, otherTags };
}

/** Every hand-drawn icon, in priority order. */
export function loadSources() {
  return SOURCE_DIRS.flatMap(({ dir, source }) =>
    readdirSync(dir)
      .filter((f) => f.endsWith('.svg'))
      .sort()
      .map((f) => parseSource(join(dir, f), source)),
  );
}

/** Attributes that go into the outputs: drop data-* (tags, duotone marks) and valueless ones. */
export function outputAttrs(attrs) {
  return Object.fromEntries(
    Object.entries(attrs).filter(([k, v]) => !k.startsWith('data-') && typeof v === 'string'),
  );
}
