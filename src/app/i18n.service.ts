import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import i18n from './i18n'; // ton fichier i18n.ts

@Injectable({ providedIn: 'root' })
export class I18nService {
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  t(key: string): string {
    if (!this.isBrowser) return '';
    return i18n.t(key);
  }

  changeLanguage(lang: 'en' | 'fr') {
    if (!this.isBrowser) return;
    i18n.changeLanguage(lang);
  }

  get currentLanguage(): 'en' | 'fr' {
    return (i18n.language as 'en' | 'fr') || 'en';
  }
}