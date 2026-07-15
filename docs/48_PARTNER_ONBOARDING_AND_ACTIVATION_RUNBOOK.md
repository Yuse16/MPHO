# 48_PARTNER_ONBOARDING_AND_ACTIVATION_RUNBOOK.md

## 1. Purpose

This runbook defines the operational process for evaluating, approving, activating, training, monitoring, pausing, suspending, and offboarding a Punto MPHO.

It applies to:

- Local gift stores.
- Florists.
- Printing and personalization shops.
- Package receiving points.
- Wrapping and assembly partners.
- Own-delivery partners.
- Multi-capability partners.

Use together with:

- `08_PARTNER_PROGRAM.md`
- `10_USER_ROLES.md`
- `12_PARTNER_JOURNEY.md`
- `15_PARTNER_APP.md`
- `17_CATALOG_AND_INVENTORY.md`
- `31_THREAT_MODEL_AND_ABUSE_CASES.md`
- `37_FRAUD_RISK_AND_FINANCIAL_CONTROLS.md`
- `43_PARTNER_AGREEMENT_REQUIREMENTS.md`

---

## 2. Operational principle

No partner is active only because it:

- Completed a form.
- Has a physical location.
- Uploaded product photos.
- Created an account.
- Accepted a digital agreement.

Activation requires evidence that the partner can perform the exact approved capabilities safely and consistently.

---

## 3. Partner lifecycle

```text
lead
→ contacted
→ interested
→ application_started
→ application_submitted
→ identity_review
→ location_review
→ capability_review
→ agreement_pending
→ training_pending
→ test_order_pending
→ approved
→ active
→ monitored
→ paused
→ suspended
→ offboarding
→ closed
```

---

## 4. Required application data

### Business data

- Public business name.
- Legal or tax name when required.
- RFC when required.
- Main contact.
- Phone.
- Email.
- Address.
- Opening hours.
- Social links.
- Product categories.
- Years in operation.
- Number of staff.
- Workspace.
- Storage capacity.
- Delivery capability.
- Personalization capability.

### Verification data

- Identity of responsible representative.
- Proof of control of location.
- Business documentation required by legal review.
- Payout account information through the secure flow.
- Product or service evidence.
- Agreement acceptance.

### Security data

- Authorized partner administrators.
- Authorized partner operators.
- MFA enrollment.
- Emergency contact.

Collect only what the approved legal and privacy model requires.

---

## 5. Initial screening

The onboarding operator reviews:

- Is the business real?
- Is the address valid?
- Does the public identity match the applicant?
- Are the products compatible with MPHO?
- Is the location suitable for package custody and courier access?
- Are counterfeit, prohibited, or unsafe products visible?
- Is the partner willing to use MPHO operating rules?
- Is the partner willing to protect recipient data?
- Can the partner respond during agreed hours?
- Can the partner provide evidence through MPHO Aliados?

Result:

```text
continue
request_more_information
reject
escalate_security
```

Every result requires a reason code and reviewer.

---

## 6. Location verification

Minimum verification:

- Confirm full address.
- Confirm visible business identity.
- Confirm operating hours.
- Confirm courier access.
- Confirm package storage.
- Confirm preparation area.
- Confirm internet and mobile connectivity.
- Confirm basic cleanliness and order.
- Confirm no obvious safety hazard.
- Confirm customer and recipient data will not be displayed publicly.

Possible methods:

- In-person visit.
- Live video review.
- Photo and video evidence.
- Public business verification.
- Test courier visit.

The method depends on risk and capabilities.

---

## 7. Capability assessment

Capabilities must be approved individually:

```text
local_product_sales
stock_management
package_receiving
package_inspection
temporary_storage
basic_wrapping
premium_wrapping
gift_assembly
printing
personalization
qr_media
courier_handoff
own_delivery
returns_handling
perishable_handling
mphora
```

Each capability record includes:

- Status.
- Test evidence.
- Reviewer.
- Effective date.
- Review date.
- Restrictions.

Possible status:

```text
approved
approved_with_restrictions
pending_test
rejected
suspended
```

---

## 8. Category review

For every product category:

- Confirm category is enabled by MPHO.
- Confirm partner has authority and ability.
- Confirm storage.
- Confirm labeling.
- Confirm delivery requirements.
- Confirm return and failed-delivery behavior.
- Confirm pricing.
- Confirm photo accuracy.

Restricted categories remain disabled until specific review is complete.

---

## 9. Agreement stage

Before activation:

- Correct legal entity selected.
- Correct partner type selected.
- Capability schedule attached.
- Earnings schedule attached.
- Data-protection obligations included.
- Security obligations included.
- Package-custody rules included.
- Payout workflow included.
- Suspension and termination included.
- Agreement version stored.
- Acceptance evidence stored.

No real order before valid acceptance.

---

## 10. Account creation

### Partner administrator

May:

- Manage staff.
- Manage catalog within permissions.
- View earnings.
- Request payout-account change.
- View partner settings.

Requires:

- Named account.
- Verified contact.
- MFA.
- Training.
- Secure invitation.

### Partner operator

May:

- Accept or reject orders.
- Confirm stock.
- Receive packages.
- Upload evidence.
- Mark ready.
- Complete handoff.

May not:

- Change payout account.
- Approve staff.
- Access another partner.
- Approve own financial adjustment.

---

## 11. Training modules

### Module 1 — MPHO model

- What MPHO is.
- What Punto MPHO means.
- Local versus external products.
- Scheduled versus MPHORA.

### Module 2 — Order lifecycle

- Offer.
- Acceptance.
- Stock.
- Package.
- Preparation.
- Evidence.
- Handoff.
- Delivery.
- Incident.

### Module 3 — Privacy and security

- Recipient data.
- No marketing.
- No screenshots unless authorized.
- No direct payment.
- No account sharing.
- Suspicious links.
- Account compromise.

### Module 4 — Quality

- Product verification.
- Wrapping.
- Personalization.
- Evidence.
- Substitution.
- Incident reporting.

### Module 5 — Financial

- Earnings.
- Payable status.
- Payout.
- Adjustments.
- Disputes.

### Module 6 — Failed operations

- Damaged package.
- Missing product.
- Late preparation.
- Courier issue.
- Recipient refusal.
- Failed delivery.
- Security incident.

Training completion must be recorded.

---

## 12. Test order

No partner becomes active without at least one controlled test.

```text
offer received
→ accepted
→ stock or package confirmed
→ preparation checklist
→ evidence upload
→ ready
→ courier handoff
→ simulated delivery
→ earning appears
```

Evaluate:

- Response time.
- Accuracy.
- App use.
- Evidence quality.
- Packaging.
- Privacy.
- Handoff.
- Incident reporting.

---

## 13. Activation decision

Checklist:

- [ ] Identity verified.
- [ ] Location verified.
- [ ] Agreement accepted.
- [ ] Payout account pending or verified according to policy.
- [ ] MFA active.
- [ ] Training complete.
- [ ] Test order passed.
- [ ] Capabilities approved.
- [ ] Product categories approved.
- [ ] Catalog reviewed.
- [ ] Inventory validated.
- [ ] Emergency contact confirmed.
- [ ] Support channel confirmed.
- [ ] No unresolved critical risk.

Decision:

```text
active
active_with_restrictions
test_extended
rejected
```

---

## 14. First 30-day monitoring

- Limit daily orders.
- Limit high-value orders.
- Limit MPHORA.
- Review first five real orders.
- Review all incidents.
- Review stock accuracy.
- Review evidence.
- Review delivery handoff.
- Review customer complaints.
- Review first payout completely.
- Confirm payout account independently.

---

## 15. Partner scorecard

Track:

```text
offer_response_time
acceptance_rate
stock_accuracy
preparation_time
evidence_completeness
handoff_accuracy
incident_rate
customer_issue_rate
delivery_issue_rate
privacy_incidents
security_incidents
payout_disputes
```

Do not use a single score as the sole basis for a severe decision.

---

## 16. Pause

Partner may self-pause or MPHO may pause:

- New orders.
- MPHORA only.
- Specific categories.
- Specific capability.
- Entire account.

Pause does not remove responsibility for active orders.

The system records:

- Reason.
- Scope.
- Start.
- Expected review.
- Active-order plan.

---

## 17. Suspension

Immediate suspension may be used for:

- Fraud.
- Counterfeit.
- Privacy incident.
- Account compromise.
- Package loss.
- Repeated serious stock error.
- Unsafe operation.
- Unauthorized payment request.
- Refusal to cooperate with an active incident.

Suspension requires:

- Active-order review.
- Package-custody review.
- Data-access revocation.
- Payout hold limited to the affected risk.
- Written reason.
- Review path.

---

## 18. Offboarding

- [ ] Stop new orders.
- [ ] Resolve active orders.
- [ ] Return or transfer packages.
- [ ] Reconcile inventory.
- [ ] Remove MPHO signage.
- [ ] Revoke all accounts.
- [ ] Revoke integrations.
- [ ] Complete final payout review.
- [ ] Preserve agreement and audit history.
- [ ] Confirm customer and recipient data deletion or restriction.
- [ ] Remove public listing.
- [ ] Document reason.
- [ ] Close partner status.

---

## 19. Required records

```text
partner_application
verification
location_review
capability_review
training
test_order
agreement
payout_account
activation_decision
scorecard
incidents
pauses
suspensions
offboarding
```

---

## 20. Definition of done

A partner is operationally activated when:

- The partner can perform assigned tasks correctly.
- The app permissions match the approved role.
- The partner passed a test order.
- Security and privacy controls are active.
- Earnings and payout rules are understood.
- MPHO has a fallback if the partner fails.
