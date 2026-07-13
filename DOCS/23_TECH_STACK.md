# 23_TECH_STACK.md

## 1. Purpose

This document defines the recommended technology stack for MPHO.

It explains:

- Core technologies.
- Selection reasons.
- Usage boundaries.
- Development standards.
- Environment strategy.
- Deployment.
- Observability.
- Testing.
- Future scaling criteria.

The stack should support a reliable MVP without unnecessary complexity.

This document must be read together with:

- `AGENTS.md`
- `05_SCOPE_AND_NON_GOALS.md`
- `24_SYSTEM_ARCHITECTURE.md`
- `25_DATABASE_SCHEMA.md`
- `26_API_AND_INTEGRATIONS.md`
- `27_SECURITY_AND_PRIVACY.md`
- `29_TESTING_AND_QA.md`

---

## 2. Technology principles

The MPHO stack should be:

- Understandable.
- Type-safe.
- Mobile-first.
- Secure by default.
- Easy to deploy.
- Easy to audit.
- Suitable for a small team.
- Scalable enough for controlled growth.
- Compatible with AI-assisted development.
- Resistant to vendor lock-in where practical.

Prefer proven managed services over custom infrastructure during the MVP.

---

## 3. Recommended stack summary

```text
Frontend and full-stack web: Next.js
Language: TypeScript
UI: React
Styling: Tailwind CSS
Database: PostgreSQL through Supabase
Authentication: Supabase Auth or approved equivalent
Storage: Supabase Storage
Server functions: Next.js server actions / route handlers / server modules
Background automation: n8n plus controlled application jobs
Hosting: Vercel
Source control: GitHub
Payments: Mercado Pago or approved provider
Messaging: WhatsApp Business Platform
Email: approved transactional provider
Maps/geocoding: approved map provider
Observability: structured logs plus error tracking
Testing: Vitest/Jest, Testing Library, Playwright
Validation: Zod or equivalent
```

Final provider choices may change after technical and commercial validation.

---

## 4. Next.js

Use Next.js for:

- Customer web app.
- MPHO Aliados.
- Admin panel.
- Server-rendered public pages.
- API route handlers.
- Secure server-side business logic.
- Authentication integration.
- PWA shell.
- Deployment on Vercel.

Recommended approach:

- App Router.
- Server Components by default.
- Client Components only when interaction requires them.
- Server-side data access for protected resources.
- Route groups for customer, partner, and admin areas.
- Shared domain modules.

---

## 5. React

Use React for:

- Interactive forms.
- HADIA interface.
- Checkout.
- Partner task screens.
- Admin workflows.
- Status timelines.
- Evidence uploads.
- Reusable component library.

Rules:

- Avoid unnecessary global state.
- Keep server state separate from local UI state.
- Prefer explicit form state.
- Avoid side effects for business logic.
- Do not calculate trusted totals in components.

---

## 6. TypeScript

Use strict TypeScript.

Required configuration goals:

```text
strict: true
noImplicitAny: true
strictNullChecks: true
noUncheckedIndexedAccess: recommended
exactOptionalPropertyTypes: recommended
```

Rules:

- Avoid `any`.
- Use domain types.
- Use discriminated unions for states.
- Keep provider DTOs separate from internal models.
- Validate runtime input.
- Generate database types when available.
- Do not use type assertions to hide invalid data.

---

## 7. Tailwind CSS

Use Tailwind CSS for:

- Responsive layout.
- Design tokens.
- Reusable utility patterns.
- Mobile-first styling.
- Consistent spacing.
- State styling.
- Accessible focus styles.

Rules:

- Use semantic component abstractions.
- Avoid excessively long repeated class strings.
- Do not hardcode arbitrary colors throughout the app.
- Centralize theme tokens.
- Respect design system documentation.
- Avoid visual inconsistency between customer, partner, and admin experiences.

---

## 8. Component strategy

Recommended layers:

```text
UI primitives
→ shared components
→ domain components
→ screen compositions
```

Examples:

### UI primitives

- Button.
- Input.
- Dialog.
- Card.
- Badge.
- Table.
- Tabs.
- Toast.

### Domain components

- ProductCard.
- OrderStatusTimeline.
- PartnerTaskCard.
- PaymentStatus.
- EarningsBreakdown.
- DeliveryTracker.
- EvidenceUploader.
- MPHORAEligibilityBadge.

Use an accessible component foundation when appropriate.

