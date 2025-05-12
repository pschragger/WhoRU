# Use a multi-stage build to reduce the final image size
# ----------------------------------------------------

# Stage 1: Build the Go application
FROM golang:1.22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files (go.mod and go.sum) to the working directory
COPY go.mod go.sum ./

# Download Go dependencies
RUN go mod download

# Copy the entire project source code to the working directory
COPY . .

# Build the Go application.  Make sure to build for linux/amd64.
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o auth-service cmd/auth-service/main.go

# Stage 2: Create a minimal image to run the application
FROM alpine:latest

# Install necessary packages (if any).  For a Go app, you often don't need much.
# RUN apk add --no-cache <package_name>  # Example:  If you needed libc:  apk add --no-cache libc6-compat

# Set the working directory in the final image
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/auth-service /app/auth-service

# Expose the port that your application listens on (default: 8080, change if needed)
EXPOSE 8080

# Set the entrypoint command to run your application
ENTRYPOINT ["/app/auth-service"]
