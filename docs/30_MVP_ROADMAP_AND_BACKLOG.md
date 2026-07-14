# 30_MVP_ROADMAP_AND_BACKLOG.md

## 1. Purpose

This document defines the MVP roadmap and prioritized backlog for MPHO.

It explains:

- Development phases.
- Business-validation phases.
- Technical milestones.
- Operational milestones.
- Dependencies.
- Launch criteria.
- Backlog priorities.
- Features intentionally deferred.

This document should guide OpenCode and human contributors in implementation order.

Do not start a later phase while critical foundations from earlier phases remain incomplete.

---

## 2. MVP objective

The MPHO MVP must prove one complete real flow:

```text
Customer selects gift
→ price and timing are validated
→ customer pays
→ one partner accepts
→ product is reserved or received
→ partner prepares
→ evidence is uploaded
→ courier collects
→ gift is delivered
→ partner earning is recorded
→ payout is documented
→ order closes
```

The MVP must also prove that one failed order can be handled safely.

---

## 3. MVP launch area

Initial target:

- Saltillo, Coahuila.
- Selected zones only.
- One to three reliable partners.
- Small curated catalog.
- Manual or assisted delivery.
- MXN only.
- One payment provider.
- WhatsApp notifications.
- PWA for partners.

Ramos Arizpe belongs to the next controlled expansion after Saltillo validation.

---

## 4. Product constraints

The MVP will use:

- One responsible partner per order.
- One delivery destination.
- One pickup point.
- One currency.
- One payment provider.
- Curated external products.
- Manual external purchase approval.
- Manual or semi-manual payouts.
- Rule-based MPHORA.
- Guided HADIA.
- Admin exception handling.

---

## 5. Roadmap overview

```text
Phase 0 — Validation and preparation
Phase 1 — Repository and foundation
Phase 2 — Identity, partners, and geography
Phase 3 — Catalog, inventory, and pricing
Phase 4 — Customer discovery and checkout
Phase 5 — Orders and partner fulfillment
Phase 6 — Payments, refunds, and finance
Phase 7 — Delivery and notifications
Phase 8 — HADIA and MPHORA
Phase 9 — Admin and QA
Phase 10 — Controlled pilot
Phase 11 — MVP launch
Phase 12 — Post-launch stabilization
```

---

## 6. Phase 0 — Validation and preparation

### Objective

Validate that the operation is commercially and physically possible before building too much software.

### Tasks

- Interview potential customers.
- Interview gift shops.
- Identify one full-service Punto MPHO candidate.
- Validate package reception willingness.
- Validate preparation fees.
- Validate wrapping times.
- Validate delivery prices.
- Test one local gift manually.
- Test one external product manually.
- Define allowed product categories.
- Define prohibited categories.
- Review payment and tax model.
- Draft partner agreement.
- Confirm brand name review process.
- Define customer-support channel.

### Exit criteria

- At least one viable partner.
- Real delivery price examples.
- Real preparation workflow.
- Real margin estimate.
- External package flow understood.
- Critical legal and tax questions identified.
- Pilot scope approved.

---

## 7. Phase 1 — Repository and foundation

### Objective

Create a safe project base.

### Backlog

#### P0

- Create GitHub repository.
- Add `AGENTS.md`.
- Add `README.md`.
- Add `docs/`.
- Add Next.js.
- Enable strict TypeScript.
- Add Tailwind CSS.
- Add ESLint.
- Add formatter.
- Add environment validation.
- Add `.env.example`.
- Add test framework.
- Add CI.
- Add preview deployment.
- Configure Supabase project.
- Configure migrations.
- Configure safe seed data.
- Add structured logging.
- Add error boundary.
- Add request ID.

#### P1

- Add component library foundation.
- Add design tokens.
- Add feature flags.
- Add health endpoint.
- Add basic error tracking.

### Exit criteria

- Build passes.
- Lint passes.
- Typecheck passes.
- Test command passes.
- Preview deploy works.
- Database migration works.
- No secrets committed.

---

## 8. Phase 2 — Identity, partners, and geography

### Objective

Create roles, city, zones, and partner foundation.

### Backlog

#### P0

- Customer profile.
- Partner profile.
- Partner operator role.
- Partner admin role.
- MPHO operator role.
- MPHO admin role.
- Authentication.
- Authorization middleware.
- RLS policies.
- Saltillo city.
- Initial zones.
- Address model.
- Partner application.
- Partner status.
- Partner capabilities.
- Partner schedule.
- Partner pause.
- Audit log.

