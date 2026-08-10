import { Component, PLATFORM_ID, afterNextRender, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@environments/environment';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Bloque de anuncio de Google AdSense. Requiere que el `slot` exista en la cuenta de AdSense
 * (Anuncios > Por unidad de anuncio) — sin un slot real el bloque queda vacío.
 */
@Component({
  selector: 'ad-unit',
  imports: [],
  templateUrl: './ad-unit.html',
  styleUrl: './ad-unit.css'
})
export class AdUnit {
  slot = input.required<string>();
  adClient = environment.adsensePublisherId;
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser || !environment.adsensePublisherId) return;
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    });
  }
}
