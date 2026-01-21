// API client configuration
import { config } from '../config';
import { store } from '../store';
import { organizationalOrigin, selectToken, tenant } from '../features/auth/selectors';
import { logoutSuccess } from '../features/auth/slice';
import { showToastMessage } from '../utils/toast';
import { AUTH_ACTION_TYPES } from '../features/auth';
import { AUTH_ISSUER_URL } from '@env';

const API_BASE_URL = config.api.baseURL;

// Helper function to get auth token from store
const getAuthToken = (): string | null => {
  const state = store.getState();
  return selectToken(state);
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


// Helper function to handle API errors
const handleApiError = async (response: Response, endpoint?: string): Promise<never> => {
  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    // Clear auth state and logout user
    store.dispatch(logoutSuccess());
    throw new Error('Session expired. Please login again.');
  }

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
  const isEmptyState404 =
  response.status === 404 &&
  errorMessage === 'No results found';

if (!isEmptyState404) {
  showToastMessage(errorMessage, 'error');
}


  throw new Error(errorMessage);
};

// API Client with token injection
export const apiClient = {
  get: async (endpoint: string, customConfig?: RequestInit) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
        ...customConfig,
      });

      if (!response.ok) {
        await handleApiError(response, endpoint);
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.message && !error.message.includes('API Error')) {
        const networkError = `Network error: ${error.message}. Please check your internet connection.`;
        if (__DEV__) 
      // console.error('Network Error:', error);
        throw new Error(networkError);
      }
      throw error;
    }
  },

  post: async (endpoint: string, data?: any, customConfig?: RequestInit) => {
    try {
      if (__DEV__) {
        console.log('API Request:', {
          method: 'POST',
          url: `${API_BASE_URL}${endpoint}`,
          data,
        });
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
        body: JSON.stringify(data),
        ...customConfig,
      });

      if (__DEV__) {
        console.log('API Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }

      if (!response.ok) {
        await handleApiError(response, endpoint);
      }

      return response.json();
    } catch (error: any) {
      // Log error for debugging (only in dev, not shown to user)
      if (__DEV__) {
        console.log('API Client POST Error:', error);
      }

      // Only treat real fetch failures as network errors
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('Network error. Please check your internet connection.');
      }

      // For API errors like 403, 400, etc → just rethrow
      throw error;
    }
  },

  put: async (endpoint: string, data?: any, customConfig?: RequestInit) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
      body: JSON.stringify(data),
      ...customConfig,
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  },

  patch: async (endpoint: string, data?: any, customConfig?: RequestInit) => {
    const isFormData = data instanceof FormData;
    
    // Build headers - for FormData, don't set Content-Type (let fetch set it with boundary)
    let headers: Record<string, string>;
    if (isFormData) {
      const token = getAuthToken();
      const organizationId = getOrganizationId();
      const origin = organizationalOrigin(store.getState());
      
      headers = {
        'Origin': origin,
        ...(customConfig?.headers as Record<string, string> || {}),
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (organizationId) {
        headers['X-Organization-Id'] = organizationId;
      }
      
      if (__DEV__) {
        console.log('PATCH FormData Request:', {
          url: `${API_BASE_URL}${endpoint}`,
          headers,
          isFormData: true,
        });
      }
    } else {
      headers = buildHeaders(customConfig?.headers as Record<string, string> | undefined);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: isFormData ? data : JSON.stringify(data),
      ...customConfig,
    });

    if (__DEV__ && isFormData) {
      console.log('PATCH FormData Response:', {
        status: response.status,
        statusText: response.statusText,
      });
    }

    if (!response.ok) {
      await handleApiError(response, endpoint);
    }

    return response.json();
  },

  delete: async (endpoint: string, customConfig?: RequestInit) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(customConfig?.headers as Record<string, string> | undefined),
      ...customConfig,
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    // Some DELETE endpoints might not return JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return null;
  },
};
