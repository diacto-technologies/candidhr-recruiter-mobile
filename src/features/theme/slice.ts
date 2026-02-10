import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState, ThemeMode } from './types';

const initialState: ThemeState = {
  themeMode: 'device', // Default to device settings
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    resetThemeMode: (state) => {
      state.themeMode = 'device';
    },
  },
});

export const { setThemeMode, resetThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
