# 27_SECURITY_AND_PRIVACY.md

> Phase 8 implementation note (2026-07-16): payment secrets and elevated Supabase access live only in exact `server-only` modules guarded by the secret scanner. Provider events are sanitized; Customer DTOs omit provider IDs/status detail; checkout URLs remain owner-only and disappear after expiry.

## 1. Purpose

This document defines the security and privacy baseline for MPHO.

It explains:

- Security principles.
- Data classification.
- Authentication.
- Authorization.
- Session protection.
- Secrets.
- Encryption.
- Privacy.
- Data minimization.
- Retention.
- Audit.
- Incident response.
- File security.
- Provider security.
- MVP requirements.

This document is mandatory for customer, partner, admin, AI, financial, and delivery development.

---

## 2. Security objectives

MPHO must protect:

- Customer accounts.
- Recipient information.
- Partner data.
- Order integrity.
- Payment state.
- Partner earnings.
- Payout details.
- Delivery addresses.
- Private evidence.
- Internal admin actions.
- Provider credentials.
- Audit history.

Security must not depend only on hiding buttons in the UI.

---

## 3. Security principles

- Least privilege.
- Defense in depth.
- Secure by default.
- Server-side authorization.
- Data minimization.
- Explicit trust boundaries.
- Immutable audit.
- Strong idempotency.
- Safe failure.
- Environment separation.
- No secrets in code.
- No silent financial edits.

---

## 4. Data classification

### Public

Examples:

- Published product title.
- Public product image.
- Public category.
- Approved public partner name.
- Public policies.

### Internal operational

Examples:

- Order state.
- Preparation deadline.
- Partner task.
- Delivery provider.
- Incident category.

### Sensitive personal

Examples:

- Customer phone.
- Recipient phone.
- Delivery address.
- Private message.
- Saved recipient.
- Support conversation.
- Delivery proof.

### Highly sensitive

Examples:

- Payout account.
- Tax identification.
- Authentication secret.
- Provider secret.
- Admin security event.
- Private legal document.

### Financial

Examples:

- Payment reference.
- Refund.
- Partner earning.
- Payout.
- Ledger.
- Contribution margin.

---

## 5. Data minimization

Collect only what is needed.

Examples:

- HADIA does not need full address before recommendations.
- Partner does not need customer history.
- Courier does not need partner earnings.
- Customer does not need courier private data.
- Analytics does not need recipient address.
- AI provider does not need payout data.

---

## 6. Authentication

Authentication options may include:

- Email and password.
- Magic link.
- Phone verification.
- Google.
- Apple.
- Partner invitation.
- Admin MFA.

Requirements:

- Secure password hashing through approved provider.
- Email or phone verification when needed.
- Session revocation.
- Account disable.
- Brute-force protection.
- Secure recovery.
- Admin MFA when available.
- Suspicious-login monitoring.

---

## 7. Session security

Sessions should use:

- Secure cookies.
- HTTP-only cookies.
- SameSite controls.
- Shorter admin session lifetime.
- Rotation after sensitive events.
- Revocation on password change.
- Device/session list when feasible.
- Reauthentication for high-risk actions.

Avoid storing sensitive tokens in local storage.

---

## 8. Authorization

Authorization should check:

```text
actor
role
resource
ownership
partner scope
current state
requested action
approval requirement
```

Examples:

- Customer can access only own order.
- Partner can access only assigned order.
- Courier can access only assigned delivery.
- Admin role controls sensitive actions.
- Service account can perform only scoped workflow.

---

## 9. Row-level security

RLS should protect:

- Customers.
- Recipients.
- Addresses.
- Orders.
- Partner records.
- Earnings.
- Payouts.
- Evidence.
- Support cases.

RLS must be tested.

Do not use service-role credentials in browser code.

---

## 10. Admin security

Admin controls should include:

- Strong authentication.
- MFA when supported.
- Restricted role assignment.
- Reauthentication for sensitive actions.
- Audit logging.
- Export controls.
- Session timeout.
- IP or device anomaly monitoring when practical.
- Separate admin route.
- No shared admin accounts.

