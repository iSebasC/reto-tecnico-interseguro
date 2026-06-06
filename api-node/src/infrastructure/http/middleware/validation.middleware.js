const { statsInputSchema } = require('../../validators/matrix.validator');

/**
 * Valida el body de POST /api/stats con el schema Joi.
 * Si la validación falla retorna 400 con todos los errores encontrados.
 * Si pasa, sobreescribe req.body con el valor sanitizado por Joi.
 */
function validateStatsInput(req, res, next) {
  const { error, value } = statsInputSchema.validate(req.body, {
    abortEarly: false, // reportar todos los errores, no solo el primero
    convert: true,     // coercionar strings numéricos a number si vienen así
  });

  if (error) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: error.details.map((d) => d.message),
    });
  }

  req.body = value;
  next();
}

module.exports = { validateStatsInput };
