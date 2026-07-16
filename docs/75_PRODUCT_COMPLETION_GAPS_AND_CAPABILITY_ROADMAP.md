# 75_PRODUCT_COMPLETION_GAPS_AND_CAPABILITY_ROADMAP.md

## 1. Purpose and precedence

This document is the primary map of the gap between the product vision and the executable MPHO repository after Phases 1–7. It answers what exists, what is only partial, what remains designed, what is blocked, and in which order the product should be completed.

It complements, and does not replace, the specialized business, lifecycle, security, legal, operational, PWA, and phase-evidence documents. When an older roadmap or screen specification sounds like a current implementation claim, this evidence-based classification governs. The official lifecycle in `docs/13_ORDER_LIFECYCLE.md` still governs state order.

Evidence baseline:

- Date: 2026-07-16.
- Base commit: `4d0bce2`, merge of Phase 7 into `origin/main`.
- Evidence inspected: `apps/customer/`, `apps/partner/`, `apps/central/`, `packages/`, `supabase/`, `scripts/`, `.github/workflows/`, migrations, tests, and phase records 71–74.
- Production status: **BLOCKED**. Local and CI-oriented evidence does not authorize real payments, real orders, or launch.

Only these status labels are used:

| Status | Meaning |
|---|---|
| **IMPLEMENTED** | Verifiable executable behavior exists at the stated layer, with corresponding repository evidence. It does not imply production approval. |
| **PARTIAL** | Some layers exist, but one or more required UI, server, persistence, RLS, operation, integration, or production layers are absent. |
| **PLANNED** | Approved design or backlog exists without sufficient executable behavior. |
| **BLOCKED** | Work or launch cannot proceed safely until a named dependency or decision is resolved. |
| **DEFERRED** | Intentionally outside the current operational MVP sequence. |

An interface, frontend function, API, persistence model, RLS policy, real operation, external integration, and production readiness are separate claims. “IMPLEMENTED” in one layer must never be read as completion of all layers.

## 2. Global state

Progress is estimated with a component maturity scale, not a single product percentage:

```text
0 = documentation/design only
1 = compiling shell or isolated visual prototype
2 = executable foundation with important missing layers
3 = end-to-end capability in a controlled non-production environment
4 = production evidence and operational acceptance
```

This is a prudent, non-contractual assessment. A level is assigned from the weakest critical layer, so a polished UI cannot compensate for missing persistence or real operation.

| Component | Maturity | Current truth |
|---|---:|---|
| Technical foundation | 2/4 | Modular monorepo, strict TypeScript, Supabase migrations/RLS, tests and CI exist; production observability, rate limits, recovery and environment evidence do not. |
| Customer PWA | 2/4 | Auth, public catalog, product, server pricing, persistent cart, draft order, review request and final quote exist; payment, tracking, support, complete PWA behavior and retention features do not. |
| Partner PWA | 1/4 | Independent Next.js shell compiles; no authenticated operational workflow, task persistence, evidence, inventory, earnings or partner RLS contract is exposed by the app. |
| Central PWA | 2/4 | A narrow pre-payment review queue/detail and controlled commands exist; it is not the complete operational, financial, logistics or security tower. |
| Economic operation | 0/4 | The final pre-payment quote exists, including verified manual delivery and an explicit pilot service amount of 0 MXN; payment, reconciliation, ledger, refunds, earnings and payouts do not. |
| Logistics operation | 0/4 | Delivery may be quoted manually; no courier assignment, pickup, custody, tracking, delivery evidence or failed-delivery execution exists. |
| Artificial intelligence | 1/4 | HADIA has a visual entry only; there is no model call, grounded retrieval, agent policy, tools, memory or human handoff. |
| Production readiness | 0/4 | Launch checklist blockers remain open; real transactions and real operational processing are prohibited. |

MPHO therefore cannot yet process the documented real-order flow. The strongest completed boundary is a Customer-owned `quoted` order with an immutable final pre-payment quote.

## 3. Product truth matrix

Recommended phases refer to the execution sequence in section 17.

