import { Component } from '@angular/core';
import { NgxSteelBeamsComponent } from '@omnedia/ngx-steel-beams';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NgxSteelBeamsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(public i18n: I18nService) {}
}