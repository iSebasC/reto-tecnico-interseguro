# QR Matrix Analyzer

Sistema que recibe una matriz rectangular, calcula su descomposición QR y devuelve estadísticas sobre las matrices resultantes. Implementado con dos microservicios y una interfaz web de demostración.

## Arquitectura

```
Browser → Next.js :3001 → API Go :8080 → API Node.js :3000
```

- **API Go** (Fiber): orquestador. Valida la entrada, ejecuta la factorización QR con Gonum y llama internamente a Node.js.
- **API Node.js** (Express): calcula estadísticas (máx, mín, suma, promedio, verificación diagonal) sobre las matrices Q y R.
- **Next.js**: interfaz de demostración que actúa como proxy hacia Go, evitando CORS.

El cliente nunca llama a Node.js directamente.

## Stack

| | |
|---|---|
| API Go | Go 1.24 + Fiber v2 + Gonum v0.17 |
| API Node.js | Node.js 20 + Express v4 + Joi v17 |
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Infra | Docker + Docker Compose |

## Ejecutar el backend

Requiere Docker Desktop.

```bash
docker compose up --build
```

Verificar que los dos servicios están corriendo:

```bash
curl http://localhost:8080/health
curl http://localhost:3000/health
```

## Ejecutar el frontend

El frontend es una interfaz de demostración. No forma parte del `docker-compose.yml` y se levanta por separado. Requiere el backend corriendo.

```bash
cd frontend
npm install
npm run dev
```

Disponible en `http://localhost:3001`.

## Endpoints

| Método | URL | Descripción |
|---|---|---|
| GET | `localhost:8080/health` | Health check |
| POST | `localhost:8080/api/matrix` | Factorización QR + estadísticas |
| GET | `localhost:3000/health` | Health check |
| POST | `localhost:3000/api/stats` | Estadísticas (uso interno de Go) |

## Ejemplo

```bash
curl -X POST http://localhost:8080/api/matrix \
  -H "Content-Type: application/json" \
  -d '{
    "matrix": [
      [12, -51,   4],
      [ 6, 167, -68],
      [-4,  24, -41]
    ]
  }'
```

```json
{
  "original": [[12,-51,4],[6,167,-68],[-4,24,-41]],
  "qr": {
    "Q": [
      [-0.8571428571,  0.3942857143,  0.3314285714],
      [-0.4285714286, -0.9028571429, -0.0342857143],
      [ 0.2857142857, -0.1714285714,  0.9428571429]
    ],
    "R": [
      [-14, -21,  14],
      [  0,-175,  70],
      [  0,   0, -35]
    ]
  },
  "stats": {
    "max": 70,
    "min": -175,
    "sum": -161.44,
    "avg": -8.9688888889,
    "isDiagonal": { "Q": false, "R": false }
  }
}
```

## Estructura

```
reto-tecnico-interseguro/
├── api-go/
│   ├── cmd/server/
│   └── internal/
│       ├── domain/        # lógica de factorización QR
│       ├── application/   # casos de uso + puertos
│       └── infrastructure/  # handlers, cliente HTTP, config
├── api-node/
│   └── src/
│       ├── domain/        # lógica de estadísticas
│       ├── application/
│       └── infrastructure/  # handlers, validadores
├── frontend/
│   └── src/
│       ├── app/           # page, layout, api route (proxy)
│       ├── components/    # MatrixTable, StatsPanel, MatrixForm
│       ├── hooks/         # useMatrixProcessor
│       └── lib/           # fetch con AbortController
└── docker-compose.yml
```
