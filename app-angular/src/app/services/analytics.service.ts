import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

type ConsentState = 'granted' | 'denied';

/**
 * Google Analytics (gtag.js) y AdSense se cargan como snippet estático en index.html
 * (igual que las instrucciones oficiales de Google), para que herramientas como el
 * verificador de instalación de GA — que solo leen el HTML, sin ejecutar JS — lo detecten.
 * Este servicio solo agrega, por encima de ese gtag global, el tracking de navegación
 * dentro del SPA (Angular Router no recarga la página en cada cambio de ruta) y el
 * puente con el aviso de cookies.
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private router = inject(Router);
  private initialized = false;
  // El primer page_view ya lo dispara gtag('config', ...) en index.html — solo se
  // rastrean manualmente las navegaciones SPA posteriores.
  private isFirstNavigation = true;

  initialize(): void {
    if (!this.isBrowser || this.initialized) return;
    this.initialized = true;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (this.isFirstNavigation) {
          this.isFirstNavigation = false;
          return;
        }
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  /** Se llama cuando el usuario acepta o rechaza el aviso de cookies. */
  updateConsent(granted: boolean): void {
    if (!this.isBrowser || typeof window.gtag !== 'function') return;
    const state: ConsentState = granted ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
  }

  private trackPageView(path: string): void {
    if (!this.isBrowser || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href
    });
  }
}
