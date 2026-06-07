// src/tests/SideBar.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import SideBar from '../pages/SideBar';
import { configureStore } from '@reduxjs/toolkit';
import loginSlice from '../redux/features/loginSlice';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

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

describe('SideBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le composant SideBar', () => {
    renderWithProviders(<SideBar />);
    expect(screen.getByRole('navigation') || document.querySelector('aside') || document.querySelector('nav')).toBeInTheDocument();
  });

  it('devrait contenir une navigation', () => {
    renderWithProviders(<SideBar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
