import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import '@tailwindplus/elements';
import { environment } from '@environments/environment';
import { NavbarItem } from '../../interfaces/navbar-item.interface';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  logo = 'images/icon_text.png';
  env = environment;

  menuOptions:NavbarItem[] = [
    { id: 1, name: 'Inicio', route: '/' },
    { id: 2, name: 'Calculadora Casetas', route: '/sobre-nosotros' },
    { id: 3, name: 'Soporte', route: '/servicios', subItems: [
      { id: 31, name: '¿Como funciona?', route: '/servicios' },
      { id: 32, name: 'Preguntas frecuentes', route: '/servicios' },
      { id: 33, name: 'Otros', route: '/servicios' }
    ]},
    { id: 4, name: 'Contacto', route: '/contacto' }
  ]

  openMobile = signal(false)
  classMobileMenu = signal('flex-col flex-grow hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row')


  openMore = signal(false)
  classButtonMore = signal('rotate-0 inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1')

  toggleMenuMobile(){
    if (this.openMobile()){
      this.classMobileMenu.set('flex-col flex-grow hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row');
    }else{
      this.classMobileMenu.set('flex flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row');
    }
    this.openMobile.set(!this.openMobile());
  }

  toggleSubMenu(){
    if (this.openMore()){
      this.classButtonMore.set('rotate-0 inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1');
    }else{
      this.classButtonMore.set('rotate-180 inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1');
    }
    this.openMore.set(!this.openMore())
  }
}
