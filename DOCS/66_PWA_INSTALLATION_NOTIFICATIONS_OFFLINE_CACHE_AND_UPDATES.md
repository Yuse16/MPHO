# 66_PWA_INSTALLATION_NOTIFICATIONS_OFFLINE_CACHE_AND_UPDATES.md

## 1. Purpose

This document defines the platform behavior that makes MPHO, MPHO Aliados, and MPHO Central installable and reliable as PWAs.

It covers:

- Manifest.
- icons.
- installation.
- service workers.
- cache.
- offline behavior.
- notifications.
- updates.
- logout.
- browser differences.
- security.

---

## 2. Manifest requirements

Each app must define its own `manifest.ts`, `manifest.json`, or `manifest.webmanifest` according to the selected Next.js implementation.

Required fields:

```text
id
name
short_name
description
start_url
scope
display
background_color
theme_color
icons
```

Recommended:

```text
orientation when justified
shortcuts
screenshots
categories
lang: es-MX
dir: ltr
```

Manifest validation is part of CI or release QA.

---

## 3. Icon set

At minimum prepare:

- 192 × 192 PNG.
- 512 × 512 PNG.
- maskable variant.
- Apple touch icon.
- favicon.
- monochrome notification icon where required by platform.
- high-resolution source asset.

Rules:

- No small unreadable text.
- safe-area padding.
- recognizable silhouette.
- app-specific distinction.
- test on light and dark home screens.

---

## 4. Installation behavior by app

### Customer

Optional and contextual.

### Partner

Part of onboarding.

### Central

Optional and limited to approved users.

Installation never replaces authentication.

---

## 5. Customer installation journey

```text
meaningful engagement
→ explain value
→ user taps install action
→ native prompt or platform guidance
→ confirmation
→ first installed launch
→ optional notification education
```

Do not call the browser prompt without user context.

---

## 6. Partner installation journey

```text
secure invitation
→ sign in
→ MFA
→ install
→ camera education
→ notification education
→ test order
→ active
```

Partner activation should detect missing notification permission and provide a visible operational warning without forcing unsafe browser workarounds.

---

## 7. iOS installation

Customer-facing guidance should use current Safari steps.

The app must:

- Supply an Apple-compatible icon.
- use standalone display.
- handle safe areas.
- test status bar and theme.
- avoid assuming an automatic install prompt.
- provide a short visual tutorial.
- update tutorial when iOS UI changes.

---

## 8. Android and desktop installation

When browser support exposes an install event:

- Save the event safely.
- show a branded install action.
- trigger only after user interaction.
- record dismissal.
- avoid repeated harassment.
- detect installed display mode where possible.

Desktop install is useful for Partner and Central.

---

## 9. Service worker principles

- One service worker per PWA origin.
- HTTPS only in production.
- versioned caches.
- explicit route strategy.
- no blind cache-all.
- no sensitive API caching.
- controlled update.
- safe error fallback.
- detailed tests.

---

## 10. Cache classification

### Safe static cache

- App shell assets.
- logo.
- icons.
- fonts when license permits.
- public illustrations.
- non-sensitive static help.

### Carefully cached public data

- Public product images.
- public category page.
- public legal document version where appropriate.
- public marketing content.

Use freshness controls.

### Network-only or no-store

- Authentication.
- session.
- checkout.
- payment.
- order details.
- recipient.
- address.
- private evidence.
- partner tasks.
- earnings.
- payout.
- central.
- admin.
- signed URLs.
- fraud.
- support.
- audit.

---

## 11. Suggested strategies

Possible strategies by resource:

```text
static hashed assets → cache first
public product images → stale while revalidate
public catalog request → network first with short safe fallback
private authenticated API → network only
financial mutation → network only
navigation shell → network first or controlled app-shell strategy
```

The final implementation must be tested against Next.js rendering and deployment behavior.

---

## 12. Offline customer experience

Allowed offline:

- Installed shell.
- branding.
- generic help.
- last known non-sensitive public content when safe.
- clear no-connection screen.

Not allowed offline as official truth:

- Payment.
- quote confirmation.
- MPHORA eligibility.
- stock.
- current order state.
- cancellation.
- address change.
- refund.

Message:

> No hay conexión. Tus acciones no se enviaron. Vuelve a intentarlo cuando recuperes internet.

---

## 13. Offline partner experience

The app may temporarily keep:

- Minimal current task reference.
- prepared draft notes.
- pending evidence capture under encrypted or protected local strategy.
- training content.

Official state changes require server confirmation.

For a failed synchronization:

- Keep draft.
- show unsent state.
- prevent duplicate submission.
- allow retry.
- provide urgent support route.

---

## 14. Offline Central experience

Central should not present stale data as live.

Allowed:

- App shell.
- static runbooks.
- maintenance contact.

Restricted:

- Order operations.
- financial action.
- partner action.
- security action.
- configuration.

Show last-updated time prominently if any safe read-only data remains visible.

---

## 15. Background sync

Use background synchronization only when browser support and security allow.

Good candidates:

- Non-sensitive analytics.
- acknowledged notification receipt.
- safe evidence upload retry with protected local handling.

Poor candidates:

- Payment.
- refund.
- payout.
- partner acceptance.
- official order state.
- account change.

Every retry must be idempotent.

---

## 16. Push notifications

Push uses:

```text
permission
subscription
server storage
event
service worker
notification
deep link
```

Store subscription by:

- User.
- app.
- device/browser.
- permission status.
- created.
- last success.
- revoked.

Do not share one subscription across roles.

---

## 17. Notification categories

### Customer

- Payment.
- preparation milestone.
- out for delivery.
- delivered.
- issue.
- refund.
- reminder.

### Partner

- New offer.
- deadline.
- package.
- courier.
- incident.
- payout.

### Central

- Critical incident.
- payment mismatch.
- payout risk.
- provider outage.
- security alert.
- order at risk.

---

## 18. Notification consent

Permission must follow an educational prompt.

The user should know:

- What they receive.
- Why it matters.
- How to disable.
- What happens when they decline.

Browser permission must be requested from a user action.

---

## 19. Notification privacy

No notification should expose:

- Full address.
- private gift message.
- payment details.
- payout account.
- sensitive incident.
- password/reset secret.
- unnecessary recipient identity.

Deep links must require valid authorization.

---

## 20. Update model

A PWA update may involve:

- HTML/server content.
- JavaScript.
- CSS.
- manifest.
- icons.
- service worker.
- cached assets.

The application should:

- Detect waiting service worker.
- avoid interrupting active checkout or operational task.
- show update message.
- allow safe refresh.
- force critical security update when necessary.
- clear incompatible cache.
- preserve unsent safe drafts.

---

## 21. Update messages

Customer:

> Hay una nueva versión de MPHO. Actualiza para continuar con la mejor experiencia.

Partner:

> MPHO Aliados necesita actualizarse antes de recibir nuevas tareas.

Central:

> Actualización de seguridad disponible. Guarda tu trabajo y actualiza.

Critical updates may block high-risk actions until refreshed.

---

## 22. Logout

Logout must:

- Revoke or end session.
- clear private client state.
- clear private cache.
- clear sensitive IndexedDB/local storage.
- retain only public assets.
- not automatically unsubscribe device when user only changes account unless policy requires.
- prevent next user from seeing prior data.

Partner shared-device use should be discouraged.

---

## 23. Storage pressure and eviction

Never assume local storage is permanent.

The server remains source of truth.

Design for:

- Browser clearing data.
- OS eviction.
- private mode.
- limited device storage.
- reinstall.
- multiple devices.

---

## 24. Security controls

- HTTPS.
- CSP.
- no sensitive precache.
- service-worker file served safely.
- narrow scope.
- update integrity through trusted deployment.
- no arbitrary import scripts.
- push subscription authorization.
- safe notification deep links.
- cache poisoning tests.
- logout tests.
- old-service-worker tests.

---

## 25. QA matrix

Test:

- iPhone Safari.
- installed iPhone web app.
- Android Chrome.
- installed Android PWA.
- desktop Chrome/Edge.
- slow network.
- offline.
- revoked notification.
- denied camera.
- storage cleared.
- service-worker update.
- old app version.
- logout and account switch.
- expired deep link.
- duplicated push.
- uninstall/reinstall.

---

## 26. Official references

- Next.js Progressive Web Apps guide  
  https://nextjs.org/docs/app/guides/progressive-web-apps
- Next.js manifest convention  
  https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
- Next.js app icons  
  https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
- web.dev Web App Manifest  
  https://web.dev/learn/pwa/web-app-manifest
- web.dev Installation  
  https://web.dev/learn/pwa/installation
- web.dev Service Workers  
  https://web.dev/learn/pwa/service-workers
- web.dev PWA update  
  https://web.dev/learn/pwa/update
- Apple: turn a website into an app on iPhone  
  https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios
- MDN Push API  
  https://developer.mozilla.org/en-US/docs/Web/API/Push_API
- MDN Service Worker API  
  https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
