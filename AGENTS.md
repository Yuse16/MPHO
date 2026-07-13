# AGENTS.md

## 1. Purpose

This file defines the permanent rules that any AI agent, developer, automation tool, or contributor must follow when working on MPHO.

Before creating, modifying, deleting, or reorganizing code, database objects, automations, interfaces, or documentation, read:

1. `AGENTS.md`
2. `README.md`
3. `docs/00_DOCUMENTATION_INDEX.md`
4. `docs/01_PROJECT_OVERVIEW.md`
5. Any specialized document related to the task.

The documentation is the project source of truth.

If code and documentation conflict, do not guess. Report the contradiction, explain the impact, and propose a resolution before continuing.

---

## 2. What MPHO is

MPHO is a digital gifting platform that connects:

- Customers who want to find, personalize, and send gifts.
- Local businesses that sell flowers, chocolates, balloons, mugs, boxes, personalized items, and other gift products.
- Partner locations that can receive third-party packages, inspect them, wrap them, personalize them, and hand them to a courier.
- Couriers or local delivery services.
- External providers and marketplaces used for products not available locally.

MPHO is not only an ecommerce store.

MPHO is a distributed gifting, preparation, and local-delivery coordination platform.

---

## 3. Brand ecosystem

Official names:

- **MPHO:** main customer platform.
- **HADIA:** AI assistant that helps the customer choose a gift.
- **MPHORA:** fast-delivery mode for nearby and operationally available gifts.
- **MPHO Aliados:** partner-facing application or PWA.
- **Punto MPHO:** authorized partner location that may sell, receive, prepare, wrap, personalize, or dispatch gifts.
- **MPHO Empresas:** future corporate gifting module.
- **MPHO Recuerda:** future date-reminder module.

Do not rename, merge, reinterpret, or create new sub-brands without updating the corresponding documentation.

---

## 4. Initial operating area

The initial market is:

- Saltillo, Coahuila.
- Later expansion to Ramos Arizpe.
- Additional cities only after validating operations.

The architecture should support growth by city and zone, but the MVP must not be overengineered for national scale.

---

## 5. MVP objective

The MVP must validate the following full flow:

```text
Customer selects a gift
→ total is calculated
→ payment is confirmed
→ one Punto MPHO is assigned
→ partner accepts
→ local item is reserved or external item is received
→ partner prepares and wraps
→ evidence is uploaded
→ courier is assigned
→ gift is delivered
→ partner earnings are recorded
→ order is completed
```

In the MVP, one order must have one responsible Punto MPHO.

Do not split a single order across multiple partners unless a later approved sub-order design explicitly allows it.

---

## 6. Non-negotiable business rules

### 6.1 Never invent operational data

Never invent:

- Stock.
- Prices.
- Partner availability.
- Store hours.
- Preparation time.
- Delivery time.
- Delivery cost.
- Fees.
- Earnings.
- Payment status.
- Package status.
- Delivery status.

When data is missing or cannot be confirmed, show it as unavailable, pending, or subject to validation.

### 6.2 One source of truth per domain

Use one authoritative source for each critical domain:

- Catalog and inventory: database.
- Order state: order state machine.
- Payment state: payment provider plus internal payment records.
- Delivery state: logistics provider or verified delivery record.
- Partner earnings: financial ledger.
- Evidence: storage linked to the order.

Do not duplicate business rules across multiple frontend components.

### 6.3 Human intervention by exception

The system should automate normal operations and surface exceptions such as:

- Partner has not accepted.
- Item is unavailable.
- External package is delayed.
- Product arrived damaged.
- Preparation is late.
- Courier is not assigned.
- Payment failed.
- Refund failed.
- Required evidence is missing.
- Partner is not responding.

The administrator should not have to manually review every healthy order.

### 6.4 Availability labels must be truthful

At minimum, distinguish:

- **Local:** available through a nearby partner.
- **MPHORA:** eligible for fast delivery after operational validation.
- **By order:** requires an external purchase or package arrival.

Never present a by-order product as immediately available.

---

## 7. HADIA rules

HADIA may help the customer based on:

- Recipient.
- Occasion.
- Budget.
- Required date.
- Delivery zone.
- Preferences.
- Restrictions.
- Style.
- Delivery urgency.

