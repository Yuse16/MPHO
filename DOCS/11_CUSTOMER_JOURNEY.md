# 11_CUSTOMER_JOURNEY.md

## 1. Purpose

This document defines the end-to-end customer journey in MPHO.

It explains:

- How a customer enters the platform.
- How the customer discovers a gift.
- How the customer selects delivery and personalization.
- How payment works from the customer's perspective.
- How tracking and exceptions are communicated.
- How the journey changes for local, MPHORA, and by-order products.
- Which moments require clarity, consent, or human support.

---

## 2. Customer objective

The customer's job is:

> Help me send an appropriate gift to someone, on time, without making me coordinate every operational step.

The customer journey must reduce:

- Uncertainty.
- Search effort.
- Repetitive messaging.
- Delivery coordination.
- Fear of missing the date.
- Confusion about final price.
- Confusion about responsibility.

---

## 3. Main entry points

A customer may enter through:

- MPHO home page.
- Social-media ad.
- Search engine.
- Click-to-WhatsApp campaign.
- Partner referral.
- Shared product link.
- Shared HADIA link.
- Shared MPHORA link.
- Reminder notification.
- Repeat-order link.
- Corporate campaign in future phases.

Every entry point should preserve relevant context when possible.

Examples:

- Occasion.
- City.
- Product.
- Partner.
- Campaign.
- Delivery urgency.

---

## 4. Journey overview

```text
discover MPHO
→ choose direct search or HADIA
→ define recipient and occasion
→ define budget, zone, and date
→ view eligible products
→ review product details
→ personalize
→ provide delivery information
→ review price and timing
→ sign in or create account
→ pay
→ track
→ receive delivery confirmation
→ rate and save occasion
```

---

## 5. Stage 1: Arrival

### Customer questions

- What is MPHO?
- Can it deliver where I need?
- Can it arrive on time?
- Is it trustworthy?
- How much will it cost?
- Can I send a surprise?
- Can I use a product from another provider?

### Required experience

The landing experience should explain:

- MPHO coordinates the complete gift.
- Local and by-order products are different.
- MPHORA is available only in eligible zones.
- The customer can use HADIA or browse directly.
- Delivery timing is validated before payment.

### Primary actions

- Encontrar un regalo.
- Preguntarle a HADIA.
- Ver MPHORA.
- Explorar categorías.
- Consultar zona de entrega.

---

## 6. Stage 2: Gift intent

The customer should provide enough context to reduce irrelevant results.

Possible inputs:

- Recipient relationship.
- Occasion.
- Budget.
- Delivery city and zone.
- Required date.
- Delivery urgency.
- Recipient preferences.
- Preferred style.
- Product restrictions.
- Surprise preference.

The system should not ask for all information at once unless a form is clearly easier.

---

## 7. Stage 3: HADIA flow

HADIA may guide the customer through:

```text
Who is it for?
→ What is the occasion?
→ What is your budget?
→ Where should it be delivered?
→ When should it arrive?
→ What does the recipient like?
→ Do you need a fast option?
```

HADIA should then:

- Search real catalog data.
- Exclude unavailable items.
- Respect budget.
- Explain recommendation reasons.
- Distinguish local, MPHORA, and by-order.
- Offer a small number of useful options.
- Allow refinement.

### HADIA failure behavior

If data is insufficient:

> Para mostrarte opciones reales necesito la zona y la fecha de entrega.

If no matching option exists:

> No encontré una opción que cumpla todo. Puedo mostrarte alternativas con otro presupuesto, otra fecha o entrega por encargo.

HADIA must not invent.

---

## 8. Stage 4: Browse and compare

The customer should be able to compare products by:

- Price.
- Occasion.
- Recipient.
- Delivery type.
- Delivery estimate.
- Partner area.
- Preparation time.
- Personalization.
- Rating when available.

Product cards should clearly identify:

- Local.
- MPHORA.
- Por encargo.
- Unavailable.
- Last units only when real.
- Estimated timing.

---

## 9. Stage 5: Product detail

The product page should show:

- Name.
- Images.
- What is included.
- Size or quantity.
- Variants.
- Personalization.
- Source type.
- Preparation time.
- Delivery estimate.
- Zone restrictions.
- Substitution policy.
- Cancellation notes.
- Price breakdown or expected additional fees.
- Partner identity only when product strategy allows.
- External-product disclosure when applicable.

### Local product message

> Disponible a través de un aliado local.

### MPHORA message

> Elegible para entrega rápida en esta zona, sujeto a confirmación operativa.

### By-order message

> Este producto debe llegar primero al Punto MPHO antes de prepararse y enviarse.

---

## 10. Stage 6: Personalization

Possible choices:

- Wrapping style.
- Box.
- Ribbon.
- Color.
- Greeting card.
- Handwritten message.
- QR audio.
- QR video.
- Name.
- Add-on.
- Delivery surprise mode.

