const express = require("express");
const router = express.Router();
const { tollCalculatorRateLimiter } = require("../middleware/rateLimitMiddleware");
const { sendError } = require("../utils/httpResponses");
const { postToInegi, sendInegiResponseError, sendInegiFailure } = require("../utils/inegi");

// Endpoint público para buscar destinos (limitado por IP, ver rateLimitMiddleware)
router.get('/:search', tollCalculatorRateLimiter, async (req, res) => {
  const { search } = req.params;

  // Validar que el texto de búsqueda se reciba
  if (!search || search.trim() === '') {
    return sendError(res, 400, 'MISSING_SEARCH_TEXT', 'El texto de búsqueda es requerido');
  }

  // Consumo al api del INEGI
  try {
    const response = await postToInegi('/buscadestino', {
      key: process.env.INEGI_APIKEY,
      type: process.env.INEGI_TYPE_RESPONSE,
      num: process.env.INEGI_NUM_RESULTS,
      proj: process.env.INEGI_PROJ_TYPE,
      buscar: search.trim()
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
