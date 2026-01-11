# Frontend build stage
FROM node:18-alpine AS frontend-builder

WORKDIR /build

# Copy frontend package files
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy frontend source
COPY frontend/ ./frontend/

# Build frontend (output to /build/dist due to vite.config.ts outDir: '../dist')
RUN npm config set registry https://registry.npmjs.org/
RUN cd frontend && npm run build

# Backend build stage
FROM golang:1.23-alpine AS backend-builder

WORKDIR /build

# Copy go mod files
RUN go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct
COPY go.mod go.sum ./
RUN go mod download

# Copy source code (exclude large directories)
COPY . .

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /build/dist ./dist

# Build binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o terraria-panel .

# Runtime stage - minimal image
FROM debian:bullseye-slim

WORKDIR /app

# Install minimal dependencies
#RUN apt install  ca-certificates tzdata

# Copy binary only
COPY --from=backend-builder /build/terraria-panel .
COPY --from=backend-builder /build/dist ./dist

# Create directories for external mounts
RUN mkdir -p /app/Terraria-1449 /app/Terraria /app/logs /app/worlds

# Copy default config templates (user should override with volumes)
COPY config.yaml ./

# Expose ports
EXPOSE 8080 7777

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:8080/api/game/status || exit 1

# Run the application
CMD ["./terraria-panel"]