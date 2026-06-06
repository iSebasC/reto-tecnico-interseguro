# Interseguro — Coding Challenge

Sistema de dos microservicios para factorización QR de matrices y cálculo de estadísticas.

## Arquitectura

```
Cliente → API Go (Fiber) :8080
            ↓ factorización QR
            ↓ POST http://api-node:3000/api/stats
          API Node.js (Express) :3000
            ↓ estadísticas (max, min, avg, sum, isDiagonal)
            ↑ respuesta agregada al cliente
```

## Requisitos

- Docker Desktop 24+
- Go 1.22+ (desarrollo local)
- Node.js 20+ (desarrollo local)

## Levantar con Docker Compose

```bash
docker-compose up --build
```

## Verificar servicios

```bash
curl http://localhost:8080/health
curl http://localhost:3000/health
```

## Desarrollo local

### API Go
```bash
cd api-go
go run ./cmd/server
```

### API Node.js
```bash
cd api-node
npm run dev
```

## Endpoints

| Método | URL | Servicio | Descripción |
|--------|-----|---------|-------------|
| GET | /health | api-go | Health check |
| POST | /api/matrix | api-go | Factorización QR + estadísticas |
| GET | /health | api-node | Health check |
| POST | /api/stats | api-node | Estadísticas sobre matrices Q y R |
