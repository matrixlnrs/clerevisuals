import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../i18n.service';
import { NgxCrypticTextComponent } from '@omnedia/ngx-cryptic-text';

interface Project {
  id: string;
  name: string;
  year: string;
  image: string;
  category: string;
}

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxCrypticTextComponent],
  templateUrl: './work.component.html',
  styleUrl: './work.component.css'
})
export class WorkComponent implements OnInit {
  
  // On utilise un getter pour que les noms se mettent à jour si la langue change
  get projects(): Project[] {
    return [
      {
        id: 'french-elite-championship',
        name: this.i18n.t('work.name-1'),
        year: '2025',
        image: 'images/elite/ground.webp',
        category: 'Photographie'
      },
      {
        id: 'landscape',
        name: this.i18n.t('work.name-2'),
        year: '2025',
        image: 'images/landscape/thunder.webp',
        category: 'Photographie'
      },
      {
        id: 'circuit-paul-ricard',
        name: this.i18n.t('work.name-3'),
        year: '2024',
        image: 'images/circuit/image25.webp',
        category: 'Photographie'
      },
      {
        id: 'sunset-bike',
        name: this.i18n.t('work.name-4'),
        year: '2024',
        image: 'images/bike/image11.webp',
        category: 'Photographie'
      },
      {
        id: 'track-and-field',
        name: this.i18n.t('work.name-5'),
        year: '2024',
        image: 'images/track/image17.webp',
        category: 'Photographie'
      },
    ];
  }

  constructor(public i18n: I18nService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}