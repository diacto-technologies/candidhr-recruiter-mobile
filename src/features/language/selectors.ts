import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Base selector
const selectLanguageState = (state: RootState) => state.language;

// Memoized selectors
export const selectCurrentLanguage = createSelector(
  [selectLanguageState],
  (language) => language.currentLanguage
);

// Alias for consistency with user's naming preference
export const selectResolvedLanguage = createSelector(
  [selectLanguageState],
  (language) => language.currentLanguage
);
