/**
 * Supported Languages Configuration
 * Single source of truth for all language-related definitions
 */

export interface Language {
  code: string;
  label: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'mn', label: 'Монгол' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((lang) => lang.code);

export const isValidLanguageCode = (code: string): boolean => {
  return LANGUAGE_CODES.includes(code);
};

export const getLanguageLabel = (code: string): string => {
  const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
  return language?.label || 'English';
};
