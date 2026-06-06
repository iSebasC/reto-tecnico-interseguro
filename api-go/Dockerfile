# ── Stage 1: compilación ──────────────────────────────────────────────────────
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Descarga dependencias antes de copiar el código (aprovecha caché de Docker)
COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /api-go ./cmd/server

# ── Stage 2: imagen final mínima ──────────────────────────────────────────────
FROM alpine:3.19

WORKDIR /app

COPY --from=builder /api-go .

EXPOSE 8080

CMD ["./api-go"]
