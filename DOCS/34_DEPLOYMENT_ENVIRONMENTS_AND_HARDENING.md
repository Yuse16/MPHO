# 34_DEPLOYMENT_ENVIRONMENTS_AND_HARDENING.md

## 1. Purpose

This document defines secure deployment, environment isolation, CI/CD, Vercel, Supabase, Next.js, PWA, GitHub, n8n, DNS, provider dashboards, monitoring, and production-hardening requirements.

A secure codebase can become insecure through deployment or configuration. Infrastructure and release controls are therefore part of the product security boundary.

---

## 2. Environment model

Required environments:

```text
local
preview
staging
production
```

A simplified project may temporarily omit staging only through documented risk acceptance. Production must never be treated as a test environment.

---

## 3. Environment isolation

Each environment must use separate:

- Supabase project or isolated database.
- Storage buckets.
- Payment credentials.
- Payment webhooks.
- WhatsApp credentials or approved test numbers.
- Delivery credentials.
- AI keys or budgets.
- Email routing.
- n8n instance or isolated execution configuration.
- Signing and encryption keys.
- Callback URLs.
- Analytics configuration where practical.

No production money-moving credentials are allowed in preview.

---

## 4. Data rules

### Local

- Fictional seed data.
- No production data.
- Provider sandbox.
- Local secrets excluded from Git.

### Preview

- Synthetic data.
- Protected deployment.
- No real payout.
- No production database.
- No real customer messaging.
- Separate callbacks.
- Clear environment banner.

### Staging

- Production-like configuration.
- Sandbox money.
- Test customers, partners, and couriers.
- Migration and restore testing.
- Restricted access.

### Production

- Real data and money.
- Real notifications.
- Real audit.
- Restricted access.
- Formal change approval.

---

## 5. GitHub repository protection

Required:

- Protected `main` branch.
- Pull request required.
- Required status checks.
- No force push to protected branch.
- CODEOWNERS.
- Required review for sensitive files.
- Secret scanning.
- Push protection when available.
- Dependency alerts and review.
- Code scanning when available.
- Traceable releases.
- Least-privileged GitHub Apps.

Sensitive paths include:

```text
.github/workflows/**
supabase/migrations/**
database/**
payments/**
refunds/**
payouts/**
auth/**
authorization/**
security/**
n8n/**
vercel.json
middleware.*
next.config.*
AGENTS.md
docs/31_*
docs/32_*
docs/33_*
docs/34_*
docs/35_*
docs/36_*
docs/37_*
docs/38_*
```

---

## 6. GitHub Actions hardening

- Pin third-party Actions to a full commit SHA.
- Use minimal `permissions`.
- Default workflow permissions to read.
- Grant write only per job.
- Do not use `pull_request_target` with untrusted checkout without a reviewed design.
- Do not pass secrets to fork code.
- Avoid dynamic shell execution from pull-request-controlled values.
- Quote shell variables.
- Prefer OIDC over long-lived deployment tokens where supported.
- Protect production environments with reviewers.
- Audit workflow changes.
- Generate build provenance or artifact attestation when practical.

---

## 7. Required CI pipeline

```text
install from lockfile
→ lint
→ typecheck
→ unit tests
→ integration tests
→ RLS tests
→ security tests
→ migration validation
→ dependency and secret scan
→ build
→ preview deploy
→ E2E smoke
→ production approval
```

Critical failure blocks release.

---

## 8. Dependency controls

- Commit the lockfile.
- Use reproducible install commands.
- Review new dependency purpose, maintenance, license, and privileges.
- Avoid duplicate libraries.
- Remove unused dependencies.
- Alert on known vulnerabilities.
- Patch critical vulnerabilities promptly.
- Generate a dependency inventory or SBOM.
- Record exceptions with expiration.
- Do not blindly execute package install scripts in privileged CI.
- Treat AI-generated dependency recommendations as untrusted until reviewed.

---

## 9. Build security

Build output must not contain:

- Production secrets.
- `.env` files.
- Private keys.
- Supabase secret or service-role keys.
- Customer data.
- Internal exports.
- Debug backdoors.
- Sensitive source maps exposed publicly.

Build checks should detect known secret patterns and unexpected public environment variables, but pattern scanning is not sufficient by itself.

---

## 10. Vercel hardening

- Protect preview deployments.
- Restrict project membership.
- Separate environment variables by environment.
- Use sensitive variables for secrets where available.
- Review who can view and edit settings.
- Redeploy after rotation.
- Review prior deployments after credential compromise.
- Disable search indexing for previews.
- Confirm production domain and HTTPS.
- Configure function region, timeout, and resource limits intentionally.
- Avoid long-running work in request handlers.
- Review logs for PII.
- Require production deployment approval.

---

## 11. Next.js hardening

- Use a supported and patched Next.js version.
- Use Server Components by default where appropriate.
- Keep secrets in server-only modules.
- Prevent server-only modules from entering client bundles.
- Validate and authorize every Server Action.
- Do not rely on route layout for authorization.
- Configure security headers and CSP.
- Disable debug endpoints in production.
- Use safe redirects.
- Avoid raw HTML.
- Protect URL and image proxy features against SSRF.
- Limit request bodies.
- Mark sensitive responses `no-store`.
- Hide production stack traces.
- Validate host when constructing security-sensitive absolute URLs.

---

## 12. Content Security Policy

Begin restrictive:

```text
default-src 'self'
object-src 'none'
base-uri 'self'
frame-ancestors 'none'
```

