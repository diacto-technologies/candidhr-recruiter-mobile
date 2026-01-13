// Global reference to toast function
let globalToastShow: ((message: string, variant?: 'success' | 'info' | 'error' | 'warning') => void) | null = null;

/**
 * Set the global toast function reference
 * This should be called from ToastMessageProvider
 */
export function setGlobalToast(
  showToast: (message: string, variant?: 'success' | 'info' | 'error' | 'warning') => void
) {
  globalToastShow = showToast;
}

/**
 * Show a toast message
 * Can be called from anywhere in the app (API client, sagas, etc.)
 */
export function showToastMessage(
  message: string,
  variant: 'success' | 'info' | 'error' | 'warning' = 'error'
) {
  if (globalToastShow) {
    globalToastShow(message, variant);
  } else if (__DEV__) {
    // Fallback to console if toast is not initialized yet
    console.warn('Toast not initialized:', message);
  }
}
