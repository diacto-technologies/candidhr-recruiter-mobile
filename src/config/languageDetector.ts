import { LanguageDetectorModule } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { DEFAULT_LANGUAGE, isValidLanguageCode } from './languages';
import { NativeModules, Platform } from 'react-native';
import { setLanguage } from '../features/language/slice';

const LANGUAGE_STORAGE_KEY = '@app_language';

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // 1. Check Redux store first (most up-to-date)
      const state = store.getState();
      const reduxLanguage = state.language?.currentLanguage;
      
      if (reduxLanguage && isValidLanguageCode(reduxLanguage)) {
        callback(reduxLanguage);
        return;
      }

      // 2. Check AsyncStorage (persisted preference)
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && isValidLanguageCode(storedLanguage)) {
        callback(storedLanguage);
        return;
      }

      // 3. Check device language
      let deviceLanguage = DEFAULT_LANGUAGE;
      if (Platform.OS === 'ios') {
        deviceLanguage =
          NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
          DEFAULT_LANGUAGE;
      } else {
        deviceLanguage = NativeModules.I18nManager?.localeIdentifier || DEFAULT_LANGUAGE;
      }

      // Extract language code (e.g., 'en-US' -> 'en')
      const languageCode = deviceLanguage.split('-')[0].toLowerCase();
      
      if (isValidLanguageCode(languageCode)) {
        callback(languageCode);
        return;
      }

      // 4. Fallback to default
      callback(DEFAULT_LANGUAGE);
    } catch (error) {
      console.warn('Language detection error:', error);
      callback(DEFAULT_LANGUAGE);
    }
  },
  init: () => {
    // No initialization needed
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      if (isValidLanguageCode(lng)) {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
        // Also update Redux store
        store.dispatch(setLanguage(lng));
      }
    } catch (error) {
      console.warn('Failed to cache language:', error);
    }
  },
};

export default languageDetector;
