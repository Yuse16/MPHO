# 37_FRAUD_RISK_AND_FINANCIAL_CONTROLS.md

## 1. Purpose

This document defines fraud prevention, detection, review, and response for MPHO.

Fraud can occur even when the software works exactly as coded. MPHO must therefore defend against abuse involving customers, partners, couriers, administrators, payment accounts, refunds, payouts, promotions, external purchases, evidence, and collusion.

---

## 2. Principles

- Use layered signals rather than one weak indicator.
- Minimize personal data.
- Preserve explainability.
- Require human review for high-impact cases.
- Separate request, approval, and execution.
- Reconcile provider truth.
- Keep immutable financial history.
- Do not punish partners for provider-caused failures without evidence.
- Treat fraud controls as business rules enforced server-side.

---

## 3. Fraud actors

- Customer using a stolen payment method.
- Customer making a false non-delivery or damage claim.
- Customer abusing promotions or reservations.
- Fake partner.
- Compromised partner administrator.
- Partner falsifying stock, preparation, or evidence.
- Courier falsifying pickup or delivery.
- MPHO insider manipulating refund, adjustment, or payout.
- External seller manipulating price, link, or tracking.
- Collusion between customer, partner, courier, or insider.
- Bot exhausting reservations, messaging, or HADIA budget.

---

## 4. Fraud domains

```text
account fraud
payment fraud
order fraud
promotion fraud
partner onboarding fraud
partner fulfillment fraud
delivery fraud
refund fraud
chargeback fraud
payout fraud
external purchase fraud
insider fraud
AI and automation abuse
```

---

## 5. Risk decision model

A risk decision should produce:

```text
risk_score
risk_level
signals
recommended_action
required_approval
hold_until
review_reason
decision_version
```

Possible actions:

```text
allow
allow_with_monitoring
step_up_authentication
manual_review
hold
reject
disable_account
escalate_security
```

Exact scoring rules must be configurable and versioned.

---

## 6. Customer account signals

Possible signals:

- Newly created account.
- Unverified contact.
- Repeated failed login.
- New device or unusual location.
- Multiple accounts using the same device.
- High order velocity.
- Repeated failed payments.
- Repeated address changes.
- Prior chargeback.
- Promotion abuse.
- High-value first order.

A signal is not proof. Decisions must consider false positives.

---

## 7. Payment risk

Use payment-provider risk signals when available.

Internal controls:

- Amount and currency match.
- One approved payment per order.
- Payment owner and order relation validated.
- Velocity controls.
- Manual review for selected high-value orders.
- Repeated declined attempts monitored.
- Multiple cards or accounts treated as risk signals, subject to privacy limits.
- Provider webhook verification.
- Chargeback monitoring.
- No storage of full card details.

---

## 8. High-risk order review

Review may verify:

- Customer contact.
- Delivery address.
- Recipient.
- Product and personalization.
- Timing.
- Payment-provider status.
- External product source.
- Partner.
- Delivery cost.
- Prior history.
- Restricted or unusual content.

The reviewer records the reason, evidence, decision, and rule version.

---

## 9. Promotion abuse

Controls:

- Server-side promo validation.
- Per-customer and per-campaign limits.
- Minimum order.
- Maximum discount.
- Expiration.
- Funding source.
- Device and velocity signals when appropriate.
- No unlimited anonymous reservation.
- Referral relationship checks.
- Defined reversal after refund or chargeback.

---

## 10. Partner onboarding fraud

Controls:

- Verify business identity.
- Verify responsible person.
- Verify physical address and control of contact channels.
- Review location and product photos.
- Complete test order.
- Review payout account.
- Match beneficiary where legally and operationally appropriate.
- Manually review first payout.
- Restrict capabilities until proven.
- Do not activate MPHORA immediately without operational evidence.

---

## 11. Partner account takeover

Signals:

- Payout-account change.
- New administrator.
- MFA reset.
- New device or location.
- Password recovery followed by payout request.
- Multiple staff removals.
- Large catalog price changes.
- Unusual earning disputes.

Actions:

- Hold payout.
- Reverify through a known independent contact.
- Review sessions and audit.
- Require step-up authentication.
- Notify previous verified contact.

---

## 12. Payout-account change controls

Required:

- Reauthentication.
- Strong MFA.
- Notification to old and current contacts.
- Masked display.
- Manual or provider verification.
- Cooling period.
- Two-person approval for high-risk change.
- No immediate payout to an unverified account.
- Immutable account history.
- Audit.

Recommended initial cooling period:

```text
24 to 48 hours
```

The product owner must approve the final value before production.

---

## 13. Payout controls

- Only payable earnings are included.
- One earning cannot appear in two payouts.
- Total is derived server-side.
- Partner, destination, amount, and currency are shown at approval.
- Creator cannot final-approve a high-risk payout.
- Idempotency is mandatory.
- Provider or bank reference is required.
- Reconciliation is mandatory.
- Failure cannot create a duplicate retry.
- Recent payout-account change creates a hold.
- Partner receives a statement and notification.

---

## 14. Refund fraud

Risks:

- False non-delivery.
- False damage.
- Duplicate refund.
- Refund plus chargeback.
- Refund after partner payout.
- Insider refund to a colluding account.
- Excessive goodwill credit.

Controls:

- Refundable balance.
- Order and payment relation.
- Evidence.
- Reason code.
- Current order state.
- Work already performed.
- Approval threshold.
- Velocity and history.
- Provider confirmation.
- Ledger impact.
- Partner and courier allocation.
- No silent deletion.

