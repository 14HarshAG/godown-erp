# Godown ERP – Vendor & Product Management Platform

## Project Overview

Godown ERP is a full-stack ERP-Lite system developed to manage vendors, products, and users through a secure admin dashboard.

The system demonstrates enterprise backend architecture using ASP.NET Core and a modern React frontend. It implements authentication, role-based access control, and modular architecture similar to real-world ERP systems.

---

## Tech Stack

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- BCrypt Password Hashing

### Frontend
- React
- React Router
- Axios

---

## Architecture

The backend follows **Clean Architecture** for separation of concerns.

```
GodownERP.Api
GodownERP.Application
GodownERP.Domain
GodownERP.Infrastructure
```

### Domain Layer
Contains core entities:
- User
- Role
- Permission
- Vendor
- Product

### Application Layer
Contains DTOs and business logic.

### Infrastructure Layer
Handles:
- Database access
- Entity Framework configuration
- JWT token service

### API Layer
Handles HTTP requests and exposes endpoints.

---

## Authentication & Security

Authentication is implemented using **JWT tokens**.

Features:
- Secure login endpoint
- BCrypt password hashing
- Token validation middleware

Login Flow:

1. User submits email and password
2. Password verified using BCrypt
3. JWT token generated
4. Token stored on frontend
5. Token sent with API requests

```
Authorization: Bearer <token>
```

---

## Role Based Access Control (RBAC)

Authorization is **database-driven** with no hardcoded roles.

Structure:

```
User
 → UserRoles
    → Role
       → RolePermissions
          → Permission
```

Benefits:
- Dynamic permission management
- Scalable authorization system
- Enterprise-ready design

---

## Core Modules

### Vendor Management
- Create vendor
- View vendors
- Delete vendors

### Product Management
- Create product
- View products
- Delete products
- Vendor linkage

### Authentication
- Secure login
- JWT token generation

---

## API Endpoints

### Authentication

POST /api/Auth/login

### Products

GET /api/Products  
POST /api/Products  
DELETE /api/Products/{id}

### Vendors

GET /api/Vendors  
POST /api/Vendors  
DELETE /api/Vendors/{id}

---

## Frontend Features

- Secure login page
- Admin dashboard
- Product management interface
- Vendor management interface
- Protected routes
- Sidebar navigation

---

## Project Structure

```
godown-erp
│
├── GodownERP.Api
├── GodownERP.Application
├── GodownERP.Domain
├── GodownERP.Infrastructure
└── godown-erp-ui
```

---

## Future Improvements

- Real-time updates using WebSockets
- Analytics dashboard
- User management
- Role management UI
- Search & pagination
- AI powered insights

---

## Author

Harsh Agarwal
