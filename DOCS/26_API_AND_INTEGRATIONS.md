# 26_API_AND_INTEGRATIONS.md

## 1. Purpose

This document defines the API and integration strategy for MPHO.

It explains:

- Internal APIs.
- External APIs.
- Webhooks.
- Provider adapters.
- Authentication.
- Idempotency.
- Error handling.
- Versioning.
- Retry behavior.
- Provider fallbacks.
- Integration observability.
- MVP integration priorities.

This document must be read together with:

- `13_ORDER_LIFECYCLE.md`
- `18_HADIA_AI.md`
- `20_WHATSAPP_AUTOMATION.md`
- `21_DELIVERY_LOGISTICS.md`
- `22_PAYMENTS_AND_PAYOUTS.md`
- `23_TECH_STACK.md`
- `24_SYSTEM_ARCHITECTURE.md`
- `25_DATABASE_SCHEMA.md`
- `27_SECURITY_AND_PRIVACY.md`

---

## 2. Integration principles

Every integration must be:

- Explicit.
- Versioned.
- Authenticated.
- Idempotent.
- Observable.
- Retry-safe.
- Isolated through an adapter.
- Testable in sandbox.
- Recoverable through manual fallback.
- Documented with owner and purpose.

External systems must never become the only source of truth for MPHO business state.

---

## 3. Integration categories

MPHO may integrate with:

```text
payment providers
WhatsApp providers
email providers
delivery providers
maps and geocoding
AI providers
external product providers
storage providers
analytics providers
error monitoring
identity providers
```

Each provider belongs behind a dedicated adapter.

---

## 4. Internal API responsibilities

Internal APIs support:

- Customer operations.
- Partner operations.
- Admin operations.
- Order state transitions.
- Catalog queries.
- Inventory reservations.
- Payment initiation.
- Refund requests.
- Delivery requests.
- Notification creation.
- HADIA tools.
- MPHORA eligibility.
- Support cases.
- Audit events.

Internal APIs must not expose raw database tables directly.

---

## 5. External API responsibilities

External or provider-facing endpoints support:

- Payment webhooks.
- Refund webhooks.
- WhatsApp webhooks.
- Delivery webhooks.
- External tracking callbacks.
- Authenticated partner deep links.
- Public catalog endpoints where required.
- Health checks.
- Provider verification.

External APIs should be versioned.

Suggested prefix:

```text
/api/v1
```

---

## 6. Route groups

Suggested route structure:

```text
/api/v1/public
/api/v1/customer
/api/v1/partner
/api/v1/admin
/api/v1/payments
/api/v1/whatsapp
/api/v1/delivery
/api/v1/hadia
/api/v1/webhooks
```

Route naming may evolve, but trust boundaries must remain clear.

---

## 7. Internal service boundaries

Recommended application services:

```text
CustomerService
PartnerService
CatalogService
InventoryService
QuoteService
OrderService
PaymentService
RefundService
EarningsService
PayoutService
DeliveryService
NotificationService
HadiaService
MphoraService
IncidentService
AuditService
```

Controllers and route handlers should call services.

They should not contain business logic directly.

---

## 8. Provider adapters

Each provider adapter should translate between:

- MPHO domain model.
- Provider request format.
- Provider response format.
- Provider status.
- Provider error model.

Example interface:

```text
PaymentProvider
- createPayment
- getPayment
- cancelPayment
- refundPayment
- getRefund
- verifyWebhook
- mapPaymentStatus
- mapRefundStatus
```

Example delivery interface:

```text
DeliveryProvider
- quoteDelivery
- createDelivery
- cancelDelivery
- getDelivery
- verifyWebhook
- mapDeliveryStatus
```

---

## 9. Authentication

API authentication may include:

- User session.
- Service token.
- Signed webhook.
- One-time signed link.
- OAuth provider token.
- Internal service credential.

Rules:

- Never use one universal token for every integration.
- Scope credentials.
- Rotate credentials.
- Separate test and production.
- Verify every provider callback.
- Avoid secrets in query strings.
- Log authentication failures safely.

