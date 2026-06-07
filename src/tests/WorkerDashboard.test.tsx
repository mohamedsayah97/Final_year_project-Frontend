import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WorkerDashboard from '../pages/WorkerDashboard';
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

const renderWithRouter = (component: JSX.Element) => render(<BrowserRouter>{component}</BrowserRouter>);

describe('WorkerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait charger les données du dashboard des travailleurs', async () => {
    renderWithRouter(<WorkerDashboard />);
    await waitFor(() => expect(instance.get).toHaveBeenCalled());
  });
});
