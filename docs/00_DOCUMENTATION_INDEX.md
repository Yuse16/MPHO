# 00_DOCUMENTATION_INDEX.md

## 1. Purpose

This document defines:

- The complete MPHO documentation structure.
- Reading order.
- Document dependencies.
- File status.
- Documentation governance.

Its purpose is to prevent isolated decisions, inconsistent naming, duplicated logic, and undocumented business rules.

---

## 2. Source-of-truth order

Use the following priority:

1. `AGENTS.md`
2. Approved specialized documents under `docs/`
3. `README.md`
4. Recorded technical decisions
5. Code and configuration
6. Internal comments

If sources conflict, report and resolve the contradiction.

Do not silently choose one.

---

## 3. Required reading order

Base reading:

1. `AGENTS.md`
2. `README.md`
3. `docs/00_DOCUMENTATION_INDEX.md`
4. `docs/01_PROJECT_OVERVIEW.md`

Before modifying a feature, also read every related specialized document.

Examples:

- HADIA: product vision, catalog, AI, order lifecycle, security.
- MPHORA: catalog, inventory, logistics, order lifecycle, payments.
- Earnings: business model, pricing, payments, database, security.
- Partner app: partner program, partner journey, app, catalog, payments, security.
- Order flow: roles, customer journey, partner journey, lifecycle, payments, delivery, WhatsApp.

---

## 4. Status labels

- **Complete:** initial version created and usable.
- **Pending:** not yet delivered.
- **In review:** exists but needs validation.
- **Approved:** validated by the project owner.
- **Obsolete:** replaced by another document.

---

## 5. Full index

| Order | File | Pack | Status | Purpose |
|---:|---|---:|---|---|
| 1 | `AGENTS.md` | 01 | Complete | Permanent rules for agents and contributors |
| 2 | `README.md` | 01 | Complete | High-level project introduction |
| 3 | `docs/00_DOCUMENTATION_INDEX.md` | 01 | Complete | Documentation index and governance |
| 4 | `docs/01_PROJECT_OVERVIEW.md` | 01 | Complete | Full product overview |
| 5 | `docs/02_PRODUCT_VISION.md` | 02 | Complete | Vision, future state, product principles |
| 6 | `docs/03_BRAND_ECOSYSTEM.md` | 02 | Complete | MPHO, HADIA, MPHORA, and sub-brands |
| 7 | `docs/04_GLOSSARY.md` | 02 | Complete | Official terminology |
| 8 | `docs/05_SCOPE_AND_NON_GOALS.md` | 02 | Complete | Scope and exclusions |
| 9 | `docs/06_BUSINESS_MODEL.md` | 03 | Complete | Revenue and operating model |
| 10 | `docs/07_MARKETPLACE_RULES.md` | 03 | Complete | Marketplace rules |
| 11 | `docs/08_PARTNER_PROGRAM.md` | 03 | Complete | Partner onboarding and operations |
| 12 | `docs/09_PRICING_AND_COMMISSIONS.md` | 03 | Complete | Pricing, fees, margins, commissions |
| 13 | `docs/10_USER_ROLES.md` | 04 | Complete | Roles, permissions, responsibilities |
| 14 | `docs/11_CUSTOMER_JOURNEY.md` | 04 | Complete | Customer journey |
| 15 | `docs/12_PARTNER_JOURNEY.md` | 04 | Complete | Partner journey |
| 16 | `docs/13_ORDER_LIFECYCLE.md` | 04 | Complete | States, transitions, exceptions |
| 17 | `docs/14_CUSTOMER_APP.md` | 05 | Complete | Customer app screens and features |
| 18 | `docs/15_PARTNER_APP.md` | 05 | Complete | MPHO Aliados screens and features |
| 19 | `docs/16_ADMIN_PANEL.md` | 05 | Complete | Administration and exception handling |
| 20 | `docs/17_CATALOG_AND_INVENTORY.md` | 05 | Complete | Products, stock, availability |
| 21 | `docs/18_HADIA_AI.md` | 06 | Complete | HADIA behavior and limitations |
| 22 | `docs/19_MPHORA_EXPRESS.md` | 06 | Complete | Fast-delivery eligibility |
| 23 | `docs/20_WHATSAPP_AUTOMATION.md` | 06 | Complete | Messages, templates, automations |
| 24 | `docs/21_DELIVERY_LOGISTICS.md` | 06 | Complete | Couriers, zones, delivery flow |
| 25 | `docs/22_PAYMENTS_AND_PAYOUTS.md` | 07 | Complete | Payments, balances, payouts, refunds |
| 26 | `docs/23_TECH_STACK.md` | 07 | Complete | Technologies and selection criteria |
| 27 | `docs/24_SYSTEM_ARCHITECTURE.md` | 07 | Complete | System components and communication |
| 28 | `docs/25_DATABASE_SCHEMA.md` | 07 | Complete | Entities, relations, access |
| 29 | `docs/26_API_AND_INTEGRATIONS.md` | 08 | Complete | APIs, webhooks, external systems |
| 30 | `docs/27_SECURITY_AND_PRIVACY.md` | 08 | Complete | Security, privacy, audit |
| 31 | `docs/28_DESIGN_SYSTEM.md` | 08 | Complete | Visual identity, components, accessibility |
| 32 | `docs/29_TESTING_AND_QA.md` | 08 | Complete | Test strategy and quality |
| 33 | `docs/30_MVP_ROADMAP_AND_BACKLOG.md` | 08 | Complete | Phases, backlog, priorities |

