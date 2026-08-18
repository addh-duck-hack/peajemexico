/**
 * Categorías temáticas de /guias. Se usan para agrupar/filtrar y para elegir
 * qué otras guías sugerir al final de un artículo (ver guide-detail.ts).
 * Agrega una nueva solo si de verdad agrupa varios artículos; si es la
 * primera de su tema, sigue sumando aquí antes de usarla en guides.data.ts.
 */
export type ArticleCategory =
  | 'Tarifas y cálculo'
  | 'Vehículos y ejes'
  | 'Rutas y carreteras'
  | 'Legal y datos oficiales'
  | 'Pagos y TAG';

export interface Article {
  /** Segmento de URL, ej. 'tipos-de-vehiculo-y-ejes-excedentes' -> /guias/tipos-de-vehiculo-y-ejes-excedentes */
  slug: string;
  title: string;
  /** Resumen corto usado en la tarjeta del listado y como meta description */
  description: string;
  category: ArticleCategory;
  /** Fecha ISO (YYYY-MM-DD) */
  publishedDate: string;
  updatedDate?: string;
  readingMinutes: number;
  /** URL absoluta para og:image / JSON-LD Article.image. Si se omite, se usa la imagen por defecto del sitio. */
  image?: string;
  /** HTML del cuerpo del artículo (contenido de confianza, escrito por el equipo, no entrada de usuarios) */
  contentHtml: string;
}
