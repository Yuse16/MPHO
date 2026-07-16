# 74_OPERATIONAL_REVIEW_AND_FINAL_QUOTE.md

## 1. Objective and status

Phase 7 implements operational review and a final quote before payment. Its maximum state is `quoted`. Migration: `20260716090000_operational_review_final_quotes.sql`.

## 2. Scope

Implemented: `draft → quote_pending → quoted`, controlled regressions, single internal fulfillment source, operational review, expiring checks, manual delivery proposal and approval, explicit zero service charge, final immutable quote, expiry/invalidation, redacted audit, Customer-safe output and minimal Central workflow.

Excluded: payment, `pending_payment`, `paid`, responsible partner, Partner offers or acceptance, inventory/capacity reservation, preparation, delivery execution, tracking, refund, ledger, payout, earning, commission, external products, multimedia, HADIA, MPHORA, WhatsApp and n8n.

## 3. Lifecycle

Customer requests `draft → quote_pending`. Central may return `quote_pending → draft` using only approved public reason codes. An administrator may finalize `quote_pending → quoted` after every gate passes. Expiry or material invalidation returns `quoted → quote_pending` and invalidates the old quote.

Formal partner assignment remains after payment exactly as defined in document 13. Manual confirmation is temporary evidence, never assignment, acceptance, reservation or preparation authority.

## 4. Single internal fulfillment source

Every local listing added to a pilot cart must resolve internally to the same non-null fulfillment source. The browser neither sends nor receives that identifier. A different source or an external listing is rejected with `INCOMPATIBLE_CART_ITEM` and the neutral Customer message:

> Este producto necesita gestionarse por separado. Crea otro pedido para continuar.

Historical incompatible carts are preserved but cannot enter review.

## 5. Model

- `order_reviews`: one versioned review per order with owner, public/internal reasons, next action and evidence expiry.
- `order_availability_checks`: catalog, fulfillment source, city, zone, schedule, capacity, personalization and delivery with `pending`, `validated`, `rejected` or `requires_intervention`.
- `quote_components`: delivery and service only. One pending delivery proposal per order and one component type per final quote.
- `audit_logs`: redacted command/idempotency evidence with actor, role, reason, versions and request ID.

No assignment, reservation, payment, delivery-quote, ledger or Partner task table is introduced.

## 6. Availability

Database-derived catalog, source and geography checks are expiring evidence. Schedule, capacity and personalization may use `manual_confirmation` during the pilot. Every validated check records source, actor, check time and expiry. No stock check exists and stock is never marked validated without authoritative inventory.

## 7. Delivery and service

An MPHO operator or administrator proposes delivery with integer minor units, MXN, source, reference, reason, expiry and pricing version. Only `manual_verified` and configured `zone_rate` are accepted. An `mpho_admin` approves it separately; one person may perform both actions but both audit events remain distinct.

Service is a real final component:

```text
amount_minor = 0
currency = MXN
source_type = pilot_no_service_fee
```

Zero does not mean unknown.

## 8. Final quote transaction

Finalization locks the order and review, checks expected version and role, verifies all checks and the approved unexpired delivery component, recalculates catalog selections server-side, creates new quote/items, adds delivery and service components, expires the quote at the earlier of 30 minutes or delivery expiry, invalidates the preliminary quote, updates order financial snapshots, transitions to `quoted`, and writes state/audit records atomically.

The browser cannot submit subtotal, delivery, service, total, currency, quote ID, status, availability or internal source.

## 9. Price difference

Customer receives preliminary subtotal, recalculated subtotal, delivery, service, final total, difference, public explanation and expiry. No variation is silent and payment remains disabled.

## 10. Customer contract

Customer receives its own reference, public state, public review reason/action, public items and financial breakdown. It never receives internal source identity, checks, sources, notes or audit data. `quote_pending` is shown as “MPHO está validando disponibilidad, entrega y precio final.” `quoted` states that payment will be enabled in a later phase.

## 11. Central contract and PII

Central queue/detail are authenticated and private/no-store. Lists show masked recipient/address data. Exact revelation requires a staff role, reason, idempotency key and audit event. Audit metadata contains no PII. Partner has no Phase 7 order endpoint or policy.

## 12. Authorization and database security

New tables are RLS-enabled and default-deny with no direct application-role writes. Narrow `SECURITY DEFINER` commands use empty `search_path`, qualified objects, server-derived identity/roles and revoked `PUBLIC` execution. Customer can only request review for its order. Central commands require `mpho_operator` or `mpho_admin`; approval, finalization and invalidation require admin.

## 13. Idempotency and concurrency

Commands require `expectedVersion`, `Idempotency-Key` and server request ID. Canonical server hashes provide replay and conflict semantics. Orders/reviews/components are locked where required. Unique indexes restrict one pending delivery proposal and one component type per final quote.

## 14. Time contract

Requested delivery remains a `timestamptz` derived from the named `America/Monterrey` civil-time contract. Final quote TTL is server-side and initially 30 minutes; React does not determine it. Tests run under UTC and America/Monterrey.

## 15. Pilot operations and remaining blockers

Central manually reviews schedule, capacity, personalization, availability evidence and delivery. Payment and formal assignment stay blocked. Production still requires approved delivery configuration/provider, authoritative inventory, retention/observability/rate-limit controls, legal readiness and the later payment/assignment phases.

## 16. Validation evidence

- Frozen dependency installation and client-secret scan pass.
- ESLint and strict TypeScript pass across the workspace.
- Workspace tests pass: 86 Customer tests, 6 Central tests, 12 database-type tests, 9 quote-engine tests and 2 validation tests.
- Customer tests pass under both `TZ=UTC` and `TZ=America/Monterrey`.
- Fresh Supabase reset passes all migrations and seed.
- 132 pgTAP/RLS assertions pass, including 38 dedicated to Phase 7 and the removal of stale financial amounts after quote expiry.
- Catalog, quote, cart/order and Phase 7 REST/RPC suites pass.
- Generated database types and schema drift checks pass.
- Customer, Partner and Central production builds pass.
- Visual review passes at 1280×720 and 390×844 for final Customer quote and Central review: no horizontal overflow, no console warning/error, Customer contains no internal source identity and Central masks PII.
