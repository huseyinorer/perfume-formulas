import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
  }
}));

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const credentials = {
        username: 'testuser',
        password: 'password123'
      };

      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            username: 'testuser',
            isAdmin: false
          }
        }
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await api.post('/login', credentials);

      expect(api.post).toHaveBeenCalledWith('/login', credentials);
      expect(result.data.token).toBe('mock-jwt-token');
      expect(result.data.user.username).toBe('testuser');
    });

    it('should handle login failure', async () => {
      const credentials = {
        username: 'wronguser',
        password: 'wrongpass'
      };

      vi.mocked(api.post).mockRejectedValue({
        response: {
          status: 401,
          data: { error: 'Invalid credentials' }
        }
      });

      await expect(api.post('/login', credentials)).rejects.toMatchObject({
        response: {
          status: 401
        }
      });
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'password123'
      };

      const mockResponse = {
        data: {
          message: 'Registration successful',
          user: {
            id: 1,
            username: 'newuser',
            email: 'newuser@test.com'
          }
        }
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await api.post('/register', newUser);

      expect(api.post).toHaveBeenCalledWith('/register', newUser);
      expect(result.data.user.username).toBe('newuser');
    });

    it('should handle duplicate username', async () => {
      const newUser = {
        username: 'existinguser',
        email: 'test@test.com',
        password: 'password123'
      };

      vi.mocked(api.post).mockRejectedValue({
        response: {
          status: 400,
          data: { error: 'This username is already in use' }
        }
      });

      await expect(api.post('/register', newUser)).rejects.toMatchObject({
        response: {
          status: 400
        }
      });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const passwordData = {
        userId: 1,
        oldPassword: 'oldpass',
        newPassword: 'newpass123'
      };

      const mockResponse = {
        data: { message: 'Password updated successfully' }
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await api.post('/change-password', passwordData);

      expect(api.post).toHaveBeenCalledWith('/change-password', passwordData);
      expect(result.data.message).toBe('Password updated successfully');
    });
  });
});
