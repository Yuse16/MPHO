# 13_ORDER_LIFECYCLE.md

## 1. Purpose

This document defines the official lifecycle of an MPHO order.

It explains:

- Order states.
- Allowed transitions.
- Required validations.
- Responsible actors.
- Side effects.
- Exceptions.
- Cancellation.
- Refunds.
- Delivery.
- Completion.
- Audit requirements.

This document is the source of truth for order-state behavior.

---

## 2. Core principle

An order is a controlled state machine.

A status is not decorative text.

Every transition must:

- Be valid.
- Be authorized.
- Be idempotent.
- Record actor.
- Record timestamp.
- Record reason.
- Trigger only approved side effects.
- Preserve history.

---

## 3. Order domains

An order contains related but distinct state domains.

### Commercial state

- Draft.
- Quoted.
- Confirmed.
- Cancelled.
- Completed.

### Payment state

- Pending.
- Under review.
- Approved.
- Failed.
- Refunded.

### Fulfillment state

- Assignment.
- Product acquisition.
- Receipt.
- Preparation.
- Ready.
- Delivery.
- Completion.

### Exception state

- No exception.
- Open exception.
- Resolved exception.
- Escalated exception.

Do not use one field to represent every domain.

---

## 4. Primary order states

Official preliminary lifecycle:

```text
draft
quote_pending
quoted
pending_payment
payment_under_review
paid
assignment_pending
partner_offered
partner_accepted
partner_rejected
awaiting_local_stock
awaiting_external_purchase
external_purchase_created
external_product_in_transit
external_product_received
product_issue_review
preparation_pending
preparing
ready_for_pickup
delivery_pending
courier_assigned
picked_up
out_for_delivery
delivery_attempted
delivered
completion_review
completed
cancel_requested
cancelled
refund_pending
refunded
exception
```

These names may be implemented as enums.

---

## 5. State groups

### Pre-order

```text
draft
quote_pending
quoted
```

### Payment

```text
pending_payment
payment_under_review
paid
```

### Assignment

```text
assignment_pending
partner_offered
partner_accepted
partner_rejected
```

### Product availability

```text
awaiting_local_stock
awaiting_external_purchase
external_purchase_created
external_product_in_transit
external_product_received
product_issue_review
```

### Preparation

```text
preparation_pending
preparing
ready_for_pickup
```

### Delivery

```text
delivery_pending
courier_assigned
picked_up
out_for_delivery
delivery_attempted
delivered
```

### Closure

```text
completion_review
completed
cancel_requested
cancelled
refund_pending
refunded
exception
```

---

## 6. Draft

### Meaning

The customer has started an order but has not completed quote validation.

### Actor

- Customer.
- Authorized support.
- Service account for cart persistence.

### Allowed actions

- Add items.
- Remove items.
- Add recipient.
- Add address.
- Select personalization.
- Select delivery date.
- Save draft.
- Abandon.

### Allowed transitions

```text
draft → quote_pending
draft → cancelled
```

### Prohibited effects

- No stock reservation.
- No partner assignment.
- No earnings.
- No courier request.
- No payment confirmation.

---

## 7. Quote pending

### Meaning

The system is validating availability, price, zone, timing, and delivery.

For the Phase 7 pilot this validation may include temporary, expiring evidence confirmed manually by Central with an establishment. That evidence is not a partner assignment, acceptance, stock reservation, capacity reservation, or authorization to prepare. Formal assignment remains after verified payment.

### Required validations

- Product source.
- Local or external status.
- Partner eligibility.
- Stock or by-order status.
- Zone.
- Preparation.
- Delivery.
- Personalization compatibility.
- Price rules.
- Quote expiration.
- MPHORA eligibility when requested.

### Allowed transitions

```text
quote_pending → quoted
quote_pending → exception
quote_pending → draft
```

---

## 8. Quoted

### Meaning

A valid customer total and estimated timing exist.

In Phase 7, `quoted` is the final pre-payment boundary. The only implemented main transitions are `draft → quote_pending → quoted`, plus the controlled regressions `quote_pending → draft` and `quoted → quote_pending`. `pending_payment` and every later state remain unimplemented.

### Required data

- Quote amount.
- Currency.
- Pricing breakdown.
- Quote expiration.
- Delivery estimate.
- Availability classification.
- Selected partner or assignment strategy when needed.

