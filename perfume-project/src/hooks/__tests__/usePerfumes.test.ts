import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePerfumes } from '../usePerfumes';

// Mock fetch
global.fetch = vi.fn();

const mockPerfumesResponse = {
  data: [
    {
      id: 1,
      brand: 'Test Brand',
      name: 'Test Perfume',
      formulaCount: 2,
      is_favorite: false
    }
  ],
  total: 1,
  page: 1,
  totalPages: 1
};

describe('usePerfumes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should fetch perfumes on mount', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockPerfumesResponse,
    } as Response);

    const { result } = renderHook(() => usePerfumes());

    await waitFor(() => {
      expect(result.current.perfumes).toHaveLength(1);
    });

    expect(result.current.perfumes[0].name).toBe('Test Perfume');
    expect(result.current.totalItems).toBe(1);
  });

  it('should handle search', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockPerfumesResponse,
    } as Response);

    const { result } = renderHook(() => usePerfumes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.handleSearch('test');

    await waitFor(() => {
      expect(result.current.searchTerm).toBe('test');
    });
  });

  it('should handle pagination', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockPerfumesResponse,
    } as Response);

    const { result } = renderHook(() => usePerfumes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.setCurrentPage(2);

    await waitFor(() => {
      expect(result.current.currentPage).toBe(2);
    });
  });

  it('should include auth token when available', async () => {
    const mockToken = 'test-token';
    localStorage.setItem('token', mockToken);

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockPerfumesResponse,
    } as Response);

    renderHook(() => usePerfumes());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    const headers = fetchCall[1]?.headers as Record<string, string>;
    expect(headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should handle errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePerfumes());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
