import { Component } from '@angular/core';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public i18n: I18nService) {}

  changeLanguage(lang: 'en' | 'fr') {
    this.i18n.changeLanguage(lang);
  }

  get currentLang() {
    return this.i18n.currentLanguage;
  }
}