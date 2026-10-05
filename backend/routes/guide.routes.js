const express = require("express");
const router = express.Router();
const { Guide } = require("../models/guide.model");
const { verifyToken, authorizeRoles, ROLES } = require("../middleware/authMiddleware");
const { createRateLimiter } = require("../middleware/rateLimitMiddleware");
const {
  validateObjectIdParam,
  validateCreateGuidePayload,
  validateUpdateGuidePayload,
} = require("../middleware/validationMiddleware");
const { sendError } = require("../utils/httpResponses");

// Lectura pública (sin sesión), limitada por IP. A diferencia de
// destination/route.cost (llamadas 1:1 con una acción del usuario), estos
// endpoints ahora los consulta también el contenedor SSR en cada visita a
// /guias o /noticias (ver app-angular/src/server.ts): todas esas peticiones
// salen con la misma IP del contenedor, así que el límite tiene que ser
// generoso para no bloquear tráfico real agregado de muchos visitantes.
const guidesReadRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 300,
  code: "RATE_LIMIT_GUIDES_EXCEEDED",
  message: "Demasiadas consultas de guías. Intenta nuevamente más tarde.",
});

// GET /api/ds/guides -> listado público. Excluye borradores por defecto (son
// contenido en revisión, no deben aparecer en /guias ni en el sitemap
// todavía); ?includeDrafts=true los incluye. Los borradores no son
// información sensible (su detalle ya es accesible por slug directo, ver
// abajo), así que exponer su existencia en el listado no agrega un riesgo
// nuevo, y es lo que necesita el build para prerenderizar sus páginas.
router.get("/", guidesReadRateLimiter, async (req, res) => {
  try {
    const filter = req.query.includeDrafts === "true" ? {} : { draft: { $ne: true } };
    const guides = await Guide.find(filter)
      .sort({ publishedDate: -1 })
      .select("-__v")
      .lean();
    return res.json({ ok: true, guides });
  } catch (error) {
    console.error("Error al listar guías:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Error interno al listar guías");
  }
});

// GET /api/ds/guides/:slug -> público, incluye borradores. Así el build puede
// prerenderizar/revisar una guía en borrador antes de publicarla (queda
// accesible por URL directa pero noindex, igual que hoy con noticias).
router.get("/:slug", guidesReadRateLimiter, async (req, res) => {
  try {
    const guide = await Guide.findOne({ slug: req.params.slug }).select("-__v").lean();
    if (!guide) return sendError(res, 404, "GUIDE_NOT_FOUND", "Guía no encontrada");
    return res.json({ ok: true, guide });
  } catch (error) {
    console.error("Error al obtener guía:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Error interno al obtener la guía");
  }
});

// --- Administración (solo super_admin) ---

router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.SUPER_ADMIN),
  validateCreateGuidePayload,
  async (req, res) => {
    try {
      const existing = await Guide.findOne({ slug: req.body.slug });
      if (existing) return sendError(res, 409, "SLUG_ALREADY_EXISTS", "Ya existe una guía con ese slug");
      const guide = await Guide.create(req.body);
      return res.status(201).json({ ok: true, guide });
    } catch (error) {
      console.error("Error al crear guía:", error);
      return sendError(res, 500, "INTERNAL_ERROR", "Error interno al crear la guía");
    }
  }
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.SUPER_ADMIN),
  validateObjectIdParam("id"),
  validateUpdateGuidePayload,
  async (req, res) => {
    try {
      if (req.body.slug) {
        const existing = await Guide.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
        if (existing) return sendError(res, 409, "SLUG_ALREADY_EXISTS", "Ya existe una guía con ese slug");
      }
      const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!guide) return sendError(res, 404, "GUIDE_NOT_FOUND", "Guía no encontrada");
      return res.json({ ok: true, guide });
    } catch (error) {
      console.error("Error al actualizar guía:", error);
      return sendError(res, 500, "INTERNAL_ERROR", "Error interno al actualizar la guía");
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
      const guide = await Guide.findByIdAndDelete(req.params.id);
      if (!guide) return sendError(res, 404, "GUIDE_NOT_FOUND", "Guía no encontrada");
      return res.json({ ok: true, message: "Guía eliminada" });
    } catch (error) {
      console.error("Error al eliminar guía:", error);
      return sendError(res, 500, "INTERNAL_ERROR", "Error interno al eliminar la guía");
    }
  }
);

module.exports = router;
