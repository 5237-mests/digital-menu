# Multi-Tenant SaaS Guide

## Overview

This application is a shared-database SaaS platform for restaurant QR ordering. Each restaurant is a **tenant**. Tenant data is isolated by `tenant_id`, and each restaurant is selected from its subdomain.

Example production URLs:

```text
https://cafe-blue.example.com/menu/table-1
https://pasta-house.example.com/admin
```

The platform database is separate from the legacy single-restaurant database. Do not run SaaS setup commands against the legacy database.

## Roles

| Role | Scope | Responsibilities |
| --- | --- | --- |
| `PLATFORM_ADMIN` | Entire platform | Create restaurants, view tenants, manage platform operations. |
| `OWNER` | One restaurant | Billing, restaurant configuration, users, menu, tables, and reports. |
| `ADMIN` | One restaurant | Restaurant operations, menu, tables, users, and reports. |
| `CHEF` | One restaurant | Kitchen queue and order-status updates. |

Platform administrators do not belong to a tenant. All other users have a `tenant_id` and may access only that tenant's data.

## Create a New SaaS Database

1. Create a new empty MySQL database and user.
2. Configure the `MYSQL_*` values in `.env` for that new database.
3. Run the standalone SaaS schema and demo seed:

```bash
pnpm db:saas:setup
```

The command applies [001_initial_saas_schema.sql](../database/saas/migrations/001_initial_saas_schema.sql) and [001_initial_saas_data.sql](../database/saas/seeds/001_initial_saas_data.sql).

To run steps separately:

```bash
pnpm db:saas:migrate
pnpm db:saas:seed
```

The demo seed creates the `default` tenant, two restaurant users, sample tables, menu categories/items, settings, and a starter subscription. Change or remove demo credentials before production use.

## Required Environment Variables

```env
NODE_ENV=production
API_PORT=3001

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=restaurant_saas
MYSQL_USER=restaurant_saas_user
MYSQL_PASSWORD=replace_me

JWT_ACCESS_SECRET=long-random-secret
JWT_REFRESH_SECRET=another-long-random-secret

# Tenant routing
BASE_DOMAIN=example.com
DEFAULT_TENANT_SLUG=default

# One-time platform bootstrap
PLATFORM_SETUP_SECRET=long-random-bootstrap-secret

# Chapa billing
CHAPA_SECRET_KEY=
CHAPA_WEBHOOK_SECRET=long-random-webhook-secret
CHAPA_RECURRING_ENABLED=false
```

`DEFAULT_TENANT_SLUG` is used when `BASE_DOMAIN` is not configured, which is useful for local development. In production, requests such as `cafe-blue.example.com` resolve tenant `cafe-blue`.

## Bootstrap the Platform

Set `PLATFORM_SETUP_SECRET`, then create the first platform administrator once:

```bash
curl -X POST https://example.com/setup/platform-admin \
  -H "Content-Type: application/json" \
  -H "X-Setup-Secret: $PLATFORM_SETUP_SECRET" \
  -d '{"name":"Platform Admin","email":"admin@example.com","password":"use-a-strong-password"}'
```

Keep the setup secret private. Rotate it after bootstrap and restrict access to the setup endpoint at the infrastructure layer where possible.

## Provision a Restaurant

Authenticate as a `PLATFORM_ADMIN`, then call:

```bash
curl -X POST https://example.com/platform/tenants \
  -H "Authorization: Bearer <platform-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Cafe Blue",
    "slug":"cafe-blue",
    "ownerName":"Cafe Owner",
    "ownerEmail":"owner@cafeblue.example",
    "ownerPassword":"use-a-strong-password"
  }'
```

The tenant's public menu is then available on `https://cafe-blue.example.com/menu/<qr-code>` after DNS and TLS are configured.

## Subscription and Billing Lifecycle

Tenant subscription status is one of `TRIAL`, `ACTIVE`, `PAST_DUE`, `SUSPENDED`, or `CANCELLED`.

- `TRIAL`, `ACTIVE`, and `PAST_DUE` permit restaurant operations and public ordering.
- A past-due tenant has a seven-day grace window, stored in `grace_ends_at`.
- `SUSPENDED` and `CANCELLED` block staff access and new public orders server-side.

Chapa is the billing provider boundary. Automatic recurring charges are intentionally disabled by default because they require confirmation that the merchant account supports recurring/tokenized payments. Set `CHAPA_RECURRING_ENABLED=true` only after that capability and the renewal implementation are verified.

Configure Chapa transaction webhooks to call:

```text
POST https://example.com/billing/webhooks/chapa
```

The endpoint accepts `x-chapa-signature` or `chapa-signature`, validates the HMAC with `CHAPA_WEBHOOK_SECRET`, and stores each provider reference idempotently. Configure the webhook secret in both Chapa and the application.

## DNS and TLS

Create DNS records for both the platform host and all tenant subdomains:

```text
example.com       -> application load balancer / server
*.example.com     -> application load balancer / server
```

Your reverse proxy or hosting provider must provide a wildcard TLS certificate for `*.example.com`. Forward the original `Host` header to NestJS so tenant routing can resolve the subdomain.

For local testing, leave `BASE_DOMAIN` empty and use the default tenant. To test real subdomain behavior locally, map tenant hosts in your hosts file and set `BASE_DOMAIN` accordingly.

## Security and Operations Checklist

- Use unique, random JWT, setup, database, and Chapa webhook secrets.
- Restrict database access to the application network only and back up the SaaS database regularly.
- Verify tenant isolation on every new query: tenant-owned rows must be filtered by `tenant_id`.
- Protect platform endpoints with `PLATFORM_ADMIN`; never grant platform permissions to tenant users.
- Verify Chapa signatures and transaction status before granting subscription access.
- Monitor failed webhooks, expired grace periods, tenant suspension events, and database backup jobs.
- Rotate demo accounts and remove demo tenant data before a public launch.
