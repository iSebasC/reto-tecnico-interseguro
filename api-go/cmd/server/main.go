package main

import (
	"log"

	"interseguro/api-go/internal/config"
	"interseguro/api-go/internal/infrastructure/http/router"
)

func main() {
	cfg := config.Load()

	app := router.New(cfg)

	log.Printf("api-go iniciando en puerto %s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
