# API Overview

Base URL: `https://api.sars-platform.example.com`

## Authentication

All API requests require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Endpoints

### Health

| Method | Path       | Description         |
|--------|------------|---------------------|
| GET    | `/health`  | Liveness check      |
| GET    | `/ready`   | Readiness check     |

### Metrics

| Method | Path              | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/v1/metrics` | List metrics             |
| POST   | `/api/v1/metrics` | Ingest a metric data point |
| GET    | `/api/v1/metrics/:id` | Get metric details    |

### Audit

| Method | Path                | Description         |
|--------|---------------------|---------------------|
| GET    | `/api/v1/audit`     | Query audit log     |
| POST   | `/api/v1/audit`     | Append audit entry  |

## Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [...]
  }
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user
