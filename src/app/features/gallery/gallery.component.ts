import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  images = [
    'images/image1.jpg',
    'images/image2.jpg',
    'images/image3.jpg',
    'images/image4.jpg',
    'images/image5.jpg',
    'images/image6.jpg',
    'images/image7.jpg',
    'images/image8.jpg',
    'images/image9.jpg',
    'images/image10.jpg',
  ];

  startPositions = [
    { x: 0, y: 200 },
    { x: -250, y: 100 },
    { x: 250, y: 100 },
    { x: -500, y: 0 },
    { x: 500, y: 0 },
    { x: 0, y: -90 },
    { x: -250, y: -190 },
    { x: 250, y: -190 },
    { x: -500, y: -290 },
    { x: 500, y: -290}
  ];

  endPositions = [
    { x: 0, y: 115 },
    { x: -250, y: 115 },
    { x: 250, y: 115 },
    { x: -500, y: 115 },
    { x: 500, y: 115 },
    { x: 0, y: -175 },
    { x: -250, y: -175 },
    { x: 250, y: -175 },
    { x: -500, y: -175 },
    { x: 500, y: -175 }
  ];

  scrollPercent = 0;

  @HostListener('window:scroll', [])
onWindowScroll() {
  const section = document.querySelector('.gallery-section') as HTMLElement;
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // déclenchement retardé
  const startOffset = 0.6; // commence quand 30% de la section est visible
  const endOffset = 1.0;   // fin normale

  // progression normalisée
  let progress = (windowHeight * (1 - startOffset) - rect.top) / (windowHeight * (endOffset - startOffset));

  // clamp entre 0 et 1
  this.scrollPercent = Math.min(Math.max(progress, 0), 1);
}


  getTransform(index: number): string {
  const start = this.startPositions[index];
  const end = this.endPositions[index];

  const x = start.x + (end.x - start.x) * this.scrollPercent;
  const y = start.y + (end.y - start.y) * this.scrollPercent;

  return `translate(-50%, -50%) translate(${x}px, ${-y}px)`;
}
}