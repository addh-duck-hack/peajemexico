import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';
import { GuidesService } from 'src/app/services/guides.service';
import { Article } from 'src/app/shared/interfaces/article.interface';

@Component({
  selector: 'guides-list',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './guides-list.html',
  styleUrl: './guides-list.css',
})
export default class GuidesList {
  private seo = inject(SeoService);
  private guidesService = inject(GuidesService);

  // El endpoint ya excluye borradores; solo falta ordenar por fecha.
  private loadedArticles = toSignal(this.guidesService.getAll());
  articles = computed(() =>
    [...(this.loadedArticles() ?? [])].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
  );

  constructor() {
    this.seo.update({
      path: 'guias',
      title: 'Guías sobre casetas y carreteras en México | PeajesMX',
      description: 'Artículos y guías de PeajesMX sobre tarifas de casetas, tipos de vehículo, ejes excedentes y cómo planear tu ruta en la red carretera de México.'
    });

    this.seo.setJsonLd('breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://peajesmx.com/' },
        { '@type': 'ListItem', position: 2, name: 'Guías', item: 'https://peajesmx.com/guias/' },
      ],
    });

    effect(() => {
      const articles: Article[] | undefined = this.loadedArticles();
      if (!articles) return; // aún cargando

      this.seo.setJsonLd('collection', {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Guías sobre casetas y carreteras en México',
        url: 'https://peajesmx.com/guias/',
        isPartOf: { '@type': 'WebSite', name: 'PeajesMX', url: 'https://peajesmx.com/' },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: this.articles().map((article, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://peajesmx.com/guias/${article.slug}/`,
          })),
        },
      });
    });
  }
}
