import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

// Mock hooks to avoid API calls and complex state
vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isLoggedIn: false,
    isAdmin: false,
    handleLogin: vi.fn(),
    handleLogout: vi.fn(),
  }),
}));

vi.mock('./hooks/usePerfumes', () => ({
  usePerfumes: () => ({
    perfumes: [],
    currentPage: 1,
    setCurrentPage: vi.fn(),
    pageSize: 20,
    setPageSize: vi.fn(),
    totalPages: 1,
    totalItems: 0,
    handleSearch: vi.fn(),
    fetchPerfumes: vi.fn(),
  }),
}));

vi.mock('./hooks/useFormulas', () => ({
  useFormulas: () => ({
    formulas: [],
    creativeFormula: null,
    fetchFormulas: vi.fn(),
    fetchCreativeFormula: vi.fn(),
    handleSaveFormula: vi.fn(),
    handleFormulaRequest: vi.fn(),
    handleDeleteFormula: vi.fn(),
    handleRatingChange: vi.fn(),
  }),
}));

vi.mock('./hooks/useAdmin', () => ({
  useAdmin: () => ({
    pendingRequests: [],
    handleApproveRequest: vi.fn(),
    handleRejectRequest: vi.fn(),
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('App Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    // Check for main heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('shows login button when not logged in', () => {
    renderWithProviders(<App />);
    // Look for button with text containing "Giriş"
    const loginButton = screen.getByRole('button', { name: /Giriş/i });
    expect(loginButton).toBeInTheDocument();
  });
});
