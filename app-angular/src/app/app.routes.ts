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
    path: 'login',
    loadComponent: () => import('./auth/login/login')
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard'),
    children:[
      {
        path: 'home',
        loadComponent: () => import('./pages/dashboard/home-dashboard/home-dashboard'),
      },
      {
        path: 'price',
        loadComponent: () => import('./pages/dashboard/price-dashboard/price-dashboard'),
      },
      {
        path: 'history',
        loadComponent: () => import('./pages/dashboard/history-dashboard/history-dashboard'),
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
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
