# 10_USER_ROLES.md

## 1. Purpose

This document defines the official user roles, responsibilities, permissions, and access boundaries for MPHO.

It applies to:

- Customer-facing applications.
- MPHO Aliados.
- MPHO administration.
- Delivery workflows.
- Automations.
- APIs.
- Database authorization.
- Audit logs.

The objective is to ensure that each actor can perform only the actions required for its responsibility.

---

## 2. Core authorization principle

MPHO must apply least privilege.

Every action must be validated on the server.

Frontend visibility is not sufficient authorization.

A user must never gain access to data only because a screen or route exists.

---

## 3. Role model

Official preliminary roles:

```text
guest
customer
partner_operator
partner_admin
courier
mpho_operator
mpho_admin
service_account
```

Future roles may be added only when there is a distinct, documented responsibility.

Avoid creating role combinations that duplicate permissions.

---

## 4. Guest

### Definition

A person who has not signed in.

### Allowed actions

A guest may:

- View public landing pages.
- Browse publicly available catalog items.
- View partner-neutral product information.
- Use a limited HADIA discovery flow.
- Check whether a zone may be supported.
- Start a cart.
- View public policies.
- Begin account creation.

### Restricted actions

A guest may not:

- Complete a paid order without required identity and contact data.
- View order history.
- View private recipient information.
- View partner earnings.
- Access partner tools.
- Access admin tools.
- View private evidence.
- Modify catalog data.

---

## 5. Customer

### Definition

A registered user who creates and pays for orders.

### Main responsibilities

- Provide accurate recipient information.
- Provide accurate delivery address.
- Select product and personalization.
- Confirm timing.
- Complete payment.
- Review substitutions when requested.
- Respond to exceptions when required.
- Follow marketplace rules.

### Allowed actions

A customer may:

- Manage own profile.
- Manage own addresses.
- Create a draft order.
- Add products and services to cart.
- Add recipient details.
- Select personalization.
- View own quotes.
- Pay for own orders.
- View own payment status.
- View own order status.
- View customer-safe evidence.
- Approve or reject substitutions.
- Request cancellation when eligible.
- Request support.
- View own order history.
- Save occasion reminders when enabled.
- Submit ratings and feedback.
- Download receipts or order summaries when available.

### Restricted actions

A customer may not:

- View other customers.
- View another customer's order.
- View partner internal notes.
- View partner financial records.
- View courier private data beyond what is operationally necessary.
- Change trusted order totals.
- Mark orders as delivered.
- Approve own refunds.
- Force a state transition.
- Access raw audit logs.
- Change partner assignment.
- Edit an order after irreversible work without approved workflow.

---

## 6. Partner operator

### Definition

A staff member who performs day-to-day tasks at a Punto MPHO.

### Main responsibilities

- Respond to order offers.
- Confirm stock.
- Confirm external package receipt.
- Report issues.
- Prepare gifts.
- Upload evidence.
- Mark orders ready.
- Confirm courier handoff.

### Allowed actions

A partner operator may:

- View orders assigned to the operator's partner.
- View only the operational information needed for assigned orders.
- Accept or reject offers if authorized by the partner.
- Confirm stock.
- Report out-of-stock.
- Confirm package receipt.
- Report package damage.
- Start preparation.
- Update preparation status.
- Upload required evidence.
- Mark an order ready.
- Confirm handoff to courier.
- Add operational notes.
- View task deadlines.
- View limited earnings per order if the partner admin allows it.
- Pause own shift availability when supported.

### Restricted actions

A partner operator may not:

- View another partner's orders.
- View all partner financial settings.
- Change commission rules.
- Change payout destination.
- Approve payouts.
- Modify platform-wide catalog configuration.
- Create admin users.
- View customer history unrelated to the order.
- Export recipient data in bulk.
- Delete order history.
- Change final customer price.
- Issue refunds.
- Access MPHO admin functions.

---

## 7. Partner administrator

### Definition

A user responsible for managing a partner account.

### Main responsibilities

- Manage the business profile.
- Manage partner users.
- Manage approved catalog data.
- Manage availability.
- Review earnings and payouts.
- Review incidents.
- Maintain compliance information.

### Allowed actions

A partner administrator may:

- Perform all partner operator actions.
- Invite or deactivate partner users.
- Assign partner roles.
- Manage partner operating hours.
- Manage partner availability.
- Manage partner capabilities subject to MPHO approval.
- Submit catalog items.
- Update permitted product data.
- Update stock and preparation time.
- View partner earnings.
- View payout statements.
- Open partner disputes.
- View partner performance metrics.
- View incidents involving the partner.
- Update partner contact data.
- Update payment information through an approved secure flow.
- Pause the partner.
- Request account closure.

### Restricted actions

A partner administrator may not:

- Approve the partner's own platform status.
- Approve unreviewed restricted capabilities.
- View other partners' data.
- Change MPHO fees.
- Change platform-wide pricing.
- Mark payouts as paid.
- Approve refunds.
- Override delivery status without evidence.
- Delete financial history.
- Access platform secrets.
- Modify another partner.

---

## 8. Courier

### Definition

A person or delivery service user responsible for transporting an order.

The courier role may represent:

- Independent courier.
- Partner-employed courier.
- Delivery-provider user.
- Temporary delivery link with limited access.

### Main responsibilities

- Collect the correct order.
- Protect the gift.
- Follow delivery instructions.
- Update delivery status.
- Capture delivery evidence.
- Report incidents.

### Allowed actions

A courier may:

- View assigned delivery.
- View pickup address.
- View destination address.
- View recipient contact information required for delivery.
- Confirm pickup.
- Mark out for delivery.
- Report delivery incident.
- Confirm delivery.
- Upload proof of delivery.
- View own delivery history when applicable.
- View own delivery earnings when applicable.

### Restricted actions

A courier may not:

- Open the gift.
- View product cost or partner earnings.
- View unrelated customer information.
- View other couriers' assignments.
- Change product or personalization.
- Approve refunds.
- Change partner assignment.
- Mark delivered without required evidence.
- Access MPHO partner or admin panels.

---

## 9. MPHO operator

### Definition

An internal operations user who handles routine exceptions and support.

### Main responsibilities

- Monitor exceptions.
- Assist customers and partners.
- Review evidence.
- Coordinate reassignment.
- Handle operational incidents.
- Escalate financial or security issues.

### Allowed actions

An MPHO operator may:

- View orders across the platform.
- View operational customer and partner data.
- Review state history.
- Review evidence.
- Contact customer, partner, or courier through approved channels.
- Reassign an order when rules allow.
- Pause an order.
- Create an incident.
- Request customer approval.
- Request partner correction.
- Trigger approved notifications.
- Mark an exception resolved.
- Initiate a cancellation request.
- Initiate a refund request.
- Add internal notes.
- View non-sensitive operational metrics.

### Restricted actions

An MPHO operator may not:

- Change platform-wide financial rules.
- Mark a refund as completed without provider confirmation.
- Mark a payout as paid.
- Change administrator roles.
- Access production secrets.
- Modify audit history.
- Delete orders.
- Approve unrestricted high-risk overrides.
- Access full payment credentials.
- Change legal agreements.

---

## 10. MPHO administrator

### Definition

A trusted internal user with platform-wide administrative authority.

### Main responsibilities

- Configure the platform.
- Approve partners.
- Configure capabilities.
- Manage zones.
- Manage pricing rules.
- Manage permissions.
- Review security.
- Approve sensitive financial actions.
- Audit operations.

### Allowed actions

An MPHO administrator may:

- Perform MPHO operator actions.
- Approve, restrict, pause, suspend, or close partners.
- Configure partner capabilities.
- Configure cities and zones.
- Configure pricing rules.
- Configure fees and commissions.
- Configure product categories.
- Configure delivery rules.
- Configure feature flags.
- Manage internal users.
- Approve sensitive refunds or adjustments.
- Review payout preparation.
- Review audit logs.
- Manage platform settings.
- Manage integration configuration references.
- View security alerts.
- Export authorized reports.
- Review performance and financial metrics.

### Restricted actions

Even an MPHO administrator must not:

- View raw payment-card data.
- Read secrets directly from the application UI.
- Delete financial history.
- Remove audit evidence.
- Bypass provider verification.
- Change historical order totals silently.
- Impersonate users without an auditable support mechanism.
- Approve own sensitive action when dual approval is required.

---

## 11. Service account

### Definition

A non-human identity used by trusted systems.

Examples:

- Payment webhook processor.
- WhatsApp notification service.
- n8n workflow.
- Scheduled availability job.
- Delivery integration.
- Background queue worker.

### Allowed actions

A service account may perform only explicitly assigned actions.

Examples:

- Update payment status from verified webhook.
- Send notification.
- Recalculate MPHORA eligibility.
- Create audit event.
- Process scheduled reminders.
- Update delivery status from verified provider event.
- Expire quotes.
- Release stock reservations.

### Restricted actions

A service account may not:

- Use unrestricted administrator access by default.
- Read unrelated personal data.
- Change pricing outside its assigned workflow.
- Approve financial adjustments.
- create users unless explicitly required.
- bypass audit logs.
- operate without credential rotation.

---

## 12. Resource ownership

Every protected resource must have ownership or scope.

Examples:

### Customer-scoped

- Customer profile.
- Customer address.
- Recipient profile created by customer.
- Customer order.
- Customer reminder.

### Partner-scoped

- Partner profile.
- Partner users.
- Partner catalog.
- Partner availability.
- Partner earnings.
- Partner payout.
- Partner incident.

### Platform-scoped

