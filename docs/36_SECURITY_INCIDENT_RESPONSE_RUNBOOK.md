# 36_SECURITY_INCIDENT_RESPONSE_RUNBOOK.md

## 1. Purpose

This document defines the executable security incident-response process for MPHO.

Use it when confidentiality, integrity, availability, money, privileged access, or customer trust may be affected.

Response priorities:

1. Safety.
2. Containment.
3. Financial integrity.
4. Evidence preservation.
5. Customer and partner continuity.
6. Recovery.
7. Learning.

---

## 2. Incident definition

A security incident includes:

- Unauthorized access.
- Secret exposure.
- Account takeover.
- Data exposure.
- Payment, refund, or payout manipulation.
- Malicious file upload.
- Forged or replayed webhook.
- Ransomware or destructive action.
- AI data leakage or unauthorized tool attempt.
- Supply-chain compromise.
- Audit tampering.
- Significant denial of service.
- Lost or stolen package involving fraud or data misuse.

---

## 3. Incident roles

### Incident commander

- Owns coordination.
- Sets severity.
- Approves containment.
- Controls update cadence.
- Closes incident.

### Technical lead

- Investigates systems.
- Contains access.
- Restores service.
- Preserves technical evidence.

### Security lead

- Leads threat analysis.
- Determines compromise scope.
- Coordinates credentials and forensic preservation.

### Financial lead

- Pauses or reviews payments, refunds, and payouts.
- Reconciles money.
- Preserves provider evidence.

### Operations lead

- Protects active orders.
- Coordinates partners and couriers.

### Communications lead

- Prepares customer, partner, internal, and provider messages.

### Legal and privacy contact

- Determines legal and notification obligations with qualified advice.

A small team may combine roles, but nobody may approve their own suspected fraudulent financial action.

---

## 4. Severity

### SEV-0 Critical

Examples:

- Active unauthorized payout.
- Production admin compromise.
- Large data exposure.
- Payment-state corruption.
- Database destruction.
- Critical production secret exposure.
- Widespread false delivery or refund.
- Ransomware.

Response:

```text
acknowledge immediately
contain as soon as safely possible
continuous coordination
```

### SEV-1 High

- Limited sensitive-data exposure.
- One privileged account suspected.
- Replayed webhook with uncertain financial effect.
- Critical provider compromise.
- Financial mismatch with possible loss.

### SEV-2 Medium

- Malicious upload blocked.
- One customer account compromised.
- Limited abuse with no confirmed sensitive impact.
- Security misconfiguration caught before exploitation.

### SEV-3 Low

- Policy deviation.
- Failed security scan.
- Suspicious attempt with no impact.
- Minor vulnerability without active exploitation.

Exact response-time targets must match actual staffing and on-call capability.

---

## 5. Incident lifecycle

```text
detect
→ validate
→ classify
→ contain
→ investigate
→ eradicate
→ recover
→ reconcile
→ communicate
→ lessons learned
```

Do not destroy evidence during containment.

---

## 6. First 15-minute checklist

- [ ] Create incident record.
- [ ] Assign incident commander.
- [ ] Record detection time and reporter.
- [ ] Identify affected environment.
- [ ] Preserve initial evidence.
- [ ] Determine whether money is moving.
- [ ] Determine whether data is exposed.
- [ ] Determine whether privileged access is involved.
- [ ] Activate kill switch when required.
- [ ] Use an approved incident channel.
- [ ] Set next update time.
- [ ] Do not speculate publicly.

---

## 7. Evidence handling

Preserve:

- Logs.
- Audit events.
- Provider event IDs.
- Request IDs.
- Session and network metadata where lawful and available.
- Database snapshots.
- Deployment commit.
- Workflow version.
- Screenshots.
- Suspicious files.
- Messages.
- Payout or bank references.

Rules:

- Do not alter the original evidence.
- Store a protected copy.
- Record collector and time.
- Hash files where appropriate.
- Restrict access.
- Never place sensitive evidence in a public issue tracker.

