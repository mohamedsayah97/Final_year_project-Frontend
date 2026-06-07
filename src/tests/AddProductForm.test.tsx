import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddProductForm from '../pages/AddProduct';
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
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  },
}));

const renderWithRouter = (component: JSX.Element) => render(<BrowserRouter>{component}</BrowserRouter>);

describe('AddProductForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le formulaire AddProduct', () => {
    renderWithRouter(<AddProductForm />);
    expect(screen.getByPlaceholderText('e.g., Wireless Mouse')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe the product...')).toBeInTheDocument();
  });

  it('devrait afficher des erreurs de validation lorsque le formulaire est invalide', async () => {
    renderWithRouter(<AddProductForm />);
    await userEvent.click(screen.getByRole('button', { name: /Ajouter le produit/i }));

    await waitFor(() => {
      expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
      expect(screen.getByText('La description est requise')).toBeInTheDocument();
    });
    expect(instance.post).not.toHaveBeenCalled();
  });

  it('devrait soumettre le formulaire avec succès lorsque les données sont valides', async () => {
    const user = userEvent.setup();
    (instance.post as any).mockResolvedValueOnce({ data: { id: '1' } });

    renderWithRouter(<AddProductForm />);
    await user.type(screen.getByPlaceholderText('e.g., Wireless Mouse'), 'Produit Test');
    await user.type(screen.getByPlaceholderText('Describe the product...'), 'Description produit valide');
    await user.type(screen.getByPlaceholderText('0.00'), '49.99');
    await user.type(screen.getByPlaceholderText('0'), '10');
    await user.type(screen.getByPlaceholderText('Warehouse A, Store #42'), 'Entrepôt Principal');

    await user.click(screen.getByRole('button', { name: /Ajouter le produit/i }));

    await waitFor(() => {
      expect(instance.post).toHaveBeenCalledWith('/products/create', {
        name: 'Produit Test',
        description: 'Description produit valide',
        price: 49.99,
        quantity: 10,
        location: 'Entrepôt Principal',
      });
    });
  });
});
