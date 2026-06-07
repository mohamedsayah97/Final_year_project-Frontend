import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UpdateSupplier from '../pages/UpdateSupplier';
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
      supplier_name: 'Supplier Example',
      email: 'supplier@example.com',
      phone: '+1234567890',
      address: '123 Supplier Ave',
      registration_number: 'REG-001',
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

describe('UpdateSupplier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait charger les données du fournisseur', async () => {
    renderWithRouter(<UpdateSupplier />);
    await waitFor(() => expect(instance.get).toHaveBeenCalledWith('/supplier/1'));
  });
});
