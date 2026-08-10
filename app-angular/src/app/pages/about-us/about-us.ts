import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'about-us',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export default class AboutUs {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      path: 'sobre-nosotros',
      title: 'Sobre nosotros | PeajesMX',
      description: 'Conoce PeajesMX, la calculadora que ayuda a viajeros y transportistas en México a conocer por adelantado el costo de las casetas de su ruta.'
    });
  }
}
