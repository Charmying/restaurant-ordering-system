# Project Setup and Local Development

The backend is a NestJS service that exposes:

- REST API under `/api/*`
- Swagger UI under `/api/docs`
- Socket.IO namespace under `/events`

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- MongoDB instance (local or Atlas)

Recommended:

- `mongosh` for DB diagnostics
- Postman/Insomnia for API tests

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

macOS/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Fill required variables

At minimum:

- `MONGO_URI`
- `JWT_ACCESS_SECRET` (min 32 chars)
- `JWT_REFRESH_SECRET` (min 32 chars)

### 4. Start development server

```bash
npm run start:dev
```

Default URL: `http://localhost:4000`

Swagger: `http://localhost:4000/api/docs`

---

## Environment Variables

Variables are validated by Joi at startup (`src/config/env.validation.ts`).
Invalid or missing required values stop the process early.

| Variable | Required | Default | Notes |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development`, `production`, `test` |
| `PORT` | No | `4000` | HTTP listen port |
| `MONGO_URI` | Yes | - | MongoDB connection URI |
| `FRONTEND_URL` | No | `http://localhost:4200` | CORS origin source; app also includes `http://localhost:4200` fallback |
| `JWT_ACCESS_SECRET` | Yes | - | Access token secret, min 32 chars |
| `JWT_REFRESH_SECRET` | Yes | - | Refresh token secret, min 32 chars |
| `JWT_ACCESS_EXPIRES_IN` | No | `24h` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | No | `30d` | Refresh token TTL |
| `SUPERADMIN_USERNAME` | No | `Charmy` | Seed superadmin username |
| `SUPERADMIN_PASSWORD` | No | `Charmying` | Seed superadmin password |
| `RESET_SUPERADMIN` | No | `false` | If true, resets existing superadmin credentials on startup |

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run start` | Start app normally |
| `npm run start:dev` | Start with file watcher |
| `npm run start:debug` | Start with debugger + watcher |
| `npm run build` | Compile to `dist` |
| `npm run start:prod` | Run production build |
| `npm run seed` | Run seed process only |
| `npm run lint` | ESLint auto-fix |
| `npm run format` | Prettier format |
| `npm test` | Unit tests |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:cov` | Unit tests with coverage |
| `npm run test:e2e` | End-to-end tests |

---

## Production Boot Sequence

```bash
npm run build
npm run start:prod
```

Production checklist:

1. `NODE_ENV=production`
2. Strong JWT secrets configured
3. `MONGO_URI` points to production cluster
4. `FRONTEND_URL` set to production frontend origin(s)

---

## Troubleshooting

### Port already in use

Set another port in `.env`:

```env
PORT=4001
```

### MongoDB connection failed

```bash
mongosh "mongodb://localhost:27017/restaurant-ordering"
```

### Environment validation failed

Inspect startup logs and compare variables with `src/config/env.validation.ts`.

### Clean reinstall

macOS/Linux:

```bash
rm -rf node_modules package-lock.json dist
npm install
```

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules, dist
Remove-Item -Force package-lock.json
npm install
```
