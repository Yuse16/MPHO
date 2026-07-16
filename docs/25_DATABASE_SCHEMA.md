# 25_DATABASE_SCHEMA.md

> Phase 8 implementation note (2026-07-16): `payment_attempts`, sanitized `payment_provider_events`, `orders.active_payment_attempt_id` and `orders.paid_at` were added with RLS default deny, restricted foreign keys, uniqueness/idempotency and transactional approval. See migration `20260716180000_payment_integrity_foundation.sql` and document 76.

## 1. Purpose

This document defines the conceptual PostgreSQL database schema for MPHO.

It describes:

- Core entities.
- Relationships.
- Important fields.
- Status enums.
- Constraints.
- Indexes.
- Row-level security expectations.
- Audit requirements.
- Financial integrity.
- MVP table scope.

This is a conceptual source of truth.

Actual migrations must be created carefully and may refine field names while preserving documented meaning.

This document must be read together with:

- `10_USER_ROLES.md`
- `13_ORDER_LIFECYCLE.md`
- `17_CATALOG_AND_INVENTORY.md`
- `22_PAYMENTS_AND_PAYOUTS.md`
- `24_SYSTEM_ARCHITECTURE.md`
- `27_SECURITY_AND_PRIVACY.md`

---

## 2. Database principles

The MPHO database must:

- Preserve history.
- Enforce relationships.
- Use explicit status fields.
- Use integer minor units for money.
- Store currency.
- Use timestamps.
- Support idempotency.
- Support audit.
- Support partner scoping.
- Avoid soft assumptions.
- Avoid direct destructive edits to financial history.

---

## 3. Naming conventions

Recommended:

- Snake case.
- Plural table names or one consistent standard.
- UUID primary keys.
- Human-readable order number separate from ID.
- `created_at` and `updated_at`.
- `deleted_at` only where soft deletion is approved.
- Foreign keys ending in `_id`.
- Monetary fields ending in `_amount_minor`.
- Currency fields named `currency`.
- Boolean names beginning with `is_`, `has_`, or `can_`.

---

## 4. Core entity groups

```text
Identity
Customers and recipients
Partners
Geography
Catalog
Inventory
Pricing and quotes
Orders
Fulfillment
External purchases
Payments and refunds
Earnings and payouts
Delivery
Notifications
HADIA
Support and incidents
Audit and configuration
```

---

## 5. Profiles

### `profiles`

Purpose:

Maps authenticated users to MPHO identity.

Suggested fields:

```text
id uuid primary key
auth_user_id uuid unique not null
email text
phone text
display_name text
status text not null
default_role text not null
created_at timestamptz not null
updated_at timestamptz not null
last_login_at timestamptz
```

Constraints:

- One profile per auth user.
- Status must use approved enum.
- Email and phone normalized.

---

## 6. User roles

### `user_roles`

```text
id uuid primary key
profile_id uuid not null references profiles
role text not null
partner_id uuid null references partners
status text not null
created_at timestamptz not null
revoked_at timestamptz
created_by uuid null references profiles
```

Constraints:

- Role must be approved.
- Partner roles require partner ID.
- Unique active role per profile, role, and partner.

---

## 7. Customers

### `customers`

```text
id uuid primary key
profile_id uuid unique not null references profiles
marketing_consent boolean not null default false
preferred_currency text not null default 'MXN'
created_at timestamptz not null
updated_at timestamptz not null
```

---

## 8. Recipients

### `recipients`

```text
id uuid primary key
customer_id uuid not null references customers
name text not null
relationship text
phone text
surprise_mode text
notes text
consent_basis text
created_at timestamptz not null
updated_at timestamptz not null
archived_at timestamptz
```

RLS:

- Customer may access own recipients.
- Partner access only through active assigned order and limited view.

---

## 9. Addresses

### `addresses`

```text
id uuid primary key
owner_type text not null
owner_id uuid not null
label text
street text not null
exterior_number text not null
interior_number text
neighborhood text
postal_code text
city_id uuid not null references cities
state text
country_code text not null default 'MX'
latitude numeric
longitude numeric
references_text text
is_default boolean not null default false
created_at timestamptz not null
updated_at timestamptz not null
archived_at timestamptz
```

`owner_type` may represent:

