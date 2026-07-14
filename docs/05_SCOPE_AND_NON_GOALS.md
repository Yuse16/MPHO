# 05_SCOPE_AND_NON_GOALS.md

## 1. Purpose

This document defines the boundaries of MPHO.

It explains:

- What belongs to the product.
- What belongs to the MVP.
- What belongs to later phases.
- What MPHO intentionally will not build.
- Which assumptions require validation.
- How scope changes are approved.

The purpose is to prevent uncontrolled expansion and unfinished functionality.

---

## 2. Product scope

MPHO coordinates the complete gifting workflow:

```text
discovery
→ selection
→ availability
→ personalization
→ payment
→ partner assignment
→ product receipt or stock reservation
→ preparation
→ evidence
→ delivery
→ tracking
→ completion
→ partner earnings
```

The platform scope includes software and operational rules for:

- Customers.
- Recipients.
- Partners.
- MPHO operators.
- Couriers.
- External products.
- Payments.
- Messaging.
- Delivery.
- Partner earnings.
- Exceptions.

---

## 3. Geographic scope

### MVP

- Saltillo, Coahuila.
- Selected local zones.
- Limited partner network.

### Next expansion candidate

- Ramos Arizpe.

### Not part of MVP

- Nationwide availability.
- International delivery.
- Cross-border payments.
- Automatic activation of new cities.

A city should not be activated until there is sufficient:

- Partner coverage.
- Delivery coverage.
- Operational support.
- Pricing validation.
- Catalog quality.
- Exception capacity.

---

## 4. MVP customer scope

The MVP customer application should support:

- Account creation.
- Sign in.
- Browse catalog.
- Filter by occasion.
- Filter by budget.
- Filter by delivery timing.
- View product details.
- Distinguish local, MPHORA, and by-order products.
- Select personalization.
- Add recipient information.
- Add delivery address.
- Select delivery date or window.
- View pricing breakdown.
- Pay.
- View order status.
- Receive notifications.
- View order history.
- Request support.

### MVP customer limitations

The MVP does not require:

- Social login from every provider.
- Complex loyalty program.
- Gift subscriptions.
- Group payments.
- Shared carts.
- Recipient accounts.
- Public wish lists.
- International currencies.
- Multiple delivery destinations in one order.
- Advanced recommendation profiles.

---

## 5. MVP catalog scope

The MVP catalog should support:

- Curated local products.
- Curated external products.
- Services.
- Bundles.
- Basic variants.
- Basic add-ons.
- Personalization options.
- Availability state.
- Partner association.
- City and zone.
- Preparation time.
- Product images.
- Price.
- Last verified date.
- MPHORA eligibility fields.

### MVP catalog rules

- Every published item must have an operational source.
- External items must be labeled by order.
- Catalog entries must not imply official marketplace partnership.
- Availability must expire or be reconfirmed.
- Products must be manually or operationally reviewed before publication.

### Not required in MVP

- Automatic supplier catalog import.
- Marketplace-wide search.
- Unauthorized scraping.
- Millions of SKUs.
- Real-time synchronization with every local POS.
- Customer-created product listings.
- Open marketplace publishing without review.
- Multi-language catalog.

---

## 6. MVP partner scope

MPHO Aliados should support:

- Partner account.
- Partner profile.
- Authorized capabilities.
- Assigned zones.
- Operating schedule.
- New order offers.
- Accept or reject.
- Confirm stock.
- Confirm external package receipt.
- Report missing, damaged, or incorrect products.
- Start preparation.
- Upload evidence.
- Mark ready.
- Confirm courier handoff.
- View order history.
- View earnings.
- View payout records.
- Maintain approved catalog fields.
- Pause availability.

### Not required in MVP

- Full accounting suite.
- Payroll.
- Staff scheduling.
- Tax filing.
- Partner loans.
- Partner advertising marketplace.
- Advanced CRM.
- Full POS replacement.
- Native mobile applications.
- Complex warehouse management.
- Multi-branch enterprise administration.

---

## 7. MVP order scope

The MVP must support:

- One responsible partner per order.
- Controlled order states.
- State history.
- Payment-linked order creation.
- Partner assignment.
- Partner acceptance.
- Preparation tasks.
- External-package flow.
- Evidence.
- Delivery assignment record.
- Delivery tracking status.
- Cancellation flow.
- Refund status.
- Exception state.
- Completion.

### Not required in MVP

- Multi-partner order splitting.
- Multi-warehouse routing.
- Multi-stop delivery routes.
- Partial delivery.
- Subscription orders.
- Recurring automated purchases.
- Auctions.
- Customer negotiation.
- Dynamic partner bidding.
- Cross-border fulfillment.

---

## 8. MVP payment scope

The MVP should support:

- One approved payment provider.
- Payment intent or checkout.
- Payment confirmation.
- Verified webhook processing.
- Idempotent updates.
- Payment status.
- Refund status.
- Pricing breakdown.
- Internal financial records.
- Partner earning calculation.
- Payout record.

