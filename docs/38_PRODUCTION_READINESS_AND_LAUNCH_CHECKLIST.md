# 38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md

> Phase 8 zero-tolerance blockers: complete Docker/Supabase validation, real sandbox matrix, excluded-method proof, account/application correlation evidence, separate live configuration, webhook/secret rotation evidence, production alerts with owners, recovery exercise and incident runbook drill. Payment production remains blocked until all are evidenced.

## 1. Purpose

This document is the final production security gate for MPHO.

The platform must not handle real customers, real addresses, real partner payouts, or real payment transactions until all blocking requirements are satisfied.

No checklist can guarantee that MPHO is impossible to attack.

The launch requirement is:

> Known critical attack paths are controlled, controls are tested, monitoring exists, recovery is tested, and residual risks are explicitly accepted.

---

## 2. Launch decision

```text
GO
GO_WITH_TIME_LIMITED_RISK_ACCEPTANCE
NO_GO
EMERGENCY_SHUTDOWN
```

Only an authorized owner may approve `GO`.

Security-critical unknowns default to `NO_GO`.

---

## 3. Zero-tolerance blockers

Production is blocked by any of the following:

- Supabase secret or service-role credential in the browser.
- Private table without RLS.
- Cross-customer or cross-partner access.
- Unverified payment webhook.
- Duplicate financial effects.
- Refund exceeding the approved payment.
- Payout executable twice.
- Payout destination change without strong verification.
- Shared admin account.
- Privileged account without MFA.
- Private evidence publicly accessible.
- No backup.
- Backup never restored successfully.
- No incident owner.
- No checkout kill switch.
- No audit for financial actions.
- HADIA can move money or perform admin actions.
- Preview uses production data or secrets without approved controls.
- Critical dependency vulnerability without mitigation.
- Production deployment not traceable to a reviewed commit.
- No financial reconciliation process.

---

## 4. Governance sign-off

- [ ] Project owner identified.
- [ ] Security owner identified.
- [ ] Operations owner identified.
- [ ] Financial owner identified.
- [ ] Privacy and legal review owner identified.
- [ ] Partner-support owner identified.
- [ ] Incident commander process defined.
- [ ] Threat model approved.
- [ ] Security exceptions documented.
- [ ] Residual risks accepted.
- [ ] Pack 09 is included in the repository.

---

## 5. Documentation integration

Required:

```text
docs/31_THREAT_MODEL_AND_ABUSE_CASES.md
docs/32_SECURITY_CONTROLS_AND_ASVS_CHECKLIST.md
docs/33_SECRETS_KEYS_AND_PRIVILEGED_ACCESS.md
docs/34_DEPLOYMENT_ENVIRONMENTS_AND_HARDENING.md
docs/35_BACKUP_RECOVERY_AND_BUSINESS_CONTINUITY.md
docs/36_SECURITY_INCIDENT_RESPONSE_RUNBOOK.md
docs/37_FRAUD_RISK_AND_FINANCIAL_CONTROLS.md
docs/38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md
```

`AGENTS.md` and `docs/00_DOCUMENTATION_INDEX.md` must reference these documents.

---

## 6. Identity and access gate

- [ ] Customer authentication works.
- [ ] Partner authentication works.
- [ ] Admin authentication works.
- [ ] Privileged MFA is mandatory.
- [ ] Phishing-resistant MFA is selected where supported.
- [ ] No shared privileged account.
- [ ] Recovery flow tested.
- [ ] MFA reset tested.
- [ ] Session revocation tested.
- [ ] Role removal tested.
- [ ] Admin timeout tested.
- [ ] Sensitive-action reauthentication tested.
- [ ] Break-glass access protected and tested.
- [ ] Access review completed.

---

## 7. Authorization and tenant-isolation gate