### Allowed transitions

```text
quoted → pending_payment
quoted → quote_pending
quoted → cancelled
```

### Side effects

- Optional temporary stock reservation.
- Optional delivery-quote reservation.
- Quote-expiration job.

---

## 9. Pending payment

### Meaning

The customer has entered the payment flow.

### Allowed transitions

```text
pending_payment → payment_under_review
pending_payment → paid
pending_payment → quoted
pending_payment → cancelled
```

### Rules

- Do not trust client payment confirmation.
- Wait for verified provider event or approved synchronous confirmation.
- Repeated callbacks must not duplicate the order.

---

## 10. Payment under review

### Meaning

The payment provider has not produced a final approved or failed state.

### Allowed transitions

```text
payment_under_review → paid
payment_under_review → pending_payment
payment_under_review → cancel_requested
payment_under_review → exception
```

### Customer message

> Tu pago está en revisión. Te avisaremos cuando se confirme.

---

## 11. Paid

### Meaning

Payment was verified and the order is financially confirmed.

### Required data

- Provider payment ID.
- Approved amount.
- Currency.
- Approval timestamp.
- Idempotency record.

### Side effects

- Create order number if not already created.
- Lock customer quote.
- Reserve local stock when possible.
- Create partner assignment task.
- Send payment-confirmed notification.
- Create initial financial ledger records.

### Allowed transitions

```text
paid → assignment_pending
paid → cancel_requested
paid → refund_pending
paid → exception
```

---

## 12. Assignment pending

### Meaning

MPHO must identify one responsible partner.

### Assignment inputs

- Zone.
- Partner capabilities.
- Product source.
- Stock.
- Schedule.
- Preparation time.
- Capacity.
- Delivery cost.
- Partner priority.
- Performance.
- Order type.

### Allowed transitions

```text
assignment_pending → partner_offered
assignment_pending → cancel_requested
assignment_pending → exception
```

### Timeout behavior

If no partner is found:

- Create exception.
- Offer alternative.
- Requote.
- Cancel and refund when required.

---

## 13. Partner offered

### Meaning

An order offer has been sent to a partner.

### Required data

- Partner ID.
- Offer timestamp.
- Accept-by timestamp.
- Expected earning.
- Required capabilities.
- Preparation deadline.

### Allowed transitions

```text
partner_offered → partner_accepted
partner_offered → partner_rejected
partner_offered → assignment_pending
partner_offered → cancel_requested
partner_offered → exception
```

### Timeout

If the partner does not respond:

- Expire offer.
- Return to assignment pending.
- Record no response.
- Notify operations if thresholds are exceeded.

---

## 14. Partner rejected

### Meaning

The partner declined or could not fulfill.

### Required rejection reason

Examples:

```text
out_of_stock
capacity_full
store_closed
unsupported_personalization
cannot_receive_package
insufficient_time
technical_problem
other
```

### Allowed transitions

```text
partner_rejected → assignment_pending
partner_rejected → cancel_requested
partner_rejected → exception
```

---

## 15. Partner accepted

### Meaning

The partner accepted operational responsibility.

### Side effects

- Lock responsible partner.
- Create partner tasks.
- Confirm expected earnings.
- Send customer notification.
- Start relevant product flow.

### Allowed transitions

For local product:

```text
partner_accepted → awaiting_local_stock
```

For external product:

```text
partner_accepted → awaiting_external_purchase
```

For already confirmed local MPHORA stock:

```text
partner_accepted → preparation_pending
```

Other:

```text
partner_accepted → cancel_requested
partner_accepted → exception
```

---

## 16. Awaiting local stock

### Meaning

The partner must confirm and reserve local inventory.

### Allowed transitions

```text
awaiting_local_stock → preparation_pending
awaiting_local_stock → assignment_pending
awaiting_local_stock → product_issue_review
awaiting_local_stock → cancel_requested
awaiting_local_stock → exception
```

### Side effects

If confirmed:

- Reserve stock.
- Record quantity.
- Record confirmation actor.
- Create preparation task.

If unavailable:

- Release partner responsibility if needed.
- Start substitution, reassignment, or cancellation.

---

## 17. Awaiting external purchase

### Meaning

An external item must be purchased or formally ordered.

### Required data

