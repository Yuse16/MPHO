# 21_DELIVERY_LOGISTICS.md

## 1. Purpose

This document defines delivery and last-mile logistics for MPHO.

It explains:

- Delivery actors.
- Delivery modes.
- Zones.
- Quotes.
- Assignment.
- Pickup.
- Tracking.
- Proof of delivery.
- Failed delivery.
- Returns.
- Partner own delivery.
- Provider integration.
- Pricing.
- Incidents.
- Metrics.
- MVP implementation.

This document must be read together with:

- `09_PRICING_AND_COMMISSIONS.md`
- `10_USER_ROLES.md`
- `11_CUSTOMER_JOURNEY.md`
- `12_PARTNER_JOURNEY.md`
- `13_ORDER_LIFECYCLE.md`
- `15_PARTNER_APP.md`
- `16_ADMIN_PANEL.md`
- `19_MPHORA_EXPRESS.md`
- `20_WHATSAPP_AUTOMATION.md`
- `22_PAYMENTS_AND_PAYOUTS.md`

---

## 2. Logistics objective

MPHO logistics must:

- Move the correct gift.
- From the correct Punto MPHO.
- To the correct recipient.
- Within the expected window.
- At a known cost.
- With traceable status.
- With proof of pickup and delivery.
- With a clear failure process.

Delivery is not complete until evidence or verified provider confirmation exists.

---

## 3. Delivery actors

Possible delivery actors:

```text
independent_courier
mobility_platform
logistics_company
partner_own_delivery
mpho_managed_future
```

The MVP may use one or more.

Each delivery record must identify the actual actor type.

---

## 4. Delivery modes

Official preliminary modes:

```text
scheduled_local
mphora_fast
partner_own_delivery
manual_courier
provider_integrated
customer_pickup_future
```

### Scheduled local

Delivery within an agreed date and time window.

### MPHORA fast

Delivery through the fast eligibility flow.

### Partner own delivery

The responsible partner completes delivery.

### Manual courier

MPHO operator manually requests a courier.

### Provider integrated

MPHO requests and tracks delivery through an API.

---

## 5. One-pickup rule

In the MVP:

- One responsible partner prepares the order.
- One pickup location exists.
- One destination exists.
- One delivery record exists per attempt.

Avoid multi-stop routes and multi-partner pickups.

---

## 6. Delivery zone

A delivery zone should define:

- City.
- Name.
- Postal codes or boundary.
- Active status.
- Supported delivery modes.
- Operating hours.
- Base price rules.
- Distance rules.
- MPHORA availability.
- Partner coverage.
- Provider coverage.
- Restrictions.

A zone must not be activated only because it exists on a map.

---

## 7. Coverage check

Coverage validation should consider:

- Delivery address.
- Responsible partner.
- Distance.
- Provider availability.
- Operating hours.
- Product restrictions.
- Delivery mode.
- Date.
- Package size.
- Fragility.
- Safety restrictions.

Coverage result:

```text
supported
supported_modes[]
estimated_price
estimated_window
restrictions[]
expires_at
blocking_reason
```

---

## 8. Delivery quote

A delivery quote should include:

```text
quote_id
order_id_or_cart_id
pickup_address
delivery_address
distance
provider
delivery_mode
base_cost
adjustments
customer_price
currency
pickup_estimate
delivery_window
expires_at
status
```

Quote statuses:

```text
created
valid
expired
accepted
cancelled
failed
```

---

## 9. Quote sources

A quote may come from:

- Provider API.
- Zone pricing table.
- Distance calculation.
- Partner own-delivery rate.
- Manual operator entry.

The source must be recorded.

---

## 10. Delivery pricing

Possible formula:

```text
base_cost
+ distance_cost
+ urgency_cost
+ package_size_cost
+ fragile_handling
+ wait_time
+ provider_surcharge
+ coordination_margin
= customer_delivery_price
```

Internal provider cost and customer price must remain separate.

---

## 11. Delivery quote expiration

Delivery quotes should expire because:

- Provider price changes.
- Time passes.
- Capacity changes.
- Distance changes.
- Address changes.
- Delivery mode changes.

Revalidate:

- Before payment.
- After partner reassignment.
- Before courier request when required.
- After address correction.

