# 29_TESTING_AND_QA.md

## 1. Purpose

This document defines the testing and quality-assurance strategy for MPHO.

It explains:

- Test levels.
- Critical flows.
- Automation.
- Manual QA.
- Regression.
- Security testing.
- Financial testing.
- Provider testing.
- Accessibility.
- Performance.
- Release criteria.
- Defect management.
- MVP test requirements.

Testing is required to prove that MPHO is operationally correct, not only visually functional.

---

## 2. Quality objectives

MPHO quality means:

- Orders follow valid states.
- Payments do not duplicate.
- Stock does not oversell.
- Partners see correct tasks.
- Customer status is accurate.
- Delivery is traceable.
- Earnings are correct.
- Payouts are auditable.
- Private data is protected.
- Failures can be recovered.
- Mobile experience works.
- Integrations are safe.

---

## 3. Test pyramid

Recommended levels:

```text
Unit tests
Integration tests
Contract tests
Component tests
End-to-end tests
Manual exploratory testing
Operational pilot testing
```

No single level is enough.

---

## 4. Unit tests

Unit tests should cover:

- Pricing calculations.
- Eligibility.
- State transitions.
- Role permissions.
- Order totals.
- Partner earnings.
- Refund allocation.
- Delivery calculations.
- HADIA filtering.
- MPHORA rules.
- Date and cutoff logic.
- Error mapping.

Unit tests should be fast and deterministic.

---

## 5. Integration tests

Integration tests should cover:

- Database transactions.
- RLS.
- Order creation.
- Stock reservation.
- Payment webhook processing.
- Refund processing.
- Partner assignment.
- Delivery event processing.
- Earnings creation.
- Payout inclusion.
- Notification outbox.
- File access.

Use isolated test data.

---

## 6. Contract tests

Contract tests validate provider adapters.

Required for:

- Payment provider.
- WhatsApp provider.
- Delivery provider.
- AI provider.
- Maps provider.
- Email provider.

Test:

- Request structure.
- Response structure.
- Status mapping.
- Error mapping.
- Signature verification.
- Timeout.
- Duplicate event.
- Sandbox behavior.

---

## 7. Component tests

Test interactive components such as:

- Checkout form.
- Product card.
- HADIA recommendation.
- MPHORA badge.
- Partner offer.
- Evidence upload.
- Order timeline.
- Refund dialog.
- Payout statement.
- Admin exception action.

Test:

- Loading.
- Empty.
- Error.
- Success.
- Permission.
- Keyboard.
- Screen reader labels.

---

## 8. End-to-end tests

Critical E2E flows:

### Local order

```text
Customer browses
→ selects local product
→ personalizes
→ pays
→ partner accepts
→ stock confirms
→ prepares
→ uploads evidence
→ courier assigned
→ delivered
→ order completes
```

### External order

```text
Customer selects by-order product
→ pays
→ partner accepts
→ external purchase created
→ package arrives
→ partner inspects
→ prepares
→ delivers
```

### MPHORA order

```text
Customer selects eligible item
→ quote valid
→ pays
→ partner accepts quickly
→ prepares
→ courier delivers
```

---

## 9. Negative E2E flows

Test:

- Product unavailable after cart.
- Quote expired.
- Payment rejected.
- Duplicate payment callback.
- Partner rejects.
- No partner accepts.
- External product delayed.
- Product arrives damaged.
- Preparation deadline missed.
- Evidence upload fails.
- No courier available.
- Delivery attempt fails.
- Customer cancels.
- Refund fails.
- Payout fails.
- Session expires.
- Permission denied.

---

## 10. Order-state tests

For every state transition, test:

- Valid source state.
- Valid target state.
- Invalid target.
- Unauthorized actor.
- Missing required data.
- Duplicate request.
- Concurrent request.
- History record.
- Audit record.
- Side effect.
- Rollback on failure.

---

## 11. Payment tests

Test:

- Successful payment.
- Pending payment.
- Rejected payment.
- Under-review payment.
- Duplicate provider event.
- Amount mismatch.
- Currency mismatch.
- Payment for cancelled order.
- Payment for expired quote.
- Provider timeout.
- Redirect without webhook.
- Multiple attempts.
- One approved payment rule.

---

## 12. Refund tests

Test:

- Full refund.
- Partial refund.
- Duplicate refund.
- Refund exceeds payment.
- Refund after prior partial refund.
- Provider failure.
- Provider delayed confirmation.
- Partner earning impact.
- Courier impact.
- Ledger reversal.
- Customer message.
- Unauthorized refund.

---

## 13. Partner earnings tests

Test:

- Product earning.
- Reception earning.
- Preparation earning.
- Personalization earning.
- Own-delivery earning.
- Cancellation after work.
- Earning reversal.
- Adjustment.
- Duplicate earning prevention.
- Payable transition.
- Payout inclusion.
- Dispute.

---

## 14. Payout tests

Test:

- Create payout.
- Select payable earnings.
- Exclude paid earnings.
- Prevent duplicate inclusion.
- Verify total.
- Change payout account.
- Payout failure.
- Retry.
- Paid confirmation.
- Statement generation.
- Reconciliation.
- Unauthorized payout.

