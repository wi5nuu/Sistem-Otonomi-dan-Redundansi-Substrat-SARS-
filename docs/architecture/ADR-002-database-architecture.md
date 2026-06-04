# ADR-002: Database Architecture

## Status
Accepted

## Context
Need a database that supports time-series metrics, full-text search, audit chains.

## Decision
- PostgreSQL 16 with TimescaleDB for time-series metrics
- Drizzle ORM for type-safe queries
- SHA-384 chained hash for audit log tamper evidence
