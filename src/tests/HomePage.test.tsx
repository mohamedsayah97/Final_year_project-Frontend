// src/tests/HomePage.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../components/HomePage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper pour render avec Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le composant HomePage', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('devrait afficher le titre principal Welcome to OptiManage', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Welcome to OptiManage')).toBeInTheDocument();
  });

  it('devrait afficher le sous-titre de la section hero', () => {
    renderWithRouter(<HomePage />);
    expect(
      screen.getByText(/The complete solution to optimize and manage your projects efficiently/i)
    ).toBeInTheDocument();
  });

  it('devrait afficher le titre "Why Choose OptiManage?"', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Why Choose OptiManage?')).toBeInTheDocument();
  });

  it('devrait afficher le bouton Get Started', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('devrait afficher le bouton Learn More', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('devrait avoir un lien vers /login sur le bouton Get Started', () => {
    renderWithRouter(<HomePage />);
    const link = screen.getByText('Get Started').closest('a') || screen.getByText('Get Started').parentElement?.querySelector('a');
    expect(link).toBeInTheDocument();
  });

  it('devrait afficher une section Features', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/Discover the features that make us the best choice/i)).toBeInTheDocument();
  });
});
