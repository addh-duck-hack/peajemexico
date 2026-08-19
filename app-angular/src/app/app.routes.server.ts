import { RenderMode, ServerRoute } from '@angular/ssr';
import { ARTICLES } from './pages/guides/guides.data';
import { NEWS } from './pages/news/news.data';

export const serverRoutes: ServerRoute[] = [
  // Rutas que dependen de sesión/tokens en query string: sin valor de SEO, se renderizan solo en el navegador
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'users/verify', renderMode: RenderMode.Client },
  { path: 'reset-password', renderMode: RenderMode.Client },
  {
    // Ruta con parámetro: hay que enumerar los slugs existentes para que cada
    // artículo se prerenderice como HTML estático (y así Google lo vea como contenido real).
    path: 'guias/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return ARTICLES.map((article) => ({ slug: article.slug }));
    }
  },
  {
    // Igual que guias/:slug: se enumeran los slugs (incluye las notas `draft`,
    // para poder revisar su diseño en /noticias/:slug antes de publicarlas;
    // el noindex de la nota individual evita que Google las indexe mientras tanto).
    path: 'noticias/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return NEWS.map((item) => ({ slug: item.slug }));
    }
  },
  { path: '**', renderMode: RenderMode.Prerender }
];
