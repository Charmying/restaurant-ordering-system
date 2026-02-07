# Color System

A semantic color system designed for light and dark themes. Tokens are defined as CSS variables in `frontend/src/styles.css` and applied via the `data-theme` attribute on `<html>`.

## Core Principles

- **Semantic tokens**: use intent-based variables (e.g., surface, text, border)
- **Theme parity**: light/dark values stay structurally aligned
- **Consistency**: shared spacing, transitions, and radii
- **Clarity**: maintain readable contrast across states

---

## Base Tokens

### Surface

```css
--surface: 255 255 255;
--surface-elevated: 245 245 247;
--surface-muted: 235 235 238;
```

### Text

```css
--text-primary: 17 17 17;
--text-secondary: 85 85 85;
```

### Border

```css
--border: 220 220 224;
```

---

## Interactive Elements

### Brand / Accent

```css
--primary: 17 24 39;
--primary-contrast: 255 255 255;
--accent: 59 130 246;
--accent-contrast: 255 255 255;
```

---

## Status Colors

### Destructive

```css
--destructive: 255 59 48;
--destructive-bg: 255 245 244;
```

### Ranking / Pinned (Dashboard)

```css
--rank-1-bg: 254 249 195;
--rank-1-text: 133 77 14;
--rank-2-bg: 229 231 235;
--rank-2-text: 55 65 81;
--rank-3-bg: 254 215 170;
--rank-3-text: 154 52 18;

--pinned-bg: 255 251 235;
--pinned-border: 251 191 36;
--pinned-text: 146 64 14;
--pinned-badge-bg: 254 243 199;
--pinned-badge-text: 120 53 15;
--pinned-icon: 217 119 6;
```

---

## Effects

### Shadows

- Card: `shadow-2xl`
- Button: `shadow-lg` → `shadow-xl` on hover
- Modal: `shadow-2xl` with backdrop blur

### Transitions

- Duration: `200ms` (fast), `300ms` (standard)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Scale: `scale-[1.03]` (hover), `scale-[0.98]` (active)

### Radius

- `rounded-lg`, `rounded-xl`, `rounded-2xl` used across layouts

### Scrollbar

Scrollbar styling is handled by platform defaults; avoid custom styling unless required for accessibility.

---

## Usage Guidelines

1. **Always use CSS variables** for colors
2. **Prefer semantic names** over color names
3. **Test both themes** before shipping
4. **Validate contrast** for critical text
5. **Use transitions** for theme switches

---

## Contrast Requirements

- Target **WCAG AA** by default (4.5:1 for normal text, 3:1 for large text)
- Use **text-primary** on surface tokens for primary content
- Avoid using accent colors for long-form text

---

## Theme Implementation

Themes are driven by CSS variables in `frontend/src/styles.css`:

- Light theme: `:root { ... }`
- Dark theme: `[data-theme='dark'] { ... }`

Theme switching is handled by the frontend `ThemeService`, which applies the `data-theme`
attribute on `<html>` and persists the user's preference.

---

## Usage Examples

### In Component Styles

```css
.card {
  background-color: rgb(var(--surface-elevated));
  color: rgb(var(--text-primary));
  border: 1px solid rgb(var(--border));
}
```

### In Templates (Tailwind Arbitrary Values)

```html
<div class="bg-[rgb(var(--surface-elevated))] text-[rgb(var(--text-primary))]">
  Content
</div>
```
