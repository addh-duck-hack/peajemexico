import { NewsArticle } from 'src/app/shared/interfaces/news-article.interface';

/**
 * Contenido de /noticias: notas publicadas en colaboración con medios de
 * noticias externos (a diferencia de /guias, que es contenido propio del
 * equipo de PeajesMX). Cada nota debe traer su atribución completa: quién la
 * escribió y en colaboración con qué medio, con enlace a la publicación
 * original.
 *
 * Checklist al agregar una nota real:
 * - `slug` único, sin acentos.
 * - `author` y `sourceName` reales, `sourceUrl` apuntando a la publicación original.
 * - `image` con una URL válida (propia o provista por el colaborador con permiso de uso).
 * - Sin la bandera `draft` (o quitarla) para que la nota se indexe y aparezca en sitemap.xml.
 * - Agregar la URL a public/sitemap.xml con <lastmod> = publishedDate.
 */
export const NEWS: NewsArticle[] = [
  {
    slug: 'nota-de-ejemplo-seccion-noticias',
    title: '[Nota de ejemplo] Así se verán las noticias en colaboración con otros medios',
    description:
      'Nota de prueba para validar el diseño de la nueva sección de Noticias de PeajesMX antes de publicar contenido real de un medio colaborador.',
    author: 'Redacción de prueba',
    sourceName: 'Medio Colaborador de Ejemplo',
    sourceUrl: 'https://www.example.com/nota-original-de-ejemplo',
    publishedDate: '2026-08-19',
    image: 'images/cta-mountain-road.jpg',
    readingMinutes: 2,
    draft: true,
    contentHtml: `
      <p>
        Esta nota es un <strong>artículo de ejemplo</strong>, no contenido real. Se usa para revisar
        cómo se ve una nota en la nueva sección de Noticias antes de publicar la primera colaboración
        real con un medio externo.
      </p>

      <h2>¿En qué se diferencia de las Guías?</h2>
      <p>
        Las guías (<a href="/guias">/guias</a>) son artículos escritos por el equipo de PeajesMX.
        Las noticias, en cambio, son notas escritas y firmadas por medios colaboradores externos:
        cada nota muestra quién la redactó y un enlace a la publicación original en el sitio del
        colaborador, como el que aparece al final de esta nota.
      </p>

      <h2>Qué debe traer cada nota real</h2>
      <ul>
        <li>Un título y un resumen claros.</li>
        <li>Fecha de publicación.</li>
        <li>Una imagen destacada.</li>
        <li>El nombre de quien la escribió.</li>
        <li>Un enlace a la nota original en el sitio del medio colaborador.</li>
      </ul>

      <h2>Créditos de esta nota de ejemplo</h2>
      <p>
        Nota de prueba escrita por <strong>Redacción de prueba</strong>, publicada en colaboración
        de ejemplo con <a href="https://www.example.com/nota-original-de-ejemplo" target="_blank" rel="noreferrer">Medio Colaborador de Ejemplo</a>.
        Reemplaza estos datos por los de una colaboración real antes de publicar.
      </p>
    `,
  },
];
