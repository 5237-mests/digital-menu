# Multi-Tenant Restaurant SaaS MVP

## Summary

Convert the existing single-restaurant application into a shared-MySQL SaaS platform. Each restaurant becomes an isolated tenant, reachable through a configurable subdomain; platform administrators provision restaurants and their first owner. Chapa billing is introduced behind a provider abstraction, with recurring-payment activation deferred until the merchant capability is confirmed.

## Key Changes

- Add tenants/restaurants, tenant status, tenant slug/subdomain, subscription plans, billing periods, payment attempts, and webhook-event records. Create a default tenant and migrate all current data into it.
- Add `tenant_id` to every restaurant-owned record (users, tables, menu, categories, orders, settings, refresh tokens) and enforce tenant filtering in every repository query, unique constraint, API operation, and Socket.IO room.
- Replace the current role model with `PLATFORM_ADMIN`, `OWNER`, `ADMIN`, and `CHEF`. Include tenant identity and role in authenticated context; platform users have no tenant access by default.
- Build platform-admin capabilities to provision, view, suspend/reactivate tenants, invite/create the first owner, select a plan, and view billing status.
- Provide a one-time, environment-secret-protected setup page that creates the initial `PLATFORM_ADMIN`; disable it once initialization has completed.
- Resolve the tenant from the request host using `BASE_DOMAIN` and wildcard subdomains (`restaurant.BASE_DOMAIN`). Public menu, ordering, tracking, and staff/admin requests operate only within the resolved tenant; reject unknown or suspended tenants.
- Update QR generation and public links to use the tenant subdomain. Support local development through a documented host-mapping approach.
- Add owner billing/settings pages and retain tenant admin/chef operations within their scoped dashboard.
- Define subscription states as trial/active/past_due/suspended/cancelled. On a failed or overdue renewal, grant seven days of access; then block staff access and new public orders until verified payment restores service.
- Introduce a `BillingProvider` interface and Chapa implementation scaffold for checkout initialization, transaction verification, signature-verified idempotent webhooks, and payment reconciliation. Keep automatic monthly charging disabled behind configuration until Chapa recurring/tokenized-payment support is confirmed; preserve the data model and scheduled renewal workflow needed to enable it later.
- Add environment configuration and deployment guidance for wildcard DNS/TLS, `BASE_DOMAIN`, setup secret, Chapa credentials/webhook secret, and billing enforcement.

## Interfaces and Security

- Tenant-aware API routes and JWT payloads expose tenant ID and role, while platform-admin routes remain explicitly separated.
- Webhook handlers verify Chapa signatures, re-check payment status with Chapa before granting access, and persist provider references to prevent duplicate processing.
- Tenant suspension is enforced server-side for HTTP APIs, WebSocket connections/events, and public order creation—not only in the UI.

## Test Plan

- Migration test: legacy records move to the default tenant and tenant-scoped uniqueness works.
- Isolation tests: users from one restaurant cannot read, modify, subscribe to realtime events, or order against another restaurant’s data.
- Host-resolution tests: valid, unknown, malformed, and suspended subdomains behave correctly.
- RBAC tests: platform admin, owner, admin, and chef permissions match the defined boundaries.
- Billing tests: grace period, suspension/restoration, duplicate webhook handling, invalid signatures, and failed Chapa verification.
- UI and end-to-end smoke tests: platform provisioning, owner login, QR menu ordering on a tenant subdomain, kitchen realtime updates, and billing-status visibility.

## Assumptions

- One shared MySQL database is used, with mandatory `tenant_id` isolation.
- Restaurants are provisioned by platform administrators, not self-service signup.
- Production uses wildcard subdomains from a configurable base domain.
- Chapa collects restaurant subscription payments only; diners do not pay online in this MVP.
- The initial platform administrator is created through the protected setup page.
- Automatic Chapa renewals will be activated only after the merchant account’s recurring-payment capability is confirmed.
