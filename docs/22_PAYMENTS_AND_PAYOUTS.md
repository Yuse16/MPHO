# 22_PAYMENTS_AND_PAYOUTS.md

## 1. Purpose

This document defines the payment, refund, earnings, settlement, reconciliation, and partner payout model for MPHO.

It explains:

- How customer payments are created and verified.
- How payment states relate to order states.
- How refunds work.
- How partner earnings are calculated and released.
- How payouts are created and reconciled.
- How financial records remain auditable.
- Which actions require human approval.
- Which financial workflows belong to the MVP.

This document must be read together with:

- `06_BUSINESS_MODEL.md`
- `09_PRICING_AND_COMMISSIONS.md`
- `10_USER_ROLES.md`
- `13_ORDER_LIFECYCLE.md`
- `16_ADMIN_PANEL.md`
- `21_DELIVERY_LOGISTICS.md`
- `25_DATABASE_SCHEMA.md`
- `26_API_AND_INTEGRATIONS.md`
- `27_SECURITY_AND_PRIVACY.md`

---

## 2. Financial principles

MPHO financial workflows must be:

- Auditable.
- Idempotent.
- Server-authorized.
- Provider-verified.
- Currency-aware.
- Traceable by order.
- Traceable by partner.
- Resistant to duplicate webhooks.
- Resistant to silent manual edits.
- Clear to customers and partners.

Customer payment is not the same as MPHO revenue.

Partner earning is not the same as partner payout.

A provider event is not trusted until verified.

---

## 3. Monetary storage

Store all monetary values in integer minor units.

Example:

```text
$1,249.50 MXN
→ 124950
```

Every financial record must include:

```text
amount_minor
currency
type
status
order_id_optional
partner_id_optional
provider_reference_optional
created_at
updated_at
```

Do not use floating-point values for trusted financial calculations.

---

## 4. Financial domains

MPHO should separate these domains:

```text
Customer payment
Order pricing
MPHO revenue
Partner earnings
Courier earnings
Refunds
Payouts
Processing fees
Discount funding
Adjustments
Reconciliation
```

Do not combine all financial activity into one order total field.

---

## 5. Payment provider

The MVP should integrate one approved payment provider.

The payment provider must support, when available:

- Checkout or payment intent.
- Payment status.
- Webhooks.
- Refunds.
- Sandbox.
- Idempotency.
- Transaction reference.
- Error states.
- Reconciliation data.

The provider choice must remain configurable.

No provider-specific logic should be scattered across the application.

---

## 6. Payment creation flow

Recommended flow:

```text
Validated quote
→ customer starts checkout
→ MPHO creates internal payment attempt
→ MPHO creates provider checkout or payment intent
→ customer completes provider flow
→ provider redirects customer
→ provider webhook confirms final state
→ MPHO updates payment
→ MPHO advances order
```

The redirect alone must not mark payment approved.

---

## 7. Payment attempt

Each checkout attempt should create a payment-attempt record.

Suggested fields:

```text
payment_attempt_id
order_id
customer_id
provider
provider_payment_id
amount_minor
currency
status
idempotency_key
checkout_url_optional
expires_at
created_at
approved_at_optional
failed_at_optional
failure_code_optional
raw_event_reference_optional
```

Multiple attempts may exist for one order.

Only one successful payment should become the active approved payment unless a documented multi-payment model exists.

---

## 8. Payment statuses

Official preliminary statuses:

```text
created
pending
under_review
approved
rejected
cancelled
expired
refunded
partially_refunded
chargeback_open
chargeback_won
chargeback_lost
error
```

These must map to customer-safe messages.

---

## 9. Payment validation

Before creating a payment:

- Quote must be valid.
- Customer total must be recalculated server-side.
- Currency must match.
- Order must not already have an approved payment.
- Product availability must still be valid.
- Delivery quote must still be valid.
- External product price must still be valid.
- Required customer consent must exist.
- Order must not be cancelled.

---

## 10. Idempotency

Use idempotency for:

- Payment creation.
- Provider checkout creation.
- Webhook processing.
- Refund creation.
- Earnings creation.
- Payout generation.
- Financial adjustments.

Example key:

```text
payment:create:{order_id}:{quote_version}
```

A repeated request must return the same logical result instead of creating duplicate transactions.

---

## 11. Webhook verification

A payment webhook must:

1. Verify provider signature or authentication.
2. Parse provider event.
3. Confirm event type.
4. Confirm provider payment ID.
5. Confirm amount and currency.
6. Confirm related order.
7. Check idempotency.
8. Store provider event reference.
9. Update payment state.
10. Trigger valid order transition.
11. Create financial records.
12. Send notification.

Invalid webhooks must be rejected and logged.

---

## 12. Payment mismatch

Flag an exception when:

- Provider amount differs from order total.
- Currency differs.
- Payment points to another order.
- Provider says approved but internal state is cancelled.
- Multiple approved payments exist.
- Provider status regresses unexpectedly.
- Refund amount exceeds paid amount.

Do not silently correct a mismatch.

---

## 13. Approved payment side effects

After verified approval:

- Mark payment approved.
- Record approval time.
- Link approved payment to order.
- Lock the customer quote snapshot.
- Create order pricing snapshot.
- Reserve stock when applicable.
- Begin partner assignment.
- Create ledger movements.
- Send customer confirmation.
- Prevent additional normal payment attempts.

Every side effect must be safe to retry.

---

## 14. Rejected or failed payment

When payment fails:

- Keep order unpaid.
- Preserve cart and quote if still valid.
- Allow retry.
- Store failure code.
- Avoid exposing sensitive provider details.
- Notify customer with a clear next action.
- Release temporary reservations when required.

---

## 15. Payment under review

When provider status is uncertain:

- Do not create duplicate checkout automatically.
- Show clear customer state.
- Poll provider only when appropriate.
- Wait for verified webhook.
- Allow support review.
- Expire only according to provider rules.

---

## 16. Order pricing snapshot

When payment is approved, preserve:

```text
product_subtotal
add_ons
preparation_fee
wrapping_fee
personalization_fee
delivery_fee
mpho_service_fee
processing_amount
taxes
discounts
final_total
currency
pricing_rule_versions
quote_id
```

Historical orders must not be recalculated from current prices.

---

## 17. Financial ledger

MPHO should maintain an auditable ledger.

Possible ledger movement types:

```text
customer_payment
product_revenue
partner_payable
courier_payable
mpho_service_revenue
payment_processing_cost
discount_cost
refund_liability
refund_completed
chargeback
partner_adjustment
courier_adjustment
payout
payout_reversal
incident_cost
tax_liability
```

Each movement should include:

```text
ledger_entry_id
account_type
account_id_optional
order_id_optional
partner_id_optional
delivery_id_optional
payment_id_optional
payout_id_optional
direction
amount_minor
currency
status
reason_code
created_at
effective_at
reversed_by_optional
```

---

## 18. Ledger rules

- Never delete posted entries.
- Reverse through new entries.
- Keep currency consistent.
- Link every entry to its source.
- Prevent duplicate postings.
- Use balanced accounting concepts where practical.
- Separate pending from settled values.
- Preserve original provider amounts.
- Record actor for manual adjustments.

---

## 19. Partner earnings

Partner earnings should be represented as detailed earning lines.

Possible types:

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

Each earning line must include:

```text
earning_id
partner_id
order_id
type
description
gross_amount_minor
deduction_amount_minor
net_amount_minor
currency
status
pricing_rule_id_optional
created_at
approved_at_optional
payable_at_optional
paid_at_optional
payout_id_optional
```

---

## 20. Earning statuses

Official statuses:

```text
estimated
pending
approved
payable
included_in_payout
paid
reversed
disputed
adjusted
```

### Estimated

Calculated before fulfillment completes.

### Pending

Work occurred, but release conditions are incomplete.

### Approved

Amount has been reviewed or automatically validated.

### Payable

Eligible for payout.

### Included in payout

Assigned to a payout batch.

### Paid

Payout confirmed.

### Reversed

Cancelled through an auditable reversal.

### Disputed

Under review.

### Adjusted

Corrected by a separate adjustment.

---

## 21. Earning creation timing

Examples:

### Product sale earning

Create as estimated after partner acceptance.

Move to pending after stock confirmation.

Approve after delivery and incident review.

### Package reception earning

Create after actual physical receipt.

Approve after evidence validation.

### Preparation earning

Create when preparation starts or completes according to agreement.

Approve after evidence and delivery review.

### Own delivery earning

Create after delivery assignment.

Approve after proof of delivery.

---

## 22. Earnings release conditions

An earning may become payable when:

- Required work is complete.
- Required evidence exists.
- Delivery completed or approved milestone reached.
- No blocking incident exists.
- Refund responsibility is resolved.
- Amount matches partner agreement.
- Currency is valid.
- No duplicate earning exists.

---

## 23. Partner compensation after cancellation

A cancelled order may still create partner earnings when:

- Partner received and inspected an external package.
- Partner used wrapping materials.
- Personalization already started.
- Preparation was completed.
- Courier handoff already occurred.

The financial effect must depend on:

- Order stage.
- Work performed.
- Evidence.
- Cause.
- Agreement.

Do not reverse all partner earnings automatically.

---

## 24. Refund types

Official refund types:

```text
full
partial
delivery_only
service_only
product_only
manual_adjustment
provider_reversal
```

Every refund must link to the original payment.

---

## 25. Refund statuses

```text
requested
under_review
approved
rejected
submitted_to_provider
processing
completed
failed
cancelled
```

