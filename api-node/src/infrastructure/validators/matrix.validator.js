const Joi = require('joi');

const matrixRowSchema = Joi.array()
  .items(Joi.number().required())
  .min(1)
  .required()
  .messages({
    'array.base': 'Cada fila debe ser un array de números',
    'array.min': 'Cada fila debe tener al menos un elemento',
    'any.required': 'Cada fila es obligatoria',
    'number.base': 'Los valores de la matriz deben ser números válidos (no NaN)',
    'number.infinity': 'Los valores de la matriz no pueden ser Infinity',
  });

const matrixSchema = Joi.array()
  .items(matrixRowSchema)
  .min(1)
  .required()
  .messages({
    'array.base': 'El valor debe ser una matriz (array de arrays)',
    'array.min': 'La matriz debe tener al menos una fila',
    'any.required': 'La matriz es obligatoria',
  });

// Schema de entrada para POST /api/stats.
// Requiere las matrices Q y R producidas por la factorización QR de la API Go.
const statsInputSchema = Joi.object({
  Q: matrixSchema.label('Q'),
  R: matrixSchema.label('R'),
})
  .required()
  .messages({
    'object.base': 'El cuerpo debe ser un objeto JSON con las matrices Q y R',
  });

module.exports = { statsInputSchema };
