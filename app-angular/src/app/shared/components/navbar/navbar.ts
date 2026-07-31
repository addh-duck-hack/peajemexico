import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import '@tailwindplus/elements';
import { environment } from '@environments/environment';
import { NavbarItem } from '../../interfaces/navbar-item.interface';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  logo = 'images/logo-mark.svg';
  env = environment;
  private router = inject(Router);

  menuOptions:NavbarItem[] = [
    { id: 1, name: 'Inicio', route: '/' },
    { id: 2, name: 'Servicios', route: '/servicios' },
    { id: 3, name: 'Contacto', route: '/contacto' },
    { id: 4, name: 'Legales', route: '/legales' }
  ]

  openMobile = signal(false)
  classMobileMenu = signal('flex-col flex-grow hidden pb-4 md:pb-0 md:flex md:items-center md:justify-end md:flex-row')
  onCalculatorRoute = signal(this.router.url.startsWith('/calcular-mi-ruta'));

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.onCalculatorRoute.set(this.router.url.startsWith('/calcular-mi-ruta')));
  }

  toggleMenuMobile(){
    if (this.openMobile()){
      this.classMobileMenu.set('flex-col flex-grow hidden pb-4 md:pb-0 md:flex md:items-center md:justify-end md:flex-row');
    }else{
      this.classMobileMenu.set('flex flex-col flex-grow pb-4 md:pb-0 md:flex md:items-center md:justify-end md:flex-row');
    }
    this.openMobile.set(!this.openMobile());
  }
}
