# 63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md

## 1. Purpose

This document defines the screen-by-screen UX for MPHO Aliados.

MPHO Aliados is an operational work application, not a marketing website.

Its primary question is:

> What must this partner do now, by when, and for how much?

---

## 2. Navigation

Mobile bottom navigation:

```text
Inicio
Pedidos
Paquetes
Ganancias
Más
```

Desktop/tablet side navigation:

```text
Inicio
Ofertas
Pedidos
Paquetes
Preparación
Entregas
Ganancias
Incidentes
Equipo
Configuración
```

Role determines visible routes.

---

## 3. Home screen

Header:

```text
Buenos días, [Partner Public Internal Name]
Estado: Abierto
Capacidad: 4 de 6
MPHORA: Activo
```

Quick controls:

- Pausar pedidos.
- update capacity.
- pause MPHORA.
- report incident.
- scan package.

Metric cards:

- New offers.
- prepare today.
- packages expected.
- ready for pickup.
- pending incidents.
- payable earnings.

---

## 4. Priority task list

Task card includes:

- Order number.
- task.
- deadline.
- time remaining.
- product thumbnail.
- delivery window.
- earning.
- risk indicator.
- primary action.

Example:

```text
MPHO-1042
Preparar ramo y tarjeta
Entrega: hoy 6:00–7:00 p. m.
Tiempo restante: 48 min
Ganancia: $185 MXN
[Comenzar preparación]
```

---

## 5. New offer screen

Show:

- Order number.
- required capabilities.
- product.
- quantity.
- preparation work.
- delivery timing.
- acceptance deadline.
- earning breakdown.
- package path.
- risk notes necessary for work.

Actions:

```text
Aceptar
Rechazar
```

Reject reasons:

- No stock.
- no capacity.
- closing soon.
- equipment unavailable.
- category issue.
- timing impossible.
- security concern.
- other.

No customer payment or marketing data.

---

## 6. Accepted order detail

Tabs or sections:

```text
Resumen
Producto
Personalización
Checklist
Evidencia
Entrega
Incidentes
Ganancia
```

Primary action changes by current state.

The screen must prevent state skipping.

---

## 7. Stock confirmation

Controls:

- Exact variant.
- quantity.
- condition.
- expiration when relevant.
- reserved location.
- confirmation timestamp.
- issue action.

Do not allow vague “available” confirmation without variant.

---

## 8. Package expected screen

Show:

- Order.
- external provider.
- tracking reference.
- expected date.
- package count.
- receiving instructions.
- storage requirement.
- customer-safe confidentiality warning.

Actions:

- Scan or enter reference.
- received.
- not received.
- wrong package.
- damaged.
- suspicious.

---

## 9. Package receipt flow

Step-by-step:

```text
1. Scan reference
2. Confirm order
3. Photograph sealed package
4. Record visible condition
5. Open only if authorized
6. Confirm contents
7. Record storage location
8. Submit
```

The server confirms official receipt.

---

## 10. Preparation screen

Checklist examples:

- Correct product.
- correct variant.
- personalization approved.
- card text verified.
- add-ons included.
- wrapping selected.
- quality reviewed.
- package sealed.
- evidence captured.
- label attached.

The checklist is generated from order requirements.

---

## 11. Evidence capture

Camera-first layout:

- Required photo list.
- capture guidance.
- retake.
- upload progress.
- server confirmation.
- privacy warning.

Do not mark ready until required evidence is accepted.

Offline capture may be queued locally only with strict privacy controls and must not create official state until synchronized.

---

## 12. Ready and courier handoff

Ready screen shows:

- Required pickup time.
- package count.
- courier status.
- order code.
- recipient-safe label.
- handoff checklist.

Handoff:

```text
verify courier
→ verify order
→ photograph or code
→ record time
→ server confirmation
```

---

## 13. Earnings screen

Sections:

```text
Hoy
Por liberar
Disponible
En pago
Pagado
Ajustes
```

Each line shows:

- Order.
- earning type.
- amount.
- condition.
- release date or reason.
- payout batch.

No opaque total without itemization.

---

## 14. Incident screen

Large actions:

- Product unavailable.
- package missing.
- package damaged.
- wrong product.
- personalization error.
- courier delay.
- delivery return.
- customer/recipient concern.
- account/security problem.
- unsafe situation.
- other.

Incident form should minimize typing.

---

## 15. Capacity and availability

Partner can set:

- Open/closed.
- pause all.
- daily capacity.
- preparation capacity.
- package capacity.
- MPHORA capacity.
- temporary restriction.
- return time.

Active orders remain visible and assigned.

---

## 16. Team management

Partner admin only:

- Invite user.
- assign role.
- revoke.
- require MFA.
- review recent activity.
- restrict payout access.
- view training status.

No shared generic staff account.

---

## 17. Installation and activation

Partner activation flow:

```text
Open invitation
→ authenticate
→ enroll MFA
→ install MPHO Aliados
→ enable notifications
→ allow camera when needed
→ complete guided tour
→ perform test order
→ activation confirmation
```

Installation status should be visible to onboarding operations when technically available.

---

## 18. Notifications

Urgent:

- New offer.
- offer expiring.
- package arrived.
- preparation deadline.
- courier waiting.
- incident response.

Non-urgent:

- payout statement.
- training.
- catalog update.

Every urgent notification deep-links to the correct task.

---

## 19. Offline rules

May remain visible offline:

- App shell.
- non-sensitive training.
- previously loaded task titles with minimal data when policy allows.
- camera draft queue under strict protection.

Must require network:

- Offer acceptance.
- stock confirmation.
- package receipt finalization.
- ready state.
- courier handoff.
- payout-account change.
- incident submission when safety does not allow delay.

Provide phone fallback for urgent safety incident.

---

## 20. Partner visual language

- Dark operational surface.
- lime for primary action.
- amber for deadline.
- red for blocking incident.
- green for server-confirmed completion.
- cyan for scanning or system information.
- large touch targets.
- strong contrast.
- minimal decoration.
- no marketing carousel.

---

## 21. Acceptance criteria

- Partner sees highest-priority work immediately.
- Earnings are visible before accepting.
- Every state action is server-confirmed.
- Camera flow works on target phones.
- Partner cannot access another partner.
- No customer marketing data appears.
- Critical tasks are usable with one hand.
