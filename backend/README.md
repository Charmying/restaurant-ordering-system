# Backend (server applications)

**English** | [繁體中文](./README.zh-TW.md)

This folder hosts HTTP and real-time services. The active implementation is **`node-api/`** (NestJS + MongoDB). Additional services (for example `java-api/`) can be added as siblings later.

---

## Documentation

| Location | Contents |
|----------|----------|
| [`docs/`](./docs/README.md) | **node-api** engineering docs (API, DB, auth, WebSocket, ops); other services get sibling `*/docs` + links |
| [`node-api/README.md`](./node-api/README.md) | NestJS package overview and quick start |

All commands in `docs/SETUP.md` assume the working directory is **`node-api/`** unless noted otherwise.

---

## Quick start (Node API)

```bash
cd node-api
npm install
cp .env.example .env
# edit .env
npm run start:dev
```

See [`docs/SETUP.md`](./docs/SETUP.md) for details.