| Area | Capability | Status | Current evidence by layer | Next dependency | Recommended phase |
|---|---|---|---|---|---:|
| Identity and authentication | Customer login, signup, callback and protected routes | **PARTIAL** | Customer UI/server session and identity RLS exist; recovery, MFA for privileged users and production administration are missing | Production identity controls | 12 |
| Catalog | Published Customer catalog and product detail | **PARTIAL** | Public RPC, safe DTO, RLS/grants, UI and tests exist; search, filters, authoritative stock and catalog operations do not | Catalog operations and search | 4/10 |
| Quote | Server-side preliminary and final pricing | **IMPLEMENTED** | RPCs, immutable snapshots, integer MXN, APIs, Customer UI, RLS and tests exist through `quoted` | Expiry UX and payment consumption | 1 |
| Cart | Persistent, versioned Customer cart | **IMPLEMENTED** | UI, APIs, persistence, owner RLS, optimistic concurrency and tests exist | Change-required editing UX | 1 |
| Draft order | Atomic conversion from cart | **IMPLEMENTED** | Server revalidation, immutable item/PII snapshots, idempotency, initial history and Customer view exist | Payment lifecycle | 1 |
| Operational review | Pre-payment controlled checks | **IMPLEMENTED** | Central queue/detail, versioned commands, expiring evidence, audit and RLS exist | Operational configuration and staff process | 1/12 |
| Final quote | Approved delivery and explicit pilot service line | **IMPLEMENTED** | Admin finalization creates immutable quote; service is explicitly 0 MXN for the pilot, not unknown | Payment intent and acceptance | 1 |
| Payments | Intent, provider checkout and verified payment state | **BLOCKED** | No provider adapter, payment tables, endpoint or verified webhook | Approved Mercado Pago design, idempotency and legal/financial gates | 1 |
| Webhooks | Authentic, replay-safe provider callbacks | **PLANNED** | Requirements exist in docs; no payment or logistics webhook surface exists | Provider contract and secret management | 1/6 |
| Reconciliation | Provider-to-internal financial matching | **PLANNED** | Documentation only | Payment records and settlement data | 7 |
| Assignment | One responsible Punto MPHO after payment | **PLANNED** | Lifecycle and operations specify it; Phase 7 intentionally has no `responsible_partner_id` | Confirmed payment and eligible partner model | 2 |
| Inventory | Authoritative stock by listing/variant | **BLOCKED** | Catalog listings exist, but there is no authoritative stock source or Customer stock promise | Inventory ownership and freshness rules | 4 |
| Reservations | Concurrency-safe temporary commitment | **PLANNED** | Conceptual schema only | Authoritative inventory and paid assignment contract | 4 |
| Preparation | Partner task and controlled work execution | **PLANNED** | SOP and screen specifications only; Partner app is a shell | Paid assignment, Partner PWA, stock/reservation | 3/5 |
| Quality control | Checklist, evidence and approval | **PLANNED** | SOP only | Private media, signed URLs and Partner task model | 5 |
| Delivery | Assignment, pickup and completion | **PLANNED** | Manual pre-payment price evidence only; no execution | Prepared package, courier model/provider and custody | 6 |
| Tracking | Customer-safe delivery status | **PLANNED** | UX/lifecycle documentation only | Delivery events and privacy mapping | 6 |
| Support | Order-linked cases and communication | **PLANNED** | Playbook/specification only | Order operations and case model | 11 |
| Refunds | Provider-confirmed, reconciled refund | **BLOCKED** | No payment or refund persistence/integration | Payment, ledger, policy and idempotent provider flow | 7 |
| Earnings | Auditable Punto MPHO earning lines | **PLANNED** | Financial rules only | Fulfillment milestones and ledger | 7 |
| Payouts | Verified, traceable partner payment | **BLOCKED** | No payout account, payout execution or reconciliation | Earnings ledger, destination controls and approvals | 7 |
| HADIA | Grounded recommendation agent | **PLANNED** | Customer visual card only; click logs to console | Authorized catalog tools, policy, evaluation and handoff | 8 |
| MPHORA | Operational fast-delivery mode | **BLOCKED** | `mphora_candidate` is only a catalog flag; no eligibility engine exists | Stock, capacity, schedule, zone, preparation and courier evidence | 9 |
| Notifications | Transactional push/WhatsApp | **PLANNED** | Documentation only | Event/outbox model, templates, consent and provider adapters | 11 |
| PWA | Install, offline, update and notification behavior | **PARTIAL** | Three independent web apps and some icons exist; manifests/service workers/device acceptance are incomplete | Per-app implementation and device QA | 11 |
| Observability | Logs, metrics, tracing and alerts | **BLOCKED** | CI checks exist, but no production operational observability evidence | Data-minimized telemetry and alert ownership | 12 |
| Rate limiting | Endpoint, auth and cost protection | **BLOCKED** | Requirements only | Server/edge policy, stores, thresholds and abuse tests | 1/12 |
| Productive security | Launch-grade controls and evidence | **BLOCKED** | RLS/grants, safe DTOs, origin/body validation and audit foundations exist; MFA, backups, monitoring, incident and provider controls remain open | Document 38 gates with evidence | 12 |