---

## 9. Supabase

Supabase may provide:

- PostgreSQL database.
- Authentication.
- Row-level security.
- Storage.
- Realtime where useful.
- Edge Functions only when justified.

Use Supabase as a managed platform, not as permission to move all logic directly into the client.

Trusted operations should remain server-controlled.

---

## 10. PostgreSQL

PostgreSQL is the source of truth for:

- Users and profiles.
- Partners.
- Catalog.
- Inventory.
- Orders.
- Order state history.
- Payments.
- Refunds.
- Earnings.
- Payouts.
- Delivery.
- Incidents.
- Notifications.
- Audit records.

Use:

- Foreign keys.
- Constraints.
- Indexes.
- Transactions.
- Check constraints.
- Unique constraints.
- Row-level security.
- Database migrations.

---

## 11. Authentication

Preferred MVP authentication:

- Email magic link or password.
- Phone verification if provider and cost support it.
- Google or Apple sign-in only if needed.
- Partner invitation flow.
- Admin access with stronger security.

Requirements:

- Session protection.
- Role mapping.
- Partner scope.
- Reauthentication for sensitive actions.
- MFA for admin when supported.
- Account disable and revocation.

---

## 12. Storage

Use protected object storage for:

- Product images.
- Partner application photos.
- Preparation evidence.
- Damage evidence.
- Delivery proof.
- Documents.
- QR audio or video when approved.

Buckets should be separated by purpose and privacy.

Example:

```text
public-catalog
partner-applications
order-evidence
delivery-evidence
private-documents
customer-media
```

Use signed URLs for private objects.

---

## 13. Validation

Use a runtime validation library such as Zod.

Validate:

- Forms.
- API requests.
- Webhooks.
- Environment variables.
- Provider responses.
- Database inputs.
- Query parameters.
- File metadata.

Types alone do not validate runtime data.

---

## 14. Forms

Recommended form stack:

- Native form semantics.
- Server validation.
- Client assistance.
- React Hook Form or equivalent when complexity requires it.
- Zod schemas shared where appropriate.

Every form must handle:

- Loading.
- Success.
- Field errors.
- Form-level errors.
- Duplicate submission.
- Session expiration.
- State conflict.

---

## 15. Data fetching

Recommended principles:

- Fetch protected data on server where possible.
- Use server actions or route handlers for mutations.
- Use client fetching only for interactive refresh or realtime needs.
- Avoid direct unrestricted database access from browser.
- Cache only public or safe data.
- Revalidate catalog intentionally.
- Do not cache private order data publicly.

---

## 16. State management

Use the simplest appropriate mechanism.

Preferred order:

```text
URL state
local component state
form state
server state library if needed
small shared store only when justified
```

Avoid a large global state store for all application data.

Order, payment, and inventory source of truth remains on the server.

---

## 17. Background jobs

Background jobs are needed for:

- Quote expiration.
- Partner-offer timeout.
- Reminder scheduling.
- Retry notifications.
- External-product tracking.
- Payment reconciliation.
- Refund monitoring.
- Payout preparation.
- MPHORA eligibility refresh.
- Stale stock detection.

Possible execution:

- n8n.
- Vercel cron.
- Database scheduled function.
- Queue service in later phase.

Critical jobs must be idempotent.

---

## 18. n8n

Use n8n for orchestration such as:

- WhatsApp notifications.
- Email notifications.
- Scheduled reminders.
- Provider polling.
- Non-critical integration coordination.
- Operational alerts.

Do not use n8n as:

- Primary order database.
- Only state machine.
- Only financial ledger.
- Place where all business logic lives.
- Secret store inside exported JSON.

Every workflow should:

- Have version.
- Use environment variables.
- Have test mode.
- Return result to MPHO.
- Use idempotency.
- Log failures.
- Have manual fallback.

---

## 19. Vercel

Use Vercel for:

- Next.js deployment.
- Preview environments.
- Environment variables.
- Serverless execution.
- Cron when appropriate.
- Edge delivery for public assets.

Consider limitations:

- Execution time.
- Background processing.
- File upload limits.
- Cold starts.
- Regional data requirements.
- Cost at scale.

Do not force long-running jobs into request handlers.

---

## 20. GitHub

Use GitHub for:

- Source control.
- Pull requests.
- Issues.
- Branch protection.
- CI.
- Releases.
- Security scanning.
- Documentation.

