const express = require("express");
const router = express.Router();
const { NewsArticle } = require("../models/news-article.model");
const { verifyToken, authorizeRoles, ROLES } = require("../middleware/authMiddleware");
const { createRateLimiter } = require("../middleware/rateLimitMiddleware");
const {
  validateObjectIdParam,
  validateCreateNewsPayload,
  validateUpdateNewsPayload,
} = require("../middleware/validationMiddleware");
const { sendError } = require("../utils/httpResponses");

// Lectura pública (sin sesión), limitada por IP. A diferencia de
// destination/route.cost (llamadas 1:1 con una acción del usuario), estos
// endpoints ahora los consulta también el contenedor SSR en cada visita a
// /guias o /noticias (ver app-angular/src/server.ts): todas esas peticiones
// salen con la misma IP del contenedor, así que el límite tiene que ser
// generoso para no bloquear tráfico real agregado de muchos visitantes.
const newsReadRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 300,
  code: "RATE_LIMIT_NEWS_EXCEEDED",
  message: "Demasiadas consultas de noticias. Intenta nuevamente más tarde.",
});

// GET /api/ds/news -> listado público. Excluye borradores por defecto (son
// contenido en revisión, no deben aparecer en /noticias ni en el sitemap
// todavía); ?includeDrafts=true los incluye (lo usa el build para
// prerenderizar también sus páginas, ver app.routes.server.ts).
router.get("/", newsReadRateLimiter, async (req, res) => {
  try {
    const filter = req.query.includeDrafts === "true" ? {} : { draft: { $ne: true } };
    const news = await NewsArticle.find(filter)
      .sort({ publishedDate: -1 })
      .select("-__v")
      .lean();
    return res.json({ ok: true, news });
  } catch (error) {
    console.error("Error al listar noticias:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Error interno al listar noticias");
  }
});

// GET /api/ds/news/:slug -> público, incluye borradores. Así el build puede
// prerenderizar/revisar una nota en borrador antes de publicarla (queda
// accesible por URL directa pero noindex).
router.get("/:slug", newsReadRateLimiter, async (req, res) => {
  try {
    const article = await NewsArticle.findOne({ slug: req.params.slug }).select("-__v").lean();
    if (!article) return sendError(res, 404, "NEWS_NOT_FOUND", "Noticia no encontrada");
    return res.json({ ok: true, article });
  } catch (error) {
    console.error("Error al obtener noticia:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Error interno al obtener la noticia");
  }
});

// --- Administración (solo super_admin) ---

router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.SUPER_ADMIN),
  validateCreateNewsPayload,
  async (req, res) => {
    try {
      const existing = await NewsArticle.findOne({ slug: req.body.slug });
      if (existing) return sendError(res, 409, "SLUG_ALREADY_EXISTS", "Ya existe una noticia con ese slug");
      const article = await NewsArticle.create(req.body);
      return res.status(201).json({ ok: true, article });
    } catch (error) {
      console.error("Error al crear noticia:", error);
      return sendError(res, 500, "INTERNAL_ERROR", "Error interno al crear la noticia");
    }
  }
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.SUPER_ADMIN),
  validateObjectIdParam("id"),
  validateUpdateNewsPayload,
  async (req, res) => {
    try {
      if (req.body.slug) {
        const existing = await NewsArticle.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
        if (existing) return sendError(res, 409, "SLUG_ALREADY_EXISTS", "Ya existe una noticia con ese slug");
      }
      const article = await NewsArticle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!article) return sendError(res, 404, "NEWS_NOT_FOUND", "Noticia no encontrada");
      return res.json({ ok: true, article });
    } catch (error) {
      console.error("Error al actualizar noticia:", error);
      return sendError(res, 500, "INTERNAL_ERROR", "Error interno al actualizar la noticia");
    }
  }
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.SUPER_ADMIN),
  validateObjectIdParam("id"),
  async (req, res) => {
    try {
      const article = await NewsArticle.findByIdAndDelete(req.params.id);
      if (!article) return sendError(res, 404, "NEWS_NOT_FOUND", "Noticia no encontrada");
      return res.json({ ok: true, message: "Noticia eliminada" });
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      return sendError(res, 500, "INTERNAL_ERROR", "Error interno al eliminar la noticia");
    }
  }
);

module.exports = router;