- Source.
- Source URL.
- Observed price.
- Validation timestamp.
- Approved customer amount.
- Assigned receiving partner.
- Expected arrival.

### Allowed transitions

```text
awaiting_external_purchase → external_purchase_created
awaiting_external_purchase → quote_pending
awaiting_external_purchase → cancel_requested
awaiting_external_purchase → exception
```

### Rules

- External purchase may require human approval in the MVP.
- Price must be revalidated before purchase.
- Do not create duplicate external purchases.

---

## 18. External purchase created

### Meaning

The external order has been placed.

### Required data

- External order reference.
- Provider.
- Purchase amount.
- Purchase timestamp.
- Shipping destination.
- Tracking reference when available.

### Allowed transitions

```text
external_purchase_created → external_product_in_transit
external_purchase_created → product_issue_review
external_purchase_created → cancel_requested
external_purchase_created → exception
```

---

## 19. External product in transit

### Meaning

The product is traveling to the assigned Punto MPHO.

### Side effects

- Track external status.
- Notify customer with simplified status.
- Notify partner of expected arrival.
- Monitor delay threshold.

### Allowed transitions

```text
external_product_in_transit → external_product_received
external_product_in_transit → product_issue_review
external_product_in_transit → cancel_requested
external_product_in_transit → exception
```

---

## 20. External product received

### Meaning

The partner physically received the product.

### Required evidence

- Received timestamp.
- Receiver.
- Package condition.
- Product match.
- Quantity.
- Photos when required.

### Allowed transitions

```text
external_product_received → preparation_pending
external_product_received → product_issue_review
external_product_received → exception
```

---

## 21. Product issue review

### Meaning

There is a product-level problem requiring a decision.

Possible causes:

- Out of stock.
- Wrong product.
- Damaged product.
- Missing components.
- External price change.
- Product delay.
- Unsupported personalization.
- Expired product.
- Unsafe product.

### Possible resolutions

- Substitute with customer approval.
- Reassign partner.
- Reorder external product.
- Partial refund.
- Full cancellation.
- Continue with documented acceptance.

### Allowed transitions

```text
product_issue_review → preparation_pending
product_issue_review → assignment_pending
product_issue_review → awaiting_external_purchase
product_issue_review → cancel_requested
product_issue_review → refund_pending
product_issue_review → exception
```

---

## 22. Preparation pending

### Meaning

All required products are available and preparation may begin.

### Required data

- Final item list.
- Final personalization.
- Preparation deadline.
- Evidence checklist.
- Partner earnings.

### Allowed transitions

```text
preparation_pending → preparing
preparation_pending → product_issue_review
preparation_pending → cancel_requested
preparation_pending → exception
```

---

## 23. Preparing

### Meaning

The partner has started irreversible or active preparation.

### Side effects

- Record preparation start.
- Restrict normal cancellation.
- Show customer status.
- Start preparation deadline monitoring.

### Allowed transitions

```text
preparing → ready_for_pickup
preparing → product_issue_review
preparing → cancel_requested
preparing → exception
```

### Cancellation note

Cancellation after this point may preserve partner labor and material earnings.

---

## 24. Ready for pickup

### Meaning

The gift is prepared and approved for courier handoff.

### Required conditions

- Item checklist complete.
- Personalization complete.
- Evidence uploaded.
- Packaging secure.
- Partner confirms ready.
- No blocking incident.

### Side effects

- Trigger delivery assignment.
- Notify customer.
- Notify operations.
- Lock preparation evidence.

### Allowed transitions

```text
ready_for_pickup → delivery_pending
ready_for_pickup → courier_assigned
ready_for_pickup → product_issue_review
ready_for_pickup → exception
```

---

## 25. Delivery pending

### Meaning

The order is ready but no courier has been confirmed.

### Allowed transitions

```text
delivery_pending → courier_assigned
delivery_pending → exception
delivery_pending → cancel_requested
```

### Timeout behavior

If no courier is found:

- Requote delivery if allowed.
- Use fallback provider.
- Escalate.
- Reschedule with customer approval.
- Cancel only according to policy.

---

## 26. Courier assigned

### Meaning

A courier or provider has accepted the delivery.

### Required data

- Courier or provider.
- Assignment time.
- Pickup estimate.
- Delivery estimate.
- Delivery fee.
- Tracking reference.

### Allowed transitions

