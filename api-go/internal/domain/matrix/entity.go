package matrix

// Matrix representa una matriz rectangular de float64.
type Matrix [][]float64

// QRResult contiene las matrices Q y R resultantes de la descomposición A = Q·R.
type QRResult struct {
	Q Matrix `json:"Q"`
	R Matrix `json:"R"`
}

// DiagonalCheck indica si cada matriz es diagonal.
type DiagonalCheck struct {
	Q bool `json:"Q"`
	R bool `json:"R"`
}

// StatsResult contiene las estadísticas calculadas por la API Node.js.
type StatsResult struct {
	Max        float64       `json:"max"`
	Min        float64       `json:"min"`
	Average    float64       `json:"avg"`
	Sum        float64       `json:"sum"`
	IsDiagonal DiagonalCheck `json:"isDiagonal"`
}

// ProcessResponse es la respuesta final que devuelve la API Go al cliente.
// Stats es un puntero para que sea omitida cuando aún no se haya calculado.
type ProcessResponse struct {
	Original Matrix       `json:"original"`
	QR       QRResult     `json:"qr"`
	Stats    *StatsResult `json:"stats,omitempty"`
}
