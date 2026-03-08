# Frontend

**English** | [繁體中文](./README.zh-TW.md)

Angular 21 enterprise-grade frontend for the restaurant ordering system. Modern architecture with standalone components, signal-based state management, and route-driven layouts.

---

## 🚀 Quick Start

```bash
npm install
npm start
# App runs on http://localhost:4200
```

---

## 🏗️ Architecture Highlights

### Modern Angular Patterns
- **Standalone Components** — No NgModules, cleaner component definitions
- **Signal-Based State** — Reactive state management with Angular signals
- **Route-Driven Layouts** — Layout shells composed through routing
- **Type Safety** — Strict TypeScript with comprehensive type definitions

### Architectural Organization
- **Feature-Based Structure** — Each domain has its own organized folder
- **Separation of Concerns** — Clear boundaries between UI, state, and presentation
- **Shared Utilities** — Pure functions and reusable logic
- **Core Components** — Reusable UI building blocks

---

## 🛣️ Routing & Layout System

The application uses nested routes with layout shells:

### Route Structure
```text
/                    → NormalLayoutComponent → HomeComponent
/order               → OrderLayoutComponent → OrderComponent  
/login               → NormalLayoutComponent → LoginComponent
/dashboard           → AdminLayoutComponent → DashboardShell
/dashboard/*         → AdminLayoutComponent → Lazy-loaded features
```

### Layout Shells
- **NormalLayout** — Standard pages (home, login, public content)
- **OrderLayout** — Customer ordering flow with specialized navigation
- **AdminLayout** — Dashboard with sidebar navigation and admin features

---

## 📁 Project Structure

```text
frontend/
├── docs/                                 # Frontend documentation
│   ├── DEPENDENCIES.md                   # npm dependencies
│   ├── I18N.md                           # Internationalization guide
│   └── SETUP.md                          # Development setup
├── public/                               # Static assets
│   └── assets/
│       └── i18n/                         # Translation files (en.json, zh.json)
├── src/
│   ├── app/
│   │   ├── core/                         # Core infrastructure
│   │   │   ├── admin-layout/             # Admin dashboard layout
│   │   │   ├── normal-layout/            # Standard page layout
│   │   │   ├── order-layout/             # Customer ordering layout
│   │   │   ├── components/               # Reusable UI components
│   │   │   ├── composables/              # Signal-based logic
│   │   │   └── services/                 # Core services
│   │   ├── features/                     # Feature modules
│   │   │   ├── dashboard/                # Admin shell
│   │   │   ├── home/                     # Landing page
│   │   │   ├── login/                    # Authentication
│   │   │   ├── order/                    # Customer ordering
│   │   │   ├── table-management/         # Table management
│   │   │   ├── order-management/         # Order management
│   │   │   ├── menu-management/          # Menu management
│   │   │   ├── category-management/      # Category management
│   │   │   ├── store-info/               # Store configuration
│   │   │   ├── message-board/            # Staff communications
│   │   │   ├── business-reports/         # Analytics
│   │   │   └── user-management/          # User management
│   │   ├── shared/                       # Shared utilities
│   │   ├── app.config.ts                 # App configuration
│   │   ├── app.routes.ts                 # Route definitions
│   │   └── app.ts                        # Root component
│   ├── index.html                        # HTML entry point
│   ├── main.ts                           # Bootstrap entry
│   └── styles.css                        # Global styles & design tokens
├── angular.json                          # Angular CLI config
├── package.json                          # Dependencies
└── README.md                             # This file
```

### Feature Pattern
Each feature follows a consistent organization:

```text
feature-name/
├── feature-name.component.ts             # UI component logic
├── feature-name.component.html           # Component template
├── feature-name.component.scss           # Component styles
├── feature-name.service.ts               # State management
├── feature-name.presenter.ts             # Data formatting
├── feature-name.types.ts                 # Type definitions
└── feature-name.mock.ts                  # Mock data
```

---

## 🎨 Design System & Theming

