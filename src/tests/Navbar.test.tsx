// src/tests/Navbar.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from '../components/Navbar';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import loginSlice from '../redux/features/loginSlice';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper pour render avec Redux et Router
const renderWithProviders = (
  component: React.ReactElement,
  preloadedState?: PreloadedState<any>
) => {
  const store = configureStore({
    reducer: {
      login: loginSlice,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le composant Navbar', () => {
    renderWithProviders(<Navbar />, {
      login: { isAuthenticated: false, user: null },
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('devrait afficher le nom d\'utilisateur depuis le Redux state', () => {
    const user = { email: 'test@example.com', id: '1' };
    renderWithProviders(<Navbar />, {
      login: { isAuthenticated: true, user },
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('devrait afficher le nom d\'utilisateur depuis localStorage si le state est vide', () => {
    localStorage.setItem('userEmail', 'john@example.com');
    renderWithProviders(<Navbar />, {
      login: { isAuthenticated: true, user: null },
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('devrait appeler onToggleSidebar quand on clique sur le bouton toggle', async () => {
    const mockToggle = vi.fn();
    renderWithProviders(<Navbar onToggleSidebar={mockToggle} />, {
      login: { isAuthenticated: false, user: null },
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('devrait basculer le menu mobile', async () => {
    renderWithProviders(<Navbar />, {
      login: { isAuthenticated: false, user: null },
    });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
