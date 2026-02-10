import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '../translations';
import languageDetector from './languageDetector';
import { DEFAULT_LANGUAGE } from './languages';
import { store } from '../store';
import { selectCurrentLanguage } from '../features/language/selectors';

// Initialize i18n
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

// Subscribe to Redux store changes to sync language
let previousLanguage = store.getState().language?.currentLanguage || DEFAULT_LANGUAGE;
store.subscribe(() => {
  const currentLanguage = selectCurrentLanguage(store.getState());
  if (currentLanguage !== previousLanguage && currentLanguage !== i18n.language) {
    previousLanguage = currentLanguage;
    i18n.changeLanguage(currentLanguage).catch((error) => {
      console.warn('Failed to change language:', error);
    });
  }
});

export default i18n;
