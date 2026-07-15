# 32_SECURITY_CONTROLS_AND_ASVS_CHECKLIST.md

## 1. Purpose

This document converts MPHO security requirements into an implementation and verification checklist.

MPHO will use:

- OWASP ASVS 5.0.0 as the primary application-security baseline.
- OWASP Top 10 2025 for web risk awareness.
- OWASP API Security Top 10 2023 for API controls.
- OWASP Cheat Sheet Series for implementation guidance.
- NIST SSDF for secure development practices.
- OWASP Top 10 for LLM Applications 2025 for HADIA.

Internal target:

```text
ASVS Level 2 baseline for production
Level 3-style controls for privileged, financial, and highly sensitive workflows
```

This is an engineering target, not a claim of formal certification.

---

## 2. Control status

Each control must use one status:

```text
not_started
designed
implemented
tested
verified
not_applicable_with_reason
risk_accepted
```

A control is not `verified` until evidence exists.

Evidence may include a test, migration, configuration, pull request, log, provider confirmation, restore report, or security review.

---

## 3. Release rule

Production is blocked when a critical control is unimplemented, untested, misconfigured, declared not applicable without approval, or dependent on an untested manual process.

---

## 4. Architecture controls

- [ ] Threat model is current.
- [ ] Trust boundaries are documented.
- [ ] Sensitive data flows are documented.
- [ ] Every domain has one source of truth.
- [ ] Order state changes use one transition service.
- [ ] Critical money operations use idempotency.
- [ ] Critical asynchronous events use an outbox or equivalent reliable mechanism.
- [ ] Providers are isolated through adapters.
- [ ] Manual fallback uses audited application services.
- [ ] Direct production database editing is not a normal procedure.
- [ ] Security owner is assigned.
- [ ] Critical residual risks have explicit acceptance.

---

## 5. Authentication controls

- [ ] Privileged accounts require MFA.
- [ ] Phishing-resistant MFA is preferred and required for the highest production privileges when supported.
- [ ] No shared admin accounts.
- [ ] Login and recovery responses do not enumerate accounts.
- [ ] Credential stuffing, password spraying, and brute force are rate-limited.
- [ ] Recovery tokens are random, single-use, and short-lived.
- [ ] MFA recovery is stronger than ordinary login.
- [ ] Email and phone changes require current authentication.
- [ ] Privileged recovery requires human review.
- [ ] Password or MFA changes revoke existing sessions.
- [ ] Disabled users lose access promptly.
- [ ] Admin and partner invitations expire.
- [ ] Recovery codes are stored hashed.
- [ ] Security questions are not a sole recovery mechanism.

---

## 6. Session controls

- [ ] Cookies use `Secure`.
- [ ] Cookies use `HttpOnly`.
- [ ] `SameSite` is configured appropriately.
- [ ] Session rotates after login.
- [ ] Session rotates after privilege elevation.
- [ ] Idle timeout exists.
- [ ] Absolute timeout exists.
- [ ] Admin timeout is shorter than customer timeout.
- [ ] Sensitive actions require recent authentication.
- [ ] Logout invalidates the server session.
- [ ] Role removal revokes active access.
- [ ] Sensitive tokens are not placed in local storage when secure cookies are available.
- [ ] Session identifiers contain no PII.
- [ ] Session lifecycle is logged without token values.

---

## 7. Authorization controls

- [ ] Deny by default.
- [ ] Every request checks actor, role, resource, ownership, current state, and action.
- [ ] Customer identity is derived server-side.
- [ ] Partner scope is derived server-side.
- [ ] Courier scope is assignment-specific.
- [ ] Admin permissions are granular.
- [ ] Property allowlists prevent mass assignment.
- [ ] UUID secrecy is not treated as authorization.
- [ ] Cross-customer tests exist.
- [ ] Cross-partner tests exist.
- [ ] Cross-courier tests exist.
- [ ] Service accounts have narrow scopes.
- [ ] Elevated database credentials do not bypass business authorization silently.

