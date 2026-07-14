# 69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md

## 1. Purpose and evidence date

This document records what is actually implemented in MPHO through Phase 4.1. It separates working foundations from prototypes and future production work.

- Evidence date: 2026-07-14.
- Base commit: `3f7d2fa` (`feat: implement Supabase public catalog`).
- Current phase: 4.1 — catalog security, generated types, client/auth/route hardening, and complete workspace CI.
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
| Cart | In-memory prototype | Starts empty; no server persistence |
| Checkout and orders | Missing | No trusted production flow |
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

## 6. Tests and CI

Local validation covers:

- frozen workspace install;
- client-secret scan;
- lint and strict typecheck;
- unit/component tests;
- builds for Customer, Partner, and Central;
- local Supabase start/reset;
- 24 pgTAP/RLS assertions;
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

- Customer cart is local and non-authoritative.
- HADIA and MPHORA are not operational engines.
- Public catalog booleans are conservative until real eligibility rules exist.
- Real device/PWA installation, offline, update, notification, and logout testing remains pending.
- Remote GitHub Actions validation remains pending until an authorized push.

## 9. Next recommended work

After Phase 4.1 is reviewed and committed, the next approved phase should build on the safe catalog and identity foundations without beginning money movement prematurely. Define and test the real order lifecycle, actor permissions, idempotency, audit events, and exception handling before checkout or provider integrations.

Do not infer production readiness from local compilation or local Supabase tests.
