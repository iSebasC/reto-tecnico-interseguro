package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port       string
	NodeAPIURL string
}

func Load() *Config {
	_ = godotenv.Load()

	return &Config{
		Port:       getEnv("PORT", "8080"),
		NodeAPIURL: getEnv("NODE_API_URL", "http://api-node:3000"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
