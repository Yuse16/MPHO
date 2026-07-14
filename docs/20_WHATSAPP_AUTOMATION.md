# 20_WHATSAPP_AUTOMATION.md

## 1. Purpose

This document defines how MPHO uses WhatsApp for customer, partner, courier, and operational communication.

It explains:

- Supported message types.
- Transactional notifications.
- Partner alerts.
- Customer support entry.
- Templates.
- Conversation windows.
- Automation.
- Opt-in and consent.
- Deep links.
- Failure handling.
- Escalation.
- Security.
- Analytics.
- MVP implementation.

WhatsApp is an important communication channel, but it is not the source of truth for order state.

This document must be read together with:

- `10_USER_ROLES.md`
- `11_CUSTOMER_JOURNEY.md`
- `12_PARTNER_JOURNEY.md`
- `13_ORDER_LIFECYCLE.md`
- `14_CUSTOMER_APP.md`
- `15_PARTNER_APP.md`
- `18_HADIA_AI.md`
- `21_DELIVERY_LOGISTICS.md`
- `27_SECURITY_AND_PRIVACY.md`

---

## 2. Communication principle

WhatsApp should be used to:

- Notify.
- Remind.
- Request a specific action.
- Provide tracking.
- Start support.
- Recover a blocked flow.
- Deep-link users into MPHO.

WhatsApp should not be the only place where users:

- Accept an order.
- Confirm stock.
- Confirm package receipt.
- Mark ready.
- Confirm delivery.
- View earnings.
- Approve a refund.
- Change payment state.

Official actions should be stored in MPHO.

---

## 3. Messaging audiences

Official audiences:

```text
customer
recipient_optional
partner_admin
partner_operator
courier_optional
mpho_operator
```

Each audience must receive only necessary information.

---

## 4. Message categories

### Transactional

Directly related to an order or account event.

Examples:

- Payment approved.
- Partner accepted.
- Product received.
- Gift ready.
- Courier assigned.
- Delivered.
- Refund update.

### Action required

User must respond or open MPHO.

Examples:

- Approve substitution.
- Correct address.
- Accept partner offer.
- Confirm package receipt.
- Upload evidence.

### Reminder

A known action remains pending.

### Support

Customer or partner requests help.

### Marketing

Promotional message unrelated to an active transaction.

Marketing requires separate consent and stricter rules.

---

## 5. Customer transactional messages

Recommended events:

```text
order_created
payment_approved
payment_under_review
partner_accepted
external_purchase_created
external_product_in_transit
external_product_received
preparation_started
gift_ready
courier_assigned
out_for_delivery
delivery_attempted
delivered
cancellation_update
refund_pending
refund_completed
exception_action_required
```

Each message should answer:

1. What happened?
2. What happens next?
3. Does the customer need to act?
4. Is timing affected?
5. Where can the customer view details?

---

## 6. Partner transactional messages

Recommended events:

```text
new_order_offer
offer_expiring
package_expected
package_delayed
package_arrival_reminder
preparation_deadline
evidence_missing
evidence_rejected
courier_assigned
courier_arrived
incident_update
earning_approved
payout_sent
account_paused
document_required
```

Each partner message should contain a secure deep link to the exact task.

---

## 7. Recipient messages

Recipient contact depends on surprise mode.

Possible recipient messages:

- Delivery coordination without revealing gift.
- Courier arrival.
- Failed delivery contact.
- Delivery code.

Recipient messages must:

- Avoid revealing unnecessary customer information.
- Avoid marketing.
- Respect surprise settings.
- Use minimum necessary data.

---

## 8. Courier messages

If direct courier messaging is used:

- Pickup assigned.
- Pickup address.
- Pickup time.
- Delivery destination.
- Recipient contact.
- Delivery code.
- Proof requirement.
- Incident support.

Courier access should use temporary, scoped links.

---

## 9. Template structure

Recommended template fields:

```text
template_name
language
audience
event_type
variables
deep_link
expiration
fallback_channel
status
provider_template_id
version
```

