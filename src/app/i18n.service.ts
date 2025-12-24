import { Injectable, signal } from '@angular/core';
import i18nInstance from './i18n'; // Importe l'instance configurée dans i18n.ts

@Injectable({
  providedIn: 'root' // Rend le service disponible partout automatiquement
})
export class I18nService {
  // Signal réactif : permet à l'interface de changer instantanément
  currentLang = signal(i18nInstance.language || 'en');

  constructor() {
    // On écoute l'événement de changement de langue de i18next
    i18nInstance.on('languageChanged', (lang) => {
      this.currentLang.set(lang);
    });
  }

  // Change la langue (ex: 'fr' ou 'en')
  changeLanguage(lang: string) {
    i18nInstance.changeLanguage(lang);
  }

  // Fonction de traduction utilisée par ton Pipe ou tes composants
  t(key: string, params?: any): string {
    return i18nInstance.t(key, params) as string;
  }
}