The customer must preview or confirm:

- Final text.
- Recipient name.
- Spelling.
- Selected design.
- Uploaded content.
- Additional cost.

### Irreversible work warning

Before personalized preparation begins:

> Revisa cuidadosamente el texto. Una vez iniciada la personalización, puede no ser posible cancelar o modificar sin costo.

---

## 11. Stage 7: Recipient and delivery

Required data may include:

- Recipient name.
- Recipient phone when required.
- Street.
- Number.
- Neighborhood.
- Postal code.
- City.
- References.
- Delivery instructions.
- Preferred delivery window.
- Surprise mode.
- Customer contact.

### Surprise modes

#### Full surprise

Do not contact recipient unless delivery fails.

#### Coordinated surprise

Contact recipient only to confirm availability without revealing gift details.

#### Scheduled delivery

Recipient may know a delivery is expected.

The chosen mode must be communicated to partner and courier.

---

## 12. Stage 8: Availability and quote validation

Before payment, MPHO should validate:

- Product source.
- Stock or by-order status.
- Partner eligibility.
- Zone.
- Preparation time.
- Delivery option.
- Quote validity.
- Personalization compatibility.
- Cutoff time.
- MPHORA eligibility.
- External price when applicable.

If validation fails, the customer must receive a clear alternative.

Examples:

- Change delivery date.
- Change partner zone.
- Choose another product.
- Remove unavailable personalization.
- Switch from MPHORA to scheduled delivery.
- Revalidate external price.

---

## 13. Stage 9: Pricing review

The customer should see:

- Product subtotal.
- Add-ons.
- Preparation or wrapping.
- Personalization.
- Delivery.
- MPHO service.
- Discount.
- Final total.
- Currency.
- Estimated delivery date or window.

The customer must not encounter unexplained charges after payment.

---

## 14. Stage 10: Account and authentication

The customer may browse before signing in.

Before payment or order confirmation, MPHO should collect:

- Name.
- Email or phone.
- Authentication.
- Required consent.
- Contact preference.

The flow should avoid losing the cart during account creation.

---

## 15. Stage 11: Payment

Customer-visible payment states:

```text
Esperando pago
Pago en revisión
Pago aprobado
Pago rechazado
Pago cancelado
Reembolso en proceso
Reembolso completado
```

After payment approval, the customer should receive:

- Order number.
- Summary.
- Delivery destination.
- Estimated timing.
- Next step.
- Tracking access.
- Support access.

Do not show an order as confirmed before verified payment unless an approved payment mode allows it.

---

## 16. Stage 12: Post-payment confirmation

Preferred message:

> Tu pago fue aprobado. Ahora asignaremos el Punto MPHO responsable de preparar tu regalo.

The customer should know:

- Payment is complete.
- Order is created.
- Partner assignment may still be pending.
- Timing remains based on the validated quote.
- The next notification will identify progress.

---

## 17. Stage 13: Partner assignment

Customer-facing state:

> Estamos asignando el aliado que preparará tu regalo.

If accepted:

> El Punto MPHO ya aceptó tu pedido.

If delayed:

> Aún estamos confirmando quién preparará tu pedido. No necesitas hacer nada por ahora.

If no partner accepts:

- Create an exception.
- Offer alternatives.
- Preserve customer payment safely.
- Allow cancellation or reassignment according to policy.

---

## 18. Stage 14A: Local-product tracking

Possible customer states:

```text
Pago aprobado
→ aliado asignado
→ producto confirmado
→ preparando regalo
→ regalo listo
→ repartidor asignado
→ en camino
→ entregado
```

Each status should explain:

- What has happened.
- What comes next.
- Whether customer action is needed.

---

## 19. Stage 14B: External-product tracking

Possible customer states:

```text
Pago aprobado
→ compra externa en preparación
→ producto comprado
→ producto en camino al Punto MPHO
→ producto recibido
→ producto revisado
→ preparando regalo
→ regalo listo
→ en camino
→ entregado
```

The customer should not need to interpret raw marketplace tracking.

MPHO should summarize operational meaning.

---

## 20. Stage 14C: MPHORA tracking

Possible customer states:

```text
Pago aprobado
→ aliado aceptó
→ preparación inmediata
→ listo para recoger
→ repartidor asignado
→ en camino
→ entregado
```

MPHORA communication should be faster and more frequent when timing is short.

---

## 21. Stage 15: Preparation evidence

The customer may see:

- A completed-gift photo.
- A message confirming preparation.
- A limited preview if surprise rules allow it.

Evidence visibility may depend on:

- Privacy.
- Surprise mode.
- Partner policy.
- Product type.
- Customer preference.

Do not expose internal workspace photos unnecessarily.

---

## 22. Stage 16: Courier assignment

