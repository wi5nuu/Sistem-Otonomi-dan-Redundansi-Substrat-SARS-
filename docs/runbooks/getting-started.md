# Getting Started

## Prerequisites

- Node.js >= 20
- npm >= 10
- Docker Desktop (local Redis, PostgreSQL)
- Git

## Setup

```bash
# Clone the repository
git clone <repo-url> sars-platform
cd sars-platform

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start infrastructure dependencies
docker compose -f infrastructure/docker/docker-compose.yml up -d

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

## Project Structure

```
sars-platform/
├── apps/
│   ├── api/          # Fastify + tRPC API server (port 4000)
│   └── web/          # Next.js frontend (port 3000)
├── packages/
│   ├── config/       # Shared ESLint, TSConfig, Tailwind configs
│   ├── schemas/      # Zod schemas shared between API and web
│   ├── types/        # Shared TypeScript types
│   ├── ui/           # Shared React components
│   └── utils/        # Shared utility functions
├── infrastructure/   # Docker, Kubernetes, Terraform configs
└── docs/             # Architecture decisions, runbooks, API docs
```

## Useful Commands

| Command               | Description                     |
|-----------------------|---------------------------------|
| `npm run dev`         | Start all apps in development   |
| `npm run build`       | Build all packages and apps     |
| `npm run lint`        | Run ESLint across the monorepo  |
| `npm run test`        | Run tests                       |
| `npm run db:migrate`  | Apply database migrations       |
| `npm run db:studio`   | Open Drizzle Studio             |

## Environment Variables

Key environment variables (see `.env.example` for full list):

| Variable              | Description                     |
|-----------------------|---------------------------------|
| `DATABASE_URL`        | PostgreSQL connection string    |
| `REDIS_URL`           | Redis connection string         |
| `JWT_SECRET`          | JWT signing secret              |
| `API_PORT`            | API server port (default: 4000) |