---

## 8. Containment authority

The incident commander may authorize:

- Pause checkout.
- Pause MPHORA.
- Pause external purchases.
- Pause refunds.
- Pause payouts.
- Disable partner, customer, operator, or admin access.
- Revoke sessions.
- Rotate secrets.
- Disable an integration.
- Protect or remove a deployment.
- Place the application in maintenance mode.

Every action is recorded.

---

## 9. IR-01 — Secret leaked

Indicators:

- Secret scanner alert.
- Secret in Git, screenshot, log, client bundle, or workflow export.
- Unexpected provider use.

Actions:

1. Identify privilege and environment.
2. Revoke or rotate.
3. Disable affected deployment or workflow.
4. Search usage logs.
5. Identify downstream access.
6. Review financial and admin actions.
7. Redeploy with new secret.
8. Verify old secret fails.
9. Review repository history and artifacts.
10. Document exposure window.
11. Reconcile affected systems.
12. Add prevention tests.

---

## 10. IR-02 — Admin account compromise

1. Disable account.
2. Revoke all sessions.
3. Reset authentication and MFA through controlled recovery.
4. Review role changes and invitations.
5. Review exports.
6. Review refunds, payouts, and account changes.
7. Review provider and secret settings.
8. Review deployments and n8n workflows.
9. Rotate credentials accessible to the account.
10. Restore changed configuration.
11. Notify affected owners.
12. Re-enable only after the compromise source is understood.

---

## 11. IR-03 — Customer or partner data exposure

1. Stop exposure.
2. Identify records and fields.
3. Identify exposure time.
4. Identify actors and access logs.
5. Preserve evidence.
6. Revoke signed URLs.
7. Correct authorization, RLS, or storage policy.
8. Run cross-tenant tests.
9. Determine notification obligations with qualified privacy and legal guidance.
10. Monitor for further access.
11. Document affected subjects.

---

## 12. IR-04 — Forged or replayed webhook

1. Preserve payload and headers.
2. Disable or restrict route if active exploitation continues.
3. Validate signature failure or replay.
4. Identify processed event IDs.
5. Compare provider truth.
6. Correct through controlled transitions and ledger adjustments.
7. Reconcile payment, refund, delivery, and notifications.
8. Rotate webhook secret if exposure is suspected.
9. Add regression fixture.

---

## 13. IR-05 — Duplicate financial event

Applies to payment, refund, earning, payout, external purchase, or courier request.

1. Pause the affected operation.
2. Identify duplicate source.
3. Check provider.
4. Check idempotency and constraints.
5. Preserve ledger and history.
6. Do not delete original entries.
7. Create reversal or adjustment.
8. Inform affected customer or partner.
9. Reconcile.
10. Test similar transactions.

---

## 14. IR-06 — Payout-account takeover or fraudulent payout

1. Pause all affected partner payouts.
2. Disable partner-admin sessions.
3. Verify identity through a known independent contact.
4. Review account-change history.
5. Review device, session, and audit events.
6. Contact payment provider or bank immediately.
7. Attempt recall where available.
8. Preserve old and new account records.
9. Review other partners for the same pattern.
10. Reset compromised authentication.
11. Require new verification and cooling period before payout resumes.

---

## 15. IR-07 — Malicious file

1. Quarantine the file.
2. Block serving.
3. Identify uploader and related order.
4. Determine whether a parser or processing service opened it.
5. Review storage access.
6. Scan related files.
7. Disable affected parser when required.
8. Rotate credentials if the processing environment may be compromised.
9. Preserve hash and metadata.
10. Strengthen validation and add regression tests.

---

## 16. IR-08 — HADIA prompt injection or data leakage

