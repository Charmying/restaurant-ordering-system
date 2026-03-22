# Frontend documentation (repository `frontend/docs`)

**English** | [繁體中文](./README.zh-TW.md)

## Scope

This directory is a **hub under `frontend/`**: it holds the **default client’s** shared setup and dependency notes (`SETUP` / `DEPENDENCIES` today target **`angular-app/`**). It does **not** replace per-framework documentation inside each app.

When you add **`react-app/`**, **`vue-app/`**, etc.: add **`README.md`** and, if needed, **`docs/`** inside that folder for framework-specific build, routing, and testing. Then link it from here and from **[`../README.md`](../README.md)**. Product-wide or design-wide rules stay in the repository root **`docs/`** (colors, i18n key naming, page descriptions).

---

## Index

### Getting started
- [**Setup**](./SETUP.md) — Local development, commands, troubleshooting
- [**Dependencies**](./DEPENDENCIES.md) — npm packages and rationale (`angular-app/package.json`)

### App-specific (Angular)
- [**Angular app overview**](../angular-app/README.md)
- [**i18n (ngx-translate)**](../angular-app/docs/I18N.md) — Implementation in Angular only

---

## Related (repository root)

- [System documentation](../../docs/README.md)
- [i18n key naming](../../docs/architecture/i18n-naming.md)
