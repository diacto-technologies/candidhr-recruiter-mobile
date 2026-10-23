import { MAX_PRODUCT_NAME_LENGTH } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

/**
 * Validates whether a string is a valid 3-char or 6-char hex color code (with or without #).
 */
export const validateHexColor = (hex: string): boolean => {
  if (!hex) return false;
  const cleanHex = hex.trim();
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(cleanHex);
};

/**
 * Normalizes a hex color string to uppercase with leading #.
 */
export const normalizeHexColor = (hex: string): string => {
  const clean = hex.trim();
  if (clean.startsWith('#')) {
    return clean.toUpperCase();
  }
  return `#${clean}`.toUpperCase();
};

/**
 * Validates product name length and non-emptiness.
 */
export const validateProductName = (name: string): ValidationResult => {
  const trimmed = name?.trim() || '';
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Product name cannot be empty',
    };
  }
  if (trimmed.length > MAX_PRODUCT_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Product name cannot exceed ${MAX_PRODUCT_NAME_LENGTH} characters`,
    };
  }
  return {
    isValid: true,
    error: '',
  };
};

/**
 * Validates uploaded file size in bytes against a maximum threshold.
 */
export const validateFileSize = (bytes: number, maxBytes: number): boolean => {
  return bytes <= maxBytes;
};
