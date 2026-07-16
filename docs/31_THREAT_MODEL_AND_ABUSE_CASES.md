# 31_THREAT_MODEL_AND_ABUSE_CASES.md

> Phase 8 threat update: forged/replayed webhooks, price tampering, cross-Customer access, duplicate approvals, late approvals, environment/account mismatch, unsafe redirects and uncertain preference creation are handled through signature validation, authoritative fetch, exact server totals, RLS, deduplication, allowlists and `requires_review`. Residual sandbox/account-correlation evidence is tracked in document 76.

## 1. Purpose

This document defines the formal threat model for MPHO.

It identifies:

- Critical assets.
- Trust boundaries.
- Threat actors.
- Attack surfaces.
- Technical threats.
- Business-logic abuse.
- AI-specific threats.
- Financial fraud paths.
- Required mitigations.
- Required security tests.
- Residual risks.

This document is mandatory before implementing or modifying authentication, authorization, Supabase policies, payments, refunds, partner earnings, payouts, file uploads, webhooks, HADIA tools, delivery proof, admin functions, CI/CD, or production infrastructure.

Security cannot guarantee that no attack will ever succeed. The objective is to remove obvious paths, reduce likelihood, limit blast radius, detect misuse, stop duplicated financial effects, and recover safely.

---

## 2. Method

MPHO uses a combined approach:

1. Decompose the system.
2. Identify trust boundaries.
3. Apply STRIDE-style technical analysis.
4. Analyze business-logic abuse.
5. Rank risk by likelihood and impact.
6. Define preventive, detective, and recovery controls.
7. Convert each important threat into a test or operational exercise.
8. Review the model whenever the attack surface changes.

The model must be updated when MPHO adds a new provider, user role, city, payment method, autonomous AI action, multi-partner order, native application, file type, payout method, public API, or admin permission.

---

## 3. Protected assets

### 3.1 Highest-criticality assets

```text
payment status
approved payment amount
refund state
partner earnings
payout accounts
payout authorization
ledger entries
order state history
admin identities
service credentials
database service credentials
webhook verification secrets
encryption keys
```

### 3.2 Sensitive operational assets

```text
customer identity
recipient identity
delivery address
phone numbers
private gift messages
personalization files
preparation evidence
delivery evidence
partner documents
incident records
support conversations
external purchase references
```

### 3.3 Availability-critical assets

```text
order processing
partner task queue
payment webhook processing
inventory reservations
delivery coordination
notification outbox
MPHORA eligibility
backup and restore capability
```

---

## 4. Trust boundaries

```text
Anonymous internet
    ↓
Public MPHO pages and APIs
    ↓
Authenticated customer boundary
    ↓
Application service boundary
    ↓
PostgreSQL and private storage
```

Additional boundaries:

```text
Customer ↔ MPHO
Partner user ↔ MPHO Aliados
Courier ↔ scoped delivery access
MPHO operator ↔ operational admin
MPHO administrator ↔ privileged admin
Application ↔ Supabase
Application ↔ payment provider
Application ↔ WhatsApp provider
Application ↔ delivery provider
Application ↔ AI provider
Application ↔ n8n
GitHub Actions ↔ Vercel
Vercel ↔ production services
External product URL ↔ MPHO fetch or validation service
```

Every boundary requires authentication, authorization, validation, logging, and safe failure appropriate to its risk.

---

## 5. Threat actors

- External attacker seeking data, money, service disruption, or credentials.
- Malicious customer attempting false claims, coupon abuse, chargebacks, state manipulation, or cross-account access.
- Compromised customer account.
- Malicious or compromised partner operator.
- Malicious or compromised partner administrator.
- Fake partner using false identity or location.
- Malicious or compromised courier.
- Compromised MPHO operator.
- Compromised MPHO administrator.
- Insider misusing legitimate access.
- Supply-chain attacker compromising a dependency, GitHub Action, provider, or build artifact.
- Bot attempting scraping, credential stuffing, HADIA cost exhaustion, spam, or reservation denial.
- AI prompt-injection attacker.
- Compromised or faulty external provider.

