# Architecture

## Pattern

- Modular Monolith
- Clean Architecture
- Repository Pattern
- Feature-Based Modules

---

# Monorepo Structure

restaurant-system/

apps/
api/
web/

packages/
shared-types/
shared-constants/
shared-utils/

database/
migrations/
seeds/

docs/

---

# Backend Structure

src/

modules/
common/
database/
config/
websocket/

---

# Module Structure

module/

controllers/
services/
repositories/
dto/
interfaces/
types/

---

# Principles

- SOLID
- Dependency Injection
- Separation of Concerns
- Thin Controllers
- Fat Services
- Repository Pattern

---

# Database Access

Use mysql2 only.

No ORM.

Example:

```ts
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE id = ?',
  [id],
);
```

---

# Realtime

Use Socket.IO.

Events:

- order.created
- order.updated
- order.delivered
- kitchen.queue.updated

---

# Authentication

JWT Access Token
JWT Refresh Token

Role Based Access Control:

- ADMIN
- CHEF
