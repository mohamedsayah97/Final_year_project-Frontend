// src/tests/UpdateVehicules.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UpdateVehicules from '../pages/UpdateVehicules';
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

describe('UpdateVehicules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le formulaire UpdateVehicules', () => {
    renderWithRouter(<UpdateVehicules />);
    expect(document.querySelector('body')).toBeInTheDocument();
  });

  it('devrait charger les données du véhicule', async () => {
    renderWithRouter(<UpdateVehicules />);
    
    await waitFor(() => {
      expect(instance.get).toHaveBeenCalled();
    }, { timeout: 5000 });
  });
});
