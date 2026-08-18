import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';
import { ARTICLES } from '../guides.data';

@Component({
  selector: 'guides-list',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './guides-list.html',
  styleUrl: './guides-list.css',
})
export default class GuidesList {
  private seo = inject(SeoService);

  articles = [...ARTICLES].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

  constructor() {
    this.seo.update({
      path: 'guias',
      title: 'Guías sobre casetas y carreteras en México | PeajesMX',
      description: 'Artículos y guías de PeajesMX sobre tarifas de casetas, tipos de vehículo, ejes excedentes y cómo planear tu ruta en la red carretera de México.'
    });
  }
}
