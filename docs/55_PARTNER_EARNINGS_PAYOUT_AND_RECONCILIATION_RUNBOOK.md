# 55_PARTNER_EARNINGS_PAYOUT_AND_RECONCILIATION_RUNBOOK.md

## 1. Purpose

This runbook defines how MPHO calculates, reviews, approves, pays, disputes, and reconciles partner earnings.

It applies to:

- Product earnings.
- package receipt.
- inspection.
- storage.
- wrapping.
- personalization.
- courier handoff.
- partner delivery.
- bonuses.
- adjustments.

---

## 2. Core rules

- Earning is not payout.
- No earning without a source event.
- No earning in two payouts.
- No payout to an unverified destination.
- No payout marked paid without evidence.
- No silent negative adjustment.
- No retroactive rate change for completed work.
- No same-person creation and final approval for high-risk payout.
- Every amount uses integer minor units and currency.

---

## 3. Earning creation

Each earning line requires:

```text
earning_id
partner_id
order_id
type
source_event
rate_version
gross_amount
deduction
net_amount
currency
status
idempotency_key
created_at
```

---

## 4. Earning types

```text
product_sale
package_reception
package_inspection
temporary_storage
basic_wrapping
premium_wrapping
gift_assembly
personalization
evidence_capture
courier_handoff
own_delivery
bonus
adjustment
```

Only approved capabilities can generate corresponding earnings.

---

## 5. Earning lifecycle

```text
estimated
→ pending
→ approved
→ payable
→ included_in_payout
→ paid
```

Alternative states:

```text
disputed
adjusted
reversed
```

---

## 6. Release conditions

An earning becomes payable only when:

- Work is complete.
- Required evidence exists.
- Order milestone is reached.
- No blocking incident exists.
- Refund responsibility is resolved.
- Rate matches agreement.
- No duplicate earning exists.
- Currency is correct.

---

## 7. Daily earning review

Review:

- New earnings.
- missing earnings.
- duplicates.
- unusually high amounts.
- orders with earnings but no completion milestone.
- cancelled orders with work performed.
- incidents.
- negative adjustments.

---

## 8. Cancellation compensation

When an order cancels, review actual work:

- Package received.
- Package inspected.
- Materials used.
- Personalization started.
- Gift prepared.
- Courier handoff.
- Partner delivery.

Preserve valid earnings according to agreement and evidence.

---

## 9. Payout schedule

Before production, define:

```text
payout_frequency
cutoff_day
review_window
minimum_balance
settlement_delay
refund_hold
first_payout_hold
high_risk_hold
```

The schedule is configuration and agreement data.

---

## 10. Payout-account verification

Required before first payout:

- Partner identity confirmed.
- Beneficiary reviewed.
- Account masked in UI.
- Secure submission.
- MFA.
- Approval.
- Verification method.
- No unresolved account-takeover signal.

---

## 11. Account change

Flow:

```text
partner admin reauthenticates
→ enters new account securely
→ previous and current contacts notified
→ review
→ cooling period
→ verification
→ account active
```

No immediate payout after a high-risk change.

---

## 12. Payout batch creation

1. Select payable earnings.
2. Exclude disputed or held items.
3. Lock selected earnings.
4. Calculate total.
5. Generate statement.
6. Validate destination.
7. Run fraud checks.
8. Submit for approval.

---

## 13. Payout statement

Include:

- Partner.
- period.
- payout ID.
- product earnings.
- service earnings.
- delivery earnings.
- bonuses.
- adjustments.
- deductions.
- net amount.
- currency.
- included orders.
- payment reference.
- status.

---

## 14. Approval

Approver verifies:

- Partner identity.
- payout account.
- amount.
- earnings total.
- recent account change.
- unusual activity.
- open incident.
- refund exposure.
- chargeback exposure.
- tax or invoice requirement.

High-risk payout requires dual approval.

---

## 15. Manual payout MVP

Manual bank transfer is acceptable only when:

- Payout batch exists.
- amount is approved.
- destination is verified.
- bank transfer is made by authorized person.
- reference is stored.
- proof is uploaded privately.
- partner is notified.
- reconciliation is completed.

Do not manage payouts only in a spreadsheet.

---

## 16. Payout failure

When payment fails:

- Do not create a second payout automatically.
- Record failure.
- Confirm bank/provider truth.
- Keep earnings locked or return them safely to payable.
- Verify account.
- notify finance.
- notify partner when appropriate.
- retry through controlled action.

---

## 17. Partner dispute

Partner may dispute:

- Missing earning.
- wrong rate.
- improper deduction.
- missing order.
- payout failure.

The case includes:

- Earning or payout ID.
- order.
- evidence.
- agreement version.
- rate version.
- reviewer.
- decision.

---

## 18. Adjustments

Adjustments are separate entries.

Required:

```text
adjustment_id
target
amount
direction
reason
requested_by
approved_by
created_at
posted_at
```

Never overwrite historical earning.

---

## 19. Reconciliation

Compare:

- Internal payout.
- bank or provider record.
- partner statement.
- earning lines.
- ledger.
- refunds.
- chargebacks.

Statuses:

```text
matched
partially_matched
mismatch
unmatched
resolved
```

---

## 20. Weekly payout checklist

- [ ] Cutoff applied.
- [ ] Payable earnings selected.
- [ ] Disputed earnings excluded.
- [ ] Recent account changes reviewed.
- [ ] High-risk partners reviewed.
- [ ] Totals recalculated.
- [ ] Statements generated.
- [ ] Approvals complete.
- [ ] Transfers completed.
- [ ] References stored.
- [ ] Partners notified.
- [ ] Reconciliation complete.
- [ ] Failures assigned.

---

## 21. Partner communication

### Payable

> Tus ganancias aprobadas por {{amount}} están listas para incluirse en el próximo pago.

### Included

> Tus ganancias fueron incluidas en el pago {{payout_reference}}.

### Paid

> El pago por {{amount}} fue confirmado con la referencia {{reference}}.

### Held

> Una parte del pago está en revisión por {{safe_reason}}. El resto no afectado seguirá el proceso correspondiente.

---

## 22. Metrics

- Payable balance.
- payout amount.
- on-time payout rate.
- failure rate.
- dispute rate.
- adjustment rate.
- reconciliation mismatch.
- account-change holds.
- first-payout review time.

---

## 23. Definition of done

A payout cycle is complete when:

- Every paid amount has a verified destination and reference.
- Every earning appears in one payout at most.
- Ledger and bank/provider records match.
- Partner received a statement.
- Every failure or dispute has an owner.
