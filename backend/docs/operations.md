# Operations Runbook

Last Verified: 2026-02-17

This runbook defines standard operational procedures for backend deployment and incident response.

---

## Service Facts

- Runtime: Node.js (NestJS)
- API prefix: `/api`
- Swagger: `/api/docs`
- Realtime namespace: `/events`
- Primary datastore: MongoDB

---

## Pre-Deploy Checklist

1. `npm ci` or `npm install` succeeds.
2. `npm run build` succeeds.
3. Required env vars are present and valid.
4. DB connectivity test passes.
5. Seed behavior is reviewed for environment (especially superadmin credentials).
6. Rollback artifact for previous release is available.

---

## Deploy Procedure

1. Build artifact:
    - `npm run build`
2. Start process:
    - `npm run start:prod`
3. Verify health:
    - `GET /api/health`
4. Verify auth path:
    - login + verify endpoints
5. Verify one write path:
    - create/update operation in a non-critical domain

---

## Post-Deploy Smoke Tests

- API health endpoint returns success.
- Swagger loads and key endpoints are visible.
- Login and token refresh work.
- At least one manager-protected endpoint returns expected auth behavior.
- WebSocket client can connect to `/events`.

---

## Incident Response

### Severity Model

- Sev-1: full outage or data integrity risk
- Sev-2: major feature unavailable with workaround
- Sev-3: minor degradation

### First 10 Minutes

1. Confirm current symptoms and blast radius.
2. Freeze non-essential deploys.
3. Check recent deploy and config changes.
4. Verify DB connectivity and auth secrets validity.
5. Decide rollback vs hotfix path.

### Common Failure Modes

- **Boot failure**: env validation errors or DB URI issues
- **Auth spike**: invalid JWT secrets, token mismatch, or clock skew
- **Realtime issues**: namespace mismatch (`/events`) or client reconnect loops
- **Data anomalies**: incorrect status transitions in order/table lifecycle

---

## Rollback Strategy

1. Revert to last known good artifact.
2. Restore previous env config set if config caused the issue.
3. Re-run smoke tests.
4. Document root cause and add preventive action item.

---

## Data Safety Notes

1. `POST /api/orders/reset` is destructive and superadmin-only.
2. `DELETE /api/messages/all` is destructive and superadmin-only.
3. For emergency scripts, require dual approval in production.

---

## Observability Baseline (Recommended)

Minimum metrics to instrument:

- request rate and latency (by route + method)
- error rate by status code class
- auth failures (401/403)
- websocket connection count
- MongoDB operation latency

Minimum logs:

- startup config validation outcome
- unhandled exceptions (with stack)
- auth and permission denial reason categories (without secrets)
