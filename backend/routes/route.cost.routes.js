const express = require("express");
const router = express.Router();
const { tollCalculatorRateLimiter } = require("../middleware/rateLimitMiddleware");
const { sendError } = require("../utils/httpResponses");

// Endpoint público para calcular el costo de una ruta (limitado por IP, ver rateLimitMiddleware)
router.post('/calculate', tollCalculatorRateLimiter, async (req, res) => {
  const { origin, destination, vehicleType, over } = req.body;

  // Validar que todos los datos existan sino se regresa error indicando el error
  if (!origin || origin.trim() === '') {
    return sendError(res, 400, 'MISSING_PARAMETER_TEXT', 'No se capturo origen válido');
  }
  if (!destination || destination.trim() === '') {
    return sendError(res, 400, 'MISSING_PARAMETER_TEXT', 'No se capturo destino válido');
  }
  if (!vehicleType || vehicleType.trim() === '') {
    return sendError(res, 400, 'MISSING_PARAMETER_TEXT', 'No se capturo tipo de vehículo válido');
  }

  // Consumo al api del INEGI
  const urlFinal = process.env.INEGI_URL_API + "/cuota";
  try {
    const response = await fetch(urlFinal, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: process.env.INEGI_APIKEY,
        type: process.env.INEGI_TYPE_RESPONSE,
        proj: process.env.INEGI_PROJ_TYPE,
        dest_i: origin,
        dest_f: destination,
        v: vehicleType,
        e: over
      }),
    });

    if (!response.ok) {
      return sendError(res, response.status, 'INEGI_API_ERROR', 'Error al consultar la API del INEGI');
    }

    const data = await response.json();

    res.json({
      ok: true,
      message: 'Se realizo con exito la consulta al servicio del INEGI',
      inegi: data
    });
  } catch (error) {
    console.error('Error en la petición a INEGI:', error);
    return sendError(res, 500, 'INTERNAL_ERROR', 'Error interno al procesar la búsqueda');
  }
});

// Endpoint público para el desglose de costo por caseta (limitado por IP, ver rateLimitMiddleware)
router.post('/details', tollCalculatorRateLimiter, async (req, res) => {
  const { origin, destination, vehicleType, over } = req.body;

  // Validar que todos los datos existan sino se regresa error indicando el error
  if (!origin || origin.trim() === '') {
    return sendError(res, 400, 'MISSING_PARAMETER_TEXT', 'No se capturo origen válido');
  }
  if (!destination || destination.trim() === '') {
    return sendError(res, 400, 'MISSING_PARAMETER_TEXT', 'No se capturo destino válido');
  }
  if (!vehicleType || vehicleType.trim() === '') {
    return sendError(res, 400, 'MISSING_PARAMETER_TEXT', 'No se capturo tipo de vehículo válido');
  }

  // Consumo al api del INEGI
  const urlFinal = process.env.INEGI_URL_API + "/detalle_c";
  try {
    const response = await fetch(urlFinal, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: process.env.INEGI_APIKEY,
        type: process.env.INEGI_TYPE_RESPONSE,
        proj: process.env.INEGI_PROJ_TYPE,
        dest_i: origin,
        dest_f: destination,
        v: vehicleType,
        e: over
      }),
    });

    if (!response.ok) {
      return sendError(res, response.status, 'INEGI_API_ERROR', 'Error al consultar la API del INEGI');
    }

    const data = await response.json();

    res.json({
      ok: true,
      message: 'Se realizo con exito la consulta al servicio del INEGI',
      inegi: data
    });
  } catch (error) {
    console.error('Error en la petición a INEGI:', error);
    return sendError(res, 500, 'INTERNAL_ERROR', 'Error interno al procesar la búsqueda');
  }
});

module.exports = router;
