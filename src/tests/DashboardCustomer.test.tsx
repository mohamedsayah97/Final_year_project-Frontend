// src/tests/DashboardCustomer.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardCustomer from '../pages/DashboardCustomer';
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
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DashboardCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le composant DashboardCustomer', async () => {
    renderWithRouter(<DashboardCustomer />);

    await waitFor(() => {
      expect(instance.get).toHaveBeenCalledWith('/customers/all');
    });

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Clients/i)).toBeInTheDocument();
    });
  });
});
