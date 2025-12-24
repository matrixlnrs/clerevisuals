import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ConnectComponent } from './pages/connect/connect.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },   // page d'accueil
  { path: 'connect', component: ConnectComponent },
  { path: '**', redirectTo: '' }               // fallback
];