Templates should be versioned.

---

## 10. Template naming

Recommended internal naming:

```text
customer_payment_approved_v1
customer_partner_accepted_v1
customer_out_for_delivery_v1
customer_refund_completed_v1
partner_new_offer_v1
partner_package_expected_v1
partner_preparation_deadline_v1
partner_payout_sent_v1
```

Do not use vague names such as:

```text
template1
status_message
general_update
```

---

## 11. Template content rules

Messages should be:

- Short.
- Specific.
- Actionable.
- Honest.
- Consistent with customer-facing state.
- Free of internal codes.
- Free of unnecessary sensitive data.

Example:

> MPHO: Your payment for order {{order_number}} was approved. We are now confirming the Punto MPHO that will prepare your gift. View status: {{secure_link}}

Avoid:

> Your order is processing.

---

## 12. Dynamic variables

Approved variable types may include:

- Customer first name.
- Order number.
- Customer-facing status.
- Product short name.
- Delivery window.
- Partner business name when appropriate.
- Action deadline.
- Secure link.
- Refund amount.
- Payout amount.
- Support case number.

Do not include:

- Full payment tokens.
- Full address unless required.
- Internal notes.
- Partner cost.
- Customer history.
- Secrets.
- Raw database IDs.

---

## 13. Secure deep links

A deep link should:

- Open the exact relevant screen.
- Require authentication for private data.
- Expire when action is temporary.
- Be scoped to one resource.
- Avoid exposing sensitive data in URL.
- Be revocable.
- Record use when important.

Examples:

```text
/orders/MPHO-1042
/partner/orders/MPHO-1042/accept
/orders/MPHO-1042/substitution
/support/CASE-120
```

---

## 14. Partner offer message

Example:

> MPHO Aliados: New order {{order_number}}. Accept before {{accept_deadline}}. Estimated earning: {{earning}}. Review and respond: {{secure_link}}

The WhatsApp message itself should not count as acceptance.

---

## 15. Customer payment message

Example:

> MPHO: Payment approved for order {{order_number}}. We are assigning the partner that will prepare your gift. Track it here: {{secure_link}}

---

## 16. External product message

Example:

> MPHO: The product for order {{order_number}} is on the way to the assigned Punto MPHO. We will notify you when it is received and inspected.

---

## 17. Delivery message

Example:

> MPHO: Your gift is on the way. Estimated delivery window: {{delivery_window}}. Track the order: {{secure_link}}

Do not expose courier contact unless policy allows.

---

## 18. Refund message

Example:

> MPHO: The refund for order {{order_number}} was completed for {{refund_amount}}. The time it takes to appear depends on your payment provider.

Do not send completion before verified provider confirmation.

---

## 19. Conversation windows

The implementation must respect provider rules for:

- Customer-initiated conversation window.
- Template requirement outside the window.
- Approved templates.
- Language.
- Message category.
- Rate limit.
- Delivery status.

Provider rules may change and should be verified during integration.

---

## 20. Consent and opt-in

Transactional consent may be collected during:

- Account creation.
- Checkout.
- Partner onboarding.
- Delivery coordination.

Marketing consent must be separate.

Store:

```text
user_id_or_contact
channel
purpose
consent_status
consent_source
consent_timestamp
revoked_at
policy_version
```

Do not treat an order phone number as unlimited marketing consent.

---

## 21. Opt-out

Users should be able to:

- Stop marketing messages.
- Change communication preference.
- Keep essential transactional messages when legally and operationally necessary.

Opt-out keywords may trigger suppression according to provider and legal requirements.

---

## 22. Notification preferences

Possible customer preferences:

- WhatsApp.
- Email.
- In-app.
- Push.

Possible partner preferences:

- WhatsApp urgent alerts.
- In-app all notifications.
- Email payout statements.

Critical partner alerts may require at least one active channel.

---

## 23. Event-driven architecture

Recommended flow:

```text
Business event occurs
→ notification event created
→ audience resolved
→ template selected
→ variables validated
→ consent and policy checked
→ message sent
→ provider result stored
→ retry or fallback if needed
```

