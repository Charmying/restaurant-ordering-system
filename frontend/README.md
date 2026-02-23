# Frontend

Angular 21 enterprise-grade frontend for the restaurant ordering system. This client application demonstrates modern Angular architecture with standalone components, signal-based state management, and route-driven layouts to deliver exceptional user experiences and developer productivity.

---

## 🚀 Quick Start

```bash
npm install
npm start
```

The application will be available at `http://localhost:4200/`

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

The application uses nested routes with layout shells for different user experiences:

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

## 📁 Detailed Structure

### High-Level Organization
```text
frontend/
├── docs/                                 # Frontend documentation
│   ├── dependencies.md                   # npm dependencies and responsibilities
│   ├── i18n.md                           # Internationalization implementation guide
│   └── setup.md                          # Local development setup and troubleshooting
├── public/                               # Static assets (copied to dist/)
│   └── assets/
│       └── i18n/                         # Translation resources (en.json, zh.json)
├── src/
│   ├── app/
│   │   ├── core/                         # Core infrastructure
│   │   ├── features/                     # Feature modules
│   │   ├── shared/                       # Shared utilities
│   │   ├── app.config.ts                 # Application configuration
│   │   ├── app.routes.ts                 # Route definitions
│   │   ├── app.ts                        # Root component
│   │   ├── app.html                      # Root template
│   │   └── app.css                       # Root styles
│   ├── index.html                        # HTML entry point
│   ├── main.ts                           # Bootstrap entry point
│   └── styles.css                        # Global styles and design tokens
├── angular.json                          # Angular CLI configuration
├── package.json                          # Dependencies and scripts
└── README.md                             # This file
```

### Core Infrastructure (`src/app/core/`)
```text
core/
├── admin-layout/             # Admin dashboard layout shell
├── normal-layout/            # Standard page layout shell  
├── order-layout/             # Customer ordering layout shell
├── components/               # Reusable UI components
│   ├── modals/              # Dialog and modal components
│   ├── language-toggle/     # Language switcher
│   └── theme-toggle/        # Theme switcher
├── composables/              # Reusable signal-based logic
└── services/                 # Core application services
    ├── language.service.ts  # Language management
    └── theme.service.ts     # Theme management
```

### Feature Modules (`src/app/features/`)
```text
features/
├── dashboard/                # Admin shell with sidebar navigation
├── home/                     # Landing page and entry points
├── login/                    # Admin authentication
├── order/                    # Customer ordering flow
├── table-management/         # Restaurant table management
├── order-management/         # Order lifecycle management
├── menu-management/          # Menu and item management
├── category-management/      # Menu category organization
├── store-info/               # Restaurant configuration
├── message-board/            # Staff communications
├── business-reports/         # Analytics and reporting
└── user-management/          # Staff and role management
```

### Feature Pattern
Each feature follows a consistent organization pattern:

```text
feature-name/
├── feature-name.component.ts       # UI component logic
├── feature-name.component.html     # Component template
├── feature-name.component.scss     # Component-specific styles
├── feature-name.service.ts         # State management and data operations
├── feature-name.presenter.ts       # Data formatting and presentation logic
├── feature-name.types.ts           # TypeScript type definitions
└── feature-name.mock.ts            # Mock data for development/testing
```

---

## 🎨 Design System & Theming

### Semantic Color System
The application uses a sophisticated semantic color system with CSS variables defined in `src/styles.css`:

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

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Code Quality
- **ESLint** — Code linting and consistency
- **Prettier** — Code formatting and style
- **TypeScript** — Type checking and compilation
- **Angular CLI** — Scaffolding and build tooling

### Testing Strategy
- **Vitest** — Fast unit test runner
- **jsdom** — DOM environment for testing
- **Component Testing** — Isolated component unit tests
- **Integration Testing** — Feature and workflow testing

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

### State Management Examples
```typescript
// Service state
private orders = signal<Order[]>([]);

// Computed state
readonly activeOrders = computed(() => 
  this.orders().filter(order => order.status === 'active')
);

// Component usage
orders = this.orderService.activeOrders;
```

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

### Data Models
- **TypeScript Interfaces** — Comprehensive type definitions
- **DTO Mapping** — API response to domain model transformation
- **Validation** — Client-side data validation

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

### Monitoring & Analytics
- **Performance Metrics** — Runtime performance monitoring
- **Error Tracking** — Comprehensive error logging
- **User Analytics** — User interaction tracking

