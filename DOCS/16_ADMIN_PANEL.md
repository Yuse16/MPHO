# 16_ADMIN_PANEL.md

## 1. Purpose

This document defines the MPHO administration panel.

It describes:

- Operational supervision.
- Exception handling.
- Partner management.
- Catalog review.
- Orders.
- Deliveries.
- Payments.
- Earnings.
- Payouts.
- Refunds.
- Zones.
- Pricing.
- Users.
- Security.
- Audit.
- Reporting.
- MVP requirements.

The admin panel must prioritize operational control and exceptions.

---

## 2. Product objective

The admin panel should help MPHO operators answer:

1. Which orders need attention now?
2. Why are they blocked?
3. Who is responsible?
4. What action is allowed?
5. What is the customer impact?
6. What is the financial impact?
7. What evidence exists?
8. What deadline is approaching?

Healthy orders should not dominate the interface.

---

## 3. Admin roles

Primary roles:

- MPHO operator.
- MPHO administrator.
- Specialized finance reviewer in future.
- Specialized security reviewer in future.

Role permissions must follow `10_USER_ROLES.md`.

---

## 4. Main navigation

Recommended sections:

```text
Operations
Orders
Exceptions
Partners
Catalog
Inventory
Deliveries
Payments
Partner earnings
Payouts
Refunds
Customers
Zones
Pricing
Notifications
Reports
Audit
Settings
```

Operators should see only permitted sections.

---

## 5. Operations dashboard

The dashboard should show actionable queues.

### Critical

- Payment mismatch.
- High-risk security event.
- Delivery failed.
- Product damaged.
- Refund overdue.
- Courier lost contact.
- Order deadline missed.

### Urgent

- Partner offer expiring.
- Partner not responding.
- Package arrival overdue.
- Preparation deadline approaching.
- No courier assigned.
- Customer action pending.

### Normal

- Catalog review.
- Partner application.
- Stock review.
- Payout preparation.
- Non-blocking support cases.

---

## 6. Dashboard metrics

Useful metrics:

- Active orders.
- Orders by state.
- Open exceptions.
- Orders at deadline risk.
- Partner acceptance time.
- Preparation time.
- Delivery success.
- Payment success.
- Refund pending.
- Payable partner balance.
- Contribution margin.
- MPHORA success.
- Orders without manual intervention.

Avoid metrics without operational action.

---

## 7. Exception queue

Each exception card should show:

- Severity.
- Order number.
- Category.
- Current state.
- Customer impact.
- Financial impact.
- Responsible actor.
- Time open.
- Resolution deadline.
- Assigned operator.

Filters:

- Severity.
- Category.
- City.
- Zone.
- Partner.
- State.
- Assigned operator.
- Age.
- Financial impact.

---

## 8. Exception detail

Sections:

### Summary

- What happened.
- Why it is blocking.
- Current state.
- Recommended next step.

### Order

- Items.
- Recipient.
- Partner.
- Delivery.
- Payment.

### Timeline

- State history.
- Notifications.
- Evidence.
- Actor actions.

### Financial impact

- Customer total.
- Partner earnings.
- Courier cost.
- Refund risk.
- Incident cost.

### Actions

- Request evidence.
- Contact customer.
- Contact partner.
- Reassign.
- Approve substitution.
- Cancel.
- Initiate refund.
- Escalate.
- Resolve.

Actions must depend on role and state.

---

## 9. Order list

Filters:

- State.
- Payment.
- Delivery.
- Product source.
- Partner.
- City.
- Zone.
- Customer.
- Date.
- Exception.
- MPHORA.
- External product.
- High value.

Columns:

- Order number.
- Customer.
- Recipient area.
- Partner.
- Main product.
- State.
- Payment.
- Delivery.
- Deadline.
- Total.
- Exception indicator.

---

## 10. Order detail

Recommended sections:

### Overview

- Order number.
- Customer.
- Recipient.
- Address.
- Partner.
- Delivery.
- Total.
- Current state.
- Created time.
- Required date.

