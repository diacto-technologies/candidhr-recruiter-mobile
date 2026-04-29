// API client configuration
import { config } from '../config';
import { store } from '../store';
import { organizationalOrigin, selectRefreshToken, selectToken, tenant } from '../features/auth/selectors';
import { logoutSuccess, refreshTokenSuccess } from '../features/auth/slice';
import { showToastMessage } from '../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from './endpoints';

const API_BASE_URL = config.api.baseURL;

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

async function doRefresh(refresh: string): Promise<boolean> {
  const res = await fetch(
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
    return true;
  }

  let errorBody: any = null;
  try {
    errorBody = await res.json();
  } catch {
    errorBody = await res.text().catch(() => null);
  }

  if (__DEV__) {
    // console.log('Refresh token API failed', {
    //   status: res.status,
    //   statusText: res.statusText,
    //   errorBody,
    // });
    showToastMessage(
      'Your session expired. Please login again',
      'error'
    );
  }

  // 429 Too Many Requests: retry once after delay (avoids logout when app opens and many requests hit refresh)
  if (res.status === 429) {
    const delayMs = 2000;
    if (__DEV__) {
      console.log(`⏳ 429 rate limit, retrying refresh after ${delayMs}ms`);
    }
    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    const retryRes = await fetch(
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
    if (retryRes.ok) {
      const data = await retryRes.json();
      if (__DEV__) console.log('✅ Refresh success after 429 retry');
      store.dispatch(refreshTokenSuccess({
        token: data.access,
        refreshToken: data.refresh ?? refresh,
      }));
      await AsyncStorage.setItem('accessToken', data.access);
      await AsyncStorage.setItem('refreshToken', data.refresh ?? refresh);
      return true;
    }
  }

  return false;
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
      return await doRefresh(refresh);
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

/** Rows may live at `details.reference_solutions` or `details.details.reference_solutions`. */
export function extractReferenceSolutionRowsFromApiErrorDetails(
  details: any
): any[] | null {
  if (!details || typeof details !== 'object') {
    return null;
  }
  const rows =
    details?.details?.reference_solutions ?? details?.reference_solutions;
  return Array.isArray(rows) && rows.length > 0 ? rows : null;
}

/** Thrown by `handleApiError` so callers can read structured API bodies (e.g. reference solution rows). */
export class ApiError extends Error {
  readonly apiDetails: unknown;

  constructor(message: string, apiDetails?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.apiDetails = apiDetails;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Prefer `message` / string `error`; never use boolean `error: true` as the user-facing text. */
function enrichWithReferenceSolutionDetails(base: string, details: any): string {
  const rows = extractReferenceSolutionRowsFromApiErrorDetails(details);
  if (!rows) {
    return base;
  }
  const first = rows[0];
  const hint =
    (typeof first?.message === 'string' && first.message.trim()) ||
    (typeof first?.error === 'string' && first.error.trim()) ||
    '';
  const n = rows.length;
  if (n <= 1) {
    return hint ? `${base} ${hint}` : base;
  }
  return hint
    ? `${base} Reference solution: ${hint} (${n} test cases).`
    : `${base} Reference solution failed on ${n} test cases.`;
}

function messageFromApiErrorBody(errorData: Record<string, any>, baseDefault: string): string {
  if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
    const joined = errorData.non_field_errors.filter(Boolean).join(', ');
    if (joined) {
      return enrichWithReferenceSolutionDetails(joined, errorData.details);
    }
  }
  if (typeof errorData.message === 'string' && errorData.message.trim()) {
    return enrichWithReferenceSolutionDetails(
      errorData.message.trim(),
      errorData.details,
    );
  }
  if (typeof errorData.error === 'string' && errorData.error.trim()) {
    return enrichWithReferenceSolutionDetails(
      errorData.error.trim(),
      errorData.details,
    );
  }
  if (typeof errorData.detail === 'string' && errorData.detail.trim()) {
    return enrichWithReferenceSolutionDetails(
      errorData.detail.trim(),
      errorData.details,
    );
  }
  if (errorData.errors?.message && typeof errorData.errors.message === 'string') {
    return enrichWithReferenceSolutionDetails(
      errorData.errors.message.trim(),
      errorData.details,
    );
  }
  if (Array.isArray(errorData.errors)) {
    const joined = errorData.errors.join(', ');
    if (joined) {
      return enrichWithReferenceSolutionDetails(joined, errorData.details);
    }
  }
  if (
    typeof errorData.error_description === 'string' &&
    errorData.error_description.trim()
  ) {
    return enrichWithReferenceSolutionDetails(
      errorData.error_description.trim(),
      errorData.details,
    );
  }
  if (errorData.error === true) {
    const base =
      typeof errorData.message === 'string' && errorData.message.trim()
        ? errorData.message.trim()
        : 'Validation failed.';
    return enrichWithReferenceSolutionDetails(base, errorData.details);
  }
  return baseDefault;
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

    // Prefer structured parsing; never use boolean `error: true` as the user-facing message.
    errorMessage = messageFromApiErrorBody(
      errorData,
      `API Error (${response.status}): ${response.statusText}`
    );
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
  const normalizedErrorMessage = String(errorMessage ?? '').toLowerCase();
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

  const refRows = extractReferenceSolutionRowsFromApiErrorDetails(
    (errorDetails as any)?.details
  );
  const hasReferenceSolutionValidation =
    Array.isArray(refRows) && refRows.length > 0;

  if (!isEmptyState404 && !isAssessmentsV2Endpoint) {
    // Saga/UI shows an Alert with per-case rows; avoid a duplicate short toast.
    if (!hasReferenceSolutionValidation) {
      showToastMessage(errorMessage, 'error');
    }
  }

  throw new ApiError(
    typeof errorMessage === 'string'
      ? errorMessage
      : String(errorMessage ?? 'Request failed'),
    errorDetails
  );
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

    // 🔁 Try refresh ONCE on 401
    if (response.status === 401 && !didRetry) {
      didRetry = true;
      if (__DEV__) {
        console.log('Attempting token refresh');
      }

      const refreshed = await refreshFromStorage();

      if (refreshed) {
        continue; // retry original request
      }

      // ❌ Refresh failed → force logout and throw error
      // Note: logoutSuccess() will trigger saga to clear AsyncStorage
      store.dispatch(logoutSuccess());
      throw new Error('Session expired. Please login again.');
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

