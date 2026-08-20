import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { environment } from '@environments/environment';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * sitemap.xml ya no se genera en build time (ver git history de
 * scripts/generate-sitemap.mjs, removido junto con esto): con /guias y
 * /noticias renderizándose por request (RenderMode.Server, ver
 * app.routes.server.ts) el build ya no necesita alcanzar el backend, que era
 * justo el problema original -este server SSR corre en su propio contenedor
 * en docker-compose y ya está arriba en runtime, así que aquí sí tiene
 * sentido consultarlo-. Se regenera con un pequeño cache en memoria para no
 * pegarle a Mongo en cada visita de un crawler.
 */
const SITE_URL = 'https://peajesmx.com';
const SITEMAP_CACHE_MS = 10 * 60 * 1000;
let sitemapCache: { xml: string; expiresAt: number } | null = null;

interface ContentListItem {
  slug: string;
  publishedDate: string;
  updatedDate?: string;
}

async function fetchPublished(kind: 'guides' | 'news'): Promise<ContentListItem[]> {
  const response = await fetch(`${environment.urlbackend}/api/ds/${kind}`);
  if (!response.ok) {
    throw new Error(`No se pudo obtener "${kind}" para el sitemap (HTTP ${response.status}).`);
  }
  const data = await response.json();
  return (kind === 'guides' ? data.guides : data.news) ?? [];
}

const urlEntry = (loc: string, lastmod: string, changefreq: string, priority: string) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

async function buildSitemap(): Promise<string> {
  const [guides, news] = await Promise.all([fetchPublished('guides'), fetchPublished('news')]);
  const today = new Date().toISOString().slice(0, 10);

  const entries = [
    urlEntry(`${SITE_URL}/`, today, 'weekly', '1.0'),
    urlEntry(`${SITE_URL}/calcular-mi-ruta/`, today, 'weekly', '0.9'),
    urlEntry(`${SITE_URL}/guias/`, today, 'weekly', '0.7'),
    ...guides.map((g) => urlEntry(`${SITE_URL}/guias/${g.slug}/`, g.updatedDate ?? g.publishedDate, 'monthly', '0.6')),
    urlEntry(`${SITE_URL}/noticias/`, today, 'weekly', '0.7'),
    ...news.map((n) => urlEntry(`${SITE_URL}/noticias/${n.slug}/`, n.updatedDate ?? n.publishedDate, 'monthly', '0.6')),
    urlEntry(`${SITE_URL}/servicios/`, today, 'monthly', '0.6'),
    urlEntry(`${SITE_URL}/sobre-nosotros/`, today, 'monthly', '0.5'),
    urlEntry(`${SITE_URL}/contacto/`, today, 'monthly', '0.5'),
    urlEntry(`${SITE_URL}/legales/`, today, 'yearly', '0.2'),
    urlEntry(`${SITE_URL}/privacidad/`, today, 'yearly', '0.2'),
  ];

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('\n') +
    '\n</urlset>\n'
  );
}

app.get('/sitemap.xml', async (req, res) => {
  try {
    if (!sitemapCache || sitemapCache.expiresAt < Date.now()) {
      const xml = await buildSitemap();
      sitemapCache = { xml, expiresAt: Date.now() + SITEMAP_CACHE_MS };
    }
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapCache.xml);
  } catch (error) {
    console.error('Error al generar sitemap.xml:', error);
    res.status(502).send('Error al generar sitemap.xml');
  }
});

/**
 * Sirve los archivos estáticos del build (JS/CSS con hash, y el HTML
 * prerenderizado de las rutas que siguen siendo RenderMode.Prerender). En
 * este contenedor no hay más nginx delante filtrando por extensión -eso
 * sigue pasando en el contenedor de nginx para el resto del sitio-, así que
 * esto solo recibe tráfico de /guias y /noticias que nginx le reenvía.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

// isMainModule evita que esto arranque un servidor real cuando el propio
// build de Angular importa este archivo para prerenderizar las rutas que
// siguen siendo RenderMode.Prerender (home, servicios, etc.) -solo debe
// escuchar cuando se ejecuta directamente como el proceso del contenedor SSR.
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`SSR de PeajesMX escuchando en el puerto ${port}`);
  });
}

export default createNodeRequestHandler(app);