1. Disable the affected tool.
2. Preserve sanitized session and tool-call logs.
3. Determine whether any unauthorized action occurred.
4. Revoke overly broad service credentials.
5. Confirm tenant boundaries.
6. Remove malicious catalog content.
7. Review prompt, retrieval, and tool policy.
8. Validate output filtering.
9. Check AI provider logs and retention.
10. Add red-team test.
11. Restore deterministic fallback first.
12. Re-enable AI only after control verification.

---

## 17. IR-09 — Supply-chain or CI/CD compromise

1. Pause deployments.
2. Revoke CI credentials.
3. Review workflow changes.
4. Identify compromised dependency or Action.
5. Pin, remove, or replace it.
6. Compare deployed artifact to trusted commit.
7. Rotate secrets exposed to CI.
8. Rebuild from a clean environment.
9. Verify artifact provenance where available.
10. Review logs for exfiltration or unauthorized deployment.

---

## 18. IR-10 — Ransomware or destructive action

1. Isolate affected accounts and systems.
2. Stop automated deletion or encryption.
3. Revoke credentials.
4. Preserve snapshots.
5. Do not restore into a compromised environment.
6. Activate disaster recovery.
7. Restore from clean, encrypted, tested backup.
8. Validate access and security before reconnection.
9. Reconcile financial records.
10. Monitor for reinfection.
11. Determine exposure scope.

---

## 19. IR-11 — Provider outage

### Payment

- Pause checkout.
- Preserve carts.
- Do not infer approval.
- Queue reconciliation.

### WhatsApp

- Use email and in-app fallback.
- Create urgent partner-contact queue.

### Delivery

- Pause MPHORA.
- Use manual courier fallback.
- Inform affected customers.

### AI

- Use deterministic HADIA fallback.

### Supabase

- Pause writes.
- Preserve provider events where safely possible.
- Enter maintenance mode.

---

## 20. IR-12 — Lost or stolen gift

1. Determine last confirmed custody.
2. Preserve pickup and delivery evidence.
3. Contact courier or provider.
4. Protect recipient information.
5. Open incident.
6. Inform customer using verified facts.
7. Determine replacement or refund.
8. Review partner and courier responsibility.
9. Flag repeated suspicious actors.

---

## 21. Incident communications

Every internal update includes:

```text
incident ID
severity
what is known
what is unknown
systems affected
customer impact
partner impact
financial impact
containment
next action
next update time
owner
```

Do not include secrets or unnecessary PII.

Customer template:

> We identified a security or operational issue affecting {{scope}}. We have contained the issue and are reviewing the impact. {{customer_action_if_any}}. We will provide the next verified update by {{time}}.

Partner template:

> MPHO has temporarily paused {{feature}} while we review a security issue. Continue only the active tasks shown as authorized in MPHO Aliados. Do not act on payment or account-change requests received outside the platform.

---

## 22. Recovery gate

Service returns only when:

- Root access path is contained.
- Credentials are rotated where required.
- Vulnerability is fixed or compensating control is active.
- Data integrity is checked.
- Financial reconciliation is started.
- Monitoring is active.
- Rollback is available.
- Incident commander approves.

---

## 23. Lessons learned

Review:

- Timeline.
- Root cause.
- Detection.
- Delayed signals.
- Control failure.
- Human factors.
- Financial and privacy impact.
- Recovery performance.
- Documentation and test gaps.
- Owners and deadlines.

Good-faith reporting must not be punished.

---

## 24. Exercise cadence

```text
quarterly: incident tabletop
semiannual: secret leak drill
semiannual: payment replay drill
annual: full restore exercise
before launch: admin compromise tabletop
before launch: payout fraud tabletop
before launch: HADIA prompt-injection exercise
```

---

## 25. Normative references

- NIST SP 800-61 Rev. 3  
  https://csrc.nist.gov/pubs/sp/800/61/r3/final
- NIST Cybersecurity Framework 2.0  
  https://www.nist.gov/cyberframework
- CISA StopRansomware Guide  
  https://www.cisa.gov/stopransomware/ransomware-guide
- OWASP Logging Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- OWASP Secrets Management Cheat Sheet  
  https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