---

## 6. Documentation dependencies

### Business

```text
01_PROJECT_OVERVIEW
→ 02_PRODUCT_VISION
→ 05_SCOPE_AND_NON_GOALS
→ 06_BUSINESS_MODEL
→ 07_MARKETPLACE_RULES
→ 08_PARTNER_PROGRAM
→ 09_PRICING_AND_COMMISSIONS
```

### User and operations

```text
10_USER_ROLES
→ 11_CUSTOMER_JOURNEY
→ 12_PARTNER_JOURNEY
→ 13_ORDER_LIFECYCLE
→ 14_CUSTOMER_APP
→ 15_PARTNER_APP
→ 16_ADMIN_PANEL
```

### Catalog, AI, and delivery

```text
17_CATALOG_AND_INVENTORY
→ 18_HADIA_AI
→ 19_MPHORA_EXPRESS
→ 20_WHATSAPP_AUTOMATION
→ 21_DELIVERY_LOGISTICS
```

### Technology

```text
22_PAYMENTS_AND_PAYOUTS
→ 23_TECH_STACK
→ 24_SYSTEM_ARCHITECTURE
→ 25_DATABASE_SCHEMA
→ 26_API_AND_INTEGRATIONS
→ 27_SECURITY_AND_PRIVACY
→ 28_DESIGN_SYSTEM
→ 29_TESTING_AND_QA
→ 30_MVP_ROADMAP_AND_BACKLOG
```

---

## 7. Documentation quality rules

Every document must:

- Have a clear objective.
- Use official names.
- State assumptions.
- Separate MVP from future features.
- Avoid invented prices or operational facts.
- Define verifiable rules.
- Explain exceptions.
- Remain consistent with order lifecycle.
- Identify dependencies.
- Be updated when behavior changes.

Avoid vague statements such as:

- “The system will automate everything.”
- “The AI decides.”
- “Payment is split.”
- “The order is sent.”

Instead explain:

- Actor.
- Required data.
- Validation.
- State transition.
- Failure behavior.
- Evidence.
- Audit trail.

---

## 8. File naming

Use:

- Numeric prefix.
- Uppercase words.
- Underscore separators.
- `.md` extension.

Example:

```text
18_HADIA_AI.md
```

---

## 9. Terminology rules

Preferred terms:

- MPHO.
- HADIA.
- MPHORA.
- MPHO Aliados.
- Punto MPHO.
- Customer.
- Recipient.
- Partner.
- Order.
- Local product.
- External product.
- Courier.
- Delivery.

Use **partner** as the main operational term unless a more specific distinction is required.