Customer-facing status must reflect provider confirmation.

---

## 26. Refund request flow

```text
Customer or operator requests
→ policy eligibility checked
→ work performed reviewed
→ financial allocation calculated
→ approval level determined
→ refund approved or rejected
→ provider refund created
→ provider webhook confirms
→ ledger updated
→ customer notified
```

---

## 27. Refund amount validation

Before submitting a refund:

- Payment must be approved.
- Refundable balance must be sufficient.
- Amount must be positive.
- Currency must match.
- No duplicate active refund exists.
- Reason must be recorded.
- Required approval must exist.
- Partner and courier effects must be calculated.

---

## 28. Partial refunds

Partial refund examples:

- Missing add-on.
- Delivery fee returned.
- Personalization error.
- Product downgrade.
- Late-delivery compensation.
- Customer-approved substitution difference.

Partial refunds must not exceed remaining refundable amount.

---

## 29. Refund allocation

A refund record should preserve:

```text
customer_refund_amount
mpho_revenue_reversal
partner_earning_reversal
courier_earning_reversal
processing_fee_impact
external_product_recovery
incident_cost
```

The sum of internal effects must reconcile with the customer refund and retained costs.

---

## 30. Chargebacks

Chargeback workflow:

```text
Provider reports chargeback
→ order and payment flagged
→ evidence collected
→ partner and courier earnings reviewed
→ response submitted when allowed
→ provider outcome recorded
→ ledger adjusted
```

Do not automatically deduct partner earnings before responsibility is reviewed unless agreement explicitly allows it.

---

## 31. Payout

A payout is a payment from MPHO or the payment provider to a partner.

A payout is not the same as a partner earning.

One payout may include multiple earning lines.

---

## 32. Payout statuses

```text
draft
under_review
approved
processing
paid
failed
cancelled
reversed
```

A payout must not be marked paid without:

- Provider confirmation.
- Bank reference.
- Or verified manual payment evidence.

---

## 33. Payout batch flow

```text
Select payable earnings
→ validate partner account
→ lock earning lines
→ create payout statement
→ review
→ approve
→ initiate payment
→ record provider or bank reference
→ confirm paid
→ notify partner
→ reconcile
```

---

## 34. Payout statement

A payout statement should include:

- Partner.
- Payout period.
- Currency.
- Product earnings.
- Service earnings.
- Delivery earnings.
- Bonuses.
- Positive adjustments.
- Negative adjustments.
- Net total.
- Included orders.
- Payment reference.
- Payment date.
- Status.

---

## 35. Payout frequency

Potential schedules:

- Weekly.
- Biweekly.
- Monthly.
- Minimum-balance based.
- Manual pilot schedule.

The final schedule must consider:

- Partner cash flow.
- Refund window.
- Payment settlement delay.
- Operational capacity.
- Legal and tax requirements.
- Fraud risk.

---

## 36. Partner payout account

Partner payout-account changes should require:

- Partner admin authentication.
- Reauthentication.
- Verification.
- Notification.
- Cooling period when appropriate.
- Audit event.
- MPHO review for high-risk changes.

Never display full bank details after storage.

---

## 37. Manual payouts in MVP

Manual payout is acceptable for pilot operations if:

- Earning lines are accurate.
- Payout batch exists.
- Payment evidence is uploaded.
- Reference is stored.
- Partner is notified.
- Reconciliation occurs.
- No payout is marked paid before evidence.

Manual payout must not mean spreadsheet-only control.

---

## 38. Payout failure

When a payout fails:

- Preserve included earnings.
- Return them to payable or failed state according to workflow.
- Record reason.
- Notify finance operator.
- Notify partner when appropriate.
- Retry only after validation.
- Avoid duplicate payment.

---

## 39. Reconciliation

Reconciliation compares internal records with external sources.

Reconcile:

- Customer payments.
- Refunds.
- Processing fees.
- Chargebacks.
- Payouts.
- Provider settlements.
- Bank transfers.
- Delivery-provider costs.

---

## 40. Reconciliation statuses

```text
unmatched
matched
partially_matched
mismatch
resolved
ignored_with_reason
```

Every mismatch needs an owner and reason.

---

## 41. Daily reconciliation

Recommended daily checks:

- Approved provider payments without approved internal payment.
- Approved internal payments missing provider confirmation.
- Amount mismatch.
- Currency mismatch.
- Duplicate payment.
- Refund pending too long.
- Payout marked paid without reference.
- Negative partner balance.
- Delivery cost missing.
- Order completed without financial closure.

---

## 42. Financial exceptions

Create exception for:

- Duplicate approved payment.
- Refund failure.
- Provider outage.
- Payout failure.
- Negative contribution margin.
- Missing partner rate.
- Missing delivery cost.
- Currency mismatch.
- Chargeback.
- Reconciliation mismatch.
- Unauthorized adjustment.
- Earnings duplicated.
- Payment approved for cancelled order.

