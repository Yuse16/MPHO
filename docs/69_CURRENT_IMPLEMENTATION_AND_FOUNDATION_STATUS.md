# 69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md

## 1. Purpose and evidence date

This document records what is actually implemented in MPHO through Phase 8. It separates working foundations from prototypes and future production work.

- Evidence date: 2026-07-16.
- Base commit: `4d0bce2` (Phase 7 merged into `origin/main`).
- Completed code boundary: Phase 8 — Checkout Pro and provider-verified integrity through `paid`; database/sandbox acceptance remains pending.
- Production status: blocked; local validation is not production approval.

For the cross-product capability matrix and recommended execution sequence, see `docs/75_PRODUCT_COMPLETION_GAPS_AND_CAPABILITY_ROADMAP.md`.

## 2. Current repository

```text
MPHO/
├── apps/
│   ├── customer/       Next.js customer application
│   ├── partner/        Next.js MPHO Aliados shell
│   └── central/        Next.js MPHO Central pre-payment review module
├── packages/
│   ├── config/
│   ├── database/       tracked Supabase-generated types and domain aliases
│   ├── design-tokens/
│   ├── types/
│   ├── ui/
│   └── validation/
├── supabase/
│   ├── migrations/     versioned foundation and Phase 4.1–7 migrations
│   ├── tests/          pgTAP/RLS tests through operational review
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
| Customer Home | PARTIAL | Visual/discovery surface backed by public catalog; not a complete storefront |
| Public catalog | PARTIAL | Published, active, priced MXN listings and safe public DTO; no search, filters or authoritative stock |
| Product by slug | IMPLEMENTED | One controlled public result or explicit not-found state |
| Category filtering | IMPLEMENTED | Server-side exact slug filter; broad discovery filters remain planned |
| Customer auth | PARTIAL | Login/signup/callback/session routing; recovery and production controls remain incomplete |
| Customer profile | PARTIAL | Protected route exists; full account and retention functions do not |
| Quote | IMPLEMENTED | Authoritative preliminary and final immutable quote boundaries exist through `quoted` |
| Cart | IMPLEMENTED | Customer-owned, persistent, versioned and server-authoritative |
| Draft orders | IMPLEMENTED | Atomic quote revalidation, immutable snapshots, idempotency and owner-only retrieval |
| Operational review | IMPLEMENTED | `draft → quote_pending → quoted`, expiring checks, audit and controlled regressions |
| Checkout and payment | PARTIAL | Checkout Pro, private attempts, verified webhook, controlled requery and atomic `paid`; sandbox/production acceptance remains blocked |
| HADIA | PLANNED | Visual entry only; no AI execution, grounding, memory or tools |
| MPHORA | BLOCKED | Candidate flag exists without operational eligibility; Customer “Entrega hoy” mapping is not verified |
| Partner app | PARTIAL | Compiling shell only; operational workflows are not implemented |
| Central app | PARTIAL | Minimal pre-payment review queue/detail exists; full tower-of-control workflows do not |
| Payments/refunds | BLOCKED | No provider, payment/refund records or ledger |
| Earnings/payouts | PLANNED | No executable financial workflow |
| Delivery | PLANNED | Pre-payment delivery amount can be manually verified; no dispatch, tracking or delivery state execution |
| PWA/offline/push | PARTIAL | Three independent web applications exist; manifests, workers, notifications and device acceptance are incomplete |

## 5. Security boundary now implemented

Anonymous catalog access is limited at two layers:

1. Column grants prevent selection of internal listing columns.
2. RLS prevents drafts and draft child records from becoming visible.

The customer-facing contract uses controlled public RPCs. Direct broad table selection is not the application contract. `service_role` is absent from client code and no privileged database helper is exported from `@mpho/database`.

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
- 132 pgTAP/RLS assertions across catalog, quote, cart, order, operational review, grants, ownership, idempotency, and concurrency boundaries;
- anonymous PostgREST calls;
- generated-type drift;
- schema drift.

The CI workflow pins third-party Actions by full commit SHA and repeats the same core checks without `--ignore-health-check`. Local equivalence does not mean the remote GitHub Actions run is green; remote status remains pending until a future authorized push.

## 7. Removed premature behavior

The earlier `validation.test.ts` tested a simplified order-transition map and a fixed cancellation assumption before the approved lifecycle, actors, reasons, idempotency, payment, and operational controls existed in code. The premature transition implementation and fixed cancellation configuration were removed.

Valid validation coverage was replaced with a package-level Money test that enforces safe integer minor units and rejects fractional or empty product data. The authoritative documented lifecycle in `docs/13_ORDER_LIFECYCLE.md` was not removed or weakened.

## 8. Known remaining risks

### Production blockers

- No payment, lifecycle after `quoted`, refund, ledger, payout, assignment, fulfillment, or delivery execution.
- No completed production auth recovery, MFA, privileged-role administration, or security monitoring.
- No production backup/restore or incident evidence.
- Legal, tax, privacy, partner-contract, and launch decisions remain unresolved.
- Partner is a shell. Central is a narrow pre-payment review module, not an accepted operational PWA.

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

Phase 8 should add initial payment integrity against an unexpired final quote: server-created intent, provider sandbox adapter, verified and replay-safe webhook, explicit payment states, double-charge prevention, idempotent transition toward `paid`, and reconciliation evidence. It must not assign a Punto MPHO before confirmed payment. Production rate limiting, privileged identity, observability, secrets and legal/financial gates remain prerequisites, not optional cleanup.

## 12. Phase 7 implementation

Phase 7, merged into `origin/main` at `4d0bce2`, adds the controlled pre-payment lifecycle `draft → quote_pending → quoted`. It introduces owner/versioned operational reviews, expiring availability evidence, an operator-proposed/admin-approved delivery component, the explicit zero-value pilot service rule, immutable final quotes, invalidation, redacted audit logs, Customer-safe DTOs, and minimal Central review routes.

It does not add payment, assignment, responsible partner, Partner offers, reservation, fulfillment, delivery execution, ledger, earnings, commission, external products, HADIA, MPHORA, WhatsApp or n8n. Partner remains a shell.

Do not infer production readiness from local compilation or local Supabase tests.

## 13. Layer-by-layer truth after Phase 7

- **Customer:** UI, frontend calls, APIs, persistence and RLS exist through final quote. Payment, tracking, support and complete PWA operation do not.
- **Partner:** only the independent application shell exists. There is no official offer, acceptance, inventory, preparation, evidence, incident, earnings or payout workflow.
- **Central:** UI/API/database commands exist only for pre-payment operational review. There is no complete order, fulfillment, delivery, finance, incident or security control tower.
- **Operations:** schedule, capacity and personalization may be confirmed manually as expiring evidence. That evidence is not inventory, reservation, partner acceptance or authority to prepare.
- **Money:** product arithmetic, approved delivery and explicit pilot service of 0 MXN form a final quote. No money is initiated, approved, settled or reconciled.
- **Logistics:** a delivery cost may be approved; no delivery request or custody event exists.
- **Production:** RLS and audit foundations are evidence, but document 38 remains unsatisfied and launch remains blocked.
