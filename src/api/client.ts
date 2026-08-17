// API client configuration
import { config } from '../config';
import { store } from '../store';
import {
  organizationalOrigin,
  selectIsAuthenticated,
  selectRefreshToken,
  selectToken,
  tenant,
} from '../features/auth/selectors';
import { logoutSuccess, refreshTokenSuccess } from '../features/auth/slice';
import { showToastMessage } from '../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from './endpoints';

const API_BASE_URL = config.api.baseURL;

/** Result of a refresh token attempt — drives retry vs logout decisions. */
enum RefreshResult {
  /** New tokens obtained successfully. */
  SUCCESS = 'SUCCESS',
  /** Refresh token is genuinely expired/revoked (401/403) — user must re-login. */
  TOKEN_INVALID = 'TOKEN_INVALID',
  /** Transient failure (429, 5xx, network) — safe to retry. */
  TRANSIENT_ERROR = 'TRANSIENT_ERROR',
}

const MAX_REFRESH_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1_000;

// Single in-flight refresh promise so multiple 401s don't each trigger a refresh (avoids 429)
let inFlightRefresh: Promise<boolean> | null = null;

// Helper function to get auth token from store
const getAuthToken = (): string | null => {
  const state = store.getState();
  return selectToken(state);
};

const getAuthRefreshToken = (): string | null => {
  const state = store.getState();
  return selectRefreshToken(state);
};

const AUTH_ENDPOINTS_NO_REFRESH = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REFRESH,
  API_ENDPOINTS.AUTH.REGISTER,
  API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
];

function isPublicAuthEndpoint(endpoint?: string): boolean {
  if (!endpoint) return false;
  return AUTH_ENDPOINTS_NO_REFRESH.some(
    (path) => endpoint === path || endpoint.includes(path)
  );
}

async function hasStoredRefreshToken(): Promise<boolean> {
  if (getAuthRefreshToken()) return true;
  const stored = await AsyncStorage.getItem('refreshToken');
  return Boolean(stored);
}

// Helper function to get organization ID from store
const getOrganizationId = (): string | null => {
  const state = store.getState();
  return tenant(state);
};

// Helper function to build headers with auth token and organization
const buildHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
  const token = getAuthToken();
  const organizationId = getOrganizationId();
  const origin = organizationalOrigin(store.getState());

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Origin': organizationalOrigin(store.getState()),
    ...(customHeaders || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (organizationId) {
    headers['X-Organization-Id'] = organizationId;
  }

  return headers;
};

/** Determines whether an HTTP status from the refresh endpoint means the token is genuinely invalid. */
function isTokenInvalidStatus(status: number): boolean {
  // 401 Unauthorized / 403 Forbidden → token revoked or expired
  // 400 Bad Request → malformed / already-used token
  return status === 401 || status === 403 || status === 400;
}

/** Single attempt to refresh tokens. Returns a granular result for retry/logout decisions. */
async function doRefresh(refresh: string): Promise<RefreshResult> {
  let res: Response;
  try {
    res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': organizationalOrigin(store.getState()),
        },
        body: JSON.stringify({ refresh }),
      }
    );
  } catch (networkError) {
    // Network failure (offline, DNS, timeout) — transient
    if (__DEV__) {
      console.log('🌐 Refresh network error:', networkError);
    }
    return RefreshResult.TRANSIENT_ERROR;
  }

  if (res.ok) {
    const data = await res.json();
    if (__DEV__) {
      console.log('✅ Refresh success');
    }
    store.dispatch(refreshTokenSuccess({
      token: data.access,
      refreshToken: data.refresh ?? refresh,
    }));
    await AsyncStorage.setItem('accessToken', data.access);
    await AsyncStorage.setItem('refreshToken', data.refresh ?? refresh);
    if (__DEV__) {
      console.log('✅ Tokens updated in Redux & AsyncStorage');
    }
    return RefreshResult.SUCCESS;
  }

  if (__DEV__) {
    let errorBody: string | null = null;
    try {
      errorBody = await res.clone().text();
    } catch { /* ignore */ }
    console.log('❌ Refresh failed', { status: res.status, errorBody });
  }

  // Token genuinely invalid — no point retrying
  if (isTokenInvalidStatus(res.status)) {
    return RefreshResult.TOKEN_INVALID;
  }

  // 429 / 5xx / anything else — transient, safe to retry
  return RefreshResult.TRANSIENT_ERROR;
}

/** Proactive + reactive token refresh entry point (used by useTokenRefresh and 401 handler). */
export async function refreshAuthTokens(): Promise<boolean> {
  return refreshFromStorage();
}

