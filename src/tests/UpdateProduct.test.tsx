import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UpdateProduct from '../pages/UpdateProduct';
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
      name: 'Produit Test',
      description: 'Une description',
      price: 19.99,
      quantity: 5,
      location: 'Entrepôt Principal',
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

describe('UpdateProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait charger les données du produit', async () => {
    renderWithRouter(<UpdateProduct />);
    await waitFor(() => expect(instance.get).toHaveBeenCalledWith('/products/1'));
  });
});
