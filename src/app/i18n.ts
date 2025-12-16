import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)            // charge les fichiers JSON depuis assets/i18n/
  .use(LanguageDetector)       // détecte la langue du navigateur
  .init({
    fallbackLng: 'en',
    debug: false,              // mettre true pour débug
    backend: {
      loadPath: '/assets/i18n/{{lng}}.json',  // chemin des fichiers JSON
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
