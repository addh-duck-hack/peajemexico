import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '@environments/environment';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

type ConsentState = 'granted' | 'denied';

/**
 * Carga y controla Google Analytics (gtag.js) y Google AdSense, con Google Consent Mode
 * (denegado por defecto hasta que el usuario acepta el aviso de cookies).
 * Los IDs vienen de environment.*.ts, por lo que en desarrollo no se envían datos reales.
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private router = inject(Router);
  private initialized = false;

  initialize(): void {
    if (!this.isBrowser || this.initialized) return;
    this.initialized = true;

    window.dataLayer = window.dataLayer || [];
    this.gtag('js', new Date());
    this.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    });

    if (environment.gaMeasurementId) {
      this.loadScript(`https://www.googletagmanager.com/gtag/js?id=${environment.gaMeasurementId}`);
      // send_page_view en false: el primer page_view y los siguientes se disparan manualmente
      // en cada NavigationEnd, ya que en una SPA el load inicial es la única navegación real.
      this.gtag('config', environment.gaMeasurementId, { send_page_view: false });
    }

    if (environment.adsensePublisherId) {
      this.loadScript(
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${environment.adsensePublisherId}`,
        true
      );
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
  }

  /** Se llama cuando el usuario acepta o rechaza el aviso de cookies. */
  updateConsent(granted: boolean): void {
    if (!this.isBrowser) return;
    const state: ConsentState = granted ? 'granted' : 'denied';
    this.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
  }

  private trackPageView(path: string): void {
    if (!this.isBrowser || !environment.gaMeasurementId) return;
    this.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href
    });
  }

  private gtag(...args: any[]): void {
    window.dataLayer.push(args);
  }

  private loadScript(src: string, crossOrigin = false): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    if (crossOrigin) script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }
}
