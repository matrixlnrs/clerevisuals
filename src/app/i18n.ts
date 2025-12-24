import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const i18nInstance = i18n.createInstance();
const isServer = typeof window === 'undefined';

(async () => {
  if (isServer) {
    // 👇 LA RUSE : On met le nom dans une variable.
    // Le compilateur ne détecte pas l'import statique et ne plante pas sur 'node:fs'.
    const fsBackendName = 'i18next-fs-backend';
    const { default: FsBackend } = await import(fsBackendName);

    await i18nInstance
      .use(FsBackend)
      .use(LanguageDetector)
      .init({
        fallbackLng: 'en',
        debug: false,
        load: 'languageOnly',
        backend: {
          loadPath: './src/assets/i18n/{{lng}}.json',
        },
        interpolation: { escapeValue: false }
      });
  } else {
    // Code Navigateur classique
    await i18nInstance
      .use(HttpBackend)
      .use(LanguageDetector)
      .init({
        fallbackLng: 'en',
        debug: false,
        load: 'languageOnly',
        backend: {
          loadPath: '/assets/i18n/{{lng}}.json',
        },
        interpolation: { escapeValue: false }
      });
  }
})();

export default i18nInstance;