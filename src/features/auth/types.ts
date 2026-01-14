export interface User {
  id: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tenant: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  forgotPasswordLoading: boolean;
  forgotPasswordMessage: string | null;
  email: string,
  password: string,
  remember: boolean,
  resetPasswordLoading: boolean,
  resetPasswordMessage: string | null,
  resetPasswordError: string | null,
  origin:string,
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  tenant?: string; // Organization ID from login response
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

