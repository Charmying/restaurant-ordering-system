# System Architecture

This document defines backend architecture decisions that are expected to remain stable across features.

---

## Technology Profile

| Layer | Choice | Why |
|---|---|---|
| Framework | NestJS 11 (Express adapter) | Strong module boundary, DI, guard/filter/interceptor model |
| Language | TypeScript 5 | Type-safe contracts for DTOs and services |
| Persistence | MongoDB + Mongoose | Flexible document model for menu/order workflows |
| Auth | JWT (access + refresh) + Passport | Stateless access token with refresh rotation |
| Realtime | Socket.IO via Nest WebSocket gateway | Operationally simple broadcast event model |
| Validation | Joi + class-validator | Startup config safety + request boundary validation |
| API Docs | Swagger/OpenAPI | Generated contract with interactive UI |

---

## Source Structure

```text
src/
    main.ts                  # bootstrap, global middleware/pipes, swagger, CORS
    app.module.ts            # module composition + global providers
    common/                  # decorators, guards, filters, interceptors, policies
    config/                  # env schema validation
    modules/                 # feature modules
    seed/                    # startup and manual seed flow
```

Feature modules use a predictable layout:

```text
<feature>/
    dto/                     # request contracts and validation rules
    enums/                   # domain enums
    schemas/                 # mongoose schemas and indexes
    <feature>.controller.ts  # transport layer
    <feature>.service.ts     # business logic
    <feature>.module.ts      # dependency wiring
```

---

## Runtime Pipeline

Request flow (HTTP):

```text
HTTP request
    -> Helmet middleware
    -> CORS policy
    -> ValidationPipe (whitelist + forbidNonWhitelisted + transform)
    -> JwtAuthGuard (unless @Public)
    -> RolesGuard (when @Roles metadata exists)
    -> Controller
    -> Service
    -> TransformInterceptor (success envelope)
    -> HTTP response
```

Error flow:

```text
Any thrown exception
    -> AllExceptionsFilter
    -> normalized error envelope
```

---

## API Envelope Contract

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

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

Error code mapping is implemented in `src/common/filters/all-exceptions.filter.ts`.

---

## Global Providers

Registered globally in `AppModule`:

| Provider Token | Implementation | Purpose |
|---|---|---|
| `APP_GUARD` | `JwtAuthGuard` | Auth by default |
| `APP_GUARD` | `RolesGuard` | Role hierarchy authorization |
| `APP_FILTER` | `AllExceptionsFilter` | Stable error response model |
| `APP_INTERCEPTOR` | `TransformInterceptor` | Stable success response model |

---

## Cross-Cutting Rules

- All endpoints are prefixed with `/api` (`main.ts`).
- Public routes must be explicitly marked with `@Public()`.
- Role requirements must use `@Roles(...)` or `@ManagerOnly()`.
- DTO validation is mandatory for input boundaries.
- Business logic stays in service classes; controllers stay thin.

---

## Realtime Model

- Namespace: `/events`
- Pattern: server-broadcast only (`server.emit`)
- No client-to-server event command API in current design

See `websocket.md` for the complete event catalog.

---

## Configuration Boundaries

- Environment variables are validated before app starts.
- Missing required variables fail fast at boot.
- CORS origin list is derived from `FRONTEND_URL` and normalized by splitting commas and trimming values.

---

## Documentation Invariants

If any of these change, `architecture.md` must be updated in the same PR:

1. Global middleware/guards/filter/interceptor behavior
2. API envelope shape
3. Module-level boundaries
4. Realtime communication pattern
