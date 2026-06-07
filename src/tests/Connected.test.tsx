// src/tests/Connected.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Connected from '../pages/Connected';
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from '../redux/features/loginSlice';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

describe('Connected', () => {
  it('devrait rendre le composant Connected lorsque l’utilisateur est authentifié', () => {
    renderWithProviders(<Connected />);
    expect(screen.getByText(/OptiManage/i)).toBeInTheDocument();
  });
});
