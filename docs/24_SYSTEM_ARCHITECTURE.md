# 24_SYSTEM_ARCHITECTURE.md

## 1. Purpose

This document defines the logical and physical architecture of MPHO.

It explains:

- System boundaries.
- Applications.
- Domain modules.
- Data flow.
- Integrations.
- Background jobs.
- Security boundaries.
- Event handling.
- Deployment.
- Reliability.
- Scaling path.

This document must be read together with:

- `AGENTS.md`
- `13_ORDER_LIFECYCLE.md`
- `22_PAYMENTS_AND_PAYOUTS.md`
- `23_TECH_STACK.md`
- `25_DATABASE_SCHEMA.md`
- `26_API_AND_INTEGRATIONS.md`
- `27_SECURITY_AND_PRIVACY.md`
- `29_TESTING_AND_QA.md`

---

## 2. Architecture objective

MPHO architecture must support:

```text
Customer discovery
→ quote
→ payment
→ partner assignment
→ product acquisition or stock
→ preparation
→ evidence
→ delivery
→ completion
→ earnings and payout
```

The architecture must preserve:

- Order integrity.
- Financial integrity.
- Permission boundaries.
- Idempotency.
- Auditability.
- Operational recovery.

---

## 3. Architecture style

Recommended MVP style:

```text
Modular monolith
+ PostgreSQL
+ managed storage
+ external provider adapters
+ background automation
```

This means:

- One primary codebase.
- Clear domain boundaries.
- One primary transactional database.
- External systems behind adapters.
- Background jobs for asynchronous work.
- No unnecessary microservices.

---

## 4. High-level system context

```text
Customers
Partners
MPHO operators
Couriers
        │
        ▼
MPHO Web Platform
        │
        ├── Customer App
        ├── MPHO Aliados
        ├── Admin Panel
        └── Public API/Webhooks
        │
        ▼
Application Domain Layer
        │
        ├── Identity
        ├── Partners
        ├── Catalog
        ├── Inventory
        ├── Orders
        ├── Payments
        ├── Earnings
        ├── Delivery
        ├── Notifications
        ├── HADIA
        ├── MPHORA
        └── Audit
        │
        ▼
PostgreSQL + Storage
        │
        ├── Payment provider
        ├── WhatsApp provider
        ├── Delivery providers
        ├── AI provider
        ├── Email provider
        └── Maps provider
```

---

## 5. Application surfaces

### Customer application

Responsibilities:

- Public catalog.
- HADIA.
- MPHORA.
- Cart.
- Checkout.
- Payment initiation.
- Order tracking.
- Support.
- Account.

### MPHO Aliados

Responsibilities:

- Partner offers.
- Stock.
- Package receipt.
- Preparation.
- Evidence.
- Handoff.
- Earnings.
- Payout statements.
- Partner availability.

### Admin panel

Responsibilities:

- Exceptions.
- Orders.
- Partners.
- Catalog review.
- Delivery.
- Payments.
- Refunds.
- Earnings.
- Payouts.
- Pricing.
- Zones.
- Audit.
- Security operations.

### External API and webhook surface

Responsibilities:

- Payment webhooks.
- WhatsApp webhooks.
- Delivery webhooks.
- AI callbacks when applicable.
- Provider reconciliation.
- Secure partner deep links.

---

## 6. Domain modules

Recommended modules:

```text
identity
customers
recipients
partners
catalog
inventory
pricing
quotes
orders
fulfillment
external_purchases
payments
refunds
earnings
payouts
delivery
notifications
hadia
mphora
support
incidents
audit
configuration
```

Each module should expose controlled services.

Do not allow UI layers to write directly across unrelated modules.

---

## 7. Layering

Recommended layering:

```text
UI and route layer
→ application services
→ domain logic
→ repositories and provider adapters
→ database and external systems
```

### UI and route layer

- Parse request.
- Authenticate actor.
- Validate input.
- Call application service.
- Return safe response.

### Application services

- Coordinate use case.
- Start transaction.
- Invoke domain rules.
- Write audit record.
- Trigger event.

### Domain logic

- Validate state transitions.
- Calculate eligibility.
- Calculate pricing.
- Enforce invariants.

### Repositories

- Read and write data.
- Hide storage details.
- Support transactions.

### Provider adapters

- Translate MPHO requests to provider APIs.
- Translate provider responses to internal models.

---

## 8. Request identifiers

Every incoming request should have:

```text
request_id
correlation_id_optional
actor_id_optional
order_id_optional
environment
```

Use request IDs across:

- Logs.
- Provider calls.
- Webhooks.
- Background jobs.
- Support diagnostics.

---

## 9. Authentication flow

```text
User signs in
→ auth provider verifies identity
→ MPHO loads profile and role
→ server validates resource scope
→ action executes
→ audit record created when sensitive
```

Authentication proves identity.

Authorization determines allowed action.

---

## 10. Authorization architecture

Authorization should evaluate:

```text
actor
role
resource
resource ownership
partner scope
action
current state
special approval
```

Examples:

- Customer may view own order.
- Partner operator may view assigned partner order.
- Courier may view assigned delivery.
- MPHO operator may resolve normal exception.
- MPHO admin may configure pricing.

Database RLS should complement, not replace, server authorization.

---

## 11. Order architecture

The order module should own:

- Order creation.
- Order item snapshots.
- Order state.
- State transitions.
- State history.
- Assignment relation.
- Customer-facing status.
- Completion.

All order transitions should use one transition service.

Do not update order state directly from UI components or provider adapters.

---

## 12. State transition service

Recommended interface:

```text
transitionOrder({
  orderId,
  expectedCurrentState,
  targetState,
  actor,
  reason,
  idempotencyKey,
  metadata
})
```

The service should:

1. Load current order.
2. Verify actor.
3. Validate transition.
4. Validate required data.
5. Update state atomically.
6. Write history.
7. Write audit event.
8. Publish domain event.
9. Return updated order.

---

## 13. Event architecture

Use domain events for asynchronous side effects.

Examples:

```text
PaymentApproved
PartnerOfferCreated
PartnerAccepted
ExternalProductReceived
PreparationStarted
OrderReady
CourierAssigned
OrderPickedUp
OrderDelivered
RefundCompleted
EarningPayable
PayoutPaid
ExceptionOpened
```

Events should not replace the database.

The database remains the source of truth.

---

## 14. Outbox pattern

Recommended for critical events:

```text
Business transaction
→ write domain data
→ write outbox event in same transaction
→ worker reads outbox
→ sends notification or provider request
→ marks event processed
```

This prevents:

- Order updated but notification lost.
- Payment approved but assignment not started.
- Earnings created twice.
- Event published without database commit.

---

## 15. Outbox fields

Suggested:

```text
event_id
event_type
aggregate_type
aggregate_id
payload
status
attempt_count
available_at
created_at
processed_at_optional
last_error_optional
idempotency_key
```

Statuses:

```text
pending
processing
processed
failed
dead_letter
```

---

## 16. Background worker

A worker may process:

- Outbox events.
- Notification retries.
- Quote expiration.
- Partner-offer timeout.
- External tracking.
- Payment reconciliation.
- Refund monitoring.
- Payout preparation.
- Stock staleness.
- MPHORA recalculation.

The MVP may use n8n or scheduled server jobs, but critical operations should remain observable.

---

## 17. Quote architecture

Quote service inputs:

- Cart.
- Customer.
- Recipient zone.
- Date.
- Product source.
- Partner eligibility.
- Availability.
- Personalization.
- Delivery quote.
- Pricing rules.
- Discounts.

Quote output:

```text
quote_id
line_items
total
currency
availability_type
partner_strategy
delivery_window
expires_at
warnings
blocking_reasons
```

Quote is immutable after payment approval.

---

## 18. Pricing architecture

Pricing service should own:

- Product price.
- Service fee.
- Preparation fee.
- Personalization.
- Delivery price.
- Discounts.
- Taxes.
- Final total.
- Partner earning estimate.
- MPHO margin estimate.

Do not calculate trusted totals in client code.

---

## 19. Catalog architecture

Catalog module owns:

- Product definitions.
- Listings.
- Variants.
- Options.
- Add-ons.
- Categories.
- Tags.
- Publication.
- Media.
- Source type.

Inventory is related but separate.

---

## 20. Inventory architecture

Inventory module owns:

- On-hand quantity.
- Reserved quantity.
- Availability.
- Reservations.
- Adjustments.
- Staleness.
- Partner confirmation.

Inventory updates should use database transactions.

---

## 21. Partner assignment architecture

Assignment service inputs:

- Order.
- Zone.
- Product.
- Required capabilities.
- Partner status.
- Partner hours.
- Capacity.
- Stock.
- Preparation time.
- Delivery.
- Partner performance.

Output:

- Candidate partners.
- Ranking.
- Selected partner.
- Offer deadline.
- Assignment reason.

MVP may support manual-assisted selection.

---

## 22. External purchase architecture

External purchase module owns:

