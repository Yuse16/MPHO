# 69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md

## 1. Purpose

This document records the real implementation status of MPHO after the Phase 1 monorepo migration and foundation setup.

It distinguishes between:

- Documented requirements.
- Existing visual implementation.
- Partially implemented behavior.
- Missing backend and infrastructure.
- Current risks.
- Approved next steps.

This file must be updated after every foundation milestone.

---

## 2. Current implementation summary

MPHO currently has:

- A complete product and operating documentation set (docs 00–68).
- A visual customer-facing Home prototype generated from v0, migrated to a pnpm monorepo.
- A responsive dark premium design direction (preserved).
- A basic in-memory cart prototype (starts empty).
- Hardcoded catalog and city data (restricted to Saltillo active).
- Three independent Next.js applications (customer, partner, central).
- Five shared packages (design-tokens, types, config, validation, ui).
- Shared TypeScript, Tailwind, and Prettier configuration.
- Automated tests (11 passing).
- CI/CD via GitHub Actions.
- Loading, error, and not-found states.
- `.env.example` with documented variables.
- `.gitignore` excluding secrets and build artifacts.

The current code must be treated as a visual prototype and implementation starting point, not as a production-ready application.

---

## 3. Repository structure after Phase 1

```text
MPHO/
├── apps/
│   ├── customer/          ← migrated visual prototype (port 3000)
│   ├── partner/           ← minimal shell (MPHO Aliados, port 3001)
│   └── central/           ← minimal shell (MPHO Central, port 3002)
├── packages/
│   ├── design-tokens/     ← colors, fonts, breakpoints
│   ├── types/             ← City, Product, Order, Partner, OrderStatus
│   ├── config/            ← APP_CONFIG, CITY_CONFIG, ORDER_CONFIG
│   ├── validation/        ← isValidCity, isValidProduct, transitions
│   └── ui/                ← utility cn()
├── .github/workflows/ci.yml
├── pnpm-workspace.yaml
├── package.json root
├── tsconfig.base.json
├── .prettierrc / .prettierignore
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
└── DOCS/ (00–69)
```

---

## 4. Existing customer experience

The current customer prototype includes:

- Responsive mobile and desktop layout.
- MPHO premium dark visual identity.
- Glassmorphism surfaces.
- Hero with visual carousel.
- Saltillo city selector (Ramos Arizpe shown as "próximamente").
- Recipient selector.
- MPHORA product carousel.
- HADIA promotional card.
- Basic cart context (starts empty).
- Customer header.
- Mobile bottom navigation.
- Footer.
- Hardcoded products and categories.
- Loading, error, and not-found states.

Current limitations:

- Most navigation actions are not connected to real routes.
- HADIA is visual only.
- MPHORA is visual only.
- The cart is not persistent.
- Product availability is not validated.
- No backend data is used.
- No real checkout exists.
- No order tracking exists.
- No customer authentication exists.

---

## 5. Existing data model in code

Current prototype data is hardcoded.

Examples include:

- Cities (Saltillo active, Ramos Arizpe planned).
- Recipient categories (8).
- MPHORA products (5).
- Product prices.
- Product images.
- Cart initial state (empty).

This data must not be treated as authoritative production data.

The production source of truth must eventually be the server and database.

---

## 6. Current application status matrix

| Area | Status | Notes |
|---|---|---|
| Customer Home | Partially implemented | Visual prototype, migrated to monorepo |
| Customer navigation | Visual only | Routes are not fully functional |
| Customer cart | Partially implemented | In-memory only, starts empty |
| Customer checkout | Missing | No real flow |
| Customer authentication | Missing | No auth provider configured |
| Customer orders | Missing | No order domain implementation |
| Customer tracking | Missing | No live status source |
| Customer error states | Implemented | loading.tsx, error.tsx, not-found.tsx |
| HADIA | Visual only | No AI, tools, catalog grounding, or safeguards |
| MPHORA | Visual only | No availability engine |
| Partner PWA | Shell only | App Router, layout, placeholder page |
| Central PWA | Shell only | App Router, layout, placeholder page |
| Shared packages | Created | design-tokens, types, config, validation, ui |
| Database | Missing | No SQL migrations or production schema |
| Supabase | Missing | No local or remote configuration |
| RLS | Missing | No policies |
| API routes | Missing | No production domain APIs |
| Payments | Missing | No provider integration |
| Refunds | Missing | No provider or ledger implementation |
| Partner earnings | Missing | No accounting implementation |
| Payouts | Missing | No payout workflow |
| Delivery integration | Missing | No provider integration |
| WhatsApp | Missing | No provider integration |
| n8n | Missing | No workflows |
| PWA manifest | Missing | No complete app manifests |
| Service workers | Missing | No production service worker |
| Push notifications | Missing | No subscriptions or delivery |
| Tests | Implemented | 11 tests passing (customer app) |
| CI/CD | Implemented | GitHub Actions: install, lint, typecheck, build, test |
| Security controls | Documented only | Not yet verified in code |
| Legal public documents | Draft only | Not ready for publication |

