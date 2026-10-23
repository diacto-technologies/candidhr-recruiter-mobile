import {
  validateHexColor,
  normalizeHexColor,
  validateProductName,
} from '../validation';
import { isDefaultOrCandidHr, isDefaultLogoUrl } from '../constants';

describe('Branding Validation', () => {
  it('validates hex colors correctly', () => {
    expect(validateHexColor('#2563EB')).toBe(true);
    expect(validateHexColor('2563EB')).toBe(true);
    expect(validateHexColor('#FFF')).toBe(true);
    expect(validateHexColor('FFF')).toBe(true);
    expect(validateHexColor('#18181B')).toBe(true);
    expect(validateHexColor('#7C3AED')).toBe(true);
    expect(validateHexColor('#059669')).toBe(true);
    expect(validateHexColor('invalid')).toBe(false);
    expect(validateHexColor('#12345')).toBe(false);
    expect(validateHexColor('')).toBe(false);
  });

  it('normalizes hex colors with hash and uppercase', () => {
    expect(normalizeHexColor('2563eb')).toBe('#2563EB');
    expect(normalizeHexColor('#7c3aed')).toBe('#7C3AED');
    expect(normalizeHexColor('#fff')).toBe('#FFF');
  });

  it('validates product name', () => {
    expect(validateProductName('Acme Corp').isValid).toBe(true);
    expect(validateProductName('Diacto').isValid).toBe(true);
    expect(validateProductName('').isValid).toBe(false);
    expect(validateProductName('   ').isValid).toBe(false);
    expect(
      validateProductName('A very long product name that exceeds thirty characters in length').isValid
    ).toBe(false);
  });

  it('identifies default or CandidHR names correctly', () => {
    expect(isDefaultOrCandidHr(null)).toBe(true);
    expect(isDefaultOrCandidHr(undefined)).toBe(true);
    expect(isDefaultOrCandidHr('')).toBe(true);
    expect(isDefaultOrCandidHr('   ')).toBe(true);
    expect(isDefaultOrCandidHr('CandidHR')).toBe(true);
    expect(isDefaultOrCandidHr('candidhr')).toBe(true);
    expect(isDefaultOrCandidHr(' Candid HR ')).toBe(true);
    expect(isDefaultOrCandidHr('CandidHR HR')).toBe(false);
    expect(isDefaultOrCandidHr('Diacto')).toBe(false);
    expect(isDefaultOrCandidHr('Acme Careers')).toBe(false);
  });

  it('identifies default logo URLs correctly', () => {
    expect(isDefaultLogoUrl(null)).toBe(true);
    expect(isDefaultLogoUrl(undefined)).toBe(true);
    expect(isDefaultLogoUrl('')).toBe(true);
    expect(isDefaultLogoUrl('https://api.candidhr.com/media/candidhr_logo.svg')).toBe(true);
    expect(isDefaultLogoUrl('https://api.candidhr.com/media/default.png')).toBe(true);
    expect(isDefaultLogoUrl('https://api.candidhr.com/media/tenant_custom_logo.png')).toBe(false);
  });
});

