# Digital Restaurant Menu & Ordering System

## Project Overview

Build a modern restaurant digital ordering platform where customers can scan a QR code on their table and place orders directly from their phone without calling a waiter.

The system should support:

- Customer ordering
- Kitchen order management
- Restaurant administration
- Real-time updates
- Mobile-first experience
- PWA support

---

# Tech Stack

## Backend
- NestJS
- TypeScript
- MySQL
- mysql2 (Raw SQL only)
- Socket.IO
- JWT Authentication

## Frontend
- SvelteKit
- TypeScript
- TailwindCSS
- TanStack Query
- Zod

## Infrastructure
- Docker
- Redis (optional)
- pnpm workspace
- Turborepo

---

# System Roles

## Customer
No authentication.

Can:
- Scan QR code
- Browse menu
- Add items to cart
- Submit order
- View order status

---

## Chef
Authentication required.

Can:
- View order queue
- Update order status
- Mark orders delivered

---

## Admin
Authentication required.

Can:
- Manage users
- Manage menu
- Manage categories
- Manage tables
- View reports
- Configure restaurant settings

---

# Main Features

## Table QR Code
Each table has a QR code.

Example:

https://app.com/menu/12

---

## Menu Management
- Categories
- Menu items
- Availability control

---

## Ordering
- Cart
- Submit order
- Notes per item
- Estimated preparation time

---

## Kitchen Dashboard
- Real-time queue
- Order details
- Status updates

---

## Admin Dashboard
- Reports
- Sales statistics
- User management

---

# Order Status

PENDING
PREPARING
READY
DELIVERED
CANCELLED

---

# Deployment

Single deployment.

NestJS serves the built Svelte application as static files.