- Customer.
- Recipient.
- Partner.
- Order snapshot.

Polymorphic ownership should be used carefully.

Alternative: separate address relation tables.

---

## 10. Cities

### `cities`

```text
id uuid primary key
name text not null
state text not null
country_code text not null
timezone text not null
currency text not null
status text not null
created_at timestamptz not null
updated_at timestamptz not null
```

Unique:

- Name, state, country.

---

## 11. Zones

### `zones`

```text
id uuid primary key
city_id uuid not null references cities
name text not null
slug text not null
status text not null
postal_codes text[]
boundary_geojson jsonb
mphora_enabled boolean not null default false
operating_hours jsonb
created_at timestamptz not null
updated_at timestamptz not null
```

Indexes:

- City.
- Status.
- Slug unique by city.
- Geographic index if PostGIS is introduced.

---

## 12. Partners

### `partners`

```text
id uuid primary key
public_name text not null
legal_name text
slug text not null unique
status text not null
city_id uuid not null references cities
primary_zone_id uuid references zones
address_id uuid references addresses
phone text
email text
timezone text
payout_currency text not null default 'MXN'
agreement_version text
agreement_accepted_at timestamptz
created_at timestamptz not null
updated_at timestamptz not null
paused_at timestamptz
suspended_at timestamptz
closed_at timestamptz
```

---

## 13. Partner capabilities

### `partner_capabilities`

```text
id uuid primary key
partner_id uuid not null references partners
capability_code text not null
status text not null
approved_by uuid references profiles
approved_at timestamptz
restrictions jsonb
created_at timestamptz not null
updated_at timestamptz not null
```

Unique:

- Partner and capability code.

---

## 14. Partner schedules

### `partner_schedules`

```text
id uuid primary key
partner_id uuid not null references partners
day_of_week smallint not null
opens_at time
closes_at time
is_closed boolean not null default false
effective_from date
effective_to date
created_at timestamptz not null
updated_at timestamptz not null
```

### `partner_schedule_exceptions`

For holidays or temporary changes.

---

## 15. Partner capacity

### `partner_capacity`

```text
id uuid primary key
partner_id uuid not null references partners
capacity_type text not null
capacity_value integer not null
active_count integer not null default 0
valid_from timestamptz
valid_until timestamptz
updated_by uuid references profiles
updated_at timestamptz not null
```

Capacity types:

- General orders.
- MPHORA.
- Package receiving.
- Preparation.

---

## 16. Product definitions

### `products`

```text
id uuid primary key
name text not null
slug text not null unique
description text
product_type text not null
category_id uuid references categories
brand text
attributes jsonb
dimensions jsonb
weight_grams integer
is_fragile boolean not null default false
is_perishable boolean not null default false
is_restricted boolean not null default false
status text not null
created_at timestamptz not null
updated_at timestamptz not null
archived_at timestamptz
```

---

## 17. Categories

### `categories`

```text
id uuid primary key
parent_id uuid references categories
name text not null
slug text not null unique
type text not null
status text not null
sort_order integer not null default 0
created_at timestamptz not null
updated_at timestamptz not null
```

Types:

- Product.
- Occasion.
- Recipient.
- Style.

---

## 18. Product tags

### `tags`

```text
id uuid primary key
name text not null
slug text not null unique
type text not null
status text not null
```

### `product_tags`

```text
product_id uuid references products
tag_id uuid references tags
primary key (product_id, tag_id)
```

---

## 19. Listings

### `listings`

```text
id uuid primary key
product_id uuid not null references products
partner_id uuid references partners
source_type text not null
external_source_id uuid references external_sources
customer_title text not null
customer_description text
status text not null
availability_mode text not null
base_price_amount_minor bigint
currency text not null
preparation_minutes integer
last_verified_at timestamptz
verification_expires_at timestamptz
substitution_policy text
cancellation_note text
created_at timestamptz not null
updated_at timestamptz not null
published_at timestamptz
paused_at timestamptz
archived_at timestamptz
```

Constraint:

- Local source requires partner ID.
- External source requires external source ID.
- Price must be non-negative.

---

## 20. Listing zones

### `listing_zones`

```text
listing_id uuid not null references listings
zone_id uuid not null references zones
status text not null
primary key (listing_id, zone_id)
```

---