---

## 8. Supabase database controls

- [ ] Every private table has RLS enabled in the creation migration.
- [ ] Default behavior is no client access until a policy is added.
- [ ] Grants and RLS policies are reviewed together.
- [ ] `service_role` or secret keys are server-only.
- [ ] Browser uses only the approved low-privilege publishable key.
- [ ] Elevated backend operations enforce actor and tenant explicitly.
- [ ] RLS tests run in CI.
- [ ] `security definer` functions are minimized and reviewed.
- [ ] Privileged functions set a safe `search_path`.
- [ ] Views do not unexpectedly bypass RLS.
- [ ] Constraints enforce critical invariants.
- [ ] Migrations are versioned.
- [ ] Audit tables are protected from normal update and delete.

Recommended migration order:

```text
create table
→ enable RLS
→ revoke unnecessary privileges
→ add required grants
→ create policies
→ add constraints and indexes
→ add RLS tests
```

---

## 9. Supabase Storage controls

- [ ] Private buckets are private.
- [ ] Storage RLS is enabled.
- [ ] Upload paths are generated or safely scoped.
- [ ] Users cannot upload into another tenant path.
- [ ] Users cannot read another order's evidence.
- [ ] Signed URLs are short-lived.
- [ ] Catalog media and private evidence use separate buckets.
- [ ] Private evidence is never copied automatically into a public bucket.
- [ ] File metadata is validated.
- [ ] Storage access tests run in CI.

---

## 10. Input validation controls

- [ ] Runtime schemas validate all untrusted input.
- [ ] Validation occurs server-side.
- [ ] Allowlists are used where practical.
- [ ] Unexpected properties are rejected or deliberately stripped.
- [ ] IDs are validated.
- [ ] Currency is validated.
- [ ] Money uses integer minor units.
- [ ] Dates and time zones are validated.
- [ ] URLs are parsed by a safe parser.
- [ ] Request-body size limits exist.
- [ ] Nested JSON depth and size are limited.
- [ ] Errors do not echo secrets or unsafe content.

---

## 11. Output encoding and XSS controls

- [ ] Framework escaping remains enabled.
- [ ] Raw HTML is prohibited unless sanitized.
- [ ] Markdown is rendered with a safe configuration.
- [ ] Product, partner, support, external, and AI content is treated as untrusted.
- [ ] CSP is configured and tested.
- [ ] User-controlled URLs use allowlists.
- [ ] Unsafe URL schemes are rejected.
- [ ] File metadata is not rendered as HTML.
- [ ] XSS tests exist.

---

## 12. HTTP security headers

A tested production configuration should include:

```text
Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options: nosniff
Referrer-Policy
Permissions-Policy
frame-ancestors through CSP
```

Additional requirements:

- [ ] No wildcard CORS for authenticated APIs.
- [ ] CSP supports only required payment and provider origins.
- [ ] Sensitive responses use `Cache-Control: no-store` where appropriate.
- [ ] Private pages are not indexed.
- [ ] Error pages do not reveal platform internals.

---

## 13. CSRF controls

- [ ] State-changing GET requests do not exist.
- [ ] Cookie-authenticated mutations use framework CSRF protection, tokens, or equivalent.
- [ ] Origin is validated for sensitive browser actions.
- [ ] SameSite is configured.
- [ ] Sensitive actions require reauthentication.
- [ ] CORS is not treated as CSRF protection.
- [ ] Webhooks use provider authentication rather than CSRF tokens.

---

## 14. API controls

- [ ] Every object access checks ownership.
- [ ] Every property update uses an allowlist.
- [ ] Every privileged function checks role.
- [ ] Pagination has a maximum size.
- [ ] Filters use controlled fields.
- [ ] Search cannot become arbitrary SQL.
- [ ] Rate limits exist.
- [ ] Timeouts exist.
- [ ] External contracts are versioned.
- [ ] Errors use safe codes and request IDs.
- [ ] Duplicate requests are idempotent.
- [ ] Provider responses are validated.
- [ ] Deprecated endpoints have retirement plans.