Recommended branch model:

```text
main
develop optional
feature/*
fix/*
docs/*
```

For a small team, trunk-based development with short-lived branches is acceptable.

---

## 21. Environment strategy

Required environments:

```text
local
preview
staging
production
```

At minimum:

- Local.
- Preview.
- Production.

Preferred:

- Separate staging database.
- Separate payment sandbox.
- Separate WhatsApp test setup.
- Separate storage.
- Separate environment variables.

Never connect previews to production financial systems by default.

---

## 22. Environment variables

Validate environment variables at startup.

Categories:

```text
public client-safe
server private
provider secrets
database
storage
payments
whatsapp
email
maps
observability
feature flags
```

Rules:

- Never commit `.env`.
- Never expose server secrets with public prefixes.
- Rotate compromised secrets.
- Document variable purpose.
- Provide `.env.example` without real values.

---

## 23. API strategy

Use internal APIs for:

- Client mutations.
- Provider webhooks.
- Partner actions.
- Admin actions.
- Integration callbacks.

Recommended patterns:

- REST-style route handlers for external integrations.
- Server actions for tightly coupled app mutations when safe.
- Typed service layer.
- Versioned external endpoints.
- Provider adapters.

Do not expose database structure directly as public API.

---

## 24. Provider adapter pattern

Create adapters for:

- Payment provider.
- WhatsApp provider.
- Delivery provider.
- Email provider.
- Geocoding provider.
- AI provider.

Example interface:

```text
PaymentProvider
- createPayment
- getPayment
- refundPayment
- verifyWebhook
- mapStatus
```

This prevents provider-specific logic from spreading.

---

## 25. AI provider strategy

HADIA may use an approved AI provider.

Requirements:

- Structured output.
- Tool restrictions.
- Prompt versioning.
- Safety rules.
- Catalog grounding.
- Timeout.
- Fallback.
- Cost monitoring.
- PII minimization.
- Provider abstraction.

Do not send full order or customer data unless required.

---

## 26. Maps and geocoding

Use an approved provider for:

- Address autocomplete.
- Geocoding.
- Coordinates.
- Distance estimation.
- Zone validation.

Do not trust geocoding alone.

Allow human-readable references and operator correction.

---

## 27. Realtime

Use realtime only when useful.

Potential uses:

- Partner new-order alert.
- Order status timeline.
- Admin exception queue.
- Courier status.

Fallback must exist through refresh and notifications.

Do not make the app unusable without realtime connection.

---

## 28. PWA

PWA requirements may include:

- Manifest.
- App icons.
- Installability.
- Offline fallback.
- Safe caching.
- Background notification where supported.
- Deep links.
- Update strategy.

Do not cache:

- Payment data.
- Sensitive recipient data.
- Private evidence.
- Admin responses.
- Stale financial records.

---

## 29. Logging

Use structured logs.

Recommended fields:

```text
timestamp
level
service
environment
request_id
user_id_optional
partner_id_optional
order_id_optional
action
result
error_code_optional
duration_ms
```

Avoid logging:

- Passwords.
- Tokens.
- Full addresses.
- Full phone numbers.
- Private messages.
- Bank information.
- Raw card data.

---

## 30. Error tracking

Use an approved error-tracking service or equivalent.

Capture:

- Stack trace.
- Environment.
- Release.
- Request ID.
- Order ID when safe.
- User role.
- Breadcrumbs without sensitive data.

Separate expected business errors from unexpected system errors.

---

## 31. Monitoring

Monitor:

- Application uptime.
- API latency.
- Database health.
- Webhook failures.
- Payment mismatch.
- Notification failures.
- Delivery-provider failures.
- Job queue delays.
- Storage errors.
- Authentication failures.
- Financial reconciliation.

---

## 32. Testing stack

Recommended:

### Unit

- Vitest or Jest.

### Component

- Testing Library.

### Integration

- Database test environment.
- Provider sandbox.
- API route tests.

### End-to-end

- Playwright.

### Contract

- Provider adapter tests.
- Webhook fixture tests.

---

## 33. Code quality

Required:

- ESLint.
- Prettier or consistent formatter.
- TypeScript strict mode.
- Import organization.
- No ignored errors without reason.
- CI checks.
- Build check.
- Test check.
- Migration check.

Do not disable lint rules globally to ship faster.

---

## 34. CI/CD

Recommended pipeline:

```text
Install
→ lint
→ typecheck
→ unit tests
→ integration tests
→ build
→ preview deploy
→ end-to-end smoke tests
→ manual approval for production
```

Production deployment should be traceable to commit.

---

## 35. Database migrations

Use versioned migrations.

Rules:

- Never edit production schema manually without migration.
- Review destructive changes.
- Add backward-compatible changes first.
- Backfill data safely.
- Remove old fields later.
- Test migration in staging.
- Preserve financial history.

---

## 36. Dependency management

Rules:

- Add dependencies only when necessary.
- Prefer maintained packages.
- Check license.
- Check security.
- Pin major versions.
- Review updates.
- Avoid duplicate libraries for same purpose.
- Remove unused packages.

---

## 37. Performance strategy

Priorities:

- Fast public pages.
- Optimized images.
- Server rendering.
- Indexed queries.
- Pagination.
- Avoid N+1 queries.
- Lazy-load heavy components.
- Background non-critical work.
- Cache public catalog safely.
- Avoid large client bundles.

---

## 38. Security baseline

Required:

- HTTPS.
- Secure cookies.
- CSRF protection where applicable.
- Rate limiting.
- Input validation.
- Output encoding.
- RLS.
- Server authorization.
- Secret management.
- Signed URLs.
- Webhook verification.
- Audit logs.
- Dependency scanning.
- Admin MFA when available.

---

## 39. Architecture style

Recommended MVP architecture:

```text
Modular monolith
+ managed PostgreSQL
+ external provider adapters
+ background orchestration
```

Avoid premature microservices.

Separate modules by domain:

- Identity.
- Partners.
- Catalog.
- Inventory.
- Orders.
- Payments.
- Earnings.
- Delivery.
- Notifications.
- HADIA.
- Admin.
- Audit.

---

## 40. Scaling triggers

Consider architectural expansion only when evidence exists.

Possible triggers:

- Background jobs exceed platform limits.
- Database contention.
- High webhook volume.
- Independent team ownership.
- Provider isolation.
- Geographic latency.
- High availability requirements.
- Regulatory separation.

Do not adopt microservices because the project may grow someday.

---

## 41. Cost control

Track:

- Vercel usage.
- Database storage and compute.
- Storage bandwidth.
- AI usage.
- WhatsApp messages.
- Email messages.
- Maps API.
- Delivery API.
- Error tracking.
- Background jobs.

Set alerts before production growth.

---

## 42. Backup and recovery

Required:

- Database backups.
- Point-in-time recovery when available.
- Storage recovery plan.
- Secret recovery.
- Migration rollback strategy.
- Provider event replay where possible.
- Documentation backup in GitHub.

Test recovery procedures.

---

## 43. Developer experience

The repository should include:

```text
AGENTS.md
README.md
docs/
.env.example
package.json
tsconfig.json
eslint config
test config
database migrations
seed data
scripts
```

Useful scripts:

```text
dev
build
lint
typecheck
test
test:e2e
db:migrate
db:seed
format
```

---

## 44. Seed data

Seed only safe development data.

Include:

- Test city.
- Test zones.
- Test partners.
- Test products.
- Test customer.
- Test orders.
- Test states.

Never copy real customer data into local or preview environments.

---

## 45. Documentation in code

Code comments should explain:

- Non-obvious rule.
- Provider limitation.
- Security requirement.
- Idempotency reason.
- Migration concern.

Do not duplicate entire documentation files in comments.

---

## 46. MVP stack decision

Recommended MVP:

```text
Next.js App Router
TypeScript strict
React
Tailwind CSS
Supabase PostgreSQL
Supabase Auth
Supabase Storage
Vercel
n8n
Mercado Pago or approved payment provider
WhatsApp Business Platform
Playwright
Vitest
Zod
GitHub Actions
```

This is a recommended baseline, not an excuse to start coding before business documents are respected.

---

## 47. Definition of done

A technical stack change is done when:

- Reason is documented.
- Security is reviewed.
- Cost is considered.
- Migration impact is considered.
- Local, preview, and production setup is updated.
- CI passes.
- Documentation is updated.
- Secrets remain protected.
- Provider fallback is considered.

---

## 48. Summary

MPHO should begin with a disciplined modular monolith built on managed services.

The goal is not the most complex architecture.

The goal is a stack that allows MPHO to build, test, operate, audit, and improve the full gifting workflow safely.
