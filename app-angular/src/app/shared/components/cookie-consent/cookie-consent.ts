import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';

const CONSENT_STORAGE_KEY = 'peajesmx_cookie_consent';

@Component({
  selector: 'cookie-consent',
  imports: [RouterLink],
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.css'
})
export class CookieConsent {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private analytics = inject(AnalyticsService);

  visible = signal(false);

  constructor() {
    if (!this.isBrowser) return;
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted') {
      this.analytics.updateConsent(true);
    } else if (stored !== 'denied') {
      this.visible.set(true);
    }
  }

  accept(): void {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
    this.analytics.updateConsent(true);
    this.visible.set(false);
  }

  reject(): void {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'denied');
    this.analytics.updateConsent(false);
    this.visible.set(false);
  }
}
