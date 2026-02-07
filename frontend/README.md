# Frontend

Angular 21 frontend for the restaurant ordering system. The codebase favors standalone components, signal-based state, and route-driven layouts to keep UI flows explicit and composable.

---

## Quick Start

```bash
npm install
npm start
```

---

## Architecture Highlights

- Standalone components and Angular signals for UI state and derived data.
- Route-driven layouts: `normal`, `order`, and `admin` (dashboard) flows are separated by layout shells.
- Most dashboard features follow a consistent pattern: `component` + `service` (state/data) + `presenter` (formatting) + `types` + `mock`. Simpler pages (e.g. home/login) are component-only, and the ordering flow uses a smaller set of files.
- Shared utilities live in `src/app/shared/utils` to keep formatting and calculations pure and reusable.
- Core UI components (e.g. modals, toggles) live in `src/app/core/components` for reuse across layouts.
- Composable logic (signal-based hooks) lives in `src/app/core/composables` to keep state logic portable.
- i18n via `@ngx-translate/core` with JSON resources under `public/assets/i18n`.
- Theming via CSS variables and a shared `ThemeService`, with `data-theme` on `<html>`.

See `docs/i18n.md` and `../docs/color-system.md` for details.

---

## Routing & Layouts

The application is composed through nested routes:

- `/` → `NormalLayoutComponent` → `HomeComponent`
- `/order` → `OrderLayoutComponent` → `OrderComponent`
- `/login` → `NormalLayoutComponent` → `LoginComponent`
- `/dashboard` → `AdminLayoutComponent` → `DashboardShell` → lazy-loaded feature pages

---

## Structure

```text
frontend/
├── docs/                                 # Frontend documentation
│   ├── dependencies.md                   # npm dependencies and their responsibilities
│   ├── i18n.md                           # Internationalization (i18n) usage guide
│   └── setup.md                          # Angular CLI initialization and local setup
├── public/                               # Static assets (copied to dist/ during build)
│   └── assets/
│       └── i18n/                         # Translation resources (en.json, zh.json)
├── src/
│   ├── app/
│   │   ├── core/                         # Layout shells, shared UI, and core services
│   │   │   ├── admin-layout/             # Admin dashboard layout
│   │   │   ├── normal-layout/            # Standard page layout
│   │   │   ├── order-layout/             # Customer ordering flow layout
│   │   │   ├── components/               # Shared UI components (modals, language/theme toggles, etc.)
│   │   │   ├── composables/              # Reusable logic units (signal-based hooks)
│   │   │   └── services/                 # Core services (language, theme, etc.)
│   │   ├── features/
│   │   │   ├── dashboard/                # Admin shell with sidebar navigation
│   │   │   ├── home/                     # Home / landing page
│   │   │   ├── login/                    # Admin authentication
│   │   │   ├── order/                    # Customer ordering flow
│   │   │   ├── table-management/         # Table management
│   │   │   ├── order-management/         # Order lifecycle management
│   │   │   ├── menu-management/          # Menu management
│   │   │   ├── category-management/      # Menu category management
│   │   │   ├── store-info/               # Restaurant/store configuration
│   │   │   ├── message-board/            # Announcements / message board
│   │   │   ├── business-reports/         # Business analytics and reports
│   │   │   └── user-management/          # User control management
│   │   ├── shared/
│   │   │   └── utils/                    # Shared utility functions (pure logic, no UI dependencies)
│   │   ├── app.config.ts                 # Global application configuration
│   │   ├── app.routes.ts                 # Application routing configuration
│   │   ├── app.ts                        # Root application component
│   │   ├── app.html                      # Root application template
│   │   └── app.css                       # Root-level styles
│   ├── index.html
│   ├── main.ts                           # Application entry point
│   └── styles.css                        # Global styles and design system tokens
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

```text
feature-name/
├── feature-name.component.ts       # UI logic
├── feature-name.component.html     # Template
├── feature-name.component.scss     # Styles
├── feature-name.service.ts         # State management
├── feature-name.presenter.ts       # Formatting/presentation
├── feature-name.types.ts           # Type definitions
└── feature-name.mock.ts            # Mock data
```

---

## Related Docs

- [i18n Naming Conventions](../docs/architecture/i18n-naming.md)
- [Color System](../docs/color-system.md)
- [Dependencies Reference](./docs/dependencies.md)
- [Frontend i18n Usage](./docs/i18n.md)
- [Frontend Setup Guide](./docs/setup.md)
