# 53_DELIVERY_DISPATCH_HANDOFF_AND_FAILED_DELIVERY_RUNBOOK.md

## 1. Purpose

This runbook defines dispatch, courier assignment, pickup, chain of custody, delivery, proof, failed delivery, reattempt, return, loss, damage, and closure.

---

## 2. Dispatch prerequisites

A delivery may be requested only when:

- Order is ready.
- Correct partner is responsible.
- Package is sealed.
- Required evidence exists.
- Address is confirmed.
- Zone is supported.
- Recipient mode is known.
- Delivery quote is valid.
- No blocking incident exists.
- Product handling requirements are known.

---

## 3. Delivery modes

```text
integrated_provider
manual_courier
partner_own_delivery
scheduled_route_future
```

Every delivery record includes the mode.

---

## 4. Courier assignment

Record:

- Provider or courier.
- Assignment time.
- pickup estimate.
- delivery estimate.
- cost.
- customer price.
- order reference.
- courier verification method.
- handling requirements.

A retry must not create a duplicate courier request.

---

## 5. Courier verification at pickup

Partner checks:

- Provider or courier identity.
- Order reference.
- pickup code or approved verification.
- package count.
- destination label.
- vehicle suitability when relevant.

Do not hand a gift to a person who only knows the recipient name.

---

## 6. Handoff

The partner and courier record:

- Time.
- package condition.
- package count.
- order reference.
- courier identity or provider ID.
- partner operator.
- handling note.
- evidence.

Custody changes only after this event.

---

## 7. Pickup problem

Examples:

- Courier does not arrive.
- Wrong courier.
- Courier refuses package.
- Package not ready.
- Vehicle unsuitable.
- provider cancels.

Procedure:

```text
record reason
→ preserve package custody
→ cancel or correct provider request
→ reassign
→ update estimate
→ notify customer if material
```

---

## 8. Out-for-delivery monitoring

Monitor:

- Provider status.
- Courier contact through approved channel.
- delivery window.
- recipient contact.
- route exception.
- package condition.

MPHORA orders receive higher urgency, but safety rules remain unchanged.

---

## 9. Recipient contact

Follow selected mode:

### Full surprise

Use discreet language and reveal only necessary details.

### Discreet coordination

Confirm presence without gift details.

### Scheduled and disclosed

Confirm delivery normally.

Courier may not use recipient contact for personal messages or marketing.

---

## 10. Successful delivery

Record:

- Delivered time.
- receiver type.
- proof method.
- recipient or authorized receiver.
- condition.
- provider event.
- notes.

Proof options:

- One-time code.
- Signature.
- recipient name.
- authorized photo.
- provider confirmation.

Do not photograph people unnecessarily.

---

## 11. Alternative receiver

Delivery to another person is allowed only when:

- Customer authorized it.
- Recipient authorized it.
- building policy supports it.
- category permits it.
- proof is recorded.

High-value or restricted items may prohibit this.

---

## 12. Failed-delivery procedure

1. Record exact reason.
2. Record time.
3. Preserve location or provider event.
4. Attempt approved contacts.
5. Wait only within allowed limit.
6. Protect courier safety.
7. Determine reattempt or return.
8. Inform operations.
9. Inform customer.
10. Preserve package condition.

---

## 13. Failed-delivery reason codes

```text
recipient_absent
recipient_unreachable
customer_unreachable
incorrect_address
incomplete_address
access_denied
unsafe_location
recipient_refused
age_verification_failed
courier_issue
partner_delay
vehicle_issue
weather
package_damage
provider_outage
other
```

---

## 14. Reattempt decision

Before reattempt:

- Package location confirmed.
- Package condition confirmed.
- Product remains viable.
- New window agreed.
- Cost calculated.
- Responsibility classified.
- Customer approves charge when applicable.
- New delivery created idempotently.

No automatic charge.

---

## 15. Return to partner

At return:

- Verify courier.
- Record time.
- Record condition.
- Photograph when required.
- Place in secure storage.
- Update custody.
- Notify operations.
- Start decision deadline.

---

## 16. Perishable item after failure

Operations determines:

- Remaining safe life.
- storage.
- reattempt feasibility.
- replacement.
- refund.
- disposal authorization.

Never reattempt a product that is no longer safe or acceptable.

---

## 17. Recipient refusal

Courier:

- Does not pressure.
- Does not reveal unnecessary buyer data.
- Records refusal.
- Returns package or follows approved instruction.

Operations contacts the customer and applies policy.

---

## 18. Address correction during delivery

Do not redirect informally.

Required:

- Customer verification.
- risk review.
- provider approval.
- new price if any.
- new timing.
- audit.

High-risk redirect may require return to partner.

---

## 19. Lost package

1. Confirm last custody event.
2. Contact provider or courier.
3. Preserve tracking and evidence.
4. Notify incident owner.
5. Inform customer with verified facts.
6. Determine replacement or refund.
7. Start provider or insurance claim.
8. Review fraud.
9. Review similar events.

---

## 20. Damaged package in delivery

- Stop unsafe delivery.
- Capture evidence.
- protect product.
- notify operations.
- classify damage.
- inform customer.
- determine reprepare, replace, reattempt, or refund.

---

## 21. Harassment or safety

The delivery stops when:

- Recipient reports harassment.
- Courier feels unsafe.
- Threat exists.
- suspicious package exists.
- unlawful content is discovered.

Escalate to security and operations.

---

## 22. Delivery closure

Close when:

- Delivered and proof valid.
- Failed and returned with custody confirmed.
- Lost incident assigned.
- Damage incident assigned.
- Customer notified.
- Cost recorded.
- Provider status reconciled.

---

## 23. Delivery metrics

- Assignment time.
- pickup wait.
- delivery duration.
- on-time rate.
- failed-attempt rate.
- reattempt rate.
- return rate.
- loss.
- damage.
- proof rejection.
- cost variance.
- MPHORA success.

---

## 24. Definition of done

A delivery is operationally complete when:

- Custody is known.
- Final status is verified.
- Proof or failed-attempt evidence exists.
- Customer communication matches reality.
- Costs and incidents are recorded.
