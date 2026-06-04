# ADR-001: Monorepo Structure

## Status
Accepted

## Context
Need a scalable monorepo structure for the SARS platform with shared packages
for types, schemas, utilities, and configuration.

## Decision
Use Turborepo with npm workspaces (pnpm not available due to exFAT filesystem)
with the following structure:
- `apps/` — deployable applications (web, api)
- `packages/` — shared libraries (types, schemas, utils, ui, config)
- `packages/config/` — shared configuration (eslint, tsconfig, tailwind)

## Consequences
- Single version for all dependencies
- Shared TypeScript configurations across packages
- Turborepo caching for fast builds