---

## 10. Authorization

Every endpoint must validate:

```text
actor
role
resource ownership
partner scope
current order state
allowed action
```

Examples:

- Customer may view own order.
- Partner may update only assigned order tasks.
- Courier may update only assigned delivery.
- Admin may perform only role-approved actions.
- HADIA may access only safe catalog and quote functions.

---

## 11. Input validation

Validate:

- Request body.
- Route parameters.
- Query parameters.
- Headers.
- Provider payload.
- File metadata.
- Currency.
- Amount.
- State transition.
- IDs.
- Dates.
- URLs.
- Enum values.

Use runtime schemas.

Invalid requests should return safe structured errors.

---

## 12. API response format

Recommended success response:

```json
{
  "data": {},
  "meta": {
    "requestId": "..."
  }
}
```

Recommended error response:

```json
{
  "error": {
    "code": "ORDER_STATE_CONFLICT",
    "message": "The order changed and this action is no longer available.",
    "requestId": "..."
  }
}
```

Do not expose stack traces or provider secrets.

---

## 13. Error taxonomy

Recommended API error codes:

```text
VALIDATION_ERROR
AUTHENTICATION_REQUIRED
AUTHORIZATION_DENIED
RESOURCE_NOT_FOUND
STATE_CONFLICT
QUOTE_EXPIRED
STOCK_UNAVAILABLE
MPHORA_INELIGIBLE
PAYMENT_ERROR
REFUND_ERROR
DELIVERY_ERROR
PROVIDER_TIMEOUT
PROVIDER_UNAVAILABLE
RATE_LIMITED
IDEMPOTENCY_CONFLICT
SECURITY_ERROR
INTERNAL_ERROR
```

Every error should indicate whether retry is safe.

---

## 14. Idempotency

Require idempotency for:

- Payment creation.
- Refund creation.
- Delivery creation.
- Partner offer creation.
- External purchase creation.
- Earnings creation.
- Payout creation.
- Notification creation.
- State transition.
- Webhook processing.

Recommended header:

```text
Idempotency-Key
```

The server should store:

- Key.
- Operation.
- Request hash.
- Result reference.
- Status.
- Expiration.

---

## 15. Concurrency

Concurrency controls should prevent:

- Two accepted partners.
- Duplicate stock reservation.
- Duplicate payment.
- Duplicate refund.
- Duplicate payout.
- Invalid state rollback.
- Same earning in two payout batches.
- Two couriers assigned accidentally.

Use:

- Transactions.
- Unique constraints.
- Expected current state.
- Version field.
- Atomic updates.

---

## 16. API versioning

Version public and provider-facing APIs.

Examples:

```text
/api/v1
/api/v2
```

Version changes should be introduced when:

- Contract breaks.
- Field meaning changes.
- Authentication changes.
- Status mapping changes.
- Provider callback structure changes.

Do not create new versions for minor additive fields.

---

## 17. Pagination

Use cursor-based pagination for large lists when practical.

Example:

```text
limit
cursor
nextCursor
```

Required for:

- Orders.
- Products.
- Partners.
- Audit logs.
- Notifications.
- Earnings.
- Payouts.
- Support cases.

---

## 18. Filtering and sorting

APIs should support controlled filters.

Examples:

- State.
- City.
- Zone.
- Partner.
- Date range.
- Product source.
- MPHORA.
- Exception.
- Payment status.
- Payout status.

Do not allow arbitrary SQL-like filtering from clients.

---

## 19. Rate limiting

Rate-limit:

- Login.
- Registration.
- Password reset.
- HADIA messages.
- Payment creation.
- Refund requests.
- Webhooks with abnormal volume.
- Public search.
- Support submissions.
- File uploads.

Use actor, IP, route, and risk context where appropriate.

---

## 20. Webhook architecture

Webhook flow:

```text
Provider sends event
→ endpoint authenticates provider
→ payload is validated
→ event identity is checked
→ raw reference is stored
→ event is mapped
→ idempotency is checked
→ domain service processes event
→ audit and logs are written
→ response is returned quickly
```

