import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import { UpdateProfileRequest, Profile } from "./types";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

/** Normalizes GET/PATCH `core/user/` (flat or `{ profile }`) into `Profile`. */
export function normalizeProfileFromApi(raw: unknown): Profile {
  const root = asRecord(raw);
  const inner =
    root.data && typeof root.data === "object"
      ? asRecord(root.data)
      : root.profile && typeof root.profile === "object"
        ? asRecord(root.profile)
        : root;

  const contactRaw = inner.contact;
  let contact: number | null = null;
  if (contactRaw !== null && contactRaw !== undefined && contactRaw !== "") {
    const n =
      typeof contactRaw === "number"
        ? contactRaw
        : parseInt(String(contactRaw).replace(/\s/g, ""), 10);
    contact = Number.isFinite(n) ? n : null;
  }

  const roleRaw = inner.role;
  const role =
    roleRaw && typeof roleRaw === "object"
      ? (roleRaw as Profile["role"])
      : { id: 0, name: "", permissions: [] };

  return {
    id: String(inner.id ?? ""),
    name: String(inner.name ?? ""),
    email: String(inner.email ?? ""),
    contact,
    state: inner.state == null ? "" : String(inner.state),
    country: inner.country == null ? "" : String(inner.country),
    position:
      inner.position === null || inner.position === undefined
        ? null
        : String(inner.position),
    profile_pic: String(inner.profile_pic ?? ""),
    is_active: Boolean(inner.is_active),
    is_superadmin: Boolean(inner.is_superadmin),
    is_admin: Boolean(inner.is_admin),
    agree_to_terms_and_conditions: Boolean(inner.agree_to_terms_and_conditions),
    created_at: String(inner.created_at ?? ""),
    updated_at: String(inner.updated_at ?? ""),
    last_login: String(inner.last_login ?? ""),
    user: String(inner.user ?? ""),
    tenant: (inner.tenant ?? ({} as Profile["tenant"])) as Profile["tenant"],
    role,
  };
}

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const res = await apiClient.get(API_ENDPOINTS.PROFILE.GET);
    return normalizeProfileFromApi(res);
  },
  updateProfile: async (data: UpdateProfileRequest): Promise<{ profile: Profile }> => {
    const res = await apiClient.patch(API_ENDPOINTS.PROFILE.UPDATE, data);
    return { profile: normalizeProfileFromApi(res) };
  },

  updateAvatar: async (avatar: string): Promise<{ profile: Profile }> => {
    return apiClient.post(API_ENDPOINTS.PROFILE.AVATAR, { avatar });
  },
  getUsers: async (page: number) => {
    return apiClient.get(`${API_ENDPOINTS.USERS.LIST}?page=${page}`);
  },
};

