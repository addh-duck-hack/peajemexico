import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { AnalyticsService } from './services/analytics.service';
import { CookieConsent } from './shared/components/cookie-consent/cookie-consent';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieConsent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor() {
    const titleService = inject(Title);
    titleService.setTitle(environment.companyName);
    inject(AnalyticsService).initialize();
  }
}
