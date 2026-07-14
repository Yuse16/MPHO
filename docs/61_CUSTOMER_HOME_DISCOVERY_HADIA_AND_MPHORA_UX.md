# 61_CUSTOMER_HOME_DISCOVERY_HADIA_AND_MPHORA_UX.md

## 1. Purpose

This document defines the visual and interaction requirements for the customer home page, discovery, HADIA, and MPHORA.

The experience should feel:

- Premium.
- emotionally intelligent.
- fast.
- trustworthy.
- local without exposing partner storefronts.
- visually strong without becoming visually noisy.

---

## 2. Home page objective

The first screen must answer:

```text
What is MPHO?
Why should I use it?
Can it deliver where I need?
What should I do next?
```

The primary answer:

> MPHO helps you find, personalize, and deliver the right gift through one coordinated experience.

---

## 3. Hero layout

### Desktop

Recommended split:

```text
Left: message, location, CTAs
Right: premium gift composition and live HADIA cue
```

### Mobile

Recommended order:

```text
location
headline
supporting copy
primary CTA
secondary CTA
gift visual
trust strip
```

The hero must not consume so much height that no action is visible.

---

## 4. Hero copy direction

Recommended structure:

### Eyebrow

> Regalos preparados y entregados por MPHO en Saltillo

### Headline

> El regalo correcto, sin perder horas buscándolo.

Alternative:

> Sorprende mejor. MPHO se encarga de coordinarlo.

### Supporting text

> HADIA encuentra opciones según la persona, la ocasión, tu presupuesto y el tiempo disponible.

### Primary CTA

> Encontrar mi regalo

### Secondary CTA

> Explorar regalos

---

## 5. Hero visual

The visual may include:

- Premium box.
- flowers.
- chocolates.
- card.
- balloons.
- personalization.
- controlled dark background.
- lime, cyan, and amber highlights.
- realistic materials.
- subtle depth.

It should not include:

- Identifiable partner storefront.
- unapproved real brand.
- fake store rating.
- exact product that does not exist.
- excessive neon.
- cluttered floating UI.
- misleading delivery promise.

---

## 6. Location and coverage

Location selector appears above or near the hero CTA.

Example:

```text
Entregar en: Saltillo, Coahuila
Cambiar ubicación
```

Coverage check should ask:

- Postal code.
- neighborhood.
- map selection.
- date when needed.

Do not ask for full recipient address before it is necessary.

---

## 7. HADIA home entry

The home page should include a structured intelligent prompt:

> ¿Para quién buscas un regalo?

Quick options:

```text
Pareja
Mamá
Papá
Amistad
Compañero
Niño o niña
Otra persona
```

Second prompt:

> Cuéntame qué quieres lograr.

Example placeholder:

> Busco algo para mi esposa por nuestro aniversario. Tengo $1,000 y lo necesito hoy.

Primary action:

> Pedir ayuda a HADIA

---

## 8. HADIA conversation layout

### Mobile

- Full-height app route.
- sticky input.
- progress context.
- quick chips.
- recommendation cards.
- cart preview.
- human support action.

### Desktop

- Conversation on left or center.
- recommendation panel on right.
- persistent constraints summary.
- cart access.

HADIA should not look like a generic support chat.

---

## 9. HADIA question behavior

Ask only information that changes recommendations.

Preferred sequence:

```text
recipient
occasion
emotion/intention
budget
date
delivery zone
preferences
personalization
```

HADIA should:

- Reuse already known data.
- allow skipping.
- show why a question matters.
- avoid asking full address early.
- avoid long interrogations.
- offer recommendations after enough information exists.
- ask one focused question at a time.

---

## 10. Recommendation card

Each recommendation should show:

- Product image.
- name.
- price.
- reason.
- delivery type.
- estimated timing.
- personalization.
- availability confidence.
- primary action.
- alternative.

Example reason:

> Entra en tu presupuesto, puede llevar tarjeta personalizada y está disponible para entrega hoy en Saltillo.

Do not mention the assigned partner.

---

## 11. Recommendation confidence

Possible labels:

```text
Disponible
Requiere confirmación
Por pedido
MPHORA disponible
```

Avoid:

- Guaranteed unless truly guaranteed.
- almost sold out without evidence.
- only one left without real inventory.
- best choice without rationale.

---

## 12. MPHORA home section

Headline:

> Lo necesitas hoy

Supporting text:

> Opciones que nuestra red puede preparar y entregar con mayor rapidez en tu zona.

Cards should show:

- Product.
- total price.
- live eligibility.
- preparation estimate.
- delivery window.
- personalization constraints.
- expiration countdown only when tied to a real quote.

CTA:

> Ver regalos MPHORA

---

## 13. MPHORA eligibility UX

Eligibility should use:

```text
product
variant
stock freshness
partner capability
partner capacity
zone
cutoff
courier availability
personalization duration
quote expiration
```

Customer interface states:

### Eligible

> Disponible con MPHORA. Entrega estimada entre 6:00 y 7:00 p. m.

### Needs address

> Confirma la zona para validar MPHORA.

### Expired

> La disponibilidad rápida cambió. Estamos actualizando las opciones.

### Unavailable

> MPHORA no está disponible para esta opción, pero puedes programar la entrega.

---

## 14. Occasion section

Recommended cards:

```text
Cumpleaños
Aniversario
Gracias
Graduación
Amor
Recuperación
Nacimiento
Sorpresa sin ocasión
```

Cards use emotion and gift imagery.

Do not use partner imagery or partner names.

---

## 15. Category section

Potential categories:

- Flores y arreglos.
- Cajas de regalo.
- Chocolates y dulces.
- Personalizados.
- Globos.
- Experiencias.
- Detalles pequeños.
- Regalos por pedido.

Categories must only show enabled products.

---

## 16. Red MPHO section

Headline:

> Preparado cerca. Coordinado por MPHO.

Content:

- Map-inspired abstract visual of Saltillo.
- preparation photos without identifiable local.
- quality steps.
- delivery process.
- customer trust.

Possible metrics only after real evidence:

```text
Zonas con cobertura
Pedidos entregados
Tiempo promedio
Puntos verificados
```

Never invent launch metrics.

---

## 17. Trust section

Use four to six concise promises:

- Pago protegido.
- Precio claro.
- Preparación supervisada.
- Seguimiento.
- Atención humana.
- Políticas transparentes.

Each promise links to details.

---

## 18. Search

Search should support:

- Product name.
- occasion.
- recipient.
- intention.
- budget phrase.
- delivery timing.

No public search result should expose internal partner attributes.

---

## 19. Loading behavior

- Hero visible immediately.
- skeleton product cards.
- avoid blank screen.
- location loading has clear fallback.
- HADIA typing indicator should not fake activity for long periods.
- MPHORA eligibility shows freshness.

---

## 20. Mobile performance

Targets should prioritize:

- Compressed hero assets.
- responsive images.
- lazy-loading below fold.
- limited animation.
- no autoplay heavy video.
- no large client-side AI bundle.
- no blocking install prompt.
- fast interaction.

---

## 21. Accessibility

- Hero text readable over imagery.
- CTAs have clear names.
- chips are keyboard and screen-reader accessible.
- product images have useful alt text.
- status does not rely only on color.
- carousel has controls.
- reduced motion supported.
- HADIA announcements are not overwhelming.

---

## 22. Acceptance criteria

- Customer sees MPHO as the store and service.
- Hero communicates value immediately.
- HADIA can begin in one tap.
- MPHORA never displays stale eligibility as confirmed.
- No partner directory exists.
- All home sections work on mobile.
- Trust claims are verifiable.
