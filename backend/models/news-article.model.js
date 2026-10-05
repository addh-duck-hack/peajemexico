const mongoose = require("mongoose");

const newsArticleSchema = new mongoose.Schema(
  {
    // Segmento de URL -> /noticias/:slug
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    // Quien escribió la nota (schema.org NewsArticle.author, tipo Person)
    author: { type: String, required: true, trim: true },
    // Medio colaborador y liga a la publicación original (schema.org isBasedOn)
    sourceName: { type: String, required: true, trim: true },
    sourceUrl: { type: String, required: true, trim: true },
    // Fecha ISO (YYYY-MM-DD)
    publishedDate: { type: String, required: true },
    updatedDate: { type: String },
    // A diferencia de Guide, la imagen es obligatoria (requisito del formato de noticia)
    image: { type: String, required: true, trim: true },
    readingMinutes: { type: Number, required: true, min: 1 },
    contentHtml: { type: String, required: true },
    // Excluye la nota del listado público/sitemap/ItemList mientras se revisa;
    // el detalle sigue siendo accesible por slug directo con noindex.
    draft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NewsArticle = mongoose.model("NewsArticle", newsArticleSchema);

module.exports = { NewsArticle };