HADIA may:

- Filter catalog items.
- Compare options.
- Recommend real products.
- Suggest personalization.
- Suggest MPHORA options when eligibility is confirmed.

HADIA must not:

- Invent products.
- Invent stock.
- Promise delivery without validation.
- Change prices.
- Approve refunds.
- Confirm unverified payments.
- Authorize substitutions without approval.
- Expose private information.
- Recommend unavailable items as available.

All recommendations must be grounded in real catalog and operational data.

---

## 8. MPHORA rules

MPHORA is a delivery mode, not a universal promise.

A product may be shown as MPHORA only after validating:

- Real availability.
- Eligible partner.
- Operating hours.
- Preparation capacity.
- Delivery zone.
- Delivery capacity.
- Order cutoff time.
- Safety margin.

If any requirement cannot be validated, the item must not be labeled MPHORA.

---

## 9. External product rules

External products may come from Mercado Libre or another provider.

For the MVP:

- External products must be curated.
- Do not rely on unauthorized scraping.
- Do not assume price permanence.
- Store source, link, observed price, and validation date.
- Include operational margin for delays, price changes, or cancellation.
- Link the external purchase to an MPHO order.
- Ship the product to the assigned Punto MPHO.
- Require partner confirmation of receipt and condition.
- Create an exception if the item arrives late, damaged, incomplete, or incorrect.

An external listing is not owned inventory.

---

## 10. Preliminary order states

Until `docs/13_ORDER_LIFECYCLE.md` is created, use only clear, explicit states.

```text
draft
pending_payment
payment_under_review
paid
assignment_pending
partner_offered
partner_accepted
partner_rejected
awaiting_local_stock
awaiting_external_purchase
external_product_in_transit
external_product_received
preparing
ready_for_pickup
delivery_pending
courier_assigned
out_for_delivery
delivered
completed
cancel_requested
cancelled
refund_pending
refunded
exception
```

Rules:

- Every state change must record timestamp, actor, and reason.
- Do not skip critical states without justification.
- Do not use free text as the only state field.
- State transitions must be idempotent.
- Repeated webhooks must not duplicate effects.
- Delivered orders must not return to preparation.
- Cancelled orders must not continue to delivery.
- Approved payments must not be recorded twice.

---

## 11. Money, commissions, and earnings

Financial calculations must be auditable.

The customer total may include:

```text
products
+ preparation and wrapping
+ personalization
+ delivery
+ MPHO service fee
+ payment processing
+ applicable taxes
= final total
```

Partners may earn from:

- Sale of their own products.
- Receiving external packages.
- Product inspection.
- Wrapping.
- Personalization.
- Preparation.
- Own delivery, when applicable.

Rules:

- Never use example values as production rates.
- All fees must come from configuration, agreement, or approved rules.
- Never calculate trusted financial totals only in the frontend.
- Store money as integer minor units, such as cents.
- Store currency.
- Separate revenue, cost, commission, and payable balance.
- Do not mark earnings as paid without a verifiable transaction.
- Refunds must update balances consistently.
- Do not expose one partner's financial data to another.

---

## 12. Security and privacy

Apply least privilege.

Preliminary roles:

- Customer.
- Partner operator.
- Partner administrator.
- Courier.
- MPHO operator.
- MPHO administrator.
- Automated service.

Rules:

- Each partner may see only its own orders, catalog, earnings, and staff.
- Customers may see only their own orders.
- Recipient data is exposed only when operationally necessary.
- Never commit secrets.
- Do not place private keys in public environment variables.
- Enforce permissions on the server.
- Log sensitive actions.
- Use signed or protected URLs for private files.
- Do not store payment card data.
- Avoid logging private addresses, phones, or messages.
- Mask sensitive data in errors.

---

## 13. Planned technology stack

Preferred stack:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Supabase.
- Vercel.
- n8n.
- WhatsApp Business Platform.
- Mercado Pago or another approved payment provider.
- Future logistics providers.

Do not replace a core technology without a documented reason and approval.

---

## 14. Code rules

