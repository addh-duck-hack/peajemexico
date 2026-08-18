import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'legal',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './legal.html',
  styleUrl: './legal.css',
})
export default class Legal {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      path: 'legales',
      title: 'Aviso legal | PeajesMX',
      description: 'Aviso legal y términos de uso de PeajesMX.'
    });

    this.seo.setJsonLd('breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://peajesmx.com/' },
        { '@type': 'ListItem', position: 2, name: 'Legales', item: 'https://peajesmx.com/legales/' },
      ],
    });
  }
}
