# Admin Price Sort — Operations Runbook

This runbook documents how the app is configured and operated: Git, deployments (Vercel + Shopify CLI), Prisma, Shopify API setup, webhooks, compliance, and troubleshooting. Use this as the single source of truth for future sessions.

---

## 1) Quick facts
- App name: Admin Price Sort
- App ID (gid numeric): 284263350273
- Client ID (public): a2d3b23cf65fa8e7f854df3c627b5c22
- Repo: https://github.com/ustrendyim-app/ad-pri-man.git
- Production URL: https://ad-pri-man.vercel.app
- Primary dev store(s):
  - trendyapps-2.myshopify.com (password protected)
- Admin UI extension
  - Handle: admin-price-sort
  - UID: 41a437cd-8029-fbe7-1e4b-1c6a2b5c9723eb68d7c0

APIs and versions:
- Server SDK: 2025-10 (ApiVersion.October25)
- Webhooks API version: 2025-10
- Admin UI extension: 2025-01 (stabil; 2025-10 denemesi ayrı dalda)

Webhooks (GDPR compliance):
- Single endpoint: GET/POST /webhooks/compliance
- Topics: customers/data_request, customers/redact, shop/redact
- Behavior: invalid HMAC → 401, valid HMAC → 200

Other app webhooks:
- POST /webhooks/app/uninstalled (always returns 200; DB cleanup errors swallowed)
- POST /webhooks/app/scopes_update

---

## 2) Environments & Secrets
All secrets live in environment variables. Never commit secrets.

Set in Vercel and local shell when needed:
- SHOPIFY_API_KEY = <public client id> (public)
- SHOPIFY_API_SECRET = <private secret>
- SHOPIFY_APP_URL = https://ad-pri-man.vercel.app
- SCOPES = write_products
- DATABASE_URL = <PostgreSQL connection URL>
- Optional: SHOP_CUSTOM_DOMAIN (if used)

Secret rotation playbook:
1) Rotate API secret in Dev Dashboard → Settings → rotate secret.
2) Update SHOPIFY_API_SECRET in Vercel env vars.
3) Re-deploy (npm run deploy). Do not print secrets in logs.

---

## 3) Git & Branching
- Default branch: main (production)
- Feature branches: feat/<topic> (e.g., feat/admin-ui-2025-10)
- Remote: origin → https://github.com/ustrendyim-app/ad-pri-man.git

Common commands:
```bash
# view recent commits
git --no-pager log --oneline -15

# create a feature branch
git checkout -b feat/topic

# commit and push
git add -A && git commit -m "feat: message" && git push -u origin HEAD
```

---

## 4) Deployments
Two planes of deployment:

A. Shopify app release (CLI)
- Uses shopify.app.admin-product-price-sort.toml
- Command: `npm run deploy` → creates a new version in Dev Dashboard
- This syncs webhooks, URLs, and UI extension bundles

B. Vercel (web runtime)
- Repo is connected to Vercel; push to main triggers a new deployment
- Logs: https://vercel.com/ustrendyim-apps-projects/ad-pri-man (Logs tab)

Notes:
- CLI may complain if compliance topics are on old format; we use `compliance_topics`.
- UI extension is pinned at API 2025-01 for compatibility; server/webhooks are 2025-10.

---

## 5) Shopify Config Files
- shopify.app.toml (project root)
- shopify.app.admin-product-price-sort.toml (linked config used by CLI)

Key sections:
- [webhooks] api_version = "2025-10"
- [[webhooks.subscriptions]] compliance_topics = ["customers/data_request", "customers/redact", "shop/redact"]
  - uri = "/webhooks/compliance"
- Other topics: app/uninstalled, app/scopes_update
- [auth] redirect_urls = ["https://ad-pri-man.vercel.app/auth"]

Admin UI extension manifest:
- extensions/admin-price-sort/shopify.extension.toml → api_version = "2025-01"

---

## 6) Prisma & Database
- ORM: Prisma Client (@prisma/client)
- Datasource: PostgreSQL (DATABASE_URL) — see prisma/schema.prisma
- Session model: `Session { id String @id, shop String, ... }`
- Prisma client singleton at app/db.server.ts

Operational notes:
- app/uninstalled and shop/redact are hardened: Prisma imported lazily only after successful HMAC, errors swallowed, always 200.
- Cold start warnings or connection pool timeouts are non-blocking for compliance handlers.

Migration & generate:
```bash
npm run setup         # prisma generate && prisma db push
npx prisma studio     # optional local inspection
```

---

