export const BRANDING_ACTION_TYPES = {
  GET_BRANDING_REQUEST: 'branding/GET_BRANDING_REQUEST',
  GET_BRANDING_SUCCESS: 'branding/GET_BRANDING_SUCCESS',
  GET_BRANDING_FAILURE: 'branding/GET_BRANDING_FAILURE',
  UPDATE_BRANDING_REQUEST: 'branding/UPDATE_BRANDING_REQUEST',
  UPDATE_BRANDING_SUCCESS: 'branding/UPDATE_BRANDING_SUCCESS',
  UPDATE_BRANDING_FAILURE: 'branding/UPDATE_BRANDING_FAILURE',
  CLEAR_BRANDING_STATE: 'branding/CLEAR_BRANDING_STATE',
} as const;

export const BRAND_COLOR_PRESETS: readonly string[] = [
  '#18181B',
  '#7C3AED',
  '#4F46E5',
  '#2563EB',
  '#0284C7',
  '#0F766E',
  '#059669',
] as const;

export const DEFAULT_BRAND_COLOR = '#4F46E5';
export const DEFAULT_PRODUCT_NAME = '';
export const MAX_PRODUCT_NAME_LENGTH = 30;

export const LOGO_MAX_BYTES = {
  logo: 2 * 1024 * 1024, // 2 MB
  secondary_logo: 1 * 1024 * 1024, // 1 MB
  favicon: 512 * 1024, // 512 KB
} as const;

export const LOGO_SIZE_ERROR_MESSAGES = {
  logo: 'File is too large. Max 2 MB.',
  secondary_logo: 'File is too large. Max 1 MB.',
  favicon: 'File is too large. Max 512 KB.',
} as const;

export const isDefaultOrCandidHr = (name: string | null | undefined): boolean => {
  if (!name) return true;
  const clean = name.trim().toLowerCase().replace(/\s+/g, '');
  return clean === '' || clean === 'candidhr';
};

export const isDefaultLogoUrl = (url: string | null | undefined): boolean => {
  if (!url) return true;
  const lower = url.toLowerCase();
  const pathPart = lower.replace(/^https?:\/\/[^\/]+/, '');
  return pathPart.includes('candidhr') || pathPart.includes('default');
};
