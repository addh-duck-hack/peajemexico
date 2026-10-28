const express = require("express");
const router = express.Router();
const { tollCalculatorRateLimiter } = require("../middleware/rateLimitMiddleware");
const { sendError } = require("../utils/httpResponses");
const { postToInegi, sendInegiResponseError, sendInegiFailure } = require("../utils/inegi");

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
  try {
    const response = await postToInegi('/cuota', {
      key: process.env.INEGI_APIKEY,
      type: process.env.INEGI_TYPE_RESPONSE,
      proj: process.env.INEGI_PROJ_TYPE,
      dest_i: origin,
      dest_f: destination,
      v: vehicleType,
      e: over
    });

    if (!response.ok) {
      return sendInegiResponseError(res, response);
    }

    const data = await response.json();

    res.json({
      ok: true,
      message: 'Se realizo con exito la consulta al servicio del INEGI',
      inegi: data
    });
  } catch (error) {
    return sendInegiFailure(res, error);
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
  try {
    const response = await postToInegi('/detalle_c', {
      key: process.env.INEGI_APIKEY,
      type: process.env.INEGI_TYPE_RESPONSE,
      proj: process.env.INEGI_PROJ_TYPE,
      dest_i: origin,
      dest_f: destination,
      v: vehicleType,
      e: over
    });

    if (!response.ok) {
      return sendInegiResponseError(res, response);
    }

    const data = await response.json();

    res.json({
      ok: true,
      message: 'Se realizo con exito la consulta al servicio del INEGI',
      inegi: data
    });
  } catch (error) {
    return sendInegiFailure(res, error);
  }
});

module.exports = router;
