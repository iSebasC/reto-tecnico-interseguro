package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	domainMatrix "interseguro/api-go/internal/domain/matrix"
	"interseguro/api-go/internal/shared/apperrors"
)

// StatsClient gestiona las llamadas HTTP hacia la API Node.js.
// Implementa la interfaz StatsPort definida en la capa de aplicación.
type StatsClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewStatsClient(baseURL string) *StatsClient {
	return &StatsClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

// statsRequest es el payload que se envía a POST /api/stats de Node.js.
type statsRequest struct {
	Q domainMatrix.Matrix `json:"Q"`
	R domainMatrix.Matrix `json:"R"`
}

// statsResponse mapea la respuesta de Node.js: { "stats": { ... } }
type statsResponse struct {
	Stats domainMatrix.StatsResult `json:"stats"`
}

// GetStats envía las matrices Q y R a la API Node.js y retorna las estadísticas.
// Retorna apperrors.Gateway (502) si la comunicación falla o la respuesta es inválida.
func (c *StatsClient) GetStats(Q, R domainMatrix.Matrix) (*domainMatrix.StatsResult, error) {
	payload, err := json.Marshal(statsRequest{Q: Q, R: R})
	if err != nil {
		return nil, apperrors.Gateway("error al serializar las matrices")
	}

	resp, err := c.httpClient.Post(
		c.baseURL+"/api/stats",
		"application/json",
		bytes.NewBuffer(payload),
	)
	if err != nil {
		return nil, apperrors.Gateway(
			fmt.Sprintf("la API de estadísticas no está disponible: %v", err),
		)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, apperrors.Gateway(
			fmt.Sprintf("la API de estadísticas retornó HTTP %d", resp.StatusCode),
		)
	}

	var result statsResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, apperrors.Gateway("respuesta inválida de la API de estadísticas")
	}

	return &result.Stats, nil
}
