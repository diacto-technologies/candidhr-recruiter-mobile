import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User, LoginResponse, RegisterResponse } from "./types";
import { stat } from "react-native-fs";

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  tenant: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  forgotPasswordLoading: false,
  forgotPasswordMessage: null,
  email: "",
  password: "",
  remember: false,
  resetPasswordLoading: false,
  resetPasswordMessage: null,
  resetPasswordError: null,
  origin:"",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginRequest: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tenant = action.payload.tenant || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Register actions
    registerRequest: (state, _action: PayloadAction<{ email: string; password: string; name: string }>) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<RegisterResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Logout actions
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tenant = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.origin = ""; 
    },

    // Token refresh
    refreshTokenRequest: (state) => {
      state.loading = true;
    },
    refreshTokenSuccess: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Legacy actions for backward compatibility
    setUser: (state, action: PayloadAction<User | object>) => {
      state.user = action.payload as User;
      if (action.payload && typeof action.payload === 'object' && 'id' in action.payload) {
        state.isAuthenticated = true;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    forgotPasswordRequest: (state) => {
      state.forgotPasswordLoading = true;
      state.forgotPasswordMessage = null;
      state.error = null;
    },

    forgotPasswordSuccess: (state, action: PayloadAction<string>) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordMessage = action.payload;
    },

    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.forgotPasswordLoading = false;
      state.error = action.payload;
    },

    saveCredentials: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.remember = true;
    },

    clearCredentials: (state) => {
      state.email = "";
      state.password = "";
      state.remember = false;
    },

    resetPasswordRequest: (state) => {
      state.resetPasswordLoading = true;
      state.resetPasswordError = null;
      state.resetPasswordMessage = null;
    },

    resetPasswordSuccess: (state, action: PayloadAction<string>) => {
      state.resetPasswordLoading = false;
      state.resetPasswordMessage = action.payload;
    },

    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.resetPasswordLoading = false;
      state.resetPasswordError = action.payload;
    },

    setOrigin: (state, action: PayloadAction<string>) => {
      state.origin = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  clearError,
  // Legacy exports
  setUser,
  setLoading,
  setError,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  saveCredentials,
  clearCredentials,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  setOrigin
} = authSlice.actions;

export default authSlice.reducer;

