import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';
import { NewsService } from 'src/app/services/news.service';
import { NewsArticle } from 'src/app/shared/interfaces/news-article.interface';

@Component({
  selector: 'news-list',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
})
export default class NewsList {
  private seo = inject(SeoService);
  private newsService = inject(NewsService);

  // El endpoint ya excluye borradores; solo falta ordenar por fecha.
  private loadedNews = toSignal(this.newsService.getAll());
  news = computed(() =>
    [...(this.loadedNews() ?? [])].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
  );

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

    effect(() => {
      const news: NewsArticle[] | undefined = this.loadedNews();
      if (!news) return; // aún cargando

      this.seo.setJsonLd('collection', {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Noticias sobre casetas y carreteras en México',
        url: 'https://peajesmx.com/noticias/',
        isPartOf: { '@type': 'WebSite', name: 'PeajesMX', url: 'https://peajesmx.com/' },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: this.news().map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://peajesmx.com/noticias/${item.slug}/`,
          })),
        },
      });
    });
  }
}
