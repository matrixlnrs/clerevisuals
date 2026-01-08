import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NgxTypewriterComponent, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  isBrowser: boolean; 
  moveX = 0;
  moveY = 0;

  constructor(
    public i18n: I18nService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {}

  get subtitleWords(): string[] {
    return [this.i18n.t('hero.subtitle')];
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.isBrowser) {
      const x = (window.innerWidth / 2 - e.clientX) * 0.03;
      const y = (window.innerHeight / 2 - e.clientY) * 0.03;
      this.moveX = x;
      this.moveY = y;
    }
  }
}