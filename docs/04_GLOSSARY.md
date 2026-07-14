# 04_GLOSSARY.md

## 1. Purpose

This glossary defines the official terminology used across MPHO documentation, code, interfaces, database design, analytics, customer communication, and partner operations.

Use these terms consistently.

When a new core term is introduced, update this glossary before using it broadly.

---

## 2. Brand terms

### MPHO

The master brand and complete gifting platform.

MPHO coordinates discovery, products, preparation, payment, partners, delivery, and tracking.

### HADIA

The AI-assisted gift-discovery experience inside MPHO.

HADIA recommends only from available or explicitly by-order options recorded in the system.

### MPHORA

The fast-delivery mode inside MPHO.

A product is MPHORA only after stock, partner capacity, zone, timing, and delivery eligibility are validated.

### MPHO Aliados

The partner-facing application or PWA.

### Punto MPHO

An approved physical partner location capable of performing one or more operational services.

### MPHO Empresas

Future corporate gifting module.

### MPHO Recuerda

Future reminder and recurring-occasion module.

---

## 3. People and organizations

### Customer

The person who creates and pays for an order.

Spanish customer-facing term: `cliente`.

### Recipient

The person who receives the gift.

Spanish term: `destinatario`.

The recipient may not have an MPHO account.

### Partner

A business or location approved to participate in the MPHO network.

Spanish term: `aliado`.

### Partner operator

A partner employee who executes day-to-day order tasks.

### Partner administrator

A partner user who manages catalog, staff, settings, earnings, and payouts.

### MPHO operator

An internal user responsible for operational exceptions and support.

### MPHO administrator

An internal user with platform-wide permissions.

### Courier

The person or service performing physical delivery.

Spanish term: `repartidor`.

### External provider

A third-party seller, supplier, or marketplace used to obtain a product.

### Merchant of record

The legal entity that charges the customer.

This role must be defined before production payments.

### Service provider

A third party providing payment, messaging, logistics, storage, or another technical service.

---

## 4. Location terms

### City

A supported operating city, such as Saltillo.

### Zone

An operational subdivision used for partner assignment, pricing, and delivery coverage.

### Coverage area

A geographic area where a service is available.

### Delivery address

The final destination for the gift.

### Partner address

The physical location of the Punto MPHO.

### Billing address

The address associated with billing or payment records.

### Pickup point

The location where the courier collects the prepared order.

### Service radius

A maximum distance or defined area within which a partner or courier may operate.

---

## 5. Catalog terms

### Catalog

The set of products, services, and bundles visible or manageable in MPHO.

### Product

A sellable physical item.

### Local product

A product supplied by a partner.

### External product

A product obtained through an external provider.

### By-order product

A product that is not currently available locally and requires acquisition or arrival before preparation.

### Service

A non-product charge or task, such as wrapping, receiving, inspection, personalization, or delivery.

### Bundle

A predefined combination of products and services.

### Variant

A selectable version of a product, such as size, color, style, or flavor.

### Option

A selectable configuration that may or may not change price.

### Add-on

An additional product or service added to an order.

### Personalization

A customer-selected modification such as text, color, card, QR, engraving, or decoration.

### Substitution

An approved replacement for an unavailable item.

### Catalog item

A generic term covering product, service, or bundle.

### Listing

The customer-facing representation of a catalog item.

### Source

The origin of an item, such as partner inventory or external provider.

### Source URL

The recorded external link used to review or purchase an external product.

### Observed price

The external price recorded at a specific time.

It is not guaranteed to remain current.

### Last verified at

Timestamp showing when price, stock, or availability was last confirmed.

### Restricted product

A product category that MPHO does not allow or that requires special controls.

---

## 6. Inventory terms

### Stock

The quantity of a product physically available.

### Availability

Whether an item can currently be offered under defined conditions.

### Available

The system has sufficient evidence that the item can be sold.

### Unavailable

The item cannot currently be sold.

### Unknown availability

The system cannot confirm whether the item can be sold.

### Reserved stock

Inventory temporarily assigned to a paid or pending order.

### Safety stock

Inventory kept unavailable to protect against overselling.

### Inventory adjustment

A recorded increase or decrease in stock.

