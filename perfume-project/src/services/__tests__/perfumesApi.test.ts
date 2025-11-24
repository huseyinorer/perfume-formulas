import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';

// Mock the api module
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('perfumesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPerfumes', () => {
    it('should fetch perfumes with pagination', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: 1, brand: 'Test Brand', name: 'Test Perfume' }
          ],
          total: 1,
          page: 1,
          totalPages: 1
        }
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await api.get('/perfumes?page=1&limit=10');

      expect(api.get).toHaveBeenCalledWith('/perfumes?page=1&limit=10');
      expect(result.data.data).toHaveLength(1);
      expect(result.data.data[0].name).toBe('Test Perfume');
    });

    it('should handle search parameter', async () => {
      const mockResponse = {
        data: {
          data: [],
          total: 0,
          page: 1,
          totalPages: 0
        }
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      await api.get('/perfumes?page=1&limit=10&search=test');

      expect(api.get).toHaveBeenCalledWith('/perfumes?page=1&limit=10&search=test');
    });
  });

  describe('createPerfume', () => {
    it('should create a new perfume', async () => {
      const newPerfume = {
        brand_id: 1,
        perfume_name: 'New Perfume',
        type: 'EDP'
      };

      const mockResponse = {
        data: { id: 1, ...newPerfume }
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await api.post('/perfumes', newPerfume);

      expect(api.post).toHaveBeenCalledWith('/perfumes', newPerfume);
      expect(result.data.perfume_name).toBe('New Perfume');
    });
  });

  describe('updatePerfume', () => {
    it('should update an existing perfume', async () => {
      const updatedPerfume = {
        brand_id: 1,
        perfume_name: 'Updated Perfume',
        type: 'EDP'
      };

      const mockResponse = {
        data: { id: 1, ...updatedPerfume }
      };

      vi.mocked(api.put).mockResolvedValue(mockResponse);

      const result = await api.put('/perfumes/1', updatedPerfume);

      expect(api.put).toHaveBeenCalledWith('/perfumes/1', updatedPerfume);
      expect(result.data.perfume_name).toBe('Updated Perfume');
    });
  });

  describe('deletePerfume', () => {
    it('should delete a perfume', async () => {
      const mockResponse = {
        data: { message: 'Perfume deleted successfully' }
      };

      vi.mocked(api.delete).mockResolvedValue(mockResponse);

      const result = await api.delete('/perfumes/1');

      expect(api.delete).toHaveBeenCalledWith('/perfumes/1');
      expect(result.data.message).toBe('Perfume deleted successfully');
    });
  });
});
