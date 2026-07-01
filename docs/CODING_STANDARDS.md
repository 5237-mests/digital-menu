# Coding Standards

## General Rules

- TypeScript strict mode.
- No any.
- No ORM.
- Use mysql2.
- Parameterized SQL only.
- Follow SOLID principles.
- Repository Pattern.
- Dependency Injection.

---

# Backend

Controllers:
- Handle request/response only.

Services:
- Business logic only.

Repositories:
- SQL queries only.

---

# Frontend

- Component-based.
- Reusable UI components.
- Mobile-first.
- Strong typing.

---

# Database

- Foreign keys.
- Proper indexes.
- Transactions where needed.

---

# Testing

- Unit tests.
- Integration tests.
- E2E tests.

---

# Git

Commit after every completed feature.

Examples:

feat(auth): implement login

feat(order): create ordering flow

fix(menu): fix menu filtering