Do not send important messages directly from UI components.

---

## 24. Notification event record

Fields:

```text
notification_id
event_type
audience_type
audience_id
order_id_optional
template_name
channel
status
scheduled_at
sent_at
delivered_at
read_at_optional
failed_at
failure_reason
provider_message_id
retry_count
idempotency_key
```

---

## 25. Message states

Recommended:

```text
queued
scheduled
sending
sent
delivered
read
failed
cancelled
suppressed
expired
```

Provider support may vary.

---

## 26. Idempotency

A business event should not create duplicate messages.

Use an idempotency key such as:

```text
order_id + event_type + audience + event_version
```

Example:

A repeated payment webhook must not send three identical payment-approved messages.

---

## 27. Retry policy

Retry only temporary failures.

Possible temporary failures:

- Provider timeout.
- Rate limit.
- Network issue.
- Temporary provider error.

Do not retry indefinitely.

Recommended:

- Exponential backoff.
- Maximum attempts.
- Dead-letter queue or failed state.
- Operator alert for critical message.

---

## 28. Fallback channels

For critical events, fallback may include:

- In-app.
- Email.
- Push.
- SMS in future.
- Operator task.

Example:

If partner new-order WhatsApp fails:

- Create in-app alert.
- Retry.
- Notify MPHO operator if acceptance deadline is near.

---

## 29. Message scheduling

Messages may be scheduled for:

- Partner acceptance reminder.
- Preparation deadline.
- Delivery-day reminder.
- Saved occasion reminder.
- Payout notice.

Scheduled messages must cancel when the underlying action is completed.

Example:

If partner accepts, cancel `offer_expiring` reminder.

---

## 30. Customer inbound messages

Inbound WhatsApp may be routed to:

- HADIA.
- Order support.
- FAQ.
- Human operator.
- Cancellation request.
- Delivery issue.
- Partner support.

Intent classification must not perform sensitive actions without authentication and confirmation.

---

## 31. Customer authentication in WhatsApp

A phone number match may provide context, but should not authorize high-risk actions alone.

Sensitive actions may require:

- Signed link.
- One-time code.
- Authenticated web session.
- Additional verification.

Examples:

- Refund approval.
- Address change after pickup.
- Account security change.

---

## 32. Partner inbound messages

Partner inbound requests may include:

- Cannot accept.
- Package delayed.
- Product damaged.
- Need support.
- Courier not arrived.

The system may create a structured incident.

However, official status changes should occur through authenticated MPHO Aliados actions.

---

## 33. HADIA on WhatsApp

HADIA may operate through WhatsApp as a discovery channel.

Recommended flow:

```text
Customer asks for gift
→ HADIA collects constraints
→ shows 3 real options
→ sends secure product or cart link
→ customer completes checkout in MPHO
```

HADIA on WhatsApp must not:

- Collect card details.
- Approve refunds.
- Confirm unavailable stock.
- Hide delivery conditions.
- Expose private order data without authentication.

---

## 34. Order tracking through WhatsApp

The customer may ask:

- Where is my order?
- Has the product arrived?
- Is it ready?
- Is the courier on the way?

The system should use current order state.

Response should include:

- Customer-facing status.
- Latest timestamp.
- Next step.
- Secure tracking link.
- Action required if any.

---

## 35. Escalation

Escalate when:

- Payment dispute.
- Repeated customer confusion.
- Product damage.
- Delivery failure.
- Refund delay.
- High-value order.
- Threat or abuse.
- Security concern.
- Partner dispute.
- Unsupported request.

Escalation record should include conversation summary and related order.

---

## 36. Human support inbox

A future or integrated support inbox should show:

- Contact.
- Audience role.
- Related order.
- HADIA summary.
- Recent notifications.
- Open incident.
- Assigned operator.
- Priority.
- SLA or response target.

---

## 37. Abuse and rate limiting

Protect against:

- Spam.
- Repeated automated messages.
- Fraud attempts.
- Prompt injection.
- Harassment.
- Mass partner messaging.
- Link abuse.

Use:

- Rate limits.
- Block list.
- Content moderation.
- Escalation.
- Provider controls.
- Operator review.

---

## 38. Privacy

Do not include unnecessary:

- Full address.
- Full recipient data.
- Payment information.
- Private messages.
- Partner financial details.
- Internal incident notes.

Logs should avoid storing raw sensitive message content longer than necessary.

---

## 39. Marketing automation

Future marketing uses may include:

- Occasion reminders.
- Abandoned cart.
- Seasonal suggestions.
- New local catalog.
- Partner promotions.
- Reorder prompts.

Marketing must require:

- Consent.
- Frequency controls.
- Clear opt-out.
- Approved templates.
- Segmentation that avoids sensitive profiling.

---

## 40. Abandoned cart

Possible flow:

```text
cart created
→ no payment
→ eligibility and consent checked
→ reminder sent
→ cart link
→ quote may be revalidated
```

Do not promise old price or stock.

Message:

> Your MPHO gift selection is still saved. Prices and availability will be revalidated when you continue.

---

## 41. Occasion reminders

Future reminder:

> The birthday you saved is approaching. HADIA can show new options for the selected budget and delivery area.

Do not reveal the occasion to another person using the same phone without account context.

---

## 42. Partner payout message

Example:

> MPHO Aliados: A payout of {{amount}} was sent for period {{period}}. View the statement: {{secure_link}}

Do not include bank details.

---

## 43. Analytics

Track:

```text
notification_queued
notification_sent
notification_delivered
notification_read
notification_failed
deep_link_opened
customer_replied
partner_replied
handoff_created
template_suppressed
marketing_opt_out
```

Analytics must not replace provider and operational records.

---

## 44. Metrics

Important metrics:

- Delivery rate.
- Read rate.
- Action completion.
- Failed message rate.
- Retry success.
- Partner response time.
- Customer support deflection.
- Handoff rate.
- Duplicate message rate.
- Opt-out rate.
- Message-to-order conversion.
- Notification latency.

---

## 45. MVP implementation

MVP should include:

- One WhatsApp Business account.
- Approved transactional templates.
- Customer order notifications.
- Partner new-order alerts.
- Partner reminders.
- Secure deep links.
- Provider webhook handling.
- Idempotent sending.
- Delivery status tracking.
- Retry and fallback.
- Basic inbound routing.
- Human support escalation.

MVP may use n8n for orchestration if all events remain traceable.

---

## 46. n8n rules

If n8n is used:

- Use environment variables.
- Do not store secrets in workflow exports.
- Validate webhook source.
- Use idempotency keys.
- Log workflow result to MPHO.
- Avoid duplicating business logic.
- Keep order state changes in the core application.
- Use retries carefully.
- Version workflows.
- Separate test and production.
- Provide manual fallback.

n8n should orchestrate notifications, not become the only order database.

---

## 47. Minimum tests

Test:

- Payment approved message.
- Duplicate payment webhook.
- Partner offer message.
- Offer reminder cancellation after acceptance.
- Failed provider send.
- Retry.
- Fallback.
- Expired deep link.
- Unauthorized link access.
- Marketing opt-out.
- Wrong audience.
- External-product update.
- Refund completion.
- Inbound tracking request.
- HADIA handoff.
- Provider webhook duplicate.
- Rate limit.

---

## 48. Definition of done

A WhatsApp automation is done when:

- It is triggered by a real business event.
- It uses the correct template.
- It respects consent and provider rules.
- It contains no unnecessary sensitive data.
- It has a secure deep link.
- It is idempotent.
- It records provider status.
- It has retry and fallback.
- It cancels obsolete reminders.
- It passes tests.
- Documentation is updated.

---

## 49. Summary

WhatsApp is the notification and conversation layer of MPHO.

It should make the operation feel responsive without becoming the system of record.

Every important action must remain authenticated, auditable, and connected to the official MPHO order state.
