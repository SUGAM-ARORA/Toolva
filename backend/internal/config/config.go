package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	Port           string
	JWTSecret      string
	AllowedOrigins []string
}

func LoadConfig() (*Config, error) {
	// .env is optional — we use sensible defaults for local dev
	if err := godotenv.Load(); err != nil {
		log.Println("[config] No .env file found, using environment variables and defaults")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "change-me-in-production"
		log.Println("[config] WARNING: Using default JWT_SECRET — set JWT_SECRET env var in production!")
	}

	allowedOriginsStr := os.Getenv("ALLOWED_ORIGINS")
	if allowedOriginsStr == "" {
		allowedOriginsStr = "http://localhost:5173,http://localhost:3000"
	}
	allowedOrigins := strings.Split(allowedOriginsStr, ",")
	for i := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(allowedOrigins[i])
	}

	return &Config{
		DBHost:         os.Getenv("DB_HOST"),
		DBPort:         os.Getenv("DB_PORT"),
		DBUser:         os.Getenv("DB_USER"),
		DBPassword:     os.Getenv("DB_PASSWORD"),
		DBName:         os.Getenv("DB_NAME"),
		Port:           port,
		JWTSecret:      jwtSecret,
		AllowedOrigins: allowedOrigins,
	}, nil
}
