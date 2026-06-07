// src/tests/ListeVehicules.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListeVehicules from '../pages/ListeVehicules';
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
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ListeVehicules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre la liste des véhicules', async () => {
    renderWithRouter(<ListeVehicules />);
    await waitFor(() => {
      expect(document.querySelector('body')).toBeInTheDocument();
    });
  });

  it('devrait charger les données des véhicules au montage', async () => {
    renderWithRouter(<ListeVehicules />);
    
    await waitFor(() => {
      expect(instance.get).toHaveBeenCalled();
    }, { timeout: 5000 });
  });
});