## 21. Listing variants

### `listing_variants`

```text
id uuid primary key
listing_id uuid not null references listings
name text not null
sku text
attributes jsonb
price_adjustment_amount_minor bigint not null default 0
currency text not null
status text not null
created_at timestamptz not null
updated_at timestamptz not null
```

Unique SKU by partner when applicable.

---

## 22. Listing options

### `listing_options`

```text
id uuid primary key
listing_id uuid not null references listings
option_type text not null
label text not null
is_required boolean not null default false
configuration jsonb not null
price_adjustment_amount_minor bigint not null default 0
currency text not null
capability_required text
preparation_minutes_delta integer not null default 0
status text not null
```

---

## 23. Media

### `media_assets`

```text
id uuid primary key
owner_type text not null
owner_id uuid not null
storage_bucket text not null
storage_path text not null
visibility text not null
mime_type text
size_bytes bigint
width integer
height integer
alt_text text
status text not null
created_by uuid references profiles
created_at timestamptz not null
```

---

## 24. Inventory

### `inventory_items`

```text
id uuid primary key
partner_id uuid not null references partners
listing_variant_id uuid not null references listing_variants
on_hand integer not null default 0
reserved integer not null default 0
damaged integer not null default 0
safety_stock integer not null default 0
incoming integer not null default 0
low_stock_threshold integer
last_counted_at timestamptz
updated_at timestamptz not null
version integer not null default 1
```

Constraint:

```text
on_hand >= 0
reserved >= 0
damaged >= 0
safety_stock >= 0
reserved <= on_hand
```

---

## 25. Inventory reservations

### `inventory_reservations`

```text
id uuid primary key
inventory_item_id uuid not null references inventory_items
order_id uuid references orders
quote_id uuid references quotes
quantity integer not null
status text not null
idempotency_key text not null unique
reserved_at timestamptz not null
expires_at timestamptz
released_at timestamptz
consumed_at timestamptz
```

---

## 26. Inventory adjustments

### `inventory_adjustments`

```text
id uuid primary key
inventory_item_id uuid not null references inventory_items
quantity_delta integer not null
reason_code text not null
order_id uuid references orders
actor_id uuid references profiles
evidence_media_id uuid references media_assets
created_at timestamptz not null
```

---

## 27. External sources

### `external_sources`

```text
id uuid primary key
provider_name text not null
external_listing_id text
source_url text not null
observed_price_amount_minor bigint
currency text not null
shipping_amount_minor bigint
availability_status text
validated_at timestamptz
expires_at timestamptz
return_policy_summary text
risk_notes text
status text not null
created_at timestamptz not null
updated_at timestamptz not null
```

---

## 28. Pricing rules

### `pricing_rules`

```text
id uuid primary key
rule_type text not null
scope_type text not null
scope_id uuid
priority integer not null
calculation_type text not null
value jsonb not null
currency text
status text not null
effective_from timestamptz not null
effective_to timestamptz
version integer not null
created_by uuid references profiles
created_at timestamptz not null
```

---

## 29. Quotes

### `quotes`

```text
id uuid primary key
customer_id uuid references customers
cart_snapshot jsonb not null
pricing_snapshot jsonb not null
availability_snapshot jsonb not null
delivery_snapshot jsonb not null
partner_strategy jsonb
total_amount_minor bigint not null
currency text not null
status text not null
expires_at timestamptz not null
created_at timestamptz not null
updated_at timestamptz not null
```

---

## 30. Orders

### `orders`

```text
id uuid primary key
order_number text not null unique
customer_id uuid not null references customers
recipient_id uuid references recipients
delivery_address_snapshot jsonb not null
responsible_partner_id uuid references partners
quote_id uuid references quotes
current_state text not null
payment_state text not null
delivery_state text not null
exception_state text not null
source_mode text not null
is_mphora boolean not null default false
requested_delivery_start timestamptz
requested_delivery_end timestamptz
estimated_delivery_start timestamptz
estimated_delivery_end timestamptz
total_amount_minor bigint not null
currency text not null
created_at timestamptz not null
updated_at timestamptz not null
paid_at timestamptz
completed_at timestamptz
cancelled_at timestamptz
version integer not null default 1
```

---

## 31. Order items

### `order_items`

