# Authentication and Authorization

The backend uses dual JWT tokens (access + refresh) and role hierarchy authorization.

---

## Design Goals

1. Keep request authentication stateless (access token).
2. Allow long-lived sessions with token rotation (refresh token).
3. Apply deny-by-default API access with explicit public routes.
4. Enforce role rules centrally via guard + policy logic.

---

## Authentication Lifecycle

### Login

`POST /api/auth/login`

- Validates username/password.
- Compares password against bcrypt hash (12 rounds).
- Issues access + refresh tokens.
- Persists refresh token on user record.

### Refresh

`POST /api/auth/refresh`

- Verifies refresh token signature.
- Finds user and validates token against stored refresh token.
- Rotates both access and refresh tokens.
- Replaces persisted refresh token.

### Authenticated Request

- `JwtAuthGuard` validates access token.
- `JwtStrategy` validates user existence.
- `RolesGuard` enforces role metadata when present.

### Logout

`POST /api/auth/logout`

- Clears stored refresh token.
- Existing access token remains valid until expiry.

---

## Token Configuration

| Token | Secret env | Expiry env | Default |
|---|---|---|---|
| Access | `JWT_ACCESS_SECRET` | `JWT_ACCESS_EXPIRES_IN` | `24h` |
| Refresh | `JWT_REFRESH_SECRET` | `JWT_REFRESH_EXPIRES_IN` | `30d` |

Secrets must be at least 32 chars by env validation schema.

---

## JWT Payload Contract

```typescript
interface JwtPayload {
  userId: string;
  username: string;
  role: 'employee' | 'manager' | 'superadmin';
}
```

Payload is used by guards and `@CurrentUser(...)` decorator extraction.

---

## Authorization Model

Role hierarchy (`ROLE_HIERARCHY`):

- `employee` = 1
- `manager` = 2
- `superadmin` = 3

Policy check:

```text
hasSufficientRole(userRole, requiredRole)
=> ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
```

---

## Guard Behavior

### `JwtAuthGuard` (global)

- Applies to all routes unless `@Public()`.
- Reads bearer token from `Authorization` header.

### `RolesGuard` (global)

- Executes after auth guard.
- If no `@Roles(...)` metadata exists, passes.
- If roles are defined, user must satisfy at least one required role after hierarchy expansion.

---

## Decorators

- `@Public()` - bypasses JWT guard
- `@Roles(...roles)` - route-level authorization requirement
- `@ManagerOnly()` - shorthand for `@Roles(manager)`
- `@CurrentUser(field?)` - extracts payload or payload field

---

## Security Controls In Place

| Control | Implementation |
|---|---|
| Password hashing | bcrypt pre-save hook (12 rounds) |
| Hidden sensitive fields | `password` and `refreshToken` use `select: false` |
| Output sanitization | user schema `toJSON` removes sensitive fields |
| Refresh invalidation | stored refresh token removed on logout |
| Refresh rotation | refresh endpoint issues and stores a new refresh token |
| HTTP headers hardening | Helmet middleware |
| CORS | origin allowlist derived from config |

---

## Operational Recommendations

1. Use short access token lifetime in production.
2. Use strong random secrets from a secret manager.
3. Rotate JWT secrets through planned maintenance windows.
4. Monitor spikes of 401/403 as potential auth attack signals.
