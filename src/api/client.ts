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
    } else if (errorData.error) {
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
  const isEmptyState404 =
    response.status === 404 &&
    errorMessage === 'No results found';

  if (!isEmptyState404) {
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

