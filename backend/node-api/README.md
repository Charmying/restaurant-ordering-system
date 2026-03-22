# Backend

**English** | [繁體中文](./README.zh-TW.md)

Enterprise-grade NestJS backend for the restaurant ordering system. Production-ready API server with comprehensive REST endpoints, real-time WebSocket communication, and robust authentication.

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
# Configure .env with your MongoDB URI and JWT secrets
npm run start
# API runs on http://localhost:4000
```

---

## 🏗️ Architecture Overview

### Modern NestJS Patterns
- **Modular Architecture** — Domain-driven module organization
- **Dependency Injection** — Clean, testable service architecture
- **Decorators & Metadata** — Declarative programming model
- **Type Safety** — Strong TypeScript typing throughout

### Architectural Principles
- **Domain-Oriented Modules** — Business logic organized by domain
- **Thin Controllers** — Controllers handle HTTP, services handle business logic
- **Centralized Policies** — Cross-cutting concerns in common modules
- **Explicit Validation** — DTOs for all input validation
- **Standardized Responses** — Consistent API response envelopes

---

## 🛠️ Technology Stack

### Core Framework
- **NestJS 11** — Progressive Node.js framework with TypeScript
- **Express Platform** — HTTP server foundation
- **Socket.IO** — Real-time WebSocket communication
- **Reflect Metadata** — Decorator and metadata support

### Database & ORM
- **MongoDB** — NoSQL document database
- **Mongoose** — Elegant MongoDB object modeling
- **TypeScript Integration** — Strong typing for database operations

### Authentication & Security
- **JWT (JSON Web Tokens)** — Stateless authentication
- **Passport.js** — Authentication middleware
- **bcryptjs** — Secure password hashing
- **Helmet** — Security header middleware
- **class-validator** — Input validation and sanitization

### API Documentation
- **Swagger/OpenAPI** — Interactive API documentation
- **@nestjs/swagger** — Automatic OpenAPI generation
- **TypeScript Decorators** — Rich API metadata

---

## 📁 Project Structure

```text
backend/
├── docs/                                 # Backend documentation
│   ├── README.md                         # Documentation index
│   ├── API.md                            # REST API documentation
│   ├── ARCHITECTURE.md                   # Architecture patterns
│   ├── AUTH.md                           # Authentication & authorization
│   ├── DATABASE.md                       # Database schema
│   ├── DEPENDENCIES.md                   # Package dependencies
│   ├── OPERATIONS.md                     # Deployment & operations
│   ├── SETUP.md                          # Development setup
│   ├── SEED.md                           # Database seeding
│   └── WEBSOCKET.md                      # Real-time events
├── src/                                  # Application source code
│   ├── common/                           # Cross-cutting concerns
│   │   ├── decorators/                   # Custom decorators
│   │   ├── filters/                      # Exception filters
│   │   ├── guards/                       # Auth guards
│   │   ├── interceptors/                 # Request/response interceptors
│   │   ├── middlewares/                  # Custom middleware
│   │   ├── pipes/                        # Data transformation pipes
│   │   └── utils/                        # Utility functions
│   ├── modules/                          # Business domain modules
│   │   ├── auth/                         # Authentication
│   │   ├── users/                        # User management
│   │   ├── tables/                       # Table management
│   │   ├── orders/                       # Order processing
│   │   ├── menu/                         # Menu and items
│   │   ├── categories/                   # Menu categories
│   │   ├── store/                        # Store configuration
│   │   ├── messages/                     # Messaging system
│   │   ├── reports/                      # Analytics and reports
│   │   └── websocket/                    # Real-time events
│   ├── config/                           # Configuration management
│   ├── app.module.ts                     # Root module
│   └── main.ts                           # Application entry point
├── test/                                 # End-to-end tests
├── .env.example                          # Environment template
├── nest-cli.json                         # NestJS CLI config
├── tsconfig.json                         # TypeScript config
├── package.json                          # Dependencies
└── README.md                             # This file
```

### Module Pattern
Each domain module follows a consistent organization:

```text
module-name/
├── module-name.module.ts                 # Module definition
├── module-name.controller.ts             # HTTP request handlers
├── module-name.service.ts                # Business logic
├── module-name.dto.ts                    # Data transfer objects
└── module-name.schema.ts                 # Database schema
```

---

## 🔌 Core API Endpoints

### Authentication
```bash
POST   /api/auth/login                    # User authentication
POST   /api/auth/register                 # User registration
POST   /api/auth/refresh                  # Token refresh
POST   /api/auth/logout                   # User logout
```

### User Management
```bash
GET    /api/users                         # List users (admin)
GET    /api/users/:id                     # Get user details
PUT    /api/users/:id                     # Update user
DELETE /api/users/:id                     # Delete user
```

### Table Management
```bash
GET    /api/tables                        # List tables
POST   /api/tables                        # Create table
GET    /api/tables/:id                    # Get table details
PUT    /api/tables/:id                    # Update table
DELETE /api/tables/:id                    # Delete table
POST   /api/tables/:id/qr                 # Generate QR code
```

### Order Management
```bash
GET    /api/orders                        # List orders
POST   /api/orders                        # Create order
GET    /api/orders/:id                    # Get order details
PUT    /api/orders/:id                    # Update order status
DELETE /api/orders/:id                    # Cancel order
GET    /api/orders/table/:tableId         # Orders by table
```

### Menu Management
```bash
GET    /api/menu                          # Get full menu
GET    /api/menu/categories               # Get categories
GET    /api/menu/items                    # Get menu items
POST   /api/menu/items                    # Create menu item
PUT    /api/menu/items/:id                # Update menu item
DELETE /api/menu/items/:id                # Delete menu item
```

For complete API documentation, see [API.md](../docs/API.md)

---

## 🔐 Authentication & Security

### JWT-Based Authentication
- **Access Tokens**: Short-lived JWT tokens
- **Refresh Tokens**: Long-lived refresh tokens
- **Token Rotation**: Automatic refresh token rotation
- **Secure Storage**: HttpOnly cookies for refresh tokens

### Security Measures
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Comprehensive DTO validation
- **Rate Limiting**: Request throttling per endpoint
- **CORS Configuration**: Secure cross-origin requests
- **Security Headers**: Helmet middleware for security headers
- **SQL Injection Prevention**: Mongoose ODM protection

For detailed authentication flows, see [AUTH.md](../docs/AUTH.md)

---

## 🔄 Real-Time Communication

### WebSocket Events
Real-time updates through Socket.IO:

#### Connection Events
```typescript
// Client connection
socket.emit('join-room', { tableId: 'table-123' });

