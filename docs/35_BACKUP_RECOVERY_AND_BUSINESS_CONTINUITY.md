# 35_BACKUP_RECOVERY_AND_BUSINESS_CONTINUITY.md

> Phase 8 recovery update: orders, payment attempts, sanitized provider events, audit logs and state history must be backed up and restored as one integrity set. Events have an initial 90-day documentary retention; automatic deletion is blocked until legal approval, a safe job and deletion evidence exist.

## 1. Purpose

This document defines backup, restoration, disaster recovery, and business continuity for MPHO.

A backup is not trusted until restoration has been tested.

The plan protects orders, payments, refunds, ledger entries, partner earnings, payouts, inventory, partner data, customer data, private evidence, delivery proof, n8n workflows, configuration, and recovery keys.

---

## 2. Recovery definitions

### RPO

Recovery Point Objective: maximum acceptable data loss measured in time.

### RTO

Recovery Time Objective: maximum acceptable time to restore service.

These are operational targets, not guarantees.

---

## 3. Initial recovery tiers

The following are pre-launch targets and must be validated against provider capabilities, cost, and actual operating needs.

### Tier 0 — Financial and order integrity

Includes orders, state history, payments, refunds, ledger, earnings, payouts, and inventory reservations.

```text
RPO: 15 minutes or better
RTO: 2 hours
```

### Tier 1 — Operational evidence

Includes preparation evidence, delivery proof, package receipts, and partner documents.

```text
RPO: 24 hours or better
RTO: 8 hours
```

### Tier 2 — Catalog and non-critical configuration

```text
RPO: 24 hours
RTO: 24 hours
```

### Tier 3 — Analytics and rebuildable data

```text
RPO: 72 hours
RTO: 72 hours
```

---

## 4. Business-impact analysis

For each service document:

```text
service
owner
criticality
dependencies
maximum tolerable downtime
RPO
RTO
manual fallback
customer impact
partner impact
financial impact
recovery order
```

Services include authentication, database, storage, payments, refunds, partner app, customer tracking, admin, WhatsApp, delivery, HADIA, MPHORA, n8n, email, and DNS.

---

## 5. Backup strategy

### Managed provider backup

- Database backup.
- Point-in-time recovery when enabled.
- Provider storage durability.

### Independent logical backup

- Encrypted PostgreSQL export.
- Separate credentials and location.
- Versioned recovery points.

### Immutable or offline copy

- Encrypted.
- Not deletable by ordinary application credentials.
- Protected from ransomware and account takeover.
- Regularly tested.

### Configuration backup

- Git repository.
- Migrations.
- n8n workflow exports without secrets.
- Provider configuration documentation.
- DNS records.
- Environment-variable inventory without plaintext values.
- Operational and security documentation.

---

## 6. Backup schedule

Initial schedule, subject to provider plan:

```text
continuous or PITR: Tier 0 when available
daily: database logical backup
daily: critical configuration export
daily or provider-supported: private-media protection
weekly: encrypted independent backup
monthly: retained recovery point
quarterly: full restore exercise
```

High-change periods may require more frequent backup.

---

## 7. Backup access

- Backup credentials are separate from app credentials.
- The application cannot delete every backup.
- Backup administration requires MFA.
- Downloads and restores are audited.
- Encryption keys are stored separately.
- Restore operators have minimum access.
- Backup scripts contain no plaintext production credentials.

---

## 8. Backup encryption and keys

- Encrypt in transit and at rest.
- Protect keys separately from backup data.
- Version keys.
- Do not destroy an old decryption key before related backups expire.
- Test the real key-recovery process.
- Maintain controlled break-glass key access.

---

## 9. Backup content

### Database

- Schema.
- Migrations.
- RLS policies.
- Functions.
- Constraints.
- Extensions.
- Data.

### Storage

- Public catalog media.
- Private order evidence.
- Delivery proof.
- Partner documents.
- Customer media.

### Application and infrastructure

- Git commit and release.
- Feature flags.
- Configuration inventory.
- Webhook mappings.
- Provider IDs.
- DNS.

### n8n

- Workflows.
- Version.
- Credentials inventory without values.
- Instance configuration.
- Encryption-key recovery process.

---

## 10. Recovery order

Recommended priority:

```text
1. Privileged identity and access
2. Database schema and core data
3. Orders and financial records
4. Partner operational access
5. Private evidence
6. Payment and webhook connectivity
7. Delivery
8. Notifications
9. Admin reporting
10. HADIA and MPHORA
11. Analytics
```

HADIA may stay disabled while the order and financial core recovers.

---

## 11. Restore validation

After restore verify:

- Schema and migrations.
- RLS and grants.
- Roles.
- Order counts and current states.
- Payment and refund counts.
- Ledger consistency.
- Partner earnings and payouts.
- Inventory reservations.
- State history.
- Media links.
- Webhook idempotency records.
- Outbox events.
- Audit logs.
- Provider references.

Do not reopen checkout until financial consistency passes.

---

## 12. Restore exercise

Quarterly exercise records:

```text
scenario
backup selected
restore start
restore complete
RPO achieved
RTO achieved
missing data
permission validation
financial reconciliation
issues
owner
remediation due date
```

At least annually, simulate loss of primary production database access.

---

## 13. Accidental deletion runbook

1. Stop the destructive job or user.
2. Disable affected credentials.
3. Preserve logs.
4. Determine scope.
5. Pause related writes if needed.
6. Choose recovery point.
7. Restore into an isolated environment first.
8. Compare records.
9. Recover through controlled merge or full restore.
10. Verify RLS.
11. Reconcile money.
12. Resume gradually.
13. Document the incident.

Never overwrite production immediately without understanding scope.

---

## 14. Database corruption runbook

1. Enter safe mode.
2. Pause checkout and payouts.
3. Preserve current snapshot.
4. Identify last known good point.
5. Restore in isolation.
6. Validate financial and order tables.
7. Select point-in-time restore or controlled repair.
8. Reprocess verified provider events.
9. Reconcile.
10. Resume in phases.

---

## 15. Storage loss runbook

1. Block access to missing or corrupted objects.
2. Preserve metadata.
3. Restore objects or bucket.
4. Verify hashes when available.
5. Reissue signed URLs.
6. Identify orders missing evidence.
7. Request evidence again only when necessary.
8. Do not auto-complete unverified orders.

---

## 16. Credential compromise recovery

1. Rotate or revoke.
2. Review use.
3. Restore service with new credential.
4. Redeploy affected applications.
5. Update n8n and provider settings.
6. Review old deployments.
7. Reconcile sensitive actions.
8. Preserve incident evidence.

---

## 17. Provider outage continuity

### Payment outage

- Pause new checkout.
- Preserve carts.
- Do not infer payment approval.
- Continue existing paid orders when core data is available.
- Reconcile when provider returns.

### WhatsApp outage

- Use in-app and email fallback.
- Create urgent partner-contact queue.
- Official state remains in MPHO.

### Delivery outage

- Pause MPHORA.
- Use manual courier fallback.
- Inform affected customers.
- Requote when required.

### AI outage

- Use deterministic catalog filters.
- Keep checkout and tracking available.

### Supabase outage

- Pause writes and state transitions.
- Display maintenance mode.
- Preserve provider events for replay when safely possible.
- Do not accept business actions that cannot be recorded.

---

## 18. Manual continuity mode

During a severe outage:

- Stop new orders when money or state cannot be trusted.
- Continue paid orders only with a controlled emergency ledger.
- Record every manual action with actor and timestamp.
- Do not issue untracked refunds.
- Do not pay partners based on chat or memory.
- Enter verified actions into MPHO after recovery.
- Reconcile all provider events.

Manual mode is temporary and auditable.

---

## 19. Kill switches

Authorized administrators must be able to pause:

- Checkout.
- External products.
- MPHORA.
- Payouts.
- Refund execution when fraud is suspected.
- A provider integration.

Existing-order tracking should remain available where safe.

Every switch use is audited.

---

## 20. Communication during outage

Customer messages explain:

- What is affected.
- Whether an existing order is safe.
- Whether action is required.
- When the next update will be provided.
- Support route.

Partner messages explain:

- Whether active work continues.
- Whether new offers are paused.
- How emergency actions are recorded.

Do not promise a recovery time without evidence.

---

## 21. Reconciliation after recovery

- Fetch payment and refund provider state.
- Fetch delivery state.
- Review failed notifications.
- Process outbox.
- Detect duplicate side effects.
- Review manually changed orders.
- Reconcile stock, earnings, and payouts.
- Review audit logs.
- Notify affected users where necessary.

---

## 22. Disaster scenarios

Exercises should cover:

- Database deletion.
- Database corruption.
- Ransomware or account takeover.
- Supabase outage.
- Vercel outage.
- DNS takeover or outage.
- Payment-provider outage.
- WhatsApp outage.
- n8n outage.
- Delivery-provider outage.
- Storage loss.
- Admin compromise.

---

## 23. Recovery ownership

Required roles:

```text
incident commander
technical recovery lead
database recovery owner
financial reconciliation owner
operations owner
customer communication owner
partner communication owner
security owner
```

A small team may combine roles, but responsibilities must remain explicit.

---

## 24. Backup verification checklist

- [ ] Backup completed.
- [ ] Encryption confirmed.
- [ ] Separate location confirmed.
- [ ] Retention confirmed.
- [ ] Restore credential available.
- [ ] Backup readable.
- [ ] Schema and RLS included.
- [ ] Critical tables included.
- [ ] Private media covered.
- [ ] n8n covered.
- [ ] Recovery keys covered.
- [ ] Restore test passed.
- [ ] RPO measured.
- [ ] RTO measured.

---

## 25. Normative references

- NIST SP 800-34 Rev. 1  
  https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final
- NIST SP 800-61 Rev. 3  
  https://csrc.nist.gov/pubs/sp/800/61/r3/final
- CISA StopRansomware Guide  
  https://www.cisa.gov/stopransomware/ransomware-guide
- OWASP Secrets Management Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
