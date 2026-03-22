# Project Initialization & Local Setup

**English** | [繁體中文](./SETUP.zh-TW.md)

## Monorepo layout

The installable Angular app lives in **`angular-app/`** (under the repository `frontend/` folder). Run every `npm` command below from that directory:

```bash
cd angular-app
```

Package metadata is in `angular-app/package.json` (this repo declares `npm@10.9.4` there).

---

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
- npm (see `angular-app/package.json` for the locked toolchain)
- Modern browser with ES2022 support

---

## Local Development

```bash
cd angular-app
npm install
npm start
```

The dev server runs at `http://localhost:4200/` by default.

---

## Build & Test

```bash
cd angular-app
npm run build
npm test
```

---

## Notes

- Static assets are served from `angular-app/public/` (configured in `angular-app/angular.json`).
- Design tokens live in `angular-app/src/styles.css` and apply through CSS variables.

---

## Troubleshooting

### Port Already in Use
If port 4200 is taken, run:

```bash
cd angular-app
npm start -- --port 4201
```

### Build or Install Errors
Clear cache and reinstall dependencies:

```bash
cd angular-app
rm -rf node_modules package-lock.json
npm install
```
