/**
 * Form and input validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export const validateOrganizationName = (orgName: string): ValidationResult => {
  const trimmed = orgName?.trim() || '';

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter your organization name',
    };
  }

  // Subdomain characters: alphanumeric and hyphens only
  const validSubdomainRegex = /^[a-zA-Z0-9-]+$/;
  if (!validSubdomainRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Organization name can only contain letters, numbers, and hyphens',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};
