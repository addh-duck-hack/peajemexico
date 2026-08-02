import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home')
  },
  {
    path: 'sobre-nosotros',
    loadComponent: () => import('./pages/about-us/about-us')
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact-us/contact-us')
  },
  {
    path: 'servicios',
    loadComponent: () => import('./pages/services/services')
  },
  {
    path: 'legales',
    loadComponent: () => import('./pages/legal/legal')
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy')
  },
  {
    path: 'calcular-mi-ruta',
    loadComponent: () => import('./pages/price-calculator/price-calculator')
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login')
  },
  {
    path: 'users/verify',
    loadComponent: () => import('./auth/validate-email/validate-email')
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./auth/reset-password/reset-password')
  },
  {
    path: '**',
    redirectTo: ''
  }
];