### Stock confirmation

A partner action confirming that the requested item is available.

### Stock expiration

The point at which availability must be reconfirmed.

### Capacity

The partner's ability to prepare additional orders within a given time window.

---

## 7. Order terms

### Order

The commercial and operational record of a customer's purchase.

### Order number

Human-readable reference shown to users.

### Order ID

Stable internal identifier.

### Draft order

An incomplete order that has not been confirmed or paid.

### Order item

A specific product, service, bundle, or add-on within an order.

### Responsible partner

The single Punto MPHO accountable for the order in the MVP.

### Assignment

The process of linking an order to a partner.

### Offer

A request sent to a partner asking it to accept responsibility for an order.

### Acceptance window

The time available for a partner to accept an offer.

### Preparation deadline

The latest time by which the order should be ready.

### Delivery window

The expected time range for delivery.

### Order state

The current controlled lifecycle state.

### State transition

A validated movement from one order state to another.

### State history

The chronological record of order-state changes.

### Exception

A situation requiring special handling or human review.

### Incident

An operational problem such as damage, delay, missing item, or failed delivery.

### Escalation

The act of sending an exception to a higher level of review.

### Cancellation

The process of stopping an order before completion.

### Refund

Money returned to the customer.

### Partial refund

A return of only part of the paid amount.

### Completion

The final order condition after successful delivery and required post-delivery processing.

---

## 8. Preparation terms

### Preparation

The process of assembling and making the gift ready for delivery.

### Wrapping

The physical packaging of the gift.

### Gift box

A packaging product used to present the gift.

### Greeting card

A physical or digital message included with the gift.

### QR message

A QR code connected to approved digital content such as audio or video.

### Inspection

The partner's review of a received product.

### Receipt confirmation

The partner's confirmation that an external product arrived.

### Condition confirmation

The partner's confirmation that the received item is correct and undamaged.

### Preparation evidence

Photos or records showing the completed gift.

### Handoff

The transfer of the prepared gift from partner to courier.

### Handoff evidence

Proof that the courier received the order.

### Temporary storage

Short-term holding of an external package before preparation.

---

## 9. Delivery terms

### Delivery

The physical movement of an order to the recipient.

### Delivery provider

A company, platform, independent courier, or partner that performs delivery.

### Delivery quote

A calculated or proposed delivery price.

### Pickup

The moment the courier collects the order.

### Out for delivery

The state indicating the courier has the order and is traveling to the recipient.

### Delivery attempt

An effort to deliver the order.

### Failed delivery

A delivery attempt that does not reach the recipient.

### Proof of delivery

Evidence that delivery occurred.

### Delivery incident

A problem affecting pickup, transport, or delivery.

### Delivery fee

The amount charged for delivery.

### Same-day delivery

Delivery scheduled for the same calendar day.

Same-day does not automatically mean MPHORA.

### Fast delivery

A shorter-than-standard delivery option.

### Delivery SLA

A defined service-level commitment.

No delivery SLA exists until explicitly documented and approved.

---

## 10. MPHORA terms

### MPHORA eligibility

The complete set of conditions required for fast-delivery display.

### MPHORA cutoff

The latest purchase time for maintaining MPHORA eligibility.

### MPHORA zone

A zone where fast delivery can be offered.

### MPHORA item

A product or bundle currently eligible for MPHORA.

### MPHORA partner

A partner currently capable of fulfilling MPHORA orders.

### MPHORA window

The estimated delivery time range offered for a MPHORA order.

---

## 11. HADIA terms

### Recommendation

A product or bundle suggested by HADIA.

### Recommendation reason

The explanation of why the option may fit the recipient, occasion, budget, or timing.

### Grounded recommendation

A recommendation based on real catalog and operational data.

### Gift profile

A temporary or saved set of preferences used for recommendations.

### Occasion

The event or reason for gifting.

### Recipient preference

A known or provided preference relevant to the gift.

### Recommendation constraint

A required condition such as budget, zone, date, allergy, or style.

### Human handoff

Transfer from HADIA to human support.

---

## 12. Payment and finance terms

### Payment

The customer's financial transaction.

### Payment status

The verified state of a payment.

### Payment provider

The external service used to process payment.

