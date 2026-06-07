// src/tests/ListUsers.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ListUsers from '../pages/ListUsers';
import loginSlice from '../redux/features/loginSlice';
import { instance } from '../config/axios';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
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

describe('ListUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait charger les données des utilisateurs au montage', async () => {
    renderWithProviders(<ListUsers />);
    await waitFor(() => expect(instance.get).toHaveBeenCalledWith('/user/all'));
  });
});
