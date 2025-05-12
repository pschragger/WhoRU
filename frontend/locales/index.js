import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import es from './es.json';
import he from './he.json';
import ja from './ja.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en
      },
      es: {
        translation: es
      },
      he: {
        translation: he
      },
      ja: {
        translation: ja
      }
    },
    lng: 'en', // Set default language
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false // not needed for react!!
    }
  });

  export default i18n;