```text
courier_assigned → picked_up
courier_assigned → delivery_pending
courier_assigned → exception
```

---

## 27. Picked up

### Meaning

The courier received the prepared order.

### Required evidence

- Pickup timestamp.
- Partner confirmation.
- Courier identifier.
- Handoff evidence when required.

### Side effects

- Partner fulfillment work is complete.
- Customer receives pickup update.
- Cancellation becomes delivery-exception handling.

### Allowed transitions

```text
picked_up → out_for_delivery
picked_up → delivery_attempted
picked_up → exception
```

---

## 28. Out for delivery

### Meaning

The courier is traveling to the recipient.

### Allowed transitions

```text
out_for_delivery → delivered
out_for_delivery → delivery_attempted
out_for_delivery → exception
```

---

## 29. Delivery attempted

### Meaning

A delivery attempt occurred but was not completed.

### Required data

- Attempt timestamp.
- Reason.
- Courier note.
- Evidence when appropriate.
- Current package location.

### Possible resolutions

- Reattempt.
- Correct address.
- Contact recipient.
- Return to partner.
- Reschedule.
- Cancel with financial review.

### Allowed transitions

```text
delivery_attempted → out_for_delivery
delivery_attempted → courier_assigned
delivery_attempted → delivery_pending
delivery_attempted → cancel_requested
delivery_attempted → exception
```

---

## 30. Delivered

### Meaning

Delivery was completed.

### Required evidence

- Delivery timestamp.
- Proof of delivery.
- Recipient confirmation or equivalent.
- Provider status.

### Side effects

- Notify customer.
- Freeze delivery evidence.
- Begin completion review.
- Evaluate partner earnings release.
- Evaluate courier payment.
- Enable rating.

### Allowed transitions

```text
delivered → completion_review
delivered → exception
```

A delivered order should not return to preparation.

---

## 31. Completion review

### Meaning

MPHO verifies that operational and financial closure requirements are complete.

### Checks

- Delivery proof.
- No unresolved incident.
- Partner earnings.
- Courier payment.
- Refund status.
- External purchase status.
- Customer notification.
- Ledger consistency.

### Allowed transitions

```text
completion_review → completed
completion_review → exception
completion_review → refund_pending
```

---

## 32. Completed

### Meaning

The order is operationally and financially closed.

### Conditions

- Delivery confirmed.
- Required evidence present.
- No blocking incident.
- Earnings calculated.
- Payment and refund states consistent.
- Completion timestamp recorded.

### Allowed transitions

Normally terminal.

Possible post-completion events:

- Customer dispute.
- Chargeback.
- Financial adjustment.
- Rating.
- Support case.

These should not rewrite order history.

---

## 33. Cancel requested

### Meaning

A cancellation has been requested but not yet finalized.

### Required data

- Requesting actor.
- Reason.
- Request timestamp.
- Current state.
- Work already performed.
- External purchase status.
- Delivery status.
- Expected financial impact.

### Allowed transitions

```text
cancel_requested → cancelled
cancel_requested → refund_pending
cancel_requested → previous_valid_state
cancel_requested → exception
```

Returning to a previous state requires explicit cancellation rejection or withdrawal.

---

## 34. Cancelled

### Meaning

The order will no longer continue.

### Required side effects

- Release local stock.
- Stop partner tasks.
- Cancel courier when possible.
- Stop notifications that imply progress.
- Calculate partner compensation.
- Calculate courier compensation.
- Calculate customer refund.
- Record reason.
- Preserve all history.

### Allowed transitions

```text
cancelled → refund_pending
cancelled → refunded
cancelled → completed
cancelled → exception
```

A cancelled order may become completed only as an administratively closed cancelled order, not as delivered.

---

## 35. Refund pending

### Meaning

A refund has been approved or initiated but not yet confirmed complete.

### Required data

- Refund amount.
- Original payment.
- Reason.
- Provider reference.
- Initiation timestamp.
- Actor.
- Financial allocation.

### Allowed transitions

```text
refund_pending → refunded
refund_pending → exception
```

---

## 36. Refunded

### Meaning

The payment provider confirmed the refund.

### Required data

- Confirmed amount.
- Provider confirmation.
- Completion timestamp.
- Ledger entries.

### Allowed transitions

Usually:

```text
refunded → completed
refunded → exception
```

---