---

## 7. Defects corrected in Phase 1

### 7.1 TypeScript build errors hidden — CORRECTED

`ignoreBuildErrors: true` was removed from `next.config.mjs`.

Production builds now fail on TypeScript errors as expected.

### 7.2 Generic project identity — CORRECTED

Package name changed from `"my-project"` to `"@mpho/customer"`.

Partner and central use `"@mpho/partner"` and `"@mpho/central"`.

### 7.3 Coverage mismatch — CORRECTED

Cities reduced from 6 to 2:

```text
Saltillo → active
Ramos Arizpe → planned (shows "próximamente")
Monterrey, CDMX, Guadalajara, Querétaro, Torreón → removed
```

### 7.4 Fake cart state — CORRECTED

Cart now starts empty. Removed `initialCount={2}` and seed items.

### 7.5 Missing error states — CORRECTED

Added `loading.tsx`, `error.tsx`, `not-found.tsx` to customer app.

### 7.6 Missing tests — CORRECTED

Added 11 automated tests:

- `cities.test.ts` — 4 tests (city count, active city, planned status, excluded cities)
- `validation.test.ts` — 4 tests (order status transitions)
- `home.test.tsx` — 3 tests (renders hero, renders HADIA, no partner names)

### 7.7 Missing CI/CD — CORRECTED

Added `.github/workflows/ci.yml` running: install → lint → typecheck → build → test.

### 7.8 Missing .env.example — CORRECTED

Created `.env.example` documenting Supabase, Mercado Pago, WhatsApp, n8n variables.

### 7.9 Missing monorepo structure — CORRECTED

Created pnpm workspace with 3 apps and 5 shared packages.

---

## 8. Current security status

Security requirements are extensively documented, but the current implementation has no verified production security foundation.

Missing controls include:

- Authentication.
- Role-based authorization.
- Row Level Security.
- Private storage.
- Signed URL controls.
- Webhook verification.
- Idempotency.
- Audit logs.
- Privileged action reauthentication.
- MFA.
- Secrets inventory.
- Secure environment separation.
- Incident alerts.
- Backup and recovery validation.
- Fraud controls.
- Payout account controls.
- Payment reconciliation.
- AI tool restrictions.

No production data, customer data, partner data, payment data, or secrets should be added until the required controls exist.

---

## 9. Current legal and launch status

The legal and regulatory documentation remains internal and incomplete for publication.

Open decisions include:

- Legal entity.
- RFC.
- Tax regime.
- Direct seller versus marketplace structure.
- Invoicing model.
- Payment responsibility.
- Partner agreement.
- Public terms.
- Privacy notice.
- Refunds and cancellations.
- Recipient data handling.
- Delivery liability.
- External product liability.

These decisions do not block repository stabilization, local development, monorepo setup, local database design, or automated testing.

They do block:

- Real payments.
- Real invoicing.
- Real payouts.
- Public legal publication.
- Contracts with live partners.
- Production launch.

---

## 10. Validation results

### Install

```text
Status: PASS
Command: pnpm install
Result: 451 packages installed successfully
```

### Lint

```text
Status: PENDING
Command: pnpm lint
Result: ESLint not yet configured with shared config
```

### Typecheck

```text
Status: PASS
Command: pnpm typecheck
Result: All 3 apps pass (customer, partner, central)
```

### Tests

```text
Status: PASS
Command: pnpm --filter @mpho/customer test
Result: 11/11 tests passing
  - cities.test.ts: 4 passed
  - validation.test.ts: 4 passed
  - home.test.tsx: 3 passed
```

### Customer build

```text
Status: PASS
Command: pnpm --filter @mpho/customer build
Result: Compiled successfully, static pages generated
```

### Partner build

```text
Status: PASS
Command: pnpm --filter @mpho/partner build
Result: Compiled successfully, static pages generated
```

### Central build

```text
Status: PASS
Command: pnpm --filter @mpho/central build
Result: Compiled successfully, static pages generated
```

---

## 11. Files created, moved, modified, and removed

### Created

```text
.github/workflows/ci.yml
.env.example
.prettierrc
.prettierignore
tsconfig.base.json
pnpm-workspace.yaml
package.json (root)
apps/partner/ (entire shell)
apps/central/ (entire shell)
apps/customer/app/loading.tsx
apps/customer/app/error.tsx
apps/customer/app/not-found.tsx
apps/customer/tests/setup.ts
apps/customer/tests/home.test.tsx
apps/customer/tests/cities.test.ts
apps/customer/tests/validation.test.ts
apps/customer/vitest.config.ts
packages/design-tokens/ (entire package)
packages/types/ (entire package)
packages/config/ (entire package)
packages/validation/ (entire package)
packages/ui/ (entire package)
```