Long work should continue asynchronously.

---

## 21. Webhook response behavior

Webhook endpoints should:

- Return quickly.
- Use provider-recommended success status.
- Avoid long business processing.
- Store enough event data for replay.
- Return non-success only when appropriate.
- Avoid leaking validation details.

---

## 22. Payment integration

Payment integration must support:

- Create payment.
- Retrieve payment.
- Verify webhook.
- Map status.
- Refund.
- Retrieve refund.
- Reconciliation.

MPHO must preserve:

- Provider payment ID.
- Provider event ID.
- Amount.
- Currency.
- Internal order.
- Idempotency.
- Timestamp.

The customer redirect is not enough to confirm payment.

---

## 23. WhatsApp integration

WhatsApp integration must support:

- Approved templates.
- Transactional messages.
- Delivery status.
- Inbound messages.
- Message status webhooks.
- Opt-in records.
- Deep links.
- Retry.
- Fallback.

The WhatsApp provider must not directly update order state without application validation.

---

## 24. Delivery integration

Delivery integration must support when available:

- Quote.
- Create request.
- Cancel.
- Track.
- Status callback.
- Proof.
- Cost.
- Reconciliation.

Provider states must map to MPHO states.

Raw provider status must not be shown directly to customers.

---

## 25. Maps integration

Maps or geocoding integration may support:

- Address autocomplete.
- Coordinate lookup.
- Reverse geocoding.
- Distance estimate.
- Zone membership.
- Map preview.

Rules:

- Validate user-selected address.
- Allow manual references.
- Store provider-independent address snapshot.
- Avoid depending on map provider object format forever.

---

## 26. AI provider integration

AI provider integration for HADIA must support:

- Structured output.
- Tool calling.
- Timeout.
- Safety filtering.
- Cost tracking.
- Model versioning.
- Fallback.
- Prompt versioning.
- PII minimization.

The AI provider must not receive:

- Payment credentials.
- Unnecessary customer history.
- Admin secrets.
- Full private evidence.
- Other partners' data.

---

## 27. External product integrations

Potential future integrations:

- Marketplace product lookup.
- Supplier APIs.
- Tracking APIs.
- Price validation.
- Product availability.

MVP rule:

- Use curated external products.
- Avoid unauthorized scraping.
- Store source and validation time.
- Require human approval for purchases when needed.
- Do not assume official partnership.

---

## 28. Email integration

Email may support:

- Account verification.
- Password reset.
- Order summary.
- Receipt.
- Refund confirmation.
- Partner payout statement.
- Admin alert.

Email provider should support:

- Templates.
- Delivery result.
- Bounce handling.
- Unsubscribe for marketing.
- Domain authentication.

---

## 29. Storage integration

Storage API should support:

- Upload authorization.
- MIME validation.
- File-size validation.
- Virus or malware scanning when available.
- Signed access.
- Public/private separation.
- Retention.
- Deletion request workflow.

Direct public upload to private buckets must be controlled.

---

## 30. Analytics integration

Analytics should receive:

- Safe event name.
- Safe identifiers.
- Screen.
- Funnel step.
- Timing.
- Non-sensitive properties.

Do not send:

- Full recipient address.
- Raw customer message.
- Payment token.
- Bank data.
- Private evidence.
- Authentication secret.

---

## 31. Error monitoring integration

Error monitoring should capture:

- Environment.
- Release.
- Request ID.
- Route.
- Error category.
- Safe actor context.
- Order ID when safe.
- Provider name.
- Retry status.

Sensitive data must be scrubbed.

---

## 32. Health checks

Recommended health endpoints:

```text
/health/live
/health/ready
```

Readiness may check:

- Database connectivity.
- Required configuration.
- Outbox backlog threshold.
- Critical provider status when necessary.

Do not expose detailed infrastructure publicly.

---

## 33. Provider configuration

Provider configuration should include:

```text
provider_name
environment
enabled
credentials_reference
base_url
timeout_ms
retry_policy
webhook_secret_reference
feature_flags
created_at
updated_at
```

