# 60_CUSTOMER_PWA_INFORMATION_ARCHITECTURE.md

## 1. Purpose

This document defines the customer PWA navigation, page hierarchy, route structure, and primary user journeys.

The customer experience must feel like one premium MPHO store and service.

---

## 2. Primary customer goals

- Find the right gift.
- Discover what can arrive in time.
- Understand total cost.
- Personalize confidently.
- Pay safely.
- Follow the order.
- Resolve a problem.
- Remember future occasions.
- Buy again.

---

## 3. Mobile navigation

Persistent bottom navigation:

```text
Inicio
Explorar
HADIA
Pedidos
Perfil
```

HADIA is visually central.

Rules:

- Maximum five primary destinations.
- Cart appears as a header action and persistent indicator.
- MPHORA appears inside Inicio and Explorar, not as a sixth bottom tab.
- Search is accessible from Inicio and Explorar.
- Support appears in Perfil and order detail.

---

## 4. Desktop navigation

```text
Logo MPHO
Regalos
Ocasiones
MPHORA
Cómo funciona
HADIA
Mis pedidos
Ubicación
Cuenta
Carrito
```

Do not add “Tiendas” or partner directory.

---

## 5. Route map

```text
/
├── /explorar
│   ├── /categoria/[slug]
│   ├── /ocasion/[slug]
│   ├── /para/[slug]
│   └── /producto/[slug]
├── /buscar
├── /hadia
├── /mphora
├── /carrito
├── /checkout
│   ├── /destinatario
│   ├── /personalizacion
│   ├── /entrega
│   ├── /resumen
│   └── /pago
├── /pedido-confirmado/[orderNumber]
├── /pedidos
│   └── /pedidos/[orderNumber]
├── /personas
├── /ocasiones-guardadas
├── /favoritos
├── /perfil
├── /direcciones
├── /notificaciones
├── /privacidad
├── /soporte
└── /legal
```

---

## 6. Home hierarchy

Recommended order:

1. Header.
2. Coverage and location.
3. Hero.
4. HADIA entry.
5. Occasion chips.
6. MPHORA.
7. Personalized or popular gifts.
8. Gift categories.
9. Red MPHO trust section.
10. How it works.
11. Customer evidence and guarantees.
12. Final CTA.
13. Footer.

---

## 7. Explore hierarchy

Filters:

- Recipient.
- occasion.
- price.
- delivery date.
- MPHORA.
- gift type.
- personalization.
- color or style where relevant.
- dietary or product constraints only when verified.

Sorting:

- Recommended.
- fastest.
- price low to high.
- price high to low.
- newest.
- popular.

No partner filter.

---

## 8. Product detail hierarchy

1. Gallery.
2. Name.
3. short emotional description.
4. price.
5. delivery eligibility.
6. product contents.
7. variants.
8. personalization.
9. add-ons.
10. recipient and date preview.
11. availability explanation.
12. preparation and quality information.
13. cancellation summary.
14. CTA.
15. similar products.

Customer-safe source label:

```text
Preparación local MPHO
Producto por pedido
Disponible con MPHORA
```

---

## 9. HADIA journey

Entry points:

- Hero.
- center navigation.
- empty search.
- product comparison.
- cart uncertainty.
- no-result state.

Conversation structure:

```text
recipient
→ occasion
→ desired emotion
→ budget
→ date
→ zone
→ preferences
→ recommendations
```

HADIA should use structured chips and cards, not only chat bubbles.

---

## 10. Cart hierarchy

Show:

- Product.
- variant.
- personalization.
- add-ons.
- delivery type.
- recipient summary.
- quote expiration.
- item price.
- service components.
- delivery.
- discount.
- total.

Do not show partner.

---

## 11. Checkout hierarchy

Recommended steps:

```text
1. Destinatario
2. Personalización
3. Entrega
4. Resumen
5. Pago
```

Mobile progress should be clear.

Never place marketing consent as a required checkout step.

---

## 12. Order detail hierarchy

1. Customer-safe current status.
2. next expected step.
3. estimated or confirmed time.
4. timeline.
5. gift summary.
6. recipient and delivery summary.
7. payment summary.
8. support.
9. cancellation or issue action when eligible.
10. receipt or invoice path.

No internal partner or courier private data.

---

## 13. Profile hierarchy

```text
Mi información
Personas importantes
Fechas y ocasiones
Direcciones
Preferencias
Favoritos
Notificaciones
Privacidad
Métodos de contacto
Ayuda
Cerrar sesión
```

Payment methods should remain provider-controlled where possible.

---

## 14. Guest checkout

MVP decision should allow a low-friction purchase where legally and technically appropriate.

Possible model:

- Email or phone verification.
- order access through secure link.
- optional account creation after payment.

Guest order access must be protected.

---

## 15. Empty states

### No products

> No encontramos una opción que cumpla todo al mismo tiempo. HADIA puede ajustar presupuesto, fecha o tipo de regalo.

### No MPHORA

> No hay opciones MPHORA disponibles para esta zona y horario. Aún puedes programar una entrega.

### No orders

> Todavía no tienes pedidos. Encuentra un regalo con HADIA.

### No saved occasions

> Guarda una fecha importante y MPHO te ayudará a prepararte con tiempo.

---

## 16. Customer-safe status language

Examples:

```text
payment_pending → Estamos confirmando tu pago
partner_assignment_pending → Estamos coordinando la preparación
partner_accepted → Tu regalo fue confirmado
stock_confirmed → Todo está listo para comenzar
external_purchase_created → El producto fue solicitado
package_in_transit → El producto va en camino a nuestro centro de preparación
package_received → El producto llegó para revisión
preparing → Tu regalo está en preparación
ready → Tu regalo está listo
courier_assigned → Estamos coordinando la entrega
out_for_delivery → Tu regalo va en camino
delivered → Entrega completada
exception → Necesitamos revisar un detalle
refund_pending → Estamos procesando tu reembolso
refunded → Reembolso confirmado
```

---

## 17. SEO and public discovery

Public indexable:

- Home.
- categories.
- occasions.
- selected product pages.
- how it works.
- legal pages.

Private and no-index:

- Cart.
- checkout.
- order tracking.
- profile.
- saved people.
- addresses.
- support cases.

---

## 18. Analytics events

Safe event examples:

```text
home_view
coverage_checked
hadia_started
hadia_recommendation_viewed
product_view
personalization_started
cart_created
checkout_started
payment_redirected
order_confirmed
order_tracking_viewed
install_prompt_shown
pwa_installed
```

Do not send recipient data or private message.

---

## 19. Acceptance criteria

The customer architecture is complete when:

- A new customer can understand MPHO in under one screen.
- A customer can find a gift through search or HADIA.
- No normal route exposes a partner identity.
- Total price and delivery timing are visible.
- Order tracking uses understandable language.
- Legal and support routes remain accessible.
- Mobile navigation needs no hidden critical action.
