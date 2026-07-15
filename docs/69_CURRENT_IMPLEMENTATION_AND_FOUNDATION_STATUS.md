# 69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md

## 1. Purpose and evidence date

This document records what is actually implemented in MPHO through Phase 6. It separates working foundations from prototypes and future production work.

- Evidence date: 2026-07-15.
- Base commit: `827a2fb` (Phase 5 merged into `origin/main`).
- Current phase: 6 — persistent Customer cart and atomic draft-order creation.
- Production status: blocked; local validation is not production approval.

## 2. Current repository

```text
MPHO/
├── apps/
│   ├── customer/       Next.js customer application
│   ├── partner/        Next.js MPHO Aliados shell
│   └── central/        Next.js MPHO Central shell
├── packages/
│   ├── config/
│   ├── database/       tracked Supabase-generated types and domain aliases
│   ├── design-tokens/
│   ├── types/
│   ├── ui/
│   └── validation/
├── supabase/
│   ├── migrations/     13 historical migrations plus one Phase 4.1 migration
│   ├── tests/          real pgTAP/RLS catalog tests
│   └── seed.sql
├── scripts/            secret, type-drift, and schema-drift checks
├── docs/               canonical lower-case documentation path
└── .github/workflows/ci.yml
```

The former `DOCS/` path was corrected with a case-safe Git rename. Historical comments inside already-applied migrations still mention `DOCS/`; those migrations remain immutable.

## 3. Status by phase

### Phase 1 — monorepo and visual foundation

- Three independent Next.js applications exist: Customer, Partner, and Central.
- Six shared packages exist and participate in the workspace.
- Customer Home retains the v0 premium visual direction, responsive header/hero, HADIA, recipient selector, catalog areas, empty cart, and mobile navigation.
- Saltillo is active; Ramos Arizpe remains planned.
- The cart starts empty and does not invent products.
- Loading, error, and not-found states exist.

### Phase 2 — database and identity foundation

- Supabase local configuration and versioned migrations exist.
- Identity, roles, customers, geography, addresses, partners, recipients, and catalog foundations exist.
- RLS is enabled on private/domain tables.
- Seed data is reproducible with `supabase db reset`.
- Generated database types are tracked and checked for drift.

### Phase 3 — customer authentication and routing foundation

- Customer has login, signup, callback, auth context, and session refresh.
- Public and protected routes are classified centrally.
- Public routes remain accessible without a session.
- Protected customer routes redirect to login.
- Redirect targets are normalized to local paths; protocol-relative and absolute open redirects are rejected.
- This is an authentication foundation, not a completed production identity or recovery flow.

### Phase 4 — public catalog integration

- Customer catalog reads Supabase rather than treating UI fixtures as an authoritative catalog.
- Category and product-slug queries use a controlled public RPC.
- Published product detail routes exist at `/producto/[slug]` without requiring login.
- Query errors are represented explicitly and are not converted into an empty catalog.
- Public DTO mapping rejects incomplete rows instead of creating products with blank fields.
- Money is represented as integer minor units with currency.

### Phase 4.1 — hardening

- One new forward migration revokes broad grants and introduces least-privilege column grants.
- Draft child records are hidden through parent-aware RLS policies.
- Public catalog and category RPCs return an explicit safe DTO.
- Internal partner, external-source, verification, cancellation, substitution, cost, margin, note, contact, and private-media data are excluded.
- Customer uses separate browser, server, proxy, and anonymous public Supabase clients; none uses `service_role`.
- Browser client creation is singleton-scoped.
- `AuthProvider` creates one client, one auth subscription, and cleans it up.
- Public Next.js variables use literal `process.env.NEXT_PUBLIC_*` references and fail clearly when absent.
- Customer declares both `@supabase/ssr` and `@supabase/supabase-js` directly.
- Turbopack root is resolved portably from each app to the repository root.
- ESLint, TypeScript, Vitest, and builds cover all apps and packages with relevant scripts.
- `@mpho/database` participates in lint, typecheck, and tests.
- Generated `tsconfig.tsbuildinfo` files are ignored and removed from version control.
- Real anonymous PostgREST boundary tests run through `pnpm db:test:rest`.

Full Phase 4.1 decisions and evidence are in `docs/71_CATALOG_SECURITY_TYPES_AND_CI_HARDENING.md`.

## 4. Current functional matrix

| Area | Current status | Boundary |
|---|---|---|
| Customer Home | Implemented prototype | Visual/discovery surface; not a complete storefront |
| Public catalog | Implemented foundation | Published, active, priced MXN listings only |
| Product by slug | Implemented foundation | One controlled result or explicit not-found state |
| Category filtering | Implemented foundation | Server-side exact slug filter |
| Customer auth | Implemented foundation | Login/signup/callback/session routing; not production-complete |
| Customer profile | Protected route | Requires a valid session |
| Cart | Implemented foundation | Customer-owned, persistent, versioned and server-authoritative |
| Draft orders | Implemented foundation | Atomic quote revalidation and immutable snapshots; only `draft` exists |
| Checkout and payment | Missing | No payment initiation, authorization, reservation, or operational execution |
| HADIA | Visual only | No AI execution or privileged tools |
| MPHORA | Truthful placeholder | No item is labeled fast without operational eligibility |
| Partner app | Compiling shell | Operational workflows not implemented |
| Central app | Compiling shell | Admin workflows not implemented |
| Payments/refunds | Missing | No provider or ledger |
| Earnings/payouts | Missing | No financial workflow |
| Delivery | Missing | No provider or state execution |
| PWA/offline/push | Incomplete | Not production accepted |

