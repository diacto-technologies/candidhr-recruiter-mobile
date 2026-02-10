import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageState } from './types';
import { DEFAULT_LANGUAGE, isValidLanguageCode } from '../../config/languages';

const initialState: LanguageState = {
  currentLanguage: DEFAULT_LANGUAGE,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      // Validate language code before setting
      if (isValidLanguageCode(action.payload)) {
        state.currentLanguage = action.payload;
      } else {
        // Fallback to default if invalid
        state.currentLanguage = DEFAULT_LANGUAGE;
      }
    },
    resetLanguage: (state) => {
      state.currentLanguage = DEFAULT_LANGUAGE;
    },
  },
});

export const { setLanguage, resetLanguage } = languageSlice.actions;
export default languageSlice.reducer;
