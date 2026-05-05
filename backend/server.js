const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const { sendError } = require("./utils/httpResponses");
const { resolveUploadsDir } = require("./utils/uploads");
const { validateJwtEnvConfig } = require("./utils/jwt");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.json());

const PORT = process.env.PORT || 5000;
validateJwtEnvConfig();
const mongoGlobalUrl = (process.env.MONGO_URL_GLOBAL || "").trim();
if (!mongoGlobalUrl) {
  throw new Error("MONGO_URL_GLOBAL es obligatorio y no puede estar vacío.");
}

const configuredCorsOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (configuredCorsOrigins.length === 0) {
  throw new Error("CORS_ALLOWED_ORIGINS es obligatorio y no puede estar vacío.");
}

const allowedCorsOrigins = new Set(configuredCorsOrigins);

// Orígenes permitidos para desarrollo local
const localDevOrigins = new Set([
  'http://localhost:4200',
  'http://localhost:4201',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:4201',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
]);

const corsOptions = {
  origin: (origin, callback) => {
    // Permite herramientas sin origen (curl/postman/server-to-server) solo si CORS_ALLOW_LOCAL_DEV está en true
    if (!origin) {
      return process.env.CORS_ALLOW_LOCAL_DEV === 'true' ? callback(null, true) : callback(new Error("CORS_ORIGIN_NOT_ALLOWED"));
    }

    // Si está habilitado el modo desarrollo local
    if (process.env.CORS_ALLOW_LOCAL_DEV === 'true' && localDevOrigins.has(origin)) {
      return callback(null, true);
    }

    // Verificar orígenes configurados en producción
    if (allowedCorsOrigins.has(origin)) return callback(null, true);

    return callback(new Error("CORS_ORIGIN_NOT_ALLOWED"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// Conectar a MongoDB global (Modelo B)
mongoose.connect(mongoGlobalUrl)
  .then(() => console.log("Conectado a MongoDB global"))
  .catch((err) => console.error("Error al conectar a MongoDB global", err));

// Importar y usar rutas
//const userRoutes = require("./routes/user.routes");
const mailRoutes = require("./routes/mail.routes");
//const uploadRoutes = require("./routes/upload.routes");
const destinationRoutes = require("./routes/destination.routes")
const routeCostRoutes = require("./routes/route.cost.routes")

app.use(cors(corsOptions));
app.use(
  helmet({
    // API-only backend: CSP se gestiona en frontends.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: process.env.NODE_ENV === "production",
  })
);
//app.use("/api/ds/users", userRoutes);
app.use("/api/ds/mail", mailRoutes);
//app.use("/api/ds/uploads", uploadRoutes);
app.use("/api/ds/destination",destinationRoutes)
app.use("/api/ds/route/cost", routeCostRoutes)

// Servir la carpeta uploads como estática
// const uploadsDir = resolveUploadsDir();
// if (!uploadsDir) {
//   throw new Error("No hay un directorio de uploads con permisos de escritura.");
// }
// app.use('/api/ds/uploads', express.static(uploadsDir));

app.use((err, req, res, next) => {
  if (err?.message === "CORS_ORIGIN_NOT_ALLOWED") {
    return sendError(res, 403, "CORS_ORIGIN_NOT_ALLOWED", "Origen no permitido por la política CORS.");
  }
  return next(err);
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  return sendError(res, 500, "INTERNAL_SERVER_ERROR", "Error interno del servidor");
});

app.use((req, res) => {
  return sendError(res, 404, "ROUTE_NOT_FOUND", "Ruta no encontrada");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
