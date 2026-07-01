# API Specification

## Auth

POST /auth/login
POST /auth/refresh
POST /auth/logout
GET /auth/me

---

## Users

GET /users
POST /users
PUT /users/:id
DELETE /users/:id

---

## Categories

GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id

---

## Menu Items

GET /menu-items
GET /menu-items/:id
POST /menu-items
PUT /menu-items/:id
DELETE /menu-items/:id

---

## Tables

GET /tables
POST /tables
PUT /tables/:id
DELETE /tables/:id

---

## Orders

POST /orders
GET /orders
GET /orders/:id
PATCH /orders/:id/status

---

## Dashboard

GET /dashboard/stats
GET /dashboard/sales

---

## Settings

GET /settings
PUT /settings