- Use strict TypeScript.
- Avoid `any` unless justified.
- Validate user input.
- Separate business logic from UI components.
- Do not duplicate business rules.
- Use descriptive names.
- Handle loading, empty, error, and success states.
- Handle failures from external services.
- Verify webhook authenticity.
- Make critical operations idempotent.
- Keep the experience mobile-first.
- Do not make optional integrations block the entire application.
- Do not disable ESLint or TypeScript to hide errors.
- Do not introduce unnecessary dependencies.
- Do not rewrite entire modules when a small change is sufficient.

---

## 15. Database rules

- Use stable primary keys.
- Maintain auditability.
- Avoid physical deletion of financial records.
- Use constraints and indexes.
- Enforce row-level access policies.
- Do not trust client-calculated values.
- Normalize city, zone, partner, and addresses.
- Keep billing, delivery, partner, and recipient addresses separate.
- Record actor and timestamp for critical changes.
- Keep order state history.

---

## 16. Integration rules

Every integration must define:

- Environment variables.
- Test or sandbox mode.
- Authentication.
- Timeouts.
- Error handling.
- Controlled retries.
- Idempotency.
- Webhook verification.
- Logging without sensitive data.
- Recovery strategy.
- Manual fallback when necessary.

Do not claim an integration is working unless it has been tested.

---

## 17. Customer experience rules

The customer journey should follow:

```text
occasion
→ recipient
→ budget
→ zone
→ date
→ gift options
→ personalization
→ payment
→ tracking
```

The customer must know:

- What is included.
- Availability type.
- Estimated timing.
- Personalization details.
- Delivery cost.
- Service cost.
- Current status.
- Cancellation limitations.
- Refund limitations.

---

## 18. Partner experience rules

MPHO Aliados must let the partner:

- Receive offers.
- Accept or reject.
- Confirm stock.
- Confirm external package receipt.
- Report damage.
- Prepare.
- Upload evidence.
- Mark ready.
- Hand over to courier.
- View earnings.
- View payouts.
- Update approved products.

WhatsApp may notify, but the platform database is the official state source.

---

## 19. Mandatory workflow before changes

Before implementing:

1. Read relevant documentation.
2. Inspect the existing code.
3. Identify dependencies.
4. Confirm the real problem.
5. Identify regression risks.
6. Propose the smallest coherent solution.

During implementation:

1. Change only what is necessary.
2. Preserve compatibility.
3. Do not remove features without approval.
4. Do not change public contracts silently.
5. Add validation and error handling.
6. Keep naming consistent.
7. Update types, tests, and documentation.

After implementation:

1. Run lint.
2. Run type checking.
3. Run tests.
4. Run build.
5. Review mobile behavior.
6. Test error states.
7. Summarize changed files.
8. Report risks and pending work.
9. Update documentation if behavior changed.

---

## 20. Definition of done

A task is not done only because it renders successfully.

When applicable, it must:

- Match documented business logic.
- Save data correctly.
- Enforce permissions.
- Preserve valid states.
- Handle errors.
- Avoid duplicate payments, orders, and notifications.
- Work on mobile.
- Pass lint.
- Pass type checking.
- Pass tests.
- Pass build.
- Handle empty and loading states.
- Include updated documentation.
- Contain no secrets.
- Avoid regressions.

---

## 21. Prohibited actions

Do not:

- Invent undocumented functions.
- Create tables without checking schema plans.
- Rename brands.
- Treat MPHO, HADIA, and MPHORA as the same feature.
- Promise fast delivery without validation.
- Treat external listings as owned inventory.
- Split orders among partners without approved design.
- Store money as unsafe floats.
- Trust totals sent by the browser.
- Omit permission checks.
- Expose secrets.
- Delete financial history.
- Mark earnings as paid without a traceable payment.
- Use fake production data.
- Present mock interfaces as completed functionality.
- Ignore build failures.

---

## 22. Expected completion report

After each task, report:

```text
Objective:
What changed:
Files modified:
How it works:
Validations completed:
Tests executed:
Risks or pending items:
Documentation updated:
```

If something could not be completed, say so clearly.

---

## 23. Decision priority

When priorities conflict, use:

1. Security and money.
2. Order integrity.
3. Privacy.
4. Documented business rules.
5. Operational reliability.
6. Customer experience.
7. Performance.
8. Visual design.
9. Implementation convenience.

---

## 24. Document status

This is the foundational agent rule file for Pack 01.

Its core principles must not be removed without an explicit project-owner decision.


---

## 25. Mandatory security addendum — Pack 09

Before any work involving production, authentication, authorization, database policies, files, webhooks, AI tools, payments, refunds, earnings, payouts, delivery proof, deployment, or incident handling, read:

1. `docs/31_THREAT_MODEL_AND_ABUSE_CASES.md`
2. `docs/32_SECURITY_CONTROLS_AND_ASVS_CHECKLIST.md`
3. `docs/33_SECRETS_KEYS_AND_PRIVILEGED_ACCESS.md`
4. `docs/34_DEPLOYMENT_ENVIRONMENTS_AND_HARDENING.md`
5. `docs/35_BACKUP_RECOVERY_AND_BUSINESS_CONTINUITY.md`
6. `docs/36_SECURITY_INCIDENT_RESPONSE_RUNBOOK.md`
7. `docs/37_FRAUD_RISK_AND_FINANCIAL_CONTROLS.md`
8. `docs/38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md`

Security rules:

- No private table may be created without access policies in the same change.
- No privileged account may enter production without MFA.
- No client-side secret or Supabase elevated key is permitted.
- No money-moving action may depend only on browser input.
- No payment, refund, earning, payout, external purchase, or delivery request may lack idempotency.
- No HADIA tool may move money, alter privileged state, approve a partner, or complete a delivery.
- No production launch may occur with a zero-tolerance blocker in document 38.
- No control may be marked complete without evidence.
- No security exception may be permanent or undocumented.
- No contributor may claim that the system is impossible to attack.

When a requirement cannot be met:

1. Stop the affected production path.
2. Record the threat.
3. Add a compensating control.
4. Assign an owner and expiration.
5. Obtain explicit risk acceptance.

---

## 26. Mandatory legal and policy addendum — Pack 10

Before implementing public terms, privacy, customer checkout, cancellation, refund, partner onboarding, partner payouts, delivery policy, external purchases, cookies, marketing, or brand content, read:

1. `docs/39_LEGAL_AND_REGULATORY_REQUIREMENTS.md`
2. `docs/40_CUSTOMER_TERMS_AND_CONDITIONS.md`
3. `docs/41_PRIVACY_NOTICE_AND_DATA_RIGHTS.md`
4. `docs/42_CANCELLATIONS_REFUNDS_AND_DISPUTES_POLICY.md`
5. `docs/43_PARTNER_AGREEMENT_REQUIREMENTS.md`
6. `docs/44_DELIVERY_RECIPIENT_AND_FAILED_DELIVERY_POLICY.md`
7. `docs/45_EXTERNAL_PRODUCTS_AND_THIRD_PARTY_MARKETPLACES.md`
8. `docs/46_COOKIES_ANALYTICS_AND_COMMUNICATION_CONSENT.md`
9. `docs/47_BRAND_INTELLECTUAL_PROPERTY_AND_CONTENT_RULES.md`

Mandatory rules:

- Documents marked internal draft are not publishable terms.
- OpenCode must not replace missing legal-entity, tax, seller, invoice, data-controller, or liability decisions with guesses.
- Every public legal document must be versioned and linked to acceptance evidence.
- Marketing consent must remain separate from checkout and necessary communications.
- Recipient data must not create marketing enrollment.
- External products must not imply an unauthorized marketplace or brand affiliation.
- Restricted product categories remain disabled until category-specific review.
- Customer terms cannot waive mandatory consumer rights.
- A legal, tax, privacy, labor, insurance, or IP question marked unresolved is a production blocker for the affected feature.
- The actual software and operation must match the reviewed legal documents.


---

## 27. Mandatory operations addendum — Pack 11

Before implementing or modifying partner onboarding, order queues, package custody, preparation, support, delivery, refunds, payouts, operational incidents, or the pilot launch, read:

1. `docs/48_PARTNER_ONBOARDING_AND_ACTIVATION_RUNBOOK.md`
2. `docs/49_DAILY_ORDER_OPERATIONS_RUNBOOK.md`
3. `docs/50_PACKAGE_RECEIVING_INSPECTION_AND_STORAGE_SOP.md`
4. `docs/51_GIFT_PREPARATION_PERSONALIZATION_AND_QUALITY_SOP.md`
5. `docs/52_CUSTOMER_SUPPORT_AND_COMMUNICATION_PLAYBOOK.md`
6. `docs/53_DELIVERY_DISPATCH_HANDOFF_AND_FAILED_DELIVERY_RUNBOOK.md`
7. `docs/54_CANCELLATIONS_REFUNDS_AND_DISPUTE_OPERATIONS_RUNBOOK.md`
8. `docs/55_PARTNER_EARNINGS_PAYOUT_AND_RECONCILIATION_RUNBOOK.md`
9. `docs/56_INCIDENT_EXCEPTION_AND_RECOVERY_OPERATIONS.md`
10. `docs/57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md`

Mandatory operating rules:

- Every paid order must have one owner, one current state, one next action, and one deadline.
- No order, refund, payout, package handoff, or delivery may exist only in WhatsApp or a spreadsheet.
- Package custody must always be known.
- A partner may perform only approved capabilities.
- Preparation may not begin before required approvals and physical product validation.
- No silent substitution is allowed.
- No refund is complete without provider confirmation and ledger reconciliation.
- No payout is complete without verified destination, payment reference, and reconciliation.
- Every failed delivery must record cause, custody, condition, options, and cost responsibility.
- Every P0 or P1 exception must have an assigned owner and next update time.
- Pilot capacity must not increase until the previous cohort is reviewed.
- OpenCode must implement operational states, evidence, queues, deadlines, and auditability described in these runbooks rather than only building visual screens.

---

## 28. Mandatory PWA and customer-brand addendum — Pack 12

Before implementing any customer, partner, or central interface, read:

1. `docs/58_BRAND_VISIBILITY_AND_CUSTOMER_EXPERIENCE_MODEL.md`
2. `docs/59_THREE_PWA_ECOSYSTEM_AND_ARCHITECTURE.md`
3. `docs/60_CUSTOMER_PWA_INFORMATION_ARCHITECTURE.md`
4. `docs/61_CUSTOMER_HOME_DISCOVERY_HADIA_AND_MPHORA_UX.md`
5. `docs/62_CUSTOMER_CHECKOUT_TRACKING_RETENTION_AND_INSTALL_UX.md`
6. `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md`
7. `docs/64_CENTRAL_ADMIN_PWA_UX_AND_SCREEN_SPEC.md`
8. `docs/65_SHARED_DESIGN_SYSTEM_AND_RESPONSIVE_RULES.md`
9. `docs/66_PWA_INSTALLATION_NOTIFICATIONS_OFFLINE_CACHE_AND_UPDATES.md`
10. `docs/67_ROUTES_WIREFRAMES_AND_COMPONENT_INVENTORY.md`
11. `docs/68_PROTOTYPE_ACCEPTANCE_AND_HANDOFF_TO_OPENCODE.md`

Mandatory rules:

- MPHO is the sole normal customer-facing store and service identity.
- The customer application must not contain a directory of Puntos MPHO.
- Internal partner identity must not leak through UI, API, media metadata, notifications, tracking, URLs, or analytics.
- Legally required seller, invoice, warranty, recall, or pickup disclosures must not be hidden.
- MPHO, MPHO Aliados, and MPHO Central are three separate PWAs with separate origins, manifests, service workers, navigation, and permissions.
- Customer, partner, and central roles must not share one mixed navigation.
- Private, financial, order, recipient, evidence, partner-task, earnings, and admin responses must not be placed in generic offline caches.
- No client-side state is official until confirmed by the server.
- Installation prompts must be contextual and must not interrupt payment.
- Notifications must minimize lock-screen information and use authenticated deep links.
- OpenCode must implement loading, empty, offline, expired, unauthorized, error, and update states.
- OpenCode must not mark a PWA complete until installation, updates, logout, permissions, offline behavior, and target-device tests pass.
- Customer-facing metrics, ratings, store identities, and partnerships must not be invented.