### Not required in MVP

- MPHO wallet.
- Stored-value account.
- Buy now, pay later.
- Credit products.
- Cryptocurrency.
- International settlement.
- Automated tax filing.
- Complex split payments if not operationally ready.
- Instant partner payouts.
- Cash-on-delivery by default.

A manual payout process may be acceptable for the first validated orders if it is auditable.

---

## 9. MVP delivery scope

The MVP should support:

- Delivery zone.
- Delivery quote or configured fee.
- Courier or delivery-provider record.
- Pickup status.
- Out-for-delivery status.
- Delivery evidence.
- Failed-delivery exception.
- Manual delivery assignment.
- Partner own-delivery option when approved.

### Not required in MVP

- Fully automatic courier marketplace.
- Live map for every provider.
- Route optimization.
- Multiple simultaneous pickups.
- Fleet management.
- Driver payroll.
- Driver background-check system.
- National shipping management.
- Guaranteed one-hour delivery.

Manual courier coordination is acceptable during validation.

---

## 10. MVP messaging scope

The MVP should support essential notifications:

### Customer

- Order created.
- Payment confirmed.
- Partner accepted.
- External product in transit.
- Product received.
- Preparation started.
- Gift ready.
- Courier assigned.
- Out for delivery.
- Delivered.
- Exception requiring action.
- Cancellation or refund update.

### Partner

- New order offer.
- Acceptance reminder.
- External package arrival reminder.
- Preparation deadline.
- Courier pickup.
- Incident update.
- Payout update.

### Not required in MVP

- Full omnichannel contact center.
- Voice calls.
- SMS in every flow.
- Marketing automation suite.
- Complex customer segmentation.
- AI-generated promotional campaigns.
- Unlimited free-form outbound WhatsApp messaging.

---

## 11. MVP HADIA scope

HADIA should initially:

- Ask for recipient.
- Ask for occasion.
- Ask for budget.
- Ask for zone.
- Ask for required date.
- Ask for preferences.
- Search real catalog data.
- Explain recommendations.
- Respect availability type.
- Offer alternatives.
- Transfer to human support when needed.

### HADIA non-goals for MVP

HADIA will not:

- Purchase external products autonomously.
- Change prices.
- Approve discounts.
- Approve refunds.
- Promise delivery.
- Invent custom products.
- Negotiate with partners.
- Contact external sellers independently.
- Make legal or financial decisions.
- Access unrestricted personal data.
- Act as a general-purpose chatbot.

A guided recommendation flow may be used before a more advanced conversational AI.

---

## 12. MVP MPHORA scope

MPHORA should support:

- Defined eligible zones.
- Eligible partners.
- Eligible products.
- Operating hours.
- Cutoff time.
- Preparation time.
- Delivery estimate.
- Capacity checks.
- Clear customer messaging.

### MPHORA non-goals for MVP

- Universal same-day availability.
- Guaranteed one-hour delivery.
- Automatic national fast delivery.
- External marketplace products.
- Products with unknown stock.
- Partners with unknown capacity.
- Delivery outside active zones.

---

## 13. MVP admin scope

The MPHO admin panel should support:

- Orders.
- Exceptions.
- Partners.
- Catalog review.
- Zones.
- Delivery records.
- Payment status.
- Refund status.
- Partner earnings.
- Payout records.
- Evidence review.
- Basic operational metrics.
- Configuration.
- Audit visibility.

### Not required in MVP

- Enterprise data warehouse.
- Advanced machine-learning forecasting.
- Full marketing platform.
- Franchise management.
- Complex business-intelligence suite.
- Custom report builder.
- Automated legal contract generation.

---

## 14. Operational scope

MPHO is responsible for coordinating the defined workflow.

MPHO must define rules for:

- Partner acceptance.
- Product condition.
- Evidence.
- Delivery handoff.
- Exceptions.
- Customer communication.
- Earnings calculation.
- Payout tracking.

MPHO is not automatically responsible for every external event.

Responsibilities must be defined for:

- External seller delay.
- Courier failure.
- Product damage.
- Incorrect address.
- Recipient absence.
- Partner error.
- Customer cancellation.

Detailed policies will be documented later.

---

## 15. Explicit non-goals

MPHO is not intended to become, during the initial stages:

- A generic ecommerce platform for every product category.
- A general delivery app.
- A complete POS system.
- A banking platform.
- A credit provider.
- A social network.
- A general AI assistant.
- A warehouse-first retailer.
- A national logistics company.
- A marketplace with unreviewed sellers.
- An automated drop-shipping system.
- A copy of Mercado Libre.
- A replacement for every partner's internal systems.

---

## 16. Product-category boundaries

Initial categories should prioritize products that are:

- Gift-appropriate.
- Safe to handle.
- Reasonably easy to inspect.
- Suitable for local delivery.
- Suitable for wrapping.
- Operationally understandable.

