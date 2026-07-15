# 06_BUSINESS_MODEL.md

## 1. Purpose

This document defines how MPHO creates, delivers, and captures value.

It explains:

- Who participates in the business model.
- What each participant contributes.
- What each participant receives.
- How MPHO earns revenue.
- How local products and external products are handled.
- Which operating assumptions must be validated.
- Which business models belong to the MVP and which belong to future phases.

This document does not define final rates. Exact values must be configured and approved in `09_PRICING_AND_COMMISSIONS.md`.

---

## 2. Business model summary

MPHO is a coordinated gifting marketplace.

MPHO does not need to own every product, warehouse every item, employ every courier, or manually prepare every gift.

MPHO creates value by connecting:

- Customer demand.
- Local product supply.
- Local preparation capacity.
- External-product sourcing.
- Gift personalization.
- Local delivery.
- Status tracking.
- Partner earnings.
- Operational exception management.

The platform business model is:

```text
Customer pays for a complete gifting service
→ MPHO coordinates the order
→ one partner fulfills the physical preparation
→ one courier or delivery provider completes last mile
→ MPHO records and distributes the economic value
```

---

## 3. Core value proposition

### 3.1 For customers

MPHO reduces the work required to send a meaningful gift.

The customer receives:

- Gift discovery.
- Local and by-order options.
- Personalization.
- Clear preparation flow.
- Delivery coordination.
- Order tracking.
- Support when something fails.
- One checkout for the complete experience.

### 3.2 For partners

Partners receive demand and monetization opportunities without building a complete digital platform.

A partner may earn through:

- Selling its own products.
- Receiving external packages.
- Inspecting products.
- Wrapping.
- Preparing.
- Personalizing.
- Temporary storage.
- Own delivery.
- Upselling approved add-ons.

### 3.3 For couriers

Couriers receive structured local delivery opportunities with:

- Clear pickup location.
- Clear destination.
- Defined time window.
- Order reference.
- Delivery evidence requirement.
- Payment record.

### 3.4 For MPHO

MPHO earns by coordinating the transaction and reducing operational friction.

Potential revenue sources include:

- Marketplace commission.
- Product margin.
- MPHO service fee.
- Preparation margin.
- Personalization margin.
- Fast-delivery surcharge.
- Delivery coordination margin.
- Corporate gifting services.
- Premium partner tools.
- Promotional placement.
- Future subscription or loyalty products.

Not every revenue source belongs to the MVP.

---

## 4. Business actors

### Customer

Pays the final amount.

### Recipient

Receives the gift.

### Selling partner

Provides a local product.

### Preparation partner

Performs wrapping, assembly, personalization, or inspection.

### Receiving partner

Receives an external package.

### Full-service Punto MPHO

Can sell, receive, prepare, and dispatch.

### Courier or delivery provider

Completes last-mile delivery.

### External provider

Provides an item not held locally.

### MPHO

Coordinates the transaction, software, communication, tracking, and exceptions.

### Payment provider

Processes payment and may support refund or payout workflows.

---

## 5. Order business models

## 5.1 Local-product order

A local partner supplies the product.

Flow:

```text
Customer selects local product
→ MPHO validates availability
→ customer pays
→ partner accepts
→ product is reserved
→ partner prepares
→ courier delivers
→ earnings are recorded
```

Potential value distribution:

- Partner receives agreed product amount.
- Partner receives approved preparation and personalization fees.
- Courier receives delivery amount.
- Payment provider receives processing fee.
- MPHO receives commission, margin, or service fee.

---

## 5.2 External-product order

A product is acquired from an external provider and shipped to a Punto MPHO.

Flow:

```text
Customer selects by-order product
→ MPHO shows expected timing and conditions
→ customer pays
→ one Punto MPHO is assigned
→ external purchase is coordinated
→ product ships to partner
→ partner receives and inspects
→ partner prepares
→ courier delivers
```

Potential value distribution:

- External provider receives product purchase amount.
- Partner receives reception, inspection, preparation, wrapping, and storage fees when applicable.
- Courier receives delivery amount.
- Payment provider receives processing fee.
- MPHO receives service fee, margin, and coordination revenue.

External products introduce extra risk:

- Price change.
- Shipping delay.
- Cancellation.
- Wrong item.
- Damage.
- Return.
- Missing package.

The final price must include enough operational protection without hiding the cost structure.

---

## 5.3 MPHORA order

MPHORA is a fast local order.

Flow:

```text
Customer requests fast delivery
→ MPHO validates product, partner, zone, time, and delivery
→ customer pays
→ partner accepts
→ partner prepares immediately
→ courier collects
→ order is delivered
```

Potential additional revenue:

- Fast-preparation fee.
- Fast-delivery fee.
- Priority coordination fee.

MPHORA must not use urgency pricing unless the extra cost is clear to the customer.

---

## 5.4 Partner-own-delivery order

A partner supplies and delivers the gift.

Flow:

```text
Customer buys
→ partner accepts
→ partner prepares
→ partner delivers
→ delivery evidence is recorded
```

The partner may receive both preparation and delivery earnings.

MPHO must still maintain:

- Delivery status.
- Delivery evidence.
- Failure handling.
- Financial traceability.

---

## 5.5 Bundle order

A bundle combines:

- Products.
- Wrapping.
- Card.
- Personalization.
- Delivery.
- Optional add-ons.

Bundles can improve:

- Conversion.
- Predictability.
- Preparation speed.
- Margin control.
- Customer clarity.

Bundles should be operationally standardized.

---

## 6. Revenue architecture

MPHO may combine multiple revenue methods.

## 6.1 Marketplace commission

A percentage or fixed amount retained from a partner-supplied product.

Use when:

- Partner controls the product.
- Partner has an agreed supply price.
- MPHO brings the customer and coordinates the order.

## 6.2 Product margin

Difference between product acquisition cost and customer selling price.

Use when:

- MPHO controls the retail price.
- MPHO assumes price risk.
- The arrangement is commercially approved.

## 6.3 MPHO service fee

A visible charge for coordinating:

- Discovery.
- Order handling.
- Partner assignment.
- Tracking.
- Customer support.
- Exception management.

The fee may be:

- Fixed.
- Percentage-based.
- Tiered.
- Dependent on order complexity.

## 6.4 Preparation margin

MPHO may charge the customer one preparation amount while paying the partner an agreed labor amount.

The difference is MPHO's preparation margin.

This must remain fair and commercially sustainable.

## 6.5 Personalization margin

Possible for:

- Cards.
- QR messages.
- Premium wrapping.
- Custom decorations.
- Engraving coordination.
- Add-ons.

## 6.6 Delivery coordination margin

MPHO may:

- Pass through the exact delivery cost.
- Add a transparent coordination fee.
- Use a configured retail delivery rate.
- Use zone-based pricing.

Delivery pricing must not create hidden losses.

## 6.7 Fast-delivery surcharge

May apply to MPHORA orders when:

- Partner prioritization is required.
- Preparation time is compressed.
- Courier cost is higher.
- Special operating effort is required.

## 6.8 Corporate revenue

Future MPHO Empresas revenue may include:

- Campaign setup.
- Bulk-order coordination.
- Custom packaging.
- Scheduled waves.
- Recipient-list management.
- Corporate reporting.

Not part of the initial MVP unless explicitly approved.

---

## 7. Partner earning architecture

Partner earnings may be created from separate line items.

Possible earning categories:

```text
product_sale
package_reception
package_inspection
temporary_storage
wrapping
gift_assembly
personalization
evidence_capture
courier_handoff
own_delivery
approved_add_on
bonus
adjustment
```

Each earning line must include:

- Order ID.
- Partner ID.
- Type.
- Description.
- Gross amount.
- Deductions.
- Net amount.
- Currency.
- Status.
- Created timestamp.
- Approved timestamp.
- Paid timestamp when applicable.
- Related payout ID.

Do not store only one unexplained partner total.

---

## 8. Customer price architecture

A customer-facing total may include:

```text
product subtotal
+ selected add-ons
+ preparation
+ personalization
+ delivery
+ MPHO service
+ payment-related amount if legally and commercially appropriate
+ applicable taxes
- approved discount
= final total
```

The checkout must communicate:

- What the gift costs.
- What preparation costs.
- What delivery costs.
- What MPHO service costs.
- Whether timing is estimated.
- Whether the product is local or external.

The interface may group minor line items for simplicity, but the internal ledger must remain detailed.

---

## 9. Cost architecture

MPHO must track the real cost of each order.

Possible costs:

- Product acquisition.
- Partner product payout.
- Partner labor.
- Packaging material.
- External shipping.
- Local delivery.
- Payment processing.
- Refund cost.
- Promotional discount.
- Customer support.
- Damage replacement.
- Chargeback.
- Platform usage.
- Tax obligations.

Order profitability should be calculated from actual recorded values, not only estimated values.

---

## 10. Unit economics

For each completed order, MPHO should be able to calculate:

```text
customer revenue
- product cost
- partner earnings
- courier cost
- payment fee
- discounts
- refunds
- incident cost
- applicable taxes or reserves
= contribution margin
```

Important measures:

- Average order value.
- Contribution margin per order.
- Margin percentage.
- Partner earnings per order.
- Delivery cost percentage.
- Incident cost percentage.
- Refund rate.
- Repeat purchase rate.
- Customer acquisition cost when available.
- Payback period when advertising begins.

No growth decision should rely only on gross sales.

---

## 11. Cash-flow considerations

MPHO may receive customer money before all costs are final.

The system must distinguish:

- Cash received.
- Revenue earned.
- Partner payable.
- Courier payable.
- Refund reserve.
- Processing fee.
- Pending settlement.
- Paid settlement.

Customer payment is not automatically MPHO profit.

---

## 12. Payout model

Potential MVP payout approach:

- MPHO collects customer payment.
- Partner earnings are calculated after required milestones.
- Earnings become payable after delivery or another approved event.
- MPHO pays partners on a defined schedule.
- Every payout includes a detailed statement.

Possible payout frequencies:

- Weekly.
- Twice monthly.
- After a minimum balance.
- Per order for selected partners.

No frequency is approved until operational and legal review.

---

## 13. Earnings release conditions

Partner earnings may move through:

```text
estimated
→ pending
→ approved
→ payable
→ paid
```

Earnings should not become payable when:

- Order is cancelled before partner work.
- Product was not received.
- Required evidence is missing.
- There is an unresolved damage incident.
- Delivery failed due to partner error.
- A refund or dispute is pending.

Partners may still be entitled to partial labor compensation depending on the event and agreement.

That logic must be explicit.

---

## 14. Refund economics

A refund may affect:

- MPHO revenue.
- Partner earnings.
- Courier payment.
- External purchase cost.
- Payment fees.
- Promotional credits.

Refund responsibility should be mapped to cause.

Possible causes:

- Customer cancellation.
- Partner rejection.
- Partner stock error.
- External provider failure.
- Courier failure.
- Incorrect address.
- Recipient unavailable.
- Product damage.
- Platform error.

The system must not subtract money from a partner without an auditable rule and incident record.

---

## 15. Discount model

Discounts may be funded by:

- MPHO.
- Partner.
- Shared funding.
- Promotional partner.
- Corporate contract.

Each discount must record:

- Funding source.
- Campaign.
- Maximum amount.
- Applicable items.
- Start and end date.
- Usage limit.
- Effect on partner earnings.

Partner earnings must not be reduced by an MPHO-funded discount unless agreed.

---

## 16. Partner-commercial models

Possible commercial arrangements:

### Model A: Commission

Partner sets or agrees to a customer price.

MPHO retains a commission.

### Model B: Wholesale

Partner gives MPHO a supply price.

MPHO defines customer price.

### Model C: Service-only

Partner receives a fixed fee for receiving, wrapping, or preparing an external item.

### Model D: Hybrid

Partner supplies some items and performs services.

### Model E: Own delivery

Partner also receives delivery earnings.

A partner may use more than one model depending on item and service.

---

## 17. Marketplace-liquidity strategy

MPHO should prioritize local density.

For each zone, MPHO needs enough:

- Product variety.
- Preparation capacity.
- Delivery options.
- Partner reliability.
- Operating-hour coverage.

A large number of inactive partners does not create useful supply.

Preferred launch strategy:

```text
one city
→ selected zones
→ few reliable partners
→ curated catalog
→ real orders
→ measured operations
→ controlled expansion
```

---

## 18. Customer acquisition channels

Potential channels:

- Social media.
- Click-to-WhatsApp ads.
- Local SEO.
- Partner-store promotion.
- Referral.
- Occasion reminders.
- Corporate sales.
- Influencer or local creator partnerships.
- QR codes at partner stores.
- Repeat-purchase campaigns.

The MVP should not depend on expensive paid acquisition before order economics are understood.

---

## 19. Partner acquisition channels

Potential methods:

- Direct local visits.
- WhatsApp outreach.
- Local business groups.
- Referrals.
- Florists and gift-store networks.
- Demonstration of MPHO Aliados.
- Pilot agreements.

The partner pitch should explain:

- What work is required.
- How much can be earned.
- When payment occurs.
- What evidence is required.
- What MPHO controls.
- What the partner controls.

---

## 20. Operational leverage

MPHO creates leverage by standardizing:

- Order instructions.
- Partner acceptance.
- Product receipt.
- Preparation checklist.
- Evidence.
- Courier handoff.
- Customer notifications.
- Earnings.
- Exceptions.

The system should reduce manual WhatsApp conversations, not merely reproduce them.

---

## 21. Business-model risks

### Thin margins

Cause:

- Underpriced delivery.
- High payment fees.
- Excessive partner cost.
- Incidents.
- Discounts.

Mitigation:

- Detailed order economics.
- Zone pricing.
- Minimum order.
- Curated categories.
- Real cost measurement.

### Partner dissatisfaction

Cause:

- Low earnings.
- Unclear deductions.
- Slow payouts.
- Too much work.
- Unfair incidents.

Mitigation:

- Transparent statements.
- Clear service fees.
- Defined payout schedule.
- Partner feedback.
- Fair dispute process.

### Customer price sensitivity

Cause:

- Too many visible charges.
- Expensive delivery.
- Weak product value.

Mitigation:

- Bundles.
- Clear value.
- Local sourcing.
- Nearby fulfillment.
- Better product curation.

### External-product risk

Cause:

- Price volatility.
- Delay.
- Damage.
- Return complexity.

Mitigation:

- Curated items.
- Safety margin.
- Lead time.
- Exception process.
- Purchase approval.

### Low repeat frequency

Cause:

- Gifting is occasional.

Mitigation:

- MPHO Recuerda.
- Seasonal campaigns.
- Corporate gifting.
- Recipient history.
- Reorder flows.

---

## 22. MVP business-model recommendation

The initial model should remain simple.

Recommended MVP structure:

- MPHO collects payment.
- One partner is responsible per order.
- Partner earnings are recorded as line items.
- Delivery is recorded separately.
- Partner payouts may be manual but auditable.
- Local products use commission, wholesale, or hybrid agreements.
- External products use service-only partner fees.
- Customer price includes clear service and delivery components.
- No complex automatic multi-party split is required initially.
- Every order must have a contribution-margin calculation.

---

## 23. Future business-model opportunities

Future options may include:

- Partner subscriptions.
- Premium analytics.
- Featured listings.
- Corporate contracts.
- Gift reminders.
- Loyalty.
- Membership with reduced service fees.
- Supplier integration fees.
- White-label gifting.
- API access.
- City licensing or franchise models.
- Managed catalog photography.
- Partner financing only after legal review.

These should not distract from the core order loop.

---

## 24. Decision rules

Before approving a business-model change, verify:

1. Customer value.
2. Partner fairness.
3. Margin impact.
4. Operational complexity.
5. Payment complexity.
6. Legal and tax impact.
7. Refund impact.
8. System changes.
9. Ability to explain the price.
10. Ability to audit the result.

---

## 25. Summary

MPHO earns by coordinating a complete gifting experience.

The platform should not confuse gross customer payment with profit.

Every order must clearly identify:

- Customer charges.
- Product cost.
- Partner earnings.
- Delivery cost.
- Payment cost.
- MPHO revenue.
- Refund or incident impact.
- Final contribution margin.

A sustainable MPHO order creates value for the customer, fair earnings for the partner, payment for the courier, and positive contribution for MPHO.
