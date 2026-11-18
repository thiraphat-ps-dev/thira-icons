// Runs against the built package (dist/), so `npm run build` first — `npm run check` does both.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as Icons from '../dist/react/index.js';
import { BahtIcon, SearchIcon, TempleIcon } from '../dist/react/index.js';
import TrashDefault from '../dist/react/icons/trash.js';

type Meta = { name: string; component: string; codepoint: string; tags: string[]; source: 'lucide' | 'thai' };
const meta: Meta[] = JSON.parse(readFileSync('dist/icons.json', 'utf8'));

describe('build output', () => {
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

  it('applies the Thira style: stroke 1.75 and softer rect corners', () => {
    const card = readFileSync('dist/svg/credit-card.svg', 'utf8');
    expect(card).toContain('stroke-width="1.75"');
    expect(card).toMatch(/<rect [^>]*rx="3"/); // Lucide draws it with rx="2"
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
    expect(screen.getByRole('img', { name: 'Price in baht' })).toBeInTheDocument();
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
