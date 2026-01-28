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

export interface UsersState {
  list: {
    items: UsersListItem[];
    count: number;
    next: string | null;
    previous: string | null;
    page: number;
    loading: boolean;
    error: string | null;
  };
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