---

## 🔐 Security Considerations

### Client-Side Security
- **Input Sanitization** — XSS prevention and input validation
- **Content Security Policy** — Secure content loading policies
- **Authentication Tokens** — Secure token storage and transmission
- **API Security** — Secure API communication patterns

### Data Protection
- **Sensitive Data** — Proper handling of sensitive information
- **Local Storage** — Secure localStorage usage
- **Session Management** — Proper session handling
- **HTTPS Enforcement** — Secure communication requirements

---

## 🧪 Testing Strategy

### Unit Testing
- **Component Tests** — Isolated component functionality
- **Service Tests** — Business logic and state management
- **Utility Tests** — Pure function testing
- **Mock Data** — Comprehensive test data sets

### Integration Testing
- **Feature Tests** — End-to-end feature workflows
- **API Integration** — Service and API interaction testing
- **User Interactions** — UI interaction testing

### Test Organization
```text
src/app/features/feature-name/
├── feature-name.component.spec.ts    # Component tests
├── feature-name.service.spec.ts      # Service tests
└── feature-name.mock.ts              # Test data
```

---

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile First** — Mobile-first responsive design
- **Progressive Enhancement** — Enhanced experience for larger screens
- **Touch Optimization** — Touch-friendly interface elements
- **Viewport Adaptation** — Adaptive layouts for different screen sizes

### Device Support
- **Mobile Devices** — Optimized for smartphones
- **Tablet Support** — Enhanced tablet experience
- **Desktop Experience** — Full-featured desktop interface
- **Cross-Browser** — Modern browser compatibility

---

## 🚀 Deployment & Production

### Build Process
```bash
# Development build
npm run build

# Production build
npm run build -- --configuration production

# Build analysis
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### Environment Configuration
- **Development** — Local development configuration
- **Staging** — Pre-production environment
- **Production** — Optimized production configuration
- **Environment Variables** — Secure configuration management

### Deployment Considerations
- **Static Assets** — CDN optimization for static resources
- **Caching Strategy** — Browser caching and cache invalidation
- **Performance Monitoring** — Production performance tracking
- **Error Monitoring** — Production error tracking

---

## 🔧 Advanced Features

### Accessibility (a11y)
- **WCAG Compliance** — Accessibility standards adherence
- **Keyboard Navigation** — Full keyboard accessibility
- **Screen Reader Support** — Screen reader compatibility
- **ARIA Labels** — Proper ARIA label implementation

### Progressive Web App (PWA)
- **Service Worker** — Offline capability and caching
- **Web App Manifest** — Installable web app features
- **Offline Support** — Basic offline functionality
- **Push Notifications** — Real-time notifications (future)

### Advanced UI Patterns
- **Virtual Scrolling** — Large dataset handling
- **Drag and Drop** — Interactive drag-and-drop interfaces
- **Rich Text Editing** — Advanced text input capabilities
- **File Upload** — Secure file upload functionality

---

## 📚 Related Documentation

### System Documentation
- [**Architecture Overview**](../docs/README.md) — System-level architecture
- [**Color System**](../docs/color-system.md) — Design tokens and theming
- [**i18n Conventions**](../docs/architecture/i18n-naming.md) — Translation standards

### Frontend Documentation
- [**Dependencies Reference**](./docs/dependencies.md) — npm packages and usage
- [**i18n Implementation**](./docs/i18n.md) — Translation system details
- [**Setup Guide**](./docs/setup.md) — Development environment setup

### Backend Documentation
- [**Backend Architecture**](../backend/README.md) — API and server architecture
- [**API Documentation**](../backend/docs/api.md) — REST API reference
- [**WebSocket Events**](../backend/docs/websocket.md) — Real-time events

---

## 🤝 Contributing to Frontend

### Development Guidelines
1. **Follow Patterns** — Adhere to established architectural patterns
2. **Type Safety** — Maintain strict TypeScript usage
3. **Component Design** — Create reusable, testable components
4. **Performance** — Consider performance implications

### Code Review Checklist
- [ ] TypeScript types are comprehensive
- [ ] Components are standalone and reusable
- [ ] Signals are used appropriately for state
- [ ] Translation keys follow naming conventions
- [ ] Tests cover critical functionality
- [ ] Styles use semantic design tokens
- [ ] Accessibility considerations are addressed

---

*Last updated: [Current Date]*  
*Angular Version: 21.x*  
*Node.js Requirement: v18+*
