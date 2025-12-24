import { Component, OnInit } from '@angular/core';
import { NgxSilkComponent } from '@omnedia/ngx-silk';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';
import { I18nService } from '../../i18n.service';
import { CommonModule } from '@angular/common';
import { timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-connect',
  imports: [NgxSilkComponent, NgxTypewriterComponent, CommonModule],
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.scss'
})
export class ConnectComponent implements OnInit{
  constructor(public i18n: I18nService) {}

  now$: Observable<Date> = timer(0, 1000).pipe(
    map(() => new Date())
  );

  ngOnInit() {}
}