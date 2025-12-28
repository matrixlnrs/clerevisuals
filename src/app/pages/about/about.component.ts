import { Component, Inject, PLATFORM_ID, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../i18n.service';
import { NgxTimelineComponent, NgxTimelineEntryComponent } from '@omnedia/ngx-timeline';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxTimelineComponent, NgxTimelineEntryComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit {
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public i18n: I18nService,
    private el: ElementRef // Inject ElementRef to query DOM
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initScrollObserver();
    }
  }

  initScrollObserver() {
    // We look for the year-wrapper elements
    const options = {
      root: null,
      rootMargin: '-20% 0px -40% 0px', // Trigger when element is roughly in the middle
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          // Optional: remove class if you want it to "un-glow" when scrolling past
          entry.target.classList.remove('active');
        }
      });
    }, options);

    // Grab all year spans. 
    // Since om-timeline might take a moment to render, we use a small timeout or query directly
    setTimeout(() => {
      const years = this.el.nativeElement.querySelectorAll('.timeline-year');
      years.forEach((year: HTMLElement) => observer.observe(year));
    }, 500);
  }
}