/**
 * Categorías temáticas de /guias. Se usan para agrupar/filtrar y para elegir
 * qué otras guías sugerir al final de un artículo (ver guide-detail.ts).
 * Agrega una nueva solo si de verdad agrupa varios artículos; si es la
 * primera de su tema, actualiza también ARTICLE_CATEGORIES en
 * backend/models/guide.model.js para que el backend acepte la categoría nueva.
 */
export type ArticleCategory =
  | 'Tarifas y cálculo'
  | 'Vehículos y ejes'
  | 'Rutas y carreteras'
  | 'Legal y datos oficiales'
  | 'Pagos y TAG';

/** Mismos valores que ArticleCategory, en arreglo -para el <select> del formulario en /admin-. */
export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Tarifas y cálculo',
  'Vehículos y ejes',
  'Rutas y carreteras',
  'Legal y datos oficiales',
  'Pagos y TAG',
];

export interface Article {
  /** Id de Mongo, lo usa el panel /admin para editar/borrar (no se expone en las páginas públicas). */
  _id: string;
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
  /**
   * Marca contenido en revisión: se excluye del listado público, de
   * sitemap.xml y del ItemList de datos estructurados, y su propia página se
   * marca noindex. Quita esta bandera cuando la guía esté lista para publicarse.
   */
  draft?: boolean;
}
