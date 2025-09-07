# API Gateway Architecture

## 📁 Folder Structure

```
service-api-gateway/
├── src/
│   ├── config/                 # Configuration exports
│   │   └── index.js
│   ├── constants/              # Application constants
│   │   └── HttpStatus.js
│   ├── controllers/            # Request handlers
│   │   └── HealthController.js
│   ├── factories/              # Factory pattern implementations
│   │   ├── ConfigFactory.js
│   │   ├── LoggerFactory.js
│   │   ├── MiddlewareFactory.js
│   │   └── ServiceFactory.js
│   ├── middlewares/            # Custom middleware
│   │   └── ErrorHandler.js
│   ├── routes/                 # Route definitions
│   │   ├── HealthRoutes.js
│   │   ├── ServiceRoutes.js
│   │   └── gateway.js
│   ├── services/               # Business logic
│   │   └── HealthService.js
│   ├── utils/                  # Utility functions
│   │   └── ResponseHelper.js
│   ├── validators/             # Input validation
│   │   └── ServiceValidator.js
│   └── index.js               # Application entry point
├── logs/                      # Log files
├── .env                       # Environment variables
├── .env.example              # Environment template
├── docker-compose.yml        # Docker composition
├── Dockerfile               # Container definition
├── package.json            # Dependencies
├── test-health.js         # Health check tests
└── README.md             # Documentation
```

## 🏗️ Architecture Patterns

### Factory Pattern
- **ConfigFactory**: Environment and configuration management
- **LoggerFactory**: Structured logging with Winston
- **MiddlewareFactory**: Security and utility middleware
- **ServiceFactory**: Service registration and proxy creation

### MVC Pattern
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and external service communication
- **Routes**: URL routing and middleware application

### Separation of Concerns
- **Constants**: Centralized application constants
- **Validators**: Input validation logic
- **Utils**: Reusable utility functions
- **Middlewares**: Cross-cutting concerns

## 🔄 Request Flow

1. **Request** → Security Middleware (Helmet, CORS)
2. **Rate Limiting** → Request validation
3. **Authentication** → JWT verification (protected routes)
4. **Routing** → Route to appropriate controller
5. **Controller** → Business logic in services
6. **Service** → External service communication
7. **Response** → Structured JSON response

## 🏥 Health Check Architecture

```
/health                    → Gateway health
/health/services          → All services health
/health/services/:name    → Specific service health
/health/detailed         → Complete health overview
```

Each health check:
- Hits service `/health` endpoint
- 5-second timeout
- Structured logging
- Error handling
- Status code mapping

## 🔒 Security Layers

1. **Helmet**: Security headers
2. **CORS**: Cross-origin protection
3. **Rate Limiting**: Request throttling
4. **JWT Authentication**: Token validation
5. **Input Sanitization**: Log injection prevention
6. **Error Handling**: Information disclosure prevention