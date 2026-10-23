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

import brandingReducer, {
  getBrandingSuccess,
  updateBrandingSuccess,
  setBrandingReset,
} from '../slice';
import { BrandingData, BrandingState } from '../types';

describe('brandingSlice product name resolution', () => {
  const initialBaseState: BrandingState = {
    data: null,
    loading: false,
    updating: false,
    error: null,
    updateSuccess: false,
    isReset: false,
    hasCustomProductName: false,
  };

  const mockServerResponse: BrandingData = {
    product_name: 'CandidHR', // Backend always returns default "CandidHR"
    logo: null,
    secondary_logo: null,
    favicon: null,
    primary_color: '#4F46E5',
    powered_by_enabled: true,
  };

  it('keeps product name empty when user saves with empty product name', () => {
    const nextState = brandingReducer(
      initialBaseState,
      updateBrandingSuccess({
        data: mockServerResponse,
        submittedProductName: '',
      })
    );

    expect(nextState.hasCustomProductName).toBe(false);
    expect(nextState.data?.product_name).toBe('');
  });

  it('preserves product name CandidHR when user intentionally types CandidHR', () => {
    const nextState = brandingReducer(
      initialBaseState,
      updateBrandingSuccess({
        data: mockServerResponse,
        submittedProductName: 'CandidHr',
      })
    );

    expect(nextState.hasCustomProductName).toBe(true);
    expect(nextState.data?.product_name).toBe('CandidHr');
  });

  it('preserves product name when user types candidHR with different casing', () => {
    const nextState = brandingReducer(
      initialBaseState,
      updateBrandingSuccess({
        data: mockServerResponse,
        submittedProductName: 'candidHR',
      })
    );

    expect(nextState.hasCustomProductName).toBe(true);
    expect(nextState.data?.product_name).toBe('candidHR');
  });

  it('on initial fetch (getBrandingSuccess), defaults CandidHR to empty if user never set custom name', () => {
    const stateAfterFetch = brandingReducer(
      initialBaseState,
      getBrandingSuccess(mockServerResponse)
    );

    expect(stateAfterFetch.hasCustomProductName).toBe(false);
    expect(stateAfterFetch.data?.product_name).toBe('');
  });

  it('on initial fetch (getBrandingSuccess), retains custom CandidHR if user previously saved it', () => {
    const stateWithCustom: BrandingState = {
      ...initialBaseState,
      hasCustomProductName: true,
      data: {
        ...mockServerResponse,
        product_name: 'CandidHR',
      },
    };

    const stateAfterFetch = brandingReducer(
      stateWithCustom,
      getBrandingSuccess(mockServerResponse)
    );

    expect(stateAfterFetch.hasCustomProductName).toBe(true);
    expect(stateAfterFetch.data?.product_name).toBe('CandidHR');
  });

  it('on reset to default, clears product name and marks custom name as false', () => {
    const stateWithCustom: BrandingState = {
      ...initialBaseState,
      hasCustomProductName: true,
      data: {
        ...mockServerResponse,
        product_name: 'CandidHR',
      },
    };

    const stateAfterReset = brandingReducer(stateWithCustom, setBrandingReset(true));

    expect(stateAfterReset.hasCustomProductName).toBe(false);
    expect(stateAfterReset.data?.product_name).toBe('');
  });
});

