# 72_SERVER_SIDE_PRICING_AVAILABILITY_AND_QUOTES.md

## 1. Objective and status

Phase 5 creates MPHO's first authoritative server-side pricing, availability, and quote boundary. Status is **merged into `origin/main` at `827a2fb`**. Migration: `20260715090000_server_side_quotes.sql`.

## 2. Scope

A quote is a time-independent price snapshot of known components. It is not an order, inventory reservation, definitive availability confirmation, payment, partner assignment, delivery promise, checkout, or authorization to fulfill. It never trusts browser amounts and never reveals a Punto MPHO.

Excluded: orders, checkout, Mercado Pago, payment webhooks, ledger, refunds, discounts, taxes, commissions, earnings, payouts, delivery provider, inventory reservation, HADIA, MPHORA, Partner/Central workflows, WhatsApp, n8n, and push notifications.

## 3. Audit classifications

- `confirmed`: no applied quote or pricing-rule tables existed; catalog base/variant/option minor-unit amounts and listing-zone relationships existed; delivery/service rules were unresolved; Customer had only a non-purchasable product page.
- `partially_confirmed`: docs/25 described a single snapshot-oriented `quotes` table, but it lacked item-level auditability, idempotency, nullable unknown components, and the minimum lifecycle required here.
- `already_fixed`: Phase 4.1 already protected partner fields, generated types, public Supabase configuration, and CI ordering.
- `not_reproducible`: no existing quote implementation, reservation, or authoritative browser price flow was found to reuse.
- `new_finding`: the seed catalog has no variants/options, so those paths are proven with pure and database fixtures rather than invented customer-facing selections.

## 4. Data model

`quotes` stores safe public reference, owner, status, availability, MXN totals, nullable delivery/service, zero discount, known total, finality, pending components, optional zone/date/expiry, pricing version, per-customer idempotency key, and invalidation metadata. `quote_items` stores catalog relations, quantity, base/adjustment/final/line minor-unit amounts and public product/variant/option snapshots.

There is no `quote_adjustments` table: variant and option adjustments are item facts, and no other approved adjustment exists. There is no `pricing_rules` table because no approved discount, tax, delivery, service, or commission rule exists.

## 5. States

Quote: `valid`, `requires_review`, `expired`, `invalidated`. Availability: `eligible`, `requires_review`, `unavailable`. No order/payment states are reused. No fixed TTL is invented; `expires_at` is nullable until an approved server configuration exists.

## 6. Availability

The server checks publication, active product/variant/options, active city/zone/listing-zone, valid requested date, currencies, and known configuration. Draft/inactive/inconsistent selections are unavailable and return typed errors. Missing delivery or operational validation produces `requires_review`, never zero. Published catalog presence and `mphora_candidate` never confirm delivery. Inventory is neither read nor reserved.

## 7. Price algorithm and money

```text
unit final = listing base + active variant adjustment + active selected option adjustments
line total = unit final × positive integer quantity
subtotal = sum(line totals)
total known = subtotal + known delivery + known service - known discount
```

All values are integer minor units, MXN, bounded to JavaScript's safe-integer range at the database/TypeScript boundaries. Fractional quantities/adjustments, currency mismatch, negative results, and overflow fail with typed errors. Delivery/service are `null`; discount is exactly zero because no promotion is applied; total is not final. Browser totals, fees, currency, partner, commission, and earnings are rejected by the HTTP parser and ignored by the database calculator.

## 8. API and server boundary

- `POST /api/quotes/preview`: public, non-persistent, validated selection input, authoritative database recalculation.
- `POST /api/quotes`: authenticated Customer, mandatory `Idempotency-Key`, recalculates and persists transactionally.
- `GET /api/quotes/[id]`: authenticated owner only; another user's UUID returns not-found semantics.

The boundary uses the public anon client or the Customer session plus narrowly granted `SECURITY DEFINER` RPCs with empty `search_path`. No service-role key exists in Customer or `NEXT_PUBLIC_*`.

## 9. Idempotency

`UNIQUE(customer_id, idempotency_key)` is the durable control. The creation function returns the existing snapshot for the same Customer/key, including under a uniqueness race. Another Customer has a separate namespace and cannot discover the first quote.

## 10. RLS and grants

