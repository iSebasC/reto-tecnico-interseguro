package matrix

import domainMatrix "interseguro/api-go/internal/domain/matrix"

// StatsPort define el contrato para obtener estadísticas sobre las matrices Q y R.
// El UseCase depende de esta interfaz, no de la implementación HTTP concreta,
// lo que mantiene la capa de aplicación desacoplada de la infraestructura.
type StatsPort interface {
	GetStats(Q, R domainMatrix.Matrix) (*domainMatrix.StatsResult, error)
}
