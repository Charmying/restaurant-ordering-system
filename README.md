# Restaurant Ordering System

**English** | [繁體中文](./README.zh-TW.md)

[Page Function Description](./docs/page-function-description/page-function-description.md) — Page functionality overview

A production-ready restaurant management and ordering system built with enterprise-grade architecture. This system provides seamless customer ordering experiences through QR codes while offering comprehensive management capabilities for restaurant operations.

---

## 🎯 What is This?

A full-stack restaurant ordering platform that bridges the gap between customer convenience and operational excellence. Customers scan QR codes to order, while staff manage everything through a comprehensive dashboard.

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- npm v10+
- MongoDB (local or cloud)

### Get Running in 3 Steps

```bash
# 1. Clone the repository
git clone https://github.com/Charmying/restaurant-ordering-system
cd restaurant-ordering-system

# 2. Start Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm run start
# API runs on http://localhost:4000

# 3. Start Frontend (in new terminal)
cd frontend
npm install
npm run start
# App runs on http://localhost:4200
```

---

## 🌟 Core Features

- **📱 QR Code Ordering** — Customers scan table QR codes to browse menu and place orders
- **🎛️ Admin Dashboard** — Complete management for tables, orders, menu, categories, store settings, analytics, and users
- **🌍 Multi-language** — English and Traditional Chinese with inline content editing
- **🎨 Light/Dark Theme** — Sophisticated theme system with semantic design tokens
- **⚡ Real-time Updates** — WebSocket-powered live order and status updates
- **🔒 Secure Authentication** — JWT-based auth with role-based access control

---

## 🛠️ Technology Stack

### Frontend
- Angular 21 (standalone components, signals)
- Tailwind CSS v4
- @ngx-translate/core
- Socket.IO client

### Backend
- NestJS 11
- MongoDB + Mongoose
- JWT + Passport.js
- Socket.IO
- Swagger/OpenAPI

---

## 📚 Documentation

### 🚀 Getting Started
- [Frontend Setup](./frontend/docs/SETUP.md) — Frontend development environment
- [Backend Setup](./backend/docs/SETUP.md) — Backend development environment

### 🏗️ Architecture
- [System Architecture](./docs/README.md) — High-level system design
- [Frontend Architecture](./frontend/README.md) — Angular structure and patterns
- [Backend Architecture](./backend/README.md) — NestJS structure and patterns

### 📖 Development Guides
- [Color System](./docs/color-system.md) — Design tokens and theming
- [i18n Conventions](./docs/architecture/i18n-naming.md) — Translation key patterns
- [Page Function Description](./docs/page-function-description/page-function-description.md) — Page functionality overview
- [API Documentation](./backend/docs/API.md) — REST API reference
- [WebSocket Events](./backend/docs/WEBSOCKET.md) — Real-time event specifications

### 🔐 Security & Operations
- [Authentication Guide](./backend/docs/AUTH.md) — Security model and authorization
- [Database Schema](./backend/docs/DATABASE.md) — Data models and relationships
- [Operations Guide](./backend/docs/OPERATIONS.md) — Deployment and maintenance

---

## 📁 Project Structure

```text
restaurant-ordering-system/
├── backend/               # NestJS API server
│   ├── src/               # Application source code
│   ├── docs/              # Backend documentation
│   └── README.md
├── frontend/              # Angular client application
│   ├── src/               # Application source code
│   ├── docs/              # Frontend documentation
│   └── README.md
├── docs/                  # System-level documentation
│   ├── architecture/      # Architectural decisions
│   └── README.md
├── CHANGELOG.md           # Version history
├── LICENSE                # License information
└── README.md              # This file
```
