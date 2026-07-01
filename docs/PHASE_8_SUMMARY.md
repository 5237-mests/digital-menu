# Phase 8 Summary

## Scope

- Admin dashboard at `/admin`
- Reports via `GET /dashboard/stats` and `GET /dashboard/sales`
- Users API: `GET/POST/PUT/DELETE /users`
- Settings API: `GET/PUT /settings`
- Admin UI for categories, menu items, tables, users, and settings

## Decisions

- Dashboard and user management endpoints require `ADMIN` role.
- Settings are stored as key/value rows in a dedicated `settings` table.
- Admin pages reuse the same REST modules introduced in Phase 4.

## Commands

```bash
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Login as admin: `admin@example.com` / `Admin123!`

## Next Phase

Phase 9 adds the customer-facing menu, cart, and order tracking experience.
