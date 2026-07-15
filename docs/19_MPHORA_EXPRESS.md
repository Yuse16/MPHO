# 19_MPHORA_EXPRESS.md

## 1. Purpose

This document defines MPHORA, MPHO's fast-delivery mode.

It explains:

- Eligibility.
- Zones.
- Cutoff times.
- Partner capacity.
- Product requirements.
- Delivery requirements.
- Customer experience.
- Pricing.
- Order flow.
- Exceptions.
- Metrics.
- MVP implementation.

MPHORA must never be used as a marketing label without current operational eligibility.

This document must be read together with:

- `03_BRAND_ECOSYSTEM.md`
- `11_CUSTOMER_JOURNEY.md`
- `13_ORDER_LIFECYCLE.md`
- `14_CUSTOMER_APP.md`
- `15_PARTNER_APP.md`
- `17_CATALOG_AND_INVENTORY.md`
- `18_HADIA_AI.md`
- `21_DELIVERY_LOGISTICS.md`
- `22_PAYMENTS_AND_PAYOUTS.md`

---

## 2. Product definition

MPHORA is the MPHO mode for gifts that can be prepared and delivered quickly through a nearby eligible partner.

MPHORA means:

```text
real local product
+ confirmed availability
+ active partner
+ preparation capacity
+ supported zone
+ delivery capacity
+ valid cutoff
= fast-delivery eligibility
```

MPHORA is not a synonym for:

- Same-day in every case.
- One-hour delivery.
- Immediate delivery.
- Local product.
- Partner proximity.
- Product in catalog.

---

## 3. Customer promise

Preferred promise:

> Fast delivery options available near the recipient, subject to current eligibility.

Customer-facing language may include:

- Available through MPHORA.
- Delivery today.
- Fast delivery available.
- Order before the cutoff.
- Estimated delivery window.

Avoid:

- Guaranteed now.
- Instant.
- Always available.
- One hour guaranteed.

Unless an approved service level supports the claim.

---

## 4. MPHORA eligibility inputs

Eligibility must evaluate:

- Listing published.
- Source type local.
- Product or variant stock.
- Stock freshness.
- Partner active.
- Partner open.
- Partner capacity.
- Partner capability.
- Preparation time.
- Product handling.
- Selected zone.
- Delivery provider.
- Courier capacity.
- Current time.
- Cutoff time.
- Delivery window.
- Active incidents.
- Quote validity.

---

## 5. Eligibility result

The MPHORA eligibility service should return:

```text
eligible
listing_id
variant_id
partner_id
zone_id
preparation_minutes
pickup_estimate
delivery_window_start
delivery_window_end
cutoff_at
eligibility_expires_at
delivery_price
currency
blocking_reasons[]
confidence_level
calculated_at
```

Do not store only a permanent boolean.

---

## 6. Blocking reasons

Possible reasons:

```text
out_of_stock
stock_stale
partner_inactive
partner_closed
partner_capacity_full
unsupported_zone
cutoff_passed
delivery_unavailable
preparation_too_long
product_not_local
product_restricted
active_incident
quote_expired
delivery_price_missing
```

The customer should receive a simplified message.

The admin and partner may receive more detail.

---

## 7. Zone eligibility

A MPHORA zone must define:

- City.
- Geographic boundary or postal codes.
- Active hours.
- Delivery coverage.
- Partner coverage.
- Delivery fee rules.
- Maximum preparation time.
- Maximum delivery time target.
- Cutoff rules.
- Holiday behavior.
- Emergency pause.

A zone should not be active if it has no reliable partner and delivery coverage.

---

## 8. Partner eligibility

A MPHORA partner must:

- Be active.
- Have approved relevant capabilities.
- Have confirmed operating hours.
- Maintain acceptable response time.
- Maintain stock accuracy.
- Maintain preparation capacity.
- Support required evidence.
- Have no blocking suspension.
- Be within or near the supported delivery area.

Future performance thresholds may apply.

---

## 9. Product eligibility

A MPHORA product must:

- Be local.
- Be published.
- Have confirmed stock.
- Have known preparation time.
- Be suitable for quick preparation.
- Be suitable for local delivery.
- Have compatible packaging.
- Have no external acquisition dependency.
- Have current price.
- Have current availability.

External by-order products are not MPHORA.

---

## 10. Variant eligibility

Eligibility may differ by variant.

Example:

```text
Red flower box: eligible
White flower box: out of stock
Premium flower box: preparation too long
```

The customer should not see the entire product as eligible when selected variant is not.

---

## 11. Capacity model

Partner MPHORA capacity may be represented as:

- Maximum concurrent orders.
- Maximum orders per time slot.
- Manual available/unavailable switch.
- Preparation slots.
- Current active workload.

MVP recommendation:

Use a simple capacity value plus active-order count.

Example:

```text
mphora_capacity = 3
active_mphora_orders = 2
remaining_capacity = 1
```

---

