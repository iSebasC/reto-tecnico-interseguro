package matrix

import domainMatrix "interseguro/api-go/internal/domain/matrix"

// UseCase orquesta el flujo completo:
// 1. Factorización QR sobre la matriz de entrada (dominio)
// 2. Envío de Q y R a la API Node.js para calcular estadísticas (vía StatsPort)
// 3. Respuesta agregada { original, qr, stats } al cliente
type UseCase struct {
	service     *domainMatrix.Service
	statsClient StatsPort
}

func NewUseCase(service *domainMatrix.Service, statsClient StatsPort) *UseCase {
	return &UseCase{
		service:     service,
		statsClient: statsClient,
	}
}

// Process ejecuta la factorización QR y obtiene las estadísticas de la API Node.js.
func (uc *UseCase) Process(matrix domainMatrix.Matrix) (*domainMatrix.ProcessResponse, error) {
	qr, err := uc.service.Factorize(matrix)
	if err != nil {
		return nil, err
	}

	stats, err := uc.statsClient.GetStats(qr.Q, qr.R)
	if err != nil {
		return nil, err
	}

	return &domainMatrix.ProcessResponse{
		Original: matrix,
		QR:       *qr,
		Stats:    stats,
	}, nil
}
