// Runs against the built package (dist/), so `npm run build` first — `npm run check` does both.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as Icons from '../dist/react/index.js';
import { BahtIcon, SearchIcon, TempleIcon } from '../dist/react/index.js';
import TrashDefault from '../dist/react/icons/trash.js';

import { lint } from '../scripts/lint-icons.mjs';
import { loadPlan } from '../scripts/progress.mjs';

type Meta = { name: string; component: string; codepoint: string; tags: string[]; source: 'core' | 'thai' };
const meta: Meta[] = JSON.parse(readFileSync('dist/icons.json', 'utf8'));

describe('design spec (docs/design-spec.md)', () => {
  it('has no lint errors in icons/core and icons/thai', () => {
    const errors = lint().filter((p) => p.level === 'error');
    expect(errors.map((e) => `${e.file}  ${e.message}`)).toEqual([]);
  });
});

describe('0.1.0 icon list (docs/v1-icons.json)', () => {
  it('is fully drawn, and the package ships exactly that list', () => {
    const { rows } = loadPlan();
    const names = rows.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
    expect(rows.filter((r) => !r.drawn).map((r) => r.name)).toEqual([]);
    expect(meta.map((m) => m.name).sort()).toEqual([...names].sort());
  });
});

describe('build output', () => {
  it('strips source-only attributes from the outputs', () => {
    expect(meta.find((m) => m.name === 'search')?.source).toBe('core');
    expect(readFileSync('dist/svg/search.svg', 'utf8')).not.toContain('data-');
    expect(readFileSync('dist/sprite.svg', 'utf8')).not.toContain('data-');
  });

  it('has one SVG file, one sprite symbol and one React export per icon', () => {
    const svgs = readdirSync('dist/svg');
    const sprite = readFileSync('dist/sprite.svg', 'utf8');
    expect(svgs).toHaveLength(meta.length);
    expect(sprite.match(/<symbol /g)).toHaveLength(meta.length);
    for (const { name, component } of meta) {
      expect(svgs).toContain(`${name}.svg`);
      expect(sprite).toContain(`<symbol id="${name}"`);
      expect(Icons).toHaveProperty(component);
    }
  });

  it('includes the Thai set, each with search tags', () => {
    const thai = meta.filter((m) => m.source === 'thai').map((m) => m.name);
    expect(thai).toEqual(
      expect.arrayContaining(['baht', 'baht-circle', 'lotus', 'temple', 'thai-id-card', 'tuk-tuk']),
    );
    for (const m of meta.filter((x) => x.source === 'thai')) expect(m.tags.length).toBeGreaterThan(2);
  });

  it('keeps icon font codepoints stable and unique', () => {
    const saved: Record<string, string> = JSON.parse(readFileSync('icons/codepoints.json', 'utf8'));
    const used = new Set<string>();
    for (const m of meta) {
      expect(m.codepoint).toBe(saved[m.name]);
      expect(used.has(m.codepoint)).toBe(false);
      used.add(m.codepoint);
    }
  });

  // The font needs Python (scripts/font.py); CI always builds it, locally it's optional.
  it.skipIf(!existsSync('dist/font/thira-icons.css'))('has an icon font class per icon', () => {
    const css = readFileSync('dist/font/thira-icons.css', 'utf8');
    expect(css.match(/^\.ti-[a-z0-9-]+::before/gm)).toHaveLength(meta.length);
    expect(existsSync('dist/font/thira-icons.woff2')).toBe(true);
  });

  it('uses the 1.75 stroke by default', () => {
    expect(readFileSync('dist/svg/credit-card.svg', 'utf8')).toContain('stroke-width="1.75"');
  });
});

describe('React icons', () => {
  it('are decorative by default', () => {
    const { container } = render(<SearchIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('width', '1em');
    expect(svg).toHaveAttribute('stroke-width', '1.75');
    expect(svg).toHaveClass('thira-icon', 'thira-icon-search');
  });

  it('become a named image with `title`', () => {
    render(<BahtIcon title="Price in baht" />);
    const svg = screen.getByRole('img', { name: 'Price in baht' });
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('become a named image with `aria-label` (icon-only buttons)', () => {
    render(
      <button type="button">
        <SearchIcon aria-label="Search" />
      </button>,
    );
    const svg = screen.getByRole('img', { name: 'Search' });
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(svg).not.toHaveAttribute('aria-labelledby');
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('become a named image with `aria-labelledby`', () => {
    render(
      <>
        <span id="lbl">Temple</span>
        <TempleIcon aria-labelledby="lbl" />
      </>,
    );
    const svg = screen.getByRole('img', { name: 'Temple' });
    expect(svg).toHaveAttribute('aria-labelledby', 'lbl');
    expect(svg).not.toHaveAttribute('aria-hidden');
  });

  it('stay decorative with an empty `aria-label`', () => {
    const { container } = render(<SearchIcon aria-label="" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('take size, strokeWidth, className, other SVG props and a ref', () => {
    const ref = createRef<SVGSVGElement>();
    render(<TempleIcon ref={ref} size={32} strokeWidth={2} className="extra" data-testid="t" color="red" />);
    const svg = screen.getByTestId('t');
    expect(ref.current).toBe(svg);
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('stroke-width', '2');
    expect(svg).toHaveClass('thira-icon', 'thira-icon-temple', 'extra');
    expect(svg).toHaveAttribute('color', 'red');
  });

  it('are also default exports of per-icon modules', () => {
    expect(TrashDefault.displayName).toBe('TrashIcon');
  });
});
