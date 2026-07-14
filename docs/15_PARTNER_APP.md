# 15_PARTNER_APP.md

## 1. Purpose

This document defines MPHO Aliados, the partner-facing application or PWA.

It describes:

- Partner navigation.
- Operational screens.
- New-order workflow.
- Package reception.
- Preparation.
- Evidence.
- Courier handoff.
- Catalog.
- Availability.
- Earnings.
- Payouts.
- Incidents.
- Staff roles.
- Offline and error behavior.
- MVP requirements.

This document must be read with:

- `08_PARTNER_PROGRAM.md`
- `10_USER_ROLES.md`
- `12_PARTNER_JOURNEY.md`
- `13_ORDER_LIFECYCLE.md`
- `17_CATALOG_AND_INVENTORY.md`
- `21_DELIVERY_LOGISTICS.md`
- `22_PAYMENTS_AND_PAYOUTS.md`
- `27_SECURITY_AND_PRIVACY.md`
- `28_DESIGN_SYSTEM.md`

---

## 2. Product objective

MPHO Aliados should answer six questions for the partner:

1. What must I do?
2. By what time?
3. What exact items and instructions are required?
4. What evidence must I upload?
5. How much will I earn?
6. What happens next?

The application should replace long, unstructured WhatsApp coordination.

WhatsApp may notify, but MPHO Aliados is the operational source of truth.

---

## 3. Platform format

The MVP should be:

- Mobile-first.
- Responsive.
- Installable as a PWA.
- Usable in browser.
- Optimized for one-handed use.
- Designed for low-cost Android and iPhone devices.
- Resilient to intermittent connectivity.

Native applications are not required initially.

---

## 4. Main navigation

Recommended mobile navigation:

```text
Today
Orders
Catalog
Earnings
More
```

Alternative:

```text
Home
Tasks
Orders
Earnings
Account
```

The final design should prioritize active work.

---

## 5. Dashboard

The dashboard should show:

### Operational summary

- New offers.
- Orders to prepare today.
- Packages expected.
- Packages overdue.
- Orders ready for pickup.
- Courier waiting.
- Incidents requiring action.

### Financial summary

- Earnings today.
- Pending earnings.
- Payable balance.
- Next payout.

### Availability

- Partner active or paused.
- Capacity.
- Store open or closed.
- Receiving enabled or disabled.
- MPHORA enabled or disabled.

The dashboard should avoid vanity metrics.

---

## 6. Priority queue

The main task queue should sort by urgency.

Suggested priority:

```text
1. Incident blocking an order
2. Offer expiring soon
3. Courier waiting
4. Package arrival requiring receipt
5. Preparation deadline approaching
6. Evidence missing
7. Catalog or stock update
```

Each task card should show:

- Order number.
- Required action.
- Deadline.
- Earnings.
- Status.
- One primary action.

---

## 7. New order offer

The offer screen must include:

- Order number.
- Product.
- Quantity.
- Services.
- Personalization.
- Delivery date.
- Preparation deadline.
- Expected package arrival if external.
- Special handling.
- Estimated earnings.
- Accept-by time.
- Required capabilities.

Actions:

- Accept.
- Reject.
- Report issue.
- Ask MPHO.

The partner must not accept without seeing the complete work.

---

## 8. Accept flow

Before acceptance, the partner confirms:

- Product availability or receiving availability.
- Materials.
- Capacity.
- Deadline.
- Personalization ability.
- Operating hours.
- Handoff ability.

After acceptance:

- Responsible partner is locked.
- Tasks are created.
- Earnings become estimated.
- Customer is notified.
- Next step is displayed.

---

## 9. Reject flow

Structured rejection reasons:

```text
Out of stock
Capacity full
Store closing
Unsupported personalization
Cannot receive package
Insufficient time
Materials unavailable
Delivery problem
Technical problem
Other
```

The partner may add a note.

Rejection should be fast and honest.

---

## 10. Order list

Filters:

- New offers.
- Accepted.
- Awaiting product.
- Preparing.
- Ready.
- In delivery.
- Completed.
- Cancelled.
- Incidents.

Each row should show:

- Order number.
- Main item.
- Deadline.
- Current task.
- Earnings.
- Status.

---

## 11. Order detail

Recommended sections:

### Header

- Order number.
- Current state.
- Deadline.
- Priority.

### Product checklist

- Items.
- Quantity.
- Variants.
- Add-ons.
- Source type.

### Preparation instructions

- Wrapping.
- Card.
- Message.
- QR.
- Personalization.
- Special handling.

### Recipient and delivery

Only necessary data:

- Delivery zone.
- Delivery window.
- Surprise mode.
- Recipient details when operationally needed.

### Earnings

- Product earning.
- Service earnings.
- Delivery earning.
- Total estimated.
- Status.

### Evidence

- Required.
- Uploaded.
- Rejected.
- Approved.

### Timeline

- Offer.
- Acceptance.
- Receipt.
- Preparation.
- Ready.
- Handoff.

### Actions

Based on current state.

---

## 12. Local stock confirmation

For local products, the partner should:

- Confirm quantity.
- Confirm variant.
- Reserve stock.
- Report substitute.
- Report unavailable.
- Record confirmation time.

Actions:

```text
Confirm available
Report unavailable
Propose substitute
```

Stock confirmation must update inventory.

---

## 13. External package screen

The partner should see:

- Order number.
- External provider.
- Product description.
- Expected package.
- Tracking reference.
- Expected arrival.
- Product image.
- Required inspection.
- Storage deadline.

Actions:

```text
Package received
Package not received
Report damage
Wrong product
Missing items
```

---

## 14. Package receipt

Receipt form:

- Date and time.
- Receiver.
- Package condition.
- Product condition.
- Quantity.
- Serial or identifier when required.
- Photos.
- Notes.

Receipt outcomes:

```text
Received correctly
Received damaged
Received incomplete
Wrong item
Package missing
```

Only correct receipt should continue automatically.

---

## 15. Damage report

The damage screen should support:

- Damage category.
- Severity.
- Photos.
- Description.
- Whether packaging was damaged.
- Whether product is usable.
- Whether preparation must stop.

Submitting should:

- Pause normal flow.
- Create incident.
- Notify MPHO operations.
- Preserve evidence.

---

## 16. Preparation checklist

The preparation task should show:

```text
Product
Quantity
Wrapping
Ribbon
Card
Message
QR
Add-ons
Special instructions
Deadline
Evidence required
```

Each checklist item may be marked complete.

The partner should not be able to mark ready if required tasks are incomplete.

---

## 17. Preparation status

Allowed actions:

- Start preparation.
- Pause due to incident.
- Resume.
- Complete.
- Request clarification.

The start action should record time.

The system should monitor deadline risk.

---

## 18. Personalization verification

Before irreversible work, show:

- Final approved text.
- Recipient name.
- Color.
- Size.
- File.
- QR destination.
- Customer approval timestamp.

The partner must not edit customer-approved content.

If there is a problem, create an incident.

---

## 19. Evidence upload

Evidence may include:

- Received package.
- Product condition.
- Prepared gift.
- Card.
- QR.
- Packaging.
- Courier handoff.

Requirements:

- Camera capture.
- File upload.
- Preview.
- Retry.
- Compression.
- Upload progress.
- Required count.
- Secure storage.

The partner must know whether evidence is pending, uploaded, or rejected.

---

## 20. Evidence review feedback

If evidence is rejected, show:

- Which file.
- Why.
- What must be corrected.
- Deadline.
- Re-upload action.

Reasons may include:

- Blurry.
- Wrong order.
- Product not visible.
- Personalization not visible.
- Missing required angle.
- Privacy issue.

---

## 21. Mark ready

Before enabling `Mark ready`, validate:

- Product checklist complete.
- Personalization complete.
- Evidence complete.
- Packaging secure.
- No blocking incident.
- Order label available.

Confirmation message:

> Confirm that the gift is completely prepared and ready for courier pickup.

---

## 22. Courier assignment view

The partner may see:

- Courier or provider.
- Estimated pickup.
- Vehicle details when available.
- Identifier.
- Delivery reference.
- Contact method.
- Verification code when used.