```text
id uuid primary key
order_id uuid not null references orders
listing_id uuid references listings
listing_variant_id uuid references listing_variants
item_type text not null
product_snapshot jsonb not null
personalization_snapshot jsonb
quantity integer not null
unit_price_amount_minor bigint not null
total_price_amount_minor bigint not null
currency text not null
source_type text not null
partner_id uuid references partners
created_at timestamptz not null
```

Historical snapshot is required.

---

## 32. Order price lines

### `order_price_lines`

```text
id uuid primary key
order_id uuid not null references orders
line_type text not null
description text not null
amount_minor bigint not null
currency text not null
funding_source text
pricing_rule_id uuid references pricing_rules
created_at timestamptz not null
```

Examples:

- Product.
- Wrapping.
- Delivery.
- MPHO service.
- Discount.
- Tax.

---

## 33. Order state history

### `order_state_history`

```text
id uuid primary key
order_id uuid not null references orders
from_state text
to_state text not null
actor_type text not null
actor_id uuid
reason_code text
reason_text text
metadata jsonb
idempotency_key text
request_id text
created_at timestamptz not null
```

Unique idempotency where appropriate.

Never delete.

---

## 34. Partner offers

### `partner_offers`

```text
id uuid primary key
order_id uuid not null references orders
partner_id uuid not null references partners
status text not null
expected_earning_amount_minor bigint
currency text
offered_at timestamptz not null
accept_by timestamptz not null
responded_at timestamptz
rejection_reason text
idempotency_key text not null unique
```

Constraint:

- Only one accepted offer per order.

Use partial unique index where supported.

---

## 35. Fulfillment tasks

### `fulfillment_tasks`

```text
id uuid primary key
order_id uuid not null references orders
partner_id uuid not null references partners
task_type text not null
status text not null
instructions jsonb
required_evidence jsonb
due_at timestamptz
started_at timestamptz
completed_at timestamptz
assigned_to_profile_id uuid references profiles
created_at timestamptz not null
updated_at timestamptz not null
```

---

## 36. External purchases

### `external_purchases`

```text
id uuid primary key
order_id uuid not null references orders
external_source_id uuid references external_sources
provider_name text not null
provider_order_reference text
purchase_amount_minor bigint not null
shipping_amount_minor bigint not null default 0
currency text not null
status text not null
tracking_reference text
expected_arrival_at timestamptz
purchased_at timestamptz
received_at timestamptz
return_status text
idempotency_key text not null unique
created_at timestamptz not null
updated_at timestamptz not null
```

---

## 37. Package receipts

### `package_receipts`

```text
id uuid primary key
external_purchase_id uuid not null references external_purchases
partner_id uuid not null references partners
received_by_profile_id uuid references profiles
status text not null
package_condition text
product_condition text
quantity_received integer
notes text
received_at timestamptz not null
created_at timestamptz not null
```

Evidence linked through media relation.

---

## 38. Payments

### `payments`

```text
id uuid primary key
order_id uuid not null references orders
customer_id uuid not null references customers
provider text not null
provider_payment_id text
status text not null
amount_minor bigint not null
currency text not null
idempotency_key text not null unique
checkout_url text
expires_at timestamptz
approved_at timestamptz
failed_at timestamptz
failure_code text
created_at timestamptz not null
updated_at timestamptz not null
```

Unique provider payment ID when present.

---

## 39. Payment events

### `payment_events`

```text
id uuid primary key
payment_id uuid references payments
provider text not null
provider_event_id text not null
event_type text not null
verified boolean not null
payload_hash text
payload_reference text
processed_at timestamptz
status text not null
error text
created_at timestamptz not null
```

Unique:

- Provider and provider event ID.

---

## 40. Refunds

### `refunds`

```text
id uuid primary key
payment_id uuid not null references payments
order_id uuid not null references orders
provider_refund_id text
refund_type text not null
status text not null
amount_minor bigint not null
currency text not null
reason_code text not null
requested_by uuid references profiles
approved_by uuid references profiles
idempotency_key text not null unique
requested_at timestamptz not null
submitted_at timestamptz
completed_at timestamptz
failed_at timestamptz
created_at timestamptz not null
updated_at timestamptz not null
```

---

## 41. Ledger entries

### `ledger_entries`

