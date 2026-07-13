# 49_DAILY_ORDER_OPERATIONS_RUNBOOK.md

## 1. Purpose

This runbook defines how MPHO operations manages orders every day from payment through completion.

It is the central operating playbook for:

- Operations agents.
- Support agents.
- Partner operations.
- Delivery coordination.
- Financial review.
- Incident response.

---

## 2. Daily operating windows

Before launch, define:

```text
operations opening time
operations closing time
MPHORA cutoff
partner-offer timeout
external-purchase review cutoff
courier-dispatch cutoff
refund-review cutoff
payout-review day
```

All times use the correct city time zone.

---

## 3. Start-of-day checklist

- [ ] Confirm application health.
- [ ] Confirm payment-provider status.
- [ ] Confirm WhatsApp status.
- [ ] Confirm delivery provider or manual courier coverage.
- [ ] Confirm active partners.
- [ ] Confirm MPHORA capacity.
- [ ] Review overnight outbox failures.
- [ ] Review payment mismatches.
- [ ] Review expired deadlines.
- [ ] Review failed deliveries.
- [ ] Review packages expected today.
- [ ] Review refunds pending.
- [ ] Review security alerts.
- [ ] Review backup status.
- [ ] Set incident commander for the day.

---

## 4. Order queues

```text
payment_attention
assignment_pending
partner_offer_expiring
partner_rejected
stock_confirmation_pending
external_purchase_pending
external_product_in_transit
package_expected_today
package_issue
preparation_due
ready_for_pickup
courier_needed
out_for_delivery
failed_delivery
cancel_requested
refund_pending
completion_review
exception
```

Every queue needs:

- Owner.
- Priority.
- Deadline.
- Next action.
- Escalation.

---

## 5. Priority rules

### P0 — Immediate

- Security or fraud.
- Duplicate payment.
- Unauthorized payout risk.
- Lost package.
- Wrong recipient.
- Unsafe product.
- Active data exposure.
- Delivery safety issue.

### P1 — Urgent

- MPHORA deadline risk.
- Courier not assigned.
- Partner offer expiring.
- Product damage.
- Failed delivery.
- Payment mismatch.
- Recipient issue.

### P2 — Standard

- Scheduled order.
- Package tracking.
- Support question.
- Normal refund.
- Catalog correction.

### P3 — Administrative

- Non-urgent profile update.
- Reporting.
- Future product review.

---

## 6. New paid-order flow

```text
verified payment
→ order activated
→ quote snapshot locked
→ stock reservation or external path selected
→ partner candidates evaluated
→ offer sent
→ deadline monitored
```

Operations verifies:

- Amount.
- Currency.
- Delivery zone.
- Delivery date.
- Source type.
- Personalization.
- Customer contact.
- Recipient contact.
- Risk flag.

---

## 7. Partner assignment

### Automatic-assisted flow

- System ranks candidates.
- Operator reviews when required.
- Offer sent.
- Offer expires.
- Next candidate selected.

### Manual flow

Operator records:

- Why partner was chosen.
- Capability.
- Zone.
- Capacity.
- Stock.
- Expected earning.
- Offer deadline.

Only one partner can become responsible.

---

## 8. Partner rejection

When partner rejects:

- Record reason.
- Release temporary partner lock.
- Determine whether stock reservation existed.
- Reassign.
- Review timing.
- Inform customer only when timing materially changes.
- Create partner performance event.
- Do not punish a reasonable rejection automatically.

---

## 9. No partner available

Options:

- Expand approved radius.
- Change to scheduled delivery.
- Offer alternative product.
- Use external-product path.
- Cancel and refund.
- Escalate to operations lead.

Customer approves material changes.

---

## 10. Local stock flow

```text
partner accepts
→ confirms stock
→ reservation becomes active
→ preparation task created
```

If stock is missing:

- Open stock incident.
- Release reservation.
- Search approved alternative.
- Requote if price changes.
- Preserve customer approval.
- Update partner accuracy metric.

---

## 11. External product flow

```text
partner accepts
→ external purchase reviewed
→ exact purchase authorized
→ purchase made
→ tracking monitored
→ partner expects package
→ package received
→ inspection
→ preparation
```

No autonomous external purchase in MVP.

---

## 12. Preparation monitoring

Monitor:

- Start deadline.
- Evidence deadline.
- Courier cutoff.
- Product condition.
- Personalization approval.
- Substitution approval.
- Partner capacity.

Escalation:

```text
reminder
→ partner contact
→ operations lead
→ reassignment if possible
→ customer communication
→ incident
```

---

## 13. Ready-for-pickup flow

Before dispatch:

- Preparation complete.
- Evidence complete.
- Package sealed.
- Delivery address confirmed.
- Recipient mode confirmed.
- Courier quote valid.
- Delivery cost accepted.
- No blocking incident.

---

## 14. Delivery monitoring

Track:

- Courier assigned.
- Arriving to pickup.
- Picked up.
- Out for delivery.
- Delivered.
- Attempt failed.
- Returned.

Do not rely only on provider raw status.

---

## 15. Completion review

Before completion:

- Delivery confirmed.
- Evidence exists.
- Customer issue process handled.
- Partner earning lines created.
- Delivery cost recorded.
- Ledger complete.
- Incident closed or assigned.
- Customer notified.

---

## 16. Exception ownership

Every exception needs:

```text
exception_id
order_id
category
severity
owner
opened_at
next_action
deadline
customer_message
partner_message
financial_hold
resolution
```

No exception without owner.

---

## 17. Customer communication timing

Communicate when:

- Payment confirmed.
- Partner accepted.
- Material delay.
- Substitution needed.
- Package issue.
- Ready.
- Out for delivery.
- Delivered.
- Delivery failed.
- Refund started.
- Refund completed.

Avoid excessive messages.

---

## 18. End-of-day checklist

- [ ] No unowned P0 or P1.
- [ ] Every paid order has a valid next step.
- [ ] Partner offers expiring overnight reviewed.
- [ ] Perishables reviewed.
- [ ] Out-for-delivery orders resolved or escalated.
- [ ] Failed deliveries have a custody location.
- [ ] Payment mismatch queue reviewed.
- [ ] Refund queue reviewed.
- [ ] Financial anomalies reviewed.
- [ ] Outbox backlog reviewed.
- [ ] Security alerts acknowledged.
- [ ] Shift handoff notes created.

---

## 19. Shift handoff

Include:

```text
active critical incidents
orders at risk
packages in custody
external products arriving
couriers active
failed deliveries
customer promises
refund deadlines
security concerns
manual actions not yet entered
```

---

## 20. Daily metrics

- Paid orders.
- Accepted orders.
- Partner rejection.
- Stock failure.
- External-purchase delay.
- Preparation on time.
- Delivery on time.
- Failed delivery.
- Refund requests.
- Manual intervention.
- Exceptions.
- Contribution margin.
- Customer complaints.
- Security alerts.

---

## 21. Definition of done

Daily operations are controlled when:

- Every paid order has one owner and next action.
- No order progresses through chat alone.
- Every material change is recorded.
- Every exception has a deadline.
- Money, custody, and customer communication reconcile.