---

## 6. Risk scoring

```text
Likelihood: 1 to 5
Impact: 1 to 5
Risk score = Likelihood × Impact
```

Severity:

```text
1–4   Low
5–9   Medium
10–15 High
16–25 Critical
```

Impact must include financial loss, privacy harm, delivery harm, operational interruption, regulatory exposure, partner impact, customer impact, reputation, and recovery cost.

Critical threats require a blocking production control.

---

## 7. Attack surface inventory

### Identity

- Registration.
- Login.
- MFA.
- Password reset.
- Magic links.
- OAuth.
- Session cookies.
- Email or phone change.
- Role invitation.
- Account recovery.
- Admin access.

### Customer application

- Search.
- HADIA.
- Cart.
- Quote.
- Checkout.
- Address.
- Personalization.
- Support.
- Order tracking.
- Cancellation.
- Refund request.

### Partner application

- Offer acceptance.
- Stock confirmation.
- Package receipt.
- Evidence upload.
- Ready state.
- Handoff.
- Earnings.
- Payout-account change.
- Staff management.

### Admin application

- Partner approval.
- Role assignment.
- Pricing.
- Refunds.
- Payouts.
- State overrides.
- Exports.
- Feature flags.
- Security settings.

### Infrastructure

- GitHub.
- CI/CD.
- Vercel.
- Supabase.
- Storage.
- n8n.
- DNS.
- Email.
- WhatsApp.
- Payment provider.
- Delivery provider.
- AI provider.

---

## 8. Core threat register

## TM-001 — Broken object-level authorization

### Attack

A customer changes an order identifier and obtains another customer's order, address, evidence, or refund status. A partner changes a resource identifier and obtains another partner's orders, earnings, catalog, or payout data.

### Required controls

- Server-side ownership check on every resource.
- Supabase RLS default deny.
- Partner ID derived from verified role context, not request body.
- Customer ID derived from authenticated profile, not request body.
- Do not rely on UUID secrecy.
- Signed URLs scoped and short-lived.
- Cross-tenant automated tests.
- Audit denied access attempts.

---

## TM-002 — Broken function-level authorization

A lower-privileged user directly calls an admin, refund, payout, or partner-approval endpoint.

Controls:

- Explicit server permission matrix.
- Deny by default.
- Sensitive routes separated from customer routes.
- Reauthentication and step-up authorization.
- No privilege decision based only on a hidden button.

---

## TM-003 — Mass assignment and property injection

An attacker adds fields such as:

```text
role = mpho_admin
payment_status = approved
partner_earning = 500000
is_mphora = true
responsible_partner_id = attacker
```

Controls:

- Request schemas with allowlisted fields.
- Separate DTOs per role and action.
- Never spread request objects directly into database writes.
- Sensitive fields generated server-side.
- Database constraints.
- Property-level authorization tests.

---

## TM-004 — Credential stuffing and account takeover

Controls:

- MFA mandatory for privileged users.
- Phishing-resistant MFA preferred for privileged access.
- Rate limiting by account, IP, device, and risk.
- Breached-password screening where supported.
- Generic login and recovery responses.
- Session and device visibility.
- Alert on unusual privileged login.
- Revoke sessions after password or MFA change.
- No security questions as sole recovery.

---

## TM-005 — Session theft, fixation, or replay

Controls:

- Secure, HttpOnly, SameSite cookies.
- Session rotation after authentication and privilege elevation.
- Idle and absolute timeouts.
- Reauthentication for financial actions.
- Revoke on account disable.
- No sensitive session token in local storage when secure cookies are available.
- Log lifecycle without logging token values.

---

## TM-006 — Account recovery takeover

Controls:

- Short-lived single-use recovery tokens.
- Generic response to prevent enumeration.
- Current-factor confirmation for email, phone, or MFA changes.
- Delay and notification for privileged-account recovery.
- Human review for admin recovery.
- Recovery codes stored hashed.
- Revoke all sessions after sensitive recovery.
- No support-agent override without audit and second approval.