```text
id uuid primary key
entry_type text not null
account_type text not null
account_id uuid
order_id uuid references orders
payment_id uuid references payments
refund_id uuid references refunds
partner_id uuid references partners
delivery_id uuid references deliveries
payout_id uuid references payouts
direction text not null
amount_minor bigint not null
currency text not null
status text not null
reason_code text
idempotency_key text not null unique
effective_at timestamptz not null
created_at timestamptz not null
reversed_by_entry_id uuid references ledger_entries
```

---

## 42. Partner earnings

### `partner_earnings`

```text
id uuid primary key
partner_id uuid not null references partners
order_id uuid not null references orders
earning_type text not null
description text not null
gross_amount_minor bigint not null
deduction_amount_minor bigint not null default 0
net_amount_minor bigint not null
currency text not null
status text not null
pricing_rule_id uuid references pricing_rules
idempotency_key text not null unique
created_at timestamptz not null
approved_at timestamptz
payable_at timestamptz
paid_at timestamptz
payout_id uuid references payouts
```

Constraint:

```text
net_amount_minor = gross_amount_minor - deduction_amount_minor
```

Enforce through generated value, trigger, or application validation plus check where possible.

---

## 43. Payout accounts

### `partner_payout_accounts`

```text
id uuid primary key
partner_id uuid not null references partners
provider text
account_type text not null
masked_identifier text not null
encrypted_payload text
status text not null
verified_at timestamptz
created_at timestamptz not null
updated_at timestamptz not null
changed_by uuid references profiles
```

Highly sensitive.

RLS and encryption required.

---

## 44. Payouts

### `payouts`

```text
id uuid primary key
partner_id uuid not null references partners
payout_account_id uuid references partner_payout_accounts
status text not null
amount_minor bigint not null
currency text not null
period_start date
period_end date
provider_reference text
bank_reference text
approved_by uuid references profiles
idempotency_key text not null unique
created_at timestamptz not null
approved_at timestamptz
processing_at timestamptz
paid_at timestamptz
failed_at timestamptz
failure_reason text
```

---

## 45. Deliveries

### `deliveries`

```text
id uuid primary key
order_id uuid not null references orders
partner_id uuid not null references partners
provider text
delivery_mode text not null
status text not null
pickup_address_snapshot jsonb not null
delivery_address_snapshot jsonb not null
quoted_cost_amount_minor bigint
final_cost_amount_minor bigint
customer_price_amount_minor bigint
currency text not null
provider_delivery_id text
tracking_url text
courier_reference text
requested_pickup_at timestamptz
estimated_delivery_start timestamptz
estimated_delivery_end timestamptz
picked_up_at timestamptz
delivered_at timestamptz
idempotency_key text not null unique
created_at timestamptz not null
updated_at timestamptz not null
```

---

## 46. Delivery attempts

### `delivery_attempts`

```text
id uuid primary key
delivery_id uuid not null references deliveries
attempt_number integer not null
status text not null
reason_code text
notes text
attempted_at timestamptz not null
created_at timestamptz not null
```

Unique:

- Delivery and attempt number.

---

## 47. Delivery events

### `delivery_events`

```text
id uuid primary key
delivery_id uuid references deliveries
provider text
provider_event_id text
event_type text not null
verified boolean not null
mapped_status text
payload_reference text
processed_at timestamptz
status text not null
created_at timestamptz not null
```

Unique provider event where applicable.

---

## 48. Incidents

### `incidents`

```text
id uuid primary key
order_id uuid references orders
partner_id uuid references partners
delivery_id uuid references deliveries
payment_id uuid references payments
category text not null
severity text not null
status text not null
responsible_domain text
summary text not null
description text
financial_impact_amount_minor bigint
currency text
assigned_to uuid references profiles
opened_by uuid references profiles
opened_at timestamptz not null
resolved_at timestamptz
resolution_code text
resolution_notes text
```

---

## 49. Support cases

### `support_cases`

```text
id uuid primary key
case_number text not null unique
customer_id uuid references customers
partner_id uuid references partners
order_id uuid references orders
category text not null
priority text not null
status text not null
assigned_to uuid references profiles
summary text not null
created_at timestamptz not null
updated_at timestamptz not null
closed_at timestamptz
```

---

