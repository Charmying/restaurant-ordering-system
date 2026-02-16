# Backend Documentation

This folder contains the canonical documentation for the backend service.

## Documentation Principles

- **Code-aligned**: docs must match implementation in `backend/src`.
- **Single source of truth**: API details are generated from Swagger/OpenAPI; markdown provides intent, constraints, and operational guidance.
- **Actionable**: every operational document must include concrete commands.
- **Versioned**: documentation changes are part of normal code review.

## Document Map

- `setup.md` - local setup, environment variables, scripts, troubleshooting
- `architecture.md` - system design, module boundaries, request lifecycle
- `api.md` - API conventions, endpoint matrix, behavioral contracts
- `auth.md` - authentication, authorization, token lifecycle, role model
- `database.md` - schema and index design, lifecycle flows
- `websocket.md` - real-time event contract and event catalog
- `seed.md` - startup seed behavior and manual seed execution
- `dependencies.md` - runtime and dev dependency rationale
- `operations.md` - production runbook, incident handling, rollback playbook

## Review Checklist (Required For Backend PRs)

When behavior changes in controllers, services, DTOs, schemas, guards, or gateway events:

1. Update relevant docs in this folder.
2. Verify examples and rules against actual code paths.
3. Ensure endpoint behavior remains consistent with Swagger (`/api/docs`).
4. Include "docs impact" in PR summary.

## Ownership

- Primary owner: backend team
- Review owner: feature author + one backend reviewer
