# 71_CATALOG_SECURITY_TYPES_AND_CI_HARDENING.md

## 1. Record

- Phase: 4.1.
- Date: 2026-07-14.
- Branch under review: `main`.
- Base commit: `3f7d2fa` (`feat: implement Supabase public catalog`).
- Scope: public catalog boundary, RLS/grants, generated types, Supabase clients, auth/routing, money validation, complete workspace CI, and regression evidence.
- Migration: `supabase/migrations/20260714090000_catalog_security_hardening.sql`.

No historical migration was edited. The Phase 4.1 database change is forward-only.

## 2. Confirmed findings and resolution

### 2.1 Public table access was broader than the customer contract

Earlier catalog grants allowed table-level selection and child policies did not consistently require a published parent. Phase 4.1 revokes the broad grants, restores only explicit safe columns, and replaces child policies with parent-aware predicates.

### 2.2 Public DTO was implicit

The customer previously depended on table-shaped results. The final boundary is two controlled `SECURITY DEFINER` SQL functions with an empty `search_path` and narrowly granted execution:

- `get_public_catalog(text, text, integer, integer)`;
- `get_public_catalog_categories()`.

Both functions explicitly qualify objects in the `public` schema. `PUBLIC` has no execute grant; only `anon` and `authenticated` do.

### 2.3 Supabase dependency was not declared directly

`apps/customer` imports `@supabase/supabase-js` directly and now declares it directly. It also declares `@supabase/ssr`. The lockfile was regenerated using pnpm, avoiding reliance on incidental workspace hoisting. Partner and Central declare Vitest directly because their test scripts invoke it.

### 2.4 Public environment variables were accessed dynamically

Dynamic `process.env[name]` access prevented Next.js from reliably replacing public values in the browser bundle. All browser-required references are now literal:

```ts
process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

There is no real-value fallback and no client reference to `SUPABASE_SERVICE_ROLE_KEY`. A unit test asserts that missing public configuration fails with a clear message naming both variables. `.env.example` contains only a safe localhost URL and empty secret/key values; real `.env` variants remain ignored.

### 2.5 Turbopack selected the wrong root

An unrelated `package-lock.json` above the repository caused Next.js to infer the wrong workspace root. Each app now resolves `turbopack.root` portably from `import.meta.url` using `new URL('../..', import.meta.url).pathname`. No absolute local path is committed and no file outside MPHO was modified or deleted.

### 2.6 ESLint found real effect errors

The first complete lint run found synchronous state writes in effects in the cart buttons. Visibility is now derived from state and delayed transitions remain inside timeout callbacks. No ESLint or TypeScript rule was disabled to hide the issue.

### 2.7 Generated types and drift were not enforced

`packages/database/types.generated.ts` is produced from the reset local schema and tracked. Domain aliases live separately in `packages/database/types.ts`. CI regenerates into a temporary file and fails on drift; it also runs `supabase db diff --local` and fails on schema drift.

### 2.8 Auth client/subscription stability needed proof

`AuthProvider` owns a stable browser client, establishes one auth subscription per provider mount, and unsubscribes on cleanup. A regression test verifies this behavior. Browser, server, proxy, and anonymous catalog clients have separate responsibilities.

### 2.9 Premature order rules were presented as implemented behavior

`apps/customer/tests/validation.test.ts` validated a simplified hard-coded order transition graph, including transitions such as `draft → pending_payment` and a narrow cancellation assumption, before actor, reason, idempotency, payment, exception, and operational rules existed as an implementation. The matching transition helper and fixed cancellation window were removed.

The replacement `packages/validation/index.test.ts` protects implemented behavior: Money must use safe integer minor units and invalid/fractional or empty product data is rejected. No valid implemented order-flow coverage was lost because the removed flow was not a complete or authoritative implementation. `docs/13_ORDER_LIFECYCLE.md` remains the source of truth.

### 2.10 A classified public product route was missing

`/producto/[slug]` was listed as public but returned 404 because no page existed. The route now reads only the public RPC DTO, renders a truthful non-purchasable product detail, returns the normal not-found state for an unknown slug, and never exposes partner identity or unverified delivery promises.

### 2.11 Duplicate published listings could duplicate a product

The first RPC version could return multiple rows for one product when more than one listing was published, indirectly revealing listing multiplicity and breaking the one-product slug contract. The migration now selects one deterministic eligible listing per product and category counts use `count(DISTINCT product.id)`. pgTAP inserts a second published listing for the same product and still requires exactly one slug result.

### 2.12 Secret scan included generated bundles

The first source scan traversed `.next` and matched documentation strings inside the Supabase SDK. The scanner now excludes only generated/dependency output (`.next`, `node_modules`, `dist`, `coverage`) while continuing to scan application source extensions.

## 3. Final grants

The migration first executes `REVOKE ALL` for `anon` and `authenticated` on:

- `categories`;
- `tags`;
- `products`;
- `product_tags`;
- `listings`;
- `listing_zones`;
- `listing_variants`;
- `listing_options`;
- `media_assets`.

It then grants only:

| Object | Selectable columns for `anon`, `authenticated` |
|---|---|
| `categories` | `id`, `parent_id`, `name`, `slug`, `type`, `description`, `image_url`, `status`, `sort_order` |
| `tags` | `id`, `name`, `slug`, `type`, `status` |
| `products` | `id`, `name`, `slug`, `description`, `product_type`, `category_id`, `status` |
| `product_tags` | `product_id`, `tag_id` |
| `listings` | `id`, `product_id`, `customer_title`, `customer_description`, `status`, `availability_mode`, `base_price_amount_minor`, `currency`, `published_at` |
| `listing_zones` | `listing_id`, `zone_id`, `status` |
| `listing_variants` | `id`, `listing_id`, `name`, `attributes`, `price_adjustment_amount_minor`, `currency`, `status` |
| `listing_options` | `id`, `listing_id`, `option_type`, `label`, `is_required`, `configuration`, `price_adjustment_amount_minor`, `currency`, `status` |
| `media_assets` | none directly |

Execute permission for both public RPCs is revoked from `PUBLIC` and granted only to `anon` and `authenticated`.

## 4. Final RLS policies changed by Phase 4.1

| Policy | Final public condition |
|---|---|
| `products_select_public` | product is active and has a published listing |
| `product_tags_select_public` | product is active, tag is active, and a linked listing is published |
| `listing_zones_select_public` | zone link is active and parent listing is published |
| `listing_variants_select_public` | variant is active and parent listing is published |
| `listing_options_select_public` | option is active and parent listing is published |
| `media_assets_select_public` | asset is public/active and belongs to an active product with a published listing or directly to a published listing |
| `catalog_public_objects_select` | optional Storage object matches an allowed public media record and published parent |

The existing listing public policy continues to enforce published listings. Existing partner-owned policies are not replaced by this migration.

## 5. Final public DTO

`get_public_catalog` returns exactly:

```text
listing_id
product_id
slug
name
short_description
full_description
price_amount_minor
currency
image_url
image_alt
category_id
category_slug
category_name
featured
personalization_available
scheduled_delivery_available
mphora_candidate
```

Rows must have a published timestamp, an active product, a non-null price, and MXN currency. Category slug and listing slug filters execute in SQL. Limit is clamped to 1–100 and offset cannot be negative. Product mapping requires non-empty identifiers, slug/name, safe non-negative integer minor-unit price, MXN, and a complete category relationship when category data is present.

The customer model exposes Money as:

```ts
type Money = {
  amountMinor: number
  currency: 'MXN'
}
```

## 6. Private fields excluded from the public contract

At minimum, anonymous users cannot select or receive:

- `partner_id`;
- `external_source_id`;
- `last_verified_at`;
- `verification_expires_at`;
- `cancellation_note`;
- `substitution_policy`;
- internal cost, margin, notes, contacts, supplier, or partner identity;
- internal/private media records or evidence metadata.

Draft listings and their variants, options, zones, product tags, and media are excluded by RLS.

## 7. Supabase clients

| Client | Responsibility | Session behavior |
|---|---|---|
| `browser.ts` | browser authentication/UI | singleton browser client using public URL and anon key |
| `server.ts` | server components/actions | request cookies, public URL and anon key |
| `proxy.ts` | session refresh in Next.js proxy | copies refreshed cookies and obtains verified user |
| `public.ts` | public catalog RPCs | singleton anonymous client; no persistence, URL session detection, or refresh |

The removed package-level database client exposed an unused ad hoc privileged helper and encouraged ambiguous client selection. `@mpho/database` now exports generated/domain types only; privileged server behavior must be introduced later behind a purpose-specific server-only boundary.

The historical schema does not grant catalog/geography table access to `service_role`; a local service-role REST fixture therefore receives `42501`. Phase 4.1 does not broaden privileged grants without an approved server contract. REST fixtures are inserted directly into isolated local PostgreSQL and removed afterward; every asserted public read runs over PostgREST as `anon`.

## 8. Routes and error behavior

- Home, catalog, login, signup, and callback routes are public.
- Profile and other classified private routes require a session.
- Safe redirects accept only local paths beginning with one `/`.
- Absolute URLs, protocol-relative URLs, and malformed targets fall back to `/`.
- Unknown product slugs return an explicit controlled empty/not-found result.
- Supabase permission, invalid-query, invalid-response, configuration, and network errors remain distinct from a valid empty catalog.

## 9. CI contract

The workflow pins:

- `actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5` — v4.3.1;
- `pnpm/action-setup@b906affcce14559ad1aafd4ab0e942779e9f58b1` — v4.3.0 (the commit dereferenced by the annotated v4 tag);
- `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020` — v4.4.0.

The job runs frozen install, client-secret scan, lint, typecheck, tests, Supabase start/reset, migrations and seed, 24 pgTAP/RLS assertions, anonymous PostgREST boundary tests, generated-type generation and drift verification, schema drift, and then all three builds. An `always()` cleanup step stops the local Supabase stack. CI does not use `--ignore-health-check`.

Local equivalent validation and remote GitHub Actions are separate evidence. Remote GitHub Actions remains pending until an authorized future push.

## 10. Regression evidence

Automated coverage includes:

- public DTO allowlist and invalid-row rejection;
- permission errors not becoming an empty catalog;
- controlled missing slug;
- exact category RPC input and server category counts;
- one Auth subscription and cleanup;
- public/private route classification and open-redirect rejection;
- missing public Supabase environment configuration;
- integer minor-unit Money validation;
- database generated-type aliases;
- 24 real pgTAP/RLS assertions.

Visual evidence from the pre-existing audit is stored under `docs/assets/phase-4-1/`, not in an application directory.

## 11. Final validation record

Final local results on 2026-07-14:

```text
pnpm install --frozen-lockfile  PASS, 10 workspace projects, lockfile unchanged
pnpm lint                     PASS, 9/9 scripted workspaces, 0 warnings
pnpm typecheck                PASS, 9/9 scripted workspaces
pnpm test                     PASS, 46 tests (32 customer, 12 database, 2 validation)
pnpm build                    PASS, Customer + Partner + Central on Next.js 16.2.6
npx supabase stop             PASS
npx supabase start            PASS with normal health checks; no ignore flag
npx supabase db reset         PASS, 14 migrations plus seed
npx supabase test db          PASS, 24/24 pgTAP/RLS assertions
pnpm db:test:rest             PASS, anonymous PostgREST boundary
pnpm db:types                 PASS
pnpm db:types:check           PASS, no generated-type drift
pnpm db:schema:check          PASS, no schema drift
pnpm security:check           PASS
```

The first clean Docker-volume startup required Realtime and Storage vector-store initialization and exceeded an early health window. After initialization completed, the definitive unmodified `stop → start → db reset` sequence passed. No `--ignore-health-check` was used or added to CI.

Visual validation passed at 1280×720 and 390×844: Home, header, hero, recipient selector, HADIA, truthful empty MPHORA state, empty cart, mobile navigation, login, signup, public product, and protected profile redirect. Browser console contained no warnings/errors or hydration failures, document width matched viewport width, and no internal partner name or identifier appeared.

## 12. Remote Customer build regression and CI correction

On 2026-07-15, GitHub Actions failed while prerendering Customer `/_not-found` with `PublicSupabaseConfigurationError`. The remote job built the three applications before starting the local Supabase stack, so `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were unavailable at build time.