- City.
- Zone.
- Global pricing rule.
- Product category.
- Feature flag.
- Admin configuration.
- Audit log.

### Order-scoped

- Order items.
- Personalization.
- Evidence.
- Delivery.
- Incident.
- Payment.
- Refund.
- State history.

---

## 13. Sensitive data classes

### Highly sensitive

- Payment provider tokens.
- Payout account data.
- Government or tax identification.
- Authentication secrets.
- Internal security logs.

### Sensitive personal

- Recipient address.
- Customer phone.
- Recipient phone.
- Private messages.
- Delivery instructions.
- Private evidence.

### Operational

- Order status.
- Preparation instructions.
- Partner deadlines.
- Courier assignment.

### Public

- Published product listing.
- Public partner name when approved.
- Public product images.
- Public support information.

Access must depend on data class.

---

## 14. Permission matrix

| Action | Guest | Customer | Partner operator | Partner admin | Courier | MPHO operator | MPHO admin | Service |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Browse public catalog | Yes | Yes | Yes | Yes | Limited | Yes | Yes | Limited |
| Create draft order | Limited | Yes | No | No | No | Assisted | Yes | No |
| Pay order | No | Own | No | No | No | No | No | Provider only |
| View customer order | No | Own | Assigned only | Assigned only | Delivery only | Yes | Yes | Scoped |
| Accept partner offer | No | No | Scoped | Scoped | No | Assisted | Yes | No |
| Confirm stock | No | No | Scoped | Scoped | No | Assisted | Yes | Scoped |
| Upload preparation evidence | No | No | Scoped | Scoped | No | Assisted | Yes | Scoped |
| Confirm delivery | No | No | No | Own delivery only | Assigned | Assisted | Yes | Provider |
| View partner earnings | No | No | Optional limited | Own partner | Own delivery only | Limited | Yes | Scoped |
| Approve partner | No | No | No | No | No | No | Yes | No |
| Change global pricing | No | No | No | No | No | No | Yes | No |
| Approve refund | No | No | No | No | No | Request only | Yes | Verified provider |
| View audit logs | No | No | No | Own limited | No | Limited | Yes | Write only |
| Manage internal users | No | No | No | No | No | No | Yes | No |

`Scoped` means only records explicitly assigned to that identity.

---

## 15. Temporary access

Temporary access may be used for:

- Courier delivery link.
- Support verification.
- Recipient confirmation.
- Package receipt confirmation.

Rules:

- Expire automatically.
- Grant minimal permissions.
- Be tied to one resource.
- Be revocable.
- Be logged.
- Avoid exposing unrelated data.

---

## 16. Impersonation and support access

If support impersonation is ever introduced:

- It must be clearly indicated.
- It must be time-limited.
- It must be logged.
- Sensitive financial actions must remain blocked.
- The original internal actor must remain identifiable.
- The user should not be impersonated through shared passwords.

---

## 17. Approval levels

Sensitive actions may require approval levels.

### Single approval

- Standard order reassignment.
- Non-financial correction.
- Partner pause.
- Evidence review.

### Elevated approval

- Large refund.
- Negative partner adjustment.
- Partner suspension.
- High-value order override.
- Security-role change.
- Manual payment-state correction.

The exact threshold will be defined later.

---

## 18. Audit requirements

Log at minimum:

- Sign in.
- Role change.
- Partner approval.
- Partner suspension.
- Price override.
- Order reassignment.
- Refund approval.
- Earnings adjustment.
- Payout status change.
- Evidence deletion request.
- Sensitive-data access.
- Delivery override.
- Permission failure.

Each log should include:

- Actor.
- Role.
- Resource.
- Action.
- Timestamp.
- Result.
- Reason.
- IP or session metadata when appropriate.

---

## 19. Role lifecycle

A user role may move through:

```text
invited
active
paused
disabled
revoked
```

Rules:

- Disabled users lose access immediately.
- Historical actions remain.
- Role changes are logged.
- Removed partner users keep no access to partner data.
- Closing an account does not delete financial or audit records.

---

## 20. Multi-role users

A person may hold more than one role only when necessary.

Examples:

- A partner admin may also be an operator.
- A partner may also perform own delivery.

Avoid merging roles into one broad super-role.

Permissions should remain explicit.

---

## 21. MVP role scope

Required for MVP:

- Guest.
- Customer.
- Partner operator.
- Partner admin.
- MPHO operator.
- MPHO admin.
- Service account.

Courier access may initially be:

- A lightweight temporary delivery link.
- An admin-managed record.
- A direct courier role.

The implementation choice must preserve traceability.

---

## 22. Summary

MPHO permissions must follow three questions:

1. Who is the actor?
2. Which resource is the actor allowed to access?
3. Which exact action is allowed on that resource?

No role should gain access merely because a user interface exposes a button.

All sensitive actions must be server-authorized and auditable.
