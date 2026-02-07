# Restaurant Ordering System

A restaurant ordering system frontend built with modern web technologies, emphasizing scalability, maintainability, and developer experience.

---

## Overview

This repository currently contains a fully implemented frontend and system documentation. The backend boundary is reserved but not implemented yet.

- **Customer Ordering** — QR code entry and ordering UI
- **Admin Dashboard** — Management UI for tables, orders, menu, categories, store info, messages, reports, and users
- **Multi-language Support** — i18n-ready architecture
- **Theme System** — Light/dark mode with semantic tokens

---

## Architecture Principles

### 1. Separation of Concerns
- Clear boundaries between frontend, backend, and documentation
- Feature-based organization within each boundary
- Shared utilities for cross-cutting concerns

### 2. Type Safety
- TypeScript strict mode enabled
- Explicit type definitions for all domain models
- No implicit any types

### 3. Scalability
- Lazy-loaded routes for optimal bundle size
- Signal-based reactivity for fine-grained updates
- Modular feature architecture

### 4. Developer Experience
- Consistent naming conventions
- Self-documenting code structure
- Project documentation in `docs/` and `frontend/docs/`

---

## Structure

```text
restaurant-ordering-system/
├── backend/              # Server-side boundary
├── docs/                 # System-level documentation
│   ├── architecture/     # Architectural decision records (ADRs)
│   ├── color-system.md   # Design system tokens and guidelines
│   └── README.md         # Documentation index
├── frontend/             # Client-side boundary
│   ├── docs/             # Frontend-specific documentation
│   ├── src/              # Application source code
│   └── README.md         # Frontend setup and architecture
└── README.md             # This file
```

---

## Technology Stack

### Frontend
- **Framework**: Angular 21 (standalone components, signals)
- **Styling**: Tailwind CSS v4 with semantic design tokens
- **i18n**: @ngx-translate/core with JSON resources
- **Testing**: Vitest + jsdom
- **Build**: esbuild-based Angular CLI

---

## Documentation

- [i18n Naming Conventions](./docs/architecture/i18n-naming.md)
- [Color System](./docs/color-system.md)
- [Frontend Architecture](./frontend/README.md)
- [Dependencies Reference](./frontend/docs/dependencies.md)
- [Frontend i18n Usage](./frontend/docs/i18n.md)
- [Frontend Setup Guide](./frontend/docs/setup.md)
