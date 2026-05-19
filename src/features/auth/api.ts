import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { config } from "../../config";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (refresh: string) => {
    const res = await fetch(`${config.api.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || err?.message || 'Token refresh failed');
    }
    return res.json();
  },

  getMe: async (): Promise<{ user: any }> => {
    return apiClient.get(API_ENDPOINTS.AUTH.ME);
  },
  sendResetPasswordEmail: async (payload: { email: string }) => {
    return apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  },
  
  resetPassword: async (
    uid: string,
    token: string,
    data: { password: string; password2: string }
  ) => {
    return apiClient.post(
      `${API_ENDPOINTS.AUTH.RESET_PASSWORD}${uid}/${token}/`,
      data
    );
  },  
  
};

