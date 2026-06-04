# ADR-003: API Framework

## Status
Accepted

## Context
Need a high-performance API framework with end-to-end type safety.

## Decision
- Fastify v5 for HTTP (schema-first, 3x faster than Express)
- tRPC v11 for type-safe RPC
- Zod for validation (shared with frontend)
