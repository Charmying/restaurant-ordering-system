# Dependency Architecture

This document explains why dependencies exist and the constraints for introducing new ones.

---

## Runtime Dependencies

### Platform

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
    - framework runtime, DI, controller/guard/filter/interceptor primitives

### Configuration

- `@nestjs/config`
    - typed configuration access in services
- `joi`
    - startup-time environment contract validation

### Data Layer

- `@nestjs/mongoose`, `mongoose`
    - schema definitions, model injection, query and aggregation

### Auth

- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`
    - JWT signing/verification and authentication strategy integration

### Realtime

- `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`
    - server-side event broadcasting namespace

### API Documentation

- `@nestjs/swagger`
    - OpenAPI generation and Swagger UI

### Security and Validation

- `bcryptjs`
    - password hashing
- `helmet`
    - HTTP header hardening
- `class-validator`, `class-transformer`
    - DTO validation and request transformation

### Utilities

- `qrcode`
    - QR image generation for table activation flow
- `uuid`
    - session token generation
- `reflect-metadata`, `rxjs`
    - NestJS runtime ecosystem requirements

---

## Development Dependencies

### Toolchain

- `@nestjs/cli`, `@nestjs/schematics`
- `typescript`, `ts-node`, `tsconfig-paths`

### Code Quality

- `eslint`, `@eslint/js`, `typescript-eslint`
- `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`
- `globals`

### Testing

- `@nestjs/testing`, `jest`, `ts-jest`, `supertest`

### Typings

- `@types/*` packages for runtime libraries and test tooling

---

## Dependency Governance Rules

1. Add dependencies only for clear capability gaps, not convenience.
2. Prefer mature and widely maintained libraries.
3. Minimize overlap (do not add parallel libraries for same concern).
4. Keep runtime dependency surface small to reduce security and upgrade risk.
5. For each new dependency, document:
    - why built-in code is insufficient
    - where it is used
    - expected long-term maintenance burden

---

## Upgrade Strategy

1. Update dependencies in focused PRs.
2. Run:
    - lint
    - unit tests
    - e2e tests (when endpoint behavior may change)
3. Re-verify:
    - auth flows
    - seed flow
    - websocket event emission
4. Update docs if behavior or configuration changed.
