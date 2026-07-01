# Phase 5 Summary

## Scope

- `POST /orders` with server-side menu item price resolution
- Transactional order creation with table status updates
- `GET /orders?status=PENDING` filtering for kitchen queue
- Status transition validation
- Estimated preparation time in order responses
- Public order tracking via `GET /orders/:id`

## Decisions

- Clients no longer submit item prices; the API resolves prices from `menu_items`.
- Order creation and status changes run inside MySQL transactions.
- Tables move to `OCCUPIED` on order creation and back to `AVAILABLE` on delivery or cancellation.

## Commands

```bash
pnpm --filter @restaurant/api test
```

## Next Phase

Phase 6 adds Socket.IO realtime events for order lifecycle updates.