## 4. Customer PWA

### Present boundary

| Capability | Status | Verified scope |
|---|---|---|
| Authentication | **PARTIAL** | Login, signup, callback, session refresh and route protection; no complete recovery or production identity acceptance. |
| Public catalog and product | **IMPLEMENTED** | Supabase-backed published catalog, category query and product slug using a Customer-safe contract. |
| Server-side quote | **IMPLEMENTED** | Variant/option arithmetic, availability checks and immutable preliminary snapshot; no stock reservation. |
| Persistent cart | **IMPLEMENTED** | One active Customer cart, versioned mutations and server authority. |
| Recipient, address and date | **IMPLEMENTED** | Temporary cart data and order snapshots; no claim of saved recipients/addresses. |
| Text personalization | **PARTIAL** | Dedication/instructions text is persisted and validated; no product-specific compatibility engine or media studio. |
| Draft order | **IMPLEMENTED** | Atomic conversion, authoritative re-quote, idempotency and owner-only read. |
| Review and final quote | **IMPLEMENTED** | Customer request, neutral status, final breakdown, difference and expiry. Payment remains disabled. |

Missing Customer capabilities are **PLANNED** unless another dependency makes them **BLOCKED**: real search and filters; favorites; important people; occasions; reminders; guest checkout; payments; billing/invoicing; tracking; order support; order history; reorder; verified reviews; push; complete PWA installation/update/offline behavior; visible reviewed policies; and production accessibility evidence.

The change-required experience is incomplete: Central can return a public reason and next action, but the Customer does not yet have a complete guided correction/review-resubmission flow for every affected field.

## 5. Partner PWA

Status: **PARTIAL** only as a technical shell and **PLANNED** as an operational product. The current home says the panel is coming soon; it has no working order queue.

The future flow is: onboarding → verification → approved capabilities → schedule/capacity → catalog → inventory → paid-order offer → acceptance/rejection → reservation/receipt → preparation → checklist → evidence → quality control → courier handoff → incidents → earnings → history → performance.

The application must answer immediately:

> What must I do, by when, and how much will I earn?

No offer, acceptance, reservation or preparation may be activated before confirmed payment while `docs/13_ORDER_LIFECYCLE.md` retains the official `paid → assignment_pending → partner_offered` sequence. Phase 7 manual evidence is not partner assignment or acceptance.

## 6. Central PWA

### Implemented narrow module

- Private operational-review queue and detail.
- Versioned claiming and checks.
- Manual verified delivery proposal and administrator approval.
- Final quote creation and invalidation.
- Redacted audit events and Customer-safe output.
- Masked PII in normal list/detail output; controlled revelation exists at the database boundary.

This is **PARTIAL**, not a complete Central product.

Central must evolve into a drill-down tower of control for: operational summary; orders at risk; overdue deadlines; economic value at risk; capacity by zone; stale inventory; active deliveries; unreconciled payments; refunds; incidents; security; audit; performance by product and occasion; margin by order; and Punto MPHO performance. Every aggregate must link to the source orders or financial records; invented metrics and orphan dashboard totals are prohibited.

