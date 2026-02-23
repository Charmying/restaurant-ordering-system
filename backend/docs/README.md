# Backend Documentation

**English** | [繁體中文](./README.zh-TW.md)

Comprehensive engineering and operations documentation for the NestJS backend service. This directory serves as the canonical source of truth for backend architecture, API specifications, deployment procedures, and operational guidance.

---

## 📚 Document Index

### 🚀 Getting Started
- [**Setup Guide**](./SETUP.md) — Local development environment, environment variables, and troubleshooting
- [**Dependencies**](./DEPENDENCIES.md) — Runtime and development dependency rationale and usage

### 🏗️ Architecture & Design
- [**Architecture Overview**](./ARCHITECTURE.md) — System design, module boundaries, and architectural patterns
- [**Database Design**](./DATABASE.md) — Schema design, data lifecycle flows, and optimization strategies

### 🔌 API & Integration
- [**API Documentation**](./API.md) — REST API conventions, endpoint matrix, and response formats
- [**Authentication**](./AUTH.md) — Authentication flows, authorization models, and role-based access control
- [**WebSocket Events**](./WEBSOCKET.md) — Real-time event contracts and Socket.IO implementation

### 🌱 Data Management
- [**Database Seeding**](./SEED.md) — Startup seed behavior, manual seed execution, and test data management

### 🚀 Operations & Deployment
- [**Operations Guide**](./OPERATIONS.md) — Production runbook, incident handling, and monitoring

---

## 🔍 Quick Navigation by Role

### For Backend Developers
1. [Setup Guide](./SETUP.md) — Get your development environment running
2. [Architecture Overview](./ARCHITECTURE.md) — Understand the system design
3. [API Documentation](./API.md) — Learn API patterns and conventions
4. [Database Design](./DATABASE.md) — Understand data models and relationships

### For Frontend Developers
1. [API Documentation](./API.md) — Understand available endpoints and data formats
2. [Authentication](./AUTH.md) — Learn authentication flows and token handling
3. [WebSocket Events](./WEBSOCKET.md) — Implement real-time features
4. [Architecture Overview](./ARCHITECTURE.md) — Understand backend patterns

### For DevOps Engineers
1. [Operations Guide](./OPERATIONS.md) — Deployment and production procedures
2. [Setup Guide](./SETUP.md) — Environment configuration and requirements
3. [Dependencies](./DEPENDENCIES.md) — Package requirements and versions
4. [Database Design](./DATABASE.md) — Database setup and optimization

### For QA Engineers
1. [API Documentation](./API.md) — API contract testing reference
2. [Authentication](./AUTH.md) — Security testing scenarios
3. [Database Seeding](./SEED.md) — Test data setup procedures
4. [Setup Guide](./SETUP.md) — Test environment configuration

---

## 📖 Documentation Philosophy

- **Living Documents** — Documentation evolves with the codebase
- **Practical Examples** — Code snippets and real-world usage patterns
- **Cross-References** — Interconnected documentation with clear navigation
- **Version Alignment** — Documentation matches codebase versions

---

## 🔗 Related Documentation

### System-Level Documentation
- [System Architecture](../../docs/README.md) — High-level system design and principles
- [Color System](../../docs/color-system.md) — Design tokens and UI guidelines
- [i18n Conventions](../../docs/architecture/i18n-naming.md) — Translation standards

### Frontend Documentation
- [Frontend Architecture](../../frontend/README.md) — Angular client architecture
- [Frontend Setup](../../frontend/docs/SETUP.md) — Frontend development setup
- [Frontend Dependencies](../../frontend/docs/DEPENDENCIES.md) — Frontend package documentation

### External References
- [NestJS Documentation](https://docs.nestjs.com/) — Framework reference and patterns
- [MongoDB Documentation](https://docs.mongodb.com/) — Database reference and optimization
- [Socket.IO Documentation](https://socket.io/docs/) — Real-time communication reference
- [JWT Handbook](https://jwt.io/) — JSON Web Token implementation guide
