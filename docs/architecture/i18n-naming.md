# i18n Naming Convention

## Principles

1. **Keys represent structural intent, not UI copy**
   - Keys describe where and why, not what the text says
   
2. **Do not use visible text as keys**
   - ❌ `home.customerOrdering`
   - ✅ `page.home.entry.customer`

3. **Group by architectural layer**
   - `layout.*` — Cross-cutting UI structure
   - `page.*` — Page-level content
   - `feature.*` — Domain-specific functionality

4. **Keys should be self-documenting**
   - You should know where it's used without seeing the UI

---

## Structure

```
layout.{component}.{element}
page.{pageName}.{section}.{element}
feature.{domain}.{action|state}
```

---

## Examples

### Layout (Shared across pages)
```
layout.header.title
```

### Feature
```
features.home.title
features.home.description
features.home.entry.customer
features.home.entry.admin
features.home.entry.customer.comingSoon
features.home.entry.admin.comingSoon
```

---

## Usage in Templates

```html
<div>{{ 'layout.header.title' | translate }}</div>

<button disabled>
  {{ 'page.home.entry.customer' | translate }}
  <small>{{ 'page.home.entry.customer.comingSoon' | translate }}</small>
</button>
```

---

## Why This Matters

- **Scalability**: 10,000 keys remain organized
- **Refactoring**: Change UI text without touching code
- **Collaboration**: Translators understand context
- **Maintenance**: No ambiguity about key purpose
