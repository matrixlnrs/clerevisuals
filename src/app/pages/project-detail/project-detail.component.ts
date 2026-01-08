import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  // Store only the ID of the current project
  currentProjectId: string | null = null;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public i18n: I18nService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentProjectId = params.get('id');
    });
    window.scrollTo(0, 0);
  }

  // --- SMART GETTER FOR PERFORMANCE ---
  // This automatically generates the '-small' path for the grid
  get project() {
    if (!this.currentProjectId) return null;
    
    // 1. Find the raw project data
    const rawProject = this.projectsData.find(p => p.id === this.currentProjectId);
    if (!rawProject) return null;

    return {
      ...rawProject,
      // 2. Transform the simple string array into objects with two paths
      gallery: rawProject.gallery.map(img => {
        // Find the last dot to separate filename from extension
        const dotIndex = img.lastIndexOf('.');
        
        // Insert '-small' before the extension
        // Example: 'images/bike.webp' becomes 'images/bike-small.webp'
        const thumbPath = dotIndex !== -1 
          ? `${img.substring(0, dotIndex)}-small${img.substring(dotIndex)}` 
          : img;
        
        return {
          full: img,       // The original high-quality file (used for Lightbox)
          thumb: thumbPath // The lightweight file (used for Grid)
        };
      })
    };
  }

  // --- YOUR DATA (UNCHANGED) ---
  private get projectsData() {
    return [
      {
        id: 'landscape',
        name: this.i18n.t('detailed.name-2'),
        year: '2025',
        gallery: [
          'images/landscape/bike.webp', 'images/landscape/boats.webp', 'images/landscape/fire1.webp', 
          'images/landscape/fire2.webp', 'images/landscape/flower.webp', 'images/landscape/fog.webp', 
          'images/landscape/fog1.webp', 'images/landscape/fruits.webp', 'images/landscape/lantern.webp', 
          'images/landscape/rock.webp', 'images/landscape/sea.webp', 'images/landscape/singapore.webp', 
          'images/landscape/street.webp', 'images/landscape/street2.webp', 'images/landscape/sunset.webp', 
          'images/landscape/sunset2.webp', 'images/landscape/sunset3.webp', 'images/landscape/tea.webp', 
          'images/landscape/temple.webp', 'images/landscape/thunder.webp', 'images/landscape/war.webp'
        ]
      },
      {
        id: 'french-elite-championship',
        name: this.i18n.t('detailed.name-1'),
        year: '2025',
        gallery: [
          'images/elite/image1.webp', 'images/elite/image2.webp', 'images/elite/image3.webp',
          'images/elite/image6.webp', 'images/elite/image7.webp', 'images/elite/image8.webp', 
          'images/elite/image9.webp', 'images/elite/image10.webp', 'images/elite/image4.webp',
          'images/elite/image5.webp'
        ]
      },
      {
        id: 'sunset-bike',
        name: this.i18n.t('detailed.name-4'),
        year: '2024',
        gallery: [
          'images/bike/image1.webp', 'images/bike/image2.webp', 'images/bike/image3.webp', 
          'images/bike/image4.webp', 'images/bike/image5.webp', 'images/bike/image6.webp', 
          'images/bike/image7.webp', 'images/bike/image8.webp', 'images/bike/image9.webp', 
          'images/bike/image23.webp', 'images/bike/image26.webp', 'images/bike/image12.webp', 
          'images/bike/image13.webp', 'images/bike/image14.webp', 'images/bike/image15.webp', 
          'images/bike/image16.webp', 'images/bike/image17.webp', 'images/bike/image18.webp', 
          'images/bike/image19.webp', 'images/bike/image20.webp', 'images/bike/image21.webp',
          'images/bike/image22.webp', 'images/bike/image25.webp', 'images/bike/image24.webp',
          'images/bike/image10.webp', 'images/bike/image11.webp', 'images/bike/image27.webp',
          'images/bike/image28.webp'
        ]
      },
      {
        id: 'track-and-field',
        name: this.i18n.t('detailed.name-5'),
        year: '2024',
        gallery: [
          'images/track/image1.webp', 'images/track/image2.webp', 'images/track/image3.webp', 
          'images/track/image4.webp', 'images/track/image5.webp', 'images/track/image6.webp', 
          'images/track/image7.webp', 'images/track/image8.webp', 'images/track/image9.webp', 
          'images/track/image10.webp', 'images/track/image11.webp', 'images/track/image12.webp', 
          'images/track/image13.webp', 'images/track/image14.webp', 'images/track/image15.webp', 
          'images/track/image16.webp', 'images/track/image17.webp', 'images/track/image18.webp', 
          'images/track/image19.webp', 'images/track/image20.webp', 'images/track/image21.webp',
          'images/track/image22.webp', 'images/track/image23.webp', 'images/track/image24.webp',
          'images/track/image25.webp', 'images/track/image26.webp', 'images/track/image27.webp',
          'images/track/image28.webp', 'images/track/image29.webp'
        ]
      },
      {
        id: 'circuit-paul-ricard',
        name: this.i18n.t('detailed.name-3'),
        year: '2024',
        gallery: [
          'images/circuit/image1.webp', 'images/circuit/image2.webp', 'images/circuit/image3.webp', 
          'images/circuit/image4.webp', 'images/circuit/image5.webp', 'images/circuit/image6.webp', 
          'images/circuit/image7.webp', 'images/circuit/image8.webp', 'images/circuit/image9.webp', 
          'images/circuit/image23.webp', 'images/circuit/image11.webp', 'images/circuit/image12.webp', 
          'images/circuit/image13.webp', 'images/circuit/image14.webp', 'images/circuit/image15.webp', 
          'images/circuit/image16.webp', 'images/circuit/image17.webp', 'images/circuit/image18.webp', 
          'images/circuit/image19.webp', 'images/circuit/image20.webp', 'images/circuit/image21.webp',
          'images/circuit/image22.webp', 'images/circuit/image25.webp', 'images/circuit/image24.webp',
          'images/circuit/image10.webp'
        ]
      },
    ];
  }

  // --- LIGHTBOX CONTROLS ---

  openLightbox(image: string): void {
    this.selectedImage = image;
    // Prevent scrolling while lightbox is open
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.addClass(document.body, 'lightbox-active');
  }

  closeLightbox(): void {
    this.selectedImage = null;
    // Re-enable scrolling
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeClass(document.body, 'lightbox-active');
  }
}