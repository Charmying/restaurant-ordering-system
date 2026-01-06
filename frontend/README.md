# Frontend

This directory represents the frontend boundary of the system.

---

## Technology Stack

- Framework: Angular
- Language: TypeScript
- Styling: Tailwind CSS

---

## Architecture Concerns

### Internationalization (i18n)

The frontend uses `@ngx-translate/core` for internationalization.

- Translation files are stored under `public/assets/i18n`
- Structural keys are used instead of text-based keys
- Language state is managed via a shared `LanguageService`
- Default language: `zh`

See `docs/i18n.md` for details.

### Theming (Light / Dark)

The application supports light and dark themes via CSS variables and a shared `ThemeService`.

- Theme state is stored in localStorage
- Initial theme respects system preference
- Theme is applied at the document root level

See `docs/color-system.md` for details.

---

## Structure

```text
frontend/
├── docs/                                 # Frontend documentation
│   ├── dependencies.md                   # npm packages and their purposes
│   ├── i18n.md                           # i18n usage guide
│   └── setup.md                          # Angular CLI create setup
├── public/                               # Static assets (copied to dist/)
│   └── assets/                           # Asset files
│       └── i18n/                         # Translation files (en.json, zh.json)
├── src/                                  # Source code
│   ├── app/                              # Application components
│   │   ├── core/                         # Application shell (layout, guards, core services)
│   │   │   ├── normal-layout/            # Default application layout
│   │   │   │   └── header/               # Layout-specific header component
│   │   │   └── services/                 # Core services
│   │   │       ├── index.ts              # Public service exports
│   │   │       ├── language.service.ts   # Manage active language and persistence
│   │   │       └── theme.service.ts      # Manage theme state (light/dark) and persistence
│   │   ├── features/                     # Feature modules
│   │   │   └── home/                     # Home page component
│   │   ├── app.config.ts                 # Application configuration
│   │   ├── app.routes.ts                 # Route definitions
│   │   └── app.ts                        # Root component
│   ├── index.html                        # Main HTML template
│   ├── main.ts                           # Application entry point
│   └── styles.css                        # Global styles
├── angular.json                          # Angular CLI configuration
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
└── README.md
```
