# 54_CANCELLATIONS_REFUNDS_AND_DISPUTE_OPERATIONS_RUNBOOK.md

## 1. Purpose

This runbook converts the cancellation, refund, chargeback, and dispute policies into an executable operational workflow.

It applies to:

- Customer cancellations.
- Partner-caused issues.
- Delivery failures.
- External-product returns.
- Duplicate charges.
- Partial refunds.
- Chargebacks.
- Goodwill compensation.
- Financial disputes.

---

## 2. Core rules

- Do not promise a refund before review.
- Do not issue more than the remaining refundable balance.
- Do not create two refunds for the same amount.
- Do not use a coupon as a mandatory replacement for money.
- Do not delete ledger history.
- Do not punish a partner automatically.
- Do not mark refund complete before provider confirmation.
- Preserve mandatory consumer rights.
- Record the reason and reviewer.

---

## 3. Request intake

Create a case with:

```text
request_id
order_id
customer_id
request_type
reason
requested_amount
evidence
current_order_state
payment_state
delivery_state
partner_state
external_purchase_state
requested_at
```

Acknowledge the request and provide a folio.

---

## 4. Identity verification

Before disclosing or changing financial information:

- Verify authenticated customer or approved requester.
- Use step-up verification for suspicious or high-value requests.
- Do not accept a refund-destination change through chat.
- Do not request full card details.

---

## 5. Immediate safety stop

Immediately pause relevant operations when request involves:

- Unsafe product.
- counterfeit suspicion.
- harassment.
- unauthorized payment.
- account takeover.
- duplicate payout.
- data exposure.
- lost package.

Open incident in parallel.

---

## 6. Stage assessment

Review:

```text
payment approved?
partner accepted?
stock reserved?
external purchase made?
package shipped?
package received?
personalization approved?
personalization started?
gift prepared?
courier requested?
picked up?
delivered?
partner earnings created?
payout already sent?
prior refund?
chargeback open?
```

The system should calculate the stage from trusted state, not from support text.

---

## 7. Responsibility assessment

Choose one or more:

```text
customer
recipient
MPHO
partner
courier
external seller
payment provider
force majeure
shared
uncertain
fraud suspected
```

Responsibility affects internal allocation, but it does not automatically remove customer rights.

---

## 8. Refund calculation

Calculate:

```text
approved payment
− completed prior refunds
= remaining refundable balance
```

Then allocate:

- Product.
- wrapping.
- personalization.
- preparation.
- delivery.
- external shipping.
- MPHO service.
- tax.
- discount.
- required compensation.
- goodwill.

Every retained amount must have a reason and lawful basis.

---

## 9. Approval levels

Suggested model:

### Support agent

- Create request.
- Gather evidence.
- Explain status.

### Operations reviewer

- Classify stage and responsibility.
- Recommend remedy.

### Finance approver

- Approve within configured threshold.
- Validate amount and ledger.

### Senior or dual approval

Required for:

- High-value refund.
- unusual partial allocation.
- refund after payout.
- manual payment override.
- suspected fraud.
- chargeback plus refund.

Thresholds must be configuration.

---

## 10. Cancellation before payment

- Cancel quote or draft.
- Release temporary reservations.
- No provider refund.
- Close request.

---

## 11. Paid but unassigned

Normally:

- Stop assignment.
- Release reservation.
- Calculate full refundable balance.
- Submit refund.
- Notify customer.

Any retained component needs explicit reviewed basis.

---

## 12. Partner accepted

Review:

- Did partner use materials?
- Did partner perform reception or inspection?
- Did personalization start?
- Did delivery cost occur?

Create partner compensation only for documented work under the agreement.

---

## 13. External purchase already made

1. Pause further preparation.
2. Verify seller status.
3. Determine cancellation or return path.
4. Determine return shipping.
5. Preserve seller evidence.
6. Inform customer of verified options.
7. Do not claim completed refund until both internal and provider flows reconcile.

---

## 14. Personalization started

