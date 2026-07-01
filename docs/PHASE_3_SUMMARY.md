# Phase 3 Summary

## Scope

Phase 3 adds authenticated staff access:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- JWT access tokens
- Rotating refresh tokens stored as SHA-256 hashes
- Password verification with bcrypt
- Role decorator and RBAC guard for `ADMIN` and `CHEF`
- User repository using raw `mysql2` SQL

## Decisions

- Passwords are stored as bcrypt hashes in `users.password_hash`.
- Refresh tokens are persisted in `auth_refresh_tokens` so logout and rotation can revoke tokens.
- Raw SQL remains isolated in repositories. Controllers only handle HTTP request/response flow.
- Access tokens are short-lived by default: `JWT_ACCESS_TTL_SECONDS=900`.
- Refresh tokens default to seven days: `JWT_REFRESH_TTL_SECONDS=604800`.
- Seeded development credentials are:
  - Admin: `admin@example.com` / `Admin123!`
  - Chef: `chef@example.com` / `Chef123!`

## Commands

Apply the new migration and updated seeds:

```bash
pnpm db:migrate
pnpm db:seed
```

Run checks:

```bash
pnpm --filter @restaurant/api test
pnpm --filter @restaurant/api build
```

## Next Phase

Phase 4 will add:

- Categories module
- Menu items module
- Tables module