The failure had two contributing causes:

- CI executed `pnpm build` before local Supabase startup and public-variable export.
- `AuthProvider` called `createBrowserSupabaseClient()` from a `useState` initializer. Although `config.ts` already exposed a lazy `getPublicSupabaseConfig()` function and performed no module-level validation, the state initializer ran while Next.js prerendered the client component on the server. Importing the root provider tree therefore caused configuration validation even for `/_not-found`.

The correction keeps strict validation at client-creation time and makes these changes:

- `AuthProvider` creates and retains its browser client from `useEffect`, which runs only in the browser, and reuses that stable client for auth subscription and sign-out.
- CI starts local Supabase before database validation and builds.
- CI reads `API_URL` and `ANON_KEY` from `supabase status -o env`, explicitly exports them as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` through `GITHUB_ENV`, and masks the anon key before export logging.
- CI performs database reset, pgTAP/RLS, REST, generated-type creation and verification, and schema drift before building Customer, Partner, and Central.
- CI still uses normal Supabase health checks and contains no production credential or hardcoded Supabase endpoint/key.

Regression coverage now proves that:

- importing `config.ts` and `app/not-found.tsx` with missing public variables does not throw;
- server-rendering the root `Providers` tree does not create a browser client;
- actually creating a browser client without configuration throws `PublicSupabaseConfigurationError`;
- valid public configuration creates the client;
- production Supabase modules use literal public environment access, contain no dynamic `process.env[name]`, and contain no hardcoded remote Supabase project URL.

Final local results on 2026-07-15:

```text
effective-empty Customer build before fix  FAIL at /_not-found with PublicSupabaseConfigurationError
effective-empty Customer build after fix   PASS, including static /_not-found
pnpm install --frozen-lockfile              PASS, 10 workspace projects, lockfile unchanged
pnpm security:check                         PASS
pnpm lint                                   PASS, 9/9 scripted workspaces
pnpm typecheck                              PASS, 9/9 scripted workspaces
pnpm test                                   PASS, 51 tests (37 customer, 12 database, 2 validation)
npx supabase stop                           PASS after Docker Desktop startup
npx supabase start                          PASS with normal health checks; no ignore flag
npx supabase db reset                       PASS, 14 migrations plus seed
npx supabase test db                        PASS, 24/24 pgTAP/RLS assertions
pnpm db:test:rest                           PASS, 13 anonymous PostgREST boundary checks
pnpm db:types                               PASS
pnpm db:types:check                         PASS, no generated-type drift
pnpm db:schema:check                        PASS, no schema drift
pnpm build                                  PASS, Customer + Partner + Central on Next.js 16.2.6
```

The exact `env -u` reproduction command loaded the developer's ignored `apps/customer/.env.local` and therefore passed locally. For a clean-runner-equivalent reproduction without reading, moving, or changing that file, both public variables were explicitly set to empty strings; this reproduced the prior remote `/_not-found` failure before the fix and passed after it.

Remote GitHub Actions validation remains pending until the next authorized push. No commit or push was made as part of this correction.

## 13. Remaining risks

- The public RPC reports conservative `false` for featured, scheduled delivery, and MPHORA until authoritative eligibility exists.
- Direct safe-column table grants remain for compatibility; customer code must use the explicit RPC DTO.
- Privileged `service_role` table grants need a separate server-contract decision before future admin/service workflows.
- Local tests do not validate a remote Supabase project or production deployment.
- Remote GitHub Actions is not validated until a future authorized push.
- Checkout, orders, payments, refunds, earnings, payouts, delivery, and operational PWAs remain outside this phase.
