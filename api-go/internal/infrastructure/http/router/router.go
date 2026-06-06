package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	appMatrix "interseguro/api-go/internal/application/matrix"
	"interseguro/api-go/internal/config"
	domainMatrix "interseguro/api-go/internal/domain/matrix"
	"interseguro/api-go/internal/infrastructure/client"
	"interseguro/api-go/internal/infrastructure/http/handler"
)

// New construye y configura la aplicación Fiber con todas sus rutas.
// Actúa como composition root: Service → StatsClient → UseCase → Handler.
func New(cfg *config.Config) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName: "Interseguro API Go",
	})

	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "api-go",
		})
	})

	// Dependency injection
	matrixSvc := domainMatrix.NewService()
	statsClient := client.NewStatsClient(cfg.NodeAPIURL)
	matrixUC := appMatrix.NewUseCase(matrixSvc, statsClient)
	matrixHandler := handler.NewMatrixHandler(matrixUC)

	api := app.Group("/api")
	api.Post("/matrix", matrixHandler.Process)

	return app
}