## 12. Preparation-time model

Preparation time should be based on:

- Product.
- Variant.
- Personalization.
- Partner.
- Current workload.
- Time of day.
- Materials.
- Urgency.
- Evidence requirements.

Possible formula:

```text
base_preparation
+ personalization_time
+ queue_time
+ safety_buffer
= estimated_preparation_time
```

Do not use one fixed preparation time for every partner and product.

---

## 13. Delivery-time model

Delivery estimate may include:

```text
preparation_time
+ courier_assignment_time
+ courier_arrival_time
+ travel_time
+ safety_buffer
= estimated_delivery_window
```

The customer should receive a window, not false precision.

---

## 14. Cutoff rules

A cutoff determines whether a new MPHORA order can still be accepted.

Cutoff may depend on:

- Partner closing time.
- Delivery-provider hours.
- Zone.
- Product.
- Day of week.
- Holiday.
- Current capacity.
- Required delivery window.

The cutoff must be recalculated when operating conditions change.

---

## 15. Eligibility expiration

MPHORA eligibility must expire.

Possible expiration triggers:

- Cutoff passed.
- Stock changed.
- Capacity changed.
- Partner paused.
- Delivery unavailable.
- Quote expired.
- Active incident.
- Price changed.

Recommended behavior:

- Revalidate on product view.
- Revalidate on cart.
- Revalidate before payment.
- Revalidate after payment if assignment changes.

---

## 16. Customer flow

```text
Customer opens MPHORA
→ selects city or address
→ system calculates eligibility
→ customer sees eligible products
→ customer personalizes within allowed limits
→ system revalidates
→ customer reviews delivery window and price
→ customer pays
→ partner offer is sent
→ partner accepts
→ preparation begins
→ courier is assigned
→ delivery completes
```

---

## 17. MPHORA product page

Required information:

- MPHORA badge.
- Selected zone.
- Current estimate.
- Cutoff.
- Price.
- Included services.
- Personalization limits.
- Availability expiration.
- Terms.

Example:

> Available through MPHORA in Valle de las Flores. Order before 4:00 p.m. Estimated delivery between 5:30 and 7:00 p.m.

---

## 18. Personalization limits

Some personalization may disqualify MPHORA.

Examples:

- Complex engraving.
- Custom printing.
- Large video upload.
- Special sourcing.
- Handmade custom design.

The interface should:

- Mark fast-compatible personalization.
- Recalculate estimate.
- Remove MPHORA if timing becomes invalid.
- Offer scheduled delivery.

---

## 19. Cart behavior

A cart containing a MPHORA item must:

- Use one partner.
- Use one delivery zone.
- Use compatible add-ons.
- Stay within partner capacity.
- Revalidate stock.
- Revalidate delivery.
- Show quote expiration.

If an add-on requires another partner, block it or suggest a compatible add-on.

---

## 20. Payment behavior

Before payment:

- Reserve stock when approved.
- Reserve partner capacity when supported.
- Lock quote for a short period.
- Revalidate delivery price.
- Display expiration.

After verified payment:

- Send immediate partner offer.
- Start short acceptance timer.
- Notify operations if partner does not respond.
- Prepare reassignment fallback.

---

## 21. Partner offer behavior

A MPHORA offer should show:

- High-priority label.
- Accept-by deadline.
- Preparation deadline.
- Delivery target.
- Product checklist.
- Personalization.
- Earnings.
- Courier strategy.

The partner should respond quickly.

Silence should trigger reassignment or exception.

---

## 22. Assignment strategy

Preferred MPHORA assignment criteria:

1. Product stock.
2. Partner active.
3. Preparation capacity.
4. Distance to recipient.
5. Delivery availability.
6. Response reliability.
7. Preparation reliability.
8. Delivery cost.
9. Incident rate.

Do not prioritize only lowest partner cost.

---

## 23. Reassignment

If a partner rejects:

```text
release partner capacity
→ release or move reservation
→ find next eligible partner
→ revalidate delivery window
→ notify customer only if timing changes
```

If no partner exists:

- Offer scheduled delivery.
- Offer alternative product.
- Cancel and refund if required.
- Create exception.

---

## 24. Courier assignment

Courier assignment may begin:

- After payment.
- After partner acceptance.
- Before preparation finishes if timing is reliable.
- After ready status in MVP.

The system must avoid paying for a courier before the gift is realistically ready unless cancellation terms are clear.

---

## 25. Pricing

MPHORA customer price may include:

- Product.
- Preparation.
- Personalization.
- Priority fee.
- Delivery.
- MPHO service.

Possible extra cost must be visible.

The customer should know whether fast service affects price.

---

## 26. Partner earnings

Partner earnings may include:

- Product earning.
- Fast-preparation earning.
- Wrapping.
- Personalization.
- Handoff.
- Own delivery.

The partner should see the full expected earning before acceptance.

---

## 27. Delivery-provider failure

If delivery becomes unavailable after payment:

- Try fallback provider.
- Recalculate timing.
- Inform customer if timing changes.
- Request approval for material extra cost.
- Offer reschedule.
- Offer cancellation where appropriate.
- Create incident.

Do not silently delay.

---

## 28. Partner delay

If preparation deadline is at risk:

- Alert partner.
- Alert MPHO operations.
- Estimate new timing.
- Evaluate courier assignment.
- Inform customer if delivery window changes.
- Apply incident rules when partner-caused.

---

## 29. Customer delay

Possible customer-caused delay:

- Address incomplete.
- Personalization not confirmed.
- Substitution unanswered.
- Recipient coordination required.

The system should:

- Pause relevant timer when policy allows.
- Request action.
- Show deadline.
- Recalculate eligibility.
- Remove MPHORA promise if necessary.

---

## 30. Failed delivery

A failed delivery may require:

- Reattempt.
- Return to partner.
- New delivery fee.
- Recipient contact.
- Customer approval.
- Cancellation review.

Fast preparation does not guarantee successful recipient availability.

---

## 31. Emergency pause

MPHO admin should be able to pause MPHORA by:

- Global.
- City.
- Zone.
- Partner.
- Product.
- Delivery provider.
- Time window.

Reasons:

- Weather.
- Demand overload.
- Provider outage.
- Safety issue.
- Partner shortage.
- Technical issue.
- Holiday.

Pause must be auditable.

---

## 32. MPHORA state fields

An order using MPHORA should store:

```text
mphora_requested
mphora_eligible_at_quote
mphora_partner_id
mphora_zone_id
mphora_cutoff_at
mphora_quote_expires_at
mphora_preparation_target
mphora_delivery_window
mphora_fee
mphora_lost_reason_optional
```

Historical eligibility must be preserved.

---

## 33. Customer status messages

Suggested messages:

### Eligible

> MPHORA is available for this gift and zone.

### Partner accepted

> The partner accepted your MPHORA order and is preparing it.

### Ready

> Your gift is ready. We are coordinating pickup.

### Out for delivery

> Your MPHORA gift is on the way.

### Eligibility lost before payment

> MPHORA is no longer available for this time. Scheduled delivery options are available.

### Delay after payment

> Your delivery window changed. We are reviewing the fastest available option.

---

## 34. Analytics

Track:

```text
mphora_page_viewed
mphora_zone_checked
mphora_eligible_product_viewed
mphora_product_added
mphora_quote_created
mphora_quote_expired
mphora_payment_approved
mphora_partner_accepted
mphora_partner_rejected
mphora_reassigned
mphora_ready_on_time
mphora_delivery_on_time
mphora_delivery_late
mphora_cancelled
mphora_fallback_to_scheduled
```

---

## 35. Metrics

Important metrics:

- Eligibility rate.
- Conversion.
- Partner acceptance time.
- Preparation time.
- Courier assignment time.
- On-time delivery.
- Reassignment rate.
- Cancellation rate.
- Delay rate.
- Contribution margin.
- Customer satisfaction.
- Partner satisfaction.
- Percentage requiring manual intervention.

---

## 36. MVP implementation

MVP MPHORA may use:

- Selected zones.
- Selected partners.
- Selected products.
- Manual capacity toggle.
- Simple cutoff.
- Manual courier assignment.
- Rule-based eligibility.
- Frequent revalidation.
- Admin emergency pause.

Do not start with citywide universal availability.

---

## 37. Recommended launch

### Pilot

- One or two zones in Saltillo.
- One or two reliable partners.
- Ten or fewer standardized products.
- Limited operating hours.
- Clear cutoff.
- Manual delivery fallback.
- Real timing measurement.

### Expansion

Expand only after:

- Stock accuracy.
- Partner response reliability.
- Delivery cost validation.
- On-time rate.
- Positive unit economics.
- Low incident rate.

---

## 38. Minimum tests

Test:

- Eligible product.
- Out-of-stock product.
- Cutoff passed.
- Partner closed.
- Capacity full.
- Unsupported zone.
- Delivery unavailable.
- Personalization makes timing invalid.
- Quote expires in cart.
- Partner rejects.
- Reassignment succeeds.
- Reassignment fails.
- Courier unavailable after preparation.
- Delivery late.
- Duplicate eligibility request.
- Emergency pause.

---

## 39. Definition of done

A MPHORA feature is done when:

- Eligibility is current.
- Eligibility has expiration.
- Stock is real.
- Partner capacity is checked.
- Delivery is checked.
- Customer sees timing and cutoff.
- Cart revalidates.
- Payment flow handles expiration.
- Partner offer is prioritized.
- Fallback exists.
- Metrics are tracked.
- Tests cover failure cases.
- Documentation is updated.

---

## 40. Summary

MPHORA is a controlled fast-delivery promise.

It succeeds only when product, partner, preparation, zone, and delivery are all operationally ready at the same time.

Speed must never replace truth.
