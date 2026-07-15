# 73_PERSISTENT_CART_AND_DRAFT_ORDER.md

## 1. Objective and status

Phase 6 implements MPHO's first persistent Customer cart and the atomic creation of an order exclusively in `draft`. It is a preparation boundary, not checkout, payment, reservation, partner assignment, logistics, tracking, or authorization to fulfill.

Base: `827a2fb`. Migration: `20260715180000_persistent_cart_and_draft_orders.sql`. Production remains blocked.

## 2. Scope

Included: real listing selections, quantity, variant, options, text-only personalization, one recipient, one delivery address, one requested date, optimistic concurrency, server quote revalidation, fresh quote snapshot, draft order/item snapshots, initial state history, owner-only API/UI and database-backed idempotency.

Excluded: payment, Mercado Pago, inventory reservation, transactional inventory, responsible partner, partner offer/assignment, preparation, delivery, courier, tracking, refunds, ledger, earnings, payouts, promotions, taxes, commissions, HADIA execution, MPHORA execution, WhatsApp, n8n and multimedia.

## 3. Model

```text
carts
├── cart_items
│   ├── cart_item_options
│   └── cart_item_personalizations
├── cart_recipients
└── cart_delivery_addresses

carts --converted_order_id--> orders --quote_id--> quotes
                              ├── order_items
                              └── order_state_history
```

`carts.status` is limited to `active`, `converted`, and `abandoned`. A partial unique index permits only one active cart per Customer. `orders.current_state` is an enum containing only `draft` in this phase.

The maximum quantity is 20 per item and a cart supports at most 20 item rows. These are technical abuse and payload controls, not business inventory declarations.

## 4. Ownership and PII

Customer identity is resolved from the authenticated Supabase subject inside the database. No mutation accepts `customer_id` as authority.

Recipient names, phones, delivery notes, full addresses, dedications and personalization instructions are sensitive. They are returned only to the owning Customer through private `no-store` responses. They must not enter logs, analytics, generic offline caches or partner DTOs.

Cart data is not automatically copied into saved `recipients` or `addresses`. Optional saved references are accepted only after verifying that the referenced row belongs to the same Customer. The general polymorphic address policies were not broadened.

## 5. Cart and concurrency

Every mutation supplies `expectedVersion`. The function locks the active cart, compares the expected and current versions, applies one validated mutation and increments the version. A stale client receives `VERSION_CONFLICT` and the current version; no partial update is applied.

The browser may cache the confirmed DTO for UX, but it is never the official source. The server response replaces local state. Two concurrent tabs cannot silently overwrite each other.

## 6. Items and personalization

`listing_id`, `variant_id`, option IDs and quantity are selections only. The database verifies publication, active product, variant/listing membership, option/listing membership and option uniqueness. It stores no browser-supplied authoritative price or confirmed availability.

Personalization supports three optional plain-text fields: recipient name (120 characters), message (500), and instructions (1000). HTML-like tags are rejected, arbitrary objects and files are rejected, multimedia is absent, and React renders text normally without `dangerouslySetInnerHTML`. Text must be explicitly confirmed before draft conversion.

## 7. Recipient, address and date

Each cart has at most one `cart_recipient`, one `cart_delivery_address`, and one `requested_delivery_at`. The selected zone must be active and belong to the active city, but this does not prove real coverage or capacity.

The requested date uses `timestamptz`, must be in the future at mutation and conversion time, and is never presented as a confirmed window, promise or reservation.

## 8. Revalidation and quote snapshot

Draft creation reconstructs the Phase 5 request exclusively from persisted cart rows and invokes `calculate_public_quote`. It does not accept a prior quote ID or browser totals.

- `unavailable` or a typed catalog/zone error: rollback; no quote/order is created.
- `requires_review`: create a draft with `total_is_final = false` and pending components.
- `eligible`: create a draft, still without reservation or operational confirmation.

A new immutable `quotes`/`quote_items` snapshot is written inside the same transaction as the order.

## 9. Draft order and audit history

`orders` deliberately excludes responsible partner, payment, delivery, assignment, preparation, refund, commission, earning and payout fields. It stores safe public reference, Customer, source cart/version, quote, recipient/address snapshots, requested date, known minor-unit totals, finality, availability, pending components, idempotency and version.