- Source provider.
- External reference.
- Price validation.
- Purchase status.
- Tracking.
- Assigned receiving partner.
- Receipt.
- Return.
- Incident.

External product is not local inventory.

---

## 23. Payment architecture

Payment adapter responsibilities:

- Create provider payment.
- Retrieve provider payment.
- Verify webhook.
- Map provider state.
- Create refund.
- Retrieve refund.
- Reconcile.

Payment domain responsibilities:

- Internal payment attempt.
- Payment state.
- Order relation.
- Ledger impact.
- Idempotency.
- Exceptions.

---

## 24. Delivery architecture

Delivery adapter responsibilities:

- Quote.
- Request.
- Cancel.
- Track.
- Verify webhook.
- Map provider state.

Delivery domain responsibilities:

- Internal delivery.
- Assignment.
- Pickup.
- Attempts.
- Proof.
- Cost.
- Incident.
- Order transition.

---

## 25. Notification architecture

Notification module owns:

- Event-to-template mapping.
- Audience.
- Consent.
- Channel.
- Template version.
- Deep link.
- Send status.
- Retry.
- Fallback.
- Suppression.

Providers:

- WhatsApp.
- Email.
- Push in future.
- In-app.

---

## 26. HADIA architecture

HADIA flow:

```text
Customer message
→ intent extraction
→ constraint state
→ catalog query
→ operational filtering
→ deterministic ranking
→ AI explanation
→ product cards
```

HADIA tools must use scoped application services.

HADIA must not access admin or payment actions.

---

## 27. MPHORA architecture

MPHORA eligibility service should evaluate:

- Listing.
- Variant.
- Stock.
- Partner.
- Hours.
- Capacity.
- Zone.
- Preparation.
- Delivery.
- Cutoff.
- Quote.

Eligibility should expire and be revalidated.

---

## 28. Storage architecture

Storage categories:

```text
public catalog media
private order evidence
private delivery proof
private partner documents
customer-generated media
```

Use:

- Public URLs only for approved catalog assets.
- Signed URLs for private evidence.
- Metadata in database.
- File validation.
- Retention policy.
- Access logs for sensitive files when possible.

---

## 29. Database transaction boundaries

Use transactions for:

- Payment approval and order update.
- Stock reservation.
- State transition and history.
- Earnings creation.
- Refund posting.
- Payout inclusion.
- Delivery completion and ledger posting.
- Partner assignment lock.

Avoid distributed transactions across providers.

Use local transaction plus outbox and reconciliation.

---

## 30. Consistency model

Strong consistency required for:

- Money.
- Order state.
- Stock reservations.
- Partner assignment.
- Payout inclusion.
- Refund balance.

Eventual consistency acceptable for:

- Notifications.
- Analytics.
- Search index.
- Non-critical dashboards.
- Recommendation cache.

---

## 31. Concurrency control

Use:

- Unique constraints.
- Optimistic locking.
- Row version.
- Atomic update.
- Transaction isolation.
- Idempotency key.
- State precondition.

Examples:

- Two partners cannot both become responsible.
- Two payments cannot both become active.
- Same stock cannot be reserved twice.
- Same earning cannot enter two payouts.

---

## 32. API boundary

Public or provider-facing APIs should be versioned.

Example:

```text
/api/v1/payments/webhook
/api/v1/whatsapp/webhook
/api/v1/delivery/webhook
/api/v1/orders/[id]/status
```

Internal application services do not need to expose every operation publicly.

---

## 33. Error taxonomy

Recommended error categories:

```text
validation_error
authentication_error
authorization_error
not_found
state_conflict
availability_error
pricing_error
payment_error
provider_error
rate_limit
timeout
security_error
internal_error
```

Errors should include:

```text
code
safe_message
request_id
retryable
details_for_logs
```

Do not expose stack traces to users.

---

## 34. Retry strategy

Retry only safe operations.

Safe candidates:

- Notification send.
- Provider status fetch.
- Outbox processing.
- Reconciliation.
- Temporary delivery quote error.

Do not blindly retry:

- Payment creation without idempotency.
- External purchase.
- Payout.
- Refund.
- State transition without precondition.

---

## 35. Circuit breaker and provider outage

For provider outage:

- Detect repeated failures.
- Stop aggressive retries.
- Mark provider degraded.
- Use fallback where available.
- Create operator alert.
- Show customer-safe message.
- Preserve order state.
- Reconcile later.

---

## 36. Caching

Safe cache candidates:

- Public catalog.
- Categories.
- Public product media.
- Zone metadata.
- Static policies.