---

## 15. SSRF controls

For every remote URL feature:

- [ ] Avoid remote fetch when possible.
- [ ] Provider allowlist exists.
- [ ] Scheme allowlist exists.
- [ ] Ports are restricted.
- [ ] DNS is resolved and checked before connection.
- [ ] Private and special-use networks are blocked.
- [ ] Redirect targets are revalidated.
- [ ] Redirect count is limited.
- [ ] Timeout is short.
- [ ] Response size is limited.
- [ ] Content type is validated.
- [ ] Internal response content is not exposed.
- [ ] Cloud metadata addresses are blocked.
- [ ] Tests include IPv4, IPv6, redirects, encoding, and DNS rebinding cases.

---

## 16. File upload controls

- [ ] Allowed file types are defined per feature.
- [ ] Extension, MIME, and file signature are validated.
- [ ] Maximum size, dimensions, duration, and count exist.
- [ ] Filename is generated internally.
- [ ] Upload is stored outside executable paths.
- [ ] Private by default.
- [ ] Malware scan or quarantine exists where practical.
- [ ] Approved images are re-encoded where appropriate.
- [ ] Archives are prohibited in MVP.
- [ ] SVG is prohibited unless a reviewed sanitizer exists.
- [ ] Correct content type and disposition are used when serving.
- [ ] Failed uploads are cleaned.
- [ ] Retention exists.
- [ ] Duplicate evidence can be detected.

---

## 17. Payment and transaction controls

- [ ] Hosted or provider-controlled payment entry is used.
- [ ] MPHO stores no payment-card data.
- [ ] Payment is confirmed by verified provider event.
- [ ] Amount and currency match.
- [ ] Payment ID is unique.
- [ ] Repeated events cause no duplicate effects.
- [ ] Refund cannot exceed remaining refundable balance.
- [ ] Refund requires reason and authorization.
- [ ] High-risk refund requires step-up and approval.
- [ ] Payout is tied to exact partner, account, amount, and currency.
- [ ] Material transaction changes invalidate approval.
- [ ] Final authorization gate exists.
- [ ] Daily reconciliation exists.
- [ ] Ledger entries are immutable through normal UI.
- [ ] Corrections use adjustments.
- [ ] PCI scope is documented with qualified guidance.

---

## 18. Business-logic controls

- [ ] State transitions are sequential and validated.
- [ ] Client cannot skip states.
- [ ] Partner acceptance cannot occur after expiration.
- [ ] Only one responsible partner exists.
- [ ] Only one accepted offer exists.
- [ ] Stock reservations cannot oversell.
- [ ] Cancelled order cannot continue to delivery.
- [ ] Delivered order cannot return to preparation.
- [ ] External product cannot be treated as local stock.
- [ ] MPHORA eligibility expires.
- [ ] Payout-account change creates a hold.
- [ ] Customer-visible and executed financial values match.
- [ ] Evidence requirements cannot be bypassed through direct API calls.

---

## 19. HADIA controls

- [ ] Prompt is not an authorization control.
- [ ] Tool allowlist exists.
- [ ] Tool input uses runtime validation.
- [ ] Tools inherit authenticated tenant scope.
- [ ] HADIA has no refund, payout, payment, state-override, or admin tool.
- [ ] External catalog text is marked untrusted.
- [ ] Structured output is validated.
- [ ] Model timeout exists.
- [ ] Token and cost limits exist.
- [ ] Per-user rate limits exist.
- [ ] AI outage fallback exists.
- [ ] Cross-session leakage tests exist.
- [ ] Prompt-injection tests exist.
- [ ] Human approval exists for consequential changes.
- [ ] AI logs minimize PII.
- [ ] Model and prompt versions are recorded for important output.

---

## 20. Logging controls