### Semantic Color System
Sophisticated color system with CSS variables defined in `src/styles.css`:

- **Surface Tokens** — Background colors for different elevation levels
- **Text Tokens** — Hierarchical text colors for readability
- **Interactive Tokens** — Brand colors, accents, and interactive states
- **Status Tokens** — Semantic colors for success, warning, error, and info

### Theme Implementation
- **Light/Dark Themes** — Complete theme parity with semantic tokens
- **Theme Switching** — Instant theme switching with smooth transitions
- **Persistent Preferences** — User theme choice saved in localStorage
- **CSS Variables** — Theme values driven by CSS custom properties

### Styling Architecture
- **Tailwind CSS v4** — Utility-first styling with custom design tokens
- **Component Styles** — Scoped SCSS for component-specific styling
- **Global Styles** — Design tokens and base styles in `styles.css`
- **Responsive Design** — Mobile-first responsive breakpoints

---

## 🌍 Internationalization (i18n)

### Translation System
- **@ngx-translate/core** — JSON-based translation system
- **Structural Keys** — Semantic translation key organization
- **Language Persistence** — User language preference saved locally
- **Fallback Support** — Graceful fallback to default language

### Translation Resources
```text
public/assets/i18n/
├── en.json           # English translations
└── zh.json           # Chinese translations
```

### Key Organization
Translation keys follow structural patterns:
- `layout.*` — Cross-cutting UI structure
- `common.*` — Shared actions and messages
- `features.*` — Domain-specific functionality
- `language.*` — Language toggle labels

### Implementation Examples
```typescript
// Template usage
{{ 'layout.header.title' | translate }}

// Programmatic usage
this.translate.instant('features.order.item.add')
```

---

## 🔧 Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

---

## 📊 State Management

### Signal-Based Architecture
- **Component State** — Local component state with signals
- **Service State** — Shared state managed in services
- **Derived State** — Computed values with `computed()` signals
- **Effects** — Side effects with `effect()` signals

### Data Flow Patterns
1. **Component → Service** — User actions trigger service methods
2. **Service → API** — Services handle backend communication
3. **Service → Component** — Signals update component state
4. **Component → View** — Template reacts to signal changes

---

## 🔌 API Integration

### HTTP Communication
- **Angular HTTP Client** — Standard HTTP operations
- **Typed Responses** — Strongly typed API responses
- **Error Handling** — Centralized error handling and user feedback
- **Request Interceptors** — Authentication and logging

### Real-time Updates
- **WebSocket Integration** — Real-time order and status updates
- **Event Handling** — Reactive event processing
- **Connection Management** — Automatic reconnection and error recovery

---

## 🎯 Performance Optimization

### Bundle Optimization
- **Lazy Loading** — Route-based code splitting
- **Tree Shaking** — Elimination of unused code
- **Asset Optimization** — Image and resource optimization
- **Build Optimization** — Production build optimizations

### Runtime Performance
- **Signal Efficiency** — Fine-grained reactivity updates
- **OnPush Strategy** — Optimized change detection
- **Virtual Scrolling** — Efficient list rendering
- **Image Loading** — Progressive and lazy image loading

---

## 📚 Related Documentation

### Frontend Documentation
- [**Dependencies Reference**](./docs/DEPENDENCIES.md) — npm packages and usage
- [**i18n Implementation**](./docs/I18N.md) — Translation system details
- [**Setup Guide**](./docs/SETUP.md) — Development environment setup

### System Documentation
- [**Architecture Overview**](../docs/README.md) — System-level architecture
- [**Color System**](../docs/color-system.md) — Design tokens and theming
- [**i18n Conventions**](../docs/architecture/i18n-naming.md) — Translation standards
- [**Page Function Description**](../docs/page-function-description/page-function-description.md) — Page functionality overview

### Backend Documentation
- [**Backend Architecture**](../backend/README.md) — API and server architecture
- [**API Documentation**](../backend/docs/API.md) — REST API reference
- [**WebSocket Events**](../backend/docs/WEBSOCKET.md) — Real-time events
