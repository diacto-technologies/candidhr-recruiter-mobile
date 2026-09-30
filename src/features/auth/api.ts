import { QA_BASE_URL } from "@env";
import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { config } from "../../config";
import { CheckSubdomainResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types";

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
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh
    })
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

  checkSubdomain: async (subdomain: string): Promise<CheckSubdomainResponse> => {
    // If environment is QA, do not call check-subdomain API
    if (config.api.baseURL === QA_BASE_URL) {
      return {
        subdomain,
        exists: true,
      };
    }

    const prodBase = config.api.prodBaseURL || 'https://api.candidhr.ai';
    const response = await fetch(`${prodBase}${API_ENDPOINTS.AUTH.CHECK_SUBDOMAIN(subdomain)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || 'No tenant found for this subdomain.';
      throw new Error(errorMessage);
    }

    if (data?.exists === false) {
      throw new Error(data?.detail || 'No tenant found for this subdomain.');
    }

    return data;
  },
};

