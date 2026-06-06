// Umbral para considerar un valor como cero en la verificación diagonal.
// Necesario porque Go entrega valores con redondeo de 10 decimales.
const EPSILON = 1e-9;

class StatsService {
  /**
   * Calcula estadísticas sobre las matrices Q y R combinadas.
   * El máximo, mínimo, suma y promedio se calculan sobre todos los valores de ambas matrices.
   * La verificación diagonal se realiza de forma independiente sobre cada una.
   *
   * @param {number[][]} Q - Matriz ortogonal resultado de la factorización QR
   * @param {number[][]} R - Matriz triangular superior resultado de la factorización QR
   * @returns {{ max, min, sum, avg, isDiagonal }}
   */
  compute(Q, R) {
    this.#assertRectangular('Q', Q);
    this.#assertRectangular('R', R);

    const allValues = [...Q.flat(), ...R.flat()];

    if (allValues.length === 0) {
      throw new Error('Las matrices no contienen valores');
    }

    const total = allValues.reduce((acc, v) => acc + v, 0);

    return {
      max: allValues.reduce((m, v) => Math.max(m, v), -Infinity),
      min: allValues.reduce((m, v) => Math.min(m, v), Infinity),
      sum: this.#round(total),
      avg: this.#round(total / allValues.length),
      isDiagonal: {
        Q: this.#isDiagonal(Q),
        R: this.#isDiagonal(R),
      },
    };
  }

  // Verifica que todas las filas tengan el mismo número de columnas.
  #assertRectangular(name, matrix) {
    const cols = matrix[0]?.length ?? 0;
    for (let i = 1; i < matrix.length; i++) {
      if (matrix[i].length !== cols) {
        const err = new Error(
          `La matriz ${name} no es rectangular: fila ${i} tiene ${matrix[i].length} columnas, se esperaban ${cols}`
        );
        err.status = 422;
        throw err;
      }
    }
  }

  // Una matriz es diagonal si es cuadrada y todos sus elementos fuera de la
  // diagonal principal son cero (tolerando ruido de punto flotante con EPSILON).
  #isDiagonal(matrix) {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;

    if (rows !== cols) return false;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (i !== j && Math.abs(matrix[i][j]) > EPSILON) return false;
      }
    }
    return true;
  }

  #round(value) {
    return Math.round(value * 1e10) / 1e10;
  }
}

module.exports = StatsService;
