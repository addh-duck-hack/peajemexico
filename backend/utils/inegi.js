const { sendError } = require("./httpResponses");

// Tiempo máximo de espera para las peticiones al INEGI (configurable vía INEGI_TIMEOUT_MS)
const INEGI_TIMEOUT_MS = Number(process.env.INEGI_TIMEOUT_MS) || 15000;

// Realiza un POST x-www-form-urlencoded al endpoint indicado del API del INEGI
const postToInegi = (endpoint, params) => {
  return fetch(process.env.INEGI_URL_API + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(INEGI_TIMEOUT_MS),
  });
};

// Respuesta cuando el INEGI responde pero con un estatus de error
const sendInegiResponseError = (res, response) => {
  console.error(`El API del INEGI respondió con estatus ${response.status}`);
  return sendError(res, 502, 'INEGI_API_ERROR', 'El servicio del INEGI respondió con un error, intenta más tarde', {
    inegiStatus: response.status,
  });
};

// Respuesta cuando no se pudo completar la petición al INEGI (timeout, conexión cerrada, JSON inválido)
const sendInegiFailure = (res, error) => {
  console.error('Error en la petición a INEGI:', error);

  if (error.name === 'TimeoutError') {
    return sendError(res, 504, 'INEGI_TIMEOUT', 'El servicio del INEGI tardó demasiado en responder, intenta más tarde');
  }
  if (error instanceof SyntaxError) {
    return sendError(res, 502, 'INEGI_INVALID_RESPONSE', 'El servicio del INEGI devolvió una respuesta inválida, intenta más tarde');
  }
  return sendError(res, 503, 'INEGI_UNAVAILABLE', 'El servicio del INEGI no está disponible en este momento, intenta más tarde');
};

module.exports = {
  postToInegi,
  sendInegiResponseError,
  sendInegiFailure,
};
