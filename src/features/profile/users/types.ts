export interface UsersListItem {
  id: string;
  name: string;
  email: string;
  profile_pic: string | null;
  position: string | null;
  role: { id: number; name: string };
  is_active: boolean;
  is_superadmin: boolean;
  is_admin: boolean;
  created_at: string;
  last_login: string | null;
  invited_by?: { id: string; name: string; email: string } | null;
  [key: string]: unknown;
}

/** GET /core/v2/invites/ row */
export interface InviteListItem {
  id: string;
  email: string;
  name: string;
  role: { id: number; name: string };
  status: string;
  expires_at: string | null;
  accepted_at: string | null;
  created_at: string;
  invited_by: { id: string; name: string; email: string } | null;
  [key: string]: unknown;
}

export interface RoleListItem {
  id: number;
  name: string;
  permission_count?: number;
  is_default?: boolean;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role_id: number;
}

export interface UsersListSlice {
  items: UsersListItem[];
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  loading: boolean;
  error: string | null;
}

export interface InvitesListSlice {
  items: InviteListItem[];
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  list: UsersListSlice;
  invites: InvitesListSlice;
  /** GET /core/users/list/?page= — job invite / team picker without clashing with `list` (options). */
  directoryList: UsersListSlice;
  roles: {
    items: RoleListItem[];
    count: number;
    next: string | null;
    previous: string | null;
    page: number;
    loading: boolean;
    error: string | null;
  };
  update: {
    loading: boolean;
    error: string | null;
  };
  create: {
    loading: boolean;
    error: string | null;
  };
  remove: {
    loading: boolean;
    error: string | null;
  };
}