Potential initial categories:

- Flowers.
- Chocolates.
- Balloons.
- Mugs.
- Plush toys.
- Gift boxes.
- Personalized items.
- Small electronics.
- Beauty items.
- Accessories.
- Desserts where handling is defined.

Categories requiring special rules should remain excluded until documented.

Examples:

- Alcohol.
- Medication.
- Perishable food requiring strict cold chain.
- High-value jewelry.
- Hazardous materials.
- Restricted products.
- Live animals.
- Weapons.
- Products requiring age verification.
- Oversized items.
- Fragile products with inadequate handling.

---

## 17. Marketplace boundaries

MPHO may use curated external-product links or references.

MPHO must not:

- Present itself as officially affiliated with an external marketplace without confirmation.
- Copy protected content beyond allowed use.
- Scrape restricted systems.
- Treat external prices as guaranteed.
- Hide external delivery uncertainty.
- Purchase uncontrolled products autonomously.

The external-product strategy must remain curated and operationally controlled.

---

## 18. Automation boundaries

Automate:

- Notifications.
- Status propagation.
- Reminders.
- Basic assignment rules.
- Availability checks where reliable.
- Earnings calculations.
- Exception alerts.
- Customer tracking.
- Partner task lists.

Keep human approval for:

- Sensitive refunds.
- High-risk orders.
- External purchases during early stages.
- Product substitutions.
- Damage resolution.
- Partner disputes.
- Unusual pricing.
- Fraud concerns.
- Legal or policy exceptions.

---

## 19. Design scope boundaries

The MVP design must prioritize:

- Mobile use.
- Clear navigation.
- Strong status visibility.
- Accessible text.
- Fast partner actions.
- Trust.
- Simple checkout.
- Clear pricing.
- Error recovery.

The MVP does not require:

- Complex animations.
- 3D product visualization.
- Augmented reality.
- Virtual stores.
- Highly customized dashboards per partner.
- Multiple visual themes.
- Gamification.

---

## 20. Technical scope boundaries

The MVP should favor a modular monolith or similarly understandable architecture.

Avoid premature:

- Microservices.
- Kubernetes.
- Multi-region infrastructure.
- Event-streaming platforms.
- Custom payment infrastructure.
- Custom messaging infrastructure.
- Custom mapping engines.
- Advanced AI orchestration.
- Excessive abstraction.

The architecture should be scalable enough for validation without becoming unnecessarily complex.

---

## 21. Phase boundaries

### Phase 0: Research and agreements

- Customer interviews.
- Partner interviews.
- Real delivery quotes.
- Partner-capability mapping.
- Legal and payment review.
- Product-category selection.
- Operational test orders.

### Phase 1: Internal prototype

- Core data model.
- Basic catalog.
- Basic customer flow.
- Basic partner flow.
- Manual administration.
- Test orders.

### Phase 2: Controlled MVP

- Real payments.
- Selected partners.
- Real orders.
- Manual delivery coordination.
- WhatsApp notifications.
- Evidence.
- Earnings records.

### Phase 3: Operational automation

- Assignment rules.
- Improved availability.
- Better partner dashboards.
- Delivery integrations.
- HADIA grounding.
- MPHORA engine.

### Phase 4: Expansion

- Ramos Arizpe.
- Additional zones.
- Additional partner categories.
- Repeat occasions.
- Corporate gifting.

A later-phase feature must not block MVP launch unless it is critical to safety, legality, money, or order integrity.

---

## 22. MVP exit criteria

The MVP should not be considered validated until MPHO can demonstrate:

- Real customer order.
- Verified payment.
- Partner acceptance.
- Successful preparation.
- Evidence capture.
- Courier handoff.
- Successful delivery.
- Customer confirmation or proof.
- Accurate partner earning.
- Auditable payout record.
- Exception handling for at least one failed scenario.
- No duplicated financial effects.

The exact number of test orders will be defined later.

---

## 23. Scope-change process

Any significant scope change must include:

```text
Requested change:
Reason:
User affected:
Business value:
Operational impact:
Technical impact:
Security impact:
Payment impact:
Documentation affected:
MVP or future phase:
Decision:
```

Do not add major features directly from an isolated request without checking this document.

---

## 24. Prioritization rule

Prioritize in this order:

1. Legal, security, privacy, and payment safety.
2. Order integrity.
3. Partner execution.
4. Delivery reliability.
5. Customer clarity.
6. Exception handling.
7. Automation.
8. Growth.
9. Visual enhancements.

---

## 25. Scope summary

The MVP is a controlled local gifting workflow, not a complete national marketplace.

It must prove that MPHO can coordinate:

- A real customer.
- A real product.
- A real partner.
- Real preparation.
- Real delivery.
- Real payment.
- Real earnings.
- Real evidence.

Everything else should be added only after this core loop works reliably.
