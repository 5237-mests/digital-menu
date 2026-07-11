# Database

Phase 2 uses raw MySQL with `mysql2`. No ORM is used.

## Commands

Start MySQL:

```bash
docker compose up -d mysql
```

Run migrations:

```bash
pnpm db:migrate
```

Run seeds:

```bash
pnpm db:seed
```

Run both:

```bash
pnpm db:setup
```

## SaaS clean database

The SaaS application uses a separate, complete baseline schema and never alters an existing single-restaurant database. Create an empty MySQL database, point the normal `MYSQL_*` variables at it, then run:

```bash
pnpm db:saas:setup
```

This runs `saas/migrations/001_initial_saas_schema.sql` and its idempotent demo seed. Do not run the legacy `db:setup` commands against the SaaS database.

## Structure

- `migrations/` contains ordered schema changes.
- `seeds/` contains idempotent seed data.
- `scripts/` contains Node runners powered by `mysql2/promise`.

## Notes

The initial admin and chef passwords are placeholder hashes. Phase 3 will implement authentication and replace these with real password hashing.