## 7. HADIA

HADIA is a constrained gift-recommendation agent, not a generic chatbot. Current status is **PLANNED**; only its visual entry is **IMPLEMENTED**.

Future inputs and behaviors: occasion, recipient, relationship, intended emotion, budget, urgency, restrictions, authorized catalog, explainable recommendations, comparison, draft-cart creation, incompatibility detection, human transfer, authorized memory, and repeated-gift prevention.

HADIA must never change prices, approve discounts, alter payments, modify privileged states, assign a Punto MPHO, approve refunds, or reveal internal data. Every tool must re-authorize independently of the model.

A future, consent-based graph may connect people, relationships, tastes, occasions, previous gifts, budgets, and reminders. It is **DEFERRED** until privacy, retention, access, correction, deletion and inference rules are approved.

## 8. MPHORA

`mphora_candidate` means only “candidate for later operational evaluation.” It does not mean stock, eligibility, ETA, or delivery is confirmed.

A real MPHORA decision must validate recent stock, exact variant, Punto MPHO capacity, operating schedule, zone, preparation time, personalization compatibility, courier capacity, ETA, cutoff, safety margin and evidence freshness. Until that engine exists, Customer copy must not promise “Delivery today.” Recommended interim language:

> May be available for fast delivery. Confirm area and schedule.

MPHORA is an operational mode, not a marketing badge. The current Customer mapping of `mphora_candidate` to “Entrega hoy” is a potential Customer truth leak and must be corrected in a later code task before real use.

## 9. Inventory and reservations

Status: **BLOCKED** for real availability. Required model and controls:

- Stock by listing and, where applicable, variant.
- Last confirmation, source, actor, confidence and expiry.
- Auditable adjustments and reason codes.
- Available, committed and reserved quantities.
- Temporary reservations with idempotent creation and expiry.
- Preparation capacity separate from units on hand.
- Expiration/batch handling where the category requires it.
- Stale-data alerts, concurrency tests and reconciliation.

Published catalog presence and Phase 7 manual capacity evidence are not authoritative stock. MPHO must show unavailable, pending or subject to validation until a real source confirms it.

## 10. Preparation and quality control

Status: **PLANNED**. The operational implementation must include authoritative task instructions, product/variant checks, personalization and orthography approval, preparation checklist, private photographic evidence, packaging labels/seals, package QR or neutral code, courier handoff evidence, exceptions and an immutable audit trail.

A future computer-vision assistant may compare order snapshots with photographs and flag wrong product, variant, color, quantity, visible damage, incorrect text, missing elements or deficient packaging. It must begin as human assistance: no autonomous approval, rejection, refund, state completion or partner penalty. This capability is **DEFERRED** beyond the first real-order flow.

## 11. Delivery and tracking

Status: **PLANNED** beyond the pre-payment price component. Required flow: delivery quote → post-payment assignment → pickup code → custody/handoff proof → ETA → Customer-safe tracking → failed attempt → approved reschedule or return → delivery evidence → reconciliation and closure.

The delivery record must preserve provider/internal identifiers, attempts, custody, condition, reason, costs and idempotent events. The Customer sees neutral MPHO language and only the minimum location information; Punto MPHO identity, courier private data and exact live location must not leak unless operationally or legally required.

## 12. Payments and finance

Recommended next financial blocks:

1. Server-created payment intent tied to the unexpired final quote.
2. Mercado Pago adapter in sandbox and verified, replay-safe webhook ingestion.
3. Separate payment states, provider events and idempotency controls.
4. Double-charge prevention and reconciliation of provider settlement.
5. Refund records and provider-confirmed outcomes.
6. Immutable double-entry or equivalently auditable ledger design.
7. Punto MPHO earnings derived from verified milestones.
8. Payout accounts, cooling/approval controls, payout references and reconciliation.
9. Disputes and financial evidence.

Provider approval is not the same as settled or reconciled money. Redirect success is not payment confirmation. No browser amount may move money.

## 13. Advanced personalization

The current product supports text only. A future personalization studio may support dedication, name, typography, color, approved templates, preview, spelling confirmation, Customer approval, immutable production snapshot, AI-assisted content, rights/consent, files, audio, video and printing.