Customer-facing information may include:

- Delivery provider.
- Estimated pickup.
- Estimated delivery window.
- Tracking link.
- Courier first name or identifier when appropriate.
- Contact limitations.

Avoid exposing excessive courier personal information.

---

## 23. Stage 17: Delivery

Customer-facing states:

- Repartidor asignado.
- Recogiendo tu regalo.
- En camino.
- Intento de entrega.
- Entregado.
- Problema con la entrega.

When delivered, show:

- Delivery time.
- Proof or confirmation.
- Recipient confirmation when available.
- Support action.
- Rating action.

---

## 24. Stage 18: Failed delivery

The customer should receive:

- Clear reason category.
- Current location of the gift.
- Next available actions.
- Additional cost if applicable.
- Response deadline.
- Support access.

Possible actions:

- Correct address.
- Contact recipient.
- Schedule another attempt.
- Approve return to partner.
- Cancel where eligible.

---

## 25. Stage 19: Cancellation

The cancellation flow should explain:

- Current order stage.
- What work has already occurred.
- Refund eligibility.
- Non-refundable costs.
- Estimated refund timing.
- Whether an external product can be returned.

The customer should confirm cancellation before it becomes final.

---

## 26. Stage 20: Refund

Customer-facing refund information:

- Refund amount.
- Refund reason.
- Refund method.
- Initiation date.
- Provider status.
- Estimated processing time.
- Completion confirmation.

Do not mark a refund completed until provider confirmation exists.

---

## 27. Stage 21: Completion

After successful delivery:

- Mark order delivered.
- Complete financial processing.
- Show proof.
- Invite rating.
- Invite feedback.
- Offer save-date action.
- Offer reorder.
- Offer share link when appropriate.

Preferred message:

> Tu regalo fue entregado. Gracias por confiar en MPHO.

---

## 28. Stage 22: Rating and feedback

The customer may rate:

- Gift quality.
- Preparation.
- Delivery.
- Overall experience.

The customer should not be required to identify which internal actor caused an issue.

MPHO can map feedback to:

- Partner.
- Courier.
- Catalog.
- Platform.
- Product.

---

## 29. Stage 23: Repeat and reminders

Future journey:

```text
order completed
→ customer saves occasion
→ reminder before next date
→ HADIA suggests new options
→ address and recipient are prefilled with consent
→ customer confirms and pays
```

Saved data must follow privacy rules.

---

## 30. Customer support handoff

Human support should be available when:

- Payment is disputed.
- Product is damaged.
- Partner cannot fulfill.
- External shipment is late.
- Personalization is incorrect.
- Delivery fails.
- Refund is delayed.
- HADIA cannot resolve the request.
- The order is high risk.

Support must see complete order context.

The customer should not have to repeat all information.

---

## 31. Notification channels

Possible channels:

- In-app.
- Email.
- WhatsApp.
- Push notification.
- SMS in future.

The customer should control marketing preferences separately from transactional notifications.

---

## 32. Customer communication rules

Every message should answer:

1. What happened?
2. What happens next?
3. Does the customer need to act?
4. Is timing affected?
5. How can the customer get help?

Avoid vague messages such as:

- Procesando.
- En curso.
- Estamos trabajando.

Use specific messages.

---

## 33. Empty states

Examples:

### No products

> No encontramos opciones que cumplan esta fecha y zona. Prueba otra fecha, cambia el presupuesto o consulta productos por encargo.

### No MPHORA

> No hay opciones MPHORA disponibles en este momento. Puedes elegir entrega programada.

### No order history

> Cuando envíes tu primer regalo, podrás darle seguimiento desde aquí.

---

## 34. Error recovery

The customer journey must handle:

- Payment retry.
- Expired quote.
- Lost connection.
- Invalid address.
- Product unavailable.
- Partner rejection.
- Failed upload.
- Session expiration.
- Duplicate payment callback.
- Delivery-provider error.

The system should preserve progress whenever safe.

---

## 35. Accessibility

Customer experience should include:

- Clear text.
- Large touch targets.
- Visible labels.
- Keyboard support.
- Screen-reader support.
- Sufficient contrast.
- Non-color-only status indicators.
- Understandable error messages.
- Mobile-first design.

---

## 36. Customer-journey success criteria

The journey succeeds when the customer:

- Understands the product.
- Understands availability.
- Understands timing.
- Understands price.
- Completes payment.
- Receives relevant updates.
- Knows when action is required.
- Receives delivery confirmation.
- Can resolve problems without confusion.

---

## 37. Summary

The customer should experience MPHO as one coordinated service.

The complexity of partners, external providers, and couriers should remain behind a clear, truthful, and understandable journey.

HADIA helps the customer choose.

MPHORA helps the customer identify fast options.

MPHO coordinates everything after payment.