async function refreshFromStorage(): Promise<boolean> {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  const run = async (): Promise<boolean> => {
    try {
      if (__DEV__) {
        console.log('🔄 refreshFromStorage called');
      }
      let refresh = getAuthRefreshToken();
      if (__DEV__) {
        console.log('Redux refresh token:', refresh ? 'found' : 'not found');
      }
      if (!refresh) {
        refresh = await AsyncStorage.getItem('refreshToken');
        if (__DEV__) {
          console.log('AsyncStorage refresh token:', refresh ? 'found' : 'not found');
        }
      }
      if (!refresh) {
        if (__DEV__) {
          console.log('No refresh token found in Redux or AsyncStorage');
        }
        return false;
      }

      // Retry with exponential backoff for transient failures
      for (let attempt = 0; attempt < MAX_REFRESH_RETRIES; attempt++) {
        const result = await doRefresh(refresh);

        if (result === RefreshResult.SUCCESS) {
          return true;
        }

        if (result === RefreshResult.TOKEN_INVALID) {
          if (__DEV__) {
            console.log('🔒 Refresh token is genuinely invalid — must re-login');
          }
          showToastMessage('Your session expired. Please login again', 'error');
          return false;
        }

        // TRANSIENT_ERROR — retry with exponential backoff
        if (attempt < MAX_REFRESH_RETRIES - 1) {
          const delayMs = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
          if (__DEV__) {
            console.log(`⏳ Transient refresh failure, retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_REFRESH_RETRIES})`);
          }
          await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
        }
      }

      if (__DEV__) {
        console.log('❌ All refresh retries exhausted (transient errors)');
      }
      // All retries failed but token may still be valid — don't force logout
      return false;
    } catch (error) {
      if (__DEV__) {
        console.log('Refresh token exception:', error);
      }
      return false;
    } finally {
      inFlightRefresh = null;
    }
  };

  inFlightRefresh = run();
  return inFlightRefresh;
}

// Helper function to handle API errors
// Note: 401 is handled by executeWithRefresh, not here (to avoid double logout)
const handleApiError = async (response: Response, endpoint?: string): Promise<never> => {
  // Handle 503 Service Unavailable
  if (response.status === 503) {
    throw new Error('Service temporarily unavailable. The server is down or overloaded. Please try again in a few moments.');
  }

  // Handle 502 Bad Gateway
  if (response.status === 502) {
    throw new Error('Bad gateway. The server received an invalid response. Please try again later.');
  }

  // Handle 504 Gateway Timeout
  if (response.status === 504) {
    throw new Error('Gateway timeout. The server took too long to respond. Please try again.');
  }

  // Handle 500 Internal Server Error
  if (response.status === 500) {
    throw new Error('Internal server error. Please try again later or contact support.');
  }

  // Try to parse error message from response
  let errorMessage = `API Error (${response.status}): ${response.statusText}`;
  let errorDetails: any = null;

  try {
    const errorData = await response.json();
    errorDetails = errorData;

    // Try multiple common error message fields
    // Handle non_field_errors (common in Django REST Framework)
    if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
      errorMessage = errorData.non_field_errors.join(', ');
    } else if (errorData.error && typeof errorData.error === 'string') {
      // Prioritize 'error' field (common in API responses)
      errorMessage = errorData.error;
    } else {
      errorMessage = errorData.message ||
        errorData.detail ||
        errorData.errors?.message ||
        (Array.isArray(errorData.errors) ? errorData.errors.join(', ') : null) ||
        errorData.error_description ||
        errorMessage;
    }
  } catch (parseError) {
    // If response is not JSON, try to get text
    try {
      const text = await response.text();
      if (text) {
        errorMessage = text;
      }
    } catch {
      // Use default error message
    }
  }

  // Log error details for debugging (only in dev, not shown to user)
  if (__DEV__) {
    console.log('API Error Details:', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      error: errorMessage,
      details: errorDetails,
      url: `${API_BASE_URL}${endpoint}`,
    });
  }

  // Show toast message to user
  // TODO: Consider moving toast to saga/UI layer for better separation of concerns
  // API layer should be UI-agnostic, but keeping for now to maintain existing behavior
  const normalizedErrorMessage = String(errorMessage ?? "").toLowerCase();
  const isEmptyState404 =
    response.status === 404 &&
    (normalizedErrorMessage.includes("no results found") ||
      normalizedErrorMessage.includes("no data") ||
      normalizedErrorMessage.includes("no result") ||
      normalizedErrorMessage.includes("not found"));

  // For assessment/v2 endpoints, a 404 often means "result not generated yet".
  // Silence toast to avoid confusing the user during tab/applicant switches.
  const isAssessmentsV2Endpoint =
    response.status === 404 &&
    typeof endpoint === "string" &&
    (endpoint.includes("/assessments/v2/") || endpoint.includes("assessments/v2/"));

  // Check if endpoint is logout
  const isLogoutEndpoint =
    typeof endpoint === "string" &&
    (endpoint.includes("/auth/logout") || endpoint.includes("auth/logout"));

  // Check if it is a 401 auth error after the user has been logged out (to avoid stale in-flight requests showing toasts)
  const isAuthenticated = selectIsAuthenticated(store.getState());
  const isPublicAuth = isPublicAuthEndpoint(endpoint);
  const isAuthErrorDuringLogout = response.status === 401 && !isAuthenticated && !isPublicAuth;

  if (!isEmptyState404 && !isAssessmentsV2Endpoint && !isLogoutEndpoint && !isAuthErrorDuringLogout) {
    showToastMessage(errorMessage, 'error');
  }

  throw new Error(errorMessage);
};

