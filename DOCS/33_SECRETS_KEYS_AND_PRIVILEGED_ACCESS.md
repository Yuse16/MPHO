# 33_SECRETS_KEYS_AND_PRIVILEGED_ACCESS.md

## 1. Purpose

This document defines how MPHO protects API keys, database credentials, webhook secrets, encryption keys, payment credentials, WhatsApp credentials, delivery credentials, AI credentials, CI/CD credentials, privileged users, emergency access, and payout-account administration.

A leaked secret or privileged account must be treated as a possible system compromise.

---

## 2. Core rules

- No secret in source code.
- No secret in documentation, screenshots, issues, chat, logs, or client bundles.
- No production secret in preview.
- No shared privileged account.
- No permanent privilege without review.
- No privileged recovery through weak email-only support.
- No money-moving action based only on possession of an active session.
- No payout-account change followed by immediate payout without independent control.

---

## 3. Secret inventory

Maintain:

```text
secret_id
name
type
provider
environment
purpose
owner
systems_using_it
privilege_level
storage_location
created_at
last_rotated_at
next_rotation_due
expiration
rotation_method
revocation_method
break_glass_dependency
incident_contact
```

Secret types:

```text
database
supabase_publishable
supabase_secret
supabase_legacy_service_role
payment_api
payment_webhook
whatsapp_api
whatsapp_webhook
delivery_api
delivery_webhook
ai_api
email_api
maps_api
storage_signing
encryption_key
github_token
vercel_token
n8n_credential
dns
```

---

## 4. Classification

### S1 — Public configuration

May be exposed by design, such as a publishable Supabase key. Public configuration never replaces RLS or authorization.

### S2 — Internal configuration

Not intended for public exposure but limited in privilege.

### S3 — Sensitive secret

Can access provider functions or private data.

### S4 — Critical secret

Can bypass RLS, move money, deploy production, administer identity, or decrypt sensitive data.

S4 requires the strongest controls and immediate incident handling after possible exposure.

---

## 5. Approved storage

- Vercel sensitive environment variables when appropriate.
- Supabase managed secret configuration.
- n8n credential store with restricted administration.
- GitHub encrypted secrets for approved CI use.
- Dedicated password manager or secret manager for human emergency access.
- Offline protected storage for break-glass material.

Prohibited:

- Git.
- Committed `.env`.
- Plain text notes.
- Public cloud documents.
- Tickets.
- Screenshots.
- Browser storage.
- n8n workflow JSON.
- Database tables in plaintext without a documented cryptographic design.

---

## 6. Supabase keys

- Browser uses only the approved publishable or low-privilege key.
- Secret and legacy `service_role` keys remain server-side.
- Elevated keys never use `NEXT_PUBLIC_*`.
- Backend code using elevated access must enforce actor, role, tenant, and resource.
- Elevated keys should not be used for ordinary reads that can use RLS safely.
- Separate keys by environment.
- Rotate immediately after suspected exposure.
- Review old deployments, build artifacts, and logs after rotation.

---

## 7. Vercel secrets

- Separate local, preview, staging, and production values.
- Use sensitive variables for secrets where supported.
- Restrict project membership.
- Review who can read or change settings.
- Redeploy after rotation because previous deployments retain their previous values.
- Disable or protect prior deployments after compromise.
- Preview receives no production money-moving secret.
- Validate public prefixes before build.

---

## 8. GitHub and CI secrets

- Use minimum permissions.
- Prefer OIDC or short-lived credentials where supported.
- Avoid long-lived personal access tokens.
- Never expose secrets to untrusted fork code.
- Pin third-party actions to a full commit SHA.
- Review scripts that can access secrets.
- CODEOWNERS reviews workflow changes.
- Log access and deployment identity without logging secret values.
- Revoke contributor tokens immediately after departure.

---

## 9. n8n credentials

- Restrict editor and owner access.
- MFA for privileged n8n users.
- Separate production and test.
- Store credentials in n8n credential mechanisms, never node text.
- Exported workflows contain no secrets.
- Disable unused credentials and nodes.
- Scope provider tokens.
- Audit workflow changes.
- Financial state changes return through validated MPHO server APIs.
- n8n must not hold unrestricted database or payout privilege unless specifically approved.

---

## 10. Secret lifecycle

```text
request
→ approve
→ create
→ distribute
→ use
→ monitor
→ rotate
→ revoke
→ preserve metadata
```

Every S3 and S4 secret requires an owner, purpose, scope, rotation, revocation, and incident plan.

---

## 11. Rotation policy

Rotate because of:

- Scheduled due date.
- Suspected or confirmed leak.
- Provider guidance.
- Employee departure.
- Role change.
- Workflow compromise.
- Repository exposure.
- Unexpected use.
- Provider breach.
- Cryptographic deprecation.

Initial maximum ages, subject to provider capability:

```text
human emergency credentials: 90 days or event-driven
long-lived provider tokens: 90 days or shorter
webhook secrets: 180 days or event-driven
signed links: minutes
recovery tokens: minutes
CI credentials: per job when possible
```

