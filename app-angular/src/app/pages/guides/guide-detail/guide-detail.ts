import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';
import { ARTICLES } from '../guides.data';

@Component({
  selector: 'guide-detail',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './guide-detail.html',
  styleUrl: './guide-detail.css',
})
export default class GuideDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);

  private slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))));

  article = computed(() => ARTICLES.find((item) => item.slug === this.slug()));

  // Otras guías para sugerir al final del artículo (excluye la actual)
  otherArticles = computed(() => ARTICLES.filter((item) => item.slug !== this.slug()));

  constructor() {
    effect(() => {
      const article = this.article();

      if (!article) {
        this.router.navigate(['/guias']);
        return;
      }

      this.seo.update({
        path: `guias/${article.slug}`,
        title: `${article.title} | PeajesMX`,
        description: article.description,
      });

      this.seo.setJsonLd('article', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: article.publishedDate,
        dateModified: article.updatedDate ?? article.publishedDate,
        author: { '@type': 'Organization', name: 'PeajesMX' },
      });

      this.seo.setJsonLd('breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://peajesmx.com/' },
          { '@type': 'ListItem', position: 2, name: 'Guías', item: 'https://peajesmx.com/guias/' },
          { '@type': 'ListItem', position: 3, name: article.title, item: `https://peajesmx.com/guias/${article.slug}/` },
        ],
      });
    });
  }
}
