# 76 — Payment integrity and Mercado Pago foundation

## 1. Status and boundary

- Evidence date: 2026-07-16.
- Phase: 8.
- Provider: Mercado Pago Checkout Pro through the official Node SDK `mercadopago@3.2.0`.
- Implemented lifecycle: `quoted → pending_payment → paid`, plus controlled return to `quoted` and coordinated quote expiry.
- Production status: **blocked** pending real Mercado Pago sandbox acceptance, production credentials/configuration, alert routing, operational ownership and launch checklist evidence. Local migration, pgTAP, REST, generated types and schema drift validation pass.

This phase does not assign a Punto MPHO, reserve inventory, prepare or deliver an order, refund money, create a ledger, calculate earnings or pay a partner. `paid` is a provider-confirmed financial boundary only.

## 2. Official sources consulted

Consulted on 2026-07-16:

- Mercado Pago, [Checkout Pro preferences](https://www.mercadopago.com.mx/developers/en/reference/preferences/_checkout_preferences/post).
- Mercado Pago, [Webhooks notifications](https://www.mercadopago.com.mx/developers/en/docs/checkout-pro/additional-content/notifications/webhooks).
- Mercado Pago, [Payment methods](https://www.mercadopago.com.mx/developers/en/reference/payment_methods/_payment_methods/get).
- Mercado Pago, [official Node SDK](https://github.com/mercadopago/sdk-nodejs).

The installed SDK includes `WebhookSignatureValidator.validate`. It validates the official manifest with constant-time comparison and throws on an invalid signature; MPHO converts that behavior into a boolean without implementing a competing signature format.

## 3. Decisions

- Checkout Pro hosted checkout only; no Bricks and no Orders checkout API.
- Server creates one preference with one item named `Pedido MPHO` and the exact authorized total.
- Only immediate card/account-balance behavior is intended. `ticket`, `atm`, `bank_transfer`, `oxxo` and `paycash` are excluded and installments are limited to one. This must be proven in sandbox before production. If “Meses sin tarjeta” remains visible despite this configuration, production checkout stays blocked.
- No public key is required because the customer is redirected to a server-created hosted URL.
- `external_reference` is 32 random bytes encoded as hex and contains no order, Customer, partner or sequence information.
- A preference expires no later than its final quote. Creation requires at least 600 seconds of remaining validity.
- The provider is authoritative. Return query parameters never mutate payment state.

## 4. State model

Attempts use `creating`, `checkout_ready`, `pending`, `approved`, `rejected`, `cancelled`, `expired`, `error` and `requires_review`.

Provider status and status detail remain separate from normalized state. Customer never receives either provider IDs or `provider_status_detail`. A provider `approved` result can still become `requires_review` if amount, currency, reference, environment, application when available, effective approval time, duplicate approval or order state validation fails.

`requires_review` blocks another session. It does not mark the order paid and never triggers an automatic refund.

## 5. Data and integrity

`payment_attempts` stores the order/quote/customer links, exact minor-unit amount, MXN currency, opaque reference, private provider references and checkout URL, idempotency data, expiry, provider observations and lifecycle timestamps. Partial unique indexes enforce one ordinary active attempt and one approved attempt per order. A separate check prevents `paid` without both `paid_at` and an active approved-attempt link; transactional commands enforce cross-table rules.

`payment_provider_events` is a sanitized deduplicating inbox keyed by provider, environment and event ID. It stores signature result, resource correlation, payload hash, safe type/action/date metadata and processing outcome—not the full payload.

Both tables use RLS with no policies and no direct grants to `anon` or `authenticated`. Customer uses narrow APIs; Central uses role-derived RPCs; webhooks and internal commands use an isolated server-only elevated client.

## 6. Checkout creation

`POST /api/payments/checkout` accepts exactly `orderId` and `expectedVersion`, plus `Idempotency-Key`. The database derives the Customer from the verified auth user and locks order and quote. It requires ownership, `quoted`, a valid final eligible MXN quote, exact positive total, final delivery/service, version match, sufficient lifetime and no paid, active or review attempt.

The first transaction creates `creating` without holding a transaction during the provider call. The backend creates the preference, validates its HTTPS Mercado Pago host and expiry, reopens a transaction, revalidates and moves the attempt/order to `checkout_ready`/`pending_payment`. A provider timeout is followed by external-reference search before any conclusion. An uncertain creation becomes `requires_review`.

## 7. Webhook and authoritative verification

`POST /api/webhooks/mercado-pago` permits JSON up to 32 KiB and requires `x-signature`, `x-request-id` and official `data.id`. Invalid signatures are stored as minimal security events, do not call Mercado Pago and return 401. Valid events enter the deduplicated inbox, then the payment resource is fetched using the access token. Body status is never trusted.

The processor validates payment ID, opaque external reference, exact integer minor units, MXN, live mode against environment, expected application identifier when the returned resource exposes one, attempt/order/quote, status, approval time, expiry and absence of refunded amount. A valid approval created and approved before expiry may be accepted even if the webhook arrives later. A late effective approval is review-only.

Atomic approval locks the event, attempt and order; records the attempt once; changes only `pending_payment → paid`; increments order version; writes state history/audit; and marks the event processed. Replays do not duplicate the transition. A second approved payment is retained as `requires_review` and must be handled manually in a future authorized refund phase.

## 8. Terminal and expiry behavior

Pending remains `pending_payment`. Rejected, cancelled and expired attempts lose their checkout URL and return the order to `quoted` while the quote remains valid. If it has expired, the existing controlled `quoted → quote_pending` expiry follows. The system must not silently invalidate an active checkout; inability to confirm preference expiry is review-only.

## 9. Customer and Central

Customer sees the exact total, validity, safe payment button, loading/conflict behavior, confirmation, controlled requery, reopening of a still-valid hosted URL, paid date and neutral review messages. `/pago/resultado` reads only the internal owned order and never trusts provider query data.

Central provides `/pagos` and `/pagos/[attemptId]` with order reference, normalized/internal status, exact amount, environment, age, alerts, sanitized events and state history. It can force an authenticated requery with a reason. There is deliberately no “mark paid,” amount/currency edit, payment-ID input, refund or cancellation action.

Partner receives no payment, order, Customer or Recipient access and no notification.

## 10. Security, privacy and observability

Secrets are server-only and the exact elevated modules are guarded by the secret scanner and `import 'server-only'`. Production/test behavior is set explicitly by configuration; token prefixes are not treated as environment evidence. Checkout URLs and provider IDs are not logged. Structured events cover session request/result, webhook receipt/signature failure, provider fetch failure, mismatches, approval, rejection, duplicate and review paths without PII.

Production alert routing remains blocked. Required alerts include invalid-signature spikes, repeated provider failures, review attempts, duplicate approvals, mismatches and processing latency. Labels must not contain provider IDs.

## 11. Retention and recovery

Sanitized provider events have an initial 90-day documentary retention. Automatic deletion is deferred until a safe retention job, legal approval and deletion evidence exist. `payment_attempts`, `audit_logs` and `order_state_history` are retained throughout the pilot. Backups must cover all four together so an order cannot be restored without its financial evidence.

## 12. Tests and acceptance

Automated coverage includes deterministic fake scenarios, provider request/config validation, API shape and authentication, double-click protection, RLS/default deny, narrow grants, unique indexes, empty `search_path` and absence of post-paid states. Unit tests perform no external call.

Real sandbox acceptance remains mandatory: immediate method visibility, excluded methods, success/pending/rejection, signature fixtures, duplicate/out-of-order notification, provider timeout recovery, quote expiry race, late in-window notification, mismatches and second approved payment. Production must additionally prove separate live resources, fixed webhook URL, secret rotation, alert ownership, backup/restore, incident response and the launch checklist.

## 13. Risks and next phase

- Mercado Pago's returned payment resource in SDK 3.2.0 does not expose a direct `application_id`; MPHO validates it when present and otherwise relies on token/account isolation. Production needs sandbox evidence of the strongest available account/application correlation.
- Deferred-method exclusion and “Meses sin tarjeta” require visual sandbox proof.
- Reconciliation retries and alert transport are minimal foundations, not a durable worker.
- Local Supabase reset, 160 pgTAP assertions, REST/RPC boundaries, generated types and schema drift pass. This evidence does not replace the real provider sandbox matrix.

Recommended next phase: harden reconciliation/operations and obtain sandbox acceptance evidence. Do not begin assignment, reservation, fulfillment, refund or ledger work without a separately approved scope.