Do not publicly cache:

- Customer orders.
- Partner earnings.
- Payment state.
- Recipient data.
- Private evidence.
- Admin data.

---

## 37. Search architecture

Search may begin with PostgreSQL full-text or indexed queries.

Future search service only when needed.

Search index should include:

- Published listings.
- Categories.
- Tags.
- Occasion.
- Recipient.
- Availability summary.
- Price range.

Search must exclude invalid listings.

---

## 38. Analytics architecture

Operational database is not the long-term analytics warehouse.

MVP may use:

- Event tracking.
- Read replicas or controlled queries.
- Aggregated tables.
- Privacy-safe analytics provider.

Do not run heavy analytics directly against critical transactional paths.

---

## 39. Deployment architecture

Recommended:

```text
GitHub
→ CI checks
→ Vercel preview
→ staging validation
→ production deployment
```

Data services:

- Separate production database.
- Separate production storage.
- Separate provider credentials.
- Separate webhook endpoints.

---

## 40. Environment boundaries

### Local

- Local or development database.
- Provider sandbox.
- Fake notifications.
- Seed data.

### Preview

- Isolated safe data.
- No production payouts.
- No production customer messages.

### Staging

- Near-production behavior.
- Sandbox payments.
- Test partners.
- Test delivery.

### Production

- Real customers.
- Real money.
- Real messages.
- Real audit.
- Restricted access.

---

## 41. Observability architecture

Correlate:

```text
request_id
order_id
payment_id
delivery_id
partner_id
event_id
provider_event_id
```

Dashboards:

- Application errors.
- Webhook failures.
- Outbox backlog.
- Payment mismatch.
- Delivery incidents.
- Notification failure.
- Database performance.
- Job delays.
- Financial reconciliation.

---

## 42. Security boundaries

Separate trust zones:

```text
Public browser
Authenticated customer
Authenticated partner
Authenticated admin
Provider webhook
Background worker
Database
Private storage
External provider
```

Every boundary requires:

- Authentication.
- Authorization.
- Validation.
- Rate limiting.
- Logging.
- Safe data exposure.

---

## 43. Failure scenarios

Architecture must handle:

- Payment approved but notification failed.
- Payment approved but partner assignment job failed.
- Partner accepted twice.
- Stock reservation conflict.
- External purchase webhook delayed.
- Delivery provider unavailable.
- Duplicate delivery webhook.
- Refund completed but internal callback failed.
- Payout initiated twice.
- Database temporarily unavailable.
- AI provider unavailable.
- WhatsApp unavailable.

Each scenario needs recovery and reconciliation.

---

## 44. Manual fallback

Critical workflows should have controlled manual fallback:

- Partner assignment.
- External purchase.
- Delivery assignment.
- Refund review.
- Payout.
- Notification.
- Provider status verification.

Manual action must still use application services and audit logs.

Do not instruct admins to edit database rows directly.

---

## 45. Scaling path

### Stage 1

Modular monolith.

### Stage 2

Dedicated worker and queue.

### Stage 3

Read replica or analytics store.

### Stage 4

Extract high-volume or isolated provider modules only if necessary.

Potential extraction candidates:

- Notifications.
- AI recommendations.
- Delivery integration.
- Search.
- Analytics.

Payments and order state should remain tightly controlled.

---

## 46. Architecture decision records

Significant architecture changes require an ADR.

Examples:

- Change payment provider.
- Introduce queue.
- Split service.
- Change database.
- Add multi-region.
- Add multi-partner order.

ADR format:

```text
Title
Status
Context
Decision
Alternatives
Consequences
Migration
Rollback
```

---

## 47. MVP architecture recommendation

Use:

```text
One Next.js repository
One PostgreSQL database
Supabase Auth
Supabase Storage
Server-side domain services
Provider adapters
Outbox table
n8n for controlled orchestration
Vercel deployment
GitHub CI
```

Keep business rules in the application domain and database constraints.

---

## 48. Definition of done

An architectural feature is done when:

- Domain ownership is clear.
- Transaction boundaries are defined.
- Authorization is enforced.
- Idempotency exists.
- Failure recovery exists.
- Logs include correlation.
- Provider logic is isolated.
- Data is not duplicated without reason.
- Tests cover concurrency and failure.
- Documentation is updated.

---

## 49. Summary

MPHO architecture must make the normal flow simple and the failure flow recoverable.

The primary design goal is not distributed complexity.

It is reliable coordination of:

```text
order
money
partner
product
preparation
delivery
evidence
notification
```
