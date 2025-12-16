import { Component } from '@angular/core';
import { LandingComponent } from "./features/landing/landing.component";
import { NavbarComponent } from "./features/navbar/navbar.component";
import { GalleryComponent } from "./features/gallery/gallery.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LandingComponent, NavbarComponent, GalleryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'clerevisuals';
  instaWhite = "assets/images/insta-white.png";
}