## 37. Exception

### Meaning

The normal flow is blocked or requires human intervention.

### Exception data

- Category.
- Severity.
- Opened timestamp.
- Actor.
- Responsible domain.
- Related state.
- Customer impact.
- Financial impact.
- Resolution deadline.
- Assigned operator.
- Evidence.

### Example categories

```text
payment
partner
stock
external_provider
product_damage
personalization
delivery
customer_data
security
refund
payout
technical
```

### Resolution

An exception should resolve to a valid normal state.

Do not use `exception` as a permanent dumping state.

---

## 38. State-transition authorization

### Customer

May initiate:

- Draft changes.
- Payment.
- Cancellation request.
- Substitution approval.
- Address correction before cutoff.
- Support request.

### Partner

May initiate:

- Offer acceptance.
- Rejection.
- Stock confirmation.
- Product receipt.
- Damage report.
- Preparation start.
- Ready status.
- Courier handoff confirmation.

### Courier

May initiate:

- Pickup.
- Out for delivery.
- Delivery attempt.
- Delivery confirmation.
- Delivery incident.

### MPHO operator

May initiate:

- Reassignment.
- Exception.
- Manual review.
- Cancellation process.
- Approved resolution.

### Service account

May initiate only verified automated transitions.

Examples:

- Payment approved.
- Quote expired.
- External tracking update.
- Delivery-provider update.
- Notification side effect.

---

## 39. State-transition table

| From | To | Primary actor | Required validation |
|---|---|---|---|
| draft | quote_pending | Customer/system | Required order data |
| quote_pending | quoted | System | Valid price, zone, timing |
| quoted | pending_payment | Customer | Quote valid |
| pending_payment | paid | Verified provider | Payment approved |
| paid | assignment_pending | System | Order created |
| assignment_pending | partner_offered | Operator/system | Eligible partner |
| partner_offered | partner_accepted | Partner | Capacity and capability |
| partner_offered | partner_rejected | Partner/timeout | Rejection reason |
| partner_accepted | awaiting_local_stock | System | Local product |
| partner_accepted | awaiting_external_purchase | System | External product |
| awaiting_local_stock | preparation_pending | Partner | Stock confirmed |
| awaiting_external_purchase | external_purchase_created | Operator/system | Purchase confirmed |
| external_purchase_created | external_product_in_transit | Provider/system | Tracking created |
| external_product_in_transit | external_product_received | Partner | Physical receipt |
| external_product_received | preparation_pending | Partner/system | Product approved |
| preparation_pending | preparing | Partner | Work started |
| preparing | ready_for_pickup | Partner | Evidence complete |
| ready_for_pickup | delivery_pending | System | Delivery required |
| delivery_pending | courier_assigned | Operator/system | Courier accepted |
| courier_assigned | picked_up | Courier/partner | Handoff confirmed |
| picked_up | out_for_delivery | Courier/provider | Delivery started |
| out_for_delivery | delivered | Courier/provider | Proof of delivery |
| delivered | completion_review | System | Delivery confirmed |
| completion_review | completed | System/operator | Financial and evidence checks |
| any eligible | cancel_requested | Customer/operator | Policy check |
| cancel_requested | cancelled | Operator/system | Cancellation approved |
| cancelled | refund_pending | System/operator | Refund required |
| refund_pending | refunded | Verified provider | Refund confirmed |
| any blocked | exception | System/operator | Exception record |

---

## 40. Side-effect rules

A state transition may trigger:

- Notification.
- Task creation.
- Stock reservation.
- Stock release.
- Earnings record.
- Delivery request.
- Refund request.
- Audit event.
- Timeout job.
- Exception alert.

Side effects must be:

- Idempotent.
- Retryable when safe.
- Recorded.
- Separated from the user interface.
- Protected from duplicate execution.

---

## 41. Idempotency rules

Use idempotency for:

- Payment callbacks.
- Refund callbacks.
- Delivery callbacks.
- Partner acceptance.
- Stock reservation.
- Earnings creation.
- Notification delivery.
- External purchase creation.
- Courier assignment.
- Completion.

Example:

If the same payment webhook arrives three times, the order must still have:

- One payment record.
- One paid transition.
- One set of stock reservations.
- One assignment task.

---

## 42. Timeout rules

Important timeouts:

- Quote expiration.
- Payment session expiration.
- Partner acceptance deadline.
- Stock confirmation deadline.
- External-arrival delay threshold.
- Preparation deadline.
- Courier assignment deadline.
- Delivery-attempt response deadline.
- Refund processing threshold.

A timeout should create:

- A controlled transition.
- An alert.
- An exception.
- A reassignment.
- Or a customer action request.

Never leave time-sensitive states indefinitely.

---

## 43. Audit-history model

Every transition record should include:

```text
order_id
from_state
to_state
actor_type
actor_id
reason_code
reason_text
created_at
metadata
idempotency_key
request_id
```

Historical transitions must not be deleted.

---

## 44. Customer-facing state mapping

Internal states should map to simple customer language.

| Internal state | Customer message |
|---|---|
| pending_payment | Esperando confirmación de pago |
| paid | Pago aprobado |
| assignment_pending | Buscando el Punto MPHO adecuado |
| partner_accepted | El aliado aceptó tu pedido |
| awaiting_external_purchase | Preparando la compra del producto |
| external_product_in_transit | El producto va en camino al Punto MPHO |
| external_product_received | El aliado ya recibió el producto |
| preparing | Estamos preparando tu regalo |
| ready_for_pickup | Tu regalo está listo |
| courier_assigned | Repartidor asignado |
| out_for_delivery | Tu regalo va en camino |
| delivered | Tu regalo fue entregado |
| refund_pending | Reembolso en proceso |
| refunded | Reembolso completado |
| exception | Necesitamos revisar un detalle de tu pedido |

---

## 45. Partner-facing state mapping

| Internal state | Partner action |
|---|---|
| partner_offered | Aceptar o rechazar |
| awaiting_local_stock | Confirmar existencia |
| external_product_in_transit | Prepararse para recibir |
| external_product_received | Revisar producto |
| preparation_pending | Iniciar preparación |
| preparing | Completar y subir evidencia |
| ready_for_pickup | Esperar repartidor |
| courier_assigned | Preparar entrega |
| picked_up | Handoff completado |
| exception | Resolver incidencia |

---

## 46. Financial consistency rules

An order must not be completed if:

- Payment is not approved.
- Refund state is inconsistent.
- Partner earnings are missing.
- Delivery cost is missing when delivery occurred.
- Duplicate financial entries exist.
- Currency mismatch exists.
- Required payout liability is not recorded.

---

## 47. Stock consistency rules

Stock must:

- Reserve after approved conditions.
- Release after cancellation.
- Decrease after fulfillment.
- Avoid duplicate reservation.
- Record adjustment.
- Never rely only on frontend state.

---

## 48. Delivery consistency rules

Delivery must not be marked delivered when:

- No courier is assigned.
- No pickup occurred.
- Required proof is missing.
- Provider state is unverified.
- The order remains at partner location.

Manual override requires:

- Authorized role.
- Reason.
- Evidence.
- Audit log.

---

## 49. Reopening completed orders

A completed order should not be returned to active fulfillment.

Post-completion problems should create:

- Support case.
- Incident.
- Refund.
- Adjustment.
- Chargeback record.

Do not rewrite the original lifecycle.

---

## 50. MVP implementation recommendation

For the MVP:

- Use explicit enums.
- Use a transition service.
- Validate actor and current state.
- Write transition history.
- Process side effects through controlled jobs.
- Use idempotency keys.
- Expose customer-friendly status mapping.
- Create exception records.
- Avoid direct database state edits from UI components.
- Include test coverage for valid and invalid transitions.

---

## 51. Minimum tests

At minimum test:

- Successful local order.
- Successful external order.
- Successful MPHORA order.
- Partner rejection and reassignment.
- Out-of-stock after payment.
- External product damaged.
- Customer cancellation before preparation.
- Customer cancellation after preparation starts.
- Payment webhook duplicate.
- Refund webhook duplicate.
- Courier assignment failure.
- Failed delivery.
- Successful completion.
- Unauthorized transition.
- Invalid state rollback.
- Stock release on cancellation.
- Earnings not duplicated.

---

## 52. Summary

The order lifecycle is the operational backbone of MPHO.

Every actor, notification, payment, earning, delivery, and exception depends on a valid order state.

The system must never advance an order only because a button was clicked.

Every transition must be authorized, validated, auditable, and safe to retry.