#### P1

- Partner training status.
- Partner test order.
- Partner staff invitation.
- Admin partner review.
- Partner capability approval.
- Holiday schedule.

### Exit criteria

- Customer can sign in.
- Partner can sign in.
- Partner cannot view another partner.
- Customer cannot view another customer.
- Admin can approve partner.
- Saltillo zones exist.
- Audit records exist.

---

## 9. Phase 3 — Catalog, inventory, and pricing

### Objective

Create a reliable small catalog.

### Backlog

#### P0

- Product definition.
- Listing.
- Variant.
- Option.
- Add-on.
- Category.
- Occasion tags.
- Recipient tags.
- Product images.
- Publication workflow.
- Local source.
- External curated source.
- Stock mode.
- Inventory quantity.
- Stock reservation.
- Inventory adjustment.
- Price rule.
- Quote service.
- Order item snapshot.
- One-partner cart validation.

#### P1

- Bundle.
- Personalization definition.
- Stale-stock logic.
- External-price expiration.
- Low-stock alert.
- Catalog review queue.
- Partner catalog submission.

### Seed target

- 15 to 30 local products.
- 5 prepared bundles.
- 3 curated external products.
- 5 to 10 add-ons.
- 3 wrapping options.

### Exit criteria

- Published product appears.
- Unpublished product does not appear.
- Stock reservation is atomic.
- External product is labeled by order.
- Price is server-calculated.
- Historical snapshot is preserved.

---

## 10. Phase 4 — Customer discovery and checkout

### Objective

Let a customer discover, configure, and pay for a gift.

### Backlog

#### P0

- Home.
- Coverage checker.
- Explore.
- Search.
- Category pages.
- Product detail.
- Cart.
- Recipient form.
- Address form.
- Surprise mode.
- Delivery date.
- Personalization.
- Quote.
- Checkout.
- Customer order success.
- Orders list.
- Order detail.
- Customer-safe timeline.

#### P1

- Saved addresses.
- Saved recipients.
- Reorder.
- Ratings.
- Favorites.
- Better search.

### Exit criteria

- Customer can create valid quote.
- Customer can complete checkout flow in sandbox.
- Cart blocks multi-partner conflict.
- Quote expiration works.
- Mobile flow works.
- Errors are recoverable.

---

## 11. Phase 5 — Orders and partner fulfillment

### Objective

Let the partner execute the physical work.

### Backlog

#### P0

- Order state machine.
- State history.
- Partner assignment.
- Partner offer.
- Offer expiration.
- Accept.
- Reject.
- Stock confirmation.
- External package expected.
- Package receipt.
- Damage report.
- Preparation checklist.
- Evidence upload.
- Mark ready.
- Courier handoff.
- Partner order history.
- Exception creation.

#### P1

- Partner capacity.
- Evidence review.
- Reassignment ranking.
- Offline evidence queue.
- Partner performance metrics.

### Exit criteria

- Partner receives offer.
- Partner can accept.
- Partner can report issue.
- Partner can upload evidence.
- Invalid state transition is blocked.
- Duplicate acceptance is blocked.
- Partner workflow works on phone.

---

## 12. Phase 6 — Payments, refunds, and finance

### Objective

Make money flows safe and auditable.

### Backlog

#### P0

- Payment adapter.
- Sandbox checkout.
- Verified webhook.
- Payment attempt.
- Payment status.
- Duplicate webhook protection.
- Pricing snapshot.
- Ledger entries.
- Partner earning lines.
- Refund request.
- Refund provider flow.
- Partner payable state.
- Payout batch.
- Manual payout evidence.
- Payout statement.
- Reconciliation queue.

#### P1

- Partial refund.
- Chargeback record.
- Adjustment workflow.
- Approval threshold.
- Negative-margin alert.
- Payout account verification.

### Exit criteria

- Payment approval is provider-verified.
- Duplicate webhook creates no duplicate effects.
- Refund is traceable.
- Partner earnings are itemized.
- Payout is auditable.
- Order economics can be reconstructed.

---

## 13. Phase 7 — Delivery and notifications

### Objective

Coordinate pickup and delivery with clear communication.

### Backlog

#### P0

- Delivery zone.
- Delivery quote.
- Manual courier assignment.
- Delivery record.
- Pickup confirmation.
- Out for delivery.
- Proof of delivery.
- Failed-delivery incident.
- Return to partner.
- Customer notifications.
- Partner notifications.
- WhatsApp template integration.
- Secure deep links.
- Notification retry.
- Notification audit.

#### P1

