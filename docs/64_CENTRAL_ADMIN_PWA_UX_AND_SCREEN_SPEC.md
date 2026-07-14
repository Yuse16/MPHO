# 64_CENTRAL_ADMIN_PWA_UX_AND_SCREEN_SPEC.md

## 1. Purpose

This document defines MPHO Central, the restricted operations and administration PWA.

MPHO Central must prioritize:

- Current operational truth.
- exceptions.
- financial integrity.
- security.
- action ownership.
- auditability.

It is not a consumer dashboard.

---

## 2. Access

Requirements:

- No public registration.
- named internal account.
- mandatory MFA.
- short session.
- step-up authentication.
- role-specific navigation.
- audit.
- deployment protection for non-production.
- no indexing.

---

## 3. Desktop navigation

```text
Resumen
Operación
Pedidos
Aliados
Catálogo
Inventario
Entregas
Clientes
HADIA
MPHORA
Pagos
Reembolsos
Ganancias
Payouts
Soporte
Incidentes
Analítica
Seguridad
Configuración
```

Navigation may collapse but not hide critical alerts.

---

## 4. Mobile navigation

```text
Resumen
Operación
Alertas
Finanzas
Más
```

Central mobile supports urgent supervision.

Complex financial and configuration tasks should recommend desktop unless securely designed for mobile.

---

## 5. Summary screen

Top metrics:

- Active orders.
- orders at risk.
- sales today.
- estimated contribution margin.
- deliveries pending.
- critical incidents.
- payment mismatches.
- payout holds.

Each metric opens a filtered queue.

---

## 6. Operations funnel

Suggested live funnel:

```text
Paid
Assignment pending
Partner offered
Partner accepted
Product confirmed
Preparing
Ready
Courier assigned
Out for delivery
Delivered
Exception
```

Each stage shows:

- Count.
- oldest age.
- deadline breaches.
- value at risk.

---

## 7. Operations queue

Table or cards:

- Priority.
- order.
- state.
- customer-safe promise.
- assigned owner.
- partner internal identity.
- deadline.
- risk.
- next action.

Bulk actions must be limited and audited.

---

## 8. Order detail

Sections:

```text
Overview
Customer
Recipient
Items
Pricing
Payment
Partner
Package
Preparation
Delivery
Notifications
Support
Refunds
Ledger
Audit
```

Sensitive sections depend on role.

Primary controls:

- Assign owner.
- contact through approved channel.
- reassign partner.
- pause.
- open incident.
- request evidence.
- initiate refund request.
- controlled state correction.

No raw direct state edit.

---

## 9. Partner management

Screens:

- Applications.
- verification.
- capabilities.
- training.
- test orders.
- active partners.
- performance.
- incidents.
- earnings.
- payout account.
- pause/suspend.
- offboarding.

Partner public customer exposure remains disabled by default.

---

## 10. Catalog management

Functions:

- Product definition.
- listings.
- source type.
- media.
- options.
- pricing.
- publication.
- partner supply mapping.
- restrictions.
- legal review.
- MPHORA eligibility.

Catalog preview should show exact customer view without internal partner data.

---

## 11. Inventory management

- Current quantity.
- reservations.
- stale confirmation.
- adjustment.
- count.
- partner.
- product.
- incident.
- audit.

No silent quantity correction.

---

## 12. Delivery management

- Coverage.
- quote.
- courier assignment.
- active deliveries.
- failed attempts.
- returns.
- provider events.
- cost.
- proof.
- incident.

Map only when it adds operational value and respects privacy.

---

## 13. Customer management

Authorized support views:

- Account.
- orders.
- support.
- consent.
- privacy request.
- fraud restriction.
- notification status.

No unrestricted browsing of customer private data.

Access to sensitive detail should be logged.

---

## 14. HADIA panel

Metrics:

- Conversations started.
- recommendations viewed.
- conversion.
- no-result rate.
- human handoff.
- cost.
- latency.
- failed structured output.
- blocked tool attempt.
- prompt injection signal.

Controls:

- prompt version.
- model.
- feature flag.
- tool permissions.
- budget.
- emergency disable.

Conversation access requires purpose and role.

---

## 15. MPHORA panel

Show:

- Active city.
- active zones.
- partner capacity.
- eligible products.
- courier coverage.
- average preparation.
- orders at risk.
- current cutoff.
- pause controls.

Emergency controls:

- Pause city.
- pause zone.
- pause partner.
- pause product.
- pause personalization.

---

## 16. Finance overview

Show:

- Gross customer payments.
- product cost.
- partner earnings.
- delivery cost.
- payment fees.
- refunds.
- chargebacks.
- contribution margin.
- unresolved mismatch.
- payout liability.

Every number must link to source transactions.

---

## 17. Refund screen

Queue fields:

- Order.
- reason.
- customer request.
- refundable balance.
- work completed.
- partner impact.
- courier impact.
- provider status.
- risk.
- required approval.

High-risk action requires step-up and separation of duties.

---

## 18. Payout screen

- Partner.
- payable earnings.
- account status.
- recent account change.
- hold.
- batch.
- approval.
- provider/bank reference.
- reconciliation.

Creator cannot final approve when dual control is required.

---

## 19. Incident center

Filters:

- Severity.
- category.
- owner.
- affected service.
- money at risk.
- data at risk.
- active orders.
- status.

Provide runbook link and next update timer.

---

## 20. Security center

- Privileged accounts.
- MFA.
- access reviews.
- denied access patterns.
- secret events.
- webhook failures.
- suspicious sessions.
- file rejections.
- AI tool denials.
- deployment events.
- backup status.

Do not attempt to become a full SIEM in MVP.

---

## 21. Configuration

Configuration domains:

- Cities and zones.
- operating hours.
- pricing.
- earning rules.
- cutoffs.
- feature flags.
- notification templates.
- legal document versions.
- consent versions.
- product restrictions.
- provider status.

Every material change requires audit and preview.

---

## 22. Central install policy

Desktop installation may be promoted after successful secure login.

Mobile installation should be limited to approved users and devices.

Install does not weaken:

- MFA.
- session timeout.
- reauthentication.
- device security.
- permission checks.

---

## 23. Visual language

- Dense but readable.
- dark neutral surfaces.
- blue/cyan for information.
- lime for primary safe action.
- amber for risk.
- red for critical.
- tables on desktop.
- cards on mobile.
- persistent filters.
- no decorative consumer hero.
- clear last-updated timestamps.

---

## 24. Acceptance criteria

- Every critical queue has owner and deadline.
- Financial totals are traceable.
- Privileged actions are auditable.
- Customer and partner data are role-limited.
- Mobile supports urgent response.
- Central cannot bypass domain rules through UI.
- No partner identity is accidentally exposed in customer preview.
