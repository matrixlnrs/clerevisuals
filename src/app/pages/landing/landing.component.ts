import { Component } from '@angular/core';
import { NgxSilkComponent } from '@omnedia/ngx-silk';
import { I18nService } from '../../i18n.service';
import { GalleryComponent } from '../../features/gallery/gallery.component';
import { StoryComponent } from '../../features/story/story.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NgxSilkComponent, GalleryComponent, StoryComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(public i18n: I18nService) {}
}