async function executeWithRefresh(
  request: () => Promise<Response>,
  endpoint?: string
): Promise<Response> {
  let didRetry = false;

  while (true) {
    const response = await request();

    // ✅ Success
    if (response.ok) {
      return response;
    }

    // 🔁 Try refresh ONCE on 401 — only for an active session with a refresh token
    if (response.status === 401 && !didRetry) {
      didRetry = true;

      const isAuthenticated = selectIsAuthenticated(store.getState());

      if (!isAuthenticated || isPublicAuthEndpoint(endpoint)) {
        await handleApiError(response, endpoint);
      }

      const hadRefreshToken = await hasStoredRefreshToken();
      if (!hadRefreshToken) {
        if (__DEV__) {
          console.log('401 with no refresh token — skip refresh/logout');
        }
        await handleApiError(response, endpoint);
      }

      if (__DEV__) {
        console.log('Attempting token refresh');
      }

      const refreshed = await refreshFromStorage();

      if (refreshed) {
        continue; // retry original request
      }

      // Check whether the refresh token is genuinely gone/invalid
      // vs a transient failure where the token may still be valid.
      const stillHasToken = await hasStoredRefreshToken();
      if (!stillHasToken && selectIsAuthenticated(store.getState())) {
        // Refresh token truly expired/revoked — clear auth
        store.dispatch(logoutSuccess());
        throw new Error('Session expired. Please login again.');
      }

      // Transient failure — don't logout, just surface the error for this request
      throw new Error('Unable to refresh session. Please check your connection and try again.');
    }

    // ❌ Any other error OR retry already used (non-401 errors)
    await handleApiError(response, endpoint);
  }
}

// API Client with token injection
export const apiClient = {
  /**
   * Returns the raw `Response` object (useful for file downloads / non-JSON).
   * Callers are responsible for parsing (e.g. `response.text()`).
   */
  getResponse: async (endpoint: string, customConfig?: RequestInit) => {
    return await executeWithRefresh(
      () =>
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
          ...customConfig,
        }),
      endpoint
    );
  },

  get: async (endpoint: string, customConfig?: RequestInit) => {
    const response = await apiClient.getResponse(endpoint, customConfig);
    return response.json();
  },

  post: async (endpoint: string, data?: any, customConfig?: RequestInit) => {
    if (__DEV__) {
      console.log('API Request:', {
        method: 'POST',
        url: `${API_BASE_URL}${endpoint}`,
        data,
      });
    }

    const response = await executeWithRefresh(
      () =>
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
          body: JSON.stringify(data),
          ...customConfig,
        }),
      endpoint
    );

    if (__DEV__) {
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
    }

    return response.json();
  },

  /**
   * Returns raw `Response` for POST requests (useful for file exports).
   */
  postResponse: async (endpoint: string, data?: any, customConfig?: RequestInit) => {
    return await executeWithRefresh(
      () =>
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
          body: JSON.stringify(data),
          ...customConfig,
        }),
      endpoint
    );
  },

  put: async (endpoint: string, data?: any, customConfig?: RequestInit) => {
    const response = await executeWithRefresh(
      () =>
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
          body: JSON.stringify(data),
          ...customConfig,
        }),
      endpoint
    );

    return response.json();
  },

  patch: async (endpoint: string, data?: any, customConfig?: RequestInit) => {
    const isFormData = data instanceof FormData;

    const response = await executeWithRefresh(
      () => {
        let headers: Record<string, string>;

        if (isFormData) {
          const token = getAuthToken();
          const organizationId = getOrganizationId();
          const origin = organizationalOrigin(store.getState());

          headers = {
            Origin: origin,
            ...(customConfig?.headers as Record<string, string> || {}),
          };

          if (token) headers.Authorization = `Bearer ${token}`;
          if (organizationId) headers['X-Organization-Id'] = organizationId;
        } else {
          headers = buildHeaders(customConfig?.headers as Record<string, string> | undefined);
        }

        return fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'PATCH',
          headers,
          body: isFormData ? data : JSON.stringify(data),
          ...customConfig,
        });
      },
      endpoint
    );

    return response.json();
  },

  delete: async (endpoint: string, customConfig?: RequestInit) => {
    const response = await executeWithRefresh(
      () =>
        fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'DELETE',
          headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
          ...customConfig,
        }),
      endpoint
    );

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return null;
  },
};