---

## 11. Partner security

Partner controls should include:

- Partner-scoped access.
- Role separation.
- Immediate user revocation.
- Secure invitations.
- Reauthentication for payout changes.
- Limited recipient data.
- Evidence protection.
- Staff activity audit.
- No access after partner suspension.

---

## 12. Courier security

Courier access should be:

- Assignment-scoped.
- Time-limited when possible.
- Minimal.
- Revocable.
- Logged.

Courier should see only:

- Pickup.
- Delivery address.
- Necessary contact.
- Delivery instructions.
- Order reference.

---

## 13. Secret management

Secrets include:

- Database service key.
- Payment provider secret.
- Webhook secret.
- WhatsApp token.
- AI provider key.
- Delivery provider key.
- Email key.
- Encryption key.

Rules:

- Store in secure environment variables or secret manager.
- Never commit.
- Never log.
- Rotate.
- Separate by environment.
- Restrict access.
- Document owner.
- Revoke compromised secret immediately.

---

## 14. Environment separation

Environments:

```text
local
preview
staging
production
```

Requirements:

- Separate credentials.
- Separate databases.
- Separate storage.
- Separate webhooks.
- Separate payment sandbox.
- Separate messaging test setup.
- No production customer data in preview.
- No production payouts in test.

---

## 15. Encryption

Use encryption:

### In transit

- HTTPS.
- TLS for provider connections.
- Secure database connection.

### At rest

- Managed database encryption.
- Storage encryption.
- Additional encryption for payout account data when needed.

### Application level

Consider for:

- Bank information.
- Tax documents.
- Highly sensitive partner records.

---

## 16. Payment security

MPHO must:

- Avoid storing card data.
- Use hosted provider checkout when practical.
- Verify payment webhooks.
- Validate amount and currency.
- Prevent duplicate payment.
- Log financial action.
- Separate provider status from browser redirect.
- Reconcile.
- Protect refund permissions.

---

## 17. Payout security

Payout protections:

- Reauthentication for account change.
- Masked account display.
- Cooling period when appropriate.
- Change notification.
- Admin review for suspicious change.
- Payout idempotency.
- Payout reference.
- Reconciliation.
- Dual approval for large payout when configured.

---

## 18. Webhook security

Every webhook should:

- Verify signature.
- Verify provider.
- Validate timestamp when supported.
- Prevent replay.
- Store provider event ID.
- Use idempotency.
- Reject invalid payload.
- Rate-limit abnormal traffic.
- Avoid revealing validation details.

---

## 19. File upload security

Validate:

- MIME type.
- Extension.
- File size.
- File content when possible.
- Image dimensions.
- Malware scanning when available.
- Storage path.
- Owner.
- Visibility.

Do not trust client filename.

Generate internal storage name.

---

## 20. Private media security

Private media includes:

- Preparation evidence.
- Delivery proof.
- Partner documents.
- Customer QR content.
- Damage photos.

Use:

- Private buckets.
- Signed URLs.
- Short expiration.
- Access checks.
- Audit for sensitive access when possible.
- Retention policy.

---

## 21. Public media security

Public catalog media must be:

- Approved.
- Sanitized.
- Free of private metadata.
- Authorized for use.
- Unrelated to private order evidence.
- Served through safe URLs.

Strip unnecessary EXIF metadata.

---

## 22. Input security

Protect against:

- SQL injection.
- XSS.
- Command injection.
- Path traversal.
- SSRF.
- Malicious file upload.
- Unsafe redirects.
- Prototype pollution.
- JSON abuse.
- Oversized payload.
- Invalid URLs.

Use parameterized queries and runtime validation.

---

## 23. Output security

- Escape rendered content.
- Sanitize user-provided HTML.
- Avoid raw HTML.
- Use safe URLs.
- Avoid exposing internal IDs unnecessarily.
- Mask sensitive values.
- Avoid stack traces.
- Avoid provider payloads in UI.

---

## 24. CSRF

Protect state-changing browser requests through:

- SameSite cookies.
- CSRF tokens when required.
- Origin verification.
- Server actions with trusted framework controls.
- No sensitive GET mutations.

---

## 25. CORS

CORS should be restrictive.

Allow only approved origins.

Do not use `*` for authenticated or sensitive APIs.

---

## 26. Rate limiting

Apply to:

- Login.
- Password reset.
- Account creation.
- HADIA.
- Search.
- Checkout.
- Payment creation.
- Refund request.
- Support.
- Upload.
- Webhooks.

Rate limits should avoid blocking legitimate urgent operations.

---

## 27. Bot and abuse protection

Protect against:

- Credential stuffing.
- Fake accounts.
- Promo abuse.
- Payment fraud.
- Support spam.
- HADIA abuse.
- Scraping.
- Partner offer manipulation.
- Order spam.

Possible controls:

- CAPTCHA where appropriate.
- Device and IP signals.
- Velocity rules.
- Manual review.
- Account verification.
- Rate limits.

---

## 28. HADIA security

HADIA must resist:

- Prompt injection.
- Tool abuse.
- Data exfiltration.
- Secret revelation.
- Cross-customer data leakage.
- Unauthorized admin action.
- Fake payment confirmation.
- Fake stock confirmation.

Tool execution must validate permission independently.

---

## 29. Privacy principles

- Purpose limitation.
- Data minimization.
- Consent.
- Transparency.
- Access control.
- Retention limits.
- Secure deletion where allowed.
- User rights.
- Vendor review.
- Sensitive-data caution.

---

## 30. Customer privacy

Customers should know:

- What data is collected.
- Why it is collected.
- Which data is needed for delivery.
- Which providers receive data.
- How long data is retained.
- How to request correction or deletion.
- Which data must be retained for legal or financial reasons.

---

## 31. Recipient privacy

Recipient data is especially sensitive because the recipient may not have an MPHO account.

Rules:

- Use only for delivery.
- Do not market without consent.
- Do not expose to unrelated partners.
- Do not retain indefinitely without purpose.
- Allow customer correction.
- Limit courier exposure.
- Respect surprise mode.

---

## 32. Partner privacy

Protect:

- Legal name.
- Payout details.
- Tax data.
- Internal performance.
- Disputes.
- Staff data.
- Private agreements.

Do not show one partner's financial information to another.

---

## 33. Consent records

Store:

```text
subject
channel
purpose
status
source
policy_version
consented_at
revoked_at
```

Marketing consent must be separate from transactional communication.

---

## 34. Data retention

Retention periods should be defined for:

- Orders.
- Payments.
- Refunds.
- Earnings.
- Payouts.
- Audit logs.
- HADIA conversations.
- Support messages.
- Delivery proof.
- Partner documents.
- Media.
- Webhook payload references.

Financial records may require longer retention.

Raw conversation and private evidence should not be retained indefinitely without reason.

---

## 35. Data deletion

Deletion request should distinguish:

- Deletable personal data.
- Data that can be anonymized.
- Data that must be retained.
- Financial records.
- Audit records.
- Fraud and security records.

Do not delete required order or payment history.

---

## 36. Data access request

A privacy-request workflow may support:

- Access.
- Correction.
- Deletion.
- Consent withdrawal.
- Marketing opt-out.
- Account closure.

Requests should be authenticated and logged.

---

## 37. Logging privacy

Logs should not include:

- Password.
- Full token.
- Full address.
- Full phone when unnecessary.
- Bank data.
- Raw card data.
- Private message.
- Full AI prompt with sensitive data.
- Raw evidence.

Use masking and identifiers.

---

## 38. Audit logging

Audit:

- Login.
- Role change.
- Partner approval.
- Payout account change.
- Refund approval.
- Price override.
- State override.
- Evidence access.
- Export.
- User disable.
- Secret rotation event.
- Security incident.

Audit logs must be protected from normal editing.

---

## 39. Export security

Exports may contain sensitive data.

Require:

- Authorized role.
- Reason.
- Limited columns.
- Date range.
- Audit event.
- Secure download.
- Expiration.
- Watermark or reference when appropriate.

