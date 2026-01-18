// package main

// import (
// 	"fmt"
// 	"log"
// 	"os"
// 	"toolva/internal/config"
// 	"toolva/internal/handlers"
// 	"toolva/internal/middleware"
// 	"toolva/internal/models"
// 	"toolva/internal/services"

// 	"github.com/gin-contrib/cors"
// 	"github.com/gin-gonic/gin"
// 	"gorm.io/driver/postgres"
// 	"gorm.io/gorm"
// )

// func main() {
// 	// Load configuration
// 	cfg, err := config.LoadConfig()
// 	if err != nil {
// 		log.Fatal("Error loading config:", err)
// 	}

// 	// Connect to database
// 	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
// 		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)
// 	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
// 	if err != nil {
// 		log.Fatal("Error connecting to database:", err)
// 	}

// 	// Auto migrate database
// 	err = db.AutoMigrate(&models.Tool{}, &models.User{}, &models.Favorite{}, &models.Review{})
// 	if err != nil {
// 		log.Fatal("Error migrating database:", err)
// 	}

// 	// Initialize services and handlers
// 	toolService := services.NewToolService(db)
// 	userService := services.NewUserService(db)
// 	toolHandler := handlers.NewToolHandler(toolService)
// 	// userHandler := handlers.NewUserHandler(userService, os.Getenv("JWT_SECRET"))
// 	userHandler := handlers.NewUserHandler(userService)


// 	// Create Gin router
// 	router := gin.Default()

// 	// Configure CORS
// 	router.Use(cors.New(cors.Config{
// 		AllowOrigins:     []string{"http://localhost:5173"},
// 		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
// 		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
// 		ExposeHeaders:    []string{"Content-Length"},
// 		AllowCredentials: true,
// 	}))

// 	// Public routes
// 	public := router.Group("/api")
// 	{
// 		// Auth routes
// 		auth := public.Group("/auth")
// 		{
// 			auth.POST("/register", userHandler.Register)
// 			auth.POST("/login", userHandler.Login)
// 		}

// 		// Tools routes
// 		tools := public.Group("/tools")
// 		{
// 			tools.GET("", toolHandler.GetAllTools)
// 			tools.GET("/featured", toolHandler.GetFeaturedTools)
// 			tools.GET("/category/:category", toolHandler.GetToolsByCategory)
// 			tools.GET("/search", toolHandler.SearchTools)
// 			tools.GET("/:id", toolHandler.GetToolByID)
// 			tools.GET("/:id/reviews", userHandler.GetToolReviews)
// 		}
// 	}

// 	// Protected routes
// 	protected := router.Group("/api")
// 	protected.Use(middleware.AuthMiddleware(os.Getenv("JWT_SECRET")))
// 	{
// 		// User routes
// 		user := protected.Group("/user")
// 		{
// 			user.GET("/profile", userHandler.GetProfile)
// 			user.PUT("/profile", userHandler.UpdateProfile)
// 			user.GET("/favorites", userHandler.GetFavorites)
// 			user.POST("/favorites/:id", userHandler.AddFavorite)
// 			user.DELETE("/favorites/:id", userHandler.RemoveFavorite)
// 			user.POST("/tools/:id/reviews", userHandler.AddReview)
// 		}

// 		// Admin routes
// 		admin := protected.Group("/admin")
// 		admin.Use(middleware.AdminMiddleware())
// 		{
// 			admin.POST("/tools", toolHandler.CreateTool)
// 			admin.PUT("/tools/:id", toolHandler.UpdateTool)
// 			admin.DELETE("/tools/:id", toolHandler.DeleteTool)
// 		}
// 	}

// 	// Start server
// 	port := cfg.Port
// 	if port == "" {
// 		port = "8080"
// 	}
// 	log.Printf("Server starting on port %s...", port)
// 	if err := router.Run(":" + port); err != nil {
// 		log.Fatal("Error starting server:", err)
// 	}
// }
















// package main

// import (
// 	"fmt"
// 	"log"

// 	"toolva/internal/config"
// 	"toolva/internal/handlers"
// 	"toolva/internal/middleware"
// 	"toolva/internal/models"
// 	"toolva/internal/services"

// 	"github.com/gin-contrib/cors"
// 	"github.com/gin-gonic/gin"
// 	"gorm.io/driver/postgres"
// 	"gorm.io/gorm"
// )

// func main() {
// 	// Load configuration (.env load should be inside this)
// 	cfg, err := config.LoadConfig()
// 	if err != nil {
// 		log.Fatal("Error loading config:", err)
// 	}

// 	// Connect to database
// 	dsn := fmt.Sprintf(
// 		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
// 		cfg.DBHost,
// 		cfg.DBPort,
// 		cfg.DBUser,
// 		cfg.DBPassword,
// 		cfg.DBName,
// 	)

// 	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
// 	if err != nil {
// 		log.Fatal("Error connecting to database:", err)
// 	}