Before expansion it needs product capability rules, revision limits, private storage, signed URLs, malware/content controls, rights and retention decisions, and an explicit irreversible-work approval. It is **DEFERRED** from the initial payment and fulfillment path.

## 14. Architecture needed when justified

Keep the modular monorepo and clear domain boundaries. Do not introduce premature microservices.

Add these capabilities only when the relevant reliable flow needs them:

- Transactional outbox and domain events for post-transaction side effects.
- Job queue, controlled retries, dead-letter handling and scheduled expiry/reconciliation jobs.
- Feature flags and kill switches.
- Structured, PII-minimized logs; metrics, tracing and owned alerts.
- Rate limiting and anti-abuse controls by endpoint, identity and cost.
- Verified, idempotent webhooks with provider event storage.
- Private object storage, short-lived signed URLs and evidence retention.
- Search index or database search only after catalog needs exceed controlled queries.
- Transactional push and WhatsApp adapters with consent separation.
- Auditable retention, export, deletion and anonymization jobs.

External services must remain adapters; PostgreSQL and validated domain transitions remain the official state.

## 15. Customer experience and language

Internal language must not appear in normal Customer experiences.

| Avoid in Customer UI | Use a neutral alternative |
|---|---|
| Phase numbers, table names, “server-side”, RLS | Describe the action or outcome only |
| partner, allied store, supplier, internal store, Punto MPHO | MPHO or “our preparation network” when explanation is useful |
| `quote_pending` | “MPHO is confirming availability, delivery and final price.” |
| `assignment_pending` / “Searching for a Punto” | “We are coordinating the preparation of your gift.” |
| `mphora_candidate` / “Delivery today” without validation | “May be available for fast delivery. Confirm area and schedule.” |
| stock/capacity internals | “Availability pending confirmation.” |
| provider payment state | Reviewed Customer-safe payment language |

Legally required seller, invoice, warranty, recall or pickup disclosures remain visible even when normal internal identity is hidden.

## 16. Current risks

| Risk | Status and consequence |
|---|---|
| No payments | **BLOCKED**: no real checkout or confirmed paid state. |
| Non-authoritative inventory | **BLOCKED**: local availability and MPHORA cannot be promised. |
| Partner PWA is not operational | **BLOCKED**: no official partner acceptance, preparation or evidence workflow. |
| Central is incomplete | **PARTIAL**: only pre-payment review is controlled. |
| Manual delivery | **PARTIAL** for price evidence and **PLANNED** for execution; prone to delay and transcription error without audited delivery records. |
| Recipient PII | **PARTIAL** controls exist; retention, reveal workflow operations, recovery and production monitoring remain open. |
| Rate limiting | **BLOCKED** for production abuse and cost protection. |
| Observability | **BLOCKED** for production detection and response. |
| Retention/anonymization | **BLOCKED** for abandoned carts, recipient data and evidence until approved and automated. |
| Failure recovery | **BLOCKED** without backup/restore, provider recovery and incident evidence. |
| Manual dependency | Healthy orders still require Central action; capacity and SLA are unproven. |
| Quote expiry | Final quotes expire; recovery and Customer editing/resubmission UX is incomplete. |
| Manual availability | Schedule/capacity/personalization evidence may be manual; it is not stock or reservation. |
| Change-required flow | Customer receives a reason but lacks a complete guided correction loop. |
| MPHORA wording | Current `Entrega hoy` mapping can overstate an unverified candidate. |
| Internal phase wording | The current cart renders “Fase 6” to the Customer; implementation phase labels are internal and should be removed in a later code task. |
| Internal network wording | The current cart tells the Customer that no “aliado” will be assigned; normal Customer copy should say that no preparation or delivery coordination has started. |

## 17. Ordered execution roadmap

Advanced HADIA, real MPHORA and vision assistance are not blockers for the first real order. Each block must satisfy the prior state, security and operational gates.

