import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  getMe: async (): Promise<{ user: any }> => {
    return apiClient.get(API_ENDPOINTS.AUTH.ME);
  },

  // Legacy API function for backward compatibility
  fetchPostsApi: async () => {
    return fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json());
  },
};