- [ ] Customer A cannot access Customer B.
- [ ] Partner A cannot access Partner B.
- [ ] Courier A cannot access Delivery B.
- [ ] Partner operator cannot change payout account.
- [ ] MPHO operator cannot final-approve a restricted financial action.
- [ ] RLS enabled.
- [ ] Storage RLS enabled.
- [ ] Elevated Supabase credential use reviewed.
- [ ] Mass-assignment tests pass.
- [ ] Property-level authorization tests pass.
- [ ] Signed URL expiration tested.
- [ ] Admin exports restricted and audited.

---

## 8. Database and order-integrity gate

- [ ] Migrations versioned.
- [ ] Constraints exist.
- [ ] One responsible partner enforced.
- [ ] One accepted offer enforced.
- [ ] One approved payment enforced.
- [ ] State-transition service enforced.
- [ ] Invalid transition blocked.
- [ ] State history immutable.
- [ ] Audit history protected.
- [ ] Stock concurrency test passes.
- [ ] Cancellation releases reservation.
- [ ] Delivered order cannot revert.
- [ ] External product cannot become local stock incorrectly.
- [ ] Financial history cannot be deleted through normal application paths.

---

## 9. API and webhook gate

- [ ] Runtime input validation.
- [ ] Object and property authorization.
- [ ] Rate limits.
- [ ] Request-size limits.
- [ ] Safe errors and request IDs.
- [ ] Idempotency.
- [ ] Payment signature verification.
- [ ] WhatsApp signature verification.
- [ ] Delivery signature verification where integrated.
- [ ] Replay test.
- [ ] Duplicate webhook test.
- [ ] Stale webhook test.
- [ ] Provider schema validation.
- [ ] Timeout, retry, and degradation plan.
- [ ] Exact CORS.
- [ ] CSRF protection.

---

## 10. Browser and web gate

- [ ] HTTPS.
- [ ] Secure cookies.
- [ ] HSTS.
- [ ] CSP.
- [ ] `nosniff`.
- [ ] Referrer Policy.
- [ ] Permissions Policy.
- [ ] No unsafe raw HTML.
- [ ] XSS tests.
- [ ] Open redirect tests.
- [ ] SSRF tests for URL features.
- [ ] Sensitive responses are not cached.
- [ ] PWA clears private cache.
- [ ] Logout clears local private data.
- [ ] Error pages hide stack and secrets.
- [ ] Production DNS and registrar protected.

---

## 11. File and evidence gate

- [ ] File allowlists.
- [ ] MIME and signature validation.
- [ ] Size, dimension, duration, and count limits.
- [ ] Generated filenames.
- [ ] Private buckets.
- [ ] Signed URLs.
- [ ] Malware or quarantine strategy.
- [ ] Image re-encoding where applicable.
- [ ] SVG and archives prohibited or safely handled.
- [ ] Duplicate-evidence strategy.
- [ ] Delivery-proof privacy reviewed.
- [ ] Failed-upload cleanup.
- [ ] Retention defined.

---

## 12. Payment gate

- [ ] Production provider configured.
- [ ] Hosted checkout or approved architecture.
- [ ] MPHO stores no card data.
- [ ] Amount and currency verified.
- [ ] Payment ID unique.
- [ ] Redirect alone cannot approve payment.
- [ ] Duplicate event creates one effect.
- [ ] Mismatch creates an exception.
- [ ] Reconciliation works.
- [ ] Refund flow tested.
- [ ] Partial refund tested if enabled.
- [ ] Chargeback record exists.
- [ ] PCI responsibility and assessment path documented with qualified guidance.

---

## 13. Earnings and payout gate

- [ ] Earning types defined.
- [ ] Earnings created idempotently.
- [ ] Earning release conditions defined.
- [ ] Cancellation compensation logic exists.
- [ ] Payout account protected.
- [ ] Account-change notifications work.
- [ ] Cooling period works.
- [ ] Strong reauthentication works.
- [ ] Dual approval works where required.
- [ ] One earning cannot enter two payouts.
- [ ] Payout reference required.
- [ ] Failed payout does not duplicate.
- [ ] Reconciliation works.
- [ ] Partner statement works.
- [ ] Manual payout evidence required when manual payouts are used.

---

## 14. Fraud gate

