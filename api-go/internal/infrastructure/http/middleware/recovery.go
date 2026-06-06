package middleware

import "github.com/gofiber/fiber/v2"

// Recovery captura panics y los convierte en respuestas 500.
func Recovery() fiber.Handler {
	return func(c *fiber.Ctx) error {
		defer func() {
			if r := recover(); r != nil {
				_ = c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "error interno del servidor",
				})
			}
		}()
		return c.Next()
	}
}
