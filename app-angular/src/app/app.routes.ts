import { Routes } from '@angular/router';
import { superAdminGuard } from './guards/super-admin.guard';

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
    path: 'guias',
    loadComponent: () => import('./pages/guides/guides-list/guides-list')
  },
  {
    path: 'guias/:slug',
    loadComponent: () => import('./pages/guides/guide-detail/guide-detail')
  },
  {
    path: 'noticias',
    loadComponent: () => import('./pages/news/news-list/news-list')
  },
  {
    path: 'noticias/:slug',
    loadComponent: () => import('./pages/news/news-detail/news-detail')
  },
  {
    path: 'admin',
    canActivate: [superAdminGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/admin/admin-home/admin-home') },
      { path: 'guias', loadComponent: () => import('./pages/admin/admin-guides-list/admin-guides-list') },
      { path: 'guias/nueva', loadComponent: () => import('./pages/admin/admin-guide-form/admin-guide-form') },
      { path: 'guias/:id/editar', loadComponent: () => import('./pages/admin/admin-guide-form/admin-guide-form') },
      { path: 'noticias', loadComponent: () => import('./pages/admin/admin-news-list/admin-news-list') },
      { path: 'noticias/nueva', loadComponent: () => import('./pages/admin/admin-news-form/admin-news-form') },
      { path: 'noticias/:id/editar', loadComponent: () => import('./pages/admin/admin-news-form/admin-news-form') },
    ]
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