Add only required sources for payment, Supabase, error monitoring, images, fonts, and analytics.

Prefer nonce or hash-based scripts over broad `unsafe-inline`. Do not add wildcards merely to silence browser errors.

---

## 13. CORS

- Default deny.
- Exact approved origins.
- Never combine credentialed requests with wildcard origin.
- Validate `Origin` for sensitive browser flows.
- CORS is not authorization.
- CORS is not CSRF protection.
- Preview origins do not become permanent production origins without review.

---

## 14. Supabase database hardening

- Enable RLS on every private table.
- Default deny.
- Put grants and policies in migrations.
- Test using real role tokens.
- Minimize exposed tables.
- Restrict privileged functions.
- Set safe `search_path` for privileged functions.
- Avoid dynamic SQL.
- Protect dashboard access.
- Enable backups appropriate to the plan.
- Separate production service credentials.
- Never use production elevated keys locally.

---

## 15. Supabase Storage hardening

- Separate public and private buckets.
- Use RLS.
- Generate safe object paths.
- Validate ownership.
- Use short-lived signed URLs.
- Validate content.
- Strip image metadata where appropriate.
- Prevent executable serving.
- Define cleanup and retention.
- Audit sensitive evidence access where possible.

---

## 16. PWA and service worker

Never cache:

- Auth tokens.
- Payment responses.
- Private order data.
- Recipient addresses.
- Partner earnings.
- Admin pages.
- Signed evidence URLs.
- Refund responses.

Requirements:

- Versioned cache.
- Controlled update.
- Clear offline state.
- No trusted state transition is complete until server confirms.
- Clear private cache on logout.
- Avoid caching authorization errors.
- Test stale service workers after deployment.

---

## 17. n8n hardening

- Separate production instance or strong environment isolation.
- Restrict public access.
- MFA for privileged users.
- Limit editors.
- Use encrypted credential storage.
- Restrict webhook endpoints.
- Validate webhook signatures.
- Limit execution-data retention.
- Redact credentials and PII.
- Version workflows without secrets.
- Backup and restore workflows.
- Keep n8n patched.
- Review community nodes before installation.
- Use least-privileged credentials.
- Financial changes call scoped MPHO server APIs.

---

## 18. DNS and domain security

- Registrar account uses phishing-resistant MFA.
- Registrar lock is enabled.
- Recovery information is protected.
- DNS access is limited.
- Auto-renewal is enabled.
- SPF, DKIM, and DMARC are configured for email.
- Certificate and domain expiration are monitored.
- Abandoned subdomains are removed.
- Subdomain takeover checks are performed.

---

## 19. Provider dashboard security

For payment, WhatsApp, delivery, email, AI, and maps:

- Named accounts.
- MFA.
- Least privilege.
- Separate sandbox and production.
- Access review.
- Webhook secrets.
- Change alerts.
- Billing alerts.
- Credential rotation.
- Audit logs.
- Immediate offboarding.

---

## 20. Monitoring

Monitor:

- Authentication failures.
- Privilege changes.
- RLS denials.
- Webhook signature failures.
- Duplicate financial events.
- Payment mismatch.
- Payout-account changes.
- Sensitive exports.
- Secret access.
- File rejection spikes.
- AI tool denials and cost spikes.
- Provider outages.
- Outbox backlog.
- Deployment changes.

---

## 21. Production checklist

- [ ] Correct domain.
- [ ] HTTPS.
- [ ] HSTS.
- [ ] CSP.
- [ ] secure cookies.
- [ ] exact CORS.
- [ ] no debug.
- [ ] no secret in client bundle.
- [ ] RLS.
- [ ] private storage.
- [ ] webhook signatures.
- [ ] rate limits.
- [ ] backups.
- [ ] monitoring.
- [ ] incident contacts.
- [ ] production provider mode.
- [ ] controlled smoke transaction.
- [ ] rollback tested.

---

## 22. Change management

Every production change records:

```text
change
owner
risk
security impact
database impact
financial impact
rollback
test evidence
approval
deployment time
verification
```

Emergency changes require an incident reference and post-incident review.

---

## 23. Rollback

Rollback planning covers application, feature flags, database migrations, provider configuration, n8n workflows, secrets, payment webhooks, and delivery mappings.

Never roll back a database in a way that destroys newer financial records. Prefer forward fixes for irreversible data migrations.

---

## 24. Post-deployment verification

- Verify release commit and environment.
- Verify migration.
- Verify RLS.
- Verify authentication.
- Verify catalog and quote.
- Verify payment and webhook health.
- Verify partner and admin access.
- Verify notifications.
- Review new errors.
- Confirm no client secret.
- Review old deployment protection.

---

## 25. Normative references

- NIST SP 800-218 SSDF  
  https://csrc.nist.gov/pubs/sp/800/218/final
- GitHub secure use reference  
  https://docs.github.com/en/actions/reference/security/secure-use
- GitHub security features  
  https://docs.github.com/en/code-security/getting-started/github-security-features
- Vercel Deployment Protection  
  https://vercel.com/docs/deployment-protection
- Vercel environment variables  
  https://vercel.com/docs/environment-variables
- Vercel secret rotation  
  https://vercel.com/docs/environment-variables/rotating-secrets
- Supabase RLS  
  https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API security  
  https://supabase.com/docs/guides/api/securing-your-api
- Supabase Storage access control  
  https://supabase.com/docs/guides/storage/security/access-control
