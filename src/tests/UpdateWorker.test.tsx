import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UpdateWorker from '../pages/UpdateWorker';
import { instance } from '../config/axios';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('../config/axios', () => ({
  instance: {
    post: vi.fn(),
    get: vi.fn().mockResolvedValue({ data: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+1234567890',
      city: 'Tunis',
      jobTitle: 'Developer',
      department: 'IT',
      hireDate: '2024-01-01T00:00:00Z',
      contractType: 'CDI',
      salary: 50000,
      hasCompanyCar: false,
    } }),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

const renderWithRouter = (component: JSX.Element) => render(<BrowserRouter>{component}</BrowserRouter>);

describe('UpdateWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait charger les données du travailleur', async () => {
    renderWithRouter(<UpdateWorker />);
    await waitFor(() => expect(instance.get).toHaveBeenCalledWith('/workers/1'));
  });
});