---

## 12. Address validation

Required delivery data:

- Recipient name.
- Phone when required.
- Street.
- Exterior number.
- Interior number.
- Neighborhood.
- Postal code.
- City.
- State.
- References.
- Map pin.
- Delivery instructions.
- Surprise mode.

Address should be validated before payment when possible.

---

## 13. Address changes

### Before payment

Allowed.

### After payment, before courier assignment

May be allowed with quote recalculation.

### After courier assignment

May require provider approval and additional cost.

### After pickup

Usually becomes a delivery exception.

Every change must be recorded.

---

## 14. Delivery scheduling

The system should support:

- Date.
- Time window.
- Earliest available.
- MPHORA.
- Partner-specific schedule.
- Holiday schedule.

The customer selects a requested window.

The system stores:

- Requested window.
- Estimated window.
- Confirmed provider window.
- Actual delivery time.

---

## 15. Courier assignment

Assignment may consider:

- Pickup location.
- Destination.
- Time window.
- Product size.
- Fragility.
- Delivery mode.
- Provider availability.
- Cost.
- Reliability.
- Current workload.
- Partner own-delivery capability.

---

## 16. Assignment states

Possible delivery states:

```text
quote_pending
quoted
assignment_pending
assigned
courier_en_route_to_pickup
arrived_at_pickup
picked_up
out_for_delivery
delivery_attempted
delivered
returning_to_partner
returned_to_partner
cancelled
exception
```

These should map to the order lifecycle.

---

## 17. Courier identity

The system may store:

- Provider.
- Courier ID.
- Courier first name.
- Vehicle.
- Plate when provided.
- Phone through masked contact when possible.
- Rating when provider supports it.

Expose only what is necessary.

---

## 18. Pickup readiness

Do not assign pickup as ready unless:

- Partner marked ready.
- Evidence complete.
- Package secure.
- No blocking incident.
- Pickup address confirmed.
- Order label available.

For MPHORA, assignment may be prepared earlier, but pickup should still respect readiness.

---

## 19. Pickup flow

```text
courier assigned
→ courier travels to Punto MPHO
→ partner verifies courier
→ partner confirms correct order
→ handoff evidence captured
→ courier confirms pickup
→ order becomes out for delivery
```

Required pickup data:

- Timestamp.
- Partner.
- Courier.
- Package count.
- Order reference.
- Evidence.
- Incident if mismatch.

---

## 20. Handoff verification

Possible methods:

- QR scan.
- One-time code.
- Order number.
- Courier identifier.
- Provider confirmation.
- Partner photo.

The MVP may use order number plus courier verification.

---

## 21. Packaging requirements

Delivery suitability should consider:

- Secure closure.
- Weather protection.
- Fragile handling.
- Upright orientation.
- Food handling.
- Flower care.
- Tamper evidence.
- Recipient privacy.
- Correct label.

Partner should not mark ready if packaging is unsafe.

---

## 22. Tracking

Tracking may be:

- Provider tracking link.
- Provider status events.
- Courier manual updates.
- MPHO internal states.
- GPS in future.

Customer tracking should use simplified status.

Do not promise live GPS unless available.

---

## 23. Customer status mapping

| Delivery state | Customer message |
|---|---|
| assignment_pending | We are assigning a courier |
| assigned | Courier assigned |
| courier_en_route_to_pickup | Courier is going to the Punto MPHO |
| picked_up | The courier has your gift |
| out_for_delivery | Your gift is on the way |
| delivery_attempted | We could not complete the delivery |
| delivered | Your gift was delivered |
| returning_to_partner | The gift is returning to the Punto MPHO |

---

## 24. Partner status mapping

| Delivery state | Partner action |
|---|---|
| assigned | Prepare handoff |
| arrived_at_pickup | Verify courier |
| picked_up | Handoff complete |
| delivery_attempted | Wait for instruction |
| returning_to_partner | Prepare to receive return |
| returned_to_partner | Confirm return condition |

---

## 25. Proof of delivery

Possible proof:

- Provider confirmation.
- Recipient code.
- Signature.
- Photo of package at approved location.
- Recipient name.
- GPS timestamp.
- Courier note.

Proof must respect privacy.

