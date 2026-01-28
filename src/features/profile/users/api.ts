import { apiClient } from "../../../api/client";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { CreateUserRequest, PaginatedResponse, RoleListItem, UsersListItem } from "./types";

export const usersApi = {
  list: async (page: number): Promise<PaginatedResponse<UsersListItem>> => {
    return apiClient.get(`${API_ENDPOINTS.USERS.LIST}?page=${page}`);
  },
  create: async (data: CreateUserRequest): Promise<UsersListItem> => {
    return apiClient.post(API_ENDPOINTS.USERS.CREATE, data);
  },
  update: async (endpoint: string, data: Record<string, unknown> | FormData): Promise<unknown> => {
    if (endpoint === API_ENDPOINTS.USERS.ASSIGN_ROLE) {
      return apiClient.post(endpoint, data);
    }
    return apiClient.patch(endpoint, data);
  },
  remove: async (endpoint: string): Promise<unknown> => {
    return apiClient.delete(endpoint);
  },
};

export const rolesApi = {
  list: async (page: number): Promise<PaginatedResponse<RoleListItem>> => {
    return apiClient.get(`${API_ENDPOINTS.ROLES.LIST}?page=${page}`);
  },
};

