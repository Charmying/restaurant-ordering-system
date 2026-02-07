# Project Initialization & Local Setup

This frontend was initialized with Angular CLI and Tailwind CSS support.

```bash
npx @angular/cli@latest new restaurant-ordering-system
```

Selected options:

- Stylesheet system: Tailwind CSS
- Server-Side Rendering (SSR): No
- AI tooling: None

---

## Prerequisites

- Node.js (required for Angular CLI)
- npm (project declares `npm@10.9.4` in `package.json`)
- Modern browser with ES2022 support

---

## Local Development

```bash
npm install
npm start
```

The dev server runs at `http://localhost:4200/` by default.

---

## Build & Test

```bash
npm run build
npm test
```

---

## Notes

- Static assets are served from `public/` (configured in `angular.json`).
- Design tokens live in `src/styles.css` and apply through CSS variables.

---

## Troubleshooting

### Port Already in Use

If port 4200 is taken, run:

```bash
npm start -- --port 4201
```

### Build or Install Errors

Clear cache and reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```
