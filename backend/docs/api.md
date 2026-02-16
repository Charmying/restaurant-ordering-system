# API Contract Guide

All routes are prefixed with `/api`.
The authoritative endpoint contract is generated at runtime:

- Swagger UI: `/api/docs`
- OpenAPI JSON: `/api/docs-json`

This file documents behavior rules and integration-critical notes that are easy to miss in raw endpoint lists.

---

## Response Envelope (Global)

All successful responses are wrapped by `TransformInterceptor`:

```json
{
  "success": true,
  "data": {}
}
```

All errors are normalized by `AllExceptionsFilter`:

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": []
  }
}
```

---

## Access Legend

| Label | Meaning |
|---|---|
| Public | No JWT required |
| Auth | Valid access token required |
| Employee+ | `employee`, `manager`, `superadmin` |
| Manager+ | `manager`, `superadmin` |
| Superadmin | `superadmin` only |

---

## Endpoint Matrix

### Health

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/health` | Public | Returns status, server timestamp, uptime |

### Auth

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Username/password login |
| POST | `/api/auth/refresh` | Public | Rotates and returns new access + refresh tokens |
| POST | `/api/auth/logout` | Auth | Clears persisted refresh token |
| GET | `/api/auth/verify` | Auth | Returns current JWT payload |

### Users

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/users` | Auth | Superadmin sees all, manager sees employees, employee forbidden |
| POST | `/api/users` | Manager+ | Manager cannot create equal/higher role |
| PUT | `/api/users/:id/password` | Auth | Own password or manager+ with role constraints |
| DELETE | `/api/users/:id` | Manager+ | Cannot delete equal/higher role |

### Menu

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/menu` | Public | Only `available: true`, sorted by `categoryOrder`, then `createdAt desc` |
| GET | `/api/menu/:id` | Public | Not found -> 404 |
| GET | `/api/menu/admin/all` | Manager+ | Includes unavailable items |
| POST | `/api/menu` | Manager+ | Creates menu item |
| PUT | `/api/menu/:id` | Manager+ | Partial update |
| DELETE | `/api/menu/:id` | Manager+ | Deletes menu item |

### Orders

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/api/orders` | Public | Requires occupied table and matching QR token |
| GET | `/api/orders/pending` | Auth | Sorted by oldest first |
| GET | `/api/orders/served` | Auth | Sorted by oldest first |
| GET | `/api/orders/reports` | Manager+ | Completed orders + aggregated summary |
| GET | `/api/orders` | Auth | All orders, newest first |
| PUT | `/api/orders/:id/serve` | Auth | Allowed only from `pending` |
| PUT | `/api/orders/:id/complete` | Auth | Allowed only from `served`; sets `completedAt` |
| PUT | `/api/orders/:id/cancel` | Auth | Blocked when already `completed` |
| POST | `/api/orders/reset` | Superadmin | Deletes all orders |

### Tables

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/tables` | Auth | Sorted by table number |
| POST | `/api/tables/:tableNumber/activate` | Auth | Requires `available`; generates UUID token + QR data URL |
| POST | `/api/tables/:tableNumber/checkout` | Auth | Requires `occupied`; totals served orders |
| GET | `/api/tables/:tableNumber/orders` | Public | Current session active orders (`pending`, `served`) |
| POST | `/api/tables/:tableNumber/complete-checkout` | Auth | Requires `checkout`; marks served orders completed and resets table |
| POST | `/api/tables/:tableNumber/force-reset` | Auth | Resets table regardless of status |

### Categories

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/categories/order` | Public | Returns merged category order (saved + derived) |
| PUT | `/api/categories/order` | Manager+ | Updates canonical order and syncs `menu.categoryOrder` |

### Messages

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/messages` | Auth | Sorted pinned first, then newest |
| POST | `/api/messages` | Auth | Creates message as current user |
| PUT | `/api/messages/:id` | Auth | Only author can edit |
| PUT | `/api/messages/:id/pin` | Manager+ | Pin message |
| PUT | `/api/messages/:id/unpin` | Manager+ | Unpin message |
| DELETE | `/api/messages/:id` | Auth | Manager+ can delete any; others only own |
| DELETE | `/api/messages/all` | Superadmin | Deletes all messages |

### Service Calls

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/api/service-calls` | Public | Upsert behavior for pending call per table |
| GET | `/api/service-calls/pending` | Employee+ | Oldest first |
| PUT | `/api/service-calls/:id/handle` | Employee+ | Sets `handledAt` |

### Store Info

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/store-info` | Public | Sorted by `order` |
| POST | `/api/store-info` | Manager+ | Creates entry |
| PUT | `/api/store-info/:id` | Manager+ | Store-name entry allows value-only update |
| DELETE | `/api/store-info/:id` | Superadmin | Non-deletable entries return 403 |

---

## Input Validation Notes

- DTO validation uses class-validator with global `ValidationPipe`.
- Unknown fields are rejected (`forbidNonWhitelisted: true`).
- Query params are transformed (`enableImplicitConversion: true`).

Special note for reports endpoint:

- `period` supports `today | week | month | custom | all`.
- Current implementation does not hard-fail missing `startDate/endDate` when `period=custom`; service falls back to no custom date filter in that case.

---

## Integration Recommendations

1. Consume Swagger/OpenAPI for typed client generation.
2. Treat envelope (`success`, `data`, `error`) as stable wire contract.
3. Handle 401/403/409/422 explicitly in frontend/API gateway code.
4. For long-lived sessions, implement refresh token rotation support.
