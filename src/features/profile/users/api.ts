import { apiClient } from "../../../api/client";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type {
  CreateUserRequest,
  InviteListItem,
  PaginatedResponse,
  RoleListItem,
  UsersListItem,
} from "./types";

export const usersApi = {
  /** GET /core/v2/users/?page= — members list + share modals using `list` slice. */
  list: async (page: number): Promise<PaginatedResponse<UsersListItem>> => {
    return apiClient.get(`${API_ENDPOINTS.USERS.V2_LIST}?page=${page}`);
  },
  invitesList: async (page: number): Promise<PaginatedResponse<InviteListItem>> => {
    return apiClient.get(`${API_ENDPOINTS.USERS.V2_INVITES}?page=${page}`);
  },
  resendInvite: async (inviteId: string): Promise<unknown> => {
    return apiClient.post(API_ENDPOINTS.USERS.V2_INVITE_RESEND(inviteId), {});
  },
  revokeInvite: async (inviteId: string): Promise<unknown> => {
    return apiClient.post(API_ENDPOINTS.USERS.V2_INVITE_REVOKE(inviteId), {});
  },
  directoryList: async (page: number): Promise<PaginatedResponse<UsersListItem>> => {
    return apiClient.get(`${API_ENDPOINTS.USERS.LIST_PAGE}?page=${page}`);
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
    const res: unknown = await apiClient.get(`${API_ENDPOINTS.ROLES.LIST}?page=${page}`);
    // Backend sometimes returns a plain array for roles; normalize to our paginated shape.
    if (Array.isArray(res)) {
      return {
        count: res.length,
        next: null,
        previous: null,
        results: res as RoleListItem[],
      };
    }
    return res as PaginatedResponse<RoleListItem>;
  },
};

