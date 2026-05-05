const express = require("express");
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { sendError } = require("../utils/httpResponses");

// Endpoint para buscar destinos
router.get('/:search', verifyToken, async (req, res) => {
  const { search } = req.params;

  // Validar que el texto de búsqueda se reciba
  if (!search || search.trim() === '') {
    return sendError(res, 400, 'MISSING_SEARCH_TEXT', 'El texto de búsqueda es requerido');
  }

  // Consumo al api del INEGI
  const urlFinal = process.env.INEGI_URL_API + "/buscadestino";
  try {
    const response = await fetch(urlFinal, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: process.env.INEGI_APIKEY,
        type: process.env.INEGI_TYPE_RESPONSE,
        num: process.env.INEGI_NUM_RESULTS,
        proj: process.env.INEGI_PROJ_TYPE,
        buscar: search.trim()
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