## 7) Webhooks & HMAC
- Manual HMAC verification is used for GDPR routes and utilities use node:crypto with timingSafeEqual.
- For /webhooks/compliance we use Shopify’s authenticate.webhook which throws 401 on invalid signature by design; we propagate that Response.

Manual invalid HMAC test (PowerShell):
```powershell
$body = '{"test":true}'
$headers = @{'Content-Type'='application/json';'X-Shopify-Hmac-Sha256'='invalid'}
Invoke-WebRequest -Uri "https://ad-pri-man.vercel.app/webhooks/compliance" -Method POST -Body $body -Headers $headers
# Expect: 401
```

---

## 8) Admin GraphQL (GraphQL-only)
All product operations use GraphQL via `authenticate.admin(request)`:
- Product list with variants (pagination in batches)
- Price update: productVariantUpdate
- Status update: productUpdate

Example (loader): app/routes/app._index.tsx
- `const { admin } = await authenticate.admin(request)`
- `admin.graphql(`#graphql ...`)`

No REST calls remain. Monitoring “deprecated REST” warnings are cache-based and clear within 24–72h if no external tools use REST with the same API key.

---

## 9) Auth & Routes
- OAuth entry: /auth, /auth/login (AppProvider embedded=false)
- Protected app shell: /app (authenticate.admin in loader)
- Landing: / (redirects to /app when shop param present)

---

## 10) Logs & Monitoring
- Vercel Logs: check function invocations for webhooks (/webhooks/...)
- Dev Dashboard → Logs → Webhooks: see delivery status (OK/401/5xx)
- If any 5xx appear on app/uninstalled, verify lazy Prisma import change is deployed.

---

## 11) Troubleshooting
- 401 on webhooks: invalid/missing HMAC or wrong SHOPIFY_API_SECRET; verify secret matches Dev Dashboard.
- 503/500 on app/uninstalled: now prevented; DB errors are swallowed.
- Deprecated API warnings: wait 24–72h, rotate API secret to stop external REST clients if needed.
- CLI error “Type reference for admin.product-index.action.render at 2025-10”: keep extension on 2025-01 or test upgrade in branch `feat/admin-ui-2025-10`.

---

## 12) Release checklist
- [ ] Code merged to main
- [ ] README/Runbook changes in place
- [ ] `npm run deploy` succeeded (new version link present)
- [ ] Vercel deployment healthy (GET / returns, webhooks GET return status JSON)
- [ ] Partner Dashboard → Automated checks → all green

---

## 13) Branch for UI extension 2025-10 upgrade
- Branch: feat/admin-ui-2025-10
- Changes: extension api_version = 2025-10 and packages ~2025.10.0
- Current status: CLI type reference error; to be revisited later

---

## 14) Contacts & Support
- API contact email (public): info@webtorn.com
- Merchant support email (listing): info@webtorn.com

---

## 15) Useful commands (PowerShell)
```powershell
# Deploy app config & UI extension
npm run deploy

# Trigger GDPR webhook tests (Shopify CLI)
shopify app webhook trigger --topic=customers/data_request --address=https://ad-pri-man.vercel.app/webhooks/compliance
shopify app webhook trigger --topic=customers/redact --address=https://ad-pri-man.vercel.app/webhooks/compliance
shopify app webhook trigger --topic=shop/redact --address=https://ad-pri-man.vercel.app/webhooks/compliance

# Vercel GET checks (expect 200 JSON)
Invoke-WebRequest -Uri "https://ad-pri-man.vercel.app/webhooks/compliance" -Method GET
Invoke-WebRequest -Uri "https://ad-pri-man.vercel.app/webhooks/customers/data-request" -Method GET
```

---

## 16) File map (key files)
- app/shopify.server.ts → SDK init, ApiVersion.October25
- app/routes/webhooks.compliance.tsx → unified GDPR handler (401/200)
- app/routes/webhooks.customers.*.tsx, app/routes/webhooks.shop.redact.tsx → minimal variants (GET status + HMAC in POST)
- app/routes/webhooks.app.uninstalled.tsx → lazy Prisma + always 200
- app/routes/app._index.tsx → GraphQL products fetch & mutations
- extensions/admin-price-sort/* → UI extension (2025-01)
- shopify.app.toml, shopify.app.admin-product-price-sort.toml → config (webhooks 2025-10)
- prisma/schema.prisma → datasource Postgres + Session model
- app/db.server.ts → Prisma client singleton

---

Keep this document updated when changing API versions, endpoints, or deployment procedures.