Review:

- Approved version.
- start time.
- materials used.
- reversibility.
- cause of cancellation.
- partner evidence.

Errors caused by MPHO or partner remain their responsibility.

---

## 15. Courier already requested

Check provider cancellation state:

```text
not_assigned
assigned
traveling_to_pickup
at_pickup
picked_up
out_for_delivery
```

Separate delivery cost from product and preparation.

---

## 16. Failed delivery

Review:

- Reason.
- custody.
- condition.
- contact attempts.
- recipient mode.
- perishability.
- responsibility.

Options:

- Reattempt.
- reschedule.
- return.
- replacement.
- partial refund.
- full refund.

---

## 17. Product complaint

Classify:

```text
wrong_product
wrong_variant
missing_item
damaged
quality_issue
unsafe
counterfeit_suspected
personalization_error
unauthorized_substitution
late_delivery
```

Gather reasonable evidence and avoid impossible proof requirements.

---

## 18. Refund submission

Before provider call:

- Payment approved.
- Currency matches.
- Amount positive.
- Amount does not exceed remaining balance.
- Approval complete.
- Idempotency key created.
- Ledger impact prepared.
- Chargeback status checked.

---

## 19. Provider processing

States:

```text
approved_internal
submitted_to_provider
processing
completed
failed
cancelled
```

Do not tell the customer “refunded” while only submitted.

---

## 20. Refund failure

- Preserve provider error.
- Verify whether provider actually processed it.
- Do not blindly retry.
- Use same idempotency reference when appropriate.
- Escalate finance.
- Give customer a new update time.

---

## 21. Partial refund

The customer should see:

- Original paid amount.
- refunded component.
- amount.
- remaining order value.
- reason.
- provider status.

The ledger must mirror the decision.

---

## 22. Chargeback

When chargeback opens:

- Freeze duplicate refund action.
- Gather evidence package.
- Review partner payout.
- Record provider deadline.
- Submit through approved provider channel.
- Track won or lost.
- Reconcile.

A chargeback does not automatically prove customer fraud.

---

## 23. Goodwill compensation

Goodwill may be:

- Coupon.
- delivery-fee waiver.
- service-fee refund.
- replacement upgrade.

It must:

- Be voluntary.
- Be recorded.
- Not replace a required refund without consent.
- Stay within role authority.

---

## 24. Partner earning effect

For every refund, calculate:

```text
partner earning preserved
partner earning reversed
partner adjustment
courier adjustment
MPHO revenue reversal
incident cost
```

No silent deduction.

---

## 25. Customer communication

### Request received

> Recibimos tu solicitud y generamos el folio {{case_number}}. Estamos revisando la etapa real del pedido y te actualizaremos antes de {{time}}.

### Refund submitted

> El reembolso por {{amount}} fue enviado al proveedor de pago. Aún está en proceso.

### Refund completed

> El proveedor confirmó el reembolso por {{amount}}. El tiempo para reflejarse depende del banco o método de pago.

### More information needed

> Para revisar el problema necesitamos {{specific_evidence}}. No compartas datos completos de tarjeta.

---

## 26. Closure checklist

- [ ] Customer notified.
- [ ] Provider status final.
- [ ] Ledger posted.
- [ ] Partner effect recorded.
- [ ] Courier effect recorded.
- [ ] Invoice or accounting effect assigned.
- [ ] Order state correct.
- [ ] Incident closed or active.
- [ ] Support case closed.
- [ ] Audit complete.

---

## 27. Metrics

- Cancellation rate.
- refund rate.
- partial-refund rate.
- average review time.
- provider completion time.
- refund failure.
- chargeback rate.
- duplicate refund blocked.
- partner dispute rate.
- goodwill cost.

---

## 28. Definition of done

A cancellation or refund is complete when:

- The operational work stopped or was resolved.
- The financial amount is correct.
- Provider confirmation exists.
- Ledger and earnings reconcile.
- The customer received a clear decision.
- The audit trail is complete.
