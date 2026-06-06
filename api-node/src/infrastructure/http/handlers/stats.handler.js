const StatsUseCase = require('../../../application/stats/usecase');

class StatsHandler {
  #useCase;

  constructor() {
    this.#useCase = new StatsUseCase();
  }

  /**
   * POST /api/stats
   * Recibe matrices Q y R (ya validadas por el middleware),
   * calcula estadísticas y las retorna.
   */
  compute(req, res, next) {
    try {
      const { Q, R } = req.body;
      const stats = this.#useCase.execute({ Q, R });
      res.status(200).json({ stats });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StatsHandler;
