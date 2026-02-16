# Backend Service

Production-oriented NestJS backend for the restaurant ordering system.
This service provides REST APIs, authentication, and real-time event broadcasting.

## Service Entry Points

- API base: `http://localhost:4000/api`
- Swagger UI: `http://localhost:4000/api/docs`
- OpenAPI JSON: `http://localhost:4000/api/docs-json`
- WebSocket namespace: `/events`

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create local environment file

macOS/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Configure required variables

At minimum:

- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

### 4. Start development server

```bash
npm run start:dev
```

## Common Commands

```bash
npm run start:dev   # local development
npm run build       # compile TypeScript
npm run start:prod  # run production build
npm test            # unit tests
npm run test:e2e    # end-to-end tests
npm run lint        # lint and auto-fix
```

## Documentation Map

Backend documentation is maintained under `backend/docs/`.

- `docs/README.md` - documentation index and governance
- `docs/setup.md` - setup, env vars, scripts, troubleshooting
- `docs/api.md` - API behavior contract and endpoint matrix
- `docs/architecture.md` - module boundaries and request lifecycle
- `docs/auth.md` - authentication and authorization model
- `docs/database.md` - schema and index design
- `docs/websocket.md` - real-time event contract
- `docs/operations.md` - deployment and incident runbook

## Architecture Principles

- Domain-oriented modules under `src/modules`
- Thin controllers, business logic in services
- Centralized cross-cutting policies in `src/common`
- Explicit input validation via DTOs
- Standardized response envelopes via global interceptor/filter

## Quality Expectations

Before merging backend changes:

1. Update docs when behavior or contracts change.
2. Keep Swagger/OpenAPI and markdown docs consistent.
3. Ensure lint/tests pass for impacted areas.

## Project Structure (High Level)

```text
backend/
├── src/            # application code
├── docs/           # engineering and operations documentation
├── test/           # e2e tests
└── package.json
```