### Payment webhook

A server-to-server event sent by the payment provider.

### Gross amount

The total amount before deductions.

### Net amount

The amount after defined deductions.

### Product revenue

The amount attributed to the product.

### Service fee

The amount charged for MPHO coordination or service.

### Preparation fee

The amount attributed to preparation work.

### Wrapping fee

The amount attributed to wrapping.

### Personalization fee

The amount attributed to personalization.

### Delivery fee

The amount attributed to delivery.

### Processing fee

The cost of payment processing.

### Commission

The amount or percentage retained under an agreed rule.

### Margin

The difference between sale price and associated cost.

### Partner earning

An amount owed to a partner for products or services.

### Payable balance

The approved amount pending payment to a partner.

### Payout

A transfer of money from MPHO or the payment system to a partner.

### Ledger

The auditable record of financial movements.

### Financial movement

A recorded debit or credit.

### Settlement

The process of calculating and finalizing amounts owed.

### Reconciliation

The comparison of internal financial records against external payment records.

### Chargeback

A payment reversal initiated through the payment system.

### Currency

The monetary unit used in a transaction.

### Minor unit

The smallest stored currency unit, such as cents.

---

## 13. Partner-performance terms

### Acceptance rate

The percentage of partner offers accepted.

### Response time

Time between offer and partner response.

### Preparation time

Time from acceptance or start to ready status.

### On-time rate

The percentage of tasks completed within expected timing.

### Incident rate

The percentage of orders with recorded incidents.

### Partner score

A future calculated measure of operational reliability.

No scoring formula is approved yet.

### Partner tier

A future classification of partner capability or performance.

No tiers are approved yet.

### Capability

A service the partner is authorized to perform.

### Availability schedule

The hours and days when the partner can receive work.

---

## 14. Messaging terms

### Notification

A system-generated informational message.

### Transactional message

A message directly related to an order or account event.

### Reminder

A message sent because an action is pending.

### Template

A pre-approved message format required by a messaging provider.

### Conversation window

A provider-defined period in which certain messages may be sent.

### Escalation message

A message informing a user that human action is required.

### Delivery status message

A customer notification about delivery progress.

---

## 15. Technical terms

### PWA

Progressive Web App.

A web application that may be installed and used with app-like behavior.

### API

A defined interface for communication between systems.

### Webhook

An event sent from one system to another.

### Idempotency

The property that repeating an operation does not create duplicate effects.

### Authentication

Verification of user or service identity.

### Authorization

Verification of what an authenticated actor is allowed to do.

### Role

A named set of permissions.

### Permission

An allowed action on a resource.

### Row-level security

Database rules limiting access to specific records.

### Audit log

A record of sensitive actions.

### Signed URL

A time-limited link granting controlled file access.

### Environment variable

A configuration value stored outside source code.

### Sandbox

A non-production environment used for testing.

### Production

The live environment used by real customers and partners.

### Feature flag

A controlled switch used to enable or disable functionality.

### Retry

A repeated attempt after a temporary failure.

### Timeout

The maximum allowed duration for an external operation.

### Queue

A system for processing work asynchronously.

### Background job

A task processed outside the immediate user request.

### Event

A recorded occurrence that may trigger other actions.

### Source of truth

The authoritative data source for a domain.

---

## 16. Status-language rules

Preferred customer-facing language must be understandable.

Internal:

```text
external_product_in_transit
```

Customer-facing:

> Tu producto va en camino al Punto MPHO.

Internal:

```text
partner_accepted
```

Customer-facing:

> El aliado ya aceptó preparar tu regalo.

Internal status names must not be shown directly to customers unless they are translated into clear language.

---

## 17. Terms to avoid

Avoid using these without a defined meaning:

- Instant.
- Guaranteed.
- Automatic.
- Real time.
- Available.
- Free.
- Unlimited.
- Immediate.
- Secure.
- Verified.

Each must be supported by a real condition, policy, or implementation.

---

## 18. Glossary governance

When adding a new core concept:

1. Define it here.
2. Choose one official term.
3. Identify customer-facing Spanish wording.
4. Identify internal technical wording.
5. Update dependent documents.
6. Avoid synonyms that create ambiguity.
