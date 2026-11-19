// Resolves the package's own `exports` map by name (Node package self-reference), the way
// consumers import it. thira-ui imports these subpaths directly.
import { createRequire } from 'node:module';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CheckIcon from 'thira-icons/react/check';
import ChevronDownIcon from 'thira-icons/react/chevron-down';
import MinusIcon from 'thira-icons/react/minus';
import XIcon from 'thira-icons/react/x';

const require = createRequire(import.meta.url);

describe('package exports used by thira-ui', () => {
  const used = { check: CheckIcon, x: XIcon, 'chevron-down': ChevronDownIcon, minus: MinusIcon };

  it.each(Object.keys(used))('resolves thira-icons/react/%s to the built module', (name) => {
    expect(require.resolve(`thira-icons/react/${name}`)).toMatch(
      new RegExp(`[\\\\/]dist[\\\\/]react[\\\\/]icons[\\\\/]${name}\\.js$`),
    );
  });

  it.each(Object.entries(used))('imports and renders thira-icons/react/%s', (name, Icon) => {
    const { container } = render(<Icon />);
    expect(container.querySelector('svg')).toHaveClass(`thira-icon-${name}`);
  });
});
