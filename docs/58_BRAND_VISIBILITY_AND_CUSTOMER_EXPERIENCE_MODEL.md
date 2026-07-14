# 58_BRAND_VISIBILITY_AND_CUSTOMER_EXPERIENCE_MODEL.md

## 1. Purpose

This document defines the official customer-facing brand model for MPHO.

The central decision is:

> The customer buys, pays, tracks, requests support, and returns to MPHO.

The physical businesses that supply, receive, inspect, personalize, prepare, store, or hand off products operate as internal Puntos MPHO.

The customer experience must not become a directory of unrelated stores.

---

## 2. Official customer perception

The customer should understand:

```text
MPHO offers the catalog
MPHO provides the quote
MPHO receives or coordinates payment
MPHO confirms the order
MPHO coordinates preparation
MPHO coordinates delivery
MPHO provides tracking
MPHO provides support
MPHO manages cancellation and refund
```

The customer should not need to choose a local business before choosing a gift.

---

## 3. Internal operating reality

The internal flow may include:

```text
customer
→ MPHO
→ assigned Punto MPHO
→ supplier or external seller when applicable
→ preparation
→ courier
→ recipient
```

This internal complexity should not create customer confusion.

The application should translate internal events into MPHO language.

Example:

```text
Internal:
partner_order_task.status = preparing

Customer:
Tu regalo está en preparación.
```

---

## 4. Customer-facing terminology

Approved:

- MPHO.
- Red MPHO.
- Punto MPHO verificado.
- Centro de preparación MPHO.
- Preparación local MPHO.
- Red local de preparación y distribución.
- Preparándose cerca del destinatario.
- Control de calidad MPHO.
- Entrega coordinada por MPHO.

Avoid by default:

- Tienda vendedora.
- Vendido por [local].
- Preparado por [local].
- Visita la tienda.
- Compra directamente en el local.
- Contacta al negocio.
- Catálogo de [local].
- Dirección del aliado.
- Redes sociales del aliado.

---

## 5. Catalog model

The customer catalog is organized by:

- Occasion.
- Recipient.
- budget.
- gift type.
- mood or intention.
- delivery date.
- personalization.
- MPHORA.
- popularity.
- availability.
- city and zone.

The customer catalog is not organized by partner.

A product page may show:

```text
Ramo Amanecer
Disponible en la red MPHO de Saltillo
Preparación local MPHO
Entrega programada o MPHORA
```

It should not show the internal partner identity.

---

## 6. Home page partner section

Do not show a directory of stores.

Replace it with:

# Preparado cerca. Coordinado por MPHO.

Suggested message:

> Nuestra red local permite seleccionar, preparar, personalizar y entregar regalos desde ubicaciones estratégicas en Saltillo, siempre bajo la experiencia y seguimiento de MPHO.

Possible trust indicators:

- Preparación local.
- Puntos verificados.
- Control de calidad.
- Seguimiento centralizado.
- Entrega programada.
- Opciones MPHORA.

Photography may show:

- Hands wrapping.
- boxes.
- flowers.
- printing.
- workstations.
- sealed gifts.
- courier handoff.

Photography should avoid identifiable storefronts, logos, signs, phone numbers, or staff uniforms belonging to a partner unless a specific collaboration is approved.

---

## 7. Partner identity confidentiality

Customer-facing systems must not expose partner identity through:

- Product URLs.
- image filenames.
- image EXIF.
- API responses.
- order metadata.
- tracking pages.
- notification text.
- support macros.
- QR codes.
- delivery labels.
- browser source.
- analytics properties.
- public storage paths.
- receipt descriptions unless legally required.

Internal partner IDs must remain internal.

---

## 8. Minimum necessary disclosure

Partner identity may be disclosed only when:

- Required by law.
- Required for invoicing.
- Required for warranty.
- Required for an authorized customer pickup.
- Required for a product recall.
- Required by a public authority.
- Required to protect customer safety.
- Explicitly approved as a branded collaboration.

Such disclosure must be deliberate and documented.

---

## 9. Branded collaborations

An exception may be created for:

```text
MPHO × Approved Brand
Official collection
Exclusive collaboration
Featured local creator
```

Requirements:

- Written agreement.
- approved trademark use.
- customer-facing value.
- price and responsibility clarity.
- defined data sharing.
- defined duration.
- approved landing page.
- approved packaging.

This is an exception, not the standard marketplace model.

---

## 10. Packaging model

Default packaging should use MPHO identity.

Recommended:

- MPHO seal.
- MPHO card.
- MPHO QR.
- neutral or MPHO delivery label.
- order reference.
- recipient-safe information.
- no partner flyer.
- no partner coupon.
- no partner phone.
- no partner social handle.
- no direct-sales message.

A product manufacturer's lawful packaging may remain visible when required.

---

## 11. Customer communication model

Incorrect:

> La tienda todavía no termina tu pedido.

Correct:

> Tu regalo continúa en preparación. Estamos dando seguimiento para cumplir la ventana acordada.

Incorrect:

> El local no tiene existencias.

Correct:

> La opción seleccionada dejó de estar disponible en nuestra red. Te mostraremos alternativas o podrás solicitar la cancelación correspondiente.

Incorrect:

> Habla con la florería.

Correct:

> MPHO está revisando tu caso con el centro responsable de preparación.

---

## 12. Data separation

A partner receives only what is required to complete the assigned task.

The customer does not receive:

- Partner private contact.
- partner payout data.
- partner staff data.
- internal performance.
- internal incident history.
- internal stock across other orders.

The partner does not receive:

- Customer full history.
- unrelated recipients.
- payment instrument.
- marketing profile.
- customer analytics.
- other partner information.

---

## 13. Non-circumvention controls

Technical:

- Protected communication.
- no partner contact on customer view.
- no customer export.
- no public partner storefront.
- no partner marketing field.
- no partner link in order.
- image review.
- packaging checklist.
- audit of customer-data access.

Contractual:

- No direct payment request.
- no partner advertising inside package.
- no use of recipient data for marketing.
- no copying customer list.
- no invitation to purchase outside MPHO.
- no retention beyond authorized purpose.
- no unofficial post-order contact.

Operational:

- Random package review.
- customer report option.
- partner training.
- incident category for circumvention.
- progressive enforcement.

---

## 14. Legal alignment

This customer-facing model requires the legal, tax, payment, invoice, and partner-contract structure to support MPHO as the principal customer-facing brand.

OpenCode must not hide legally required seller or invoice information.

The legal implementation must follow:

- `39_LEGAL_AND_REGULATORY_REQUIREMENTS.md`
- `40_CUSTOMER_TERMS_AND_CONDITIONS.md`
- `43_PARTNER_AGREEMENT_REQUIREMENTS.md`

---

## 15. Product requirements

- Remove partner storefronts from customer navigation.
- Remove partner filters.
- Remove partner profile pages from customer app.
- Remove public partner contact fields.
- Add Red MPHO explanation.
- Add customer-safe order language.
- Add internal-to-public status mapper.
- Add branded-collaboration exception flag.
- Add legal-disclosure override.
- Add partner-identity leak tests.
- Add image metadata sanitation.
- Add packaging quality checklist.

---

## 16. Acceptance criteria

```text
Given a normal MPHO order
When the customer browses, pays, tracks, receives notifications, or requests support
Then MPHO remains the visible commercial and service identity
And the assigned Punto MPHO is not exposed
Unless an approved legal or commercial disclosure rule applies
```