---

## 15. Inventory tests

Test:

- Stock creation.
- Reservation.
- Release.
- Consumption.
- Expiration.
- Concurrent reservation.
- Oversell prevention.
- Adjustment.
- Negative stock rejection.
- Stale stock.
- External product not counted as local stock.
- Partner scope.

---

## 16. MPHORA tests

Test:

- Eligible.
- Stock stale.
- Partner closed.
- Partner paused.
- Capacity full.
- Cutoff passed.
- Unsupported zone.
- Delivery unavailable.
- Personalization too slow.
- Quote expired.
- Revalidation.
- Partner rejection.
- Emergency pause.
- Fallback to scheduled.

---

## 17. HADIA tests

Test:

- Extract recipient.
- Extract occasion.
- Extract budget.
- Extract zone.
- Extract date.
- Search real catalog.
- Exclude unavailable.
- Respect budget.
- No-result behavior.
- By-order disclosure.
- MPHORA validation.
- Human handoff.
- Prompt injection.
- Data leakage.
- AI outage fallback.
- Structured output validation.

---

## 18. WhatsApp tests

Test:

- Correct template.
- Correct audience.
- Correct variables.
- Consent.
- Secure deep link.
- Duplicate event.
- Retry.
- Failure.
- Fallback.
- Inbound routing.
- Partner offer reminder cancellation.
- Refund completion message.
- Marketing opt-out.
- Expired link.

---

## 19. Delivery tests

Test:

- Quote.
- Quote expiration.
- Assignment.
- Pickup.
- Handoff.
- Out for delivery.
- Proof.
- Failed delivery.
- Reattempt.
- Return to partner.
- Lost package.
- Damaged package.
- Provider duplicate event.
- Manual courier.
- Partner own delivery.
- Cost reconciliation.

---

## 20. Security tests

Test:

- Cross-customer access.
- Cross-partner access.
- Courier overreach.
- Admin role restriction.
- RLS.
- Session expiration.
- Revoked user.
- Signed URL expiration.
- Webhook forgery.
- Replay attack.
- Rate limit.
- XSS.
- SQL injection.
- File upload abuse.
- Prompt injection.
- Secret scanning.
- Payout account change.
- Refund permission.

---

## 21. Privacy tests

Test:

- Analytics excludes PII.
- Logs mask phone and address.
- Partner sees minimum recipient data.
- Courier sees minimum data.
- HADIA does not expose prior customer.
- Account deletion preserves required financial records.
- Marketing consent separate.
- Recipient not added to marketing.
- Private media not public.

---

## 22. Accessibility tests

Automated and manual checks:

- Semantic HTML.
- Keyboard navigation.
- Focus order.
- Visible focus.
- Contrast.
- Screen reader.
- Form labels.
- Error summary.
- Touch target.
- Zoom.
- Reduced motion.
- Non-color-only status.

Accessibility testing must include real mobile use.

---

## 23. Responsive tests

Test at:

- Small iPhone.
- Large iPhone.
- Small Android.
- Large Android.
- Tablet.
- Laptop.
- Desktop.

Critical screens:

- Home.
- Product.
- HADIA.
- Cart.
- Checkout.
- Order tracking.
- Partner offer.
- Evidence upload.
- Admin exception.

---

## 24. Performance tests

Measure:

- First page load.
- Catalog load.
- Search response.
- Checkout interaction.
- Image performance.
- Partner task load.
- Admin filter.
- Webhook processing.
- Background job delay.
- Database query time.

Performance targets should be defined after baseline measurement.

---

## 25. Load tests

Consider for:

- Product search.
- Payment webhook.
- WhatsApp webhook.
- Partner offer queue.
- MPHORA eligibility.
- Order tracking.
- Admin dashboard.

Do not load-test production without approval.

---

## 26. Reliability tests

Simulate:

- Database timeout.
- Payment provider outage.
- WhatsApp outage.
- Delivery provider outage.
- AI provider outage.
- Storage failure.
- Delayed webhook.
- Duplicate webhook.
- Outbox backlog.
- Job retry.
- Partial transaction failure.

---

## 27. Data migration tests

For every migration:

- Apply to clean database.
- Apply to realistic existing data.
- Test rollback or recovery.
- Validate constraints.
- Validate indexes.
- Validate RLS.
- Validate backfill.
- Validate historical orders.
- Validate financial records.

---

## 28. Test data

Use fictional test data.

Include:

- Test customer.
- Test recipient.
- Test partner.
- Test operator.
- Test admin.
- Test courier.
- Test product.
- Test external product.
- Test MPHORA product.
- Test order.
- Test payment.
- Test refund.
- Test payout.
- Test incident.

Never use real production customer data in local or preview.

---

## 29. Provider fixtures

Store sanitized fixtures for:

- Payment events.
- Refund events.
- Delivery events.
- WhatsApp events.
- Email callbacks.
- AI structured outputs.

Fixtures must exclude secrets.

---

## 30. Test environments

