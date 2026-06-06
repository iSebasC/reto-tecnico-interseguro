const StatsService = require('../../domain/stats/service');

class StatsUseCase {
  #service;

  constructor() {
    this.#service = new StatsService();
  }

  /**
   * Orquesta el cálculo de estadísticas sobre las matrices Q y R.
   *
   * @param {{ Q: number[][], R: number[][] }} input
   * @returns {{ max, min, sum, avg, isDiagonal }}
   */
  execute({ Q, R }) {
    return this.#service.compute(Q, R);
  }
}

module.exports = StatsUseCase;