- [ ] Security-relevant events are logged.
- [ ] Financial actions are logged.
- [ ] Role and payout-account changes are logged.
- [ ] Webhook failures are logged.
- [ ] RLS denial patterns are monitored.
- [ ] Logs use synchronized time and request IDs.
- [ ] Tokens and secrets are excluded.
- [ ] PII is masked.
- [ ] Structured logging prevents log injection.
- [ ] Retention is defined.
- [ ] Admin access to logs is restricted.
- [ ] Critical alerts have owners.
- [ ] Audit logs are tamper-resistant.

---

## 21. Secrets controls

- [ ] Secret inventory exists.
- [ ] Each secret has owner and purpose.
- [ ] Secrets are separated by environment.
- [ ] Secrets are not committed.
- [ ] Secret scanning is enabled.
- [ ] Production secrets are absent from preview.
- [ ] Rotation and leak-response procedures exist.
- [ ] Access is least privilege.
- [ ] Break-glass credentials are protected separately.
- [ ] n8n exports contain no secrets.
- [ ] Logs and build output contain no secrets.
- [ ] Public environment-variable prefixes are reviewed.

---

## 22. CI/CD controls

- [ ] Protected main branch.
- [ ] Pull request required.
- [ ] Required reviewers.
- [ ] CODEOWNERS for sensitive files.
- [ ] Required lint, typecheck, tests, and build.
- [ ] Secret scanning.
- [ ] Dependency review.
- [ ] Code scanning where available.
- [ ] Third-party Actions pinned.
- [ ] Minimal workflow permissions.
- [ ] Forked PRs do not receive production secrets.
- [ ] Deployment identifies commit.
- [ ] Rollback exists.
- [ ] Production deployment approval exists.
- [ ] Lockfile is committed.
- [ ] SBOM or dependency inventory can be generated.

---

## 23. Availability and recovery controls

- [ ] Critical services have RTO and RPO targets.
- [ ] Backups are encrypted.
- [ ] Separate immutable or offline backup exists.
- [ ] Restore is tested.
- [ ] Database, storage, n8n, configuration, and recovery keys are covered.
- [ ] Provider outage fallback exists.
- [ ] Paid orders can be recovered.
- [ ] Financial reconciliation follows recovery.
- [ ] Checkout and MPHORA kill switches exist.
- [ ] Incident command can be activated.

---

## 24. Privacy controls

- [ ] Data inventory exists.
- [ ] Purpose exists for each sensitive field.
- [ ] Recipient data is not used for marketing without consent.
- [ ] Analytics excludes sensitive data.
- [ ] AI receives the minimum data.
- [ ] Retention exists.
- [ ] Deletion and anonymization process exists.
- [ ] Required financial records are preserved.
- [ ] Vendor data sharing is documented.
- [ ] Private evidence access is limited.
- [ ] Export is controlled and audited.

---

## 25. Security evidence package

Each production release should produce:

```text
ASVS control status
threat-model review
RLS test result
dependency scan result
secret scan result
SAST result when available
unit and integration result
E2E result
security header result
backup and restore status
webhook replay result
financial idempotency result
AI red-team result
open risk list
approvals
```

---

## 26. Security exception process

A control may be deferred only when the reason, threat, compensating control, owner, expiration, and risk acceptance are documented.

```text
control
reason
affected component
risk
compensating control
owner
approved_by
approved_at
expires_at
remediation
```

No permanent undocumented exception.

---

## 27. Normative references

- OWASP ASVS 5.0.0  
  https://owasp.org/www-project-application-security-verification-standard/
- OWASP ASVS Cheat Sheet Index  
  https://cheatsheetseries.owasp.org/IndexASVS.html
- OWASP Top 10 2025  
  https://owasp.org/Top10/2025/
- OWASP API Security Top 10 2023  
  https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- NIST SP 800-218 SSDF  
  https://csrc.nist.gov/pubs/sp/800/218/final
- OWASP File Upload Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- OWASP SSRF Prevention Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- OWASP HTTP Security Response Headers Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OWASP CSRF Prevention Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