## 50. Notifications

### `notifications`

```text
id uuid primary key
event_type text not null
audience_type text not null
audience_id uuid
order_id uuid references orders
channel text not null
template_name text not null
template_version text
status text not null
provider_message_id text
idempotency_key text not null unique
scheduled_at timestamptz
sent_at timestamptz
delivered_at timestamptz
read_at timestamptz
failed_at timestamptz
failure_reason text
created_at timestamptz not null
```

---

## 51. Notification consent

### `communication_consents`

```text
id uuid primary key
profile_id uuid references profiles
contact_value text
channel text not null
purpose text not null
status text not null
source text
policy_version text
consented_at timestamptz
revoked_at timestamptz
created_at timestamptz not null
```

---

## 52. HADIA sessions

### `hadia_sessions`

```text
id uuid primary key
customer_id uuid references customers
status text not null
structured_constraints jsonb not null
recommended_listing_ids uuid[]
handoff_status text
expires_at timestamptz
created_at timestamptz not null
updated_at timestamptz not null
```

Raw conversation should be stored only when needed and under privacy controls.

---

## 53. HADIA messages

### `hadia_messages`

Optional.

```text
id uuid primary key
session_id uuid not null references hadia_sessions
role text not null
content text not null
safe_metadata jsonb
created_at timestamptz not null
```

Retention policy required.

---

## 54. MPHORA eligibility

### `mphora_eligibility`

```text
id uuid primary key
listing_variant_id uuid not null references listing_variants
partner_id uuid not null references partners
zone_id uuid not null references zones
eligible boolean not null
blocking_reasons text[]
preparation_minutes integer
delivery_window_start timestamptz
delivery_window_end timestamptz
cutoff_at timestamptz
expires_at timestamptz not null
calculated_at timestamptz not null
```

Index:

- Zone.
- Eligible.
- Expires at.

Do not treat stale rows as valid.

---

## 55. Outbox events

### `outbox_events`

```text
id uuid primary key
event_type text not null
aggregate_type text not null
aggregate_id uuid not null
payload jsonb not null
status text not null
attempt_count integer not null default 0
available_at timestamptz not null
processed_at timestamptz
last_error text
idempotency_key text not null unique
created_at timestamptz not null
```

---

## 56. Audit logs

### `audit_logs`

```text
id uuid primary key
actor_type text not null
actor_id uuid
role text
action text not null
resource_type text not null
resource_id uuid
result text not null
reason text
request_id text
ip_hash text
session_reference text
metadata jsonb
created_at timestamptz not null
```

Audit logs must be immutable to normal application roles.

---

## 57. Feature flags

### `feature_flags`

```text
id uuid primary key
key text not null unique
description text
enabled boolean not null
scope_type text
scope_id uuid
configuration jsonb
updated_by uuid references profiles
updated_at timestamptz not null
```

---

## 58. Configuration

### `system_configuration`

```text
id uuid primary key
key text not null
scope_type text not null
scope_id uuid
value jsonb not null
version integer not null
effective_from timestamptz not null
effective_to timestamptz
updated_by uuid references profiles
updated_at timestamptz not null
```

Unique active configuration per key and scope.

---

## 59. Idempotency records

### `idempotency_records`

Optional central table.

```text
id uuid primary key
key text not null unique
operation text not null
request_hash text
response_reference jsonb
status text not null
expires_at timestamptz
created_at timestamptz not null
completed_at timestamptz
```

---

## 60. Important constraints

Enforce where possible:

- One approved payment per order.
- One responsible partner per order.
- One accepted partner offer per order.
- One active stock reservation per item and idempotency key.
- Refund total cannot exceed approved payment.
- Payout amount must equal included earning total plus adjustments.
- Paid earning must reference payout.
- Completed order requires delivered state or approved cancelled closure.
- External listing must not have local stock.
- MPHORA requires local source.
- Partner role requires matching partner scope.
- Currency must match related financial records.

---

## 61. Index strategy

Important indexes:

### Orders

- Order number.
- Customer.
- Partner.
- Current state.
- Payment state.
- Delivery state.
- Created date.
- Delivery date.
- Exception state.

### Partner offers

- Partner and status.
- Accept-by.
- Order.

### Inventory

- Partner and variant.
- Low stock.
- Updated at.