Do not require a photo of the recipient by default.

---

## 26. Delivery completion

Delivery should be marked delivered only when:

- Courier or provider confirms.
- Required proof exists.
- Timestamp exists.
- No state conflict exists.

A manual override requires:

- Authorized role.
- Reason.
- Evidence.
- Audit log.

---

## 27. Surprise delivery

Surprise modes:

### Full surprise

Do not contact recipient unless needed.

### Discreet coordination

Contact recipient without revealing gift details.

### Scheduled

Recipient may know a delivery is expected.

The courier must receive the selected mode.

---

## 28. Recipient unavailable

Possible actions:

- Contact customer.
- Contact recipient according to surprise mode.
- Wait within allowed time.
- Reattempt.
- Return to partner.
- Reschedule.

Record:

- Attempt time.
- Contact attempts.
- Reason.
- Package condition.
- Current location.

---

## 29. Failed-delivery reasons

Structured reasons:

```text
recipient_absent
incorrect_address
address_incomplete
access_denied
unsafe_location
recipient_refused
customer_unreachable
courier_issue
vehicle_issue
weather
partner_delay
package_damage
other
```

Reason affects financial responsibility.

---

## 30. Reattempt

A reattempt should define:

- New date.
- New time window.
- New delivery price.
- Funding responsibility.
- Package location.
- Customer approval.
- Courier assignment.

Do not create a reattempt without financial and operational clarity.

---

## 31. Return to partner

When delivery fails:

```text
courier returns gift
→ partner confirms receipt
→ partner checks condition
→ order enters exception
→ customer and MPHO decide next action
```

Return record:

- Return time.
- Partner receiver.
- Product condition.
- Evidence.
- Storage start.
- Next action deadline.

---

## 32. Delivery cancellation

Cancellation behavior depends on stage:

### Before courier assigned

Usually no courier cost.

### Courier assigned but not traveling

Provider cancellation terms apply.

### Courier traveling to pickup

Cancellation fee may apply.

### Picked up

Normal cancellation is usually no longer possible.

The system must record actual cancellation cost.

---

## 33. Partner own delivery

Partner own-delivery requirements:

- Approved capability.
- Defined zones.
- Defined price.
- Authorized delivery user.
- Proof of delivery.
- Incident handling.
- Earnings record.
- Privacy obligations.

Partner own delivery must not bypass tracking.

---

## 34. Manual courier flow

MVP manual flow:

```text
partner marks ready
→ MPHO operator requests courier
→ operator records provider and cost
→ courier details stored
→ partner notified
→ pickup confirmed
→ customer notified
→ delivery proof stored
```

Manual flow must still be auditable.

---

## 35. Provider integration

A delivery integration should support:

- Quote.
- Request.
- Cancel.
- Status.
- Tracking.
- Proof.
- Error.
- Webhook.
- Reconciliation.

Required controls:

- Authentication.
- Timeout.
- Retry.
- Idempotency.
- Webhook verification.
- Environment separation.
- Mapping of provider states.
- Manual fallback.

---

## 36. Provider state mapping

Each provider state should map to MPHO states.

Example:

```text
provider_created → assigned
provider_arriving_pickup → courier_en_route_to_pickup
provider_picked_up → picked_up
provider_in_transit → out_for_delivery
provider_completed → delivered
provider_cancelled → cancelled
provider_failed → exception
```

Do not expose raw provider states directly.

---

## 37. Webhook handling

Delivery webhooks must:

- Verify source.
- Use idempotency.
- Validate order relation.
- Reject stale or invalid transitions.
- Store raw event reference.
- Update delivery record.
- Create order transition.
- Send notification.
- Avoid duplicate side effects.

---

## 38. Delivery incidents

Incident categories:

- Courier late.
- Courier no-show.
- Wrong courier.
- Package damaged.
- Package lost.
- Recipient unavailable.
- Address issue.
- Unsafe delivery.
- Partner handoff delay.
- Provider outage.
- Price mismatch.

Each incident should include:

- Severity.
- Responsible domain.
- Evidence.
- Customer impact.
- Financial impact.
- Resolution.

---

## 39. Lost package

A lost-package incident requires:

- Immediate escalation.
- Courier/provider contact.
- Partner evidence.
- Pickup proof.
- Last known status.
- Customer communication.
- Refund or replacement review.
- Financial allocation.
- Security review when suspicious.

---

## 40. Damaged in transit

Flow:

```text
damage reported
→ delivery paused
→ evidence collected
→ customer informed
→ replacement or refund decision
→ partner and courier responsibility reviewed
```

Do not mark delivered if the recipient refused a damaged gift.

---

## 41. Delivery earnings

Courier or partner delivery earnings should include:

- Delivery ID.
- Order ID.
- Provider.
- Amount.
- Currency.
- Status.
- Payment reference.
- Incident adjustment.
- Paid time.

Delivery payable must remain separate from partner preparation earning unless the same partner performs both.

---

## 42. Cost reconciliation

The system should compare:

- Quoted provider cost.
- Final provider cost.
- Customer delivery price.
- Cancellation fee.
- Wait fee.
- Reattempt cost.
- Refund.
- Coordination margin.

Flag unexpected differences.

---

## 43. Delivery SLAs

No formal SLA should be promised until:

- Provider reliability is measured.
- Zones are stable.
- Partner preparation is stable.
- Support process exists.
- Compensation policy exists.

The system may use internal targets without advertising guarantees.

---

## 44. Emergency conditions

MPHO may pause or restrict delivery because of:

- Severe weather.
- Security event.
- Road closure.
- Provider outage.
- Holiday.
- Partner closure.
- Demand overload.
- Technical failure.

Affected customers should receive clear updates.

---

## 45. Logistics analytics

Track:

```text
delivery_quote_created
delivery_quote_expired
courier_assignment_started
courier_assigned
courier_assignment_failed
courier_arrived_pickup
order_picked_up
out_for_delivery
delivery_attempted
delivery_completed
delivery_returned
delivery_cancelled
delivery_incident_opened
```

---

## 46. Logistics metrics

Important metrics:

- Quote success.
- Average delivery cost.
- Assignment time.
- Courier arrival time.
- Pickup wait.
- Travel time.
- On-time delivery.
- Failed delivery rate.
- Reattempt rate.
- Return rate.
- Damage rate.
- Lost package rate.
- Delivery margin.
- Provider reliability.
- Partner own-delivery performance.
- Manual intervention rate.

---

## 47. MVP implementation

Recommended MVP:

- Selected Saltillo zones.
- Manual or semi-manual courier assignment.
- Zone-based delivery pricing.
- One pickup and one destination.
- Delivery record.
- Pickup confirmation.
- Out-for-delivery status.
- Proof of delivery.
- Failed-delivery workflow.
- Partner own delivery when approved.
- WhatsApp notifications.
- Admin exception queue.

No advanced route optimization is required.

---

## 48. Launch validation

Before expanding a zone, validate:

- Real delivery quotes.
- Typical pickup time.
- Typical travel time.
- Failed-delivery behavior.
- Cost.
- Courier availability.
- Safety.
- Partner handoff quality.
- Customer communication.
- Margin.

---

## 49. Minimum tests

Test:

- Supported zone.
- Unsupported zone.
- Quote expiration.
- Address change.
- Courier assignment success.
- Courier assignment failure.
- Partner not ready.
- Pickup confirmation.
- Duplicate pickup webhook.
- Out-for-delivery.
- Successful delivery.
- Failed delivery.
- Reattempt.
- Return to partner.
- Damaged package.
- Lost package.
- Provider cancellation.
- Partner own delivery.
- Manual override.
- Unauthorized delivery update.

---

## 50. Definition of done

A logistics feature is done when:

- Zone is validated.
- Quote source is recorded.
- Cost and customer price are separate.
- Assignment is traceable.
- Pickup is verified.
- Delivery status is mapped.
- Proof is protected.
- Failed delivery has a workflow.
- Provider events are idempotent.
- Financial effects are recorded.
- Tests cover failure cases.
- Documentation is updated.

---

## 51. Summary

MPHO delivery is not only a button that requests a courier.

It is a complete controlled process:

```text
quote
→ assignment
→ pickup
→ transport
→ delivery attempt
→ proof
→ incident or completion
```

The system must know where the gift is, who is responsible, what it costs, and what happens if delivery fails.