---

## TM-007 — Privileged account compromise

Controls:

- Separate named admin accounts.
- No shared accounts.
- Phishing-resistant MFA.
- Short admin sessions.
- Reauthentication for sensitive actions.
- Role separation.
- Two-person approval for large refunds, payouts, payout-account changes, and role elevation.
- Break-glass account stored offline and monitored.
- Alerts for new admin, MFA reset, export, secret access, or unusual login.

---

## TM-008 — Supabase elevated credential exposure

Controls:

- Publishable key only in browser.
- Secret or service-role key only in backend.
- Secret scanning and push protection.
- Environment validation.
- Build check for forbidden secret patterns.
- Rotation playbook.
- Backend using elevated credentials must still enforce tenant and role scope.

---

## TM-009 — Forged or replayed webhook

Controls:

- Provider signature verification.
- Timestamp tolerance where supported.
- Provider event-ID uniqueness.
- Payload validation.
- Amount, currency, order, and provider-reference validation.
- Replay protection.
- Rate limit abnormal traffic.
- Store raw event hash or reference.
- Domain transition service validates current state.
- No direct state update from payload.

---

## TM-010 — Duplicate financial effects

Potential duplicates:

- Payment.
- Stock reservation.
- Refund.
- Earning.
- Payout.
- External purchase.
- Courier request.

Controls:

- Idempotency keys.
- Unique constraints.
- Database transaction.
- Expected-state condition.
- Provider reference uniqueness.
- Outbox pattern.
- Reconciliation.
- Duplicate-event tests.

---

## TM-011 — Transaction-data tampering and TOCTOU

Controls:

- What You See Is What You Sign for sensitive transactions.
- Server-generated transaction summary.
- Authorization tied to exact amount, currency, destination, and operation.
- Any material change invalidates prior approval.
- Short authorization validity.
- Final server-side authorization gate immediately before execution.
- Version or hash of transaction data.

Applies to refunds, payouts, payout-account changes, commission overrides, and high-value external purchases.

---

## TM-012 — Inventory reservation race

Controls:

- Atomic database update.
- Transaction and row lock or equivalent.
- Unique reservation.
- Version check.
- Reservation expiration.
- Negative-stock constraint.
- Concurrency tests.

---

## TM-013 — Malicious file upload

Controls:

- File-type allowlists per use case.
- Validate extension, MIME, and file signature.
- Size, dimensions, duration, and count limits.
- Generate storage filename.
- Private bucket by default.
- Malware scanning where available.
- Re-encode approved images.
- Quarantine until processing completes.
- No archive extraction in MVP.
- Signed URLs.
- Retention and deletion policy.

---

## TM-014 — Signed URL leakage

Controls:

- Short expiration.
- One resource per URL.
- Authorization before generation.
- Exclude from analytics and long-lived logs.
- Referrer policy.
- Revoke by object state or path change when required.

---

## TM-015 — SSRF through URLs

Potential inputs:

- External product URL.
- Image URL.
- QR destination.
- Webhook configuration.
- Remote file import.

Controls:

- Prefer no server-side remote fetch.
- Allowlist approved providers.
- Block private, loopback, link-local, metadata, multicast, and non-routable addresses.
- Revalidate after redirects.
- Limit redirects and ports.
- HTTPS only where possible.
- Timeouts and response-size limits.
- Isolated fetch service if remote fetching becomes necessary.

---

## TM-016 — Open redirect and malicious deep link

Controls:

- Map internal identifiers to approved destinations.
- Reject arbitrary redirect URL.
- Signed action links.
- Expiration.
- Sensitive action confirmed in authenticated application.
- Prevent host-header poisoning.

---

## TM-017 — Stored or reflected XSS

Potential sources:

- Product descriptions.
- Partner names.
- Customer messages.
- Support notes.
- AI output.
- External text.

Controls:

- Contextual escaping.
- No raw HTML unless sanitized.
- Safe Markdown renderer.
- CSP.
- Treat AI output as untrusted.
- Reject unsafe URL schemes.

