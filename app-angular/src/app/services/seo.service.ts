import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. '' or 'calcular-mi-ruta' */
  path: string;
  image?: string;
}

const SITE_URL = 'https://peajesmx.com';
// Facebook/X/WhatsApp/LinkedIn no renderizan SVG de forma confiable como og:image;
// se usa una foto real en JPG con proporción cercana a la recomendada (1.91:1).
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-highway.jpg`;
const DEFAULT_IMAGE_WIDTH = '1280';
const DEFAULT_IMAGE_HEIGHT = '697';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  update(data: SeoData): void {
    // nginx sirve cada ruta prerenderizada como directorio (ej. servicios/index.html)
    // y redirige "/servicios" -> "/servicios/". La URL canónica debe coincidir con esa
    // URL final (con "/", inclusive el home) para que no dependa de seguir una redirección.
    const url = `${SITE_URL}/${data.path ? data.path + '/' : ''}`;
    const image = data.image ?? DEFAULT_IMAGE;

    this.titleService.setTitle(data.title);

    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    if (!data.image) {
      this.meta.updateTag({ property: 'og:image:width', content: DEFAULT_IMAGE_WIDTH });
      this.meta.updateTag({ property: 'og:image:height', content: DEFAULT_IMAGE_HEIGHT });
    }
    this.meta.updateTag({ property: 'og:locale', content: 'es_MX' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
  }

  /** Marca la página actual como no indexable (páginas solo-CSR con token en la URL: login, reset-password, verify). */
  setNoIndex(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  /** Inyecta (o reemplaza) un bloque de datos estructurados JSON-LD identificado por `id`. */
  setJsonLd(id: string, data: object): void {
    const scriptId = `jsonld-${id}`;
    let script = this.doc.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
