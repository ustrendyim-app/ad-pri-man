# Admin Price Sort – Quick Start Guide

This repository contains the production code for the Admin Price Sort app. It is a React Router–based Shopify app that manages product prices and status using the Admin GraphQL API only.

Highlights

- Operations Runbook: see docs/OPERATIONS.md for full deployment and troubleshooting details.
- GraphQL-only. No REST Admin API calls remain (complies with 2024-04 REST deprecation for /products and /variants).
- Mandatory GDPR compliance webhooks implemented with strict HMAC verification.
- Webhooks API version set to 2025-10; server SDK pinned to ApiVersion.October25.
- Minimal, deterministic webhook handlers that return 401 for invalid HMAC and 200 for valid requests.

---

## Requirements
- Node 20+
- Shopify Partner account and a development store
- Shopify CLI (latest)

## Environment variables
Set these in your Vercel project and local shell when needed:
- SHOPIFY_API_KEY
- SHOPIFY_API_SECRET
- SHOPIFY_APP_URL (e.g. https://ad-pri-man.vercel.app)
- SCOPES=write_products

## Install and develop
```bash
npm ci
npm run dev    # or: shopify app dev
```

## Build and deploy
```bash
npm run deploy
```
This releases a new version via Shopify CLI using the app config in shopify.app.admin-product-price-sort.toml.

## API versions
- Server SDK: ApiVersion.October25 (2025-10)
- Webhooks: 2025-10 in both app config TOML files
- Admin UI extension: currently on 2025-01 (stable) due to CLI type resolution; this does not affect compliance checks.

## GraphQL only (no REST)
All product reads/updates use Admin GraphQL:
- Product listing and filtering in app/routes/app._index.tsx
- Price update via productVariantUpdate mutation
- Product status update via productUpdate mutation

If Shopify Monitoring still shows REST deprecation warnings, allow 24–72 hours for the metrics window to refresh, and ensure no external tools (Postman, scripts) are using REST with the same API key. Rotating the API secret/token can also help eliminate legacy callers.

## Mandatory GDPR webhooks
Configured in both app TOML files using the new compliance_topics format and a single endpoint:
- Endpoint: /webhooks/compliance
- Topics: customers/data_request, customers/redact, shop/redact
- Webhooks API version: 2025-10

Runtime behavior
- Invalid HMAC → 401 Unauthorized
- Valid HMAC → 200 OK

Manual tests (PowerShell)
```powershell
# Should return 401 for invalid HMAC
$body = '{"test":true}';
$headers = @{'Content-Type'='application/json';'X-Shopify-Hmac-Sha256'='invalid'}
Invoke-WebRequest -Uri "https://ad-pri-man.vercel.app/webhooks/compliance" -Method POST -Body $body -Headers $headers
```

## Automated checks (Partner Dashboard)
- Provides mandatory compliance webhooks → green
- Verifies webhooks with HMAC signatures → green
- Querying deprecated APIs → will turn green once Shopify Monitoring updates (24–72h) and no external REST calls exist.

## Repository hygiene
- No secrets committed. Environment variables must be set via Vercel/Shopify config.
- Session logs or local notes should not include secrets.

## Troubleshooting
- UI extension type error at 2025-10: keep extension API at 2025-01 until Shopify fixes the type reference for admin.product-index.action.render.
- Prisma connection warnings on cold start do not affect compliance handlers; data access is lazy after HMAC success.
