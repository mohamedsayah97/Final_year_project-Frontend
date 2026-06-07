import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddCustomer from '../pages/AddCustomer';
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

describe('AddCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le formulaire AddCustomer', () => {
    renderWithRouter(<AddCustomer />);
    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
  });

  it('devrait soumettre le formulaire avec succès', async () => {
    const user = userEvent.setup();
    (instance.post as any).mockResolvedValueOnce({ data: { id: '1' } });

    renderWithRouter(<AddCustomer />);

    await user.type(screen.getByPlaceholderText('First name'), 'John');
    await user.type(screen.getByPlaceholderText('Last name'), 'Doe');
    await user.type(screen.getByPlaceholderText('customer@example.com'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('+216 12345678'), '+21698765432');
    await user.type(screen.getByPlaceholderText('Full address'), '123 Main St');
    await user.selectOptions(screen.getByRole('combobox'), 'regular');
    await user.click(screen.getByRole('button', { name: /Add Customer/i }));

    await waitFor(() => {
      expect(instance.post).toHaveBeenCalledWith('/customers/create', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+21698765432',
        address: '123 Main St',
        customerType: 'regular',
      });
    });
  });
});