The partner should not see unrelated courier data.

---

## 23. Courier handoff

Handoff screen:

- Verify order number.
- Verify courier.
- Confirm package count.
- Capture handoff photo when required.
- Record pickup time.
- Confirm courier received instructions.

Actions:

```text
Confirm handoff
Courier did not arrive
Wrong courier
Package returned
```

---

## 24. Partner own delivery

When the partner delivers:

- Assign authorized partner user.
- Confirm pickup from preparation area.
- Mark out for delivery.
- Record delivery attempt.
- Capture proof.
- Report failure.
- Record delivery earning.

The partner must not mark delivered without evidence.

---

## 25. Incidents

Incident categories:

- Stock.
- External package.
- Damage.
- Personalization.
- Deadline.
- Courier.
- Customer information.
- Technical.
- Payment or earnings.
- Safety.

Incident screen should show:

- Severity.
- Blocking or non-blocking.
- Assigned MPHO operator.
- Current status.
- Required action.
- Timeline.
- Messages.
- Evidence.

---

## 26. Catalog

Partner catalog sections:

- Published.
- Draft.
- Under review.
- Paused.
- Rejected.
- Out of stock.

The partner may manage only allowed fields.

Possible editable fields:

- Stock.
- Availability.
- Preparation time.
- Variants.
- Internal notes.
- Photos subject to review.
- Suggested price subject to agreement.

Restricted fields may include:

- MPHO service fee.
- Commission.
- Global customer price.
- Category restrictions.
- MPHORA rules.
- Platform tags.

---

## 27. Create product submission

Product submission fields:

- Name.
- Description.
- Category.
- Images.
- Variants.
- Stock.
- Preparation time.
- Supply price.
- Suggested customer price.
- Personalization.
- Add-ons.
- Substitution.
- Handling.
- Dimensions.
- Weight.
- Delivery restrictions.

Submission states:

```text
Draft
Submitted
Under review
Changes requested
Approved
Published
Rejected
```

---

## 28. Inventory

Inventory screen should support:

- Current stock.
- Reserved.
- Available.
- Low-stock threshold.
- Last updated.
- Adjustment.
- Pause listing.
- Confirm count.

Adjustment reasons:

```text
Sale outside MPHO
Restock
Damage
Correction
Return
Reservation release
Other
```

Every adjustment must be logged.

---

## 29. Availability

The partner may manage:

- Open now.
- Operating hours.
- Holiday hours.
- Temporary pause.
- Capacity.
- Package reception.
- Preparation.
- Own delivery.
- MPHORA participation.

Changes should affect new offers, not erase active responsibilities.

---

## 30. Capacity

Possible capacity configuration:

- Maximum active orders.
- Maximum MPHORA orders.
- Preparation slots.
- Package reception limit.
- Daily cutoff.

The MVP may use a simple integer capacity.

Do not build complex scheduling before real usage data exists.

---

## 31. Earnings screen

Sections:

- Today.
- This week.
- Pending.
- Approved.
- Payable.
- Paid.
- Disputed.

Each earning line should show:

- Order.
- Type.
- Amount.
- Status.
- Date.
- Payout reference when paid.

---

## 32. Earnings detail

Possible earning types:

- Product.
- Reception.
- Inspection.
- Wrapping.
- Preparation.
- Personalization.
- Handoff.
- Own delivery.
- Bonus.
- Adjustment.

Do not show only one unexplained total.

---

## 33. Payouts

Payout list:

- Period.
- Amount.
- Status.
- Payment method.
- Date.
- Reference.

Payout detail:

- Included orders.
- Earning lines.
- Positive adjustments.
- Negative adjustments.
- Net total.
- Payment confirmation.

---

## 34. Partner dispute

The partner may dispute:

- Missing earning.
- Wrong amount.
- Incorrect deduction.
- Missing payout.
- Incident responsibility.
- Product cost.
- Delivery earning.

The dispute form should automatically include:

- Partner.
- Order.
- Earning.
- Payout.
- Existing evidence.

---

## 35. Performance

Potential partner metrics:

- Response time.
- Acceptance.
- Stock accuracy.
- Preparation time.
- On-time readiness.
- Evidence acceptance.
- Incident rate.
- Customer feedback.
- Earnings.

The app should explain how metrics are calculated.

No unexplained score should affect the partner.

---

## 36. Staff management

Partner admin may:

- Invite operator.
- Assign role.
- Remove access.
- View active sessions.
- Reset access.
- Assign preparation responsibility.

Partner operator may not manage users.

---

## 37. Notifications

Partner notifications:

- New offer.
- Offer expiring.
- Package expected.
- Package delayed.
- Preparation deadline.
- Courier assigned.
- Courier arrived.
- Evidence rejected.
- Incident updated.
- Earnings approved.
- Payout sent.
- Partner paused.

Notifications should deep-link to the exact task.

---

## 38. WhatsApp relationship

WhatsApp should be used for:

- Alerts.
- Urgent reminders.
- Fallback communication.
- Support.

WhatsApp should not be used as the only way to:

- Accept.
- Confirm stock.
- Mark received.
- Mark ready.
- Confirm handoff.
- View earnings.

Messages should contain secure deep links.

---

## 39. Offline and poor connectivity

The PWA should support safe recovery for:

- Draft notes.
- Checklist progress.
- Evidence capture pending upload.
- Retry after connection.
- Read-only cached task summary where safe.

Do not mark state transitions complete without server confirmation.

Show:

```text
Saved locally
Uploading
Synced
Failed to sync
```

---

## 40. Error states

Required errors:

- Offer expired.
- Order reassigned.
- State changed elsewhere.
- Upload failed.
- No connectivity.
- Permission denied.
- Invalid evidence.
- Stock conflict.
- Payout information missing.
- Session expired.
- Partner paused.

Every error must include a next action.

---

## 41. Accessibility

Requirements:

- Large buttons.
- Clear labels.
- High contrast.
- Screen-reader support.
- Visible deadlines.
- Status icons plus text.
- Simple language.
- Minimal typing.
- Camera-friendly evidence flow.

---

## 42. Security

MPHO Aliados must:

- Enforce partner scope.
- Enforce role scope.
- Hide unrelated customer data.
- Protect evidence.
- Log critical actions.
- Prevent URL guessing.
- Prevent client-side price changes.
- Require reauthentication for payout changes.
- Rate-limit sensitive actions.
- Revoke users immediately when removed.

---

## 43. Analytics

Track operational events:

```text
offer_received
offer_opened
offer_accepted
offer_rejected
stock_confirmed
package_received
package_issue_reported
preparation_started
evidence_uploaded
evidence_rejected
order_ready
courier_handoff
incident_created
earning_viewed
payout_viewed
partner_paused
```

Do not use analytics as the source of truth.

---

## 44. MVP screen list

Required:

```text
Login
Partner dashboard
New offers
Offer detail
Orders
Order detail
Stock confirmation
Package expected
Package receipt
Damage report
Preparation checklist
Evidence upload
Ready confirmation
Courier handoff
Incidents
Catalog list
Product submission
Inventory
Availability
Earnings
Earning detail
Payouts
Payout detail
Staff
Partner profile
Support
```

---

## 45. Future features

Possible future features:

- Advanced scheduling.
- POS integration.
- Barcode scanning.
- Printer integration.
- Training center.
- Partner marketplace.
- Marketing tools.
- Automated supplier restock.
- Multi-branch partner admin.
- Partner tiers.
- Featured listing purchase.
- Advanced analytics.

---

## 46. Definition of done

A partner-app feature is done when:

- It maps to valid order states.
- It enforces partner scope.
- It handles mobile use.
- It supports low connectivity safely.
- It records actor and timestamp.
- It shows deadlines.
- It shows earnings correctly.
- It includes error recovery.
- It passes lint, typecheck, tests, and build.
- It does not rely solely on WhatsApp.
- Documentation is updated.

---

## 47. Summary

MPHO Aliados is the execution system for the physical part of MPHO.

It must convert every order into a clear sequence of tasks with:

- Exact instructions.
- Exact deadlines.
- Required evidence.
- Clear earnings.
- Safe status transitions.
- Fast incident reporting.
