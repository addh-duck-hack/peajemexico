import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas que dependen de sesión/tokens en query string: sin valor de SEO, se renderizan solo en el navegador
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'users/verify', renderMode: RenderMode.Client },
  { path: 'reset-password', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender }
];
