# 08_PARTNER_PROGRAM.md

## 1. Purpose

This document defines the MPHO partner program.

It explains:

- Which businesses may join.
- How onboarding works.
- Which partner types exist.
- Which capabilities may be approved.
- How partners receive and process orders.
- How partner performance is evaluated.
- How earnings and payouts are communicated.
- How suspension or removal works.

The customer-facing brand for approved physical locations is `Punto MPHO`.

The partner-facing application is `MPHO Aliados`.

---

## 2. Partner-program objective

The partner program creates a distributed network of local businesses that can:

- Supply products.
- Receive external packages.
- Inspect products.
- Wrap.
- Personalize.
- Assemble gifts.
- Store packages temporarily.
- Dispatch to couriers.
- Deliver locally.

The program should create new revenue for reliable local businesses while giving MPHO operational coverage.

---

## 3. Ideal partner profile

A strong partner may have:

- Physical location.
- Consistent operating hours.
- Reliable staff.
- Gift-related products.
- Wrapping capability.
- Smartphone or computer access.
- Stable internet.
- Secure package-receiving area.
- Ability to upload photos.
- Willingness to follow process.
- Clear payment information.
- Interest in extra revenue.

Possible partner categories:

- Gift shops.
- Florists.
- Balloon stores.
- Chocolate shops.
- Personalized-product businesses.
- Bakeries with approved handling.
- Packaging and wrapping businesses.
- Small retailers with preparation capacity.
- Local fulfillment points.

---

## 4. Partner types

### 4.1 Seller partner

Provides its own catalog.

Capabilities:

- Product listing.
- Stock confirmation.
- Product reservation.
- Preparation.
- Handoff.

### 4.2 Receiving partner

Receives external packages.

Capabilities:

- Package receipt.
- Basic inspection.
- Condition evidence.
- Temporary storage.
- Preparation handoff.

### 4.3 Preparation partner

Performs:

- Wrapping.
- Assembly.
- Card.
- Personalization.
- Evidence.

### 4.4 Full-service Punto MPHO

Can:

- Sell.
- Receive.
- Inspect.
- Prepare.
- Personalize.
- Dispatch.

### 4.5 Delivery-capable partner

Can complete approved local delivery.

A partner may have multiple approved types.

---

## 5. Capability model

Capabilities should be stored independently.

Possible capability codes:

```text
sell_local_products
confirm_stock
receive_external_packages
inspect_external_products
store_temporarily
wrap_basic
wrap_premium
assemble_bundle
personalize_text
personalize_qr
capture_evidence
handoff_to_courier
deliver_locally
handle_fragile
handle_food
handle_flowers
```

A partner must not receive orders requiring an unapproved capability.

---

## 6. Partner application process

The onboarding flow should be:

```text
application
→ identity and business information
→ location
→ operating hours
→ capability selection
→ product-category review
→ payment information
→ agreement acceptance
→ quality review
→ test order if required
→ approval
```

Required application data may include:

- Business name.
- Contact name.
- Phone.
- Email.
- Address.
- City.
- Zone.
- Business category.
- Operating hours.
- Staff count.
- Capabilities.
- Product examples.
- Photos.
- Payment account.
- Tax information when required.
- Agreement acceptance.

---

## 7. Partner status lifecycle

Possible partner states:

```text
draft
submitted
under_review
information_required
approved
active
paused_by_partner
paused_by_mpho
restricted
suspended
rejected
closed
```

Rules:

- Only active partners may receive new offers.
- Paused partners keep historical access.
- Suspended partners may lose operational access.
- Closed partners retain financial and audit history.

---

## 8. Approval criteria

Approval may consider:

- Identity.
- Location.
- Zone need.
- Product relevance.
- Preparation quality.
- Package security.
- Operating consistency.
- Response reliability.
- Handling capability.
- Technology access.
- Agreement compliance.

Approval is not automatic.

---

## 9. Test order

MPHO may require a test order before activation.

A test order may validate:

- Notification receipt.
- App access.
- Acceptance.
- Stock confirmation.
- Preparation.
- Photo evidence.
- Handoff.
- Status updates.
- Timing.

The test order should be marked as non-customer production data when applicable.

---

## 10. Partner agreement topics

The partner agreement should address:

- Authorized capabilities.
- Product pricing.
- Service pricing.
- Commission.
- Payment schedule.
- Evidence.
- Data privacy.
- Product responsibility.
- Package responsibility.
- Storage limits.
- Damage reporting.
- Cancellations.
- Refund responsibility.
- Delivery responsibility.
- Brand usage.
- Photo authorization.
- Suspension.
- Dispute process.

