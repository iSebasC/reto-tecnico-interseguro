package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	appMatrix "interseguro/api-go/internal/application/matrix"
	domainMatrix "interseguro/api-go/internal/domain/matrix"
	"interseguro/api-go/internal/shared/apperrors"
)

// MatrixHandler gestiona las peticiones HTTP del endpoint /api/matrix.
type MatrixHandler struct {
	useCase *appMatrix.UseCase
}

func NewMatrixHandler(useCase *appMatrix.UseCase) *MatrixHandler {
	return &MatrixHandler{useCase: useCase}
}

// matrixRequest es el DTO de entrada del endpoint POST /api/matrix.
type matrixRequest struct {
	Matrix domainMatrix.Matrix `json:"matrix"`
}

// Process recibe una matriz rectangular, ejecuta la factorización QR,
// obtiene estadísticas de la API Node.js y retorna la respuesta completa.
//
// POST /api/matrix
// Body:    { "matrix": [[1,2],[3,4],[5,6]] }
// Success: 200 { original, qr: { Q, R }, stats: { max, min, sum, avg, isDiagonal } }
// Errors:  400 (body inválido), 422 (validación de negocio), 502 (Node.js no disponible)
func (h *MatrixHandler) Process(c *fiber.Ctx) error {
	if len(c.Body()) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "el cuerpo de la solicitud está vacío",
		})
	}

	var req matrixRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "JSON inválido: " + err.Error(),
		})
	}

	if req.Matrix == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "el campo 'matrix' es obligatorio",
		})
	}

	result, err := h.useCase.Process(req.Matrix)
	if err != nil {
		// Error de infraestructura (ej: Node.js no responde) → 502
		var httpErr *apperrors.HTTPError
		if errors.As(err, &httpErr) {
			return c.Status(httpErr.Code).JSON(fiber.Map{"error": httpErr.Message})
		}
		// Error de dominio (ej: matriz inválida) → 422
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}