`order_items` freezes product, variant, options, personalization, quantity and authoritative known amounts. `order_state_history` allows only one initial event:

```text
NULL → draft
actor_type: customer
reason_code: draft_created
idempotency_key
request_id
created_at
```

No transition service or other state exists yet.

## 10. Atomic conversion and idempotency

`create_customer_draft_order` authenticates, locks the Customer-owned cart with `FOR UPDATE`, checks `active` and `expectedVersion`, validates all required staged data, recalculates Phase 5 pricing, writes quote/order/items/history, converts the cart, links `converted_order_id`, increments version and commits once.

`UNIQUE(customer_id, idempotency_key)` guarantees one order per Customer/key. The server builds a canonical JSON representation of cart ID, expected version, ordered selections, personalization, recipient, address and date, then stores its SHA-256 `request_hash`.

- Same key and hash returns the same order.
- Same key with another effective payload returns `IDEMPOTENCY_CONFLICT`.
- Keys are isolated per Customer.
- Concurrent identical calls serialize to one order.

No browser price participates in the hash.

## 11. RLS and database privileges

All nine Phase 6 tables enable RLS in the creation migration. `anon` has no direct access. `authenticated` receives owner-scoped SELECT only and no INSERT, UPDATE or DELETE. Partners without an active Customer identity cannot call the functions or read cart/order PII.

Mutations use narrowly granted `SECURITY DEFINER` functions with empty `search_path`, schema-qualified objects, internal `auth.uid()` resolution and revoked `PUBLIC` execution. Customer A receives not-found semantics for Customer B's order.

## 12. API and DTOs

Implemented routes:

```text
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/[id]
DELETE /api/cart/items/[id]
PUT    /api/cart/recipient
PUT    /api/cart/address
PUT    /api/cart/delivery
POST   /api/orders/draft
GET    /api/orders/[id]
```

Mutation routes require JSON, same-origin `Origin`/`Host`, allowlisted properties and a 16 KiB maximum body. Responses are typed, contain no stack/SQL/partner data and set `Cache-Control: private, no-store`. Draft creation requires `Idempotency-Key`; the API generates `request_id` server-side.

The Customer UI exposes `/carrito` and `/pedidos/[id]`, handles empty/loading/error/version-conflict states and states explicitly that delivery price, operational availability and final total may require review. It contains no payment or operational purchase button.

## 13. Tests and evidence

Automated coverage includes: unique active cart, selection validation, quantity limit, duplicate/foreign option, foreign variant, inactive/draft catalog, version conflict, PII isolation, text/HTML/length rules, future date, fresh quote, non-final draft, atomic conversion, initial event only, converted cart, request hashing, same/different key behavior, concurrent tabs/calls, Customer A/B, partner, anon, safe DTO, content type, origin, payload allowlist, private caching, empty cart and responsive UI states.

Local automated evidence covers 98 workspace tests, 94 pgTAP assertions, the three REST/RPC boundary suites, generated-type drift, schema drift, lint, strict TypeScript and all three application builds. Visual review passed at 1280×720 and 390×844 for the empty cart, persisted cart, atomic draft creation and draft-order result, with no horizontal overflow, console warning/error or hydration failure. The visual pass found and corrected missing form hydration and the false empty-cart flash during authoritative loading.

## 14. Risks and deferred decisions

- Approved delivery and service price sources.
- Operational availability, capacity, inventory and reservation.
- Quote TTL/expiration and finality.
- Product-specific required-option and personalization schema/capability.
- Private multimedia storage, rights review and malware controls.
- Address geocoding and exact coverage validation.
- Rate limiting and production observability.
- Retention/anonymization periods for abandoned carts and recipient PII.
- Production auth recovery, MFA, incident, backup and launch evidence.
- The controlled lifecycle beyond `draft`.

## 15. Next phase

Define a server-side readiness gate from editable `draft` toward quote review/checkout eligibility. It must resolve final delivery/service pricing, quote expiry, operational availability, personalization compatibility and customer acceptance before any payment integration. Payment, reservation and partner assignment remain prohibited until that contract is approved.
