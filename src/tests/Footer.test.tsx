// src/tests/Footer.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('devrait rendre le composant Footer', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('devrait afficher le titre OptiManage et les liens rapides', () => {
    render(<Footer />);
    expect(screen.getByText('OptiManage')).toBeInTheDocument();
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getAllByText('Contact').length).toBeGreaterThanOrEqual(1);
  });

  it('devrait afficher les informations de contact', () => {
    render(<Footer />);
    expect(screen.getByText(/contact@optimanage\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 234 567 890/i)).toBeInTheDocument();
  });
});
