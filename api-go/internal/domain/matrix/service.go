package matrix

import (
	"errors"
	"fmt"
	"math"

	"gonum.org/v1/gonum/mat"
)

// Service contiene la lógica de dominio pura para operaciones sobre matrices.
type Service struct{}

func NewService() *Service {
	return &Service{}
}

// Factorize realiza la descomposición QR de la matriz usando el algoritmo de Householder (Gonum).
// Requiere que filas >= columnas (requisito matemático de la factorización QR estándar).
// Retorna Q (m×m ortogonal) y R (m×n triangular superior).
func (s *Service) Factorize(m Matrix) (*QRResult, error) {
	if err := validateMatrix(m); err != nil {
		return nil, err
	}

	rows := len(m)
	cols := len(m[0])

	// Aplanar la matriz a un slice row-major para Gonum
	data := make([]float64, rows*cols)
	for i, row := range m {
		for j, v := range row {
			data[i*cols+j] = v
		}
	}

	A := mat.NewDense(rows, cols, data)

	var qr mat.QR
	qr.Factorize(A)

	var Q, R mat.Dense
	qr.QTo(&Q)
	qr.RTo(&R)

	return &QRResult{
		Q: denseToMatrix(&Q),
		R: denseToMatrix(&R),
	}, nil
}

// validateMatrix verifica las precondiciones de la factorización QR.
func validateMatrix(m Matrix) error {
	if len(m) == 0 {
		return errors.New("la matriz no puede estar vacía")
	}

	cols := len(m[0])
	if cols == 0 {
		return errors.New("las filas de la matriz no pueden estar vacías")
	}

	for i, row := range m {
		if len(row) != cols {
			return fmt.Errorf("fila %d tiene %d columnas, se esperaban %d", i, len(row), cols)
		}
		for j, v := range row {
			if math.IsNaN(v) {
				return fmt.Errorf("valor inválido en [%d][%d]: NaN no está permitido", i, j)
			}
			if math.IsInf(v, 0) {
				return fmt.Errorf("valor inválido en [%d][%d]: Infinity no está permitido", i, j)
			}
		}
	}

	// La factorización QR estándar (Householder) requiere m >= n
	if len(m) < cols {
		return fmt.Errorf(
			"la factorización QR requiere filas (%d) >= columnas (%d); use una matriz alta o cuadrada",
			len(m), cols,
		)
	}

	return nil
}

// denseToMatrix convierte un mat.Dense de Gonum a Matrix ([][]float64).
// Los valores se redondean a 10 decimales para eliminar ruido de punto flotante
// producido por las operaciones de álgebra lineal internas.
func denseToMatrix(d *mat.Dense) Matrix {
	rows, cols := d.Dims()
	m := make(Matrix, rows)
	for i := range m {
		m[i] = make([]float64, cols)
		for j := range m[i] {
			m[i][j] = roundFloat(d.At(i, j), 10)
		}
	}
	return m
}

func roundFloat(v float64, decimals int) float64 {
	pow := math.Pow10(decimals)
	return math.Round(v*pow) / pow
}
