# i18n Naming Convention

## Principles

1. **Keys represent structural intent, not UI copy**

    - Keys describe where and why, not what the text says

2. **Do not use visible text as keys**

    - ❌ `home.customerOrdering`
    - ✅ `page.home.entry.customer`

3. **Group by architectural layer**

    - `layout.*` — Cross-cutting UI structure
    - `common.*` — Shared UI actions, statuses, and messages
    - `features.*` — Domain-specific functionality (current codebase)
    - `language.*` — Language toggle labels

4. **Keys should be self-documenting**

    - You should know where it's used without seeing the UI

---

## Structure

```text
layout.{component}.{element}
common.{action|status|message}
features.{domain}.{section}.{element}
language.{section}.{element}
```

---

## Examples

### Layout (Shared across pages)

```text
layout.header.title
```

### Common (Shared actions and statuses)

```text
common.cancel
common.save
common.processing
common.noData
```

### Feature

```text
features.home.hero.title
features.home.hero.subtitle
features.home.entry.customer
features.home.entry.admin
features.home.entry.customer.comingSoon
features.home.entry.admin.comingSoon
```

---

## Usage in Templates

```html
<div>
  {{ 'layout.header.title' | translate }}
</div>

<button disabled>
  {{ 'features.home.entry.customer' | translate }}
  <small>{{ 'features.home.entry.customer.comingSoon' | translate }}</small>
</button>
```

---

## Naming Conflicts

If a key could belong to multiple domains, prefer:

1. `common.*` only for universal UI actions/statuses/messages
2. `layout.*` when it's part of a shared layout shell
3. `features.*` for everything else (default)

---

## Current Language Files

- `frontend/public/assets/i18n/en.json`
- `frontend/public/assets/i18n/zh.json`

---

## Why This Matters

- **Scalability**: 10,000 keys remain organized
- **Refactoring**: Change UI text without touching code
- **Collaboration**: Translators understand context
- **Maintenance**: No ambiguity about key purpose

---

## Existing Key Shapes

The current translation files include some leaf keys that contain dots (e.g. `features.home.entry.customer.description`). These keys are used by referencing the full string key in templates and services.