Recommended:

```text
local
CI
preview
staging
production smoke
```

Rules:

- Production tests must not charge real money unless controlled.
- Production smoke tests must use approved test accounts.
- Preview must not use production payouts.
- Staging should resemble production configuration.

---

## 31. CI quality gates

Required checks:

```text
install
lint
typecheck
unit tests
integration tests
build
migration validation
security scan
end-to-end smoke
```

A failed critical check blocks merge.

---

## 32. Manual QA

Manual QA is required for:

- Visual design.
- Mobile keyboard.
- Camera upload.
- WhatsApp deep link.
- Payment redirect.
- Provider sandbox.
- PWA install.
- Offline behavior.
- Screen reader.
- Partner workflow.
- Admin exception.
- Real test delivery.

---

## 33. Exploratory testing

Exploratory scenarios:

- User changes date repeatedly.
- User changes zone after cart.
- Partner accepts on two devices.
- Admin reassigns during partner action.
- Courier arrives before ready.
- Customer closes payment browser.
- Customer pays twice.
- External product arrives early.
- External product arrives after cancellation.
- Partner loses connection during upload.
- Refund occurs after payout.

---

## 34. Pilot QA

Before public launch, conduct controlled real pilot orders.

Pilot should validate:

- Real product.
- Real payment.
- Real partner.
- Real packaging.
- Real courier.
- Real recipient.
- Real notification.
- Real earning.
- Real payout.
- At least one failure scenario.

---

## 35. Defect severity

Suggested levels:

### Critical

- Money duplicated.
- Unauthorized data access.
- Order corruption.
- Payout fraud risk.
- Payment approved but lost.
- Security compromise.

### High

- Order cannot progress.
- Wrong partner receives order.
- Refund cannot complete.
- Delivery state incorrect.
- Customer sees another order.

### Medium

- Non-blocking feature failure.
- Incorrect message.
- Layout issue.
- Retry required.

### Low

- Minor visual or copy issue.

---

## 36. Defect record

Each defect should include:

```text
title
environment
severity
steps
expected
actual
evidence
request_id
order_id
provider reference
reproducibility
owner
status
```

---

## 37. Regression suite

Regression must include:

- Customer checkout.
- Local order.
- External order.
- MPHORA.
- Partner offer.
- Stock reservation.
- Evidence.
- Delivery.
- Payment.
- Refund.
- Earnings.
- Payout.
- Permissions.
- Notifications.

---

## 38. Release candidate testing

Before production:

- All critical tests pass.
- No open critical defect.
- No open high defect affecting launch flow.
- Database migration tested.
- Backup verified.
- Provider sandbox tested.
- Production configuration reviewed.
- Secrets verified.
- Admin access verified.
- Rollback plan prepared.
- Pilot order completed.

---

## 39. Production smoke test

After deployment:

- Home loads.
- Login works.
- Catalog loads.
- Test quote works.
- Payment provider reachable.
- Webhook endpoint healthy.
- Partner app loads.
- Admin loads.
- Notification provider reachable.
- Database healthy.
- No new critical errors.

Avoid real customer impact.

---

## 40. Release rollback

Rollback criteria:

- Payment failure spike.
- Order-state corruption.
- Security issue.
- Database migration failure.
- Partner app unusable.
- Checkout blocked.
- Widespread notification duplication.
- Delivery status corruption.

Rollback plan should include code and data recovery.

---

## 41. Quality metrics

Track:

- Defect escape rate.
- Critical defect count.
- Test pass rate.
- Flaky test rate.
- Build failure rate.
- Order success rate.
- Payment mismatch rate.
- Manual intervention rate.
- Refund error rate.
- Delivery error rate.
- Partner incident rate.
- Accessibility defects.

---

## 42. Flaky tests

Flaky tests must not be ignored.

Process:

- Mark.
- Investigate.
- Fix.
- Remove unstable dependency.
- Avoid repeated blind reruns.
- Track flakiness.

---

## 43. Test ownership

Every module should have:

- Technical owner.
- Required test suite.
- Critical scenarios.
- Provider fixtures.
- Release checklist.

---

## 44. MVP test minimum

Before MVP release:

- All core state transitions tested.
- Payment and refund tested.
- One local order E2E.
- One external order E2E.
- One MPHORA order E2E.
- Partner rejection tested.
- Delivery failure tested.
- Earnings and payout tested.
- RLS tested.
- Private media tested.
- WhatsApp tested.
- Mobile checkout tested.
- Partner PWA tested.
- Admin exception tested.
- Real pilot completed.

---

## 45. Definition of done

A feature is QA-complete when:

- Acceptance criteria exist.
- Unit or integration tests exist when appropriate.
- Error states tested.
- Permission tested.
- Mobile tested.
- Accessibility tested.
- Provider failure tested.
- Regression updated.
- Documentation updated.
- No unresolved critical defect.

---

## 46. Summary

MPHO quality is proven when the entire real-world order can succeed and fail safely.

Testing must cover:

```text
happy path
failure path
duplicate path
unauthorized path
recovery path
```
