import { Component, inject } from '@angular/core';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'privacy-policy',
  imports: [Navbar, MainFooter],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export default class PrivacyPolicy {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      path: 'privacidad',
      title: 'Aviso de privacidad | PeajesMX',
      description: 'Conoce el aviso de privacidad de PeajesMX y cómo tratamos tus datos personales.'
    });

    this.seo.setJsonLd('breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://peajesmx.com/' },
        { '@type': 'ListItem', position: 2, name: 'Privacidad', item: 'https://peajesmx.com/privacidad/' },
      ],
    });
  }
}
