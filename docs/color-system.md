# Color System

A semantic, high-contrast color system designed for scalable light and dark themes.

## Core Principles

- **Minimalism**: Black, white, and precise grays
- **Contrast**: WCAG AAA compliance
- **Consistency**: Unified spacing and transitions
- **Refinement**: Subtle shadows and smooth animations

---

## Base Colors

### Background

```css
--bg-primary-light: 255 255 255;      /* #ffffff */
--bg-primary-dark: 0 0 0;             /* #000000 */

--bg-secondary-light: 249 250 251;    /* #f9fafb */
--bg-secondary-dark: 28 28 30;        /* #1c1c1e */
```

### Surface (Cards & Containers)

```css
--surface-light: 255 255 255;         /* #ffffff */
--surface-dark: 28 28 30;             /* #1c1c1e */

--surface-elevated-light: 243 244 246; /* #f3f4f6 */
--surface-elevated-dark: 44 44 46;     /* #2c2c2e */
```

### Border

```css
--border-light: 229 231 235;          /* #e5e7eb */
--border-dark: 56 56 58;              /* #38383a */

--border-subtle-light: 209 213 219;   /* #d1d5db */
--border-subtle-dark: 72 72 74;       /* #48484a */
```

### Text

```css
--text-primary-light: 17 24 39;       /* #111827 */
--text-primary-dark: 255 255 255;     /* #ffffff */

--text-secondary-light: 107 114 128;  /* #6b7280 */
--text-secondary-dark: 152 152 157;   /* #98989d */

--text-tertiary-light: 156 163 175;   /* #9ca3af */
--text-tertiary-dark: 110 110 115;    /* #6e6e73 */
```

---

## Interactive Elements

### Primary Button

```css
--btn-primary-bg-light: 29 29 31;     /* #1d1d1f */
--btn-primary-fg-light: 255 255 255;  /* #ffffff */
--btn-primary-hover-light: 55 65 81;  /* #374151 */

--btn-primary-bg-dark: 245 245 247;   /* #f5f5f7 */
--btn-primary-fg-dark: 0 0 0;         /* #000000 */
--btn-primary-hover-dark: 255 255 255; /* #ffffff */
```

### Secondary Button

```css
--btn-secondary-bg-light: 243 244 246; /* #f3f4f6 */
--btn-secondary-hover-light: 229 231 235; /* #e5e7eb */

--btn-secondary-bg-dark: 44 44 46;     /* #2c2c2e */
--btn-secondary-hover-dark: 58 58 60;  /* #3a3a3c */
```

---

## Status Colors

### Success (Green)

```css
--success-bg-light: 220 252 231;      /* #dcfce7 */
--success-bg-dark: 34 197 94 / 0.2;   /* rgba(34,197,94,0.2) */
--success-fg-light: 22 101 52;        /* #166534 */
--success-fg-dark: 74 222 128;        /* #4ade80 */
```

### Warning (Yellow)

```css
--warning-bg-light: 254 243 199;      /* #fef3c7 */
--warning-bg-dark: 245 158 11 / 0.2;  /* rgba(245,158,11,0.2) */
--warning-fg-light: 146 64 14;        /* #92400e */
--warning-fg-dark: 251 191 36;        /* #fbbf24 */
```

### Error (Red)

```css
--error-bg-light: 254 226 226;        /* #fee2e2 */
--error-bg-dark: 239 68 68 / 0.2;     /* rgba(239,68,68,0.2) */
--error-fg-light: 153 27 27;          /* #991b1b */
--error-fg-dark: 248 113 113;         /* #f87171 */
```

### Info (Blue)

```css
--info-bg-light: 219 234 254;         /* #dbeafe */
--info-bg-dark: 59 130 246 / 0.2;     /* rgba(59,130,246,0.2) */
--info-fg-light: 30 64 175;           /* #1e40af */
--info-fg-dark: 96 165 250;           /* #60a5fa */
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

- Small: `rounded-lg` (8px)
- Medium: `rounded-xl` (12px)
- Large: `rounded-2xl` (16px)

### Scrollbar

```css
/* Light */
track: transparent
thumb: rgba(0, 0, 0, 0.15)
thumb-hover: rgba(0, 0, 0, 0.25)

/* Dark */
track: transparent
thumb: rgba(255, 255, 255, 0.15)
thumb-hover: rgba(255, 255, 255, 0.25)
```

---

## Usage Guidelines

1. **Always use CSS variables** for colors
2. **Prefer semantic names** over color names
3. **Test both themes** before shipping
4. **Maintain contrast ratios** ≥ 7:1 for text
5. **Use transitions** for all theme switches
