import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit {
  progress = 0;
  isVisible = true;

  ngOnInit() {
    this.startLoading();
  }

  startLoading() {
    const timer = setInterval(() => {
      // Simulation d'un chargement organique
      this.progress += Math.floor(Math.random() * 15);
      
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(timer);
        setTimeout(() => {
          this.isVisible = false;
        }, 800);
      }
    }, 120);
  }
}