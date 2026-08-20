import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas que dependen de sesión/tokens en query string: sin valor de SEO, se renderizan solo en el navegador
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'users/verify', renderMode: RenderMode.Client },
  { path: 'reset-password', renderMode: RenderMode.Client },
  // Panel de administración: requiere sesión de super_admin, sin valor de SEO.
  { path: 'admin/**', renderMode: RenderMode.Client },
  // El contenido de /guias y /noticias vive en Mongo (ver backend/models/) y
  // se administra desde /admin sin pasar por un release del sitio (ver
  // GuidesService/NewsService). Antes esto se prerenderizaba en build time,
  // lo que obligaba al build a poder alcanzar el backend por red -algo que
  // en un docker-compose que construye frontend y backend juntos casi nunca
  // se cumple, porque el backend todavía no existe como contenedor en ese
  // momento-. RenderMode.Server evita ese problema por completo: cada visita
  // se renderiza en el momento, así que un contenido recién publicado
  // aparece de inmediato sin esperar un rebuild. Corre en su propio
  // contenedor Node (ver src/server.ts y app-angular/Dockerfile, stage
  // "ssr"), al que nginx le reenvía específicamente estas rutas.
  { path: 'guias', renderMode: RenderMode.Server },
  { path: 'guias/:slug', renderMode: RenderMode.Server },
  { path: 'noticias', renderMode: RenderMode.Server },
  { path: 'noticias/:slug', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender }
];