---

## 15. Chargebacks

Maintain an evidence package containing only necessary data:

- Order summary.
- Customer confirmation.
- Payment-provider reference.
- Delivery address confirmation.
- Communications.
- Partner acceptance.
- Preparation evidence.
- Pickup proof.
- Delivery proof.
- Recipient confirmation when available.
- Refund history.

Track status, outcome, financial impact, and responsible domain.

---

## 16. Partner fulfillment fraud

Examples:

- False stock confirmation.
- Lower-value substitution.
- Reused preparation photo.
- Missing add-on.
- Marking ready without preparation.
- Moving the customer outside MPHO.

Controls:

- Structured checklist.
- Evidence hash.
- Duplicate-image detection.
- Dynamic order identifier for selected evidence.
- Random review.
- Customer-complaint correlation.
- Inventory reconciliation.
- Incident and capability restriction.
- Financial hold only when justified.

---

## 17. Package receipt fraud

Controls:

- Tracking reference.
- Timestamp and receiver.
- Package and product condition.
- Photos.
- Order label.
- Provider delivery evidence.
- Discrepancy incident.
- Secure storage.
- Expected-versus-received reconciliation.

---

## 18. Delivery fraud

Risks:

- False pickup.
- Courier impersonation.
- False delivery.
- Package theft.
- Reused proof.
- Customer false non-delivery claim.

Controls:

- Courier verification.
- Pickup code or order reference.
- Handoff proof.
- Delivery code or approved proof for selected risk.
- Timestamp and provider event.
- Duplicate-image detection.
- Recipient contact under the selected surprise mode.
- Return workflow.
- Additional verification for high-value orders.

---

## 19. External purchase fraud

Risks:

- Wrong seller.
- Altered price.
- Altered shipping address.
- Attacker-controlled URL.
- Duplicate purchase.
- Diverted refund.
- Fake tracking.

Controls:

- Curated providers.
- Approved URL.
- Server-stored item snapshot.
- Price revalidation.
- Exact transaction authorization.
- Assigned Punto MPHO destination.
- Idempotency.
- Purchase reference.
- Human review during MVP.
- Receipt and return records.
- SSRF protection.

---

## 20. Insider fraud

- Named accounts.
- Least privilege.
- Separation of duties.
- Two-person approval.
- Immutable audit.
- Transaction-level confirmation.
- Export controls.
- Alerts.
- Access reviews.
- Reauthentication.
- No direct ledger editing.
- Independent reconciliation.
- Review unusual working-hour activity.

---

## 21. Collusion indicators

Potential patterns:

- Repeated customer-partner pairing.
- Repeated customer-courier pairing.
- Same device across conflicting roles.
- Repeated refunds involving the same actors.
- Concentrated delivery failures.
- Similar or reused evidence.
- Unexpectedly shared payout destination.
- Suspicious concentration on one external seller.

Use these carefully to avoid privacy violations and unfair conclusions.

---

## 22. Fraud holds

Every hold includes:

```text
reason
owner
amount
currency
affected transaction
start
review deadline
communication
release condition
decision
```

A hold cannot remain indefinitely without review.

---

## 23. Manual review queue

Priority:

```text
active unauthorized money movement
payout-account change
high-value refund
chargeback
high-risk first order
evidence fraud
partner identity issue
delivery theft
promotion abuse
```

Reviewers see only necessary data.

---

## 24. Step-up controls

Step-up may require strong reauthentication, verified contact, passkey or MFA, transaction challenge, human callback, verification transfer, or dual approval.

Email alone is not sufficient for the highest-risk changes.

---

## 25. Fraud data and privacy

- Collect only useful signals.
- Avoid sensitive profiling and discriminatory proxies.
- Document purpose and retention.
- Restrict access.
- Preserve explainability.
- Record rule or model version.
- Review false positives.
- Do not treat one signal as guilt.

---

## 26. Fraud rule versioning

```text
rule_id
description
signals
threshold
action
effective_from
effective_to
owner
version
false_positive_review
```

Historical decisions preserve the rule version.

---

## 27. Metrics

- Payment fraud rate.
- Chargeback rate.
- Refund rate.
- Promotion abuse.
- Partner and delivery fraud incidents.
- Payout holds.
- Payout-account changes.
- False-positive rate.
- Manual-review time.
- Confirmed loss.
- Time to detection.

---

## 28. Required tests

- Stolen-account simulation.
- Multiple failed cards.
- High-value first order.
- Duplicate refund.
- Refund plus chargeback.
- Payout after account change.
- One earning in two payout attempts.
- Reused evidence.
- False delivery.
- Duplicate external purchase.
- Promotion reuse.
- Admin self-approval.
- Collusion pattern review.
- AI request for unauthorized discount or refund.

---

## 29. Production minimum

Before launch:

- Payment-provider risk tools configured.
- Refund and payout thresholds defined.
- Payout-account change workflow implemented.
- Cooling period implemented.
- Dual approval implemented where required.
- Chargeback evidence collection implemented.
- Evidence-fraud review available.
- High-risk order queue available.
- Partner identity review complete.
- Daily reconciliation operational.
- Fraud incident playbooks tested.

---

## 30. Normative references

- OWASP Business Logic Security Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html
- OWASP Transaction Authorization Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
- OWASP API Security Top 10 2023  
  https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- PCI DSS v4.0.1 Document Library  
  https://www.pcisecuritystandards.org/document_library/
- PCI DSS overview  
  https://www.pcisecuritystandards.org/standards/pci-dss/