Encryption-key rotation requires versioning and a decryption plan; never delete a key that is still required for retained data or backups.

---

## 12. Safe rotation procedure

1. Identify every consumer.
2. Create a new secret.
3. Use overlap when supported.
4. Deploy consumers.
5. Verify the new credential.
6. Monitor failures.
7. Revoke the old secret.
8. Remove old configuration.
9. Redeploy affected applications.
10. Verify the old secret no longer works.
11. Update inventory.
12. Record an audit event.

For confirmed compromise, immediate revocation may take priority over zero downtime.

---

## 13. Secret leak response

1. Treat the secret as compromised.
2. Identify privilege and exposure window.
3. Revoke or rotate.
4. Search usage logs.
5. Review downstream credentials.
6. Review money, data, and admin actions.
7. Preserve evidence.
8. Redeploy safely.
9. Verify the old secret is invalid.
10. Open an incident.
11. Add prevention tests.

Making a repository private after exposure does not make the old secret trustworthy.

---

## 14. Privileged roles

```text
mpho_admin
security_admin_future
finance_approver_future
production_deployer
database_admin
n8n_admin
provider_admin
dns_admin
```

Privileges should be separated as the organization grows.

---

## 15. Privileged authentication

Mandatory:

- Named account.
- MFA.
- Phishing-resistant authenticator where supported.
- Backup authenticator.
- Secure recovery.
- Short session.
- Reauthentication for sensitive actions.
- Alert on factor reset.
- No shared phone across administrators.
- No SMS-only protection for the highest privileges when stronger options exist.

---

## 16. Step-up authentication

Require recent strong authentication for:

- New administrator.
- Role elevation.
- Payout-account change.
- Payout approval.
- Large refund.
- Negative partner adjustment.
- Secret rotation.
- Sensitive export.
- Production provider change.
- Payment-webhook setting change.
- Break-glass access.

The server must enforce step-up.

---

## 17. Separation of duties

At minimum:

```text
requester ≠ final approver
```

Apply to high-value refunds, payout batches, payout-account changes, negative earning adjustments, new administrators, production secret changes, and disabling security controls.

When the team is too small:

- Document the limitation.
- Require strong reauthentication.
- Add delayed execution.
- Notify an independent owner.
- Review after execution.
- Record risk acceptance.

---

## 18. What You See Is What You Sign

Sensitive authorization shows:

- Operation.
- Amount.
- Currency.
- Destination.
- Partner.
- Order or payout reference.
- Consequence.

Approval is bound to those exact values. Any material change invalidates the approval.

---

## 19. Payout-account change

Required flow:

```text
partner admin reauthenticates
→ enters new account
→ format is validated
→ previous and current verified contacts are notified
→ change enters pending review
→ MPHO approval
→ cooling period
→ provider or small verification when available
→ account becomes active
```

Controls:

- Mask account details.
- Never send full account details through WhatsApp or email.
- Hold high-risk payouts.
- Same session cannot change account and final-approve payout.
- Preserve old account history.
- Alert on new device, location, or repeated changes.

---

## 20. Break-glass access

- Separate emergency account.
- No daily use.
- Strong hardware or phishing-resistant factor.
- Protected by two-person access or two controlled locations.
- Every use creates alerts and incident review.
- Rotate credentials after use.
- Test quarterly without unnecessary production action.
- Minimum scope.
- Never used to bypass financial dual control.

---

## 21. Joiner, mover, leaver

### Joiner

- Approve role.
- Create named account.
- Enroll MFA.
- Grant minimum privilege.
- Record owner.
- Complete training.

### Mover

- Remove old role.
- Review sessions, secrets, and pending approvals.

### Leaver

- Disable immediately.
- Revoke sessions and tokens.
- Remove GitHub, Vercel, Supabase, n8n, provider, password-manager, and DNS access.
- Rotate shared credentials.
- Review recent actions.
- Transfer ownership.
- Preserve audit records.

---

## 22. Access reviews

Initial cadence:

```text
monthly: privileged production access
quarterly: all internal and partner-admin roles
after incident: affected roles
after staffing change: immediate
```

Review need, last use, MFA, scope, dormant accounts, service accounts, and provider dashboards.

---

## 23. Monitoring

Alert on:

- Secret scanning hit.
- Production secret change.
- New administrator.
- MFA reset or disable.
- Payout-account change.
- Large refund or payout.
- Repeated denied privileged action.
- Break-glass login.
- Unexpected service-role use.
- GitHub workflow change.
- Deployment from unapproved branch.

---

## 24. Normative references

- OWASP Secrets Management Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- OWASP Authentication Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Multifactor Authentication Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP Transaction Authorization Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html
- NIST SP 800-63B-4  
  https://csrc.nist.gov/pubs/sp/800/63/b/4/final
- CISA Implementing Phishing-Resistant MFA  
  https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf
- Supabase API keys  
  https://supabase.com/docs/guides/getting-started/api-keys
- Vercel sensitive environment variables  
  https://vercel.com/docs/environment-variables/sensitive-environment-variables