### Items

- Product.
- Source.
- Variant.
- Quantity.
- Add-ons.
- Personalization.
- Pricing.

### State history

- From.
- To.
- Actor.
- Time.
- Reason.
- Metadata.

### Partner tasks

- Offer.
- Acceptance.
- Stock.
- Receipt.
- Preparation.
- Evidence.
- Ready.
- Handoff.

### Payment

- Provider.
- Amount.
- Status.
- Events.
- Refunds.

### Financials

- Product cost.
- Partner earnings.
- Courier cost.
- MPHO revenue.
- Discounts.
- Contribution margin.

### Delivery

- Provider.
- Courier.
- Pickup.
- Tracking.
- Attempts.
- Evidence.

### Incidents

- Open.
- Resolved.
- Responsibility.
- Financial effect.

### Support

- Messages.
- Cases.
- Customer approvals.

---

## 11. Manual order actions

Allowed actions may include:

- Revalidate quote.
- Reassign partner.
- Expire partner offer.
- Request stock confirmation.
- Request evidence.
- Add internal note.
- Open incident.
- Initiate cancellation.
- Initiate refund.
- Request customer approval.
- Correct non-financial metadata.
- Retry notification.
- Retry safe integration.

High-risk actions require elevated approval.

---

## 12. Prohibited direct edits

The admin panel must not allow silent direct editing of:

- Historical order total.
- Payment provider status.
- Completed refund.
- Paid payout.
- Audit logs.
- State history.
- Partner earnings already paid.
- Delivery proof.

Corrections must use:

- Adjustment.
- Override with reason.
- New audit event.
- Provider confirmation.
- Formal transition.

---

## 13. Partner management

Partner list should show:

- Name.
- City.
- Zone.
- Status.
- Capabilities.
- Active orders.
- Response time.
- Incident rate.
- Payable balance.
- Last activity.

Actions:

- Review application.
- Request information.
- Approve.
- Restrict capability.
- Pause.
- Suspend.
- Reactivate.
- Close.
- View agreement.
- View catalog.
- View earnings.
- View incidents.

---

## 14. Partner application review

Review sections:

- Identity.
- Business information.
- Location.
- Hours.
- Capabilities.
- Photos.
- Product categories.
- Package reception.
- Delivery ability.
- Payment information.
- Agreement.
- Training.
- Test order.

Decision:

```text
Approve
Approve with restrictions
Request information
Waitlist
Reject
```

Every decision needs a reason.

---

## 15. Capability management

Admin may approve capabilities individually.

Example:

```text
sell_local_products: approved
receive_external_packages: approved
wrap_basic: approved
wrap_premium: pending
deliver_locally: restricted
```

Changes should affect future offers.

Do not automatically cancel active orders unless safety requires it.

---

## 16. Catalog review

Catalog review queue should show:

- New submissions.
- Changed products.
- Image issues.
- Price changes.
- Expired verification.
- Restricted category.
- Duplicate listing.
- Stock accuracy concern.

Review actions:

- Approve.
- Request changes.
- Reject.
- Pause.
- Publish.
- Archive.

---

## 17. Product detail admin

Admin fields:

- Source type.
- Partner.
- Category.
- Product data.
- Images.
- Price rules.
- Stock mode.
- Preparation.
- Zones.
- Personalization.
- Add-ons.
- Restrictions.
- MPHORA eligibility.
- Last verified.
- Audit history.

---

## 18. Inventory supervision

Admin inventory views:

- Low stock.
- Negative availability anomaly.
- Stale stock.
- Overselling.
- Reservation mismatch.
- Repeated partner correction.
- External product marked as stock incorrectly.

Admin should not manually adjust partner stock without an auditable reason.

---

## 19. Delivery operations

Delivery queue should show:

- Ready without courier.
- Courier assigned.
- Pickup late.
- Out for delivery.
- Attempt failed.
- Returned.
- Delivered without proof.
- Cost mismatch.

Actions:

