# Frontend build stage
FROM node:18-alpine AS frontend-builder

WORKDIR /build

# Copy frontend package files
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy frontend source
COPY frontend/ ./frontend/

# Build frontend (output to /build/dist due to vite.config.ts outDir: '../dist')
RUN cd frontend && npm run build

# Backend build stage
FROM golang:1.23-alpine AS backend-builder

WORKDIR /build

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /build/dist ./dist

# Build binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o terraria-panel .

# Runtime stage
FROM alpine:latest

WORKDIR /app

# Install required packages
RUN apk add --no-cache ca-certificates tzdata

# Copy binary from backend-builder
COPY --from=backend-builder /build/terraria-panel .

# Copy Terraria server files
COPY --from=backend-builder /build/Terraria-1449 ./Terraria-1449
COPY --from=backend-builder /build/Terraria ./Terraria

# Copy frontend dist
COPY --from=backend-builder /build/dist ./dist

# Copy config files
COPY config.yaml config.txt ./

# Make Terraria server executable
RUN chmod +x ./Terraria-1449/Linux/TerrariaServer.bin.x86_64

# Expose ports
EXPOSE 8080 7777

# Run the application
CMD ["./terraria-panel"]