This document is operational guidance, not a legal contract.

---

## 11. Partner profile

Each partner profile should include:

- Public business name.
- Internal legal or registered name when required.
- Address.
- City.
- Zone.
- Coordinates when approved.
- Contact information.
- Operating hours.
- Capabilities.
- Active categories.
- Preparation times.
- Delivery zones if applicable.
- Payment method.
- Status.
- Performance data.
- Agreement version.

---

## 12. Partner users

### Partner administrator

May:

- Manage staff.
- Manage profile.
- View catalog.
- View earnings.
- View payouts.
- Manage availability.
- Review incidents.

### Partner operator

May:

- View assigned orders.
- Accept when authorized.
- Confirm stock.
- Confirm receipt.
- Prepare.
- Upload evidence.
- Mark ready.
- Confirm handoff.

Operators should not see sensitive financial configuration unless authorized.

---

## 13. New-order workflow

A new offer should show:

- Order number.
- Product or service.
- Required work.
- Deadline.
- Delivery timing.
- Customer notes relevant to preparation.
- Earnings.
- Accept-by time.
- Risks or special handling.

Partner actions:

- Accept.
- Reject.
- Report stock problem.
- Report timing problem.
- Ask MPHO for review.

---

## 14. Acceptance standards

A partner should accept only when:

- Required product is available or expected.
- Required materials are available.
- Staff capacity exists.
- Deadline is feasible.
- Required capability is approved.
- Package reception is possible.
- Delivery handoff is possible.

False acceptance may reduce partner reliability.

---

## 15. Rejection reasons

Structured rejection reasons:

```text
out_of_stock
insufficient_time
store_closed
capacity_full
unsupported_personalization
cannot_receive_package
delivery_zone_problem
pricing_issue
technical_problem
other
```

Rejection should not automatically punish a partner when the reason is legitimate.

---

## 16. Availability management

Partners should manage:

- Open or closed status.
- Temporary pause.
- Order capacity.
- Product availability.
- Service availability.
- Holiday hours.
- Receiving availability.
- Delivery availability.

Availability must expire or be reconfirmed.

---

## 17. Catalog responsibilities

Partners may provide:

- Product names.
- Product photos.
- Descriptions.
- Supply prices.
- Customer prices when agreed.
- Stock.
- Variants.
- Preparation time.
- Substitutions.
- Add-ons.

MPHO may:

- Standardize naming.
- Improve presentation.
- Review photos.
- Approve publication.
- Add platform metadata.
- Pause inaccurate listings.

---

## 18. External-package workflow

When assigned an external-product order, the partner must:

1. Confirm ability to receive.
2. Verify expected package information.
3. Receive physically.
4. Record timestamp.
5. Photograph package if required.
6. Inspect authorized elements.
7. Report damage or mismatch.
8. Store securely.
9. Prepare only after approval.
10. Update status.

The partner should not be responsible for external shipping delay before physical receipt unless the partner caused the issue.

---

## 19. Storage rules

Temporary storage requires:

- Defined maximum duration.
- Secure area.
- Order identification.
- No unauthorized use.
- Damage protection.
- Escalation for abandoned packages.

Storage beyond the included period may create an approved storage fee.

No storage fee may be charged without prior rule or customer approval.

---

## 20. Preparation standards

Partners must follow approved standards for:

- Clean work area.
- Correct product.
- Correct quantity.
- Correct message.
- Correct wrapping.
- Correct personalization.
- Visible quality.
- Secure packaging.
- Delivery suitability.

Preparation standards may vary by category.

---

## 21. Evidence standards

Potential evidence:

- External package received.
- Package damage.
- Product condition.
- Completed gift.
- Recipient card.
- QR included.
- Courier handoff.
- Delivery when partner delivers.

Evidence should be:

- Clear.
- Timely.
- Linked to order.
- Privacy-respecting.
- Not reused across orders.

---

## 22. Courier handoff

Before handoff, partner should confirm:

- Correct order.
- Secure packaging.
- Courier identity or service.
- Handoff timestamp.
- Order reference.
- Delivery instructions.

The partner should not hand the order to an unidentified courier when identity validation is required.

---

## 23. Partner earnings

The partner app should show:

- Estimated earnings.
- Pending earnings.
- Approved earnings.
- Payable balance.
- Paid earnings.
- Adjustments.
- Payout history.

