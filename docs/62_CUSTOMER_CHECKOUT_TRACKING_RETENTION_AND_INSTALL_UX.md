# 62_CUSTOMER_CHECKOUT_TRACKING_RETENTION_AND_INSTALL_UX.md

## 1. Purpose

This document defines customer cart, checkout, order tracking, account retention, reminders, and contextual PWA installation.

The experience must minimize uncertainty without hiding required details.

---

## 2. Cart principles

The cart should answer:

```text
What am I buying?
How will it be personalized?
When can it arrive?
What is the total?
What may still change?
```

No internal partner should appear.

---

## 3. Cart layout

### Product block

- Image.
- product name.
- variant.
- contents.
- personalization.
- add-ons.
- quantity.
- source label.
- delivery eligibility.

### Price block

- Product.
- personalization.
- preparation.
- delivery.
- discount.
- taxes when applicable.
- total.

### Timing block

- Requested date.
- current estimate.
- MPHORA expiration when applicable.
- quote expiration.

---

## 4. Cart warnings

Examples:

- Quote expires in 12 minutes.
- Availability requires final confirmation.
- External product may take additional time.
- Personalization must be approved before work starts.
- Address may change delivery price.

Warnings must be specific and actionable.

---

## 5. Checkout step 1 — Recipient

Fields:

- Recipient name.
- phone when operationally needed.
- relationship label.
- surprise mode.
- optional alternate recipient.
- optional note for delivery.

Privacy note:

> Usaremos estos datos únicamente para coordinar y entregar este pedido, además de seguridad y atención.

Do not add recipient to marketing.

---

## 6. Checkout step 2 — Personalization

Show:

- Exact text.
- image/audio/video preview.
- spelling confirmation.
- layout or style.
- deadline.
- irreversible-work warning.
- rights declaration for uploaded content.

Require explicit approval.

---

## 7. Checkout step 3 — Delivery

Fields and controls:

- Address.
- map point.
- references.
- date.
- window.
- delivery mode.
- surprise contact behavior.
- access restrictions.

Show:

- requested versus confirmed timing.
- reattempt policy summary.
- perishable warning when applicable.
- delivery cost.

---

## 8. Checkout step 4 — Summary

Display a fixed review:

```text
gift
recipient
personalization
delivery address
date/window
surprise mode
price breakdown
terms
refund summary
privacy link
```

Any material edit invalidates the prior quote or payment authorization when necessary.

---

## 9. Checkout step 5 — Payment

Requirements:

- Provider-controlled payment entry.
- no card data through HADIA or WhatsApp.
- total remains visible.
- merchant identity is clear.
- safe return page.
- pending payment state.
- duplicate-payment warning.
- support link.

The redirect alone must not mark the order paid.

---

## 10. Order-confirmation page

Show:

- Success or pending truthfully.
- order number.
- summary.
- next step.
- expected notification.
- tracking CTA.
- account creation or sign-in.
- contextual installation CTA.

Example:

> Tu pedido MPHO-1042 fue confirmado. Ahora coordinaremos la preparación y te avisaremos cuando avance.

---

## 11. Tracking experience

The tracking page should have:

- Large current status.
- next step.
- delivery window.
- timeline.
- gift summary.
- recipient summary.
- support.
- issue action.
- cancellation action when eligible.
- refund state.

Customer-safe timeline examples:

```text
Pago confirmado
Preparación coordinada
Producto confirmado
En preparación
Listo para entrega
Va en camino
Entregado
```

---

## 12. Live updates

Use:

- Server data as source of truth.
- refresh on app focus.
- push notification.
- in-app notification.
- timestamp.
- manual refresh.

Avoid fake real-time animation when no live data exists.

---

## 13. Support from order

Support actions:

- Where is my order?
- Change delivery details.
- Report product issue.
- Report delivery issue.
- Cancel.
- Request invoice.
- Payment issue.
- Other.

The support case should inherit order context safely.

---

## 14. Customer retention

After a successful order, offer:

- Save recipient.
- save occasion.
- remember date.
- reorder.
- review experience.
- install MPHO.
- enable notifications.
- discover future ideas.

Do not interrupt confirmation with too many requests.

---

## 15. People and occasions

A saved person may include:

- Nickname.
- relationship.
- optional preferences.
- important dates.
- gift history.
- budget preference.
- reminder setting.

Avoid storing sensitive inferences without clear purpose and consent.

---

## 16. Reorder

Reorder should:

- Create a new draft.
- revalidate price.
- revalidate availability.
- revalidate delivery.
- not reuse expired quote.
- ask whether personalization should change.
- preserve customer control.

Never silently purchase again.

---

## 17. Installation timing

Do not immediately interrupt first visit.

Good triggers:

- After HADIA delivers useful recommendations.
- after cart creation.
- after order confirmation.
- when enabling occasion reminders.
- second or later meaningful visit.
- customer opens tracking repeatedly.

Avoid showing installation prompt:

- Before user understands MPHO.
- during payment.
- during an error.
- repeatedly after dismissal.
- when browser installation is unavailable.

---

## 18. Customer install message

Suggested:

> Ten tus pedidos, regalos y fechas importantes en un solo lugar.

Benefits:

- Faster order access.
- tracking.
- reminders.
- HADIA.
- saved people.
- notifications.

CTA:

> Agregar MPHO

Secondary:

> Ahora no

---

## 19. iPhone guidance

When automatic browser installation prompting is unavailable, show a guided sheet:

```text
1. Abre MPHO en Safari.
2. Toca Compartir.
3. Selecciona Agregar a pantalla de inicio.
4. Activa Abrir como app web cuando aparezca.
5. Confirma Agregar.
```

The exact wording should adapt to the current iOS interface.

---

## 20. Android guidance

When the install event is available:

- Explain benefits.
- show native prompt after user action.
- confirm success.
- avoid repeated prompts.

Fallback:

- Browser menu.
- Install app or Add to Home screen.

---

## 21. Notification permission timing

Ask after explaining the benefit.

Good contexts:

- Order confirmed.
- tracking opened.
- reminder enabled.
- partner activation for partner app.

Customer message:

> Activa notificaciones para saber cuándo tu regalo esté listo y cuando vaya en camino.

Do not ask on first page load.

---

## 22. Notification privacy

Lock-screen messages should avoid unnecessary details.

Preferred:

> Tu pedido MPHO avanzó. Revisa el estado.

Avoid:

> El regalo de aniversario para Jimena con dirección completa ya va en camino.

---

## 23. Account recovery and secure links

- Tracking links expire or require verification.
- order number alone is not authentication.
- account recovery is separate from support.
- sensitive address changes require verification.
- saved recipients require authenticated access.
- logout clears private local data.

---

## 24. Acceptance criteria

- Checkout clearly shows total and timing.
- Partner identity remains internal.
- Payment state is accurate.
- Tracking explains the next step.
- Install promotion appears contextually.
- Notification permission is requested after value.
- Reorder revalidates everything.
- Private data is not cached or exposed.
