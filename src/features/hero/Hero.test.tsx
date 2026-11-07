import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HERO_CONTENT } from '../../content/heroContent';
import { Hero } from './Hero';

const CONTENT = HERO_CONTENT.hero;

function renderHero() {
  return render(<Hero content={CONTENT} signupForm={<form aria-label="Signup slot" />} />);
}

describe('Hero', () => {
  it('renders exactly one h1 with both heading lines', () => {
    renderHero();

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 1, name: 'A better way to ship web apps' }),
    ).toBeInTheDocument();
  });

  it('highlights the second heading line in indigo-400', () => {
    renderHero();

    expect(screen.getByText('ship web apps')).toHaveClass('block', 'text-indigo-400');
  });

  it('renders the callout and the supporting copy', () => {
    renderHero();

    expect(screen.getByRole('link', { name: /Visit our careers page/ })).toBeInTheDocument();
    expect(screen.getByText(CONTENT.body)).toBeInTheDocument();
  });

  it('renders the signup form it is given', () => {
    renderHero();

    expect(screen.getByRole('form', { name: 'Signup slot' })).toBeInTheDocument();
  });
});