## 5. Security boundary now implemented

Anonymous catalog access is limited at two layers:

1. Column grants prevent selection of internal listing columns.
2. RLS prevents drafts and draft child records from becoming visible.

The customer-facing contract uses `get_public_catalog` and `get_public_catalog_categories`. Direct broad table selection is not the application contract. `service_role` is absent from client code and no privileged database helper is exported from `@mpho/database`.

This does not prove production security. Production secrets, MFA, recovery, monitoring, backups, incident readiness, provider controls, and the launch checklist remain unresolved.

Phase 6 adds private cart/order tables with RLS and authenticated owner-only reads. `anon` has no table access, and `authenticated` has no direct INSERT, UPDATE, or DELETE. Versioned cart mutations and draft conversion run through narrowly granted `SECURITY DEFINER` functions with empty `search_path`, internally resolved Customer identity, payload limits, request hashing, and cross-customer not-found semantics. Recipient, address, dedication, and instructions are not logged or sent to analytics.

## 6. Tests and CI

Local validation covers:

- frozen workspace install;
- client-secret scan;
- lint and strict typecheck;
- unit/component tests;
- builds for Customer, Partner, and Central;
- local Supabase start/reset;
- 94 pgTAP/RLS assertions across catalog, quote, cart, order, grants, ownership, idempotency, and concurrency boundaries;
- anonymous PostgREST calls;
- generated-type drift;
- schema drift.

The CI workflow pins third-party Actions by full commit SHA and repeats the same core checks without `--ignore-health-check`. Local equivalence does not mean the remote GitHub Actions run is green; remote status remains pending until a future authorized push.

## 7. Removed premature behavior

The earlier `validation.test.ts` tested a simplified order-transition map and a fixed cancellation assumption before the approved lifecycle, actors, reasons, idempotency, payment, and operational controls existed in code. The premature transition implementation and fixed cancellation configuration were removed.

Valid validation coverage was replaced with a package-level Money test that enforces safe integer minor units and rejects fractional or empty product data. The authoritative documented lifecycle in `docs/13_ORDER_LIFECYCLE.md` was not removed or weakened.

## 8. Known remaining risks

### Production blockers

- No completed checkout, order state machine, payment, refund, ledger, payout, or delivery implementation.
- No completed production auth recovery, MFA, privileged-role administration, or security monitoring.
- No production backup/restore or incident evidence.
- Legal, tax, privacy, partner-contract, and launch decisions remain unresolved.
- Partner and Central are shells, not accepted operational PWAs.

### Product and technical debt

- Production rate limiting, observability, abandoned-cart retention/anonymization, and recipient-PII lifecycle controls remain unresolved.
- HADIA and MPHORA are not operational engines.
- Public catalog booleans are conservative until real eligibility rules exist.
- Real device/PWA installation, offline, update, notification, and logout testing remains pending.
- Remote GitHub Actions validation remains pending until an authorized push.

## 9. Phase 5 merged foundation

Phase 5, merged into `origin/main` at `827a2fb`, introduces an authoritative quote boundary without implementing checkout or money movement. The database recalculates base price plus active variant and option adjustments, persists immutable customer-owned snapshots idempotently, and returns a public DTO without partner identity. Delivery and service remain `null`; the total is explicitly not final and availability requires review. Customer product detail offers a preview-only calculator. No inventory is read or reserved, and no payment, assignment, delivery, HADIA, or MPHORA execution exists.

The applied model is `quotes` plus `quote_items`; `quote_adjustments` and `pricing_rules` were not created because no approved rule requires them. Full evidence and deferred decisions are recorded in document 72.

## 10. Phase 6 implementation

- One active cart per Customer is enforced by a partial unique index.
- Every cart mutation requires `expectedVersion`; successful mutations increment it and stale clients receive `VERSION_CONFLICT`.
- Listing, variant, option, quantity, text personalization, recipient, address, zone, and requested date are persisted without trusting browser price or availability.
- Cart recipient and address data are temporary and are not automatically inserted into saved `recipients` or `addresses`.
- Draft creation locks the cart, recalculates Phase 5 pricing, creates a fresh immutable quote, snapshots the order and items, writes only `NULL → draft`, and converts the cart in one transaction.
- Database idempotency uses `(customer_id, idempotency_key)` plus a server-generated SHA-256 request hash.
- Customer routes expose `/carrito` and `/pedidos/[id]` without payment, reservation, partner assignment, tracking, or delivery promises.

Full decisions and evidence are in `docs/73_PERSISTENT_CART_AND_DRAFT_ORDER.md`.

## 11. Next recommended work

Define the controlled transition from `draft` into quote review/checkout readiness, including approved delivery/service pricing, finality, expiration, operational availability, complete personalization compatibility, and a production-ready authentication/rate-limit/observability baseline. Payment remains blocked until those gates are complete.

Do not infer production readiness from local compilation or local Supabase tests.