| Block | Objective | Prerequisites | Result | Outside this block | Principal risks |
|---:|---|---|---|---|---|
| 1. Phase 8 — initial payment and financial integrity | Move an unexpired `quoted` order through provider-confirmed payment without duplicates | Final quote, provider/legal decision, secrets, idempotency, webhook verification, rate-limit baseline | Payment intent/events; safe `pending_payment`/review/`paid`; sandbox reconciliation evidence | Refund automation, earnings, split payments | Double charge, forged webhook, stale quote, ambiguous settlement |
| 2. Formal post-payment assignment | Assign exactly one responsible Punto MPHO after `paid` | Confirmed payment, partner eligibility/capabilities, timeout rules | Audited `paid → assignment_pending → partner_offered` flow | Multi-partner orders, automatic national optimization | PII overexposure, assignment before payment, no-response |
| 3. Operational Partner PWA | Give each Punto MPHO a secure official work queue | Assignment model, partner auth/RLS, deadlines and earnings estimates | Offer/accept/reject and current task with owner/next action/deadline | Full self-service onboarding and advanced analytics | State skipping, shared accounts, cross-partner access |
| 4. Inventory and reservations | Establish truthful availability and concurrency-safe commitment | Stock owner/source decisions, variant model, partner workflow | Fresh stock, adjustments, reservations and expiry | Predictive inventory and nationwide pooling | Oversell, stale data, reservation leaks |
| 5. Preparation and quality | Execute preparation with instructions and proof | Accepted assignment, validated/reserved product, private media | Checklist, evidence, QC, ready state and incidents | Autonomous vision approval, advanced multimedia | Wrong personalization, false evidence, privacy leakage |
| 6. Delivery and tracking | Preserve custody from handoff to verified outcome | Ready package, courier rules/provider, neutral IDs | Assignment, pickup, attempts, Customer-safe tracking, proof and failed-delivery recovery | Route optimization at scale | False delivery, location privacy, duplicate dispatch |
| 7. Refunds, ledger, earnings and payouts | Reconstruct every financial effect and settle partners safely | Payments, fulfillment milestones, delivery outcomes, policies | Reconciliation, refunds, ledger, earnings, payout and dispute records | Automatic split settlement and complex credit products | Unreconciled money, destination fraud, incorrect reversals |
| 8. Real HADIA | Recommend only authorized, available choices | Stable catalog contract, tool authorization, evaluations, human handoff | Explainable recommendations and optional draft cart | Autonomous purchase/state changes and broad inferred memory | Hallucination, prompt injection, sensitive inference |
| 9. Real MPHORA | Confirm fast-delivery eligibility from operational evidence | Inventory, capacity, schedules, preparation and courier ETA | Expiring, auditable eligibility and truthful Customer language | Universal same-day promise | Stale eligibility, cutoff/ETA failure |
| 10. People, occasions and retention | Enable consent-based repeat gifting | Privacy/retention decisions, customer controls | Saved people, occasions, reminders, history and repeat-gift prevention | Unapproved sensitive profiling | Recipient marketing, excessive retention, inference errors |
| 11. PWA, push, WhatsApp and support | Make status and recovery available across approved channels | Stable events, consent, deep-link auth, support cases | Per-app install/update/offline safety, transactional notifications and order support | Marketing automation by default | Lock-screen PII, stale caches, duplicate messages |
| 12. Production hardening and real pilot | Prove safe operation under documents 38 and 57 | All zero-tolerance gates, legal sign-off, backup/restore, incident and operational staffing | Controlled first cohort with evidence and stop conditions | Expansion beyond validated capacity | Unowned incidents, recovery failure, premature scaling |

## 18. Definition of complete product

MPHO is complete only when it works simultaneously as:

- An intelligent store for the Customer: discovery, truthful choice, personalization, payment, tracking, support and retention.
- A work system for Puntos MPHO: exact task, deadline, approved capability, evidence, custody and auditable earnings.
- A control tower for MPHO Central: operational truth, exceptions, money, logistics, security and drill-down to source records.

A screen, prototype, candidate flag or documented future capability does not meet this definition. The first operational milestone is narrower: one real gift completing the official lifecycle safely, including one recoverable failure, without requiring HADIA, MPHORA or computer vision.
