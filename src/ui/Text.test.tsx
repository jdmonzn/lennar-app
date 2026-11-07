import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text, type TextVariant } from './Text';

describe('Text', () => {
  it('renders a level-one heading when as="h1"', () => {
    render(
      <Text as="h1" variant="display">
        A better way to ship web apps
      </Text>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'A better way to ship web apps' }),
    ).toBeInTheDocument();
  });

  it.each([
    { as: 'h2', tagName: 'H2' },
    { as: 'p', tagName: 'P' },
    { as: 'span', tagName: 'SPAN' },
  ] as const)('renders a <$as> element', ({ as, tagName }) => {
    render(
      <Text as={as} variant="body">
        Copy
      </Text>,
    );

    expect(screen.getByText('Copy').tagName).toBe(tagName);
  });

  it('applies the responsive display sizes from the spec', () => {
    render(
      <Text as="h1" variant="display">
        Heading
      </Text>,
    );

    expect(screen.getByText('Heading')).toHaveClass(
      'text-4xl',
      'font-extrabold',
      'tracking-tight',
      'md:text-5xl',
      'md:tracking-[-0.04em]',
      'lg:text-6xl',
      'lg:tracking-tight',
      'xl:text-7xl',
      'xl:tracking-normal',
    );
  });

  it.each<[TextVariant, ReadonlyArray<string>]>([
    ['bodyLarge', ['text-base', 'md:text-lg', 'lg:text-xl', 'xl:text-2xl/7', 'text-gray-300']],
    ['body', ['text-base']],
    ['nav', ['text-base', 'font-medium']],
    ['helper', ['text-sm']],
    ['badge', ['text-xs/5', 'font-medium', 'tracking-wide', 'uppercase']],
  ])('applies the %s typography', (variant, classes) => {
    render(
      <Text as="p" variant={variant}>
        Copy
      </Text>,
    );

    expect(screen.getByText('Copy')).toHaveClass(...classes);
  });
});
