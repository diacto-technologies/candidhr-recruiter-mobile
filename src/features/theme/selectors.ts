import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { ThemeMode } from './types';

// Base selector
const selectThemeState = (state: RootState) => state.theme;

// Memoized selectors
export const selectThemeMode = createSelector(
  [selectThemeState],
  (theme) => theme.themeMode
);

export const selectResolvedThemeMode = createSelector(
  [selectThemeState],
  (theme) => theme.themeMode
);