- Assign courier.
- Change provider.
- Retry request.
- Contact courier.
- Correct delivery metadata.
- Open incident.
- Approve reattempt.
- Return to partner.

---

## 20. Payment operations

Payment screen should show:

- Payment provider.
- Payment ID.
- Order.
- Amount.
- Currency.
- Status.
- Provider events.
- Internal state.
- Mismatch.
- Refunds.
- Chargeback.

The system should flag:

- Paid provider / unpaid order.
- Unpaid provider / paid order.
- Duplicate payment.
- Amount mismatch.
- Currency mismatch.
- Repeated webhook.
- Missing webhook.

---

## 21. Refund operations

Refund queue:

- Requested.
- Under review.
- Approved.
- Sent to provider.
- Completed.
- Failed.
- Overdue.
- Disputed.

Refund detail:

- Original payment.
- Reason.
- Amount.
- Customer impact.
- Partner impact.
- Courier impact.
- MPHO impact.
- Approval history.
- Provider response.

---

## 22. Partner earnings

Admin earnings screen:

- Estimated.
- Pending.
- Approved.
- Payable.
- Paid.
- Reversed.
- Disputed.
- Adjusted.

Filters:

- Partner.
- Order.
- Earning type.
- State.
- Date.
- City.
- Payout.

Admin actions:

- Review.
- Approve.
- Dispute.
- Create adjustment.
- Add note.
- Include in payout.

---

## 23. Payouts

Payout workflow:

```text
Select payable earnings
→ validate partner payment account
→ generate statement
→ approve
→ send payment
→ record reference
→ notify partner
→ reconcile
```

Payout statuses:

```text
draft
under_review
approved
processing
paid
failed
cancelled
```

No payout should be marked paid without reference or provider confirmation.

---

## 24. Pricing administration

Pricing sections:

- Global rules.
- City rules.
- Zone rules.
- Partner agreements.
- Category rules.
- Product rules.
- Service rates.
- Delivery rules.
- Campaigns.
- Overrides.

Every rule should include:

- Scope.
- Priority.
- Effective date.
- End date.
- Currency.
- Author.
- Reason.
- Version.

---

## 25. Zone administration

Zone configuration:

- City.
- Name.
- Postal codes.
- Map boundaries.
- Active status.
- Delivery coverage.
- MPHORA status.
- Base delivery rules.
- Partner density.
- Operating hours.
- Cutoffs.

A zone should not be activated without operational coverage.

---

## 26. Customer administration

Admin customer view should be limited.

May include:

- Customer profile.
- Orders.
- Support cases.
- Refunds.
- Security alerts.
- Consent.
- Account status.

Do not expose more personal data than required.

Actions:

- Assist.
- Disable account for security.
- Request verification.
- Process privacy request.
- View audit trail.

---

## 27. Support cases

Support queue:

- New.
- Assigned.
- Waiting for customer.
- Waiting for partner.
- Waiting for provider.
- Resolved.
- Closed.

Case categories:

- Payment.
- Product.
- Personalization.
- Delivery.
- Partner.
- Cancellation.
- Refund.
- Account.
- Security.

The case should link to all related resources.

---

## 28. Notification operations

Admin may:

- View notification history.
- Retry failed transactional notification.
- Review template.
- Pause non-critical campaign.
- View provider status.
- Inspect delivery result.

Do not allow editing already sent messages.

---

## 29. Audit logs

Audit filters:

- Actor.
- Role.
- Action.
- Resource.
- Date.
- Result.
- IP or session.
- High-risk flag.

Sensitive actions should be easy to find.

Audit records must be immutable to normal admins.

---

## 30. Internal notes

Internal notes should:

- Be clearly marked internal.
- Include author and timestamp.
- Be linked to resource.
- Avoid unnecessary sensitive data.
- Never be shown to customer or partner unless explicitly converted to a message.

---

## 31. Search

Global admin search may support:

- Order number.
- Payment ID.
- Refund ID.
- Partner.
- Customer.
- Phone.
- Email.
- Courier reference.
- External tracking.
- Payout ID.

Search access must respect role.

---

## 32. Reports

MVP reports:

- Orders by state.
- Orders by city and zone.
- On-time delivery.
- Partner acceptance.
- Preparation time.
- Incidents.
- Refunds.
- Partner earnings.
- Payouts.
- Contribution margin.
- Manual intervention rate.
- MPHORA performance.

Reports should use source-of-truth data.

---

## 33. Alerts

Configurable alerts:

- Payment mismatch.
- Negative margin.
- No partner accepted.
- Partner offer expired.
- Package delayed.
- Preparation overdue.
- No courier.
- Delivery failed.
- Refund overdue.
- Payout failed.
- Repeated partner incident.
- Security anomaly.

Alerts must avoid duplicate noise.

---

## 34. Feature flags

Admin may manage approved feature flags.

Examples:

- HADIA enabled.
- MPHORA enabled.
- External products enabled.
- Partner own delivery enabled.
- PWA notifications enabled.

Feature flags must:

- Be environment-aware.
- Be auditable.
- Have default behavior.
- Avoid financial inconsistency.

---

## 35. Configuration protection

High-risk settings should require:

- Elevated role.
- Reauthentication.
- Reason.
- Confirmation.
- Audit event.
- Optional second approval.

Examples:

- Global commission.
- Refund threshold.
- Partner payout account.
- Payment integration.
- Security role.
- Restricted category.

---

## 36. Admin error states

Required:

- Stale data.
- State conflict.
- Provider unavailable.
- Permission denied.
- Action already processed.
- Invalid financial state.
- Missing evidence.
- Reauthentication required.
- Concurrent update.

The panel should not hide failed actions.

---

## 37. Performance

The admin panel should:

- Paginate large lists.
- Filter on server.
- Use indexed searches.
- Load summaries before details.
- Avoid loading sensitive data unnecessarily.
- Support background refresh.
- Show last updated time.

---

## 38. Accessibility

Requirements:

- Keyboard operation.
- Table accessibility.
- Clear status text.
- Non-color-only severity.
- Visible focus.
- Screen-reader labels.
- Accessible dialogs.
- Error summaries.
- Large enough controls.

---

## 39. Security

The admin panel must:

- Require strong authentication.
- Support MFA when available.
- Use session timeout.
- Enforce role and scope.
- Log sensitive access.
- Avoid exposing secrets.
- Protect downloads.
- Mask sensitive data.
- Restrict exports.
- Rate-limit login and high-risk actions.

---

## 40. MVP screen list

Required:

```text
Admin login
Operations dashboard
Exception queue
Exception detail
Orders
Order detail
Partner list
Partner application review
Partner detail
Capabilities
Catalog review
Product detail
Inventory issues
Delivery queue
Delivery detail
Payments
Payment detail
Refunds
Refund detail
Partner earnings
Payouts
Payout detail
Zones
Pricing rules
Support cases
Audit log
Settings
```

---

## 41. Future admin features

Possible future features:

- Advanced BI.
- Demand forecasting.
- Automated fraud scoring.
- Partner ranking.
- Route optimization.
- Corporate campaign management.
- Multi-city command center.
- Automated reconciliation.
- Custom report builder.
- AI-assisted exception summaries.

---

## 42. Definition of done

An admin feature is done when:

- It enforces role permissions.
- It is auditable.
- It does not silently modify history.
- It handles state conflicts.
- It shows financial impact.
- It supports safe recovery.
- It passes lint, typecheck, tests, and build.
- It has documented actions.
- It protects sensitive data.
- It does not create hidden side effects.

---

## 43. Summary

The MPHO admin panel is not a generic dashboard.

It is the operational control center for:

- Orders.
- Exceptions.
- Partners.
- Products.
- Delivery.
- Payments.
- Earnings.
- Payouts.
- Security.
- Audit.

Its primary responsibility is to make problems visible and safe to resolve.
