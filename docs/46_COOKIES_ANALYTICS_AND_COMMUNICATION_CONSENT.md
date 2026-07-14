# 46_COOKIES_ANALYTICS_AND_COMMUNICATION_CONSENT.md

## 1. Status

```text
INTERNAL CONSENT AND TRACKING REQUIREMENTS
PUBLIC POLICY SKELETON
LEGAL AND PRIVACY REVIEW REQUIRED
```

This document separates:

- Necessary service communications.
- Security alerts.
- Transactional WhatsApp.
- Marketing.
- Analytics.
- Cookies and similar technology.
- Occasion reminders.
- Consent withdrawal.

---

## 2. Core principles

- Do not combine checkout acceptance with marketing consent.
- Do not preselect marketing.
- Do not treat a recipient's delivery phone as marketing consent.
- Explain each communication purpose.
- Honor opt-out.
- Preserve security and necessary transactional contact.
- Do not load unnecessary trackers secretly.
- Avoid dark patterns.
- Keep consent evidence.
- Allow settings change.

---

## 3. Cookie categories

### Essential

Necessary for:

- Authentication.
- session.
- security.
- load balancing.
- fraud prevention.
- cart.
- consent preference.
- payment flow.

These should be limited to actual necessity.

### Preference

Examples:

- Language.
- location preference.
- non-essential interface choices.

### Analytics

Examples:

- Funnel measurement.
- page performance.
- product interaction.
- HADIA use.

Analytics must avoid unnecessary PII.

### Marketing

Examples:

- ad attribution.
- retargeting.
- cross-site tracking.
- advertising audience.

Marketing has the highest consent and privacy risk.

---

## 4. Tracker inventory

Maintain:

```text
name
provider
category
purpose
data
cookie_or_storage_name
domain
expiration
cross_border
consent_required
loaded_before_consent
privacy_policy
owner
last_review
```

No unregistered tracker in production.

---

## 5. Consent manager

The interface should support:

- Accept selected categories.
- Reject non-essential.
- Customize.
- Change later.
- Persist choice.
- show version.
- provide cookie policy.
- not block access unnecessarily.
- avoid equal-looking deception.
- avoid “reject” hidden behind many screens.

The exact legal configuration must be reviewed for Mexico and any other target jurisdiction.

---

## 6. Analytics privacy

Preferred approach:

- First-party or privacy-conscious analytics.
- pseudonymous identifiers.
- no full address.
- no gift message.
- no recipient phone.
- no payment reference.
- no private evidence.
- no raw HADIA chat by default.
- retention limits.
- restricted access.
- consent or other valid basis as required.

---

## 7. Advertising audiences

Before creating an audience:

- Confirm consent.
- Define source.
- exclude recipients without consent.
- exclude sensitive data.
- exclude private gift context.
- provide opt-out.
- review provider terms.
- define retention.

Do not create sensitive segments such as health, religion, or intimate relationship inference from gift behavior.

---

## 8. Communication categories

### Essential account and security

- Login.
- password reset.
- MFA.
- account compromise.
- payout-account change.
- privacy or security incident.

These should not contain marketing.

### Transactional order

- Quote expiration when requested.
- payment.
- partner acceptance.
- product receipt.
- preparation.
- delivery.
- refund.
- support.

### Partner operational

- New offer.
- deadline.
- package arrival.
- evidence.
- payout.

### Marketing

- Promotions.
- seasonal campaigns.
- partner offers.
- recommendations unrelated to active order.

### Occasion reminders

May be useful but should use clear user control and avoid embarrassing disclosure.

---

## 9. WhatsApp

Store:

```text
phone
purpose
opt_in_source
notice_version
timestamp
status
revoked_at
template_category
```

Rules:

- Transactional and marketing permissions separated.
- Follow current provider template and conversation rules.
- Do not ask for payment-card data.
- do not send private gift detail to wrong contact.
- secure deep links.
- honor opt-out.
- maintain suppression.
- verify provider rules before production because they change.

---

## 10. Recipient communication

Recipient may receive:

- Delivery coordination.
- safety message.
- delivery code.
- failed-attempt message.

Recipient must not receive:

- Marketing.
- buyer's unrelated data.
- full gift detail contrary to surprise mode.
- future occasion reminders without consent.

---

## 11. Email

Email must support:

- Domain authentication.
- Transactional/marketing separation.
- unsubscribe for marketing.
- bounce handling.
- suppression.
- minimal sensitive content.
- secure links.
- no password or secret.

---

## 12. Push notification

Future push notifications should:

- Ask device permission in context.
- explain value.
- avoid surprise disclosure on lock screen.
- allow category controls.
- not include sensitive recipient or gift details by default.
- revoke tokens on logout.

---

## 13. Occasion reminders

The user must control:

- Occasion.
- person label.
- reminder date.
- communication channel.
- message privacy.
- deletion.

Avoid lock-screen text that reveals:

- relationship.
- private event.
- gift.
- recipient identity.

---

## 14. Consent withdrawal

Withdrawal should:

- Be easy.
- propagate to providers.
- update suppression.
- stop future marketing.
- preserve necessary record of opt-out.
- not affect completed order records.
- not stop required security alerts.
- provide confirmation.

---

## 15. Consent evidence

Store:

```text
subject
channel
purpose
decision
notice_version
interface_version
timestamp
source
withdrawn_at
provider_sync_status
```

Do not store unnecessary IP data without documented purpose.

---

## 16. Dark-pattern prohibition

Do not:

- Precheck paid or marketing options.
- use confusing double negatives.
- make reject harder than accept.
- threaten loss of service for rejecting marketing.
- disguise ads as organic products.
- use false countdowns.
- repeatedly ask after rejection without reason.
- hide unsubscribe.
- add partner marketing to delivery messages.

---

## 17. Spanish cookie notice skeleton

# Política de Cookies y Tecnologías Similares

MPHO utiliza tecnologías necesarias para:

- Mantener la sesión.
- Proteger la cuenta.
- Conservar el carrito.
- Evitar fraude.
- Procesar funciones solicitadas.

Con su elección, MPHO también puede utilizar tecnologías de:

- Preferencias.
- Analítica.
- Marketing.

La persona puede aceptar, rechazar o configurar las tecnologías no esenciales desde:

```text
[COOKIE_SETTINGS_URL]
```

La lista vigente de proveedores, finalidades y duración se encuentra en:

```text
[TRACKER_LIST_URL]
```

Rechazar tecnologías no esenciales no impedirá realizar un pedido.

---

## 18. Spanish communication consent

### Marketing consent

> Acepto recibir promociones y recomendaciones comerciales de MPHO por los canales seleccionados. Puedo retirar mi consentimiento en cualquier momento. Este consentimiento no es necesario para comprar.

### Occasion reminders

> Deseo que MPHO me recuerde las ocasiones que guarde. Puedo cambiar el canal, fecha o eliminar el recordatorio.

### Transactional notice

> MPHO utilizará los datos de contacto para mensajes necesarios sobre cuenta, seguridad, pedido, entrega, reembolso y soporte.

This is a notice, not a blanket marketing consent.

---

## 19. Product requirements

- Consent center.
- cookie categories.
- tracker registry.
- no nonessential tracker before applicable consent.
- marketing unchecked.
- WhatsApp purpose records.
- recipient exclusion.
- unsubscribe.
- suppression.
- provider synchronization.
- lock-screen privacy.
- consent version.
- audit.