// 	// Auto migrate database
// 	if err := db.AutoMigrate(
// 		&models.Tool{},
// 		&models.User{},
// 		&models.Favorite{},
// 		&models.Review{},
// 	); err != nil {
// 		log.Fatal("Error migrating database:", err)
// 	}

// 	// Initialize services and handlers
// 	toolService := services.NewToolService(db)
// 	userService := services.NewUserService(db)

// 	toolHandler := handlers.NewToolHandler(toolService)
// 	userHandler := handlers.NewUserHandler(userService) // ✅ JWT secret काढला

// 	// Create Gin router
// 	router := gin.Default()

// 	// Configure CORS
// 	router.Use(cors.New(cors.Config{
// 		AllowOrigins:     []string{"http://localhost:5173"},
// 		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
// 		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
// 		ExposeHeaders:    []string{"Content-Length"},
// 		AllowCredentials: true,
// 	}))

// 	// ======================
// 	// Public routes
// 	// ======================
// 	public := router.Group("/api")
// 	{
// 		// Tools routes (public)
// 		tools := public.Group("/tools")
// 		{
// 			tools.GET("", toolHandler.GetAllTools)
// 			tools.GET("/featured", toolHandler.GetFeaturedTools)
// 			tools.GET("/category/:category", toolHandler.GetToolsByCategory)
// 			tools.GET("/search", toolHandler.SearchTools)
// 			tools.GET("/:id", toolHandler.GetToolByID)
// 			tools.GET("/:id/reviews", userHandler.GetToolReviews)
// 		}
// 	}

// 	// ======================
// 	// Protected routes (Supabase Auth)
// 	// ======================
// 	protected := router.Group("/api")
// 	protected.Use(middleware.AuthMiddleware()) // ✅ Supabase JWT middleware
// 	{
// 		// User routes
// 		user := protected.Group("/user")
// 		{
// 			user.GET("/profile", userHandler.GetProfile)
// 			user.PUT("/profile", userHandler.UpdateProfile)
// 			user.GET("/favorites", userHandler.GetFavorites)
// 			user.POST("/favorites/:id", userHandler.AddFavorite)
// 			user.DELETE("/favorites/:id", userHandler.RemoveFavorite)
// 			user.POST("/tools/:id/reviews", userHandler.AddReview)
// 		}

// 		// Admin routes
// 		admin := protected.Group("/admin")
// 		admin.Use(middleware.AdminMiddleware())
// 		{
// 			admin.POST("/tools", toolHandler.CreateTool)
// 			admin.PUT("/tools/:id", toolHandler.UpdateTool)
// 			admin.DELETE("/tools/:id", toolHandler.DeleteTool)
// 		}
// 	}

// 	// Start server
// 	port := cfg.Port
// 	if port == "" {
// 		port = "8080"
// 	}

// 	log.Printf("🚀 Server starting on port %s...", port)
// 	if err := router.Run(":" + port); err != nil {
// 		log.Fatal("Error starting server:", err)
// 	}
// }








package main

import (
	"fmt"
	"log"

	"toolva/internal/config"
	"toolva/internal/handlers"
	"toolva/internal/middleware"
	"toolva/internal/models"
	"toolva/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// ======================
	// Load configuration (.env optional)
	// ======================
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Error loading config:", err)
	}

	// ======================
	// Database (optional – SKIP_DB)
	// ======================
	var db *gorm.DB

	if cfg.SkipDB {
		log.Println("⚠️  SKIP_DB=true → database connection skipped")
	} else {
		dsn := fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			cfg.DBHost,
			cfg.DBPort,
			cfg.DBUser,
			cfg.DBPassword,
			cfg.DBName,
		)

		var err error
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatal("Error connecting to database:", err)
		}

		if err := db.AutoMigrate(
			&models.Tool{},
			&models.User{},
			&models.Favorite{},
			&models.Review{},
		); err != nil {
			log.Fatal("Error migrating database:", err)
		}
	}

	// ======================
	// Initialize services & handlers
	// ======================
	var toolHandler *handlers.ToolHandler
	var userHandler *handlers.UserHandler

	if !cfg.SkipDB {
		toolService := services.NewToolService(db)
		userService := services.NewUserService(db)

		toolHandler = handlers.NewToolHandler(toolService)
		userHandler = handlers.NewUserHandler(userService)
	}

	// ======================
	// Create Gin router
	// ======================
	router := gin.Default()

	// Inject DB into context (nil if SKIP_DB)
	router.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	})

	// ======================
	// Configure CORS
	// ======================
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// ======================
	// Public routes
	// ======================
	public := router.Group("/api")
	{
		// Health check
		public.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		if !cfg.SkipDB {
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
	}

	// ======================
	// Protected routes (Supabase Auth)
	// ======================
	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		if !cfg.SkipDB {
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
	}

	// ======================
	// Start server
	// ======================
	port := cfg.Port
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Error starting server:", err)
	}
}