- Delivery provider adapter.
- Automatic quote.
- Provider webhook.
- Partner own delivery.
- Email fallback.
- Push notification.

### Exit criteria

- Ready order can receive courier.
- Pickup is recorded.
- Delivery proof is stored.
- Failed delivery has a process.
- Customer receives correct messages.
- Duplicate message is prevented.

---

## 14. Phase 8 — HADIA and MPHORA

### Objective

Add intelligent discovery and controlled fast delivery.

### HADIA P0

- Guided question flow.
- Structured constraints.
- Catalog query.
- Budget filter.
- Date filter.
- Zone filter.
- Recommendation reason.
- No-result behavior.
- Human handoff.
- Deterministic fallback.

### HADIA P1

- Conversational AI.
- Preference memory with consent.
- Feedback-based ranking.
- WhatsApp HADIA.

### MPHORA P0

- Eligible zones.
- Eligible products.
- Partner capacity.
- Cutoff.
- Eligibility expiration.
- Revalidation.
- MPHORA collection.
- Partner priority offer.
- Emergency pause.

### MPHORA P1

- Automatic courier availability.
- Dynamic timing.
- Dynamic capacity.
- Multiple fallback providers.

### Exit criteria

- HADIA never recommends unpublished item.
- HADIA respects budget and zone.
- MPHORA expires.
- Ineligible product cannot check out as MPHORA.
- Fallback to scheduled delivery works.

---

## 15. Phase 9 — Admin and QA

### Objective

Give MPHO operational control and validate the complete system.

### Backlog

#### P0

- Operations dashboard.
- Exception queue.
- Order detail.
- Partner review.
- Catalog review.
- Delivery queue.
- Payment queue.
- Refund queue.
- Earnings.
- Payouts.
- Pricing rules.
- Zone management.
- Audit log.
- Feature flags.
- Security review.
- Full test suite.
- Accessibility review.
- Performance baseline.
- Backup verification.

#### P1

- Advanced reports.
- Reconciliation automation.
- Partner scoring.
- Custom alerts.
- Export controls.

### Exit criteria

- Admin can resolve a blocked order.
- No direct silent financial edits.
- Critical tests pass.
- Backup exists.
- Audit works.
- Mobile works.
- Security baseline complete.

---

## 16. Phase 10 — Controlled pilot

### Objective

Operate real orders with a small group.

### Pilot scope

- One to three partners.
- Selected Saltillo zones.
- 20 to 40 products.
- Limited hours.
- Manual courier fallback.
- Real payment.
- Real payout.
- Real support.

### Required pilot scenarios

- Successful local order.
- Successful external order.
- Successful scheduled delivery.
- One MPHORA order.
- One partner rejection.
- One product issue.
- One failed delivery.
- One cancellation.
- One refund.
- One payout.

### Pilot monitoring

- Order completion.
- Partner response.
- Preparation time.
- Delivery cost.
- Customer feedback.
- Partner feedback.
- Incident reason.
- Contribution margin.
- Manual intervention.

### Exit criteria

- Full flow works.
- Financial reconciliation works.
- Partners understand app.
- Customer communication works.
- Failure can be resolved.
- No critical security defect.
- Positive or understandable unit economics.

---

## 17. Phase 11 — MVP launch

### Objective

Open MPHO to a limited public audience.

### Launch requirements

- Approved partner agreements.
- Published policies.
- Customer support coverage.
- Payment production credentials.
- WhatsApp production templates.
- Delivery process.
- Refund process.
- Payout process.
- Monitoring.
- Backup.
- Incident response.
- On-call owner.
- Catalog accuracy.
- Launch zones.
- Emergency pause.

### Launch restrictions

- Limit zones.
- Limit hours.
- Limit order value.
- Limit MPHORA.
- Limit external products.
- Limit daily capacity.
- Keep manual review for high-risk orders.

---

## 18. Phase 12 — Post-launch stabilization

### Objective

Fix real operational problems before expansion.

### Priorities

- Reduce exceptions.
- Improve stock accuracy.
- Improve partner response.
- Improve delivery reliability.
- Improve margin.
- Improve customer conversion.
- Improve payout speed.
- Improve HADIA relevance.
- Improve MPHORA eligibility.
- Remove repeated manual work.

Do not expand to many cities before stabilization.

---

## 19. Backlog priority definitions

### P0

Required for safe MVP operation.

### P1

Important after core flow works.

### P2

Useful growth or optimization.

### P3

Future or experimental.

---

## 20. P0 master backlog

### Foundation

