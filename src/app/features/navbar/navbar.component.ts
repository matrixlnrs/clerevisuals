import { Component, HostListener, OnInit } from '@angular/core';
import { I18nService } from '../../i18n.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isNavbarHidden = false;
  private lastScrollTop = 0;

  constructor(public i18n: I18nService) {}

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  /**
   * Change la langue via le service i18n
   */
  changeLanguage(lang: 'en' | 'fr') {
    this.i18n.changeLanguage(lang);
  }

  /**
   * Récupère la langue actuelle pour appliquer la classe .active
   */
  get currentLang() {
    return this.i18n.currentLang;
  }

  /**
   * Gère l'ouverture du menu burger sur mobile
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Bloque le défilement de la page quand le menu est ouvert pour une meilleure UX
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
  }

  /**
   * Écoute le scroll pour masquer la navbar vers le bas et l'afficher vers le haut
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    // 1. On masque si on descend de plus de 50px
    if (st > this.lastScrollTop && st > 50) {
      this.isNavbarHidden = true;
    } 
    // 2. On réaffiche dès qu'on remonte
    else {
      this.isNavbarHidden = false;
    }

    // Protection pour les navigateurs mobiles (scroll élastique)
    this.lastScrollTop = st <= 0 ? 0 : st;
  }
}