# Phase 6 Summary

## Scope

- NestJS Socket.IO gateway in `apps/api/src/modules/realtime`
- Events from `@restaurant/shared-constants`:
  - `order.created`
  - `order.updated`
  - `order.delivered`
  - `kitchen.queue.updated`
- Emits on order create and status update
- IoAdapter configured in `main.ts`

## Decisions

- Gateway is a dedicated module exported to `OrdersService` to keep HTTP and realtime concerns separated.
- Events broadcast globally for the MVP kitchen and customer tracking flows.

## Commands

```bash
pnpm --filter @restaurant/api build
```

## Next Phase

Phase 7 adds the kitchen dashboard UI consuming the queue API and websocket events.