---

## TM-018 — Injection

Controls:

- Parameterized queries.
- No shell execution with user input.
- Runtime validation.
- Structured logs.
- Safe path handling.
- No dynamic SQL from client filters.

---

## TM-019 — CSRF

Controls:

- SameSite cookies.
- Framework CSRF protection or tokens for state-changing cookie-authenticated requests.
- Origin validation.
- No mutation through GET.
- Reauthentication for sensitive operations.

---

## TM-020 — API exhaustion and denial of wallet

Targets include HADIA, search, quote creation, maps, payment attempts, messaging, and image processing.

Controls:

- Per-user, IP, device, and route limits.
- Request-size limits.
- AI token and cost budgets.
- Timeouts.
- Concurrency limits.
- Captcha where risk requires.
- Queue limits.
- Cost alerts.
- Circuit breakers.
- Graceful degradation.

---

## TM-021 — HADIA prompt injection

Controls:

- Model is not an authorization boundary.
- Tool allowlist.
- Tool inputs validated outside model.
- Read-only tools by default.
- No payment, refund, payout, delivery-completion, price-change, or admin tools.
- Untrusted catalog content separated from instructions.
- Structured outputs.
- Human approval for consequential action.
- Rate and cost limits.
- Red-team tests.

---

## TM-022 — HADIA excessive agency

HADIA may search catalog, check zones, check MPHORA, create a draft cart, and request human support.

HADIA may not capture payment, approve refund, change price, alter privileged order state, approve partners, initiate payout, purchase external products autonomously, or contact recipients outside an approved workflow.

---

## TM-023 — AI sensitive-data disclosure

Controls:

- Minimize data sent to model.
- Tenant-scoped retrieval.
- No secrets in prompt.
- No payout, payment-instrument, or admin-log data.
- Filter output.
- Prevent cross-session memory.
- Define retention.
- Test leakage scenarios.

---

## TM-024 — Unsafe consumption of external APIs

Controls:

- Validate provider schema.
- Map status explicitly.
- Enforce size and time limits.
- Treat provider text as untrusted.
- Reconcile critical provider state.
- Isolate provider adapters.

---

## TM-025 — n8n workflow compromise

Controls:

- Restrict editor access.
- MFA for n8n administrators.
- Separate test and production.
- No secrets in exported workflows.
- Version workflows.
- Authenticate webhooks.
- Least-privileged credentials.
- Audit workflow changes.
- Critical order and financial state remains in MPHO.

---

## TM-026 — CI/CD supply-chain compromise

Controls:

- Protected main branch.
- Required review.
- CODEOWNERS for sensitive files.
- Required tests.
- Pin third-party GitHub Actions to full commit SHA.
- Minimal workflow permissions.
- No production secrets in forked PRs.
- Dependency review.
- Secret scanning.
- Code scanning.
- Lockfile.
- Build provenance where available.
- Emergency rollback.

---

## TM-027 — Preview environment exposure

Controls:

- Deployment protection.
- No production database or provider secrets.
- No real customer data.
- Separate callback URLs.
- Environment banner.
- Preview links are not private merely because they are obscure.

---

## TM-028 — Log and analytics leakage

Never log passwords, tokens, recovery tokens, signed private URLs, full addresses, full bank data, raw card data, or private messages without explicit need.

Use masking, structured logs, request IDs, role-based access, retention, tamper protection, and alerts.

---

## TM-029 — Backup theft or destruction

Controls:

- Encrypted backups.
- Separate credentials.
- Offline or immutable copy.
- Restore tests.
- Access monitoring.
- Backup deletion protection.
- Key recovery plan.

---

## TM-030 — Fake partner or partner-account takeover

Controls:

- Business identity review.
- Physical-location validation.
- Test order.
- Payout-account verification.
- Cooling period after account changes.
- Notification to known contacts.
- Reauthentication.
- Manual approval before first payout.

---

## TM-031 — Falsified preparation evidence

Controls:

- Evidence linked to order and task.
- Timestamp and file hash.
- Duplicate-image detection.
- Dynamic order identifier in selected risk cases.
- Random review.
- No partner self-approval of disputed evidence.

---

## TM-032 — False delivery or package theft

Controls:

- Courier assignment.
- Pickup verification.
- Handoff proof.
- Recipient code or approved proof for selected risk.
- Provider event.
- Return workflow.
- No delivery completion from an unscoped link.

---

## TM-033 — Refund and chargeback abuse

Controls:

- Refund linked to original payment.
- Refundable-balance calculation.
- Evidence and reason code.
- Approval threshold.
- Velocity checks.
- No refund after payout without financial review.
- Chargeback evidence package.
- Audit.

---

## TM-034 — Coupon, referral, and reservation abuse

Controls:

- Per-customer and per-campaign limits.
- Server-side promo validation.
- Funding-source record.
- Reservation expiration.
- No unlimited anonymous reservations.
- Manual review for repeated identities, devices, or addresses when appropriate.

---

## TM-035 — Internal financial fraud

Controls:

- Separation of duties.
- Creator cannot approve own high-risk transaction.
- Two-person approval.
- Transaction summary.
- Immutable ledger.
- Daily reconciliation.
- Alerts for unusual refund, payout, adjustment, or export.
- Regular access review.

---

## TM-036 — External product manipulation

Controls:

- Approved provider allowlist.
- Human review in MVP.
- Server-stored external source.
- Price revalidation.
- Destination locked to assigned Punto MPHO.
- Approval tied to exact item, amount, seller, and address.
- No arbitrary customer-provided purchase URL without review.
- Receipt and inspection.

---

## 9. Mandatory abuse cases

### AB-001 Cross-customer access

```text
Given Customer A is authenticated
When Customer A requests Customer B order
Then access is denied
And no sensitive metadata is returned
And the denial is logged without leaking data
```

### AB-002 Cross-partner access

```text
Given Partner A operator
When the operator changes partner or order identifiers
Then no Partner B record is accessible
```

### AB-003 Payment replay

```text
Given an approved payment webhook was processed
When the identical event is sent repeatedly
Then only one payment approval, stock reservation, assignment task, ledger post, and notification exist
```

### AB-004 Payout destination change

```text
Given a partner payout account is changed
When a payout is requested immediately
Then the payout is held
And known contacts are notified
And required approval is enforced
```

### AB-005 Unauthorized AI tool

```text
Given HADIA receives a prompt requesting a refund
When the model attempts a financial tool call
Then the tool is unavailable or denied
And human handoff is created
```

### AB-006 Malicious image

```text
Given a file has an allowed extension but invalid content
When uploaded
Then it is rejected or quarantined
And it is never served as executable content
```

### AB-007 State skipping

```text
Given an order is partner_offered
When a client attempts to mark it delivered
Then the transition is rejected
And no financial side effect occurs
```

### AB-008 Admin self-approval

```text
Given an administrator creates a high-risk payout adjustment
When the same administrator attempts final approval
Then approval is blocked when dual control is required
```

---

## 10. Review triggers

Review this model before production, at least quarterly during active development, after a critical incident, after a new integration, after role or permission changes, after payment or payout changes, after AI tool expansion, after adding file types, before entering a new city, and before multi-partner orders.

---

## 11. Residual risk

Every critical threat must have:

```text
owner
preventive control
detective control
response playbook
test
residual risk
accepted_by
review_date
```

OpenCode must not mark a threat resolved merely because a UI check exists.

---

## 12. Normative references

- OWASP Threat Modeling Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html
- OWASP Attack Surface Analysis Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html
- OWASP Business Logic Security Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html
- OWASP API Security Top 10 — 2023  
  https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- OWASP Top 10 — 2025  
  https://owasp.org/Top10/2025/
- OWASP Top 10 for LLM Applications — 2025  
  https://genai.owasp.org/llm-top-10/
- NIST SP 800-63B-4  
  https://csrc.nist.gov/pubs/sp/800/63/b/4/final
