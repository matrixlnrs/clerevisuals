import { Component } from '@angular/core';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-story',
  imports: [],
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent {
  constructor(public i18n: I18nService) {}
}