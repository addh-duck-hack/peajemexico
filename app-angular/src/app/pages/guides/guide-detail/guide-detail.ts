import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';
import { GuidesService } from 'src/app/services/guides.service';
import { Article } from 'src/app/shared/interfaces/article.interface';

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
  private guidesService = inject(GuidesService);

  private slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))));

  // undefined mientras carga, null si el backend confirma que no existe (404),
  // Article si se encontró. El effect() de abajo distingue estos tres estados.
  private loadedArticle = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('slug')),
      switchMap((slug) =>
        slug
          ? this.guidesService.getBySlug(slug).pipe(
              map((article): Article | null => article ?? null),
              catchError(() => of(null))
            )
          : of(null)
      )
    )
  );

  article = computed(() => this.loadedArticle() ?? undefined);

  // Guías (publicadas) para sugerir al final del artículo: primero las de la
  // misma categoría, luego se rellena con las más recientes, con un tope fijo.
  private static readonly MAX_SUGGESTED = 3;

  private allGuides = toSignal(this.guidesService.getAll(), { initialValue: [] as Article[] });

  otherArticles = computed(() => {
    const current = this.article();
    const rest = this.allGuides().filter((item) => item.slug !== this.slug());
    if (!current) return rest.slice(0, GuideDetail.MAX_SUGGESTED);

    const sameCategory = rest.filter((item) => item.category === current.category);
    const otherCategory = rest.filter((item) => item.category !== current.category);
    return [...sameCategory, ...otherCategory].slice(0, GuideDetail.MAX_SUGGESTED);
  });

  constructor() {
    effect(() => {
      const loaded = this.loadedArticle();

      if (loaded === undefined) return; // aún cargando
      if (loaded === null) {
        this.router.navigate(['/guias']);
        return;
      }
      const article = loaded;

      this.seo.update({
        path: `guias/${article.slug}`,
        title: `${article.title} | PeajesMX`,
        description: article.description,
      });

      if (article.draft) {
        this.seo.setNoIndex();
      }

      this.seo.setJsonLd('article', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: [article.image ?? 'https://peajesmx.com/images/hero-highway.jpg'],
        datePublished: article.publishedDate,
        dateModified: article.updatedDate ?? article.publishedDate,
        inLanguage: 'es-MX',
        author: { '@type': 'Organization', name: 'PeajesMX', url: 'https://peajesmx.com/' },
        publisher: {
          '@type': 'Organization',
          name: 'PeajesMX',
          logo: { '@type': 'ImageObject', url: 'https://peajesmx.com/logo/logo-color.png', width: 935, height: 874 }
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://peajesmx.com/guias/${article.slug}/` },
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
