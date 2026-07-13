# 59_THREE_PWA_ECOSYSTEM_AND_ARCHITECTURE.md

## 1. Purpose

This document defines the three installed web applications in the MPHO ecosystem:

```text
MPHO
MPHO Aliados
MPHO Central
```

They share one business platform but have separate:

- Audiences.
- origins.
- manifests.
- icons.
- start URLs.
- navigation.
- permissions.
- caching.
- notifications.
- security posture.
- release checks.

---

## 2. Applications

### MPHO — Customer PWA

```text
Production origin: https://mpho.mx
Installed name: MPHO
Audience: customers
Purpose: discover, personalize, buy, track, remember
```

### MPHO Aliados — Partner PWA

```text
Production origin: https://aliados.mpho.mx
Installed name: MPHO Aliados
Audience: partner admins and operators
Purpose: accept and execute assigned work
```

### MPHO Central — Internal PWA

```text
Production origin: https://central.mpho.mx
Installed name: MPHO Central
Audience: authorized MPHO personnel
Purpose: operate, monitor, resolve, reconcile, configure
```

---

## 3. Architectural principle

Recommended monorepo:

```text
apps/
├── customer/
├── partner/
└── central/

packages/
├── ui/
├── design-tokens/
├── auth/
├── authorization/
├── domain/
├── database/
├── validation/
├── security/
├── observability/
└── testing/
```

Each application must remain independently deployable.

---

## 4. Why separate origins

Separate origins support:

- Independent installation identity.
- independent service worker scope.
- independent cookies.
- independent CSP.
- independent deployment protection.
- clearer authorization boundary.
- safer caching.
- distinct notification purpose.
- lower accidental exposure.
- separate analytics.

Do not assume that sharing a parent domain creates a safe authorization boundary.

---

## 5. Shared backend

All applications connect to shared domain services:

```text
identity
customer
partner
catalog
inventory
quote
order
payment
refund
earning
payout
delivery
notification
HADIA
MPHORA
incident
audit
```

The backend remains the source of truth.

No PWA owns official payment, order, payout, or delivery state.

---

## 6. Authentication separation

### Customer

- Customer account.
- session appropriate for consumer use.
- optional remembered device.
- step-up for sensitive account changes.

### Partner

- Partner-scoped user.
- MFA according to role.
- named user.
- no shared shop login.
- partner and capability authorization.

### Central

- Internal named account.
- mandatory MFA.
- shorter session.
- stronger recovery.
- step-up for privileged action.
- no public self-registration.

---

## 7. Manifest separation

Each PWA requires its own manifest.

Minimum fields:

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
shortcuts where supported
screenshots where useful
```

Suggested manifest identity:

### Customer

```text
id: /
start_url: /
scope: /
theme: premium dark + lime
```

### Partner

```text
id: /
start_url: /inicio
scope: /
theme: dark operational + lime/amber
```

### Central

```text
id: /
start_url: /resumen
scope: /
theme: dark professional + blue/cyan
```

Each manifest belongs to its own origin.

---

## 8. Service worker separation

Each application registers only its own service worker.

Rules:

- Customer service worker must not cache partner or central resources.
- Partner service worker must not cache payout or private order data broadly.
- Central service worker must use the most restrictive cache strategy.
- Auth and financial responses are network-only.
- Private API data is not placed in generic cache storage.
- Logout clears app-specific private cache.
- Service-worker updates are visible and controlled.

---

## 9. Deployment model

Suggested:

```text
Vercel project: mpho-customer
Vercel project: mpho-partner
Vercel project: mpho-central
```

Benefits:

- Separate environment variables.
- separate domains.
- separate release.
- separate deployment protection.
- independent rollback.
- lower blast radius.

Shared packages remain in monorepo.

---

## 10. Environment matrix

Every application has:

```text
local
preview
staging
production
```

Central preview must not receive production data.

Partner preview must not send real partner notifications.

Customer preview must not create real payment or delivery.

---

## 11. Routing boundaries

### Customer

```text
/
/regalos
/ocasiones
/hadia
/mphora
/producto/[slug]
/carrito
/checkout
/pedidos
/pedidos/[orderNumber]
/perfil
/soporte
```

### Partner

```text
/inicio
/ofertas
/pedidos
/pedidos/[orderNumber]
/paquetes
/preparacion
/ganancias
/incidentes
/configuracion
```

### Central

```text
/resumen
/operacion
/pedidos
/aliados
/catalogo
/inventario
/entregas
/clientes
/hadia
/mphora
/pagos
/reembolsos
/ganancias
/payouts
/soporte
/incidentes
/analitica
/seguridad
/configuracion
```

---

## 12. Shared component policy

May be shared:

- Button primitives.
- typography.
- form fields.
- dialog.
- badge.
- icons.
- validation.
- accessibility utilities.
- date and money formatting.
- domain status definitions.

Should not be blindly shared:

- Customer product card.
- Partner task card.
- Central financial table.
- navigation shell.
- caching rules.
- auth layout.
- notification copy.

Shared code must not erase role-specific usability.

---

## 13. Release independence

Examples:

- Customer marketing redesign does not require partner deployment.
- Partner camera fix does not require central deployment.
- Central finance patch can deploy independently.
- Shared domain or database change requires compatibility review across all apps.

Use versioned contracts for shared APIs.

---

## 14. App identity

### Customer icon

- MPHO symbol.
- premium.
- recognizable at small size.
- no text too small to read.

### Partner icon

- MPHO symbol with operational distinction.
- `Aliados` may appear in splash or name, not necessarily tiny icon text.
- visually distinguishable from customer icon.

### Central icon

- restricted professional identity.
- distinguishable from both public apps.
- no indication that reveals privileged data.

---

## 15. Installation policy

### Customer

Installation is optional and promoted contextually.

### Partner

Installation is part of activation because notifications, camera, and daily operation depend on quick access.

### Central

Installation is optional on desktop and approved mobile devices.

Central access still requires strong authentication and device security.

---

## 16. PWA limitations

A PWA must not be presented as equivalent to every native capability.

The design must account for:

- Browser differences.
- permission differences.
- notification support differences.
- background execution limits.
- installation differences.
- storage eviction.
- offline limitations.
- camera and file behavior.
- OS update differences.

Every critical workflow needs a server-confirmed fallback.

---

## 17. Definition of done

The three-PWA architecture is ready when:

- Three origins exist.
- three manifests validate.
- three icons exist.
- three service workers have separate scopes.
- auth is role-safe.
- private cache tests pass.
- installation works on target devices.
- update behavior works.
- all routes have responsive designs.
- deployment and rollback are independent.
