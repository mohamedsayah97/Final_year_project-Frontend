import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddInvoice from '../pages/AddInvoice';
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

const renderWithRouter = (component: JSX.Element) => render(<BrowserRouter>{component}</BrowserRouter>);

describe('AddInvoice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le formulaire AddInvoice et générer un numéro', async () => {
    renderWithRouter(<AddInvoice />);
    await waitFor(() => {
      expect(screen.getByDisplayValue(/^INV-\d{4}-\d+$/)).toBeInTheDocument();
    });
  });

  it('devrait charger les produits au montage', async () => {
    renderWithRouter(<AddInvoice />);
    await waitFor(() => expect(instance.get).toHaveBeenCalledWith('/products/all'));
  });

  it('devrait soumettre le formulaire avec succès', async () => {
    const user = userEvent.setup();
    (instance.post as any).mockResolvedValueOnce({ data: { success: true } });

    renderWithRouter(<AddInvoice />);
    await waitFor(() => expect(instance.get).toHaveBeenCalledWith('/products/all'));

    const dateInput = document.querySelector('input[type="date"]');
    const dueDateInput = document.querySelectorAll('input[type="date"]')[1];
    const totalAmountInput = screen.getAllByPlaceholderText('0.00')[0];
    const taxAmountInput = screen.getAllByPlaceholderText('0.00')[1];
    const selects = screen.getAllByRole('combobox');

    if (!dateInput || !dueDateInput) {
      throw new Error('Date input fields not found');
    }

    await user.type(dateInput, '2024-01-15');
    await user.type(dueDateInput, '2024-02-15');
    await user.type(totalAmountInput, '1500');
    await user.type(taxAmountInput, '300');

    await user.selectOptions(selects[0], 'pending');
    await user.selectOptions(selects[1], 'net30');
    await user.click(screen.getByRole('button', { name: /Créer la facture/i }));

    await waitFor(() => {
      expect(instance.post).toHaveBeenCalledWith('/invoices/create', expect.any(Object));
    });
  });
});
