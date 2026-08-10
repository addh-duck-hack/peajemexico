import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'legal',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './legal.html',
  styleUrl: './legal.css',
})
export default class Legal {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      path: 'legales',
      title: 'Aviso legal | PeajesMX',
      description: 'Aviso legal y términos de uso de PeajesMX.'
    });
  }
}
