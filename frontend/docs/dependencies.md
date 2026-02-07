# Dependencies

This document summarizes `package.json` dependencies and how they are used in the frontend.

---

## Runtime Dependencies

### Angular Core

- **@angular/common** — common directives, pipes, and HTTP helpers
- **@angular/compiler** — template compilation
- **@angular/core** — Angular core runtime
- **@angular/forms** — template and reactive forms
- **@angular/platform-browser** — browser-specific rendering
- **@angular/router** — routing, layout composition, and lazy loading

### Internationalization

- **@ngx-translate/core** — translation service and pipes (JSON-based)

### Utilities

- **rxjs** — reactive streams (signals interop and async data)
- **tslib** — TypeScript runtime helpers

---

## Tooling & Build Dependencies

### Build System

- **@angular/build** — application builder (esbuild-based)
- **@angular/cli** — Angular CLI
- **@angular/compiler-cli** — AOT compiler

### Styling

- **tailwindcss** — utility-first CSS (v4)
- **@tailwindcss/postcss** — Tailwind v4 PostCSS integration
- **postcss** — CSS transformation pipeline

### Testing

- **jsdom** — DOM implementation for unit tests
- **vitest** — unit test runner

### Language

- **typescript** — TypeScript compiler

---

## Package Manager

- **npm@10.9.4** — locked package manager version
