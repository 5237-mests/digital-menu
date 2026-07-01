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

## Structure

- `migrations/` contains ordered schema changes.
- `seeds/` contains idempotent seed data.
- `scripts/` contains Node runners powered by `mysql2/promise`.

## Notes

The initial admin and chef passwords are placeholder hashes. Phase 3 will implement authentication and replace these with real password hashing.
