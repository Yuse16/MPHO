# 01_PROJECT_OVERVIEW.md

## 1. Executive summary

MPHO is a local gifting and logistics platform that allows customers to discover, buy, personalize, prepare, and deliver gifts through a network of local businesses and preparation points.

The customer should not have to coordinate separately:

- Product.
- Seller.
- Availability.
- Wrapping.
- Personalization.
- Payment.
- Address.
- Courier.
- Tracking.
- Exceptions.

MPHO centralizes the experience and distributes physical work among partners near the recipient.

Three concepts define the product:

- **HADIA:** helps choose the gift.
- **MPHORA:** identifies eligible fast-delivery options.
- **MPHO Aliados:** lets partners process and monetize orders.

---

## 2. Product vision

The long-term vision is a network where anyone can send a gift easily even when:

- They do not know what to buy.
- They live in another city.
- The product comes from an external marketplace.
- The recipient is far from the original seller.
- Wrapping and personalization are required.
- Same-day delivery is needed.
- Several operational steps must be coordinated.

MPHO becomes the coordination layer between demand, local commerce, preparation, external products, and last-mile delivery.

---

## 3. Customer problem

Traditional gifting may require:

```text
search
→ ask by WhatsApp
→ confirm stock
→ pay
→ find wrapping
→ write a message
→ find a courier
→ explain the address
→ ask for status
→ confirm delivery
```

Common problems:

- Slow responses.
- Outdated catalogs.
- Unclear prices.
- No delivery.
- No tracking.
- Difficulty buying from another area.
- Low trust.
- Late delivery.
- Multiple disconnected providers.

MPHO converts this into one coordinated purchase.

---

## 4. Local-business problem

Many local gift businesses have:

- Inventory.
- Product knowledge.
- Wrapping experience.
- Personalization capability.
- Convenient location.
- Local customer understanding.

But may lack:

- Ecommerce.
- Digital advertising.
- Automation.
- Online payments.
- Order tracking.
- Delivery network.
- Centralized catalog.
- Ability to receive external packages.
- Tools to calculate additional earnings.

MPHO lets them participate without building the entire platform themselves.

---

## 5. Value proposition

### Customer

- One platform.
- Gift recommendations.
- Local products.
- External products by order.
- Personalization.
- Scheduled delivery.
- Online payment.
- Tracking.
- Fast options where available.

### Partner

- Additional sales.
- Monetize inventory.
- Earn from wrapping.
- Earn from preparation.
- Earn from receiving packages.
- Earn from personalization.
- Earn from own delivery.
- Structured orders.
- Earnings visibility.
- Less repetitive messaging.

### Courier

- Clear pickup and destination.
- Structured delivery request.
- Evidence capture.
- Local demand.

### MPHO

- Commission, margin, or service fee.
- Local network effects.
- Operational data.
- Zone and demand intelligence.
- Repeat purchases through special dates.

---

## 6. Actors

### Customer

The person who places and pays for the order.

### Recipient

The person receiving the gift.

The recipient may not have an MPHO account.

### Partner

A participating local business or preparation point.

Capabilities may include:

- Selling.
- Receiving.
- Inspecting.
- Wrapping.
- Personalizing.
- Preparing.
- Dispatching.
- Own delivery.

### Partner operator

Processes orders inside the partner location.

### Partner administrator

Manages products, staff, earnings, settings, and availability.

### Courier

Performs the physical delivery.

### MPHO operator

Handles exceptions.

### MPHO administrator

Controls platform-wide settings, partners, rules, payments, and operations.

### External provider

The seller or marketplace used to acquire a by-order item.

---

## 7. Partner types

### Selling partner

Sells its own products.

### Preparation partner

Receives components and prepares the gift.

### Receiving partner

Receives and temporarily stores external packages.

### Full-service partner

Sells, receives, prepares, personalizes, and dispatches.

### Own-delivery partner

Can deliver within approved zones.

A partner may have multiple capabilities.

---

## 8. Product types

### Local product

Belongs to a partner catalog.

Required data:

- Price.
- Availability.
- Preparation time.
- Zone.
- Variants.
- Personalization.
- Substitution rules.
- Last verification date.

### External product

Comes from an external provider.

Required data:

- Source.
- Link.
- Observed price.
- Validation date.
- Estimated arrival.
- Assigned receiving point.
- Purchase evidence.
- Tracking.
- Receipt confirmation.
- Condition confirmation.

### Service

Examples:

- Wrapping.
- Gift box.
- Greeting card.
- QR audio.
- Balloon.
- Personalization.
- Reception.
- Inspection.
- Temporary storage.
- Delivery.

### Bundle

A predefined combination of products and services.

---

## 9. Core operating flows

### Flow A: local product

```text
customer selects
→ MPHO validates zone and availability
→ customer personalizes
→ MPHO calculates total
→ customer pays
→ partner is assigned
→ partner accepts
→ stock is reserved
→ partner prepares
→ evidence is uploaded
→ delivery is assigned
→ courier picks up
→ recipient receives
→ order completes
```

### Flow B: external product

```text
customer selects by-order item
→ MPHO shows estimated timing
→ customer selects preparation and delivery
→ customer pays
→ Punto MPHO is assigned
→ external purchase is created or coordinated
→ provider ships to partner
→ partner confirms receipt
→ partner confirms condition
→ partner prepares
→ evidence is uploaded
→ delivery is assigned
→ recipient receives
→ order completes
```

### Flow C: MPHORA

```text
customer requests fast delivery
→ zone is validated
→ stock is validated
→ partner hours are validated
→ capacity is validated
→ courier availability is validated
→ eligible products are shown
→ customer pays
→ partner accepts
→ partner prepares
→ courier delivers
```

---

## 10. Partner assignment

Assignment may consider:

- Recipient distance.
- Zone.
- Partner capability.
- Product type.
- Stock.
- Hours.
- Preparation time.
- Active workload.
- Rating.
- Acceptance rate.
- Incident history.
- Delivery cost.

### MVP assignment

The MVP may use:

- Manual assisted assignment.
- Zone-based assignment.
- Priority order.
- Partner offer flow.

An advanced optimization algorithm is not required initially.

### Critical rule

One responsible partner per order in the MVP.

---

## 11. Catalog model

The catalog may combine multiple sources but must clearly represent operational differences.

Each product must identify:

- Local or external.
- Partner.
- City and zone.
- Availability.
- Preparation time.
- Estimated timing.
- Price.
- Variants.
- Personalization.
- Last update.
- MPHORA eligibility.
- Conditions.

Do not display fake stock.

---

## 12. HADIA overview

HADIA reduces gift-selection friction.

Possible questions:

- Who is the gift for?
- What is the occasion?
- What is the budget?
- When must it arrive?
- Where is the recipient?
- What does the recipient like?
- Should it feel romantic, elegant, useful, fun, or emotional?
- Is fast delivery required?

HADIA must only recommend real options.

HADIA does not directly approve:

- Payments.
- Refunds.
- Price changes.
- Delivery promises.
- Product substitutions.

---

## 13. MPHORA overview

MPHORA means operationally eligible fast delivery.

Eligibility requires:

- Real product availability.
- Eligible partner.
- Valid operating hours.
- Preparation capacity.
- Covered zone.
- Delivery capacity.
- Cutoff compliance.
- Safety margin.

MPHORA should prioritize certainty, distance, and reliability.

---

## 14. MPHO Aliados overview

The partner app should reduce long WhatsApp conversations.

Essential actions:

- View new orders.
- Accept.
- Reject.
- Confirm stock.
- Report missing stock.
- Confirm external package receipt.
- Report damage.
- Mark preparation.
- Upload evidence.
- Mark ready.
- Hand off to courier.
- View earnings.
- View payouts.
- View history.
- Maintain approved products.

WhatsApp may notify, but the platform database controls the official state.

---

## 15. WhatsApp role

WhatsApp supports:

- Notifications.
- Reminders.
- Order status.
- Abandoned checkout recovery.
- Exception alerts.
- Human assistance.

WhatsApp is not the only source of truth.

Messages should link to authenticated, auditable actions.

---

## 16. Delivery model

Delivery may be handled by:

- Independent courier.
- Mobility platform.
- Logistics company.
- Partner's own delivery.
- Manual coordination during MVP.

The system must track:

- Delivery cost.
- Courier identity or service.
- Request time.
- Pickup time.
- Status.
- Evidence.
- Incident notes.

---

## 17. Financial model

Customer total may include:

- Product.
- Preparation.
- Wrapping.
- Personalization.
- Delivery.
- MPHO service.
- Payment processing.
- Applicable taxes.

### Local product partner earnings

May include:

- Agreed product amount.
- Preparation.
- Personalization.
- Own delivery.

### External product partner earnings

May include:

- Reception.
- Inspection.
- Storage.
- Wrapping.
- Preparation.
- Personalization.

### MPHO earnings

May include:

- Commission.
- Margin.
- Service fee.
- Personalization margin.
- Premium services.

Exact rules will be defined later.

---

## 18. Geographic rollout

### Stage 1

Saltillo, Coahuila.

### Stage 2

Ramos Arizpe.

### Rollout strategy

- Recruit partners by zone.
- Publish real catalog.
- Measure delivery cost.
- Validate preparation time.
- Learn demand.
- Replicate only after operational proof.

Expansion should be based on demand density and partner capacity.

---

## 19. MVP validation goals

The MVP must prove:

1. A customer can place and pay for an order.
2. A partner can accept it.
3. The order can move through controlled states.
4. An external product can arrive at the partner.
5. The partner can prepare it.
6. Evidence can be recorded.
7. Delivery can be coordinated.
8. The customer can track status.
9. Partner earnings can be calculated.
10. Admin can resolve exceptions.

---

## 20. Suggested initial metrics

- Orders created.
- Payment conversion.
- Partner acceptance rate.
- Acceptance time.
- Preparation time.
- On-time delivery.
- Average delivery cost.
- Incidents.
- Damaged products.
- Cancellations.
- Repeat customers.
- Profit per order.
- Partner earnings.
- HADIA usage.
- MPHORA usage.
- Customer satisfaction.
- Partner satisfaction.

Do not set numerical targets without real data.

---

## 21. Main risks

### Outdated stock

Mitigation:

- Availability expiration.
- Partner confirmation.
- Sold-out action.
- Operational scoring.

### External delay

Mitigation:

- Time buffer.
- Tracking.
- No immediate-delivery promises.
- Alternatives.
- Exceptions workflow.

### Product damage

Mitigation:

- Receipt evidence.
- Defined protocol.
- Replacement or refund rules.
- Responsibility agreement.

### Partner non-response

Mitigation:

- Time limit.
- Reassignment.
- Alerts.
- Performance-based priority.

### Expensive delivery

Mitigation:

- Nearby partner.
- Zone rules.
- Multiple providers.
- Upfront delivery price.

### Low preparation quality

Mitigation:

- Guidelines.
- Evidence.
- Rating.
- Training.
- Random audits.

### Weak margins

Mitigation:

- Cost breakdown.
- Real-order testing.
- Zone-specific configuration.
- Avoid universal fixed rates.

### Fraud and chargebacks

Mitigation:

- Payment validation.
- Evidence.
- Logging.
- Policies.
- Manual review for unusual orders.

---

## 22. Current assumptions

These are hypotheses:

- Partners will accept external packages.
- Partners will value preparation fees.
- Customers will pay for convenience.
- Local delivery can be coordinated at reasonable cost.
- Local catalogs can stay sufficiently updated.
- WhatsApp will be the primary notification channel.
- A PWA is enough for the MVP.

Each assumption must be validated with real operations.

---

## 23. Open questions

- Final payment provider.
- Tax handling.
- Who legally purchases external items.
- Return handling.
- Partner payout timing.
- Required evidence.
- Maximum storage time.
- Responsibility for loss or damage.
- MPHORA zones.
- MPHORA operating hours.
- Delivery providers.
- Delivery pricing.
- Restricted product categories.
- Punto MPHO eligibility criteria.
- Sustainable commission levels.

These questions must be resolved in later packs.

---

## 24. Product principles

- Solve the complete gifting experience.
- Show truthful timing.
- Prefer nearby operational capacity.
- Never invent availability.
- Simplify partner operations.
- Automate notifications.
- Escalate by exception.
- Preserve traceability.
- Protect money and data.
- Validate before scaling.
- Build mobile-first.
- Clearly separate local, MPHORA, and by-order products.

---

## 25. One-sentence definition

MPHO is a platform that finds, obtains, prepares, and coordinates gift delivery through local partners near the recipient.

HADIA helps choose.

MPHORA identifies fast options.

MPHO Aliados enables partners to operate and earn.
