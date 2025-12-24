import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';
import { I18nService } from '../../i18n.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { timer, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [NgxTypewriterComponent, CommonModule],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.scss'
})
export class ConnectComponent implements OnInit {
  now$: Observable<Date>;
  
  // 👇 AJOUTE CETTE LIGNE (Variable publique)
  isBrowser: boolean; 

  constructor(
    public i18n: I18nService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // On stocke l'info : est-on sur le navigateur ?
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Logique de l'horloge (correcte maintenant)
    if (this.isBrowser) {
      this.now$ = timer(0, 1000).pipe(map(() => new Date()));
    } else {
      this.now$ = of(new Date());
    }
  }

  ngOnInit() {}
}