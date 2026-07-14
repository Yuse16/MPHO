# 52_CUSTOMER_SUPPORT_AND_COMMUNICATION_PLAYBOOK.md

## 1. Purpose

This playbook defines how MPHO support communicates with customers, recipients, partners, and couriers.

The goal is to provide clear, truthful, documented, and secure assistance without creating promises the operation cannot fulfill.

---

## 2. Support principles

- Verify before disclosing order data.
- Use the official order record.
- Be direct and respectful.
- Do not guess.
- Do not hide a real problem.
- Do not promise an unsupported deadline.
- Do not request card data.
- Do not process a financial action only through chat.
- Record material commitments.
- Protect surprise mode.
- Escalate safety and security immediately.

---

## 3. Support channels

Approved channels may include:

- In-app support.
- WhatsApp Business.
- Email.
- Phone.
- Partner app.
- Admin support queue.

Every support conversation should create or link to a case.

---

## 4. Identity verification

Before disclosing sensitive order information, verify using approved factors such as:

- Authenticated session.
- Order number plus verified contact.
- Secure one-time link.
- Additional factor for high-risk changes.

Do not use only publicly visible information.

Do not disclose:

- Full recipient address.
- Private message.
- Payment details.
- Partner payout data.
- Security notes.

---

## 5. Support case structure

```text
case_number
requester_type
requester_id
order_id
category
priority
summary
verified_identity
owner
status
next_action
deadline
communications
resolution
```

---

## 6. Categories

```text
pre_sale
catalog
availability
quote
payment
order_status
personalization
address_change
partner_delay
external_product
delivery
failed_delivery
cancellation
refund
product_issue
privacy
security
fraud
invoice
partner_support
other
```

---

## 7. Priority

### Critical

- Threat.
- stalking or harassment.
- account takeover.
- data exposure.
- unauthorized payment or payout.
- dangerous product.
- wrong recipient with sensitive content.

### High

- Active delivery problem.
- MPHORA delay.
- lost package.
- duplicate charge.
- damaged product.
- payment mismatch.

### Normal

- Order status.
- catalog question.
- scheduled change.
- invoice request.

---

## 8. Response style

Use:

- What happened.
- What MPHO knows.
- What MPHO does not yet know.
- What is being done.
- Whether the customer must act.
- Next update time.

Avoid:

- “It should be fine.”
- “The system says so” without explanation.
- Blaming another provider before investigation.
- Legal conclusions by unqualified staff.
- Fake urgency.
- Unapproved compensation.

---

## 9. Pre-sale support

Support may explain:

- Coverage.
- product source.
- MPHORA eligibility.
- personalization.
- delivery mode.
- external-product timeline.
- price components.

Support must not manually promise unavailable stock or timing.

---

## 10. Payment support

If customer reports payment issue:

1. Verify order and provider reference.
2. Check internal payment status.
3. Check provider status.
4. Do not ask customer to pay again while under review.
5. Do not ask for full card number or security code.
6. Open mismatch exception when needed.
7. Give next update time.

---

## 11. Address change

Before changing after payment:

- Verify requester.
- Confirm new address.
- Check zone.
- Recalculate delivery.
- Check courier status.
- Check fraud risk.
- Obtain authorization for price or time change.
- Audit old and new address.

No address change after pickup without controlled incident handling.

---

## 12. Personalization correction

Support checks:

- Has work started?
- What version was approved?
- Is correction possible?
- Does time change?
- Is there an extra cost?
- Who caused the error?

Any new version must be approved and locked.

---

## 13. Delay communication

Message structure:

> Detectamos un cambio en el tiempo de tu pedido {{order_number}}. La causa confirmada es {{verified_reason}}. La nueva estimación es {{new_window}}. Tus opciones son {{options}}. Te actualizaremos nuevamente a las {{next_update}}.

Do not use a fabricated cause.

---

## 14. Failed delivery support

Support must know:

- Attempt time.
- reason.
- current package location.
- condition.
- contact attempts.
- reattempt options.
- cost responsibility.
- perishable risk.

Never tell the customer to contact the courier personally unless the approved provider process requires it.

---

## 15. Product complaint

Collect reasonable evidence:

- What is wrong?
- When discovered?
- Package condition?
- Photos or video when available?
- Was product used?
- Is there a safety risk?

Do not demand impossible proof.

Open an incident for counterfeit, safety, or tampering suspicion.

---

## 16. Cancellation and refund support

Support may:

- Create request.
- Explain current stage.
- Explain expected review.
- Show provider status.
- Provide folio.

Support may not:

- Promise refund before authorization.
- Mark refund complete without provider confirmation.
- Remove performed work without review.
- offer wallet credit as mandatory replacement for cash refund.

---

## 17. Security support

For account compromise:

- Do not continue ordinary troubleshooting.
- Disable or secure account according to playbook.
- Revoke sessions.
- Escalate security.
- Preserve evidence.
- Avoid sharing security details to unverified requester.

---

## 18. Recipient support

Recipient may:

- Coordinate delivery.
- Refuse delivery.
- Report harassment or safety concern.
- Request privacy information.

Do not reveal buyer identity when surprise or safety policy does not permit it.

Do not enroll recipient in marketing.

---

## 19. Partner support

Partner support covers:

- Offer issue.
- app issue.
- stock.
- package.
- preparation.
- courier.
- earning.
- payout.
- security.

Partner financial changes require the secure workflow, not a support message.

---

## 20. Escalation matrix

```text
catalog → catalog operations
order state → operations
payment/refund → finance
payout → finance + security when destination changed
delivery → logistics
privacy → privacy owner
security → security incident
legal request → legal owner
unsafe product → operations + legal + security
harassment → security + operations
```

---

## 21. Compensation authority

Define limits by role.

Possible actions:

- Apology.
- waived delivery fee.
- partial refund request.
- replacement.
- coupon.
- full refund request.

No agent may exceed approved authority.

All compensation is recorded.

---

## 22. Communication templates

### Payment under review

> Tu pago está en revisión. No realices otro pago por el momento. Estamos validando el estado con el proveedor y te actualizaremos antes de {{time}}.

### Partner delay

> Tu regalo sigue en preparación, pero detectamos un retraso. La nueva estimación es {{window}}. Te avisaremos nuevamente a las {{time}}.

### Package issue

> El Punto MPHO recibió el paquete y detectó un problema antes de preparar el regalo. Detuvimos el proceso para proteger tu compra. Estamos revisando {{options}}.

### Delivery failed

> No fue posible completar la entrega. El regalo se encuentra {{custody_location}} y su condición es {{condition}}. Las opciones disponibles son {{options}}.

### Refund submitted

> El reembolso por {{amount}} fue enviado al proveedor de pago. Aún está en proceso. Te compartiremos la confirmación cuando el proveedor lo marque como completado.

---

## 23. Case closure

Close only when:

- Request is resolved.
- Customer received outcome.
- Financial action confirmed.
- Order state matches.
- Incident linked or closed.
- Promise fulfilled or transferred.
- Resolution code recorded.

---

## 24. Quality review

Review a sample of cases for:

- Identity verification.
- truthfulness.
- tone.
- promised deadline.
- correct escalation.
- privacy.
- financial authority.
- complete records.

---

## 25. Definition of done

Support is complete when:

- The user knows the verified state.
- The next action and owner are clear.
- No unsupported promise exists.
- Sensitive information remains protected.
- The official order and financial records match the communication.
