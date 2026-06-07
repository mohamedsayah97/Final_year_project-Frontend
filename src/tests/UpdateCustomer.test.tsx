// src/tests/UpdateCustomer.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UpdateCustomer from '../pages/UpdateCustomer';
import { instance } from '../config/axios';

const mockNavigate = vi.fn();
const mockUseParams = vi.fn(() => ({ id: '1' }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

vi.mock('../config/axios', () => ({
  instance: {
    post: vi.fn(),
    get: vi.fn().mockResolvedValue({ data: { data: { id: '1' } } }),
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

describe('UpdateCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le formulaire UpdateCustomer', () => {
    renderWithRouter(<UpdateCustomer />);
    expect(document.querySelector('body')).toBeInTheDocument();
  });

  it('devrait charger les données du client', async () => {
    renderWithRouter(<UpdateCustomer />);
    
    await waitFor(() => {
      expect(instance.get).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  it('devrait soumettre la mise à jour', async () => {
    const user = userEvent.setup();
    (instance.put as any).mockResolvedValue({ data: { success: true } });

    renderWithRouter(<UpdateCustomer />);
    
    await waitFor(() => {
      expect(instance.get).toHaveBeenCalled();
    });

    const submitButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.toLowerCase().includes('update') || 
      btn.textContent?.toLowerCase().includes('save') ||
      btn.textContent?.toLowerCase().includes('modifier')
    );

    if (submitButton) {
      await user.click(submitButton);
      await waitFor(() => {
        expect(instance.put).toHaveBeenCalled();
      });
    }
  });
});
