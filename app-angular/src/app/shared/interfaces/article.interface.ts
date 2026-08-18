export interface Article {
  /** Segmento de URL, ej. 'tipos-de-vehiculo-y-ejes-excedentes' -> /guias/tipos-de-vehiculo-y-ejes-excedentes */
  slug: string;
  title: string;
  /** Resumen corto usado en la tarjeta del listado y como meta description */
  description: string;
  /** Fecha ISO (YYYY-MM-DD) */
  publishedDate: string;
  updatedDate?: string;
  readingMinutes: number;
  /** HTML del cuerpo del artículo (contenido de confianza, escrito por el equipo, no entrada de usuarios) */
  contentHtml: string;
}