Secrets should live in secure environment configuration, not database plaintext.

---

## 34. Integration status

Track provider state:

```text
operational
degraded
outage
disabled
maintenance
```

This may influence:

- MPHORA.
- Payment availability.
- Notification fallback.
- Delivery options.
- Admin alerts.

---

## 35. Retry rules

Retry temporary errors only.

Retry candidates:

- Timeout.
- Rate limit.
- Temporary provider error.
- Network error.
- 5xx response.

Do not automatically retry:

- Invalid credentials.
- Invalid request.
- Payment already approved.
- Refund already completed.
- External purchase without idempotency.
- Payout without idempotency.

---

## 36. Circuit breaker

For repeated provider failures:

- Stop repeated requests temporarily.
- Mark integration degraded.
- Alert admin.
- Use fallback.
- Queue safe work.
- Preserve order state.
- Reconcile later.

---

## 37. Manual fallback

Required fallback examples:

- Manual courier assignment.
- Manual partner notification.
- Manual payment review.
- Manual refund review.
- Manual external purchase.
- Manual payout.
- Manual address correction.
- Manual support escalation.

Manual fallback must still use official services and audit.

---

## 38. Integration logs

Log:

- Provider.
- Operation.
- Request ID.
- Correlation ID.
- Order ID.
- Result.
- Duration.
- Retry count.
- Provider event ID.
- Error code.

Do not log:

- Secret.
- Full authorization header.
- Full payment instrument.
- Full private message.
- Bank information.

---

## 39. Contract testing

Each integration should have contract tests for:

- Expected request.
- Expected response.
- Status mapping.
- Error mapping.
- Signature verification.
- Duplicate webhook.
- Timeout.
- Invalid payload.
- Sandbox credentials.
- Fallback behavior.

Use stored fixtures with sensitive values removed.

---

## 40. Sandbox strategy

Every provider should have, when available:

- Sandbox credentials.
- Test webhook.
- Test callback.
- Test products or payments.
- Test delivery.
- Test phone numbers.
- Separate environment variables.

Production credentials must never be used in automated tests.

---

## 41. Integration ownership

Each integration should document:

```text
name
business purpose
technical owner
operational owner
provider
credentials location
sandbox availability
production status
fallback
monitoring
support contact
```

---

## 42. Integration lifecycle

```text
proposed
approved
in_development
sandbox
pilot
production
degraded
deprecated
disabled
```

Do not treat a provider as production-ready after only a successful API call.

---

## 43. MVP integration priorities

Priority 1:

- Authentication.
- Database.
- Storage.
- Payment provider.
- WhatsApp.
- Email.
- Basic maps.

Priority 2:

- Delivery provider.
- HADIA AI provider.
- Error monitoring.

Priority 3:

- External suppliers.
- Advanced tracking.
- Analytics warehouse.
- Multiple delivery providers.
- Multiple payment providers.

---

## 44. Minimum tests

Test:

- Valid authenticated request.
- Unauthorized request.
- Wrong partner scope.
- Duplicate idempotency key.
- State conflict.
- Payment webhook valid.
- Payment webhook invalid.
- WhatsApp webhook duplicate.
- Delivery webhook stale.
- Provider timeout.
- Retry.
- Circuit breaker.
- Manual fallback.
- Expired signed link.
- File upload invalid.
- Rate limit.
- Provider disabled.
- Version compatibility.

---

## 45. Definition of done

An integration is done when:

- Adapter exists.
- Sandbox works.
- Authentication works.
- Webhook verification exists.
- Idempotency exists.
- Status mapping exists.
- Errors are mapped.
- Retry rules exist.
- Fallback exists.
- Logs exist.
- Metrics exist.
- Security review is complete.
- Contract tests pass.
- Documentation is updated.

---

## 46. Summary

MPHO integrations must connect external services without surrendering control of order, payment, delivery, or customer truth.

Every provider is replaceable.

Every critical action remains validated, auditable, and recoverable inside MPHO.