Each earning line should identify:

- Order.
- Service.
- Amount.
- Status.
- Expected payout date when available.

---

## 24. Payout communication

A payout statement should include:

- Period.
- Orders.
- Product earnings.
- Service earnings.
- Bonuses.
- Deductions.
- Adjustments.
- Net payout.
- Payment reference.
- Payment date.

MPHO must not show only a total without explanation.

---

## 25. Partner performance

Potential measures:

- Offer response time.
- Acceptance rate.
- Stock accuracy.
- Preparation time.
- On-time readiness.
- Evidence quality.
- Incident rate.
- Customer rating.
- Courier handoff accuracy.
- Cancellation rate.

No final partner-score formula is approved yet.

---

## 26. Fair-performance principles

Performance evaluation must consider:

- Partner-caused events.
- Customer-caused events.
- External-provider events.
- Courier-caused events.
- Platform-caused events.

A partner should not be penalized for a delay clearly caused by an external seller.

---

## 27. Partner incentives

Possible future incentives:

- Higher order priority.
- Bonus for high reliability.
- Reduced commission.
- Featured placement.
- Access to MPHORA.
- Early access to new zones.
- Training support.
- Catalog photography support.

Incentives must be documented and measurable.

---

## 28. Training

Partner training may include:

- Using MPHO Aliados.
- Accepting orders.
- Stock updates.
- Package receipt.
- Damage reporting.
- Wrapping standards.
- Evidence.
- Handoff.
- Privacy.
- Incident management.
- Earnings and payouts.

Training completion may be required before activation.

---

## 29. Support

Partners should have support for:

- App access.
- Order questions.
- Missing data.
- Payment questions.
- Incidents.
- External-package issues.
- Courier issues.
- Catalog problems.

Support channels may include:

- MPHO Aliados.
- WhatsApp.
- Email.
- Phone for urgent operational incidents.

---

## 30. Partner disputes

Dispute categories:

- Earnings.
- Payout.
- Incident responsibility.
- Product damage.
- Customer complaint.
- Courier complaint.
- Catalog issue.
- Suspension.
- Unauthorized deduction.

Disputes must be linked to evidence and preserved.

---

## 31. Pausing and suspension

### Partner pause

A partner may pause new offers because of:

- Vacation.
- Capacity.
- Staff shortage.
- Store closure.
- Technical issue.
- Inventory update.

### MPHO pause

MPHO may pause a partner for:

- Repeated no-response.
- Stock inaccuracies.
- Quality concerns.
- Missing documents.
- Payment-account issue.
- Safety concern.

### Suspension

May occur for:

- Fraud.
- Data misuse.
- False evidence.
- Unauthorized substitutions.
- Customer circumvention.
- Serious safety breach.
- Repeated major incidents.

---

## 32. Offboarding

When a partner leaves:

- Stop new offers.
- Complete or reassign active orders.
- Resolve incidents.
- Finalize earnings.
- Complete payout.
- Revoke access.
- Retain required records.
- Remove public listings.
- Preserve audit history.

---

## 33. Partner launch strategy

Recommended launch:

### Stage 1

- One full-service partner in Saltillo.
- Small curated catalog.
- Test external-package workflow.
- Manual payout.
- Manual courier coordination.

### Stage 2

- Partners in different Saltillo zones.
- Standardized preparation.
- Zone-based assignment.
- Basic performance tracking.

### Stage 3

- Ramos Arizpe.
- Self-service application with review.
- More automated assignment.
- More delivery options.
- MPHORA expansion.

---

## 34. Partner value proposition

The partner message should be:

> MPHO helps your business receive additional sales and paid preparation work through structured orders, clear instructions, local delivery coordination, and visible earnings.

Avoid promising:

- Guaranteed order volume.
- Guaranteed income.
- Exclusive territory.
- Automatic approval.
- Immediate payout.

---

## 35. Partner-program success

The program succeeds when:

- Partners understand the work.
- Earnings are clear.
- Orders are accepted reliably.
- Stock is accurate.
- Preparation quality is consistent.
- External packages are handled safely.
- Payouts are traceable.
- Customers receive gifts successfully.
- Strong partners remain active.

---

## 36. Summary

MPHO Aliados is not merely a seller dashboard.

It is the operating system for a distributed gift-preparation network.

A successful Punto MPHO can earn from products, location, receiving capability, preparation skill, personalization, and delivery capacity while MPHO supplies demand, structure, tracking, and payment records.
