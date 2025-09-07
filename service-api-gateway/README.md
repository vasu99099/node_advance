# API Gateway Service

Production-ready API Gateway for microservices architecture with factory patterns, comprehensive security, and monitoring.

## Features

- **Factory Pattern Architecture**: Modular design with factories for middleware, services, and configuration
- **Security**: JWT authentication, CORS protection, rate limiting, helmet security headers
- **Monitoring**: Health checks, structured logging with Winston, request/response logging
- **Production Ready**: Docker support, graceful shutdown, error handling, configuration validation

## Architecture

### Factory Pattern Implementation

- **ConfigFactory**: Manages environment variables and application configuration
- **LoggerFactory**: Creates structured loggers with sanitization
- **MiddlewareFactory**: Creates security, authentication, and utility middleware
- **ServiceFactory**: Manages service registration, proxy creation, and health checks

### Security Features

- JWT-based authentication
- CORS with configurable origins
- Rate limiting with customizable windows
- Security headers via Helmet
- Input sanitization for logs
- Non-root Docker user

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing secret | **Required** |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `LOG_LEVEL` | Logging level | `info` |

### Service URLs

Configure downstream service URLs:
- `AUTH_SERVICE_URL`
- `ADDRESS_SERVICE_URL`
- `INVENTORY_SERVICE_URL`
- `ORDER_SERVICE_URL`
- `NOTIFICATION_SERVICE_URL`

## API Endpoints

### Health Checks
- `GET /health` - Basic gateway health check
- `GET /health/services` - Check all downstream services health
- `GET /health/services/:serviceName` - Check specific service health (e.g., `/health/services/auth`)
- `GET /health/detailed` - Comprehensive health check (gateway + all services)

#### Health Check Response Examples

**Service Health Check** (`GET /health/services/auth`):
```json
{
  "success": true,
  "data": {
    "service": "auth",
    "status": "healthy",
    "statusCode": 200,
    "responseTime": 1640995200000,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "url": "http://localhost:4001/health",
    "response": { "status": "ok" }
  }
}
```

**All Services Health** (`GET /health/services`):
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "services": [
      {
        "service": "auth",
        "status": "healthy",
        "statusCode": 200,
        "url": "http://localhost:4001/health"
      },
      {
        "service": "inventory",
        "status": "unhealthy",
        "error": "Connection refused",
        "url": "http://localhost:4002/health"
      }
    ],
    "summary": {
      "total": 5,
      "healthy": 4,
      "unhealthy": 1
    }
  }
}
```

### Service Routes
- `POST /auth/*` - Authentication service (public)
- `GET|POST|PUT|DELETE /addresses/*` - Address service (authenticated)
- `GET|POST|PUT|DELETE /inventory/*` - Inventory service (authenticated)
- `GET|POST|PUT|DELETE /orders/*` - Order service (authenticated)
- `GET|POST|PUT|DELETE /notifications/*` - Notification service (authenticated)

## Production Deployment

### Docker

```bash
# Build image
docker build -t api-gateway .

# Run container
docker run -p 3000:3000 --env-file .env api-gateway
```

### Docker Compose

```bash
docker-compose up -d
```

## Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing

```bash
npm test
```

## Monitoring

- Structured JSON logging with Winston
- Request/response logging with sanitization
- Health check endpoints for service discovery
- Graceful shutdown handling
- Memory and uptime metrics

## Security Considerations

- All routes except `/auth` require JWT authentication
- CORS configured with specific origins
- Rate limiting prevents abuse
- Input sanitization prevents log injection
- Security headers via Helmet
- Non-root Docker execution

## Factory Pattern Benefits

1. **Modularity**: Each factory handles specific concerns
2. **Testability**: Easy to mock and test individual components
3. **Configurability**: Centralized configuration management
4. **Maintainability**: Clear separation of responsibilities
5. **Extensibility**: Easy to add new services and middleware