Both tables have RLS. `anon` has no table privileges. `authenticated` receives SELECT only; owner policies derive Customer from the authenticated subject. There is no direct INSERT/UPDATE/DELETE grant, so amounts, owner, status, and snapshots cannot be client-mutated. Partner users have no quote policy. Preview/configuration RPCs are executable by anon/authenticated; create/get RPCs are authenticated only.

## 11. Public DTO and partner privacy

The DTO contains quote/reference/status/availability, public item identity, selected public variant/options, Money values, pending components and expiry. It excludes partner identity/contact/location, source IDs, private inventory/capacity/verification, cost, margin, commission, earning, notes, SQL and internal metadata. MPHO remains the only customer-facing identity.

## 12. Error contract

Expected codes include `INVALID_REQUEST`, `LISTING_NOT_FOUND`, `LISTING_NOT_PUBLIC`, `PRODUCT_INACTIVE`, `VARIANT_INVALID`, `OPTION_INVALID`, `ZONE_UNAVAILABLE`, `CURRENCY_MISMATCH`, `INVALID_QUANTITY`, `PRICE_OVERFLOW`, `REQUIRES_REVIEW`, `CONFIGURATION_ERROR`, `DATABASE_ERROR`, `UNAUTHORIZED`, and `FORBIDDEN`. Public responses contain no stack or SQL.

## 13. Customer integration

`/producto/[slug]` retains its design and adds quantity, optional variant/options, active zone, preview action, loading/error/result states, known subtotal, availability explanation, pending components, and explicit notice that there is no purchase/order. The purchase button remains disabled.

## 14. Tests and results

Coverage includes pure arithmetic/overflow/currency/availability; browser manipulation rejection; route DTO/auth/not-found behavior; UI loading, result, review, and network error; pgTAP grants/RLS/owner/idempotency/draft/invalid selection; REST/RPC preview, manipulated input, persistence and cross-customer isolation.

Final local evidence on 2026-07-15:

```text
pnpm install --frozen-lockfile  PASS, 11 workspace projects
pnpm security:check            PASS
pnpm lint                      PASS, 10 scripted workspaces
pnpm typecheck                 PASS, 10 scripted workspaces
pnpm test                      PASS, 80 tests (57 Customer, 9 quote engine, 12 database, 2 validation)
npx supabase stop/start        PASS, normal health checks; no ignore flag
npx supabase db reset          PASS, 15 migrations plus seed
npx supabase test db           PASS, 45/45 pgTAP assertions
pnpm db:test:rest              PASS, catalog plus quote REST/RPC boundaries
pnpm db:types                  PASS
pnpm db:types:check            PASS, no generated-type drift
pnpm db:schema:check           PASS, no schema drift
pnpm build                     PASS, Customer + Partner + Central on Next.js 16.2.6
```

Visual/browser evidence passed at 1280×720 and 390×844 on `/producto/rosas-premium`: preview returned the authoritative `$1,290` subtotal, `requires_review`, null delivery, pending delivery/operational validation, and non-final notice. Console contained no warning/error or hydration failure; API returned expected 200 responses; document scroll width equaled viewport width; no partner/internal term appeared. The first visual run found and fixed an overly strict RFC-version UUID regex that rejected deterministic PostgreSQL seed UUIDs.

## 15. Deferred decisions and risks

- Delivery/service price sources and configuration.
- Tax, promotion, commission, and earning rules.
- Quote TTL and expiry processing.
- Inventory and capacity integration.
- Required-option semantic validation beyond active selected options.
- Rate limiting and production observability.
- Quote-to-order conversion beyond a non-final `draft`; Phase 6 now performs a fresh server recalculation and snapshot but does not advance checkout readiness.
- Seed catalog variants/options suitable for real merchandising.

## 16. Next recommended phase

Phase 6 implements persistent cart conversion only into `draft`, with fresh revalidation, snapshots, initial audit history, concurrency control and idempotency. A later phase must define final quote readiness and controlled lifecycle transitions before any payment provider.

Phase 7 now implements that later boundary without payment. A final quote is a new immutable snapshot with approved delivery, an explicit `pilot_no_service_fee` component, `totalIsFinal = true`, `availabilityStatus = eligible`, a 30-minute server-side expiry and an auditable pricing version. The preliminary quote is invalidated rather than overwritten. See document 74.
