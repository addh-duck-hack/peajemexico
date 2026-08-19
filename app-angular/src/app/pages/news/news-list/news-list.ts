import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';
import { NEWS } from '../news.data';

@Component({
  selector: 'news-list',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
})
export default class NewsList {
  private seo = inject(SeoService);

  news = [...NEWS].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

  constructor() {
    this.seo.update({
      path: 'noticias',
      title: 'Noticias sobre casetas y carreteras en México | PeajesMX',
      description: 'Noticias sobre casetas, tarifas y carreteras en México, publicadas en colaboración con medios de noticias externos.'
    });

    this.seo.setJsonLd('breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://peajesmx.com/' },
        { '@type': 'ListItem', position: 2, name: 'Noticias', item: 'https://peajesmx.com/noticias/' },
      ],
    });

    // Solo las notas reales (sin `draft`) cuentan como contenido indexable del listado.
    const published = this.news.filter((item) => !item.draft);
    this.seo.setJsonLd('collection', {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Noticias sobre casetas y carreteras en México',
      url: 'https://peajesmx.com/noticias/',
      isPartOf: { '@type': 'WebSite', name: 'PeajesMX', url: 'https://peajesmx.com/' },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: published.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://peajesmx.com/noticias/${item.slug}/`,
        })),
      },
    });
  }
}