// Server responses
socket.on('order-updated', (order) => { /* handle */ });
socket.on('table-status-changed', (table) => { /* handle */ });
```

#### Event Types
- **Order Events**: Order creation, status updates, completion
- **Table Events**: Table status changes, QR code updates
- **System Events**: Maintenance notifications, system alerts
- **Message Events**: Staff communications, announcements

For complete WebSocket documentation, see [WEBSOCKET.md](../docs/WEBSOCKET.md)

---

## 🗄️ Database Design

### MongoDB Collections
```typescript
// Users Collection
interface User {
  _id: ObjectId;
  email: string;
  password: string; // bcrypt hash
  role: UserRole;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

// Tables Collection
interface Table {
  _id: ObjectId;
  number: string;
  capacity: number;
  status: TableStatus;
  qrCode: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Orders Collection
interface Order {
  _id: ObjectId;
  tableId: ObjectId;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Menu Items Collection
interface MenuItem {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  category: ObjectId;
  available: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

For complete database schema, see [DATABASE.md](../docs/DATABASE.md)

---

## 🔧 Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Start with watch mode
npm run start:dev

# Build for production
npm run build

# Run tests
npm test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint
```

---

## 📚 Related Documentation

### Backend Documentation
- [**API Documentation**](../docs/API.md) — Complete REST API reference
- [**Authentication**](../docs/AUTH.md) — Security and authorization details
- [**Database Schema**](../docs/DATABASE.md) — Data models and relationships
- [**WebSocket Events**](../docs/WEBSOCKET.md) — Real-time event specifications
- [**Setup Guide**](../docs/SETUP.md) — Development environment setup
- [**Dependencies**](../docs/DEPENDENCIES.md) — Package dependencies and usage
- [**Operations**](../docs/OPERATIONS.md) — Deployment and maintenance
- [**Architecture**](../docs/ARCHITECTURE.md) — System design patterns

### System Documentation (repository root)
- [**System Architecture**](../../docs/README.md) — High-level system design
- [**Color System**](../../docs/color-system.md) — Design tokens and theming
- [**i18n Conventions**](../../docs/architecture/i18n-naming.md) — Translation standards
- [**Page Function Description**](../../docs/page-function-description/page-function-description.md) — Page functionality overview

### Frontend Documentation
- [**Frontend overview**](../../frontend/README.md) — Client applications index
- [**Frontend Setup**](../../frontend/docs/SETUP.md) — Frontend development setup
