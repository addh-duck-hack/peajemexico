/**
 * Nota de la sección /noticias: a diferencia de /guias (contenido propio del
 * equipo), este contenido lo aporta un medio colaborador externo, así que
 * cada nota necesita su propia atribución de autoría y de fuente.
 */
export interface NewsArticle {
  /** Id de Mongo, lo usa el panel /admin para editar/borrar (no se expone en las páginas públicas). */
  _id: string;
  /** Segmento de URL, ej. 'nota-de-ejemplo' -> /noticias/nota-de-ejemplo */
  slug: string;
  title: string;
  /** Resumen corto usado en la tarjeta del listado y como meta description */
  description: string;
  /** Persona o redacción que firma la nota (puede ser del medio colaborador, no de PeajesMX) */
  author: string;
  /** Nombre del medio de noticias colaborador que originó la nota */
  sourceName: string;
  /** URL a la publicación original en el sitio del colaborador */
  sourceUrl: string;
  /** Fecha ISO (YYYY-MM-DD) */
  publishedDate: string;
  updatedDate?: string;
  /** URL absoluta o relativa a la imagen destacada de la nota (obligatoria: toda nota lleva imagen) */
  image: string;
  readingMinutes: number;
  /** HTML del cuerpo de la nota, provisto por el colaborador */
  contentHtml: string;
  /**
   * Marca contenido de prueba/placeholder: se excluye de sitemap.xml, del
   * ItemList de datos estructurados del listado, y su propia página se marca
   * noindex. Quita esta bandera cuando la nota sea real y esté lista para
   * publicarse (o borra la nota de ejemplo directamente).
   */
  draft?: boolean;
}
