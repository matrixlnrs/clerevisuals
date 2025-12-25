import { Component } from '@angular/core';
import { I18nService } from '../../i18n.service';
import { CommonModule } from '@angular/common'; // Ajoute ceci
import { RouterLink, RouterLinkActive } from '@angular/router'; // Ajoute ceci

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // 👈 AJOUTE CES TROIS LÀ
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public i18n: I18nService) {}

  changeLanguage(lang: 'en' | 'fr') {
    this.i18n.changeLanguage(lang);
  }

  // Si currentLang est un Signal dans ton service, 
  // appelle-le comme une fonction dans ton HTML ou ici.
  get currentLang() {
    return this.i18n.currentLang;
  }
}