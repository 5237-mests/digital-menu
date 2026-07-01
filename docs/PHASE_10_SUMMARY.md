# Phase 10 Summary

## Scope

- Source-level tests for phases 4–10 modules and routes
- Production static serving of the Svelte build from NestJS
- Docker image builds both API and web app for single deployment
- Vite dev proxy for local full-stack development

## Decisions

- Static assets are served from `apps/web/build` in production with SPA fallback excluding API routes.
- Docker build runs web first, then API, and copies the static build into the API runtime image.
- Tests remain lightweight source assertions to keep CI fast without requiring a live database in every suite.

## Commands

```bash
pnpm test
pnpm build
docker compose up --build
```

## Result

Phases 1–10 are complete. The system supports customer ordering, kitchen operations, admin management, realtime updates, and production deployment from a single API container.
