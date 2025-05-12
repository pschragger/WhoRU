package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/your-repo/auth-service/internal/app" // Correct import path
	"github.com/your-repo/auth-service/internal/auth"    // Correct import path
	"github.com/your-repo/auth-service/internal/database" // Correct import path
	"github.com/your-repo/auth-service/internal/web"       // Correct import path
)

func main() {
	// Initialize application configuration.
	config, err := app.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load configuration: %v", err)
	}

	// Initialize database connection.
	db, err := database.InitDB(config.Database)
	if err != nil {
		log.Fatalf("failed to initialize database: %v", err)
	}
	defer db.Close() // Ensure database connection is closed when the program exits.

    // Perform database migrations.
	if err := database.RunMigrations(db, config.Database.MigrationsPath); err != nil {
        log.Fatalf("failed to run database migrations: %v", err)
    }

	// Initialize authentication service.
	authService, err := auth.NewService(db, config) // Pass the config
	if err != nil {
		log.Fatalf("failed to initialize authentication service: %v", err)
	}

	// Initialize web server (handlers, routes, middleware).
	handler := web.NewHandler(authService, config) // Pass authService and config
	router := web.SetupRoutes(handler)

	// Start the server.
	addr := fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port)
	log.Printf("server listening on %s", addr)
	err = http.ListenAndServe(addr, router)
	if err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}