Do not alternate randomly between partner, seller, supplier, shop, and provider.

---

## 10. Decision records

Any decision affecting architecture, business rules, payments, security, or order states must be recorded.

Recommended format:

```text
Decision:
Date:
Context:
Options considered:
Decision made:
Reason:
Impact:
Documents affected:
Migration required:
```

Do not leave critical decisions only in chat, commits, or source-code comments.

---

## 11. Change control

When changing documentation:

1. Review dependent documents.
2. Keep terminology consistent.
3. Update references.
4. State whether MVP scope changes.
5. Identify migration needs.
6. Preserve historical reasoning when relevant.

---

## 12. Open questions

Open questions must remain explicit.

Examples:

- Final payment provider.
- Tax model.
- Partner payout frequency.
- WhatsApp provider.
- Delivery provider.
- Cancellation rules.
- Real service fees.
- Damage responsibility.
- External package reception conditions.
- MPHORA operating hours.
- Eligible product categories.

An unresolved question must not silently become a technical rule.

---

## 13. OpenCode rule

OpenCode must use this index to locate the correct document before implementation.

When the specialized document is still pending:

- Do not invent the specification.
- Use only already approved rules.
- State assumptions.
- Propose a design.
- Ask for approval before irreversible implementation.


---

## 14. Pack 09 security documents

The following documents are mandatory before production:

| Order | File | Pack | Status | Purpose |
|---:|---|---:|---|---|
| 34 | `docs/31_THREAT_MODEL_AND_ABUSE_CASES.md` | 09 | Complete | Threat actors, attack surfaces, abuse cases, and mitigations |
| 35 | `docs/32_SECURITY_CONTROLS_AND_ASVS_CHECKLIST.md` | 09 | Complete | ASVS-based implementation and verification controls |
| 36 | `docs/33_SECRETS_KEYS_AND_PRIVILEGED_ACCESS.md` | 09 | Complete | Secrets, MFA, privileged access, and transaction authorization |
| 37 | `docs/34_DEPLOYMENT_ENVIRONMENTS_AND_HARDENING.md` | 09 | Complete | Secure CI/CD, Vercel, Supabase, n8n, and production configuration |
| 38 | `docs/35_BACKUP_RECOVERY_AND_BUSINESS_CONTINUITY.md` | 09 | Complete | Backup, restore, RPO, RTO, and continuity |
| 39 | `docs/36_SECURITY_INCIDENT_RESPONSE_RUNBOOK.md` | 09 | Complete | Executable security incident playbooks |
| 40 | `docs/37_FRAUD_RISK_AND_FINANCIAL_CONTROLS.md` | 09 | Complete | Fraud, refund, payout, delivery, and insider controls |
| 41 | `docs/38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md` | 09 | Complete | Blocking production-readiness and sign-off checklist |

### Security reading order

```text
31 Threat model
→ 32 Security controls
→ 33 Privileged access
→ 34 Deployment hardening
→ 35 Recovery
→ 36 Incident response
→ 37 Fraud controls
→ 38 Launch gate
```

### Mandatory rule

OpenCode must not invent a security control or mark one complete without implementation evidence and a test.

Production remains blocked until document 38 has no unresolved zero-tolerance blockers.

---

## 15. Pack 10 legal, privacy, and commercial-policy documents

The following documents define the legal-review requirements and public-policy skeletons:

| Order | File | Pack | Status | Purpose |
|---:|---|---:|---|---|
| 42 | `docs/39_LEGAL_AND_REGULATORY_REQUIREMENTS.md` | 10 | Complete internal requirements | Legal model, consumer, tax, data, contracts, delivery, products, and launch blockers |
| 43 | `docs/40_CUSTOMER_TERMS_AND_CONDITIONS.md` | 10 | Draft skeleton | Customer terms and product implementation requirements |
| 44 | `docs/41_PRIVACY_NOTICE_AND_DATA_RIGHTS.md` | 10 | Draft skeleton | Privacy notice, data inventory, rights, AI, recipients, vendors, and retention |
| 45 | `docs/42_CANCELLATIONS_REFUNDS_AND_DISPUTES_POLICY.md` | 10 | Draft skeleton | Cancellation, refund, disputes, chargebacks, and stage-based outcomes |
| 46 | `docs/43_PARTNER_AGREEMENT_REQUIREMENTS.md` | 10 | Internal requirements | Punto MPHO agreement, data, security, earnings, custody, quality, and termination |
| 47 | `docs/44_DELIVERY_RECIPIENT_AND_FAILED_DELIVERY_POLICY.md` | 10 | Draft skeleton | Recipient privacy, surprise, delivery proof, reattempt, return, loss, and safety |
| 48 | `docs/45_EXTERNAL_PRODUCTS_AND_THIRD_PARTY_MARKETPLACES.md` | 10 | Draft skeleton | External-purchase role, authorization, price, shipping, inspection, returns, and IP |
| 49 | `docs/46_COOKIES_ANALYTICS_AND_COMMUNICATION_CONSENT.md` | 10 | Draft skeleton | Cookies, analytics, WhatsApp, marketing, reminders, consent, and opt-out |
| 50 | `docs/47_BRAND_INTELLECTUAL_PROPERTY_AND_CONTENT_RULES.md` | 10 | Internal requirements | Trademarks, copyright, partner/customer content, AI media, counterfeits, and takedowns |

### Legal reading order

```text
39 Legal model
→ 40 Customer terms
→ 41 Privacy
→ 42 Refunds
→ 43 Partner agreement
→ 44 Delivery
→ 45 External products
→ 46 Consent
→ 47 IP and content
```

### Mandatory warning

Pack 10 files are detailed drafting requirements, but they do not replace review by qualified Mexican legal and tax professionals.

OpenCode must not publish placeholders or convert unresolved legal assumptions into production behavior.


---

## 16. Pack 11 operational manuals and pilot runbooks

| Order | File | Pack | Status | Purpose |
|---:|---|---:|---|---|
| 51 | `docs/48_PARTNER_ONBOARDING_AND_ACTIVATION_RUNBOOK.md` | 11 | Complete | Partner verification, capabilities, training, test orders, monitoring, suspension, and offboarding |
| 52 | `docs/49_DAILY_ORDER_OPERATIONS_RUNBOOK.md` | 11 | Complete | Daily queues, priorities, assignment, monitoring, completion, and shift handoff |
| 53 | `docs/50_PACKAGE_RECEIVING_INSPECTION_AND_STORAGE_SOP.md` | 11 | Complete | Package identification, inspection, custody, storage, discrepancies, and returns |
| 54 | `docs/51_GIFT_PREPARATION_PERSONALIZATION_AND_QUALITY_SOP.md` | 11 | Complete | Preparation, personalization approval, quality control, evidence, sealing, and readiness |
| 55 | `docs/52_CUSTOMER_SUPPORT_AND_COMMUNICATION_PLAYBOOK.md` | 11 | Complete | Support verification, cases, templates, escalation, compensation authority, and closure |
| 56 | `docs/53_DELIVERY_DISPATCH_HANDOFF_AND_FAILED_DELIVERY_RUNBOOK.md` | 11 | Complete | Courier assignment, handoff, proof, failed delivery, reattempt, return, loss, and damage |
| 57 | `docs/54_CANCELLATIONS_REFUNDS_AND_DISPUTE_OPERATIONS_RUNBOOK.md` | 11 | Complete | Executable cancellation, refund, partial refund, dispute, and chargeback operations |
| 58 | `docs/55_PARTNER_EARNINGS_PAYOUT_AND_RECONCILIATION_RUNBOOK.md` | 11 | Complete | Earnings review, payout batches, account changes, approvals, disputes, and reconciliation |
| 59 | `docs/56_INCIDENT_EXCEPTION_AND_RECOVERY_OPERATIONS.md` | 11 | Complete | Exception triage, provider outages, kill switches, continuity, recovery, and root cause |
| 60 | `docs/57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md` | 11 | Complete | Controlled launch, capacity cohorts, first 100 orders, metrics, stop conditions, and expansion |

### Operational reading order

