# Phase 4 Summary

## Scope

- Categories, menu items, and tables CRUD modules
- Admin RBAC on write endpoints
- Public read filtering for active categories and available menu items
- Table lookup by QR code at `GET /tables/by-qr/:qrCode`
- Optional JWT on public reads so admins can see inactive/unavailable records
- Combined public menu endpoint at `GET /public/menu/:qrCode`

## Decisions

- Write operations require `ADMIN` role via `JwtAuthGuard` + `RolesGuard`.
- Public menu reads hide inactive categories and unavailable menu items unless an admin token is supplied.
- Table QR codes default to `table-{tableNumber}` when omitted on create.

## Commands

```bash
pnpm db:migrate
pnpm db:seed
pnpm --filter @restaurant/api test
pnpm --filter @restaurant/api build
```

## Next Phase

Phase 5 adds transactional ordering with server-side pricing validation.
