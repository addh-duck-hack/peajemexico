const mongoose = require("mongoose");

// Mismas categorías que ArticleCategory en el frontend
// (app-angular/src/app/shared/interfaces/article.interface.ts). Si agregas una
// categoría nueva, actualiza también ese archivo para que el <select> del
// futuro panel admin y este enum no se desincronicen.
const ARTICLE_CATEGORIES = [
  "Tarifas y cálculo",
  "Vehículos y ejes",
  "Rutas y carreteras",
  "Legal y datos oficiales",
  "Pagos y TAG",
];

const guideSchema = new mongoose.Schema(
  {
    // Segmento de URL, ej. 'tipos-de-vehiculo-y-ejes-excedentes' -> /guias/tipos-de-vehiculo-y-ejes-excedentes
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    // Resumen corto usado en la tarjeta del listado y como meta description
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ARTICLE_CATEGORIES },
    // Fecha ISO (YYYY-MM-DD), igual que en article.interface.ts
    publishedDate: { type: String, required: true },
    updatedDate: { type: String },
    readingMinutes: { type: Number, required: true, min: 1 },
    // URL/ruta para og:image / JSON-LD Article.image
    image: { type: String, trim: true },
    // HTML del cuerpo (contenido de confianza del equipo, no entrada de usuarios)
    contentHtml: { type: String, required: true },
    // Permite guardar una guía sin publicarla todavía: se excluye del listado
    // público y del sitemap hasta que se quite esta bandera (mismo patrón que news-article.model.js).
    draft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Guide = mongoose.model("Guide", guideSchema);

module.exports = { Guide, ARTICLE_CATEGORIES };
