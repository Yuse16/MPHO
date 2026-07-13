# 56_INCIDENT_EXCEPTION_AND_RECOVERY_OPERATIONS.md

## 1. Purpose

This document defines the daily operational handling of non-security exceptions and coordinates with the security incident and disaster-recovery documents when severity increases.

It covers:

- Order exceptions.
- partner failures.
- package issues.
- delivery failures.
- provider outages.
- financial mismatches.
- customer safety.
- manual continuity.
- recovery.

---

## 2. Difference between exception and incident

### Exception

A deviation that can be resolved through normal controlled operations.

Examples:

- Partner rejects.
- Stock missing.
- Courier delayed.
- Package arrives one day late.

### Incident

A higher-risk event affecting:

- Security.
- safety.
- money integrity.
- privacy.
- package custody.
- widespread service.
- legal exposure.

An exception may become an incident.

---

## 3. Exception lifecycle

```text
open
→ triaged
→ assigned
→ action_in_progress
→ waiting_external
→ monitoring
→ resolved
→ closed
```

Alternative:

```text
escalated_to_incident
```

---

## 4. Required exception fields

```text
exception_id
order_id
category
severity
source
owner
opened_at
customer_impact
partner_impact
financial_impact
custody_location
next_action
deadline
communications
resolution
root_cause
```

---

## 5. Severity

### E0 Critical

- Active safety risk.
- unknown package custody.
- wrong recipient with private content.
- unauthorized money movement.
- widespread order corruption.

### E1 High

- MPHORA likely to fail.
- lost package suspicion.
- payment mismatch.
- damaged external product.
- failed delivery with perishable item.

### E2 Medium

- Scheduled delay.
- partner rejection.
- stock issue with alternative.
- notification failure.

### E3 Low

- Minor catalog issue.
- non-urgent report correction.

---

## 6. Triage questions

- Is anyone unsafe?
- Is money moving incorrectly?
- Is personal data exposed?
- Where is the package?
- Is the recipient affected?
- Is the delivery window at risk?
- Is an external provider involved?
- Can the normal flow continue safely?
- Does checkout, MPHORA, refund, or payout need to pause?
- Who owns the next action?

---

## 7. Common exception playbooks

### Partner does not respond

- Send reminder.
- Call approved contact.
- expire offer.
- reassign.
- update customer if material.
- record performance event.

### Stock missing

- Release reservation.
- search alternative.
- obtain approval.
- reprice.
- refund if needed.

### Package delayed

- Verify tracking.
- update estimate.
- review event date.
- offer options.
- monitor.

### Package damaged

- Stop preparation.
- preserve evidence.
- return/replace/refund decision.

### Courier unavailable

- Pause MPHORA option.
- use manual fallback.
- update estimate.
- avoid unsupported promise.

### Notification failed

- Retry idempotently.
- use alternate channel.
- create manual contact task for urgent message.

---

## 8. Financial exception

Examples:

- Payment approved but order not active.
- order active without approved payment.
- amount mismatch.
- duplicate provider event.
- refund pending too long.
- payout mismatch.

Actions:

- Pause affected money action.
- compare provider.
- preserve ledger.
- reconcile.
- use adjustment, not deletion.
- escalate fraud or security when suspicious.

---

## 9. Custody exception

If package location is unknown:

1. Freeze order movement.
2. Identify last custody event.
3. Contact current custodian.
4. Review evidence.
5. Search storage and delivery.
6. Open incident if not found promptly.
7. Inform customer with verified facts.

---

## 10. Safety exception

Examples:

- Threatening gift message.
- suspicious package.
- leaking product.
- harassment.
- unsafe delivery location.
- courier threat.

Stop normal operation and escalate immediately.

---

## 11. Provider outage

### Payment

- Pause new checkout.
- preserve carts.
- do not infer approval.
- queue reconciliation.

### WhatsApp

- use in-app or email.
- create urgent call queue.

### Delivery

- pause MPHORA.
- use manual courier.

### AI

- use deterministic HADIA fallback.

### Database

- pause writes.
- use maintenance mode.
- preserve provider events for replay when possible.

---

## 12. Manual continuity log

During outage, record:

```text
time
actor
order
action
reason
customer communication
partner communication
package custody
money effect
reentry status
```

No untracked refund or payout.

---

## 13. Kill switches

Authorized roles may pause:

- Checkout.
- MPHORA.
- External purchases.
- refunds.
- payouts.
- specific partner.
- specific category.
- specific provider.

Every use is audited.

---

## 14. Recovery

After service returns:

1. Confirm security.
2. Confirm database integrity.
3. Process provider events.
4. reconcile payments.
5. reconcile refunds.
6. reconcile deliveries.
7. reenter manual actions.
8. verify no duplicate effect.
9. communicate updates.
10. close or continue exceptions.

---

## 15. Customer update cadence

For active high-impact exceptions, set a next update even when no resolution exists.

Message includes:

- Confirmed facts.
- current package or payment state.
- action underway.
- whether customer must act.
- next update time.

---

## 16. Root-cause review

For repeated or high-impact exception, document:

- What happened.
- Why.
- detection.
- control failure.
- financial impact.
- customer impact.
- partner impact.
- corrective action.
- owner.
- due date.
- regression test.

---

## 17. Exception metrics

- Open exceptions.
- time to owner.
- time to resolution.
- repeated category.
- manual intervention.
- customer impact.
- financial impact.
- provider-caused rate.
- partner-caused rate.
- delivery-caused rate.
- escalation-to-incident rate.

---

## 18. Definition of done

An exception is closed when:

- The underlying order can continue or is safely closed.
- Package custody is known.
- Money is reconciled.
- Customer and partner are informed.
- Corrective action is recorded.
- No unresolved safety or security risk remains.
