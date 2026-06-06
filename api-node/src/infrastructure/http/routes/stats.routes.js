const { Router } = require('express');
const StatsHandler = require('../handlers/stats.handler');
const { validateStatsInput } = require('../middleware/validation.middleware');

const router = Router();
const handler = new StatsHandler();

// POST /api/stats
// 1. validateStatsInput — valida Q y R con Joi antes de llegar al handler
// 2. handler.compute   — calcula y retorna las estadísticas
router.post('/stats', validateStatsInput, (req, res, next) =>
  handler.compute(req, res, next)
);

module.exports = router;
