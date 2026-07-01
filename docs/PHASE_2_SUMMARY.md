# Phase 2 Summary

## Scope

Phase 2 adds the raw MySQL foundation:

- Initial database schema migration
- Idempotent seed data
- Migration and seed runners using `mysql2/promise`
- NestJS database module
- Injectable MySQL connection pool
- Database-oriented tests

## Decisions

- Database access remains raw SQL through `mysql2`; no ORM dependencies are used.
- Migrations are plain `.sql` files tracked by a `schema_migrations` table.
- Seeds are idempotent with `ON DUPLICATE KEY UPDATE` so they can be rerun during local development.
- The API exposes a shared `DatabaseService` and `MYSQL_POOL` provider for future repositories.
- Password values in seed users are placeholder hashes. Phase 3 will implement authentication and real password hashing.
- Foreign keys use `RESTRICT` for menu/table references and `CASCADE` for deleting order line items with an order.

## Commands

```bash
docker compose up -d mysql
pnpm db:setup
```

Run API checks:

```bash
pnpm --filter @restaurant/api test
pnpm --filter @restaurant/api build
```

Run database schema tests:

```bash
node --test "database/test/**/*.test.mjs"
```

## Next Phase

Phase 3 will add:

- Authentication module
- JWT access and refresh tokens
- Password hashing
- Role-based access control for `ADMIN` and `CHEF`