```text
48 Partner activation
→ 49 Daily order operations
→ 50 Package custody
→ 51 Preparation and quality
→ 52 Support
→ 53 Delivery
→ 54 Refund operations
→ 55 Payout operations
→ 56 Exceptions and recovery
→ 57 Pilot and first 100 orders
```

### Mandatory rule

The operational records in Pack 11 must exist inside MPHO as structured state, evidence, queues, deadlines, and audit events.

An informal action performed only through chat is not considered an official MPHO operation.

---

## 17. Pack 12 PWA, navigation, wireframes, and experience documents

| Order | File | Pack | Status | Purpose |
|---:|---|---:|---|---|
| 61 | `docs/58_BRAND_VISIBILITY_AND_CUSTOMER_EXPERIENCE_MODEL.md` | 12 | Complete | MPHO-only customer identity, internal partner confidentiality, packaging, and non-circumvention |
| 62 | `docs/59_THREE_PWA_ECOSYSTEM_AND_ARCHITECTURE.md` | 12 | Complete | Three separate PWA origins, manifests, deployments, permissions, and shared architecture |
| 63 | `docs/60_CUSTOMER_PWA_INFORMATION_ARCHITECTURE.md` | 12 | Complete | Customer routes, navigation, page hierarchy, statuses, and journeys |
| 64 | `docs/61_CUSTOMER_HOME_DISCOVERY_HADIA_AND_MPHORA_UX.md` | 12 | Complete | Home, discovery, HADIA, MPHORA, Red MPHO, trust, and customer visual behavior |
| 65 | `docs/62_CUSTOMER_CHECKOUT_TRACKING_RETENTION_AND_INSTALL_UX.md` | 12 | Complete | Cart, checkout, tracking, install timing, notifications, reminders, and retention |
| 66 | `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md` | 12 | Complete | MPHO Aliados screen-by-screen operational specification |
| 67 | `docs/64_CENTRAL_ADMIN_PWA_UX_AND_SCREEN_SPEC.md` | 12 | Complete | MPHO Central operations, financial, security, partner, and incident interfaces |
| 68 | `docs/65_SHARED_DESIGN_SYSTEM_AND_RESPONSIVE_RULES.md` | 12 | Complete | Shared visual tokens, responsive rules, accessibility, and application personalities |
| 69 | `docs/66_PWA_INSTALLATION_NOTIFICATIONS_OFFLINE_CACHE_AND_UPDATES.md` | 12 | Complete | Manifest, service workers, cache, offline, push, updates, logout, and device QA |
| 70 | `docs/67_ROUTES_WIREFRAMES_AND_COMPONENT_INVENTORY.md` | 12 | Complete | Low-fidelity wireframes, routes, shared and app-specific components |
| 71 | `docs/68_PROTOTYPE_ACCEPTANCE_AND_HANDOFF_TO_OPENCODE.md` | 12 | Complete | Prototype testing, acceptance, design deliverables, implementation order, and PR evidence |

### Pack 12 reading order

```text
58 Brand model
→ 59 PWA architecture
→ 60 Customer information architecture
→ 61 Customer discovery
→ 62 Checkout and retention
→ 63 Partner PWA
→ 64 Central PWA
→ 65 Shared design
→ 66 PWA platform behavior
→ 67 Wireframes and components
→ 68 Prototype handoff
```

### Product decision

The customer shops from MPHO.

Puntos MPHO are internal supply, receiving, preparation, personalization, storage, and distribution nodes, except when an approved legal or branded-collaboration disclosure applies.

---

## 18. Foundation status document

| Order | File | Pack | Status | Purpose |
|---:|---|---:|---|---|
| 72 | `docs/69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md` | 01 | Complete | Real implementation status through Phase 4.1 |
| 73 | `docs/71_CATALOG_SECURITY_TYPES_AND_CI_HARDENING.md` | 13 | Complete | Phase 4.1 catalog security, generated types, clients, routes, tests, and CI evidence |

### Purpose

This document records what actually exists in code versus what is documented, tracks defects corrected, validation results, and remaining risks. It must be updated after every foundation milestone.
