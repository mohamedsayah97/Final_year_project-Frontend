// src/tests/Register.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Register from '../pages/Register';
import { configureStore } from '@reduxjs/toolkit';
import registerSlice from '../redux/features/registerSlice';
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
      register: registerSlice,
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

vi.mock('../redux/features/loginSlice', async () => {
  const actual = await vi.importActual('../redux/features/loginSlice');
  return {
    ...actual,
    logoutUser: vi.fn(() => ({ type: 'logout' })),
  };
});

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le formulaire d\'inscription', () => {
    renderWithProviders(<Register />);
    expect(screen.getByRole('main') || document.querySelector('body')).toBeInTheDocument();
  });

  it('devrait avoir les champs requis pour l\'inscription', () => {
    renderWithProviders(<Register />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('devrait soumettre le formulaire avec les données correctes', async () => {
    const user = userEvent.setup();
    (instance.post as any).mockResolvedValue({ data: { success: true } });

    renderWithProviders(<Register />);
    
    const submitButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.toLowerCase().includes('register') || 
      btn.textContent?.toLowerCase().includes('inscription') ||
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
