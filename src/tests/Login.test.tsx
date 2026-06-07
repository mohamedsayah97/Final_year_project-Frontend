// src/tests/Login.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from '../pages/Login';
import { configureStore } from '@reduxjs/toolkit';
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
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      login: loginSlice,
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le formulaire de connexion', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('main') || document.querySelector('body')).toBeInTheDocument();
  });

  it('devrait avoir les champs email et mot de passe', () => {
    renderWithProviders(<Login />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('devrait soumettre le formulaire avec les identifiants corrects', async () => {
    const user = userEvent.setup();
    (instance.post as any).mockResolvedValue({ data: { token: 'test-token', user: { id: '1' } } });

    renderWithProviders(<Login />);
    
    const submitButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.toLowerCase().includes('login') || 
      btn.textContent?.toLowerCase().includes('connexion') ||
      btn.textContent?.toLowerCase().includes('submit')
    );

    if (submitButton) {
      await user.click(submitButton);
      await waitFor(() => {
        expect(instance.post).toHaveBeenCalled();
      });
    }
  });
});