- [ ] Partner identity process.
- [ ] First-payout review.
- [ ] High-risk order review.
- [ ] Refund and payout thresholds.
- [ ] Account-change hold.
- [ ] Promotion limits.
- [ ] Evidence review.
- [ ] False-delivery controls.
- [ ] Chargeback evidence package.
- [ ] Insider separation of duties.
- [ ] Fraud queue.
- [ ] Fraud metrics.
- [ ] False-positive review.

---

## 15. HADIA gate

- [ ] Real catalog grounding.
- [ ] Tenant-safe retrieval.
- [ ] No money tools.
- [ ] No admin tools.
- [ ] No direct privileged order-state tool.
- [ ] Structured output validation.
- [ ] Prompt-injection tests.
- [ ] Sensitive-data disclosure tests.
- [ ] Excessive-agency tests.
- [ ] Cost, token, and rate limits.
- [ ] Deterministic fallback.
- [ ] Human handoff.
- [ ] AI provider data policy reviewed.
- [ ] Model and prompt versions recorded.

---

## 16. MPHORA gate

- [ ] Real stock.
- [ ] Active partner.
- [ ] Partner capacity.
- [ ] Zone and cutoff.
- [ ] Delivery availability.
- [ ] Eligibility expiration.
- [ ] Revalidation before payment.
- [ ] Emergency pause.
- [ ] No external product labeled MPHORA.
- [ ] Fallback to scheduled delivery.
- [ ] Partner rejection behavior.
- [ ] Courier failure behavior.

---

## 17. Partner and delivery gate

- [ ] Partner onboarding.
- [ ] Capability approval.
- [ ] Partner test order.
- [ ] Package receipt evidence.
- [ ] Preparation checklist.
- [ ] Evidence requirement.
- [ ] Courier verification.
- [ ] Pickup proof.
- [ ] Delivery proof.
- [ ] Failed delivery.
- [ ] Return to partner.
- [ ] Lost-package playbook.
- [ ] Minimum recipient-data exposure.
- [ ] Partner and courier access revocation.

---

## 18. CI/CD and supply-chain gate

- [ ] Protected main.
- [ ] Pull request and CODEOWNERS.
- [ ] Required lint, typecheck, tests, and build.
- [ ] Secret scanning.
- [ ] Dependency review.
- [ ] Code scanning.
- [ ] Lockfile.
- [ ] Actions pinned.
- [ ] Minimal workflow permissions.
- [ ] No secrets to untrusted forks.
- [ ] Preview protected.
- [ ] Production approval.
- [ ] Release linked to commit.
- [ ] Rollback.
- [ ] Dependency inventory or SBOM.
- [ ] Critical-vulnerability policy.
- [ ] n8n workflow changes reviewed.

---

## 19. Backup and recovery gate

- [ ] RPO and RTO defined.
- [ ] Database backup.
- [ ] Private-media backup.
- [ ] Configuration and n8n backup.
- [ ] Encrypted independent copy.
- [ ] Immutable or offline copy.
- [ ] Recovery keys.
- [ ] Restore performed.
- [ ] RLS validated after restore.
- [ ] Financial reconciliation after restore tested.
- [ ] Checkout kill switch.
- [ ] Provider outage fallback.
- [ ] Recovery contacts.

---

## 20. Incident-response gate

- [ ] Incident roles and severity.
- [ ] Approved incident channel.
- [ ] Evidence storage.
- [ ] Secret-leak playbook.
- [ ] Admin-compromise playbook.
- [ ] Data-exposure playbook.
- [ ] Duplicate-financial-event playbook.
- [ ] Payout-fraud playbook.
- [ ] Malicious-file playbook.
- [ ] AI incident playbook.
- [ ] Provider-outage playbook.
- [ ] Ransomware playbook.
- [ ] Tabletop completed.
- [ ] Update cadence defined.
- [ ] Lessons-learned template.

---

## 21. Monitoring gate

Alerts exist for:

- [ ] Privileged login failures.
- [ ] MFA reset.
- [ ] New administrator.
- [ ] RLS denial spike.
- [ ] Webhook signature failure.
- [ ] Duplicate payment or mismatch.
- [ ] Refund spike.
- [ ] Payout-account change.
- [ ] Payout failure.
- [ ] Secret scanner.
- [ ] Deployment change.
- [ ] Dependency vulnerability.
- [ ] File rejection spike.
- [ ] AI cost spike.
- [ ] Outbox backlog.
- [ ] Provider outage.
- [ ] Backup failure.

Every critical alert has an owner.

---

## 22. Privacy gate

- [ ] Data inventory.
- [ ] Privacy notice.
- [ ] Customer consent.
- [ ] Recipient-data purpose.
- [ ] Marketing opt-in separate.
- [ ] Retention.
- [ ] Deletion or anonymization.
- [ ] Private-evidence policy.
- [ ] Vendor list.
- [ ] AI data sharing documented.
- [ ] Export controls.
- [ ] Legal review for Mexico and other operating jurisdictions.
- [ ] Breach-notification process confirmed with qualified counsel.

---

## 23. Independent review

Before processing real money, obtain an independent review of:

- Authorization and RLS.
- Payment webhook.
- Refund and payout.
- File upload.
- Admin access.
- HADIA tool permissions.
- Production configuration.

The review may be a qualified security reviewer, penetration test, or structured peer review by someone who did not implement the component.

---

## 24. Controlled pilot gate

Required scenarios:

- [ ] Successful local order.
- [ ] Successful external order.
- [ ] Successful MPHORA order.
- [ ] Partner rejection.
- [ ] Product damage.
- [ ] Failed delivery.
- [ ] Cancellation.
- [ ] Refund.
- [ ] Payout.
- [ ] Provider outage exercise.
- [ ] Secret rotation exercise.
- [ ] Restore exercise.

No public launch before pilot review.

---

## 25. Launch sign-off

```text
Release:
Commit:
Environment:
Date:
Project owner:
Security owner:
Operations owner:
Financial owner:
Privacy/legal reviewer:
Open critical defects:
Open high defects:
Accepted risks:
Restore test date:
Incident exercise date:
Independent review:
Decision:
Approvals:
```

---

## 26. Post-launch cadence

### Daily

- Financial reconciliation.
- Critical alerts.
- Backup status.
- Provider status.

### Weekly

- Failed workflows.
- Refund and payout review.
- Access anomalies.
- Vulnerability alerts.
- Partner fraud signals.

### Monthly

- Privileged-access review.
- Secret inventory.
- Dependency updates.
- Incident metrics.
- Restore sample.

### Quarterly

- Threat-model review.
- RLS review.
- Incident tabletop.
- Full restore exercise.
- Fraud-rule review.
- Partner-access review.
- HADIA red-team.

### Annually or after major change

- Independent security review.
- Disaster-recovery exercise.
- Policy and vendor review.

---

## 27. Required repository updates

After installing Pack 09:

1. Replace the old `AGENTS.md` with the Pack 09 version.
2. Replace `docs/00_DOCUMENTATION_INDEX.md` with the Pack 09 version.
3. Add documents `31` through `38`.
4. Make OpenCode read security documents before production work.
5. Add security controls to backlog and CI.
6. Do not mark production ready until this checklist is signed.

---

## 28. Normative references

- OWASP ASVS 5.0.0  
  https://owasp.org/www-project-application-security-verification-standard/
- NIST SP 800-218 SSDF  
  https://csrc.nist.gov/pubs/sp/800/218/final
- NIST SP 800-61 Rev. 3  
  https://csrc.nist.gov/pubs/sp/800/61/r3/final
- NIST SP 800-63B-4  
  https://csrc.nist.gov/pubs/sp/800/63/b/4/final
- PCI DSS v4.0.1 Document Library  
  https://www.pcisecuritystandards.org/document_library/
- Supabase data security  
  https://supabase.com/docs/guides/database/secure-data
- GitHub secure Actions use  
  https://docs.github.com/en/actions/reference/security/secure-use
- Vercel Deployment Protection  
  https://vercel.com/docs/deployment-protection
