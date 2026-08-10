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
const DEFAULT_IMAGE = `${SITE_URL}/images/logo-mark.svg`;

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  update(data: SeoData): void {
    const url = data.path ? `${SITE_URL}/${data.path}` : SITE_URL;
    const image = data.image ?? DEFAULT_IMAGE;

    this.titleService.setTitle(data.title);

    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: 'es_MX' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);
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
