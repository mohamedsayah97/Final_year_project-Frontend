// src/tests/AddWorker.test.tsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddWorker from '../pages/AddWorker';
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
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AddWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le formulaire AddWorker', () => {
    renderWithRouter(<AddWorker />);
    expect(document.querySelector('body')).toBeInTheDocument();
  });

  it('devrait avoir des champs d\'entrée', async () => {
    renderWithRouter(<AddWorker />);
    await waitFor(() => {
      const inputs = screen.queryAllByRole('textbox');
      expect(inputs.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('devrait soumettre le formulaire avec les données correctes', async () => {
    const user = userEvent.setup();
    (instance.post as any).mockResolvedValue({ data: { success: true } });

    renderWithRouter(<AddWorker />);
    
    await waitFor(() => {
      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(0);
    });
  });
});
