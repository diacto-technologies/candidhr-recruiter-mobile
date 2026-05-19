import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import { config } from '../../../config';
import { authApi } from '../api';

jest.mock('../../../api/client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));
jest.mock('../../../api/endpoints', () => ({
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login/',
      REGISTER: '/auth/register/',
      LOGOUT: '/auth/logout/',
      REFRESH: '/auth/refresh/',
      ME: '/auth/me/',
      FORGOT_PASSWORD: '/auth/forgot-password/',
      RESET_PASSWORD: '/auth/reset-password/',
    },
  },
}));
jest.mock('../../../config', () => ({
  config: {
    api: {
      baseURL: 'https://api.example.com',
    },
  },
}));

describe('authApi() authApi method', () => {
  describe('Happy Paths', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully login with valid credentials', async () => {
      const credentials = { username: 'user', password: 'pass' };
      const mockResponse = {
        user_id: 1,
        access: 'token',
        refresh: 'refreshToken',
        tenant: 'tenantA',
      };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGIN, credentials);
      expect(result).toEqual(mockResponse);
    });

    it('should successfully register with valid data', async () => {
      const data = { username: 'newuser', password: 'newpass', email: 'new@user.com' };
      const mockResponse = { id: 2, username: 'newuser', email: 'new@user.com' };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authApi.register(data);

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REGISTER, data);
      expect(result).toEqual(mockResponse);
    });

    it('should successfully logout', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(authApi.logout()).resolves.toBeUndefined();
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGOUT);
    });

    it('should successfully refresh token', async () => {
      const refresh = 'refreshToken';
      const mockResponse = { access: 'newAccessToken', refresh: 'newRefreshToken' };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      } as any);

      const result = await authApi.refreshToken(refresh);

      expect(global.fetch).toHaveBeenCalledWith(
        `${config.api.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should successfully get current user', async () => {
      const mockUser = { user: { id: 1, username: 'user' } };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await authApi.getMe();

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.ME);
      expect(result).toEqual(mockUser);
    });

    it('should successfully send reset password email', async () => {
      const payload = { email: 'user@example.com' };
      const mockResponse = { success: true };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authApi.sendResetPasswordEmail(payload);

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
      expect(result).toEqual(mockResponse);
    });

    it('should successfully reset password', async () => {
      const uid = 'abc123';
      const token = 'token456';
      const data = { password: 'newpass', password2: 'newpass' };
      const mockResponse = { success: true };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authApi.resetPassword(uid, token, data);

      expect(apiClient.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.AUTH.RESET_PASSWORD}${uid}/${token}/`,
        data,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error if refreshToken response is not ok and error has detail', async () => {
      const refresh = 'badToken';
      const errorDetail = { detail: 'Invalid token' };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(errorDetail),
      } as any);

      await expect(authApi.refreshToken(refresh)).rejects.toThrow('Invalid token');
    });

    it('should throw error if refreshToken response is not ok and error has message', async () => {
      const refresh = 'badToken';
      const errorMessage = { message: 'Token expired' };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(errorMessage),
      } as any);

      await expect(authApi.refreshToken(refresh)).rejects.toThrow('Token expired');
    });

    it('should throw generic error if refreshToken response is not ok and error has no detail/message', async () => {
      const refresh = 'badToken';

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({}),
      } as any);

      await expect(authApi.refreshToken(refresh)).rejects.toThrow('Token refresh failed');
    });

    it('should throw generic error if refreshToken response is not ok and json parsing fails', async () => {
      const refresh = 'badToken';

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockRejectedValueOnce(new Error('Parse error')),
      } as any);

      await expect(authApi.refreshToken(refresh)).rejects.toThrow('Token refresh failed');
    });

    it('should handle login with extra fields in credentials', async () => {
      const credentials = { username: 'user', password: 'pass', extra: 'field' };
      const mockResponse = {
        user_id: 1,
        access: 'token',
        refresh: 'refreshToken',
        tenant: 'tenantA',
      };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authApi.login(credentials as any);

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGIN, credentials);
      expect(result).toEqual(mockResponse);
    });

    it('should handle register with minimal required fields', async () => {
      const data = { username: 'user', password: 'pass' };
      const mockResponse = { id: 3, username: 'user' };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authApi.register(data as any);

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REGISTER, data);
      expect(result).toEqual(mockResponse);
    });

    it('should handle resetPassword with passwords that do not match', async () => {
      const uid = 'uid';
      const token = 'token';
      const data = { password: 'pass1', password2: 'pass2' };
      const mockResponse = { error: 'Passwords do not match' };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authApi.resetPassword(uid, token, data);

      expect(apiClient.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.AUTH.RESET_PASSWORD}${uid}/${token}/`,
        data,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle sendResetPasswordEmail with unusual email format', async () => {
      const payload = { email: 'user+test@sub.domain.example.com' };
      const mockResponse = { success: true };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authApi.sendResetPasswordEmail(payload);

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
      expect(result).toEqual(mockResponse);
    });

    it('should handle getMe when user object is empty', async () => {
      const mockUser = { user: {} };
      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await authApi.getMe();

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.ME);
      expect(result).toEqual(mockUser);
    });
  });
});
