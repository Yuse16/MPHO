# 57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md

## 1. Purpose

This runbook defines how MPHO launches a controlled pilot and manages the first 100 real orders.

The objective is to learn safely before scaling.

The first 100 orders are not normal growth mode.

They are an operational validation program.

---

## 2. Pilot scope

Recommended initial scope:

```text
city: Saltillo, Coahuila
zones: selected only
partners: 1 to 3
products: 20 to 40
external products: curated only
currency: MXN
payment provider: one
MPHORA: limited hours and zones
payout: manual or semi-manual
support: human supervised
```

---

## 3. Pilot launch blockers

Do not begin real orders until:

- Partner agreement reviewed.
- customer terms reviewed.
- privacy notice reviewed.
- refund policy reviewed.
- legal entity identified.
- invoice model decided.
- production payment configured.
- RLS tests pass.
- backup restored successfully.
- incident contacts exist.
- support coverage exists.
- courier fallback exists.
- payout process tested.
- prohibited categories disabled.
- one full test order completed.

---

## 4. Capacity limits

Initial controls:

- Maximum daily paid orders.
- maximum partner orders.
- maximum MPHORA orders.
- maximum order value.
- maximum external purchase value.
- limited delivery radius.
- limited operating hours.

Increase only after review.

---

## 5. Order cohorts

### Orders 1–10

- Founder or lead reviews every step.
- One partner preferred.
- Scheduled delivery first.
- No complex external purchase unless testing that flow.
- Full post-order review.

### Orders 11–25

- Add second partner if first flow is stable.
- Test one external product.
- test one failed delivery scenario in controlled form.
- begin limited MPHORA.

### Orders 26–50

- Increase product variety.
- test more personalization.
- use normal support agent with supervision.
- perform first routine payout cycle.

### Orders 51–100

- Operate with standard queues.
- reduce founder intervention.
- measure repeatability.
- decide launch readiness or further pilot.

---

## 6. Required real scenarios

Complete at least:

- Successful local order.
- successful external order.
- successful scheduled delivery.
- successful MPHORA order.
- partner rejection.
- stock mismatch.
- package damage.
- personalization correction.
- courier delay.
- failed delivery.
- cancellation.
- partial refund.
- full refund.
- partner payout.
- provider outage exercise.
- secret rotation exercise.
- restore exercise.

Controlled simulations may be used for unsafe scenarios.

---

## 7. Pilot staffing

Assign:

```text
pilot lead
operations owner
support owner
partner owner
delivery owner
finance owner
security owner
technical on-call
```

One person may cover multiple roles, but responsibilities remain explicit.

---

## 8. Daily pilot meeting

Review:

- Orders yesterday.
- orders today.
- delays.
- incidents.
- customer feedback.
- partner feedback.
- delivery cost.
- margin.
- manual actions.
- security alerts.
- product issues.
- software defects.

Meeting should result in owners and deadlines.

---

## 9. Order review form

For each early order:

```text
order_number
customer_source
product_source
partner
payment_result
assignment_time
preparation_time
delivery_time
customer_messages
manual_interventions
incident
refund
partner_earning
delivery_cost
contribution_margin
customer_feedback
partner_feedback
lessons
```

---

## 10. Customer recruitment

Pilot customers should understand:

- Service is in controlled launch.
- support may contact them.
- real payment and policies apply.
- feedback is welcome.
- no fake review is required.

Do not hide that the service is in pilot when that information affects expectations.

---

## 11. Partner daily check

During pilot:

- Confirm opening.
- confirm staff.
- confirm stock.
- confirm storage.
- confirm package arrivals.
- confirm delivery coverage.
- confirm app access.
- confirm no unresolved incident.

---

## 12. Catalog control

Pilot catalog should be curated manually.

Before each launch day:

- Verify price.
- verify stock.
- verify photo.
- verify preparation time.
- verify category.
- verify delivery eligibility.
- remove uncertain product.

---

## 13. Payment control

For first orders:

- Review every approved payment.
- review provider amount.
- review webhook.
- review order activation.
- review ledger.
- review duplicate prevention.

Do not disable review until evidence supports automation.

---

## 14. External purchase control

For every pilot external purchase:

- Human approval.
- exact product.
- exact seller.
- exact amount.
- assigned receiving point.
- tracking.
- receipt evidence.
- return feasibility.
- financial reconciliation.

---

## 15. Delivery control

For first 25 deliveries:

- Confirm courier manually.
- monitor pickup.
- monitor route.
- confirm proof.
- verify cost.
- review recipient contact.

---

## 16. Customer follow-up

After completion, ask concise questions:

- Was the gift as expected?
- Was the delivery communication clear?
- Did the timing match?
- Was anything confusing?
- Would you use MPHO again?

Do not pressure for a positive review.

---

## 17. Partner follow-up

Ask:

- Was the offer clear?
- Was the earning clear?
- Were instructions complete?
- Was evidence easy?
- Was courier handoff smooth?
- What caused delay?
- What should be automated?

---

## 18. Pilot metrics

### Customer

- Conversion.
- completion.
- satisfaction.
- complaint.
- refund.
- repeat intent.

### Partner

- acceptance.
- stock accuracy.
- preparation time.
- evidence completeness.
- dispute.

### Delivery

- assignment time.
- on-time delivery.
- failure.
- cost.

### Financial

- payment success.
- refund rate.
- contribution margin.
- payout timeliness.
- reconciliation mismatch.

### Technical

- errors.
- webhook failure.
- manual intervention.
- notification failure.
- downtime.

---

## 19. Stop conditions

Pause new orders for:

- Payment duplication.
- cross-customer data access.
- payout fraud risk.
- inability to locate package.
- repeated unsafe delivery.
- repeated catalog misrepresentation.
- unresolved critical vulnerability.
- refund process failure.
- backup or recovery failure.
- no support capacity.
- negative margin without understanding.

---

## 20. Expansion criteria

Increase capacity only when:

- Last cohort completed safely.
- no open critical incident.
- payment and ledger reconcile.
- partner payout works.
- refund works.
- delivery failure has a functioning process.
- stock accuracy is acceptable.
- support response is sustainable.
- unit economics are understood.

---

## 21. First 100 order review

At order 100, produce:

```text
what worked
what failed
customer demand
partner capacity
delivery reliability
financial result
security result
legal gaps
technical debt
manual work
features to remove
features to improve
launch decision
```

Decision:

```text
continue_pilot
limited_public_launch
pause_and_rebuild
stop_project
expand_to_next_zone
```

---

## 22. Definition of done

The first 100 orders validate MPHO only when:

- Real customers received correct gifts.
- Partners completed work and were paid correctly.
- Failed cases were recoverable.
- Privacy and security controls held.
- Unit economics are understood.
- Operations can continue without constant improvisation.
