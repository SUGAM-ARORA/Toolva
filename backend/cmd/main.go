package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"toolva/internal/config"
	"toolva/internal/handlers"
	"toolva/internal/middleware"
	"toolva/internal/models"
	"toolva/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Println("[startup] Config warning:", err)
	}

	// Connect to SQLite database
	db, err := gorm.Open(sqlite.Open("toolva.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	// Auto migrate database
	if err := db.AutoMigrate(&models.Tool{}, &models.User{}, &models.Favorite{}, &models.Review{}); err != nil {
		log.Fatal("Error migrating database:", err)
	}

	// Initialize services and handlers
	toolService := services.NewToolService(db)
	userService := services.NewUserService(db)
	toolHandler := handlers.NewToolHandler(toolService)
	userHandler := handlers.NewUserHandler(userService, cfg.JWTSecret)

	// Create Gin router
	router := gin.Default()

	// Inject database into context for AdminMiddleware
	router.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})

	// Configure CORS with allowed origins from config
	router.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"version": "1.0.0",
			"service": "toolva-backend",
		})
	})

	// Public routes
	public := router.Group("/api")
	{
		auth := public.Group("/auth")
		{
			auth.POST("/register", userHandler.Register)
			auth.POST("/login", userHandler.Login)
		}

		tools := public.Group("/tools")
		{
			tools.GET("", toolHandler.GetAllTools)
			tools.GET("/featured", toolHandler.GetFeaturedTools)
			tools.GET("/category/:category", toolHandler.GetToolsByCategory)
			tools.GET("/search", toolHandler.SearchTools)
			tools.GET("/:id", toolHandler.GetToolByID)
			tools.GET("/:id/reviews", userHandler.GetToolReviews)
		}
	}

	// Protected routes
	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		user := protected.Group("/user")
		{
			user.GET("/profile", userHandler.GetProfile)
			user.PUT("/profile", userHandler.UpdateProfile)
			user.GET("/favorites", userHandler.GetFavorites)
			user.POST("/favorites/:id", userHandler.AddFavorite)
			user.DELETE("/favorites/:id", userHandler.RemoveFavorite)
			user.POST("/tools/:id/reviews", userHandler.AddReview)
		}

		admin := protected.Group("/admin")
		admin.Use(middleware.AdminMiddleware())
		{
			admin.POST("/tools", toolHandler.CreateTool)
			admin.PUT("/tools/:id", toolHandler.UpdateTool)
			admin.DELETE("/tools/:id", toolHandler.DeleteTool)
		}
	}

	// Graceful shutdown
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	go func() {
		log.Printf("[server] Toolva backend starting on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("[server] Error:", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[server] Shutting down gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("[server] Forced shutdown:", err)
	}
	log.Println("[server] Server stopped")
}
