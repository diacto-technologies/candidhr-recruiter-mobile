import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { UpdateProfileRequest, Profile } from "./types";

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    return apiClient.get(API_ENDPOINTS.PROFILE.GET);
  },
  updateProfile: async (data: UpdateProfileRequest): Promise<{ profile: Profile }> => {
    return apiClient.patch(API_ENDPOINTS.PROFILE.UPDATE, data);
  },

  updateAvatar: async (avatar: string): Promise<{ profile: Profile }> => {
    return apiClient.post(API_ENDPOINTS.PROFILE.AVATAR, { avatar });
  },
  getUsers: async (page: number) => {
    return apiClient.get(`${API_ENDPOINTS.USERS.LIST}?page=${page}`);
  },
};

