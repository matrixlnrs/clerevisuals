import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./features/navbar/navbar.component";
import { RouterOutlet } from "@angular/router";
import { LoaderComponent } from "./features/loader/loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, LoaderComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'clerevisuals';
  instaWhite = "assets/images/insta-white.png";
  isFirstLoad = true;
}