// src/tests/Dashboard.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dashboard from '../pages/Dashboard';
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from '../redux/features/loginSlice';
import { instance } from '../config/axios';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../config/axios', () => ({
  instance: {
    post: vi.fn(),
    get: vi.fn().mockResolvedValue({ data: [] }),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      login: loginSlice,
    },
    preloadedState: {
      login: {
        isAuthenticated: true,
        user: { id: 1, email: 'test@example.com', role: 'admin' },
        token: 'token',
        status: 'succeeded',
        error: null,
      },
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le composant Dashboard et afficher le chargement', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Chargement du dashboard.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(instance.get).toHaveBeenCalledWith('/vehicules/all');
    });
  });
});
