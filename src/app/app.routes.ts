import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { AboutComponent } from './pages/about/about.component';
import { WorkComponent } from './pages/work/work.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },   // page d'accueil
  { path: 'connect', component: ConnectComponent }, // page contact
  { path: 'about', component: AboutComponent }, // page à propos
  { path: 'work', component: WorkComponent }, // page portfolio
  { path: 'work/:id', component: ProjectDetailComponent }, // page détail portfolio
  { path: '**', redirectTo: '' }  // fallback
];