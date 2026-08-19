import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';
import { NEWS } from '../news.data';

const SITE_URL = 'https://peajesmx.com';

@Component({
  selector: 'news-detail',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.css',
})
export default class NewsDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);

  private slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))));

  item = computed(() => NEWS.find((entry) => entry.slug === this.slug()));

  private static readonly MAX_SUGGESTED = 3;

  otherNews = computed(() =>
    NEWS.filter((entry) => entry.slug !== this.slug()).slice(0, NewsDetail.MAX_SUGGESTED)
  );

  constructor() {
    effect(() => {
      const item = this.item();

      if (!item) {
        this.router.navigate(['/noticias']);
        return;
      }

      const imageUrl = item.image.startsWith('http') ? item.image : `${SITE_URL}/${item.image}`;

      this.seo.update({
        path: `noticias/${item.slug}`,
        title: `${item.title} | PeajesMX`,
        description: item.description,
        image: imageUrl,
      });

      // Contenido de prueba/placeholder: no debe indexarse hasta reemplazarse por una nota real.
      if (item.draft) {
        this.seo.setNoIndex();
      }

      this.seo.setJsonLd('article', {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: item.title,
        description: item.description,
        image: [imageUrl],
        datePublished: item.publishedDate,
        dateModified: item.updatedDate ?? item.publishedDate,
        inLanguage: 'es-MX',
        // La nota la firma el medio/persona colaboradora, no PeajesMX.
        author: { '@type': 'Person', name: item.author },
        // isBasedOn señala la publicación original de la que proviene esta nota colaborativa.
        isBasedOn: item.sourceUrl,
        publisher: {
          '@type': 'Organization',
          name: 'PeajesMX',
          logo: { '@type': 'ImageObject', url: 'https://peajesmx.com/logo/logo-color.png', width: 658, height: 615 }
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://peajesmx.com/noticias/${item.slug}/` },
      });

      this.seo.setJsonLd('breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://peajesmx.com/' },
          { '@type': 'ListItem', position: 2, name: 'Noticias', item: 'https://peajesmx.com/noticias/' },
          { '@type': 'ListItem', position: 3, name: item.title, item: `https://peajesmx.com/noticias/${item.slug}/` },
        ],
      });
    });
  }
}
