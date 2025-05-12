package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/wire"
)

// service is a simple service that depends on a repository.
type service struct {
	repo repository
}

// NewService creates a new service.
func NewService(repo repository) (Service, error) { // Changed to interface
	if repo == nil {
		return nil, fmt.Errorf("repository cannot be nil")
	}
	return &service{repo: repo}, nil
}

// Service defines the interface for the service.  This is good practice
// for dependency injection and testing.
type Service interface {
	DoSomething() string
}

// DoSomething performs an action using the repository.
func (s *service) DoSomething() string {
	return s.repo.GetData() + " and Service did something"
}

// repository is an interface for data access.
type repository interface {
	GetData() string
}

// NewRepository creates a new repository.
func NewRepository() (repository, error) { // Changed to interface
	return &repo{}, nil
}

// repo is a concrete implementation of the repository.
type repo struct{}

// GetData retrieves data.
func (r *repo) GetData() string {
	return "Data from Repository"
}

// ===============================
//   HTTP Server Example (Optional)
// ===============================

// server is a simple HTTP server that uses the service.
type server struct {
	service Service
}

// NewServer creates a new server.
func NewServer(service Service) (Server, error) { // Changed to interface
	if service == nil {
		return nil, fmt.Errorf("service cannot be nil")
	}
	return &server{service: service}, nil
}

// Server defines the interface for our server
type Server interface {
	Start() error
}

// handle handles HTTP requests.
func (s *server) handle(w http.ResponseWriter, r *http.Request) {
	data := s.service.DoSomething()
	fmt.Fprintln(w, data)
}

// Start starts the HTTP server.
func (s *server) Start() error {
	http.HandleFunc("/", s.handle)
	srv := &http.Server{
		Addr:         ":8080",
		Handler:      nil, // Use the default ServeMux.
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	log.Println("Server listening on :8080")
	return srv.ListenAndServe()
}

// ===============================
//             Wire Setup
// ===============================

// Set declares the dependency bindings for Wire.
var Set = wire.NewSet(
	NewService,
	wire.Bind(new(Service), new(*service)), // Added interface binding
	NewRepository,
	wire.Bind(new(repository), new(*repo)), // Added interface binding
	NewServer,
	wire.Bind(new(Server), new(*server)), // Added interface binding
)

// ===============================
//             Main Function
// ===============================

func main() {
	// Initialize the application using Wire.
	server, err := InitializeServer() // Changed to InitializeServer
	if err != nil {
		log.Fatalf("Failed to initialize: %v", err)
	}

	// Start the server.
	if err := server.Start(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
