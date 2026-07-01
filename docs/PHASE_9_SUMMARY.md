# Phase 9 Summary

## Scope

- Customer landing page with entry points
- Menu browsing at `/menu/[qrCode]`
- Cart and order submission flow
- Order tracking at `/menu/[qrCode]/order/[orderId]`
- TanStack Query layout setup
- TailwindCSS styling and PWA manifest

## Decisions

- Customer flow uses the public menu API and unauthenticated order endpoints.
- Cart state is kept in-memory per table QR code for the MVP.
- Realtime order tracking listens for `order.updated` websocket events.

## Commands

```bash
pnpm --filter @restaurant/web test
pnpm --filter @restaurant/web build
```

Demo customer URL: `/menu/table-1`

## Next Phase

Phase 10 adds broader tests and production deployment optimization.