- Repository.
- Docs.
- CI.
- Auth.
- RLS.
- Audit.
- Environments.
- Monitoring.

### Business core

- Partners.
- Zones.
- Catalog.
- Inventory.
- Pricing.
- Quote.
- Orders.
- State machine.
- Payment.
- Earnings.
- Delivery.
- Notifications.
- Admin exceptions.

### Customer

- Home.
- Product.
- Cart.
- Checkout.
- Tracking.
- Support.

### Partner

- Offer.
- Accept.
- Stock.
- Receipt.
- Preparation.
- Evidence.
- Ready.
- Handoff.
- Earnings.

### Security

- Secrets.
- Validation.
- Permissions.
- Webhook verification.
- Private storage.
- Rate limit.
- Backup.

---

## 21. P1 backlog

- HADIA conversation.
- MPHORA automation.
- Partner capacity.
- Delivery integration.
- Email fallback.
- Partial refunds.
- Chargebacks.
- Partner metrics.
- Ratings.
- Reorder.
- Saved addresses.
- Better catalog review.
- Offline partner support.
- Reconciliation automation.

---

## 22. P2 backlog

- MPHO Recuerda.
- MPHO Empresas.
- Multiple cities.
- Supplier APIs.
- POS integration.
- Live delivery map.
- Loyalty.
- Referrals.
- Featured listings.
- Partner tiers.
- Advanced analytics.
- Corporate campaigns.
- Advanced personalization preview.

---

## 23. P3 backlog

- Multi-partner order split.
- Multi-stop route.
- Warehouse management.
- International delivery.
- Multi-currency.
- Subscription gifts.
- Group gifting.
- Gift registry.
- Franchise model.
- White label.
- Native apps.
- Advanced autonomous purchasing.

---

## 24. Explicitly deferred

Do not build for MVP:

- National operation.
- Open marketplace.
- Automatic marketplace scraping.
- Multi-partner cart.
- Crypto.
- Wallet.
- Credit.
- Real-time national delivery.
- Complex route optimization.
- AI refund approval.
- AI autonomous external purchase.
- Full POS.
- Full CRM.
- Native iOS and Android separately.

---

## 25. Dependency map

```text
Auth and roles
→ partners and zones
→ catalog and inventory
→ pricing and quote
→ checkout and payment
→ order state machine
→ partner fulfillment
→ delivery
→ earnings and payout
→ admin exceptions
→ HADIA and MPHORA
→ pilot
```

Do not invert these dependencies.

---

## 26. Sprint recommendation

Suggested two-week sprint groups:

### Sprint 1

- Repository.
- Auth.
- Profiles.
- Roles.
- CI.

### Sprint 2

- Partners.
- Zones.
- Addresses.
- RLS.

### Sprint 3

- Catalog.
- Products.
- Images.
- Publication.

### Sprint 4

- Inventory.
- Pricing.
- Quotes.

### Sprint 5

- Customer browse.
- Product.
- Cart.

### Sprint 6

- Checkout.
- Payment sandbox.
- Order creation.

### Sprint 7

- State machine.
- Partner offers.
- Acceptance.

### Sprint 8

- Preparation.
- Evidence.
- Ready.

### Sprint 9

- Delivery.
- Tracking.
- Notifications.

### Sprint 10

- Earnings.
- Refunds.
- Payouts.

### Sprint 11

- Admin.
- Exceptions.
- Audit.

### Sprint 12

- HADIA.
- MPHORA.
- Pilot QA.

Actual sprint length may change.

---

## 27. OpenCode execution rules

OpenCode should:

1. Read `AGENTS.md`.
2. Read all related documents.
3. Implement only current phase.
4. Create a short implementation plan.
5. Identify affected tables and states.
6. Modify the smallest coherent area.
7. Add tests.
8. Run lint.
9. Run typecheck.
10. Run build.
11. Report risks.
12. Update documentation.

OpenCode must not:

- Skip phases without reason.
- Invent missing business rules.
- Change brand names.
- Add uncontrolled scope.
- Disable tests.
- Bypass RLS.
- Hardcode real secrets.
- Use fake production data.
- Mark integration complete without test.

---

## 28. Story template

Use:

```text
Title:
User:
Need:
Business value:
Preconditions:
Main flow:
Alternative flow:
Errors:
Permissions:
Data:
State transitions:
Financial impact:
Notifications:
Acceptance criteria:
Tests:
Documentation:
```

---

## 29. Acceptance criteria template

Example:

```text
Given a paid order in partner_offered
When the assigned partner accepts before the deadline
Then the order becomes partner_accepted
And the partner becomes responsible
And the state history is recorded
And the customer is notified
And repeating the action creates no duplicate effect
And another partner cannot accept
```

---

## 30. Release checklist

Before MVP release:

### Business

- Partner agreement.
- Pricing.
- Refund policy.
- Product categories.
- Support.
- Delivery.

### Product

- Customer flow.
- Partner flow.
- Admin flow.
- HADIA minimum.
- MPHORA minimum.

### Technical

- Production build.
- Migrations.
- Backup.
- Monitoring.
- Logs.
- CI.
- Secrets.
- Webhooks.

### Security

- RLS.
- Admin protection.
- Private media.
- Rate limit.
- Audit.
- Incident response.

### Financial

- Payment.
- Refund.
- Earnings.
- Payout.
- Reconciliation.

### QA

- E2E.
- Mobile.
- Accessibility.
- Provider failure.
- Pilot.

---

## 31. MVP success indicators

Initial indicators:

- Completed orders.
- On-time deliveries.
- Partner acceptance.
- Preparation time.
- Delivery cost.
- Exception rate.
- Customer satisfaction.
- Partner satisfaction.
- Refund rate.
- Contribution margin.
- Manual intervention.
- Repeat purchase.
- HADIA-assisted conversion.
- MPHORA success.

Do not set unrealistic public targets before real data.

---

## 32. Stop conditions

Pause launch or growth when:

- Payment duplication.
- Financial mismatch.
- Security issue.
- High failed-delivery rate.
- Repeated partner quality issue.
- Negative margin without explanation.
- Refund process unreliable.
- Payout process unreliable.
- Catalog frequently wrong.
- No support capacity.
- Critical provider outage without fallback.

---

## 33. Expansion criteria

Expand to Ramos Arizpe only when:

- Saltillo workflow stable.
- Delivery cost known.
- Partner model validated.
- Payouts reliable.
- Customer support works.
- Catalog quality acceptable.
- Unit economics understood.
- One or more Ramos partners approved.
- Delivery coverage confirmed.

---

## 34. Documentation completion

After Pack 08, the documentation set contains:

```text
AGENTS.md
README.md
docs/00_DOCUMENTATION_INDEX.md
docs/01_PROJECT_OVERVIEW.md
docs/02_PRODUCT_VISION.md
docs/03_BRAND_ECOSYSTEM.md
docs/04_GLOSSARY.md
docs/05_SCOPE_AND_NON_GOALS.md
docs/06_BUSINESS_MODEL.md
docs/07_MARKETPLACE_RULES.md
docs/08_PARTNER_PROGRAM.md
docs/09_PRICING_AND_COMMISSIONS.md
docs/10_USER_ROLES.md
docs/11_CUSTOMER_JOURNEY.md
docs/12_PARTNER_JOURNEY.md
docs/13_ORDER_LIFECYCLE.md
docs/14_CUSTOMER_APP.md
docs/15_PARTNER_APP.md
docs/16_ADMIN_PANEL.md
docs/17_CATALOG_AND_INVENTORY.md
docs/18_HADIA_AI.md
docs/19_MPHORA_EXPRESS.md
docs/20_WHATSAPP_AUTOMATION.md
docs/21_DELIVERY_LOGISTICS.md
docs/22_PAYMENTS_AND_PAYOUTS.md
docs/23_TECH_STACK.md
docs/24_SYSTEM_ARCHITECTURE.md
docs/25_DATABASE_SCHEMA.md
docs/26_API_AND_INTEGRATIONS.md
docs/27_SECURITY_AND_PRIVACY.md
docs/28_DESIGN_SYSTEM.md
docs/29_TESTING_AND_QA.md
docs/30_MVP_ROADMAP_AND_BACKLOG.md
```

---

## 35. Final implementation order

Recommended exact implementation order:

```text
1. Repository and environments
2. Authentication and roles
3. Cities, zones, and partners
4. Catalog
5. Inventory
6. Pricing and quotes
7. Customer browse and cart
8. Checkout and payment
9. Order state machine
10. Partner fulfillment
11. Evidence
12. Delivery
13. Notifications
14. Earnings and payouts
15. Admin exceptions
16. HADIA
17. MPHORA
18. Pilot
19. Launch
```

---

## 36. Summary

The MPHO MVP is not finished when the home page looks complete.

It is finished when a real gift can move safely from customer intention to delivery, while payment, partner work, evidence, delivery, earnings, and exceptions remain traceable.
