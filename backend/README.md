# Backend

NestJS backend for the restaurant ordering system.

This service provides the API layer of the system and is structured around domain-based modules.

---

## Quick Start

```bash
npm install
npm run start
```

---

## Architecture Highlights

- Domain-oriented module structure under `src/modules`.
- Shared cross-cutting concerns (guards, filters, interceptors, decorators) live under src/common.
- DTOs and persistence schemas are kept separate to avoid coupling transport and storage models.
- Configuration and environment handling are centralized under src/config.

---

## Structure

```text
backend/
├── src/
│   ├── common/            # Shared guards, filters, interceptors, and utilities
│   ├── config/            # Application configuration
│   ├── modules/           # Domain modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── orders/
│   │   ├── menu/
│   │   ├── categories/
│   │   ├── tables/
│   │   └── store-info/
│   ├── seed/              # Seed data and scripts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── package.json
└── README.md
```

---

## Status

This backend is in an early development stage.
Core infrastructure and domain modules are being implemented incrementally.
