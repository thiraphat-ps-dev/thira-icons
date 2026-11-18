import { createElement, useId, type ReactElement, type SVGProps } from 'react';

/** One SVG element of an icon: tag name and attributes. */
export type IconNode = readonly (readonly [tag: string, attrs: Readonly<Record<string, string>>])[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Width and height. Defaults to `1em`, so the icon follows the surrounding font size. */
  size?: number | string;
  /** Stroke width in grid units (the grid is 24). Defaults to 1.75. */
  strokeWidth?: number | string;
  /**
   * Accessible name. Without it the icon is decorative (`aria-hidden`) — the right choice when
   * text next to it already says the same thing, e.g. a button with a label.
   */
  title?: string;
}

export type ThiraIcon = ((props: IconProps) => ReactElement) & { displayName: string };

const DEFAULT_STROKE = 1.75;

/** Builds a React component from an icon's elements. Used by the generated icon modules. */
export function createIcon(displayName: string, node: IconNode, name: string): ThiraIcon {
  function Icon({ size = '1em', strokeWidth = DEFAULT_STROKE, title, className, ...props }: IconProps) {
    const titleId = useId();
    const a11y = title
      ? { role: 'img', 'aria-labelledby': titleId }
      : { 'aria-hidden': true as const, focusable: 'false' as const };
    return createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: className ? `thira-icon thira-icon-${name} ${className}` : `thira-icon thira-icon-${name}`,
        ...a11y,
        ...props,
      },
      title ? createElement('title', { id: titleId }, title) : null,
      ...node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs })),
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