---

## 43. Adjustments

Adjustments must be separate records.

Adjustment fields:

```text
adjustment_id
target_type
target_id
order_id_optional
amount_minor
currency
direction
reason_code
reason_text
requested_by
approved_by_optional
status
created_at
posted_at_optional
```

Never overwrite historical amount silently.

---

## 44. Approval thresholds

Sensitive actions may require elevated approval.

Examples:

- Large refund.
- Negative partner adjustment.
- Payout account change.
- Manual payment-state override.
- Chargeback settlement.
- High-value payout.
- Historical financial correction.

Exact thresholds must be configuration, not hardcoded throughout the code.

---

## 45. Permissions

### Customer

May:

- Pay.
- View own payment.
- Request refund or cancellation.
- View refund status.

May not:

- Mark payment approved.
- Approve refund.
- View partner earnings.

### Partner

May:

- View own earnings.
- View own payouts.
- Dispute an earning.

May not:

- Mark payout paid.
- Change commission.
- Approve refund.

### MPHO operator

May:

- Review.
- Initiate refund request.
- Review earnings.
- Create incident.

May not:

- Complete provider refund manually without confirmation.
- Mark payout paid without evidence.

### MPHO admin

May:

- Approve according to policy.
- Configure rules.
- Create audited adjustments.
- Review reconciliation.

---

## 46. Customer-facing payment messages

Examples:

### Payment approved

> Your payment was approved. MPHO is now assigning the partner responsible for preparing your gift.

### Payment under review

> Your payment is under review. Do not pay again unless MPHO asks you to.

### Refund processing

> Your refund was sent to the payment provider and is still processing.

### Refund completed

> Your refund was confirmed. The time to appear depends on your bank or payment method.

---

## 47. Partner-facing earning messages

Examples:

### Pending

> This earning is pending until the order reaches the required completion milestone.

### Payable

> This earning is ready to be included in your next payout.

### Paid

> This earning was included in payout {{payout_reference}}.

### Disputed

> This earning is under review. You can view the reason and submitted evidence.

---

## 48. Security requirements

Financial systems must:

- Use server-side validation.
- Verify provider signatures.
- Protect provider credentials.
- Separate sandbox and production.
- Encrypt sensitive payout data.
- Enforce least privilege.
- Log every sensitive action.
- Use idempotency.
- Prevent amount changes from browser input.
- Reauthenticate for high-risk actions.
- Avoid payment-card storage.
- Mask sensitive references.

---

## 49. Analytics and metrics

Track:

```text
payment_created
payment_approved
payment_failed
payment_under_review
payment_duplicate_blocked
refund_requested
refund_approved
refund_completed
refund_failed
earning_created
earning_approved
earning_payable
payout_created
payout_paid
payout_failed
reconciliation_mismatch
chargeback_opened
```

Important metrics:

- Payment approval rate.
- Payment failure rate.
- Refund rate.
- Refund completion time.
- Chargeback rate.
- Partner payable balance.
- Payout timeliness.
- Reconciliation mismatch rate.
- Financial exception rate.
- Contribution margin by order.

---

## 50. MVP implementation

The MVP should support:

- One payment provider.
- One currency: MXN.
- Payment attempts.
- Verified payment webhooks.
- Full and partial refunds if provider supports them.
- Detailed order pricing snapshot.
- Partner earning lines.
- Manual or semi-manual payout batches.
- Payout statements.
- Reconciliation queue.
- Financial exception handling.
- Audit logs.
- Idempotent workflows.

Complex automatic split payments are not required initially.

---

## 51. Minimum tests

Test:

- Successful payment.
- Rejected payment.
- Payment under review.
- Duplicate payment webhook.
- Amount mismatch.
- Currency mismatch.
- Payment for expired quote.
- Full refund.
- Partial refund.
- Duplicate refund webhook.
- Refund failure.
- Partner earning creation.
- Earning reversal.
- Cancellation after partner work.
- Payout creation.
- Payout failure.
- Duplicate payout prevention.
- Adjustment.
- Chargeback.
- Reconciliation mismatch.
- Unauthorized financial action.

---

## 52. Definition of done

A financial feature is done when:

- Amounts use minor units.
- Currency is explicit.
- Server validation exists.
- Provider verification exists.
- Idempotency exists.
- Ledger impact is traceable.
- Historical records are preserved.
- Partner and customer effects are clear.
- Permissions are enforced.
- Reconciliation is possible.
- Error and retry behavior exists.
- Tests pass.
- Documentation is updated.

---

## 53. Summary

MPHO financial integrity depends on separating:

```text
what the customer paid
what MPHO earned
what the partner earned
what the courier earned
what was refunded
what was actually paid out
```

Every amount must be reconstructable from auditable records.