### Moved

```text
mpho-website/ → apps/customer/
  (clean migration, no duplication)
```

### Modified

```text
apps/customer/package.json
  - name: "my-project" → "@mpho/customer"
  - added workspace deps, vitest, testing-library, @vitejs/plugin-react
apps/customer/next.config.mjs
  - removed ignoreBuildErrors: true
apps/customer/tsconfig.json
  - added paths for workspace packages
apps/customer/lib/data.ts
  - City type changed to object with id/name/status
  - reduced from 6 cities to 2 (Saltillo active, Ramos Arizpe planned)
  - added ACTIVE_CITIES export
apps/customer/lib/cart-context.tsx
  - removed initialCount prop and seed items
  - cart now starts empty
apps/customer/app/page.tsx
  - removed initialCount={2} from CartProvider
apps/customer/components/location-selector.tsx
  - adapted to City object type
  - shows "(próximamente)" for planned cities
apps/customer/tests/setup.ts
  - added matchMedia mock for jsdom
```

### Removed

```text
apps/customer/pnpm-lock.yaml (old standalone lockfile, replaced by root)
apps/customer/.next/ (build artifacts cleaned)
apps/partner/.next/ (build artifacts cleaned)
apps/central/.next/ (build artifacts cleaned)
```

---

## 12. Phase 1 completion checklist

- [x] Git state was reviewed before migration.
- [x] Existing customer visual design was preserved.
- [x] Customer app builds independently.
- [x] Partner app builds independently.
- [x] Central app builds independently.
- [x] TypeScript strict mode is active.
- [x] `ignoreBuildErrors` is removed.
- [ ] Lint passes (ESLint not yet configured — pending shared config).
- [x] Typecheck passes for all 3 apps.
- [x] Tests pass (11/11).
- [x] All three builds pass.
- [x] Cart starts empty.
- [x] Saltillo is the only active visible city.
- [x] No internal partner identity is exposed.
- [x] `.env.example` contains no secrets.
- [x] Real `.env` files are ignored.
- [x] GitHub Actions validates installation, lint, typecheck, build, and test.
- [x] Loading, error, and not-found states exist.
- [x] The final repository structure is documented.
- [x] No destructive Git operation was used.
- [x] No push was performed without explicit authorization.

---

## 13. Remaining known risks

### Critical

- No database.
- No authentication.
- No authorization.
- No RLS.
- No payment validation.
- No financial ledger.
- No production security controls.

### High

- ESLint not yet configured with shared config across workspace.
- No secrets inventory.
- No backup validation.
- No incident instrumentation.
- No provider integrations.
- No production privacy implementation.

### Medium

- In-memory cart.
- Hardcoded product data.
- Incomplete routes.
- Incomplete PWA support.
- No shared ESLint config.

### Low

- Dead visual components from v0 prototype.
- Prototype console actions.
- Temporary placeholder assets.
- Prettier not yet run across codebase.

---

## 14. Next recommended technical phase

After repository stabilization:

# Phase 2 — Local Supabase foundation and identity model

Recommended scope:

- Create local Supabase configuration.
- Create versioned migrations.
- Create identity and geography entities.
- Create roles.
- Create partner membership.
- Create customer profile.
- Create recipient model.
- Define city and zone status.
- Add initial RLS policies.
- Add database tests.
- Add generated database types.
- Keep production credentials excluded.

Do not start payment, refund, payout, or HADIA tool execution before identity, authorization, and audit foundations exist.

---

## 15. Change log

### Phase 1 — Repository Stabilization and Monorepo Foundation

```text
Date: 2026-07-13
Agent: OpenCode
Phase: 1 — Repository Stabilization and Monorepo Foundation
Summary:
  - Migrated mpho-website/ to apps/customer/
  - Created apps/partner/ and apps/central/ shells
  - Created 5 shared packages
  - Configured pnpm workspaces
  - Removed ignoreBuildErrors
  - Fixed package naming
  - Restricted cities to Saltillo (active) + Ramos Arizpe (planned)
  - Removed fake cart state
  - Added loading/error/not-found states
  - Added 11 automated tests
  - Added GitHub Actions CI
  - Added .env.example, .prettierrc, tsconfig.base.json
Validation:
  - Typecheck: PASS (all 3 apps)
  - Tests: PASS (11/11)
  - Build: PASS (all 3 apps)
  - Install: PASS (451 packages)
Known risks remaining:
  - No database, auth, payments, or integrations
  - ESLint shared config pending
  - Prettier not yet applied across codebase
```