### Payments

- Provider payment ID.
- Order.
- Status.
- Created date.

### Earnings

- Partner and status.
- Payout.
- Order.

### Deliveries

- Order.
- Status.
- Provider delivery ID.
- Estimated window.

### Notifications

- Status.
- Scheduled at.
- Audience.
- Order.

### Outbox

- Status and available at.

---

## 62. Row-level security expectations

### Customers

May access:

- Own profile.
- Own recipients.
- Own addresses.
- Own orders.
- Own payments.
- Own support cases.

### Partner users

May access:

- Own partner profile.
- Own partner listings.
- Own assigned orders.
- Own fulfillment tasks.
- Own earnings.
- Own payouts.
- Required recipient data for active orders only.

### Couriers

May access:

- Assigned delivery only.
- Required pickup and destination data.
- Limited order data.

### Admin

Access according to role and audit.

Service-role access must remain server-side.

---

## 63. Soft deletion

Use soft deletion or archival for:

- Products.
- Listings.
- Partner users.
- Addresses.
- Recipients.
- Media.

Do not delete:

- Orders.
- Payments.
- Refunds.
- Ledger entries.
- Earnings.
- Payouts.
- State history.
- Audit logs.
- Delivery proof.
- Incidents.

---

## 64. Data retention

Retention policy should define:

- HADIA raw conversation.
- Support messages.
- Delivery proof.
- Partner application documents.
- Audit logs.
- Financial records.
- Media.
- Failed webhook payload references.

Do not retain sensitive data indefinitely without reason.

---

## 65. Migration rules

Every schema change must:

- Use migration.
- Be reviewed.
- Be tested.
- Preserve history.
- Consider RLS.
- Consider indexes.
- Consider backfill.
- Consider rollback.
- Avoid long locks.
- Avoid destructive changes before code migration.

---

## 66. Seed data

Development seed should include:

- Saltillo city.
- Test zones.
- Test customer.
- Test partner.
- Test partner operator.
- Test products.
- Test local listing.
- Test external listing.
- Test MPHORA listing.
- Test quote.
- Test order states.
- Test payment.
- Test delivery.
- Test earnings.

Use fictional data only.

---

## 67. MVP table scope

Required MVP tables:

```text
profiles
user_roles
customers
recipients
addresses
cities
zones
partners
partner_capabilities
partner_schedules
products
categories
tags
product_tags
listings
listing_zones
listing_variants
listing_options
media_assets
inventory_items
inventory_reservations
inventory_adjustments
external_sources
pricing_rules
quotes
orders
order_items
order_price_lines
order_state_history
partner_offers
fulfillment_tasks
external_purchases
package_receipts
payments
payment_events
refunds
ledger_entries
partner_earnings
partner_payout_accounts
payouts
deliveries
delivery_attempts
delivery_events
incidents
support_cases
notifications
communication_consents
hadia_sessions
mphora_eligibility
outbox_events
audit_logs
feature_flags
system_configuration
```

Some may be simplified during the first prototype, but financial and order-history integrity must not be removed.

---

## 68. Minimum database tests

Test:

- Customer cannot read another customer's order.
- Partner cannot read another partner's earning.
- Courier cannot read unrelated delivery.
- Duplicate payment ID blocked.
- Duplicate webhook blocked.
- Stock reservation concurrency.
- One accepted partner offer.
- One responsible partner.
- Refund cannot exceed payment.
- Earning cannot enter two payouts.
- Cancelled order releases reservation.
- Delivered order preserves history.
- External listing cannot be MPHORA.
- Stale MPHORA eligibility rejected.
- Audit log is immutable.
- Soft-deleted listing remains in historical order snapshot.

---

## 69. Definition of done

A schema change is done when:

- Migration exists.
- Constraints are defined.
- Indexes are considered.
- RLS is defined.
- Types are generated.
- Seed is updated when needed.
- Tests pass.
- Backfill is defined.
- Rollback or recovery is considered.
- Documentation is updated.

---

## 70. Summary

The MPHO database must preserve a trustworthy record of:

```text
who acted
what was ordered
what was paid
which partner accepted
which product was used
what was prepared
how it was delivered
what each participant earned
what was refunded
what was paid out
```

The schema must protect both operational and financial truth.