Avoid bulk export by default.

---

## 40. Third-party vendors

Before using a vendor, review:

- Data processed.
- Purpose.
- Data location.
- Security controls.
- Retention.
- Subprocessors.
- Breach notification.
- Authentication.
- Access.
- Contract.
- Exit plan.

Do not send more data than needed.

---

## 41. Security incident response

Incident flow:

```text
detect
→ contain
→ assess
→ preserve evidence
→ revoke or rotate
→ recover
→ notify internal owner
→ notify affected parties when required
→ document lessons
```

Incident categories:

- Account compromise.
- Data exposure.
- Secret leak.
- Payment fraud.
- Unauthorized refund.
- Payout fraud.
- Provider breach.
- Malicious upload.
- Admin abuse.
- AI data leakage.

---

## 42. Security severity

Suggested levels:

```text
low
medium
high
critical
```

Critical examples:

- Production secret exposed.
- Unauthorized payout.
- Large customer-data exposure.
- Admin account compromise.
- Payment tampering.
- Widespread order-state corruption.

---

## 43. Vulnerability management

Process:

- Dependency scanning.
- Patch review.
- Security advisories.
- Code review.
- Secret scanning.
- Penetration testing before major launch.
- Responsible disclosure channel.
- Prioritized remediation.
- Regression tests.

---

## 44. Backup security

Backups must be:

- Encrypted.
- Access-controlled.
- Tested.
- Retained appropriately.
- Separated from production credentials.
- Included in incident recovery.

---

## 45. Business continuity

Plan for:

- Database outage.
- Provider outage.
- Secret compromise.
- Payment outage.
- WhatsApp outage.
- Delivery outage.
- AI outage.
- Storage outage.
- Admin account loss.

Critical order and financial workflows need manual fallback.

---

## 46. Security headers

Use appropriate headers:

- Content Security Policy.
- HSTS.
- X-Content-Type-Options.
- Referrer Policy.
- Frame protection.
- Permissions Policy.

Configuration must be tested with real application flows.

---

## 47. Dependency security

Rules:

- Use maintained packages.
- Review licenses.
- Pin versions where appropriate.
- Monitor advisories.
- Remove unused packages.
- Avoid packages with excessive permissions.
- Avoid abandoned auth or crypto libraries.

---

## 48. Development security

Developers must:

- Use personal accounts.
- Avoid shared secrets.
- Use protected branches.
- Review pull requests.
- Avoid production data locally.
- Avoid screenshots containing sensitive data.
- Rotate test credentials.
- Keep `.env` out of Git.

---

## 49. Minimum security tests

Test:

- Customer cross-account access.
- Partner cross-tenant access.
- Courier unauthorized access.
- Admin role restriction.
- Expired session.
- Revoked user.
- RLS.
- Signed URL expiration.
- Webhook signature.
- Replay attack.
- CSRF.
- XSS.
- Injection.
- Invalid upload.
- Rate limit.
- Payout account change.
- Refund permission.
- Prompt injection.
- Secret scanning.

---

## 50. MVP security baseline

Before real money and real customers:

- HTTPS.
- Secure authentication.
- Server-side authorization.
- RLS.
- Payment webhook verification.
- Delivery webhook verification where used.
- WhatsApp webhook verification.
- Private storage.
- Signed URLs.
- Secret management.
- Audit logs.
- Rate limiting.
- Input validation.
- Error monitoring.
- Database backup.
- Admin protection.
- Privacy notice.
- Consent records.
- Incident response owner.

---

## 51. Definition of done

A feature is security-complete when:

- Threats were considered.
- Permissions are server-enforced.
- Data classification is known.
- Inputs are validated.
- Outputs are safe.
- Logs do not expose secrets.
- Audit exists when needed.
- Retention is defined.
- Tests cover abuse.
- Documentation is updated.

---

## 52. Summary

MPHO handles emotional, operational, financial, and location data.

Trust requires more than secure login.

Every participant must see only the data needed to complete the correct action, and every sensitive action must remain traceable.
